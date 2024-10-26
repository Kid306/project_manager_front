<template>
  <div>
    <el-card shadow="never">
      <el-skeleton :loading="loading" animated>
        <el-row :gutter="16" justify="space-between">
          <el-col :xl="12" :lg="12" :md="12" :sm="24" :xs="24">
            <div class="flex items-center">
              <el-avatar :src="avatar" :size="70" class="mr-16px">
                <img  src="@/assets/imgs/avatar.gif" alt="" />
              </el-avatar>
              <div>
                <div class="text-20px">
                  {{ t('workplace.welcome') }} {{ username }} {{ t('workplace.happyDay') }}
                </div>
                <div class="mt-10px text-14px text-gray-500">
                  工作顺利，开心生活！
                </div>
              </div>
            </div>
          </el-col>
          <el-col :xl="12" :lg="12" :md="12" :sm="24" :xs="24">
            <div class="h-70px flex items-center justify-end lt-sm:mt-10px"> 
              <el-divider direction="vertical" />
              <div class="px-8px text-right">
                <div class="mb-16px text-14px text-gray-400">{{ t('workplace.toDo') }}</div>
                <CountTo
                  class="text-20px"
                  :start-val="0"
                  :end-val="toDoPageInfo.total"
                  :duration="2600"
                />
              </div>
              <el-divider direction="vertical" border-style="dashed" />
              <div class="px-8px text-right">
                <div class="mb-16px text-14px text-gray-400">{{ t('workplace.myFocus') }}</div>
                <CountTo
                  class="text-20px"
                  :start-val="0"
                  :end-val="focusPageInfo.total"
                  :duration="2600"
                />
              </div>
            </div>
          </el-col>
        </el-row>
      </el-skeleton>
    </el-card>
  </div>

  <el-row class="mt-8px" :gutter="8" justify="space-between">
    <el-col :xl="16" :lg="16" :md="24" :sm="24" :xs="24" class="mb-8px" >  
      <el-card  shadow="never" v-if="wfOpen==true || wfOpen=='true'"  class="mt-8px">
        <template #header>
          <div class="h-3 flex justify-between">
            我的代办
            
            <el-link type="primary" :underline="false" @click="gotolink(null,'/mdp/workflow/ru/task/me')">{{ t('action.more') }}</el-link>
          </div> 
        </template>
        <TaskListAssigneeToMe  @pageInfo="(v)=>toDoPageInfo=v">
          <template #query>

          </template>
        </TaskListAssigneeToMe> 
      </el-card>

      <el-card shadow="never" class="mt-8px">
        <template #header>
          <div class="h-3 flex justify-between">
            <span>{{ t('workplace.myFocus') }}</span> 
          </div>
        </template>
        <el-skeleton :loading="loading" animated>

          <MyFocusList @pageInfo="(v)=>focusPageInfo=v"/>
        </el-skeleton>
      </el-card>
     
    </el-col>
    <el-col :xl="8" :lg="8" :md="24" :sm="24" :xs="24" class="mb-8px">
      <el-card shadow="never"  class="mt-8px">
        <template #header>
          <div class="h-3 flex justify-between">
            <span>{{ t('workplace.shortcutOperation') }}</span>
          </div>
        </template>
        <el-skeleton :loading="loading" animated>
          <el-row>
            <el-col v-for="item in shortcut" :key="`team-${item.name}`" :span="8" class="mb-8px">
              <div class="flex items-center">
                <Icon :icon="item.icon" size="30"/>
                <el-link type="default" :underline="false" @click="gotolink(item.context,item.url)">
                  {{ item.name }}
                </el-link>
              </div>
            </el-col>
          </el-row>
        </el-skeleton>
      </el-card>
      
      <ModulesMenu class="mt-8px"/>
      <el-card shadow="never" class="mt-8px">
        <template #header>
          <div class="h-3 flex justify-between">
            <ElBadge :value="noticeMsgCount">{{ t('workplace.notice') }}</ElBadge>
            <el-link type="primary" :underline="false" @click="goToMsgCenter">{{ t('action.more') }}</el-link>
          </div>
        </template>
        <el-skeleton :loading="loading" animated>
          <div v-for="(item, index) in noticeMsgList" :key="`dynamics-${index}`">
            <div class="flex items-center"> 
              <div>
                <div class="text-14px">
                  <mdp-select
                      v-model="item.hadRead" show-style="tag" :disabled="true"
                                :options="[{id:'0',name:'未读'},{id:'1',name:'已读'}]"/>
                  <Highlight>
                    {{ item.msg }}
                  </Highlight>
                </div>
                <div class="mt-16px text-12px text-gray-400">
                  {{ item.sendUsername }} 发送于 {{ formatTime(item.operTime, 'yyyy-MM-dd') }}  
                </div>
              </div>
            </div>
            <el-divider />
          </div>
        </el-skeleton>
      </el-card>
    </el-col>
  </el-row>

</template>
<script lang="ts" setup>
import { ref } from 'vue';
import { formatTime } from '@/utils'
const {proxy}: any = getCurrentInstance()
import { useUserStore } from '@/store/modules/user' 
import type { WorkplaceTotal, Project, Shortcut } from './types'
import MyFocusList from './MyFocusList.vue'
import ModulesMenu from './ModulesMenu/Index.vue' 

defineOptions({ name: 'Home' }) 

const {push} = useRouter()
/**
 * 通知公告消息
 */
import {useNoticeMsgStore} from '@/store/modules/noticeMsg'  
import TaskListAssigneeToMe from './TaskListAssigneeToMe.vue'
const noticeMsgStore = useNoticeMsgStore(); 
const noticeMsgList = computed(() => noticeMsgStore.data?.length>=5?noticeMsgStore.data.slice(0,5):noticeMsgStore.data)
const noticeMsgCount = computed(() => noticeMsgStore.total)

const { t } = useI18n()
const userStore = useUserStore() 
const loading = ref(true)
const avatar = userStore.getUserInfo.headimgurl
const username = userStore.getUserInfo.username 
// 获取统计数
let totalSate = reactive<WorkplaceTotal>({
  project: 0,
  access: 0,
  todo: 0
})

const wfOpen = import.meta.env.VITE_WF_OPEN

const getCount = async () => {
  const data = {
    project: 40,
    access: 2340,
    todo: 10
  }
  totalSate = Object.assign(totalSate, data)
}
let toDoPageInfo =  reactive({total:0})

// 获取关注数量
let focusPageInfo = reactive({total:0})
 
const gotolink = (context,path)=>{ 
  if(!context){
    context=import.meta.env.VITE_CONTEXT
  }
  if(context==import.meta.env.VITE_CONTEXT){
    push({path:path});
  }else{ 
		var curlDomain=window.location.protocol+"//"+window.location.host; //   
    proxy.$mdp.openWin(proxy.$mdp.getUri(curlDomain,context,import.meta.env.VITE_UI_VERSION,"/#/",path))
    //NProgress.done() // if current page is login will not trigger afterEach hook, so manually handle it
  }

}
const goToMsgCenter = () => {
  push({name: 'MyNotifyMessage'});
}
// 获取快捷入口
let shortcut = reactive<Shortcut[]>([])

const getShortcut = async () => {
  const data = [
    {
      name: '产品管理',
      context: 'xm',
      icon: 'logos:productboard-icon',
      url: '/xm/product/mng'
    },
    {
      name: '需求管理',
      context: 'xm',
      icon: 'logos:cloudacademy-icon',
      url: '/xm/product/menu/mng'
    },
    {
      name: '项目管理',
      context: 'xm',
      icon: 'logos:xamarin',
      url: '/xm/project/mng/me'
    },
    {
      name: '团队管理',
      context: 'xm',
      icon: 'logos:multipass',
      url: '/xm/group/mng'
    },
    {
      name: '开发任务',
      context: 'xm',
      icon: 'logos:codeception',
      url: '/xm/project/task/center/me'
    },
    {
      name: '缺陷管理',
      context: 'xm',
      icon: 'logos:testing-library',
      url: '/xm/test/question/mng'
    }
  ]
  shortcut = Object.assign(shortcut, data)
}
 
 
 

const getAllApi = async () => {
  await Promise.all([
    getCount(), 
    getShortcut(), 
  ])
  loading.value = false
}

getAllApi()
</script>
