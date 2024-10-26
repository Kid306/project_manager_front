import { Layout } from '@/utils/routerHelper'

import xmCoreRouter from './xm_core'
import xmDatavRouter from './xm_datav'
// import xmProRouter from './xm_pro'
import xmProxyRouter from './xm_proxy'

import profileRouter from './profile'

import baseWorkflowRouter from './base_workflow'
const { t } = useI18n()
/**
 * redirect: noredirect        当设置 noredirect 的时候该路由在面包屑导航中不可被点击
 * name:'router-name'          设定路由的名字，一定要填写不然使用<keep-alive>时会出现各种问题
 * meta : {
 hidden: true              当设置 true 的时候该路由不会再侧边栏出现 如404，login等页面(默认 false)

 alwaysShow: true          当你一个路由下面的 children 声明的路由大于1个时，自动会变成嵌套的模式，
 只有一个时，会将那个子路由当做根路由显示在侧边栏，
 若你想不管路由下面的 children 声明的个数都显示你的根路由，
 你可以设置 alwaysShow: true，这样它就会忽略之前定义的规则，
 一直显示根路由(默认 false)

 title: 'title'            设置该路由在侧边栏和面包屑中展示的名字

 icon: 'svg-name'          设置该路由的图标

 noCache: true             如果设置为true，则不会被 <keep-alive> 缓存(默认 false)

 breadcrumb: false         如果设置为false，则不会在breadcrumb面包屑中显示(默认 true)

 affix: true               如果设置为true，则会一直固定在tag项中(默认 false)

 noTagsView: true          如果设置为true，则不会出现在tag中(默认 false)

 activeMenu: '/dashboard'  显示高亮的路由路径

 followAuth: '/dashboard'  跟随哪个路由进行权限过滤

 canTo: true               设置为true即使hidden为true，也依然可以进行路由跳转(默认 false)
 }
 **/
const BaseRouter: AppRouteRecordRaw[] = [
  {
    path: '/redirect',
    component: Layout,
    name: 'Redirect',
    children: [
      {
        path: '/redirect/:path(.*)',
        name: 'Redirect',
        component: () => import('@/views/Redirect/Redirect.vue'),
        meta: {}
      }
    ],
    meta: {
      hidden: true,
      noTagsView: true
    }
  },
  { path: '/changeEmailStepTwo', component: () => import('@/views/Profile/components/ChangeEmailStepTwo.vue'),name:'ChangeEmailStepTwo', meta:{title:'更改邮箱验证邮箱',hidden: true} },
  { path: '/invite/code/:inviteId', component: () => import('@/views/Login/components/Invite/Code.vue'), name: 'InviteCode',meta:{title:'邀请码',hidden:true}},
 	{ path: '/invite/success', component: () => import('@/views/Login/components/Invite/Success.vue'), name: 'InviteSuccess', meta: { title: '扫码成功' ,menu:false ,hidden:true} },
 	{ path: '/social/login/success', component: () => import('@/views/Login/components/Social/LoginSuccess.vue'), name: 'SocialLogin', meta: { title: '扫码成功' ,menu:false ,hidden:true} },

  {
    path: '/',
    component: Layout,
    redirect: '/index',
    name: 'Home',
    meta: {},
    children: [
      {
        path: 'index',
        component: () => import('@/views/Home/Index.vue'),
        name: 'Index',
        meta: {
          title: t('router.home'),
          icon: 'ep:home-filled',
          noCache: false,
          affix: true
        }
      }
    ]
  },
  {
    path: '/user',
    component: Layout,
    name: 'UserInfo',
    meta: {
      hidden: true
    },
    children: [
      {
        path: 'profile',
        component: () => import('@/views/Profile/Index.vue'),
        name: 'Profile',
        meta: {
          canTo: true,
          hidden: true,
          noTagsView: false,
          icon: 'ep:user',
          title: t('common.profile')
        }
      },
      {
        path: 'notify-message',
        component: () => import('@/layout/components/Message/src/Index.vue'),
        name: 'MyNotifyMessage',
        meta: {
          canTo: true,
          hidden: true,
          noTagsView: false,
          icon: 'ep:message',
          title: '我的站内信'
        }
      }
    ]
  }, 
  {
    path: '/login',
    component: () => import('@/views/Login/Login.vue'),
    name: 'Login',
    meta: {
      hidden: true,
      title: t('router.login'),
      noTagsView: true
    }
  },
  {
    path: '/mdp',
    component: Layout,
    meta: {
      title: t('router.sys.RoleQxMng'),
      icon: 'simple-line-icons:people',
      roles:['superAdmin','platformAdmin']
    },
    name: 'FuncRoleQxMng',  
    children: [ 
      {
        path: 'func/index',
        component: () => import('@/components/mdp-ui-ext/mdp-func-menu/Index.vue'),
        name: 'funcMenuIndex',
        meta: { 
          icon:'ep:grid',
          title: t('router.sys.MenuDefMng'),
          roles:['superAdmin','platformAdmin']
        }
      }, 
    ]
  },
  {
    path: '/403',
    component: () => import('@/views/Error/403.vue'),
    name: 'NoAccess',
    meta: {
      hidden: true,
      title: '403',
      noTagsView: true
    }
  },
  {
    path: '/404',
    component: () => import('@/views/Error/404.vue'),
    name: 'NoFound',
    meta: {
      hidden: true,
      title: '404',
      noTagsView: true
    }
  },
  {
    path: '/500',
    component: () => import('@/views/Error/500.vue'),
    name: 'Error',
    meta: {
      hidden: true,
      title: '500',
      noTagsView: true
    }
  }, 
]


const allRouter:AppRouteRecordRaw[] = BaseRouter
.concat(profileRouter)
.concat(xmCoreRouter)
// .concat(xmDatavRouter) 
// .concat(xmProRouter)
.concat(xmProxyRouter)
.concat(baseWorkflowRouter)
export default allRouter
