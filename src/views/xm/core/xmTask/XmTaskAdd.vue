<template>
	<el-form :model="editForm" label-width="125px" label-position="left" :rules="editFormRules" ref="editForm"> 
		<el-form-item prop="name">
			<template #label>
				<el-space>
					<icon :icon="editForm.ntype == '0' ? 'fa-solid:tasks' : 'ep:stopwatch'" />

					{{ editForm.ntype === '0' ? '任务名称' : '计划名称' }}
				</el-space>
			</template> 
				<el-input v-model="editForm.name" placeholder="名称"/>  
				<el-row>
  				<span class="label-font-color" v-if="xmProjectCpd && xmProjectCpd.id">
					<span>归属项目：{{ editForm.projectName ? editForm.projectName : '' }}{{ editForm.projectId ? '(' + editForm.projectId + ')' : '' }}
						&nbsp;&nbsp;</span>
					<span v-if="editForm.productId">归属产品：{{ editForm.productId ? editForm.productId : '' }} </span>
				</span>

				<span class="label-font-color" v-if="!xmProjectCpd || !xmProjectCpd.id">
					<span>归属项目：</span><xm-project-select show-style="tag" style="display:inline;" 
						:link-iteration-id="xmIteration ? xmIteration.id : null" :link-product-id="xmProduct ? xmProduct.id : null"
						@change2="onProjectRowClick" @clear="onProjectClear" />
					<span v-if="editForm.productId">归属产品：{{ editForm.productId ? editForm.productId : '' }} </span>
				</span> 
			</el-row>
		</el-form-item>


		<el-row class="padding-left padding-right">
			<el-col :span="8">
				<el-form-item>
					<mdp-field show-style="x" size="medium" v-model="editForm.parentTaskname" label="上级计划" icon="time"
						color="#E6A23C">
						<template #oper>
							<el-button @click="toSelectParent" title="更换任务的上级，实现任务搬家功能" icon="upload2"> 选择新的上级</el-button>
						</template>
					</mdp-field>
				</el-form-item>

			</el-col>

			<el-col :span="8">
				<el-form-item>
					<mdp-select width="100%" show-style="x" size="medium" :label="editForm.ntype == '0' ? '任务状态' : '计划状态'" itemCode="taskState"
						v-model="editForm.taskState" @change="editXmTaskSomeFields(editForm, 'taskState', $event)" />

				</el-form-item>
			</el-col>

			<el-col :span="8">
				<el-form-item>
					<mdp-select width="100%" show-style="x" size="medium" label="优先级别" itemCode="priority" v-model="editForm.level"
						@change="editXmTaskSomeFields(editForm, 'level', $event)" />

				</el-form-item>
			</el-col>

			<el-col :span="8">
				<el-form-item>
					<xm-user-select :xm-product="xmProductCpd" :sel-project="xmProjectCpd" show-style="x" size="medium" label="负责人" v-model="editForm.createUserid" :init-name="editForm.createUsername"
						@change2="editXmTaskSomeFields(editForm, 'createUserid', $event)" />

				</el-form-item>
			</el-col>
			<el-col :span="8">

				<el-form-item>
					<mdp-date-range showStyle="x" :style-obj="{ maxWidth: '100%' }" v-model="editForm" start-key="startTime"
						end-key="endTime" @change="onBudgetDateRangerChange" type="daterange"  unlink-panels
						range-separator="-" start-placeholder="开始日期" end-placeholder="完成日期" value-format="YYYY-MM-DD HH:mm:ss"
						:default-time="['00:00:00', '23:59:59']" :picker-options="pickerOptions" />
				</el-form-item>

			</el-col>

		</el-row>
		<el-tabs v-model="activateTabPaneName">

			<el-tab-pane label="详情" name="2"> 
				<el-form-item   prop="description" label-width="0px">
								<el-text type="warning">可以从需求文档复制文字、表格等进行黏贴、复制图片黏贴(1张一次),如关联了故事，建议不要重复描述故事内容</el-text>
 								<vue-editor v-if="activateTabPaneName=='2'" :editorConfig="{minHeight:'450px',scroll:true,placeholder:'什么人？做什么事？，为什么？如： 作为招聘专员，我需要统计员工半年在职/离职人数，以便我能够制定招聘计划'}"  :key="'description_' + editForm?.id" v-model="editForm.description"
								 :editorId="'description_' + editForm?.id" :branch-id="userInfo.branchId" /> 
								 
							</el-form-item> 
			</el-tab-pane>
			<el-tab-pane label="基础信息" name="1">
				<el-row>
					<el-col :span="10">
						<el-form-item label="" prop="milestone">
							<el-checkbox v-model="editForm.milestone" :true-label="1" :false-label="0">里程碑</el-checkbox>
							<el-checkbox v-model="editForm.taskOut" @change="onTaskOutChange" true-label="1"
								false-label="0">众包</el-checkbox>
						</el-form-item>
					</el-col>
					<el-col :span="14">
						<el-form-item prop="skill" label="" v-if="editForm.ntype != '1'" label-width="0">
							<el-tag class="fs-ft" style="margin-right:10px" v-for="(item, i) in taskSkills"
								:key="i">{{ item.taskSkillName }}</el-tag>
							<el-button type="text" @click.stop="showSkill()" icon="plus">技能要求</el-button>
						</el-form-item>
					</el-col>
				</el-row>
				<el-row>

					<el-col :span="12">
						<el-form-item label="排序序号" prop="sortLevel">
							<el-input v-model="editForm.sortLevel" style="max-width:90%;" placeholder="如1.0或者1.2.3等"
								title="序号，如1.0、1.1.1或者1，2，3等" />
						</el-form-item>
					</el-col>
					<el-col :span="12">
						<el-form-item label="工期类型">
							<mdp-select width="100%" itemCode="planType" v-model="editForm.planType" />
						</el-form-item>
					</el-col>
				</el-row>

				<el-row>
					<el-col :span="12">
						<el-form-item :label="editForm.ntype == '0' ? '任务前置' : '计划前置'">
							<el-tag v-if="editForm.preTaskid"  @close="clearPreTask" closable >{{editForm.preTaskid}}</el-tag>
									<el-button type="text" v-if="editForm.preTaskid && editForm.preTaskid!='0'"
											@click="$refs['detailDlg'].open({id:editForm.preTaskid.split(',')[0]})"
											title="查看详情" 
										> 查看详情</el-button>
									<el-button  type="text" v-if="editForm.ntype=='0'"  @click.stop="$refs['pretaskDlg'].open()"  >选前置</el-button>
									<el-button  type="text" v-if="editForm.ntype=='1'"  @click.stop="$refs['preplanDlg'].open()">选前置</el-button>


						</el-form-item>
					</el-col>
					<el-col :span="12">
						<el-form-item :label="editForm.ntype == '0' ? '任务类型' : '计划类型'" prop="taskType">
							<mdp-select width="100%" itemCode="taskType" v-model="editForm.taskType" />
						</el-form-item>
					</el-col>
				</el-row>
			</el-tab-pane>
			<el-tab-pane label="工时" name="5">
				<el-form-item label="报工方式" prop="wtype">
					<el-select v-model="editForm.wtype">
						<el-option label="无须报工" value="0" />
						<el-option label="强制每日报工" value="1" />
						<el-option label="工期内报工" value="2" />
					</el-select>
				</el-form-item>
				<el-form-item label="原始预估工时" prop="initWorkload">
					<el-input type="number"  v-model="editForm.initWorkload" @change="onInitWorkloadChange"
						:precision="2" :step="8" :min="0" placeholder="原始预估总工时(人时)" >
						<template #suffix>小时</template>
						</el-input>  
					<el-text>指一个2-4年工作经验的人完成当前任务需要的工时。一旦填写，后续一般不做修改。</el-text>
 					<el-text>计划执行过程中，用于识别出当前进度与原始预估值之间的偏离幅度，偏离过大需要进一步分析原因。</el-text>

				</el-form-item>
			</el-tab-pane>
			<el-tab-pane label="成本" name="6666">
				<el-form-item label="自研工时单价" prop="uniInnerPrice">
					<el-input type="number" style="width:150px;" v-model="editForm.uniInnerPrice" :precision="2" :step="10" :min="0"
						placeholder="自研工时单价" /> 元/h

				</el-form-item>
				<el-form-item label="外包、众包单价" prop="uniOutPrice">
					<el-input type="number" style="width:150px;" v-model="editForm.uniOutPrice" :precision="2" :step="10" :min="0"
						placeholder="外发工时单价" /> 元/h

				</el-form-item>
				<el-form-item label="预算金额" prop="budgetAt">
					<el-input type="number" style="width:150px;" v-model="editForm.budgetAt" :precision="2" :step="100" :min="0"
						placeholder="预算金额" /> 元
					<br />
					<font color="blue">预算金额至上而下逐级分解，下级预算总和不能超出上级预算金额。实际金额不能超出预算金额。</font>

				</el-form-item>

			</el-tab-pane>
			<el-tab-pane label="需求" name="3" v-if="editForm.ntype != '1'">
				<el-row>
					<el-col :span="12">
						<el-form-item label="归属产品" prop="productId">
							{{ editForm.productId }}
						</el-form-item>
					</el-col>
					<el-col :span="12">
						<el-form-item label="用户故事" prop="menuId" id="menuInfo" v-if="editForm.ntype != '1'">
							<el-text truncated style="width:30em;">{{ editForm.menuName||editForm.menuId }}</el-text> &nbsp;&nbsp;&nbsp; <el-link @click="menuVisible = true"
								type="primary">{{ editForm.menuName ? '更改' : '设置' }}</el-link>&nbsp;&nbsp;&nbsp;
							<el-link v-if="editForm.menuId" @click="toMenu" type="primary">查看需求</el-link>
						</el-form-item>
					</el-col>
				</el-row>
			</el-tab-pane>
			<el-tab-pane label="结算信息" name="7" v-if="editForm.ntype != '1'">
				<el-form-item label="" prop="taskClass">
					<el-checkbox v-model="editForm.taskClass" true-label="1" false-label="0">是否需要结算</el-checkbox>
				</el-form-item>
				<el-form-item v-if="editForm.taskClass == '1'" label="结算方案" prop="settlSchemel">
					<mdp-select width="100%" itemCode="xmTaskSettleSchemel" v-model="editForm.settleSchemel" />
				</el-form-item>
			</el-tab-pane>
			<el-tab-pane label="外包、众包、互联网" name="8" v-if="editForm.ntype != '1'">
				<el-form-item>
					<el-checkbox v-model="editForm.taskOut" true-label="1" false-label="0" id="taskOut">外包</el-checkbox>

					<el-checkbox v-model="editForm.crowd" true-label="1" false-label="0" id="crowd"
						v-if="editForm.taskOut === '1'">开通众包</el-checkbox>

					<el-checkbox v-model="editForm.toTaskCenter" true-label="1" false-label="0" id="toTaskCenter"
						v-if="editForm.taskOut === '1'">发布到互联网任务大厅</el-checkbox>
				</el-form-item>
				<el-form-item label="分享赚" prop="oshare" v-if="editForm.taskOut === '1'">
					<el-checkbox v-model="editForm.oshare" true-label="1" false-label="0" id="oshare">开通分享赚</el-checkbox>
				</el-form-item>
				<el-form-item label="分享佣金" prop="shareFee" v-if="editForm.oshare === '1' && editForm.taskOut === '1'">
					<el-input type="number" style="width:150px;" v-model="editForm.shareFee" :precision="2" :step="100" :min="0"
						placeholder="分享赚佣金" /> 元
					<font color="blue">开通分享赚后起效，佣金从任务预算中扣除，如果未发生分享佣金，则不扣除。一般建议为任务佣金的1%-5%</font>
				</el-form-item>

				<el-steps :active="calcTaskStep" align-center simple>
					<el-step title="发布" description="任务创建成功后即发布" />
					<el-step title="竞标" description="候选人参与竞标，或者由责任人主动设置候选人" />
					<el-step title="执行" description="候选人中标后，成为执行人，执行任务" />
					<el-step title="验收" description="任务完成后提交验收，验收通过，即可进行结算" />
					<el-step title="结算" description="提交结算申请审批流程，审批过程自动根据审批结果进行结算" />
					<el-step title="企业付款" description="结算流程审批通过，自动付款到个人钱包" />
					<el-step title="提现" description="企业付款完成后，个人对钱包中余额进行提现" />
				</el-steps>
			</el-tab-pane>
		</el-tabs>
		<el-row class="padding" style="float:right;">
			<el-button @click="handleCancel">取消</el-button>
			<el-button v-loading="load.add" type="primary" @click="addSubmit(1)" :disabled="load.add == true">提交(关闭窗口)</el-button>
			<el-button v-loading="load.add" type="primary" @click="addSubmit(2)" :disabled="load.add == true">提交(继续新增)</el-button>
		</el-row>
	</el-form>
	<mdp-dialog append-to-body title="新增技能" v-model="skillVisible" width="60%" :close-on-click-modal="false">
		<skill-mng v-if="skillVisible" :task-skills="taskSkills" :jump="true" @select-confirm="onTaskSkillsSelected" />
	</mdp-dialog>

	<mdp-dialog append-to-body title="需求选择" v-model="menuVisible" width="90%" :close-on-click-modal="false">
		<xm-menu-box subOpType="select" v-if="menuVisible" @select="onMenuSelected"
			:sel-project="editForm.projectId ? { id: editForm.projectId, name: editForm.projectName } : xmProjectCpd"
			:xm-product="xmProductCpd" :xm-iteration="xmIteration" />
	</mdp-dialog>

	<mdp-dialog title="选中任务" v-model="selectTaskVisible" width="90%" append-to-body :close-on-click-modal="false">
		<XmTaskBox v-if="selectTaskVisible" check-scope="task" query-scope="planTask"
			:sel-project="editForm.projectId ? { id: editForm.projectId, name: editForm.projectName } : xmProjectCpd"
			:xm-product="xmProductCpd" :ptype="editForm.ptype" @select="onSelectedTask" />
	</mdp-dialog>

	<mdp-dialog title="选中上级" v-model="selectParentTaskVisible" width="60%" append-to-body :close-on-click-modal="false">
		<XmPhase v-if="selectParentTaskVisible"
			:sel-project="editForm.projectId ? { id: editForm.projectId, name: editForm.projectName } : xmProjectCpd"
			:xm-product="xmProductCpd" showConfirm :ptype="editForm.ptype" @select="onSelectedParentTask" />
	</mdp-dialog>
	<mdp-dialog append-to-body title="需求明细" v-model="menuDetailVisible" width="90%" :close-on-click-modal="false">
		<XmMenuDetail v-if="menuDetailVisible" :visible="menuDetailVisible" :reload="true"
			:form-data="{ menuId: editForm.menuId, menuName: editForm.menuName }" />
	</mdp-dialog>
	
  <mdp-dialog ref="pretaskDlg" title="选中前置任务"   width="90%"  append-to-body   :close-on-click-modal="false">
    <XmTaskBox  :xm-product="xmProductCpd" :sel-project="xmProjectCpd"   @select="onPretaskSelect" subOpType="select" :multiple="true"/>
  </mdp-dialog>
  <mdp-dialog ref="preplanDlg" title="选中前置计划"   width="90%"  append-to-body   :close-on-click-modal="false">
    <XmPhase subOpType="select" :xm-product="xmProductCpd" :sel-project="xmProjectCpd" :multiple="true" @select="onPreplanSelect" showConfirm/>
  </mdp-dialog>
	
		<!--编辑 XmTask xm_task界面-->
		<mdp-dialog ref="detailDlg" 
			title="计划/任务明细"
			fullscreen
			append-to-body
			:close-on-click-modal="false"
			>
			<template #default="{visible,data,dialog}">
			<XmTaskDetail
				:xm-project="xmProjectCpd"
				:formData="data"
				:visible="visible"
				:reload="true"
				@cancel="dialog.close()"
			 />
			</template>
		</mdp-dialog>
</template>

<script>
import util from '@/components/mdp-ui/js/util';//全局公共库

import { defineAsyncComponent } from 'vue';
import { addTask, addXmTask } from '@/api/xm/core/xmTask';
import { mapState } from 'pinia'
import { useUserStore } from '@/store/modules/user';
import { sn } from '@/components/mdp-ui/js/sequence'; 
import { MdpFormMixin } from '@/components/mdp-ui/mixin/MdpFormMixin';

import { Editor as VueEditor } from '@/components/Editor'
	export default {
		mixins:[MdpFormMixin],
	computed: {
		...mapState(useUserStore, [
			'userInfo', 'roles'
		]),
		calcTaskStep() {
			if (!this.editForm.executorUserid) {
				return 1
			} else if (this.editForm.exeUsernames) {

				if (this.editForm.exeUsernames.indexOf('执行中') >= 0) {
					return 3
				} else if (this.editForm.exeUsernames.indexOf('已验收') >= 0) {
					return 4
				} else if (this.editForm.exeUsernames.indexOf('已验收') >= 0) {
					return 4
				} else if (this.editForm.exeUsernames.indexOf('已验收') >= 0) {
					return 4
				} if (this.editForm.exeUsernames.indexOf('已结算') >= 0) {
					return 5
				}
			}
			return 0
		},
		xmProjectCpd() {
			if (this.xmProject && this.xmProject.id) {
				return this.xmProject
			}
			if (this.parentTask && this.parentTask.id && this.parentTask.projectId) {
				return { id: this.parentTask.projectId, name: this.parentTask.projectName }
			}
			if (this.formData.projectId) {
				return { id: this.formData.projectId, name: this.formData.projectName }
			}
			return null;
		},

		xmProductCpd() {
			if (this.xmProduct && this.xmProduct.id) {
				return this.xmProduct
			}
			if (this.xmIteration && this.xmIteration.id) {
				return { id: this.xmIteration.productName, productName: this.xmIteration.productName }
			}

			if (this.formData.productId) {
				return { id: this.formData.productId, productName: this.formData.productName }
			}
			return null;
		}
	},
	props: ['formData', 'visible', 'xmProject', 'xmProduct', "parentTask", "ptype", 'xmIteration','derive'],
	watch: {
		'formData': function (formData) {
		},
		'visible': function (visible) {
			this.fileVisible = visible;
			if (visible == true) {
				this.initData();
			}
		},
	},
	data() {

		return {
			 
 			editFormRules: {
				name: [
					{ required: true, message: '任务名称不能为空', trigger: 'change' },
					{ min: 2, max: 150, message: '长度在 2 到 150 个字符', trigger: 'change' },//长度

				],
				description: [
					{ max: 1000, message: '长度在 0 到 1000 个字符', trigger: 'change' },//长度
				],
				taskState: [
					{ required: true, message: '请选择任务状态', trigger: 'change' }
				],
				// execuser:[{
				// 	validator: validateExec, trigger: 'blur'
				// }],
			},
 
			editForm: {
				id: '', name: '', parentTaskid: '', parentTaskname: '', projectId: '', projectName: '', level: '', sortLevel: '', executorUserid: '', executorUsername: '', preTaskid: '', preTaskname: '', startTime: '', endTime: '', milestone: '', description: '', remarks: '', createUserid: '', createUsername: '', createTime: '', rate: 0, budgetAt: 0, budgetWorkload: 0, actAt: 0, actWorkload: 0, taskState: '0', taskType: '4', taskClass: '', toTaskCenter: '0', actStartTime: '', actEndTime: '', bizProcInstId: '', bizFlowState: '', phaseId: '', phaseName: '', taskSkillNames: '', exeUsernames: '', taskSkillIds: '', exeUserids: '', taskOut: '0', planType: 'w2', settleSchemel: '1', menuId: '', menuName: '', productId: '', cbranchId: '', cdeptid: '', tagIds: '', tagNames: '', ntype: '', childrenCnt: '', ltime: '', pidPaths: '', lvl: '', isTpl: '', keyPath: '', uniInnerPrice: 80, uniOutPrice: 100, calcType: '', ptype: '', wtype: '', bctrl: '', initWorkload: '', shareFee: '', oshare: '', crowd: '', browseUsers: '', execUsers: '', cityId: '', cityName: '', regionType: '', browseTimes: '', capaLvls: '', tranMode: '', supRequires: '', hot: '0', top: '0', urgent: '0', crmSup: '0', bidStep: '0', interestLvls: '', filePaths: '', estate: '0', efunds: 0, etoPlatTime: '', etoDevTime: '', ebackTime: '', topStime: '', topEtime: '', hotStime: '', hotEtime: '', urgentStime: '', urgentEtime: ''
			}, 
			menuVisible: false,
			menuDetailVisible: false,
			skillVisible: false,
			taskSkills: [],
			selectTaskVisible: false,
			selectParentTaskVisible: false,
			execUserVisible: false,
			groupUserSelectVisible: false,
			execGroupUserSelectVisible: false,
			pickerOptions: util.getPickerOptions('datarange'),
			activateTabPaneName: '1'
			/**end 在上面加自定义属性**/
		}//end return
	},//end data
	methods: {
		// 取消按钮点击 父组件监听@cancel="editFormVisible=false" 监听
		handleCancel: function () {
			this.$emit('cancel');
		},
		//新增提交XmTask xm_task 父组件监听@submit="afterAddSubmit"
		addSubmit: function (submitType) {
			if (this.editForm.ntype != '1') {
				if (this.xmIteration && this.xmIteration.id) {
					if (!this.editForm.menuId) {
						this.$notify({ position: 'bottom-left', showClose: true, message: '在迭代视图中添加任务需要关联需求！请选择需求', type: 'error' })
						this.activateTabPaneName = "3"
						this.menuVisible = true;
						return;
					}
				}
				/**
				if(!this.editForm.parentTaskid){
					this.$notify({position:'bottom-left',showClose:true,message:'请选择上级计划',type: 'error'})
					return;
				}
				 */
			}
			if (!this.editForm.projectId) {
				this.$notify({ position: 'bottom-left', showClose: true, message: '请选择项目', type: 'error' })
				return;
			}



			this.$refs.editForm.validate((valid) => {
				if (valid) {
					if (this.editForm.oshare === '1') {
						if (this.editForm.shareFee > 1000) {
							this.$notify({ position: 'bottom-left', showClose: true, message: '分享佣金不能超过1000元', type: 'error' })
							return;
						} else if (!this.editForm.budgetAt) {
							this.$notify({ position: 'bottom-left', showClose: true, message: '请先设置预算金额', type: 'error' })
							return;
						} else if (this.editForm.shareFee / this.editForm.budgetAt > 0.05) {
							this.$notify({ position: 'bottom-left', showClose: true, message: '分享佣金不能超过预算金额的5%', type: 'error' })
							return;
						}
					}
					this.$confirm('确认提交吗？', '提示', {}).then(() => {
						let params = Object.assign({}, this.editForm);
						addTask(params).then((res) => {
							this.load.add = false
							var tips = res.tips;
							if (tips.isOk) {
								this.$emit('submit', res.data);//  @submit="afterAddSubmit"
								if (submitType == 1) {
									this.handleCancel()
								} else {
									var sortLevels = this.editForm.sortLevel.split(".")
									sortLevels[sortLevels.length - 1] = parseInt(sortLevels[sortLevels.length - 1]) + 1
									this.editForm.sortLevel = sortLevels.join(".");
								}
							}
							this.$notify({ position: 'bottom-left', showClose: true, message: tips.msg, type: tips.isOk ? 'success' : 'error' });

						}).catch(err => this.load.add = false);
					});
				} else {
					this.$notify({ position: 'bottom-left', showClose: true, message: "表单检查不通过，请修改后提交", type: 'error' });
				}
			});
		}, 

		toSelectParent() {
			if (!this.editForm.projectId && !this.xmProjectCpd) {
				this.$notify({ position: 'bottom-left', showClose: true, message: "请先选择归属项目", type: 'error' });
				return;
			}
			this.selectParentTaskVisible = true
		},
		showSkill() {
			this.skillVisible = true;
		},
		onMenuSelected: function (menu) {
			this.editForm.menuId = menu.menuId
			this.editForm.menuName = menu.menuName
			this.menuVisible = false;
		},
		onTaskSkillsSelected(skills) {
			let taskSkill = [];
			skills.forEach(i => {
				let obj = {
					taskSkillId: i.skillId,
					taskSkillName: i.skillName,
					skillRemarks: '',
				};
				taskSkill.push(obj);
			});
			this.taskSkills = taskSkill;
			this.skillVisible = false;
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
		toFixed(floatValue) {
			if (floatValue == null || floatValue == '' || floatValue == undefined) {
				return 0;
			} else {
				return parseFloat(floatValue).toFixed(2);
			}
		},

		onBudgetDateRangerChange() {
			var start = new Date(this.editForm.startTime);
			var end = new Date(this.editForm.endTime);
			var weekday = this.getWeekday(start, end);

			this.editForm.budgetWorkload = weekday * 8
			this.editForm.initWorkload = this.editForm.budgetWorkload
			var price = 80;
			if (this.editForm.taskOut == '1') {
				if (this.editForm.uniOuserPrice) {
					price = this.editForm.uniOuserPrice
				} else {
					price = this.xmProject.planOuserPrice
				}
			} else {
				if (this.editForm.uniIuserPrice) {
					price = this.editForm.uniIuserPrice
				} else {
					price = this.editForm.planIuserPrice
				}
			}
			this.editForm.budgetAt = this.editForm.budgetWorkload * price
		},
		onInitWorkloadChange() {
			this.editForm.budgetWorkload=this.editForm.initWorkload
		},
		onTaskOutChange() {
			this.onInitWorkloadChange();
		},
		onSelectedTask(task) {
			this.selectTaskVisible = false;
			if (task) {
				this.editForm.preTaskid = task.id
				this.editForm.preTaskname = task.name
			}
		},
		clearPreTask() {
			this.editForm.preTaskid = ''
			this.editForm.preTaskname = ''
		},
		onSelectedParentTask(parentTask) {
			this.selectParentTaskVisible = false;
			if (parentTask && parentTask.id) {
				this.editForm.parentTaskid = parentTask.id
				this.editForm.parentTaskname = parentTask.name;
				this.editForm.taskType = parentTask.taskType
				this.editForm.planType = parentTask.planType

				if (parentTask.childrenCnt && parentTask.sortLevel) {
					this.editForm.sortLevel = parentTask.sortLevel + "." + (parentTask.childrenCnt + 1)
				} else if (parentTask.sortLevel) {
					this.editForm.sortLevel = parentTask.sortLevel + "." + 1
				} else {
					this.editForm.sortLevel = "" + 1
				}
			}
		},
		clearParentTask() {
			this.editForm.parentTaskid = ''
			this.editForm.parentTaskname = ''
			this.editForm.sortLevel = ""
		}, 
		setSkills() {
			if (this.editForm.taskSkillIds && this.editForm.taskSkillNames) {
				var skillNames = this.editForm.taskSkillNames.split(",");
				this.taskSkills = this.editForm.taskSkillIds.split(",").map((item, index) => {
					return {
						taskId: this.editForm.id,
						taskSkillId: item,
						taskSkillName: skillNames[index]
					}
				})
			}
		},
		/**end 在上面加自定义方法**/
		initCurrData() { 
			if(this.formData){
				Object.assign(this.editForm,this.formData)
			}
			if (this.parentTask && this.parentTask.id) {
				this.editForm = Object.assign(this.editForm, this.parentTask);
				this.editForm.parentTaskid = this.parentTask.id
				this.editForm.parentTaskname = this.parentTask.name;
				this.editForm.taskType = this.parentTask.taskType
				this.editForm.planType = this.parentTask.planType
				this.editForm.ptype = this.parentTask.ptype
				this.editForm.name = this.parentTask.name + "-请修改"
				this.editForm.budgetAt = 0
				this.editForm.budgetWorkload = 0
				this.editForm.actAt = 0
				this.editForm.actWorkload = 0
				this.editForm.rate = 0
				this.editForm.actStartTime = null
				this.editForm.actEndTime = null
				this.editForm.exeUserids = null
				this.editForm.exeUsernames = null
				this.editForm.executorUserid = null
				this.editForm.executorUsername = null
				this.editForm.shareFee = 0
				this.editForm.taskOut = "0"
				this.editForm.toTaskCenter = "0"
				this.editForm.crowd = "0"
				this.editForm.level='2'

			} else {
				if(!this.derive){ 
					this.editForm.parentTaskid = ''
					this.editForm.parentTaskname = '';
				}
			}
			if (this.xmProject) {
				this.editForm.projectId = this.xmProject.id
				this.editForm.projectName = this.xmProject.name
			}
			if (this.xmProduct) {
				this.editForm.productId = this.xmProduct.id
				this.editForm.productName = this.xmProduct.productName
			}

			if (this.xmIteration && !this.xmProduct && !this.editForm.productId) {
				this.editForm.productId = this.xmIteration.productId
				this.editForm.productName = this.xmIteration.productName
			}
			if (this.parentTask && this.parentTask.id) {
				if (this.parentTask.childrenCnt) {
					this.editForm.sortLevel = (this.parentTask.sortLevel||'') + "." + (this.parentTask.childrenCnt + 1)
				} else  {
					this.editForm.sortLevel = (this.parentTask.sortLevel||'') + "." + 1
				}  
			}else {
				this.editForm.sortLevel=this.editForm.sortLevel||''
			}
			if (!this.editForm.uniInnerPrice) {
				this.editForm.uniInnerPrice = 80
			}
			if (this.editForm.taskOut != '1') {
				this.editForm.taskOut = '0'
			}
			if (!this.editForm.uniOutPrice) {
				this.editForm.uniOutPrice = 100
			}
			if (!this.parentTask || !this.parentTask.id) {
				this.editForm.ptype = this.ptype
			}
			this.editForm.createUserid = this.userInfo.userid
			this.editForm.createUsername = this.userInfo.username;
			this.editForm.wtype = "2"
			
			this.editForm.level='2'
			if (!this.editForm.startTime) { 
				this.editForm.startTime = util.moment().startOf('day').format('YYYY-MM-DD HH:mm:ss'),
				this.editForm.endTime = util.moment().add(2,'days').endOf('day').format('YYYY-MM-DD HH:mm:ss')
				this.onBudgetDateRangerChange();
			}

			this.editForm.id = null;
			this.editForm.taskState='0'
			this.activateTabPaneName = "1"
			if (this.formData) { 
				this.editForm.ntype = this.formData.ntype||this.editForm.ntype
				this.editForm.milestone = this.formData.milestone||this.editForm.milestone
			}
		},
		toMenu() {
			this.menuDetailVisible = true
		},

		onProjectRowClick: function (project) {
			this.editForm.projectId = project.id
			this.editForm.projectName = project.name
		},
		onProjectClear() {
			this.editForm.projectId = ""
			this.editForm.projectName = ""
		},
		
    onPretaskSelect(tasks){
      if(tasks && tasks.length>3){
        this.$message.error('最多选3个前置任务')
        return;
      }
      this.editForm['preTaskid']=tasks.map(k=>k.id).join(",")
      this.$refs['pretaskDlg'].close()
    },
    onPreplanSelect(tasks){
      if(tasks && tasks.length>3){
        this.$message.error('最多选3个前置计划')
        return;
      }
      this.editForm['preTaskid']=tasks.map(k=>k.id).join(",")
      this.$refs['preplanDlg'].close()
    },
	},//end method
	components: {  
		VueEditor
 	},
	mounted() {
		this.initData();

	}//end mounted
}

</script>