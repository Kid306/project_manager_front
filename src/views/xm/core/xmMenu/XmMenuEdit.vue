<template>
	<el-row :gutter="20">
		<el-col :span="4" class="border padding">
			<h3 class="padding-bottom">
				<div class="big-icon" :style="{ backgroundColor: calcMenuLabel.color }">
					<icon :icon="calcMenuLabel.icon" />
				</div>
				{{ calcMenuLabel.label }}
			</h3>
			<el-steps space="40" :active="calcMenuCurrStep" align-center finish-status="success" process-status="process"
				direction="vertical">
				<el-step v-for="(item, index) in dicts.menuStatus" :title="item.name" :description="item.name" :key="index">
					<template #description>
						<span v-if="item.id == '0'"><!--初始-->

							<el-button class="step-btn" type="primary" @click="activateTabPaneName = '1'" plain>基础信息</el-button>
							<el-button class="step-btn" type="primary" @click="activateTabPaneName = '4'" plain>概述</el-button>
 
						</span>
						<span v-else-if="item.id == '1'"> <!--评审中--> 
								<span v-if="editForm.dclass <= '1'">
									<el-button class="step-btn" type="primary" @click="activateTabPaneName = '64'" plain>创建特性</el-button>
									<el-button class="step-btn" type="primary" @click="activateTabPaneName = '64'" plain>创建故事</el-button>
								</span>
								<span v-else-if="editForm.dclass == '2'">
									<el-button class="step-btn" type="primary" @click="activateTabPaneName = '64'" plain>创建故事</el-button>
								</span>
								<el-button class="step-btn" type="primary" @click="activateTabPaneName = '51'" plain>工时进度</el-button> 

								<el-button class="step-btn" type="primary" @click="activateTabPaneName = '3'" plain>成本</el-button> 
						</span>
						<span v-else-if="item.id == '2'"> <!--设计中-->  
							<span v-if="editForm.dclass >= '3'">
								<el-button class="step-btn" type="primary" @click="activateTabPaneName = '7'" plain>wiki</el-button>
								<el-button class="step-btn" type="primary" @click="activateTabPaneName = '8'" plain>附件</el-button>
 							</span>
						</span> 
						<span v-else-if="item.id == '3'"> <!--开发中--> 
							
							<span v-if="editForm.dclass >= '3'">
								<el-button class="step-btn" type="primary" @click="activateTabPaneName = '64'" plain>创建任务</el-button>
 							</span>
								
 						</span> 
						<span v-else-if="item.id == '4'"> <!--测试中，4，5，6，--> 
							
							<span v-if="editForm.dclass >= '3'">
 								<el-button class="step-btn" type="primary" @click="activateTabPaneName = '62'" plain>测试用例</el-button>
								<el-button class="step-btn" type="primary" @click="activateTabPaneName = '63'" plain>创建缺陷</el-button>
							</span>
  					</span> 
						<div v-else></div>
					</template>
				</el-step>
			</el-steps>
		</el-col>
		<el-col :span="20">
			<el-form :model="editForm" label-width="100px" label-position="left" :rules="editFormRules" ref="editForm">

				<el-form-item prop="menuName" >
					<template #label> 
						{{ calcMenuLabel.label }}名称
					</template>
					<el-input v-model="editForm.menuName" placeholder="名称" title="名称"
						@change="editSomeFields(editForm, 'menuName', $event)" />
					<el-space class="label-font-color">
						编号：{{ editForm.menuId }}
						<el-divider direction="vertical" />
						<span v-if="editForm.productName">归属产品：{{ editForm.productName }}
							<el-divider direction="vertical" />
						</span>
						归属产品编号：{{ editForm.productId }}

						<el-divider direction="vertical" /> 
						<MdpSelectTag v-model="editForm.tagIds" :initName="editForm.tagNames" split="," multiple showStyle="tag" relative @change2="editSomeFields(editForm,'tagIds',$event)"/>
						<el-button type="text" icon="share" @click="copyLink">分享</el-button>
					</el-space>
				</el-form-item>
				<el-row class="padding">
					<el-col :span="8">
							<mdp-field  show-style="x"  v-model="editForm.pmenuId"
								:label="editForm.dclass === '3' ? '归属特性' : (editForm.dclass === '2' ? '归属史诗' : '归属')"
								:icon="editForm.dclass === '2' ? 's-promotion' : 's-flag'"
								:color="editForm.dclass === '2' ? 'rgb(255, 153, 51)' : 'rgb(0, 153, 51)'">
								<template #oper>
									<el-space wrap>
									<el-button v-if="editForm.pmenuId && editForm.pmenuId!='0'" @click="$refs['parentDetailDlg'].open()" title="查看上级" icon="upload2"> 查看上级</el-button> 
									<el-button @click="$refs['parentDlg'].open()" title="更换上级" icon="upload2"> 更换上级</el-button>
								</el-space>
								</template>
							</mdp-field> 
					</el-col>
					<el-col :span="8"> 
							<xm-user-select :xm-product="{id:editForm.productId}" :sel-project="{id:editForm.projectId}" show-style="x"  label="负责人" v-model="editForm.mmUserid" :init-name="editForm.mmUsername"
								@change2="editSomeFields(editForm, 'mmUserid', $event)" /> 
					</el-col>
					<el-col :span="8"> 
							<xm-user-select :xm-product="{id:editForm.productId}" :sel-project="{id:editForm.projectId}" show-style="x"  label="提出人" v-model="editForm.proposerId" :init-name="editForm.proposerName"
								@change2="editSomeFields(editForm, 'proposerId', $event)" /> 
					</el-col>
				</el-row>

				<el-row class="padding">
					<el-col :span="8"> 
							<mdp-select width="100%" show-style="x"  label="状态" v-model="editForm.status" itemCode="menuStatus"
								@change="editSomeFields(editForm, 'status', $event)" /> 
					</el-col>

					<el-col :span="8"> 
							<mdp-field show-style="x"  v-model="editForm.finishRate" label="进度">
								<template #value><el-progress :percentage="editForm.finishRate ? editForm.finishRate : 0" />
								</template>
								<template #oper>
									<el-space wrap>
										<el-button @click="activateTabPaneName = '51'" type="primary">工时</el-button>
										<el-button
											@click="activateTabPaneName = '64'" type="primary">子工作项</el-button>
									</el-space>
								</template>
							</mdp-field> 
					</el-col>
					<el-col :span="8"> 
							<mdp-date-range show-style="x"  label="起止时间" type="daterange"
								 value-format="YYYY-MM-DD HH:mm:ss" format="YYYY-MM-DD" v-model="editForm"
								start-key="startTime" end-key="endTime" @change="editSomeFields(editForm, 'startTime', editForm)" />
					</el-col>
				</el-row>
				<el-tabs v-model="activateTabPaneName">
					<el-tab-pane label="基本信息" name="1">


						<el-row>

							<el-col :span="12" >
								<el-form-item label="前置故事" prop="phaseId" > 
									{{ editForm.phaseId }}
 									<el-button @click="$refs['preStoryDlg'].open()" title="设置前置故事" v-if="editForm.dclass=='3'"> 设置</el-button> 
								</el-form-item>
							</el-col>
							<el-col :span="12">
								<el-form-item label="归属模块" prop="funcName" v-if="editForm.dclass >= '3'">
									{{ editForm.funcName }}
									<el-button @click="funcVisible = true" title="设置模块"> 设置</el-button>
								</el-form-item>
							</el-col>
							<el-col :span="12">
								<el-form-item label="排序序号" prop="seqNo">
									<el-input style="max-width:99%;" v-model="editForm.seqNo" title="序号 如 1.1，1.2.3，1.3.2等"
										placeholder="如1.0 ， 1.1 ， 1.1.1等" @change="editSomeFields(editForm, 'seqNo', $event)" />

								</el-form-item>
							</el-col>
							<el-col :span="12">
								<el-form-item label="版本号" prop="sinceVersion">
									<el-input style="max-width:99%;" v-model="editForm.sinceVersion"
										@change="editSomeFields(editForm, 'sinceVersion', $event)" />
								</el-form-item>
							</el-col> 
							<el-col :span="12">
								<el-form-item label="需求类型" prop="dtype">
									<mdp-select width="100%" itemCode="demandType" v-model="editForm.dtype"
										@change="editSomeFields(editForm, 'dtype', $event)" />
								</el-form-item>
							</el-col>
							<el-col :span="12">
								<el-form-item label="需求来源" prop="source">
									<mdp-select width="100%" itemCode="demandSource" v-model="editForm.source"
										@change="editSomeFields(editForm, 'source', $event)" />
								</el-form-item>
							</el-col>
							<el-col :span="12">
								<el-form-item label="需求层次" prop="dlvl">
									<mdp-select width="100%" itemCode="demandLvl" v-model="editForm.dlvl"
										@change="editSomeFields(editForm, 'dlvl', $event)" />
								</el-form-item>
							</el-col>
							<el-col :span="12">
								<el-form-item label="优先级" prop="priority">
									<mdp-select width="100%" itemCode="priority" v-model="editForm.priority"
										@change="editSomeFields(editForm, 'priority', $event)" />
								</el-form-item>
							</el-col>
							
							<el-col :span="12">
								<el-form-item label="提出时间" prop="ctime">
									<el-date-picker value-format="YYYY-MM-DD HH:mm:ss" format="YYYY-MM-DD" v-model="editForm.ctime"
										@change="editSomeFields(editForm, 'ctime', $event)" />
								</el-form-item>
							</el-col>
						</el-row>
					</el-tab-pane>
						<el-tab-pane name="4" label="需求详情">
							 <el-text type="warning">可以从需求文档复制文字、表格等进行黏贴、复制图片黏贴(1张一次)</el-text>
						<el-form-item prop="remark" label-width="0px"> 
								<vue-editor :editorConfig="{minHeight:'450px',scroll:true,placeholder:'作为     ，我需要    ，因为    。'}"  :key="'description_' + editForm?.menuId" v-model="editForm.remark"
								class="rich-context" :editorId="'description_' + editForm?.menuId" :branch-id="userInfo.branchId" /> 
								
								<div class="footer">
									<el-button @click="handleCancel">取消</el-button>
									<el-button v-loading="load.edit" v-if="editForm.remark !== dataBak.remark" type="primary"
										@click="editSomeFields(editForm, 'remark', editForm.remark)"
										:disabled="load.edit == true">保存</el-button>
								</div>
							</el-form-item>
					</el-tab-pane>
					<el-tab-pane :label="'任务( ' + (editForm.taskCnt||0) + ' )'" name="64" v-if="editForm.dclass=='3'">
						 
						<xm-task-box v-if="activateTabPaneName == '64'" :xm-product="{id:editForm.productId,productName:editForm.productName}"
							:selProject="selProject" 
							@add-submit="onAddSubMenu" :menuId="editForm.menuId"/>
					</el-tab-pane>
					<el-tab-pane :label="'子项( ' + (editForm.childrenCnt||0) + ' )'" name="64" v-if="editForm.dclass<'3'">
						<XmMenuBox v-if="activateTabPaneName == '64'" :parent-menu="editForm"
							:xm-product="{id:editForm.productId,productName:editForm.productName}" 
							@add-submit="onAddSubMenu" :params="{dclass:''}"/>
					</el-tab-pane>
					<el-tab-pane :label="'缺陷(' + (editForm.bugCnt||0) + ')'" name="63" v-if="editForm.dclass>='3'">
						<xm-question-list v-if="activateTabPaneName == '63'"
							:xm-product="editForm.productId ? { id: editForm.productId, productName: editForm.productName } : null"
							:xm-menu="editForm" />
					</el-tab-pane>
					<el-tab-pane :label="'测试用例(' + (editForm.testCases|| 0) + ')'" name="62" v-if="editForm.dclass>='3'">
						<xm-test-case-list v-if="activateTabPaneName == '62'"
							:xm-product="{ id: editForm.productId, productName: editForm.productName }" :xm-menu="editForm" />
					</el-tab-pane>
					<el-tab-pane label="成本" name="3">
						<el-form-item label="预估金额" prop="budgetAt">
							<el-input-number :disabled="editForm.calcType !== '2'" style="width:200px;" v-model="editForm.budgetAt"
								:precision="2" :step="100" :min="0" placeholder="预算金额" /> 元
						</el-form-item>
						<el-form-item label="实际金额" prop="actAt">
							<el-input-number :disabled="editForm.calcType !== '2'" style="width:200px;" v-model="editForm.actAt"
								:precision="2" :step="100" :min="0" placeholder="实际金额" /> 元
						</el-form-item>
					</el-tab-pane>


					<el-tab-pane
						:label="'工时( ' + (editForm.actWorkload ? editForm.actWorkload : 0) + ' / ' + (editForm.budgetWorkload ? editForm.budgetWorkload : 0) + ' h )'"
						name="51" >
						<xm-workload-record v-if="activateTabPaneName == '51'" biz-type="5" :xm-menu="editForm" @editFields="Object.assign(editForm,$event)"/>
					</el-tab-pane>
					<el-tab-pane label="链接" name="5">
						<el-form-item label="需求链接" prop="demandUrl">
							<el-input v-model="editForm.demandUrl" placeholder="需求链接" />
						</el-form-item>
						<el-form-item label="代码链接" prop="codeUrl">
							<el-input v-model="editForm.codeUrl" placeholder="代码链接" />
						</el-form-item>
						<el-form-item label="设计链接" prop="designUrl">
							<el-input v-model="editForm.designUrl" placeholder="设计链接" />
						</el-form-item>
						<el-form-item label="操作手册链接" prop="operDocUrl">
							<el-input v-model="editForm.operDocUrl" placeholder="操作手册链接" />
						</el-form-item>

						<el-row class="padding">
							<el-button v-loading="load.edit" type="primary"
								@click="editSomeFields(editForm, 'link', { demandUrl: editForm.demandUrl, codeUrl: editForm.codeUrl, designUrl: editForm.designUrl, operDocUrl: editForm.operDocUrl })"
								:disabled="load.edit == true">提交链接</el-button>
						</el-row>
					</el-tab-pane>
					<el-tab-pane label="wiki" name="7">
						<archive-edit v-if="activateTabPaneName == '7' && editForm && editForm.menuId" :xm-menu="editForm" />
					</el-tab-pane>
					<el-tab-pane label="附件" name="8">
						上传附件
					</el-tab-pane>
					<el-tab-pane label="关注" name="91">
						<MdpFocus v-if="activateTabPaneName == '91'" :biz-id="editForm.menuId" :pbiz-id="editForm.productId"
							:biz-name="editForm.menuName" focus-type="4" />
					</el-tab-pane>
					<el-tab-pane label="日志" name="9">
						<xm-record v-if="activateTabPaneName == '9'" :product-id="editForm.productId" :pbiz-id="editForm.menuId"  />
					</el-tab-pane>
					<el-tab-pane label="评论区" name="10">
						<comment-area v-if="activateTabPaneName == '10'" :target-id="editForm.menuId" />
					</el-tab-pane>
				</el-tabs>
			</el-form>
		</el-col> 
	</el-row>  

	<mdp-dialog ref="parentDetailDlg" title="上级需求详情"  fullscreen    append-to-body
		:close-on-click-modal="false">
		<template #default="{visible,dialog}">
		<xm-menu-detail  :reload="true" :visible="visible" :formData="{ menuId: editForm.pmenuId }" :sel-project="selProject"  @cancel="dialog.close()" />
		</template>
	</mdp-dialog>

	<mdp-dialog ref="parentDlg" append-to-body title="选择上级需求"  width="60%" :close-on-click-modal="false">
		<XmEpicFeatures @select="onParentMenuSelected" subOpType="select" showConfirm
			:xm-product="{ id: editForm.productId, productName: editForm.productName }" />
	</mdp-dialog>
	<mdp-dialog ref="funcDlg" append-to-body title="模块选择" v-model="funcVisible" size="40%" top="20px" :close-on-click-modal="false">
		<xm-func-tree showConfirm subOpType="mng" class="padding-left padding-right"  @select="onFuncSelected"
			:xm-product="{ id: editForm.productId, productName: editForm.productName }" />
	</mdp-dialog>
	<mdp-dialog ref="preStoryDlg"
    append-to-body
    title="选择前置故事" 
    width="85%"
    :close-on-click-modal="false"
  >
    <XmMenuBox subOpType="select" multiple showConfirm @select="onPreStorySelect" :xm-product="product?.id?product:{id:editForm.productId}"/>
  </mdp-dialog>
</template>

<script>
import util from '@/components/mdp-ui/js/util';//全局公共库

import { listXmMenuWithState, editXmMenu, editXmMenuSomeFields, batchChangeParentMenu } from '@/api/xm/core/xmMenu';
import { mapState } from 'pinia'
import { useUserStore } from '@/store/modules/user'
import XmRecord from '../xmRecord/XmRecord.vue'
import ArchiveEdit from '@/views/xm/core/wiki/archive/WikiMenuEdit.vue'; 

import { defineAsyncComponent } from 'vue';  
import CommentArea from '../xmMenuComment/comment-area.vue';
import clipboard3 from 'vue-clipboard3'
const { toClipboard } = clipboard3();
import { Editor as VueEditor } from '@/components/Editor'

import { MdpFormMixin } from '@/components/mdp-ui/mixin/MdpFormMixin';
	export default {
		mixins:[MdpFormMixin],
	computed: {
		...mapState(useUserStore, [
			'userInfo', 'roles'
		]),
		calcMenuCurrStep() {
			var status = this.dicts['menuStatus']?.findIndex(i => this.editForm.status == i.id) + 1
			return status;
		},
		calcMenuLabel() {
			var params = { label: '工作项', icon: '', color: '' };
			if (this.editForm.dclass === '1') {
				params = { label: '史诗', icon: 'ep:promotion', color: 'rgb(255, 153, 51)' };
			} else if (this.editForm.dclass === '2') {
				params = { label: '特性', icon: 'ep:flag', color: 'rgb(0, 153, 51)' };
			} else if (this.editForm.dclass === '3') {
				params = { label: '故事', icon: 'ep:document', color: ' rgb(79, 140, 255)' };
			}
			return params;
		},
		 
	},
	props: ['formData', 'visible', 'parentMenu', 'product', 'dclass', 'selProject', 'reload'],
	watch: { 
		'editForm.actWorkload': function (val, oldVal) {
			if (!this.editForm.budgetWorkload) {
				return;
			}
			if (val == 0 || !val) {
				return;
			}
			this.editForm.finishRate = Math.round(val / this.editForm.budgetWorkload * 100)
			if (this.editForm.finishRate > 100) {
				this.editForm.finishRate = 100;
			}
		},
		'editForm.budgetWorkload': function (val, oldVal) {
			if (!this.editForm.actWorkload) {
				return;
			}
			if (val == 0 || !val) {
				return;
			}
			this.editForm.finishRate = Math.round(this.editForm.actWorkload / val * 100)
			if (this.editForm.finishRate > 100) {
				this.editForm.finishRate = 100;
			}
		}
	},
	data() {
		return {
			pkNames:['menuId'],
			currOpType:'edit',
			//dicts:{},//下拉选择框的所有静态数据  params=[{categoryId:'0001',itemCode:'sex'}] 返回结果 {'sex':[{optionValue:'1',optionName:'男',seqOrder:'1',fp:'',isDefault:'0'},{optionValue:'2',optionName:'女',seqOrder:'2',fp:'',isDefault:'0'}]}
			load: { list: false, add: false, del: false, edit: false },//查询中...
			editFormRules: {
				menuId: [
					//{ required: true, message: '需求编号不能为空', trigger: 'blur' }
				],
				menuName: [
					{ required: true, message: '需求名称不能为空', trigger: 'change' },
					{ min: 2, max: 250, message: '长度在 2 到 250 个字符', trigger: 'change' },//长度
				],
				mmUserid: [
					{ required: true, message: '负责人不能为空', trigger: 'change' }
				],
				remark: [
					{ max: 5000, message: '长度在 0 到 5000 个字符,汉字最多2500个汉字', trigger: 'change' },//长度
				],
			},
			//新增界面数据 项目需求表
			editForm: {
				startTime: '', menuId: '', menuName: '', pmenuId: '', productId: '', remark: '', status: '0', online: '0', demandUrl: '', codeUrl: '', designUrl: '', docUrl: '', helpUrl: '', operDocUrl: '', seqNo: '', mmUserid: '', mmUsername: '', ctime: '', ntype: '0', sinceVersion: '', childrenCnt: '0', ltime: '', tagIds: '', tagNames: '', pidPaths: '', lvl: '0', isTpl: '0', phaseId: '', iterationId: '', source: '1', proposerId: '', proposerName: '', dlvl: '0', dtype: '0', priority: '0', dclass: '', iterationName: '', endTime: '', funcId: '', funcName: '', comments: '', ups: '0', reads: '0'
			},
			proposerSelectVisible: false,
			mmUserSelectVisible: false,
			dicts: {
				menuStatus: [
				]
			},
			tagSelectVisible: false, 
			activateTabPaneName: '4',
			pmenuFormVisible: false,
			parentMenuVisible: false,
			funcVisible: false,
			apis:{
				edit: editXmMenu,
				editSomeFields: editXmMenuSomeFields
			}
			/**begin 在下面加自定义属性,记得补上面的一个逗号**/

			/**end 在上面加自定义属性**/
		}//end return
	},//end data
	methods: { 
		// 取消按钮点击 父组件监听@cancel="editFormVisible=false" 监听
		handleCancel: function () {
			this.$emit('cancel');
		},
		showPmenu() {

		},
		changePmenu() {

		}, 
		
		initCurrData() { 
				if (this.reload == true) {
					this.searchXmMenus();
				}  
				this.activateTabPaneName = "4" 
		},
		selectProposer() {
			this.proposerSelectVisible = true;
		},
		onProposerSelected(users) {
			if (users && users.length > 0) {
				this.editForm.proposerId = users[0].userid
				this.editForm.proposerName = users[0].username
			}
			this.editSomeFields(this.editForm, 'proposerId', { proposerId: this.editForm.proposerId, proposerName: this.editForm.proposerName })

			this.proposerSelectVisible = false
		},
		clearProposer: function () {
			this.editForm.proposerId = ''
			this.editForm.proposerName = ''
		},
		onMmUserSelected(users) {
			if (users && users.length > 0) {
				this.editForm.mmUserid = users[0].userid
				this.editForm.mmUsername = users[0].username
			}
			this.editSomeFields(this.editForm, 'mmUserid', users)
			this.mmUserSelectVisible = false
		},
		clearMmUser: function () {
			this.editForm.mmUserid = ''
			this.editForm.mmUsername = ''
		},  

		toFixed(floatValue) {
			if (floatValue == null || floatValue == '' || floatValue == undefined) {
				return 0;
			} else {
				return parseFloat(floatValue).toFixed(2);
			}
		},
		editSomeFieldsCheck(row, fieldName, $event,params) { 
			if (fieldName === 'iterationId') {
				if ($event) {
					params[fieldName] = $event.id;
					params.iterationName = $event.iterationName
				} else {
					return;
				}
			} else if (fieldName === 'tagIds') {
				if ($event) {
					params[fieldName] = $event.map(i => i.tagId).join(",");
					params.tagNames = $event.map(i => i.tagName).join(",");
				} else {
					return;
				}
			} else if (fieldName === 'workload') {
				params = { ...params, ...$event }
			} else if (fieldName === 'mmUserid') {
				params.mmUserid = $event.userid
				params.mmUsername = $event.username
			} else if (fieldName === 'proposerId') {
				params.proposerId = $event.userid
				params.proposerName = $event.username
			} else if (fieldName === 'startTime') {
				params.startTime = $event.startTime
				params.endTime = $event.endTime
			} else if (fieldName === 'funcId') {
				params.funcId = $event.id
				params.funcName = $event.name
			} else {
				if (typeof $event === 'string') {
					params[fieldName] = $event
				} else {
					params = { ...params, ...$event }
				}
			}  
			return true;
		},
		onAddSubMenu(menu) {

			this.$emit("add-sub-menu", menu)
		},
		searchXmMenus() {
			let callback = (res) => {
				var tips = res.tips;
				if (tips.isOk) {
					this.editForm = res.data[0]
					this.dataBak = Object.assign({}, this.editForm)
				} else {
					this.$notify({ position: 'bottom-left', showClose: true, message: tips.msg, type: 'error' });
				}
				this.load.list = false;
			}
			this.load.list = true;
			var params = { menuId: this.formData.menuId }
			if(!params.menuId){
				return;
			}
			listXmMenuWithState(params).then(callback).catch(err => this.load.list = false);
		},
		onParentMenuSelected(menu) {

			if (!menu || !menu.menuId) {
				this.$notify({ position: 'bottom-left', showClose: true, message: '请先选择一个上级需求', type: 'warning' })
				return;
			}
			if(this.editForm.dclass=='2'){
				if(menu.dclass!='1'){
					this.$notify({ position: 'bottom-left', showClose: true, message: '当前为特性，只能选择史诗作为特性的上级', type: 'error' })
					return;
				}
			}else if(this.editForm.dclass=='1'){
			 
				this.$notify({ position: 'bottom-left', showClose: true, message: '当前为史诗，不能选择任何需求作为其上级', type: 'error' })
				return; 
			}
			this.parentMenuVisible = false;
			var params = [{ 
				menuId: this.editForm.menuId,
				pmenuId: menu.menuId
				}
			]
			batchChangeParentMenu(params).then(res => {
				var tips = res.tips;
				if (tips.isOk) {
					this.$refs['parentDlg'].close()
					this.editForm.pmenuId = menu.menuId
					this.dataBak = { ...this.editForm }
					this.$emit("edit-fields", params);
				}
				this.$notify({ position: 'bottom-left', showClose: true, message: tips.msg, type: tips.isOk ? 'success' : 'error' })
			})
		},

		onFuncSelected(row) {
			this.editForm.funcId = row.id
			this.editForm.funcName = row.name
			this.funcVisible = false;
			if (this.opType !== 'add') {
				this.editSomeFields(this.editForm, 'funcId', row)
			}
		},

		copyLink() {
			var curlDomain=window.location.protocol+"//"+window.location.host; //   
			var link = this.$mdp.getUri(curlDomain,import.meta.env.VITE_CONTEXT,import.meta.env.VITE_UI_VERSION,"/#/", "/xm/product/menu/detail")+"?menuId=" + this.editForm.menuId
			toClipboard(link).then(e => {
				this.$notify({ position: 'bottom-left', showClose: true, message: "拷贝链接成功，您可以黏贴到任何地方", type: 'success' })
			});
		},
		
    onPreStorySelect(storys){
      if(storys && storys.length>3){
        this.$message.error('最多选3个故事')
        return;
      }
			if(storys.some(k=>k.menuId==this.editForm.menuId)){ 
        this.$message.error('不能选自己作为前置')
				return;
			}
      this.editSomeFields(this.editForm,'phaseId',storys.map(k=>k.menuId).join(","))
      this.$refs['preStoryDlg'].close()
    },
	},//end method
	components: { 
		XmRecord,
		ArchiveEdit,
		'xm-workload-record': defineAsyncComponent(()=>import("../xmWorkload/XmWorkloadRecord.vue")), 
		CommentArea, 
 		VueEditor,
	},
	mounted() {
		this.$mdp.getDictOptions('menuStatus').then(res => {
			this.dicts['menuStatus'] = res
		})
		this.initData()
		/**在下面写其它函数***/

	}//end mounted
}

</script>

<style scoped>
.step-btn {
	margin-left: 0px;
	margin-bottom: 5px;
}
</style>
