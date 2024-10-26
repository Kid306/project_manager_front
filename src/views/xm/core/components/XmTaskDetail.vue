<template>
 	<xm-task-edit :key="formData?.id" v-loading="load.list" v-if="formDataDb&&formDataDb.id && visible" :formData="formDataDb"/>
 </template>

<script> 
	 
	import {  getTaskDetail } from '@/api/xm/core/xmTask';
	import { mapState } from 'pinia'
import { defineAsyncComponent } from 'vue';
import { useUserStore } from '@/store/modules/user';  

	export default {  
		props:['formData','reload','visible'],
		watch:{
			visible(val){
				if(val){
					if(this.reload && this.formData && this.formData.id){
						this.getTaskDetail(this.formData.id)
					}else if(this.formData?.id){
						this.formDataDb=this.formData
					}
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
				 formDataDb:null, 
				 showInfo:false,
			}
		},//end data
		methods: { 
			  
			getTaskDetail(id){ 

				if(!id){
					this.formDataDb=null
					return;
				}
				
					this.load.list=true;
					getTaskDetail({id:id}).then(res=>{
					
					this.load.list=false;
					 var tips = res.tips;
					 if(tips.isOk){
						 this.formDataDb=res.data
					 }else{

					 }
				 })
			 }
			
		},//end methods
		components: {  
			XmTaskEdit:defineAsyncComponent(()=>import("../xmTask/XmTaskEdit.vue")),
			//在下面添加其它组件
		},  
		mounted() {  
			  if(this.reload && this.formData && this.formData.id){
					this.getTaskDetail(this.formData.id)
				}else if(this.formData?.id){
					this.formDataDb=this.formData
				}
		}
	}
</script>

<style scoped />