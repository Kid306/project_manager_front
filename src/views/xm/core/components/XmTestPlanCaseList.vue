<template> 
  <xm-test-plan-case-mng v-bind="$props"/>
</template>

<script> 
// 在 Vue 3 中，可以使用 defineAsyncComponent 方法来创建异步组件
import { defineAsyncComponent } from 'vue';
 
 
// 创建一个异步组件，它会从一个外部API动态导入组件
const XmTestPlanCaseMng = defineAsyncComponent(() =>
  import('../xmTestPlanCase/XmTestPlanCaseMng.vue') // 假设LazyComponent.vue是你想要懒加载的组件
);// 创建一个异步组件，它会从一个外部API动态导入组件
 
export default {
  props: ['multiple','visible', 'xmTestPlan', 'xmTestCasedb', 'xmTestCase', 'xmProduct', 'xmProject', 'subOpType'],
  components: { 
    XmTestPlanCaseMng
  }, 
}
</script> 
