<template>
	
	<el-row :gutter="5" v-if="!menuId && !parentTask?.id && !deriveId">
		<el-col :span="toggle?0:6">
 			<div v-show="toggle==false">
			<xm-phase subOpType="mng" :xm-product="xmProduct" :sel-project="selProject"  @check-change="onPhaseRowClick" @project-select="onProjectSelect" @project-clear="onProjectClear"  v-if="hadInit"/>
			</div>
			
		</el-col>
		<el-col :span="toggle?24:18">
			<xm-task-mng :queryScope="queryScope||'task'" :key="selProject?.id?selProject?.id:project?.id"  :subOpType="subOpType" :menuId="menuId" :multiple="multiple" :xm-product="xmProduct" :xmIteration="xmIteration" :sel-project="selProject?.id?selProject:project" :params="myParams" :parent-task="parentTask?.id?parentTask:parent" @select="(v)=>$emit('select',v)">
				<template #expandBtn>
					<el-button :icon="toggle?'DArrowRight':'DArrowLeft'" @click="onToggleClick" plain title="展开/收起左边"/>
				</template>
			</xm-task-mng>
		</el-col>
	</el-row>
	<xm-task-mng :deriveId="deriveId" :queryScope="queryScope||'task'" :key="'xxxxx_'+deriveId" v-else-if="deriveId" :subOpType="subOpType" :menuId="menuId" :multiple="multiple" :xm-product="xmProduct" :xmIteration="xmIteration" :sel-project="selProject?.id?selProject:project"/>

	<xm-task-mng :queryScope="queryScope||'task'" :key="selProject?.id?selProject?.id:project?.id" v-else :subOpType="subOpType" :menuId="menuId" :multiple="multiple" :xm-product="xmProduct" :xmIteration="xmIteration" :sel-project="selProject?.id?selProject:project" :params="myParams" :parent-task="parentTask?.id?parentTask:parent" @select="(v)=>$emit('select',v)"/>
</template>

<script>
import util from '@/components/mdp-ui/js/util';//全局公共库

import { mapState } from 'pinia'
import { useUserStore } from '@/store/modules/user'

 
// 在 Vue 3 中，可以使用 defineAsyncComponent 方法来创建异步组件
import { defineAsyncComponent } from 'vue';
  
 // 创建一个异步组件，它会从一个外部API动态导入组件
 const XmTaskMng = defineAsyncComponent(() =>
	 import('../xmTask/XmTaskMng.vue') // 假设LazyComponent.vue是你想要懒加载的组件
 );// 创建一个异步组件，它会从一个外部API动态导入组件 

export default {
	name:'XmTaskBox',
	components: {
		XmTaskMng
	},
			props:['xmProduct','xmIteration','selProject','multiple','menuId','subOpType',
			"queryScope","deriveId",
    "params",
    "parentTask"],
	computed: {
			...mapState(useUserStore,[
				'userInfo','roles'
			]),

			myParams(){
				if(this.params){
					if(this.parent?.id){ 
						return  {...this.params,parentTaskid:this.parent.id}
					}else{
						return this.params
					}
				}else{
					if(this.parent?.id){
						return {parentTaskid:this.parent.id} 
					}else{
						return null
					}
				}  
			},
	},
	watch: {

		},
	data() {
		return {
			parent:null,
				toggle: true,
				hadInit: false, 
				project:null,
		}//end return
	},//end data
	methods: {
			 onToggleClick(){
				this.toggle=!this.toggle
				if(!this.hadInit){
					this.hadInit=true
				}
			 },
		 onPhaseRowClick(task,checked){
			if(checked==true){
				this.parent=task
			}else{
				this.parent=null
			}
			 
		 },
		 onProjectSelect(project){
			this.project=project
			this.parent=null
			this.$emit('project-select',project)
		 },
		 onProjectClear(){
			this.project=null
			this.parent=null
			
			this.$emit('project-clear')
		 }
	},//end method
	mounted() {
		this.parent=this.parentTask
		this.project=this.selProject

	}//end mounted
}

</script>

<style lang="less" scoped />
