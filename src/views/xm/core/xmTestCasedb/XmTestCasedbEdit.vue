<template>
	<!--编辑界面 XmTestCasedb 测试用例库-->
	<el-form :model="editForm" label-width="120px" :rules="editFormRules" ref="editFormRef" label-position="left">


		<el-form-item label="归属产品" prop="productId"> 
				<xm-product-select show-style="tag" width="100%" v-model="editForm.productId" :link-project-id="selProject ? selProject.id : null"
					@change2="onProductSelected" @clear="clearProduct" :disabled="currOpType!='add'  || xmProduct?.id" displayLoad/> 
 		</el-form-item>
		<el-form-item label="用例库名称" prop="name">
			<el-input v-model="editForm.name" placeholder="用例库名称" :maxlength="255"
				@change="editSomeFields(editForm, 'name', $event)" />
		</el-form-item>
		<el-form-item label="其它配置" >
		<el-row>
			<el-col :span="8">
				<el-form-item>
					<xm-user-select :xm-product="{id:editForm.productId,productName:editForm.productName}"  show-style="x"  label="负责人" v-model="editForm.cuserid"
						:init-name="editForm.cusername" @change2="editSomeFields(editForm, 'cuserid', $event)" />
				</el-form-item>
			</el-col>
			<el-col :span="8">
				<el-form-item>
					<mdp-select show-style="x"  label="状态" itemCode="casedbStatus" v-model="editForm.status"
						@change="editSomeFields(editForm, 'status', $event)" />
				</el-form-item>
			</el-col>

			<el-col :span="8">
				<el-form-item>
					<mdp-date show-style="x"  label="创建日期" v-model="editForm.ctime"
						@change="editSomeFields(editForm, 'ctime', $event)" :disabled="currOpType!='add'"/>
				</el-form-item>
			</el-col>
		</el-row>
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

import { addXmTestCasedb, editXmTestCasedb, editSomeFieldsXmTestCasedb } from '@/api/xm/core/xmTestCasedb';
import { mapState } from 'pinia'
import { useUserStore } from '@/store/modules/user'

import { useXmStore,useXmStore2 } from '@/store/modules/xm'


import { MdpFormMixin } from '@/components/mdp-ui/mixin/MdpFormMixin'; 
export default {
	mixins: [MdpFormMixin],
	name: 'xmTestCasedbEdit',
	components: {
		
	},
	computed: {
		...mapState(useUserStore, ['userInfo']),

	},
	props: ['formData', 'visible', 'subOpType', 'xmProduct', 'selProject'],

	data() {
		return {
			currOpType: 'add',//add/edit
			load: { list: false, edit: false, del: false, add: false },//查询中...
			dicts: { casedbStatus: [] },//下拉选择框的所有静态数据 params={categoryId:'all',itemCodes:['sex']} 返回结果 {sex: [{id:'1',name:'男'},{id:'2',name:'女'}]}
			editFormRules: {
				name: [
					{ required: true, message: '测试库名称不能为空', trigger: 'change' },
					{ max: 50, min: 2, message: '测试库名称2-50个字符之间', trigger: 'change' }
				],
				productId: [
					{ required: true, message: '产品不能为空', trigger: 'change' }
				]
			},
			editForm: {
				id: '', name: '', cuserid: '', cusername: '', ctime: '', cbranchId: '', productId: '', productName: ''
			},
			editFormInit: {
				id: '', name: '', cuserid: '', cusername: '', ctime: '', cbranchId: '', productId: '', productName: ''
			},
			maxTableHeight: 300,
			apis: {
				editSomeFields: editSomeFieldsXmTestCasedb,
				add: addXmTestCasedb,
				edit: editXmTestCasedb
			}
		}//end return
	},//end data
	methods: {
		initCurrData: function () {
			this.currOpType = this.subOpType
			if (this.formData) {
				this.editForm = Object.assign({}, this.formData);
			}

			if (this.currOpType == 'edit') {

			} else {
				if (this.xmProduct && this.xmProduct.id) {
					this.editForm.productId = this.xmProduct.id
					this.editForm.productName = this.xmProduct.productName
					this.editForm.name = (this.xmProduct.productName||this.xmProduct.id) + "-测试库-V1.0"
				}
				this.editForm.status='0'
				this.editForm.cuserid=this.userInfo.userid
				this.editForm.cusername=this.userInfo.username
				this.editForm.cbranchId=this.userInfo.branchId
				this.editForm.ctime=this.$mdp.moment().format('YYYY-MM-DD HH:mm:ss')
			}
		},

		editSomeFieldsCheck(row, fieldName, $event, params) {
			if (fieldName == 'cuserid') {
				params.cuserid = $event.userid
				params.cusername = $event.username
			} else {
				params[fieldName] = $event
			}
			return true
		},

		afterEditSomeFields(res,isOk,params,row){
			if(isOk){
				useXmStore2().setTestCasedb(row) 
			} 
		},
		clearProduct() {

			this.editForm.productId = ''
			this.editForm.productName = ''
		},
		onProductSelected(product) {
			this.editForm.productId = product.id
			this.editForm.productName = product.productName
			this.editForm.name = this.editForm.productName + "-测试库-V1.0"
		},
	},//end method
	mounted() { 
	}
}

</script>

<style scoped />
