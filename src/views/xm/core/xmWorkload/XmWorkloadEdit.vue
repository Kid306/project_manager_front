<template>
	<!--编辑界面 XmWorkload 工时登记表-->
	<el-form :model="editForm" label-width="120px" :rules="editFormRules" ref="editFormRef">
		<el-row>
			<el-col :span="12">
				<el-form-item label="预估工时" prop="budgetWorkload">
					{{ val.budgetWorkload ? val.budgetWorkload : 0 }}&nbsp;&nbsp;小时 <font color="red"> &nbsp;&nbsp;>>&nbsp;
						&nbsp;{{ budgetWorkload }} &nbsp;小时</font>
				</el-form-item>
			</el-col>
			<el-col :span="12">
				<el-form-item label="已登工时" prop="actWorkload">
					{{ val.actWorkload ? val.actWorkload : 0 }}&nbsp;小时, <el-tag type="primary"> {{ val.rate }}% </el-tag><el-tag
						type="danger">&nbsp;&nbsp;>>&nbsp; &nbsp;{{ rate }}% &nbsp;</el-tag>
				</el-form-item>
			</el-col>

			<el-col :span="12">
				<el-form-item label="业务日期" prop="bizDate">
					<el-date-picker style="width:100%" v-model="editForm.bizDate" value-format="YYYY-MM-DD" format="YYYY-MM-DD"
						placeholder="业务日期" />
				</el-form-item>
			</el-col>
			<el-col :span="12">
				<el-form-item label="工作类型" prop="ttype">
					<mdp-select itemCode="taskType" v-model="editForm.ttype" width="100%" />
				</el-form-item>
			</el-col>

			<el-col :span="12">
				<el-form-item label="计时方式" prop="workloadFillType">
					<mdp-select v-model="workloadFillType" itemCode="workloadFillType" width="100%">
						<!-- <el-option value="1" label="正常报工(都适用)"/>
								<el-option value="2" label="按报价工时减去已登记工时一次性填满（适合众包报价任务）"/>
								<el-option value="3" label="按预估工时减去已登记工时一次性填满（适合不严格要求报工，但为了统计进度等）"/> -->
					</mdp-select>
				</el-form-item>
			</el-col>
			<el-col :span="12">
				<el-form-item label="工作时长" prop="workload">
					<el-input type="number" :step="8" :min="0" :max="1000" v-model="editForm.workload" placeholder="工作时长">
						<template #suffix>
							小时
						</template>
					</el-input>

				</el-form-item>
			</el-col>

			<el-col :span="12">
				<el-form-item label="工时归属" prop="username">
					<xm-user-select :xm-product="xmProductCpd" :sel-project="selProjectCpd" width="100%" label="工时归属" v-model="editForm.userid" :init-name="editForm.username" @change2="onUserSelect"/>
				</el-form-item>
			</el-col>

			<el-col :span="12" v-if="workloadFillType == '2'">
				<el-form-item label="报价工时" prop="quoteWorkload">
					{{ execuser ? execuser.quoteWorkload : 0 }}h
				</el-form-item>
			</el-col>

			<el-col :span="24">
				<el-form-item label="未来工时" prop="rworkload">
					<el-input :step="8" :max="1000" type="number" v-model="editForm.rworkload" placeholder="预计还要多少工时能够完成工作">
						<template #suffix>
							小时
						</template>
					</el-input>
					<el-text type="info">注意：未来工时指完成工作还需要继续投入的工时，一般在原始预估出现比较大的偏差时，需要对预估偏差进行重新调整才填写。0代表百分百完成</el-text>

				</el-form-item>
			</el-col>
		</el-row>

		<el-form-item label="工作说明" prop="remark">
			<el-input type="textarea" :autosize="{ minRows: 6, maxRows: 20 }" v-model="editForm.remark"
				placeholder="工作说明，如果报工大于8小时，请填写说明" />
		</el-form-item>
	</el-form>

	<el-row class="footer">
		<el-button @click="handleCancel">取消</el-button>
		<el-button v-loading="load.edit" type="primary" @click="saveSubmit" :disabled="load.edit == true">提交</el-button>
	</el-row>
</template>

<script>
import util from '@/components/mdp-ui/js/util';//全局公共库
import config from "@/api/mdp_pub/mdp_config"; //全局公共库import

import { addXmWorkload, editXmWorkload } from '@/api/xm/core/xmWorkload';
import { listXmTaskExecuser } from '@/api/xm/core/xmTaskExecuser';

import { mapState } from 'pinia'
import { useUserStore } from '@/store/modules/user'

export default {
	name: 'xmWorkloadEdit',
	components: {
	},
	computed: {
		...mapState(useUserStore, ['userInfo']),

		budgetWorkload() {
			if (this.editForm.rworkload !== null && this.editForm.rworkload !== '' && this.editForm.rworkload >= 0) {
				return parseFloat(this.editForm.rworkload) + parseFloat(this.editForm.workload > 0 ? this.editForm.workload : 0) + parseFloat(this.val.actWorkload > 0 ? this.val.actWorkload : 0)
			} else {
				return this.val.budgetWorkload;
			}
		},

		rate() {
			if (this.editForm.rworkload >= 0 && this.budgetWorkload > 0) {
				return Math.round((parseFloat(this.editForm.workload ? this.editForm.workload : 0) + parseFloat(this.val.actWorkload ? this.val.actWorkload : 0)) / this.budgetWorkload * 100)
			} else {
				if (this.val.budgetWorkload > 0) {
					return Math.round((parseFloat(this.editForm.workload > 0 ? this.editForm.workload : 0) + parseFloat(this.val.actWorkload > 0 ? this.val.actWorkload : 0)) / this.val.budgetWorkload * 100);
				} else {
					return 0;
				}

			}
		},
		val() {
			var params = {}
			if (this.xmTask && this.xmTask.id) {
				params.id = this.xmTask.id
				params.initWorkload = this.xmTask.initWorkload
				params.budgetWorkload = this.xmTask.budgetWorkload
				params.actWorkload = this.xmTask.actWorkload
				params.ntype = this.xmTask.ntype
				params.name = this.xmTask.name


			}
			if (this.xmMenu && this.xmMenu.menuId) {
				params.menuId = this.xmMenu.menuId
				params.initWorkload = this.xmMenu.initWorkload
				params.budgetWorkload = this.xmMenu.budgetWorkload
				params.actWorkload = this.xmMenu.actWorkload
				params.ntype = this.xmMenu.ntype
				params.dclass = this.xmMenu.dclass
				params.name = this.xmMenu.name
				params.menuName = this.xmMenu.menuName
			}
			if (this.xmQuestion && this.xmQuestion.id) {
				params.id = this.xmQuestion.id
				params.initWorkload = this.xmQuestion.initWorkload
				params.budgetWorkload = this.xmQuestion.budgetWorkload
				params.actWorkload = this.xmQuestion.actWorkload
				params.name = this.xmQuestion.name
			}
			if (this.xmTestCase && this.xmTestCase.id) {
				params.id = this.xmTestCase.id
				params.initWorkload = this.xmTestCase.initWorkload
				params.budgetWorkload = this.xmTestCase.budgetWorkload
				params.actWorkload = this.xmTestCase.actWorkload
				params.name = this.xmTestCase.caseName
				params.caseName = this.xmTestCase.caseName
			}
			if (this.xmTestPlanCase && this.xmTestPlanCase.planId) {
				params.planId = this.xmTestPlanCase.planId
				params.caseId = this.xmTestPlanCase.caseId
				params.initWorkload = this.xmTestPlanCase.initWorkload
				params.budgetWorkload = this.xmTestPlanCase.budgetWorkload
				params.actWorkload = this.xmTestPlanCase.actWorkload
				params.name = this.xmTestPlanCase.caseName
				params.caseName = this.xmTestPlanCase.caseName
			}
			if (params.budgetWorkload > 0) {
				params.rate = parseInt((params.actWorkload > 0 ? params.actWorkload : 0) / params.budgetWorkload * 100)
			} else {
				params.rate = 0
			}
			return params
		},
		xmProductCpd(){
			let product={}
			if(this.xmTask?.id && this.xmTask?.productId){
				product.id=this.xmTask.productId
				product.productName=this.xmTask.productName
			}else if(this.xmMenu?.menuId){
				product.id=this.xmMenu.productId
				product.productName=this.xmMenu.productName
			}else if(this.xmTestCase?.id){ 
				product.id=this.xmTestCase.productId
				product.productName=this.xmTestCase.productName
			}else if(this.xmQuestion?.id){ 
				product.id=this.xmQuestion.productId
				product.productName=this.xmQuestion.productName
			}else if(this.xmTestPlanCase?.planId){ 
				product.id=this.xmTestPlanCase.productId
				product.productName=this.xmTestPlanCase.productName
			}
			if(product?.id){
				return product
			}else{
				return null
			}
		},
		
		selProjectCpd(){
			let project={}
			if(this.xmTask?.id && this.xmTask?.projectId){
				project.id=this.xmTask.projectId
				project.name=this.xmTask.projectName
			}else if(this.xmQuestion?.id){ 
				project.id=this.xmQuestion.projectId 
			}else if(this.xmTestPlanCase?.planId){ 
				project.id=this.xmTestPlanCase.projectId 
			}
			if(project?.id){
				return project
			}else{
				return null
			}
		}

	},
	props: ['xmTask', 'xmWorkload', 'visible', 'subOpType', 'bizType'/*报工类型1-任务，2-缺陷，3-测试用例设计，4-测试执行 */,
		'xmMenu', 'xmTestCase', 'xmQuestion', 'xmTestPlanCase'],

	watch: {
		'xmWorkload': function (xmWorkload) {
			if (xmWorkload) {
				Object.assign(this.editForm, xmWorkload);
			}

		},
		'visible': function (visible) {
			if (visible == true) {
				this.initData()
			}
		},
		'workloadFillType': function (val) {
			if (val === '2') {
				this.listXmTaskExecuser();
			}
			if (val === '3') {
				this.editForm.workload = this.val.budgetWorkload - this.val.actWorkload
			}
			if (val === '1') {
				this.editForm.workload = 8
			}
		}
	},
	data() {
		return {
			currOpType: 'add',//add/edit
			load: { list: false, edit: false, del: false, add: false },//查询中...
			editFormRules: {
				id: [
					//{ required: true, message: '主键不能为空', trigger: 'blur' }
				],
				bizDate: [
					{ required: true, message: '业务日期不能为空', trigger: 'change' }
				],
				workload: [
					{ required: true, message: '上班时长不能为空', trigger: 'change' }
				],
				remark: [
					{ min: 0, max: 250, message: '工作描述长度在 0 到 250 个字符', trigger: 'change' },//长度
				]
			},
			editForm: {
				userid: '', username: '', ctime: '', taskId: '', cuserid: '', bizDate: '', wstatus: '', remark: '', ttype: '', id: '', sbillId: '', stime: '', sstatus: '', amt: '', samt: '', workload: '', rworkload: null
			},
			rwokkload: 0,
			maxTableHeight: 300,
			dicts: {
				taskType: [],
			},
			execuser: null,
			workloadFillType: '1',//工时填写方式
			groupUserSelectVisible: false,
		}//end return
	},//end data
	methods: {

		// 取消按钮点击 父组件监听@cancel="editFormVisible=false" 监听
		handleCancel: function () {
			this.$emit('cancel');
		},
		//新增、编辑提交XmWorkload 工时登记表父组件监听@submit="afterEditSubmit"
		saveSubmit: function () {
			this.$refs.editFormRef.validate((valid) => {
				if (valid) {
					this.$confirm('确认提交吗？', '提示', {}).then(() => {
						this.load.edit = true
						let params = Object.assign({}, this.editForm);
						var func = addXmWorkload 
						if (this.currOpType == 'edit') {
							func = editXmWorkload
						} else {
							params.id = null;
						}
						func(params).then((res) => {
							this.load.edit = false
							var tips = res.tips;
							if (tips.isOk) {
								this.editForm = res.data
								this.$emit('submit');//  @submit="afterAddSubmit"
								this.$emit(this.currOpType+'-submit',this.editForm);//  @submit="afterAddSubmit"
							}
							this.$notify({ position: 'bottom-left', showClose: true, message: tips.msg, type: tips.isOk ? 'success' : 'error' });
						}).catch(err => this.load.edit = false);
					});
				} else {
					this.$notify({ position: 'bottom-left', showClose: true, message: "表单验证不通过，请修改表单数据再提交", type: 'error' });
				}
			});
		},
		initData: function () {
			this.currOpType = this.subOpType
			if (this.xmWorkload) {
				this.editForm = Object.assign({}, this.xmWorkload);
			}

			if (this.currOpType == 'edit') {

			} else {
				this.editForm.bizType = this.bizType
				this.editForm.bizDate = util.getDate();
				if (!this.editForm.ttype) {
					this.editForm.ttype = "4"
				} 
				if (this.xmQuestion && this.xmQuestion.id) {
					this.editForm.bugId = this.xmQuestion.id 
					this.editForm.taskId=this.xmQuestion.taskId
					this.editForm.caseId=this.xmQuestion.caseId
					this.editForm.planId=this.xmQuestion.caseExecId
					this.editForm.bizName = this.xmQuestion.name
					this.editForm.menuId=this.xmQuestion.menuId 
					this.editForm.funcId=this.xmQuestion.funcId
					this.editForm.projectId=this.xmQuestion.projectId
					this.editForm.productId=this.xmQuestion.productId 
				}
				if (this.xmTask && this.xmTask.id) {
					this.editForm.taskId = this.xmTask.id
					this.editForm.ttype = this.xmTask.taskType
					this.editForm.bizName = this.xmTask.name 
					this.editForm.menuId=this.xmTask.menuId || this.editForm.menuId
					this.editForm.funcId=this.xmTask.funcId || this.editForm.funcId
					this.editForm.projectId=this.xmTask.projectId || this.editForm.projectId
					this.editForm.productId=this.xmTask.productId || this.editForm.productId
				}
				
				if (this.xmTestPlanCase && this.xmTestPlanCase.planId) {
					this.editForm.planId = this.xmTestPlanCase.planId
					this.editForm.caseId = this.xmTestPlanCase.caseId
					this.editForm.bizName = this.xmTestPlanCase.caseName 
					this.editForm.menuId=this.xmTestPlanCase.menuId || this.editForm.menuId
					this.editForm.funcId=this.xmTestPlanCase.funcId || this.editForm.funcId
					this.editForm.projectId=this.xmTestPlanCase.projectId || this.editForm.projectId
					this.editForm.productId=this.xmTestPlanCase.productId || this.editForm.productId
				}
				
				if (this.xmTestCase && this.xmTestCase.id) {
					this.editForm.caseId = this.xmTestCase.id
					this.editForm.bizName = this.xmTestCase.caseName
					this.editForm.menuId=this.xmTestCase.menuId || this.editForm.menuId
					this.editForm.funcId=this.xmTestCase.funcId || this.editForm.funcId 
					this.editForm.productId=this.xmTestCase.productId || this.editForm.productId
				}
				if (this.xmMenu && this.xmMenu.menuId) {
					this.editForm.menuId = this.xmMenu.menuId
					this.editForm.bizName = this.xmMenu.menuName 
					this.editForm.funcId=this.xmMenu.funcId || this.editForm.funcId 
					this.editForm.productId=this.xmMenu.productId || this.editForm.productId
				}

				this.editForm.workload = 8
				this.editForm.userid = this.userInfo.userid
				this.editForm.username = this.userInfo.username
				this.editForm.cuserid = this.userInfo.userid
				this.editForm.cusername = this.userInfo.username
				this.editForm.ubranchId = this.userInfo.branchId
				this.editForm.rworkload = null;
				this.editForm.workloadFillType = "1";
				//报工类型1-任务，2-缺陷，3-测试用例设计，4-测试执行
				if(this.bizType=='1'){//任务
					this.editForm.ttype='6'
				}
				if(this.bizType=='2'|| this.bizType=='3' || this.bizType=='4'){//测试相关
					this.editForm.ttype='5'
				}
			}
		},
		listXmTaskExecuser() {
			listXmTaskExecuser({ userid: this.userInfo.userid, taskId: this.val.id }).then(res => {
				if (res.tips.isOk && res.data.length > 0) {
					this.execuser = res.data[0]
					if (this.workloadFillType == '2') {
						this.editForm.workload = this.execuser.quoteWorkload - this.val.actWorkload
					}
				} else {
					this.$notify({ position: 'bottom-left', showClose: true, message: '没有找到报价信息', type: 'error' })
				}
			});
		},
		onUserSelect(u){
			this.editForm.username=u.username
		}

	},//end method
	mounted() {
		this.$nextTick(() => {

			this.initData()
		});
	}
}

</script>

<style scoped></style>
