<template>
	
		 <xm-group-mng v-if="selProject" :sel-project="selProject"  :visible="showInfo" />
	
</template>

<script>
	import util from '@/components/mdp-ui/js/util';//全局公共库
	 
	import {  listXmProject } from '@/api/xm/core/xmProject';
	import { mapState } from 'pinia'
import { useUserStore } from '@/store/modules/user'; 
	import XmGroupMng from './XmGroupMng.vue'

	export default {  
		computed: {
		    ...mapState(useUserStore,[
		      'userInfo','roles'
				]), 
		}, 
		watch:{
			 
		},
		data() {
			return { 
				 selProject:null,
				 showInfo:false,
			}
		},//end data
		methods: { 
			 
			 
			 initByQueryId(){
				 if(this.$route.query && this.$route.query.projectId){ 
					this.getXmProject(this.$route.query.projectId); 
				} 
			 },
			 getXmProject(projectId){
				 listXmProject({id:projectId}).then(res=>{
					 var tips = res.tips;
					 if(tips.isOk){
						 this.selProject=res.data[0]
 						this.showInfo=true;
					 }else{

					 }
				 })
			 }
			
		},//end methods
		components: {  
			XmGroupMng,
			//在下面添加其它组件
		}, 
		activated(){
			this.initByQueryId();
		},
		mounted() {  
			  this.initByQueryId();
		}
	}
</script>

<style scoped />