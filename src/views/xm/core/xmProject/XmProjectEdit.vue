<template>
	<el-form  v-adaptive :model="editForm" label-width="120px" label-position="left"
		:rules="editFormRules" ref="editForm" class="editForm">


		<el-form-item label="项目名称" prop="name">
			<el-input v-model="editForm.name" placeholder="请填写 项目名称"
				@change="editSomeFields(editForm, 'name', $event)" />
			<el-row class="label-font-color" v-if="currOpType !== 'add'">
				项目代号: {{ editForm.code }} <el-divider direction="vertical" /> 项目编号: {{ editForm.id }} <el-tooltip
					content="项目代号用于签订合同等甲乙方共享的场景;项目编号为内部编号，用于内部流转,编号生成规则:项目代号+四位随机码 "><i class="question"></i></el-tooltip>
			</el-row>
		</el-form-item>
		<el-form-item label="项目代号" prop="code" v-if="currOpType === 'add'">

			<el-input v-model="editForm.code" style="width:200px;" placeholder="项目代号，不可为空" />
			<el-button @click="createProjectCode">自动生成</el-button>
			<el-tooltip content="项目代号用于签订合同等甲乙方共享的场景;项目编号为内部编号，用于内部流转，生成规则:项目代号+四位随机码 "><i class="question"></i></el-tooltip>
		</el-form-item>

		<el-form-item label="归属部门" prop="deptid">
			<mdp-select-dept width="100%" v-model="editForm.deptid" placeholder="归属部门" :displayLoad="true"
				@change2="editSomeFields(editForm, 'deptid', $event)" />
		</el-form-item>
		<el-divider />
		<el-row>
			<el-col :span="8">
				<el-form-item prop="xmType" label-width="0px">
					<mdp-select show-style="x" size="medium" label="项目类型" itemCode="projectType" v-model="editForm.xmType"
						@change="editSomeFields(editForm, 'xmType', $event)" />
				</el-form-item>
			</el-col>
			<el-col :span="8">

				<el-form-item prop="status" label-width="0px">
					<mdp-select show-style="x" size="medium" label="项目状态" itemCode="projectStatus" v-model="editForm.status"
						@change="editSomeFields(editForm, 'status', $event)" />

				</el-form-item>
			</el-col>
			<el-col :span="8">
				<el-form-item prop="workType" label-width="0px">
					<mdp-select show-style="x" size="medium" label="工作方式" itemCode="workType" v-model="editForm.workType"
						@change="editSomeFields(editForm, 'workType', $event)" />
				</el-form-item>
			</el-col>
		</el-row>
		<el-divider />
		<el-row>
			<el-col :span="8">
				<el-form-item prop="admUserid" label-width="0px">
					<mdp-select-user show-style="x" size="medium" label=" 项目总控" v-model="editForm.admUserid"
						:init-name="editForm.admUsername" @change2="editSomeFields(editForm, 'admUserid', $event)" />
				</el-form-item>
			</el-col>
			<el-col :span="8">

				<el-form-item prop="pmUserid" label-width="0px">
					<mdp-select-user show-style="x" size="medium" label=" 项目经理" v-model="editForm.pmUserid"
						:init-name="editForm.pmUsername" @change2="editSomeFields(editForm, 'pmUserid', $event)" />

				</el-form-item>
			</el-col>
			<el-col :span="8">
				<el-form-item prop="assUserid" label-width="0px">
					<mdp-select-user show-style="x" size="medium" label=" 副经理、助理" v-model="editForm.assUserid"
						:init-name="editForm.assUsername" @change2="editSomeFields(editForm, 'assUserid', $event)" />

				</el-form-item>
			</el-col>
		</el-row>
		<el-tabs v-model="currTabPane" accordion>
			<el-tab-pane label="项目描述" name="desc">
				<el-form-item label="" prop="description" label-width="0px">
					<el-input type="textarea" :rows="10" v-model="editForm.description" placeholder="项目描述" />
				</el-form-item>
			</el-tab-pane>
			<el-tab-pane label="工期" name="time">
				<el-form-item label="起止时间">
					<el-space wrap>
						<mdp-date-range v-model="editForm" startKey="startTime" endKey="endTime" type="daterange" range-separator="至"
							start-placeholder="计划开始" end-placeholder="计划完成" value-format="YYYY-MM-DD HH:mm:ss" />
						<el-input style="width:150px;" type="number" v-model="editForm.planWorkingHours" :precision="2" :step="8"
							:min="0" placeholder="预计工时" />小时
						&nbsp;&nbsp;<el-tag>参考工时{{ autoParams.weekday * 8 }}小时,工作日{{ autoParams.weekday }}天</el-tag>
						<br />
						<el-checkbox v-model="autoSet">工期变化自动更新预估成本/合同金额/预估工时等关联数据</el-checkbox>
					</el-space>

				</el-form-item>
			</el-tab-pane>
			<el-tab-pane label="成本预估" name="budget">

				<el-row>
					<el-col :span="3">类型</el-col>
					<el-col :span="4">人数</el-col>
					<el-col :span="6">工作量</el-col>
					<el-col :span="3">单价</el-col>
					<el-col :span="8">总价</el-col>

				</el-row>
				<el-divider />
				<el-row>
					<el-col :span="3">内购</el-col>
					<el-col :span="4"><el-input style="width:90%;" type="number" v-model="editForm.planIuserCnt" :precision="0"
							:step="1" :min="0" placeholder="内购人数" />
					</el-col>
					<el-col :span="6">{{ autoParams.planIuserWorkload }}h</el-col>
					<el-col :span="3"><el-input style="width:90%;" type="number" v-model="editForm.planIuserPrice" :precision="0"
							:step="1" :min="0" placeholder="预计内部h单价" /> </el-col>
					<el-col :span="8">{{ this.toFixed(autoParams.planIuserAt) }}元,{{ this.toFixed(autoParams.planIuserAt / 10000) }}
						万元</el-col>
				</el-row>
				<el-divider />
				<el-row>
					<el-col :span="3">外购</el-col>
					<el-col :span="4"><el-input style="width:90%;" type="number" v-model="editForm.planOuserCnt" :precision="0"
							:step="1" :min="0" placeholder="外购人数" />
					</el-col>
					<el-col :span="6">{{ autoParams.planOuserWorkload }}h</el-col>
					<el-col :span="3"><el-input style="width:90%;" type="number" v-model="editForm.planOuserPrice" :precision="0"
							:step="1" :min="0" placeholder="预计外购h单价" /> </el-col>
					<el-col :span="8">{{ autoParams.planOuserAt }} 元 {{ autoParams.planOuserAt / 10000 }}万元</el-col>

				</el-row>
				<el-divider />
				<el-row>
					<el-col :span="3">合计</el-col>
					<el-col :span="4"> {{ autoParams.planOuserCnt + autoParams.planIuserCnt }}人
					</el-col>
					<el-col :span="6">{{ autoParams.planOuserWorkload + autoParams.planIuserWorkload }}h,{{
						(autoParams.planOuserWorkload + autoParams.planIuserWorkload) / 8 / 20 }}人月 </el-col>
					<el-col :span="3"> {{ (parseFloat2(autoParams.planOuserPrice) +
						parseFloat2(autoParams.planIuserPrice)) / 2 }}元/h</el-col>
					<el-col :span="8">{{ autoParams.planTotalCost }} 元，{{ (autoParams.planTotalCost) / 10000 }} 万元</el-col>
				</el-row>
				<el-form-item label="成本总览">
					<el-row>
						内购： <el-input style="width:150px;" type="number" disabled v-model="editForm.planIuserAt" :precision="2"
							:step="1000" :min="0" placeholder="内部人力成本总预算" /> <el-tag>
							{{ this.toFixed(autoParams.planIuserAt / 10000) }}万元</el-tag>
						外购： <el-input style="width:150px;" type="number" disabled v-model="editForm.planOuserAt" :precision="2"
							:step="1000" :min="0" placeholder="外购人力成本总预算" /> <el-tag>
							{{ this.toFixed(autoParams.planOuserAt / 10000) }}万元</el-tag>
						非人力：<el-input style="width:150px;" type="number" v-model="editForm.planNouserAt" :precision="2" :step="1000"
							:min="0" placeholder="人力成本总预算" /> <el-tag> {{ this.toFixed(autoParams.planNouserAt / 10000) }}万元</el-tag>
					</el-row>
					<el-divider />
					<el-row>
						合计： <el-input style="width:150px;" disabled type="number" v-model="editForm.planTotalCost" :precision="2"
							:step="1000" :min="0" placeholder="总成本预算" /> <el-tag>
							{{ this.toFixed(autoParams.planTotalCost / 10000) }}万元</el-tag>
					</el-row>
				</el-form-item>
			</el-tab-pane>
			<el-tab-pane label="收入及盈利水平" name="totalAmount">

				<el-form-item label="总成本">
					<el-row>
						{{ editForm.planTotalCost }}元 <el-tag> {{ this.toFixed(autoParams.planTotalCost / 10000) }}万元</el-tag>
					</el-row>
				</el-form-item>
				<el-form-item label="税率">
					<el-row>
						<el-input style="width:150px;" type="number" v-model="editForm.taxRate" :precision="2" :step="5" :min="0"
							:max="100" placeholder="税率" /> %
					</el-row>
				</el-form-item>
				<el-form-item label="考核标准毛利率">
					<el-row>
						<el-input style="width:150px;" type="number" v-model="editForm.budgetMarginRate" :precision="2" :step="1"
							:min="0" :max="100" placeholder="毛利率" />%
					</el-row>
				</el-form-item>
				<el-form-item label="建议合同总额">
					<el-row>
						<el-input style="width:150px;" type="number" v-model="editForm.totalReceivables" :precision="2" :step="1000"
							:min="0" disabled placeholder="预计总收款金额" /> <el-tag>
							{{ this.toFixed(autoParams.totalReceivables / 10000) }}万元</el-tag>
					</el-row>
				</el-form-item>
				<el-form-item label="实际合同总额">
					<el-row>
						<el-input style="width:150px;" type="number" v-model="editForm.contractAmt" :precision="2" :step="1000"
							:min="0" placeholder="合同总金额" />
						<el-tag>{{ this.toFixed(editForm.contractAmt / 10000) }}万元,毛利率{{ this.toFixed(currentBudgetMarginRate) }}%</el-tag>
					</el-row>
				</el-form-item>
			</el-tab-pane>
		</el-tabs>

	</el-form>


	<el-row class="footer">
		<el-space wrap>

			<span v-if="currOpType !== 'add'">
				<el-button v-if="currTabPane == 'desc' && editForm.description != editFormBak.description" v-loading="load.edit"
					type="primary" @click=" editSomeFields(editForm, 'description', editForm.description)"
					:disabled="load.edit == true">保存描述</el-button>

				<el-button v-if="currTabPane == 'budget'" icon="edit" type="warning"
					@click="handleCommand({ type: 'sendToProcessApprova', data: editForm, bizKey: 'xm_project_budget_change_approva' })">预算变更申请</el-button>

				<el-button v-if="currTabPane == 'cost' || currTabPane == 'totalAmount'" icon="edit" type="warning"
					@click="handleCommand({ type: 'sendToProcessApprova', data: editForm, bizKey: 'xm_project_budget_change_approva' })">项目金额变更申请</el-button>
				<el-button v-if="currTabPane == 'time'" icon="watch" type="warning"
					@click="handleCommand({ type: 'sendToProcessApprova', data: editForm, bizKey: 'xm_project_delay_approva' })">工期变更申请</el-button>
				<el-button icon="star-on" type="success" :disabled="editForm.status > '2'"
					@click="handleCommand({ type: 'sendToProcessApprova', data: editForm, bizKey: 'xm_project_start_approva' })">立项申请</el-button>
				<el-button icon="success" type="success" :disabled="editForm.status > '5'"
					@click="handleCommand({ type: 'sendToProcessApprova', data: editForm, bizKey: 'xm_project_over_approva' })">结项申请</el-button>
			</span>
			<el-button v-if="currOpType === 'add'" v-loading="load.edit" type="primary" @click="editSubmit"
				:disabled="load.edit == true">提交</el-button>

		</el-space>
	</el-row>
</template>

<script>
import util from '@/components/mdp-ui/js/util';//全局公共库
import { sn } from '@/components/mdp-ui/js/sequence';//全局公共库

import config from "@/api/mdp_pub/mdp_config"; //全局公共库
import { addXmProject, editXmProject, createProjectCode, editXmProjectSomeFields } from '@/api/xm/core/xmProject';
//import { uploadBase64 } from '@/api/mdp/arc/image';

import { mapState } from 'pinia'
import { useUserStore } from '@/store/modules/user'; 
import { useXmStore2 } from '@/store/modules/xm'
import { getGroups } from '@/api/xm/core/xmGroup';


import { MdpFormMixin } from '@/components/mdp-ui/mixin/MdpFormMixin';
export default {
	mixins: [MdpFormMixin],
	computed: {
		...mapState(useUserStore, [
			'userInfo', 'roles'
		]),

		autoParams: function () {


			var planOuserPrice = this.toFixed(this.editForm.planOuserPrice)
			var planIuserPrice = this.toFixed(this.editForm.planIuserPrice)
			var planOuserCnt = this.toFixed(this.editForm.planOuserCnt)
			var planIuserCnt = this.toFixed(this.editForm.planIuserCnt)
			var planWorkingHours = this.toFixed(this.editForm.planWorkingHours)
			var planNouserAt = this.toFixed(this.editForm.planNouserAt)
			var budgetMarginRate = this.toFixed(this.editForm.budgetMarginRate, 4)
			var taxRate = this.toFixed(this.editForm.taxRate, 4)
			if (planOuserPrice == null || planOuserPrice == '') {
				planOuserPrice = 100
			}
			if (planIuserPrice == null || planIuserPrice == '') {
				planIuserPrice = 80
			}
			if (planOuserCnt == null || planOuserCnt == '') {
				planOuserCnt = 0.0
			}
			if (planIuserCnt == null || planIuserCnt == '') {
				planIuserCnt = 0.0
			}

			if (planNouserAt == null || planNouserAt == '') {
				planNouserAt = 0.0
			}
			if (budgetMarginRate == null || budgetMarginRate == '') {
				budgetMarginRate = 13
			}

			if (planWorkingHours == null || planWorkingHours == '') {
				planWorkingHours = 0.0
			}
			if (taxRate == null || taxRate == '') {
				taxRate = 6
			}
			var autoParams = {

			}
			var weekday = 1;
			if (this.editForm.startTime != null && this.editForm.endTime != null) {
				weekday = this.getWeekday(new Date(this.editForm.startTime), new Date(this.editForm.endTime));
				if (this.editForm.planWorkingHours == null || this.editForm.planWorkingHours == '' || this.editForm.planWorkingHours <= 0) {
					planWorkingHours = weekday * 8
				}

			}
			autoParams.weekday = weekday
			autoParams.planWorkingHours = planWorkingHours
			autoParams.planOuserPrice = planOuserPrice
			autoParams.planIuserPrice = planIuserPrice
			autoParams.planOuserCnt = planOuserCnt
			autoParams.planIuserCnt = planIuserCnt
			autoParams.taxRate = taxRate
			autoParams.planIuserWorkload = planIuserCnt * planWorkingHours
			autoParams.planOuserWorkload = planOuserCnt * planWorkingHours
			autoParams.planWorkload = planIuserCnt * planWorkingHours + planOuserCnt * planWorkingHours
			autoParams.planOuserAt = planOuserCnt * planWorkingHours * planOuserPrice
			autoParams.planIuserAt = planIuserCnt * planWorkingHours * planIuserPrice
			autoParams.planNouserAt = planNouserAt
			autoParams.budgetMarginRate = budgetMarginRate
			autoParams.planTotalCost = autoParams.planOuserAt + autoParams.planIuserAt + autoParams.planNouserAt
			autoParams.totalReceivables = autoParams.planTotalCost * (1 + autoParams.budgetMarginRate / 100) * (1 + autoParams.taxRate / 100)
			autoParams.contractAmt = autoParams.totalReceivables
			return autoParams
		},
		planTotalAt: function () {
			return {
				planOuserAt: this.editForm.planOuserAt,
				planIuserAt: this.editForm.planIuserAt,
				planNouserAt: this.editForm.planNouserAt,
			}
		},
		currentBudgetMarginRate() {
			var contractAmt = this.editForm.contractAmt || 0
			var taxRate = this.editForm.taxRate || 6
			var planTotalCost = this.editForm.planTotalCost || 0
			if (!planTotalCost) {
				return 0
			}
			return (contractAmt / (1 + taxRate / 100) - planTotalCost) / planTotalCost * 100
		},

		totalReceivables: function () {
			return this.editForm.totalReceivables
		},
		calcProjectStatusStep() {
			if (this.dicts['projectStatus'] && this.editForm) {
				var index = this.dicts['projectStatus'].findIndex(i => {
					if (i.id == this.editForm.status) {
						return true;
					} else {
						return false;
					}
				})
				return index + 1;
			} else {
				return 0;
			}
		},
	},
	props: ['selProject', 'visible', 'xmProduct', 'subOpType'/**add、edit */],
	watch: {
		'visible': function (visible) {
			if (visible == true) {
				this.initData();
				this.initQxCode()
			}
		},
		'planTotalAt': {
			handler(planTotalAt) {
				this.editForm.planTotalCost = this.toFixed(this.parseFloat2(planTotalAt.planOuserAt) + this.parseFloat2(planTotalAt.planIuserAt) + this.parseFloat2(planTotalAt.planNouserAt))
				//this.editForm.totalReceivables=this.toFixed(this.parseFloat2(this.editForm.planTotalCost) * (1+0.3))
			},
			deep: true
		},
		'totalReceivables': function () {
			//this.editForm.budgetMarginRate=this.toFixed((this.editForm.totalReceivables-this.editForm.planTotalCost)/this.editForm.totalReceivables,4)
		},
		autoParams() {
			if (this.autoSet) {
				this.fillPlanWorkingHoursToField()
				this.fillPlanCostAtToField();
				this.fillTotalReceivablesToField();
				this.fillBudgetMarginRateToField()
			}
		},
		selProject: {
			handler(newValue, oldValue) {
				this.initData();
			},
			deep: true

		},

		editForm: {
			handler(newValue, oldValue) {
				if (this.currOpType === 'add') {
					return;
				}
				this.$notify.closeAll();
				this.changeTips = [];
				if (this.selProject.planWorkingHours != this.editForm.planWorkingHours) {
					var distance = this.selProject.planWorkingHours - this.editForm.planWorkingHours
					var operType = distance > 0 ? "-" : "+";
					this.changeTips.push("预计总工期: " + this.selProject.planWorkingHours + " ==> " + this.editForm.planWorkingHours + "&nbsp;&nbsp;&nbsp;<strong>" + operType + Math.abs(distance).toFixed(2) + "</strong>小时");
				}
				if (this.selProject.planTotalCost != this.editForm.planTotalCost) {
					var distance = this.selProject.planTotalCost - this.editForm.planTotalCost
					var operType = distance > 0 ? "-" : "+";
					this.changeTips.push("预计总成本: " + this.selProject.planTotalCost + " ==> " + this.editForm.planTotalCost + "&nbsp;&nbsp;&nbsp;<strong>" + operType + Math.abs(distance).toFixed(2) + "</strong>元");
				}
				if (this.selProject.budgetMarginRate != this.editForm.budgetMarginRate) {
					var distance = this.selProject.budgetMarginRate - this.editForm.budgetMarginRate
					var operType = distance > 0 ? "-" : "+";
					this.changeTips.push("毛利率: " + this.selProject.budgetMarginRate + " ==> " + this.editForm.budgetMarginRate + "&nbsp;&nbsp;&nbsp;<strong>" + operType + Math.abs(distance).toFixed(2) + "</strong>%");
				}
				if (this.selProject.totalReceivables != this.editForm.totalReceivables) {
					var distance = this.selProject.totalReceivables - this.editForm.totalReceivables
					var operType = distance > 0 ? "-" : "+";
					this.changeTips.push("预计总收款: " + this.selProject.totalReceivables + " ==> " + this.editForm.totalReceivables + "&nbsp;&nbsp;&nbsp;<strong>" + operType + Math.abs(distance).toFixed(2) + "</strong>元");
				}
				if (this.selProject.contractAmt != this.editForm.contractAmt) {
					var distance = this.selProject.contractAmt - this.editForm.contractAmt
					var operType = distance > 0 ? "-" : "+";
					this.changeTips.push("合同金额: " + this.selProject.contractAmt + " ==> " + this.editForm.contractAmt + "&nbsp;&nbsp;&nbsp;<strong>" + operType + Math.abs(distance).toFixed(2) + "</strong>元");
				}

				if (this.changeTips.length == 0) {
					return;
				}

			},
			deep: true
		}
	},
	data() {

		const beginDate = new Date();
		const endDate = new Date();
		endDate.setTime(beginDate.getTime() + 3600 * 1000 * 24 * 7 * 4);
		return {
			currOpType: 'add',
			filters: {
				ids: [],
			},
			dicts: {
				"projectType": [], "priority": [], "projectStatus": [], 'xmType': [], 'workType': []
			},//下拉选择框的所有静态数据 params=[{categoryId:'0001',itemCode:'sex'}] 返回结果 {'sex':[{optionValue:'1',optionName:'男',seqOrder:'1',fp:'',isDefault:'0'},{optionValue:'2',optionName:'女',seqOrder:'2',fp:'',isDefault:'0'}]}
			load: { list: false, add: false, del: false, edit: false },//查询中...
			editFormRules: {
				name: [{
					required: true, message: '项目名称不可为空', trigger: 'change'
				},
				{ min: 2, max: 50, message: '名称长度在2-50个字符', trigger: 'change' }
				],

				code: [{
					required: true, message: '项目代号不可为空', trigger: 'change'
				},
				{ min: 5, max: 40, message: '项目代号长度在5-40个字符', trigger: 'change' }
				],
				xmType: [{
					required: true, message: '项目类型不可为空', trigger: 'change'
				}],
				xmType: [{
					required: true, message: '项目类型不可为空', trigger: 'change'
				}],
				priority: [{
					required: true, message: '优先级不可为空', trigger: 'change'
				}],
				admUserid: [{
					required: true, message: '项目总控不能为空', trigger: 'change'
				}],
				pmUserid: [{
					required: true, message: '项目经理不能为空', trigger: 'change'
				}],
				description: [
					{ min: 0, max: 250, message: '项目描述长度在0-250', trigger: 'change' }
				]
			},
			//编辑界面数据  XmProject xm_project
			editForm: {
				id: '', code: '', name: '', xmType: '', startTime: '', endTime: '', urgent: '', priority: '', description: '', createUserid: '', createUsername: '', createTime: '', assess: '', assessRemarks: '', status: '', branchId: '', planTotalCost: '', bizProcInstId: '', bizFlowState: '', planNouserAt: '', planIuserAt: '', planOuserAt: '', locked: '', baseTime: '', baseRemark: '', baselineId: '', planWorkload: '0', totalReceivables: '0', budgetMarginRate: 13, contractAmt: 0, planIuserPrice: 85, planOuserPrice: 100, planOuserCnt: 0, planIuserCnt: 0, planWorkingHours: 0, taxRate: 3, planIuserWorkload: 0, planOuserWorkload: 0, fromTplId: '', budgetCtrl: '0', deptid: '', showOut: '0', isTpl: '0', pmUserid: '', pmUsername: '', assUserid: '', assUsername: '', admUserid: '', admUsername: '', budgetEarly: '', phaseActCtrl: '', del: '0', ltime: '', ostatus: '0', workType: '', wtype: '', earlyAmt: 0, maxTaskAmt: 0, menuLink: '0', phaseLink: '0', tplType: '', qxCode: ''
			},
			editFormBak: {
				id: '', code: '', name: '', xmType: '', startTime: '', endTime: '', urgent: '', priority: '', description: '', createUserid: '', createUsername: '', createTime: '', assess: '', assessRemarks: '', status: '', branchId: '', planTotalCost: '', bizProcInstId: '', bizFlowState: '', planNouserAt: '', planIuserAt: '', planOuserAt: '', locked: '', baseTime: '', baseRemark: '', baselineId: '', planWorkload: '0', totalReceivables: '0', budgetMarginRate: 13, contractAmt: 0, planIuserPrice: 85, planOuserPrice: 100, planOuserCnt: 0, planIuserCnt: 0, planWorkingHours: 0, taxRate: 3, planIuserWorkload: 0, planOuserWorkload: 0, fromTplId: '', budgetCtrl: '0', deptid: '', showOut: '0', isTpl: '0', pmUserid: '', pmUsername: '', assUserid: '', assUsername: '', admUserid: '', admUsername: '', budgetEarly: '', phaseActCtrl: '', del: '0', ltime: '', ostatus: '0', workType: '', wtype: '', earlyAmt: 0, maxTaskAmt: 0, menuLink: '0', phaseLink: '0', tplType: '', qxCode: ''
			},
			/**begin 在下面加自定义属性,记得补上面的一个逗号**/
			xmGroups: [],
			userSelectType: "",
			userSelectVisible: false,
			groupSelectVisible: false,
			pickerOptions: util.getPickerOptions('datarange'),
			activateName: 'planWorkload',
			changeTips: [],//变化日志列表
			maxTableHeight: 300,
			currUserType: '',
			autoSet: false,
			currTabPane: '1',
			/**
				权限码0,1,2,3,4,5,67,8,9，逗号分割
				共10位,不定长，暂时只启用前2个位
				第0位代表计划及任务指派及crud权限：
					0-代表不限制,1-同组织，2-同项目组（默认），3-同小组
				第1位代表计划及任务指派及crud时是否检查上下级关系：0-否（默认），1是
				*/
			qxCode: {
				taskScope: '2',//0-代表不限制,1-同组织，2-同项目组（默认），3-同小组
				taskTransmit: '0',//0-不控制，1任务指派及crud必须检查用户的上下级关系
			},
			apis:{
				add: addXmProject,
				edit: editXmProject,
				editSomeFields: editXmProjectSomeFields
			}
			/**end 在上面加自定义属性**/
		}//end return
	},//end data
	methods: {
		//打开用户选择
		//选择接收人


		initQxCode() {
			var qxCode = this.editForm.qxCode
			if (!qxCode) {
				this.qxCode.groupScope = "2"
				this.qxCode.groupTransmit = "1"
				this.qxCode.testScope = "2"
				this.qxCode.testTransmit = "1"
				this.qxCode.taskScope = "2"
				this.qxCode.taskTransmit = "1"
			} else {
				var qxCodes = qxCode.split(",")
				if (qxCodes.length >= 6) {
					this.qxCode.groupScope = qxCodes[0]
					this.qxCode.groupTransmit = qxCodes[1]
					this.qxCode.testScope = qxCodes[2]
					this.qxCode.testTransmit = qxCodes[3]
					this.qxCode.taskScope = qxCodes[4]
					this.qxCode.taskTransmit = qxCodes[5]
				} else {
					this.qxCode.groupScope = '2'
					this.qxCode.groupTransmit = '1'
					this.qxCode.testScope = "2"
					this.qxCode.testTransmit = "1"
					this.qxCode.taskScope = "2"
					this.qxCode.taskTransmit = "1"
				}
			}
		},
		showProjectGroups: function () {
			this.getXmGroups();
			this.groupSelectVisible = true;
		},
		//项目团队选择
		onGroupSelected(groups) {
			this.groupSelectVisible = false;
		},

		// 取消按钮点击 父组件监听@cancel="editFormVisible=false" 监听
		handleCancel: function () {
			this.$refs['editForm'].resetFields();
			this.$emit('cancel');
		},
		//编辑提交XmProject xm_project父组件监听@submit="afterEditSubmit"
		editSubmit: function () {
			if (this.currOpType !== 'add' && "0" != this.selProject.status) {
				this.$notify({ position: 'bottom-left', showClose: true, message: "只有初始状态的项目可以修改，如确实需要修改，请进行项目变更审批", type: 'error' });
				return;
			}
			var msg = this.xmProduct && this.xmProduct.id ? '将自动关联项目【' + (this.xmProduct.productName ? this.xmProduct.productName : this.xmProduct.id) + '】' : '';
			this.$refs.editForm.validate((valid) => {
				if (valid) {
					this.$confirm('确认提交吗？' + msg, '提示', {}).then(() => {
						this.load.edit = true
						var func = editXmProject;
						if (this.currOpType === 'add') {
							func = addXmProject;
						}
						let params = Object.assign({}, this.editForm);
						if (this.xmProduct && this.xmProduct.id) {
							params.links = [{ productId: this.xmProduct.id }]
						}
						params.planIuserWorkload = this.autoParams.planIuserWorkload
						params.planOuserWorkload = this.autoParams.planOuserWorkload
						params.planWorkload = this.autoParams.planWorkload
						func(params).then((res) => {
							this.load.edit = false;
							var tips = res.tips;
							if (tips.isOk) {
								if (this.selProject && this.currOpType !== 'add') {
									Object.assign(this.selProject, res.data)
								}
								this.$emit('submit', res.data);//  @submit="afterEditSubmit"
							}
							this.$notify({ position: 'bottom-left', showClose: true, message: tips.msg, type: tips.isOk ? 'success' : 'error' });
						}).catch(err => {
							this.load.edit = false
							console.log(err)
						});
					});
				} else {
					this.$notify({ position: 'bottom-left', showClose: true, message: "表单检查不通过，请修改后提交", type: 'error' });
				}
			});
		},
		getXmGroups() {
			this.load.list = true;
			let params = {};
			params.projectId = this.editForm.id;
			params.branchId = this.userInfo.branchId;
			getGroups(params).then((res) => {
				var tips = res.tips;
				if (tips.isOk) {
					this.xmGroups = res.data;
				} else {
					this.$notify({ position: 'bottom-left', showClose: true, message: tips.msg, type: 'error' });
				}
				this.load.list = false;
			}).catch(err => this.load.list = false);
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
		toFixed(floatValue, num) {
			if (floatValue == null || floatValue == '' || floatValue == undefined) {
				return 0;
			} else {
				if (!num) {
					num = 2
				}
				return parseFloat(parseFloat(floatValue).toFixed(num));
			}
		},
		parseFloat2(floatValue) {
			if (floatValue == null || floatValue == '' || floatValue == undefined) {
				return 0;
			} else {
				return parseFloat(floatValue);
			}
		},
		fillToField: function () {
			this.editForm = Object.assign(this.editForm, this.autoParams);
		},
		fillPlanWorkingHoursToField: function () {
			this.editForm.planWorkingHours = this.toFixed(this.autoParams.planWorkingHours)
		},

		fillPlanCostAtToField: function () {
			this.editForm.planNouserAt = this.toFixed(this.autoParams.planNouserAt)
			this.editForm.planOuserAt = this.toFixed(this.autoParams.planOuserAt)
			this.editForm.planIuserAt = this.toFixed(this.autoParams.planIuserAt)
			this.editForm.planTotalCost = this.toFixed(this.autoParams.planTotalCost)

		},

		fillTotalReceivablesToField: function () {
			this.editForm.totalReceivables = this.toFixed(this.autoParams.totalReceivables)
			this.editForm.contractAmt = this.toFixed(this.autoParams.contractAmt)
		},
		fillBudgetMarginRateToField: function () {
			this.editForm.budgetMarginRate = this.toFixed(this.autoParams.budgetMarginRate, 4)
		},
		showApprovaInfo: function (row) {
			var msgFields = [];
			if (row.mainTitle != null && row.mainTitle != "") {
				msgFields.push("流程【" + row.mainTitle + "】");
			}

			if (row.taskName != null && row.taskName != "") {
				msgFields.push("当前环节【" + row.taskName + "】");
			}

			if (row.assigneeName != null && row.assigneeName != "") {
				msgFields.push("执行人【" + row.assigneeName + "】");
			}

			if (row.commentMsg != null && row.commentMsg != "") {
				msgFields.push("审批意见【" + row.commentMsg + "】");
			}
			var msg = msgFields.join(",");
			return msg;
		},
		sendToProcessApprova: function (row, bizKey) {
			// 传过来的参数格式
			if (row.flowState == '1') {
				this.$notify.error("审核中，不允许重复发审");
				return;
			}

			row.planIuserWorkload = this.autoParams.planIuserWorkload
			row.planOuserWorkload = this.autoParams.planOuserWorkload
			row.planWorkload = this.autoParams.planWorkload
			let extVars = { projectId: row.id }
			let jsonExtVars = JSON.stringify(extVars);

			var currDomain = window.location.protocol + "//" + window.location.host;
			var fullPath = this.$route.fullPath;
			var bizUrl = currDomain + '/#' + fullPath + '?extVars=' + jsonExtVars

			let params = {
				bizKey: bizKey,
				bizUrl: bizUrl,
				resUrl: '',
				bizId: row.id,
				bizPid: row.id,
				mainContext: '',
				extVars: extVars,
				flowVars: {
					subscribeTaskEvent: 'TASK_COMPLETED,TASK_CREATED',
					data: {
						id: row.id,
						branchId: row.branchId
					}
				},
			} 
			if (bizKey == "xm_project_baseinfo_change_approva") {
				//延期审核
				params.mainTitle = '关于项目【' + row.name + "】修改基本信息的申请";
				params.mainContext = '项目编号：' + row.code + ',' + '项目名称：' + row.name + ',此次变更不涉及预算调整';
				params.restUrl = config.getXmCtx() + "/xm/core/xmProject/processApprova";
				params.flowVars.data = row
				//this.html2canvas(document.querySelector(".editForm"),row,params);
				this.$router.push({ name: 'bizStartProc', query: {paramsId:this.$mdp.setCacheParams(params)} });
			} else if (bizKey == "xm_project_delay_approva") {
				//延期审核
				params.mainTitle = '关于项目【' + row.name + "】延期的审批申请";
				params.mainContext = '项目编号：' + row.code + ',' + '项目名称：' + row.name + ',项目结束时间由' + this.selProject.endTime + '变更为:' + this.editForm.endTime + ',此次变更不涉及预算调整';
				params.restUrl = config.getXmCtx() + "/xm/core/xmProject/processApprova";
				params.flowVars.data.endTime = this.editForm.endTime
				//this.html2canvas(document.querySelector(".editForm"),row,params);
				this.$router.push({ name: 'bizStartProc', state: {params} });
			} else if (bizKey == "xm_project_start_approva") {
				
				//立项审核
				params.mainTitle = '关于项目【' + row.name + "】立项的审批申请";
				params.mainContext = '项目编号：' + row.code + ',' + '项目名称：' + row.name + ',项目周期：' + row.startTime + '~' + row.endTime
					+ ',预估及考核毛利率:' + row.budgetMarginRate + ',预估总成本:' + row.planTotalCost + ',总收入:' + row.totalReceivables
					+ ',合同金额:' + row.contractAmt + '详细如下(截图)：';
				params.restUrl = config.getXmCtx() + "/xm/core/xmProject/processApprova";
				params.flowVars.data = row
				//this.html2canvas(document.querySelector(".editForm"),row,params);
				this.$router.push({ name: 'bizStartProc', query: {paramsId:this.$mdp.setCacheParams(params)} });
			} else if (bizKey == "xm_project_over_approva") {
				//结项审核
				params.mainTitle = '关于项目【' + row.name + "】结项的审批申请";
				params.mainContext = '项目编号：' + row.code + ',' + '项目名称：' + row.name + ',项目周期：' + row.startTime + '~' + row.endTime
					+ ',预估及考核毛利率:' + row.budgetMarginRate + ',预估总成本:' + row.planTotalCost + ',总收入:' + row.totalReceivables
					+ ',合同金额:' + row.contractAmt + '详细如下(截图)：';
				params.restUrl = config.getXmCtx() + "/xm/core/xmProject/processApprova";
				//this.html2canvas(document.querySelector(".editForm"),row,params);
				this.$router.push({ name: 'bizStartProc', query: {paramsId:this.$mdp.setCacheParams(params)} });
			} else if (bizKey == "xm_project_pause_approva") {
				//结项审核
				params.mainTitle = '关于项目【' + row.name + "】暂停的审批申请";
				params.mainContext = '项目编号：' + row.code + ',' + '项目名称：' + row.name + ',项目周期：' + row.startTime + '~' + row.endTime
					+ ',预估及考核毛利率:' + row.budgetMarginRate + ',预估总成本:' + row.planTotalCost + ',总收入:' + row.totalReceivables
					+ ',合同金额:' + row.contractAmt + '详细如下(截图)：';
				params.restUrl = config.getXmCtx() + "/xm/core/xmProject/processApprova";
				this.$router.push({ name: 'bizStartProc', query: {paramsId:this.$mdp.setCacheParams(params)} });
				//this.html2canvas(document.querySelector(".editForm"),row,params);
			} else if (bizKey == "xm_project_restart_approva") {
				//结项审核
				params.mainTitle = '关于项目【' + row.name + "】重新启动的审批申请";
				params.mainContext = '项目编号：' + row.code + ',' + '项目名称：' + row.name + ',项目周期：' + row.startTime + '~' + row.endTime
					+ ',预估及考核毛利率:' + row.budgetMarginRate + ',预估总成本:' + row.planTotalCost + ',总收入:' + row.totalReceivables
					+ ',合同金额:' + row.contractAmt + '详细如下(截图)：';
				params.restUrl = config.getXmCtx() + "/xm/core/xmProject/processApprova";
				//this.html2canvas(document.querySelector(".editForm"),row,params);
				this.$router.push({ name: 'bizStartProc', query: {paramsId:this.$mdp.setCacheParams(params)} });
			} else if (bizKey == "xm_project_budget_change_approva") {
				//预算变更审核
				params.mainTitle = '关于项目【' + row.name + "】预算变更的审批申请";
				params.mainContext = '项目编号：' + row.code + ',' + '项目名称：' + row.name + '项目周期：' + row.startTime + '~' + row.endTime
					+ ',<br/>变更前数据:预估及考核毛利率:' + this.selProject.budgetMarginRate + ',预估总成本:' + this.selProject.planTotalCost + ',总收入:' + this.selProject.totalReceivables
					+ ',合同金额:' + this.selProject.contractAmt
					+ ',<br/>变更后数据:预估及考核毛利率:' + row.budgetMarginRate + ',预估总成本:' + row.planTotalCost + ',总收入:' + row.totalReceivables
					+ ',合同金额:' + row.contractAmt;
				params.restUrl = config.getXmCtx() + "/xm/core/xmProject/processApprova";
				params.flowVars.data = row
				//this.html2canvas(document.querySelector(".editForm"),row,params);
				this.$router.push({ name: 'bizStartProc', query: {paramsId:this.$mdp.setCacheParams(params)} });
			} else {
				this.$notify.error("不支持的审批事项");
				return;
			}

			//this.$useXmStore.addVisitedViews( {path:'/mdp/workflow/re/procdef/bizStartProc',query:{params:jsonParmas}})
		},
		handleCommand(command) {
			if (command.type == 'sendToProcessApprova') {
				this.sendToProcessApprova(command.data, command.bizKey);
			}
		},
		// html2canvas(doc,row,params){
		// 	this.load.edit=true;
		// 	this.hideAllBtn(doc,true);
		// 	html2canvas(doc).then(canvas => {

		// 		let dataURL = canvas.toDataURL("image/png");
		// 		uploadBase64({fileData:dataURL,categoryId:'workflow',storedb:'0',branchId:row.branchId,name:row.name+'.png'}).then(res=>{
		// 			this.hideAllBtn(doc,false);
		// 			params.mainContext=params.mainContext+'<br/><img  style="max-width:100%;" src="'+res.data.url+'"/>'
		// 			this.$router.push({name:'bizStartProc',params:params});
		// 			this.load.edit=false;
		// 		});

		// 	});
		// },
		hideAllBtn: function (doc, hide) {
			var btns = doc.getElementsByTagName('button');
			for (var i = 0; i < btns.length; i++) {
				if (hide == true) {
					btns[i].style.display = 'none'
				} else {
					btns[i].style.display = ''
				}
			}
		},
		showUserVisible(userType) {
			this.currUserType = userType
			this.userSelectVisible = true;
		},
		//选择人员
		onUserSelected: function (users) {
			this.userSelectVisible = false;
			var user = { userid: '', username: '' };
			if (users && users.length > 0) {
				user = users[0]
			}

			if (this.currUserType == 'admUserid') {
				this.editForm.admUserid = user.userid
				this.editForm.admUsername = user.username
			} else if (this.currUserType == 'assUserid') {
				this.editForm.assUserid = user.userid
				this.editForm.assUsername = user.username
			} else if (this.currUserType == 'pmUserid') {
				this.editForm.pmUserid = user.userid
				this.editForm.pmUsername = user.username
			}
			this.currUserType = "";

		},

		createProjectCode() {
			createProjectCode({}).then(res => {
				var tips = res.tips;
				if (tips.isOk) {
					this.editForm.code = res.data
				}
				this.$notify({ position: 'bottom-left', showClose: true, message: tips.msg, type: tips.isOk ? 'success' : 'error' });
			})
		},
		initCurrData() { 
			this.editForm = Object.assign(this.editForm, this.selProject)
			if (this.currOpType === 'add') {
				this.editForm.pmUserid = this.userInfo.userid
				this.editForm.pmUsername = this.userInfo.username
				this.editForm.admUserid = this.userInfo.userid
				this.editForm.admUsername = this.userInfo.username
				this.editForm.assUserid = this.userInfo.userid
				this.editForm.assUsername = this.userInfo.username
				this.editForm.status = "0"
				this.editForm.wtype = this.editForm.wtype || "2"
				this.editForm.workType = this.editForm.workType || "1"
				this.editForm.xmType = this.editForm.xmType || "2"
				this.editForm.priority = this.editForm.priority || "2"
				this.editForm.locked = this.editForm.locked || "0"
				this.editForm.showOut = this.editForm.showOut || "2"
				this.editForm.isTpl = this.editForm.isTpl || "0"
				this.editForm.phaseActCtrl = this.editForm.phaseActCtrl || "1";
				this.editForm.budgetEarly = this.editForm.budgetEarly || "1";
				this.editForm.earlyAmt = this.editForm.earlyAmt || -10000;
				this.editForm.budgetCtrl = this.editForm.budgetCtrl || "0";
				this.editForm.taxRate = this.editForm.taxRate || 6
				this.editForm.budgetMarginRate = this.editForm.budgetMarginRate || 13
				this.autoSet = true;
			} else {
				this.autoSet = false;
			} 
			this.initQxCode()
		},


		editSomeFieldsCheck(row, fieldName, $event,params) { 
			if (fieldName == "admUserid") {
				params["admUserid"] = $event.userid;
				params["admUsername"] = $event.username;
			} else if (fieldName == "assUserid") {
				params["assUserid"] = $event.userid;
				params["assUsername"] = $event.username;
			} else if (fieldName == "pmUserid") {
				params["pmUserid"] = $event.userid;
				params["pmUsername"] = $event.username;
			} else if (fieldName == 'deptid') {
				params["deptid"] = $event.deptid;
				params["deptidPath"] = $event.idPath;
			} else {
				params[fieldName] = $event
			}
			if (fieldName == 'description') {
				this.$refs.editForm.validateField('description', err => {
					if (!err) {
						this.$notify({ position: 'bottom-left', showClose: true, message: "表单验证不通过", type: 'error' })
						return;
					} 
				})
			} else if (fieldName == 'name') {
				this.$refs.editForm.validateField('name', err => {
					if (!err) {
						this.$notify({ position: 'bottom-left', showClose: true, message: '表单验证不通过', type: 'error' })
						return;
					}  
				})
			}  
			return true;
		},
		afterEditSomeFields(res,isOk,params,row){
			if(!isOk){
				this.initQxCode()
			}else{
				useXmStore2().setProjectInfo(row)
			}
		}
		/**end 在上面加自定义方法**/
	},//end method
	components: {
	},
	mounted() {
		this.$mdp.getDictOptions('projectStatus').then(res => this.dicts.projectStatus = res) 


	}
}

</script>

<style  scoped />
