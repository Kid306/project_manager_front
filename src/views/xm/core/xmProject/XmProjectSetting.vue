<template>
	  
				<el-form :model="editForm" v-adaptive="{bottom:50}" label-width="120px" label-position="top" :rules="editFormRules" ref="editForm" class="editForm"> 
						 			
 
							<el-row><h3>{{ editForm.name }}</h3> </el-row>
							<el-row class="label-font-color padding-bottom">
								项目代号:   {{editForm.code}} <el-divider direction="vertical" /> 项目编号:   {{editForm.id}} <el-tooltip content="项目代号用于签订合同等甲乙方共享的场景;项目编号为内部编号，用于内部流转,编号生成规则:项目代号+四位随机码 "><i class="question"></i></el-tooltip>
							</el-row>
 							<el-form-item label="报工方式" prop="wtype">  
								<el-select v-model="editForm.wtype"  @change="editSomeFields(editForm,'wtype',$event)">
									<el-option   label="无须报工" value="0"  /> 
									<el-option   label="每日报工" value="1"  /> 
									<el-option   label="工期内任意日报工" value="2"  /> 
								</el-select>  
							</el-form-item>   
							<el-form-item label="总预算控制" prop="budgetCtrl">
								<el-checkbox  v-model="editForm.budgetCtrl"  :true-label="'1'" :false-label="'0'"   @change="editSomeFields(editForm,'budgetCtrl',$event)">项目计划总预算大于项目总预算后将无法添加新的计划任务，进行项目预算变更后方可继续添加计划任务。</el-checkbox>  
 							</el-form-item>  
							<el-form-item label="总预算超额预警" prop="budgetEarly">
								<el-checkbox  v-model="editForm.budgetEarly"  :true-label="'1'" :false-label="'0'"   @change="editSomeFields(editForm,'budgetEarly',$event)">总预算超出&nbsp;<el-input  type="number" v-model="editForm.earlyAmt" placeholder="预警额度" style="width:180px;" @change="editSomeFields(editForm,'earlyAmt',$event)"/> &nbsp;元将进入预警清单</el-checkbox> 
 							</el-form-item> 
							<el-form-item label="实际金额控制" prop="phaseActCtrl">
								<el-checkbox  v-model="editForm.phaseActCtrl"  :true-label="'1'" :false-label="'0'"  @change="editSomeFields(editForm,'phaseActCtrl',$event)">每条计划实际金额不能大于预算金额; 任务的实际金额合计不能大于与任务关联的上级计划的预算。</el-checkbox>  
 							</el-form-item>     
							<el-form-item label="任务开关">
								 <el-row>
								  预算金额超出&nbsp;<el-input  type="number" v-model="editForm.maxTaskAmt"  style="width:180px;" @change="editSomeFields(editForm,'maxTaskAmt',$event)"/> &nbsp;元的任务将被禁止保存 
 								</el-row>
								<el-row>
									<el-checkbox  v-model="editForm.menuLink"  :true-label="'1'" :false-label="'0'"  @change="editSomeFields(editForm,'menuLink',$event)">任务是否必须严格关联用户故事</el-checkbox>  
									<el-checkbox  v-model="editForm.phaseLink"  :true-label="'1'" :false-label="'0'"  @change="editSomeFields(editForm,'phaseLink',$event)">任务是否必须严格关联计划</el-checkbox>  
								</el-row>
								<!--0-代表不限制,1-同组织，2-同项目组（默认），3-同小组-->
							</el-form-item>     

							
                 
							
    <el-form-item label="项目对外开放程度"> 
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

                 <el-form-item label="任务相关：任务及计划的crud、任务指派、报工等">
 
                     <!--
                     <el-radio-group v-model="qxCode.menuTransmit" @change="editSomeFields(editForm,'menuScope',$event)">
                       <el-radio label="0">不限制，允许任何人</el-radio>
                       <el-radio label="1">同机构下的人员</el-radio>
                       <el-radio label="2">同产品内人员</el-radio>
                       <el-radio label="3">同产品下同小组内人员</el-radio>
                     </el-radio-group>
                    -->
                    <MdpSelect width="100%" itemCode="xm_taskScope" v-model="qxCode.taskScope" @change="editSomeFields(editForm,'taskScope',$event)"/>

 
                       <el-checkbox  v-model="qxCode.taskTransmit"  :true-label="'1'" :false-label="'0'"  @change="editSomeFields(editForm,'taskTransmit',$event)">任务指派及crud是否检查用户的上下级关系</el-checkbox>
 
                   <!--0-代表不限制,1-同组织，2-同项目组（默认），3-同小组-->
                 </el-form-item>
				</el-form>       

	
</template>

<script>
	import util from '@/components/mdp-ui/js/util';//全局公共库
 
	import config from "@/api/mdp_pub/mdp_config"; //全局公共库 
	import { createProjectCode,editXmProjectSomeFields } from '@/api/xm/core/xmProject'; 
 	
	import { mapState } from 'pinia'
import { useUserStore } from '@/store/modules/user';  
import { useXmStore,useXmStore2 } from '@/store/modules/xm'
 	
import { MdpFormMixin } from '@/components/mdp-ui/mixin/MdpFormMixin';
export default {
	mixins: [MdpFormMixin],
		computed: {
		    ...mapState(useUserStore,[
		      'userInfo','roles'
				]),  
		},
		props:['selProject'],
		watch: {  
		  selProject:{
			handler(newValue, oldValue) {
				this.initData(); 
			},
			deep:true
			
		  }, 
	    },
		data() { 
			  
			return { 
				editFormRules: {
					 
				},
				//编辑界面数据  XmProject xm_project
				editForm: { 
					id:'',code:'',name:'',xmType:'',startTime:'',endTime:'',urgent:'',priority:'',description:'',createUserid:'',createUsername:'',createTime:'',assess:'',assessRemarks:'',status:'',branchId:'',planTotalCost:'',bizProcInstId:'',bizFlowState:'',planNouserAt:'',planIuserAt:'',planOuserAt:'',locked:'',baseTime:'',baseRemark:'',baselineId:'',planWorkload:'0',totalReceivables:'0',budgetMarginRate:13,contractAmt:0,planIuserPrice:85,planOuserPrice:100,planOuserCnt:0,planIuserCnt:0,planWorkingHours:0,taxRate:3,planIuserWorkload:0,planOuserWorkload:0,fromTplId:'',budgetCtrl:'0',deptid:'',showOut:'1',isTpl:'0',pmUserid:'',pmUsername:'',assUserid:'',assUsername:'',admUserid:'',admUsername:'',budgetEarly:'',phaseActCtrl:'',del:'0',ltime:'',ostatus:'0',workType:'',wtype:'',earlyAmt:0,maxTaskAmt:0,menuLink:'0',phaseLink:'0',tplType:'',qxCode:''
				}, 
 				/**
					权限码0,1,2,3,4,5,67,8,9，逗号分割
					共10位,不定长，暂时只启用前2个位
					第0位代表计划及任务指派及crud权限：
						0-代表不限制,1-同组织，2-同项目组（默认），3-同小组
					第1位代表计划及任务指派及crud时是否检查上下级关系：0-否（默认），1是 
					*/
				qxCode:{
					taskScope:'2',//0-代表不限制,1-同组织，2-同项目组（默认），3-同小组
					taskTransmit:'0',//0-不控制，1任务指派及crud必须检查用户的上下级关系 
					testScope:'',
					testTransmit:'',
					groupScope:'',
					groupTransmit:''

				}, 
				apis:{ 
					editSomeFields: editXmProjectSomeFields
				}
				/**end 在上面加自定义属性**/
			}//end return
		},//end data
		methods: { 
			//打开用户选择 
			//选择接收人 
			
			afterEditSomeFields(res,isOk,params,row){ 
				if(isOk){
					useXmStore2().setProjectInfo(this.editForm)
				}
			},
      
			initQxCode(){
				var qxCode=this.editForm.qxCode
				if(!qxCode){
					this.qxCode.groupScope="2"
					this.qxCode.groupTransmit="1"
					this.qxCode.testScope="2"
					this.qxCode.testTransmit="1"
					this.qxCode.taskScope="2"
					this.qxCode.taskTransmit="1" 
				}else{
					var qxCodes=qxCode.split(",")
					if(qxCodes.length>=6){
						this.qxCode.groupScope=qxCodes[0]
						this.qxCode.groupTransmit=qxCodes[1]
						this.qxCode.testScope=qxCodes[2]
						this.qxCode.testTransmit=qxCodes[3]
						this.qxCode.taskScope=qxCodes[4]
						this.qxCode.taskTransmit=qxCodes[5] 
					}else{
						this.qxCode.groupScope='2'
						this.qxCode.groupTransmit='1'
						this.qxCode.testScope="2"
						this.qxCode.testTransmit="1"
						this.qxCode.taskScope="2"
						this.qxCode.taskTransmit="1" 
					}
				}
			},  
			
			createProjectCode(){ 
				createProjectCode({}).then(res=>{
					var tips=res.tips;
					if(tips.isOk){   
						this.editForm.code=res.data
					}
					this.$notify({position:'bottom-left',showClose:true,message: tips.msg, type: tips.isOk?'success':'error' }); 
				})
			},
			initCurrData(){
				this.currOpType="edit"
				this.editForm=Object.assign(this.editForm,this.selProject)   
				this.initQxCode()
			},
			
			
			editSomeFieldsCheck(row,fieldName,$event,params){ 
				if (fieldName == "groupScope"||fieldName == "groupTransmit"||fieldName == "testScope"||fieldName=="testTransmit"||fieldName == "taskScope"||fieldName=="taskTransmit") {
					params["qxCode"] = [this.qxCode.groupScope,this.qxCode.groupTransmit,this.qxCode.testScope,this.qxCode.testTransmit,this.qxCode.taskScope,this.qxCode.taskTransmit].join(",") 
				} else{
					params[fieldName]=$event 
				}
				return true;
			},
			/**end 在上面加自定义方法**/
		},//end method
		components: {  
		    //在下面添加其它组件 'xm-project-add':XmProjectEdit
		},
		mounted() {    
		}
	}

</script>

