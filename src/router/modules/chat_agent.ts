import { Layout } from '@/utils/routerHelper'

const { t } = useI18n()

const ChatAgentRouter: AppRouteRecordRaw[] = [
  {
    path: '/chat',
    component: Layout,
    name: 'ChatAgent',
    meta: {
      title: '对话智能体',
      icon: 'fa-solid:robot'  // Using Font Awesome robot icon
    },
    children: [
      {
        path: 'index',
        component: () => import('@/views/ChatAgent/Index.vue'),
        name: 'ChatAgentIndex',
        meta: { 
          title: '智能对话',
          menu: true 
        }
      }
    ]
  }
]

export default ChatAgentRouter 