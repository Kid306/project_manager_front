/**
 * 由于专业版与开源版分离，需要把专业版的某些组件注册为公共组件，方便开源版以公共组件方式引入，避免报错
 * 需要在 main.ts 中做如下操作
 
    //唛盟拓展的组件
    import XmComponents from '@/views/xm/index.js' 

    //注册唛盟xm公共组件
    app.use(XmComponents)

    开源版：
        1.需要把下面的专业版的引入注释掉
        2.需要把src\router\modules\base.ts中的xmProRouter注释掉，并删除 src\router\modules\xm_pro.ts
        3.需要把src\router\modules\base.ts中的xmProxyRouter的注释去掉，让其生效

    专业版:
        1.需要把下面的开源版的引入注释掉
        2.需要把src\router\modules\base.ts中的xmProRouter注释去掉，让其生效，同时确保src\router\modules\xm_pro.ts存在
        3.需要把src\router\modules\base.ts中的xmProxyRouter注释掉，让其失效
 */ 

// 下面是专业版根开源版都需要的公告组件
import XmProjectSelect from '@/views/xm/core/components/XmProjectSelect.vue'
import XmProductSelect from '@/views/xm/core/components/XmProductSelect.vue'
import XmIterationSelect from '@/views/xm/core/components/XmIterationSelect.vue'
import XmMenuSelect from '@/views/xm/core/components/XmMenuSelect.vue' 
import XmMenuTree from '@/views/xm/core/components/XmMenuTree.vue' 
import XmMenuBox from '@/views/xm/core/components/XmMenuBox.vue' 
import XmMenuDetail from '@/views/xm/core/components/XmMenuDetail.vue' 
import XmEpicFeatures from '@/views/xm/core/components/XmEpicFeatures.vue' 
import XmTaskSelect from '@/views/xm/core/components/XmTaskSelect.vue' 
import XmFuncSelect from '@/views/xm/core/components/XmFuncSelect.vue' 
import XmFuncTree from '@/views/xm/core/components/XmFuncTree.vue' 
import XmTestCasedbSelect from '@/views/xm/core/components/XmTestCasedbSelect.vue' 
import XmTestCaseList from '@/views/xm/core/components/XmTestCaseList.vue' 
import XmTestPlanCaseList from '@/views/xm/core/components/XmTestPlanCaseList.vue' 
import XmUserSelect from '@/views/xm/core/components/XmUserSelect.vue' 
import XmTaskBox from '@/views/xm/core/components/XmTaskBox.vue' 
import XmTaskDetail from '@/views/xm/core/components/XmTaskDetail.vue' 
import XmPhase from '@/views/xm/core/components/XmPhase.vue' 
import XmPlan from '@/views/xm/core/components/XmPlan.vue'  
import XmQuestionDetail from '@/views/xm/core/components/XmQuestionDetail.vue' 
import XmQuestionList from '@/views/xm/core/components/XmQuestionList.vue' 
import XmTestCaseDetail from '@/views/xm/core/components/XmTestCaseDetail.vue' 
import XmTestPlanCaseDetail from '@/views/xm/core/components/XmTestPlanCaseDetail.vue' 



//下面为开源版引入 proxy中的组件 
 import XmRpt from '@/views/xm/proxy/index.vue';
 import XmTaskGantt from '@/views/xm/proxy/index.vue';

// end 开源版

// 下面为专业版引入的 pro中的组件

//import XmRpt from '@/views/xm/pro/rpt/index/index.vue';
//import XmTaskGantt from "@/views/xm/pro/gantt/XmTaskGantt.vue"; //甘特图


// end 专业版


const compLists = {
    install: function(Vue) {
        // 公共组件
        Vue.component('XmProjectSelect', XmProjectSelect)
        Vue.component('XmProductSelect', XmProductSelect) 
        Vue.component('XmIterationSelect', XmIterationSelect)
        Vue.component('XmEpicFeatures', XmEpicFeatures) 
        Vue.component('XmMenuSelect', XmMenuSelect) 
        Vue.component('XmMenuBox', XmMenuBox) 
        Vue.component('XmMenuDetail', XmMenuDetail) 
        Vue.component('XmTaskSelect', XmTaskSelect) 
        Vue.component('XmFuncSelect', XmFuncSelect) 
        Vue.component('XmFuncTree', XmFuncTree) 
        Vue.component('XmMenuTree', XmMenuTree) 
        Vue.component('XmTestCasedbSelect', XmTestCasedbSelect) 
        Vue.component('XmUserSelect', XmUserSelect) 
        Vue.component('XmPhase', XmPhase) 
        Vue.component('XmPlan', XmPlan) 
        Vue.component('XmTaskDetail', XmTaskDetail) 
        Vue.component('XmTaskBox', XmTaskBox) 
        Vue.component('XmQuestionDetail', XmQuestionDetail)  
        Vue.component('XmTestCaseDetail', XmTestCaseDetail)  
        Vue.component('XmTestPlanCaseDetail', XmTestPlanCaseDetail)  
        Vue.component('XmQuestionList', XmQuestionList)  
        Vue.component('XmTestCaseList', XmTestCaseList)  
        Vue.component('XmTestPlanCaseList', XmTestPlanCaseList)  

        // pro 组件
        Vue.component('XmRpt', XmRpt)
        Vue.component('XmTaskGantt', XmTaskGantt) 
    }
}
export default compLists
