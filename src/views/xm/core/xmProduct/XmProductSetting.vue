<template> 
      <el-form v-adaptive
        :model="editForm"
        label-width="150px"
        :rules="editFormRules"
		label-position="top"
        ref="editForm"
      >
      <el-form-item label="产品信息">
        <span>{{ editForm.productName }} &nbsp;&nbsp;</span>
         <el-row   class=" label-font-color">
          <span >产品代号:</span>
          {{ editForm.code }}  <el-divider direction="vertical" /><span
            >产品编号:</span
          >
          {{ editForm.id }}
          <el-tooltip
            content="产品代号用于签订合同等甲乙方共享的场景;产品编号为内部编号，用于内部流转,编号生成规则:产品代号+四位随机码 "
            ><i class="question"></i
          ></el-tooltip>
        </el-row>
      </el-form-item>

		 <el-form-item label="管理团队"/> 
        <el-row class="padding padding-top">

          <el-col :span="8">
            <el-form-item prop="admUserid" label-width="0px">
              <mdp-select-user show-style="x" size="medium"
                label=" 产品总控" 
                v-model="editForm.admUserid"
                :init-name="editForm.admUsername"
                @change2="editSomeFields(editForm, 'admUserid', $event)"
               />
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item prop="pmUserid" label-width="0px">
              <mdp-select-user show-style="x" size="medium"
                label=" 产品经理" 
                v-model="editForm.pmUserid"
                :init-name="editForm.pmUsername"
                @change2="editSomeFields(editForm, 'pmUserid', $event)"
               />
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item prop="assUserid" label-width="0px">
              <mdp-select-user show-style="x" size="medium"
                label=" 副经理、助理" 
                v-model="editForm.assUserid"
                :init-name="editForm.assUsername"
                @change2="editSomeFields(editForm, 'assUserid', $event)"
               />
            </el-form-item>
          </el-col>

        </el-row>

                 
							
    <el-form-item label="产品对外开放程度"> 
      <!--是否对外公开0-完全不可见，1-仅本司人员可见，2-关联人员可见（众包-外包-招投标）,3-本部门及下属部门可见,9-不区分-->
 
        <!--
        <el-radio-group v-model="editForm.showOut" @change="editSomeFields(editForm,'showOut',$event)"> 
            <el-radio label="0">完全不可见</el-radio>
            <el-radio label="1">仅本司人员可见</el-radio>
            <el-radio label="2">关联人员可见（众包-外包-招投标）</el-radio>
            <el-radio label="3">本部门、上级部门、下属部门可见</el-radio>
            <el-radio label="4">本部门、上级部门可见</el-radio>
            <el-radio label="5">本部门、下级部门可见、上级不可见</el-radio>
            <el-radio label="6">本部门可见</el-radio>
            <el-radio label="9">任何人可见</el-radio>
        </el-radio-group>
        -->
        <MdpSelect width="100%" itemCode="xm_showOut" v-model="editForm.showOut" @change="editSomeFields(editForm,'showOut',$event)"/>
 
    </el-form-item> 
                 <el-form-item label="团队相关:小组crud、加减人、小组组长管理等">
 
                    <!--
                     <el-radio-group v-model="qxCode.groupScope" @change="editSomeFields(editForm,'groupScope',$event)">
                       <el-radio label="0">不限制，允许任何人</el-radio>
                       <el-radio label="1">同机构下的人员</el-radio>
                       <el-radio label="2">同产品内人员</el-radio>
                       <el-radio label="3">同产品下同小组内人员</el-radio>
                     </el-radio-group>
                     -->
                     <MdpSelect width="100%"  itemCode="xm_groupScope" v-model="qxCode.groupScope" @change="editSomeFields(editForm,'groupScope',$event)"/>
 
                       <el-checkbox  v-model="qxCode.groupTransmit"  :true-label="'1'" :false-label="'0'"  @change="editSomeFields(editForm,'groupTransmit',$event)">是否检查用户的上下级关系</el-checkbox>
 
                 </el-form-item>

              <el-form-item label="测试相关：缺陷crud、用例crud、测试计划、测试执行等">
 
                   <!--
                  <el-radio-group v-model="qxCode.testScope" @change="editSomeFields(editForm,'testScope',$event)">
                       <el-radio label="0">不限制，允许任何人</el-radio>
                       <el-radio label="1">同机构下的人员</el-radio>
                       <el-radio label="2">同产品内人员</el-radio>
                       <el-radio label="3">同产品下同小组内人员</el-radio>
                  </el-radio-group>
                -->
                <MdpSelect width="100%" itemCode="xm_testScope" v-model="qxCode.testScope" @change="editSomeFields(editForm,'testScope',$event)"/>
 
                    <el-checkbox  v-model="qxCode.testTransmit"  :true-label="'1'" :false-label="'0'"  @change="editSomeFields(editForm,'testTransmit',$event)">缺陷、用例等指派及crud是否检查用户的上下级关系</el-checkbox>
 
                <!--0-代表不限制,1-同组织，2-同项目组（默认），3-同小组-->
              </el-form-item>

                 <el-form-item label="迭代crud、迭代负责人管理"> 
                     <!--
                     <el-radio-group v-model="qxCode.iterationScope" @change="editSomeFields(editForm,'iterationScope',$event)">
                       <el-radio label="0">不限制，允许任何人</el-radio>
                       <el-radio label="1">同机构下的人员</el-radio>
                       <el-radio label="2">同产品内人员</el-radio>
                       <el-radio label="3">同产品下同小组内人员</el-radio>
                     </el-radio-group>
                    -->
                    <MdpSelect width="100%" itemCode="xm_iterationScope" v-model="qxCode.iterationScope" @change="editSomeFields(editForm,'iterationScope',$event)"/>

 
                       <el-checkbox  v-model="qxCode.iterationTransmit"  :true-label="'1'" :false-label="'0'"  @change="editSomeFields(editForm,'iterationTransmit',$event)">迭代指派及crud是否检查用户的上下级关系</el-checkbox>
 
                   <!--0-代表不限制,1-同组织，2-同项目组（默认），3-同小组-->
                 </el-form-item>

                 <el-form-item label="需求相关：史诗、特性、故事的crud">
 
                     <!--
                     <el-radio-group v-model="qxCode.menuTransmit" @change="editSomeFields(editForm,'menuScope',$event)">
                       <el-radio label="0">不限制，允许任何人</el-radio>
                       <el-radio label="1">同机构下的人员</el-radio>
                       <el-radio label="2">同产品内人员</el-radio>
                       <el-radio label="3">同产品下同小组内人员</el-radio>
                     </el-radio-group>
                    -->
                    <MdpSelect width="100%" itemCode="xm_menuScope" v-model="qxCode.menuScope" @change="editSomeFields(editForm,'menuScope',$event)"/>

 
                       <el-checkbox  v-model="qxCode.menuTransmit"  :true-label="'1'" :false-label="'0'"  @change="editSomeFields(editForm,'menuTransmit',$event)">需求指派及crud是否检查用户的上下级关系</el-checkbox>
 
                   <!--0-代表不限制,1-同组织，2-同项目组（默认），3-同小组-->
                 </el-form-item>
      </el-form> 
  
</template>

<script>
import util from '@/components/mdp-ui/js/util';//全局公共库
import { 
  editXmProductSomeFields, 
  
} from "@/api/xm/core/xmProduct";
import { mapState } from 'pinia'
import { useUserStore } from '@/store/modules/user'
import { useXmStore2 } from '@/store/modules/xm'
import { MdpFormMixin } from '@/components/mdp-ui/mixin/MdpFormMixin';
export default {
	mixins: [MdpFormMixin],
  computed: {
    ...mapState(useUserStore,["userInfo", "roles"]),
  },
  props: ["xmProduct", "visible"],
  watch: {
    xmProduct: {
      handler() { 
        this.initCurrData()
      },
      deep: true,
    }, 
  },
  data() {
    return {
      editFormRules: {
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
        showOut:'1'
      }, 
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
				qxCode:{
          groupScope:'2',
          groupTransmit:'1',
					testScope:'2',//0-代表不限制,1-同组织，2-同项目组（默认），3-同小组
					testTransmit:'1',//0-不控制，1任务指派及crud必须检查用户的上下级关系
					menuScope:'2',//0-代表不限制,1-同组织，2-同项目组（默认），3-同小组
					menuTransmit:'1',//0-不控制，1任务指派及crud必须检查用户的上下级关系
					iterationScope:'2',//0-代表不限制,1-同组织，2-同项目组（默认），3-同小组
					iterationTransmit:'1',//0-不控制，1任务指派及crud必须检查用户的上下级关系
				}, 
        apis:{ 
          editSomeFields: editXmProductSomeFields
        } 
    }; //end return
  }, //end data
  methods: {  
    afterEditSomeFields(res,isOk,params,row){ 
      if(isOk){
        useXmStore2().setXmProduct(this.editForm)
      }
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
      }else if (fieldName == "groupScope"||fieldName == "groupTransmit"||fieldName == "testScope"||fieldName=="testTransmit"||fieldName == "menuScope"||fieldName=="menuTransmit"||fieldName == "iterationScope"||fieldName=="iterationTransmit") {
        params["qxCode"] = [this.qxCode.groupScope,this.qxCode.groupTransmit,this.qxCode.testScope,this.qxCode.testTransmit,this.qxCode.menuScope,this.qxCode.menuTransmit,this.qxCode.iterationScope,this.qxCode.iterationTransmit].join(",")
      } else {
        params[fieldName] = $event;
      }
      return true;
    },


			initCurrData(){
        this.currOpType='edit'
				this.editForm=Object.assign(this.editForm,this.xmProduct) 
        this.initQxCode();
			},

			initQxCode(){
				var qxCode=this.editForm.qxCode
				if(!qxCode){
					this.qxCode.groupScope="2"
					this.qxCode.groupTransmit="1"
					this.qxCode.testScope="2"
					this.qxCode.testTransmit="1"
					this.qxCode.menuScope="2"
					this.qxCode.menuTransmit="1"
					this.qxCode.iterationScope="2"
					this.qxCode.iterationTransmit="1"
				}else{
					var qxCodes=qxCode.split(",")
					if(qxCodes.length>=8){
            this.qxCode.groupScope=qxCodes[0]
            this.qxCode.groupTransmit=qxCodes[1]
            this.qxCode.testScope=qxCodes[2]
            this.qxCode.testTransmit=qxCodes[3]
            this.qxCode.menuScope=qxCodes[4]
            this.qxCode.menuTransmit=qxCodes[5]
            this.qxCode.iterationScope=qxCodes[6]
            this.qxCode.iterationTransmit=qxCodes[7]
					}else{
            this.qxCode.groupScope='2'
            this.qxCode.groupTransmit='1'
            this.qxCode.testScope="2"
            this.qxCode.testTransmit="1"
            this.qxCode.menuScope="2"
            this.qxCode.menuTransmit="1"
            this.qxCode.iterationScope="2"
            this.qxCode.iterationTransmit="1"
					}
				}
			},
  }, 
};
</script>
