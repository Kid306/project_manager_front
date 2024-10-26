<template>
	<el-form :model="editForm" label-width="120px" :rules="editFormRules" ref="editFormRef" label-position="left">
		<el-row>
			<el-col :span="18" class="padding-right">
				<el-form-item label="用例标题" prop="caseName">
					<el-input v-model="editForm.caseName" placeholder="测试用例 标题"
						@change="editSomeFields(editForm, 'caseName', $event)" />
					<el-row class="label-font-color" v-if="currOpType == 'edit'">
						<span><span>编号:</span>&nbsp;&nbsp;{{ editForm.id }} &nbsp;&nbsp;</span>
					</el-row>
				</el-form-item>
				<el-row>

					<el-col :span="6">
						<el-form-item label-width="0px">
							<mdp-select show-style="x" size="medium" label="状态" itemCode="testCaseStatus" v-model="editForm.caseStatus"
								@change="editSomeFields(editForm, 'caseStatus', $event)" />

						</el-form-item>
					</el-col>
					<el-col :span="6">
						<el-form-item label-width="0px">
							<xm-user-select :xm-product="{id:editForm.productId}"  show-style="x" size="medium" label="责任人" v-model="editForm.cuserid"
								:init-name="editForm.cusername" @change2="editSomeFields(editForm, 'cuserid', $event)" />

						</el-form-item>

					</el-col>
					<el-col :span="6">
						<el-form-item label-width="0px">
							<mdp-select show-style="x" size="medium" label="用例类型" itemCode="caseType" v-model="editForm.caseType"
								@change="editSomeFields(editForm, 'caseType', $event)" />

						</el-form-item>
					</el-col>
					<el-col :span="6">
						<el-form-item label-width="0px">
							<mdp-select show-style="x" size="medium" label="优先级" itemCode="priority" v-model="editForm.cpriority"
								@change="editSomeFields(editForm, 'cpriority', $event)" />

						</el-form-item>
					</el-col>
				</el-row>
				
				<el-form-item label="接口地址" prop="url"  v-if="editForm.testType == '1'"> 
						
						<el-input v-model="autoStep.url"
							placeholder="url 如#{baseApi}/user/list,支持通过 #{变量名}引用环境变量" >

								<template #prefix>
									<mdp-select style="padding-bottom:2px;" placeholder="请求方法" v-model="autoStep.method" itemCode="autoTestMethod" />
								</template>
								
								<template #suffix>
									<el-button type="primary" @click="sendMsgForTestSetting" title="执行用例">发送</el-button>
								</template>
							</el-input>
						 
				</el-form-item>
				<el-tabs v-model="activeTab">
					<el-tab-pane name="1" label="用例详情">
						<!-- <el-form-item label="" prop="preRmark" label-width="0px">
							<el-row class="label-font-color">
								前置条件
							</el-row>
							<el-input type="textarea" :rows="4" v-model="editForm.preRemark" placeholder="请输入前置条件"
								@change="editSomeFields(editForm, 'preRemark', $event)" />
						</el-form-item> -->
						<!-- <el-row class="label-font-color">
							测试步骤
						</el-row>
						<test-step-config v-model="editForm.testStep" />
						<el-space v-if="currOpType !== 'add' && editForm.testStep != editFormBak.testStep">
							<el-button type="primary" @click="editSomeFields(editForm, 'testStep', editForm.testStep)">保存测试步骤</el-button>
						</el-space> -->
						<el-form-item label="" prop="caseRemark" label-width="0px"> 
								<vue-editor :editorConfig="{minHeight:'450px',scroll:true,placeholder:'前置条件,操作步骤,期望结果等'}" :key="'description_' + editForm?.id" v-model="editForm.caseRemark"
								  :editorId="'description_' + editForm?.id" :branch-id="userInfo.branchId"/> 
								
						</el-form-item>
					</el-tab-pane>
					<el-tab-pane name="12" label="Params" v-if="editForm.testType == '1'">
						 
						<el-form-item label="查询参数" class="field">
							 
								<el-input type="textarea" :rows="3" v-model="queryStr" placeholder="查询参数" @focus="initQueryStr"
									@change="onQueryStrChange" /> 
						</el-form-item>
						<el-table :data="autoStep.params" style="width: 100%">
							<el-table-column prop="id" label="参数名" min-width="200">
								<template #default="scope">
									<el-input v-model="scope.row.id" />
								</template>
							</el-table-column>
							<el-table-column prop="value" label="参数值" min-width="250">
								<template #default="scope">
									<el-input v-model="scope.row.value" placeholder="支持通过 #{变量名}引用环境变量" />
								</template>
							</el-table-column>
							<el-table-column label="操作" width="180">
								<template #header>
									操作
									<el-button v-if="!autoStep.params || autoStep.params.length == 0" @click="addParamsRow({}, 0)" icon="plus"
										circle plain />
								</template>
								<template #default="scope">
									<el-button type="danger" @click="deleteParamsRow(scope.row, scope.$index)" icon="delete" circle plain />
									<el-button @click="addParamsRow(scope.row, scope.$index)" icon="plus" circle plain />
								</template>
							</el-table-column>
						</el-table> 
					</el-tab-pane>
					<el-tab-pane name="13" label="Body" v-if="editForm.testType == '1'">
						<div class="padding">
						<mdp-select show-style="x" size="medium" class="padding" label="参数格式"
							v-model="autoStep.bodyType" itemCode="autoTestBodyType" />
						</div>
						<el-input v-if="autoStep.bodyType == 'json'" type="textarea" :rows="10" v-model="autoStep.body" />
						<el-input v-if="autoStep.bodyType == 'xml'" type="textarea" :rows="10" v-model="autoStep.body" />

						<el-table v-if="autoStep.bodyType == 'form-data' || autoStep.bodyType == 'x-www-form-urlencoded'"
							:data="autoStep.body" style="width: 100%">
							<el-table-column prop="id" label="参数名" min-width="200">
								<template #default="scope">
									<el-input v-model="scope.row.id" />
								</template>
							</el-table-column>
							<el-table-column prop="value" label="参数值" min-width="250">
								<template #default="scope">
									<el-input v-model="scope.row.value" placeholder="支持通过 #{变量名}引用环境变量" />
								</template>
							</el-table-column>
							<el-table-column label="操作" width="180">
								<template #header>
									操作
									<el-button v-if="!autoStep.body || autoStep.body.length == 0" @click="addBodyRow({}, 0)" icon="plus" circle
										plain />
								</template>
								<template #default="scope">
									<el-button type="danger" @click="deleteBodyRow(scope.row, scope.$index)" icon="delete" circle plain />
									<el-button @click="addBodyRow(scope.row, scope.$index)" icon="plus" circle plain />
								</template>
							</el-table-column>
						</el-table> 

					</el-tab-pane>
					<el-tab-pane name="14" label="Cookie" v-if="editForm.testType == '1'">
						<el-table :data="autoStep.cookies" style="width: 100%">
							<el-table-column prop="id" label="参数名" min-width="200">
								<template #default="scope">
									<el-input v-model="scope.row.id" />
								</template>
							</el-table-column>
							<el-table-column prop="value" label="参数值" min-width="250">
								<template #default="scope">
									<el-input v-model="scope.row.value" placeholder="支持通过 #{变量名}引用环境变量" />
								</template>
							</el-table-column>
							<el-table-column label="操作" width="180">
								<template #header>
									操作
									<el-button v-if="!autoStep.cookies || autoStep.cookies.length == 0" @click="addCookieRow({}, 0)" icon="plus"
										circle plain />
								</template>
								<template #default="scope">
									<el-button type="danger" @click="deleteCookieRow(scope.row, scope.$index)" icon="delete" circle plain />
									<el-button @click="addCookieRow(scope.row, scope.$index)" icon="plus" circle plain />
								</template>
							</el-table-column>
						</el-table> 
					</el-tab-pane>
					<el-tab-pane name="15" label="Header" v-if="editForm.testType == '1'">
						<el-table :data="autoStep.headers" style="width: 100%">
							<el-table-column prop="id" label="参数名" min-width="200">
								<template #default="scope">
									<el-input v-model="scope.row.id" />
								</template>
							</el-table-column>
							<el-table-column prop="value" label="参数值" min-width="250">
								<template #default="scope">
									<el-input v-model="scope.row.value" placeholder="支持通过 #{变量名}引用环境变量" />
								</template>
							</el-table-column>
							<el-table-column label="操作" width="180">
								<template #header>
									操作
									<el-button v-if="!autoStep.headers || autoStep.headers.length == 0" @click="addHeaderRow({}, 0)" icon="plus"
										circle plain />
								</template>
								<template #default="scope">
									<el-button type="danger" @click="deleteHeaderRow(scope.row, scope.$index)" icon="delete" circle plain />
									<el-button @click="addHeaderRow(scope.row, scope.$index)" icon="plus" circle plain />
								</template>
							</el-table-column>
						</el-table> 
					</el-tab-pane>
					<el-tab-pane name="16" label="Auth" v-if="editForm.testType == '1'">
						<div class="padding">
						<mdp-select show-style="x" size="medium" class="padding" label="授权方式"
							v-model="autoStep.authType" itemCode="autoTestAuthType" />
						</div>

						<div v-if="autoStep.authType == 'basic-auth'" class="padding">
							<el-form-item label="username" class="field"> 
									<el-input v-model="autoStep.authData.username" placeholder="username 支持通过 #{变量名}引用环境变量" /> 
							</el-form-item>
							<el-form-item label="password" class="field"> 
									<el-input v-model="autoStep.authData.password" placeholder="password 支持通过 #{变量名}引用环境变量" /> 
							</el-form-item>
						</div>
 
							<el-form-item label="Bearer" v-if="autoStep.authType == 'bearer-token'" class=" field padding"> 
									<el-input type="textarea" rows="4" autosize v-model="autoStep.authData.bearerToken"
										placeholder="Bearer 支持通过 #{变量名}引用环境变量" /> 
							</el-form-item> 
					</el-tab-pane>
					<el-tab-pane name="17" label="响应" v-if="editForm.testType == '1'">
						<el-row class="padding">可使用的变量 res={config:{协议配置},data:{接口返回的业务数据对象}
							,headers:{协议头,key-value型},status:状态码如200/201 }</el-row>
						<el-row class="padding">可使用的变量
							env={key1:value1,key2:value2,等等},env为测试库环境变量及测试计划的环境变量合并，重复则以测试计划的为准。可通过env['key1']获取值</el-row>

						<el-form-item label="成功与失败的逻辑判断">
							<el-input type="textarea" :rows="10" v-model="autoStep.expectResult" placeholder="成功与失败的判断" />
						</el-form-item>
						<el-form-item label="例子">
							if(res.status==200){<br />
							&nbsp;&nbsp;return true;<br />
							}else{<br />
							&nbsp;&nbsp;return false;<br />
							}<br />
						</el-form-item>
						<el-form-item label="响应数据预览">
							 <div><el-checkbox v-model="resDataVisible">显示响应数据</el-checkbox> </div> 
							<div><json-viewer v-if="resDataVisible == true" :value="testRes" copyable theme="my-awesome-json-theme" /> </div>
						</el-form-item>
					</el-tab-pane>
					<el-tab-pane name="2" label="缺陷" v-if="currOpType !== 'add'">
						<xm-question-list v-if="activeTab == '2'" :xm-test-case="editForm"
							:xm-product="{ id: editForm.productId, productName: editForm.productName }"
							:sel-project="{ id: editForm.projectId, name: editForm.projectName }" />
					</el-tab-pane>
					<el-tab-pane name="3" label="执行记录" v-if="currOpType !== 'add'">
						<xm-test-plan-case-list :xm-test-casedb="xmTestCasedb" :xm-test-case="editForm" v-if="activeTab == '3'" />
					</el-tab-pane>

					<el-tab-pane :label="'工时( ' + (editForm.actWorkload || 0) + ' / ' + (editForm.budgetWorkload || 0) + ' h )'" name="55">
						<xm-workload-record :parentOpType="currOpType" v-if="activeTab == '55'" biz-type="3" :xm-test-case="editForm" @editFields="Object.assign(editForm,$event)"/>
					</el-tab-pane>
					<el-tab-pane name="4" label="日志" v-if="currOpType !== 'add'">
						<xm-record :product-id="editForm.productId" :bizId="editForm.id"/>
						</el-tab-pane>
				</el-tabs>
				<div class="footer"> 
    						<el-button  v-if="currOpType == 'add'" v-loading="load.edit" type="primary" @click="saveSubmit" :disabled="load.edit == true">提交</el-button>
		 
							<el-button  v-if="currOpType == 'edit' && editForm.testType=='1'" v-loading="load.edit" type="warning" @click="saveAutoStep" :disabled="load.edit == true">保存自动化测试配置</el-button>
					 
						<el-button  v-loading="load.edit" v-if="currOpType=='edit' && editForm.caseRemark != dataBak.caseRemark" type="primary"
							@click="editSomeFields(editForm, 'caseRemark', editForm.caseRemark)"
							:disabled="load.edit == true">保存详情</el-button> 
				</div>
				 
				
			</el-col>
			
			<el-col :span="6" class="padding-left padding-bottom border">

				<el-form-item label="测试库" prop="casedbId"> 
						<XmTestCasedbSelect v-if="xmProductCpd?.id" width="100%" v-model="editForm.casedbId" :init-name="editForm.casedbName" showStyle="tag" :xmProduct="xmProductCpd"  />
				</el-form-item>

				<el-form-item label="产品" prop="productId">
					{{ editForm.productName ? editForm.productName : editForm.productId }}
				</el-form-item>
				<el-form-item label="关联模块" prop="menuName">
					<XmFuncSelect v-if="editForm.productId" width="100%" showStyle="tag" v-model="editForm.funcId" :init-name="editForm.funcName" :xmProduct="{id:editForm.productId,productName:editForm.productName}" @change2="onFuncSelected"/>
				</el-form-item>
				<el-form-item label="关联需求" prop="menuId" id="menuInfo">
					<XmMenuSelect v-if="editForm.productId" width="100%" showStyle="tag" v-model="editForm.menuId" :init-name="editForm.menuName" :xmProduct="{id:editForm.productId,productName:editForm.productName}" @change2="onMenuSelected"/>
				</el-form-item>

				<el-form-item label="测试方式" prop="testType">
					<mdp-select width="100%" show-style="tag" placeholder="测试方式" clearable itemCode="testType" v-model="editForm.testType"
						effect="dark" @change="editSomeFields(editForm, 'testType', $event)" />
				</el-form-item>
				<el-form-item label="版本号" prop="verNum">
					<el-input v-model="editForm.verNum" placeholder="版本号" :maxlength="50"
						@change="editSomeFields(editForm, 'verNum', $event)" />
				</el-form-item> 
				<el-form-item label="排序号">
						<el-input v-model="editForm.sortNo" @change="editSomeFields(editForm, 'sortNo', editForm.sortNo)" placeholder="如1.1.0"/>
					</el-form-item>
				</el-col>
		</el-row>

	</el-form>  
	<mdp-dialog title="需求详情" v-model="menuFormVisible" :with-header="false" width="90%" top="20px" append-to-body
		:close-on-click-modal="false">
		<xm-menu-detail v-if="menuFormVisible" :reload="true" :formData="{ menuId: editForm.menuId }" :visible="menuFormVisible"
			@cancel="menuFormVisible = false" />
	</mdp-dialog> 
</template>

<script>
import util from '@/components/mdp-ui/js/util';//全局公共库
import config from "@/api/mdp_pub/mdp_config"; //全局公共库import
import { addXmTestCase, editXmTestCase, editSomeFieldsXmTestCase } from '@/api/xm/core/xmTestCase';
import { autoStepToAxios, initEnvVars } from '@/api/xm/core/xmTestAutoStep.js';//全局公共库

import { mapState } from 'pinia'
import { useUserStore } from '@/store/modules/user' 
 

import { defineAsyncComponent } from 'vue';

import { getAccessToken } from '@/utils/auth'
import { Editor as VueEditor } from '@/components/Editor'
import axios from 'axios'//免登录访问
import JsonViewer from 'vue-json-viewer'
 
import XmRecord from '../xmRecord/XmRecord.vue'
import { MdpFormMixin } from '@/components/mdp-ui/mixin/MdpFormMixin';
	export default {
		mixins:[MdpFormMixin],
	name: 'xmTestCaseEdit',
	components: {
		XmRecord, 
		'xm-workload-record': defineAsyncComponent(() => import("../xmWorkload/XmWorkloadRecord.vue")),
		JsonViewer,VueEditor,
	},
	computed: {
		...mapState(useUserStore, ['userInfo']),
		queryStrCpd() {
			return this.autoStep.params.filter(k => k.id).map(k => k.id + '=' + k.value).join("&")
		},
		xmProductCpd(){
			if(this.xmProduct?.id){
				return this.xmProduct
			}
			if(this.xmMenu?.id){
				return {id:this.xmMenu.productId,productName:this.xmMenu.productName}
			}
			if(this.xmFunc?.id){
				return {id:this.xmFunc.productId,productName:this.xmFunc.productName}
			}
			
			if(this.xmTestCasedb?.id){
				return {id:this.xmTestCasedb.productId,productName:this.xmTestCasedb.productName}
			}
			
			if(this.formData?.productId){
				return {id:this.formData.productId,productName:this.formData.productName}
			}
			return null
		}

	},
	props: ['formData', 'visible', 'xmTestCasedb', 'xmProduct', 'xmMenu', 'xmFunc'],

	watch: { 
		'autoStep.bodyType'() {
			if (this.autoStep.bodyType == 'form-data' || this.autoStep.bodyType == 'x-www-form-urlencoded') {
				this.autoStep.body = []
			} else {
				this.autoStep.body = ''
			}

		}
	},
	data() {
		return {  
			dicts: { caseType: [], autoTestMethod: [], autoTestBodyType: [], autoTestAuthType: [] },//下拉选择框的所有静态数据 params={categoryId:'all',itemCodes:['sex']} 返回结果 {sex: [{id:'1',name:'男'},{id:'2',name:'女'}]}
			editFormRules: {
				caseName: [
					{ required: true, message: '测试用例名称不能为空', trigger: 'change' },
					{ max: 250, min: 2, message: '测试用例名称长度为2-250个字符之间', trigger: 'change' }
				],
				casedbId: [
					{ required: true, message: '用例库不能为空', trigger: 'change' },
				]
			},
			editFormBak: {
				id: '', caseName: '', caseRemark: '', testStep: '', expectResult: '', menuId: '', menuName: '', ctime: '', ltime: '', luserid: '', lusername: '', cbranchId: '', moduleId: '', moduleName: '', caseStatus: '0', cuserid: '', cusername: '', productId: '', verNum: '', casedbId: '', casedbName: '', cpriority: '2', funcId: '', funcName: '', preRemark: '', caseType: '0'
			},
			editForm: {
				id: '', caseName: '', caseRemark: '', testStep: '', expectResult: '', menuId: '', menuName: '', ctime: '', ltime: '', luserid: '', lusername: '', cbranchId: '', moduleId: '', moduleName: '', caseStatus: '0', cuserid: '', cusername: '', productId: '', verNum: '1.0', casedbId: '', casedbName: '', cpriority: '2', funcId: '', funcName: '', preRemark: '', caseType: '0'
			},
			editFormInit: {
				id: '', caseName: '', caseRemark: '', testStep: '', expectResult: '', menuId: '', menuName: '', ctime: '', ltime: '', luserid: '', lusername: '', cbranchId: '', moduleId: '', moduleName: '', caseStatus: '0', cuserid: '', cusername: '', productId: '', verNum: '1.0', casedbId: '', casedbName: '', cpriority: '2', funcId: '', funcName: '', preRemark: '', caseType: '0'
			}, 
			menuFormVisible: false, 
			activeTab: '1', 

			queryStr: '',
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
				headers:[],
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
				headers:[],
				expectResult: ''
			},
			apis:{
				add: addXmTestCase,
				edit: editXmTestCase,
				editSomeFields: editSomeFieldsXmTestCase
			}

		}//end return
	},//end data
	methods: {  
		initQueryStr() {
			this.queryStr = this.autoStep.params.map(k => k.id + '=' + k.value).join("&")
		},
		onQueryStrChange() {
			this.autoStep.params = []
			this.queryStr.split("&").forEach(k => {
				var k2 = k.split("=")
				var p = {}
				if (k2.length > 1) {
					p = { id: k2[0], value: k2[1] }
				} else {
					p = { id: k2[0], value: '' }
				}
				this.autoStep.params.push(p)
			})
		},
		addParamsRow(row, index) {
			this.autoStep.params.splice(index + 1, 0, { id: '', value: '' })
		},
		deleteParamsRow(row, index) {
			this.autoStep.params.splice(index, 1)
		},
		addBodyRow(row, index) {
			this.autoStep.body.splice(index + 1, 0, { id: '', value: '' })
		},
		deleteBodyRow(row, index) {
			this.autoStep.body.splice(index, 1)
		},

		addCookieRow(row, index) {
			this.autoStep.cookies.splice(index + 1, 0, { id: '', value: '' })
		},
		deleteCookieRow(row, index) {
			this.autoStep.cookies.splice(index, 1)
		},

		addHeaderRow(row, index) {
			this.autoStep.headers.splice(index + 1, 0, { id: '', value: '' })
		},
		deleteHeaderRow(row, index) {
			this.autoStep.headers.splice(index, 1)
		},
		saveAutoStep() {
			var autoStep = this.autoStep
			this.editSomeFields(this.editForm, 'autoStep', JSON.stringify(autoStep));
		},
		sendMsgForTestSetting() {
			var autoStepObj = this.autoStep;
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
			// axiosObj.headers['Access-Control-Allow-Origin']='*'
			// axios.defaults.withCredentials = true // 若跨域请求需要带 cookie 身份识别
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
				} else {
					this.$notify({ position: 'bottom-left', showClose: true, message: '执行完毕', type: res.status == 200 ? 'success' : 'error' })
				}
			}).catch(e=>{
				this.$notify({ position: 'bottom-left', showClose: true, message: '失败'+e, type: 'error' }) 
			})

		},
		initCurrData: function () {  
			this.currOpType=this.subOpType
			if (this.formData) {
				this.editForm = Object.assign({}, this.formData);
			}

			if (this.currOpType == 'add') { 
				if (this.xmTestCasedb && this.xmTestCasedb.id) {
					this.editForm.productId = this.xmTestCasedb.productId
					this.editForm.productName = this.xmTestCasedb.productName
					this.editForm.casedbId = this.xmTestCasedb.id
					this.editForm.casedbName = this.xmTestCasedb.name
				}

				if (this.xmProduct && this.xmProduct.id) {
					this.editForm.productId = this.xmProduct.id
					this.editForm.productName = this.xmProduct.productName
				}

				if (this.xmMenu && this.xmMenu.menuId) {
					this.editForm.productId = this.xmMenu.productId
					this.editForm.productName = this.xmMenu.productName
					this.editForm.menuId = this.xmMenu.menuId
					this.editForm.menuName = this.xmMenu.menuName
				}
				if (this.xmFunc && this.xmFunc.id) {

					this.editForm.funcId = this.xmFunc.id
					this.editForm.funcName = this.xmFunc.name
				}
				this.editForm.id = null
				this.editForm.cuserid=this.userInfo.userid
				this.editForm.cusername=this.userInfo.username
				this.editForm.caseStatus="0"
				this.editForm.cpriority="2"
				this.editForm.testType="0"
				this.editForm.caseType="0"
				this.editForm.caseRemark="<p>前置条件：</p><ol><li></li><li></li></ol><p>操作步骤：</p><ol><li></li><li></li></ol><p>期望结果：</p><ol><li></li><li></li></ol>"
			}

			if (!this.editForm.autoStep) {
				this.autoStep = { ...this.autoStepInit }
			} else {
				this.autoStep = JSON.parse(this.editForm.autoStep)
			}
			this.initQueryStr(); 
			this.activeTab="1"
		},
		editSomeFieldsCheck(row, fieldName, $event,params) {   
			if (fieldName == 'funcId') {
				params[fieldName] = $event.id
				params['funcName'] = $event.name
			} else if (fieldName == 'menuId') {
				params[fieldName] = $event.menuId
				params['menuName'] = $event.menuName
			} else if (fieldName == 'cuserid') {
				params[fieldName] = $event.userid
				params['cusername'] = $event.username
				params['cbranchId'] = $event.branchId
			} else if (fieldName == 'luserid') {
				params[fieldName] = $event.userid
				params['lusername'] = $event.username
			} else {
				params[fieldName] = $event
			}
			return true;
		},
		onMenuSelected(row) {
			this.editForm.menuId = row.menuId
			this.editForm.menuName = row.menuName 
			if (this.currOpType !== 'add') {
				this.editSomeFields(this.editForm, 'menuId', row)
			}
		},
		onFuncSelected(row) {
			this.editForm.funcId = row.id
			this.editForm.funcName = row.name 
			if (this.currOpType !== 'add') {
				this.editSomeFields(this.editForm, 'funcId', row)
			}
		},
		onTestCasedbSelect(testCasedb) {
			this.editForm.casedbId = testCasedb.id
			this.editForm.casedbName = testCasedb.Name
			if (testCasedb.productId) {
				this.editForm.productId = testCasedb.productId
				this.editForm.productName = testCasedb.productName
			} 
			
			if (this.currOpType !== 'add') {
				this.editSomeFields(this.editForm, 'casedbId', row)
			}

		}
	},//end method
	mounted() { 
		this.initData() 
	}
}

</script>

<style scoped />
