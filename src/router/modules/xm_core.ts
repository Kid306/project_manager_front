import { Layout } from '@/utils/routerHelper'

const { t } = useI18n()

import XmProjectLayout from '@/views/xm/core/xmProject/index.vue'
import XmProductLayout from '@/views/xm/core/xmProduct/index.vue'
import XmIterationLayout from '@/views/xm/core/xmIteration/index.vue'
import XmTestLayout from '@/views/xm/core/xmTestCasedb/index.vue'

const RoutesXmCore: AppRouteRecordRaw[] = [
  {
    path: '/xm/product',
    component: Layout,
    name: 'XmProduct',
    meta: {
      title: '产品管理',
      icon: 'fa:product-hunt'
    },
    // leaf: true,//只有一个节点
    children: [
      {
        path: 'mng',
        component: () => import('@/views/xm/core/xmProduct/XmProductMng.vue'),
        name: 'XmProductMng',
        meta: { title: '产品管理', menu: true }
      },
      {
        path: 'recycle',
        component: () => import('@/views/xm/core/xmProduct/XmProductRecycle.vue'),
        name: 'XmProductRecycle',
        meta: { title: '产品回收站', menu: true }
      },

      {
        path: 'tpl',
        component: () => import('@/views/xm/core/xmProduct/XmProductTplMng.vue'),
        name: 'XmProductTplMng',
        meta: { title: '产品模板', menu: true }
      },
      {
        path: 'menu/detail',
        component: () => import('@/views/xm/core/xmMenu/XmMenuDetailRoute.vue'),
        name: 'XmMenuDetailRoute',
        meta: { title: '需求明细', menu: true, hidden: true }
      },

      {
        path: 'menu/mng',
        component: () => import('@/views/xm/core/xmMenu/XmMenuMngRoute.vue'),
        name: 'XmMenuMng',
        meta: { title: '需求管理', menu: true }
      },
      {
        path: 'iteration/mng',
        component: () => import('@/views/xm/core/xmIteration/XmIterationMng.vue'),
        name: 'XmIterationMng',
        meta: { title: '迭代管理', menu: true }
      }
    ]
  },
  {
    path: '/xm/project',
    component: Layout,
    name: 'XmProject',
    meta: {
      title: '项目管理',
      icon: 'fa-solid:project-diagram'
    },
    // leaf: true,//只有一个节点
    children: [
      {
        path: 'mng',
        component: () => import('@/views/xm/core/xmProject/XmProjectAllMng.vue'),
        name: 'xmProjectAllMng',
        meta: { title: '项目总览', menu: true }
      },
      {
        path: 'mng/me',
        component: () => import('@/views/xm/core/xmProject/XmProjectMng.vue'),
        name: 'xmProjectMng',
        meta: { title: '项目(我的)', menu: true }
      },
      {
        path: 'recycle',
        component: () => import('@/views/xm/core/xmProject/XmProjectRecycle.vue'),
        name: 'XmProjectRecycle',
        meta: { title: '项目回收站', menu: true }
      },
      {
        path: 'mng/record',
        component: () => import('@/views/xm/core/xmRecord/XmRecord.vue'),
        name: 'XmRecord',
        meta: { title: '项目动态', menu: true }
      },
      {
        path: 'tpl',
        component: () => import('@/views/xm/core/xmProject/XmProjectTplMng.vue'),
        name: 'XmProjectTplMng',
        meta: { title: '项目模板', menu: true }
      },
      {
        path: 'evn/mng',
        component: () => import('@/views/xm/core/xmEnvList/XmEnvListMng.vue'),
        name: 'XmEnvListMng',
        meta: { title: '环境清单', menu: true }
      },
      {
        path: 'task/center',
        component: () => import('@/views/xm/core/xmTask/XmTaskCenter.vue'),
        name: 'xmTaskCenter',
        meta: { title: '任务大厅', menu: true }
      },
      {
        path: 'task/center/me',
        component: () => import('@/views/xm/core/xmTask/XmMyTaskCenter.vue'),
        name: 'xmMyTaskCenter',
        meta: { title: '任务(我的)', menu: true }
      },
      {
        path: 'workload/mng',
        component: () => import('@/views/xm/core/xmWorkload/XmWorkloadMng.vue'),
        name: 'XmWorkloadMng',
        meta: { title: '工时管理', menu: true }
      },
      {
        path: 'task/detail',
        component: () => import('@/views/xm/core/xmTask/XmTaskDetailRoute.vue'),
        name: 'XmTaskDetailRoute',
        meta: { title: '任务详情', menu: true, hidden: true }
      }
    ]
  },
  {
    path: '/xm/project/view',
    component: XmProjectLayout,
    name: 'XmProjectView',
    meta: {
      title: '项目管理-视图',
      icon: 'project',
      hidden: true,
    },
    // leaf: true,//只有一个节点
    children: [
      {
        path: 'overview',
        component: () => import('@/views/xm/core/xmProject/XmProjectOverviewComplex.vue'),
        name: 'projectOverview', 
        meta: {
          title: '项目-首页',
          icon: 'project',
          menu: true,
          hidden: true
        }
      },
      {
        path: 'product',
        component: () => import('@/views/xm/core/xmProduct/XmProductForLinkComplex.vue'),
        name: 'projectProductLink',
        meta: {
          title: '项目-产品',
          icon: 'project',
          menu: true,
          hidden: true
        }
      },
      {
        path: 'menu',
        component: () => import('@/views/xm/core/xmMenu/XmMenuBoxForProject.vue'),
        name: 'projectMenu',
        meta: {
          title: '项目-需求',
          icon: 'project',
          menu: true,
          hidden: true
        }
      },
      {
        path: 'iteration',
        component: () => import('@/views/xm/core/xmIteration/XmIterationForLinkComplex.vue'),
        name: 'projectIteration',
        meta: {
          title: '项目-迭代',
          icon: 'project',
          menu: true,
          hidden: true
        }
      },
      {
        path: 'milestone',
        component: () => import('@/views/xm/core/xmTask/XmMilestoneForProject.vue'),
        name: 'projectMilestone',
        meta: {
          title: '项目-里程碑计划',
          icon: 'project',
          menu: true,
          hidden: true
        }
      },
      {
        path: 'plan',
        component: () => import('@/views/xm/core/xmTask/XmPlanForProject.vue'),
        name: 'projectPlan',
        meta: {
          title: '项目-计划',
          icon: 'project',
          menu: true,
          hidden: true
        }
      },

      {
        path: 'task',
        component: () => import('@/views/xm/core/xmTask/XmTaskListForProject.vue'),
        name: 'projectTask',
        meta: {
          title: '项目-任务',
          icon: 'project',
          menu: true,
          hidden: true
        }
      },
      {
        path: 'env',
        component: () => import('@/views/xm/core/xmEnvList/XmEnvListMng.vue'),
        name: 'projectEnv',
        meta: {
          title: '项目-环境清单',
          icon: 'project',
          menu: true,
          hidden: true
        }
      },
      {
        path: 'test/plan',
        component: () => import('@/views/xm/core/xmTestPlan/XmTestPlanForProject.vue'),
        name: 'projectTestPlan',
        meta: {
          title: '项目-测试',
          icon: 'project',
          menu: true,
          hidden: true
        }
      },
      {
        path: 'question',
        component: () => import('@/views/xm/core/xmQuestion/XmQuestionForProject.vue'),
        name: 'projectQuestion',
        meta: {
          title: '项目-缺陷',
          icon: 'project',
          menu: true,
          hidden: true
        }
      },
      {
        path: 'group',
        component: () => import('@/views/xm/core/xmGroup/XmGroupForProject.vue'),
        name: 'projectGroup',
        meta: {
          title: '项目-团队',
          icon: 'project',
          menu: true,
          hidden: true
        }
      }, 
      {
        path: 'record',
        component: () => import('@/views/xm/core/xmRecord/XmRecordForProject.vue'),
        name: 'projectRecord',
        meta: {
          title: '项目-日志',
          icon: 'project',
          menu: true,
          hidden: true
        }
      },  
      {
        path: 'workloadDay',
        component: () => import('@/views/xm/core/xmWorkload/DayListForProject.vue'),
        name: 'projectWorkloadDay',
        meta: {
          title: '项目-工时日报',
          icon: 'project',
          menu: false,
          hidden: true
        }
      }, 
      {
        path: 'file',
        component: () => import('@/views/xm/core/xmFile/XmFileForProject.vue'),
        name: 'projectFile',
        meta: {
          title: '项目-文档',
          icon: 'project',
          menu: true,
          hidden: true
        }
      }, 
    ]
  },
  {
    path: '/xm/product/view',
    component: XmProductLayout,
    name: 'XmProductView',
    meta: {
      title: '产品管理-视图',
      icon: 'product', 
      hidden: true,
    },
    // leaf: true,//只有一个节点
    children: [
      {
        path: 'overview',
        component: () => import('@/views/xm/core/xmProduct/XmProductOverviewComplex.vue'),
        name: 'productOverview',
        meta: {
          title: '产品-首页',
          icon: 'product', 
          hidden: true
        }
      },
      {
        path: 'project',
        component: () => import('@/views/xm/core/xmProject/XmProjectForLinkComplex.vue'),
        name: 'productProjectLink',
        meta: {
          title: '产品-项目',
          icon: 'product', 
          hidden: true
        }
      },
      {
        path: 'menu',
        component: () => import('@/views/xm/core/xmMenu/XmMenuBoxForProduct.vue'),
        name: 'productMenu',
        meta: {
          title: '产品-需求',
          icon: 'product', 
          hidden: true
        }
      },
      {
        path: 'func',
        component: () => import('@/views/xm/core/xmFunc/XmFuncForProduct.vue'),
        name: 'productFunc',
        meta: {
          title: '产品-模块',
          icon: 'product', 
          hidden: true
        }
      },
      {
        path: 'iteration',
        component: () => import('@/views/xm/core/xmIteration/XmIterationForLinkComplex.vue'),
        name: 'productIteration',
        meta: {
          title: '产品-迭代',
          icon: 'product', 
          hidden: true
        }
      },
      {
        path: 'plan',
        component: () => import('@/views/xm/core/xmTask/XmPlanForProduct.vue'),
        name: 'productPlan',
        meta: {
          title: '产品-计划',
          icon: 'product', 
          hidden: true
        }
      },
      {
        path: 'task',
        component: () => import('@/views/xm/core/xmTask/XmTaskListForProduct.vue'),
        name: 'productTask',
        meta: {
          title: '产品-任务',
          icon: 'product', 
          hidden: true
        }
      },
      {
        path: 'env',
        component: () => import('@/views/xm/core/xmEnvList/XmEnvListMng.vue'),
        name: 'productEnv',
        meta: {
          title: '产品-环境清单',
          icon: 'product', 
          hidden: true
        }
      },
      {
        path: 'test/plan',
        component: () => import('@/views/xm/core/xmTestPlan/XmTestPlanForProduct.vue'),
        name: 'productTestPlan',
        meta: {
          title: '产品-测试管理',
          icon: 'iteration', 
          hidden: true
        }
      },
      {
        path: 'question',
        component: () => import('@/views/xm/core/xmQuestion/XmQuestionForProduct.vue'),
        name: 'productQuestion',
        meta: {
          title: '产品-缺陷',
          icon: 'product', 
          hidden: true
        }
      },
      {
        path: 'group',
        component: () => import('@/views/xm/core/xmGroup/XmGroupForProduct.vue'),
        name: 'productGroup',
        meta: {
          title: '产品-团队',
          icon: 'product', 
          hidden: true
        }
      }, 
      {
        path: 'record',
        component: () => import('@/views/xm/core/xmRecord/XmRecordForProduct.vue'),
        name: 'productRecord',
        meta: {
          title: '产品-日志',
          icon: 'product', 
          hidden: true
        }
      },  
      {
        path: 'file',
        component: () => import('@/views/xm/core/xmFile/XmFileForProduct.vue'),
        name: 'productFile',
        meta: {
          title: '产品-文档',
          icon: 'product', 
          hidden: true
        }
      },
      {
        path: 'workloadDay',
        component: () => import('@/views/xm/core/xmWorkload/DayListForProduct.vue'),
        name: 'productWorkloadDay',
        meta: {
          title: '产品-工时日报',
          icon: 'product', 
          menu: false,
          hidden: true
        }
      }, 
    ]
  },

  {
    path: '/xm/iteration/view',
    component: XmIterationLayout,
    name: 'XmIterationView',
    meta: {
      title: '迭代管理-视图',
      icon: 'iteration',
      hidden: true,
    },
    // leaf: true,//只有一个节点
    children: [
      {
        path: 'overview',
        component: () => import('@/views/xm/core/xmIteration/XmIterationOverviewComplex.vue'),
        name: 'iterationOverview',
        meta: {
          title: '迭代-首页',
          icon: 'iteration', 
          menu: true,
          hidden: true
        }
      },
      {
        path: 'project',
        component: () => import('@/views/xm/core/xmProject/XmProjectForLinkComplex.vue'),
        name: 'iterationProjectLink',
        meta: {
          title: '迭代-项目',
          icon: 'iteration', 
          menu: true,
          hidden: true
        }
      },
      {
        path: 'menu',
        component: () => import('@/views/xm/core/xmMenu/XmMenuBoxForIteration.vue'),
        name: 'iterationMenu',
        meta: {
          title: '迭代-需求',
          icon: 'iteration', 
          menu: true,
          hidden: true
        }
      },
      {
        path: 'func',
        component: () => import('@/views/xm/core/xmFunc/XmFuncForIteration.vue'),
        name: 'iterationFunc',
        meta: {
          title: '迭代-模块',
          icon: 'iteration', 
          menu: true,
          hidden: true
        }
      },
      {
        path: 'task',
        component: () => import('@/views/xm/core/xmTask/XmTaskListForIteration.vue'),
        name: 'iterationTask',
        meta: {
          title: '迭代-任务',
          icon: 'iteration', 
          menu: true,
          hidden: true
        }
      },
      {
        path: 'test/plan',
        component: () => import('@/views/xm/core/xmTestPlan/XmTestPlanForIteration.vue'),
        name: 'iterationTestPlan',
        meta: {
          title: '迭代-测试管理',
          icon: 'iteration', 
          menu: true,
          hidden: true
        }
      },
      {
        path: 'question',
        component: () => import('@/views/xm/core/xmQuestion/XmQuestionForIteration.vue'),
        name: 'iterationQuestion',
        meta: {
          title: '迭代-缺陷',
          icon: 'iteration', 
          menu: true,
          hidden: true
        }
      },
      {
        path: 'group',
        component: () => import('@/views/xm/core/xmGroup/XmGroupForIteration.vue'),
        name: 'iterationGroup',
        meta: { title: '团队',   
          menu: true,
          hidden: true 
        }
      },

      {
        path: 'record',
        component: () => import('@/views/xm/core/xmRecord/XmRecordForIteration.vue'),
        name: 'iterationRecord',
        meta: {
          title: '迭代-日志',
          icon: 'iteration', 
          menu: true,
          hidden: true
        }
      },
      {
        path: 'workloadDay',
        component: () => import('@/views/xm/core/xmWorkload/DayListForIteration.vue'),
        name: 'iterationWorkloadDay',
        meta: {
          title: '迭代-工时日报',
          icon: 'iteration', 
          menu: false,
          hidden: true
        }
      }, 
    ]
  },
  {
    path: '/xm/test',
    component: Layout,
    name: 'XmTest',
    meta: {
      title: '测试管理',
      icon: 'fa-solid:bug'
    },
    // leaf: true,//只有一个节点
    children: [
      {
        path: 'casedb/mng',
        component: () => import('@/views/xm/core/xmTestCasedb/XmTestCasedbMngForRoute.vue'),
        name: 'XmTestCasedbMng',
        meta: { title: '用例库管理', menu: true }
      },
      {
        path: 'case/mng',
        component: () => import('@/views/xm/core/xmTestCase/XmTestCaseMng.vue'),
        name: 'XmTestCaseMng',
        meta: { title: '用例管理', menu: true }
      },
      {
        path: 'plan/mng',
        component: () => import('@/views/xm/core/xmTestPlan/XmTestPlanMng.vue'),
        name: 'XmTestPlanMng',
        meta: { title: '测试计划', menu: true }
      },
      {
        path: 'question/detail',
        component: () => import('@/views/xm/core/xmQuestion/XmQuestionDetailRoute.vue'),
        name: 'questionDetail',
        meta: { title: '缺陷明细', menu: true, hidden: true }
      },
      {
        path: 'question/mng',
        component: () => import('@/views/xm/core/xmQuestion/XmQuestionMngRoute.vue'),
        name: 'XmQuestionMng',
        meta: { title: '缺陷管理', menu: true }
      },
      {
        path: 'question/mng/me',
        component: () => import('@/views/xm/core/xmQuestion/XmQuestionMngMy.vue'),
        name: 'XmQuestionMngMy',
        meta: { title: '缺陷(我的)', menu: true }
      }
    ]
  },
  {
    path: '/xm/test/view',
    component: XmTestLayout,
    name: 'XmTestView',
    meta: {
      title: '测试管理-视图',
      icon: 'bug',
      hidden: true,
    },
    // leaf: true,//只有一个节点
    children: [
      {
        path: 'overview',
        component: () => import('@/views/xm/core/xmTestCasedb/Overview.vue'),
        name: 'testOverview',
        meta: { title: '测试管理', menu: true, hidden: true }
      },
      {
        path: 'case',
        component: () => import('@/views/xm/core/xmTestCase/XmTestCaseForList.vue'),
        name: 'testCase',
        meta: { title: '用例管理', menu: true, hidden: true }
      },
      {
        path: 'flow',
        component: () => import('@/views/xm/core/xmTestCase/XmTestCaseForFlow.vue'),
        name: 'testFlow',
        meta: { title: '用例评审', menu: true, hidden: true }
      },
      {
        path: 'plan',
        component: () => import('@/views/xm/core/xmTestPlan/Overview.vue'),
        name: 'testPlan',
        meta: { title: '测试计划', menu: true, hidden: true }
      },
      {
        path: 'env',
        component: () => import('@/views/xm/core/xmTestCasedb/EnvIndex.vue'),
        name: 'testEnv',
        meta: { title: '环境', menu: true, hidden: true }
      },

      {
        path: 'plan/detail',
        component: () => import('@/views/xm/core/xmTestPlan/Detail.vue'),
        name: 'testPlanDetail',
        meta: { title: '测试计划明细', menu: true, hidden: true }
      },

      {
        path: 'group',
        component: () => import('@/views/xm/core/xmGroup/XmGroupForTest.vue'),
        name: 'testGroup',
        meta: { title: '团队', menu: true, hidden: true }
      }, 
      {
        path: 'record',
        component: () => import('@/views/xm/core/xmRecord/XmRecordForTestCasedb.vue'),
        name: 'testRecord',
        meta: {
          title: '测试库-日志',  
          hidden: true
        }
      },  
    ]
  }, 

  {
    path: '/xm/group',
    component: Layout,
    name: 'XmGroup',
    meta: {
      title: '团队管理',
      icon: 'fa-solid:user-friends'
    },
    // leaf: true,//只有一个节点
    children: [
      {
        path: 'mng',
        component: () => import('@/views/xm/core/xmGroup/XmGroupAllMng.vue'),
        name: 'XmGroupAllMng',
        meta: { title: '团队管理', menu: true }
      },
      {
        path: 'user',
        component: () => import('@/views/xm/core/xmGroupUser/XmGroupUserMng.vue'),
        name: 'XmGroupUserMng',
        meta: { title: '成员管理', menu: true }
      },
      {
        path: 'detail',
        component: () => import('@/views/xm/core/xmGroup/XmGroupRoute.vue'),
        name: 'XmGroupRoute',
        meta: { title: '项目团队', menu: true,hidden: true },
        
      }
    ]
  },
 
]

export default RoutesXmCore
