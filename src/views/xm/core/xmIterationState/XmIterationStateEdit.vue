<template>
	
	    <el-row class="page-header" />
		<el-row class="page-main" :style="{overflowX:'auto',height:maxTableHeight+'px'}" ref="table">
		<!--编辑界面 XmIterationState 迭代定义-->
			<el-form :model="editForm"  label-width="120px" :rules="editFormRules" ref="editFormRef">
				<el-form-item label="已分配到任务的预算从任务表汇总而来" prop="distBudgetCost">
					<el-input v-model="editForm.distBudgetCost" placeholder="已分配到任务的预算从任务表汇总而来"/>
				</el-form-item>
				<el-form-item label="已分配到任务的预算工作量从任务表汇总而来" prop="distBudgetWorkload">
					<el-input v-model="editForm.distBudgetWorkload" placeholder="已分配到任务的预算工作量从任务表汇总而来"/>
				</el-form-item>
				<el-form-item label="实际成本从任务表汇总而来" prop="actCost">
					<el-input v-model="editForm.actCost" placeholder="实际成本从任务表汇总而来"/>
				</el-form-item>
				<el-form-item label="实际工作量从任务表汇总而来" prop="actWorkload">
					<el-input v-model="editForm.actWorkload" placeholder="实际工作量从任务表汇总而来"/>
				</el-form-item>
				<el-form-item label="实际投入人员数" prop="actStaffNum">
					<el-input v-model="editForm.actStaffNum" placeholder="实际投入人员数"/>
				</el-form-item>
				<el-form-item label="进度" prop="finishRate">
					<el-input v-model="editForm.finishRate" placeholder="进度"/>
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
				<el-form-item label="关联项目数" prop="projectCnt">
					<el-input-number v-model="editForm.projectCnt" :min="0" :max="200" />
				</el-form-item>
				<el-form-item label="关联产品数" prop="productCnt">
					<el-input-number v-model="editForm.productCnt" :min="0" :max="200" />
				</el-form-item>
				<el-form-item label="关联故事数" prop="menuCnt">
					<el-input-number v-model="editForm.menuCnt" :min="0" :max="200" />
				</el-form-item>
				<el-form-item label="关联任务数" prop="taskCnt">
					<el-input-number v-model="editForm.taskCnt" :min="0" :max="200" />
				</el-form-item>
				<el-form-item label="已完成的任务数" prop="taskFinishCnt">
					<el-input-number v-model="editForm.taskFinishCnt" :min="0" :max="200" />
				</el-form-item>
				<el-form-item label="计算日期" prop="calcTime">
					<el-date-picker type="date" placeholder="选择日期" v-model="editForm.calcTime"  value-format="YYYY-MM-DD HH:mm:ss" format="YYYY-MM-DD" />
				</el-form-item>
				<el-form-item label="迭代名称" prop="iterationName">
					<el-input v-model="editForm.iterationName" placeholder="迭代名称"/>
				</el-form-item>
				<el-form-item label="预算成本" prop="budgetCost">
					<el-input v-model="editForm.budgetCost" placeholder="预算成本"/>
				</el-form-item>
				<el-form-item label="预算工作量" prop="budgetWorkload">
					<el-input v-model="editForm.budgetWorkload" placeholder="预算工作量"/>
				</el-form-item>
				<el-form-item label="迭代编号" prop="iterationId">
					<el-input v-model="editForm.iterationId" placeholder="迭代编号"/>
				</el-form-item>
				<el-form-item label="业务日期YYYY-MM-DD字符串" prop="bizDate">
					<el-input v-model="editForm.bizDate" placeholder="业务日期YYYY-MM-DD字符串"/>
				</el-form-item>
				<el-form-item label="已关闭bug总数" prop="closedBugCnt">
					<el-input-number v-model="editForm.closedBugCnt" :min="0" :max="200" />
				</el-form-item>
				<el-form-item label="已解决bug总数" prop="resolvedBugCnt">
					<el-input-number v-model="editForm.resolvedBugCnt" :min="0" :max="200" />
				</el-form-item>
				<el-form-item label="激活的bug总数" prop="activeBugCnt">
					<el-input-number v-model="editForm.activeBugCnt" :min="0" :max="200" />
				</el-form-item>
				<el-form-item label="已解决bug总数" prop="confirmedBugCnt">
					<el-input-number v-model="editForm.confirmedBugCnt" :min="0" :max="200" />
				</el-form-item>
				<el-form-item label="bug总数" prop="bugCnt">
					<el-input-number v-model="editForm.bugCnt" :min="0" :max="200" />
				</el-form-item>
				<el-form-item label="预估工时=计划结束时间在计算当日前完成的任务的预算工时总和" prop="estimateWorkload">
					<el-input v-model="editForm.estimateWorkload" placeholder="预估工时=计划结束时间在计算当日前完成的任务的预算工时总和"/>
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

	import { addXmIterationState,editXmIterationState } from '@/api/xm/core/xmIterationState';
	import { mapState } from 'pinia'
import { useUserStore } from '@/store/modules/user'

	export default {
	    name:'xmIterationStateEdit',
	    components: {

        },
		computed: {
		    ...mapState(useUserStore,[ 'userInfo'  ]),

		},
		props:['xmIterationState','visible','opType'],

		watch: {
	      'xmIterationState':function( xmIterationState ) {
	        if(xmIterationState){
	            this.editForm = xmIterationState;
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
					iterationId: [
						//{ required: true, message: '迭代编号不能为空', trigger: 'blur' }
					]
				},
				editForm: {
					distBudgetCost:'',distBudgetWorkload:'',actCost:'',actWorkload:'',actStaffNum:'',finishRate:'',testCases:'',execCases:'',designCases:'',finishCases:'',projectCnt:'',productCnt:'',menuCnt:'',taskCnt:'',taskFinishCnt:'',calcTime:'',iterationName:'',budgetCost:'',budgetWorkload:'',iterationId:'',bizDate:'',closedBugCnt:'',resolvedBugCnt:'',activeBugCnt:'',confirmedBugCnt:'',bugCnt:'',estimateWorkload:'',minStartTime:'',maxEndTime:''
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
			//新增、编辑提交XmIterationState 迭代定义父组件监听@submit="afterEditSubmit"
			saveSubmit: function () {
				this.$refs.editFormRef.validate((valid) => {
					if (valid) {
						this.$confirm('确认提交吗？', '提示', {}).then(() => {
							this.load.edit=true
							let params = Object.assign({}, this.editForm);
							var func=addXmIterationState
							if(this.currOpType=='edit'){
							    func=editXmIterationState
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
			    if(this.xmIterationState){
                    this.editForm = Object.assign({},this.xmIterationState);
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
