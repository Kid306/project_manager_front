<template>
	<!--编辑界面 XmTestPlan 测试计划-->
	<el-form :model="editForm" label-width="120px" :rules="editFormRules" ref="editFormRef" label-position="left">
		<el-form-item prop="name" label="计划名称">
			<mdp-input v-model="editForm.name" placeholder="选中项目后自动生成" :maxlength="255"
				@change="editSomeFields(editForm, 'name', $event)" />
			<el-row v-if="currOpType != 'add'">
				<span class="label-font-color padding-left">测试计划编号:{{ editForm.id }}</span>
			</el-row>
		</el-form-item>
		<el-row class="padding-bottom">
			<el-col :span="6">
				<el-form-item>
					<xm-user-select :xm-product="{id:editForm.productId,productName:editForm.productName}" :sel-project="{id:editForm.projectId,name:editForm.projectName}" show-style="x" size="medium" label="负责人" v-model="editForm.cuserid"
						:init-name="editForm.cusername" @change2="editSomeFields(editForm, 'cuserid', $event)" />

				</el-form-item>
			</el-col>
			<el-col :span="6">
				<el-form-item>
					<mdp-select show-style="x" size="medium" label="状态" itemCode="testPlanStatus" v-model="editForm.status"
						@change="editSomeFields(editForm, 'status', $event)" />

				</el-form-item>
			</el-col>

			<el-col :span="6">
				<el-form-item>
					<mdp-select show-style="x" size="medium" label="测试方式" itemCode="testType" v-model="editForm.testType"
						@change="editSomeFields(editForm, 'testType', $event)" />

				</el-form-item>
			</el-col>
			<el-col :span="6" v-if="currOpType!='add'">
				<el-form-item>
					<mdp-select show-style="x" size="medium" label="测试结果" itemCode="testPlanTcode" v-model="editForm.tcode"
						@change="editSomeFields(editForm, 'tcode', $event)" />

				</el-form-item>
			</el-col>
		</el-row>

		<el-form-item label="归属测试库" prop="casedbId">
			 <XmTestCasedbSelect showStyle="tag" width="100%" :xmProduct="xmProduct" v-model="editForm.casedbId" :init-name="editForm.casedbName" :disabled="xmTestCasedb?.id||subOpType!='add'" @change2="onCasedbChange" :selProject="selProject"/>
		</el-form-item>

		<el-form-item label="归属产品" prop="productId" v-if="editForm.productId">
			 <XmProductSelect showStyle="tag" v-model="editForm.productId" :init-name="editForm.productName" disabled/>
		</el-form-item>
		<el-form-item label="归属项目" prop="projectId" v-if="currOpType=='add' && editForm.productId">   
				<xm-project-select v-model="editForm.projectId" :init-name="editForm.projectName" show-style="tag" width="100%"
					ref="xmProjectSelect" :link-product-id="editForm.productId" 
					@change2="onPorjectConfirm" /> 
			</el-form-item>
			<el-form-item label="归属项目" prop="projectId" v-if="currOpType!='add'">   
				<xm-project-select v-model="editForm.projectId" :init-name="editForm.projectName" show-style="tag" width="100%" disabled/> 
			</el-form-item>
		<el-form-item label="起止时间" prop="stime">
			<mdp-date-range  placeholder="选择日期" v-model="editForm" start-key="stime" end-key="etime"
				value-format="YYYY-MM-DD HH:mm:ss" format="YYYY-MM-DD" @change="editSomeFields(editForm, 'stime', editForm)" />
		</el-form-item>
	</el-form> 
	<el-row v-if="currOpType == 'add'" class="footer">
		<el-button @click="handleCancel">取消</el-button>
		<el-button v-loading="load.edit" type="primary" @click="saveSubmit" :disabled="load.edit == true">提交</el-button>
	</el-row>
</template>

<script>
import util from '@/components/mdp-ui/js/util';//全局公共库
import config from "@/api/mdp_pub/mdp_config"; //全局公共库import
import { addXmTestPlan, editXmTestPlan, editSomeFieldsXmTestPlan } from '@/api/xm/core/xmTestPlan';
import { mapState } from 'pinia'
import { useUserStore } from '@/store/modules/user'



import { MdpFormMixin } from '@/components/mdp-ui/mixin/MdpFormMixin';
export default {
	mixins: [MdpFormMixin],
	name: 'xmTestPlanEdit', 
	computed: {
		...mapState(useUserStore, ['userInfo']),

	},
	props: ['formData',  'subOpType', 'selProject', 'xmTestCasedb','xmProduct'],
 
	data() {
		return {
			currOpType: 'add',//add/edit 
			editFormRules: {
				name: [
					{ required: true, message: '测试计划名称不能为空', trigger: 'change' },
					{ min: 2, max: 50, message: '长度在 2 到 50 个字符', trigger: 'change' },//长度
				],
				projectId: [
					{ required: true, message: '不能为空', trigger: 'change' },
				],
				casedbId: [
					{ required: true, message: '不能为空', trigger: 'change' },
				],
				productId: [
					{ required: true, message: '不能为空', trigger: 'change' },
				],
				stime: [
					{ required: true, message: '不能为空', trigger: 'change' },
				],
			},
			editForm: {
				id: '', name: '', casedbId: '', casedbName: '', projectId: '', projectName: '', cuserid: '', cusername: '', ctime: '', stime: '', etime: '', status: '', tcode: '', totalCases: '', okCases: '', errCases: '', igCases: '', blCases: '', productId: '', productName: '', flowState: ''
			}, 
			apis: {
				add: addXmTestPlan,
				editSomeFields: editSomeFieldsXmTestPlan
			}
		}//end return
	},//end data
	methods: { 

		initCurrData: function () {
			
			this.currOpType=this.subOpType
			this.editForm={...this.formData}
			if(this.subOpType=='add'){
				
				if(this.xmTestCasedb?.id){
					this.editForm.casedbId=this.xmTestCasedb.id
					this.editForm.casedbName=this.xmTestCasedb.name
					this.editForm.productId=this.xmTestCasedb.productId
					this.editForm.productName=this.xmTestCasedb.productName
				}
				if(this.xmProduct?.id){
					
					this.editForm.productId=this.xmProduct.id
					this.editForm.productName=this.xmProduct.productName
				}
				if(this.selProject?.id){
					this.editForm.projectId=this.selProject.id
					this.editForm.projectName=this.selProject.name 
					this.editForm.name = this.editForm.projectName + '-测试计划-'+util.moment().format('YYYY-MM-DD')+'-V1.0'
				}
				this.editForm.cuserid=this.userInfo.userid
				this.editForm.cusername=this.userInfo.username
				this.editForm.cbranchId=this.userInfo.branchId
				this.editForm.status="0"
				this.editForm.testType="1"
			}
			

		},

		editSomeFieldsCheck(row, fieldName, $event, params) {


			if (fieldName == 'stime') {
				params[fieldName] = $event.stime
				params.etime = $event.etime
			} else if (fieldName == 'cuserid') {
				params[fieldName] = $event.userid
				params.cusername = $event.username
			} else {
				params[fieldName] = $event
			}
			return true;
		},
		
		afterEditSomeFields(res,isOk,params,row){
			
			var key="xm-test-plan-info-"+row.id
      sessionStorage.setItem(key,JSON.stringify(row))

		},
		onPorjectConfirm(row) {
			this.editForm.projectId = row.id
			this.editForm.projectName = row.name
			this.editForm.name = this.editForm.projectName + '-测试计划-'+util.moment().format('YYYY-MM-DD')+'-V1.0'
		},
		onCasedbChange(casedb){
			if(casedb?.id){
				this.editForm.casedbId=casedb.id
				this.editForm.casedbName=casedb.name
				this.editForm.productId=casedb.productId
				this.editForm.productName=casedb.productName
			}else{
				this.editForm.casedbId=''
				this.editForm.casedbName=''
				this.editForm.productId=''
				this.editForm.productName=''
			}

		}
	},//end method
	mounted() {   
		this.initData()
	}
}

</script>

<style scoped />
