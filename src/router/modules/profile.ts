/* Layout */
import { Layout } from '@/utils/routerHelper'
const { t } = useI18n()

const RoutesProfile: AppRouteRecordRaw[] = [
  {
    path: '/changeEmailStepTwo',
    component: () => import('@/views/Profile/components/ChangeEmailStepTwo.vue'),
    name: 'ChangeEmailStepTwo',
    meta: {
      title: t('router.profile.ChangeEmailStepTwo'), 
      hidden:true
    },  
  },
  {
    path: '/user/profile',
    component: Layout,
    name: 'profile',
    meta: {
      title: t('router.profile.index'),
      icon: 'simple-line-icons:layers'
    },  
    // leaf: true,
    children: [
      {
        path: 'index',
        component: () => import('@/views/Profile/Index.vue'),
        name: 'profileIndex',
        meta: {
          title: t('router.profile.index'),
          icon: 'ep:user', 
        }
      },
      {
        path: 'message',
        component: () => import('@/layout/components/Message/src/Index.vue'),
        name: 'message',
        meta: {
          title: t('router.profile.message'),
          icon: 'fa:commenting-o', 
        }
      },
      {
        path: 'loginRecord',
        component: () => import('@/views/Profile/components/LoginRecord.vue'),
        name: 'loginRecord',
        meta: {
          title: t('router.profile.loginRecord'),
          icon: 'fa:align-justify', 
        }
      }
    ]
  }
]

export default RoutesProfile
