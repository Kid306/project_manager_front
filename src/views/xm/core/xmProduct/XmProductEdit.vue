<template> 
    <!--新增界面 XmProduct 产品表-->
    <el-form style="width:100%;" :model="editForm" label-width="120px" :rules="editFormRules" label-position="top" ref="editForm">
      <el-form-item label="产品名称" prop="productName" v-if="currOpType !== 'add'">
        <el-input v-model="editForm.productName" placeholder="产品名称"
          @change="editSomeFields(editForm, 'productName', $event)" />
        <el-row class=" label-font-color">
          <span>产品代号:</span>
          {{ editForm.code }} <el-divider direction="vertical" /><span>产品编号:</span>
          {{ editForm.id }}
          <el-tooltip content="产品代号用于签订合同等甲乙方共享的场景;产品编号为内部编号，用于内部流转,编号生成规则:产品代号+四位随机码 "><i
              class="question"></i></el-tooltip>
        </el-row>
      </el-form-item>
      <el-form-item label="产品名称" prop="productName" v-if="currOpType === 'add'">
        <el-input v-model="editForm.productName" placeholder="产品名称" />
      </el-form-item>
      <el-form-item label="产品代号" prop="code" v-if="currOpType === 'add'">
        <el-input v-model="editForm.code" style="width: 200px" placeholder="产品代号，不可为空" />
        <el-button @click="createProductCode">自动生成</el-button>
        <el-tooltip content="产品代号用于签订合同等甲乙方共享的场景;产品编号为内部编号，用于内部流转，生成规则:产品代号+四位随机码 "><i class="question"></i></el-tooltip>
      </el-form-item>
      <el-form-item label="归属部门" prop="deptid">
        <mdp-select-dept v-model="editForm.deptid" placeholder="归属部门" width="100%"  :displayLoad="true"
          @change2="editSomeFields(editForm, 'deptid', $event)" />
      </el-form-item>
      <el-form-item label="管理团队"/>

        <el-row class="padding padding-top">

          <el-col :span="8">
            <el-form-item prop="admUserid" label-width="0px">
              <mdp-select-user show-style="x" size="medium" label=" 产品总控" v-model="editForm.admUserid"
                :init-name="editForm.admUsername" @change2="editSomeFields(editForm, 'admUserid', $event)" />
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item prop="pmUserid" label-width="0px">
              <mdp-select-user show-style="x" size="medium" label=" 产品经理" v-model="editForm.pmUserid"
                :init-name="editForm.pmUsername" @change2="editSomeFields(editForm, 'pmUserid', $event)" />
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item prop="assUserid" label-width="0px">
              <mdp-select-user show-style="x" size="medium" label=" 副经理、助理" v-model="editForm.assUserid"
                :init-name="editForm.assUsername" @change2="editSomeFields(editForm, 'assUserid', $event)" />
            </el-form-item>
          </el-col>

        </el-row>
      <el-form-item label="备注" prop="remark">
        <el-input v-model="editForm.remark" :rows="10" type="textarea" :autosize="{ minRows: 4, maxRows: 20 }"
          placeholder="备注" @change="editSomeFields(editForm, 'remark', $event)" />
      </el-form-item>
    </el-form>

    <el-row v-if="currOpType === 'add'" class="footer">
      <el-button type="primary" @click="addSubmit">保存</el-button>
    </el-row> 
</template>

<script>
import util from '@/components/mdp-ui/js/util';//全局公共库
import {

  addXmProduct,
  editXmProductSomeFields,
  createProductCode,
  editXmProduct
} from "@/api/xm/core/xmProduct";
import { mapState } from 'pinia'
import { useUserStore } from '@/store/modules/user'
import { useXmStore2 } from '@/store/modules/xm'


import { MdpFormMixin } from '@/components/mdp-ui/mixin/MdpFormMixin';
export default {
	mixins: [MdpFormMixin],
  computed: {
    ...mapState(useUserStore, ["userInfo", "roles"]),
    calcXmProductPstatusStep() {
      if (this.dicts["xmProductPstatus"]) {
        var index = this.dicts["xmProductPstatus"].findIndex((i) => {
          if (i.id == this.editForm.pstatus) {
            return true;
          } else {
            return false;
          }
        });
        return index + 1;
      } else {
        return 0;
      }
    },
  },
  props: ["xmProduct", "visible", "subOpType", 'selProject'],
  watch: {
    xmProduct: {
      handler() {
        this.editForm = this.xmProduct;
      },
      deep: true,
    },
    visible: function (visible) {
      if (visible == true) {

        this.initData();
        this.initQxCode();
        //从新打开页面时某些数据需要重新加载，可以在这里添加
      }
    },
  },
  data() {
    return {
      currOpType:'add',
      dicts: { xmProductPstatus: [] }, //下拉选择框的所有静态数据  params=[{categoryId:'0001',itemCode:'sex'}] 返回结果 {'sex':[{optionValue:'1',optionName:'男',seqOrder:'1',fp:'',isDefault:'0'},{optionValue:'2',optionName:'女',seqOrder:'2',fp:'',isDefault:'0'}]}
      load: { list: false, add: false, del: false, edit: false }, //查询中...
      editFormRules: {
        productName: [
          { required: true, message: "产品名称不能为空", trigger: "change" },
          {
            min: 2,
            max: 250,
            message: "名称长度在10-250个字符",
            trigger: "change",
          },
        ],

        id: [
          { required: true, message: "产品编号不能为空", trigger: "change" },
        ],
        code: [
          { required: true, message: "产品代号不能为空", trigger: "change" },
        ],

        pmUserid: [
          { required: true, message: "产品经理不能为空", trigger: "change" },
        ],

        admUserid: [
          { required: true, message: "产品总监不能为空", trigger: "change" },
        ],
        remark: [
          {
            min: 0,
            max: 250,
            message: "备注长度在10-250个字符",
            trigger: "change",
          },
        ],
      },
      //新增界面数据 产品表
      editForm: {
        id: "",
        productName: "",
        branchId: "",
        remark: "",
        version: "",
        pmUserid: "",
        pmUsername: "",
        ctime: "",
        deptid: "",
        pstatus: "",
        startTime: "",
        endTime: "",
        deptName: "",
        admUserid: "",
        admUsername: "",
        assUserid: "",
        assUsername: "",
        bizProcInstId: "",
        bizFlowState: "",
        isTpl: "",
        baselineId: "",
        baseTime: "",
        code: "",
        pbudgetWorkload: "",
        pbudgetAmount: "",
        pmenuBudgetWorkload: "",
        pmenuBudgetAmount: "",
        budgetCtrl: "",
        phaseBudgetCtrl: "",
        phaseActCtrl: "",
        locked: "",
        del: "",
        ltime: "",
      }, 
      userSelectVisible: false,
      currTabPane: "1",
      /**
      权限码0,1,2,3,4,5,67,8,9，逗号分割
      共10位,不定长，暂时只启用前6个位
      第0位代表需求指派及crud权限：
        0-代表不限制,1-同组织，2-同项目组（默认），3-同小组
      第1位代表需求指派及crud时是否检查上下级关系：0-否（默认），1是
      第2位代表测试相关(包括测试用例、测试库、测试计划、测试报告)指派及crud权限同第0位，
      第3位代表测试相关(包括测试用例、测试库、测试计划、测试报告)指派及crud时是否检查上下级关系，同第1位
      第4位代表迭代指派及crud时权限，同第0位
      第5位代表迭代指派及crud时是否检查上下级关系，同第1位
        */
      qxCode: {
        groupScope: '2',
        groupTransmit: '1',
        testScope: '2',//0-代表不限制,1-同组织，2-同项目组（默认），3-同小组
        testTransmit: '1',//0-不控制，1任务指派及crud必须检查用户的上下级关系
        menuScope: '2',//0-代表不限制,1-同组织，2-同项目组（默认），3-同小组
        menuTransmit: '1',//0-不控制，1任务指派及crud必须检查用户的上下级关系
        iterationScope: '2',//0-代表不限制,1-同组织，2-同项目组（默认），3-同小组
        iterationTransmit: '1',//0-不控制，1任务指派及crud必须检查用户的上下级关系
      },
      apis:{
        add: addXmProduct,
        edit: editXmProduct,
        editSomeFields: editXmProductSomeFields
      }
      /**begin 在下面加自定义属性,记得补上面的一个逗号**/

      /**end 在上面加自定义属性**/
    }; //end return
  }, //end data
  methods: { 
    //新增提交XmProduct 产品表 父组件监听@submit="afterAddSubmit"
    addSubmit: function () {

      this.$refs.editForm.validate((valid) => {
        if (valid) {

          var msg = this.selProject && this.selProject.id ? '将自动关联项目【' + (this.selProject.name ? this.selProject.name : this.selProject.id) + '】' : '';
          this.$confirm('确认提交吗？' + msg, '提示', {}).then(() => {
            this.load.add = true
            let params = Object.assign({}, this.editForm);
            if (this.selProject && this.selProject.id) {
              params.links = [{ projectId: this.selProject.id }]
            }
            params.branchId = this.userInfo.branchId
            addXmProduct(params).then((res) => {
              this.load.add = false
              var tips = res.tips;
              if (tips.isOk) {
                //this.$refs['addForm'].resetFields();
                this.$emit('submit', res.data);//  @submit="afterAddSubmit"
              }
              this.$notify({ position: 'bottom-left', showClose: true, message: tips.msg, type: tips.isOk ? 'success' : 'error' });
            }).catch(err => this.load.add = false);
          });
        } else {
          this.$notify({ position: 'bottom-left', showClose: true, message: "表单检查不通过", type: 'error' });
        }
      });
    },

    editSomeFieldsCheck(row, fieldName, $event,params) {  
      if (fieldName == "admUserid") {
        params["admUserid"] = $event.userid;
        params["admUsername"] = $event.username;
      } else if (fieldName == "assUserid") {
        params["assUserid"] = $event.userid;
        params["assUsername"] = $event.username;
      } else if (fieldName == "pmUserid") {
        params["pmUserid"] = $event.userid;
        params["pmUsername"] = $event.username;
      } else if (fieldName == "startTime") {
        params["startTime"] = row.startTime;
        params["endTime"] = row.endTime;
      } else if (fieldName == "groupScope" || fieldName == "groupTransmit" || fieldName == "testScope" || fieldName == "testTransmit" || fieldName == "menuScope" || fieldName == "menuTransmit" || fieldName == "iterationScope" || fieldName == "iterationTransmit") {
        params["qxCode"] = [, this.qxCode.groupScope, this.qxCode.groupTransmit, this.qxCode.testScope, this.qxCode.testTransmit, this.qxCode.menuScope, this.qxCode.menuTransmit, this.qxCode.iterationScope, this.qxCode.iterationTransmit].join(",")
      } else if (fieldName == 'deptid') {
        params["deptid"] = $event.deptid;
        params["deptidPath"] = $event.idPath;
      } else {
        params[fieldName] = $event;
      }
      return true; 
    },

    afterEditSomeFields(res,isOk,params,row){
      if(isOk){
        useXmStore2().setXmProduct(row) 
      }else{
        this.initQxCode()
      }

    },
    createProductCode() {
      createProductCode({}).then(res => {
        var tips = res.tips;
        if (tips.isOk) { 
          this.editForm.code=res.data
        }
        this.$notify({ position: 'bottom-left', showClose: true, message: tips.msg, type: tips.isOk ? 'success' : 'error' });
      })
    },

    initCurrData() {
      this.currOpType=this.subOpType
      this.editForm = Object.assign(this.editForm, this.xmProduct)
      if (this.currOpType === 'add') {
        this.editForm.pmUserid = this.userInfo.userid
        this.editForm.pmUsername = this.userInfo.username
        this.editForm.admUserid = this.userInfo.userid
        this.editForm.admUsername = this.userInfo.username
        this.editForm.assUserid = this.userInfo.userid
        this.editForm.assUsername = this.userInfo.username
      } 
      this.initQxCode();
    },

    initQxCode() {
      var qxCode = this.editForm.qxCode
      if (!qxCode) {
        this.qxCode.groupScope = "2"
        this.qxCode.groupTransmit = "1"
        this.qxCode.testScope = "2"
        this.qxCode.testTransmit = "1"
        this.qxCode.menuScope = "2"
        this.qxCode.menuTransmit = "1"
        this.qxCode.iterationScope = "2"
        this.qxCode.iterationTransmit = "1"
      } else {
        var qxCodes = qxCode.split(",")
        if (qxCodes.length >= 8) {
          this.qxCode.groupScope = qxCodes[0]
          this.qxCode.groupTransmit = qxCodes[1]
          this.qxCode.testScope = qxCodes[2]
          this.qxCode.testTransmit = qxCodes[3]
          this.qxCode.menuScope = qxCodes[4]
          this.qxCode.menuTransmit = qxCodes[5]
          this.qxCode.iterationScope = qxCodes[6]
          this.qxCode.iterationTransmit = qxCodes[7]
        } else {
          this.qxCode.groupScope = '2'
          this.qxCode.groupTransmit = '1'
          this.qxCode.testScope = "2"
          this.qxCode.testTransmit = "1"
          this.qxCode.menuScope = "2"
          this.qxCode.menuTransmit = "1"
          this.qxCode.iterationScope = "2"
          this.qxCode.iterationTransmit = "1"
        }
      }
    },
    /**end 在上面加自定义方法**/
  }, //end method
  components: {
  },
  mounted() {
 
    
    /**在下面写其它函数***/
  }, //end mounted
};
</script>

<style  lang="scss" scoped />
