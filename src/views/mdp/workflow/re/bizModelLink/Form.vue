<template> 
      <!--新增/编辑界面 BizModel 业务功能与模型的关联关系，也就是某个功能可以用哪些流程发起审批-->
      <el-form :model="editForm" label-width="120px" :rules="editFormRules" ref="editFormRef">

        <el-form-item label="编号" prop="id">
          <el-input
              show-style="origin" v-model="editForm.id" placeholder="编号" :maxlength="50"
              @change="editSomeFields(editForm,'id',$event)" :disabled="disField||true"/>
        </el-form-item>
        <el-form-item label="业务名称" prop="bizName">
          <el-input
              show-style="origin" v-model="editForm.bizName" placeholder="业务名称" :maxlength="255"
              @change="editSomeFields(editForm,'bizName',$event)" :disabled="disField"/>
        </el-form-item>
        <el-form-item label="业务编码" prop="bizKey">
          <el-input
              show-style="origin" v-model="editForm.bizKey" placeholder="业务编码" :maxlength="255"
              @change="editSomeFields(editForm,'bizKey',$event)" :disabled="disField||bizKey"/>
        </el-form-item>
        <el-form-item label="模型编码" prop="modelKey">
          <el-input
              show-style="origin" v-model="editForm.modelKey" placeholder="模型编码" :maxlength="255"
              @change="editSomeFields(editForm,'modelKey',$event)" :disabled="disField" readonly>
           <template  #append> <el-button @click="$refs['procdefDialog'].open({})">选模型</el-button></template>
          </el-input>


        </el-form-item>
        <el-form-item label="模型名称" prop="modelName">
          <el-input
              show-style="origin" v-model="editForm.modelName" placeholder="模型名称" :maxlength="255"
              @change="editSomeFields(editForm,'modelName',$event)" :disabled="disField||true"/>
        </el-form-item>
        <el-form-item label="机构编号" prop="branchId">
          <el-input
              show-style="origin" v-model="editForm.branchId" placeholder="机构编号" :maxlength="50"
              @change="editSomeFields(editForm,'branchId',$event)" :disabled="disField||true"/>
        </el-form-item>
        <el-form-item label="分类编号" prop="categoryId">
          <el-input
              show-style="origin" v-model="editForm.categoryId" placeholder="分类编号" :maxlength="50"
              @change="editSomeFields(editForm,'categoryId',$event)" :disabled="disField||true"/>
        </el-form-item>
      </el-form>  
      <el-row v-if="showBtn!==false" class="footer">
        <el-button @click="close">关闭</el-button>
        <el-button
            v-loading="load.edit" type="primary" @click="saveSubmit"
            :disabled="disBtn('addBtn') || !checkBtnQx('addBtn',menuDefId) || load.edit">提交
        </el-button>
      </el-row> 
    <mdp-dialog ref="procdefDialog" title="选中模型" width="80%">
      <template #default="{visible}">
        <ProcdefList :visible="visible" sub-op-type="select" @select="onSelectModel"/>
      </template>
    </mdp-dialog> 
</template>

<script>
import * as BizModelApi from '@/api/mdp/workflow/re/bizModelLink';
import {mapState} from 'pinia'
import {useUserStore} from '@/store/modules/user'
import {MdpFormMixin} from '@/components/mdp-ui/mixin/MdpFormMixin.js'; 
import { defineAsyncComponent } from 'vue';
 
const ProcdefList = defineAsyncComponent(() =>
  import('@/views/mdp/workflow/re/procdef/Index.vue')
);
export default {
  name: 'BizModelForm',
  components: { 
    ProcdefList
  },
  mixins: [MdpFormMixin],
  props: {
    bizKey: String,
  },
  data() {
    return {
      menuDefId: '',//menu_def.id 菜单表菜单编号，用于按钮权限判断
      pkNames: ["id"],//表格主键的java属性名称，驼峰命名，默认为id,支持多主键
      currOpType: 'add',//表单 add、edit，所有按钮可动、detail-只看不能操作
      editFormRules: {
        id: [
          //{ required: true, message: '此项必填', trigger: 'change' },
          //{ min: 1,max: 200, message: '长度在1到200之间', trigger: 'change'}
        ]
      },
      editForm: {
        bizName: '', bizKey: '', modelKey: '', modelName: '', id: '', branchId: ''
      },
      //增删改查(含批量)接口
      apis: {
        queryById: BizModelApi.queryBizModelById,
        add: BizModelApi.addBizModel,
        edit: BizModelApi.editBizModel,
        editSomeFields: BizModelApi.editSomeFieldsBizModel
      },
      editable: false,//是否可编辑模式
    }
  },
  computed: {},
  watch: {
    bizKey() {
      this.editForm.bizKey = this.bizKey
    }
  },
  mounted() {

  },
  methods: {
    //由组件扩展添加其它的初始页面的逻辑(mounted+onOpen都会调用此函数，建议只添加公共逻辑)
    initCurrData() {
      if (this.bizKey) {
        this.editForm.bizKey = this.bizKey
      }
    },
    editSomeFields(row, fieldName, $event) {

    },
    /**
     * 检查参数是否满足调用后台接口的条件
     * @returns true / false
     */
    preParamCheck(params) {
      return true;
    },


    /**
     * 对修改的字段进行判断，返回false ,将取消更新数据库,由组件扩展
     * @param {*} row 当前选中的行
     * @param {*} fieldName 修改的字段名
     * @param {*} $event 修改后的值
     * @param {*} params 将要提交服务器的参数
     * @returns true/false 返回false ,将取消更新数据库
     */
    editSomeFieldsCheck(row, fieldName, $event, params) {
      if (this.editable == false) {
        return false;
      }
      params[fieldName] = $event
      return true;
    },
    onSelectModel(procdef) {
      this.editForm.modelKey = procdef.key
      this.editForm.modelName = procdef.name
      this.editForm.categoryId = procdef.category
      this.$refs['procdefDialog'].close()
    }
  }
}

</script>

<style scoped>

</style>
