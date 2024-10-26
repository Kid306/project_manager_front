<template>
	<ContentWrap>
		<template #header>
			<el-space wrap>

				<mdp-hi-query ref="hiQueryBtn"
          :column-configs="columnConfigs"
          v-model="hiQueryParams"
          @change="onHiQueryParamsChange"
        />
        <el-button icon="zoom-out" @click="searchReset()" title="重置查询条件并查询" ref="searchResetBtn"/>
  

        <mdp-export @excel="export2Excel()" ref="downloadBtn"/>
        <mdp-table-configs :column-configs="columnConfigs" v-model="checkedColumns" ref="columnConfigsBtn"/>  
				<el-button  @click="$refs['tpl'].open()" title="项目模板" icon="cellphone" plain ref="tplBtn">模板</el-button>
				<el-button   @click="guiderVisible=true" icon="help" plain>新手</el-button>
				
				<el-radio  v-model="showType" label="table" ref="tableBtn">表格</el-radio>
				<el-radio  v-model="showType" label="card" ref="cardBtn">卡片</el-radio> 
				<el-button type="success" ref="kanbanBtn" plain @click="openKanban('kanbanDlg')" title="项目看板">板</el-button>
				<el-popover style="padding-left:10px;"
					placement="top-start" :show-after="200"
					width="450"
					trigger="click" > 
					<el-space wrap>
							<el-badge value="都适用">
							<el-button   @click="showAdd" icon="plus">直接添加新项目</el-button>
							</el-badge> 
							<el-badge value="进阶">
							<el-button type="primary" icon="plus">通过【项目-复制】一键创建新的项目</el-button>
							</el-badge> 
							<el-badge value="新手">
							<el-button type="warning" @click="templateVisible=!templateVisible" icon="plus">通过【模板-复制】一键创建新的项目</el-button>
							</el-badge>
						</el-space>
					<template #reference><el-button ref="plusBtn" type="primary"   icon="plus" plain/></template>
					</el-popover>
				</el-space>
		</template>
		<el-space wrap>
			<xm-product-select v-model="filters.linkProductId"  />
			 
 
					<mdp-select width="250px" v-model="filters.queryScope" :options="[
						{id:'branchId',name:'所有项目'}, 
						{id:'compete',name:'我相关的项目'},  
						{id:'createUserid',name:'我创建的项目'},
						{id:'pmUserid',name:'我担任项目经理的项目'},
						{id:'assUserid',name:'我担任产品助理的项目'},
						{id:'admUserid',name:'我担任产品主管的项目'},
						{id:'myFocus',name:'我关注的项目'}, 
				]"   placeholder="查询范围" clear ref="queryScopeBtn" @change="onQueryScopeChange"/>
					<mdp-select placeholder="状态" itemCode="projectStatus" v-model="filters.status"/>
 



					 <el-input v-model="filters.name" style="width:10em;" placeholder="名称查询" clearable />
					 <el-button ref="searchBtn" type="primary" v-loading="load.list" :disabled="load.list==true" @click="searchTableDatas" icon="search">查询</el-button>

 		</el-space>
	</ContentWrap> 
		<el-scrollbar v-if="showType=='card'" v-adaptive v-loading="load.list">
			<el-row> 
					<el-col   v-for="(p,i) in tableDatas" :key="i" :xl="6" :lg="8" :md="8" :sm="12" :xs="24" class="project-card">

						<el-card @click="intoInfo(p,i)"  shadow="always" id="prj-view-box">
							<template  #header >
							<div  style="display:flex;justify-content: space-between;">
								<div class="project-name">
									<MdpSelect v-model="p.status" itemCode="projectStatus" :disabled="true" showStyle="tag"/>
 									{{p.name}}
								</div>
								<el-popover :show-after="200"
									placement="top-start"
									title="更多操作"
									width="300"
									trigger="hover"> 
										<el-space wrap>
										<el-button id="prj-copy-btn" type="primary"  title="通过复制快速创建新项目" @click.stop="onCopyToBtnClick(p)" v-loading="load.add">复制&nbsp;</el-button>
										<el-button v-if="queryScope=='myFocus'"  type="primary"  @click.stop="focusOrUnfocus(p)" >取消关注</el-button>
										<el-button v-else  type="primary"   @click.stop="focusOrUnfocus(p)" >关注</el-button>
										<el-button   type="danger" title="删除项目" @click.stop="handleDel(p)" v-loading="load.del">删除</el-button>
										</el-space> 

									<template #reference><el-button   icon="setting" circle plain/></template>
								</el-popover>
							</div>
						</template>
							<div class="project-info">

								<div class="info-task"  title="已完成需求数 / 总需求数 ">
									<span>
										<span class="item-total finish-task">{{menuFinishCntCalc(p)}}</span>
										<span style="margin: 0.2rem 0.25rem !important;">/</span>
										<span class="item-total total-task">{{p.menuCnt==null?0:p.menuCnt}}</span>
									</span>
									<span class="item-type">需求</span>
								</div>
								<!--
								<div class="info-task" title="已完成 / 预算工作量 ，单位人天 ">
									<span>
										<span class="item-total finish-task">{{p.actWorkload==null?0:parseInt(p.actWorkload/8)}}</span>
										<span style="margin: 0 .25rem !important;">/</span>
										<span class="item-type total-task">{{p.budgetWorkload==null?0:parseInt(p.budgetWorkload/8)}}</span>
									</span>
									<span class="item-type">工作量</span>
								</div>
								-->
								<div class="info-task"   title="已完成 / 总任务数 ">
									<span>
										<span class="item-total finish-task">{{((p.taskFinishCnt||0)+(p.taskSetCnt||0)+(p.taskCloseCnt||0))}}</span>
										<span style="margin: 0.2rem 0.25rem !important;">/</span>
										<span class="item-total total-task">{{p.taskCnt==null?0:p.taskCnt}}</span>
									</span>
									<span class="item-type">任务</span>
								</div>
								<div class="info-task"  title="已关闭 / 总缺陷数 ">
									<span>
										<span class="item-total finish-task">{{p.closedBugs==null?0:p.closedBugs}}</span>
										<span style="margin: 0.2rem 0.25rem !important;">/</span>
										<span class="item-total total-task">{{p.bugCnt==null?0:p.bugCnt}}</span>
									</span>
									<span class="item-type">缺陷</span>
								</div>
							</div>
							<div class="project-rate">
								<el-progress :percentage="(p.finishRate==null?0:p.finishRate)" />

								<el-tag v-if="getPlanRealProgress(p)>0" type="warning" effect="dark">超前{{ getPlanRealProgress(p) }}%</el-tag>
								<el-tag v-else-if="getPlanRealProgress(p)<0" type="danger" effect="dark">落后{{ 0-getPlanRealProgress(p) }}%</el-tag>
								<el-tag v-else-if="getProgress(p)>0" effect="dark" type="success" class="check" />
								<el-tag v-else-if="getProgress(p)==0" effect="dark" type="info">未开始 </el-tag>
							</div>
							<div class="project-footer">
								<div class="project-type" title="项目经理">
									<mdp-select-user show-style="tag" v-if="p.pmUserid" :value="p.pmUserid" :init-name="p.pmUsername" :disabled="true"/>
									<mdp-select-user show-style="tag" v-else-if="p.createUserid" :value="p.createUserid" :init-name="p.createUsername" :disabled="true"/>

								</div>
								<div class="project-period">{{p.startTime?p.startTime.substr(0,10):''}} ~{{p.endTime?p.endTime.substr(0,10):''}}</div>
							</div>
						</el-card>
					</el-col>
					</el-row>
					<el-result v-if="showType=='card' && tableDatas.length<=0" icon="info" title="信息提示" subTitle="没有查到相关项目，有可能是您暂时还没有项目，有可能是您无权限查询项目。">
							<template #extra>  
									<div class="padding">
										您可以通过 &nbsp;<el-button   @click="showAdd" icon="plus" type="primary" plain>项目</el-button>&nbsp;创建一个新项目
									</div>
									<div  class="padding">
										通过&nbsp;<el-button @click="templateVisible=true" type="primary" plain style="margin-bottom:5px;">公共模板</el-button>&nbsp;体验项目的过程。<br/>
									</div>
									<div  class="padding">
										通过&nbsp;<el-button @click="templateVisible=true" type="primary" plain style="margin-bottom:5px;">拷贝模板</el-button>&nbsp;快速创建新项目。<br/>
									</div> 
							</template>
						</el-result> 
				
				</el-scrollbar>

				<el-table  ref="table" v-adaptive="{bottom:50}" v-cloak v-show="showType=='table'" fit stripe :data="tableDatas" @sort-change="sortChange" highlight-current-row v-loading="load.list" @selection-change="selsChange" @row-click="rowClick" style="width: 100%;" :border="true">
					<template #empty>
							<el-result icon="info" title="信息提示" subTitle="没有查到相关项目，有可能是您暂时还没有项目，有可能是您无权限查询项目。">
								<template #extra> 
										<div>
											您可以通过 &nbsp;<el-button   @click="showAdd" icon="plus" type="primary" plain>项目</el-button>&nbsp;创建一个新项目
										</div>
										<div>
											通过&nbsp;<el-button @click="templateVisible=true" type="primary" plain style="margin-bottom:5px;">公共模板</el-button>&nbsp;体验项目的过程。<br/>
										</div>
										<div>
											通过&nbsp;<el-button @click="templateVisible=true" type="primary" plain style="margin-bottom:5px;">拷贝模板</el-button>&nbsp;快速创建新项目。<br/>
										</div> 
								</template>
							</el-result>
					</template>
 					<el-table-column prop="name" label="项目名称" sortable min-width="250"   >
						<template #default="scope">
							<el-link type="primary" @click.stop="intoInfo(scope.row)">{{scope.row.name}}</el-link>
						</template>
					</el-table-column>

					<el-table-column prop="pmUsername" label="项目经理" sortable min-width="120" show-overflow-tooltip/>
					<el-table-column prop="status" label="状态" width="120" sortable    itemCode="projectStatus">
						<template #default="scope">
							<mdp-select show-style="tag" itemCode="projectStatus" :disabled="true" v-model="scope.row.status"/>
 						</template>
					</el-table-column>
					<el-table-column prop="bizFlowState" label="审批状态" min-width="120" itemCode="bizFlowState">
						<template #default="scope">
							<mdp-select show-style="tag" itemCode="bizFlowState" :disabled="true" v-model="scope.row.bizFlowState"/>
						</template>
					</el-table-column>
					<el-table-column prop="finishRate" label="进度" width="180" sortable>
						<template #default="scope">

							<div style="display:flex;">
								<div style="width:3em;">
									{{getProgress(scope.row)}} %
								</div>
								<el-button  id="guider-four" type="text" circle plain icon="video-play"  title="统计项目的工作量、进度、需求、bugs等数据"  @click.stop="loadTasksToXmProjectState( scope.row)"/>

								<el-tag v-if="getPlanRealProgress(scope.row)>0" type="warning" effect="dark">超前{{ getPlanRealProgress(scope.row) }}%</el-tag>
								<el-tag v-else-if="getPlanRealProgress(scope.row)<0" type="danger" effect="dark">落后{{ 0-getPlanRealProgress(scope.row) }}%</el-tag>
								<el-tag v-else-if="getProgress(scope.row)>0" effect="dark" type="success" class="check" />
								<el-tag v-else-if="getProgress(scope.row)==0" effect="dark" type="info">未开始 </el-tag>
							</div>

 						</template>
					</el-table-column> 
					<el-table-column prop="iterationCnt" label="迭代数" sortable min-width="120" />
					<el-table-column prop="menuCnt" label="需求数" sortable min-width="120" >
						<template #default="scope">
							<span title="完成的需求数 / 需求总数 ">{{scope.row.menuCnt>0?scope.row.menuFinishCnt+'&nbsp;/&nbsp;'+scope.row.menuCnt:''}}</span>
						</template>
					</el-table-column>
					<el-table-column prop="taskCnt" label="任务数" sortable min-width="120" >
						<template #default="scope">
							<span title="完成的任务数 / 任务总数 ">{{ ((scope.row.taskFinishCnt||0)+(scope.row.taskSetCnt||0)+(scope.row.taskCloseCnt||0))+'&nbsp;/&nbsp;'+(scope.row.taskCnt||0)}}</span>
						</template>
					</el-table-column>
					<el-table-column prop="bugCnt" label="缺陷数" sortable min-width="120" >
						<template #default="scope">
							<span title="关闭的缺陷数 / 缺陷总数 ">{{scope.row.bugCnt>0?scope.row.closedBugs+'&nbsp;/&nbsp;'+scope.row.bugCnt:''}}</span>
						</template>
						</el-table-column>
					<el-table-column prop="id" label="项目编码" sortable min-width="180"  show-overflow-tooltip kbName="name"/>

					<el-table-column prop="pmUserid" label="项目经理号" sortable min-width="180"  show-overflow-tooltip kbName="pmUsername"/>
					<el-table-column prop="admUserid" label="总控号" sortable min-width="180"  show-overflow-tooltip kbName="pmUsername"/>
					<el-table-column prop="admUsername" label="总控" sortable min-width="180"  show-overflow-tooltip kbName="pmUsername"/>
					<el-table-column prop="assUserid" label="副经理号" sortable min-width="180"  show-overflow-tooltip kbName="pmUsername"/> 
					<el-table-column prop="assUsername" label="副经理" sortable min-width="180"  show-overflow-tooltip kbName="pmUsername"/> 
					<el-table-column prop="id" label="项目编号" sortable min-width="180"  show-overflow-tooltip kbName="name"/>
					<el-table-column prop="code" label="项目代号" sortable min-width="180"  show-overflow-tooltip kbName="name"/> 
					<el-table-column prop="startTime" label="开始时间" sortable min-width="120" show-overflow-tooltip colType="date"/>
					<el-table-column prop="endTime" label="结束时间" sortable min-width="120" show-overflow-tooltip colType="date"/>
					<el-table-column prop="ctime" label="创建时间" sortable min-width="120" show-overflow-tooltip colType="date"/>
 
					<el-table-column label="操作" width="150" fixed="right">
						<template #default="scope">
							<!-- <el-popover
								placement="left"
								trigger="hover"> -->

									<el-button v-if="queryScope=='myFocus'"  type="text" @click.stop="focusOrUnfocus(scope.row)" >取消关注</el-button>
									<el-button v-else  type="text" @click.stop="focusOrUnfocus(scope.row)" >关注</el-button>
 									<el-button   type="text" title="通过复制快速创建新项目" @click.stop="onCopyToBtnClick(scope.row)" v-loading="load.add">复制</el-button>
									<el-button   type="text" title="删除项目" @click.stop="handleDel(scope.row)" v-loading="load.del">删除</el-button>

									<!--
									<el-button  type="primary" @click.stop="statusChange(scope,'1')" v-if="scope.row.status==0 || scope.row.status == 2">提交审核</el-button>
									<el-button  type="primary" @click.stop="statusChange(scope,'3')" v-if="scope.row.status==1">批准</el-button>
									<el-button  type="primary" @click.stop="statusChange(scope,'2')" v-if="scope.row.status==1">退回</el-button>
									<el-button  type="primary" @click.stop="statusChange(scope,'4')" v-if="scope.row.status==3">结束</el-button>
									<el-button  type="primary" @click.stop="statusChange(scope,'3')" v-if="scope.row.status==4">重新启动</el-button>
									<el-button  type="primary" @click.stop="handleDel(scope.row,scope.$index)" v-if="isLeader(scope.row.leader)">删除</el-button>


								<el-dropdown @command="handleCommand" :hide-on-click="false">
									<span class="el-dropdown-link">
										更多<i class="arrow-down -right"></i>
									</span>
									<el-dropdown-menu #dropdown>
										<el-dropdown-item icon="success"   :command="{type:'sendToProcessApprova',row:scope.row,bizKey:'xm_project_start_approva'}">立项发审(审核通过后起效)</el-dropdown-item>
										<el-dropdown-item icon="success"   :command="{type:'sendToProcessApprova',row:scope.row,bizKey:'xm_project_delete_approva'}">删除发审(审核通过后删除)</el-dropdown-item>
										<el-dropdown-item icon="success"   :command="{type:'showEdit',row:scope.row,bizKey:'xm_project_baseinfo_change_approva'}">基础信息变更发审(审核通过后生效)</el-dropdown-item>
										<el-dropdown-item icon="success"   :command="{type:'showEdit',row:scope.row,bizKey:'xm_project_budget_change_approva'}">预算变更发审(审核通过后生效)</el-dropdown-item>
										<el-dropdown-item icon="success"   :command="{type:'sendToProcessApprova',row:scope.row,bizKey:'xm_project_over_approva'}">项目结项发审(审核通过后生效)</el-dropdown-item>
										<el-dropdown-item icon="success"   :command="{type:'sendToProcessApprova',row:scope.row,bizKey:'xm_project_suspension_approva'}">项目暂停发审(审核通过后生效)</el-dropdown-item>
										<el-dropdown-item icon="success"   :command="{type:'sendToProcessApprova',row:scope.row,bizKey:'xm_project_restart_approva'}">项目重新启动发审(审核通过后生效)</el-dropdown-item>
									</el-dropdown-menu>
								</el-dropdown>
								-->
								<!-- <template #reference><el-button style="width:100%;"  class="see-more" type="text" icon="more"/></template>
							</el-popover> -->
						</template>
					</el-table-column>
				</el-table> 

		<el-pagination  layout="total, sizes, prev, pager, next" @current-change="handleCurrentChange" @size-change="handleSizeChange" :page-sizes="[12,20, 50, 100, 500]" :current-page="pageInfo.pageNum" :page-size="pageInfo.pageSize"  :total="pageInfo.total" style="float:right;" />

		<mdp-dialog title="项目新增" v-model="addFormVisible" :with-header="false" width="80%" top="20px" :close-on-click-modal="false" append-to-body>
			<xm-project-add :sel-project="addForm" sub-op-type="add" :visible="addFormVisible" @cancel="addFormVisible=false" @submit="afterAddSubmit" />
		</mdp-dialog>
		<mdp-dialog title="项目编辑" v-model="editFormVisible" :with-header="false"  width="80%" top="20px"  :close-on-click-modal="false" append-to-body>
			<xm-project-edit :sel-project="editForm" sub-op-type="edit" :visible="editFormVisible" @cancel="editFormVisible=false" @submit="afterEditSubmit" />
		</mdp-dialog>
		<MdpDialog ref="kanbanDlg" fullscreen title="项目看板">
				<MdpTableKanban   @del="(d,cb)=>handleDel(d,0,cb)"
						@plus="(cb)=>showAdd(cb)"
						@edit="(d,cb)=>intoInfo(d,cb)"
						v-model="tableDatas" 
						:columnConfigs="columnConfigs"
						itemKey="id" 
						:contentFun="(item)=>item.name"
					> 
					<template #toolbar="{element}">
						<MdpSelect showStyle="tag" itemCode="projectStatus" disabled v-model="element.status"/>
					</template>
					</MdpTableKanban>
				</MdpDialog>

		<mdp-dialog v-if="selectProject" :title="selectProject==null?'操作日志':selectProject.name+'操作日志'" center   v-model="xmRecordVisible"  size="50%"  :close-on-click-modal="false" append-to-body>
			<xm-record :project-id="selectProject.id"  :visible="xmRecordVisible" :simple="1" />
		</mdp-dialog>

		<mdp-dialog
			title="通过复制创建新的模板或者新的项目"
			v-model="copyToVisible"
			width="500" >
			<el-form>
			<el-form-item label="项目名称">
				<el-input v-model="xmProjectCopy.name" placeholder="新的项目名称"/>
			</el-form-item>
			<el-form-item  label="项目代号">
				<el-input v-model="xmProjectCopy.code"  placeholder="新的项目代号">
					<template #append>
						<el-button type="text" @click="createProjectCode">自动生成</el-button>
					</template>
				</el-input>

							 <font color="blue" style="font-size:10px;">项目代号为合同上的项目代号，甲乙方共享;项目内部编号为 &nbsp;代号-四位随机码</font>
			</el-form-item>
			<el-form-item  label="目标">
				<el-radio v-model="xmProjectCopy.isTpl" label="1">复制为新的模板</el-radio>
				<el-radio v-model="xmProjectCopy.isTpl" label="0">复制为新的项目</el-radio>
			</el-form-item>
			<el-form-item  label="公开范围" v-if="xmProjectCopy.isTpl=='1'">
				<el-radio v-model="xmProjectCopy.tplType" label="1">向全网公开</el-radio>
				<el-radio v-model="xmProjectCopy.tplType" label="2">只向本企业公开</el-radio>
			</el-form-item>
			<el-form-item label="附加任务">
				<el-checkbox v-model="xmProjectCopy.copyPhase" true-label="1" false-label="0">拷贝计划</el-checkbox>
				<el-checkbox v-model="xmProjectCopy.copyTask" true-label="1" false-label="0">拷贝任务</el-checkbox>
				<el-checkbox v-model="xmProjectCopy.copyGroup" true-label="1" false-label="0">拷贝项目组织架构</el-checkbox>
				<el-checkbox v-model="xmProjectCopy.copyGroupUser" true-label="1" false-label="0">拷贝项目组成员</el-checkbox>
				<el-checkbox v-model="xmProjectCopy.copyProduct" true-label="1" false-label="0">拷贝关联产品及需求明细</el-checkbox>
			</el-form-item>
			</el-form>
			<template #footer>
				<span  class="footer">
					<el-button @click="copyToVisible = false;load.add=false">取 消</el-button>
					<el-button type="primary" @click="onCopyToConfirm" :disabled="load.add" v-loading="load.add">确 定</el-button>
				</span>
			</template>
		</mdp-dialog>
		<mdp-dialog v-model="templateVisible" append-to-body width="60%" top="20px">
			<xm-project-tpl-mng @copy="searchXmProjects" :show-type="'simple'" ref="xmProjectTplMngRef" />
		</mdp-dialog>
	

		<el-tour v-model="guiderVisible" type="primary" :mask="false">
			<el-tour-step
				:target="$refs['plusBtn'].$el"
				title="创建产品"
				description="可以通过模板复制、导入、直接新建3种方式创建产品，根据您的熟练程度选择适合您的方式"
			/>
			<el-tour-step
				:target="$refs['searchBtn'].$el"
				title="查询"
				description="执行查询，展示查询结果"
			/>
			<el-tour-step
				:target="$refs['hiQueryBtn'].$el"
				title="查询条件"
				description="这里定制一些高级的查询条件，支持任意复杂的条件组合，支持>,<,!=,$in,$between,$is null,$is not null等各种操作符"
			/>
			
			<el-tour-step
				:target="$refs['downloadBtn'].$el"
				title="下载"
				description="这里可以将查询结果进行下载，仅仅下载查询返回的结果，如果需要更多数据，请调大分页中的每页条数"
			/>
			
			<el-tour-step
				:target="$refs['tplBtn'].$el"
				title="模板"
				description="这里可以管理您的模板，您可以将产品复制成模板，也可以将模板复制成新产品，达到快速运用历史经验、迭代新产品的目的"
			/>
			<el-tour-step
				:target="$refs['columnConfigsBtn'].$el"
				title="表格显示配置"
				description="这里您可以定制表格的显示列，你可以把您关注的表格列展现出来，把您不关注的隐藏"
			/>
			<el-tour-step
				:target="$refs['tableBtn'].$el"
				title="表格展示"
				description="这里以表格的形式展示数据"
			/>
			<el-tour-step
				:target="$refs['cardBtn'].$el"
				title="卡片展示"
				description="这里以卡片的形式展示数据"
			/>
			<el-tour-step
				:target="$refs['kanbanBtn'].$el"
				title="看板展示"
				description="这里以看板的形式展示数据，唛盟大部分的表格都是支持看板展示数据的"
			/> 
		</el-tour> 
</template>

<script>
	
	import util from '@/components/mdp-ui/js/util';//全局公共库
	//import Sticky from '@/components/Sticky' // 粘性header组件
	import config from "@/api/mdp_pub/mdp_config"; //全局公共库

	import { listXmProject, editStatus, delXmProject, batchDelXmProject,copyTo,createProjectCode ,getDefOptions, addXmProject} from '@/api/xm/core/xmProject';
	import {  loadTasksToXmProjectState , loadTasksSettleToXmProjectState} from '@/api/xm/core/xmProjectState';

	
	import  XmProjectAdd from './XmProjectEdit.vue';//新增界面
	import  XmProjectEdit from './XmProjectEdit.vue';//修改界面
	import { mapState } from 'pinia'
import { useUserStore } from '@/store/modules/user'
import { useXmStore2 } from '@/store/modules/xm'  
	import XmProjectTplMng from './XmProjectTplMng.vue';



		
	import { MdpTableMixin } from '@/components/mdp-ui/mixin/MdpTableMixin.js'

export default {
	mixins:[MdpTableMixin],
		props:['dataScope', 'source'],
		computed: {
			...mapState(useUserStore,[
				'userInfo','roles'
			]), 
		},
		watch: {  
		},
		data() {
			return {
				guiderVisible: false,
				filters: {
					linkProductId:'',
					name: '', 
					productName:'',
					id:'',//项目编号
					createTimeStart:'',
					createTimeEnd:'',
				},
				xmProjects: [],//查询结果
				pageInfo:{//分页数据
					total:0,//服务器端收到0时，会自动计算总记录数，如果上传>0的不自动计算。
					pageSize:12,//每页数据
					count:true,//是否需要重新计算总记录数
					pageNum:1,//当前页码、从1开始计算
					orderFields:['res.create_time'],//排序列 如 ['sex','student_id']，必须为数据库字段
					orderDirs:['desc']//升序 asc,降序desc 如 性别 升序、学生编号降序 ['asc','desc']
				},
				load:{ list: false, edit: false, del: false, add: false },//查询中...
				sels: [],//列表选中数据
				dicts: getDefOptions(),//下拉选择框的所有静态数据 params=[{categoryId:'0001',itemCode:'sex'}] 返回结果 {'sex':[{optionValue:'1',optionName:'男',seqOrder:'1',fp:'',isDefault:'0'},{optionValue:'2',optionName:'女',seqOrder:'2',fp:'',isDefault:'0'}]}

				addFormVisible: false,//新增xmProject界面是否显示
				//新增xmProject界面初始化数据
				addForm: {
					id:'',code:'',name:'',xmType:'',startTime:'',endTime:'',urgent:'',priority:'',description:'',createUserid:'',createUsername:'',createTime:'',assess:'',assessRemarks:'',status:'',branchId:'',planTotalCost:'',bizProcInstId:'',bizFlowState:'',planNouserAt:'',planIuserAt:'',planOuserAt:'',locked:'',baseTime:'',baseRemark:'',baselineId:'',planWorkload:'0',totalReceivables:'0',budgetMarginRate:13,contractAmt:0,planIuserPrice:85,planOuserPrice:100,planOuserCnt:0,planIuserCnt:0,planWorkingHours:0,taxRate:3,planIuserWorkload:0,planOuserWorkload:0,fromTplId:'',budgetCtrl:'0',deptid:'',showOut:'0',isTpl:'0',pmUserid:'',pmUsername:'',assUserid:'',assUsername:'',admUserid:'',admUsername:'',budgetEarly:'',phaseActCtrl:'',del:'0',ltime:'',ostatus:'0',workType:'',wtype:'',earlyAmt:0,maxTaskAmt:0,menuLink:'0',phaseLink:'0',tplType:'',qxCode:''
				},

				editFormVisible: false,//编辑界面是否显示
				//编辑xmProject界面初始化数据
				editForm: {
					id:'',code:'',name:'',xmType:'',startTime:'',endTime:'',urgent:'',priority:'',description:'',createUserid:'',createUsername:'',createTime:'',assess:'',assessRemarks:'',status:'',branchId:'',planTotalCost:'',bizProcInstId:'',bizFlowState:'',planNouserAt:'',planIuserAt:'',planOuserAt:'',locked:'',baseTime:'',baseRemark:'',baselineId:'',planWorkload:'0',totalReceivables:'0',budgetMarginRate:13,contractAmt:0,planIuserPrice:85,planOuserPrice:100,planOuserCnt:0,planIuserCnt:0,planWorkingHours:0,taxRate:3,planIuserWorkload:0,planOuserWorkload:0,fromTplId:'',budgetCtrl:'0',deptid:'',showOut:'0',isTpl:'0',pmUserid:'',pmUsername:'',assUserid:'',assUsername:'',admUserid:'',admUsername:'',budgetEarly:'',phaseActCtrl:'',del:'0',ltime:'',ostatus:'0',workType:'',wtype:'',earlyAmt:0,maxTaskAmt:0,menuLink:'0',phaseLink:'0',tplType:'',qxCode:''
				},
				/**begin 自定义属性请在下面加 请加备注**/
				queryScope: "compete",
				showType: 'card',
				showInfo: false,
				selectProject: null,
				finishFlag: false,
				xmRecordVisible: false,
				productSelectVisible:false,
				maxTableHeight:300,
 				xmProjectCopy:{
					id:'',name:'',code:'',isTpl:'',copyPhase:'1',copyTask:'1',copyGroup:'1',copyGroupUser:'0',copyProduct:'1',tplType:'2',
				},
				copyToVisible:false,
				templateVisible:false,
				apis:{
					list: listXmProject,
					add: addXmProject,
					del: delXmProject,
					batchDel: batchDelXmProject, 
				}
				/**end 自定义属性请在上面加 请加备注**/
			}
		},//end data
		methods: {  
			
			onQueryScopeChange(queryScope){
				if(queryScope=='myFocus'){
					this.$mdp.listUserFocus({focusType:'1',pageNum:1,pageSize:20}).then(res=>{
						let {tips,data} = res
						if(data && data.length>0){
							this.filters.id='$IN'+data.map(k=>k.bizId).join(",") 
						}
					})
				}else{
					this.filters.id=''
				}

			},
			//获取列表 XmProject xm_project
			preQueryParamCheck(params) {
				   return true
			},
  
			//显示编辑界面 XmProject xm_project
			showEdit: function ( row,index ) {
				this.editFormVisible = true;
				this.editForm = Object.assign({}, row);
			},
			//显示新增界面 XmProject xm_project
			showAdd: function () {
				this.addFormVisible = true;
				//this.addForm=Object.assign({}, this.editForm);
			},
			afterAddSubmit(){
				this.addFormVisible=false;
				this.pageInfo.count=true;
				this.getXmProjects();
			},
			afterEditSubmit(){
				this.editFormVisible=false;
			},
			 
			/**begin 自定义函数请在下面加**/
			//是否负责人 是则true，否则false
			isLeader(leader) {
				return leader.some(i=>i.leadType=='负责人' && i.userid == this.userInfo.userid);
			},

			//进入info界面
			intoInfo(row) { 
				const xmStore=useXmStore2()
				xmStore.setProjectInfo(row) 
				this.$router.push({ name:'projectOverview', query: {projectId:row.id} }) 
			},
 
			//修改项目状态
			statusChange(scope,val) {
				this.load.edit = true;
				let params = {
					id: scope.row.id,
					status: val,
				};
				editStatus(params).then((res) => {
					var tips=res.tips;
					if(tips.isOk){
						this.tableDatas[scope.$index].status = val;
						this.status = val;
					}
					this.$notify({position:'bottom-left',showClose:true,message: tips.msg, type: tips.isOk?'success':'error' });
					this.load.edit = false;
				}).catch( err => this.load.edut = false );
			}, 
			showApprovaInfo:function(row){
				var msgFields=[];
				if(row.mainTitle!=null && row.mainTitle!=""){
					msgFields.push("流程【"+row.mainTitle+"】");
				}

				if(row.taskName!=null && row.taskName!=""){
					msgFields.push("当前环节【"+row.taskName+"】");
				}

				if(row.assigneeName!=null && row.assigneeName!=""){
					msgFields.push("执行人【"+row.assigneeName+"】");
				}

				if(row.commentMsg!=null && row.commentMsg!=""){
					msgFields.push("审批意见【"+row.commentMsg+"】");
				}
				var msg=msgFields.join(",");
				return msg;
			},

			sendToProcessApprova:function(row,bizKey){
				if(row.bizFlowState=='1'){
					this.$notify.error("审核中，不允许重新发起");
					return;
				}

				let extVars={projectId:row.id}
				let jsonExtVars=JSON.stringify(extVars);

				var currDomain=window.location.protocol+"//"+window.location.host;
				var fullPath=this.$route.fullPath;
				var bizUrl=currDomain+'/'+process.env.CONTEXT+'/'+process.env.VERSION+'/#'+fullPath+'?extVars='+jsonExtVars

				var titleNames=row.name
				var mainTitle=''
				var mainContext=''


				if(bizKey=='xm_project_delete_approva'){
					if(row.status!='0'){
						this.$notify.error("只有状态为初始化的项目可以删除");
						return;
					}
					mainTitle='关于删除项目【'+titleNames+"】的审批"
					mainContext=mainTitle+',删除原因：';
				} else if(bizKey=='xm_project_over_approva'){
					if(row.status!='1'){
						this.$notify.error("只有状态为执行中的项目可以进行结项操作");
						return;
					}
					mainTitle='关于项目【'+titleNames+"】结项的审批"
					mainContext=mainTitle;

				} else if(bizKey=='xm_project_restart_approva'){
					if(row.status!='3'){
						this.$notify.error("只有状态为暂停的项目可以进行重新启动操作");
						return;
					}
					mainTitle='关于项目【'+titleNames+"】重新启动的审批"
					mainContext=mainTitle;
				} else if(bizKey=='xm_project_start_approva'){
					if(row.status!='0'){
						this.$notify.error("只有状态为初始化的项目可以进行立项审批操作");
						return;
					}
					mainTitle='关于项目【'+titleNames+"】的立项审批"
					mainContext=mainTitle
				}  else if(bizKey=='xm_project_suspension_approva'){
					if(row.status!='1'){
						this.$notify.error("只有状态为执行中的项目可以进行挂起操作");
						return;
					}
					mainTitle='关于项目【'+titleNames+"】暂停的审批"
					mainContext=mainTitle+'';
				} else if(bizKey=='xm_project_budget_change_approva'){
					if(row.status!='1'){
						this.$notify.error("只有状态为执行中的项目可以进行预算变更操作");
						return;
					}
					mainTitle='关于项目【'+titleNames+"】的预算变更审批"
					mainContext=mainTitle+'';
				} else{
					this.$notify.error("暂不支持的业务审批");
					return;
				}

				let params={
					mainContext:mainContext,
					mainTitle:mainTitle,
					bizKey:bizKey,
					bizUrl:bizUrl,
					restUrl:config.getXmCtx()+"/xm/core/xmProject/processApprova",
					extVars:extVars,
					flowVars:{
						subscribeTaskEvent:'TASK_COMPLETED,TASK_CREATED',
						branchId:row.branchId,
						projectId:row.id
					},
				} 
				this.$router.push({ name: 'bizStartProc', query: {paramsId:this.$mdp.setCacheParams(params)} });
			},
			handleCommand(command) {
				if(command.type=='sendToProcessApprova'){
					this.sendToProcessApprova(command.row,command.bizKey);
				} else if(command.type=='showEdit'){
					this.showEdit(command.row,null);
				}
			},
			focusOrUnfocus:function(row){
				if(this.queryScope=="myFocus"){
					this.$mdp.delUserFocus({pbizId:row.id,focusType:'1',bizId:row.id,bizName:row.name}).then(res=>{
						var tips=res.tips;
						if(tips.isOk){
							this.searchTableDatas();
						}
						this.$notify({position:'bottom-left',showClose:true,message: tips.msg, type: tips.isOk?'success':'error' });
					})
				}else{
					this.$mdp.addUserFocus({pbizId:row.id,focusType:'1',bizId:row.id,bizName:row.name}).then(res=>{
						var tips=res.tips;
						this.$notify({position:'bottom-left',showClose:true,message: tips.msg, type: tips.isOk?'success':'error' });
					})
				}
			},  

			onCopyToBtnClick(row){
				this.xmProjectCopy.id=row.id;
				this.xmProjectCopy.name=row.name+"(复制)";
				this.xmProjectCopy.isTpl=row.isTpl;
				this.copyToVisible=true;
			},
			onCopyToConfirm(){

				if(!this.xmProjectCopy.code){
					this.$notify({position:'bottom-left',showClose:true,message: '项目代号不能为空', type: 'error' });
					return;
				}
				copyTo(this.xmProjectCopy);
				this.$notify({position:'bottom-left',showClose:true,message: "已提交拷贝任务，执行需要1-5分钟，请稍后刷新项目列表", type:  'success' });
			},
			createProjectCode(){
				createProjectCode({}).then(res=>{
					var tips=res.tips;
					if(tips.isOk){
						this.xmProjectCopy.code=res.data
					}
					this.$notify({position:'bottom-left',showClose:true,message: tips.msg, type: tips.isOk?'success':'error' });
				})
			}, 
			loadTasksToXmProjectState(row){

					var params={projectId:row.id}
				loadTasksToXmProjectState(params).then((res) => {
						this.load.edit=false;
						var tips=res.tips;
						if( tips.isOk ){
							this.pageInfo.count=true;
							this.searchXmProjects();
						}
						this.$notify({position:'bottom-left',showClose:true,message: tips.msg, type: tips.isOk?'success':'error'});
					}).catch( err  => this.load.edit=false );
			}, 
			menuFinishCntCalc(project){
				var allFinishCnt= (project.menuFinishCnt||0 )+ (project.menuCloseCnt||0)
				 return allFinishCnt;
			},
			getProgress(project){
				var planRate=0;
				if(!project.estimateWorkload||!project.budgetWorkload){
					planRate= 0;
					return planRate;
				}
				planRate= Math.round(project.estimateWorkload/project.budgetWorkload*100);
				return planRate
			},
			getPlanRealProgress(project){
				var planRate=0;
				if(!project.estimateWorkload||!project.budgetWorkload){
					planRate= 0;
					return planRate;
				}
				planRate=project.estimateWorkload/project.budgetWorkload*100;
				return  Math.round((project.finishRate||0)-planRate)
			}
			/**end 自定义函数请在上面加**/

		},//end methods
		components: {
		    'xm-project-add':XmProjectAdd,
		    'xm-project-edit':XmProjectEdit,
			 
			XmProjectTplMng
		    //在下面添加其它组件
		},
		mounted() {
			if(this.$route.params){
				this.filters.productId=this.$route.params.productId;
				this.filters.productName=this.$route.params.productName;
			}
			this.$nextTick(() => {
				if(this.dataScope){
					this.queryScope=this.dataScope=='all'?'branchId':'compete'
				} 
			});
		},
	}

</script>

<style lang="scss" scoped>

.changebtn{
	float: right;
	padding: 2px 10px;
	display: flex;
	align-items: center;
	line-height: 0;
	height: 100%;
}
.changebtn > button{
	padding: 0;
	border: 0;
	color: #333;
}
.changebtn  i::before{
	font-size:20px;
}
.changebtn-active{
	color: #409EFF !important;
}
.app-container{
	padding: 10px;
}
.el-menu-demo{
	border: 0 !important;
	height: 50px;
	padding-left: 10px;
	background-color: #fafbfc;
}
.el-menu-demo>.el-menu-item,
.el-menu-demo>.el-sub-menu  .el-sub-menu__title{
	height: 100%;
	line-height: 50px;
	color: #909399;
}
.el-menu--horizontal>.el-menu-item:not(.is-disabled):focus,
.el-menu--horizontal>.el-menu-item:not(.is-disabled):hover,
.el-menu--horizontal>.el-sub-menu .el-sub-menu__title:hover{
	background-color: transparent;
}
.project-card{
	cursor: pointer;
	font-size: 12px;
	color: #999;
	padding: 10px;
}
.project-card:hover{
	border-color: #00abfc;
}
.project-card  .el-card__body{
	padding: 20px 15px 10px;
}
.project-name{
	font-size: 16px;
	font-weight: 700;
	color: #333;
	height: 24px;
}
.project-id{
	margin-top: 4px;
	height: 18px;
}
.project-info{
	display: flex;
	margin-top: 8px;
	justify-content: space-around;
}
.project-info>div{
	display: flex;
	flex-direction: column;
}
.info-item{
	width: 15%;
	text-align: center;
}
.info-item  span{
	display: block;
}
.item-total{
	font-size: 18px;
	color: #666;
}

.info-task{
	span{
		display: flex;
		justify-content:center;
	}
	.item-type{
		align-content: center;
		text-align: center;
	}
}
.finish-task{
	color: #00abfc !important;
}
.project-rate{
	margin: 15px 0;
}
.project-rate>.el-progress{
	display: flex;
	align-items: center;
}
.project-rate  .el-progress-bar{
	padding-right: 0;
	margin-right: 0;
}
.project-rate  .el-progress__text{
	margin-left: 5px;
}
.project-footer{
	display: flex;
}
.project-footer>div{
	width: 50%;
}
.project-footer>div:not(:first-child){
	width: 50%;
}
.project-period{
	line-height: 40px;
	text-align: right;
}
.see-more > i{
	background:#000;
}
/* 超过宽度则用...代替 */
.truncate{
	overflow: hidden;
	text-overflow: ellipsis;
	white-space: nowrap;
}
[v-cloak]{
	display: none;
}
.hidden-btn{
	margin-top: 5px;
	margin-bottom: 5px;
}
.right-btn{
	margin-top: 12px;
}
@media only screen and (max-height: 2400px) {
	.project-box{
		max-height: 1600x;
		overflow-y: auto;
	}
}
@media only screen and (max-height: 1200px) {
	.project-box{
		max-height: 800px;
		overflow-y: auto;
	}
}
@media only screen and (max-height: 980px) {
	.project-box{
		max-height: 600px;
		overflow-y: auto;
	}
}
@media only screen and (max-height: 640px) {
	.project-box{
		max-height: 300px;
		overflow-y: auto;
	}
}

</style>
