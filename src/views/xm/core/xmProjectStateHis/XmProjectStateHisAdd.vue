<template>
	
		<el-row>
			<!--新增界面 XmProjectStateHis xm_project_state_his-->
			<el-form :model="addForm"  label-width="120px" :rules="addFormRules" ref="addForm">
				<el-form-item label="项目编号" prop="projectId">
					<el-input v-model="addForm.projectId" placeholder="项目编号" />
				</el-form-item>
				<el-form-item label="统计日期yyyy-mm-dd类型" prop="bizDate">
					<el-input v-model="addForm.bizDate" placeholder="统计日期yyyy-mm-dd类型" />
				</el-form-item>
				<el-form-item label="文件数据" prop="totalFileCnt">
					<el-input-number v-model="addForm.totalFileCnt" :min="0" :max="200" />
				</el-form-item>
				<el-form-item label="bug数目" prop="totalBugCnt">
					<el-input-number v-model="addForm.totalBugCnt" :min="0" :max="200" />
				</el-form-item>
				<el-form-item label="任务数" prop="totalTaskCnt">
					<el-input-number v-model="addForm.totalTaskCnt" :min="0" :max="200" />
				</el-form-item>
				<el-form-item label="项目总非人力预算-来自项目表" prop="totalBudgetNouserAmount">
					<el-input v-model="addForm.totalBudgetNouserAmount" placeholder="项目总非人力预算-来自项目表"/>
				</el-form-item>
				<el-form-item label="项目名称" prop="projectName">
					<el-input v-model="addForm.projectName" placeholder="项目名称" />
				</el-form-item>
				<el-form-item label="xm_project_state原表主键id" prop="stateId">
					<el-input v-model="addForm.stateId" placeholder="xm_project_state原表主键id" />
				</el-form-item>
				<el-form-item label="总参与人数" prop="totalStaffCnt">
					<el-input-number v-model="addForm.totalStaffCnt" :min="0" :max="200" />
				</el-form-item>
				<el-form-item label="统计执行日期" prop="calCtime">
					<el-date-picker type="date" placeholder="选择日期" v-model="addForm.calCtime" value-format="YYYY-MM-DD HH:mm:ss" format="YYYY-MM-DD" />
				</el-form-item>
				<el-form-item label="0-暂时的1稳定的，暂时的可以被覆盖，稳定的不允许覆盖" prop="calStatus">
					<el-input v-model="addForm.calStatus" placeholder="0-暂时的1稳定的，暂时的可以被覆盖，稳定的不允许覆盖" />
				</el-form-item>
				<el-form-item label="项目总非人力成本" prop="totalCostNouserAmount">
					<el-input v-model="addForm.totalCostNouserAmount" placeholder="项目总非人力成本"/>
				</el-form-item>
				<el-form-item label="已关闭bug总数" prop="totalCloseBugCnt">
					<el-input-number v-model="addForm.totalCloseBugCnt" :min="0" :max="200" />
				</el-form-item>
				<el-form-item label="已解决bug总数" prop="totalResolveBugCnt">
					<el-input-number v-model="addForm.totalResolveBugCnt" :min="0" :max="200" />
				</el-form-item>
				<el-form-item label="已完成任务总数-来自任务表" prop="totalCompleteTaskCnt">
					<el-input-number v-model="addForm.totalCompleteTaskCnt" :min="0" :max="200" />
				</el-form-item>
				<el-form-item label="项目计划数" prop="totalPhaseCnt">
					<el-input-number v-model="addForm.totalPhaseCnt" :min="0" :max="200" />
				</el-form-item>
				<el-form-item label="项目计划已完成数" prop="totalCompletePhaseCnt">
					<el-input-number v-model="addForm.totalCompletePhaseCnt" :min="0" :max="200" />
				</el-form-item>
				<el-form-item label="待付款总金额" prop="totalNeedPayAmount">
					<el-input v-model="addForm.totalNeedPayAmount" placeholder="待付款总金额"/>
				</el-form-item>
				<el-form-item label="已付款总金额" prop="totalFinishPayAmount">
					<el-input v-model="addForm.totalFinishPayAmount" placeholder="已付款总金额"/>
				</el-form-item>
				<el-form-item label="待收款总金额" prop="totalNeedColAmount">
					<el-input v-model="addForm.totalNeedColAmount" placeholder="待收款总金额"/>
				</el-form-item>
				<el-form-item label="已收款总金额" prop="totalFinishColAmount">
					<el-input v-model="addForm.totalFinishColAmount" placeholder="已收款总金额"/>
				</el-form-item>
				<el-form-item label="项目总人力成本" prop="totalCostUserAmount">
					<el-input v-model="addForm.totalCostUserAmount" placeholder="项目总人力成本"/>
				</el-form-item>
				<el-form-item label="项目总内部人力预算-来自项目表" prop="totalBudgetIuserAmount">
					<el-input v-model="addForm.totalBudgetIuserAmount" placeholder="项目总内部人力预算-来自项目表"/>
				</el-form-item>
				<el-form-item label="项目总预算工作量-来自项目表" prop="totalPlanWorkload">
					<el-input v-model="addForm.totalPlanWorkload" placeholder="项目总预算工作量-来自项目表"/>
				</el-form-item>
				<el-form-item label="项目风险总数" prop="totalRiskCnt">
					<el-input-number v-model="addForm.totalRiskCnt" :min="0" :max="200" />
				</el-form-item>
				<el-form-item label="已完成风险总数" prop="totalCompleteRiskCnt">
					<el-input-number v-model="addForm.totalCompleteRiskCnt" :min="0" :max="200" />
				</el-form-item>
				<el-form-item label="机构编号" prop="branchId">
					<el-input v-model="addForm.branchId" placeholder="机构编号" />
				</el-form-item>
				<el-form-item label="机构名称" prop="branchName">
					<el-input v-model="addForm.branchName" placeholder="机构名称" />
				</el-form-item>
				<el-form-item label="项目总外购人力预算-来自项目表" prop="totalBudgetOuserAmount">
					<el-input v-model="addForm.totalBudgetOuserAmount" placeholder="项目总外购人力预算-来自项目表"/>
				</el-form-item>
				<el-form-item label="已完成工作量-来自计划中实际完成工作量" prop="totalCompleteWorkload">
					<el-input v-model="addForm.totalCompleteWorkload" placeholder="已完成工作量-来自计划中实际完成工作量"/>
				</el-form-item>
				<el-form-item label="本表主键" prop="id">
					<el-input v-model="addForm.id" placeholder="本表主键" />
				</el-form-item>
				<el-form-item>
					<el-col :span="24" :offset="8">
						<el-button @click="handleCancel">取消</el-button>
						<el-button v-loading="load.add" type="primary" @click="addSubmit" :disabled="load.add==true">提交</el-button>
					</el-col>
				</el-form-item>
			</el-form>
		</el-row>
	
</template>

<script>
	import util from '@/components/mdp-ui/js/util';//全局公共库

	import { addXmProjectStateHis } from '@/api/xm/core/xmProjectStateHis';
	import { mapState } from 'pinia'
import { useUserStore } from '@/store/modules/user'

	export default {
		computed: {
		    ...mapState(useUserStore,[
		      'userInfo','roles'
		    ])
		},
		props:['xmProjectStateHis','visible'],
		watch: {
	      'xmProjectStateHis':function( xmProjectStateHis ) {
	        this.addForm = xmProjectStateHis;
	      },
	      'visible':function(visible) {
	      	if(visible==true){
	      		//从新打开页面时某些数据需要重新加载，可以在这里添加
	      	}
	      }
	    },
		data() {
			return {
				dicts:{},//下拉选择框的所有静态数据  params=[{categoryId:'0001',itemCode:'sex'}] 返回结果 {'sex':[{optionValue:'1',optionName:'男',seqOrder:'1',fp:'',isDefault:'0'},{optionValue:'2',optionName:'女',seqOrder:'2',fp:'',isDefault:'0'}]}
				load:{ list: false, edit: false, del: false, add: false },//查询中...
				addFormRules: {
					id: [
						//{ required: true, message: '本表主键不能为空', trigger: 'blur' }
					]
				},
				//新增界面数据 xm_project_state_his
				addForm: {
					projectId:'',bizDate:'',totalFileCnt:'',totalBugCnt:'',totalTaskCnt:'',totalBudgetNouserAmount:'',projectName:'',stateId:'',totalStaffCnt:'',calCtime:'',calStatus:'',totalCostNouserAmount:'',totalCloseBugCnt:'',totalResolveBugCnt:'',totalCompleteTaskCnt:'',totalPhaseCnt:'',totalCompletePhaseCnt:'',totalNeedPayAmount:'',totalFinishPayAmount:'',totalNeedColAmount:'',totalFinishColAmount:'',totalCostUserAmount:'',totalBudgetIuserAmount:'',totalPlanWorkload:'',totalRiskCnt:'',totalCompleteRiskCnt:'',branchId:'',branchName:'',totalBudgetOuserAmount:'',totalCompleteWorkload:'',id:''
				}
				/**begin 在下面加自定义属性,记得补上面的一个逗号**/

				/**end 在上面加自定义属性**/
			}//end return
		},//end data
		methods: {
			// 取消按钮点击 父组件监听@cancel="addFormVisible=false" 监听
			handleCancel:function(){
				this.$refs['addForm'].resetFields();
				this.$emit('cancel');
			},
			//新增提交XmProjectStateHis xm_project_state_his 父组件监听@submit="afterAddSubmit"
			addSubmit: function () {

				this.$refs.addForm.validate((valid) => {
					if (valid) {

						this.$confirm('确认提交吗？', '提示', {}).then(() => {
							this.load.add=true
							let params = Object.assign({}, this.addForm);
							addXmProjectStateHis(params).then((res) => {
								this.load.add=false
								var tips=res.tips;
								if(tips.isOk){
									this.$refs['addForm'].resetFields();
									this.$emit('submit');//  @submit="afterAddSubmit"
								}
								this.$notify({position:'bottom-left',showClose:true,message: tips.msg, type: tips.isOk?'success':'error' });
							}).catch( err  => this.load.add=false);
						});
					}
				});
			}
			/**begin 在下面加自定义方法,记得补上面的一个逗号**/

			/**end 在上面加自定义方法**/

		},//end method
		components: {
		    //在下面添加其它组件 'xm-project-state-his-edit':XmProjectStateHisEdit
		},
		mounted() {
			this.addForm=Object.assign(this.addForm, this.xmProjectStateHis);
			/**在下面写其它函数***/

		}//end mounted
	}

</script>

<style scoped>

</style>
