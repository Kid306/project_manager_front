const { t } = useI18n() 

const RoutesXmDatav: AppRouteRecordRaw[] = [
    {
      path: '/datav/xm',
      name: 'xmDatav',
      component: () => import('@/views/datav/xm/Layout.vue'), 
      meta: {
        title: '驾驶舱',
        icon: 'ep:histogram'
      }, 
      // leaf: true,//只有一个节点
      children: [
        // { path: 'project/projectDatavFullScreen', component: () => import('@/views/datav/xm/project/index.vue'), name: 'projectDatavFullScreen', meta: {   title: '项目大屏' }},
        { path: 'project/index', component: () => import('@/views/datav/xm/project/index.vue'), name: 'projectDatavFullScreen', meta: {   title: '项目大屏' ,menu:true,
        icon: 'ep:histogram'}},  
        // { path: 'branch/branchDatavFullScreen', component: () => import('@/views/datav/xm/branch/index.vue'), name: 'branchDatavFullScreen', meta: {   title: '机构大屏' }}, 
        { path: 'branch/index', component: () => import('@/views/datav/xm/branch/index.vue'), name: 'branchDatavFullScreen', meta: {   title: '机构大屏' ,menu:true,
        icon: 'ep:histogram'}}, 
      ]
    }
  ] 
  export default RoutesXmDatav