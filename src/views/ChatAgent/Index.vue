<template>
  <div class="chat-container">
    <div class="chat-header">
      <h2>智能对话助手</h2>
    </div>
    
    <div class="chat-messages" ref="messagesContainer">
      <div v-for="(message, index) in messages" :key="index" :class="['message', message.type]">
        <div class="avatar" v-if="message.type === 'bot'">
          <el-icon><Avatar /></el-icon>
        </div>
        <div class="avatar user-avatar" v-else>
          <el-icon><User /></el-icon>
        </div>
        <div class="message-content">
          <div class="message-bubble">
            <div v-if="message.type === 'bot' && message.loading" class="typing-indicator">
              <span></span>
              <span></span>
              <span></span>
            </div>
            <div v-else v-html="message.content"></div>
          </div>
          <div class="message-time">{{ message.time }}</div>
        </div>
      </div>
    </div>
    
    <div class="chat-input">
      <el-input
        v-model="userInput"
        type="textarea"
        :rows="2"
        placeholder="请输入您的问题..."
        resize="none"
        @keydown.enter.prevent="sendMessage"
        :disabled="isLoading"
      />
      <el-button type="primary" :disabled="!userInput.trim() || isLoading" @click="sendMessage">
        <el-icon><Position /></el-icon>
        {{ isLoading ? '发送中...' : '发送' }}
      </el-button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, nextTick, watch, onUnmounted } from 'vue'
import { Avatar, User, Position } from '@element-plus/icons-vue'
import { ElMessage } from 'element-plus'

interface Message {
  content: string
  type: 'user' | 'bot'
  time: string
  loading?: boolean
}

interface SSEData {
  type: "done" | "exception" | string
  content: string
  user_id: string
  conversation_id: string
  timestamp: string
}

const userInput = ref('')
const messages = ref<Message[]>([
  {
    content: '你好！我是项目管理助手，有什么可以帮到您的吗？',
    type: 'bot',
    time: formatTime(new Date())
  }
])
const messagesContainer = ref<HTMLElement | null>(null)
const isLoading = ref(false)
const abortController = ref<AbortController | null>(null)

// 打字机效果相关变量
const fullResponse = ref('') // 完整的响应文本
const displayedResponse = ref('') // 当前显示的文本
const typingSpeed = 30 // 打字速度(ms)
let typingTimer: number | null = null

// 获取格式化的时间
function formatTime(date: Date): string {
  const hours = date.getHours().toString().padStart(2, '0')
  const minutes = date.getMinutes().toString().padStart(2, '0')
  return `${hours}:${minutes}`
}

// 打字机效果函数
function typeNextChar(botMessageIndex: number) {
  if (displayedResponse.value.length < fullResponse.value.length) {
    // 每次添加一个字符
    displayedResponse.value = fullResponse.value.substring(0, displayedResponse.value.length + 1)
    
    // 更新消息内容
    messages.value[botMessageIndex] = {
      content: displayedResponse.value,
      type: 'bot',
      time: formatTime(new Date())
    }
    
    // 继续下一个字符
    typingTimer = window.setTimeout(() => typeNextChar(botMessageIndex), typingSpeed)
    
    // 滚动到底部
    nextTick(() => {
      scrollToBottom()
    })
  }
}

// 发送消息
async function sendMessage() {
  const trimmedInput = userInput.value.trim()
  if (!trimmedInput || isLoading.value) return

  try {
    isLoading.value = true
    
    // 添加用户消息
    messages.value.push({
      content: trimmedInput,
      type: 'user',
      time: formatTime(new Date())
    })

    // 清空输入框
    userInput.value = ''

    // 滚动到底部
    await nextTick()
    scrollToBottom()

    // 显示机器人正在输入的状态
    const botMessageIndex = messages.value.length
    messages.value.push({
      content: '',
      type: 'bot',
      time: formatTime(new Date()),
      loading: true
    })

    // 重置打字机效果变量
    fullResponse.value = ''
    displayedResponse.value = ''
    
    // 清除之前的定时器
    if (typingTimer !== null) {
      clearTimeout(typingTimer)
      typingTimer = null
    }

    // 创建新的 AbortController
    abortController.value = new AbortController()

    // 使用 EventSource 处理 SSE
    const eventSource = new EventSource(`http://localhost:8000/api/chat/stream?query=${encodeURIComponent(trimmedInput)}`)
    
    // 移除加载状态
    messages.value[botMessageIndex].loading = false

    // 监听消息事件
    eventSource.onmessage = (event) => {
      try {
        const data : SSEData = JSON.parse(event.data);
        
        if (data.type === "done") {
          // 服务端发送完毕，断开连接
          console.log("服务端发送完毕");
          eventSource.close();
          isLoading.value = false;
          return;
        }
        
        if (data.type === "data") {
          // 更新完整响应
          fullResponse.value += data.content;
          
          // 如果没有正在进行的打字效果，开始新的打字效果
          if (typingTimer === null) {
            typeNextChar(botMessageIndex);
          }
          // 否则保持当前打字效果继续，会自动显示新添加的文本
        }
      } catch (error) {
        console.error('解析服务器响应失败:', error, event.data);
      }
    }

    // 监听错误事件
    eventSource.onerror = (error) => {
      console.error('SSE Error:', error)
      eventSource.close()
      ElMessage.error('与服务器通信时发生错误，请稍后重试')
      // 移除加载状态的消息
      // messages.value.pop()
      isLoading.value = false
      
      // 清除打字效果
      if (typingTimer !== null) {
        clearTimeout(typingTimer)
        typingTimer = null
      }
    }

    // 监听完成事件
    eventSource.addEventListener('complete', () => {
      eventSource.close()
      isLoading.value = false
      
      // 清除打字效果，并确保显示完整文本
      if (typingTimer !== null) {
        clearTimeout(typingTimer)
        typingTimer = null
      }
      displayedResponse.value = fullResponse.value
      messages.value[botMessageIndex].content = fullResponse.value
    })

    // 监听取消事件
    abortController.value.signal.addEventListener('abort', () => {
      eventSource.close()
      isLoading.value = false
      
      // 清除打字效果
      if (typingTimer !== null) {
        clearTimeout(typingTimer)
        typingTimer = null
      }
    })

  } catch (error: unknown) {
    if (error instanceof Error && error.name === 'AbortError') {
      console.log('请求被取消')
    } else {
      console.error('Error:', error)
      ElMessage.error('与服务器通信时发生错误，请稍后重试')
      // 移除加载状态的消息
      // messages.value.pop()
    }
    isLoading.value = false
    
    // 清除打字效果
    if (typingTimer !== null) {
      clearTimeout(typingTimer)
      typingTimer = null
    }
  }
}

// 滚动到底部
function scrollToBottom() {
  if (messagesContainer.value) {
    messagesContainer.value.scrollTop = messagesContainer.value.scrollHeight
  }
}

// 组件销毁时清除定时器
onUnmounted(() => {
  if (typingTimer !== null) {
    clearTimeout(typingTimer)
    typingTimer = null
  }
})

// 监听消息变化，自动滚动
watch(
  () => messages.value.length,
  () => {
    nextTick(() => {
      scrollToBottom()
    })
  }
)

onMounted(() => {
  scrollToBottom()
})
</script>

<style scoped>
.chat-container {
  display: flex;
  flex-direction: column;
  height: calc(100vh - 120px);
  background-color: var(--el-bg-color);
  border-radius: 8px;
  box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1);
  overflow: hidden;
}

.chat-header {
  padding: 15px 20px;
  background-color: var(--el-color-primary-light-8);
  border-bottom: 1px solid var(--el-border-color-light);
}

.chat-header h2 {
  margin: 0;
  color: var(--el-text-color-primary);
  font-size: 18px;
}

.chat-messages {
  flex: 1;
  padding: 20px;
  overflow-y: auto;
}

.message {
  display: flex;
  margin-bottom: 20px;
  align-items: flex-start;
}

.message.user {
  flex-direction: row-reverse;
}

.avatar {
  width: 40px;
  height: 40px;
  border-radius: 50%;
  background-color: var(--el-color-primary);
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  font-size: 20px;
  margin-right: 10px;
}

.user-avatar {
  background-color: var(--el-color-success);
  margin-right: 0;
  margin-left: 10px;
}

.message-content {
  max-width: 70%;
}

.user .message-content {
  display: flex;
  flex-direction: column;
  align-items: flex-end;
}

.message-bubble {
  padding: 12px 16px;
  border-radius: 10px;
  background-color: var(--el-color-primary-light-9);
  color: var(--el-text-color-primary);
  word-break: break-word;
}

.user .message-bubble {
  background-color: var(--el-color-success-light-9);
}

.message-time {
  font-size: 12px;
  color: var(--el-text-color-secondary);
  margin-top: 5px;
}

.chat-input {
  padding: 15px;
  display: flex;
  background-color: var(--el-bg-color);
  border-top: 1px solid var(--el-border-color-light);
}

.chat-input .el-input {
  margin-right: 10px;
}

.chat-input .el-button {
  flex-shrink: 0;
  height: auto;
}

/* Typing indicator */
.typing-indicator {
  display: flex;
  align-items: center;
}

.typing-indicator span {
  height: 8px;
  width: 8px;
  background-color: var(--el-color-primary);
  border-radius: 50%;
  display: inline-block;
  margin: 0 2px;
  opacity: 0.6;
  animation: typing 1.4s infinite both;
}

.typing-indicator span:nth-child(2) {
  animation-delay: 0.2s;
}

.typing-indicator span:nth-child(3) {
  animation-delay: 0.4s;
}

@keyframes typing {
  0% {
    transform: translateY(0);
  }
  50% {
    transform: translateY(-5px);
  }
  100% {
    transform: translateY(0);
  }
}
</style> 