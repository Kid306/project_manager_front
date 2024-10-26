<template>
      <el-row :gutter="20">
        <el-col :span="6">
            <MdpCateTree @node-click="searchTableDatas" ref="cateTree"/>
        </el-col>
        <el-col :span="18">
  <ContentWrap>
    <el-space wrap>
  
      <mdp-select-tag v-model="filters['tagIds']" width="8em" clearable filterable placeholder="标签"/>

      <el-input
          v-model="filters.bizKey" style="width: 10%;" placeholder="业务编码" clearable
          title="支持>、<、 >=、<=、!=、*字符*、$IS NULL、$IN 1,2,3、$between 1,5等操作符"/>
      <el-input
          v-model="filters.bizName" style="width: 10%;" placeholder="业务名称" clearable
          title="支持>、<、 >=、<=、!=、*字符*、$IS NULL、$IN 1,2,3、$between 1,5等操作符"/>
      <el-input
          v-model="filters.modelKey" style="width: 10%;" placeholder="模型编码"
          clearable title="支持>、<、 >=、<=、!=、*字符*、$IS NULL、$IN 1,2,3、$between 1,5等操作符"/>
      <el-input
          v-model="filters.modelName" style="width: 10%;" placeholder="模型名称"
          clearable title="支持>、<、 >=、<=、!=、*字符*、$IS NULL、$IN 1,2,3、$between 1,5等操作符"/>

      <el-button
          v-loading="load.list" :disabled="load.list==true" @click="searchTableDatas()" icon="search"
          type="primary">查询
      </el-button>
    </el-space>
    <template #header>
      <el-space wrap>
        <mdp-hi-query :column-configs="columnConfigs" v-model="hiQueryParams" @change="onHiQueryParamsChange"/>
        <el-button icon="zoom-out" @click="searchReset()" title="重置查询条件"/>
        <span v-if="bizKey && tableDatas.length==0">
                <el-tag type="info">如果没有找到流程，请通过 <el-button
                    type="text"
                    @click="openForm({parentOpType:currOpType,subOpType:'add',formData:addForm,title:'新增'})"
                    icon="plus">增加</el-button> 将业务编码【{{
                    bizKey
                  }}】与流程模型进行关联</el-tag>

            </span>

        <span v-if="currOpType=='mng'">
                    <el-button
                        :disabled="disBtn('addBtn') || !checkBtnQx('addBtn',menuDefId) " type="primary"
                        @click="openForm({parentOpType:currOpType,subOpType:'add',formData:addForm,title:'新增'})"
                        icon="plus"/>
                    <el-button
                        :disabled="disBtn('delBtn') || !checkBtnQx('delBtn',menuDefId) || sels.length===0 || load.del==true"
                        type="danger" v-loading="load.del" @click="batchDel" icon="delete"/>
            </span>
        <span v-if="currOpType=='select' &&  multiple==true">
                <el-button
                    :disabled="disBtn('selectBtn') || sels.length===0" type="primary"
                    @click="selectListConfirm" icon="check"/>
            </span>

        <el-button icon="download" @click="export2Excel()" title="导出当前结果" />
        <mdp-table-configs :column-configs="columnConfigs" v-model="checkedColumns"/>
      </el-space>
    </template>
  </ContentWrap>
  <!--列表 BizModel 业务功能与模型的关联关系，也就是某个功能可以用哪些流程发起审批-->
  <el-table
      v-adaptive :ref="refId+'Table'" :data="tableDatas" @sort-change="sortChange" highlight-current-row
      v-loading="load.list" border @selection-change="selsChange" @row-click="rowClick" style="width: 100%;">
    <el-table-column
        type="selection" width="55" show-overflow-tooltip fixed="left"
        v-if="currOpType=='mng' || multiple==true"/>
    <el-table-column sortable type="index" width="55" show-overflow-tooltip fixed="left"/>
    <el-table-column
        prop="bizName" label="业务名称" min-width="300" show-overflow-tooltip col-type="String"
        v-if="showCol('bizName')">
      <template #default="scope">
        <mdp-input
            show-style="tag" v-model="scope.row.bizName" :maxlength="255"
            @change="editSomeFields(scope.row,'bizName',$event)"
            :disabled="disField"/>
      </template>
    </el-table-column>
    <el-table-column prop="tagNames" label="标签" min-width="220" show-overflow-tooltip col-type="String">
      <template #default="scope">
        <mdp-select-tag
            show-style="tag" v-model="scope.row.tagIds" clearable filterable placeholder="标签" multiple
            split="," :disabled="true"/>
      </template>
    </el-table-column>
    <el-table-column
        prop="bizKey" label="业务编码" min-width="220" show-overflow-tooltip col-type="String"
        v-if="showCol('bizKey')">
      <template #default="scope">
        <mdp-input
            show-style="tag" v-model="scope.row.bizKey" :maxlength="255"
            @change="editSomeFields(scope.row,'bizKey',$event)"
            :disabled="disField"/>
      </template>
    </el-table-column>
    <el-table-column
        prop="modelName" label="模型名称" min-width="220" show-overflow-tooltip col-type="String"
        v-if="showCol('modelName')">
      <template #default="scope">
        <mdp-input
            show-style="tag" v-model="scope.row.modelName" :maxlength="255"
            @change="editSomeFields(scope.row,'modelName',$event)"
            :disabled="disField"/>
      </template>
    </el-table-column>
    <el-table-column
        prop="modelKey" label="模型编码" min-width="220" show-overflow-tooltip col-type="String"
        v-if="showCol('modelKey')">
      <template #default="scope">
        <mdp-input
            show-style="tag" v-model="scope.row.modelKey" :maxlength="255"
            @change="editSomeFields(scope.row,'modelKey',$event)"
            :disabled="disField"/>
      </template>
    </el-table-column>
    <el-table-column
        prop="branchId" label="机构编号" min-width="120" show-overflow-tooltip col-type="String"
        v-if="showCol('branchId')">
      <template #default="scope">
        <mdp-input
            show-style="tag" v-model="scope.row.branchId" :maxlength="50"
            @change="editSomeFields(scope.row,'branchId',$event)"
            :disabled="disField"/>
      </template>
    </el-table-column>
    <el-table-column
        prop="id" label="编号" min-width="120" show-overflow-tooltip col-type="String"
        v-if="showCol('id')"/>

    <el-table-column label="操作" :width="currOpType=='mng'?200:200" fixed="right">
      <template #header>
      </template>
      <template #default="scope" v-if="currOpType=='mng'">
        <el-button
            :disabled="disBtn('editBtn') || !checkBtnQx('editBtn',menuDefId) " type="primary"
            @click="openForm({parentOpType:currOpType,subOpType:'edit',formData:scope.row,title:'修改'})"
            icon="edit" title="修改一条数据"/>
        <el-button
            :disabled="disBtn('delBtn') || !checkBtnQx('delBtn',menuDefId) " type="danger"
            @click="handleDel(scope.row,scope.$index)" icon="delete" title="删除一条数据"/>
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
  <!--新增修改明细 BizModel 业务功能与模型的关联关系，也就是某个功能可以用哪些流程发起审批界面-->
  <mdp-dialog :ref="refId+'FormDialog'">
    <template #default="{visible,data}">
      <biz-model-form
          :ref="refId+'Form'" :visible="visible" :parent-op-type="currOpType"
          :sub-op-type="data.subOpType" :form-data="data.formData" @close="onFormClose"
          @submit="afterFormSubmit" @fields-change="afterEditSomeFields"/>
    </template>
  </mdp-dialog>
</template>

<script>

import {MdpTableMixin} from '@/components/mdp-ui/mixin/MdpTableMixin.js';
import * as BizModelApi from '@/api/mdp/workflow/re/bizModelLink';
import BizModelForm from './Form.vue';//新增修改明细界面
import {mapState} from 'pinia'
import {useUserStore} from '@/store/modules/user'
 

export default {
  name: 'BizModelMng',
  components: {
    BizModelForm,
  },
  mixins: [MdpTableMixin],
  props: {
    bizKey: String,
    modelKey: String,
    modelName: String,
    includeProcdef: String,//是否查询procdef表数据一并返回 1 是 0 否
    fp: String,//是否只查询能够直接无参数启动的流程，1 是，0否
  },
  data() {
    return {
      menuDefId: '',//menu_def.id 菜单表菜单编号，用于按钮权限判断
      menuDefName: '业务功能与模型的关联关系，也就是某个功能可以用哪些流程发起审批',//menu_def.name 功能名称，用于导出excel等文件名
      refId: 'bizModel',//引用编号，<table :ref="refId+'Table'"> <form :ref="refId+'Form'">
      pkNames: ["id"],//表格主键的java属性名称，驼峰命名，默认为id,支持多主键
      currOpType: 'mng',//表格 mng-综合管理具有最大权限，所有按钮可动、detail-只看不能操作
      filters: {//查询参数

      },
      defaultFilters: {//默认查询参数,第一次打开界面的时候用到，恢复默认值的时候用到

      },

      defaultCheckColumnNum: 8,//默认展示的表格列数，前8列

      editable: false,//是否可编辑模式

      //增删改查(含批量)接口
      apis: {
        list: BizModelApi.listBizModel,
        add: BizModelApi.addBizModel,
        del: BizModelApi.delBizModel,
        edit: BizModelApi.editBizModel,
        editSomeFields: BizModelApi.editSomeFieldsBizModel,
        batchAdd: BizModelApi.batchAddBizModel,
        batchDel: BizModelApi.batchDelBizModel,
        batchEdit: BizModelApi.batchEditBizModel,
      }
    }
  },
  computed: {},
  watch: {},
  mounted() {

  },
  methods: { 
    //页面初始化需要配置的特殊逻辑写这里
    initCurrData() {
      this.searchTableDatas();
      this.addForm.bizKey = this.bizKey
      this.addForm.modelKey = this.modelKey
      this.addForm.modelName = this.modelName
    },

    /**
     * 检查参数是否满足调用后台接口的条件
     *
     * @param params 提交给后台的参数池,map类型
     * @returns true / false
     */
    preQueryParamCheck(params) {
      if (this.bizKey) {
        params.bizKey = this.bizKey
      }
      if (this.modelKey) {
        params.modelKey = this.modelKey
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
  }
}

</script>

<style scoped>
</style>
