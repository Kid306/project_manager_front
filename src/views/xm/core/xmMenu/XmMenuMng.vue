<template>
  <ContentWrap>
    <template #header>
      <el-space wrap>
        <slot name="expandBtn"></slot>
        <mdp-hi-query
          :column-configs="columnConfigs"
          v-model="hiQueryParams"
          @change="onHiQueryParamsChange"
        />
        <el-button icon="zoom-out" @click="searchReset()" title="重置查询条件并查询" />

        <span v-if="currOpType == 'mng'">


          <el-popover placement="top-start" :title="'选择创建用户故事的方式'" width="300" trigger="hover">
            <el-space wrap>  
                <el-button @click="showImportFromMenuTemplate()" icon="plus">从模板快速导入故事</el-button>  
                <el-button @click="showAdd()" icon="plus">直接创建用户故事</el-button> 
            </el-space>
            <template #reference>
              <el-button v-if="isTaskCenter != '1' && isMy != '1'" type="primary" icon="plus" :title="'新建'+name" plain/>
            </template>
          </el-popover> 
          <el-button
            :disabled="
              disBtn('delBtn') ||
              !checkBtnQx('delBtn', menuDefId) ||
              sels.length === 0 ||
              load.del == true
            "  plain
            type="danger"
            v-loading="load.del"
            @click="batchDel"
            icon="delete"
          />

          <el-button @click="showParentMenu" type="warning" icon="top" title="更换上级"  plain/>

          <el-button @click="showTaskSelect()" type="success" icon="paperclip" title="将需求与任务进行关联"  plain/>
          <el-button  plain :disabled="load.edit"
            @click="loadTasksToXmMenuState"
            icon="histogram"
            title="汇总任务数据到故事，用于进度、统计等"
            v-loading="load.edit"
          /> 
        </span> 
        <mdp-export excel word @excel="export2Excel" @word="toWord"/>
        <mdp-table-configs :column-configs="columnConfigs" v-model="checkedColumns" /> 
        
        <el-button @click="showGanttChange"  title="甘特图" type="warning"  plain>甘</el-button>
        <el-button @click="$refs['kanbanDlg'].open()" type="primary" plain>板</el-button> 
        
      <mdp-select v-if="simple==undefined"
        itemCode="demandSource"
        v-model="filters.source"
        placeholder="需求来源"
        clearable
      />  
      
      <mdp-select :options="[{id:'son',name:'直属下级 只查询指定上级的直接下级'},{id:'grandson',name:'所有下级 查询指定上级的所有子孙辈'}]"
        title="当指定某个上级时，是否查该上级的儿子、孙子等所有下级节点" 
        v-model="filters.childQryType"
        placeholder="子孙"
        clearable
      />  
			  <MdpSelectTag v-model="filters.tagIdList" placeholder="标签" multiple/>  
        <span v-if="currOpType == 'select' && multiple == true">
          <el-button 
            :disabled=" sels.length === 0"
            type="primary"
            @click="selectListConfirm"
            icon="check"
            >确认选择</el-button
          >
        </span>
      </el-space>
    </template>
    <el-space wrap>
      <xm-product-select
        ref="xmProductSelect1"
        v-if="(!xmProduct || !xmProduct.id) && (!xmIteration || !xmIteration.id)"
        
        :link-project-id="selProject ? selProject.id : null"
        @change2="onProductSelected"
        :iterationId="xmIteration ? xmIteration.id : null"
        @clear="onProductClearSelect"
      />
      <xm-iteration-select
        v-if="!xmIteration?.id && product?.id "
				v-model="filters.iterationId" 
        :xm-product="product"
        :link-project-id="selProject ? selProject.id : null"
        placeholder="迭代"
        @change2="onIterationSelected"
        @clear="onIterationClearSelect"
      />
      <el-select
        title="按是否加入过迭代进行过滤"
        style="width: 120px"
        v-model="filters.iterationFilterType"
        placeholder="迭代？"
        clearable
      >
        <el-option value="not-join-any-iteration" label="未加入过迭代" />
        <el-option value="join-any-iteration" label="已加入过迭代" />
        <el-option
          value="not-join-curr-iteration"
          :label="'未加入迭代【' + iteration.iterationName + '】'"
          v-if="iteration && iteration.id"
        />
        <el-option
          value="join-curr-iteration"
          :label="'已加入本迭代【' + iteration.iterationName + '】'"
          v-if="iteration && iteration.id"
        />
      </el-select>
      <el-select
        title="按是否分配了任务进行过滤"
        style="width: 120px"
        v-model="filters.taskFilterType"
        placeholder="任务？"
        clearable
      >
        <el-option value="not-join-any-project" label="未分配过任务的需求" />
        <el-option value="join-any-project" label="已分配过任务的需求" />
        <el-option
          value="not-join-curr-project"
          :label="'未分配任务到项目【' + selProject.name + '】'"
          v-if="selProject && selProject.id"
        />
        <el-option
          value="join-curr-project"
          :label="'已分配任务到项目【' + selProject.name + '】'"
          v-if="selProject && selProject.id"
        />
      </el-select> 
      <xm-user-select :xm-product="product" :sel-project="project"
        label="选择责任人"
        v-model="filters.mmUserid"
        :clearable="true"
        placeholder="责任人"
      />
      <mdp-select v-if="simple==undefined"
        v-model="filters.priority"
        placeholder="优先级"
        clearable 
        itemCode="priority"
      /> 
      <el-input
        v-model="filters.menuName"
        style="max-width: 8em"
        placeholder="需求名称查询"
        clearable
      />
      <el-button
        type="primary"
        v-loading="load.list"
        :disabled="load.list == true"
        @click="searchTableDatas"
        plain
        icon="search"
      />
    </el-space>
  </ContentWrap> 
  
  <mdp-lr-box :lspan="lspan" :expand="expand" v-adaptive="{bottom:50}">
            <template #left>
    <el-table @cell-click="cellClick"
    :header-row-style="{height:'50px'}"
      element-loading-text="努力加载中"
      element-loading-spinner="loading"  
      stripe
      fit
      border
      ref="table"
      v-adaptive="{bottom:50,disabled:ganttVisible}"
      :data="tableDatas"
      current-row-key="menuId"
      row-key="menuId"
      @sort-change="sortChange"
      highlight-current-row
      v-loading="load.list"
      @selection-change="selsChange"
      @row-click="rowClick"
    >
      <el-table-column sortable type="selection" width="40" v-if="currOpType=='mng'||multiple"/>

      <el-table-column :fixed="ganttVisible?false:'left'" prop="menuName" :label="queryScope=='story'?'故事名称':'史诗/特性/故事'" min-width="350" col-prefix="res." sortable>
 						<template #default="scope">
							<el-popover placement="right-start"
								:width="deriveId?150:250" :show-after="200"
 							>
							<template #reference>
								<el-link @click="showEdit(scope.row)">
                  <div v-if="!ganttVisible"> 
                      <icon icon="ep:promotion" v-if="scope.row.dclass == '1'"/> 
                      <icon icon="ep:flag" v-if="scope.row.dclass == '2'"/>  
                      <icon icon="ep:document" v-if="scope.row.dclass == '3'"/>  
                    {{ scope.row.seqNo||(scope.$index+1) }} &nbsp; {{ scope.row.menuName }}
                    
                  </div>
                  
                  <el-text v-else truncated style="max-width:350px;"> 
                      <icon icon="ep:promotion" v-if="scope.row.dclass == '1'"/> 
                      <icon icon="ep:flag" v-if="scope.row.dclass == '2'"/>  
                      <icon icon="ep:document" v-if="scope.row.dclass == '3'"/>  
                    {{ scope.row.seqNo||(scope.$index+1) }} &nbsp; {{ scope.row.menuName }} 
                  </el-text>
                </el-link>
							</template>
							<template #default>
              <el-button @click="showAddDerive(scope.row)" icon="plus" type="primary" :title="'以此作为前置创建新的故事'"/>
								<el-button @click="copy2(scope.row, scope.$index)" icon="document-copy" type="warning" title="复制一行除了主键不一样，其它都一样的数据"/>
              <el-button v-if="!deriveId" @click="showDerive(scope.row)" icon="share" type="success" title="在整个产品范围内查找所有依赖关系">依赖分析</el-button>

								</template>
							</el-popover> 
						</template>
      </el-table-column>
      <el-table-column
        prop="mmUsername"
        label="负责人"
        min-width="120"
        show-overflow-tooltip
        sortable
      >
        <template #default="scope">
          <xm-user-select
            show-style="tag"
            :xm-product="product" :sel-project="project"
            v-model="scope.row.mmUserid"
            :init-name="scope.row.mmUsername"
            @change2="editSomeFields(scope.row, 'mmUserid', $event)"
          />
        </template>
      </el-table-column>
      <el-table-column prop="startTime" sortable col-type="date" label="起始时间" width="200"  colType="date" >
        <template #default="scope">
          <mdp-date-range show-style="tag" v-model="scope.row" start-key="startTime" end-key="endTime" 
            @change="editSomeFields(scope.row, 'startTime', $event)" /> 
        </template>
      </el-table-column> 
 
      <el-table-column prop="phaseId" label="前置故事" width="120" show-overflow-tooltip  sortable>
              <template #default="scope"> 
                <el-popover width="200px">
                  <template #reference>
                    <el-link   @click="()=>{editForm=scope.row;$refs['preStoryDlg'].open()}">{{ scope.row.phaseId||'无前置' }}</el-link>
                  </template>
                  <el-space>
                    <el-button  type="primary" @click="()=>{editForm=scope.row;$refs['preStoryDlg'].open()}">
                      {{scope.row.phaseId?'修改前置':'设置前置'}}
                    </el-button>
                    <el-button type="warning" v-if="scope.row.phaseId" @click="()=>{editForm=scope.row;editSomeFields(scope.row,'phaseId','')}">
                      清除前置
                    </el-button>
                  </el-space>
                </el-popover>
                  </template>
              </el-table-column>
      <el-table-column prop="finishRate" label="进度" width="80" show-overflow-tooltip sortable>
        <template #default="scope">
          <span
            :style="{ borderRadius: '30px', color: scope.row.finishRate >= 100 ? 'green' : 'blue' }"
          >
            {{ (scope.row.finishRate != null ? scope.row.finishRate : 0) + '%' }}
          </span>
        </template>
      </el-table-column>
      <el-table-column prop="status" label="状态" width="120" sortable  itemCode="menuStatus">
        <template #default="scope">
          <mdp-select
            show-style="tag"
            
            itemCode="menuStatus"
            v-model="scope.row.status"
            label="需求状态"
            @change="editSomeFields(scope.row, 'status', $event)"
          />
        </template>
      </el-table-column>
      <el-table-column prop="priority" label="优先级" width="120" sortable itemCode="priority">
        <template #default="scope">
          <mdp-select
            show-style="tag"
            
            itemCode="priority"
            v-model="scope.row.priority"
            placeholder="优先级" 
            @change="editSomeFields(scope.row, 'priority', $event)"
          />
        </template>
      </el-table-column>
      <el-table-column prop="dtype" label="类型" width="120" sortable v-if="false" itemCode="demandType">
        <template #default="scope">
          <mdp-select
            show-style="tag"
            
            itemCode="demandType"
            v-model="scope.row.dtype"
            placeholder="类型" 
            @change="editSomeFields(scope.row, 'dtype', $event)"
          />
        </template>
      </el-table-column>
      

      <el-table-column sortable prop="tagNames" label="标签" width="120" >
        <template #default="scope">
          <mdp-select-tag multiple show-style="tag" v-model="scope.row.tagIds" :initName="scope.row.tagNames" split=","
            @change2="editSomeFields(scope.row, 'tagIds', $event)" /> 
        </template>
        </el-table-column>
      <el-table-column
        prop="source"
        label="来源"
        width="120"
        show-overflow-tooltip
        sortable 
        itemCode="demandSource" 
      >
        <template #default="scope">
          <mdp-select
            show-style="tag"
            
            itemCode="demandSource"
            v-model="scope.row.source"
            placeholder="来源"
            @change="editSomeFields(scope.row, 'source', $event)"
          />
        </template>
      </el-table-column>
      <el-table-column prop="dlvl" label="层次" width="120" sortable itemCode="demandLvl">
        <template #default="scope">
          <mdp-select
            show-style="tag"
            
            itemCode="demandLvl"
            v-model="scope.row.dlvl"
            placeholder="层次" 
            @change="editSomeFields(scope.row, 'dlvl', $event)"
          />
        </template>
      </el-table-column>
      <el-table-column prop="iterationId" label="迭代" width="150" show-overflow-tooltip sortable kbName="iterationName">
        <template #default="scope"> 
            {{ scope.row.iterationName }} 
        </template>
      </el-table-column>

      <el-table-column prop="taskCnt" label="任务数" min-width="100" show-overflow-tooltip sortable>
        <template #header>
          <el-tooltip content="已完成 / 总数 注意：统计包括下级数据"
            ><span>任务数</span></el-tooltip
          >
        </template>
        <template #default="scope">
          <div>{{ scope.row.taskFinishCnt }}/{{ scope.row.taskCnt }}</div>
        </template>
      </el-table-column>

      <el-table-column
        prop="budgetWorkload"
        label="工时"
        min-width="100"
        show-overflow-tooltip
        sortable
      >
        <template #default="scope">
          <span title="实际工时 / 预算工时 或者 (剩余工时+实际工时)"
            >{{ scope.row.actWorkload }} &nbsp;/ &nbsp;{{ scope.row.budgetWorkload }}h
          </span>
        </template>
      </el-table-column>
      <el-table-column prop="bugCnt" label="缺陷数" min-width="100" show-overflow-tooltip sortable>
        <template #header>
          <el-tooltip content="已关闭缺陷数 / 总缺陷数 注意：统计包括下级数据"
            ><span> 缺陷 </span></el-tooltip
          >
        </template>
        <template #default="scope"> {{ scope.row.closedBugs }}/{{ scope.row.bugCnt }} </template>
      </el-table-column>
      <el-table-column prop="tagNames" label="标签" min-width="150" show-overflow-tooltip  sortable>
        <template #default="scope">
          <MdpSelectTag showStyle="tag" :init-name="scope.row.tagNames" v-model="scope.row.tagIds" multiple split="," disabled/>
        </template>
      </el-table-column>
      <el-table-column prop="productId" label="产品" width="120" show-overflow-tooltip sortable  col-prefix="res."/>

      <el-table-column prop="proposerName" label="提出人名称" min-width="150" show-overflow-tooltip sortable/>
      <el-table-column prop="startTime" label="开始时间" min-width="150" show-overflow-tooltip sortable colType="date"/>
      <el-table-column prop="endTime" label="结束时间" min-width="150" show-overflow-tooltip sortable colType="date"/>

      <el-table-column prop="budgetWorkload" label="预估工时"  width="120" show-overflow-tooltip sortable/> 

			<el-table-column prop="actWorkload" label="实际工时"  width="120" show-overflow-tooltip sortable/> 
					
      <el-table-column prop="proposerId" label="提出人编号" min-width="150" show-overflow-tooltip sortable/>
      
      <el-table-column prop="seqNo" label="排序序号" min-width="150" show-overflow-tooltip sortable/>
      <el-table-column prop="remark" label="需求详情" min-width="150" show-overflow-tooltip sortable/>
      
      <template v-if="currOpType=='select' && multiple!==true">
        
      <el-table-column label="操作" min-width="100" fixed="right">
        <template #default="scope"> 
          <el-button @click="selectConfirm(scope.row)" type="primary">选择</el-button>
        </template>
      </el-table-column>

      </template>
    </el-table> 
    </template>
    <template #default>
          <XmTaskGantt :gantt-id="'menu'+(deriveId||'deriveId')" @dateChange="(t,start,end,callback)=>onGanttDateChange(t,start,end,callback)" v-if="ganttVisible " @show-left="expand=$event"   v-model="tableDatas" :columnMap="{id:'menuId',name:'menuName',dependencies:'phaseId',start:'startTime',end:'endTime',progress:'finishRate',hours:'budgetWorkload'}" :ganttCfg="{header_height:40,bar_height: 24}" 
            @barClick="(t,cb)=>showEditForCallback(t,callback)"
            />
        </template>

    </mdp-lr-box>
    <el-pagination
      layout="total, sizes, prev, pager, next"
      @current-change="handleCurrentChange"
      @size-change="handleSizeChange"
      :page-sizes="[10, 20, 50, 100, 500]"
      :current-page="pageInfo.pageNum"
      :page-size="pageInfo.pageSize"
      :total="pageInfo.total"
      style="float: right"
    /> 
  
  <!--编辑 XmMenu xm_project_menu界面-->
  <mdp-dialog ref="kanbanDlg"
    title="看板"  
    fullscreen  
  > 
    <MdpTableKanban @del="(d,cb)=>handleDel(d,0,cb)"
      @plus="(cb)=>showAdd(cb)"
      @edit="(d,cb)=>showEdit(d,cb)"
      v-model="tableDatas" 
      :columnConfigs="columnConfigs"
      itemKey="menuId" 
      :contentFun="(item)=>item.menuName"
    > 
    <template #toolbar="{element}">
      <MdpSelect showStyle="tag" itemCode="menuStatus" disabled v-model="element.status"/>
    </template>
    </MdpTableKanban>
  </mdp-dialog>
  <!--编辑 XmMenu xm_project_menu界面-->
  <mdp-dialog ref="editDialog"
    title="编辑故事" 
    :with-header="false"
    fullscreen 
    append-to-body
    :close-on-click-modal="false"
  > 
  <template #default="{visible,data,dialog}">
    <XmMenuEdit
      subOpType="edit"
      :visible="visible"
      :parent-menu="parentMenu"
      :formData="data.formData" 
      @cancel="dialog.close()"
      @submit="data.callback($event)"
      @edit-fields="data.callback($event)"
    />
    </template>
  </mdp-dialog>

  <!--新增 XmMenu xm_project_menu界面-->
  <mdp-dialog ref="addDialog"
    title="新增故事" fullscreen
  >
  <template #default="{visible,data,dialog}">
    <XmMenuAdd
      :visible="visible"
      :parent-menu="parentMenu"
      :formData="data.formData"
      @cancel="dialog.close()"
      @submit="data.callback"
    />
    </template>
  </mdp-dialog>
  <mdp-dialog
    title="需求模板"
    v-model="templateVisible"
    width="80%"
    append-to-body
    :close-on-click-modal="false"
  >
    <xm-menu-tree  subOpType="select"
      multiple isTpl 
      showConfirm
      @cancel="templateVisible = false"
      @select="onSelectedMenuTemplates"
    />
  </mdp-dialog> 
  <mdp-dialog ref="taskSelectDlg"
    title="选中任务" 
    width="80%"
    append-to-body
    :close-on-click-modal="false"
  >
    <XmTaskBox
      :xm-product="product"
      :sel-project="selProject"
      multiple
      @select="onSelectedTasks"
    />
  </mdp-dialog>   
  <mdp-dialog ref="parentDlg"
    append-to-body
    title="选择上级需求" 
    width="60%"
    :close-on-click-modal="false"
  >
    <XmEpicFeatures subOpType="select" showConfirm @select="onParentMenuSelected" :xm-product="product" />
  </mdp-dialog>
  
  <mdp-dialog ref="preStoryDlg"
    append-to-body
    title="选择前置故事" 
    width="85%"
    :close-on-click-modal="false"
  >
    <XmMenuBox subOpType="select" multiple showConfirm @select="onPreStorySelect" :xm-product="product" :xmIteration="iteration"/>
  </mdp-dialog>
  <mdp-dialog ref="deriveDlg"
    append-to-body
    title="全局依赖关系分析"  fullscreen
    :close-on-click-modal="false"
  >
    <template #default="{visible,data}">
      <XmMenuBox v-if="visible" :key="data.menuId" :deriveId="data.menuId" subOpType="mng" :xm-product="product" :xmIteration="iteration"/>
    </template>
  </mdp-dialog>
  <mdp-dialog ref="funcDlg"
    append-to-body
    title="模块选择" 
    size="40%"
    top="20px"
    :close-on-click-modal="false"
  >
    <xm-func-tree showConfirm
      subOpType="mng"
      @select="onFuncSelected"
      :xm-product="xmProductCpd"
    />
  </mdp-dialog>
</template>

<script>
import util from '@/components/mdp-ui/js/util' //全局公共库
import treeTool from '@/components/mdp-ui/js/treeTool' //全局公共库
//import Sticky from '@/components/Sticky' // 粘性header组件

import {
  deriveList,
  listXmMenu,
  delXmMenu,
  addXmMenu,
  batchDelXmMenu,
  batchAddXmMenu,
  batchEditXmMenu,
  listXmMenuWithState,
  listXmMenuWithPlan,
  batchChangeParentMenu,
  editXmMenuSomeFields
} from '@/api/xm/core/xmMenu'
import { batchRelTasksWithMenu } from '@/api/xm/core/xmTask'
import { loadTasksToXmMenuState } from '@/api/xm/core/xmMenuState'

import { batchDelXmIterationMenu, batchAddXmIterationMenu } from '@/api/xm/core/xmIterationMenu'
 

import { sn } from '@/components/mdp-ui/js/sequence'

import { mapState } from 'pinia'
import { useUserStore } from '@/store/modules/user'

import { MdpTableMixin } from '@/components/mdp-ui/mixin/MdpTableMixin.js'

export default {
  mixins: [MdpTableMixin],
  props: ['xmIteration', 'xmProduct', 'disabledMng', 'parentMenu', 'selProject','simple','queryScope','deriveId'],//queryScope:'ep/story'
  computed: {
    ...mapState(useUserStore, ['userInfo', 'roles']),
    toSearchCpd() {
      var key = { iterationId: '', projectId: '', productId: '', pmenuId: '' }
      if (this.xmIteration && this.xmIteration.id) {
        key.iterationId = this.xmIteration.id
        key.productId = this.xmIteration.productId
      } else {
        key.iterationId = ''
      }
      if (this.xmProduct && this.xmProduct.id) {
        key.productId = this.xmProduct.id
      } else {
        key.productId = ''
      }
      if (this.selProject && this.selProject.id) {
        key.projectId = this.selProject.id
      } else {
        key.projectId = ''
      }

      // if (this.parentMenu && this.parentMenu.menuId) {
      //   key.pmenuId = this.parentMenu.menuId
      //   key.productId = this.parentMenu.productId
      // } else {
      //   key.pmenuId = ''
      // }
      return key.iterationId + key.projectId + key.productId + key.pmenuId
    },
    xmProductCpd() {
      if (this.product && this.product.id) {
        return this.product
      }
      if (this.xmIteration && this.xmIteration.id) {
        return { id: this.xmIteration.productId, productName: this.xmIteration.productName }
      }
      if (this.parentMenu && this.parentMenu.menuId) {
        return { id: this.parentMenu.productId, productName: this.parentMenu.productName }
      }
      return {}
    }
  },
  watch: {
    xmIteration: function () {
      this.iterationFilterType = 'join-curr-iteration'
      this.iteration = this.xmIteration
    },
    xmProduct: function () {
      this.product = this.xmProduct
    },
    toSearchCpd() {
      
      this.searchTableDatas()
    }
  },
  data() { 
    return {
      pkNames:['menuId'],
      currOpType: 'mng', 
      filters: {
        key: '',   
        iterationFilterType: '', //join、not-join、''
        taskFilterType: '', //join、not-join、''
        tagIdList: [],
        status: '', 
        dlvl: '',
        dtype: '',
        priority: '',
        source: '',
        menuId: '', //需求编号
        productId: '', //产品编号
        planStartTimeStart: '',
        planStartTimeEnd: '',
        planEndTimeStart: '',
        planEndTimeEnd: '',
        menuName: '',
        dclass:'3',
        childQryType:'grandson',// son-只查询儿子一级，grandson-查询子孙等所有下级
      }, 
      pageInfo: {
        //分页数据
        total: 0, //服务器端收到0时，会自动计算总记录数，如果上传>0的不自动计算。
        pageSize: 20, //每页数据
        count: true, //是否需要重新计算总记录数
        pageNum: 1, //当前页码、从1开始计算
        orderFields: ['res.ctime'], //排序列 如 ['sex','student_id']，必须为数据库字段
        orderDirs: ['desc'] //升序 asc,降序desc 如 性别 升序、学生编号降序 ['asc','desc']
      }, 
      displayType: 'table', 
      apis: {
        list: listXmMenuWithState,
        add: addXmMenu,
        del: delXmMenu,
        batchDel: batchDelXmMenu,
        editSomeFields: editXmMenuSomeFields
      },
      templateVisible: false,
      product:null,
      project:null,
      iteration: null,
        
      expand:true,
      lspan:24,
      ganttVisible: false,
    }
  }, //end data
  methods: {
    initCurrData(){
      if(this.deriveId){
        this.apis.list=deriveList
      } 
      this.searchTableDatas()
    },
    preQueryParamCheck(params) { 
      
      if (this.iterationFilterType) {
        params.iterationFilterType = this.iterationFilterType 
      } else {
        if (this.iteration) {
          params.iterationId = this.iteration.id
        }
      }
      if (params.iterationFilterType === 'not-join-any-iteration') { 
        delete params.iterationId
      } else if (params.iterationFilterType === 'join-any-iteration') {  
        delete params.iterationId
      } else if (params.iterationFilterType === 'not-join-curr-iteration') {
        params.filterIterationId = this.iteration?.id||this.xmIteration?.id
        delete params.iterationId
      } else if (params.iterationFilterType === 'join-curr-iteration') {
        params.filterIterationId = this.iteration?.id||this.xmIteration?.id
      }
      if (this.xmIteration && this.xmIteration.id) {
        params.linkIterationId = this.xmIteration.id
      }
      if (params.taskFilterType) { 
        if (params.taskFilterType === 'not-join-curr-project') {
          params.projectId = this.selProject.id
        }
        if (params.taskFilterType === 'join-curr-project') {
          params.projectId = this.selProject.id
        } 
      }
      if (this.selProject && this.selProject.id) {
        params.linkProjectId = this.selProject.id
      }
      if (this.product) {
        params.productId = this.product.id
      }
      if (this.parentMenu && this.parentMenu.menuId) {
        if(params.childQryType=='grandson'){
          params.pidPathsLike=this.parentMenu.pidPaths
          params.menuId='!='+this.parentMenu.menuId
          delete params.pmenuId
        }else{
          params.pmenuId = this.parentMenu.menuId
        }
        
      }else{
        params.pmenuId=''
      }
      if(this.queryScope=='story'){
        params.dclass=">2"
      } 
      if(this.deriveId){
        params.menuId=this.deriveId
      }
      return true
    },

    //显示编辑界面 XmMenu xm_project_menu
    showEdit: function (row,callback) {
      this.$refs['editDialog'].open({formData:row,callback:(f)=>{
        
        Object.assign(row,f)
        if(callback){
          callback(row)
        }
      }})
    },
    //显示新增界面 XmMenu xm_project_menu
    showAdd: function (callback) {
      
      var formData = {   }
      if (this.product && this.product.id) {
        formData.productId = this.product.id
        formData.productName = this.product.productName
        formData.dclass = '3'
      }
      if (this.iteration && this.iteration.id) {
        formData.productId = this.iteration.productId
        formData.iterationId = this.iteration.id
        formData.iterationName = this.iteration.iterationName
        formData.dclass = '3'
      }
      if(this.parentMenu){
        formData.pmenuId=this.parentMenu.menuId
        formData.productId=this.parentMenu.productId||formData.productId
        formData.productName=this.parentMenu.productName||formData.productName
        formData.iterationId=this.parentMenu.iterationId||formData.iterationId
      }
      if (!formData.productId) { 
        this.$notify({
          position: 'bottom-left',
          showClose: true,
          message: '请先选择一个产品',
          type: 'warning'
        })
        return;
      } 
      this.$refs.addDialog.open({formData:formData,callback:(res)=>{
        
        if(callback){
          callback(res)
        }
        this.searchTableDatas()
      }})
      //formData=Object.assign({}, this.editForm);
    },
    onProductSelected: function (product) {
      this.product = product
      this.filters.iterationId=''
    },
    onProductClearSelect: function () {
      this.product = null
      this.filters.iterationId=''
    },
    onIterationSelected: function (iteration) {
      this.iteration = iteration
    },
    onIterationClearSelect: function () {
      this.iteration = null
    }, 

    showImportFromMenuTemplate() {
      if (!this.product) {
        this.$notify.warning('请选择产品')
        return
      }
      //this.parentMenu=row
      this.templateVisible = true
    },
    onSelectedMenuTemplates: function (menuTemplates) {
      if (menuTemplates == null || menuTemplates.length == 0) {
        this.templateVisible = false
        return
      } 
      if(this.parentMenu?.menuId){
        if(this.parentMenu.dclass=='1'){
          let ms=menuTemplates.filter(k=>k.dclass<='1')
          if(ms.length>0){
            this.$message.error("【"+ms.map(k=>k.menuName).join(",")+"】为史诗，不能导入到同为史诗的【"+this.parentMenu.menuName+"】中，请选中特性或者用户故事进行导入")
            return;
          }
        }else if(this.parentMenu.dclass=='2'){
          let ms=menuTemplates.filter(k=>k.dclass<='2')
          if(ms.length>0){
            this.$message.error("【"+ms.map(k=>k.menuName).join(",")+"】为史诗/特性，不能导入到特性【"+this.parentMenu.menuName+"】中，请选中用户故事进行导入")
            return;
          }
        }else if(this.parentMenu.dclass>'2'){
          this.$message.error("不允许导入任何需求到到故事【"+this.parentMenu.menuName+"】中") 
          return;
        } 
      }

      let msg="将导入"+menuTemplates.length+"个需求到产品【"+this.product.productName+"】中【根目录】下，确认提交吗？"
      if(this.parentMenu?.menuId){
        msg="将导入"+menuTemplates.length+"个需求到产品【"+this.product.productName+"】中的【"+this.parentMenu.menuName+"】下，确认提交吗？"
      }
      this.$confirm(msg, '提示', {}).then(() => {

        var menuTemplates2 = JSON.parse(JSON.stringify(menuTemplates)) 
        let pmenuId=this.parentMenu?.menuId||'0' 
        let productId=this.parentMenu?.menuId?this.parentMenu.productId:this.product.id
        var params={xmMenus:menuTemplates2,pmenuId:pmenuId,productId: productId}
        batchAddXmMenu(params)
          .then((res) => {
            this.templateVisible = false
            this.load.add = false
            var tips = res.tips 
            if(tips.isOk){
              this.$emit('import-template')
            }
              this.$notify({
                position: 'bottom-left',
                showClose: true,
                message: tips.msg,
                type: tips.isOk?'success':'error'
              }) 
          })
          .catch((err) => (this.load.add = false))

      })
     
    },


    onSelectedTasks: function (xmTasks) {
      if (xmTasks == null || xmTasks.length == 0) {
        this.$notify.error('请最少选择一个任务进行关联')
        return
      }

      this.selectTaskVisible = false
      var params = {
        menuId: this.sels[0].menuId,
        taskIds: xmTasks.map((i) => i.id)
      }
      batchRelTasksWithMenu(params).then((res) => {
        var tips = res.tips
        if (tips.isOk) { 
          this.$refs['taskSelectDlg'].close()
        }
        this.$notify({
          position: 'bottom-left',
          showClose: true,
          message: tips.msg,
          type: tips.isOk ? 'success' : 'error'
        })
      })
    },

    loadTasksToXmMenuState: function () {
      if (!this.product) {
        if (!this.iteration) {
          this.$notify.warning('请先选择产品或者迭代')
          return
        }
      }
      this.load.edit = true
      let params = { productId: '' }
      if (!this.product) {
        params.productId = this.iteration.productId
      } else {
        params = { productId: this.product.id }
      }

      loadTasksToXmMenuState(params)
        .then((res) => {
          this.load.edit = false
          var tips = res.tips
          if (tips.isOk) {
            this.pageInfo.count = true 
            this.searchTableDatas()
          }
          this.$notify({
            position: 'bottom-left',
            showClose: true,
            message: tips.msg,
            type: tips.isOk ? 'success' : 'error'
          })
        })
        .catch((err) => (this.load.edit = false))
    },
    onGroupUserSelect(users, option) {
      this.editSomeFields(option.data, 'mmUserid', users)
    },
    showParentMenu() {
      if (this.product && this.product.id) {
        if (this.sels.length == 0) {
          this.$notify({
            position: 'bottom-left',
            showClose: true,
            message: '请先选择一个或者多个需求',
            type: 'warning'
          })
          return
        }
      } else {
        this.$notify({
          position: 'bottom-left',
          showClose: true,
          message: '请先选择产品',
          type: 'warning'
        })
        return
      }
      this.$refs['parentDlg'].open()
    },
    onParentMenuSelected(menu) {
      if (!menu || !menu.menuId) {
        this.$notify({
          position: 'bottom-left',
          showClose: true,
          message: '请先选择一个上级需求',
          type: 'warning'
        })
        return
      } 
      var params =  this.sels.map((i) => { return {menuId:i.menuId,pmenuId:menu.menuId}})
      batchChangeParentMenu(params).then((res) => {
        var tips = res.tips
        if (tips.isOk) {
          this.searchTableDatas()
          this.$refs['parentDlg'].close()
        }
        this.$notify({
          position: 'bottom-left',
          showClose: true,
          message: tips.msg,
          type: tips.isOk ? 'success' : 'error'
        })
      })
    }, 
    calcMenuLabel(dclass) {
      var params = { label: '工作项', icon: '', color: '' }
      if (dclass === '1') {
        params = { label: '史诗', icon: 'promotion', color: 'rgb(255, 153, 51)' }
      } else if (dclass === '2') {
        params = { label: '特性', icon: 'flag', color: 'rgb(0, 153, 51)' }
      } else if (dclass === '3') {
        params = { label: '用户故事', icon: 'document', color: ' rgb(79, 140, 255)' }
      }
      return params
    }, 
    editSomeFieldsCheck(row, fieldName, $event,params) { 
      if (fieldName === 'iterationId') {
        if ($event) {
          params[fieldName] = $event.id
          params.iterationName = $event.iterationName
        } else {
          return
        }
      } else if (fieldName === 'tagIds') {
        if ($event) {
          params[fieldName] = $event.map((i) => i.tagId).join(',')
          params.tagNames = $event.map((i) => i.tagName).join(',')
        } else {
          return
        }
      } else if (fieldName === 'workload') {
        params = { ...params, ...$event }
      } else if (fieldName === 'mmUserid') {
        params.mmUserid = $event.userid
        params.mmUsername = $event.username
      } else if(fieldName=='startTime'){
        Object.assign(params,$event)
      } else {
        params[fieldName] = $event
      }
      return true
    }, 
    showTaskSelect(){
      if(this.sels.length<=0){
        this.$message.error("请先选择1个需要关联任务的用户故事")
        return;
      }
      
      if(this.sels.length>1){
        this.$message.error("一次只能选择1个需要关联任务的用户故事")
        return;
      }
      this.$refs['taskSelectDlg'].open()
    },
    onEditSomeFields(params) {
      Object.assign(this.editForm, params)
    }, 
 
    showGanttChange(){
      this.ganttVisible=!this.ganttVisible
      if(this.ganttVisible==false){
        this.lspan=24
        this.expand=true
      }else{
        this.lspan=8
        this.expand=true
      }
    },
    onGanttDateChange(t,start,end,callback){
      
      let d=this.tableDatas.find(k=>k.menuId==(t.menuId||t.id))
      this.editForm=d
      let startTime=this.$mdp.formatDate(start,'YYYY-MM-DD HH:mm:ss')
      let endTime=this.$mdp.formatDate(end,'YYYY-MM-DD HH:mm:ss')
      this.editSomeFields(this.editForm,'startTime',{startTime:startTime,endTime:endTime,callback})
    }, 
    onPreStorySelect(storys){
      if(storys && storys.length>3){
        this.$message.error('最多选3个故事')
        return;
      }
      if(this.sels.length>0){
        if(this.sels.some(s=>storys.some(k=>k.menuId==s.menuId))){
          this.$message.error('不能选自己作为前置')
          return;
        }
      }else{
        if(storys.some(k=>k.menuId==this.editForm.menuId)){ 
          this.$message.error('不能选自己作为前置')
          return;
        }
      }

      this.editSomeFields(this.editForm,'phaseId',storys.map(k=>k.menuId).join(","))
      this.$refs['preStoryDlg'].close()
    },
    showEditForCallback(t,callback){ 
      this.showEdit(t,callback)

    },
    toWord(){

      let htmlList=this.tableDatas.map((k,index)=>{
        if(!k.lvl){
          k.lvl=k.pidPaths.split(",").length
        }
        let dclassName=k.dclass=='3'?('故事'):(k.dclass=='2'?'特性':'史诗')
        let html=`<h${k.lvl}>${dclassName}:${k.seqNo} ${k.menuName}</h${k.lvl}>
        <p>需求编号: ${k.menuId} 上级编号: ${k.pmenuId}</p>
        <p>详情：</p>
        <p>
          ${k.remark} 
        </p>
        `
        return html;
      })
      let all=''
      let p=this.parentMenu
      if(this.parentMenu?.menuId){
        if(!p.lvl){
          p.lvl=p.pidPaths.split(",").length
        }
        let parentDclassName=p.dclass=='3'?('故事'):(p.dclass=='2'?'特性':'史诗')
        all=`
        <h${p.lvl}>${parentDclassName}:${p.seqNo} ${p.menuName}</h${p.lvl}>
        <p>需求编号: ${p.menuId} 上级编号: ${p.pmenuId}</p>
        <p>说明: ${p.remark}</p> 
        <p>子需求：</p>
        ${htmlList.join('\n')}
        `
      }else{
        all=htmlList.join("\n")
      }
     this.html2Word(all)
    },
    showAddDerive(row){ 
      var formData = { ...row,phaseId:row.menuId,menuId:null }   
      this.$refs.addDialog.open({formData:formData,callback:(res)=>{
        this.searchTableDatas()
      }})
    }, 
    showDerive(row){
      this.editForm=row
      this.$refs.deriveDlg.open(row)
    },
  }, //end methods
  components: { 
		XmMenuAdd: defineAsyncComponent( ()=>import("./XmMenuAdd.vue")),
		XmMenuEdit: defineAsyncComponent( ()=>import("./XmMenuEdit.vue")),  

  },
  mounted() {
    this.product = this.xmProduct
    if (this.xmProduct && this.xmProduct.id) {
      this.productVisible = false
    }

    if (this.xmIteration && this.xmIteration.id) {
      this.filters.iterationFilterType = 'join-curr-iteration'
      this.iteration = this.xmIteration
    }
    this.project=this.selProject
  }
}
</script>

<style lang="scss" scoped> 
</style> 
