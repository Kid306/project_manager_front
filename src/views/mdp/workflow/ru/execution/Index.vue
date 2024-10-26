<template>
    <el-row gutter="20">
    <el-col :span="6">
      <MdpCateTree show-checkbox ref="cateTree"/>
    </el-col>
    <el-col :span="18">
      <ContentWrap>
    <el-space wrap> 
      <mdp-select
          v-model="filters['res.suspensionState']" width="5em" item-code="suspensionState" clearable filterable
          placeholder="状态"/>

      <el-input
          v-model="filters['pa.mainTitle']" style="width: 10em;" placeholder="名字"
          clearable title="支持>、<、 >=、<=、!=、*字符*、$IS NULL、$IN 1,2,3、$between 1,5等操作符"/>

      <el-input
          v-model="filters['pa.startUsername']" style="width: 10em;"
          placeholder="发起人" clearable
          title="支持>、<、 >=、<=、!=、*字符*、$IS NULL、$IN 1,2,3、$between 1,5等操作符"/>

      <el-input
          v-model="filters['pa.startDeptName']" style="width: 10em;"
          placeholder="发起部门" clearable
          title="支持>、<、 >=、<=、!=、*字符*、$IS NULL、$IN 1,2,3、$between 1,5等操作符"/>
      <mdp-date-range
          v-model="filters" startKey="fromStartTime" style="width: 14em;" endKey="toStartTime" type="daterange"
          align="right" unlink-panels
          range-separator="-" start-placeholder="创建日期" end-placeholder="创建日期" value-format="YYYY-MM-DD HH:mm:ss" />
      <el-button
          v-loading="load.list" :disabled="load.list==true" @click="searchTableDatas()" icon="search"
          type="primary">查询
      </el-button>
    </el-space>
    <template #header>
      <el-space wrap> 
        <mdp-select-tag v-model="filters['tagIds']" width="8em" clearable filterable placeholder="标签"/>
        <mdp-hi-query :column-configs="columnConfigs" v-model="hiQueryParams" @change="onHiQueryParamsChange"/>
        <el-button icon="zoom-out" @click="searchReset()" title="重置查询条件"/>
        <el-popover placement="top" width="375" trigger="manual" v-model="weixinContentVisible">
          <p>{{ weixinContent }}</p>
          <div style="text-align: right; margin: 0">
            <el-button  type="text" @click="doCopyWeixinUrl">拷贝链接</el-button>
            <el-button type="text"  @click="doCopyWeixinContent">拷贝内容</el-button>
          </div>
          <el-button link @click="showWeixin">微信催办
          </el-button>
        </el-popover>

        <el-button @click="showSendSms" link>短信催办</el-button>
        <span v-if="currOpType=='mng'">
                 <el-button
                     :disabled="true"
                     type="danger" v-loading="load.del" @click="batchDel" icon="delete"/>
            </span>
        <span v-else-if="currOpType=='select' &&  multiple==true">
                <el-button
                    :disabled="disBtn('selectBtn') || sels.length===0" type="primary"
                    @click="selectListConfirm" icon="check"/>
            </span>

        <el-button icon="download" @click="export2Excel()" title="导出当前结果" />
        <mdp-table-configs :column-configs="columnConfigs" v-model="checkedColumns"/>
      </el-space>
    </template>
  </ContentWrap>
  <el-table v-if="defaultShowCalendar!=true"
      v-adaptive :ref="refId+'Table'" :data="tableDatas" @sort-change="sortChange" highlight-current-row
      v-loading="load.list" border @selection-change="selsChange" @row-click="rowClick" style="width: 100%;">
    <el-table-column
        type="selection" width="55" show-overflow-tooltip fixed="left"
        v-if="currOpType=='mng' || multiple==true"/>
    <el-table-column sortable type="index" width="55" show-overflow-tooltip fixed="left"/>
    <el-table-column sortable prop="mainTitle" label="流程" min-width="300">
      <template #default="{row}">
        <div style="display:flex;justify-content: flex-start;"><mdp-select style="width:auto;" show-style="tag" item-code="suspensionState" v-model="row.suspensionState" :disabled="true"/><div>{{ row.mainTitle }}</div></div>
      </template>

    </el-table-column> 
    
    <el-table-column sortable prop="startUsername" label="发起人" width="100" show-overflow-tooltip/>
    
    <el-table-column
        prop="startTime" sortable label="发起时间" min-width="120"  show-overflow-tooltip
        col-type="Date" v-if="showCol('startTime')"/>
    <el-table-column label="当前任务" prop="taskName" min-width="120"/>
    
    <el-table-column label="责任人" prop="assigneeName" min-width="120"/>
    <el-table-column sortable prop="tagNames" label="标签" min-width="100" show-overflow-tooltip>
      <template #default="scope">
        <mdp-select-tag
            show-style="tag" v-model="scope.row.tagIds" clearable filterable placeholder="标签" multiple
            split="," :disabled="true"/>
      </template>
    </el-table-column> 
    <el-table-column
        prop="tenantId" label="机构号" min-width="120" show-overflow-tooltip col-type="String"/>
    
    <el-table-column prop="suspensionState" label="状态" min-width="80">
      <template #default="scope">
        <mdp-select
            @click="rowClick(scope.row)" show-style="tag" item-code="suspensionState"
            v-model="scope.row.suspensionState" :maxlength="64"
            @change="editSomeFields(scope.row,'suspensionState',$event)"
            :disabled="disField||true"/>
      </template>
    </el-table-column>
    <el-table-column sortable prop="planFinishTime" label="到期时间" width="120" show-overflow-tooltip/>
    <el-table-column
        prop="startUserId" label="发起人编号" min-width="120" show-overflow-tooltip col-type="String"
        v-if="showCol('startUserId')"/>  
    <el-table-column sortable prop="startDeptName" label="发起部门" width="150" show-overflow-tooltip/>
    <el-table-column
        prop="lockTime" label="锁定时间" min-width="120" show-overflow-tooltip col-type="Date"
        v-if="showCol('lockTime')">
      <template #default="scope">
        <mdp-date
            type="date" placeholder="选择日期" show-style="tag" v-model="scope.row.lockTime"
            @change="editSomeFields(scope.row,'lockTime',$event)" value-format="YYYY-MM-DD HH:mm:ss"
            format="YYYY-MM-DD" :disabled="true"/>
      </template>
    </el-table-column>

    <el-table-column
        prop="procInstId" label="实例编号" min-width="120" show-overflow-tooltip col-type="String"
        v-if="showCol('procInstId')">
      <template #default="scope">
        <mdp-input
            show-style="tag" v-model="scope.row.procInstId" :maxlength="64"
            @change="editSomeFields(scope.row,'procInstId',$event)"
            :disabled="true"/>
      </template>
    </el-table-column>
    <el-table-column
        prop="procDefId" label="定义编号" min-width="120" show-overflow-tooltip col-type="String"
        v-if="showCol('procDefId')">
      <template #default="scope">
        <mdp-input
            show-style="tag" v-model="scope.row.procDefId" :maxlength="64"
            @change="editSomeFields(scope.row,'procDefId',$event)"
            :disabled="true"/>
      </template>
    </el-table-column>

    <el-table-column
        prop="actId" label="节点编号" min-width="120" show-overflow-tooltip col-type="String"
        v-if="showCol('actId')">
      <template #default="scope">
        <mdp-input
            show-style="tag" v-model="scope.row.actId" :maxlength="64"
            @change="editSomeFields(scope.row,'actId',$event)"
            :disabled="true"/>
      </template>
    </el-table-column>
    <el-table-column
        prop="isActive" label="活动的" min-width="120" show-overflow-tooltip col-type="String"
        v-if="showCol('isActive')">
      <template #default="scope">
        <mdp-input
            show-style="tag" v-model="scope.row.isActive" :maxlength="3"
            @change="editSomeFields(scope.row,'isActive',$event)"
            :disabled="true"/>
      </template>
    </el-table-column>
    <el-table-column
        prop="startActId" label="启动节点编号" min-width="120" show-overflow-tooltip col-type="String"
        v-if="showCol('startActId')">
      <template #default="scope">
        <mdp-input
            show-style="tag" v-model="scope.row.startActId" :maxlength="64"
            @change="editSomeFields(scope.row,'startActId',$event)"
            :disabled="true"/>
      </template>
    </el-table-column>
    <el-table-column
        prop="isCountEnabled" label="是否可统计" min-width="120" show-overflow-tooltip
        col-type="String" v-if="showCol('isCountEnabled')">
      <template #default="scope">
        <mdp-input
            show-style="tag" v-model="scope.row.isCountEnabled" :maxlength="3"
            @change="editSomeFields(scope.row,'isCountEnabled',$event)"
            :disabled="true"/>
      </template>
    </el-table-column>
    <el-table-column
        prop="businessKey" label="编码" min-width="120" show-overflow-tooltip col-type="String"
        v-if="showCol('businessKey')">
      <template #default="scope">
        <mdp-input
            show-style="tag" v-model="scope.row.businessKey" :maxlength="64"
            @change="editSomeFields(scope.row,'businessKey',$event)"
            :disabled="true"/>
      </template>
    </el-table-column>
    <el-table-column
        prop="parentId" label="上级编号" min-width="120" show-overflow-tooltip col-type="String"
        v-if="showCol('parentId')">
      <template #default="scope">
        <mdp-input
            show-style="tag" v-model="scope.row.parentId" :maxlength="64"
            @change="editSomeFields(scope.row,'parentId',$event)"
            :disabled="true"/>
      </template>
    </el-table-column>
    <el-table-column
        prop="taskCount" label="任务数统计" min-width="120" show-overflow-tooltip col-type="Integer"
        v-if="showCol('taskCount')">
      <template #default="scope">
        <mdp-number
            show-style="tag" v-model="scope.row.taskCount"
            @change="editSomeFields(scope.row,'taskCount',$event)" :precision="0"
            :disabled="true"/>
      </template>
    </el-table-column>
    <el-table-column
        prop="cachedEntState" label="缓存状态" min-width="120" show-overflow-tooltip col-type="Integer"
        v-if="showCol('cachedEntState')">
      <template #default="scope">
        <mdp-number
            show-style="tag" v-model="scope.row.cachedEntState"
            @change="editSomeFields(scope.row,'cachedEntState',$event)" :precision="0"
            :disabled="true"/>
      </template>
    </el-table-column>
    <el-table-column
        prop="isMiRoot" label="是否根" min-width="120" show-overflow-tooltip col-type="String"
        v-if="showCol('isMiRoot')">
      <template #default="scope">
        <mdp-input
            show-style="tag" v-model="scope.row.isMiRoot" :maxlength="3"
            @change="editSomeFields(scope.row,'isMiRoot',$event)"
            :disabled="true"/>
      </template>
    </el-table-column>
    <el-table-column
        prop="isScope" label="是否边界" min-width="120" show-overflow-tooltip col-type="String"
        v-if="showCol('isScope')">
      <template #default="scope">
        <mdp-input
            show-style="tag" v-model="scope.row.isScope" :maxlength="3"
            @change="editSomeFields(scope.row,'isScope',$event)"
            :disabled="true"/>
      </template>
    </el-table-column>
    <el-table-column
        prop="isEventScope" label="是否事件边界" min-width="120" show-overflow-tooltip
        col-type="String" v-if="showCol('isEventScope')">
      <template #default="scope">
        <mdp-input
            show-style="tag" v-model="scope.row.isEventScope" :maxlength="3"
            @change="editSomeFields(scope.row,'isEventScope',$event)"
            :disabled="true"/>
      </template>
    </el-table-column>
    <el-table-column
        prop="isConcurrent" label="是否当前节点" min-width="120" show-overflow-tooltip
        col-type="String" v-if="showCol('isConcurrent')">
      <template #default="scope">
        <mdp-input
            show-style="tag" v-model="scope.row.isConcurrent" :maxlength="3"
            @change="editSomeFields(scope.row,'isConcurrent',$event)"
            :disabled="true"/>
      </template>
    </el-table-column>
    <el-table-column
        prop="rev" label="版本号" min-width="120" show-overflow-tooltip col-type="Integer"
        v-if="showCol('rev')">
      <template #default="scope">
        <mdp-number
            show-style="tag" v-model="scope.row.rev" @change="editSomeFields(scope.row,'rev',$event)"
            :precision="0" :disabled="true"/>
      </template>
    </el-table-column>
    <el-table-column
        prop="rootProcInstId" label="根实例编号" min-width="120" show-overflow-tooltip
        col-type="String" v-if="showCol('rootProcInstId')">
      <template #default="scope">
        <mdp-input
            show-style="tag" v-model="scope.row.rootProcInstId" :maxlength="64"
            @change="editSomeFields(scope.row,'rootProcInstId',$event)"
            :disabled="true"/>
      </template>
    </el-table-column>
    <el-table-column
        prop="superExec" label="super_exec_" min-width="120" show-overflow-tooltip col-type="String"
        v-if="showCol('superExec')">
      <template #default="scope">
        <mdp-input
            show-style="tag" v-model="scope.row.superExec" :maxlength="64"
            @change="editSomeFields(scope.row,'superExec',$event)"
            :disabled="true"/>
      </template>
    </el-table-column>
    <el-table-column
        prop="evtSubscrCount" label="evt_subscr_count_" min-width="120" show-overflow-tooltip
        col-type="Integer" v-if="showCol('evtSubscrCount')">
      <template #default="scope">
        <mdp-number
            show-style="tag" v-model="scope.row.evtSubscrCount"
            @change="editSomeFields(scope.row,'evtSubscrCount',$event)" :precision="0"
            :disabled="true"/>
      </template>
    </el-table-column>
    <el-table-column
        prop="jobCount" label="job_count_" min-width="120" show-overflow-tooltip col-type="Integer"
        v-if="showCol('jobCount')">
      <template #default="scope">
        <mdp-number
            show-style="tag" v-model="scope.row.jobCount"
            @change="editSomeFields(scope.row,'jobCount',$event)" :precision="0"
            :disabled="true"/>
      </template>
    </el-table-column>
    <el-table-column
        prop="timerJobCount" label="timer_job_count_" min-width="120" show-overflow-tooltip
        col-type="Integer" v-if="showCol('timerJobCount')">
      <template #default="scope">
        <mdp-number
            show-style="tag" v-model="scope.row.timerJobCount"
            @change="editSomeFields(scope.row,'timerJobCount',$event)" :precision="0"
            :disabled="true"/>
      </template>
    </el-table-column>
    <el-table-column
        prop="suspJobCount" label="susp_job_count_" min-width="120" show-overflow-tooltip
        col-type="Integer" v-if="showCol('suspJobCount')">
      <template #default="scope">
        <mdp-number
            show-style="tag" v-model="scope.row.suspJobCount"
            @change="editSomeFields(scope.row,'suspJobCount',$event)" :precision="0"
            :disabled="true"/>
      </template>
    </el-table-column>
    <el-table-column
        prop="deadletterJobCount" label="deadletter_job_count_" min-width="120" show-overflow-tooltip
        col-type="Integer" v-if="showCol('deadletterJobCount')">
      <template #default="scope">
        <mdp-number
            show-style="tag" v-model="scope.row.deadletterJobCount"
            @change="editSomeFields(scope.row,'deadletterJobCount',$event)" :precision="0"
            :disabled="true"/>
      </template>
    </el-table-column>
    <el-table-column
        prop="varCount" label="var_count_" min-width="120" show-overflow-tooltip col-type="Integer"
        v-if="showCol('varCount')">
      <template #default="scope">
        <mdp-number
            show-style="tag" v-model="scope.row.varCount"
            @change="editSomeFields(scope.row,'varCount',$event)" :precision="0"
            :disabled="true"/>
      </template>
    </el-table-column>
    <el-table-column
        prop="idLinkCount" label="id_link_count_" min-width="120" show-overflow-tooltip
        col-type="Integer" v-if="showCol('idLinkCount')">
      <template #default="scope">
        <mdp-number
            show-style="tag" v-model="scope.row.idLinkCount"
            @change="editSomeFields(scope.row,'idLinkCount',$event)" :precision="0"
            :disabled="true"/>
      </template>
    </el-table-column>
    <el-table-column
        prop="callbackId" label="callback_id_" min-width="120" show-overflow-tooltip col-type="String"
        v-if="showCol('callbackId')">
      <template #default="scope">
        <mdp-input
            show-style="tag" v-model="scope.row.callbackId" :maxlength="64"
            @change="editSomeFields(scope.row,'callbackId',$event)"
            :disabled="true"/>
      </template>
    </el-table-column>
    <el-table-column
        prop="callbackType" label="callback_type_" min-width="120" show-overflow-tooltip
        col-type="String" v-if="showCol('callbackType')">
      <template #default="scope">
        <mdp-input
            show-style="tag" v-model="scope.row.callbackType" :maxlength="255"
            @change="editSomeFields(scope.row,'callbackType',$event)"
            :disabled="true"/>
      </template>
    </el-table-column>
    <el-table-column
        prop="id" label="编号" min-width="120" show-overflow-tooltip col-type="String"
        v-if="showCol('id')"/>

    <el-table-column label="操作" :width="currOpType=='mng'?280:280" fixed="right">
      <template #header>
      </template>
      <template #default="scope" v-if="currOpType=='mng'">


        <el-button
            :disabled="disBtn('editBtn') || !checkBtnQx('editBtn',menuDefId) " type="primary"
            @click="openForm({parentOpType:currOpType,subOpType:'edit',formData:scope.row,title:'详情'})"
            icon="edit" title="修改一条数据"/>
        <el-button
            :disabled="disBtn('delBtn') || !checkBtnQx('delBtn',menuDefId) " type="danger"
            @click="handleDel(scope.row,scope.$index)" icon="delete" title="删除一条数据"/>
        <el-button
            type="primary" v-if="scope.row.suspensionState=='1'"
            @click="handleSuspend(scope.row)"
            title="挂起流程">挂起
        </el-button>
        <el-button
            type="primary" v-if="scope.row.suspensionState=='2'"
            @click="handleActivite(scope.row)"
            title="激活流程">激活
        </el-button>

      </template>

      <template #default="scope" v-else-if="currOpType=='list'">
        <el-button
            type="primary" @click="openForm({parentOpType:currOpType,subOpType:'detail',formData:scope.row})"
            icon="view"/>
      </template>

      <template #default="scope" v-else-if="currOpType=='select' && multiple!=true">
        <el-button type="primary" @click="selectConfirm(scope.row)" icon="check"/>
      </template>
    </el-table-column>
  </el-table>
  <el-calendar v-if="defaultShowCalendar==true" v-loading="load.list" v-model="calendarDate">
    <!-- 这里使用的是 2.5 slot 语法，对于新项目请使用 2.6 slot 语法-->
    <!--      #dateCell-->
    <template #default="{data}">
      <div
          :class=" data.isSelected ?'is-selected' : ''">
        <div class="calendar-cell-data"> {{ data.day.split('-')[2] }}{{ data.isSelected ? '✔️' : '' }}
          <div v-for=" (i,index)  in  showCalendarDataTips(data)" :key="index" @click="$refs['calDialog'].open(i)">
            
                <el-tag effect="dark" type="info" v-if="i.startTasksCount>0">{{
                    '始' + i.startTasksCount
                  }}
                </el-tag>
                <el-tag effect="dark" type="warning" v-if="i.planFinishTasksCount>0">
                  {{ '止' + i.planFinishTasksCount }}
                </el-tag>
                <el-tag effect="dark" type="success" v-if="i.runningTasksCount>0">{{
                    '中:' + i.runningTasksCount
                  }}
                </el-tag>
                <el-tag effect="dark" type="danger" v-if="i.delayTasksCount>0">{{ '延' + i.delayTasksCount }}
                </el-tag> 
          </div>
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

  />
    </el-col>
  </el-row>
 
  <!--新增修改明细 Execution act_ru_execution界面-->
  <mdp-dialog :ref="refId+'FormDialog'" width="80%">
    <template #default="{visible,data,dialog}">
      <procinst-parames-execution-set
          v-if="data.formData"
          :taskInfo="data.formData" :procDefId="data.formData.procDefId" :procInstId="data.formData.procInstId"
          :visible="visible" @cancel="dialog.close()" @submit="afterEditSubmit"/>
    </template>
  </mdp-dialog>
  <mdp-dialog>
    <template #default="{}">
      <tag-mng :jump="true" @select-confirm="onTagSelected"/>
    </template>
  </mdp-dialog>
  <mdp-dialog ref="sendSmsDialog">
    <template #default="{visible,data,dialog}">
      <send-sms
          :sms-body-params="data.smsBodyParams" :sms-user-list="data.smsUserList" :load-phoneno-by-userid="true"
          :visible="visible" @cancel="dialog.close()"/>
    </template>
  </mdp-dialog>
  <mdp-dialog width="80%" ref="calDialog">
    <template #default="{data}">  
          <el-space wrap class="padding">
            <el-tag v-for=" tag in data.tags" :key="tag.id">{{ tag.tagName + '(' + tag.count + ')' }}</el-tag>
          </el-space> 
        <el-table v-adaptive :data="data.allTasks" max-height="450px" max-width="450px">
          <el-table-column width="40" type="index"/>
          <el-table-column sortable min-width="250" property="mainTitle" label="流程【任务】(点击详情)">
            <template #default="scope">
              <el-link type="primary" @click.stop="showTasksInfo( scope.row,scope.$index)">
                {{ scope.row.mainTitle }}【{{ scope.row.taskName }}】
              </el-link>
            </template>
          </el-table-column>
          <el-table-column sortable prop="assigneeName" label="执行人" min-width="100"/>
          <el-table-column sortable min-width="80" property="calStatus" label="状态">
            <template #default="scope">
              <el-tag effect="dark" type="info" v-if="scope.row.calStatus=='开始'">开始</el-tag>
              <el-tag effect="dark" type="warning" v-if="scope.row.calStatus=='到期'">到期</el-tag>
              <el-tag effect="dark" type="success" v-if="scope.row.calStatus=='执行中'">执行中</el-tag>
              <el-tag effect="dark" type="danger" v-if="scope.row.calStatus=='延期'">延期</el-tag>
            </template>

          </el-table-column>
          <el-table-column sortable min-width="120" property="tagNames" label="标签">
            <template #default="scope">
              <MdpSelectTab v-model="scope.row.tagIds" :initName="scope.row.tagNames" split="," multiple disabled/>
            </template>
          </el-table-column>
          <el-table-column sortable min-width="100" property="planFinishTime" label="到期时间"/>
        </el-table> 
    </template>
  </mdp-dialog>
</template>

<script>
import util from "@/components/mdp-ui/js/util"; // 全局公共库
import {MdpTableMixin} from '@/components/mdp-ui/mixin/MdpTableMixin.js';
import * as ExecutionApi from '@/api/mdp/workflow/ru/execution'; 
import {mapState} from 'pinia'
import {useUserStore} from '@/store/modules/user'
import ProcinstParamesExecutionSet from "../procinstParames/ProcinstParamesExecutionSet.vue"; //流程参数加载

// import {createShortToken} from '@/api/login'; //下拉框数据查询

// import Vue from "vue";
// import VueClipboard from "vue-clipboard2";
//
// VueClipboard.config.autoSetContainer = true; // add this line
// Vue.use(VueClipboard);

import SendSms from "@/views/mdp/sms/SendSms.vue";
import TagMng from "@/components/mdp-ui-ext/mdp-select-tag/TagSelect.vue" // 流程参数加载

export default {
  name: 'ExecutionMng',
  components: {
    TagMng,
    ProcinstParamesExecutionSet, SendSms,
  },
  mixins: [MdpTableMixin],
  props: ['isMyMonitors', 'isMyStart', 'isMySponsors', 'isArchive', 'isMyPartake', 'isAll', 'defaultShowCalendar'],
  data() {
    const fromStartTime = new Date();
    const toStartTime = new Date();
    fromStartTime.setTime(fromStartTime.getTime() - 3600 * 1000 * 24 * 7 * 4);
    return {
      menuDefId: '',//menu_def.id 菜单表菜单编号，用于按钮权限判断
      menuDefName: 'act_ru_execution',//menu_def.name 功能名称，用于导出excel等文件名
      refId: 'execution',//引用编号，<table :ref="refId+'Table'"> <form :ref="refId+'Form'">
      pkNames: ["id"],//表格主键的java属性名称，驼峰命名，默认为id,支持多主键
      currOpType: 'mng',//表格 mng-综合管理具有最大权限，所有按钮可动、detail-只看不能操作
      filters: {//查询参数

      },
      defaultFilters: {//默认查询参数,第一次打开界面的时候用到，恢复默认值的时候用到

      },
      editable: false,
      defaultCheckColumnNum: 8,//默认展示的表格列数，前8列

      //增删改查(含批量)接口
      apis: {
        list: ExecutionApi.listExecution,
        add: ExecutionApi.addExecution,
        del: ExecutionApi.delExecution,
        edit: ExecutionApi.editExecution,
        editSomeFields: ExecutionApi.editSomeFieldsExecution,
        batchAdd: ExecutionApi.batchAddExecution,
        batchDel: ExecutionApi.batchDelExecution,
        batchEdit: ExecutionApi.batchEditExecution,
      },
      weixinContentVisible: false,
      weixinContent: '',
      showCalendar: false,
      calendarDate: toStartTime ,
    }
  },
  computed: {},
  watch: {},
  mounted() {

  },
  methods: { 
    //页面初始化需要配置的特殊逻辑写这里
    initCurrData() { 

      this.pageInfo.orderFields = ['start_time_']
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
      if (this.isMyStart) {
        params['pa.userid'] = this.userInfo.userid
      }
      if (this.isMyPartake) {
        params.partake = this.userInfo.userid
      }
      if (this.isMySponsors) {
        params.sponsors = '*' + this.userInfo.userid + '*'
      }
      if (this.isMyMonitors) {
        params.monitors = '*' + this.userInfo.userid + '*'
      }

      if (this.bizPid) {
        params.bizPid = this.bizPid
      }
      if (this.bizId) {
        params.bizId = this.bizId
      }
      if (this.procInstIds) {
        params.procInstId = "$IN" + this.procInstIds
      }

      var categoryIds=this.$refs['cateTree'].$refs['nodeTree'].getCheckedKeys()
        if(categoryIds && categoryIds.length>0){
            params.categoryId=categoryIds[0]
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
    onTagSelected(tags) {

    },
    formatterSuspensionState(row, column, cellValue) {
      return cellValue == 1 ? "激活的" : "挂起的"
    },

    //激活流程
    handleActivite: function (row, index) {
      this.$confirm('确认要激活该流程吗?', '提示', {
        type: 'warning'
      }).then(() => {
        this.load.list = true;
        let params = {
          procInstId: row.procInstId
        };
        ExecutionApi.activiteExecution(params).then((res) => {
          this.load.list = false;
          var tips = res.tips;
          if (tips.isOk) {
            this.pageInfo.total = 0;
            this.searchTableDatas();
          }
          this.$message({
            position: 'bottom-left', showClose: true,
            message: tips.msg,
            type: tips.isOk ? 'success' : 'error'
          });

        });
      }).catch(() => {
        this.load.list = false;

      });
    },
    //挂起流程
    handleSuspend: function (row, index) {
      this.$confirm('确认要挂起该流程吗?', '提示', {
        type: 'warning'
      }).then(() => {
        this.load.list = true;
        let params = {
          procInstId: row.procInstId
        };
        ExecutionApi.suspendExecution(params).then((res) => {
          this.load.list = false;
          var tips = res.tips;
          if (tips.isOk) {
            this.pageInfo.total = 0;
            this.searchTableDatas();
          }
          this.$message({
            position: 'bottom-left', showClose: true,
            message: tips.msg,
            type: tips.isOk ? 'success' : 'error'
          });

        });
      }).catch(() => {
        this.load.list = false;

      });
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
        // var url=window.location.href;
        const url =this.$mdp.getUri(window.location.protocol + "//" + window.location.host,import.meta.env.VITE_CONTEXT,import.meta.env.VITE_UI_VERSION,"/#/","/mdp/workflow/ru/task/me")
        this.weixinContentVisible = true;
        this.weixinContent =
            task.assigneeName +
            "您好，您有任务【" +
            task.mainTitle + "】待处理，请登陆OA系统或者点击以下链接处理。" +
            url

        this.$copyText(this.weixinContent).then(e => {
          this.$message({
            position: 'bottom-left', showClose: true,
            message: "已拷贝内容，请黏贴到微信中",
            type: "success"
          });
        });
      } else { 
        const url =this.$mdp.getUri(window.location.protocol + "//" + window.location.host,import.meta.env.VITE_CONTEXT,import.meta.env.VITE_UI_VERSION,"/#/","/mdp/workflow/ru/task/me")

        this.weixinContentVisible = true;
        this.weixinContent =
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
        if (task.startTime.indexOf(data.day) >= 0) {
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
              task.startTime > data.day
          ) {
            // 未开始
          } else if (task.planFinishTime < data.day && dateStr >= data.day) {
            task.calStatus = "延期";
            delayTasks.push(task);
          }
        } else {
          if (task.startTime < data.day) {
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
        if (fieldName == 'start_time') {
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
