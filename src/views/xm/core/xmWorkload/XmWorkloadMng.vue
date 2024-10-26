<template>
	<ContentWrap>
		<template #header>
			<el-space>

				<mdp-hi-query :column-configs="columnConfigs" v-model="hiQueryParams" @change="onHiQueryParamsChange" />
				<el-button icon="zoom-out" @click="searchReset()" title="重置查询条件并查询" />
				<mdp-export @excel="export2Excel()"/>
				<mdp-table-configs :column-configs="columnConfigs" v-model="checkedColumns" />
				<el-button type="danger" icon="delete" @click="batchDel()" title="批量删除" plain />
				<!-- <el-button type="warning" @click="batchSetSbillIdNull()" title="移出结算单" plain >移</el-button> -->
				<el-button type="primary" @click="showAdd" icon="plus" v-if="bizType && bizType != '5'" plain> 登记工时</el-button>

				<el-button @click="$refs['kanbanDlg'].open()" title="看板" type="success" plain>板</el-button>


				<el-button plain v-if="currOpType == 'select' && multiple == true" :disabled="sels.length === 0" type="primary"
					@click="selectListConfirm" icon="check">确认选择</el-button>
			</el-space>
		</template>
		<el-space>
			<xm-project-select v-if="!bizType" v-model="filters.projectId" ref="xmProjectSelect" />
			<mdp-select itemCode="wstatus" v-model="filters.wstatus" clearable placeholder="工时状态" />
			<mdp-select itemCode="sstatus" v-model="filters.sstatus" clearable placeholder="结算状态" />
			<mdp-select v-if="!bizType" v-model="filters.bizType" itemCode="wlBizType" clearable placeholder="报工类型" />

			<xm-user-select :sel-project="{id:filters.projectId}" v-model="filters.userid" />
			<el-input v-model="filters.bizName" clearable placeholder="业务名" />
			<el-button type="primary" v-loading="load.list" :disabled="load.list == true" @click="searchTableDatas"
				icon="search">查询</el-button>

		</el-space>
	</ContentWrap>

	<!--列表 XmWorkload 工时登记表-->
	<el-table ref="table" :data="tableDatas" v-adaptive="{ bottom: 50 }" @sort-change="sortChange" highlight-current-row
		v-loading="load.list" border @selection-change="selsChange" @row-click="rowClick" style="width: 100%;">
		<el-table-column type="selection" width="55" show-overflow-tooltip fixed="left" />
		<el-table-column sortable type="index" width="55" show-overflow-tooltip fixed="left" />
		<el-table-column prop="username" label="姓名" min-width="120" show-overflow-tooltip sortable />
		<el-table-column prop="bizType" label="报工类型" width="120" show-overflow-tooltip itemCode="wlBizType">
			<template #default="scope">
				<mdp-select show-style="tag" :disabled="true" v-model="scope.row.bizType" itemCode="wlBizType" />
			</template>
		</el-table-column>
		<el-table-column prop="bizDate" label="工时日期" width="120" show-overflow-tooltip sortable colType="date"/>
		<el-table-column prop="projectId" label="归属项目" min-width="120" show-overflow-tooltip sortable>
			<template #default="scope">
				{{ scope.row.projectName || scope.row.projectId }}
			</template>
		</el-table-column>
		<el-table-column prop="wstatus" label="工时状态" width="120" show-overflow-tooltip sortable itemCode="wstatus">
			<template #default="scope">
				<mdp-select show-style="tag" itemCode="wstatus" v-model="scope.row.wstatus" placeholder="工时状态"
					@change="editSomeFields(scope.row, 'wstatus', $event)" />
			</template>
		</el-table-column>

	<el-table-column prop="bizName" label="报工业务" min-width="120" show-overflow-tooltip>
		<template #default="scope">
			<el-link @click="openDialog(scope.row)">{{ scope.row.bizName }}</el-link>
		</template>
	</el-table-column>
		<el-table-column prop="workload" label="登记工时" width="120" show-overflow-tooltip sortable>
			<template #default="scope">
				{{ scope.row.workload }}h
			</template>
		</el-table-column>
		<el-table-column prop="remark" label="报工备注" width="120" show-overflow-tooltip>
			<template #default="scope">
				<MdpField showStyle="tag" v-model="scope.row.remark">
					<template #oper>
						<el-input v-model="scope.row.remark" placeholder="备注" @change="editSomeFields(scope.row, 'remark', $event)" />
					</template>
				</MdpField>
			</template>
		</el-table-column> 
		<el-table-column prop="sbillId" label="结算单编号" width="120" show-overflow-tooltip sortable />
		<el-table-column prop="sstatus" label="结算状态" width="120" show-overflow-tooltip sortable itemCode="sstatus">
			<template #default="scope">
				<mdp-select show-style="tag" itemCode="sstatus" v-model="scope.row.sstatus" placeholder="结算状态"
					@change="editSomeFields(scope.row, 'sstatus', $event)" />
			</template>
		</el-table-column>
		<!--
				<el-table-column prop="sworkload" label="结算工时" width="120" show-overflow-tooltip  sortable>
          <template #default="scope">
            <span class="cell-text">
               {{scope.row.sworkload}}h
            </span>
            <span class="cell-bar">
              <el-input type="number" style="display:inline;" v-model="scope.row.sworkload"   placeholder="结算"  @change="editSomeFields(scope.row,'sworkload',$event)"/>
						</span>
          </template>
        </el-table-column>
				<el-table-column prop="amt" label="标准金额" width="120" show-overflow-tooltip  sortable>
          <template #default="scope">
            <span class="cell-text">
              <span v-if="scope.row.amt">¥{{ scope.row.amt}}</span>
              <span v-else>-</span>
            </span>
            <span class="cell-bar">
              <el-input type="number" style="display:inline;"  v-model="scope.row.amt"   placeholder="标准金额"  @change="editSomeFields(scope.row,'amt',$event)"/>
						</span>
          </template>
        </el-table-column>
        -->
		<!--
				<el-table-column prop="samt" label="结算金额" width="120" show-overflow-tooltip  sortable>
          <template #default="scope">
            <span class="cell-text">
              <span v-if="scope.row.samt">¥{{ scope.row.samt}}</span>
              <span v-else>-</span>
            </span>
            <span class="cell-bar">
              <el-input type="number" style="display:inline;"  v-model="scope.row.samt"    placeholder="结算金额"  @change="editSomeFields(scope.row,'samt',$event)"/>
						</span>
          </template>
        </el-table-column>
        <el-table-column v-if="sstatuses && sstatuses=='1'" prop="sbillId" label="结算单" width="120" show-overflow-tooltip  sortable>
          <template #default="scope">
            <span class="cell-text">
               {{scope.row.sbillId}}
            </span>
            <span class="cell-bar">
              <xm-task-sbill-select style="display:inline;"   :project-id="scope.row.projectId"    placeholder="结算"  @row-click="editSomeFields(scope.row,'sbillId',$event)" />
						</span>
          </template>
        </el-table-column>
        -->
		<!--				<el-table-column prop="cuserid" label="创建人编号" width="120" show-overflow-tooltip />
				<el-table-column prop="bizDate" label="业务日期YYYY-MM-DD" width="120" show-overflow-tooltip />-->



		<el-table-column prop="bugId" label="缺陷编号" width="120" show-overflow-tooltip sortable />
		<el-table-column prop="taskId" label="任务编号" width="120" show-overflow-tooltip sortable />
		<el-table-column prop="menuId" label="需求编号" width="120" show-overflow-tooltip sortable />
		<el-table-column prop="funcId" label="模块编号" width="120" show-overflow-tooltip sortable />
		<el-table-column prop="caseId" label="测试用例编号" width="120" show-overflow-tooltip sortable />
		<el-table-column prop="planId" label="执行用例编号" width="120" show-overflow-tooltip sortable />
		<el-table-column prop="detailId" label="结算明细单号" width="120" show-overflow-tooltip sortable />

	</el-table>
	<el-pagination layout="total, sizes, prev, pager, next" @current-change="handleCurrentChange"
		@size-change="handleSizeChange" :page-sizes="[10, 20, 50, 100, 500]" :current-page="pageInfo.pageNum"
		:page-size="pageInfo.pageSize" :total="pageInfo.total" style="float:right;" />

	<!--编辑 XmWorkload 工时登记表界面-->
	<mdp-dialog :title="'【' + editForm.name + '】编辑工时'" v-model="editFormVisible" width="60%" append-to-body
		:close-on-click-modal="false">
		<xm-workload-edit :bizType="bizType" sub-op-type="edit" :xm-workload="editForm" :visible="editFormVisible"
			@cancel="editFormVisible = false" @submit="afterEditSubmit" />
	</mdp-dialog>

	<!--新增 XmWorkload 工时登记表界面-->
	<mdp-dialog :title="'【' + editForm.name + '】新增工时'" v-model="addFormVisible" width="60%" append-to-body
		:close-on-click-modal="false">
		<xm-workload-edit sub-op-type="add" :bizType="bizType" :visible="addFormVisible" :xm-task="xmTask" :xm-menu="xmMenu" :xm-test-case="xmTestCase" :xm-test-plan-case="xmTestPlanCase" :xm-question="xmQuestion" @cancel="addFormVisible = false"
			@add-submit="afterAddSubmit" />
	</mdp-dialog>



	<mdp-dialog title="任务明细" ref="taskDlg" fullscreen top="20px" append-to-body>
		<template #default="{ visible, data }">
			<xm-task-detail :visible="visible" :formData="data.formData" :reload="true" />
		</template>
	</mdp-dialog>

	<mdp-dialog title="缺陷明细" ref="bugDlg" fullscreen top="20px" append-to-body>

		<template #default="{ visible, data }">
			<xm-question-detail :visible="visible" :xm-question="data.formData" :reload="true" />
		</template>
	</mdp-dialog>

	<mdp-dialog title="测试用例明细" ref="caseDlg" fullscreen top="20px" append-to-body>

		<template #default="{ visible, data }">
			<xm-test-case-detail :visible="visible" :xm-test-case="data.formData" :reload="true" />

		</template>
	</mdp-dialog>

	<mdp-dialog title="执行用例明细" ref="planCaseDlg" fullscreen top="20px" append-to-body>

		<template #default="{ visible, data }">
			<xm-test-plan-case-detail :visible="visible" :xm-test-plan-case="data.formData" :reload="true" />

		</template>
	</mdp-dialog>

	<mdp-dialog title="需求明细" ref="menuDlg" fullscreen top="20px" append-to-body>
		<template #default="{ visible, data }">
			<xm-menu-detail :visible="visible" :formData="data.formData" :reload="true" />
		</template>
	</mdp-dialog>
	<mdp-dialog ref="kanbanDlg" :title="'工时看板'" fullscreen append-to-body :close-on-click-modal="false">
                <MdpTableKanban  @del="(d,cb)=>handleDel(d,0,cb)"
                @plus="(cb)=>showAdd(cb)"
                @edit="(d,cb)=>showEdit(d,cb)"
                v-model="tableDatas" 
                :columnConfigs="columnConfigs"
                itemKey="id" 
                :contentFun="(item)=>item.bizName"
                > 
                <template #toolbar="{element}">
									<div>
										<mdp-select show-style="tag" :disabled="true" v-model="element.bizType" itemCode="wlBizType" />
										&nbsp;<MdpSelect showStyle="tag" itemCode="wstatus" disabled v-model="element.wstatus"/>
									</div>
                </template>
                </MdpTableKanban>
            </mdp-dialog>
</template>

<script>
import util from '@/components/mdp-ui/js/util';//全局公共库
import config from '@/api/mdp_pub/mdp_config';//全局公共库

import { listXmWorkload, delXmWorkload, batchDelXmWorkload, editXmWorkloadSomeFields, editWorkloadToSbill } from '@/api/xm/core/xmWorkload';
import XmWorkloadEdit from './XmWorkloadEdit.vue';//新增修改界面
import { mapState } from 'pinia'
import { useUserStore } from '@/store/modules/user' 
import { MdpTableMixin } from '@/components/mdp-ui/mixin/MdpTableMixin.js'

export default {
	mixins: [MdpTableMixin],
	name: 'xmWorkloadMng',
	components: {
		XmWorkloadEdit

	},
	props: ['visible', 'queryScope'/**my/all */, 'bizType'/*报工类型1-任务，2-缺陷，3-测试用例设计，4-测试执行 */,
		'xmMenu', 'xmTestCase', 'xmQuestion', 'xmTestPlanCase', 'xmTask'],
	computed: {
		...mapState(useUserStore, ['userInfo']),
		val() {
			var params = {}
			if (this.xmTask && this.xmTask.id) {
				params.id = this.xmTask.id
				params.initWorkload = this.xmTask.initWorkload
				params.budgetWorkload = this.xmTask.budgetWorkload
				params.actWorkload = this.xmTask.actWorkload
				params.ntype = this.xmTask.ntype
				params.name = this.xmTask.name


			}
			if (this.xmMenu && this.xmMenu.menuId) {
				params.menuId = this.xmMenu.menuId
				params.initWorkload = this.xmMenu.initWorkload
				params.budgetWorkload = this.xmMenu.budgetWorkload
				params.actWorkload = this.xmMenu.actWorkload
				params.ntype = this.xmMenu.ntype
				params.dclass = this.xmMenu.dclass
				params.name = this.xmMenu.name
				params.menuName = this.xmMenu.menuName
			}
			if (this.xmQuestion && this.xmQuestion.id) {
				params.id = this.xmQuestion.id
				params.initWorkload = this.xmQuestion.initWorkload
				params.budgetWorkload = this.xmQuestion.budgetWorkload
				params.actWorkload = this.xmQuestion.actWorkload
				params.name = this.xmQuestion.name
			}
			if (this.xmTestCase && this.xmTestCase.id) {
				params.id = this.xmTestCase.id
				params.initWorkload = this.xmTestCase.initWorkload
				params.budgetWorkload = this.xmTestCase.budgetWorkload
				params.actWorkload = this.xmTestCase.actWorkload
				params.name = this.xmTestCase.caseName
				params.caseName = this.xmTestCase.caseName
			}
			if (this.xmTestPlanCase && this.xmTestPlanCase.planId) {
				params.planId = this.xmTestPlanCase.planId
				params.caseId = this.xmTestPlanCase.caseId
				params.initWorkload = this.xmTestPlanCase.initWorkload
				params.budgetWorkload = this.xmTestPlanCase.budgetWorkload
				params.actWorkload = this.xmTestPlanCase.actWorkload
				params.name = this.xmTestPlanCase.caseName
				params.caseName = this.xmTestPlanCase.caseName
			}
			if (params.budgetWorkload > 0) {
				params.rate = parseInt((params.actWorkload > 0 ? params.actWorkload : 0) / params.budgetWorkload * 100)
			} else {
				params.rate = 0
			}
			return params
		}
	},
	watch: {
		val: {
			handler() {
				this.initData();
			},
			deep: true,
		}
	},
	data() {
		return {
			filters: {
				wstatus: '',
				sstatus: '',
				taskId: '',
				userid: '',
				bizType: '',
			},

			addFormVisible: false,//新增xmWorkload界面是否显示
			addForm: {
				userid: '', username: '', ctime: '', taskId: '', cuserid: '', bizDate: '', wstatus: '', remark: '', ttype: '', id: '', sbillId: '', stime: '', sstatus: '', amt: '', samt: '', workload: '', rworkload: '', cusername: '', projectId: ''
			},

			editFormVisible: false,//编辑界面是否显示
			editForm: {
				userid: '', username: '', ctime: '', taskId: '', cuserid: '', bizDate: '', wstatus: '', remark: '', ttype: '', id: '', sbillId: '', stime: '', sstatus: '', amt: '', samt: '', workload: '', rworkload: '', cusername: '', projectId: ''
			},
			apis: {
				list: listXmWorkload,
				editSomeFields: editXmWorkloadSomeFields,
				del: delXmWorkload,
				batchDel: batchDelXmWorkload
			},
		}
	},//end data
	methods: {
		//获取列表 XmWorkload 工时登记表
		preQueryParamCheck(params) {

			if (this.queryScope) {
				params.queryScope = this.queryScope
			} 

			if (this.xmTask && this.xmTask.id) {
				params.taskId = this.xmTask.id
			}
			if (this.xmMenu && this.xmMenu.menuId) {
				params.menuId = this.xmMenu.menuId
			}
			if (this.xmQuestion && this.xmQuestion.id) {
				params.bugId = this.xmQuestion.id
			}
			if (this.xmTestCase && this.xmTestCase.id) {
				params.caseId = this.xmTestCase.id
			}
			if (this.xmTestPlanCase && this.xmTestPlanCase.planId) {
				params.planId = this.xmTestPlanCase.planId
				params.caseId = this.xmTestPlanCase.caseId
			}
			if (this.bizType) {
				if (!params.planId && !params.caseId && !params.caseId && !params.bugId && !params.taskId && !params.menuId) {
					return false;
				}
			}
			if(this.bizType=='5'){
				delete params.bizType
			}
			return true
		},

		//显示编辑界面 XmWorkload 工时登记表
		showEdit: function (row, index) {
			this.editFormVisible = true;
			this.editForm = Object.assign({}, row);
		},
		//显示新增界面 XmWorkload 工时登记表
		showAdd: function () {
			this.addFormVisible = true;
			//this.addForm=Object.assign({}, this.editForm);
		}, 
		initCurrData: function () {
			this.editForm = Object.assign(this.editForm, this.val)
			if (this.bizType && this.bizType != 'all') {
				this.filters.bizType = this.bizType || ""
			}
			this.searchTableDatas()
		},
		editSomeFieldsCheck(row, fieldName, $event, params) {
			params[fieldName]=$event
			return true
		},
		openDialog(row) {
			this.editForm = row
			if (row.bizType == '1') {
				this.$refs['taskDlg'].open({ formData: { id: row.taskId } })
			} else if (row.bizType == '2') {
				this.$refs['bugDlg'].open({ formData: { id: row.bugId } })
			} else if (this.bizType == '3') {
				this.$refs['caseDlg'].open({ formData: { id: row.caseId } })
			} else if (this.bizType == '4') {
				this.$refs['planCaseDlg'].open({ formData: { planId: row.planId,caseId:row.caseId } })
			} else if (this.bizType == '5') {
				this.$refs['menuDlg'].open({ formData: { menuId: row.menuId } })
			}
		}, 

	},//end methods
	mounted() {
	},
}

</script>

<style scoped />
