<script lang="ts" setup>
import {formatDate} from '@/utils/formatTime'
import {getCurrentInstance, watch} from 'vue'

const {proxy}: any = getCurrentInstance()
import {ElNotification} from 'element-plus'
import {useNoticeMsgStore} from '@/store/modules/noticeMsg' 

defineOptions({name: 'Message'})

const {push} = useRouter()
const activeName = ref('notice')
const noticeMsgStore = useNoticeMsgStore();

const list = computed(() => noticeMsgStore.data)
const total = computed(() => noticeMsgStore.total)

const intervalId = ref(null);

// 获得消息列表
const getList = async () => {
  var res = await proxy.$mdp.listNotifyMsg({
    hadRead: '0',
    pageSize: 20,
    pageNum: 1,
    count: false,
    $orderBy: 'oper_time desc'
  })
  noticeMsgStore.setNoticeMsg(res)
}
const goToMsgCenter = () => {
  push({name: 'MyNotifyMessage'});
}
const goToPage = (item, index) => {
  if (item.hadRead != '1') {
    proxy.$mdp.editSomeFieldsNotifyMsg({$pks: [item.id], hadRead: '1'}).then(() => {
      item.hadRead = "1"
      noticeMsgStore.setTotal(total.value - 1)
    })
  }
  if (item.url) proxy.$mdp.openWin(item.url)
}

watch(total, (count, old) => {
  if (old > count) {
    return;
  }
  if (count > 1) {
    ElNotification({
      title: '未读消息',
      message: '有' + count + '条未读消息待处理',
      showClose: true,
      position: 'bottom-right',
      onClick: function () {
        goToMsgCenter();
      }
    })
  } else if (count == 1) {
    var msgObj = list[0]
    ElNotification({
      title: '未读消息',
      message: msgObj?.msg ? msgObj.msg : '',
      showClose: true,
      position: 'bottom-right',
      onClick: function () {
        goToPage(msgObj, 0);
      }
    })
  }
})

onUnmounted(()=>{
  if (intervalId.value) {
    clearInterval(intervalId.value);
  }
})

// ========== 初始化 =========
onMounted(() => {
  // 首次加载小红点
  getList()
  // 轮询刷新小红点
  intervalId.value = setInterval(
    () => {
      getList()
    },
    1000 * 60 * 2
  )
})
</script>
<template>
  <div class="message">
    <ElPopover :width="400" placement="bottom" trigger="click">
      <template #reference>
        <ElBadge class="item" :value="total">
          <Icon :size="18" class="cursor-pointer" icon="ep:bell" @click="getList"/>
        </ElBadge>
      </template>
      <ElTabs v-model="activeName">
        <ElTabPane label="我的站内信" name="notice">
          <el-scrollbar class="message-list">
            <template v-for="(item,idx) in list" :key="item.id">
              <div class="message-item" @click="goToPage(item,idx)">
                <img alt="" class="message-icon" src="@/assets/imgs/avatar.gif"/>
                <div class="message-content">
                  <span class="message-title">
                    {{ item.toUsername }}：{{ item.msg }}
                  </span>
                  <span class="message-date">
                    <mdp-select
v-model="item.hadRead" show-style="tag" :disabled="true"
                                :options="[{id:'0',name:'未读'},{id:'1',name:'已读'}]"/>{{
                      item.sendUsername
                    }} {{ formatDate(item.operTime) }}
                  </span>
                </div>
              </div>
            </template>
          </el-scrollbar>
        </ElTabPane>
      </ElTabs>
      <!-- 更多 -->
      <div style="margin-top: 10px; text-align: right">
        <XButton preIcon="ep:view" title="查看全部" type="primary" @click="goToMsgCenter"/>
      </div>
    </ElPopover>
  </div>
</template>
<style lang="scss" scoped>
.message-empty {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 260px;
  line-height: 45px;
}

.message-list {
  display: flex;
  height: 400px;
  flex-direction: column;

  .message-item {
    display: flex;
    align-items: center;
    padding: 20px 0;
    border-bottom: 1px solid var(--el-border-color-light);

    &:last-child {
      border: none;
    }

    .message-icon {
      width: 40px;
      height: 40px;
      margin: 0 20px 0 5px;
    }

    .message-content {
      display: flex;
      flex-direction: column;

      .message-title {
        margin-bottom: 5px;
      }

      .message-date {
        font-size: 12px;
        color: var(--el-text-color-secondary);
      }
    }
  }
}
</style>
