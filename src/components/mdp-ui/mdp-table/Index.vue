<template>  
  <slot name="query" :page="this"> 
  <ContentWrap> 
    <el-space wrap> 
          <span  v-for="col,idx in commonColumnConfigs" :key="col.property+'_'+idx" > 
              <el-input  clearable  v-if="col.colType=='String'" v-model="filters[col.property]" :placeholder="col.label+'查询'" title="支持>、<、 >=、<=、!=、*陈*、$IS NULL、$IN 1,2,3、between 1,5等操作符"/>
              <el-date-picker v-else-if="col.colType=='Date'" type="date" placeholder="选择日期" v-model="filters[col.property]"  value-format="YYYY-MM-DD HH:mm:ss" format="YYYY-MM-DD"/>
              <mdp-select  v-else-if="col.colType=='boolean' || col.colType=='Boolean'" type="radio" v-model="filters[col.property]" :disabled="disField" :options="[{id:'0',name:'否'},{id:'1',name:'是'}]"/>
              <el-input-number v-else-if="col.colType=='Number'" v-model="filters[col.property]"/>
              <el-input-number v-else-if="col.colType=='Integer' || col.colType=='int'" v-model="filters[col.property]" :precision="0" />
              <el-input clearable v-else v-model="filters[col.property]" :placeholder="col.label+'查询'" title="支持>、<、 >=、<=、!=、*陈*、$IS NULL、$IN 1,2,3、between 1,5等操作符"/>

          </span>     
          <el-button v-loading="load.list" :disabled="load.list==true" @click="searchTableDatas()" icon="search" type="primary" :size="size">查询</el-button>

    </el-space>  
    
      <template #header v-if="hidenHeader!=false">
        <el-space wrap>
          <mdp-hi-query :column-configs="columnConfigs" v-model="hiQueryParams" @change="onHiQueryParamsChange"/>
          <el-button icon="zoom-out" @click="searchReset()" title="重置查询条件并查询"/>
          
          <span v-if="currOpType=='mng'">
              <el-button :disabled="disBtn('addBtn') || !checkBtnQx('addBtn',menuDefId) " type="primary" @click="openForm({parentOpType:currOpType,subOpType:'add',formData:addForm})" icon="plus"/>
              <el-button :disabled="disBtn('delBtn') || !checkBtnQx('delBtn',menuDefId) || sels.length===0 || load.del==true" type="danger" v-loading="load.del" @click="batchDel" icon="delete"/>
          </span>
          <span  v-else-if="currOpType=='select' &&  multiple==true">
              <el-button :disabled="disBtn('selectBtn') || sels.length===0" type="primary" @click="selectListConfirm" icon="check">确认选择</el-button>
          </span> 
          
          <el-button icon="download" @click="export2Excel()" title="导出当前结果数据"/>
          <mdp-table-configs :column-configs="columnConfigs" v-model="checkedColumns"/>
        </el-space>
      </template>

  </ContentWrap>
  
      
  </slot>  
          <!--列表 Role 角色管理-->
          <el-table :size="size" v-adaptive :ref="refId+'Table'"  :data="tableDatas" @sort-change="sortChange" highlight-current-row v-loading="load.list" border @selection-change="selsChange" @row-click="rowClick" style="width: 100%;">
            <slot>
              <template  v-if="(currOpType=='select' && multiple==true ) || showCheckbox">
                <el-table-column type="selection" label="全选" />
              </template> 
              <el-table-column label="序号" type="index" width="60"/>
             <template  v-for="col,idx in columnConfigs">
              <el-table-column :key="col.property+'_'+idx" :prop="col.property"  :label="col.label" min-width="120" show-overflow-tooltip :col-type="col.colType" v-if="showCol(col.property)">
                <template #header="scope"><slot v-bind="scope" name="header">{{ col.label }}</slot></template> 
              </el-table-column>
            </template>  
            <template v-if=" formDefId && openFormExpand">
              <mdp-column-expand :form-def-id="formDefId" :data-field="dataField"/>
            </template>
            </slot>
            <slot name="operColumn" :page="this"> 
            <el-table-column label="操作" :width="operWidth?operWidth:(currOpType=='mng'?350:200)" fixed="right"> 
                <slot name="moreOper" :page="this"> 
                </slot>
                <template  #default="scope" v-if="currOpType=='mng'"  > 
                    <el-button :disabled="disBtn('editBtn') || !checkBtnQx('editBtn',menuDefId) " type="primary" @click="openForm({parentOpType:currOpType,subOpType:'edit',formData:scope.row})" icon="edit" title="修改一条数据"/>
                    <el-button :disabled="disBtn('addBtn') || !checkBtnQx('addBtn',menuDefId) " type="success" @click="copy(scope.row)" icon="document-copy" title="拷贝并新增一条除了主键不一样其它都一样的数据"/>
                    <el-button :disabled="disBtn('delBtn') || !checkBtnQx('delBtn',menuDefId) " type="danger" @click="handleDel(scope.row,scope.$index)" icon="delete"  title="删除一条数据"/>
                </template>

                <template #default="scope" v-else-if="currOpType=='list'" >
                    <el-button   type="primary" @click="openForm({parentOpType:currOpType,subOpType:'detail',formData:scope.row})" icon="view"/>
                </template>

                <template #default="scope" v-else-if="currOpType=='select' && multiple!=true" >
                    <el-button   type="primary" @click="selectConfirm(scope.row)">选择</el-button>
                </template>
            </el-table-column>  
          </slot>
          </el-table> 
          <el-pagination v-if="pageable" :small="pageSmall"
            :layout="pageLayout"
            @current-change="handleCurrentChange"
            @size-change="handleSizeChange"
            :page-sizes="[10,20, 50, 100, 500]"
            :current-page="pageInfo.pageNum"
            :page-size="pageInfo.pageSize"
            :total="pageInfo.total" 
          /> 
          <MdpDialog :ref="getRefId()+'FormDialog'">
            <template #default="{visible,dialog,data}">
              <slot :page="this" :data="data" :dialog="dialog" :visible="visible" name="form">
                <div v-if="false">
                  请扩展编辑页面,并用插槽的方式{{
                    "<template #form='{page,data,dialog,visible}'><el-form>普通表单界面</el-form></template>"
                  }}
                </div> 
                <mdp-form :someOpen="someOpen" :visible="visible" :columnConfigs="columnConfigs" label-width="150px" :subOpType="data.subOpType" :parentOpType="data.parentOpType" :formData="data.formData" @close="dialog.close()" @submit="afterFormSubmit"/> 
              </slot>
            </template>
             
          </MdpDialog>
 </template>

<script> 
import {MdpTableMixin} from "../mixin/MdpTableMixin.js"
export default {
  name: 'MdpTable',
  mixins:[MdpTableMixin], 
  computed:{
  },
  props:{   
    /**
     * 是否多选
     */
    multiple:{
      type:Boolean,
      default:false,
    },
    /**
     * 是否可以进行高级查询
     */
    showHiQuery:{
      type:Boolean,
      default:true
    },
    /**
     * 是否可以进行常规查询
     */
    showCommonQuery:{
      type: Boolean,
      default:true,
    }
  },
  data(){
    return {  
      formDefId:'',
      commonQueryNum:3,

    }
  },
  methods:{ 
    selectConfirm:function(row){
      this.pageVisible=false;
        this.$emit('select',row) 
    },
    selectListConfirm:function(){ 
      
      this.pageVisible=false;
      this.$emit('select',this.sels) 
    },
  },
  mounted(){      
  },
  updated(){ 
    
  }
}
</script>
<style lang="scss" scoped>  
</style> 
