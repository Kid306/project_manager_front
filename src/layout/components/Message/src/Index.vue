<template>
<ContentWrap>
    <template #header>
        <el-space wrap>
            <mdp-hi-query :column-configs="columnConfigs" v-model="hiQueryParams" @change="onHiQueryParamsChange" title="高级查询，定制任意复杂的查询条件"/>
            <el-button icon="download" @click="export2Excel()" title="导出查询结果到excel"/>
            <mdp-table-configs :column-configs="columnConfigs" v-model="checkedColumns"/>
            <el-button type="success" ref="kanbanBtn" plain @click="openKanban('kanbanDlg')" title="看板">板</el-button>
  
        </el-space>
    </template>
    <el-space wrap>
        <mdp-select   v-model="filters.hadRead" :options="[{id:'1',name:'已读'},{id:'0',name:'未读'}]"/>
        <el-input v-model="filters.msg"  placeholder="消息内容" clearable title="支持>、<、 >=、<=、!=、*字符*、$IS NULL、$IN 1,2,3、$between 1,5等操作符"/>
        <el-input v-model="filters.sendUsername"  placeholder="发送人" clearable title="支持>、<、 >=、<=、!=、*字符*、$IS NULL、$IN 1,2,3、$between 1,5等操作符"/>
        <el-input v-model="filters.toUsername"  placeholder="接收人" clearable title="支持>、<、 >=、<=、!=、*字符*、$IS NULL、$IN 1,2,3、$between 1,5等操作符"/>
            <mdp-select itemCode="objType"  v-model="filters.objType" title="业务类型"/>

 
        <el-input v-model="filters.ip"  placeholder="ip地址" clearable title="支持>、<、 >=、<=、!=、*字符*、$IS NULL、$IN 1,2,3、$between 1,5等操作符"/>
        <el-button v-loading="load.list" :disabled="load.list==true" @click="searchTableDatas()" icon="search" type="primary" plain />
    </el-space>
</ContentWrap>
<!--列表 NotifyMsg 个人消息通知-->
<el-table ref="table" v-adaptive :data="tableDatas" @sort-change="sortChange" highlight-current-row v-loading="load.list" border @selection-change="selsChange" @row-click="rowClick" style="width: 100%;">
    <el-table-column  type="selection" width="55" show-overflow-tooltip fixed="left" v-if="currOpType=='mng' || this.multiple==true"/>
    <el-table-column sortable type="index" width="55" show-overflow-tooltip  fixed="left"/>
    <el-table-column prop="msg"  label="消息" min-width="250"  col-type="String" v-if="showCol('msg')" sortable>
        <template #default="scope">
              <el-link @click="showDetail(scope.row)">{{ scope.row.msg }}</el-link> 
        </template>
    </el-table-column>
    <el-table-column prop="hadRead"  label="是否已读" min-width="120" show-overflow-tooltip col-type="String" v-if="showCol('hadRead')" itemCode="yesOrNo">
        <template #default="scope">
                <mdp-select  show-style="tag" v-model="scope.row.hadRead" :maxlength="50" @change="editSomeFields(scope.row,'hadRead',$event)" :options="[{id:'1',name:'已读'},{id:'0',name:'未读'}]"/>
        </template>
    </el-table-column>
    <el-table-column prop="sendUsername"  label="发送人" sortable min-width="120" show-overflow-tooltip col-type="String" v-if="showCol('sendUsername')"/>
    <el-table-column prop="operTime"  label="发送时间" sortable min-width="120" show-overflow-tooltip col-type="Date" v-if="showCol('operTime')"/>


    <el-table-column prop="objType"  label="对象类型" sortable min-width="120" show-overflow-tooltip col-type="String" itemCode="objType" v-if="showCol('objType')">
        <template #default="scope">
                <mdp-select itemCode="objType" show-style="tag" v-model="scope.row.objType" :maxlength="50"   :disabled="true"/>
        </template>
    </el-table-column>
    <el-table-column prop="ip"  label="ip地址" sortable min-width="120" show-overflow-tooltip col-type="String" v-if="showCol('ip')"/>
    <el-table-column prop="bizName"  label="对象名称" min-width="120" show-overflow-tooltip col-type="String" v-if="showCol('bizName')"/>

    <el-table-column prop="gloNo"  label="跟踪号" sortable min-width="120" show-overflow-tooltip col-type="String" v-if="showCol('gloNo')"/>
    <el-table-column prop="branchId"  label="机构编号" min-width="120" show-overflow-tooltip col-type="String" v-if="showCol('branchId')"/>
    <el-table-column prop="bizId"  label="业务主键编号"  sortable min-width="120" show-overflow-tooltip col-type="String" v-if="showCol('bizId')"/>
    <el-table-column prop="pbizId"  label="对象上级" min-width="120" show-overflow-tooltip col-type="String" v-if="showCol('pbizId')"/>
    <el-table-column prop="toUserid"  label="接收用户编号"  sortable min-width="120" show-overflow-tooltip col-type="String" v-if="showCol('toUserid')"/>
    <el-table-column prop="toUsername"  label="接收用户名称" min-width="120" show-overflow-tooltip col-type="String" v-if="showCol('toUsername')"/>
    <el-table-column prop="url"  label="跳转地址"  sortable min-width="120" show-overflow-tooltip col-type="String" v-if="showCol('url')"/>
    <el-table-column prop="id" label="消息编号"  sortable min-width="120" show-overflow-tooltip col-type="String" v-if="showCol('id')"/>
    <el-table-column prop="sendUserid"  label="发送人号" min-width="120" show-overflow-tooltip col-type="String" v-if="showCol('sendUserid')"/>
 
</el-table>
<el-pagination
    layout="slot,total, sizes, prev, next,pager,jumper"
    @current-change="handleCurrentChange"
    @size-change="handleSizeChange"
    :page-sizes="[10,20, 50, 100, 500]"
    :current-page="pageInfo.pageNum"
    :page-size="pageInfo.pageSize"
    :total="pageInfo.total"
    style="float:right;"
/>
<!--新增修改明细 NotifyMsg 个人消息通知界面-->
<mdp-dialog ref="formDlg" :title="menuDefName" width="60%">
    <template v-slot="{visible,data}">
         <NotifyMsgForm ref="NotifyMsgForm" :someOpen="true" :visible="visible" :parentOpType="currOpType" :subOpType="data.subOpType" :formData="data.formData" @close="onFormClose" @submit="afterFormSubmit" @edit-fields="afterEditFields"/>
    </template>
</mdp-dialog>
<MdpDialog ref="kanbanDlg" fullscreen :title="menuDefName">
    <MdpTableKanban
        @del="(d,cb)=>handleDel(d,0,cb)"
        @plus="(cb)=>showAdd(cb)"
        @edit="(d,cb)=>showEdit(d,cb)"
        v-model="tableDatas"
        :columnConfigs="columnConfigs"
        :itemKey="pkNames[0]"
        :contentFun="(item)=>item.msg"
    > 
    
    <template #toolbar="{element}">
        <mdp-select v-model="element.hadRead" show-style="tag" :disabled="true"  :options="[{id:'0',name:'未读'},{id:'1',name:'已读'}]"/>
     </template>
    </MdpTableKanban>
</MdpDialog>
</template>

<script>

import { MdpTableMixin } from '@/components/mdp-ui/mixin/MdpTableMixin.js'; 
import  NotifyMsgForm from'./Form.vue';//新增修改明细界面
import { mapState } from 'pinia'
import { useUserStore } from '@/store/modules/user'

export default {
    name:'NotifyMsgMng',
    mixins:[MdpTableMixin],
    components: {
        NotifyMsgForm
    },
    computed: {
        ...mapState(useUserStore,['userInfo'])
    },
    props:{
         // 是否开启editSomeField模式
         someOpen:{
            type: Boolean,
            default: false,
        },
    },
    data() {
        return {
            menuDefId:'',//menu_def.id 菜单表菜单编号，用于按钮权限判断
            menuDefName:'个人消息通知',//menu_def.name 功能名称，用于导出excel等文件名
            pkNames:["id"],//表格主键的java属性名称，驼峰命名，默认为id,支持多主键
            currOpType:'mng',//表格 mng-综合管理具有最大权限，所有按钮可动、detail-只看不能操作
            filters:{//查询参数

            },
            defaultFilters:{//默认查询参数,第一次打开界面的时候用到，恢复默认值的时候用到

            },
            pageInfo:{//分页数据
                total:0,//服务器端收到0时，会自动计算总记录数，如果上传>0的不自动计算。
                pageSize: this.pageable?10:1500,//每页数据
                count:false,//是否需要重新计算总记录数
                pageNum:1,//当前页码、从1开始计算
                orderFields:[],//排序列 如 ['sex','student_id']，必须为数据库字段
                orderDirs:[]//升序 asc,降序desc 如 性别 升序、学生编号降序 ['asc','desc']
            },
            //增删改查(含批量)接口
            apis:{
                list: this.$mdp.listNotifyMsg,
                add: this.$mdp.addNotifyMsg,
                del: this.$mdp.delNotifyMsg,
                edit: this.$mdp.editNotifyMsg,
                editSomeFields: this.$mdp.editSomeFieldsNotifyMsg,
                batchAdd: this.$mdp.batchAddNotifyMsg,
                batchDel: this.$mdp.batchDelNotifyMsg,
                batchEdit: this.$mdp.batchEditNotifyMsg,
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
              return true;
          },

          //页面数据加载完后需要对数据进行加工处理的
          afterList(tableDatas,isOk,apiName){

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
    },
    mounted() {

    }
}

</script>

<style scoped>
</style>