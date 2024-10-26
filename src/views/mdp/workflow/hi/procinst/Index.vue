<template> 
      <el-row :gutter="20">
        <el-col :span="6">
            <MdpCateTree @node-click="searchTableDatas" ref="cateTree"/>
        </el-col>
        <el-col :span="18">
<ContentWrap> 
		<el-space wrap>
            
             
            <el-input v-model="filters['res.name']" style="width: 10%;" placeholder="名字" clearable title="支持>、<、 >=、<=、!=、*字符*、$IS NULL、$IN 1,2,3、$between 1,5等操作符"/>

            <el-input v-model="filters['p.startUsername']" style="width: 10%;" placeholder="发起人" clearable title="支持>、<、 >=、<=、!=、*字符*、$IS NULL、$IN 1,2,3、$between 1,5等操作符"/>

            <el-input v-model="filters['p.startDeptName']" style="width: 10%;" placeholder="发起部门" clearable title="支持>、<、 >=、<=、!=、*字符*、$IS NULL、$IN 1,2,3、$between 1,5等操作符"/>
 			
             
                <el-button v-loading="load.list" :disabled="  load.list==true" @click="searchTableDatas()" icon="search" type="primary">查询</el-button>
			
		</el-space> 
        <template #header>
            <el-space wrap> 
                <mdp-date-range
          v-model="filters" startKey="fromStartTime" style="width: 14em;" endKey="toStartTime" type="daterange"
          align="right" unlink-panels
          range-separator="-" start-placeholder="创建日期" end-placeholder="创建日期" value-format="YYYY-MM-DD HH:mm:ss" />
                  <mdp-select-tag v-model="filters['tagIds']" clearable filterable placeholder="标签" />  
                <mdp-hi-query :column-configs="columnConfigs" v-model="hiQueryParams" @change="onHiQueryParamsChange"/>
                <el-button icon="zoom-out" @click="searchReset()" title="重置查询条件"/> 
                <span  v-if="currOpType=='mng'">
                    <el-button :disabled="   disBtn('delBtn') || !checkBtnQx('delBtn',menuDefId) || this.sels.length===0 || load.del==true" type="danger" v-loading="load.del" @click="batchDel" icon="delete"/>
                </span>
                <span  v-else-if="currOpType=='select' &&  this.multiple==true">
                    <el-button :disabled=" disBtn('selectBtn') || this.sels.length===0" type="primary" @click="selectListConfirm" icon="check"/>
                </span>
                
                <el-button icon="download" @click="export2Excel()" title="导出" />
                <mdp-table-configs :column-configs="columnConfigs" v-model="checkedColumns"/>
            </el-space>
         </template>
    </ContentWrap> 
			<!--列表 Procinst act_hi_procinst-->
			<el-table v-adaptive :ref="refId+'Table'"  :data="tableDatas" @sort-change="sortChange" highlight-current-row v-loading="load.list" border @selection-change="selsChange" @row-click="rowClick" style="width: 100%;">
				<el-table-column  type="selection" width="55" show-overflow-tooltip fixed="left" v-if="currOpType=='mng' || this.multiple==true"/>
				
				<el-table-column prop="name"  label="流程名称" min-width="300" show-overflow-tooltip col-type="String" v-if="showCol('name')">
				    <template #default="{row}">
                        <div style="display: block;">
                            <mdp-select show-style="tag" :modelValue="row.deleteReason?'1':'0'" :options="[{id:'0',name:'正常'},{id:'1',name:'已删'}]" :disabled="true"/>
                            {{ row.name }}
                        </div>
 				    </template>
				</el-table-column>
                <el-table-column sortable prop="startDeptName" label="发起部门" min-width="180" show-overflow-tooltip/>
                <el-table-column sortable prop="startUsername" label="发起人" min-width="120" show-overflow-tooltip/>
                <el-table-column  prop="tagNames" label="标签" min-width="150" show-overflow-tooltip>
                    <template #default="scope">
                        <mdp-select-tag show-style="tag" v-model="scope.row.tagIds" clearable filterable placeholder="标签" multiple split="," :disabled="true"/>   
                    </template>
                </el-table-column>
				<el-table-column prop="startTime"  label="开始时间" min-width="120" show-overflow-tooltip col-type="Date" v-if="showCol('startTime')">
				    <template #default="scope">
                            <mdp-date type="date" placeholder="选择日期" show-style="tag" v-model="scope.row.startTime" @change="editSomeFields(scope.row,'startTime',$event)"  value-format="YYYY-MM-DD HH:mm:ss" format="YYYY-MM-DD" :disabled="true"/>
				    </template>
				</el-table-column>
				<el-table-column prop="endTime"  label="结束时间" min-width="120" show-overflow-tooltip col-type="Date" v-if="showCol('endTime')">
				    <template #default="scope">
                            <mdp-date type="date" placeholder="选择日期" show-style="tag" v-model="scope.row.endTime" @change="editSomeFields(scope.row,'endTime',$event)"  value-format="YYYY-MM-DD HH:mm:ss" format="YYYY-MM-DD" :disabled="true"/>
				    </template>
				</el-table-column>
				<el-table-column prop="duration"  label="耗时" min-width="120" show-overflow-tooltip col-type="Long" v-if="showCol('duration')" :formatter="formatterDuration"/>        
                <el-table-column sortable prop="sponsors" label="主办" min-width="80" show-overflow-tooltip/>
                 <el-table-column sortable prop="monitors" label="监控" min-width="80" show-overflow-tooltip/>
				<el-table-column prop="startUserId"  label="发起人" min-width="120" show-overflow-tooltip col-type="String" v-if="showCol('startUserId')">
				    <template #default="scope">
                            <mdp-input show-style="tag" v-model="scope.row.startUserId" :maxlength="64" @change="editSomeFields(scope.row,'startUserId',$event)" :disabled="true"/>
				    </template>
				</el-table-column> 
				<el-table-column prop="tenantId"  label="归属机构" min-width="120" show-overflow-tooltip col-type="String" v-if="showCol('tenantId')">
				    <template #default="scope">
                            <mdp-input show-style="tag" v-model="scope.row.tenantId" :maxlength="64" @change="editSomeFields(scope.row,'tenantId',$event)" :disabled="true"/>
				    </template>
				</el-table-column>
                
				<el-table-column prop="deleteReason"  label="删除原因" min-width="120" show-overflow-tooltip col-type="String" v-if="showCol('deleteReason')">
				    <template #default="scope">
                            <mdp-input show-style="tag" v-model="scope.row.deleteReason" :maxlength="4000" @change="editSomeFields(scope.row,'deleteReason',$event)" :disabled="true"/>
				    </template>
				</el-table-column>
				<el-table-column prop="procInstId"  label="实例编号" min-width="120" show-overflow-tooltip col-type="String" v-if="showCol('procInstId')">
				    <template #default="scope">
                            <mdp-input show-style="tag" v-model="scope.row.procInstId" :maxlength="64" @change="editSomeFields(scope.row,'procInstId',$event)" :disabled="true"/>
				    </template>
				</el-table-column>
				<el-table-column prop="procDefId"  label="流程编号" min-width="120" show-overflow-tooltip col-type="String" v-if="showCol('procDefId')">
				    <template #default="scope">
                            <mdp-input show-style="tag" v-model="scope.row.procDefId" :maxlength="64" @change="editSomeFields(scope.row,'procDefId',$event)" :disabled="true"/>
				    </template>
				</el-table-column>
				<el-table-column prop="callbackId"  label="回调编号" min-width="120" show-overflow-tooltip col-type="String" v-if="showCol('callbackId')">
				    <template #default="scope">
                            <mdp-input show-style="tag" v-model="scope.row.callbackId" :maxlength="64" @change="editSomeFields(scope.row,'callbackId',$event)" :disabled="true"/>
				    </template>
				</el-table-column>
				<el-table-column prop="callbackType"  label="回调类型" min-width="120" show-overflow-tooltip col-type="String" v-if="showCol('callbackType')">
				    <template #default="scope">
                            <mdp-input show-style="tag" v-model="scope.row.callbackType" :maxlength="255" @change="editSomeFields(scope.row,'callbackType',$event)" :disabled="true"/>
				    </template>
				</el-table-column>
				<el-table-column prop="startActId"  label="发起节点编号" min-width="120" show-overflow-tooltip col-type="String" v-if="showCol('startActId')">
				    <template #default="scope">
                            <mdp-input show-style="tag" v-model="scope.row.startActId" :maxlength="64" @change="editSomeFields(scope.row,'startActId',$event)" :disabled="true"/>
				    </template>
				</el-table-column>
				<el-table-column prop="businessKey"  label="业务编码" min-width="120" show-overflow-tooltip col-type="String" v-if="showCol('businessKey')">
				    <template #default="scope">
                            <mdp-input show-style="tag" v-model="scope.row.businessKey" :maxlength="64" @change="editSomeFields(scope.row,'businessKey',$event)" :disabled="true"/>
				    </template>
				</el-table-column>
				<el-table-column prop="superProcessInstanceId"  label="上级实例" min-width="120" show-overflow-tooltip col-type="String" v-if="showCol('superProcessInstanceId')">
				    <template #default="scope">
                            <mdp-input show-style="tag" v-model="scope.row.superProcessInstanceId" :maxlength="64" @change="editSomeFields(scope.row,'superProcessInstanceId',$event)" :disabled="true"/>
				    </template>
				</el-table-column>
				<el-table-column prop="deleteReason"  label="删除原因" min-width="120" show-overflow-tooltip col-type="String" v-if="showCol('deleteReason')">
				    <template #default="scope">
                            <mdp-input show-style="tag" v-model="scope.row.deleteReason" :maxlength="4000" @change="editSomeFields(scope.row,'deleteReason',$event)" :disabled="true"/>
				    </template>
				</el-table-column>
                <el-table-column prop="rev"  label="版本" min-width="120" show-overflow-tooltip col-type="Integer" v-if="showCol('rev')">
				    <template #default="scope">
                            <mdp-number show-style="tag" v-model="scope.row.rev" @change="editSomeFields(scope.row,'rev',$event)" :precision="0" :disabled="true"/>
				    </template>
				</el-table-column>
                <el-table-column prop="id" label="编号" min-width="120" show-overflow-tooltip    col-type="String" v-if="showCol('id')"/>

				<el-table-column label="操作" :width="currOpType=='mng'?200:200" fixed="right"> 
				    <template #default="scope" v-if="currOpType=='mng'"  >
				        <el-button :disabled="  disBtn('editBtn') || !checkBtnQx('editBtn',menuDefId) " type="primary" @click="openForm({parentOpType:currOpType,subOpType:'edit',formData:scope.row,title:'任务详情'})" icon="edit" title="修改一条数据"/>
 				        <el-button :disabled="  disBtn('delBtn') || !checkBtnQx('delBtn',menuDefId) " type="danger" @click="handleDel(scope.row,scope.$index)" icon="delete"  title="删除一条数据"/>
				    </template>

				    <template #default="scope" v-else-if="currOpType=='list'" >
				        <el-button   type="primary" @click="openForm({parentOpType:currOpType,subOpType:'detail',formData:scope.row})" icon="view"/>
 				    </template>

				    <template #default="scope" v-else-if="currOpType=='select' && this.multiple!=true" >
				        <el-button   type="primary" @click="selectConfirm(scope.row)" icon="check"/>
 				    </template>
				</el-table-column>
			</el-table> 
			<el-pagination class="padding-top"
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
			<!--新增修改明细 Procinst act_hi_procinst界面-->
            <mdp-dialog :ref="refId+'FormDialog'" width="80%">
                <template #default="{visible,data,dialog}">
                    <procinst-parames-execution-set v-if="data.formData"
                        :taskInfo="data.formData" :procDefId="data.formData.procDefId" :procInstId="data.formData.procInstId"
                        :visible="visible" @cancel="dialog.close()" @submit="afterEditSubmit"/> 
                </template>
            </mdp-dialog> 
</template>

<script>
import ProcinstParamesExecutionSet from "../../ru/procinstParames/ProcinstParamesExecutionSet.vue"; //流程参数加载

import { MdpTableMixin } from '@/components/mdp-ui/mixin/MdpTableMixin.js';
import * as ProcinstApi from '@/api/mdp/workflow/hi/procinst';
 import { mapState } from 'pinia'
import { useUserStore } from '@/store/modules/user' 
export default {
    name:'procinstMng',
    mixins:[MdpTableMixin],
    components: {
        ProcinstParamesExecutionSet
    }, 
    props: ["isMyMonitors", "isMyStart", "isMySponsors", "isMyPartake", "isAll",'bizPid','bizId','procInstIds'], 
    computed: {
        ...mapState(useUserStore,['userInfo'])
    },
    watch:{
    },
    data() {
        return {
            menuDefId:'',//menu_def.id 菜单表菜单编号，用于按钮权限判断
            menuDefName:'act_hi_procinst',//menu_def.name 功能名称，用于导出excel等文件名
            refId:'procinst',//引用编号，<table :ref="refId+'Table'"> <form :ref="refId+'Form'">
            pkNames:["id"],//表格主键的java属性名称，驼峰命名，默认为id,支持多主键
            
            filters:{//查询参数

            },
            defaultFilters:{//默认查询参数,第一次打开界面的时候用到，恢复默认值的时候用到

            },

            editable:false,

            defaultCheckColumnNum:8,//默认展示的表格列数，前8列

            //增删改查(含批量)接口
            apis:{
                list: ProcinstApi.listProcinst,
                add: ProcinstApi.addProcinst,
                del: ProcinstApi.delProcinst,
                edit: ProcinstApi.editProcinst,
                editSomeFields: ProcinstApi.editSomeFieldsProcinst,
                batchAdd: ProcinstApi.batchAddProcinst,
                batchDel: ProcinstApi.batchDelProcinst,
                batchEdit: ProcinstApi.batchEditProcinst,
            }
        }
    },
    methods: { 
         //页面初始化需要配置的特殊逻辑写这里
          initCurrData(){
             this.searchTableDatas();
          },

          /**
           * 检查参数是否满足调用后台接口的条件
           *
           * @param params 提交给后台的参数池,map类型
           * @returns true / false
           */
          preQueryParamCheck(params){
             

            if ( this.isMyStart ) {
                params.startUserId = this.userInfo.userid
            }
            if (this.isMyPartake) {
                params.partake = this.userInfo.userid
            }
            if (this.isMySponsors) {
                params.sponsors = '*' + this.userInfo.userid + '*'
            }
            if (this.isMyMonitors ) {
                params.monitors = '*' + this.userInfo.userid + '*'
            } 
            
            if(this.bizPid){
                params.bizPid=this.bizPid
            }
            if(this.bizId){
                params.bizId=this.bizId
            } 
            if(this.procInstIds){
                params.procInstId="$IN"+this.procInstIds
            }
              return true;
          },

          //页面数据加载完后需要对数据进行加工处理的
          afterList(res,isOk,apiName){

          },

          /**
           * 对修改的字段进行判断，返回false ,将取消更新数据库
           * @param {*} row 当前选中的行
           * @param {*} fieldName 修改的字段名
           * @param {*} $event 修改后的值
           * @param {*} params 将要提交服务器的参数
           * @returns true/false 返回false ,将取消更新数据库
           */
          editSomeFieldsCheck(row,fieldName,$event,params){
              if(this.currOpType=='add'||this.currOpType=='detail'){
                  return false;
              }
              params[fieldName]=$event
              return true;
          },

         /**
          * 打开某个子页面
          */
        openForm(res){
            let {parentOpType,formRefId,subOpType,formData} = res
            if(!formRefId){
                formRefId=this.getRefId()+"FormDialog"
            }
            if(!parentOpType){
                parentOpType=this.currOpType
            }
            var form=this.$refs[formRefId]
            if(form){
                res.parentOpType=parentOpType
                res.formRefId=formRefId
                form.open(res);
            }else{

            }

        },
        formatterDuration(row, column, cellValue) {
        if (cellValue != null && cellValue != "") {
          if (cellValue < 1000 * 60) {
            return (cellValue / 1000).toFixed(0) + "秒";
          } else if (cellValue < 1000 * 60 * 60) {
            return (cellValue / 1000 / 60).toFixed(2) + "分";
          } else if (cellValue < 1000 * 60 * 60 * 24) {
            return (cellValue / 1000 / 60 / 60).toFixed(2) + "小时";
          } else if (cellValue < 1000 * 60 * 60 * 24 * 30) {
            return (cellValue / 1000 / 60 / 60 / 24).toFixed(2) + "天";
          } else {
            return (cellValue / 1000 / 60 / 60 / 24 / 30).toFixed(2) + "月";
          }
        } else {
          return cellValue;
        }
      },
    },
    mounted() {

    }
}

</script>

<style scoped>
</style>