<template> 
			<el-space wrap class="padding-bottom">

				<mdp-hi-query ref="hiQueryBtn"
          :column-configs="columnConfigs"
          v-model="hiQueryParams"
          @change="onHiQueryParamsChange"
        />
        <el-button icon="zoom-out" @click="searchReset()" title="重置查询条件并查询" ref="searchResetBtn"/>
  

        <mdp-export @excel="export2Excel()" ref="downloadBtn"/>
        <mdp-table-configs :column-configs="columnConfigs" v-model="checkedColumns" ref="columnConfigsBtn"/>  
				<el-button type="warning" v-loading="load.edit"  @click="loadTasksToXmGroupState">刷新数据</el-button>
				<el-input v-model="filters.key" style="width: 20%;" placeholder="模糊查询"/>
				<el-button type="primary" v-loading="load.list" :disabled="load.list==true" @click="searchTableDatas">查询</el-button> 
			</el-space> 
			<!--列表 XmGroupState 功能状态表,无需前端维护，所有数据由汇总统计得出-->
			<el-table ref="table" v-adaptive="{bottom:50}" :data="tableDatas" @sort-change="sortChange" highlight-current-row v-loading="load.list" border @selection-change="selsChange" @row-click="rowClick" style="width: 100%;">
 				<el-table-column sortable type="index" width="45" />
  				<el-table-column prop="groupName" label="团队名称" min-width="250" show-overflow-tooltip>
					  <template #default="scope">
						  <el-link type="primary" @click="{editForm=scope.row;overviewVisible=true}">{{scope.row.groupName}}</el-link>
					  </template>
				</el-table-column>
				
				<el-table-column prop="calcTime" label="汇总时间" width="120"  show-overflow-tooltip/>
				<el-table-column prop="finishRate" label="总体进度" min-width="80"  />
				<el-table-column prop="planWorkload" label="计划工作量" min-width="80"  />
				<el-table-column prop="actWorkload" label="实际工作量" min-width="80"  />
				<el-table-column prop="planCostAmount" label="计划成本" min-width="80"  />
				<el-table-column prop="actCostAmount" label="实际成本" min-width="80"  />
				<el-table-column prop="iterationCnt" label="迭代数" min-width="80"  />
				<el-table-column prop="taskCnt" label="任务数" min-width="80"  />
				<el-table-column prop="taskFinishCnt" label="完成的任务数" min-width="80"  />
 				<el-table-column prop="planWorkerCnt" label="总人数" min-width="80"  />
				<el-table-column prop="bugCnt" label="bug总数" min-width="80"  />
				<el-table-column prop="closedBugs" label="总关闭bugs" min-width="80"  />
				<el-table-column prop="activeBugs" label="激活bugs" min-width="80"  />
				<el-table-column prop="confirmedBugs" label="已确认bugs总数" min-width="80"  />
				<el-table-column prop="resolvedBugs" label="已解决bugs总数" min-width="80"  />
				<el-table-column prop="testCases" label="测试用例总数" min-width="80"  />
				<el-table-column prop="execCases" label="测试中用例总数" min-width="80"  />
				<el-table-column prop="designCases" label="设计中用例总数" min-width="80"  />
				<el-table-column prop="finishCases" label="完成用例总数" min-width="80"  />
			</el-table>
			<el-pagination  layout="total, sizes, prev, pager, next" @current-change="handleCurrentChange" @size-change="handleSizeChange" :page-sizes="[10,20, 50, 100, 500]" :current-page="pageInfo.pageNum" :page-size="pageInfo.pageSize"  :total="pageInfo.total" style="float:right;" />

 
			<mdp-dialog
				append-to-body
				title="小组概览"
				v-model="overviewVisible" width="80%" fullscreen
				 >
					<XmGroupStateOverview v-if="overviewVisible" :xm-group-state="editForm"/>
			</mdp-dialog>

	
</template>

<script>
	import util from '@/components/mdp-ui/js/util';//全局公共库
	import config from '@/api/mdp_pub/mdp_config';//全局公共库

	import { listXmGroupState, delXmGroupState, batchDelXmGroupState,loadTasksToXmGroupState } from '@/api/xm/core/xmGroupState';
	import { mapState } from 'pinia'
import { useUserStore } from '@/store/modules/user'
import XmGroupStateOverview from './XmGroupStateOverview.vue';

import { MdpTableMixin } from '@/components/mdp-ui/mixin/MdpTableMixin.js'

export default {
  mixins: [MdpTableMixin],
		computed: {
		    ...mapState(useUserStore,[
		      'userInfo','roles'
		    ])
		},
		props:['selProject','visible','xmGroup'],
		watch:{
			visible(visible){
				if(visible==true){
					this.getXmGroupStates();
				}
			}
		},
		data() {
			return {
				pkNames:['groupId'],
				filters: {
					key: ''
				},  
 				overviewVisible:false,
				apis:{
					list: listXmGroupState
				}
				/**end 自定义属性请在上面加 请加备注**/
			}
		},//end data
		methods: {
			 
			//获取列表 XmGroupState 功能状态表,无需前端维护，所有数据由汇总统计得出
			preQueryParamCheck( params ) { 
 
				if(this.selProject){
					params.projectId=this.selProject.id
				}

				if(this.xmGroup){
					params.groupId=this.xmGroup.id
				} 
				return true;
			},
 
			loadTasksToXmGroupState(){
				var params={}
				if(this.selProject){
					params.projectId=this.selProject.id
				} 

				if(this.xmGroup){
					params.projectId=this.xmGroup.projectId
				} 
				if(!params.projectId){
					this.$message.error("检测不到项目编号")
					return;
				}
				loadTasksToXmGroupState(params).then(res=>{
					var tips = res.tips;
					if(tips.isOk){
						this.searchTableDatas();
					}else{
						this.$notify({position:'bottom-left',showClose:true,message: tips.msg, type: tips.isOk?'success':'error'});

					}
				})
			} 

		},//end methods
		components: {
			XmGroupStateOverview 
		},
		mounted() { 
	}
}
</script>

<style scoped>

</style>
