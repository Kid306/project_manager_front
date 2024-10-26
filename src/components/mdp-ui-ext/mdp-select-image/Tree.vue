<template>
	<MdpTree ref="nodeTree" title="分类" showCheckbox :props="propsCpd" :load="listImageCategory" :del="delImageCategory"
		:batchDel="batchDelImageCategory" :multiple="multiple" :showConfirm="showConfirm" :hidden="hiddenCpd"
		@addTopNode="(cb) => onAddTopClick(cb)" @editNode="(d, cb, subcb) => onEditClick(d, cb, subcb)"
		@addSubNode="(p, cb) => onAddSubClick(p, cb)" @changePid="(cks, cb) => onChangePidClick(cks, cb)"
		@confirm="(d) => { $emit('confirm', d); $emit('select', d) }" @check-change="(d, c, i) => $emit('check-change', d, c, i)"
		@node-click="(d, n, c) => $emit('node-click', d, n, c)" rootId="0" :draggable="true">
		<template #nodeName="{ data }">
			<el-space>
				<div>
					<Icon v-if="data.icon" :icon="data.icon" />{{ data.categoryName }}
				</div>
			</el-space>
		</template>
	</MdpTree>

	<!--编辑 ImageCategory xm_project_func界面-->
	<mdp-dialog ref="editDialog" width="30%" append-to-body :close-on-click-modal="false">
		<template #default="{ data, dialog }">
			<el-form ref="editForm" :model="editForm" label-width="150">
				<el-form-item label="分类编号" prop="id">
					{{ editForm.id }}
				</el-form-item>
				<el-form-item label="分类名称" prop="categoryName" :rules="[
					{ required: true, message: '名称不能为空' }
				]">
					<el-input v-model="editForm.categoryName" />
				</el-form-item>


				<el-form-item label="图标">
					<IconSelect v-model="editForm.icon" />
				</el-form-item>
			</el-form>

			<div class="footer">
				<el-button @click="dialog.close()">关 闭</el-button>
				<el-button type="primary" v-loading="loading.edit" @click="editSubmit(data.callback)">确 定</el-button>
			</div>
		</template>
	</mdp-dialog>

	<!--新增 ImageCategory xm_project_func界面-->
	<mdp-dialog ref="addDialog" width="30%" append-to-body :close-on-click-modal="false">
		<template #default="{ data, dialog }">
			<el-form ref="addForm" :model="addForm" label-width="150">
				<el-form-item label="上级分类">

					<el-tag>{{ data.parent && data.parent.id && data.parent.id != '0' ? "上级：" + data.parent.categoryName : "顶级分类0" }}</el-tag>

				</el-form-item>
				<el-form-item label="分类编号" prop="id">
					<el-input v-model="addForm.id" placeholder="如果为空，则系统自动生成" />
				</el-form-item>
				<el-form-item label="分类名称" prop="categoryName" :rules="[
					{ required: true, message: '名称不能为空' }
				]">
					<el-input v-model="addForm.categoryName" />
				</el-form-item>

				<el-form-item label="图标">
					<IconSelect v-model="addForm.icon" />
				</el-form-item>
			</el-form>

			<div class="footer">
				<el-button @click="dialog.close()">关闭</el-button>
				<el-button type="primary" v-loading="loading.add" @click="addSubmit(data.parent, data.callback)">确 定</el-button>
			</div>
		</template>
	</mdp-dialog>
</template>

<script>
import util from '@/components/mdp-ui/js/util' //全局公共库

import {
	addImageCategory,
	editImageCategory,
	delImageCategory,
	batchDelImageCategory,
	listImageCategory,
	batchChangeParentImageCategory,
} from '@/api/mdp_pub/larc'
import { mapState } from 'pinia'
import { useUserStore } from '@/store/modules/user'

export default {
	props: {
		'subOpType': { type: String, defalut: 'mng' },
		'multiple': { type: Boolean, default: false },
		'showConfirm': { type: Boolean, default: false },
		'hidden': { type: Object, default: () => null },
		'params': { type: Object, default: () => null },
		'clearable': { type: Boolean, default: true },
		categoryType: {//主题
			type: String,
			default: null
		},
		/**
		 * 上级分类
		 */
		pid: {
			type: String,
			default: ''
		},
		crelyType: {
			type: String,
			default: ''
		},
		crelyId: {
			type: String,
			default: ''
		},
		crelyStype: {
			type: String,
			default: '',
		},
		crelySid: {
			type: String,
			default: ''
		}
	},
	computed: {
		...mapState(useUserStore, ['userInfo', 'roles']),

		hiddenCpd() {
			var isSelect = this.subOpType == 'select'
			var hidden = {
				batchDel: true,
				del: isSelect,
				changePid: false,
				addTop: isSelect,
				addSub: isSelect,
				edit: isSelect,
				filter: false,
				page: true,
			}
			hidden = Object.assign(hidden, this.hidden)
			return hidden
		},
		propsCpd() {
			return {
				id: 'id', pid: 'pid', label: 'categoryName', isLeaf: (data, n) => {
					return data.childNum <= 0
				}
			}
		}
	},
	data() {
		return {
			filters: {
				categoryType: ''
			},
			addForm: { id: '', pid: '', categoryName: '', isLeaf: '0', isAuth: '0', limitType: '2', categoryType: '', pqx: '', qxLvl: '' },
			editForm: { id: '', pid: '', categoryName: '', isLeaf: '0', isAuth: '0', limitType: '2', categoryType: '', pqx: '', qxLvl: '' },
			loading: { add: false, edit: false, list: false }
		}
	}, //end data
	methods: {
		listImageCategory(params, node) {
			Object.assign(params, this.filters)
			if (this.params) {
				Object.assign(params, this.params)
			}
			return listImageCategory(params)
		},
		delImageCategory,
		batchDelImageCategory,
		//显示编辑界面 ImageCategory xm_project_func
		onEditClick: function (formData, callback, addSubCallback) {
			this.editForm = { ...formData }
			this.$refs['editDialog'].open({
				formData: formData,
				callback: callback,
				addSubCallback: addSubCallback
			})
		},
		//显示新增界面 ImageCategory xm_project_func
		onAddTopClick: function (callback) {
			var formData = {}
			if (!this.initExtParams(formData)) {
				return
			}

			this.$refs['addDialog'].open({
				formData: formData,
				parent: null,
				callback: callback
			})
		},
		initExtParams(formData, parent) {
			if (this.categoryType) {
				formData.categoryType = this.categoryType
			}
			return true
		},
		onAddSubClick: function (parent, callback) {
			var formData = {}
			if (!this.initExtParams(formData, parent)) {
				return
			}
			Object.assign(formData, parent)
			formData.pid = parent.id
			formData.id = null
			this.addForm = { ...formData }
			this.$refs['addDialog'].open({
				formData: formData,
				parent: parent,
				callback: callback
			})
		},
		onChangePidClick: function (idLinks, callback) {
			batchChangeParentImageCategory(idLinks).then(res => {
				let { tips } = res
				if (tips.isOk) {
					if (callback) {
						callback(true)
					}
					this.$message.success(tips.msg)
				} else {
					this.$message.error(tips.msg)
				}
			})
		},
		addSubmit(parent, callback) {
			var branchId = this.userInfo.branchId

			this.addForm.branchId = branchId
			if (this.crelyType) {
				this.addForm.crelyType = this.crelyType
			}

			if (this.crelyId) {
				this.addForm.crelyId = this.crelyId
			}

			if (this.crelyStype) {
				this.addForm.crelyStype = this.crelyStype
			}

			if (this.crelySid) {
				this.addForm.crelySid = this.crelySid
			}
			if (this.filters.categoryType) {
				this.addForm.categoryType = this.filters.categoryType
			}
			if (this.categoryType) {

				this.addForm.categoryType = this.categoryType
			}
			this.$refs.addForm.validate((valid) => {
				if (valid) {
					this.$confirm('确认提交吗？', '提示', {}).then(() => {
						this.loading.add = true;
						addImageCategory(this.addForm).then(res => {
							this.loading.add = false;
							if (res.tips.isOk) {
								this.$message.success(res.tips.msg);
								this.$refs.addDialog.close()
								callback(res.data)
							} else {
								this.$message.error(res.tips.msg);
							}
						}).catch(e => this.loading.add = false);

					});
				}
			});
		},
		editSubmit(callback) {
			this.$refs.editForm.validate((valid) => {
				if (valid) {
					this.$confirm('确认提交吗？', '提示', {}).then(() => {
						this.loading.edit = true;
						editImageCategory(this.editForm).then(res => {
							if (res.tips.isOk) {
								this.loading.edit = false
								this.$refs.editDialog.close();
								this.$message.success(res.tips.msg);
								callback(this.editForm)
							} else {
								this.$message.error(res.tips.msg);
							}
						}).catch(e => this.loading.edit = false);

					});
				}
			});
		}

	},  
}
</script>

<style lang="scss" />
