<template> 
	<ContentWrap>
		<template #header>
			<el-space wrap>
				<mdp-hi-query ref="hiQueryBtn" :column-configs="columnConfigs" v-model="hiQueryParams" @change="onHiQueryParamsChange" />
        <el-button icon="zoom-out" @click="searchReset()" title="重置查询条件并查询" ref="searchResetBtn"/>
  

        <mdp-export @excel="export2Excel()" ref="downloadBtn"/>
        <mdp-table-configs :column-configs="columnConfigs" v-model="checkedColumns" ref="columnConfigsBtn"/>  
				
				<el-popover :show-after="200"
							placement="top-start"
							width="350"
							trigger="click" >
							<el-space wrap> 
									<el-badge value="都适用">
									<el-button   @click="showAdd" icon="plus">直接添加新产品</el-button>
									</el-badge> 
									<el-badge value="进阶">
									<el-button type="primary" icon="plus" >通过【产品-复制】一键创建新的产品</el-button>
									</el-badge> 
									<el-badge value="新手">
									<el-button type="warning" @click="$refs['tpl'].open()" icon="plus">通过【模板-复制】一键创建新的产品</el-button>
									</el-badge> 
							</el-space>
 							<template #reference><el-button type="primary"   icon="plus" v-if="!xmIteration" ref="plusBtn" plain/></template>
					</el-popover>
				<el-button  @click="$refs['tpl'].open()" title="产品模板" icon="cellphone" plain ref="tplBtn">模板</el-button>
										<el-button   @click="guiderVisible=true" icon="help" plain>新手</el-button>
										
										<el-radio  v-model="showType" label="table" ref="tableBtn">表格</el-radio>
										<el-radio  v-model="showType" label="card" ref="cardBtn">卡片</el-radio> 
										<el-button type="success" ref="kanbanBtn" plain @click="openKanban('kanbanDlg')" title="产品看板">板</el-button>

			</el-space>
		</template>
				<el-space wrap>
					<mdp-select width="250px" v-model="filters.queryScope" :options="[
						{id:'branchId',name:'所有的产品'}, 
						{id:'compete',name:'我相关的产品'}, 
						{id:'productId',name:'按产品编号精确查找'},
						{id:'createUserid',name:'我创建的'},
						{id:'pmUserid',name:'我担任产品经理的'},
						{id:'assUserid',name:'我担任产品助理的'},
						{id:'admUserid',name:'我担任产品主管的'},
						{id:'myFocus',name:'我关注的'}, 
				]"   placeholder="产品查询范围" clear ref="queryScopeBtn" @change="onQueryScopeChange"/>
					<mdp-select placeholder="状态" itemCode="xmProductPstatus" v-model="filters.pstatus"/>
					<el-input v-if="filters.queryScope=='productId'" style="width:20%;"  v-model="filters.id"  placeholder="输入产品编号" @keyup.enter="searchTableDatas" clearable/>
					<el-input v-if="filters.queryScope!='productId'" v-model="filters.productName" style="width: 20%;" placeholder="名称查询" clearable/>
					<el-button ref="searchBtn" type="primary" v-loading="load.list" :disabled="load.list==true" @click="searchTableDatas" icon="search">查询</el-button>
 
				</el-space>
			</ContentWrap>  
					<!--列表 XmProject xm_project-->
					<el-scrollbar v-adaptive v-if="showType=='card' && tableDatas.length>0">
					<el-row>
						<el-col  v-cloak v-for="(p,i) in tableDatas" :key="i" :xl="6" :lg="8" :md="8" :sm="12" class="project-card">
							<el-card @click="intoInfo(p,i)"  shadow="always">
								<template #header>
								<div    style="display:flex;justify-content: space-between;">
									<div class="project-name">
 										<mdp-select  title="产品状态" itemCode="xmProductPstatus" show-style="tag" v-model="p.pstatus" :disabled="true"/>
										{{p.productName}}
										
									</div>
									<el-popover :show-after="200"
										placement="top-start"
										title="更多操作"
										width="400"
										trigger="hover">
										<el-space wrap>
											<el-button id="prj-copy-btn" type="primary"  title="通过复制快速创建新产品" @click.stop="onCopyToBtnClick(p)" v-loading="load.add">复制</el-button>
											<el-button v-if="menukey=='myFocus'"  type="primary"  @click.stop="focusOrUnfocus(p)" >取消关注</el-button>
											<el-button v-else  type="primary"   @click.stop="focusOrUnfocus(p)" >关注</el-button>
											<el-button   type="danger" title="删除项目" @click.stop="handleDel(p)" v-loading="load.del">删除</el-button>

											<!--<el-link id="prj-calc-btn" type="warning" style="font-size:14px;float:right;margin-left:2px;"  title="统计项目的工作量、进度、需求、bugs等数据" @click.stop="loadTasksToXmProjectState(p)" v-loading="load.add">统计</el-link>-->
										</el-space>

										<template #reference><el-button   icon="setting" circle plain/></template>
									</el-popover>
									
								</div>
								</template>
									<div class="project-info">

										<div class="info-task"  title="已完成需求数 / 总需求数 ">
											<span class="nums">
												<span class="item-total finish-task">{{p.menuFinishCnt==null?0:p.menuFinishCnt}}</span>
												<span style="margin: 0 .25rem !important;">/</span>
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
												<span class="item-total finish-task">{{p.taskFinishCnt==null?0:p.taskFinishCnt}}</span>
												<span style="margin: 0 .25rem !important;">/</span>
												<span class="item-total total-task">{{p.taskCnt==null?0:p.taskCnt}}</span>
											</span>
											<span class="item-type">任务</span>
										</div>
										<div class="info-task"  title="已关闭 / 总缺陷数 ">
											<span>
												<span class="item-total finish-task">{{p.closedBugs==null?0:p.closedBugs}}</span>
												<span style="margin: 0 .25rem !important;">/</span>
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
									<div class="project-type" title="产品经理">
											<mdp-select-user show-style="tag" v-if="p.pmUserid" v-model="p.pmUserid" :init-name="p.pmUsername"  :disabled="true"/>
											<mdp-select-user show-style="tag" v-else-if="p.admUserid" v-model="p.admUserid" :init-name="p.admUsername"  :disabled="true"/>
										</div>
										<div class="project-period">{{p.startTime?p.startTime.substr(0,10):''}} ~{{p.endTime?p.endTime.substr(0,10):''}}</div>
									<!--<div class="project-period">{{p.startTime.substr(0,10)}} ~{{p.endTime.substr(0,10)}}</div>-->
								</div>
							</el-card>
						</el-col>
					</el-row>
				</el-scrollbar>
					<div  v-if="showType=='card' && !load.list && tableDatas.length<=0">
							<el-result icon="info" title="信息提示" subTitle="没有查到相关产品，有可能是您暂时还没有产品，有可能是您无权限查询产品。">
								<template #extra> 
										<div class="padding">
											您可以通过 &nbsp;<el-button   @click="showAdd" icon="plus" type="primary" plain>产品</el-button>&nbsp;创建一个新产品
										</div>
										<div class="padding">
											通过&nbsp;<el-button @click="templateVisible=true" type="primary" plain >公共模板</el-button>&nbsp;体验产品的过程。<br/>
										</div>
										<div class="padding">
											通过&nbsp;<el-button @click="templateVisible=true" type="primary" plain >拷贝模板</el-button>&nbsp;快速创建新产品。<br/>
										</div> 
								</template>
							</el-result>
					</div>   
					<!--列表 XmProduct 产品表-->
					<el-table v-show="showType=='table'" ref="table"  v-adaptive="{bottom:50}" :data="showType=='table'?tableDatas:[]" @sort-change="sortChange" highlight-current-row v-loading="load.list" @selection-change="selsChange" @row-click="rowClick" style="width: 100%;" border>
						<template #empty>
							<el-result icon="info" title="信息提示" subTitle="没有查到相关产品，有可能是您暂时还没有产品，有可能是您无权限查询产品。">
								<template #extra> 
										<div>
											您可以通过 &nbsp;<el-button   @click="showAdd" icon="plus" type="primary" plain>产品</el-button>&nbsp;创建一个新产品
										</div>
										<div>
											通过&nbsp;<el-button @click="templateVisible=true" type="primary" plain >公共模板</el-button>&nbsp;体验产品的过程。<br/>
										</div>
										<div>
											通过&nbsp;<el-button @click="templateVisible=true" type="primary" plain >拷贝模板</el-button>&nbsp;快速创建新产品。<br/>
										</div> 
								</template>
							</el-result>
						</template>
						<el-table-column prop="productName" label="产品名称" min-width="250" sortable  fixed="left" colPrefix="res.">
							<template #default="scope" >
								<el-link id="guider-three" type="primary" @click="intoInfo(scope.row)">{{scope.$index+1}} {{scope.row.productName}}</el-link>
							</template>
						</el-table-column>
						<el-table-column prop="pstatus" label="状态" width="120" sortable   fixed="left" itemCode="xmProductPstatus">
							<template #default="scope">
								<mdp-select show-style="tag" placeholder="状态" itemCode="xmProductPstatus" v-model="scope.row.pstatus" effect="dark" @change="editSomeFields(scope.row,'pstatus',$event)"/>
							</template>
						</el-table-column>
						<el-table-column prop="finishRate" label="进度" width="180" sortable>
							<template #default="scope">
								<div style="display:flex;">
 									<div style="width:3em;">{{ getProgress(scope.row)  }}%</div>
									 <el-button plain circle id="guider-four" type="text" icon="video-play" @click.stop="loadTasksToXmProductState( scope.row)"/>

									<el-tag v-if="getPlanRealProgress(scope.row)>0" type="warning" effect="dark">超前{{ getPlanRealProgress(scope.row) }}%</el-tag>
									<el-tag v-else-if="getPlanRealProgress(scope.row)<0" type="danger" effect="dark">落后{{ 0-getPlanRealProgress(scope.row) }}%</el-tag>
									<el-tag v-else-if="getProgress(scope.row)>0" effect="dark" type="success" class="check" />
									<el-tag v-else-if="getProgress(scope.row)==0" effect="dark" type="info">未开始 </el-tag>
								</div>

 							</template>
						</el-table-column>
						<el-table-column prop="pmUsername" label="产品经理" width="150" sortable show-overflow-tooltip>
							<template #default="scope">
								<mdp-select-user show-style="tag" v-model="scope.row.pmUserid" :init-name="scope.row.pmUsername" :disabled="true"/>
							</template>
						</el-table-column>

						<el-table-column prop="menuCnt" label="需求数" width="120" sortable show-overflow-tooltip>
							<template #default="scope">
								<span title=" 已完成 / 总需求数">{{scope.row.menuCnt>0?scope.row.menuFinishCnt+'&nbsp;/&nbsp;'+scope.row.menuCnt:''}}</span>
							</template>
						</el-table-column>

						<el-table-column prop="projectCnt" label="项目数" width="120" sortable show-overflow-tooltip>
							<template #default="scope">
								<span title="实际发生的关联项目数">{{scope.row.projectCnt>0? scope.row.projectCnt:''}}</span>
							</template>
						</el-table-column>
						<el-table-column prop="iterationCnt" label="迭代数" width="120" sortable show-overflow-tooltip>
							<template #default="scope">
								<span title="实际发生的关联迭代数">{{scope.row.iterationCnt>0? scope.row.iterationCnt:''}}</span>
							</template>
						</el-table-column>
						<el-table-column prop="taskCnt" label="任务数" width="120" sortable show-overflow-tooltip>
							<template #default="scope">
								<span title=" 已完成 / 总任务数">{{scope.row.taskCnt>0?scope.row.taskFinishCnt+'&nbsp;/&nbsp;'+scope.row.taskCnt:''}}</span>
							</template>
						</el-table-column>

						<el-table-column prop="bugCnt" label="缺陷数" width="120" sortable show-overflow-tooltip>
							<template #default="scope">
								<span title=" 已关闭 / 总缺陷数 ">{{scope.row.bugCnt>0?scope.row.closedBugs+'&nbsp;/&nbsp;'+scope.row.bugCnt:''}}</span>
							</template>
						</el-table-column>
						<el-table-column prop="budgetWorkload" label="预计工时" width="120"  show-overflow-tooltip sortable />
						<el-table-column prop="actWorkload" label="实际工时" width="120"  show-overflow-tooltip sortable /> 
						
						<el-table-column prop="admUsername" label="总控" width="120"  show-overflow-tooltip sortable />
						<el-table-column prop="admUserid" label="总控号" width="120"  show-overflow-tooltip sortable kbName="admUsername"/>
						<el-table-column prop="assUsername" label="副经理" width="120"  show-overflow-tooltip sortable />
						<el-table-column prop="assUserid" label="副经理号" width="120"  show-overflow-tooltip sortable kbName="assUsername"/>
						<el-table-column prop="assUserid" label="副经理号" width="120"  show-overflow-tooltip sortable kbName="assUsername"/>
						
						<el-table-column prop="createUserid" label="创建人号" width="120"  show-overflow-tooltip sortable/>
						<el-table-column prop="createUsername" label="创建人" width="120"  show-overflow-tooltip sortable/>
						<el-table-column prop="deptName" label="部门" width="120"  show-overflow-tooltip sortable/>
						<el-table-column prop="deptid" label="部门号" width="120"  show-overflow-tooltip sortable/>
						<el-table-column prop="startTime" label="开始时间" width="120"  show-overflow-tooltip sortable colType="date"/>
						<el-table-column prop="endTime" label="结束时间" width="120"  show-overflow-tooltip sortable colType="date"/>
						<el-table-column prop="id" label="产品编码" min-width="150" sortable    show-overflow-tooltip/>
						<el-table-column prop="code" label="产品代号" min-width="150" sortable    show-overflow-tooltip/>

						<el-table-column prop="ctime" label="创建时间" width="120"  show-overflow-tooltip sortable colType="date"/>
						<el-table-column  label="操作" width="250" fixed="right">
							<template #default="scope">
											<el-button v-if="filters.queryScope=='myFocus'"  type="success" @click.stop="focusOrUnfocus(scope.row)" >取消关注</el-button>
											<el-button v-else  type="success" @click.stop="focusOrUnfocus(scope.row)" >关注</el-button>
											<el-button id="guider-five" type="warning"  title="通过复制创建新的产品" @click="onCopyToBtnClick(scope.row)" :disabled="load.add" v-loading="load.add">复制</el-button>
 											<el-button  type="danger" v-loading="load.del" @click="handleDel(scope.row)" :disabled="load.del==true" icon="delete">删除</el-button>
							</template>
						</el-table-column>
					</el-table>  
					<el-pagination  layout="total, sizes, prev, pager, next" @current-change="handleCurrentChange" @size-change="handleSizeChange" :page-sizes="[12,20, 50, 100, 500]" :current-page="pageInfo.pageNum" :page-size="pageInfo.pageSize"  :total="pageInfo.total" style="float:right;" />

							<!--编辑 XmProduct 产品表界面-->
					<mdp-dialog ref="editDlg" title="编辑产品"   width="60%"   append-to-body   :close-on-click-modal="false">
						<template #default="{visible,data,dialog}">
							<xm-product-edit subOpType="edit" :xm-product="data.formData" :visible="visible" @cancel="dialog.close()" @submit="{afterEditSubmit($event);dialog.close()}" />
						</template>
					</mdp-dialog>

					<!--新增 XmProduct 产品表界面-->
					<mdp-dialog ref="addDlg" title="新增产品" width="60%"  append-to-body  :close-on-click-modal="false">
						<template #default="{visible,data,dialog}">
							<xm-product-add  subOpType="add" :xm-product="data.formData" :visible="visible" @cancel="dialog.close()" @submit="{afterAddSubmit($event);dialog.close();}" />
						</template>
					</mdp-dialog> 
					<mdp-dialog
						title="通过复制创建新的模板或者新的产品"
						v-model="copyToVisible"
						width="500" >
						<el-form>
						<el-form-item label="产品名称">
							<el-input v-model="xmProductCopy.productName" placeholder="新的产品名称"/>
						</el-form-item>
						<el-form-item  label="产品代号">
							<el-input v-model="xmProductCopy.code"  placeholder="新的产品代号">
							<template #append>
								<el-button type="text" @click="createProductCode">自动生成</el-button>
							</template>
							</el-input>
							<font color="blue" style="font-size:10px;">产品代号为合同上的产品代号，甲乙方共享；产品内部编号为&nbsp;代号-四位随机码</font>
						</el-form-item>
						<el-form-item  label="目标">
							<el-radio v-model="xmProductCopy.isTpl" label="1">复制为新的模板</el-radio>
							<el-radio v-model="xmProductCopy.isTpl" label="0">复制为新的产品</el-radio>
						</el-form-item>
						<el-form-item label="附加任务">
							<el-checkbox v-model="xmProductCopy.copyMenu" true-label="1" false-label="0">拷贝需求列表</el-checkbox>
							<el-checkbox v-model="xmProductCopy.copyPhase" true-label="1" false-label="0">拷贝计划</el-checkbox>
							<el-checkbox v-model="xmProductCopy.copyGroup" true-label="1" false-label="0">拷贝组织架构</el-checkbox>
							<el-checkbox v-model="xmProductCopy.copyGroupUser" true-label="1" false-label="0">拷贝产品组成员</el-checkbox>
						</el-form-item>
						</el-form>
						<template #footer>
							<div  class="footer">
							<el-button @click="copyToVisible = false">取 消</el-button>
							<el-button type="primary" @click="onCopyToConfirm" :disabled="load.add" v-loading="load.add">确 定</el-button>
						</div>
						</template>
					</mdp-dialog>

		<mdp-dialog ref="tpl" append-to-body width="80%" top="20px" v-model="templateVisible">
			<xm-product-tpl-mng @copy="searchTableDatas" :show-type="'simple'" ref="xmProductTplMngRef" />
		</mdp-dialog>
		<MdpDialog ref="kanbanDlg" fullscreen title="产品看板">
		<MdpTableKanban @del="(d,cb)=>handleDel(d,0,cb)"
						@plus="(cb)=>showAdd(cb)"
						@edit="(d,cb)=>intoInfo(d,cb)"
						v-model="tableDatas" 
						:columnConfigs="columnConfigs"
						itemKey="id" 
						:contentFun="(item)=>item.productName"
					> 
					<template #toolbar="{element}">
						<MdpSelect showStyle="tag" itemCode="xmProductPstatus" disabled v-model="element.pstatus"/>
					</template>
					</MdpTableKanban>
				</MdpDialog>
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
				description="这里以看板的形式展示数据，大部分的表格都是支持看板展示数据的"
			/>
		</el-tour> 

</template>

<script>
	import util from '@/components/mdp-ui/js/util';//全局公共库
	//import Sticky from '@/components/Sticky' // 粘性header组件

	import { listXmProduct,listXmProductWithState, delXmProduct, batchDelXmProduct,copyTo,createProductCode, addXmProduct,editXmProductSomeFields } from '@/api/xm/core/xmProduct';
	import { addXmIterationLink,delXmIterationLink } from '@/api/xm/core/xmIterationLink';
	import { loadTasksToXmProductState } from '@/api/xm/core/xmProductState';
	import  XmProductAdd from './XmProductEdit.vue';//新增界面
	import  XmProductEdit from './XmProductEdit.vue';//修改界面
	import  XmProductTplMng from './XmProductTplMng.vue';//修改界面
	import { mapState } from 'pinia'
import { useUserStore } from '@/store/modules/user'
import { useXmStore2 } from '@/store/modules/xm'  
	 
	
import { MdpTableMixin } from '@/components/mdp-ui/mixin/MdpTableMixin.js'

	export default {
		mixins:[MdpTableMixin],
		props:['selProject','xmIteration', 'source'],
		computed: {
		    ...mapState(useUserStore,[
		      'userInfo','roles'
		    ]),
		},
		watch:{
			selProject:function(){
				this.searchTableDatas();
			},
			xmIteration:function(){
				this.searchTableDatas();
			}
		},
		data() { 
			return {
				pkNames:['id'],
				currOpType:'mng',
				filters: { 
				}, 
				pageInfo:{//分页数据
					total:0,//服务器端收到0时，会自动计算总记录数，如果上传>0的不自动计算。
					pageSize:12,//每页数据
					count:true,//是否需要重新计算总记录数
					pageNum:1,//当前页码、从1开始计算
					orderFields:['res.ctime'],//排序列 如 ['sex','student_id']，必须为数据库字段
					orderDirs:['desc']//升序 asc,降序desc 如 性别 升序、学生编号降序 ['asc','desc']
				},
				load:{ list: false, edit: false, del: false, add: false },//查询中...  
				addFormVisible: false,//新增xmProduct界面是否显示
				//新增xmProduct界面初始化数据

				addForm: {
					id:'',productName:'',branchId:'',remark:'',version:'',pmUserid:'',pmUsername:'',ctime:'',deptid:'',pstatus:'',startTime:'',endTime:'',deptName:'',admUserid:'',admUsername:'',assUserid:'',assUsername:'',bizProcInstId:'',bizFlowState:'',isTpl:'',baselineId:'',baseTime:'',code:'',pbudgetWorkload:'',pbudgetAmount:'',pmenuBudgetWorkload:'',pmenuBudgetAmount:'',budgetCtrl:'',phaseBudgetCtrl:'',phaseActCtrl:'',locked:'',del:'',ltime:''
				}, 
				editForm: {
					id:'',productName:'',branchId:'',remark:'',version:'',pmUserid:'',pmUsername:'',ctime:'',deptid:'',pstatus:'',startTime:'',endTime:'',deptName:'',admUserid:'',admUsername:'',assUserid:'',assUsername:'',bizProcInstId:'',bizFlowState:'',isTpl:'',baselineId:'',baseTime:'',code:'',pbudgetWorkload:'',pbudgetAmount:'',pmenuBudgetWorkload:'',pmenuBudgetAmount:'',budgetCtrl:'',phaseBudgetCtrl:'',phaseActCtrl:'',locked:'',del:'',ltime:''
				}, 
				showType:'card',
				xmProductCopy:{
					id:'',productName:'',code:'',isTpl:'',copyMenu:'1',copyPhase:'1',copyGroup:'1',copyGroupUser:'0'
				},  
				templateVisible:false,
				guiderVisible:false,
				copyToVisible: false,
				apis:{
					list: listXmProductWithState,
					add: addXmProduct,
					del: delXmProduct,
					batchDel:batchDelXmProduct,
					editSomeFields: editXmProductSomeFields
				}
 			}
		},//end data
		methods: {  
			
			onQueryScopeChange(queryScope){
				if(queryScope=='myFocus'){
					this.$mdp.listUserFocus({focusType:'3',pageNum:1,pageSize:20}).then(res=>{
						let {tips,data} = res
						if(data && data.length>0){
							this.filters.id='$IN'+data.map(k=>k.bizId).join(",") 
						}
					})
				}else{
					this.filters.id=''
				}

			},
			loadTasksToXmProductState: function (row) {
				this.load.edit=true;

				let params = { productId: row.id };
				loadTasksToXmProductState(params).then((res) => {
					this.load.edit=false;
					var tips=res.tips;
					if(tips.isOk){
						this.pageInfo.count=true;
						this.searchTableDatas();
					}
					this.$notify({position:'bottom-left',showClose:true,message: tips.msg, type: tips.isOk?'success':'error' });
				}).catch( err  => this.load.edit=false );
			},
			 
			afterAddSubmit(xmProduct){ 
				this.pageInfo.count=true;
				if(this.xmIteration){//如果是迭代试图进入的迭代界面，创建了产品直接添加产品与迭代的关系
					this.onXmProductSelect(xmProduct);
				}else{
					this.searchTableDatas();
				}
			},
			afterEditSubmit(){ 
				this.searchTableDatas()
			},

			//进入info界面
			intoInfo(row) {
				this.editForm = row;
				const xmStore=useXmStore2()
				xmStore.setXmProduct(row) 
				this.$router.push({ name:'productOverview', query: {productId:row.id} })
				 
				//this.showInfo = true;
			},   
			 
			/**end 自定义函数请在上面加**/
			onXmProductSelect:function(row){
				var xmIteration=this.xmIteration;
				var xmProduct=row;
				this.$confirm('确认将产品【'+xmProduct.productName+'】加入迭代计划【'+xmIteration.iterationName+'】吗？', '提示', {
					type: 'warning'
				}).then(()=>{
					addXmIterationLink({iterationId:xmIteration.id,productId:xmProduct.id}).then(res=>{
						var tips =res.tips;
						if(tips.isOk){
							this.searchTableDatas();
						}
						this.$notify({position:'bottom-left',showClose:true,message: tips.msg, type: tips.isOk?'success':'error'});
					})
				})
			},
			doDelXmIterationLink(row){
				var xmIteration=this.xmIteration;
				var xmProduct=row;
				this.$confirm('确认将产品【'+xmProduct.productName+'】与迭代【'+xmIteration.iterationName+'】进行脱钩吗？脱钩后，产品下的所有需求将从本迭代计划一并移出。', '提示', {
					type: 'warning'
				}).then(()=>{
					delXmIterationLink({iterationId:xmIteration.id,productId:xmProduct.id}).then(res=>{
						var tips =res.tips;
						if(tips.isOk){
							this.searchTableDatas();
						}
						this.$notify({position:'bottom-left',showClose:true,message: tips.msg, type: tips.isOk?'success':'error'});
					})
				})
			},
			showAdd(){ 
				this.$refs['addDlg'].open({formData:this.addForm})
			},
			onCopyToBtnClick(row){
				this.xmProductCopy.id=row.id;
				this.xmProductCopy.productName=row.productName+"(复制)";
				this.xmProductCopy.isTpl=row.isTpl;
				this.copyToVisible=true;
			},
			onCopyToConfirm(){
				if(!this.xmProductCopy.code){
					this.$notify({position:'bottom-left',showClose:true,message: '产品代号不能为空', type: 'error' });
					return;
				}
				this.load.add=true;
				copyTo(this.xmProductCopy).then(res=>{
					this.load.add=false;
					var tips = res.tips;
					if(tips.isOk){
						this.copyToVisible=false;
						if(this.xmProductCopy.isTpl=='0'){
							this.searchTableDatas()
						}
					}
					this.$notify({position:'bottom-left',showClose:true,message: tips.msg, type: tips.isOk?'success':'error' });

				})
			}, 
			createProductCode(){
				createProductCode({}).then(res=>{
					var tips=res.tips;
					if(tips.isOk){
						this.xmProductCopy.code=res.data
					}
					this.$notify({position:'bottom-left',showClose:true,message: tips.msg, type: tips.isOk?'success':'error' });
				})
			},
			/**end 自定义函数请在上面加**/
			guiderStart() { // 初始化引导页
				 this.guiderVisible=true;
			},

			focusOrUnfocus:function(row){
				if(this.menukey=="myFocus"){
					this.$mdp.delUserFocus({pbizId:row.id,bizId:row.id}).then(res=>{
						var tips=res.tips;
						if(tips.isOk){
							this.searchTableDatas();
						}
						this.$notify({position:'bottom-left',showClose:true,message: tips.msg, type: tips.isOk?'success':'error' });
					})
				}else{
					this.$mdp.addUserFocus({pbizId:row.id,focusType:'3',bizId:row.id,bizName:row.productName}).then(res=>{
						var tips=res.tips;
						this.$notify({position:'bottom-left',showClose:true,message: tips.msg, type: tips.isOk?'success':'error' });
					})
				}
			},

			getProgress(p){
				var planRate=0;
				if(!p.estimateWorkload||!p.budgetWorkload){
					planRate= 0;
					return planRate;
				}
				planRate= Math.round(p.estimateWorkload/p.budgetWorkload*100);
				return planRate
			},
			getPlanRealProgress(p){
				var planRate=0;
				if(!p.estimateWorkload||!p.budgetWorkload){
					planRate= 0;
					return planRate;
				}
				planRate=  p.estimateWorkload/p.budgetWorkload*100;
				return Math.round((p.finishRate||0)-planRate)
			}
		},//end methods
		components: {
		    'xm-product-add':XmProductAdd,
		    'xm-product-edit':XmProductEdit,  
			XmProductTplMng,
			
		    //在下面添加其它组件
		},
		mounted() {  
		},
	}

</script>

<style lang="scss" scoped> 
.project-card{
	cursor: pointer;
	font-size: 12px;
	color: #999;
	padding: 5px; 
}
.project-card:hover{
	border-color: #00abfc;
}
.project-card  .el-card__body{
	padding: 0px 15px 10px;
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
	justify-content: space-around;
	margin-top: 8px;
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
