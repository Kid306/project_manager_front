<template>
	
		 <xm-question-mng v-bind="$props"/>
	
</template>

<script>
	 
	 
import { defineAsyncComponent } from 'vue'; 
const XmQuestionMng = defineAsyncComponent(() =>
  import('../xmQuestion/XmQuestionMng.vue') // 假设LazyComponent.vue是你想要懒加载的组件
);
	 

	export default {  
		props:["selProject",'qtype','xmTestPlanCase','xmTestCase','xmTestPlan','xmIteration','xmProduct','queryScene','xmMenu','xmTask'],
		 components:{
			XmQuestionMng
		 }
	}
</script> 