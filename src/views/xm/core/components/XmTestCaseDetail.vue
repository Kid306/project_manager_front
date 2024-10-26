<template>
 	<xm-test-case-edit :key="xmTestCase?.id" v-loading="load.list" v-if="xmTestCaseDb&&xmTestCaseDb.id " :formData="xmTestCaseDb"  />
 </template>

<script> 
	 
	import {  listXmTestCase } from '@/api/xm/core/xmTestCase';
	import { mapState } from 'pinia'
import { useUserStore } from '@/store/modules/user';  

import { defineAsyncComponent } from 'vue';

	export default {  
		props:['xmTestCase','reload'],
		watch:{
			"xmTestCase.id":function(val){
			  if(this.reload && this.xmTestCase?.id){ 
					this.getXmTestCase(this.xmTestCase.id)
				}else if(this.xmTestCase?.id){
					this.xmTestCaseDb=this.xmTestCase 
				}
			}
		},
		computed: {
		    ...mapState(useUserStore,[
		      'userInfo','roles'
				]), 
		}, 
		data() {
			return { 
				load:{list:false},
				 xmTestCaseDb:null, 
			}
		},//end data
		methods: { 
			  
			 getXmTestCase(id){
				if(!id){
					this.xmTestCaseDb=null
					return;
				}
				this.load.list=true;
				 listXmTestCase({id:id}).then(res=>{ 
					this.load.list=false;
					 var tips = res.tips;
					 if(tips.isOk){
						 this.xmTestCaseDb=res.data[0] 
					 }else{
						this.xmTestCaseDb=null
					 }
				 })
			 }
			
		},//end methods
		components: {  
			XmTestCaseEdit:defineAsyncComponent(()=>import("../xmTestCase/XmTestCaseEdit.vue")),
			//在下面添加其它组件
		},  
		mounted() {  
			  if(this.reload && this.xmTestCase?.id){

					this.getXmTestCase(this.xmTestCase.id)
				}else if(this.xmTestCase?.id){
					this.xmTestCaseDb=this.xmTestCase 
				}
		}
	}
</script>

<style scoped />