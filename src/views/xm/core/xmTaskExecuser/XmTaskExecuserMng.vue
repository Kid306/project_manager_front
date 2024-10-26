<template>
	<ContentWrap>
		<template #header>
			<el-space>
				<mdp-hi-query
          :column-configs="columnConfigs"
          v-model="hiQueryParams"
          @change="onHiQueryParamsChange"
        />
        <el-button icon="zoom-out" @click="searchReset()" title="重置查询条件并查询" />
        <mdp-export @excel="export2Excel()"/>
        <mdp-table-configs :column-configs="columnConfigs" v-model="checkedColumns" /> 
  
              <el-button   type="primary" icon="plus" title="新建" plain @click="showAdd"/>
 
          
          <el-button @click="$refs['ganttDlg'].open()"  title="甘特图" type="warning"  plain>甘</el-button>
              <el-button @click="$refs['kanbanDlg'].open()"  title="看板" type="success" plain>板</el-button>  
         
  		</el-space>
			
		</template> 
		<el-space>
			<XmProjectSelect v-model="filters.productId" placeholder="项目" v-if="!xmTask||!xmTask.id"/>	
			<mdp-select itemCode="projectTaskExecuserStatus" v-model="filters.status"  placeholder="候选状态" clearable/>
 			<mdp-select itemCode="taskState" v-model="filters.taskState"   placeholder="任务状态" clearable/>
			
			<el-input v-model="filters.taskName" style="width: 10em;" placeholder="任务名称" clearable/>
			<el-input v-model="filters.taskId" style="width:10em;;" placeholder="任务编号" clearable/> 
 			<el-input v-model="filters.execUserBranchId" style="width: 10em;;" placeholder="用户公司编号" clearable/>
 			<el-input v-model="filters.branchId" style="width: 10em;;" placeholder="项目公司编号" clearable/>
 		<el-button type="primary" v-loading="load.list" :disabled="load.list==true" @click="searchTableDatas" plain>查询</el-button>
		</el-space>

	</ContentWrap>
 			<!--列表 XmTaskExecuser xm_task_execuser-->
			<el-table ref="table" v-adaptive="{bottom:50}" :data="tableDatas" @sort-change="sortChange" highlight-current-row v-loading="load.list" border @selection-change="selsChange" @row-click="rowClick" style="width: 100%;">
				 <el-table-column  label="序号" type="index" width="60"  fixed="left"/>
					 <el-table-column prop="bidUsername" label="用户姓名"  width="150" sortable  show-overflow-tooltip fixed="left">
						 <template #default="scope">
							<mdp-select-user show-style="tag" :key="scope.row.id" v-model="scope.row.bidUserid" :init-name="scope.row.bidUsername" :disabled="true"/>
						 </template>
					</el-table-column>
					<el-table-column prop="bidBranchId" label="用户归属公司" width="150" sortable  show-overflow-tooltip fixed="left"/>
					<el-table-column prop="status" label="候选状态" col-prefix="res." width="120" sortable fixed="left">
						<template #default="scope">
						<el-popover trigger="hover" :show-after="200"
							width="500" >
							<el-row>
  									<!--结算状态0未结算1已部分结算2无需结算4已申请结算5结算失败6已全部结算-->
									<el-button type="primary" v-if="scope.row.status=='7' " @click="becomeCandidate(scope.row)">成为候选人</el-button>
									<el-button type="danger" v-if="scope.row.status=='7' " @click="handleDel(scope.row)">删除</el-button>
									<el-button type="warning" v-if="scope.row.status=='0'"  @click="showQuotePrice(scope.row)">修改报价信息</el-button>
									<el-button type="primary" v-if="scope.row.status=='0'"   @click="execute(scope.row)">成为执行人</el-button>
									<el-button type="primary" v-if="scope.row.status=='1' " @click="showWorkload(scope.row)">填报工时进度</el-button>
									<el-button type="warning" v-if="scope.row.status!='7' " @click="leave(scope.row)">离开任务</el-button>
									<br/><font color="blue">{{formatToDoByStatus(scope.row)}}</font>
							</el-row>
								<template #reference>
										<el-link type="primary" v-if="scope.row.status=='0'">候选中</el-link>
										<el-link type="success" v-else-if="scope.row.status=='1'">执行中 </el-link>
										<el-link type="info" v-else-if="scope.row.status=='7'">已放弃  </el-link>
										<el-link type="danger" v-else-if="scope.row.status=='8'">黑名单 </el-link>
								</template>

						</el-popover>
						</template>
					</el-table-column>

					<el-table-column prop="taskName" label="任务名称" width="150" sortable  show-overflow-tooltip fixed="left"/>
					<el-table-column sortable prop="rate" label="进度" width="120">
						<template #default="scope">
						<el-link :disabled="scope.row.ntype=='1'"
							style="border-radius: 30px"
							:type="scope.row.rate >= 100 ? 'success' : 'warning'"
							@click="showWorkload(scope.row)"
						>
							{{ (scope.row.rate != null ? scope.row.rate : 0) + "%" }}
						</el-link>
						</template>
					</el-table-column>
					<el-table-column prop="taskName" label="任务状态" width="120" sortable  show-overflow-tooltip >
						<template #default="scope">
							<mdp-select itemCode="taskState" v-model="scope.row.taskState" :disabled="true" show-style="tag"/> 
 						</template>
					</el-table-column>
					<el-table-column prop="projectId" col-prefix="res." label="项目编号" width="120" sortable show-overflow-tooltip/>
					<el-table-column prop="startTime" col-prefix="res." col-type="date" label="加入时间"  width="150" sortable/>
					<el-table-column prop="endTime" col-prefix="res." col-type="date" label="离开时间"  width="150" sortable/>
					<el-table-column prop="skillRemark" label="技能" min-width="150" sortable  show-overflow-tooltip/>
					<el-table-column prop="remarks" label="备注" min-width="150" sortable  show-overflow-tooltip/>

					 <el-table-column prop="createTime" col-prefix="res." col-type="date" label="报价时间" width="150" sortable/>
					 <el-table-column prop="quoteWorkload" col-prefix="res." label="报价工时" width="120" sortable>
						<template #default="scope">
							{{scope.row.quoteWorkload?scope.row.quoteWorkload:'-'}}h
						</template>
					</el-table-column>
					<el-table-column prop="quotePrice" label="报价金额" width="120" sortable>

						<template #default="scope">
							￥{{scope.row.quotePrice?scope.row.quotePrice:'-'}}元
						</template>
					</el-table-column>
			</el-table>
			<el-pagination  layout="total, sizes, prev, pager, next" @current-change="handleCurrentChange" @size-change="handleSizeChange" :page-sizes="[10,20, 50, 100, 500]" :current-page="pageInfo.pageNum" :page-size="pageInfo.pageSize"  :total="pageInfo.total" style="float:right;" />

			<mdp-dialog append-to-body title="报价" v-model="quotePriceVisible" width="60%" :close-on-click-modal="false">
				<el-form :model="quotePriceForm" label-width="100px" ref="quotePriceForm">
					<el-form-item label="候选人名称">
						<span>{{ quotePriceForm.bidUsername }}</span>
					</el-form-item>
					<el-form-item label="报价工期" prop="quoteWeekday">
						<div>
						<el-input v-model="quotePriceForm.quoteWeekday" style="width:30%;" type="number" placeholder="报价工期（不包括周六日）" />工作日
						<mdp-date-range
							v-model="quotePriceForm" 
							type="daterange" 
							startKey="quoteStartTime"
							endKey="quoteEndTime"
							unlink-panels
							range-separator="至"
							start-placeholder="开始日期"
							end-placeholder="完成日期"
							value-format="YYYY-MM-DD HH:mm:ss"
							:default-time="['00:00:00','23:59:59']" 
						/>
						</div>
						<el-tag>原来{{editForm.quoteWeekday}},任务要求{{xmTask.startTime}}~{{xmTask.endTime}}</el-tag>
					</el-form-item>
					<el-form-item label="报价工作量" prop="quoteWorkload">
						<el-input v-model="quotePriceForm.quoteWorkload" type="number" placeholder="报价工作量（人时）" />
						<el-tag>原来{{editForm.quoteWorkload}},任务预估{{xmTask.budgetWorkload}}</el-tag>
					</el-form-item>
					<el-form-item label="报价金额" prop="quoteAmount">
						<el-input v-model="quotePriceForm.quoteAmount" type="number" placeholder="报价金额" />
						<el-tag>原来{{editForm.quoteAmount}},任务预算{{xmTask.budgetCost}}</el-tag>
					</el-form-item>
					<el-form-item label="擅长技能" prop="skillRemark">
						<el-input type="textarea" :row="3" v-model="quotePriceForm.skillRemark" placeholder="擅长技能" />
					</el-form-item>
					<el-form-item>
						<el-button @click="quotePriceVisible=false">取消</el-button>
						<el-button v-loading="load.edit"   @click="fillTaskBudgetInfoToQuotePriceForm" :disabled="load.edit==true">按任务预算填充</el-button>
 						<el-button v-loading="load.edit" type="primary" @click="handleQuotePrice" :disabled="load.edit==true">提交</el-button>
					</el-form-item>
				</el-form>
			</mdp-dialog>

			<!--编辑 XmTaskExecuser xm_task_execuser界面-->
			<mdp-dialog append-to-body title="编辑任务执行人" v-model="editFormVisible"  size="60%"  :close-on-click-modal="false">
				<xm-task-execuser-edit :exec-user-list="xmTaskExecusers" :xm-task="xmTask"   :xm-task-execuser="editForm" :visible="editFormVisible" @cancel="editFormVisible=false" @submit="afterEditSubmit" />
			</mdp-dialog>

			<!--新增 XmTaskExecuser xm_task_execuser界面-->
			<mdp-dialog append-to-body title="新增任务执行人" v-model="addFormVisible"  size="60%"  :close-on-click-modal="false">
				<xm-task-execuser-add :exec-user-list="xmTaskExecusers" :xm-task="xmTask" :execuser-add-type="execuserAddType"  :xm-task-execuser="addForm" :visible="addFormVisible" @cancel="addFormVisible=false" @submit="afterAddSubmit" />
			</mdp-dialog>
			<mdp-dialog
				:title="'【'+xmTask.name+'】登记工时'"
				v-model="taskWorkloadVisible"
				width="60%"
				top="20px"
				append-to-body
				:close-on-click-modal="false"
				>
				<xm-workload-edit
					:xm-task="xmTask"
					bizType="1"
					:visible="taskWorkloadVisible"
					op-type="add"
					@cancel="taskWorkloadVisible=false"
					@submit="onTaskWorkloadSubmit"
				/>
			</mdp-dialog> 
	
</template>

<script>
	import util from '@/components/mdp-ui/js/util';//全局公共库
	import config from "@/api/mdp_pub/mdp_config"; //全局公共库 

	import { listXmTaskExecuserWithTask,editXmTaskExecuser,leaveTask,beExecutor,settleExec, delXmTaskExecuser, batchDelXmTaskExecuser,quotePrice,becomeCandidate,toTest,testSuccess,testFail } from '@/api/xm/core/xmTaskExecuser';
	import  XmTaskExecuserAdd from './XmTaskExecuserAdd.vue';//新增界面
	import  XmTaskExecuserEdit from './XmTaskExecuserEdit.vue';//修改界面
	import { mapState } from 'pinia'
import { useUserStore } from '@/store/modules/user' 
  	import XmWorkloadEdit from '@/views/xm/core/xmWorkload/XmWorkloadEdit.vue';
		

		import { MdpTableMixin } from '@/components/mdp-ui/mixin/MdpTableMixin.js';

export default {
	mixins:[MdpTableMixin],
		computed: {
		    ...mapState(useUserStore,[
		      'userInfo','roles'
				]),
			xmTaskCpd:function(){
				if(this.xmTask && this.xmTask.id){
					return this.xmTask
				}
				var xmTask={...this.editForm}
				xmTask.id=this.editForm.taskId;
				return xmTask;
			}
		},
		props: ["visible","isMy","xmTask"],
		watch: {
			'visible': function(val) {
				if(val == true){
					console.log("visible");
					this.searchTableDatas();
				}
			},
		},
		data() {
			return {
				filters: {
					taskName: '',
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
					createTime:'',id:'',taskId:'',bidUserid:'',startTime:'',endTime:'',status:'',remarks:'',settleAmount:'',settleWorkload:'',settleStatus:'',settleTime:'',createUserid:'',createUsername:'',username:'',matchScore:'',quoteWeekday:'',quoteAmount:'',quoteTime:'',bizProcInstId:'',bizFlowState:'',projectId:'',phaseId:'',skillRemark:'',quoteWorkload:'',quoteStartTime:'',quoteEndTime:'',branchId:'',projectPhaseName:'',taskName:''
				},
				/**begin 自定义属性请在下面加 请加备注**/

				settleVisible: false,
				settleForm: {
					settleAmount: '',settleWorkload: '', settleStatus: '',
				},
				settleListVisible:false,
				quotePriceForm: {
					quoteAmount: '',quoteWorkload: '', skillRemark: '',quoteStartTime:'',quoteEndTime:'',id:'',bidUserid:'',bidUsernane:'',taskId:'',
				},
				quotePriceVisible:false,
				readyAdd: [],
				quoteDateRanger: [
				],
				execuserAddType:'add',//add为新增 join为当前登陆者加入
				pickerOptions:  util.getPickerOptions('datarange'),
				tableHeight:300,
				taskWorkloadVisible:false,
				apis:{
					list: listXmTaskExecuserWithTask,
					del: delXmTaskExecuser,
					batchDel: batchDelXmTaskExecuser
				}
				/**end 自定义属性请在上面加 请加备注**/
			}
		},//end data
		methods: { 
			//获取列表 XmTaskExecuser xm_task_execuser
			preQueryParamCheck(params) {
				 
				if(this.isMy=='1'){
					params.isMy='1' 
					params.userid=this.userInfo.userid
				}  
				if(this.xmTask && this.xmTask.id){
					params.taskId=this.xmTask.id
				}    
				return true
			},
			afterLoad(tableDatas){ 
				this.$emit("loadExecUserList",tableDatas);
			},

			//显示编辑界面 XmTaskExecuser xm_task_execuser
			showEdit: function ( row,index ) {
				this.editFormVisible = true;
				this.editForm = Object.assign({}, row);
			},
			//显示新增界面 XmTaskExecuser xm_task_execuser
			showAdd: function () {
				this.execuserAddType="";
				this.addFormVisible = true;

				//this.addForm=Object.assign({}, this.editForm);
			},
			toJoin(){
				this.execuserAddType="join"
				this.addFormVisible = true;
			},
			getWeekday(first, last) {
				//计算工作日方法：遍历这两个日期区间的每一个日期，获取他的getDay()

				//分别获取first和last的毫秒数(时间戳)
				first = first.getTime();
				last = last.getTime();

				var count = 0;
				for (var i = first; i <= last; i += 24 * 3600 * 1000) {
					var d = new Date(i);
					if (d.getDay() >= 1 && d.getDay() <= 5) {
						count++;
					}
				}
				return count;
			},
			showQuotePrice(row){
				this.editForm=row
				this.quotePriceForm=Object.assign({},row);
				this.quoteDateRanger=[];
				this.quoteDateRanger.push(this.quotePriceForm.quoteStartTime);
				this.quoteDateRanger.push(this.quotePriceForm.quoteEndTime);
				this.quotePriceVisible=true;
			},
			afterAddSubmit(){
				this.addFormVisible=false;
				this.pageInfo.count=true;
				this.$emit("after-add-submit",this.addForm);

				this.searchTableDatas();
			},
			afterEditSubmit(){
				this.editFormVisible=false;
				this.searchTableDatas();
				this.$emit("after-edit-submit",this.editForm);
			},
			afterDeleteSubmit(){
				this.searchTableDatas();
				this.$emit("after-delete-submit");
			}, 
			leave(row) {
				row.taskName=this.xmTaskCpd.name
				var selExec = [row].filter(i=>i.status !="7");
				if(selExec.length > 0){
					this.$confirm('确定离开任务吗？', '提示', {}).then(() => {
						this.load.edit=true;
						leaveTask(selExec).then((res) => {
							this.load.edit=false
							var tips=res.tips;
							if(tips.isOk){
								this.afterEditSubmit();
 							}
							this.$notify({position:'bottom-left',showClose:true,message: tips.msg, type: tips.isOk?'success':'error' });
						}).catch( err =>this.load.edit=false);
					});
				}
			},
			execute(row) {
				row.taskName=this.xmTaskCpd.name
 				if( row && row.status=="0"){
					this.$confirm('确定变更为执行人吗？', '提示', {}).then(() => {
						this.load.edit=true;
						beExecutor(row).then((res) => {
							this.load.edit=false
							var tips=res.tips;
							if(tips.isOk){
								this.afterEditSubmit();
							}
							this.$notify({position:'bottom-left',showClose:true,message: tips.msg, type: tips.isOk?'success':'error' });
						}).catch( err =>this.load.edit=false);
					});
				}else if(row.status=="1"){
					 this.$notify.error("已是执行人，无需变更");
				}else if(row.status=="7"){
					 this.$notify.error("已离开任务，不允许变更执行人");
				}else if(row.status=="8"){
					 this.$notify.error("黑名单，不允许参与该任务");
				}else{
					 this.$notify.error("已是执行人，无需变更");
				}
			},
			settle(row) {
				this.editForm=row
				this.settleVisible = true;
			},

			handleSettle() {
				var selExec=this.sels;
				selExec.forEach(l=>{
					l = Object.assign(l,this.settleForm);
				});
				this.$confirm('确定结算吗？', '提示', {}).then(() => {
					this.load.edit=true;
					settleExec(selExec).then((res) => {
						this.load.edit=false
						var tips=res.tips;
						if(tips.isOk){
							this.settleVisible = false;
							this.$refs['settleForm'].resetFields();
							this.afterEditSubmit();
						}
						this.$notify({position:'bottom-left',showClose:true,message: tips.msg, type: tips.isOk?'success':'error' });
					}).catch( err =>this.load.edit=false);
				});
			},

			handleQuotePrice() {
				if(this.quoteDateRanger.length==2){
					this.quotePriceForm.quoteStartTime=this.quoteDateRanger[0]
					this.quotePriceForm.quoteEndTime=this.quoteDateRanger[1]
				}
				this.$confirm('确定提交报价吗？', '提示', {}).then(() => {
					this.load.edit=true;
					quotePrice(this.quotePriceForm).then((res) => {
						this.load.edit=false
						var tips=res.tips;
						if(tips.isOk){
							this.quotePriceVisible = false;
							this.afterEditSubmit();
						}
						this.$notify({position:'bottom-left',showClose:true,message: tips.msg, type: tips.isOk?'success':'error' });
					}).catch( err =>this.load.edit=false);
				});
			},
			fillTaskBudgetInfoToQuotePriceForm(){
				this.quotePriceForm.quoteAmount=this.xmTaskCpd.budgetCost
				this.quotePriceForm.quoteWorkload=this.xmTaskCpd.budgetWorkload
				this.quotePriceForm.quoteStartTime=this.xmTaskCpd.startTime
				this.quotePriceForm.quoteEndTime=this.xmTaskCpd.endTime
				this.quoteDateRanger=[];
				this.quoteDateRanger.push(this.quotePriceForm.quoteStartTime);
				this.quoteDateRanger.push(this.quotePriceForm.quoteEndTime);
				if(!this.quotePriceForm.quoteWeekday){
					this.quotePriceForm.quoteWeekday=this.getWeekday(new Date(this.quotePriceForm.quoteStartTime),new Date(this.quotePriceForm.quoteEndTime));
				}

			},
			fillQuotePriceToSettleForm(){
				this.settleForm.settleAmount=this.editForm.quoteAmount
				this.settleForm.settleWorkload=this.editForm.quoteWorkload
			},
			handleSettleCancel() {
				this.settleVisible = false;
				this.$refs['settleForm'].resetFields();
			}, 
			toAcceptance:function(){

			},
			toTest:function(row){
				var params=row;
				toTest(params).then(res=>{
					var tips = res.tips;
					if(tips.isOk){
						this.searchTableDatas();
					}
					this.$notify({position:'bottom-left',showClose:true,message: tips.msg, type: tips.isOk?'success':'error' });

				})
			},

			testSuccess:function(row){
				var params=row;
				testSuccess(params).then(res=>{
					var tips = res.tips;
					if(tips.isOk){
						this.searchTableDatas();
					}
					this.$notify({position:'bottom-left',showClose:true,message: tips.msg, type: tips.isOk?'success':'error' });

				})
			},

			testFail:function(row){
				var params=row;
				testFail(params).then(res=>{
					var tips = res.tips;
					if(tips.isOk){
						this.searchTableDatas();
					}
					this.$notify({position:'bottom-left',showClose:true,message: tips.msg, type: tips.isOk?'success':'error' });

				})
			},
			showSettleList: function(row){
				this.editForm=row;
				this.settleListVisible=true;
			},
			showApprovaInfo:function(row){
				var msgFields=[];
				if(row.mainTitle!=null && row.mainTitle!=""){
					msgFields.push("流程【"+row.mainTitle+"】");
				}

				if(row.taskName!=null && row.taskName!=""){
					msgFields.push("当前环节【"+row.taskName+"】");
				}

				if(row.assigneeName!=null && row.assigneeName!=""){
					msgFields.push("执行人【"+row.assigneeName+"】");
				}

				if(row.commentMsg!=null && row.commentMsg!=""){
					msgFields.push("审批意见【"+row.commentMsg+"】");
				}
				var msg=msgFields.join(",");
				return msg;
			},
			sendToProcessApprova:function(row,bizKey){
				// 传过来的参数格式
        if(this.settleForm.settleAmount==0||this.settleForm.settleAmount==''){
          this.$notify.error("结算金额为空/0，不允许发审");
          return;
        }
				if(row.flowState=='1'){
					this.$notify.error("审核中，不允许重复发审");
					return;
				}

				var taskName=this.xmTaskCpd.name
				var projectId=this.xmTaskCpd.projectId
				var projectName=this.xmTaskCpd.projectName
				var taskId=this.xmTaskCpd.id
				var branchId=this.userInfo.branchId

				let extVars={projectId:projectId,taskId,taskExecuserId:row.id}
				let jsonExtVars=JSON.stringify(extVars);

				var currDomain=window.location.protocol+"//"+window.location.host;
				var fullPath=this.$route.fullPath;
				var bizUrl=currDomain+'/#'+fullPath+'?extVars='+jsonExtVars


				let params={
					bizKey:bizKey,
					bizUrl:bizUrl,
					resUrl:'',
					bizId:row.id,
					bizPid:projectId,
					mainContext:'',
					extVars:extVars,
					flowVars:{
						subscribeTaskEvent:'TASK_COMPLETED,TASK_CREATED',
						data:{
							projectId:projectId,
							taskId:taskId,
							bidUserid:row.userid,
							settleAmount:this.settleForm.settleAmount,
							settleWorkload:this.settleForm.settleWorkload,
							id:row.id,
							branchId:branchId,
							bidUsername:row.username
						}
					},
				}

				if(bizKey=="xm_task_execuser_settle_approva"){
					//延期审核
					params.mainTitle='['+row.username+']发起关于任务【'+projectName+'-'+taskName+"】结算申请";
					params.mainContext='项目编号：'+projectId+','+'项目名称：'+projectName+',任务名称:'+taskName+',结算金额为:'+this.settleForm.settleAmount+',结算工作量为：'+this.settleForm.settleWorkload;
					params.restUrl=config.getXmCtx()+"/xm/core/xmTaskExecuser/processApprova";
					this.$router.push({ name: 'bizStartProc', query: {paramsId:this.$mdp.setCacheParams(params)} });
					//this.html2canvas(document.querySelector(".settleForm"),row,params);
				}else {
					this.$notify.error("不支持的审批事项");
					return;
				}

				//this.$useXmStore.addVisitedViews( {path:'/mdp/workflow/re/procdef/ProcdefListForBizStart',query:{params:jsonParmas}})
			},
			handleCommand(command) {
				if(command.type=='sendToProcessApprova'){
					this.sendToProcessApprova(command.data,command.bizKey);
				}else if(command.type=='showQuotePrice'){
					this.showQuotePrice(command.data);
				}else if(command.type=='becomeCandidate'){
					this.becomeCandidate(command.data);
				}else if(command.type=='setNoLeader'){
					this.setNoLeader(command.data);
				}else if(command.type=='execute'){
					this.execute(command.data);
				}else if(command.type=='leave'){
					this.leave(command.data);
				}else if(command.type=='showSettleList'){
					this.showSettleList(command.data);
				}else if(command.type=='handleDel'){
					this.handleDel(command.data);
				}else if(command.type=='toJoin'){
					this.editForm=command.data
					this.toJoin();
				}
			},
			// html2canvas(doc,row,params){
			// 	this.load.edit=true;
			// 	this.hideAllBtn(doc,true);
			// 	html2canvas(doc).then(canvas => {

			// 		let dataURL = canvas.toDataURL("image/png");
			// 		uploadBase64({fileData:dataURL,categoryId:'workflow',storedb:'0',branchId:row.branchId,name:row.name+'.png'}).then(res=>{
			// 			this.hideAllBtn(doc,false);
			// 			params.mainContext=params.mainContext+'<br/><img style="max-width:100%;" src="'+res.data.url+'"/>'
			// 			this.$router.push({name:'ProcdefListForBizStart',params:params});
			// 			this.load.edit=false;
			// 		});

			// 	});
			// },
			hideAllBtn:function(doc,hide) {
                var btns = doc.getElementsByTagName('button');
                for (var i = 0; i < btns.length; i++) {
					if(hide==true){
                    	btns[i].style.display='none'
					}else{
						btns[i].style.display=''
					}
                 }
			},
			becomeCandidate(row){
					this.editForm=row
					 var params=JSON.parse(JSON.stringify(row));
					 params.status="0"
 					becomeCandidate(params).then(res=>{
						var tips = res.tips;
						if(tips.isOk){
							this.afterEditSubmit();
						}
						this.$notify({position:'bottom-left',showClose:true,message: tips.msg, type: tips.isOk?'success':'error' });

					})
			},

			setNoLeader(row){
					this.editForm=row
					 var params=JSON.parse(JSON.stringify(row));
					 params.isLeader="0"
					becomeCandidate(params).then(res=>{
						var tips = res.tips;
						if(tips.isOk){
							this.afterEditSubmit();
						}
						this.$notify({position:'bottom-left',showClose:true,message: tips.msg, type: tips.isOk?'success':'error' });

					})
			},
			formatToDoByStatus(row){
				var status=row.status;
				var msg="点我操作"
				if(status=='1' && row.taskState=='1'){
					msg="请及时填报工时";
				}else if(status=='7' && ( row.taskState=='0' || row.taskState=='1')){
					msg="申请成为候选人";
				}else if(status=='0' && ( row.taskState=='0' || row.taskState=='1')){
					msg="申请成为执行人";
				}else if(  status=='1' && (row.taskState=='2' || row.taskState=='3'|| row.taskState=='4' )){
					msg="查看结算清单";
				}
				return msg;
			}, 
			onTaskWorkloadSubmit(){
				this.searchTableDatas();
			},

			showWorkload(row){
				this.taskWorkloadVisible=true;
			}
			/**end 自定义函数请在上面加**/

		},//end methods
		components: {
		    'xm-task-execuser-add':XmTaskExecuserAdd,
		    'xm-task-execuser-edit':XmTaskExecuserEdit, XmWorkloadEdit
		    //在下面添加其它组件
		},
		mounted() {
 

		}
	}

</script>

<style scoped>
.exec-navbar{
	background: #fafbfc;
	padding: 0 20px;
	height: 50px;
	overflow: auto hidden;
	line-height: 50px;
}
.badge {
  margin-top: 7px;
  padding-bottom: 10px;
}
</style>
