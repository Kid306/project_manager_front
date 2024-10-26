<template>
	<el-form :model="editForm" label-width="80" :rules="editFormRules" ref="editForm" label-position="left">
		<el-row> 
			<el-col :span="18" class="padding-right">

				<el-form-item label="缺陷标题" prop="name">
					<el-input v-model="editForm.name" placeholder="缺陷标题"
						@change="editSomeFields(editForm, 'name', $event)" />
					<span v-if="subOpType !== 'add'">
						<span class="label-font-color">缺陷编号：{{ editForm.id }} </span>
						<el-divider direction="vertical" />
						<span class="label-font-color">{{ editForm.createUsername }} 于 {{ editForm.createTime }} 创建 </span>
						<el-divider direction="vertical" /> 
						<MdpSelectTag relative showStyle="tag" v-model="editForm.tagIds" :initName="editForm.tagNames" multiple split="," @change2="editSomeFields(editForm, 'tagIds', $event)"/>
						<el-divider direction="vertical" />
						<el-button type="text" icon="share" @click="copyLink">分享</el-button>
					</span>
				</el-form-item>
				<el-row>
					<el-col :span="6">
						<el-form-item>
							<xm-user-select show-style="x" :xmProduct="xmProductCpd||{id:editForm.productId}" :selProject="selProject||{id:editForm.projectId}" size="medium" label="责任人" v-model="editForm.handlerUserid" :init-name="editForm.handlerUsername"
								@change2="onHandlerUserSelect" :clearable="false">
								<template #toolbar>
									指派给 <el-button type="text" @click="sendToAsk"> 提出人</el-button>
									 <el-button type="text"
										@click="sendToCreater"> 创建人</el-button>
										
										<el-button type="text"
										@click="sendToCreater" v-if="xmTask?.id && xmTask.createUserid"> 任务负责人【{{ xmTask.createUsername }}】</el-button>
										<el-button type="text"
										@click="sendToCreater" v-if="xmTask?.id && xmTask.executorUserid"> 任务执行人【{{ xmTask.executorUsername }}】</el-button>
										<el-button type="text"
										@click="sendToCreater" v-if="xmMenu?.id && xmMenu.mmUserid"> 需求负责人{{ xmMenu.mmUsername }}</el-button>
								</template>
							</xm-user-select>
						</el-form-item>

					</el-col>

					<el-col :span="6">
						<el-form-item>
							<mdp-select show-style="x" size="medium" label="状态" itemCode="bugStatus" v-model="editForm.bugStatus"
								@change="editSomeFields(editForm, 'bugStatus', $event)" />
						</el-form-item>
					</el-col>

					<el-col :span="6">
						<el-form-item>
							<mdp-select show-style="x" size="medium" label="优先级" itemCode="priority" v-model="editForm.priority"
								@change="editSomeFields(editForm, 'priority', $event)" />
						</el-form-item>
					</el-col>

					<el-col :span="6">
						<el-form-item>
							<mdp-date show-style="x" size="medium" label="结束时间" value-format="YYYY-MM-DD HH:mm:ss"
								v-model="editForm.endTime" @change="editSomeFields(editForm, 'endTime', $event)" />
						</el-form-item>
					</el-col>
				</el-row>
				<el-tabs v-model="activateTabPaneName" ref="editRef">

					<el-tab-pane label="缺陷描述" name="12">
						<el-form-item label="" prop="description" label-width="0px">
							<el-text type="warning">操作步骤，错误情况；如果关联了执行用例，此处不需要描述太多，开发人员可以通过测试用例查看详细的测试步骤和执行结果</el-text>
							<vue-editor :height="250"  :key="'description_' + editForm?.id"
								class="rich-context" :editorId="'description_' + editForm?.id" :branch-id="userInfo.branchId"
								v-model="editForm.description" />
						</el-form-item>
						<div v-if="subOpType !== 'add'" class="footer">
							<el-button @click="handleCancel">取消</el-button>
							<el-button v-loading="load.edit" v-if="editForm.description !== dataBak.description" type="primary"
								@click="editSomeFields(editForm, 'description', editForm.description)"
								:disabled="load.edit == true">保存</el-button>
						</div>
					</el-tab-pane>
					<el-tab-pane name="1" label="基本信息">
						<el-row>

							<el-col :span="8">
								<el-form-item label="提出人" prop="askUsername">
									<xm-user-select :xm-product="product" :sel-project="project" show-style="tag" label="提出人" v-model="editForm.askUserid"
										:init-name="editForm.askUsername" @change2="editSomeFields(editForm, 'askUserid', $event)" />
								</el-form-item>
							</el-col>
							<el-col :span="8">
								<el-form-item label="复现频率" prop="repRate">
									<mdp-select show-style="tag" itemCode="bugRepRate" v-model="editForm.repRate"
										@change="editSomeFields(editForm, 'repRate', $event)" />
								</el-form-item>

							</el-col>
							<el-col :span="8">
								<el-form-item label="复现版本" prop="verNum">
									<el-input v-model="editForm.verNum" placeholder="请填写版本号"
										@change="editSomeFields(editForm, 'verNum', $event)" />
								</el-form-item>
							</el-col>
							<el-col :span="8">
								<el-form-item label="严重程度" prop="bugSeverity">
									<mdp-select show-style="tag" itemCode="bugSeverity" v-model="editForm.bugSeverity"
										@change="editSomeFields(editForm, 'bugSeverity', $event)" />

								</el-form-item>
							</el-col>
							<el-col :span="8">
								<el-form-item label="原因分析" prop="bugReason">
									<mdp-select show-style="tag" itemCode="bugReason" v-model="editForm.bugReason"
										@change="editSomeFields(editForm, 'bugReason', $event)" />

								</el-form-item>
							</el-col>


							<el-col :span="8">
								<el-form-item label="排序号码" prop="sortNo">
									<el-input v-model="editForm.sortNo" placeholder="1.0.1"
										@change="editSomeFields(editForm, 'sortNo', $event)" />
								</el-form-item>
							</el-col>
							<el-col :span="8">
								<el-form-item label="解决方案" prop="solution">
									<mdp-select show-style="tag" itemCode="bugSolution" v-model="editForm.solution"
										@change="editSomeFields(editForm, 'solution', $event)" />

								</el-form-item>
							</el-col>
							<el-col :span="8">
								<el-form-item label="缺陷类别" prop="bugType">
									<mdp-select show-style="tag" itemCode="bugType" v-model="editForm.bugType"
										@change="editSomeFields(editForm, 'bugType', $event)" />

								</el-form-item>

							</el-col>
						</el-row>
					</el-tab-pane>

					<!-- <el-tab-pane label="测试步骤" name="2">
 							<test-step-result v-model="editForm.opStep" v-if="stepConfigVisible == false"/> 
 							<test-step-config v-model="editForm.opStep" v-if="stepConfigVisible == true"/>
 						<el-space wrap>
							&nbsp;&nbsp;<el-button @click="handleCancel">取消</el-button>
							<el-button @click="stepConfigVisible = !stepConfigVisible">{{ stepConfigVisible ? '完成步骤配置' : '去配置步骤' }}</el-button>
							<el-button v-loading="load.edit" v-if="editForm.opStep != dataBak.opStep" type="primary"
								@click="editSomeFields(editForm, 'opStep', editForm.opStep)"
								:disabled="load.edit == true">保存</el-button>
						</el-space>
					</el-tab-pane> -->


					<el-tab-pane
						:label="'工时( ' + (editForm.actWorkload ? editForm.actWorkload : 0) + ' / ' + (editForm.budgetWorkload ? editForm.budgetWorkload : 0) + ' h )'"
						name="55">
						<xm-workload-record v-if="activateTabPaneName == '55'" biz-type="2" :xm-task="xmTask" :xm-question="editForm" :parentOpType="currOpType" @editFields="Object.assign(editForm,$event)"/>
					</el-tab-pane>
					<el-tab-pane label="流转记录" name="4" v-if="subOpType != 'add'">
						<xm-question-handle-mng v-if="activateTabPaneName == '4'" :bug="editForm" :visible="activateTabPaneName == '4'" />
					</el-tab-pane>
					<el-tab-pane label="关注" name="91" v-if="subOpType != 'add'">
						<MdpFocus v-if="activateTabPaneName == '91'" :biz-id="editForm.id" :pbiz-id="editForm.projectId"
							:biz-name="editForm.name" focus-type="5" />
					</el-tab-pane>



				</el-tabs>
			</el-col>
			<el-col :span="6" class="border padding-left padding-bottom">
 					<el-form-item label="归属项目" prop="projectId"> 
						<XmProjectSelect width="100%" showStyle="tag" v-model="editForm.projectId" :linkProductId="editForm.productId" :disabled="selProject?.id" @change2="onProjectConfirm" @clear="clearProject"/>
					</el-form-item>
					<el-form-item label="归属产品" prop="productId"> 
							<xm-product-select width="100%" showStyle="tag" ref="xmProductSelect1" v-model="editForm.productId"
								:link-project-id="selProject ? selProject.id : null" @change2="onProductSelected"
								@clear="onProductClearSelect" :disabled="xmProductCpd?.id"/> 
					</el-form-item>
					<span v-if="editForm.productId">
						<el-form-item label="关联用例" prop="caseId"> 
									<MdpField>
										<template #info>
											{{ editForm.caseName ? editForm.caseName : '无' }}
										</template>
										<template #oper>
											<el-button type="text"
												@click="caseVisible = true">选择用例</el-button>
											<el-button type="text" v-if="editForm.caseId && editForm.planId"
												@click="$refs['planCaseDetailDlg'].open()">查看执行用例详情</el-button>
												
											<el-button type="text" v-else-if="editForm.caseId"
												@click="$refs['caseDetailDlg'].open()">查看用例详情</el-button>
										</template>
									</MdpField>
						</el-form-item>
						<el-form-item label="归属模块" prop="funcId"> 
									<XmFuncSelect width="100%" showStyle="tag" v-model="editForm.funcId" :init-name="editForm.funcName"  :xmProduct="xmProductCpd||{id:editForm.productId}" @change2="onFuncSelected"/>
						</el-form-item>
						<el-form-item label="归属需求" prop="menuId"> 
							<XmMenuSelect width="100%" showStyle="tag" v-model="editForm.menuId" :init-name="editForm.menuName" :xmProduct="xmProductCpd||{id:editForm.productId}" @change2="onSelectedMenu"/>
						</el-form-item>
						
						<el-form-item label="归属任务" prop="taskId" v-if="editForm.projectId"> 
							<XmTaskSelect width="100%" showStyle="tag" v-model="editForm.taskId" :xmProduct="xmProductCpd||{id:editForm.productId}" :selProject="{id:editForm.projectId}" :menuId="editForm.menuId" @change2="onSelectedTask" :disabled="xmTask?.id"/>
						</el-form-item>
					</span> 

 					<el-form-item label="最新意见" prop="remarks"/>
					<div  class="padding-bottom">
						<el-text type="info">{{ editForm.remarks || '无' }}</el-text>
					</div>
					
					<el-form-item label="我的意见" prop="remarks2" />
						<mdp-input type="textarea" :rows="3" v-model="editForm.remarks2" placeholder="处理意见"
							@change="editSomeFields(editForm, 'remarks', $event)" />
					
 			</el-col>
		</el-row>
		<el-row class="footer" v-if="subOpType === 'add'">
			<el-button type="primary" @click="saveSubmit">保存</el-button>
		</el-row>
	</el-form>
 
 

	<mdp-dialog append-to-body title="执行用例选择" v-model="caseVisible" width="80%" top="20px" :close-on-click-modal="false">
		<xm-test-plan-case-list v-if="caseVisible" subOpType="select"
			:xm-project="selProject && selProject.id ? selProject : (editForm.projectId ? { id: editForm.projectId } : null)"
			:xm-test-plan="xmTestPlan"
			:xm-product="editForm.productId ? { id: editForm.productId, productName: editForm.productName } : xmProductCpd"
			@select="onTestPlanCaseSelected" />
	</mdp-dialog>
	<mdp-dialog ref="planCaseDetailDlg" append-to-body title="执行用例详情" fullscreen :close-on-click-modal="false">
		<xm-test-plan-case-detail v-if="editForm.planId && editForm.caseId" :xmTestPlanCase="{caseId:editForm.caseId,planId:editForm.planId}" :reload="true"/>
	</mdp-dialog>
	
	<mdp-dialog ref="caseDetailDlg" append-to-body title="用例详情" fullscreen :close-on-click-modal="false">
		<xm-test-case-detail v-if="editForm.caseId" :xmTestCase="{id:editForm.caseId}" :reload="true"/>
	</mdp-dialog>
</template>

<script>
import util from '@/components/mdp-ui/js/util';//全局公共库

import { addXmQuestion, editXmQuestion, editXmQuestionSomeFields } from '@/api/xm/core/xmQuestion';
import { mapState } from 'pinia'
import { useUserStore } from '@/store/modules/user';
import { sn } from '@/components/mdp-ui/js/sequence';
//import { Editor as VueEditor } from '@/components/Editor'

import { Editor as VueEditor } from '@/components/Editor'
import XmQuestionHandleMng from '../xmQuestionHandle/XmQuestionHandleMng.vue';//修改界面
import clipboard3 from 'vue-clipboard3'
const { toClipboard } = clipboard3();
 

// import TestStepConfig from '../xmTestCase/TestStepConfig.vue';
// import TestStepResult from '../xmTestPlanCase/TestStepResult.vue';

import { MdpFormMixin } from '@/components/mdp-ui/mixin/MdpFormMixin';
import { defineAsyncComponent } from 'vue';
export default {
	mixins:[MdpFormMixin],
	computed: {
		...mapState(useUserStore, [
			'userInfo', 'roles'
		]),

		calcBugStep() {
			if (this.dicts['bugStatus'] && this.editForm) {
				var index = this.dicts['bugStatus'].findIndex(i => {
					if (i.id == this.editForm.bugStatus) {
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
		xmProductCpd() {
			if (this.formData && this.formData.id && this.formData.productId) {
				return { id: this.formData.productId, productName: this.formData.productName }
			}
			if (this.xmProduct && this.xmProduct.id) {
				return this.xmProduct
			}
			if (this.xmTestPlan && this.xmTestPlan.id) {
				return { id: this.xmTestPlan.productId, productName: this.xmTestPlan.productName }
			}
			if (this.xmTestPlanCase && this.xmTestPlanCase.id && this.xmTestPlanCase.productId) {
				return { id: this.xmTestPlanCase.productId, productName: this.xmTestPlanCase.productName }
			}
			if (this.xmTestCase && this.xmTestCase.id) {
				return { id: this.xmTestCase.productId, productName: this.xmTestCase.productName }
			}
			if (this.xmMenu && this.xmMenu.menuId) {
				return { id: this.xmMenu.productId, productName: this.xmMenu.productName }
			}

			if (this.xmIteration && this.xmIteration.id) {
				return { id: this.xmIteration.productId, productName: this.xmIteration.productName }
			}
			return null
		}
	},
	props: ['formData', 'visible', "selProject", 'subOpType', 'xmProduct', 'xmTestCase', 'xmTestPlanCase', 'xmMenu', 'xmIteration', 'xmTestPlan','xmTask','xmFunc'],
 
	data() {
		return {
			currOpType:'add',
			dicts: {
				priority: [],
				bugSeverity: [],
				bugSolution: [],
				bugStatus: [],
				bugType: [],
				bugRepRate: [],
				bugReason: [],
			},//下拉选择框的所有静态数据  params=[{categoryId:'0001',itemCode:'sex'}] 返回结果 {'sex':[{optionValue:'1',optionName:'男',seqOrder:'1',fp:'',isDefault:'0'},{optionValue:'2',optionName:'女',seqOrder:'2',fp:'',isDefault:'0'}]}
			load: { list: false, edit: false, del: false, add: false },//查询中...
			editFormRules: {
				name: [
					{ required: true, message: '缺陷标题不可为空', trigger: 'change' },
					{ min: 5, max: 250, message: '长度在 5 到 250 个字符', trigger: 'change' },//长度
				],
				askUsername: [
					{ required: true, message: '提出人不可为空', trigger: 'change' }
				],
				handlerUsername: [
					{ required: true, message: '请指派给一个人', trigger: 'change' }
				],
				description: [
					{ min: 0, max: 1000, message: '缺陷描述长度在 0 到 1000 个字符', trigger: 'change' },//长度
				],
				opStep: [
					{ min: 0, max: 1000, message: '测试步骤长度在 0 到 1000 个字符', trigger: 'change' },//长度
				],
				expectResult: [
					{ min: 0, max: 1000, message: '预期结果长度在 0 到 1000 个字符', trigger: 'change' },//长度
				],
				remarks: [
					{ min: 0, max: 1000, message: '处理意见长度在 0 到 1000 个字符', trigger: 'change' },//长度
				],

			},
			//新增界面数据 xm_question
			editForm: {
				id: '', name: '', projectId: '', projectName: '', caseId: '', caseName: '', endTime: '', askUserid: '', askUsername: '', handlerUserid: '', handlerUsername: '', priority: '', solution: '', description: '', createUserid: '', createUsername: '', createTime: '', bugStatus: '', bizProcInstId: '', bizFlowState: '', menuId: '', menuName: '', budgetWorkload: '', budgetAt: '', actWorkload: '', actAt: '', expectResult: '', opStep: '', currResult: '', refRequire: '', bugSeverity: '', bugType: '', tagIds: '', tagNames: '', urls: '', ltime: '', qtype: '', caseExecId: '', remarks: '', productId: '', repRate: '', verNum: '', vpath: '', pverNum: '', bugReason: '', rate: '', initWorkload: '', taskOut: '', taskId: '', funcId: '', funcName: '', funcPnames: '', planId: '', casedbId: '',
				attachment: [],
				productName: ''
			},
			//新增界面数据 xm_question
			editFormInit: {
				id: '', name: '', projectId: '', projectName: '', caseId: '', caseName: '', endTime: '', askUserid: '', askUsername: '', handlerUserid: '', handlerUsername: '', priority: '', solution: '', description: '', createUserid: '', createUsername: '', createTime: '', bugStatus: '', bizProcInstId: '', bizFlowState: '', menuId: '', menuName: '', budgetWorkload: '', budgetAt: '', actWorkload: '', actAt: '', expectResult: '', opStep: '', currResult: '', refRequire: '', bugSeverity: '', bugType: '', tagIds: '', tagNames: '', urls: '', ltime: '', qtype: '', caseExecId: '', remarks: '', productId: '', repRate: '', verNum: '', vpath: '', pverNum: '', bugReason: '', rate: '', initWorkload: '', taskOut: '', taskId: '', funcId: '', funcName: '', funcPnames: '', planId: '', casedbId: '',
				attachment: [],
				productName: ''
			}, 
			/**begin 在下面加自定义属性,记得补上面的一个逗号**/
			fileVisible: true,
			userFieldName: '',
			xmQuestionHandles: [],
			selectTaskVisible: false,
			selectMenuVisible: false,
			tagSelectVisible: false,
			xmProductVersions: [{ id: "1.0.0", name: '1.0.0' }],
			activateTabPaneName: '12',
			funcVisible: false,
			stepConfigVisible: false,
			caseVisible: false,
			maxTableHeight: 300,
			apis:{
				add: addXmQuestion,
				edit: editXmQuestion,
				editSomeFields: editXmQuestionSomeFields
			}
			/**end 在上面加自定义属性**/
		}//end return
	},//end data
	methods: { 
		//新增提交XmQuestion xm_question 父组件监听@submit="afterAddSubmit"
		preParamCheck: function ( params ) {

			if (this.xmIteration && this.xmIteration.id) {
				if (!this.editForm.menuId) {
					this.$notify({ position: 'bottom-left', showClose: true, message: '迭代视图中，新增缺陷必须关联需求，您可以通过设置【测试用例】或者【用户故事】达到关联需求目的。', type: 'error' });
					return;
				}
			}
			return true;
		},
		/**begin 在下面加自定义方法,记得补上面的一个逗号**/
		//上传附件
		onChange: function (file, fileList) {
			let list = [];
			if (fileList != null && fileList.length > 0) {
				fileList.forEach((item) => {
					let fileOne = {
						id: item.id,
						name: item.name,
						addr: item.url,
						type: item.fileSuffix,
						remark: item.remark,
					}
					list.push(fileOne);
				});
				this.editForm.attachment = list;
				console.log(list);
			}
		}, 
		handleQuestion: function (tardgetBugStatus) {
			this.editSubmit(tardgetBugStatus);
		},
		handleCloseTaskTag: function () {
			this.editForm.taskId = ''
			this.editForm.taskName = ""
		},
		onHandlerUserSelect(user){
			this.editForm.handlerUsername=user.username
			this.editSomeFields(this.editForm,"handlerUserid",{userid:user.userid,username:user.username})
		},
		sendToCreater() {
			this.editForm.handlerUsername = this.editForm.createUsername
			this.editForm.handlerUserid = this.editForm.createUserid
			this.editSomeFields(this.editForm, "handlerUserid", { userid: this.editForm.createUserid, username: this.editForm.createUsername })

		},
		sendToAsk() {
			this.editForm.handlerUsername = this.editForm.askUsername
			this.editForm.handlerUserid = this.editForm.askUserid
			this.editSomeFields(this.editForm, "handlerUserid", { userid: this.editForm.askUserid, username: this.editForm.askUsername })
		}, 
		onSelectedMenu(menu) { 
			this.editForm.menuId = menu.menuId
			this.editForm.menuName = menu.menuName
			this.editForm.productId = menu.productId
			if(menu.funcId){
				this.editForm.funcId=menu.funcId
				this.editForm.funcName=menu.funcName
			}
 			this.editSomeFields(this.editForm, 'menuId', menu)
		}, 

		onProjectConfirm: function (project) {
			this.editForm.projectId = project.id
			this.editForm.projectName = project.name
			this.editSomeFields(this.editForm, 'projectId', project)
		},
		clearProject() {
			this.editForm.projectId = ''
			this.editForm.projectName = ''
			
			this.editSomeFields(this.editForm, 'projectId', {id:'',name:''})
		},

		editSomeFieldsCheck(row, fieldName, $event,params) {  
			if (fieldName === 'handlerUserid') {
				if ($event) {
					params[fieldName] = $event.userid;
					params.handlerUsername = $event.username
				} 
			} else if (fieldName === 'askUserid') {
				if ($event) {
					params[fieldName] = $event.userid;
					params.askUsername = $event.username
				}  
			} else if (fieldName === 'tagIds') {
				if ($event) {
					params[fieldName] = $event.map(i => i.tagId).join(",");
					params.tagNames = $event.map(i => i.tagName).join(",");
				} 
			} else if (fieldName === 'workload') {
				params = { ...params, ...$event }
			} else if (fieldName === 'projectId') {
				params.projectId = $event.id
				params.projectName = $event.name
			} else if (fieldName === 'productId') {
				params.productId = $event.id
			} else if (fieldName === 'menuId') {
				params.productId = $event.productId
				params.menuId = $event.menuId
				params.menuName = $event.menuName
				if ($event.funcId) {
					params.funcId = $event.funcId
					params.funcName = $event.funcName
				}
			} else if (fieldName === 'funcId') {
				params.productId = $event.productId
				params.funcId = $event.id
				params.funcName = $event.name
			} else if (fieldName === 'caseId') {
				params = Object.assign(params, $event)
			} else if (fieldName === 'taskId') {
				params = Object.assign(params, $event)
			} else {
				params[fieldName] = $event
			} 
			return true;
		},
		copyLink() { 
			var curlDomain=window.location.protocol+"//"+window.location.host; //  
			var link = this.$mdp.getUri(curlDomain,import.meta.env.VITE_CONTEXT,import.meta.env.VITE_UI_VERSION,"/#/", "/#/xm/test/question/detail")+"?id=" + this.editForm.id
			toClipboard(link).then(e => {
				this.$notify({ position: 'bottom-left', showClose: true, message: "拷贝链接成功，您可以黏贴到任何地方", type: 'success' })
			});
		},
		onFuncSelected(row) {
			this.editForm.funcId = row.id
			this.editForm.funcName = row.name
			this.funcVisible = false;
			if (this.subOpType !== 'add') {
				this.editSomeFields(this.editForm, 'funcId', row)
			}
		},
		initCurrData() {
			this.currOpType=this.subOpType 
			if (this.subOpType === 'add') {
				this.editForm.askUserid = this.userInfo.userid
				this.editForm.askUsername = this.userInfo.username
				this.editForm.handlerUserid = this.userInfo.userid
				this.editForm.handlerUsername = this.userInfo.username
				this.editForm.bugReason = "1" 
				this.editForm.qtype = "1"
				this.editForm.bugSeverity = "3"
				this.editForm.priority = "3"
				this.editForm.bugType = "1"
				this.editForm.bugStatus = "1"
				if (this.selProject && this.selProject.id) {
					this.editForm.projectId = this.selProject.id
					this.editForm.projectName = this.selProject.name
				}
				if (this.xmProduct && this.xmProduct.id) {
					this.editForm.productId = this.xmProduct.id
					this.editForm.productName = this.xmProduct.productName
				}
				if (this.xmTestCase && this.xmTestCase.id) {
					this.editForm.productId = this.xmTestCase.productId
					this.editForm.productName = this.xmTestCase.productName
					this.editForm.caseId = this.xmTestCase.id
					this.editForm.caseName = this.xmTestCase.caseName
					this.editForm.casedbId = this.xmTestCase.casedbId
					this.editForm.funcId = this.xmTestCase.funcId
					this.editForm.funcName = this.xmTestCase.funcName
					this.editForm.menuId = this.xmTestCase.menuId
					this.editForm.menuName = this.xmTestCase.menuName
					this.editForm.opStep = this.xmTestCase.testStep
					this.editForm.name = this.xmTestCase.caseName
				}
				if (this.xmTestPlan && this.xmTestPlan.id) {
					this.editForm.casedbId = this.xmTestPlan.casedbId
					this.editForm.casedbName = this.xmTestPlan.casedbName
					this.editForm.planId = this.xmTestPlan.id
					this.editForm.projectId = this.xmTestPlan.projectId
					this.editForm.projectName = this.xmTestPlan.projectName
					this.editForm.productId = this.xmTestPlan.productId
					this.editForm.productName = this.xmTestPlan.productName
				}
				if (this.xmTestPlanCase && this.xmTestPlanCase.planId) {
					this.editForm.planId = this.xmTestPlanCase.planId
					this.editForm.productId = this.xmTestPlanCase.productId
					this.editForm.productName = this.xmTestPlanCase.productName
					this.editForm.caseId = this.xmTestPlanCase.caseId
					this.editForm.caseName = this.xmTestPlanCase.caseName
					this.editForm.casedbId = this.xmTestPlanCase.casedbId
					this.editForm.funcId = this.xmTestPlanCase.funcId
					this.editForm.funcName = this.xmTestPlanCase.funcName
					this.editForm.menuId = this.xmTestPlanCase.menuId
					this.editForm.menuName = this.xmTestPlanCase.menuName
					this.editForm.opStep = this.xmTestPlanCase.testStep
					this.editForm.name = this.xmTestPlanCase.caseName
					this.editForm.projectId = this.xmTestPlanCase.projectId
				}
				if (this.xmMenu && this.xmMenu.menuId) {
					this.editForm.menuId = this.xmMenu.menuId
					this.editForm.menuName = this.xmMenu.menuName
					if (this.xmMenu.productId) {
						this.editForm.productId = this.xmMenu.productId
						this.editForm.productName = this.xmMenu.productName
					}
					if (this.xmMenu.funcId) {
						this.editForm.funcId = this.xmMenu.funcId
						this.editForm.funcName = this.xmMenu.funcName
					}
				}
				if(this.xmFunc?.id){
					this.editForm.funcId=this.xmFunc.id
					this.editForm.funcName=this.xmFunc.name
					this.editForm.productId=this.xmFunc.productId
				}
				if(this.xmTask?.id){
					 this.editForm.taskId=this.xmTask.id
					 if(this.xmTask.menuId){
						this.editForm.menuId=this.xmTask.menuId
						this.editForm.menuName=this.xmTask.menuName
						this.editForm.productId=this.xmTask.productId
					 }
				}
			} else {

			} 
			this.activateTabPaneName='12'
		},
		onTestPlanCaseSelected(xmTestPlanCase) {
			var params = {};
			params.planId = xmTestPlanCase.planId
			params.productId = xmTestPlanCase.productId
			params.productName = xmTestPlanCase.productName||this.editForm.productName
			params.caseId = xmTestPlanCase.caseId
			params.caseName = xmTestPlanCase.caseName
			params.casedbId = xmTestPlanCase.casedbId
			params.funcId = xmTestPlanCase.funcId||this.editForm.funcId
			params.funcName = xmTestPlanCase.funcName||this.editForm.funcName
			params.menuId = xmTestPlanCase.menuId||this.editForm.menuId
			params.menuName = xmTestPlanCase.menuName||this.editForm.menuName
			if (!this.editForm.opStep) {
				params.opStep = xmTestPlanCase.testStep
			}
			if (!this.editForm.name) {
				params.name = xmTestPlanCase.caseName
			}

			params.projectId = xmTestPlanCase.projectId
			Object.assign(this.editForm, params)
			this.editSomeFields(this.editForm, "caseId", params)
			this.caseVisible = false;
		},
		onProductSelected(product) {
			this.editForm.productId = product.id
			this.editForm.productName = product.productName
			if (this.subOpType != 'add') {
				this.editSomeFields(this.editForm, 'productId', product);
			}
		},
		onProductClearSelect() {
			this.editForm.productId = ""
			this.editForm.productName = ""
		},
		onSelectedTask(task){
			var params={}
			if(task.menuId && !this.editForm.menuId){
				this.editForm.menuId=task.menuId
				this.editForm.productId=task.productId||this.editForm.productId
				params.taskId=task.id
				params.menuId=this.editForm.menuId
				params.productId=this.editForm.productId
			}else{
				params.taskId=task.id
			}
			if (this.subOpType != 'add') {
				this.editSomeFields(this.editForm, 'taskId',params);
			}
		}
	},//end method
	components: {
		//在下面添加其它组件 'xm-question-edit':XmQuestionEdit
		VueEditor, XmQuestionHandleMng,  
		XmWorkloadRecord: defineAsyncComponent(() => import("../xmWorkload/XmWorkloadRecord.vue")),
	}, 
}

</script> 
