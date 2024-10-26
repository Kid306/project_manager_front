<template>
	<el-form :model="editForm" label-width="120px" :rules="editFormRules" ref="editFormRef" label-position="left">
		<el-row>
			<el-col :span="18" class="border padding">
				<el-form-item prop="caseName" label="用例名称">
 						{{ editForm.caseName }}<span class="label-font-color"> &nbsp;&nbsp; {{ editForm.caseId }} </span> 

				</el-form-item>
				<el-row class="padding">
				<el-col :span="6">
					<el-form-item>
						<xm-user-select :xm-product="{id:editForm.productId}" :sel-project="{id:editForm.projectId}" show-style="x" size="medium" label="执行人" v-model="editForm.execUserid"
							:init-name="editForm.execUsername" @change2="editSomeFields(editForm, 'execUserid', $event)" />

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
						<mdp-select show-style="x" size="medium" label="执行结果" itemCode="testStepTcode"
							v-model="editForm.execStatus" 
							@change="editSomeFields(editForm, 'execStatus', $event)" />

					</el-form-item>
				</el-col> 
				</el-row> 
				<el-form-item label="接口地址" prop="url"  v-if="editForm.testType == '1'"> 
						
						<el-input v-model="autoStep.url" readonly
							placeholder="url 如#{baseApi}/user/list,支持通过 #{变量名}引用环境变量" >

								<template #prefix>
									<mdp-select style="padding-bottom:2px;" placeholder="请求方法" v-model="autoStep.method" itemCode="autoTestMethod" :disabled="true"/>
								</template> 
							</el-input>
						 
				</el-form-item>
				<el-tabs v-model="activateName">
				<el-tab-pane name="1" label="用例信息">
					<el-text type="info">此内容自动同步用例库信息，需要更改请到用例管理中修改</el-text>
					<el-row class="padding-top">
						<el-col :span="6">
							<el-row class="label-font-size padding-bottom">
								用例状态
							</el-row>
							<el-row>
								<mdp-select show-style="tag" itemCode="testCaseStatus" v-model="editForm.caseStatus"
									:disabled="true" />
							</el-row>
						</el-col>
						<el-col :span="6">

							<el-row class="label-font-size padding-bottom">
								用例类型
							</el-row>
							<el-row>
								<mdp-select show-style="tag" itemCode="caseType" v-model="editForm.caseType" :disabled="true" />

							</el-row>
						</el-col>
						<el-col :span="6">

							<el-row class="label-font-size padding-bottom">
								紧急程度
							</el-row>
							<el-row>
								<mdp-select show-style="tag" itemCode="priority" v-model="editForm.cpriority" :disabled="true" />
							</el-row>
						</el-col>
						
						<el-col :span="6">
							<el-row class="label-font-size padding-bottom">
								用例版本
							</el-row>
							<el-row>
								{{ editForm.verNum||'无' }}
							</el-row>
						</el-col>
					</el-row>
<!-- 
					<el-row class="padding-top">
						<el-row class="label-font-size padding-top">
							前置条件
						</el-row>
						<el-row class="padding">
							{{ editForm.preRemark ? editForm.preRemark : '无' }}
						</el-row>
					</el-row> -->

					<el-row class="padding-top"> 
						<el-row class="padding"> 
							<div v-html="editForm.caseRemark"></div>
						</el-row>
					</el-row>
				</el-tab-pane>
				<el-tab-pane name="21" label="执行说明"> 
						<el-text type="warning">测试步骤、执行结果、如果是自动化测试，可以从响应数据中分析结果</el-text>
						<vue-editor :editorConfig="{minHeight:'450px',scroll:true,placeholder:'前置条件,操作步骤,期望结果等'}"  :key="'description_' + editForm?.caseId" v-model="editForm.remark"
								class="rich-context" :editorId="'description_' + editForm?.caseId" :branch-id="userInfo.branchId"/> 

				</el-tab-pane>
				
				<el-tab-pane name="210" label="响应数据" v-if="editForm.testType=='1'">  
						<json-viewer  :value="testRes" copyable theme="my-awesome-json-theme" />
				</el-tab-pane>
				<el-tab-pane name="12" label="Params" v-if="editForm.testType == '1'">
					<el-form-item label="查询参数" class="field">
						{{ queryStrCpd || '暂无' }}
					</el-form-item>
					<el-table :data="autoStep.params" style="width: 100%">
						<el-table-column prop="id" label="参数名" min-width="200" />
						<el-table-column prop="id" label="参数名" min-width="200" />
					</el-table>
				</el-tab-pane>
				<el-tab-pane name="13" label="Body" v-if="editForm.testType == '1'">
					<mdp-select show-style="x" size="medium" style="margin-bottom:10px;" class="padding" label="参数格式"
						v-model="autoStep.bodyType" itemCode="autoTestBodyType" :disabled="true" />
					<el-input v-if="autoStep.bodyType == 'json'" type="textarea" :rows="10" v-model="autoStep.body" readonly />
					<el-input v-if="autoStep.bodyType == 'xml'" type="textarea" :rows="10" v-model="autoStep.body" readonly />

					<el-table v-if="autoStep.bodyType == 'form-data' || autoStep.bodyType == 'x-www-form-urlencoded'"
						:data="autoStep.body" style="width: 100%">
						<el-table-column prop="id" label="参数名" min-width="200" />
						<el-table-column prop="id" label="参数名" min-width="200" />
					</el-table>

				</el-tab-pane>
				<el-tab-pane name="14" label="Cookie" v-if="editForm.testType == '1'">
					<el-table :data="autoStep.cookies" style="width: 100%">
						<el-table-column prop="id" label="参数名" min-width="200" />
						<el-table-column prop="id" label="参数名" min-width="200" />
					</el-table>
				</el-tab-pane>
				<el-tab-pane name="15" label="Header" v-if="editForm.testType == '1'">
					<el-table :data="autoStep.headers" style="width: 100%">
						<el-table-column prop="id" label="参数名" min-width="200" />
						<el-table-column prop="id" label="参数名" min-width="200" />
					</el-table>
				</el-tab-pane>
				<el-tab-pane name="16" label="Auth" v-if="editForm.testType == '1'">

					<mdp-select show-style="x" size="medium" style="margin-bottom:10px;" class="padding" label="授权方式"
						v-model="autoStep.authType" itemCode="autoTestAuthType" :disabled="true" />


					<el-row v-if="autoStep.authType == 'basic-auth'">
						<el-form-item label="username" class="field">
							{{ autoStep.authData.username }}
						</el-form-item>
						<el-form-item label="password" class="field">
							{{ autoStep.authData.password || '暂无' }}
						</el-form-item>
					</el-row>

					<el-row v-if="autoStep.authType == 'bearer-token'">
						<el-form-item label="Bearer" class="field">
							{{ autoStep.authData.bearerToken }}
						</el-form-item>
					</el-row>
				</el-tab-pane>
				<el-tab-pane name="17" label="响应" v-if="editForm.testType == '1'">
					<el-row class="padding">可使用的变量 res={config:{协议配置},data:{接口返回的业务数据对象}
						,headers:{协议头,key-value型},status:状态码如200/201 }</el-row>
					<el-row class="padding">可使用的变量
						env={key1:value1,key2:value2,等等},env为测试库环境变量及测试计划的环境变量合并，重复则以测试计划的为准。可通过env['key1']获取值</el-row>

					<el-form-item label="成功与失败的逻辑判断">
						<el-input type="textarea" :rows="10" v-model="autoStep.expectResult" placeholder="成功与失败的判断" readonly />
					</el-form-item>
					<el-form-item label="例子">
						if(res.status==200){<br />
						&nbsp;&nbsp;return true;<br />
						}else{<br />
						&nbsp;&nbsp;return false;<br />
						}<br />
					</el-form-item>
					<el-form-item label="响应数据预览">
						<el-row> <el-checkbox v-model="resDataVisible">显示响应数据</el-checkbox></el-row>
						<json-viewer v-if="resDataVisible == true" :value="testRes" copyable theme="my-awesome-json-theme" />

					</el-form-item>
				</el-tab-pane>
				<el-tab-pane name="3" label="缺陷">
					<xm-question-list v-if="activateName == '3'" :xm-test-plan-case="editForm"
						:xm-product="{ id: editForm.productId, productName: editForm.productName }"
						:sel-project="{ id: editForm.projectId, name: editForm.projectName }" />
				</el-tab-pane>

				<el-tab-pane :label="'工时( ' + (editForm.actWorkload || 0) + ' / ' + (editForm.budgetWorkload || 0) + ' h )'" name="55">
					<xm-workload-record v-if="activateName == '55'" biz-type="4" :xm-test-plan-case="editForm" @editFields="Object.assign(editForm,$event)"/>
				</el-tab-pane>
				<el-tab-pane name="4" label="日志" >
					<xm-record :product-id="editForm.productId" :project-id=" editForm.projectId " :bizId="editForm.caseId" :pbizId="editForm.planId"/>
					</el-tab-pane>
					
				</el-tabs>
				<div class="footer">
							<el-button v-if="currOpType != 'add' && editForm.testType=='1'" v-loading="load.edit" type="primary"
								@click="editForm.remark=JSON.stringify(testRes)"
								:disabled="load.edit == true">同步响应数据到执行说明中</el-button> 
 							<el-button v-if="currOpType != 'add' && dataBak.remark != editForm.remark" v-loading="load.edit" type="primary"
								@click="editSomeFields(editForm, 'remark', editForm.remark)"
								:disabled="load.edit == true">保存测试步骤及说明</el-button> 
					<el-button  @click="$emit('next', editForm)"
							type="primary">下一条</el-button> 
					<el-button type="primary" v-if="editForm.testType=='1'" @click="sendMsgForTestSetting" title="执行用例">执行用例</el-button>
				</div>
			</el-col>
			<el-col :span="6" class="border padding-left padding-right padding-top">
				<el-form-item label="测试库" prop="casedbName">
					<el-text truncated>{{ editForm.casedbName ||  editForm.casedbId || '暂无关联测试库' }}</el-text>
				</el-form-item>
				<el-form-item label="归属计划" prop="planId">
					<el-text truncated>{{ editForm.planId || '暂无关联测试计划' }}</el-text>
				</el-form-item>
				<el-form-item label="归属项目" prop="projectId">
					<el-text truncated>{{ editForm.projectId || '暂无关联项目' }}</el-text>
				</el-form-item>
				<el-form-item label="归属产品" prop="productId">
					<el-text truncated>{{  editForm.productName || editForm.productId || '暂无关联产品' }}</el-text>
				</el-form-item>
				<el-form-item label="关联模块" prop="menuName">
					<el-text truncated>{{ editForm.funcName || editForm.funcId || '暂无关联模块' }}</el-text>
				</el-form-item>
				<el-form-item label="关联需求" prop="menuName">
					<el-text truncated>{{ editForm.menuName || editForm.menuId || '暂无关联需求' }} </el-text><el-button type="text" v-if="editForm.menuId"
						@click="menuFormVisible = true">查看需求</el-button>
				</el-form-item>
				<el-form-item label="测试方式" prop="testType">
					<mdp-select show-style="tag" placeholder="测试方式" clearable itemCode="testType" v-model="editForm.testType"
						effect="dark" @change="editSomeFields(editForm, 'testType', $event)" :disabled="true" />
				</el-form-item>
				<el-form-item label="版本号" prop="verNum">
					{{editForm.verNum||'暂无'}}
				</el-form-item>
				
				<el-form-item label="排序号" prop="sortNo">
					{{editForm.sortNo||'暂无'}}
				</el-form-item>


			</el-col>

		</el-row>
	</el-form>



	<mdp-dialog append-to-body title="需求明细" v-model="menuFormVisible" fullscreen :close-on-click-modal="false">
		<xm-menu-detail :visible="menuFormVisible" :reload="true"
			:formData="{ menuId: editForm.menuId, menuName: editForm.menuName }" />
	</mdp-dialog>

	<!--新增 XmQuestion xm_question界面-->
	<mdp-dialog title="新增缺陷" v-model="addBugVisible" fullscreen width="90%" top="20px" append-to-body
		:close-on-click-modal="false">
		<xm-question-add sub-op-type="add" :xm-product="{ id: editForm.productId, productName: editForm.productName }"
			:xm-test-plan-case="editForm" :sel-project="{ id: editForm.projectId, name: editForm.projectName }"
			:visible="addBugVisible" @cancel="addBugVisible = false" />
	</mdp-dialog>
</template>

<script>
import util from '@/components/mdp-ui/js/util';//全局公共库
import config from "@/api/mdp_pub/mdp_config"; //全局公共库import
import { addXmTestPlanCase, editXmTestPlanCase, editSomeFieldsXmTestPlanCase } from '@/api/xm/core/xmTestPlanCase';
import { autoStepToAxios, initEnvVars } from '@/api/xm/core/xmTestAutoStep.js';//全局公共库

import { mapState } from 'pinia'
import { useUserStore } from '@/store/modules/user' 
import { defineAsyncComponent } from 'vue' 
import axios from 'axios'//免登录访问
import JsonViewer from 'vue-json-viewer'
import {MdpFormMixin} from '@/components/mdp-ui/mixin/MdpFormMixin.js'

import { getAccessToken } from '@/utils/auth'
import { Editor as VueEditor } from '@/components/Editor'

import XmRecord from '../xmRecord/XmRecord.vue'
export default {
	mixins:[MdpFormMixin],
	name: 'xmTestPlanCaseEdit',
	components: {
		XmRecord, 
		 XmQuestionAdd: defineAsyncComponent(() => import("../xmQuestion/XmQuestionEdit.vue")),
		'xm-workload-record': defineAsyncComponent(() => import("../xmWorkload/XmWorkloadRecord.vue")),
		JsonViewer,VueEditor,

	},
	computed: {
		...mapState(useUserStore, ['userInfo']),
		queryStrCpd() {
			return this.autoStep.params.filter(k => k.id).map(k => k.id + '=' + k.value).join("&")
		}

	},
	props: ['formData', 'visible', 'subOpType', 'xmTestCasedb', 'xmTestPlan'],
 
	data() {
		return {
			currOpType: 'add',//add/edit
			pkNames:['planId','caseId'], 
 			editFormRules: {
				caseId: [
					//{ required: true, message: '测试用例编号不能为空', trigger: 'blur' }
				]
			},
			editForm: {
				bugs: '', execUserid: '', caseId: '', ltime: '', ctime: '', execStatus: '', execUsername: '', planId: '', caseName: '', priority: '', remark: '', testStep: '', caseType: ''
			}, 
 			menuFormVisible: false,
			next: false,
			activateName: '1',
			addBugVisible: false,


			testRes: {},
			resDataVisible: false,

			autoStep: {
				url: '',
				method: 'GET',
				authType: 'none',
				authData: {
				},
				bodyType: 'json',
				params: [],
				body: [],
				cookies: [],
				expectResult: ''
			},
			autoStepInit: {
				url: '',
				method: '',
				authType: '',
				authData: {
				},
				bodyType: '',
				params: [],
				body: [],
				cookies: [],
				expectResult: ''
			},
			apis:{
				add: addXmTestPlanCase,edit: editXmTestPlanCase, editSomeFields: editSomeFieldsXmTestPlanCase
			}
		}//end return
	},//end data
	methods: {   

		initQueryStr() {
			this.queryStr = this.autoStep.params.map(k => k.id + '=' + k.value).join("&")
		},
		initCurrData: function () {
			this.currOpType = this.subOpTypeb
			if (!this.editForm.autoStep) {
				this.autoStep = { ...this.autoStepInit }
			} else {
				this.autoStep = JSON.parse(this.editForm.autoStep)
			}
			if(!this.editForm.remark && this.editForm.caseRemark){
				this.editForm.remark=this.editForm.caseRemark
				this.dataBak.remark=this.editForm.caseRemark
			}
			this.activateName="1"
		},
		sendMsgForTestSetting() {
			this.activateName = '210'
			var autoStepObj = this.autoStep
			if (!autoStepObj.url) {
				this.$notify({ position: 'bottom-left', showClose: true, message: 'url不能为空', type: 'error' })
				return;
			}
			var env = initEnvVars(this.xmTestCasedb ? this.xmTestCasedb.envJson : null, this.xmTestPlan ? this.xmTestPlan.envJson : null);
			var curlDomain=window.location.protocol+"//"+window.location.host; //  
			var apiGate=this.$mdp.getUri(curlDomain,import.meta.env.VITE_API_BASE_PATH,import.meta.env.VITE_API_VERSION)

			env['accessToken']=getAccessToken()
			env['curlDomain']=curlDomain
			env['apiGate']=apiGate
			Object.keys(this.userInfo).forEach(k=>{
				env['userInfo.'+k]=this.userInfo[k]
			})
			var axiosObj = autoStepToAxios(autoStepObj, env)

			//axiosObj.headers['Access-Control-Allow-Origin']='*'
			//axios.defaults.withCredentials = true // 若跨域请求需要带 cookie 身份识别
			//axios.defaults.headers.post['Content-Type'] = 'application/x-www-form-urlencoded'
			axios(axiosObj).then(res => {
				this.testRes = res
				if (autoStepObj.expectResult) {
					var func = new Function('res', 'env', autoStepObj.expectResult)
					var result = func(res, env)
					if (result == true) {
						this.$notify({ position: 'bottom-left', showClose: true, message: '成功', type: 'success' })

					} else {
						this.$notify({ position: 'bottom-left', showClose: true, message: '失败', type: 'error' })

					}
					this.editSomeFields(this.editForm, 'execStatus', result == true ? "2" : "4")
				} else {
					this.$notify({ position: 'bottom-left', showClose: true, message: '执行完毕', type: res.status == 200 ? 'success' : 'error' })
					this.editSomeFields(this.editForm, 'execStatus', res.status == 200 ? "2" : "4")
				}
			}).catch(res => {

				var func = new Function('res', 'env', autoStepObj.expectResult)
				var result = func(res, env)
				if (result == true) {
					this.$notify({ position: 'bottom-left', showClose: true, message: '成功', type: 'success' })
					this.editSomeFields(this.editForm, 'execStatus', "2")

				} else {
					if (res.code == '401') {
						this.$notify({ position: 'bottom-left', showClose: true, message: '未登录，可能是授权数据过期', type: 'error' })
					} else {
						this.$notify({ position: 'bottom-left', showClose: true, message: '失败', type: 'error' })
					}
					this.editSomeFields(this.editForm, 'execStatus', "4")
				}

			})

		},
		saveAutoStep() {
			this.$notify({ position: 'bottom-left', showClose: true, message: '当前执行用例不允许修改', type: 'error' })
		},
		editSomeFieldsCheck(row, fieldName, $event,params) { 
			if (fieldName == 'execUserid') {
				params.execUserid = $event.userid
				params.execUsername = $event.username
			}else if (fieldName == 'execStatus' && this.editForm.testType=='1') {
				 if(this.testRes){
					//params.remark=JSON.stringify(this.testRes)
				 }
				 params[fieldName] = $event
			} else {
				params[fieldName] = $event
			}
			if (fieldName != 'testStep') {
				if (this.editForm.testStep != this.dataBak.testStep) {
					params.testStep = this.editForm.testStep
				}
			} 
			return true;
		}, 
	}, 
}

</script>

<style lang="scss" scoped> 
</style>
