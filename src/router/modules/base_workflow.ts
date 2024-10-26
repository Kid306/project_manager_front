/* Layout */
import {Layout} from '@/utils/routerHelper'

const {t} = useI18n()

const RoutesWorkflow: AppRouteRecordRaw[] = [
    
    {
        path: '/mdp/workflow/re',
        component: Layout,
        name: 'WfModelCenter', 
        //leaf: true,//只有一个节点
        meta: {
            title: t('router.workflow.modelCenter'),
            icon: 'simple-line-icons:drawer'
        },
        children: [
            {
                path: 'designer/index',
                component: () => import('@/views/mdp/workflow/designer/Index.vue'),
                name: 'WfDesigner',
                meta: {
                    title: t('router.workflow.workflowEditorIndex'),menu: true
                }
            },
            {
                path: 'model/index',
                component: () => import('@/views/mdp/workflow/re/model/Index.vue'),
                name: 'WfModelMng',
                meta: {title: t('router.workflow.ModelMng'),menu: true}
            },
            {
                path: 'procdef/index',
                component: () => import('@/views/mdp/workflow/re/procdef/Index.vue'),
                name: 'WfProcdef',
                meta: {title: t('router.workflow.ProcdefSuspend'),menu: true}
            }, 
            {
                path: 'bmlink/index',
                component: () => import('@/views/mdp/workflow/re/bizModelLink/Index.vue'),
                name: 'WfBmlink',
                meta: {title: t('router.workflow.BizModelMng'),menu: true}
            }
        ]
    },
    {
        path: '/mdp/workflow',
        component: Layout,
        name: 'WfTaskCenter',
        meta: {
            title: t('router.workflow.TaskCenter'),
            icon: 'simple-line-icons:magic-wand'
        }, 
        //leaf: true,//只有一个节点
        children: [
            {
                path: 'ru/task/detail',
                component: () => import('@/views/mdp/workflow/ru/detail/Index.vue'),
                name: 'WfTaskDetail',
                meta: {title: t('router.workflow.WfTaskDetail'),menu: true,hidden:true}
            },
            {
                path: 'ru/task/me',
                component: () => import('@/views/mdp/workflow/ru/task/TaskListAssigneeToMe.vue'),
                name: 'TaskListAssigneeToMe',
                meta: {title: t('router.workflow.TaskListAssigneeToMe'),menu: true}
            },
            {
                path: 'ru/task/me/calendar',
                component: () => import('@/views/mdp/workflow/ru/task/TaskListAssigneeToMeCalendar.vue'),
                name: 'TaskListAssigneeToMeCalendar',
                meta: {title: t('router.workflow.TaskListAssigneeToMeCalendar'),menu: true}
            },
            {
                path: 'ru/task/claim/me',
                component: () => import('@/views/mdp/workflow/ru/task/TaskListAssigneeToMeClaim.vue'),
                name: 'TaskListAssigneeToMeClaim',
                meta: {title: t('router.workflow.TaskListAssigneeToMeClaim'),menu: true}
            },
            {
                path: 'ru/procinst/parames/exec/set',
                component: () =>
                    import('@/views/mdp/workflow/ru/procinstParames/ProcinstParamesExecutionSetRoute.vue'),
                name: 'ProcinstParamesExecutionSetRoute',
                meta: {
                    title: t('router.workflow.ProcinstParamesExecutionSetRoute'),
                    noCache: true,
                    hidden: true,
                   menu: true
                }
            }, 
            {
                path: 'ru/task/list',
                component: () => import('@/views/mdp/workflow/ru/task/Index.vue'),
                name: 'taskList',
                meta: {
                    title: t('router.workflow.TaskMng'),
                   menu: true
                }
            },
            {
                path: 're/biz/start',
                component: () => import('@/views/mdp/workflow/re/procdef/start/IndexBiz.vue'),
                name: 'bizStartProc', 
                meta: {
                    title: t('router.workflow.ProcdefListForBizStart'),
                   menu: true,
                    hidden: true
                }
            },
            {
                path: 're/start',
                component: () => import('@/views/mdp/workflow/re/procdef/start/Index.vue'),
                name: 'startProc',
                meta: {title: t('router.workflow.ProcdefListForStart'),menu: true}
            }
        ]
    },
    {
        path: '/mdp/workflow/ru',
        component: Layout,
        name: 'WfExecCenter', 
        meta: {
            title: t('router.workflow.flowCenter'),
            icon: 'simple-line-icons:shield'
        },
        //leaf: true,//只有一个节点
        children: [
            {
                path: 'execution/list/monitors/me',
                component: () => import('@/views/mdp/workflow/ru/execution/ExecutionListMyMonitors.vue'),
                name: 'ExecutionListMyMonitors',
                meta: {title: t('router.workflow.ExecutionListMyMonitors'),menu: true}
            },
            //todo
            {
                path: 'execution/list/start/me',
                component: () => import('@/views/mdp/workflow/ru/execution/ExecutionListMyStart.vue'),
                name: 'ExecutionListMyStart',
                meta: {title: t('router.workflow.ExecutionListMyStart'),menu: true}
            },
            {
                path: 'ru/execution/list/partake/me',
                component: () => import('@/views/mdp/workflow/ru/execution/ExecutionListMyPartake.vue'),
                name: t('router.workflow.ExecutionListMyPartake'),
                meta: {title: t('router.workflow.ExecutionListMyPartake'),menu: true}
            },
            {
                path: 'execution/list/sponsors/me',
                component: () => import('@/views/mdp/workflow/ru/execution/ExecutionListMySponsors.vue'),
                name: 'ExecutionListMySponsors',
                meta: {title: t('router.workflow.ExecutionListMySponsors'),menu: true}
            },
            {
                path: 'execution/list/sponsors/me/calendar',
                component: () =>
                    import('@/views/mdp/workflow/ru/execution/ExecutionListMySponsorsCalendar.vue'),
                name: 'ExecutionListMySponsorsCalendar',
                meta: {title: t('router.workflow.ExecutionListMySponsorsCalendar'),menu: true}
            },
            {
                path: 'execution/list',
                component: () => import('@/views/mdp/workflow/ru/execution/ExecutionListAll.vue'),
                name: 'ExecutionListAll',
                meta: {
                    title: t('router.workflow.ExecutionListAll'), 
                   menu: true
                }
            },

            {
                path: 'procinst/list/archive',
                component: () => import('@/views/mdp/workflow/ru/execution/ExecutionListArchive.vue'),
                name: 'ExecutionListArchive',
                meta: {title: t('router.workflow.ExecutionListArchive'),
               menu: true}
            }
        ]
    }, 
    {
        path: '/mdp/workflow/hi',
        component: Layout,
        name: 'WfProcinstCenter', 
        meta: {
            title: t('router.workflow.procinstFlowCenter'),
            icon: 'simple-line-icons:book-open'
        },
        //leaf: true,//只有一个节点
        children: [
            {
                path: 'procinst/list',
                component: () => import('@/views/mdp/workflow/hi/procinst/ProcinstListAll.vue'),
                name: 'ProcinstListAll',
                meta: {
                    title: t('router.workflow.ProcinstListAll'),
                   menu: true
                }
            },
            {
                path: 'procinst/list/start/me',
                component: () => import('@/views/mdp/workflow/hi/procinst/ProcinstListMyStart.vue'),
                name: 'ProcinstListMyStart',
                meta: {title: t('router.workflow.ProcinstListMyStart'),menu: true}
            },
            {
                path: 'procinst/list/partake/me',
                component: () => import('@/views/mdp/workflow/hi/procinst/ProcinstListMyPartake.vue'),
                name: 'ProcinstListMyPartake',
                meta: {title: t('router.workflow.ProcinstListMyPartake'),menu: true}
            },
            {
                path: 'procinst/list/monitors/me',
                component: () => import('@/views/mdp/workflow/hi/procinst/ProcinstListMyMonitors.vue'),
                name: 'ProcinstListMyMonitors',
                meta: {title: t('router.workflow.ProcinstListMyMonitors'),menu: true}
            },
            {
                path: 'procinst/list/sponsors/me',
                component: () => import('@/views/mdp/workflow/hi/procinst/ProcinstListMySponsors.vue'),
                name: 'ProcinstListMySponsors',
                meta: {title: t('router.workflow.ProcinstListMySponsors'),menu: true}
            }
        ]
    },
]

export default RoutesWorkflow
