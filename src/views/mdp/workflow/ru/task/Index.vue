<template>
      <el-row :gutter="20">
    <el-col :span="6">
      <MdpCateTree show-checkbox ref="cateTree"/>
    </el-col>
    <el-col :span="18">
  <ContentWrap v-if="source!='gzt'">
    <el-space wrap>
 


      <el-input
          v-model="filters['p.mainTitle']" style="width: 10em;"
          placeholder="流程名字" clearable
          title="支持>、<、 >=、<=、!=、*字符*、$IS NULL、$IN 1,2,3、$between 1,5等操作符"/>
      <el-input
          v-model="filters['assignee']" style="width: 10em;"
          placeholder="执行人名字" clearable
          title="支持>、<、 >=、<=、!=、*字符*、$IS NULL、$IN 1,2,3、$between 1,5等操作符"/>

      <el-input
          v-model="filters['p.startUsername']" style="width: 10em;"
          placeholder="发起人" clearable
          title="支持>、<、 >=、<=、!=、*字符*、$IS NULL、$IN 1,2,3、$between 1,5等操作符"/>
      <mdp-date-range
          v-model="filters" style="width: 14em;" startKey="fromStartTime" endKey="toStartTime"
          type="daterange" align="right" unlink-panels
          range-separator="-" start-placeholder="创建日期" end-placeholder="创建日期"
          value-format="YYYY-MM-DD HH:mm:ss" />
      <el-button
          v-loading="load.list" :disabled="load.list==true" @click="searchTableDatas()"
          icon="search" type="primary">查询
      </el-button>
    </el-space>
    <template #header>
      <el-space wrap> 
        <mdp-select
          v-model="filters['res.suspensionState']" width="5em" item-code="suspensionState"
          clearable filterable placeholder="状态"/>

        <mdp-select-tag
            v-model="filters['tagIds']" width="8em" clearable filterable
            placeholder="标签"/>
        <mdp-hi-query
            :column-configs="columnConfigs" v-model="hiQueryParams"
            @change="onHiQueryParamsChange"/>
        <el-button icon="zoom-out" @click="searchReset()" title="重置查询条件"/>
        <el-popover placement="top" width="375" trigger="manual" v-model="weixinContentVisible">
          <p>{{ weixinContent }}</p>
          <div style="text-align: right; margin: 0">
            <el-button  type="text" @click="doCopyWeixinUrl">拷贝链接</el-button>
            <el-button type="text"  @click="doCopyWeixinContent">拷贝内容</el-button>
          </div>
          <el-button
              ref="reference" v-show="assigneeToMe!=true" link
              @click="showWeixin">微信催办
          </el-button>
        </el-popover>

        <el-button link v-show="assigneeToMe!=true" @click="showSendSms">短信催办</el-button>
        <span style="float:right;" v-if="currOpType=='select' &&  multiple==true">
                <el-button
                    :disabled="disBtn('selectBtn') || sels.length===0" type="primary"
                    @click="selectListConfirm" icon="check"/>
            </span>

        <el-button icon="download" @click="export2Excel()" title="导出当前结果" />
        <mdp-table-configs :column-configs="columnConfigs" v-model="checkedColumns"/>
      </el-space>
    </template>
  </ContentWrap>
  <!--列表 Task act_ru_task-->
  <el-table v-if="defaultShowCalendar!=true" v-adaptive
      :ref="refId+'Table'" :data="tableDatas" @sort-change="sortChange"
      highlight-current-row v-loading="load.list" border @selection-change="selsChange"
      @row-click="rowClick" style="width: 100%;">
    <el-table-column
        type="selection" width="55" show-overflow-tooltip fixed="left"
        v-if="currOpType=='mng' || multiple==true"/>
    <el-table-column
        prop="mainTitle" label="流程名称" min-width="300" show-overflow-tooltip
        col-type="String" v-if="showCol('mainTitle')">
      <template #default="{row}"> 
        <div style="display:flex;justify-content: flex-start;"><mdp-select style="width:auto;" show-style="tag" item-code="suspensionState" v-model="row.suspensionState" :disabled="true"/>{{ row.mainTitle }}</div>

      </template>
    </el-table-column>
    <el-table-column
        sortable prop="startUsername" label="发起人" min-width="100"
        show-overflow-tooltip/>

    <el-table-column
        prop="createTime" sortable label="发起时间" min-width="120"
        show-overflow-tooltip col-type="Date" v-if="showCol('createTime')">
      <template #default="scope">
        <mdp-date
            type="date" placeholder="选择日期" show-style="tag"
            v-model="scope.row.createTime"
            @change="editSomeFields(scope.row,'createTime',$event)"
            value-format="YYYY-MM-DD HH:mm:ss" format="YYYY-MM-DD"
            :disabled="true"/>
      </template>
    </el-table-column>
    <el-table-column
        prop="name" label="任务名称" min-width="120" show-overflow-tooltip
        col-type="String" v-if="showCol('name')"/>
    <el-table-column
        prop="assigneeName" label="责任人" min-width="120"
        show-overflow-tooltip col-type="String" v-if="showCol('assigneeName')"/>
   <el-table-column
        sortable prop="planFinishTime" label="到期时间" min-width="120"
        show-overflow-tooltip/>
    <el-table-column
        sortable prop="tagNames" label="标签" min-width="100"
        show-overflow-tooltip>
      <template #default="scope">
        <mdp-select-tag
            show-style="tag" v-model="scope.row.tagIds" :initName="scope.row.tagNames" clearable filterable
            placeholder="标签" multiple split="," :disabled="true"/>
      </template>
    </el-table-column>
    <el-table-column
        sortable prop="startDeptName" label="发起部门" min-width="120"
        show-overflow-tooltip/>

    <el-table-column
        prop="suspensionState" label="状态" min-width="120" show-overflow-tooltip
        col-type="Integer" v-if="showCol('suspensionState')">
      <template #default="scope">
        <mdp-select
            @click="rowClick(scope.row)" show-style="tag" item-code="suspensionState"
            v-model="scope.row.suspensionState"
            @change="editSomeFields(scope.row,'suspensionState',$event)" :precision="0"
            :disabled="true"/>
      </template>
    </el-table-column>
    <el-table-column
        prop="delegation" label="代办" min-width="120" show-overflow-tooltip
        col-type="String" v-if="showCol('delegation')">
      <template #default="scope">
        <mdp-select
            @click="rowClick(scope.row)" show-style="tag" no-match-text="否"
            placeholder="是否代办" item-code="delegationStatus"
            v-model="scope.row.delegation" :maxlength="64"
            @change="editSomeFields(scope.row,'delegation',$event)"
            :disabled="true"/>
      </template>
    </el-table-column>
    <el-table-column
        prop="claimTime" label="委派时间" min-width="120" show-overflow-tooltip
        col-type="Date" v-if="showCol('claimTime')">
      <template #default="scope">
        <mdp-date
            type="date" placeholder="选择日期" show-style="tag"
            v-model="scope.row.claimTime"
            @change="editSomeFields(scope.row,'claimTime',$event)"
            value-format="YYYY-MM-DD HH:mm:ss" format="YYYY-MM-DD"
            :disabled="true"/>
      </template>
    </el-table-column>
    <el-table-column
        prop="tenantId" label="机构号" min-width="120" show-overflow-tooltip
        col-type="String" v-if="showCol('tenantId')">
      <template #default="scope">
        <mdp-input
            show-style="tag" v-model="scope.row.tenantId" :maxlength="64"
            @change="editSomeFields(scope.row,'tenantId',$event)"
            :disabled="true"/>
      </template>
    </el-table-column>
    <el-table-column
        prop="id" label="任务编号" min-width="120" show-overflow-tooltip
         col-type="String" v-if="showCol('id')"/>
    <el-table-column
        prop="rev" label="版本" min-width="120" show-overflow-tooltip
        col-type="Integer" v-if="showCol('rev')">
      <template #default="scope">
        <mdp-number
            show-style="tag" v-model="scope.row.rev"
            @change="editSomeFields(scope.row,'rev',$event)" :precision="0"
            :disabled="true"/>
      </template>
    </el-table-column>
    <el-table-column
        prop="assignee" label="执行人编号" min-width="120" show-overflow-tooltip
        col-type="String" v-if="showCol('assignee')">
      <template #default="scope">
        <mdp-input
            show-style="tag" v-model="scope.row.assignee" :maxlength="255"
            @change="editSomeFields(scope.row,'assignee',$event)"
            :disabled="true"/>
      </template>
    </el-table-column>


    <el-table-column
        prop="priority" label="优先级" min-width="120" show-overflow-tooltip
        col-type="Integer" v-if="showCol('priority')">
      <template #default="scope">
        <mdp-number
            show-style="tag" v-model="scope.row.priority"
            @change="editSomeFields(scope.row,'priority',$event)" :precision="0"
            :disabled="true"/>
      </template>
    </el-table-column>
    <el-table-column
        prop="owner" label="所有者" min-width="120" show-overflow-tooltip
        col-type="String" v-if="showCol('owner')">
      <template #default="scope">
        <mdp-input
            show-style="tag" v-model="scope.row.owner" :maxlength="255"
            @change="editSomeFields(scope.row,'owner',$event)"
            :disabled="true"/>
      </template>
    </el-table-column>
    <el-table-column
        prop="executionId" label="执行编号" min-width="120" show-overflow-tooltip
        col-type="String" v-if="showCol('executionId')">
      <template #default="scope">
        <mdp-input
            show-style="tag" v-model="scope.row.executionId" :maxlength="64"
            @change="editSomeFields(scope.row,'executionId',$event)"
            :disabled="true"/>
      </template>
    </el-table-column>
    <el-table-column
        prop="procInstId" label="流程实例编号" min-width="120"
        show-overflow-tooltip col-type="String" v-if="showCol('procInstId')">
      <template #default="scope">
        <mdp-input
            show-style="tag" v-model="scope.row.procInstId" :maxlength="64"
            @change="editSomeFields(scope.row,'procInstId',$event)"
            :disabled="true"/>
      </template>
    </el-table-column>
    <el-table-column
        prop="procDefId" label="流程定义编号" min-width="120" show-overflow-tooltip
        col-type="String" v-if="showCol('procDefId')">
      <template #default="scope">
        <mdp-input
            show-style="tag" v-model="scope.row.procDefId" :maxlength="64"
            @change="editSomeFields(scope.row,'procDefId',$event)"
            :disabled="true"/>
      </template>
    </el-table-column>
    <el-table-column
        prop="description" label="流程描述" min-width="120" show-overflow-tooltip
        col-type="String" v-if="showCol('description')">
      <template #default="scope">
        <mdp-input
            show-style="tag" v-model="scope.row.description" :maxlength="4000"
            @change="editSomeFields(scope.row,'description',$event)"
            :disabled="true"/>
      </template>
    </el-table-column>
    <el-table-column
        prop="taskDefId" label="节点编号" min-width="120" show-overflow-tooltip
        col-type="String" v-if="showCol('taskDefId')">
      <template #default="scope">
        <mdp-input
            show-style="tag" v-model="scope.row.taskDefId" :maxlength="64"
            @change="editSomeFields(scope.row,'taskDefId',$event)"
            :disabled="true"/>
      </template>
    </el-table-column>
    <el-table-column
        prop="scopeDefinitionId" label="边界编号" min-width="120"
        show-overflow-tooltip col-type="String"
        v-if="showCol('scopeDefinitionId')">
      <template #default="scope">
        <mdp-input
            show-style="tag" v-model="scope.row.scopeDefinitionId" :maxlength="64"
            @change="editSomeFields(scope.row,'scopeDefinitionId',$event)"
            :disabled="true"/>
      </template>
    </el-table-column>
    <el-table-column
        prop="parentTaskId" label="上级任务编号" min-width="120"
        show-overflow-tooltip col-type="String" v-if="showCol('parentTaskId')">
      <template #default="scope">
        <mdp-input
            show-style="tag" v-model="scope.row.parentTaskId" :maxlength="64"
            @change="editSomeFields(scope.row,'parentTaskId',$event)"
            :disabled="true"/>
      </template>
    </el-table-column>
    <el-table-column
        prop="taskDefKey" label="节点定义编码" min-width="120"
        show-overflow-tooltip col-type="String" v-if="showCol('taskDefKey')">
      <template #default="scope">
        <mdp-input
            show-style="tag" v-model="scope.row.taskDefKey" :maxlength="64"
            @change="editSomeFields(scope.row,'taskDefKey',$event)"
            :disabled="true"/>
      </template>
    </el-table-column>
    <el-table-column
        prop="formKey" label="表单编码" min-width="120" show-overflow-tooltip
        col-type="String" v-if="showCol('formKey')">
      <template #default="scope">
        <mdp-input
            show-style="tag" v-model="scope.row.formKey" :maxlength="64"
            @change="editSomeFields(scope.row,'formKey',$event)"
            :disabled="true"/>
      </template>
    </el-table-column>
    <el-table-column
        prop="isCountEnabled" label="is_count_enabled_" min-width="120"
        show-overflow-tooltip col-type="String" v-if="showCol('isCountEnabled')">
      <template #default="scope">
        <mdp-input
            show-style="tag" v-model="scope.row.isCountEnabled" :maxlength="3"
            @change="editSomeFields(scope.row,'isCountEnabled',$event)"
            :disabled="true"/>
      </template>
    </el-table-column>
    <el-table-column
        prop="dueDate" label="过期时间" min-width="120" show-overflow-tooltip
        col-type="Date" v-if="showCol('dueDate')">
      <template #default="scope">
        <mdp-date
            type="date" placeholder="选择日期" show-style="tag"
            v-model="scope.row.dueDate"
            @change="editSomeFields(scope.row,'dueDate',$event)"
            value-format="YYYY-MM-DD HH:mm:ss" format="YYYY-MM-DD"
            :disabled="true"/>
      </template>
    </el-table-column>
    <el-table-column
        prop="varCount" label="var_count_" min-width="120" show-overflow-tooltip
        col-type="Integer" v-if="showCol('varCount')">
      <template #default="scope">
        <mdp-number
            show-style="tag" v-model="scope.row.varCount"
            @change="editSomeFields(scope.row,'varCount',$event)" :precision="0"
            :disabled="true"/>
      </template>
    </el-table-column>
    <el-table-column
        prop="idLinkCount" label="id_link_count_" min-width="120"
        show-overflow-tooltip col-type="Integer" v-if="showCol('idLinkCount')">
      <template #default="scope">
        <mdp-number
            show-style="tag" v-model="scope.row.idLinkCount"
            @change="editSomeFields(scope.row,'idLinkCount',$event)" :precision="0"
            :disabled="true"/>
      </template>
    </el-table-column>
    <el-table-column
        prop="subTaskCount" label="sub_task_count_" min-width="120"
        show-overflow-tooltip col-type="Integer" v-if="showCol('subTaskCount')">
      <template #default="scope">
        <mdp-number
            show-style="tag" v-model="scope.row.subTaskCount"
            @change="editSomeFields(scope.row,'subTaskCount',$event)" :precision="0"
            :disabled="true"/>
      </template>
    </el-table-column>
    <el-table-column
        prop="scopeId" label="scope_id_" min-width="120" show-overflow-tooltip
        col-type="String" v-if="showCol('scopeId')">
      <template #default="scope">
        <mdp-input
            show-style="tag" v-model="scope.row.scopeId" :maxlength="64"
            @change="editSomeFields(scope.row,'scopeId',$event)"
            :disabled="true"/>
      </template>
    </el-table-column>
    <el-table-column
        prop="subScopeId" label="sub_scope_id_" min-width="120"
        show-overflow-tooltip col-type="String" v-if="showCol('subScopeId')">
      <template #default="scope">
        <mdp-input
            show-style="tag" v-model="scope.row.subScopeId" :maxlength="64"
            @change="editSomeFields(scope.row,'subScopeId',$event)"
            :disabled="true"/>
      </template>
    </el-table-column>
    <el-table-column
        prop="category" label="分类" min-width="120" show-overflow-tooltip
        col-type="String" v-if="showCol('category')">
      <template #default="scope">
        <mdp-input
            show-style="tag" v-model="scope.row.category" :maxlength="255"
            @change="editSomeFields(scope.row,'category',$event)"
            :disabled="true"/>
      </template>
    </el-table-column>
    <el-table-column
        prop="scopeType" label="scope_type_" min-width="120" show-overflow-tooltip
        col-type="String" v-if="showCol('scopeType')">
      <template #default="scope">
        <mdp-input
            show-style="tag" v-model="scope.row.scopeType" :maxlength="64"
            @change="editSomeFields(scope.row,'scopeType',$event)"
            :disabled="true"/>
      </template>
    </el-table-column>
    <el-table-column label="操作" :width="currOpType=='mng'?200:200" fixed="right">
      <template #header>
      </template>
      <template #default="scope" v-if="currOpType=='mng'">
        <el-button
            :disabled="disBtn('editBtn') || !checkBtnQx('editBtn',menuDefId) "
            type="primary"
            @click="openForm({parentOpType:currOpType,subOpType:'edit',formData:scope.row,title:'修改'})"
            icon="edit" title="修改一条数据"/>
      </template>

      <template #default="scope" v-else-if="currOpType=='list'">
        <el-button
            type="primary"
            @click="openForm({parentOpType:currOpType,subOpType:'detail',formData:scope.row})"
            icon="view"/>
      </template>

      <template #default="scope" v-else-if="currOpType=='select' && multiple!=true">
        <el-button type="primary" @click="selectConfirm(scope.row)" icon="check"/>
      </template>
    </el-table-column>
  </el-table>
  <el-calendar v-if="defaultShowCalendar==true"  v-loading="load.list" v-model="calendarDate" v-cloak>
    <!-- 这里使用的是 2.5 slot 语法，对于新项目请使用 2.6 slot 语法-->
    <template #date-cell="{data}">
      <div :class="data.isSelected ? 'is-selected' : ''">
        <div>
          {{ data.day.split('-')[2] }}{{ data.isSelected ? '✔️' : '' }} 
        </div>
        <div class="center" v-for="(i,index) in showCalendarDataTips(data)" :key="index" @click="$refs['calDialog'].open(i)"> 
                <el-tag  type="info" v-if="i.startTasksCount>0">
                  {{ '起' + i.startTasksCount }}
                </el-tag>
                <el-tag type="warning" v-if="i.planFinishTasksCount>0">
                  {{ '止' + i.planFinishTasksCount }}
                </el-tag>
                <el-tag type="success" v-if="i.runningTasksCount>0">
                  {{ '中' + i.runningTasksCount }}
                </el-tag>
                <el-tag type="danger" v-if="i.delayTasksCount>0">
                  {{ '延' + i.delayTasksCount }}
                </el-tag>  
        </div>
      </div>
    </template>
  </el-calendar>
  <el-pagination
      class="padding-top"
      layout="slot,total, sizes, prev, next,pager,jumper"
      @current-change="handleCurrentChange"
      @size-change="handleSizeChange"
      :page-sizes="[10,20, 50, 100, 500]"
      :current-page="pageInfo.pageNum"
      :page-size="pageInfo.pageSize"
      :total="pageInfo.total"
      style="float:right;"
  />
  </el-col>
  </el-row>
  <!--新增修改明细 Task act_ru_task界面-->
  <mdp-dialog :ref="refId+'FormDialog'" width="80%">
    <template #default="{visible,data,dialog}">
      <procinst-parames-execution-set
          v-if="visible"
          :taskInfo="data.formData" :procDefId="data.formData.procDefId"
          :procInstId="data.formData.procInstId"
          :visible="visible" @cancel="dialog.close()" @submit="afterEditSubmit"/>
    </template>
  </mdp-dialog>
  <mdp-dialog ref="sendSmsDialog">
    <template #default="{visible,data,dialog}">
      <send-sms
          :sms-body-params="data.smsBodyParams" :sms-user-list="data.smsUserList"
          :load-phoneno-by-userid="true"
          :visible="visible" @cancel="dialog.close()"/>
    </template>
  </mdp-dialog>
  <mdp-dialog ref="calDialog" v-cloak width="70%">
    <template #default="{data}">    
                <el-space wrap class="padding">
                  <el-tag v-for=" tag,index in data.tags" :key="index" :type="tagTypes[(index % 4)]">
                    {{ tag.tagName + '(' + tag.count + ')' }}
                  </el-tag> 
                </el-space>
              <el-table :data="data.allTasks" max-height="450px">
                <el-table-column width="40" type="index"/>
                <el-table-column
                    sortable min-width="300" property="mainTitle"
                    label="流程【任务】(点击详情)">
                  <template #default="scope">
                    <el-link
                        type="primary"
                        @click="openForm({parentOpType:currOpType,subOpType:'edit',formData:scope.row})">
                      {{ scope.row.mainTitle }}【{{ scope.row.name }}】
                    </el-link>
                  </template>
                </el-table-column>
                <el-table-column sortable min-width="100" property="assigneeName" label="执行人"/>
                <el-table-column sortable min-width="80" property="calStatus" label="状态">
                  <template #default="scope">
                    <el-tag effect="dark" type="info" v-if="scope.row.calStatus=='开始'">开始
                    </el-tag>
                    <el-tag effect="dark" type="warning" v-if="scope.row.calStatus=='到期'">到期
                    </el-tag>
                    <el-tag effect="dark" type="success" v-if="scope.row.calStatus=='执行中'">
                      执行中
                    </el-tag>
                    <el-tag effect="dark" type="danger" v-if="scope.row.calStatus=='延期'">延期
                    </el-tag>
                  </template>
                </el-table-column>
                <el-table-column sortable min-width="120" property="tagNames" label="标签">
                  <template #default="scope">
                    <div v-if="scope.row.tagNames">
                      <el-tag
                          effect="light" type
                          v-for="(tagName,index) in scope.row.tagNames.split(',')"
                          :key="index">{{ tagName }}
                      </el-tag>
                    </div>
                  </template>
                </el-table-column>
                <el-table-column
                    sortable min-width="120" property="planFinishTime"
                    label="到期时间" show-overflow-tooltip/>
              </el-table> 
        </template>
  </mdp-dialog>
</template>

<script>

import util from "@/components/mdp-ui/js/util"; // 全局公共库
import {MdpTableMixin} from '@/components/mdp-ui/mixin/MdpTableMixin.js';
import * as TaskApi from '@/api/mdp/workflow/ru/task';
import {mapState} from 'pinia'
import {useUserStore} from '@/store/modules/user'
import ProcinstParamesExecutionSet from "../procinstParames/ProcinstParamesExecutionSet.vue"; // 流程参数加载
 
import SendSms from "@/views/mdp/sms/SendSms.vue"; // 流程参数加载
export default {
  name: 'TaskMng',
  components: {
    ProcinstParamesExecutionSet, SendSms
  },
  mixins: [MdpTableMixin],
  props: ["assigneeToMe", "isClaim", "bizPid", "bizId", "procInstIds", "source", "defaultShowCalendar"], // 待我执行的任务
  data() {
    const fromStartTime = new Date();
    const toStartTime = new Date();
    fromStartTime.setTime(fromStartTime.getTime() - 3600 * 1000 * 24 * 7 * 4);
    return {
      menuDefId: '',//menu_def.id 菜单表菜单编号，用于按钮权限判断
      menuDefName: 'act_ru_task',//menu_def.name 功能名称，用于导出excel等文件名
      refId: 'task',//引用编号，<table :ref="refId+'Table'"> <form :ref="refId+'Form'">
      pkNames: ["id"],//表格主键的java属性名称，驼峰命名，默认为id,支持多主键
      currOpType: 'mng',//表格 mng-综合管理具有最大权限，所有按钮可动、detail-只看不能操作
      filters: {//查询参数
        fromStartTime:fromStartTime,
        toStartTime:'',
      },
      defaultFilters: {//默认查询参数,第一次打开界面的时候用到，恢复默认值的时候用到

      },

      defaultCheckColumnNum: 8,//默认展示的表格列数，前8列

      editable: false,//是否可编辑模式

      //增删改查(含批量)接口
      apis: {
        list: TaskApi.listAssigneeToAnyTasks,
        add: TaskApi.addTask,
        del: TaskApi.delTask,
        edit: TaskApi.editTask,
        editSomeFields: TaskApi.editSomeFieldsTask,
        batchAdd: TaskApi.batchAddTask,
        batchDel: TaskApi.batchDelTask,
        batchEdit: TaskApi.batchEditTask,
      },
      weixinContentVisible: false,
      weixinContent: '', 
      calendarDate: toStartTime,
      tagTypes:['primary','success','warning','danger','info']
    }
  },
  computed: {},
  watch: {},
  mounted() {

  },
  methods: { 
    //页面初始化需要配置的特殊逻辑写这里
    initCurrData() {
 

      this.pageInfo.orderFields = ['create_time_']
      this.pageInfo.orderDirs = ['desc']
      this.searchTableDatas();
    },

    /**
     * 检查参数是否满足调用后台接口的条件
     *
     * @param params 提交给后台的参数池,map类型
     * @returns true / false
     */
    preQueryParamCheck(params) {
      this.userInfo = useUserStore().userInfo
      if (this.bizPid) {
        params.bizPid = this.bizPid
      }
      if (this.bizId) {
        params.bizId = this.bizId
      }
      if (this.procInstIds) {
        params.procInstId = "$IN" + this.procInstIds
      }
      if (this.assigneeToMe) {
        params.assignee = this.userInfo.userid
      }
      
      var categoryIds=this.$refs['cateTree'].$refs['nodeTree'].getCheckedKeys()
        if(categoryIds && categoryIds.length>0){
            params.categoryId=categoryIds[0]
        }
      if (this.isClaim) {
        this.apis.list = TaskApi.listMyCandidateUserTasks
      } else {
        this.apis.list = TaskApi.listAssigneeToAnyTasks
      }
      return true;
    },

    //页面数据加载完后需要对数据进行加工处理的
    afterList(res, isOk, apiName) {

    },

    /**
     * 对修改的字段进行判断，返回false ,将取消更新数据库
     * @param {*} row 当前选中的行
     * @param {*} fieldName 修改的字段名
     * @param {*} $event 修改后的值
     * @param {*} params 将要提交服务器的参数
     * @returns true/false 返回false ,将取消更新数据库
     */
    editSomeFieldsCheck(row, fieldName, $event, params) {
      if (this.currOpType == 'add' || this.currOpType == 'detail') {
        return false;
      }
      params[fieldName] = $event
      return true;
    },

    /**
     * 打开某个子页面
     */
    openForm(res) {
      let {parentOpType, formRefId, subOpType, formData} = res
      if (!formRefId) {
        formRefId = this.getRefId() + "FormDialog"
      }
      if (!parentOpType) {
        parentOpType = this.currOpType
      }
      var form = this.$refs[formRefId]
      if (form) {
        res.parentOpType = parentOpType
        res.formRefId = formRefId
        form.open(res);
      } else {

      }

    },

    showSendSms: function () {
      if (this.sels.length > 1) {
        this.$message({
          position: 'bottom-left', showClose: true,
          message: "一次只能给一个人发短信",
          type: "error"
        });
      } else if (this.sels.length < 1) {
        this.$message({
          position: 'bottom-left', showClose: true,
          message: "请选择一条任务",
          type: "error"
        });
      } else {
        const task = this.sels[0];
        var smsBodyParams = [
          task.assigneeName,
          task.mainTitle + "-" + task.taskName,
          task.createTime,
          task.userid
        ];
        var smsUserList = [{
          userid: task.assignee
        }];
        this.$refs['sendSmsDialog'].open({smsBodyParams: smsBodyParams, smsUserList: smsUserList})
      }
    },
    showWeixin: function () {
      if (this.sels.length < 1) {
        this.$message({
          position: 'bottom-left', showClose: true,
          message: "请选择任务",
          type: "error"
        });
        this.weixinContentVisible = false;
        return false;
      } else if (this.sels.length == 1) {
        const task = this.sels[0]; 
        const href =this.$mdp.getUri(window.location.protocol + "//" + window.location.host,import.meta.env.VITE_CONTEXT,import.meta.env.VITE_UI_VERSION,"/#/","/mdp/workflow/ru/task/me")

        this.weixinContentVisible = true;
        this.weixinContent =
            task.assigneeName +
            "您好，您有任务【" +
            task.mainTitle +
            "-" +
            task.name +
            "】待处理，请登陆OA系统或者点击以下链接处理。" +
            url

        this.$copyText(this.weixinContent).then(e => {
          this.$message({
            position: 'bottom-left', showClose: true,
            message: "已拷贝内容，请黏贴到微信中",
            type: "success"
          });
        });
      } else { 
        const href =this.$mdp.getUri(window.location.protocol + "//" + window.location.host,import.meta.env.VITE_CONTEXT,import.meta.env.VITE_UI_VERSION,"/#/","/mdp/workflow/ru/task/me")

        this.weixinContentVisible = true;
        this.weixinContent =
            this.sels.map(k => k.assigneeName).join(",") +
            "您好，您有任务待处理，请登陆OA系统或者点击以下链接处理。" +
            url
        this.$copyText(this.weixinContent).then(e => {
          this.$message({
            position: 'bottom-left', showClose: true,
            message: "已拷贝内容，请黏贴到微信中",
            type: "success"
          });
        });
      }
    },
    showOaMsg: function () {
      if (this.sels.length > 1) {
        this.$message({
          position: 'bottom-left', showClose: true,
          message: "一次只能给一个人发信",
          type: "error"
        });
        return false;
      } else if (this.sels.length < 1) {
        this.$message({
          position: 'bottom-left', showClose: true,
          message: "请选择一条任务",
          type: "error"
        });
        return false;
      } else {
        const task = this.sels[0];
        var msgBody =
            task.assigneeName +
            "您好，您有任务【" +
            task.mainTitle +
            "-" +
            task.taskName +
            "】待处理，请登陆OA系统处理"; 
        const href =this.$mdp.getUri(window.location.protocol + "//" + window.location.host,"im",import.meta.env.VITE_UI_VERSION,"/#/","/mdp/im/messages/messageChat?toUserid=" +
            task.assignee +
            "&msgBody=" +
            msgBody)

        window.open(href, "_blank");
      }
    },
    doCopyWeixinUrl: function () {
      this.weixinContentVisible = false; 
      const href =this.$mdp.getUri(window.location.protocol + "//" + window.location.host,import.meta.env.VITE_CONTEXT,import.meta.env.VITE_UI_VERSION,"/#/","/mdp/workflow/ru/task/me")

      this.$copyText(href).then(e => {
      });
    },
    doCopyWeixinContent: function () {
      this.weixinContentVisible = false;
      this.$copyText(this.weixinContent).then(e => {
      });
    },
    showCalendarDataTips: function (data) {
      var date=data.date
      var datas = this.tableDatas;
      var startTasks = [];
      var planFinishTasks = [];
      var runningTasks = [];
      var delayTasks = [];
      var tags = [];

      var now = new Date();
      var dateStr = util.formatDate(now, "yyyy-MM-dd");
      if (dateStr == data.day) {
        data.isSelected = true;
      }
      datas.forEach(i => {
        var task = Object.assign({}, i);
        if (task.createTime.indexOf(data.day) >= 0) {
          task.calStatus = "开始";
          startTasks.push(task);
        }

        if (task.planFinishTime) {
          if (task.planFinishTime.indexOf(data.day) >= 0) {
            task.calStatus = "到期";
            planFinishTasks.push(task);
          } else if (
              task.planFinishTime > data.day &&
              task.createTime < data.day
          ) {
            task.calStatus = "执行中";
            runningTasks.push(task);
          } else if (
              task.planFinishTime > data.day &&
              task.createTime > data.day
          ) {
            // 未开始
          } else if (task.planFinishTime < data.day && dateStr >= data.day) {
            task.calStatus = "延期";
            delayTasks.push(task);
          }
        } else {
          if (task.createTime < data.day) {
            task.calStatus = "执行中";
            runningTasks.push(task);
          } else if (task.createTime > data.day) {
            // 未开始
          }
        }
      });

      var allTasks = startTasks
          .concat(planFinishTasks)
          .concat(runningTasks)
          .concat(delayTasks);
      allTasks.forEach(i => {
        var tagIds = i.tagIds ? i.tagIds.split(",") : [];
        var tagNames = i.tagNames ? i.tagNames.split(",") : [];
        tagIds.forEach((tagId, index) => {
          var tag = tags.find(t => t.tagId == tagId);
          if (tag) {
            tag.count = tag.count + 1;
          } else {
            tag = {
              tagId: tagId,
              tagName: tagNames[index],
              count: 1
            };
            tags.push(tag);
          }
        });
      });

      var msg = {
        startTasks: startTasks,
        planFinishTasks: planFinishTasks,
        runningTasks: runningTasks,
        startTasksCount: startTasks.length,
        planFinishTasksCount: planFinishTasks.length,
        runningTasksCount: runningTasks.length,
        delayTasksCount: delayTasks.length,
        delayTasks: delayTasks,
        allTasks: allTasks,
        tags: tags
      }; 
      return [msg];
    },
    // 表格排序 obj.order=ascending/descending,需转化为 asc/desc ; obj.prop=表格中的排序字段,字段驼峰命名
    sortChange(obj) {
      if (obj.order == null) {
        this.pageInfo.orderFields = [];
        this.pageInfo.orderDirs = [];
      } else {
        var dir = 'asc';
        if (obj.order == 'ascending') {
          dir = 'asc'
        } else {
          dir = 'desc';
        }
        var fieldName = util.toLine(obj.prop)
        if (fieldName == 'create_time') {
          fieldName = fieldName + "_"
        }
        this.pageInfo.orderFields = [fieldName];
        this.pageInfo.orderDirs = [dir];
      }
      this.loadTableDatas();
    },
  }
}

</script>

<style scoped>
</style>
