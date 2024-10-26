<template>
	<ContentWrap>
		<template #header>
			<el-space wrap>
				<mdp-hi-query
          :column-configs="columnConfigs"
          v-model="hiQueryParams"
          @change="onHiQueryParamsChange"
        />
        <el-button icon="zoom-out" @click="searchReset()" title="重置查询条件并查询" />  

        <mdp-export @excel="export2Excel()"/>
        <mdp-table-configs :column-configs="columnConfigs" v-model="checkedColumns" />  
				<el-button  type="primary" @click="select">确认选择</el-button>

			</el-space>
		</template>
		<el-space> 
			<el-input v-model="filters.name" style="width: 10em;" placeholder="任务名称" clearable/>
			<el-input v-model="filters.taskId" style="width:10em;" placeholder="任务编号" clearable/>
			<span v-if="!selProject || !selProject.id">
				<el-input  v-model="filters.projectId" style="width: 10em;" placeholder="项目编号" clearable/>
				<el-input v-model="filters.branchId" style="width: 10em;" placeholder="项目公司编号" clearable/>
			</span>
			<el-input v-model="filters.execUserBranchId" style="width: 10em;" placeholder="用户公司编号" clearable/>
 			<mdp-select itemCode="projectTaskExecuserStatus" v-model="filters.status"    placeholder="候选状态" clearable/>
			<el-button type="primary" v-loading="load.list" :disabled="load.list==true" @click="searchTableDatas">查询</el-button>
 		</el-space>
	</ContentWrap>

 			<!--列表 XmTaskExecuser xm_task_execuser-->
			<el-table ref="table" v-adaptive="{bottom:50}" :data="tableDatas" @sort-change="sortChange" highlight-current-row v-loading="load.list" border @selection-change="selsChange" @row-click="rowClick" style="width: 100%;">

				 <el-table-column  label="" type="selection" width="60"  fixed="left"/> 
					 <el-table-column prop="bidUsername" label="用户姓名"  width="150" sortable  show-overflow-tooltip fixed="left">
						 <template #default="scope">
							<mdp-select-user show-style="tag" :key="scope.row.id" v-model="scope.row.bidUserid" :init-name="scope.row.bidUsername" :disabled="true"/>
						 </template>
					</el-table-column>
					<el-table-column prop="bidBranchId" label="用户归属公司" width="150" sortable  show-overflow-tooltip fixed="left"/>
					<el-table-column prop="status" label="候选状态"  width="120" sortable fixed="left">
						<template #default="scope"> 
							<mdp-select itemCode="projectTaskExecuserStatus" v-model="scope.row.status" placeholder="候选状态" show-style="tag" :disabled="true"/>
						</template>
					</el-table-column>
					<el-table-column prop="taskName" label="任务名称" width="150" sortable  show-overflow-tooltip fixed="left"/>
					<el-table-column prop="taskState" label="任务状态" width="120" sortable  show-overflow-tooltip >
						<template #default="scope">
							<mdp-select itemCode="taskState" v-model="scope.row.taskState" show-style="tag" :disabled="true"/>
  						</template>
					</el-table-column>
					<el-table-column prop="projectId" label="项目编号" width="120" sortable show-overflow-tooltip/> 
					<el-table-column prop="skillRemark" label="技能" min-width="150" sortable  show-overflow-tooltip /> 
				<el-table-column  label="报价信息" min-width="150">

					 <el-table-column prop="createTime" label="报价时间" width="150" sortable/>
					 <el-table-column prop="quoteWorkload" label="报价工作量" width="120" sortable>
						<template #default="scope">
							{{scope.row.quoteWorkload?scope.row.quoteWorkload:'-'}}h
						</template>
					</el-table-column>
					<el-table-column prop="quotePrice" label="报价金额" width="120" sortable>

						<template #default="scope">
							￥{{scope.row.quotePrice?scope.row.quotePrice:'-'}}元
						</template>
					</el-table-column>
				</el-table-column>
			</el-table>
			<el-pagination  layout="total, sizes, prev, pager, next" @current-change="handleCurrentChange" @size-change="handleSizeChange" :page-sizes="[10,20, 50, 100, 500]" :current-page="pageInfo.pageNum" :page-size="pageInfo.pageSize"  :total="pageInfo.total" style="float:right;" />

 	
</template>

<script>
	import util from '@/components/mdp-ui/js/util';//全局公共库
	import config from "@/api/mdp_pub/mdp_config"; //全局公共库

	//import Sticky from '@/components/Sticky' // 粘性header组件

	import { listXmTaskExecuserWithTask,editXmTaskExecuser,leaveTask,beExecutor,settleExec, delXmTaskExecuser, batchDelXmTaskExecuser,quotePrice,becomeCandidate,toTest,testSuccess,testFail } from '@/api/xm/core/xmTaskExecuser';
   	import { mapState } from 'pinia'
import { useUserStore } from '@/store/modules/user'

import { MdpTableMixin } from '@/components/mdp-ui/mixin/MdpTableMixin.js';

export default {
	mixins:[MdpTableMixin],
		computed: {
		    ...mapState(useUserStore,[
		      'userInfo','roles'
				]),
			xmTask:function(){
				var xmTask={...this.editForm}
				xmTask.id=this.editForm.taskId;
				return xmTask;
			}
		},
		props: ["visible",'selProject'],
		watch: {
			'visible': function(val) {
				if(val == true){
					this.searchTableDatas();
				}
			},
		},
		data() {
			return {
				filters: {
					name: '',
					execUserBranchId:'',
					taskId:'',
					projectId:'',
					status:'',
					taskState:'',
					branchId:'',
				}, 
				pageInfo:{//分页数据
					total:0,//服务器端收到0时，会自动计算总记录数，如果上传>0的不自动计算。
					pageSize:10,//每页数据
					count:true,//是否需要重新计算总记录数
					pageNum:1,//当前页码、从1开始计算
					orderFields:['res.create_time'],//排序列 如 ['sex','student_id']，必须为数据库字段
					orderDirs:['desc']//升序 asc,降序desc 如 性别 升序、学生编号降序 ['asc','desc']
				}, 
				addFormVisible: false,//新增xmTaskExecuser界面是否显示
				//新增xmTaskExecuser界面初始化数据
				addForm: {
					createTime:'',id:'',taskId:'',userid:'',startTime:'',endTime:'',status:'',remarks:'',settleAmount:'',settleWorkload:'',settleStatus:'',settleTime:'',createUserid:'',createUsername:'',username:'',matchScore:'',quoteWeekday:'',quoteAmount:'',quoteTime:'',bizProcInstId:'',bizFlowState:'',projectId:'',phaseId:'',skillRemark:'',quoteWorkload:'',quoteStartTime:'',quoteEndTime:'',branchId:'',projectPhaseName:'',taskName:''
				},

				editFormVisible: false,//编辑界面是否显示
				//编辑xmTaskExecuser界面初始化数据
				editForm: {
					createTime:'',id:'',taskId:'',userid:'',startTime:'',endTime:'',status:'',remarks:'',settleAmount:'',settleWorkload:'',settleStatus:'',settleTime:'',createUserid:'',createUsername:'',username:'',matchScore:'',quoteWeekday:'',quoteAmount:'',quoteTime:'',bizProcInstId:'',bizFlowState:'',projectId:'',phaseId:'',skillRemark:'',quoteWorkload:'',quoteStartTime:'',quoteEndTime:'',branchId:'',projectPhaseName:'',taskName:''
				}, 
				apis:{
					list: listXmTaskExecuserWithTask, 
				}
			}
		},//end data
		methods: { 
			 
			preQueryParamCheck( params ) {
				 
				if(this.selProject && this.selProject.id){
					params.projectId=this.selProject.id
				}    
				return true
			},
			afterLoad(tableDatas){
				this.$emit('loadExecUserList',tableDatas)
			},

			 
			select: function(){
				this.$emit('select',this.sels);//  @row-click="rowClick"
			},
		},//end methods
		components: { 
		},
		mounted() { 
		}
	}

</script>

<style scoped> 
</style>
