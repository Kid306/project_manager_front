<template>
 	<xm-test-plan-case-edit :key="xmTestPlanCase?.caseId+xmTestPlanCase?.planId" v-if="xmTestPlanCaseDb&&xmTestPlanCaseDb.caseId " :formData="xmTestPlanCaseDb"  />
 </template>

<script> 
	 
	import {  listXmTestPlanCase } from '@/api/xm/core/xmTestPlanCase';
	import { mapState } from 'pinia'
import { useUserStore } from '@/store/modules/user';  

import { defineAsyncComponent } from 'vue';

	export default {  
		props:['xmTestPlanCase','reload'],
		computed: {
		    ...mapState(useUserStore,[
		      'userInfo','roles'
				]), 
		},  
		data() {
			return { 
				load:{list:false},
				 xmTestPlanCaseDb:null,  
			}
		},//end data
		methods: { 
			  
			 getXmTestPlanCase(planId,caseId){
				if(!planId){
					this.xmTestPlanCaseDb=null
					return;
				}
				
					this.load.list=true;
				 listXmTestPlanCase({planId:planId,caseId:caseId}).then(res=>{
					
					this.load.list=false;
					 var tips = res.tips;
					 if(tips.isOk){
						 this.xmTestPlanCaseDb=res.data[0]  
					 }else{

					 }
				 })
			 }
			
		},//end methods
		components: {  
			XmTestPlanCaseEdit:defineAsyncComponent(()=>import("../xmTestPlanCase/XmTestPlanCaseEdit.vue")),
			//在下面添加其它组件
		},  
		mounted() {  
			  if(this.reload && this.xmTestPlanCase?.planId){

					this.getXmTestPlanCase(this.xmTestPlanCase.planId,this.xmTestPlanCase.caseId)
				}else{
					this.xmTestPlanCaseDb=this.xmTestPlanCase 
				}
		}
	}
</script>

<style scoped />