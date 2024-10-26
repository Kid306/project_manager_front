<template>
  <ContentWrap> 
    <template #header>
      <el-space wrap>
        <slot name="expandBtn">
          <!--展开或者收起的按钮-->
        </slot>
        <mdp-hi-query
          :column-configs="columnConfigs"
          v-model="hiQueryParams"
          @change="onHiQueryParamsChange"
        />
        <el-button icon="zoom-out" @click="searchReset()" title="重置查询条件并查询" />
        <span v-if="currOpType=='mng'">



        <el-button @click="showParentTaskList" :title="'更换'+name+'的上级，实现'+name+'搬家功能'" icon="top" v-loading="load.edit" />
          <el-button type="danger" v-if="isTaskCenter != '1' && isMy != '1'" @click="batchDel" v-loading="load.del"
            icon="delete" title="批量删除" plain /> 

 
          <el-button v-if="queryScope!='plan'" @click="openStorySelect('link')" type="success" icon="paperclip" title="将需求与任务进行关联"  plain/>
 
        </span>


        <mdp-export excel word @excel="export2Excel" @word="toWord"/>
        <mdp-table-configs :column-configs="columnConfigs" v-model="checkedColumns" /> 
 
          <el-popover placement="top-start" :title="'选择创建'+name+'的方式'" width="300" trigger="hover" :show-after="200">
            <el-space wrap v-if="queryScope=='task'">  
                <el-button   @click="openStorySelect('ctask')"
                  icon="plus">由用户故事快速创建{{ name }}(推荐)</el-button> 
                <el-button @click="showTaskTemplate" icon="plus">从模板项目快速导入{{ name }}</el-button>  
                <el-button @click="showAdd()" icon="plus">直接创建{{ name }}</el-button> 
            </el-space>
            <el-space wrap v-else> 
              
              <el-button  @click="openEpicFeatures()"
                  icon="plus">由史诗特性快速创建{{ name }}(推荐)</el-button>  
                <el-button  @click="$refs['XmPhase2Dlg'].open()" icon="plus">从模板项目快速导入{{ name }}</el-button>  
                <el-button @click="showAdd()" icon="plus">直接创建{{ name }}</el-button> 
            </el-space>
            <template #reference>
              <el-button v-if="isTaskCenter != '1' && isMy != '1'" type="primary" icon="plus" :title="'新建'+name" plain/>
            </template>
          </el-popover>
           <el-button @click="showGanttChange"  title="甘特图" type="warning"  plain>甘</el-button>
              <el-button @click="$refs['kanbanDlg'].open()"  title="看板" type="success" plain>板</el-button>  
          <el-checkbox v-model="filters.taskOut" true-label="1" v-if="false"
              false-label="">众包</el-checkbox>
              <mdp-select  :options="[{id:'son',name:'直属下级 只查询指定上级的直接下级'},{id:'grandson',name:'所有下级 查询指定上级的所有子孙辈'}]"
                title="当指定某个上级时，是否查该上级的儿子、孙子等所有下级节点" 
                v-model="filters.childQryType"
                placeholder="子孙"
                clearable
              />  
              <MdpSelectTag v-model="filters.tagIdList" multiple/>
              <span v-if="currOpType == 'select' && multiple == true">
          <el-button  plain
            :disabled="sels.length === 0"
            type="primary"
            @click="selectListConfirm"
            icon="check"
            >确认选择</el-button
          >
        </span> 
            </el-space>
      </template>
      <el-space wrap>
      <xm-project-select  v-if=" !selProject?.id && !parentTask?.id" 
          :link-product-id="xmProduct ? xmProduct.id : null" @change2="onProjectRowClick" @clear="onProjectClear" />
        <xm-product-select v-if="!xmProduct?.id && project?.id"
              :link-project-id="project?.id"
              @change2="onProductSelected" @clear="onProductClearSelect" />
        <xm-menu-select v-model="filters.menuId" :xm-product="product" v-if="!menuId && product?.id"/>
        <mdp-select v-model="selkey" placeholder="场景" clearable :options="[
          {id:'showall',name:'全部场景'},
          {id:'work',name:'未达到100%'},
          {id:'finish',name:'已达100%'},
          {id:'myFocus',name:'我关注'},
          {id:'myCreate',name:'我是责任人'},
          {id:'myExecuserStatus1',name:'我执行'},
          {id:'menuIsNull',name:'未关联需求的'},
          {id:'menuNotNull',name:'已关联需求的'},
          {id:'parentTaskidIsNull',name:'未关联计划的'},
          {id:'parentTaskidNotNull',name:'已关联计划的'}, 
          {id:'myExecuserStatus0',name:'我排队'},
          {id:'myExecuserStatus7',name:'我放弃的'}, 
          ]" />  
        <mdp-select  placeholder="状态"   clearable itemCode="taskState"
          v-model="filters.taskState" />

          <xm-user-select :xm-product="product" :sel-project="project" placeholder="责任人" v-model="filters.createUserid" :clearable="true" />
          <xm-user-select :xm-product="product" :sel-project="project" placeholder="执行人" v-model="filters.executorUserid" :clearable="true" />

        <el-input style="width: 10em;" v-model="filters.name" clearable :placeholder="name+'名称'" />
        <el-button @click="searchTableDatas" type="primary" icon="search" v-loading="load.list" />
        </el-space>
      </ContentWrap>
          <mdp-lr-box :lspan="lspan" :expand="expand" v-adaptive="{bottom:50}">
            <template #left>
          <el-table ref="table" :row-style="{heigth:'24px'}" :header-row-style="{height:'50px'}" v-adaptive="{bottom:50,disabled:ganttVisible}" element-loading-text="努力加载中" element-loading-spinner="loading" :data="tableDatas"
            @sort-change="sortChange" v-loading="load.list" @row-click="rowClick" @selection-change="selsChange"
            highlight-current-row current-row-key="id" stripe fit border tooltip-effect="light"
            row-key="id">
            <el-table-column label="全选" type="selection" width="50" /> 
              
            <el-table-column sortable prop="name" :fixed="!ganttVisible" :label="name+'名称'" min-width="300" > 
              <template #default="scope">
							<el-popover placement="right-start"
								:width="deriveId?150:250" :show-after="200"
 							>
							<template #reference>
								<el-link @click="showEdit(scope.row)">
                  <el-text truncated style="max-width:300px;" v-if="ganttVisible">
                  <icon :icon="scope.row.ntype === '1' ? 'ep:stopwatch' : 'ep:operation'" />
                     <icon v-if="scope.row.milestone=='1'" icon="ep:star-filled" />
                     {{ scope.row.sortLevel||(scope.$index+1) }}&nbsp;
                      {{ scope.row.name }} 
                    </el-text>
                    
                  <div v-else>
                  <icon :icon="scope.row.ntype === '1' ? 'ep:stopwatch' : 'ep:operation'" />
                     <icon v-if="scope.row.milestone=='1'" icon="ep:star-filled" />
                     {{ scope.row.sortLevel||(scope.$index+1) }}&nbsp;
                      {{ scope.row.name }} 
                    </div>
                </el-link> 
							</template>
							<template #default>
              <el-button @click="showAddDerive(scope.row)" icon="plus" type="primary" title="以此作为前置新增一条计划/任务"/>
								<el-button @click="copy2(scope.row, scope.$index)" icon="document-copy" type="warning" title="复制一行除了主键不一样，其它都一样的数据"/>
              <el-button v-if="!deriveId" @click="showDerive(scope.row)" icon="share" type="success" title="在整个项目范围内查看依赖关系">依赖分析</el-button>
								</template>
							</el-popover> 
						</template>
            </el-table-column>
            <el-table-column sortable prop="rate" label="进度" width="80">
              <template #default="scope"> 
                
							<el-popover placement="right-start"
								:width="200" :show-after="200"
 							>
							<template #reference>
								
                <el-link
                      :type="scope.row.rate >= 100 ? 'success' : 'warning'">
                      {{ (scope.row.rate != null ? scope.row.rate : 0) + "%" }}
                    </el-link>
							</template>
							<template #default>
                <el-space wrap>
                    <el-button color="" type="primary" @click="showWorkload(scope.row)" v-if="scope.row.ntype=='0'" plain>
                      报工时进度（建议）
                    </el-button>  
                    
                    <el-button   type="success" plain @click="()=>{editForm=scope.row;editForm.rateRule='budgetWorkload';editForm.rateNew=editForm.rate;$refs['rateDlg'].open(scope.row)}">
                          调整进度
                    </el-button>
                      
                    <el-button  type="primary" @click="calcProgress(scope.row)" v-if="scope.row.ntype>'0'" plain title="注意仅统计当前计划及上级所有计划的进度情况，不对子计划进行统计">
                      统计进度
                    </el-button>  
                  </el-space>  
								</template>
							</el-popover> 
              </template>
            </el-table-column>
            
            <el-table-column prop="startTime" sortable col-type="date" label="起始时间" width="200"  colType="date" >
                  <template #default="scope">
                    <mdp-date-range show-style="tag" v-model="scope.row" start-key="startTime" end-key="endTime" 
                      @change="editSomeFields(scope.row, 'startTime', $event)" /> 
                  </template>
                </el-table-column> 
            
            <el-table-column prop="preTaskid" label="前置任务" width="120" show-overflow-tooltip  sortable>
              <template #default="scope"> 
                <el-popover width="200px" :show-after="200">
                  <template #reference>
                    <el-link v-if="scope.row.ntype=='1'" @click="()=>{editForm=scope.row;$refs['preplanDlg'].open()}">{{ scope.row.preTaskid||'无前置' }}</el-link>

                    <el-link v-if="scope.row.ntype=='0'"  @click="()=>{editForm=scope.row;$refs['pretaskDlg'].open()}">{{ scope.row.preTaskid||'无前置' }}</el-link>
                  </template>
                  <el-space>
                    <el-button v-if="scope.row.ntype=='0'" type="primary" @click="()=>{editForm=scope.row;$refs['pretaskDlg'].open()}">
                      {{scope.row.preTaskid?'修改任务前置':'设置任务前置'}}
                    </el-button>
                    <el-button v-if="scope.row.ntype=='1'" type="primary" @click="()=>{editForm=scope.row;$refs['preplanDlg'].open()}">
                      {{scope.row.preTaskid?'修改计划前置':'设置计划前置'}}
                    </el-button>
                    <el-button type="warning" v-if="scope.row.preTaskid" @click="()=>{editForm=scope.row;editSomeFields(scope.row,'preTaskid','')}">
                      清除前置
                    </el-button>
                  </el-space>
                </el-popover>
                  </template>
              </el-table-column>
            <el-table-column label="状态" prop="taskState" width="120" itemCode="taskState"  sortable>
              <template #default="scope">
                <mdp-select show-style="tag"  
                  itemCode="taskState" v-model="scope.row.taskState" :placeholder="name+'状态'" 
                  @change="editTaskState(scope.row, 'taskState', $event)" />
              </template>
            </el-table-column>
            
            <el-table-column sortable prop="createUsername" label="负责人" min-width="120"  >
              <template #default="scope">
                <xm-user-select :xm-product="product||{id:scope.row.productId}" :sel-project="project||{id:scope.row.projectId}" show-style="tag"  v-model="scope.row.createUserid"
                  :init-name="scope.row.createUsername" 
                  @change2="editSomeFields(scope.row, 'createUserid', $event)" />
              </template>
            </el-table-column>
            <el-table-column sortable prop="executorUsername" label="执行人" min-width="120"  >
              <template #default="scope">
                <xm-user-select :xm-product="product||{id:scope.row.productId}" :sel-project="project||{id:scope.row.projectId}" show-style="tag"  v-model="scope.row.executorUserid"
                  :init-name="scope.row.executorUsername"
                  @change2="editSomeFields(scope.row, 'executorUserid', $event)" />
              </template>
            </el-table-column>
            <el-table-column sortable prop="budgetWorkload" label="工时" width="150">

              <template #default="scope">
                <el-link   :type="'warning'" @click="setInitWorkload(scope.row)">
                  <span title="实际工时 / 预算工时 ">{{ scope.row.actWorkload }} &nbsp;/
                    &nbsp;{{ scope.row.rworkload ? parseInt(scope.row.actWorkload) + parseInt(scope.row.rworkload) : scope.row.budgetWorkload }}h
                  </span>
                </el-link>

              </template>
            </el-table-column> 
            <el-table-column prop="tagNames" label="标签" width="120"  sortable show-overflow-tooltip>
              <template #default="scope">
                <mdp-select-tag multiple show-style="tag" v-model="scope.row.tagIds" :initName="scope.row.tagNames" split=","
                  @change2="editSomeFields(scope.row, 'tagIds', $event)" /> 
              </template>
              </el-table-column>
            <el-table-column label="优先级" type="level" width="120" itemCode="priority"  sortable>
              <template #default="scope">
                <mdp-select show-style="tag"  
                  itemCode="priority" v-model="scope.row.level" placeholder="优先级" 
                  @change="editSomeFields(scope.row, 'level', $event)" />

              </template>
            </el-table-column> 
             <el-table-column prop="menuId" label="需求" width="120" show-overflow-tooltip kbName="menuName"  sortable>
              <template #default="scope"> 
                {{ scope.row.menuName||scope.row.menuId }}
              </template>
            </el-table-column>
            <el-table-column prop="id" label="编号" width="80" show-overflow-tooltip  sortable/>
            <el-table-column prop="sortLevel" label="排序号" width="100" show-overflow-tooltip  sortable/>
					<el-table-column prop="actWorkload" label="实际工时"  width="120" show-overflow-tooltip sortable/> 
					<el-table-column prop="initWorkload" label="原估工时"  width="120" show-overflow-tooltip sortable/> 
					<el-table-column prop="budgetWorkload" label="预估工时"  width="120" show-overflow-tooltip sortable/> 
            <el-table-column prop="pidPaths" label="路径" width="80" show-overflow-tooltip  sortable/>
            <el-table-column prop="parentTaskid" label="上级编号" width="120" show-overflow-tooltip  sortable/>
            <el-table-column prop="parentTaskname" label="上级名称" width="120" show-overflow-tooltip  sortable/>
            <el-table-column sortable prop="projectId" label="项目" width="120" show-overflow-tooltip />
            <el-table-column sortable prop="productId" label="产品" width="120" show-overflow-tooltip />
            
            <el-table-column prop="endTime" sortable col-type="date" label="结束时间" width="120"   colType="date" >
              <template #default="scope">
                    <mdp-date show-style="tag" v-model="scope.row.endTime"  
                      @change="editSomeFields(scope.row, 'endTime', $event)" /> 
                  </template>
            </el-table-column> 
            <el-table-column prop="createTime" col-type="date" label="创建时间" width="120" show-overflow-tooltip colType="date"  sortable/> 
            
            <template v-if="currOpType=='select' && multiple!=true">
            <el-table-column   label="操作" width="120" fixed="right">
              <template #default="scope"> 
                <el-button @click="selectConfirm(scope.row)" type="primary">选择</el-button>
              </template>
            </el-table-column>
          </template>
          </el-table>  
        </template>
        <template #default>
          <XmTaskGantt :gantt-id="'task'+(deriveId||'deriveId')" @dateChange="(t,start,end,callback)=>onGanttDateChange(t,start,end,callback)" v-if="ganttVisible" @show-left="expand=$event"   v-model="tableDatas" :columnMap="{dependencies:'preTaskid',start:'startTime',end:'endTime',progress:'rate',hours:'budgetWorkload'}" :ganttCfg="{header_height:40,bar_height: 24}" 
            @barClick="(t,cb)=>showEditForCallback(t,callback)"
            />
        </template>

        </mdp-lr-box>

        <el-pagination  ref="pagination" layout="total, sizes, prev, pager, next"
            @current-change="handleCurrentChange" @size-change="handleSizeChange" :page-sizes="[10, 20, 50, 100, 500]"
            :current-page="pageInfo.pageNum" :page-size="pageInfo.pageSize" :total="pageInfo.total" style="float: right;" />
  <!--编辑 XmTask xm_task界面-->
  <mdp-dialog title="编辑任务" v-model="editFormVisible" fullscreen append-to-body :close-on-click-modal="false">
    <XmTaskEdit :xm-project="currentProject" :formData="editForm" :visible="editFormVisible"
      @cancel="editFormVisible = false" @after-add-submit="afterExecEditSubmit" @after-edit-submit="afterExecEditSubmit"
      @submit="afterEditSubmit" @edit-fields="afterEditFields" />
  </mdp-dialog>

  <!--编辑 XmTask xm_task界面-->
  <mdp-dialog ref="taskWorkloadDlg" :title="'【' + editForm.name + '】登记工时'" width="60%" top="20px" append-to-body
    :close-on-click-modal="false">
    <template #default="{visible,dialog,data}">
      <XmWorkloadEdit :xm-task="data.formData" :visible="visible" op-type="add" biz-type="1"
      @cancel="dialog.close()" @submit="dialog.close()" /> 
    </template>
  </mdp-dialog>

  
  <mdp-dialog ref="rateDlg"  width="600px" append-to-body title="更新进度">
    <el-form class="padding" :model="editForm" label-position="top" label-width="80px" >
      <el-form-item label="更新范围">
        <el-text type="primary" v-if="sels.length == 0">
          {{ editForm.name }}
        </el-text>
        <div v-if="sels.length > 0">
          <el-text  type="primary">
            {{ editForm.name }} 
          </el-text>
          等{{ sels.length }}个计划/任务
        </div>
       
        <el-text type="danger">注意：可多选、选中的计划(包括子孙)/任务的进度都被更新为最新值</el-text>
      </el-form-item> 
 
                          <el-form-item label="原进度百分比" v-if="sels.length==0">
                            <el-input v-model="editForm.rate" readonly>
                              <template #suffix>
                                %
                              </template>
                            </el-input>
                          </el-form-item>
                          <el-form-item label="新进度百分比">
                            <el-input type="number" v-model="editForm.rateNew">
                              <template #suffix>
                                %
                              </template>
                            </el-input>
                          </el-form-item>
                          
                          <el-form-item label="数据模拟"> 
                            <div v-if="sels.length==0">
                              <div v-if="editForm.rateRule=='budgetWorkload'">
                                <el-text>预估工时: 由【{{editForm.budgetWorkload}}】 -> 【{{calcBudgetWorkload(editForm)}}】</el-text>
                              </div>
                              <div v-if="editForm.rateRule=='actWorkload'">
                                <el-text>实际工时: 由【{{editForm.actWorkload}}】 -> 【{{ $mdp.toFixed((editForm.budgetWorkload||0) * (editForm.rateNew||100) / 100,2)}}】</el-text>
                              </div>
                              <div v-if="editForm.rateRule=='none'">
                                <el-text>进度: 由【{{editForm.rate}}%】 -> 【{{ editForm.rateNew }}%】</el-text>
                              </div>
                            </div>
                            
                            <div v-else-if="sels.length>0">
                              <div><el-text>假设某个任务 预估工时【100】，实际工时【20】，当时进度【20%】</el-text></div>
                              <div v-if="editForm.rateRule=='budgetWorkload'">
                                <el-text>预估工时: 由【100】 -> 【{{ $mdp.toFixed(20/editForm.rateNew *100,2)}}】</el-text>
                              </div>
                              <div v-if="editForm.rateRule=='actWorkload'">
                                <el-text>实际工时: 由【{{20}}】 -> 【{{ $mdp.toFixed(100 * editForm.rateNew / 100,2)}}】</el-text>
                              </div>
                              <div v-if="editForm.rateRule=='none'">
                                <el-text>进度: 由【{{20}}%】 -> 【{{ editForm.rateNew }}%】</el-text>
                              </div>
                            </div>
                           </el-form-item>  
                          <el-form-item label="更新规则">
                            <mdp-select width="100%" v-model="editForm.rateRule" :options="[
                              {id:'budgetWorkload',name:'调整预估工时，保持实际工时不变，达到进度的调整，如【预估工时】= 【实际工时】/ 进度 '},
                              {id:'actWorkload',name:'调整实际工时，保持预估工时不变，达到进度的调整，如【实际工时】= 【预估工时】* 进度 '},
                              {id:'none',name:'都不调整，仅仅保存进度，适合无预算/无实际报工的任务计划'}
                          ]"/>
                           </el-form-item>  

    </el-form>
    <template #footer>
      
      <el-button @click="$refs['rateDlg'].close()">取消</el-button>
      <el-button @click="editSomeFields(editForm, 'rate', {rate:editForm.rateNew,rateRule:editForm.rateRule})" v-loading="load.editSomeFields">确定</el-button>
    </template>
  </mdp-dialog>
  <mdp-dialog ref="workloadInitDlg"  width="600px" append-to-body title="更新预估工作量">
    <el-form class="padding" ref="workloadInit" :model="editForm" label-position="top" label-width="80px" >
      <el-form-item label="更新范围">
        <el-text type="primary" v-if="sels.length == 0">
          {{ editForm.name }}
        </el-text>
        <div v-if="sels.length > 0">
          <el-text  type="primary">
            {{ editForm.name }} 
          </el-text>
          等{{ sels.length }}个计划/任务
        </div>
       
      </el-form-item>
      <el-form-item label="预估工时(小时)">
        <el-input  v-model="editForm.budgetWorkload" type="number">
          <template #suffix>
            小时
          </template>
          </el-input>
          <el-text type="danger">注意：可多选，选中的计划/任务的预估工时都会被更新为 {{editForm.budgetWorkload}}小时</el-text>
      </el-form-item>
    </el-form>
    <template #footer>
      
      <el-button @click="Object.assign(editForm,dataBak);$refs['workloadInitDlg'].close()">取消</el-button>
      <el-button @click="editSomeFields(editForm, 'budgetWorkload', editForm.budgetWorkload)" v-loading="load.editSomeFields">确定</el-button>
    </template>
  </mdp-dialog>
  <!-- 新增 XmTask xm_task界面-->
  <mdp-dialog class="XmTaskAdd" title="新增任务" v-model="addFormVisible" fullscreen top="20px" append-to-body
    :close-on-click-modal="false">
    <XmTaskAdd :derive="derive" :xm-project="currentProject" :xm-product="xmProduct" :formData="addForm" :xm-iteration="xmIteration"
      :parent-task="parentTask" :ptype="ptype" :visible="addFormVisible" @cancel="addFormVisible = false"
      @submit="afterAddSubmit" />
  </mdp-dialog>

  <mdp-dialog :title="name + currTaskName + '的执行人'" v-model="execUserVisible" :size="650" append-to-body
    :close-on-click-modal="false">
    <xm-execuser-mng :visible="execUserVisible" :xm-task="editForm" :is-my="isMy" @after-add-submit="afterExecuserSubmit"
      @after-edit-submit="afterExecuserSubmit" @after-delete-submit="afterExecuserSubmit" ref="execuserMng" />
  </mdp-dialog> 

  <mdp-dialog ref="kanbanDlg" :title="'任务看板'" fullscreen append-to-body :close-on-click-modal="false">
    <MdpTableKanban  @del="(d,cb)=>handleDel(d,0,cb)"
      @plus="(cb)=>showAdd(cb)"
      @edit="(d,cb)=>showEdit(d,cb)"
      v-model="tableDatas" 
      :columnConfigs="columnConfigs"
      itemKey="id" 
      :contentFun="(item)=>item.name"
    > 
    <template #toolbar="{element}">
      <MdpSelect showStyle="tag" itemCode="taskState" disabled v-model="element.taskState"/>
    </template>
    </MdpTableKanban>
  </mdp-dialog> 
  <mdp-dialog title="任务模板" :with-header="false" v-model="taskTemplateVisible" width="80%" append-to-body
    :close-on-click-modal="false">
    <XmTaskBox :multiple="true" @select="onTaskTemplatesSelected" />
  </mdp-dialog> 

  <mdp-dialog ref="storyDlg" append-to-body title="需求选择"   width="90%" :close-on-click-modal="false">
    <template #default="{dialog,visible,data}"> 
      <xm-menu-box subOpType="select"  :visible="visible" :multiple="data.multiple" @select="data.callback"
      :xm-product="product" :sel-project="project" @cancel="dialog.close()"/>
    </template>
  </mdp-dialog> 
  <mdp-dialog ref="XmPhaseDlg" title="选择新的上级计划" append-to-body  width="60%" top="20px">
    <XmPhase  :sel-project="project" @select="onSelectedParentTask" showConfirm/>
  </mdp-dialog>
  <mdp-dialog ref="XmPhase2Dlg" title="选择计划进行导入" append-to-body  width="60%" top="20px">
    <XmPhase  :multiple="true" @select="onTaskTemplatesSelected" showConfirm/>
  </mdp-dialog>
  <mdp-dialog ref="XmEpDlg" title="选择史诗特性" append-to-body  width="60%" top="20px">
    <template #default="{data}">
      <XmEpicFeatures  :sel-project="project" :xm-product="product" @select="data.callback" showConfirm multiple/>
    </template>
  </mdp-dialog>
  <mdp-dialog ref="pretaskDlg" title="选中前置任务"   width="90%"  append-to-body   :close-on-click-modal="false">
    <XmTaskBox  :xm-product="product" :sel-project="project"   @select="onPretaskSelect" subOpType="select" :multiple="true"/>
  </mdp-dialog>
  <mdp-dialog ref="preplanDlg" title="选中前置计划"   width="90%"  append-to-body   :close-on-click-modal="false">
    <XmPhase subOpType="select" :xm-product="product" :sel-project="project" :multiple="true" @select="onPreplanSelect" showConfirm/>
  </mdp-dialog>
  
  <mdp-dialog ref="deriveDlg" title="全局依赖关系分析"  fullscreen  append-to-body   :close-on-click-modal="false">
    <template #default="{visible}">
       <XmTaskBox v-if="visible" :key="editForm.id" :deriveId="editForm.id" :xm-product="product" :sel-project="project" :queryScope="queryScope" subOpType="mng"/>
    </template>
  </mdp-dialog>
</template>

<script>
 
import util from '@/components/mdp-ui/js/util';//全局公共库
import {
  deriveList,
  getTask,
  listXmTask,
  editXmTask,
  editRate,
  editTime,
  delXmTask,
  addTask,
  batchDelXmTask,
  batchImportTaskFromTemplate,
  batchSaveBudget,
  setTaskCreateUser,
  batchRelTasksWithMenu,
  batchChangeParentTask,
  editXmTaskSomeFields,
  calcProgress,
  calcProjectProgress,
} from "@/api/xm/core/xmTask"; 

import { mapState } from 'pinia'
import { useUserStore } from '@/store/modules/user'
import { sn } from "@/components/mdp-ui/js/sequence";
import { addXmTaskExecuser } from '@/api/xm/core/xmTaskExecuser';
import { defineAsyncComponent } from 'vue';

import { MdpTableMixin } from '@/components/mdp-ui/mixin/MdpTableMixin.js'

export default {
  mixins: [MdpTableMixin],
  computed: {
    ...mapState(useUserStore, ["userInfo", "roles"]),
    currentProject() {
      if (this.project) {
        return this.project;
      } else {
        return null;
      }
    },
    name(){
      return this.queryScope=='plan'?'计划':'任务'
    },
    taskTime() {
      if (this.editForm.startTime) {
        const s = new Date(this.editForm.startTime);
        const sy = s.getFullYear();
        const sm = s.getMonth();
        const sd = s.getDate();
        const e = new Date(this.editForm.endTime);
        const ey = e.getFullYear();
        const em = e.getMonth();
        const ed = e.getDate();
        let len =
          (new Date(ey, em, ed) - new Date(sy, sm, sd)) / (24 * 3600 * 1000) +
          1;
        return len;
      } else {
        return 0;
      }
    }, 

    toSearchCpd() {
      var key = { iterationId: '', projectId: '', productId: '', parentTaskid: '' };
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
      // if (this.parentTask && this.parentTask.id) {
      //   key.parentTaskid = this.parentTask.id
      //   key.projectId = this.parentTask.projectId
      // } else {
      //   key.parentTaskid = ''
      // }
      return key.iterationId + key.projectId + key.productId + key.parentTaskid
    }

  },
  props: [
    "params",
    "parentTask",
    "selProject",
    "isTaskCenter",
    "isMy",
    "menuId",
    "xmProduct",
    "xmIteration",
    "ptype",//0-项目，1-产品，all/空为不区分
    "queryScope",//planTask,task,plan,分别为计划及任务，纯任务,纯计划
    "deriveId",//是否为演进分析 如果是，传递taskId
  ],
  watch: {
    selProject: function (oval, val) {
      this.project = this.selProject;
     }, 
    timeVisible: function (timeVisible) {
      if (timeVisible == false) {
        this.drawerkey = "";
      }
    },
    xmProduct: function () {
      this.product = this.xmProduct;
    }, 

    toSearchCpd: function () { 
      
      this.searchTableDatas();
    }
  },
  data() { 
    return {
      currOpType: 'mng',
      product:null,
      project:null,
      filters: {
        name: "",
        isMyTask: "0", //0不区分我的，1 时我的任务  
        taskOut: "", //1只查众包任务，0//只查本机构任务   
        taskType: "",
        tagIdList: [],
        taskState: '',//任务状态  
        childQryType:'grandson',//son-查询儿子一级，grandson-查询子孙等所有下级
      },
      apis: {
        list: getTask,
        add: addTask,
        del: delXmTask,
        batchDel: batchDelXmTask,
        editSomeFields: editXmTaskSomeFields
      },
       pageInfo: {
        //分页数据
        total: 0, //服务器端收到0时，会自动计算总记录数，如果上传>0的不自动计算。
        pageSize: 20, //每页数据
        count: true, //是否需要重新计算总记录数
        pageNum: 1, //当前页码、从1开始计算
        orderFields: ["create_time"], //排序列 如 ['sex','student_id']，必须为数据库字段
        orderDirs: ["desc"], //升序 asc,降序desc 如 性别 升序、学生编号降序 ['asc','desc']
      },
      load: { list: false, edit: false, del: false, add: false, calcProgress: false, }, //查询中...
 
      addFormVisible: false, //新增xmTask界面是否显示
      //新增xmTask界面初始化数据
      addForm: {
        id: '', name: '', parentTaskid: '', parentTaskname: '', projectId: '', projectName: '', level: '', sortLevel: '', executorUserid: '', executorUsername: '', preTaskid: '', preTaskname: '', startTime: '', endTime: '', milestone: '', description: '', remarks: '', createUserid: '', createUsername: '', createTime: '', rate: 0, budgetAt: 0, budgetWorkload: 0, actAt: 0, actWorkload: 0, taskState: '0', taskType: '4', taskClass: '', toTaskCenter: '0', actStartTime: '', actEndTime: '', bizProcInstId: '', bizFlowState: '', phaseId: '', phaseName: '', taskSkillNames: '', exeUsernames: '', taskSkillIds: '', exeUserids: '', taskOut: '0', planType: 'w2', settleSchemel: '1', menuId: '', menuName: '', productId: '', cbranchId: '', cdeptid: '', tagIds: '', tagNames: '', ntype: '', childrenCnt: '', ltime: '', pidPaths: '', lvl: '', isTpl: '', keyPath: '', uniInnerPrice: 80, uniOutPrice: 100, calcType: '', ptype: '', wtype: '', bctrl: '', initWorkload: '', shareFee: '', oshare: '', crowd: '', browseUsers: '', execUsers: '', cityId: '', cityName: '', regionType: '', browseTimes: '', capaLvls: '', tranMode: '', supRequires: '', hot: '0', top: '0', urgent: '0', crmSup: '0', bidStep: '0', interestLvls: '', filePaths: '', estate: '0', efunds: 0, etoPlatTime: '', etoDevTime: '', ebackTime: '', topStime: '', topEtime: '', hotStime: '', hotEtime: '', urgentStime: '', urgentEtime: ''
      },

      editFormVisible: false, //编辑界面是否显示
      //编辑xmTask界面初始化数据

      editForm: {
        id: '', name: '', parentTaskid: '', parentTaskname: '', projectId: '', projectName: '', level: '', sortLevel: '', executorUserid: '', executorUsername: '', preTaskid: '', preTaskname: '', startTime: '', endTime: '', milestone: '', description: '', remarks: '', createUserid: '', createUsername: '', createTime: '', rate: 0, budgetAt: 0, budgetWorkload: 0, actAt: 0, actWorkload: 0, taskState: '0', taskType: '4', taskClass: '', toTaskCenter: '0', actStartTime: '', actEndTime: '', bizProcInstId: '', bizFlowState: '', phaseId: '', phaseName: '', taskSkillNames: '', exeUsernames: '', taskSkillIds: '', exeUserids: '', taskOut: '0', planType: 'w2', settleSchemel: '1', menuId: '', menuName: '', productId: '', cbranchId: '', cdeptid: '', tagIds: '', tagNames: '', ntype: '', childrenCnt: '', ltime: '', pidPaths: '', lvl: '', isTpl: '', keyPath: '', uniInnerPrice: 80, uniOutPrice: 100, calcType: '', ptype: '', wtype: '', bctrl: '', initWorkload: '', shareFee: '', oshare: '', crowd: '', browseUsers: '', execUsers: '', cityId: '', cityName: '', regionType: '', browseTimes: '', capaLvls: '', tranMode: '', supRequires: '', hot: '0', top: '0', urgent: '0', crmSup: '0', bidStep: '0', interestLvls: '', filePaths: '', estate: '0', efunds: 0, etoPlatTime: '', etoDevTime: '', ebackTime: '', topStime: '', topEtime: '', hotStime: '', hotEtime: '', urgentStime: '', urgentEtime: ''
      },
 

      selkey: "",
  
      expand:true,
      lspan:24,
      ganttVisible: false,
        displayType: "",
        batchRelTasksWithMenuVisible: false,
        taskTemplateVisible:false,
        derive:false,
     };
  }, //end data
  methods: { 
    calcBudgetWorkload(row){
      if(!row.actWorkload||row.actWorkload==0){
        return row.budgetWorkload||0
      }else{ 
        var r=row.rateNew||0
        if(r==0){
          r=100
        }
        var d=(row.actWorkload||0)/r *100
        return this.$mdp.toFixed(d,2);
      }
    },
    setInitWorkload(row){ 
      this.editForm=row
      this.$refs['workloadInitDlg'].open({formData:row})
    },
    showWorkload(row){
      this.editForm=row
      this.$refs['taskWorkloadDlg'].open({formData:row})
    }, 
    calcProgress(row) {
      this.load.calcProgress = true
      calcProgress({ id: row.id }).then(res => {

        this.load.calcProgress = false
        this.searchTableDatas();
      })
    },  
    onBatchRelTasksWithMenu(menu) {

      var params = {
        menuId: menu.menuId,
      }
      if (this.sels.length == 0) { 
          this.$notify({
            showClose: true,
            message: "请先选中一个或者多个任务",
            type: "warning",
          });
          return; 
      } else {
        params.taskIds = this.sels.map(i => i.id)
      }
      this.load.edit = true;
       batchRelTasksWithMenu(params).then(res => {
        this.load.edit = false;
        var tips = res.tips;
        if (tips.isOk) {
          this.searchTableDatas();
         }
        this.$notify({
          showClose: true,
          message: tips.msg,
          type: tips.isOk ? "success" : "error",
        });
      })
    },

    /**
     * 计算两个日期之间的天数
     * @param dateString1  开始日期 YYYY-MM-DD
     * @param dateString2  结束日期 YYYY-MM-DD
     */
    getDaysBetween(startDate, endDate) {
      if (startDate == endDate) {
        return 0;
      }
      var days = (startDate - endDate) / (1 * 24 * 60 * 60 * 1000);
      return days;
    },

    editProgress(rate) {

      let params = {
        id: this.editForm.id,
        rate: rate,
        projectId: this.editForm.projectId,
        parentTaskid: this.editForm.parentTaskid,
      };
      if (rate == 0) {
        this.$notify({
          showClose: true,
          message: "不允许更新为0",
          type: "error",
        });
        return;
      }
      this.load.edit = true;
      editRate(params)
        .then((res) => {
          var tips = res.tips;
          if (tips.isOk) {
            var row = this.editForm
            this.searchTableDatas()
            //treeTool.reloadChildren(this.$refs.table,this.maps,row.parentTaskid,'parentTaskid',this.loadXmTaskLazy)
          }
          this.$notify({
            showClose: true,
            message: tips.msg,
            type: tips.isOk ? "success" : "error",
          });
          this.load.edit = false;
        })
        .catch((err) => {
          this.load.edit = false;
          this.editForm.rate = this.oldrate;
          this.timeVisible = false;
        });
    },
    editTaskState(row,fieldName,v){ 
      this.editSomeFields(row,fieldName,v) 
    },
    //显示编辑界面 XmTask xm_task
    showEdit: function (row, index) {
      
      this.editFormVisible = true;
      this.editForm = row
    },
    showTaskTemplate: function () { 
      if (!this.checkCanAdd(this.parentTask)) {
        return;
      }
      this.taskTemplateVisible = true;
    },
    checkCanAdd(parentTask) {
      /**
      if(!parentTask||!parentTask.id){
         this.$notify({
              showClose: true,
              message: "任务必须挂在计划下，先选择上级计划或者转入计划模块进行创建任务",
              type: "warning",
            });
            return false;
      } **/
      if (parentTask && parentTask.id) {
        if (parentTask.ntype == '0') {
          this.$notify({
            showClose: true,
            message: "当前为任务节点，任务节点下不能再创建新的子项",
            type: "warning",
          });
          return false;
        }
        return true;
      } else { 
          if (!this.project || !this.project.id) {
            this.$notify({
              showClose: true,
              message: "请先选择项目",
              type: "warning",
            });
            this.projectVisible = true;
            return false;
          
        }

      }
      return true;


    },
    //显示新增界面 XmTask xm_task
    showAdd: function () {
      this.addForm={}
      if (!this.checkCanAdd(this.parentTask)) {
        return;
      }
      var ntype=this.queryScope=='plan'?'1':'0'
      this.derive=false
      this.addForm.ntype = ntype; 
      this.addForm.menuId=this.menuId 
      this.addFormVisible = true;
    },
    //显示新增界面 XmTask xm_task
    showAddDerive: function (row) {  
      this.derive=true
      this.addForm={...row,preTaskid:row.id,preTaskname:row.name,actWorkload:0,actAt:0,childrenCnt:0,subPlanCnt:0,subTaskCnt:0,executorUserid:'',executorUsername:'',actStartTime:null,actEndTime:null,browseTimes:0,exeUserids:null,exeUsernames:null}
      this.addFormVisible = true;
    },
    afterExecEditSubmit() {
      var row = this.editForm
      this.searchTableDatas()
      //treeTool.reloadChildren(this.$refs.table,this.maps,row.parentTaskid,'parentTaskid',this.loadXmTaskLazy)
    }, 
    isEmpty(str) {
      return str == null || "" == str;
    },

    showMenuGroupUser() {
      this.$refs.xmGroupDialog.open({ data: null, action: 'filtersCreateUserid' })
    },
    showMenuExecutor() {
      this.$refs.xmGroupDialog.open({ data: null, action: 'filtersExecutorUserid' })
    },
    showMenu: function () {
      if (!this.checkCanAdd(this.parentTask)) {
        return;
      }
      this.menuVisible = true;
    },
    creatTasksByMenus(menus) {
      if (menus == null || menus.length == 0) {
        this.menuVisible = false;
        return;
      }
      var menus2 = JSON.parse(JSON.stringify(menus));
      menus2.forEach((i) => {
        i.id = i.menuId;
        i.parentTaskid = i.pmenuId;
        i.name = i.menuName;
        i.sortLevel=i.seqNo
        i.ntype = (this.queryScope=='task'?'0':'1')
      });
      this.onTaskTemplatesSelected(menus2);
      this.menuVisible = false;
    }, 
    onTaskTemplatesSelected(taskTemplates) {
      
      if (taskTemplates == null || taskTemplates.length == 0) {
        this.taskTemplateVisible = false;
        return;
      }
      var taskTemplates2 = JSON.parse(JSON.stringify(taskTemplates));
      taskTemplates2.forEach(i => {
        if (!i.parentTaskid) {
          i.parentTaskid = this.parentTask ? this.parentTask.id : null;
          i.parentTaskname = this.parentTask ? this.parentTask.name : null;
        } else if (!taskTemplates2.some(k => k.id == i.parentTaskid)) {
          i.parentTaskid = this.parentTask ? this.parentTask.id : null;
          i.parentTaskname = this.parentTask ? this.parentTask.name : null;
        }
      })
      this.load.add = true;
      var projectId = null;
      if (this.parentTask && this.parentTask.id) {
        projectId = this.parentTask.projectId
      } else {
        projectId = this.project.id
      }
      taskTemplates2.forEach((i) => {
        i.ptype = "0"
        if (i.isTpl == '1') {
          i.productId = null;
          i.menuId = null;
          i.menuName = null;
        }
        i.ntype = "0"
        i.projectId = projectId
        i.budgetAt = 0;
        i.budgetWorkload = 80;
        i.level = i.level ? i.level : "3";
        i.planType = i.planType ? i.planType : "w2";
        i.actAt = 0;
        i.actWorkload = 0;
        i.taskState = "0";
        i.rate = 0;
        i.sortLevel = i.seqNo
        i.taskOut = i.taskOut ? i.taskOut : "0";
        i.taskClass = i.taskClass ? i.taskClass : "1";
        i.toTaskCenter = i.toTaskCenter ? i.toTaskCenter : "1";
        i.settleSchemel = i.settleSchemel ? i.settleSchemel : "1";
        i.createUserid = this.userInfo.userid;
        i.createUsername = this.userInfo.username;
        const createTime = new Date();
        var startTime = new Date();
        const endTime = new Date();
        endTime.setTime(startTime.getTime() + 3600 * 1000 * 24 * 7 * 2); //两周后
        i.createTime = util.formatDate(
          createTime,
          "YYYY-MM-DD HH:mm:ss"
        );
        i.startTime = util.formatDate(startTime, "YYYY-MM-DD HH:mm:ss");
        i.endTime = util.formatDate(endTime, "YYYY-MM-DD HH:mm:ss");
      });
      var params = {
        xmTasks: taskTemplates2,
        ptype: "0"
      }
      params.projectId = projectId
      if (this.product && this.product.id) {
        params.productId = this.product.id
      } else if (taskTemplates2.some(k => k.productId)) {
        params.productId = taskTemplates2.find(k => k.productId).productId
      }

      if (this.parentTask && this.parentTask.id) {
        params.parentTaskid = this.parentTask.id
      }
      params.ntype=this.queryScope=='task'?'0':'1'
      //////////////////
      batchImportTaskFromTemplate(params)
        .then((res) => {
          var tips = res.tips;
          if (tips.isOk) {
            this.$emit('batch-add-submit')
            this.searchTableDatas();
            
            this.taskTemplateVisible = false;
            this.$refs.storyDlg.close()
            this.$refs.XmPhase2Dlg.close()
          }
          this.$notify({
            showClose: true,
            message: tips.msg,
            type: tips.isOk ? "success" : "error",
          });
        })
        .catch((e) => {
          this.taskTemplateVisible = false; 
          this.$refs.storyDlg.close()
        });
    },
    getDateString(dateStr) {
      if (dateStr == null || dateStr == "" || dateStr == undefined) {
        return "";
      } else {
        var now = new Date();
        var years = now.getFullYear();
        if (dateStr.indexOf(years) == 0) {
          return dateStr.substr(5, 5);
        }
        return dateStr.substr(0, 10);
      }
    },

    toFixed(floatValue, xsd) {
      if (floatValue == null || floatValue == "" || floatValue == undefined) {
        return 0;
      } else {
        if (xsd) {
          return parseFloat(floatValue).toFixed(xsd);
        } else {
          return parseFloat(floatValue).toFixed(0);
        }
      }
    },

    focusOrUnfocus: function (row) {
      if (this.selkey == "myFocus") {
        this.$mdp.delUserFocus({
          projectId: row.projectId,
          focusType: "task",
          taskId: row.id,
          taskName: row.name,
          userid: this.userInfo.userid,
          username: this.userInfo.username,
        }).then((res) => {
          var tips = res.tips;
          if (tips.isOk) {
            this.searchTableDatas();
          }
          this.$notify({
            showClose: true,
            message: tips.msg,
            type: tips.isOk ? "success" : "error",
          });
        });
      } else {
        this.$mdp.addUserFocus({
          projectId: row.projectId,
          projectName: row.projectName,
          focusType: "task",
          taskId: row.id,
          taskName: row.name,
          userid: this.userInfo.userid,
          username: this.userInfo.username,
        }).then((res) => {
          var tips = res.tips;
          this.$notify({
            showClose: true,
            message: tips.msg,
            type: tips.isOk ? "success" : "error",
          });
        });
      }
    },
    onProductSelected(product) {
      this.product = product; 
    },
    onProjectRowClick: function (project) {
      this.project = project;  
    },
    onProjectClear() {
      this.project = null; 
    },
    afterExecuserSubmit() {

      var row = this.editForm
      this.searchTableDatas()
    },
    toJoin() {
      if (
        this.editForm.exeUserids &&
        this.editForm.exeUserids.indexOf(this.userInfo.userid) >= 0
      ) {
        this.$notify.success("你已经加入该任务了");
        return;
      }
      this.execUserVisible = true;
      this.$nextTick(() => {
        this.$refs.execuserMng.toJoin();
      });
    },
    //查询时选择责任人
    selectCreateUserConfirm(user) {
      if (option && option.action === 'createUserid') {
        if (groupUsers && groupUsers.length > 0) {
          var user = groupUsers[0];
          this.editSomeFields(option.data, option.action, user)
        }
      } else if (option.action === 'executorUserid') {
        var user = groupUsers[0];
        var params = {}
        var row = option.data;
        params.taskId = row.id;
        params.projectId = row.projectId
        params.projectName = row.projectName
        params.taskName = row.name
        params.quoteStartTime = row.startTime
        params.quoteEndTime = row.endTime
        params.quoteAmount = row.budgetAt
        params.quoteWorkload = row.budgetWorkload
        params.userid = user.userid
        params.username = user.username
        if (this.sels.length > 0) {
          this.editSomeFields(row, "executorUserid", params)
        } else {
          addXmTaskExecuser(params).then(res => {
            var tips = res.tips
            if (tips.isOk) {
              //this.searchTableDatas();
              row.executorUserid = user.userid
              row.executorUsername = user.username
              row.exeUserids = user.userid
              row.exeUsernames = user.username
            } else {
              this.$notify({ position: 'bottom-left', showClose: true, message: tips.msg, type: 'error' })
            }
          })
        }

      }

    },

    formatExeUsernames(row) {

      var exeUsernames = row.exeUsernames;
      var respons = {
        type: "info",
        executorUsername: row.executorUsername,
        showMsg: "",
        exeUsernames: exeUsernames,
        executorUserid: row.executorUserid,
      };
      if (!row.executorUserid && exeUsernames) {
        var exeStatuss = exeUsernames.split(",");
        respons.showMsg = exeStatuss.length + "人候选中";
        return respons;
      } else if (!row.executorUserid && !exeUsernames) {
        respons.showMsg = "候选中";
        return respons;
      }
      if (row.executorUserid && exeUsernames && exeUsernames.length > 0) {
        var exeStatuss = exeUsernames.split(",").filter((i) => {
          return i.indexOf(row.executorUsername) >= 0;
        });
        if (exeStatuss.length <= 0) {
          respons.showMsg = "去设置";
          return respons;
        }
        respons.showMsg = exeStatuss.join(",");
        if (respons.showMsg.indexOf("验收不过") >= 0) {
          respons.type = "danger";
        } else if (respons.showMsg.indexOf("已验收") >= 0) {
          respons.type = "success";
        }
      } else {
        respons.showMsg = "去设置";
      }
      return respons;
    },
    editTime(row, fieldName) {
      var params = {}
      if (fieldName == 'startTime') {
        params.startTime = row.startTime
        params.endTime = row.endTime
      }
      if (fieldName == 'actStartTime') {
        params.actStartTime = row.actStartTime
        params.actEndTime = row.actEndTime
      }
      this.editSomeFields(row, fieldName, params)
    },

    preQueryParamCheck(params) { 
      
      if (this.selkey == "work") {
        params.work = "work";
      } else if (this.selkey == "finish") {
        params.rate = 100;
      } else if (this.selkey == "myFocus") {
        params.myFocus = "1";
        params.userid = this.userInfo.userid;
      } else if (this.selkey == "myCreate") {
        params.createUserid = this.userInfo.userid;
        params.userid = this.userInfo.userid;
      } else if (this.selkey.indexOf("myExecuserStatus") >= 0) {
        params.userid = this.userInfo.userid;
        params.myExecuserStatus = this.selkey.substring(
          "myExecuserStatus".length
        );
      } else if(this.selkey=='menuIsNull'){
        params.menuId="$IS NULL"
      }else if(this.selkey=='menuNotNull'){
        params.menuId="$IS NOT NULLL"
      } else if(this.selkey=='parentTaskidIsNull'){
        params.parentTaskid="$IS NULL"
      }else if(this.selkey=='parentTaskidNull'){
        params.parentTaskid="$IS NOT NULLL"
      }
      if (this.project) {
        params.projectId = this.project.id;
      }
      params.workexec = "true";
      if (this.isMy == "1") {
        params.userid = this.userInfo.userid;
        params.isMy = "1";
      }      
      if (this.product) {
        params.productId = this.product.id;
      }
      if (this.xmIteration) {
        params.iterationId = this.xmIteration.id;
      } 
      if (this.parentTask && this.parentTask.id) {
        if(params.childQryType=='grandson'){
          params.pidPathsLike=this.parentTask.pidPaths
          params.id="!="+this.parentTask.id
          delete params.parentTaskid
        }else{
          params.parentTaskid = this.parentTask.id
        } 
      } 
      
      if(this.menuId){
        params.menuId=this.menuId
      } 
      if ( this.queryScope == 'plan') {
        params.ntype = '1'
        delete params.productId
        delete params.iterationId
        delete params.menuId
      }else{
        params.ntype='0'
      }
      if ( this.queryScope == 'plan' ) { 
        if( !this.parentTask?.id  &&  !params.projectId){
          this.$notify.warning("请先选中项目")
          return false; 
        }
         
      }else {
        if( params.childQryType!='grandson' && !params.parentTaskid && !params.projectId && !params.menuId && !params.productId && !params.iterationId){
          this.$notify.warning("请先选中项目")
          return false; 
        }
      }
      if(this.deriveId){ 
        params.id=this.deriveId
      }
      return true;
    },
    openEpicFeatures(){
      if(!this.product?.id){
        this.$message.warning('请先选择产品')
        return;
      }
      this.$refs['XmEpDlg'].open({callback:(menus)=>{
        this.creatTasksByMenus(menus) 
        this.$refs['XmEpDlg'].close();
      }})
    },
    openStorySelect(type){
      if(type=='link'){
        if(this.sels.length<=0){
          this.$message.error("请选中一个或者多个任务")
          return ;
        }
        this.$refs['storyDlg'].open({multiple:false,callback:(menu)=>{
          this.onBatchRelTasksWithMenu(menu) 
          this.$refs['storyDlg'].close();
        }})
      }else if(type=='ctask'){
        if(!this.project?.id||!this.selProject?.id){
          this.$message.error("请先选中项目")
          return ;
        }
        this.$refs['storyDlg'].open({type:type,multiple:true,callback:(menus)=>{
          this.creatTasksByMenus(menus) 
          this.$refs['storyDlg'].close();
        }})
      }
    },  
    showParentTaskList() {
      if (this.sels.length == 0) {
        this.$notify({ position: 'bottom-left', showClose: true, message: "请先选择一个或者多个需要更换上级的"+this.name+"", type: 'warning' })
        return;
      } 
      if (!this.project || !this.project.id) {
        this.$notify({ position: 'bottom-left', showClose: true, message: "请先选择项目", type: 'warning' })
        return;
      } 
      this.$refs['XmPhaseDlg'].open()

    },

    editSomeFieldsCheck(row, fieldName, $event,params) {
      
      if (fieldName === 'menuId') {
        if ($event) {
          params[fieldName] = $event.menuId;
          params.menuName = $event.menuName
          params.productId = $event.productId
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
      } else if (fieldName === 'executorUserid') {
        if (row.out == '1' || row.crowd == '1') {
          this.$nextTick(() => {
            Object.assign(this.editForm, this.editFormBak)
          })
          this.$notify({ position: 'bottom-left', showClose: true, message: '外包任务不允许直接设置执行人，请到执行人管理中选择', type: 'error' })
          return;
        }
        params.executorUserid = $event.userid
        params.executorUsername = $event.username
      } else if (fieldName === 'createUserid') {
        params.createUserid = $event.userid
        params.createUsername = $event.username
      } else if (fieldName === 'startTime') {
        params.startTime = $event.startTime
        params.endTime=$event.endTime
      } else if (fieldName === 'actStartTime') {
        params.actStartTime = $event
      }else if(fieldName=='rate'){
        Object.assign(params,$event)
      } else {
        params[fieldName] = $event
      }
      return true
    },
    onSelectedParentTask(task) {
      if (this.sels.length == 0) {
        this.$notify({ position: 'bottom-left', showClose: true, message: "请先选择一个或者多个需要更换上级的"+this.name+"", type: 'warning' })
         return;
      } else if (task == null || !task.id) {
        this.$notify({ position: 'bottom-left', showClose: true, message: "请选择上级计划", type: 'warning' })
        return;
      }

      var params =   this.sels.map(i =>{ return {id:i.id,parentTaskid: task.id}})
      this.$confirm("确认批量更新以下" + this.sels.length + "个任务的上级为【" + task.name + "】吗?", "提示", {
        type: "warning",
      }).then(() => {
        batchChangeParentTask(params).then(res => {
          var tips = res.tips;
          if (tips.isOk) {
            this.searchTableDatas(); 
            this.$refs['XmPhaseDlg'].close()
           }
          this.$notify({
            showClose: true,
            message: tips.msg,
            type: tips.isOk ? "success" : "error",
          });
        });
      })
    },
    initCurrData() { 
      if(this.deriveId){
        this.apis.list=deriveList
      }
      
      if (this.selProject) {
        this.project = this.selProject;
      }
      if (this.xmProduct) {
        this.product = this.xmProduct;
      }
      if(this.currOpType=='select'){
        this.lspan=24
        this.ganttVisible=false
      }
      this.searchTableDatas()
    },

    onProductClearSelect() {
      this.product = null; 
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
      
      let d=this.tableDatas.find(k=>k.id==t.id)
      this.editForm=d
      let startTime=this.$mdp.formatDate(start,'YYYY-MM-DD HH:mm:ss')
      let endTime=this.$mdp.formatDate(end,'YYYY-MM-DD HH:mm:ss')
      this.editSomeFields(this.editForm,'startTime',{startTime:startTime,endTime:endTime,callback})
    },
    onPretaskSelect(tasks){
      if(tasks && tasks.length>3){
        this.$message.error('最多选3个前置任务')
        return;
      }
      this.editSomeFields(this.editForm,'preTaskid',tasks.map(k=>k.id).join(","))
      this.$refs['pretaskDlg'].close()
    },
    onPreplanSelect(tasks){
      if(tasks && tasks.length>3){
        this.$message.error('最多选3个前置计划')
        return;
      }
      this.editSomeFields(this.editForm,'preTaskid',tasks.map(k=>k.id).join(","))
      this.$refs['preplanDlg'].close()
    },
    showEditForCallback(t,callback){
      this.editForm=t
      this.editFormVisible=true

    },
    showDerive(row){
      this.editForm=row
      this.$refs.deriveDlg.open()
    },
    toWord(){ 
      let htmlList=this.tableDatas.map((k,index)=>{
        if(!k.lvl){
          k.lvl=k.pidPaths.split(",").length
        }
        let ntypeName=k.ntype=='1'?('计划'):'任务'
        let html=`<h${k.lvl}>${ntypeName}:${k.sortLevel||''} ${k.name}</h${k.lvl}>
        <p>编号: ${k.id} 上级编号: ${k.parentTaskid} 需求编号: ${k.menuId}</p>
        <p>详情：</p>
        <p>
          ${k.description} 
        </p>
        `
        return html;
      })
      let all=''
      let p=this.parentTask
      if(this.parentTask?.id){
        if(!p.lvl){
          p.lvl=p.pidPaths.split(",").length
        }
        let parentNtypeName='计划'
        all=`
        <h${p.lvl}>${parentNtypeName}:${p.sortLevel||''} ${p.name}</h${p.lvl}>
        <p>计划编号: ${p.id} 上级编号: ${p.parentTaskid}</p>
        <p>说明: ${p.description}</p> 
        <p>子项：</p>
        ${htmlList.join('\n')}
        `
      }else{
        all=htmlList.join("\n")
      }
      this.html2Word(all)
      }
    /**end 自定义函数请在上面加**/
  }, //end methods
  components: {   
     XmWorkloadEdit:defineAsyncComponent(()=>import("@/views/xm/core/xmWorkload/XmWorkloadEdit.vue")),
    'XmTaskAdd':defineAsyncComponent(()=>import("./XmTaskAdd.vue")),
    'XmTaskEdit':defineAsyncComponent(()=>import("./XmTaskEdit.vue")), 
    XmExecuserMng: defineAsyncComponent(()=>import( '../xmTaskExecuser/XmTaskExecuserMng.vue'))
  },
  mounted() { 
    
      
    
  },
};
</script>
  
