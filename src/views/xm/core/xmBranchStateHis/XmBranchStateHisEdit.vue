<template>
	
	    <el-row class="page-header" />
		<el-row class="page-main" :style="{overflowX:'auto',height:maxTableHeight+'px'}" ref="table">
		<!--编辑界面 XmBranchStateHis 机构内所有项目指标汇总-->
			<el-form :model="editForm"  label-width="120px" :rules="editFormRules" ref="editFormRef">
				<el-form-item label="统计日期yyyy-mm-dd类型" prop="bizDate">
					<el-input v-model="editForm.bizDate" placeholder="统计日期yyyy-mm-dd类型"/>
				</el-form-item>
				<el-form-item label="文件数据" prop="totalFileCnt">
					<el-input-number v-model="editForm.totalFileCnt" :min="0" :max="200" />
				</el-form-item>
				<el-form-item label="bug数目" prop="totalBugCnt">
					<el-input-number v-model="editForm.totalBugCnt" :min="0" :max="200" />
				</el-form-item>
				<el-form-item label="任务数" prop="totalTaskCnt">
					<el-input-number v-model="editForm.totalTaskCnt" :min="0" :max="200" />
				</el-form-item>
				<el-form-item label="项目总非人力预算-来自项目表" prop="totalBudgetNouserAmount">
					<el-input v-model="editForm.totalBudgetNouserAmount" placeholder="项目总非人力预算-来自项目表"/>
				</el-form-item>
				<el-form-item label="总参与人数" prop="totalStaffCnt">
					<el-input-number v-model="editForm.totalStaffCnt" :min="0" :max="200" />
				</el-form-item>
				<el-form-item label="统计执行日期" prop="calcTime">
					<el-date-picker type="date" placeholder="选择日期" v-model="editForm.calcTime"  value-format="YYYY-MM-DD HH:mm:ss" format="YYYY-MM-DD" />
				</el-form-item>
				<el-form-item label="0-暂时的1稳定的，暂时的可以被覆盖，稳定的不允许覆盖" prop="calcStatus">
					<el-input v-model="editForm.calcStatus" placeholder="0-暂时的1稳定的，暂时的可以被覆盖，稳定的不允许覆盖"/>
				</el-form-item>
				<el-form-item label="项目总非人力成本" prop="totalCostNouserAmount">
					<el-input v-model="editForm.totalCostNouserAmount" placeholder="项目总非人力成本"/>
				</el-form-item>
				<el-form-item label="已关闭bug总数" prop="totalClosedBugCnt">
					<el-input-number v-model="editForm.totalClosedBugCnt" :min="0" :max="200" />
				</el-form-item>
				<el-form-item label="已解决bug总数" prop="totalResolvedBugCnt">
					<el-input-number v-model="editForm.totalResolvedBugCnt" :min="0" :max="200" />
				</el-form-item>
				<el-form-item label="已完成任务总数-来自任务表" prop="totalCompleteTaskCnt">
					<el-input-number v-model="editForm.totalCompleteTaskCnt" :min="0" :max="200" />
				</el-form-item>
				<el-form-item label="项目阶段计划数" prop="totalPhaseCnt">
					<el-input-number v-model="editForm.totalPhaseCnt" :min="0" :max="200" />
				</el-form-item>
				<el-form-item label="项目阶段计划已完成数" prop="totalCompletePhaseCnt">
					<el-input-number v-model="editForm.totalCompletePhaseCnt" :min="0" :max="200" />
				</el-form-item>
				<el-form-item label="待付款总金额" prop="totalNeedPayAmount">
					<el-input v-model="editForm.totalNeedPayAmount" placeholder="待付款总金额"/>
				</el-form-item>
				<el-form-item label="已付款总金额" prop="totalFinishPayAmount">
					<el-input v-model="editForm.totalFinishPayAmount" placeholder="已付款总金额"/>
				</el-form-item>
				<el-form-item label="待收款总金额" prop="totalNeedColAmount">
					<el-input v-model="editForm.totalNeedColAmount" placeholder="待收款总金额"/>
				</el-form-item>
				<el-form-item label="已收款总金额" prop="totalFinishColAmount">
					<el-input v-model="editForm.totalFinishColAmount" placeholder="已收款总金额"/>
				</el-form-item>
				<el-form-item label="项目总人力成本" prop="totalCostUserAmount">
					<el-input v-model="editForm.totalCostUserAmount" placeholder="项目总人力成本"/>
				</el-form-item>
				<el-form-item label="项目总内部人力预算-来自项目表" prop="totalBudgetIuserAmount">
					<el-input v-model="editForm.totalBudgetIuserAmount" placeholder="项目总内部人力预算-来自项目表"/>
				</el-form-item>
				<el-form-item label="项目总预算工作量-来自项目表" prop="totalPlanWorkload">
					<el-input v-model="editForm.totalPlanWorkload" placeholder="项目总预算工作量-来自项目表"/>
				</el-form-item>
				<el-form-item label="项目风险总数" prop="totalRiskCnt">
					<el-input-number v-model="editForm.totalRiskCnt" :min="0" :max="200" />
				</el-form-item>
				<el-form-item label="已完成风险总数" prop="totalCompleteRiskCnt">
					<el-input-number v-model="editForm.totalCompleteRiskCnt" :min="0" :max="200" />
				</el-form-item>
				<el-form-item label="机构编号" prop="branchId">
					<el-input v-model="editForm.branchId" placeholder="机构编号"/>
				</el-form-item>
				<el-form-item label="机构名称" prop="branchName">
					<el-input v-model="editForm.branchName" placeholder="机构名称"/>
				</el-form-item>
				<el-form-item label="项目总外购人力预算-来自项目表" prop="totalBudgetOuserAmount">
					<el-input v-model="editForm.totalBudgetOuserAmount" placeholder="项目总外购人力预算-来自项目表"/>
				</el-form-item>
				<el-form-item label="已完成工作量-来自计划中实际完成工作量" prop="totalCompleteWorkload">
					<el-input v-model="editForm.totalCompleteWorkload" placeholder="已完成工作量-来自计划中实际完成工作量"/>
				</el-form-item>
				<el-form-item label="项目总内部人力成本金额" prop="totalCostIuserAmount">
					<el-input v-model="editForm.totalCostIuserAmount" placeholder="项目总内部人力成本金额"/>
				</el-form-item>
				<el-form-item label="项目总外购人力成本金额" prop="totalCostOuserAmount">
					<el-input v-model="editForm.totalCostOuserAmount" placeholder="项目总外购人力成本金额"/>
				</el-form-item>
				<el-form-item label="项目进度0~100之间，来自任务表" prop="finishRate">
					<el-input v-model="editForm.finishRate" placeholder="项目进度0~100之间，来自任务表"/>
				</el-form-item>
				<el-form-item label="激活的bug总数" prop="totalActiveBugCnt">
					<el-input-number v-model="editForm.totalActiveBugCnt" :min="0" :max="200" />
				</el-form-item>
				<el-form-item label="已解决bug总数" prop="totalConfirmedBugCnt">
					<el-input-number v-model="editForm.totalConfirmedBugCnt" :min="0" :max="200" />
				</el-form-item>
				<el-form-item label="项目状态，0-初始，1-立项中，2-执行中，3-已结项，4-暂停" prop="projectStatus">
					<el-input v-model="editForm.projectStatus" placeholder="项目状态，0-初始，1-立项中，2-执行中，3-已结项，4-暂停"/>
				</el-form-item>
				<el-form-item label="实际总工作量，来自任务表" prop="totalActWorkload">
					<el-input v-model="editForm.totalActWorkload" placeholder="实际总工作量，来自任务表"/>
				</el-form-item>
				<el-form-item label="实际外购总工作量，来自任务表" prop="totalActOutWorkload">
					<el-input v-model="editForm.totalActOutWorkload" placeholder="实际外购总工作量，来自任务表"/>
				</el-form-item>
				<el-form-item label="实际内部总工作量，来自任务表" prop="totalActInnerWorkload">
					<el-input v-model="editForm.totalActInnerWorkload" placeholder="实际内部总工作量，来自任务表"/>
				</el-form-item>
				<el-form-item label="已经分配到任务的总预算" prop="totalTaskBudgetCostAt">
					<el-input v-model="editForm.totalTaskBudgetCostAt" placeholder="已经分配到任务的总预算"/>
				</el-form-item>
				<el-form-item label="外购任务数，来自任务表" prop="totalTaskOutCnt">
					<el-input v-model="editForm.totalTaskOutCnt" placeholder="外购任务数，来自任务表"/>
				</el-form-item>
				<el-form-item label="待付款笔数" prop="totalNeedPayCnt">
					<el-input v-model="editForm.totalNeedPayCnt" placeholder="待付款笔数"/>
				</el-form-item>
				<el-form-item label="完成付款总比数" prop="totalFinishPayCnt">
					<el-input v-model="editForm.totalFinishPayCnt" placeholder="完成付款总比数"/>
				</el-form-item>
				<el-form-item label="已付款总人数" prop="totalFinishPayUserCnt">
					<el-input v-model="editForm.totalFinishPayUserCnt" placeholder="已付款总人数"/>
				</el-form-item>
				<el-form-item label="待付款总人数" prop="totalNeedPayUserCnt">
					<el-input v-model="editForm.totalNeedPayUserCnt" placeholder="待付款总人数"/>
				</el-form-item>
				<el-form-item label="内部人力总工作量-应该大于或等于阶段计划内部人力总成本" prop="totalPlanIuserWorkload">
					<el-input v-model="editForm.totalPlanIuserWorkload" placeholder="内部人力总工作量-应该大于或等于阶段计划内部人力总成本"/>
				</el-form-item>
				<el-form-item label="外购人力总工作量-应该大于或等于阶段计划外购人力总成本" prop="totalPlanOuserWorkload">
					<el-input v-model="editForm.totalPlanOuserWorkload" placeholder="外购人力总工作量-应该大于或等于阶段计划外购人力总成本"/>
				</el-form-item>
				<el-form-item label="测试用例总数" prop="testCases">
					<el-input-number v-model="editForm.testCases" :min="0" :max="200" />
				</el-form-item>
				<el-form-item label="测试中用例总数" prop="execCases">
					<el-input-number v-model="editForm.execCases" :min="0" :max="200" />
				</el-form-item>
				<el-form-item label="设计中用例总数" prop="designCases">
					<el-input-number v-model="editForm.designCases" :min="0" :max="200" />
				</el-form-item>
				<el-form-item label="完成用例总数" prop="finishCases">
					<el-input-number v-model="editForm.finishCases" :min="0" :max="200" />
				</el-form-item>
				<el-form-item label="迭代数" prop="iterationCnt">
					<el-input-number v-model="editForm.iterationCnt" :min="0" :max="200" />
				</el-form-item>
				<el-form-item label="产品数" prop="productCnt">
					<el-input-number v-model="editForm.productCnt" :min="0" :max="200" />
				</el-form-item>
				<el-form-item label="故事数" prop="menuCnt">
					<el-input-number v-model="editForm.menuCnt" :min="0" :max="200" />
				</el-form-item>
				<el-form-item label="项目数量" prop="projectCnt">
					<el-input-number v-model="editForm.projectCnt" :min="0" :max="200" />
				</el-form-item>
				<el-form-item label="产品总工时" prop="productBudgetWorkload">
					<el-input v-model="editForm.productBudgetWorkload" placeholder="产品总工时"/>
				</el-form-item>
				<el-form-item label="产品实际完成总工作量" prop="productActWorkload">
					<el-input v-model="editForm.productActWorkload" placeholder="产品实际完成总工作量"/>
				</el-form-item>
				<el-form-item label="预估完成工作量" prop="estimateWorkload">
					<el-input v-model="editForm.estimateWorkload" placeholder="预估完成工作量"/>
				</el-form-item>
				<el-form-item label="执行中任务数=任务表开始日期小于当前日期，进度<100的任务" prop="execTaskCnt">
					<el-input-number v-model="editForm.execTaskCnt" :min="0" :max="200" />
				</el-form-item>
				<el-form-item label="待开始的任务数=任务表中开始日期大于当前日期的任务数" prop="toStartTaskCnt">
					<el-input-number v-model="editForm.toStartTaskCnt" :min="0" :max="200" />
				</el-form-item>
				<el-form-item label="执行中需求=需求表中开始日期小于小于当前日期，进度<100的需求" prop="execMenuCnt">
					<el-input-number v-model="editForm.execMenuCnt" :min="0" :max="200" />
				</el-form-item>
				<el-form-item label="待开始需求数=需求表中开始日期大于当前日期的需求数" prop="toStartMenuCnt">
					<el-input-number v-model="editForm.toStartMenuCnt" :min="0" :max="200" />
				</el-form-item>
				<el-form-item label="最早开始日期" prop="minStartTime">
					<el-date-picker type="date" placeholder="选择日期" v-model="editForm.minStartTime"  value-format="YYYY-MM-DD HH:mm:ss" format="YYYY-MM-DD" />
				</el-form-item>
				<el-form-item label="最晚结束时间" prop="maxEndTime">
					<el-date-picker type="date" placeholder="选择日期" v-model="editForm.maxEndTime"  value-format="YYYY-MM-DD HH:mm:ss" format="YYYY-MM-DD" />
				</el-form-item>
			</el-form>
		</el-row>

		<el-row   class="page-bottom bottom-fixed">
		    <el-button @click="handleCancel">取消</el-button>
            <el-button v-loading="load.edit" type="primary" @click="saveSubmit" :disabled="load.edit==true">提交</el-button>
		</el-row>
	
</template>

<script>
	import util from '@/components/mdp-ui/js/util';//全局公共库
	import config from "@/api/mdp_pub/mdp_config"; //全局公共库import

	import { addXmBranchStateHis,editXmBranchStateHis } from '@/api/xm/core/xmBranchStateHis';
	import { mapState } from 'pinia'
import { useUserStore } from '@/store/modules/user'

	export default {
	    name:'xmBranchStateHisEdit',
	    components: {

        },
		computed: {
		    ...mapState(useUserStore,[ 'userInfo'  ]),

		},
		props:['xmBranchStateHis','visible','opType'],

		watch: {
	      'xmBranchStateHis':function( xmBranchStateHis ) {
	        if(xmBranchStateHis){
	            this.editForm = xmBranchStateHis;
	        }

	      },
	      'visible':function(visible) {
	      	if(visible==true){
 	      		this.initData()
	      	}
	      }
	    },
		data() {
			return {
			    currOpType:'add',//add/edit
 				load:{ list: false, edit: false, del: false, add: false },//查询中...
				dicts:{},//下拉选择框的所有静态数据 params={categoryId:'all',itemCodes:['sex']} 返回结果 {sex: [{id:'1',name:'男'},{id:'2',name:'女'}]}
				editFormRules: {
					bizDate: [
						//{ required: true, message: '统计日期yyyy-mm-dd类型不能为空', trigger: 'blur' }
					]
				},
				editForm: {
					bizDate:'',totalFileCnt:'',totalBugCnt:'',totalTaskCnt:'',totalBudgetNouserAmount:'',totalStaffCnt:'',calcTime:'',calcStatus:'',totalCostNouserAmount:'',totalClosedBugCnt:'',totalResolvedBugCnt:'',totalCompleteTaskCnt:'',totalPhaseCnt:'',totalCompletePhaseCnt:'',totalNeedPayAmount:'',totalFinishPayAmount:'',totalNeedColAmount:'',totalFinishColAmount:'',totalCostUserAmount:'',totalBudgetIuserAmount:'',totalPlanWorkload:'',totalRiskCnt:'',totalCompleteRiskCnt:'',branchId:'',branchName:'',totalBudgetOuserAmount:'',totalCompleteWorkload:'',totalCostIuserAmount:'',totalCostOuserAmount:'',finishRate:'',totalActiveBugCnt:'',totalConfirmedBugCnt:'',projectStatus:'',totalActWorkload:'',totalActOutWorkload:'',totalActInnerWorkload:'',totalTaskBudgetCostAt:'',totalTaskOutCnt:'',totalNeedPayCnt:'',totalFinishPayCnt:'',totalFinishPayUserCnt:'',totalNeedPayUserCnt:'',totalPlanIuserWorkload:'',totalPlanOuserWorkload:'',testCases:'',execCases:'',designCases:'',finishCases:'',iterationCnt:'',productCnt:'',menuCnt:'',projectCnt:'',productBudgetWorkload:'',productActWorkload:'',estimateWorkload:'',execTaskCnt:'',toStartTaskCnt:'',execMenuCnt:'',toStartMenuCnt:'',minStartTime:'',maxEndTime:''
				},
                maxTableHeight:300,
			}//end return
		},//end data
		methods: {
			// 取消按钮点击 父组件监听@cancel="editFormVisible=false" 监听
			handleCancel:function(){
				this.$refs['editFormRef'].resetFields();
				this.$emit('cancel');
			},
			//新增、编辑提交XmBranchStateHis 机构内所有项目指标汇总父组件监听@submit="afterEditSubmit"
			saveSubmit: function () {
				this.$refs.editFormRef.validate((valid) => {
					if (valid) {
						this.$confirm('确认提交吗？', '提示', {}).then(() => {
							this.load.edit=true
							let params = Object.assign({}, this.editForm);
							var func=addXmBranchStateHis
							if(this.currOpType=='edit'){
							    func=editXmBranchStateHis
							}
							func(params).then((res) => {
                                this.load.edit=false
                                var tips=res.tips;
                                if(tips.isOk){
                                    this.editForm=res.data
                                    this.initData()
                                    this.currOpType="edit";
                                    this.$emit('submit');//  @submit="afterAddSubmit"
                                }
                                this.$notify({position:'bottom-left',showClose:true, message: tips.msg, type: tips.isOk?'success':'error' });
                            }).catch( err =>this.load.edit=false);
						});
					}else{
					    this.$notify({position:'bottom-left',showClose:true, message: "表单验证不通过，请修改表单数据再提交", type: 'error' });
					}
				});
			},
			initData: function(){
			    this.currOpType=this.opType
			    if(this.xmBranchStateHis){
                    this.editForm = Object.assign({},this.xmBranchStateHis);
                }

                if(this.opType=='edit'){

                }else{

                }
            },

		},//end method
		mounted() {
		    this.$nextTick(() => {

                this.initData()
                //this.maxTableHeight =util.calcTableMaxHeight(this.$refs.table.$el)
            });
		}
	}

</script>

<style scoped>

</style>
