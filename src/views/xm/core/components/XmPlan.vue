<template>
	
		<el-row :gutter="5">
		<el-col :span="toggle?0:7">
 			<div v-show="toggle==false">
				<xm-phase ref="xmPhase" :xm-product="xmProduct" :sel-project="selProject"  @check-change="onPhaseRowClick" v-if="hadInit"/>
			</div>
			
		</el-col>
		<el-col :span="toggle?24:17">
				<xm-task-mng :xm-product="xmProduct" :sel-project="selProject" :params="{ntype:'1',parentTaskid:parentTask?.id}" :parent-task="parentTask" queryScope="plan" subOpType="mng" @batch-add-submit="onBatchAddSubmit" @add-submit="onAddSubmit">
				<template #expandBtn>
					<el-button :icon="toggle?'DArrowRight':'DArrowLeft'" @click="onToggleClick" plain title="展开/收起左边"/>
				</template>
			</xm-task-mng>
			</el-col>
		</el-row>
	
</template>

<script>

import { mapState } from 'pinia'
import { useUserStore } from '@/store/modules/user'
 
import { defineAsyncComponent } from 'vue'; 
const XmTaskMng = defineAsyncComponent(() =>
  import('@/views/xm/core/xmTask/XmTaskMng.vue') // 假设LazyComponent.vue是你想要懒加载的组件
);
	export default {

		components: {
			XmTaskMng
		},
        props:['xmProduct','selProject'],//queryScope='plan|task'
		computed: {
		    ...mapState(useUserStore,[
		      'userInfo','roles'
		    ]),


        },
		watch: {

	    },
		data() {
			return {
				parentTask:null,
				toggle: true,
				hadInit: false, 
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
					this.parentTask=task
				}else{
					this.parentTask=null
				}
				 
			 },
			 onBatchAddSubmit(){
				this.$refs.xmPhase.refresh()
			 },
			 onAddSubmit(data){

			 }
		},//end method
		mounted() {


		}//end mounted
	}

</script>

<style lang="less" scoped />
