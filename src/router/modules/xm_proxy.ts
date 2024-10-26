import { Layout } from '@/utils/routerHelper'

import XmProjectLayout from '@/views/xm/core/xmProject/index.vue'
import XmProductLayout from '@/views/xm/core/xmProduct/index.vue'
import XmIterationLayout from '@/views/xm/core/xmIteration/index.vue'
import XmTestLayout from '@/views/xm/core/xmTestCasedb/index.vue'

import ProxyIndex from '@/views/xm/proxy/index.vue'
 

const RoutesXmCore: AppRouteRecordRaw[] = [ 
   
  {
    path: '/xm/pro/project/view',
    component: XmProjectLayout,
    name: 'XmProProjectView',
    meta: {
      title: '项目管理-专业视图',
      icon: 'project',
      hidden: true,
    },
    // leaf: true,//只有一个节点
    children: [ 
      {
        path: 'budget',
        component: ProxyIndex,
        name: 'projectBudget',
        meta: {
          title: '项目-预算',
          icon: 'project',
          roles: ['user'],
          hidden: true
        }
      },
      {
        path: 'cost',
        component: ProxyIndex,
        name: 'projectCost',
        meta: {
          title: '项目-费用',
          icon: 'project',
          roles: ['user'],
          hidden: true
        }
      }, 
      {
        path: 'workloadMonth',
        component: ProxyIndex,
        name: 'projectWorkloadMonth',
        meta: {
          title: '项目-工时月报',
          icon: 'project',
          roles: ['user'],
          hidden: true
        }
      }, 
      {
        path: 'rpt',
        component: ProxyIndex,
        name: 'projectRpt',
        meta: {
          title: '项目-效能',
          icon: 'project',
          roles: ['user'],
          hidden: true
        }
      }
    ]
  },
  {
    path: '/xm/pro/product/view',
    component: XmProductLayout,
    name: 'XmProProductView',
    meta: {
      title: '产品管理-专业视图',
      icon: 'product', 
      hidden: true,
    },
    // leaf: true,//只有一个节点
    children: [ 
      {
        path: 'contract',
        component: ProxyIndex,
        name: 'productContract',
        meta: {
          title: '产品-合同',
          icon: 'product', 
          hidden: true
        }
      }, 
      {
        path: 'budget',
        component: ProxyIndex,
        name: 'productBudget',
        meta: {
          title: '产品-预算',
          icon: 'product', 
          hidden: true
        }
      },
      {
        path: 'cost',
        component: ProxyIndex,
        name: 'productCost',
        meta: {
          title: '产品-成本',
          icon: 'product', 
          hidden: true
        }
      }, 
      {
        path: 'workloadMonth',
        component: ProxyIndex,
        name: 'productWorkloadMonth',
        meta: {
          title: '产品-工时月报',
          icon: 'product', 
          hidden: true
        }
      }, 
      {
        path: 'rpt',
        component: ProxyIndex,
        name: 'productRpt',
        meta: {
          title: '产品-效能',
          icon: 'product', 
          hidden: true
        }
      }
    ]
  },

  {
    path: '/xm/pro/iteration/view',
    component: XmIterationLayout,
    name: 'XmProIterationView',
    meta: {
      title: '迭代管理-专业视图',
      icon: 'iteration',
      hidden: true,
    },
    // leaf: true,//只有一个节点
    children: [ 
      {
        path: 'workloadMonth',
        component: ProxyIndex,
        name: 'iterationWorkloadMonth',
        meta: {
          title: '迭代-工时月报',
          icon: 'iteration', 
          hidden: true
        }
      },
      {
        path: 'rpt',
        component: ProxyIndex,
        name: 'iterationRpt',
        meta: {
          title: '迭代-效能',
          icon: 'iteration', 
          hidden: true
        }
      }
    ]
  }, 
  {
    path: '/xm/pro/test/view',
    component: XmTestLayout,
    name: 'XmProTestView',
    meta: {
      title: '测试管理-专业视图',
      icon: 'bug',
      hidden: true,
    },
    // leaf: true,//只有一个节点
    children: [  
      {
        path: 'rpt',
        component: ProxyIndex,
        name: 'testRpt',
        meta: { title: '统计分析', roles: ['user'], hidden: true }
      }
    ]
  }, 
]

export default RoutesXmCore
