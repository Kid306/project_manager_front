<template>
	
		<el-row>
			<!--新增界面 XmProjectTaskTypeState 按任务类型汇总-->
			<el-form :model="addForm"  label-width="120px" :rules="addFormRules" ref="addForm">
				<el-form-item label="项目编号" prop="projectId">
					<el-input v-model="addForm.projectId" placeholder="项目编号" />
				</el-form-item>
				<el-form-item label="项目名称" prop="projectName">
					<el-input v-model="addForm.projectName" placeholder="项目名称" />
				</el-form-item>
				<el-form-item label="任务类型" prop="taskType">
					<el-input v-model="addForm.taskType" placeholder="任务类型" />
				</el-form-item>
				<el-form-item label="工作量" prop="planWorkload">
					<el-input v-model="addForm.planWorkload" placeholder="工作量"/>
				</el-form-item>
				<el-form-item label="预算金额" prop="planAmount">
					<el-input v-model="addForm.planAmount" placeholder="预算金额"/>
				</el-form-item>
				<el-form-item label="实际完成工作量" prop="actWorkload">
					<el-input v-model="addForm.actWorkload" placeholder="实际完成工作量"/>
				</el-form-item>
				<el-form-item label="实际完成金额" prop="actAmount">
					<el-input v-model="addForm.actAmount" placeholder="实际完成金额"/>
				</el-form-item>
				<el-form-item label="机构编号" prop="branchId">
					<el-input v-model="addForm.branchId" placeholder="机构编号" />
				</el-form-item>
				<el-form-item label="业务日期YYYY-MM-DD型" prop="bizDate">
					<el-input v-model="addForm.bizDate" placeholder="业务日期YYYY-MM-DD型" />
				</el-form-item>
				<el-form-item label="计算日期" prop="calcTime">
					<el-date-picker type="date" placeholder="选择日期" v-model="addForm.calcTime" value-format="YYYY-MM-DD HH:mm:ss" format="YYYY-MM-DD" />
				</el-form-item>
				<el-form-item label="外购资金预算" prop="planOuserAt">
					<el-input v-model="addForm.planOuserAt" placeholder="外购资金预算"/>
				</el-form-item>
				<el-form-item label="内购资金预算" prop="planIuserAt">
					<el-input v-model="addForm.planIuserAt" placeholder="内购资金预算"/>
				</el-form-item>
				<el-form-item label="实际外购成本" prop="actOuserAt">
					<el-input v-model="addForm.actOuserAt" placeholder="实际外购成本"/>
				</el-form-item>
				<el-form-item label="实际内购成本" prop="actIuserAt">
					<el-input v-model="addForm.actIuserAt" placeholder="实际内购成本"/>
				</el-form-item>
				<el-form-item label="计划外购工作量" prop="planOuserWorkload">
					<el-input v-model="addForm.planOuserWorkload" placeholder="计划外购工作量"/>
				</el-form-item>
				<el-form-item label="计划内购工作量" prop="planIuserWorkload">
					<el-input v-model="addForm.planIuserWorkload" placeholder="计划内购工作量"/>
				</el-form-item>
				<el-form-item label="实际外购工作量" prop="actOuserWorkload">
					<el-input v-model="addForm.actOuserWorkload" placeholder="实际外购工作量"/>
				</el-form-item>
				<el-form-item label="实际内购工作量" prop="actIuserWorkload">
					<el-input v-model="addForm.actIuserWorkload" placeholder="实际内购工作量"/>
				</el-form-item>
				<el-form-item label="计划非人力成本" prop="planNouserAt">
					<el-input v-model="addForm.planNouserAt" placeholder="计划非人力成本"/>
				</el-form-item>
				<el-form-item label="实际非人力成本" prop="actNouserAt">
					<el-input v-model="addForm.actNouserAt" placeholder="实际非人力成本"/>
				</el-form-item>
				<el-form-item label="主键" prop="id">
					<el-input v-model="addForm.id" placeholder="主键" />
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

	import { addXmProjectTaskTypeState } from '@/api/xm/core/xmProjectTaskTypeState';
	import { mapState } from 'pinia'
import { useUserStore } from '@/store/modules/user'

	export default {
		computed: {
		    ...mapState(useUserStore,[
		      'userInfo','roles'
		    ])
		},
		props:['xmProjectTaskTypeState','visible'],
		watch: {
	      'xmProjectTaskTypeState':function( xmProjectTaskTypeState ) {
	        this.addForm = xmProjectTaskTypeState;
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
						//{ required: true, message: '主键不能为空', trigger: 'blur' }
					]
				},
				//新增界面数据 按任务类型汇总
				addForm: {
					projectId:'',projectName:'',taskType:'',planWorkload:'',planAmount:'',actWorkload:'',actAmount:'',branchId:'',bizDate:'',calcTime:'',planOuserAt:'',planIuserAt:'',actOuserAt:'',actIuserAt:'',planOuserWorkload:'',planIuserWorkload:'',actOuserWorkload:'',actIuserWorkload:'',planNouserAt:'',actNouserAt:'',id:''
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
			//新增提交XmProjectTaskTypeState 按任务类型汇总 父组件监听@submit="afterAddSubmit"
			addSubmit: function () {

				this.$refs.addForm.validate((valid) => {
					if (valid) {

						this.$confirm('确认提交吗？', '提示', {}).then(() => {
							this.load.add=true
							let params = Object.assign({}, this.addForm);
							addXmProjectTaskTypeState(params).then((res) => {
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
			},
			/**begin 在下面加自定义方法,记得补上面的一个逗号**/

			/**end 在上面加自定义方法**/

		},//end method
		components: {
		    //在下面添加其它组件 'xm-project-task-type-state-edit':XmProjectTaskTypeStateEdit
		},
		mounted() {
			this.addForm=Object.assign(this.addForm, this.xmProjectTaskTypeState);
			/**在下面写其它函数***/

		}//end mounted
	}

</script>

<style scoped>

</style>
