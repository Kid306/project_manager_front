<template>
	
		 <xm-question-edit :key="xmQuestion?.id" v-if="xmQuestionDb?.id" :formData="xmQuestionDb" />
	
</template>

<script>
	import util from '@/components/mdp-ui/js/util';//全局公共库
	 
import { defineAsyncComponent } from 'vue'; 
const XmQuestionEdit = defineAsyncComponent(() =>
  import('../xmQuestion/XmQuestionEdit.vue') // 假设LazyComponent.vue是你想要懒加载的组件
);
	import {  listXmQuestion } from '@/api/xm/core/xmQuestion';
	import { mapState } from 'pinia'
import { useUserStore } from '@/store/modules/user';  

	export default {  
		props:['xmQuestion','reload','visible'],
		watch:{
			visible(val){
				if(val==true){
					if(this.xmQuestion && this.xmQuestion.id && this.reload==true){
						this.getXmQuestion(this.xmQuestion.id)
					}else if(( !this.xmQuestion ||! this.xmQuestion.id )&& this.reload==true){
						this.xmQuestionDb=null;
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
				 xmQuestionDb:null,
			}
		},//end data
		methods: { 
			  
			 getXmQuestion(id){
				
					this.load.list=true;
				 listXmQuestion({id:id}).then(res=>{
					
					this.load.list=false;
					 var tips = res.tips;
					 if(tips.isOk){
						 this.xmQuestionDb=res.data[0]
					 }else{

					 }
				 })
			 }
			
		},//end methods
		components: {  
			XmQuestionEdit,
			//在下面添加其它组件
		}, 
		mounted() {  
			if(this.xmQuestion && this.xmQuestion.id && this.reload==true){
				this.getXmQuestion(this.xmQuestion.id)
			}else if(( !this.xmQuestion ||! this.xmQuestion.id )&& this.reload==true){
				this.xmQuestionDb=null;
			}
		}
	}
</script>

<style scoped />