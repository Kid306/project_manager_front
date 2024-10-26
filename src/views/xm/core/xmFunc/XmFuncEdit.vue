<template>
	<!--编辑界面 XmFunc 功能模块表-->
	<el-form :model="editForm" label-width="120px" :rules="editFormRules" ref="editFormRef">

		<el-form-item label="编号" prop="id">
			<el-input v-model="editForm.id" :disabled="currOpType != 'add'" placeholder="编号，留空则后台自动生成" :maxlength="50" />
		</el-form-item>
		<el-form-item label="名称" prop="name" :rules="[{ required: true, message: '此项必填' }]">
			<el-input v-model="editForm.name" placeholder="名称" :maxlength="255"
				@change="editSomeFields(editForm, 'name', $event)" />
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
import { addXmFunc, editXmFunc, editSomeFieldsXmFunc } from '@/api/xm/core/xmFunc';
import { mapState } from 'pinia'
import { useUserStore } from '@/store/modules/user'


import { MdpFormMixin } from '@/components/mdp-ui/mixin/MdpFormMixin';
export default {
	mixins: [MdpFormMixin],
	name: 'xmFuncEdit',
	computed: {
		...mapState(useUserStore, ['userInfo']),

	},
	props: ['formData', 'visible', 'subOpType', 'parentFunc'],
	data() {
		return {
			currOpType: 'add',//add/edit
			editFormRules: {
				id: [
					//{ required: true, message: '主键不能为空', trigger: 'blur' }
				]
			},
			editForm: {
				id: '', name: '', pid: '', pname: '', pidPaths: '', productId: '', lvl: ''
			},
			apis: {
				add: addXmFunc,
				edit: editXmFunc,
				editSomeFields: editSomeFieldsXmFunc
			}
		}//end return
	},//end data
	methods: {
		initCurrData: function () {
			this.currOpType = this.subOpType

			if (this.currOpType == 'edit') {

			} else {
				if (this.parentFunc && this.parentFunc.id) {
					this.editForm.pid = this.parentFunc.id
					this.editForm.pname = this.parentFunc.name
				} else {
					this.editForm.pid = '0'
					this.editForm.pname = null
				}
			}
		},

		editSomeFieldsCheck(row, fieldName, $event, params) {
			params[fieldName] = $event
			return true;
		},
	},//end method
	mounted() {
		this.initData()
	}
}

</script>