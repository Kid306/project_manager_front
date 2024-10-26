<template> 
  <xm-test-case-mng :multiple="multiple" :subOpType="subOpType" :visible="visible" :xmTestCasedb="xmTestCasedb" :params="params" :scene="scene" :xmMenu="xmMenu" :xmProduct="xmProduct"/>
</template>

<script> 
// 在 Vue 3 中，可以使用 defineAsyncComponent 方法来创建异步组件
import { defineAsyncComponent } from 'vue';
 
 
// 创建一个异步组件，它会从一个外部API动态导入组件
const XmTestCaseMng = defineAsyncComponent(() =>
  import('../xmTestCase/XmTestCaseMng.vue') // 假设LazyComponent.vue是你想要懒加载的组件
);// 创建一个异步组件，它会从一个外部API动态导入组件
 
export default {
  props: ['subOpType', 'multiple','visible', 'xmTestCasedb', 'scene', 'xmMenu', 'xmProduct','params'],
  components: { 
    XmTestCaseMng
  }, 
}
</script> 
