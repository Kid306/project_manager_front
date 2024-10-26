<template>
	
		<el-row :gutter="20" >
			<el-col v-if="editForm.crowd==='1' && editForm.taskOut=='1'" :span="4" class="border padding">
				 <h3 class="padding-bottom">
					<div    class="big-icon" :style="{backgroundColor:   editForm.ntype==='0'?'#409EFF':'#E6A23C'}">
						<icon :icon="editForm.ntype==='0'?'fa-solid:tasks':'ep:stopwatch' " />
					</div>
					众包{{editForm.ntype=='1'?'计划':'任务'}} 					
					<mdp-select itemCode="bizFlowState" show-style="tag" placeholder="当前审核状态" :disabled="true"/>
				</h3>  
				<el-space class="padding-bottom"> 
					<el-button v-if="editForm.bizFlowState in ['0','3','4']"
						@click="sendToProcessApprova(editForm,'xm_task_approva')"
						title="发审"
						icon="pointer"
					> 发审</el-button>  
					<el-button v-else
						@click="activateTabPaneName = 'currFlow'"
						title="查看审核记录"
						icon="share"
					> 查看审核记录</el-button> 
				</el-space>  
				<el-steps space="40" :active="calcTaskStep" align-center  finish-status="success" process-status="process" direction="vertical">
					<el-step v-for="(item,index) in dicts.bidStep" :title="item.name" :description="item.name" :key="index">
						<template #description>
								<span v-if="item.id=='0'"><!--草稿-->
								</span>
								<span v-else-if="item.id=='1'"> <!--需求-->
								<el-button class="step-btn"  type="primary"   @click="activateTabPaneName='6'" plain>预算管理</el-button>
								<el-button class="step-btn" type="danger" icon="d-caret"  v-if="editForm.bidStep=='0'" @click="editSomeFields(editForm,'bidStep','1')" plain>去发布</el-button>
								<span v-else-if="editForm.bidStep>='1'">
									<el-button class="step-btn" type="danger" icon="d-caret"  v-if="editForm.bidStep=='1'" @click="editSomeFields(editForm,'bidStep','0')" plain>去取消发布</el-button>
									<el-button class="step-btn" type="warning"  v-if="editForm.bidStep>='1'" @click="activateTabPaneName='82'" plain>参加推广活动</el-button>
								</span>

								</span>
								<span v-else-if="item.id=='2'"> <!--投标中-->
								<el-button class="step-btn" type="primary"  v-if="editForm.bidStep=='1'" @click="activateTabPaneName='42'" plain>去投标</el-button>
								<el-button class="step-btn" type="primary"  v-else-if="editForm.bidStep>'1'" @click="activateTabPaneName='42'" plain>投标人管理</el-button>
								</span>
								<span v-else-if="item.id=='3'"> <!--选标-->
								<el-button class="step-btn" type="primary"  v-if="editForm.bidStep=='2'" @click="activateTabPaneName='42'" plain>去选标</el-button>
								<el-button class="step-btn" type="primary"  v-else-if="editForm.bidStep>'2'" @click="activateTabPaneName='42'" plain>中标人管理</el-button>
								</span>
								<span v-else-if="item.id=='4'"> <!--拓管资金-->
								<el-button class="step-btn"  type="primary"  v-if="(editForm.bidStep=='4'||editForm.bidStep=='3') && (editForm.estate=='0'||editForm.estate==''||editForm.estate=='1')" @click="activateTabPaneName='8'" plain>去托管佣金￥：{{needPayEfundsAt}}</el-button>
								<el-button class="step-btn"  type="primary"  v-if=" (editForm.estate>'1')" @click="activateTabPaneName='8'" plain>已托管佣金￥：{{editForm.efunds}}</el-button>

								</span>
								<span v-else-if="item.id=='5'"> <!--工作中-->
									<span v-if="editForm.bidStep==item.id">
										<el-button class="step-btn"  type="primary"  v-if="editForm.bidStep>'1'" @click="activateTabPaneName='5'" plain>报工、报进度</el-button>
										<el-button class="step-btn" type="danger" icon="d-caret"  v-if="(editForm.bidStep=='4'||editForm.bidStep=='3') && (editForm.estate>='2')" @click="editSomeFields(editForm,'bidStep','5')" plain>开始工作</el-button>

										<el-button class="step-btn" type="danger" icon="d-caret"  v-if=" (editForm.taskState=='1'||editForm.taskState=='0')" @click="editSomeFields(editForm,'taskState','2')" plain>设为已完工、待验收</el-button>
								 	</span>
 								</span>
								<span v-else-if="item.id=='6'"> <!--付款完成-->
									<span v-if="editForm.bidStep==item.id">
										<span v-if="editForm.taskState=='2'">
											<el-button class="step-btn" type="danger" icon="d-caret"   @click="editSomeFields(editForm,'taskState','3')" plain>设为验收成功</el-button>
											<el-button class="step-btn" type="danger" icon="d-caret"  @click="editSomeFields(editForm,'taskState','1')" plain>设为验收不成功</el-button>
										</span>

										<el-button class="step-btn"  type="primary" v-if="editForm.taskState=='3'"   @click="editSomeFields(editForm,'taskState','4')" plain>设为已结算</el-button>
										<el-button class="step-btn" type="primary"  v-if=" editForm.taskState=='4'" plain @click="editSomeFields(editForm,'taskState','9')">设为已关闭</el-button>
									</span>
								</span>
						</template>
					</el-step>
				</el-steps> 
			</el-col> 
			
			<el-col v-if="editForm.crowd!='1' ||  editForm.taskOut!='1'" :span="4" class="border padding">
				<h3 class="padding-bottom">
				<div    class="big-icon" :style="{backgroundColor:   editForm.ntype==='0'?'#409EFF':'#E6A23C'}">
					<icon :icon="editForm.ntype==='0'?'fa-solid:tasks':'ep:stopwatch' " /> 
				</div>
				普通{{editForm.ntype=='1'?'计划':'任务'}}					
					<mdp-select itemCode="bizFlowState" show-style="tag" placeholder="当前审核状态" :disabled="true"/>
				</h3>
				<el-row class="padding-bottom"> 
					<el-button v-if="editForm.bizFlowState in ['0','3','4']"
						@click="sendToProcessApprova(editForm,'xm_task_approva')"
						title="发审"
						icon="upload2"
					> 发审</el-button>  
					<el-button v-else
						@click="activateTabPaneName = 'currFlow'"
						title="查看审核记录"
						icon="upload2"
					> 查看审核记录</el-button> 
				</el-row> 
				<el-steps space="40" :active="calcTaskStep" align-center   finish-status="success" process-status="process" direction="vertical">
					<el-step v-for="(item,index) in dicts.taskState" :title="item.name" :description="item.name" :key="index">
						<template #description>
								<span v-if="item.id=='0'"><!--待领取-->
									<el-button class="step-btn"  type="primary"   @click="activateTabPaneName='6'" plain>预算管理</el-button>
									<el-button class="step-btn" type="primary"  v-if="editForm.ntype=='0' && !editForm.executorUserid" @click="activateTabPaneName='42'" plain>去指派执行人</el-button>
									<el-button class="step-btn" type="primary"  v-if="editForm.ntype=='0' && editForm.executorUserid" @click="activateTabPaneName='42'" plain>执行人管理</el-button>
								<el-button class="step-btn" type="danger" icon="d-caret"  v-if="editForm.taskState=='0'" @click="editSomeFields(editForm,'taskState','1')" plain>设为执行中</el-button>
								</span>
								<span v-else-if="item.id=='1'"> <!--已领取执行中-->
								<el-button class="step-btn"  type="primary"  v-if="editForm.ntype=='1'" @click="activateTabPaneName='4'" plain>子工作项管理</el-button>
								<el-button class="step-btn"  type="primary"  v-if="editForm.ntype=='0'" @click="activateTabPaneName='41'" plain>缺陷跟踪</el-button>
								<el-button class="step-btn"  type="primary"  v-if="editForm.ntype=='0'" @click="activateTabPaneName='5'" plain>报工、报进度</el-button>
								<el-button class="step-btn" type="danger" icon="d-caret"  v-if="editForm.taskState=='1'" @click="editSomeFields(editForm,'taskState','2')" plain>设为已完工、待验收</el-button>


								</span>
								<span v-else-if="item.id=='2'"> <!--已完工-->
									<el-button class="step-btn" type="danger" icon="d-caret"  v-if="  editForm.taskState=='2'" @click="editSomeFields(editForm,'taskState','3')" plain>设为已验收、待结算</el-button>
									<el-button class="step-btn" type="danger" icon="d-caret"  v-if=" editForm.taskState=='2'" @click="editSomeFields(editForm,'taskState','1')" plain>设为验收不过，待执行</el-button>
 								</span>
								<span v-else-if="item.id=='3'"> <!--已验收-->

								<el-button class="step-btn" type="danger" icon="d-caret"  v-if=" editForm.taskState=='3'" @click="editSomeFields(editForm,'taskState','4')" plain>设为已结算</el-button>
 								</span>
								<span v-else-if="item.id=='4'"> <!--已结算-->

								<el-button class="step-btn" type="danger" icon="d-caret"  v-if=" editForm.taskState=='4'" @click="editSomeFields(editForm,'taskState','9')" plain>设为已关闭</el-button>
								</span>
								<span v-else-if="item.id=='9'"> <!--已关闭-->
								</span>
						</template>
					</el-step>
				</el-steps>

			</el-col>
			<el-col :span="20">
			<!--新增界面 XmTask xm_task-->
			<el-form :model="editForm"  label-width="120px" label-position="left" :rules="editFormRules" ref="editForm">

						<el-form-item  prop="name" >
							<template #label> 
							{{editForm.ntype==='0'?' 任务名称':' 计划名称'}}
							</template>
								<el-input v-model="editForm.name" placeholder="名称" @change="editSomeFields(editForm,'name',$event)"/>
							<el-space class="label-font-color">
									<span>任务编号：{{editForm.id}}</span><el-divider direction="vertical" />
 									<span>归属项目：{{editForm.projectName?editForm.projectName:''}}{{editForm.projectId?'('+editForm.projectId+')':''}}  </span><el-divider direction="vertical" />
 									<span v-if="editForm.productId">归属产品：{{editForm.productId?editForm.productId:''}}  </span>
									 <el-divider direction="vertical" />
										<MdpSelectTag relative showStyle="tag" v-model="editForm.tagIds" multiple :init-name="editForm.tagNames" @change2="editSomeFields(editForm,'tagIds',$event)"/>
										<el-button type="text" icon="share" @click="copyLink">分享</el-button>
							</el-space>
						</el-form-item>


						<el-row>
							<el-col :span="8">
								<el-form-item> 
								<mdp-field show-style="x"  v-model="editForm.parentTaskname" label="上级计划" icon="time" color="#E6A23C">
									<template #oper>
										<el-space wrap>
											
										<el-button
											@click="$refs['parentDlg'].open()"
											title="更换任务的上级，实现任务搬家功能"
											icon="upload2"
										> 选择新的上级</el-button>
										<el-button  v-if="editForm.parentTaskid && editForm.parentTaskid!='0'"
											@click="$refs['detailDlg'].open({id:editForm.parentTaskid})"
											title="查看上级计划明细"
											icon="upload2"
										> 查看上级计划</el-button>
											</el-space>
									</template>
								</mdp-field>
							</el-form-item>
							</el-col>
							<el-col :span="8">
								<el-form-item> 
									<xm-user-select :xm-product="xmProductCpd" :sel-project="xmProjectCpd" show-style="x"   label="负责人" v-model="editForm.createUserid" @change2="editSomeFields(editForm,'createUserid',$event)" :init-name="editForm.createUsername"/>
								</el-form-item>
								</el-col>
							<el-col :span="8" v-if="editForm.ntype=='0'">
								<el-form-item> 
									<xm-user-select :xm-product="xmProductCpd" :sel-project="xmProjectCpd" show-style="x"  v-if="editForm.crowd=='1'"  label="执行人" v-model="editForm.executorUserid" :init-name="editForm.executorUsername">
										<template #oper><el-button @click="activateTabPaneName='42'">去管理竞标人</el-button></template>
									</xm-user-select>
									<xm-user-select :xm-product="xmProductCpd" :sel-project="xmProjectCpd" show-style="x"   v-if="editForm.crowd!='1'" label="执行人" v-model="editForm.executorUserid" :init-name="editForm.executorUsername" @change2="editSomeFields(editForm,'executorUserid',$event)"/>
								</el-form-item>
								</el-col> 
							<el-col :span="8">
								<el-form-item> 
 									<mdp-select  show-style="x"   :label="editForm.ntype=='0'?'任务状态':'计划状态'" itemCode="taskState" v-model="editForm.taskState" @change="editSomeFields(editForm,'taskState',$event)"/>
								</el-form-item>
								</el-col>
							<el-col :span="8">
								<el-form-item> 
								<mdp-field show-style="x"  v-model="editForm.rate" label="进度">
									<template #value ><el-progress   :percentage="editForm.rate?editForm.rate:0" /></template>
									<template  #oper><el-button @click="activateTabPaneName='5'" type="primary">去填写工时</el-button></template>
								</mdp-field>
							</el-form-item>
							</el-col>


							<el-col :span="8">
								<el-form-item>
										<mdp-date-range show-style="x" 
											v-model="editForm"
											start-key="startTime"
											end-key="endTime"
											@change="onBudgetDateRangerChange"
											type="daterange"
											
											unlink-panels
											range-separator="-"
											start-placeholder="开始日期"
											end-placeholder="完成日期"
											value-format="YYYY-MM-DD HH:mm:ss"
											:default-time="['00:00:00','23:59:59']"
											:picker-options="pickerOptions"
										 />
										</el-form-item>
							</el-col>


						</el-row>
					<el-tabs v-model="activateTabPaneName" >

						<el-tab-pane label="详情" name="2">
							<el-form-item   prop="description" label-width="0px">
								<el-text type="warning">可以从需求文档复制文字、表格等进行黏贴、复制图片黏贴(1张一次),如关联了故事，建议不要重复描述故事内容</el-text>
 								<vue-editor :editorConfig="{minHeight:'450px',scroll:true,placeholder:'什么人？做什么事？，为什么？如： 作为招聘专员，我需要统计员工半年在职/离职人数，以便我能够制定招聘计划'}"  :key="'description_' + editForm?.id" v-model="editForm.description"
								 :editorId="'description_' + editForm?.id" :branch-id="userInfo.branchId" /> 
								
								<div class="footer">
									<el-button @click="handleCancel">取消</el-button>
									<el-button v-loading="load.edit" v-if="editForm.description !== dataBak.description" type="primary"
										@click="editSomeFields(editForm, 'description', editForm.description)"
										:disabled="load.edit == true">保存</el-button>
								</div>
							</el-form-item> 
						</el-tab-pane>
						<el-tab-pane label="基础信息" name="1">
						<el-row>
							<el-col :span="10">
								<el-form-item  label="" prop="milestone">
									<el-checkbox v-model="editForm.milestone" true-label="1" false-label="0" @change="editSomeFields(editForm,'milestone',$event)">里程碑</el-checkbox>
								</el-form-item>
							</el-col>
							<el-col :span="14">
								<el-form-item prop="skill" label=""  v-if="editForm.ntype!='1'"  label-width="0">
									<el-tag class="fs-ft" style="margin-right:10px" v-for="(item,i) in taskSkills" :key="i">{{item.taskSkillName}}</el-tag>
									<el-button   type="text" @click.stop="showSkill()" icon="plus">技能要求</el-button>
								</el-form-item>
							</el-col>
						</el-row>
						<el-row>

							<el-col :span="12"  prop="bizFlowState">
								<el-form-item label="审核状态">
								<mdp-select itemCode="bizFlowState" v-model=" editForm.bizFlowState" :disabled="true"/>
								</el-form-item>
							</el-col>
							<el-col :span="12">
								<el-form-item label="排序序号" prop="sortLevel" >
									<el-input  v-model="editForm.sortLevel" style="max-width:90%;" @change="editSomeFields(editForm,'sortLevel',$event)"  placeholder="如1.0或者1.2.3等" title="序号，如1.0、1.1.1或者1，2，3等" />
								</el-form-item>
							</el-col>
							<el-col :span="12">
								<el-form-item  label="优先级别" prop="level">
									<mdp-select itemCode="priority" v-model="editForm.level" @change="editSomeFields(editForm,'level',$event)"/>
								</el-form-item>
							</el-col>
							<el-col :span="12"  prop="planType">
								<el-form-item label="工期类型">
								<mdp-select itemCode="planType" v-model=" editForm.planType" @change="editSomeFields(editForm,'planType',$event)"/>
								</el-form-item>
							</el-col>
						</el-row>

						<el-row>
							<el-col :span="12">
								<el-form-item :label="editForm.ntype=='0'?'任务前置':'计划前置'">
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
								<el-form-item  :label="editForm.ntype=='0'?'任务类型':'计划类型'" prop="taskType">
									<mdp-select itemCode="taskType" v-model="editForm.taskType" @change="editSomeFields(editForm,'taskType',$event)"/>
								</el-form-item>
							</el-col>
						</el-row>
					</el-tab-pane>

					<el-tab-pane label="需求" name="3" v-if="editForm.ntype!='1'">

						<el-row>
							<el-col :span="12">
								<el-form-item  label="归属产品" prop="productId">
									 {{editForm.productId}}
								</el-form-item>
							</el-col>
							<el-col :span="12">
								<el-form-item  label="用户故事" prop="menuId" id="menuInfo" v-if="editForm.ntype!='1'">
									{{editForm.menuName?editForm.menuName:(editForm.menuId?editForm.menuId:'')}} &nbsp;&nbsp;&nbsp; <el-link  @click="menuVisible=true" type="primary">{{editForm.menuName?'更改':'设置'}}</el-link>&nbsp;&nbsp;&nbsp;
									<el-link v-if="editForm.menuId" @click="toMenu" type="primary">查看需求</el-link>
								</el-form-item>
							</el-col>
						</el-row>
					</el-tab-pane>

					<el-tab-pane :label="'工时( '+(editForm.actWorkload?editForm.actWorkload:0)+' / '+(editForm.budgetWorkload?editForm.budgetWorkload:0)+' h )'" name="5">
						 <xm-workload-record v-if="activateTabPaneName=='5'" biz-type="1" :xm-task="editForm"  @editFields="(p)=>{Object.assign(editForm,p);$emit('edit-fields',p)}"/>
					</el-tab-pane>
					<el-tab-pane label="预算金额" name="6">
						<el-form-item label="自研工时单价" prop="uniInnerPrice">
							 <el-input type="number"  clearable   v-model="editForm.uniInnerPrice" :precision="2" :step="10" :min="0" placeholder="自研工时单价" @change="editSomeFields(editForm,'uniInnerPrice',$event)">   
								<template #suffix>
									元/h
									</template>
								</el-input>

						</el-form-item>
						<el-form-item label="外包、众包单价" prop="uniOutPrice">
								 <el-input type="number"     v-model="editForm.uniOutPrice" :precision="2" :step="10" :min="0" placeholder="外发工时单价" @change="editSomeFields(editForm,'uniOutPrice',$event)">
								 <template #suffix>
									元/h
									</template>
								</el-input>
						</el-form-item>
						<el-form-item label="预估金额" prop="budgetAt">
						 	<el-input type="number"    v-model="editForm.budgetAt" :precision="2" :step="100" :min="0" placeholder="预算金额" @change="editSomeFields(editForm,'budgetAt',$event)">  
							 <template #suffix>
									元
									</template>
								</el-input>
							</el-form-item>

					</el-tab-pane>
					<el-tab-pane :label="'子计划('+(editForm.subPlanCnt||0)+')'" name="45" v-if="editForm.ntype==='1'">
							 <XmTaskBox subOpType="mng" v-if="activateTabPaneName=='45'" :parent-task="editForm"   @add-submit="onAddSubTask" queryScope="plan"/>
					</el-tab-pane>
					<el-tab-pane :label="'子任务('+ (editForm.subTaskCnt||0) +')'" name="46" v-if="editForm.ntype==='1'">
							 <XmTaskBox subOpType="mng" v-if="activateTabPaneName=='46'" :parent-task="editForm" @add-submit="onAddSubTask" queryScope="task"/>
					</el-tab-pane>
					<el-tab-pane label="缺陷" name="41" v-if="editForm.ntype!='1'">
						<xm-question-list subOpType="mng" v-if="activateTabPaneName=='41'" :xm-product="editForm.productId?{id:editForm.productId,productName:editForm.productName}:null" :xm-menu="editForm.menuId?{menuId:editForm.menuId,menuName:editForm.menuName}:null" :xmTask="editForm" :sel-project="xmProject||{id:editForm.projectId,name:editForm.projectName}" />
					</el-tab-pane>

					<el-tab-pane label="执行人" name="42" v-if="editForm.ntype!='1'">
						<xm-task-execuser-for-task v-if="activateTabPaneName=='42'" :xm-task="editForm" @after-add-submit="afterAddExecSubmit" @after-edit-submit="afterEditExecSubmit" @after-delete-submit="afterEditExecSubmit" />
					</el-tab-pane>
					<el-tab-pane label="结算信息" name="7" v-if="editForm.ntype!='1'">
						<el-form-item label="" prop="taskClass">
							<el-checkbox v-model="editForm.taskClass" true-label="1" false-label="0"  @change="editSomeFields(editForm,'taskClass',$event)">是否需要结算</el-checkbox>
						</el-form-item>
						<el-form-item v-if="editForm.taskClass=='1'" label="结算方案" prop="settlSchemel">
							<mdp-select itemCode="xmTaskSettleSchemel" v-model=" editForm.settleSchemel"  @change="editSomeFields(editForm,'settleSchemel',$event)"/>
						</el-form-item>
					</el-tab-pane>
					<el-tab-pane label="众包、互联网访问" name="8" v-if="editForm.ntype!='1'">

						<p v-if="!toPayEfundsVisible &&  activateTabPaneName=='8'">
					 	<el-form-item>
							 <el-checkbox v-model="editForm.taskOut" true-label="1" false-label="0" id="taskOut" @change="editSomeFields(editForm,'taskOut',$event)">外购</el-checkbox>

							 <el-checkbox v-model="editForm.crowd"  v-if="editForm.taskOut==='1'" true-label="1" false-label="0" id="crowd" @change="editSomeFields(editForm,'crowd',$event)">开通众包</el-checkbox>

							<el-checkbox v-model="editForm.toTaskCenter" v-if="editForm.taskOut==='1'" true-label="1" false-label="0" id="toTaskCenter" @change="editSomeFields(editForm,'toTaskCenter',$event)">发布到互联网任务大厅</el-checkbox>
						</el-form-item>
						<el-row>
							<el-col :span="12">
								<el-form-item label="交易模式" prop="tranMode"  v-if="editForm.crowd==='1'">
									<mdp-select itemCode="tranMode" v-model="editForm.tranMode" @change="editSomeFields(editForm,'tranMode',$event)"/>
								</el-form-item>
							</el-col>
							<el-col :span="12">
								<el-form-item label="最低能力等级" prop="capaLvls"  v-if="editForm.crowd==='1'">
									<mdp-select itemCode="capaLvl" v-model="editForm.capaLvls" @change="editSomeFields(editForm,'capaLvls',$event)"/>
								</el-form-item>
							</el-col>
						</el-row>
						<el-row>
							<el-col :span="12">
								<el-form-item label="服务保障" prop="supRequires"  v-if="editForm.crowd==='1'">
									<mdp-select itemCode="supRequire" v-model="supRequires" @change="editSomeFields(editForm,'supRequires',$event)" multiple/>
								</el-form-item>
							</el-col>
							<el-col :span="12">
								<el-form-item label="最低会员等级" prop="interestLvls"  v-if="editForm.crowd==='1'">
									<mdp-select itemCode="memInterestLvl" v-model="editForm.interestLvls" @change="editSomeFields(editForm,'interestLvls',$event)"/>
								</el-form-item>
							</el-col>

						</el-row>
						<el-row>
							<el-col :span="12">
								<el-form-item label="地区限制" prop="regionType"  v-if="editForm.crowd==='1'">
									<mdp-select itemCode="regionType" v-model="editForm.regionType" @change="editSomeFields(editForm,'regionType',$event)" />
								</el-form-item>
							</el-col>
							<el-col :span="12">
								<el-form-item label="城市名称" prop="cityName"  v-if="editForm.crowd==='1'">

									 <v-region :value="{province:editForm.provinceId,city:editForm.cityId,area:editForm.areaId,town:''}" @change="editSomeFields(editForm,'cityId',$event)" />
								</el-form-item>
							</el-col>

						</el-row>

						<el-row v-if="editForm.crowd==='1'">
							<el-col :span="18">
								<el-row>
									<el-col :span="6">
										<el-form-item label="托管资金" prop="estate"  v-if="editForm.taskOut==='1'">
											<mdp-select itemCode="estate" v-model="editForm.estate" show-style="tag" :disabled="true"/>
 											<span v-if="editForm.efunds>0 && (editForm.estate=='2'||editForm.estate=='3')">{{editForm.efunds}}元</span>
										</el-form-item>
									</el-col>
									<el-col :span="6">
										<el-form-item label="预算佣金" prop="budgetAt" v-if="editForm.taskOut==='1'">
											 {{editForm.budgetAt}}元
										</el-form-item>
									</el-col>
									<el-col :span="6">
										<el-form-item label="中标人总价" prop="quoteFinalAt" v-if="editForm.taskOut==='1'">
											 {{editForm.quoteFinalAt}}元
										</el-form-item>
									</el-col>
								</el-row>
							</el-col>
							<el-col :span="6" v-if="editForm.bidStep=='4'">
								<strong> 合计待付款￥:</strong>&nbsp;&nbsp;<font style="font-size:48px;color:red;"> {{needPayEfundsAt}}&nbsp;</font>元
								 <br/>
								 <el-button class="padding" @click="toPayEfundsVisible=true" type="primary">去付款</el-button>
							</el-col>
						</el-row>
						</p>
						 <to-pay v-else-if="toPayEfundsVisible &&  activateTabPaneName=='8'" :biz-type="'1'" :task-id="editForm.id" :visible="toPayEfundsVisible" @cancel="toPayEfundsVisible=false" @pay-success="onTaskPaySuccess" />
					</el-tab-pane>

					<el-tab-pane label="营销推广" name="82" v-if="editForm.ntype!='1'">
						<el-row>
							<el-col :span="6">
								<el-form-item label="浏览人次" prop="browseUsers">
									 {{editForm.browseUsers}}
								</el-form-item>
							</el-col>
							<el-col :span="6">
								 <el-form-item label="浏览数" prop="browseTimes">
									 {{editForm.browseTimes}}
								</el-form-item>
							</el-col>
							<el-col :span="6">
								 <el-form-item label="候选人数" prop="execUsers">
									 {{editForm.execUsers}}
								</el-form-item>
							</el-col>
						</el-row>
						<p v-if="!toPayMarketVisible &&  activateTabPaneName=='82'">

						<el-row v-if="editForm.crowd==='1'">
							<el-col :span="18">
								<el-row>
									<el-col :span="6">
										<el-form-item label="分享赚" prop="oshare"  v-if="editForm.taskOut==='1'">
											<el-checkbox v-model="editForm.oshare" v-if="editForm.oshare!='2'" true-label="1" false-label="0" id="oshare" @change="editSomeFields(editForm,'oshare',$event)">分享赚</el-checkbox>
 
 										</el-form-item>
									</el-col>
									<el-col :span="18">
										<el-form-item label="分享佣金" prop="shareFee" v-if="editForm.oshare==='1' && editForm.taskOut==='1'">
											<el-input type="number" style="width:100px;"    v-model="editForm.shareFee" :precision="2" :step="2" :min="0" placeholder="分享赚佣金" @change="editSomeFields(editForm,'shareFee',$event)"/>   元
											<font color="blue">一般建议为任务佣金的1%-5%</font>
										</el-form-item>
									</el-col>
								</el-row>
								<el-row>
									<el-col :span="6">
										<el-form-item label="热门" prop="hot"  v-if="editForm.taskOut==='1'">
										 	<el-checkbox v-model="editForm.hot" v-if="editForm.hot!='2'" true-label="1" false-label="0" id="hot" @change="editSomeFields(editForm,'hot',$event)">热门</el-checkbox>
 										</el-form-item>	
									</el-col>	 
									<el-col :span="18">
										<el-form-item label="热门费用" prop="hotFee" v-if="editForm.hot==='1' && editForm.taskOut==='1'">
											 {{needPayMarketAt.hotFee}}&nbsp;元
										</el-form-item>
									</el-col>
								</el-row>
								<el-row>
									<el-col :span="6">
										<el-form-item label="置顶" prop="top"  v-if="editForm.taskOut==='1'">
											<el-checkbox v-model="editForm.top" v-if="editForm.top!='2'" true-label="1" false-label="0" id="hot" @change="editSomeFields(editForm,'top',$event)">置顶</el-checkbox>
 										</el-form-item>
									</el-col>
									<el-col :span="18">
										<el-form-item label="置顶费用" prop="topFee" v-if="editForm.top==='1' && editForm.taskOut==='1'">
											 {{needPayMarketAt.topFee}}&nbsp;元
										</el-form-item>
									</el-col>
								</el-row>
								<el-row>
									<el-col :span="6">
										<el-form-item label="加急" prop="urgent"  v-if="editForm.taskOut==='1'">
											<el-checkbox v-model="editForm.urgent" v-if="editForm.urgent!='2'" true-label="1" false-label="0" id="urgent" @change="editSomeFields(editForm,'urgent',$event)">加急</el-checkbox>
 
										</el-form-item>
									</el-col>
									<el-col :span="18">
										<el-form-item label="加急费用" prop="urgentFee" v-if="editForm.urgent==='1' && editForm.taskOut==='1'">
											 {{needPayMarketAt.urgentFee}}&nbsp;元
										</el-form-item>
									</el-col>
								</el-row>
								<el-row>
									<el-col :span="6">
										<el-form-item label="客服包办" prop="crmSup"  v-if="editForm.taskOut==='1'">
											<el-checkbox v-model="editForm.crmSup" v-if="editForm.crmSup!='2'" true-label="1" false-label="0" id="hot" @change="editSomeFields(editForm,'crmSup',$event)">客服包办</el-checkbox>
 
										</el-form-item>
									</el-col>
									<el-col :span="18">
										<el-form-item label="客服包办费用" prop="crmSupFee" v-if="editForm.crmSup==='1' && editForm.taskOut==='1'">
											 {{needPayMarketAt.crmSupFee}}&nbsp;元
										</el-form-item>
									</el-col>
								</el-row>
							</el-col>
							<el-col :span="6" v-if="needPayMarketAt.total>0">
								<strong> 合计待付款￥:</strong>&nbsp;&nbsp;<font style="font-size:48px;color:red;"> {{needPayMarketAt.total}}&nbsp;</font>元
								 <br/>
								 <el-button class="padding" @click="toPayMarketVisible=true" type="primary">去付款</el-button>
							</el-col>
						</el-row>
						</p>
						 <to-pay v-else-if=" toPayMarketVisible &&  activateTabPaneName=='82'" :task-id="editForm.id" :visible="toPayMarketVisible" :biz-type="'2'" @cancel="toPayMarketVisible=false" @pay-success="onTaskPaySuccess" />
					</el-tab-pane>
					<el-tab-pane label="关注" name="91">
						<MdpFocus v-if="activateTabPaneName=='91'" :biz-id="editForm.id" :pbiz-id="editForm.projectId" :biz-name="editForm.name" focus-type="2" />
					</el-tab-pane>
					<el-tab-pane label="日志" name="9">
						 <xm-record v-if="activateTabPaneName=='9'" :project-id="editForm.projectId" :biz-id="editForm.id" :obj-type="'2'" />
					</el-tab-pane>
					
					<el-tab-pane
						label="当前审批流"
						name="currFlow" 
					> 
					<task-mng v-if="activateTabPaneName === 'currFlow' " ref="currFlow" :pbiz-id="xmProjectCpd.id" :biz-id="editForm.id" @submit="afterFlowSubmit" />  

					</el-tab-pane>
					<el-tab-pane
						label="历史审批流"
						name="hisFlow" 
					> 
					<procinst-mng v-if="activateTabPaneName === 'hisFlow' " ref="hisFlow" isAll="true" :pbiz-id="xmProjectCpd.id" :biz-id="editForm.id" />  
					</el-tab-pane> 
				</el-tabs>
			</el-form>
			</el-col>
		</el-row>

 
		<mdp-dialog append-to-body title="新增技能"  v-model="skillVisible" width="60%"    :close-on-click-modal="false">
			<skill-mng v-if="skillVisible" :task-skills="taskSkills" :jump="true" @select-confirm="onTaskSkillsSelected" />
		</mdp-dialog>

		<mdp-dialog ref="menuSelectDlg" append-to-body title="需求选择"  v-model="menuVisible" width="90%"   :close-on-click-modal="false">
			<xm-menu-box subOpType="select" v-if="menuVisible" @select="onMenuSelected" :xm-product="xmProductCpd" :sel-project="xmProjectCpd" :xm-iteration="xmIteration" />
		</mdp-dialog>  

		<mdp-dialog ref="menuDlg" append-to-body title="需求明细" fullscreen :close-on-click-modal="false">
			<xm-menu-detail  :reload="true" :formData="{menuId:editForm.menuId,menuName:editForm.menuName}"  />
		</mdp-dialog>

		<mdp-dialog ref="parentDlg" title="选择新的上级计划" append-to-body width="60%">
		<XmPhase subOpType="select" showConfirm showCheckbox :sel-project="xmProjectCpd"   @select="onSelectedParentTask" />
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
		<mdp-dialog ref="preplanDlg" title="选择新的前置计划" append-to-body width="60%">
			<XmPhase subOpType="select" :multiple="true" showConfirm showCheckbox :sel-project="xmProjectCpd"   @select="onPreplanSelect" />
		</mdp-dialog>
		
		<mdp-dialog ref="pretaskDlg" title="选中前置任务"   width="90%"  append-to-body   :close-on-click-modal="false">
			<XmTaskBox  :xm-product="product" :sel-project="xmProjectCpd"   @select="onPretaskSelect" subOpType="select" :multiple="true"/>
		</mdp-dialog> 
</template>

<script>

	import util from '@/components/mdp-ui/js/util';//全局公共库
	import {editXmTask,setTaskCreateUser,editXmTaskSomeFields,batchChangeParentTask,listXmTask } from '@/api/xm/core/xmTask';
	import {addXmRecordVisit } from '@/api/xm/core/xmRecordVisit';
	import { mapState } from 'pinia'
import { useUserStore } from '@/store/modules/user';
 	import {sn} from '@/components/mdp-ui/js/sequence';  
	import XmRecord from '../xmRecord/XmRecord.vue'   
	import ToPay from "../xmTaskOrder/ToPay.vue";
	import { RegionGroup  } from 'v-region'
	import clipboard3 from 'vue-clipboard3'
	const { toClipboard } = clipboard3(); 
import { Editor as VueEditor } from '@/components/Editor'
import { defineAsyncComponent } from 'vue';
import { MdpFormMixin } from '@/components/mdp-ui/mixin/MdpFormMixin';
	export default {
		mixins:[MdpFormMixin],
		name:'XmTaskEdit',
		computed: {
			...mapState(useUserStore,[
				'userInfo','roles'
			]),
			calcTaskStep(){
				if(  this.editForm.crowd=='1' && this.editForm.taskOut=='1'){
					return this.dicts['bidStep'].findIndex(i=>i.id==this.editForm.bidStep)+1;
				}else{
					return this.dicts['taskState'].findIndex(i=>i.id==this.editForm.taskState)+1;
				}

			},
			needPayEfundsAt(){
				var toPayAt=0;
				if((this.editForm.estate=='1'||this.editForm.estate=='0'||this.editForm.estate=='') && this.editForm.crowd==='1' && this.editForm.bidStep<='4'){
					toPayAt=toPayAt+parseFloat(this.editForm.efunds||this.editForm.quoteFinalAt||this.editForm.budgetAt)
				}
				return toPayAt;
			},

			needPayMarketAt(){

				var toPayAtObj={total:0,topFee:0,hotFee:0,urgentFee:0,crmSup:0,shareFee:0}
				var toPayAt=0;
				var extInfos=this.doInitMarket(this.dicts.crowd_task_market)
				Object.assign(toPayAtObj,extInfos)
				if(this.editForm.oshare=='1'){
					toPayAt=toPayAt+parseFloat(this.editForm.shareFee||0)
				}
				if(this.editForm.top=='1'){
					toPayAt=toPayAt+parseFloat(extInfos.topFee||0)
				}
				if(this.editForm.hot=='1'){
					toPayAt=toPayAt+parseFloat(extInfos.hotFee||0)
				}
				if(this.editForm.urgent=='1'){
					toPayAt=toPayAt+parseFloat(extInfos.urgentFee||0)
				}
				if(this.editForm.crmSup=='1'){
					toPayAt=toPayAt+parseFloat(extInfos.crmSupFee||0)
				}
				toPayAtObj.total=toPayAt;
				return toPayAtObj;
			}, 
			xmProjectCpd(){
				if(this.xmProject && this.xmProject.id){
					return this.xmProject
				}
				if(this.formData.projectId){
					return {id:this.formData.projectId,name:this.formData.projectName}
				}
				return null;
			},

			xmProductCpd(){
				if(this.formData && this.formData.id && this.formData.productId){
					return {id:this.formData.productId,productName:this.formData.productName}
				}
				if(this.xmIteration && this.xmIteration.id){
					return {id:this.xmIteration.productId,productName:this.xmIteration.productName}
				}
				return null;
			}

		},
		props:['formData','visible','xmProject','xmIteration'], 
		data() { 
			return {
				currOpType:'edit',
				pkNames:['id'],
				dicts:{
					priority:[],
					taskType:[],
					planType:[],
					priority:[],
					xmTaskSettleSchemel:[],
					bidStep:[],
					marketState:[],
					crowd_task_market:{},
					taskState:[],
				},//下拉选择框的所有静态数据  params=[{categoryId:'0001',itemCode:'sex'}] 返回结果 {'sex':[{optionValue:'1',optionName:'男',seqOrder:'1',fp:'',isDefault:'0'},{optionValue:'2',optionName:'女',seqOrder:'2',fp:'',isDefault:'0'}]}
				load:{ list: false, edit: false, del: false, add: false },//查询中...
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
				//新增界面数据 xm_task

				editForm: {
					id:'',name:'',parentTaskid:'',parentTaskname:'',projectId:'',projectName:'',level:'',sortLevel:'',executorUserid:'',executorUsername:'',preTaskid:'',preTaskname:'',startTime:'',endTime:'',milestone:'',description:'',remarks:'',createUserid:'',createUsername:'',createTime:'',rate:0,budgetAt:0,budgetWorkload:0,actAt:0,actWorkload:0,taskState:'0',taskType:'4',taskClass:'',toTaskCenter:'0',actStartTime:'',actEndTime:'',bizProcInstId:'',bizFlowState:'0',phaseId:'',phaseName:'',taskSkillNames:'',exeUsernames:'',taskSkillIds:'',exeUserids:'',taskOut:'0',planType:'w2',settleSchemel:'1',menuId:'',menuName:'',productId:'',cbranchId:'',cdeptid:'',tagIds:'',tagNames:'',ntype:'0',childrenCnt:0,ltime:'',pidPaths:'',lvl:'',isTpl:'',keyPath:'',uniInnerPrice:80,uniOutPrice:100,calcType:'',ptype:'',wtype:'',bctrl:'',initWorkload:'',shareFee:'',oshare:'',crowd:'',browseUsers:'',execUsers:'',cityId:'',cityName:'',regionType:'',browseTimes:'',capaLvls:'',tranMode:'',supRequires:'',hot:'0',top:'0',urgent:'0',crmSup:'0',bidStep:'0',interestLvls:'',filePaths:'',estate:'0',efunds:0,etoPlatTime:'',etoDevTime:'',ebackTime:'',topStime:'',topEtime:'',hotStime:'',hotEtime:'',urgentStime:'',urgentEtime:'',urgentFee:0,topFee:0,hotFee:0
				},
				/**begin 在下面加自定义属性,记得补上面的一个逗号**/
 				menuVisible:false,
				menuDetailVisible:false,
				skillVisible: false,
				taskSkills: [],
				selectTaskVisible:false, 
				tagSelectVisible:false, 
				subPlanNum:0,
				activateTabPaneName:'2',
				selectParentPlanVisible:false,
				supRequires:[],
				toPayEfundsVisible:false,
				toPayMarketVisible:false, 
				apis:{ 
					edit: editXmTask,
					editSomeFields: editXmTaskSomeFields
				}
				 /**end 在上面加自定义属性**/
			}//end return
		},//end data
		methods: {  
			initCurrData(){ 
					this.setSkills()
					this.activateTabPaneName="2"
					this.supRequires=this.editForm.supRequires?this.editForm.supRequires.split(","):[]
					this.doAddXmRecordVisit() 
			},
			doInitMarket(data){
				if(!data){
					return {};
				}
				var extInfos={};
				if(data.extInfos){
					var ext=JSON.parse(data.extInfos)
					ext.forEach(k=>{
						extInfos[k.id]=k.value
					})

				}
				return extInfos;
			},
			formatDate: function(time) {
				const date = new Date(time);
				const m = date.getMonth()+1;
				const d = date.getDate();
				return date.getFullYear()+"-"+(m < 10 ? "0"+m : m)+"-"+ (d < 10 ? "0"+d : d) + " 00:00:00";
			},
			/**begin 在下面加自定义方法,记得补上面的一个逗号**/


			showSkill(){
				this.skillVisible = true;
			},
			onMenuSelected:function(menu){
				this.editForm.menuId=menu.menuId
				this.editForm.menuName=menu.menuName
				this.editForm.productId=menu.productId
				this.editForm.productName=menu.productName
				this.editSomeFields(this.editForm,'menuId',menu);
				this.menuVisible=false;
			},
			onTaskSkillsSelected(skills) {
				let taskSkill = [];
				skills.forEach(i=>{
					let obj = {
						taskId: this.editForm.id,
						taskSkillId: i.skillId,
						taskSkillName: i.skillName,
						skillRemarks: '',
					};
					taskSkill.push(obj);
				});
				this.taskSkills = taskSkill;
				batchAddSkill(taskSkill).then((res) => {
					this.load.add=false
					var tips=res.tips;
					if(tips.isOk){
						this.skillVisible = false;
						this.editForm.taskSkillIds = skills.map(s=>s.skillId).join(",")
						this.editForm.taskSkillNames = skills.map(s=>s.skillName).join(",")
						this.editFormBak={...this.editForm}
					}
					this.$notify({position:'bottom-left',showClose:true,message: tips.msg, type: tips.isOk?'success':'error' });
				}).catch( err  => this.load.add=false);
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
			toFixed(floatValue){
				if(floatValue ==null || floatValue=='' || floatValue == undefined){
					return 0;
				}else{
					return parseFloat(floatValue).toFixed(2);
				}
			},

			onBudgetDateRangerChange(){
				this.editSomeFields(this.editForm,'dateRange',{startTime:this.editForm.startTime,endTime:this.editForm.endTime});
			},
			onSelectedTask(tasks){
				this.selectTaskVisible=false;
				if(tasks && tasks.length>3){
					this.$message.error("最多只能选3个前置") 
					return
				}else{
					if(tasks.some(k=>k.id==this.editForm.id)){
						this.$message.error("不能自己依赖自己") 
						return;
					}
					this.editSomeFields(this.editForm,'preTaskid',tasks.map(k=>k.id).join(","));
				}
			},
			clearPreTask(){
					this.editForm.preTaskid='' 
					this.editSomeFields(this.editForm,'preTaskid','')
			},
			goAnchor :function(id){
       			document.querySelector("#"+id).scrollIntoView(true);
    		},
			setSkills(){
				if(this.editForm.taskSkillIds && this.editForm.taskSkillNames){
					var skillNames=this.editForm.taskSkillNames.split(",");
					this.taskSkills=this.editForm.taskSkillIds.split(",").map((item,index)=>{
						return {
							taskId:this.editForm.id,
							taskSkillId:item,
							taskSkillName:skillNames[index]
						}
					})
				}
			},
			/**end 在上面加自定义方法**/

			toMenu(){
				this.$refs['menuDlg'].open()
			},

			afterAddExecSubmit(execForm){

				this.$emit("after-add-submit",execForm);
			},
			afterEditExecSubmit(execForm){

				listXmTask({id:this.editForm.id}).then(res=>{
						Object.assign(this.editForm,res.data[0])
						this.editFormBak={...this.editForm}
						this.$emit("after-edit-submit",execForm);
					})

			},
			onTagSelected(tags) {
				this.tagSelectVisible = false;
				if(tags && tags.length>0){
					this.editForm.tagIds=tags.map(i=>i.tagId).join(",")
					this.editForm.tagNames=tags.map(i=>i.tagName).join(",")
				}else{
					this.editForm.tagIds=""
					this.editForm.tagNames=""
				}

				this.editSomeFields(this.editForm,'tagIds',tags );
			},
			onAddSubTask(val){

			},

			editSomeFieldsCheck(row,fieldName,$event,params){  
				if(fieldName==='menuId'){
					if($event){
						params[fieldName]=$event.menuId;
						params.menuName=$event.menuName
            			params.productId=$event.productId
					}else{
						return;
					}
				}else if(fieldName==='tagIds'){
					if($event){
						params[fieldName]=$event.map(i=>i.tagId).join(",");
						params.tagNames=$event.map(i=>i.tagName).join(",");
					}else{
						params[fieldName]=' ';
						params.tagNames=' ';
					}
				}else if(fieldName==='workload'){
					params={...params,...$event}
				}else if(fieldName==='executorUserid'){
					params.executorUserid=$event.userid
					params.executorUsername=$event.username
				}else if(fieldName==='createUserid'){
					params.createUserid=$event.userid
					params.createUsername=$event.username
				}else if(fieldName==='dateRange'){
					params.startTime=$event.startTime
					params.endTime=$event.endTime
				}else if(fieldName==='shareFee'){
					params.shareFee=$event
				}else if(fieldName==='supRequires'){
					params.supRequires=$event.join(",")
				}else if(fieldName==='preTaskid'){
					params.preTaskid=$event
				}else if(fieldName==='cityId'){
					if($event.area){
						params.provinceId=$event.province.key
						params.provinceName=$event.province.value
						params.cityId=$event.city.key
						params.cityName=$event.city.value
						params.areaId=$event.area.key
						params.areaName=$event.area.value
					}else if($event.city){
						params.provinceId=$event.province.key
						params.provinceName=$event.province.value
						params.cityId=$event.city.key
						params.cityName=$event.city.value
						params.areaId='-'
						params.areaName='-'
					}else if($event.province){
						params.provinceId=$event.province.key
						params.provinceName=$event.province.value
						params.cityId='-'
						params.cityName='-'
						params.areaId='-'
						params.areaName='-'
					}else{
						 return;
					}


				}else{
					params[fieldName]=$event
				}


				if(fieldName=='description'){
					this.$refs.editForm.validateField('description',err=>{
						if(!err){
							this.$notify({position:'bottom-left',showClose:true,message: "表单验证不通过",type: 'error'})
							return;
						} 
					})
				}
				if(fieldName=='name'){
					this.$refs.editForm.validateField('name',err=>{
						if(!err){
							this.$notify({position:'bottom-left',showClose:true,message: "表单验证不通过",type: 'error'})
							return;
						}
					})
				}
				return true
			},
			onSelectedParentTask(task){
				 if(task==null || !task.id){
					this.$notify({position:'bottom-left',showClose:true,message:"请选择上级计划/任务",type:'warning'})
					return;
				}

				var params=[{id:this.editForm.id,parentTaskid:task.id}]
				this.$confirm("确认更新任务的上级为【"+task.name+"】吗?", "提示", {
					type: "warning",
				}).then(() => {
					batchChangeParentTask(params).then(res=>{
					var tips = res.tips;
					if(tips.isOk){
						this.editForm.parentTaskid=task.id
						this.editForm.parentTaskname=task.name
						this.dataBak=Object.assign({},this.editForm)
						this.$emit('edit-fields',this.editForm)
						this.$refs['parentDlg'].close()

					}
					this.$notify({
						showClose: true,
						message: tips.msg,
						type: tips.isOk ? "success" : "error",
					});
					});
				})
			},
			doAddXmRecordVisit(){
				addXmRecordVisit({bizId:this.editForm.id,objType:'2',pbizId:this.editForm.projectId})
			},
			onTaskPaySuccess(orderId){
				listXmTask({ids:[this.editForm.id]}).then(res=>{
					Object.assign(this.editForm,res.data[0])
					this.dataBak={...this.editForm}
					this.$emit("pay-success",this.editForm)
					this.toPayEfundsVisible=false;
					this.toPayMarketVisible=false;
				})

			},
			getRateColor(rate){
				return "#F56C6C"
			},

			copyLink(){ 
			var curlDomain=window.location.protocol+"//"+window.location.host; //  
			var uris=[]
			uris.push(curlDomain)
			uris.push(import.meta.env.VITE_CONTEXT)
			if(import.meta.env.VITE_UI_VERSION){
					uris.push(import.meta.env.VITE_UI_VERSION)
			}
			var link = uris.join("/") + "/#/xm/project/task/detail?id=" + this.editForm.id
			toClipboard(link).then(e => {
				this.$notify({ position: 'bottom-left', showClose: true, message: "拷贝链接成功，您可以黏贴到任何地方", type: 'success' })
			});
			},
			
			sendToProcessApprova:function(row,bizKey){
				// 传过来的参数格式
				if(row.bizFlowState=='1'){
					this.$notify.error("审核中，不允许重复发审");
					return;
				} 
				let extVars={projectId:row.id}
				let jsonExtVars=JSON.stringify(extVars);

				var currDomain=window.location.protocol+"//"+window.location.host;
				var fullPath=this.$route.fullPath;
				var bizUrl=currDomain+"/"+this.$mdp.getXmCtx()+"/"+process.env.VERSION+'/#/xm/core/task/detail?id='+row.id

				let params={
					bizKey:bizKey,
					bizUrl:bizUrl,
					resUrl:'',
					bizId:row.id,
					bizPid:row.projectId,
					mainContext:'',
					extVars:extVars,
					flowVars:{
						subscribeTaskEvent:'TASK_COMPLETED,TASK_CREATED',
						data:{
							id:row.id,
							branchId:row.pbranchId
						}
					},
				}

				if(bizKey=="xm_task_approva"){
					//延期审核
					params.mainTitle='关于项目计划【'+row.name+"】的审核申请";
					params.mainContext='项目编号：'+this.xmProjectCpd.id+','+'项目名称：'+this.xmProjectCpd.name+',计划/任务：'+row.name;
					params.restUrl="/"+this.$mdp.getXmCtx()+"/xm/core/xmTask/processApprova";
					params.flowVars.data=row
					//this.html2canvas(document.querySelector(".editForm"),row,params);
					this.$router.push({ name: 'bizStartProc', query: {paramsId:this.$mdp.setCacheParams(params)} });
				} else {
					this.$notify.error("不支持的审批事项");
					return;
				}
			},
			onPreplanSelect(tasks){ 
				if(tasks && tasks.length>3){
					this.$message.error('最多选3个前置计划')
					return;
				}
				
				if(tasks.some(k=>k.id==this.editForm.id)){
						this.$message.error("不能自己依赖自己") 
						return;
					}
				this.editSomeFields(this.editForm,'preTaskid',tasks.map(k=>k.id).join(","))
				this.$refs['preplanDlg'].close()
			},
			
			onPretaskSelect(tasks){ 
				if(tasks && tasks.length>3){
					this.$message.error('最多选3个前置任务')
					return;
				}
				
				if(tasks.some(k=>k.id==this.editForm.id)){
						this.$message.error("不能自己依赖自己") 
						return;
					}
				this.editSomeFields(this.editForm,'preTaskid',tasks.map(k=>k.id).join(","))
				this.$refs['pretaskDlg'].close()
			},
		},//end method
		components: { 
 			'TaskMng':defineAsyncComponent(()=>import("@/views/mdp/workflow/ru/task/TaskListAssigneeToMe.vue")),
			'ProcinstMng':defineAsyncComponent(()=>import("@/views/mdp/workflow/hi/procinst/ProcinstListAll.vue")),
 			'XmWorkloadRecord':defineAsyncComponent(()=>import("../xmWorkload/XmWorkloadRecord.vue")),
			XmTaskExecuserForTask:defineAsyncComponent(()=>import( '../xmTaskExecuser/XmTaskExecuserMng.vue')),
			ToPay,
			XmRecord,
			VueEditor,
		},
		mounted() { 
			this.$mdp.getDictOptions('bidStep').then(res=>{
				this.dicts['bidStep']=res
			})
			
			this.$mdp.getDictOptions('taskState').then(res=>{
				this.dicts['taskState']=res
			})
			this.$mdp.ajaxGetDictOptions('crowd_task_market',{categoryId:'system'}).then(res=>{
				this.dicts['crowd_task_market']=res
			})
			this.$nextTick(()=>{ 

				this.editForm=Object.assign(this.editForm, this.formData); 
				this.supRequires=this.editForm.supRequires?this.editForm.supRequires.split(","):[]
				//this.setSkills();
				this.doAddXmRecordVisit() 
			})

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