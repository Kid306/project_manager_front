<template>
  <el-row :gutter="20">
    <el-col :span="6">   
          <MenuTree v-adaptive @nodeClick="handleNodeClick" :expandOnClickNode="false"/> 
  </el-col> 
  <el-col :span="18">
  <ContentWrap>
    <el-space wrap>
      <mdp-select item-code="lvl" show-style="origin" v-model="filters.lvl" placeholder="菜单层级" />
      <mdp-select item-code="mcate" v-model="filters.mcate" placeholder="分类" class="hidden-md-and-down" />
      <mdp-select item-code="menuSupVers" v-model="filters.supVers" placeholder="版本" /> 
      <el-input v-model="filters.id" style="width: 10em;" placeholder="编号查询" clearable
        title="支持>、<、 >=、<=、!=、*陈*、$IS NULL、$IN 1,2,3、between 1,5等操作符" />
      <el-input v-model="filters.mname" style="width:10em;" placeholder="名称查询" clearable
        title="支持>、<、 >=、<=、!=、*陈*、$IS NULL、$IN 1,2,3、between 1,5等操作符" />
      <el-button v-loading="load.list" :disabled="load.list == true" @click="searchTableDatas()" icon="search"
        type="primary">查询
      </el-button>&nbsp;
    </el-space>
    <template #header>
      <el-space wrap>
        <span v-for="(item, index) in parentMenuList" :key="index">
          <el-tag @close="clearParentMenu(item, index)" closable @click="clickParentMenu(item, index)">{{ item.mname
          }}</el-tag>/
        </span>
        <mdp-hi-query :column-configs="columnConfigs" v-model="hiQueryParams" @change="onHiQueryParamsChange" />
        <el-button icon="zoom-out" @click="searchReset()" title="重置查询条件并查询"/>
        <el-button @click="$refs['importDialog'].open()" icon="upload">导入</el-button>
        <el-button icon="download" @click="export2Excel()" title="导出当前结果数据"/>
        <mdp-table-configs :column-configs="columnConfigs" v-model="checkedColumns" />
        <span v-if="currOpType == 'mng'">
          <el-button
            :disabled="disBtn('delBtn') || !checkBtnQx('delBtn', menuDefId) || this.sels.length === 0 || load.del == true"
            type="danger" plain v-loading="load.del" @click="batchDel" icon="delete" />
          <el-button :disabled="disBtn('addBtn') || !checkBtnQx('addBtn', menuDefId)" type="primary" plain
            @click="openForm({ parentOpType: currOpType, subOpType: 'add', formData: addForm })" icon="plus" title="新增子菜单" />

        </span>
        <span v-else-if="currOpType == 'select' && this.multiple == true">
          <el-button :disabled="disBtn('selectBtn') || this.sels.length === 0" type="primary" @click="selectListConfirm"
            icon="check" />
        </span>
        <slot name="toolbar" :page="this">

        </slot>
      </el-space>
    </template>
  </ContentWrap>
  <!--列表 MenuDef 前端功能菜单表-->
  <el-table v-adaptive :ref="refId + 'Table'" :data="tableDatas" @sort-change="sortChange" highlight-current-row
    v-loading="load.list" border @selection-change="selsChange" @row-click="rowClick" style="width: 100%;"  row-key="id"> 
    <el-table-column type="selection" width="55" show-overflow-tooltip fixed="left" />
    <el-table-column type="index" width="55" show-overflow-tooltip fixed="left" />

    <el-table-column prop="mname" label="菜单名称" min-width="220" show-overflow-tooltip col-type="String"
      v-if="showCol('mname')" fixed="left">
      <template #default="scope">
        <mdp-input show-style="tag" v-model="scope.row.mname" :maxlength="100"
          @change="editSomeFields(scope.row, 'mname', $event)" :disabled="true||disField" />
      </template>
    </el-table-column>
    <el-table-column prop="lvl" label="菜单层级" min-width="120" show-overflow-tooltip col-type="String"
      v-if="showCol('lvl')">
      <template #default="scope">
        <mdp-select item-code="lvl" show-style="tag" v-model="scope.row.lvl" placeholder="菜单层级" :disabled="true||disField" />
      </template>
    </el-table-column>
    <el-table-column prop="mcate" label="菜单大类" min-width="120" show-overflow-tooltip col-type="String"
      v-if="showCol('mcate')">
      <template #default="scope">
        <mdp-select @click="rowClick(scope.row)" item-code="mcate" show-style="tag" v-model="scope.row.mcate"
          :maxlength="20" @change="editSomeFields(scope.row, 'mcate', $event)" :disabled="true||disField" />
      </template>
    </el-table-column>
    <el-table-column prop="accUrl" label="访问路径" min-width="120" show-overflow-tooltip col-type="String"
      v-if="showCol('accUrl')">
      <template #default="scope">
        <mdp-input show-style="tag" v-model="scope.row.accUrl" :maxlength="200"
          @change="editSomeFields(scope.row, 'accUrl', $event)" :disabled="true||disField" />
      </template>
    </el-table-column>
    <el-table-column prop="icon" label="菜单图标" min-width="120" show-overflow-tooltip col-type="String"
      v-if="showCol('icon')">
      <template #default="scope">
        <mdp-input show-style="tag" v-model="scope.row.icon" :maxlength="100"
          @change="editSomeFields(scope.row, 'icon', $event)" :disabled="true||disField" />
      </template>
    </el-table-column>
    <el-table-column prop="rpath" label="路由PATH" min-width="120" show-overflow-tooltip col-type="String"
      v-if="showCol('rpath')">
      <template #default="scope">
        <mdp-input show-style="tag" v-model="scope.row.rpath" :maxlength="100"
          @change="editSomeFields(scope.row, 'rpath', $event)" :disabled="true||disField" />
      </template>
    </el-table-column>
    <el-table-column prop="isShow" label="是否显示" min-width="120" show-overflow-tooltip col-type="String"
      v-if="showCol('isShow')">
      <template #default="scope">
        <mdp-input show-style="tag" v-model="scope.row.isShow" :maxlength="1"
          @change="editSomeFields(scope.row, 'isShow', $event)" :disabled="true||disField" />
      </template>
    </el-table-column>
    <el-table-column prop="menuType" label="类型" min-width="120" show-overflow-tooltip col-type="String"
      v-if="showCol('menuType')">
      <template #default="scope">
        <mdp-select @click="rowClick(scope.row)" :options="[{ id: '1', name: '菜单' }, { id: '2', name: '按钮' }]" show-style="tag"
          v-model="scope.row.menuType" :maxlength="1" @change="editSomeFields(scope.row, 'menuType', $event)"
          :disabled="true||disField" />
      </template>
    </el-table-column>
    <el-table-column prop="operQxId" label="api编号" min-width="120" show-overflow-tooltip col-type="String"
      v-if="showCol('operQxId')">
      <template #default="scope">
        <mdp-input show-style="tag" v-model="scope.row.operQxId" :maxlength="50"
          @change="editSomeFields(scope.row, 'operQxId', $event)" :disabled="true||disField" />
      </template>
    </el-table-column>
    <el-table-column prop="supVers" label="支持版本" min-width="120" show-overflow-tooltip col-type="String"
      v-if="showCol('supVers')">
      <template #default="scope">
        <mdp-select @click="rowClick(scope.row)" item-code="menuSupVers" show-style="tag" v-model="scope.row.supVers"
          :maxlength="255" @change="editSomeFields(scope.row, 'supVers', $event)" :disabled="true||disField" />
      </template>
    </el-table-column>
    <el-table-column prop="moduleId" label="归属模块" min-width="120" show-overflow-tooltip col-type="String"
      v-if="showCol('moduleId')">
      <template #default="scope">
        <mdp-select @click="rowClick(scope.row)" :load-fun="listMenuModule" show-style="tag" v-model="scope.row.moduleId"
          :maxlength="50" @change="editSomeFields(scope.row, 'moduleId', $event)" :disabled="true||disField" />
      </template>
    </el-table-column>
    <el-table-column prop="id" label="菜单编号" min-width="120" show-overflow-tooltip col-type="String"
      v-if="showCol('id')" />


    <el-table-column prop="msort" label="菜单顺序" min-width="120" show-overflow-tooltip col-type="String"
      v-if="showCol('msort')">
      <template #default="scope">
        <mdp-input show-style="tag" v-model="scope.row.msort" :maxlength="10"
          @change="editSomeFields(scope.row, 'msort', $event)" :disabled="true||disField" />
      </template>
    </el-table-column>
    <el-table-column prop="arole" label="权限规则" min-width="120" show-overflow-tooltip col-type="String"
      v-if="showCol('arole')">
      <template #default="scope">
        <mdp-select @click="rowClick(scope.row)" :options="[{ id: '1', name: '开放' }, { id: '0', name: '授权' }]" show-style="tag"
          v-model="scope.row.arole" :maxlength="1" @change="editSomeFields(scope.row, 'arole', $event)"
          :disabled="true||disField" />
      </template>
    </el-table-column>
    <el-table-column prop="qxType" label="权限类型" min-width="120" show-overflow-tooltip col-type="String"
      v-if="showCol('qxType')">
      <template #default="scope">
        <mdp-select @click="rowClick(scope.row)" item-code="qxType" show-style="tag" v-model="scope.row.qxType"
          :maxlength="20" @change="editSomeFields(scope.row, 'qxType', $event)" :disabled="true||disField" />
      </template>
    </el-table-column>
    <el-table-column prop="apiRules" label="api路径" min-width="120" show-overflow-tooltip col-type="String"
      v-if="showCol('apiRules')">
      <template #default="scope">
        <mdp-input show-style="tag" v-model="scope.row.apiRules" :maxlength="255"
          @change="editSomeFields(scope.row, 'apiRules', $event)" :disabled="true||disField" />
      </template>
    </el-table-column>
    <el-table-column prop="pid" label="上级编号" min-width="120" show-overflow-tooltip col-type="String"
      v-if="showCol('pid')">
      <template #default="scope">
        <mdp-input show-style="tag" v-model="scope.row.pid" :maxlength="50"
          @change="editSomeFields(scope.row, 'pid', $event)" :disabled="true||disField" />
      </template>
    </el-table-column>

    <el-table-column prop="rid" label="路由编号" min-width="120" show-overflow-tooltip col-type="String"
      v-if="showCol('rid')">
      <template #default="scope">
        <mdp-input show-style="tag" v-model="scope.row.rid" :maxlength="50"
          @change="editSomeFields(scope.row, 'rid', $event)" :disabled="true||disField" />
      </template>
    </el-table-column>
    <el-table-column label="操作" :width="currOpType == 'mng' ? 280 : 200" fixed="right">
      <template #default="scope" v-if="currOpType == 'mng'">
       <!-- <el-button type="success" @click="doQuerySubMenus(scope.row)" icon="search" title="查询该菜单的下级子菜单，不包括孙子菜单" />-->
        <el-button :disabled="disBtn('editBtn') || !checkBtnQx('editBtn', menuDefId)" type="primary" plain
          @click="openForm({ parentOpType: currOpType, subOpType: 'edit', formData: scope.row })" icon="edit" title="修改一条数据"/>

        <el-button type="success" @click="showSubAdd(scope.row, scope.$index)" icon="plus" title="新增子菜单" plain/>

        <el-button v-if="scope.row.menuType == '1'" @click="$refs['menuButtonsDialog'].open({ pmenu: scope.row })"
          icon="right" title="按钮" plain/>
        <slot name="oper" :page="this" :scope="scope"></slot>
      </template>

      <template #default="scope" v-else-if="currOpType=='list'">
        <el-button type="success" @click="doQuerySubMenus(scope.row)" icon="search" title="查询该菜单的下级子菜单，不包括孙子菜单" />
        <el-button type="primary" @click="openForm({parentOpType:currOpType,subOpType:'detail',formData:scope.row})"
          icon="view" />
      </template>

      <template #default="scope" v-else-if="currOpType=='select' && this.multiple!=true">
        <el-button type="success" @click="doQuerySubMenus(scope.row)" icon="search" title="查询该菜单的下级子菜单，不包括孙子菜单" />
        <el-button type="primary" @click="selectConfirm(scope.row)" icon="check" />
      </template>
      
    </el-table-column>
  </el-table>
  <el-pagination class="padding-top" layout="slot,total, sizes, prev, next,pager,jumper"
    @current-change="handleCurrentChange" @size-change="handleSizeChange" :page-sizes="[10, 20, 50, 100, 500]"
    :current-page="pageInfo.pageNum" :page-size="pageInfo.pageSize" :total="pageInfo.total" />

    </el-col>
  </el-row>
  <!--新增修改明细 MenuDef 前端功能菜单表界面-->
  <mdp-dialog :ref="refId + 'FormDialog'">
    <template #default="{ visible, data }">
      <menu-def-form :ref="refId + 'Form'" :visible="visible" :parent-op-type="currOpType" :sub-op-type="data.subOpType"
        :form-data="data.formData" @close="onFormClose" @submit="afterFormSubmit" @fields-change="afterEditSomeFields" />
    </template>
  </mdp-dialog>
  <!--新增 MenuDef 前端功能菜单表界面-->
  <mdp-dialog ref="menuButtonsDialog" title="按钮管理" width="70%">
    <template #default="{ visible, data, dialog }">
      <menu-buttons :pmenu="data.pmenu" :visible="visible" @close="dialog.close()" @submit="afterAddSubmit" />
    </template>
  </mdp-dialog>

  <!--导入界面-->
  <mdp-dialog ref="importDialog" title="导入菜单"   max-height="100%">
    <template #default="{ visible, data, dialog }">
      <menu-def-import :pmenu="data.pmenu" :visible="visible" @close="dialog.close()" @submit="afterAddSubmit" />
    </template>
  </mdp-dialog>
</template>

<script>

import util from '@/components/mdp-ui/js/util';//全局公共库
import { MdpTableMixin } from '@/components/mdp-ui/mixin/MdpTableMixin.js';
import config from '@/api/mdp_pub/mdp_config';//全局公共库
import * as MenuDefApi from '@/api/mdp_pub/menuDef.js';
import MenuDefForm from './Form.vue';//新增修改明细界面
import { mapState } from 'pinia'
import { useUserStore } from '@/store/modules/user'
import MenuButtons from './MenuButtons.vue'
import MenuDefImport from './MenuDefImport.vue'
import TreeTool from '@/components/mdp-ui/js/treeTool'; 

import MenuTree from './MenuTree.vue'
export default {
  name: 'FuncMenuIndex',
  mixins: [MdpTableMixin],
  components: {
    MenuDefForm, MenuButtons, MenuDefImport
  },
  computed: {

    treeData() {
      var data = TreeTool.translateDataToTree(this.tableDatas, 'pid', 'id',undefined)
      TreeTool.treeCfg(data,(node) => { node.hasChildren = (node.children && node.children.length > 0) })
      
      return data;
    }
  },
  watch: {},
  data() {
    return {
      menuDefId: '',//menu_def.id 菜单表菜单编号，用于按钮权限判断
      menuDefName: '前端功能菜单表',//menu_def.name 功能名称，用于导出excel等文件名
      refId: 'menuDef',//引用编号，<table :ref="refId+'Table'"> <form :ref="refId+'Form'">
      pkNames: ["id"],//表格主键的java属性名称，驼峰命名，默认为id,支持多主键
      currOpType: 'mng',//表格 mng-综合管理具有最大权限，所有按钮可动、detail-只看不能操作
      filters: {//查询参数

      },
      defaultFilters: {//默认查询参数,第一次打开界面的时候用到，恢复默认值的时候用到

      },

      defaultCheckColumnNum: 8,//默认展示的表格列数，前8列

      //增删改查(含批量)接口
      apis: {
        list: MenuDefApi.listMenuDef,
        add: MenuDefApi.addMenuDef,
        del: MenuDefApi.delMenuDef,
        edit: MenuDefApi.editMenuDef,
        editSomeFields: MenuDefApi.editSomeFieldsMenuDef,
        batchAdd: MenuDefApi.batchAddMenuDef,
        batchDel: MenuDefApi.batchDelMenuDef,
        batchEdit: MenuDefApi.batchEditMenuDef,
      }, 
      parentMenuList: [], 
    }
  },
  methods: {
    listMenuModule: MenuDefApi.listMenuModule,
    //页面初始化需要配置的特殊逻辑写这里
    onModuleSelect(index){
      this.moduleIndex=index
      this.searchTableDatas()
    },
    handleNodeClick(data){ 
      if(data.isModule){
        this.filters.pid=''
      }else{
        this.filters.pid=data.id
      }

      this.filters.moduleId=data.moduleId
      this.searchTableDatas()
      
    },
    initCurrData() { 
      this.searchTableDatas();
    },

    /**
     * 检查参数是否满足调用后台接口的条件
     *
     * @param params 提交给后台的参数池,map类型
     * @returns true / false
     */
    preQueryParamCheck(params) {
      if (this.parentMenuList && this.parentMenuList.length > 0) {
        params.pid = this.parentMenuList[this.parentMenuList.length - 1].id
      } 
      return true;
    },

    //页面数据加载完后需要对数据进行加工处理的
    afterList(res, isOk, apiName) {
    },
    doQuerySubMenus(row) {
      this.parentMenuList.push(row)
      delete this.filters.lvl
      this.searchTableDatas()
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
      let { parentOpType, formRefId, subOpType, formData } = res
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

    showSubAdd(row) {
      var formData = Object.assign({}, this.addForm)
      formData.pid = row.id
      formData.pMname = row.mname
      this.$refs[this.refId + "FormDialog"].open({ subOpType: 'add', formData: formData })
    },
    showMenusToRolesSet(sels, batch) {
      this.$refs['menusToRolesSetDialog'].open({ mids: sels.map(k => k.id), batch: batch })
    },
    clearParentMenu(pmenu, index) {
      if (index == 0) {
        this.parentMenuList = []
      } else {
        this.parentMenuList.splice(index, this.parentMenuList.length - index)
      }
      this.searchTableDatas()
    },

    clickParentMenu(pmenu, index) {
      this.parentMenuList.splice(index + 1, this.parentMenuList.length - index - 1)
      this.searchTableDatas()
    },

  },
  mounted() { 
  }
}

</script>

<style scoped></style>
