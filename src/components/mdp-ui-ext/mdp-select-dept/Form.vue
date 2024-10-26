<template> 
			<el-form :model="editForm"  label-width="120px" :rules="editFormRules" ref="editFormRef">
                <el-card header="基本信息">
                    <el-form-item label="部门全称" prop="deptName">
                        <el-input v-model="editForm.deptName" placeholder="部门全称" :maxlength="64" @change="editSomeFields(editForm,'deptName',$event)" :disabled="disField"/>
                    </el-form-item>  
                    <el-form-item label="部门简称" prop="shortName" v-if="currOpType!='add' && currOpType!='subAdd'">
                        <el-input v-model="editForm.shortName" placeholder="简称" :maxlength="50" @change="editSomeFields(editForm,'shortName',$event)" :disabled="disField"/>
                    </el-form-item> 
                    <el-form-item label="部门编号" prop="deptid">
                        <el-input  v-model="editForm.deptid" placeholder="部门编号，为空则后台自动生成" :maxlength="40" @change="editSomeFields(editForm,'deptid',$event)" :disabled="disField || currOpType=='edit'"/>
                    </el-form-item>   
                    <el-form-item label="图标" >
                        <IconSelect v-model="editForm.icon" @change="editSomeFields(editForm,'icon',$event)"/>
                    </el-form-item> 
                    <el-form-item label="负责人" prop="manager">
                        <mdp-select-user  width="100%"  v-model="editForm.manager" placeholder="负责人名称" :maxlength="40" @change2="editSomeFields(editForm,'manager',$event)" :disabled="disField" :initName="editForm.managerName"/>
                    </el-form-item> 
                    <el-form-item label="部门性质" prop="deptType">
					<mdp-select width="100%"  item-code="deptType" v-model="editForm.deptType" placeholder="部门性质" :maxlength="40" @change="editSomeFields(editForm,'deptType',$event)" :disabled="disField"/>
                    </el-form-item> 
                    
                    <el-form-item label="层级" prop="levelType" v-if="currOpType!='add' && currOpType!='subAdd'">
                        <mdp-select   width="100%" item-code="deptLvl" v-model="editForm.levelType" placeholder="层级类型" :maxlength="20" @change="editSomeFields(editForm,'levelType',$event)" :disabled="disField"/>
                    </el-form-item> 
                    
                    <el-form-item label="状态" prop="state"  v-if="currOpType!='add' && currOpType!='subAdd'">  
                        <mdp-select width="100%" @change="editSomeFields(editForm,'state',$event)" show-style="tag"
                        item-code="dept_state" v-model="editForm.state"/>
                    </el-form-item> 
                    <el-form-item label="审批状态" prop="bizFlowState" v-if="currOpType!='add' && currOpType!='subAdd'">
                        <mdp-select   width="100%" item-code="bizFlowState" v-model="editForm.bizFlowState" placeholder="当前流程状态" :maxlength="1" @change="editSomeFields(editForm,'bizFlowState',$event)" :disabled="disField"/>
                    </el-form-item>  
                </el-card>
				<el-card header="隶属关系">
                    <el-form-item label="上级部门" prop="pdeptid">
                        <MdpSelectDept  displayLoad v-model="editForm.pdeptid" width="100%"  :disabled="disField||true"/>
                    </el-form-item> 
                    <el-form-item label="上级领导" prop="leader">
                        <mdp-select-user  width="100%"   v-model="editForm.leader" placeholder="上级领导名称" :maxlength="40" @change2="editSomeFields(editForm,'leader',$event)" :disabled="disField"  :initName="editForm.leaderName"/>
                    </el-form-item>  
                </el-card> 
                <!--
				<el-form-item label="机构类型" prop="deptType">
					<mdp-select item-code="orgType" v-model="editForm.orgType" placeholder="机构类型" :maxlength="40" @change="editSomeFields(editForm,'orgType',$event)" :disabled="disField"/>
				</el-form-item> 
                -->
                <el-card header="上下游"> 
                
                    <el-form-item label="协作类型" prop="cpaType" title="可以通过协作类型+协作组织把内部组织及上下游合作伙伴整合成强大的商业圈">
                        <mdp-select   width="100%" item-code="cpaType" v-model="editForm.cpaType"  placeholder="协作类型" @change="editSomeFields(editForm,'cpaType',$event)"/>   
                    </el-form-item> 

                    <el-form-item label="协作机构" prop="cpaType">
                        <mdp-select-branch  width="100%"  placeholder="协作组织"  v-model="editForm.cpaBranchId" @change="editSomeFields(editForm,'cpaBranchId',$event)"/>
                    </el-form-item> 
                </el-card>
			</el-form> 

		<el-row v-if="showBtn!==false" class="footer">
		    <el-button @click="close">关闭</el-button>
            <el-button v-if="currOpType=='add' || currOpType=='subAdd'" v-loading="load.edit" type="primary" @click="saveSubmit" :disabled="disBtn('addBtn') || !checkBtnQx('addBtn',menuDefId) || load.edit">提交</el-button>
		</el-row>  
</template>

<script>
import util from '@/components/mdp-ui/js/util';//全局公共库
import config from "@/api/mdp_pub/mdp_config"; //全局公共库import
import { mapState } from 'pinia'
import { useUserStore } from '@/store/modules/user'
import { MdpFormMixin } from '@/components/mdp-ui/mixin/MdpFormMixin.js'; 
export default {
    name:'deptForm',
    mixins:[MdpFormMixin], 
    computed: {
        ...mapState(useUserStore,['userInfo'])
    },
    props:{
        parentDept:null,
    },
    watch: {
    },
    data() {
        return {
            menuDefId:'',//menu_def.id 菜单表菜单编号，用于按钮权限判断
            pkNames:["deptid"],//表格主键的java属性名称，驼峰命名，默认为id,支持多主键
            
            editFormRules: { 
                deptName:[
                    { required: true, message: '此项必填', trigger: 'change' },
                    { min: 1,max: 50, message: '长度在1到50之间', trigger: 'change'}
                ],
                shortName:[ 
                    { min: 1,max: 50, message: '长度在1到50之间', trigger: 'change'}
                ],
                
                displayDeptid:[ 
                    { min: 1,max: 50, message: '长度在1到50之间', trigger: 'change'}
                ],
                
                deptid:[ 
                    { min: 1,max: 50, message: '长度在1到50之间', trigger: 'change'}
                ], 
            },
            editForm: {
                deptid:'',deptName:'',pdeptid:'',deptType:'',state:'',manager:'',leader:'',shortName:'',displayDeptid:'',orgType:'',managerName:'',leaderName:'',branchId:'',levelType:'',idPath:'',bizProcInstId:'',bizFlowState:'',ltime:'',isCbCenter:'',cpaType:'',cpaBranchId:''
            },
            //增删改查(含批量)接口
            apis:{
                add: this.$mdp.addDept,
                edit: this.$mdp.editDept,
                editSomeFields: this.$mdp.editSomeFieldsDept
            }
        }
    },
    methods: {
        //由组件扩展添加其它的初始页面的逻辑
         initCurrData(){
             this.currOpType=this.subOpType
            if(this.currOpType=='subAdd'){
                var data=this.parentDept;
                this.editForm.pdeptid=data.deptid;
                this.editForm.branchId=data.branchId;
                this.editForm.levelType =data.levelType;
                this.editForm.shortName=null;
                this.editForm.deptName=data.deptName+"【下属子部门，请修改】"
                this.editForm.cpaType='0'
                this.editForm.state="1"
                this.editForm.deptType="2"
                this.editForm.cpaBranchId=data.branchId
                this.editForm.deptType="2"
                this.editForm.manager=this.userInfo.userid
                this.editForm.managerName=this.userInfo.username
                this.editForm.leader=data.manager
                this.editForm.leaderName=data.managerName
                this.editForm.displayDeptid=null
                var a=this.editForm.levelType.split("L").join("");//字符串转数字
                var leve = Number(a);
                this.editForm.levelType = "L"+(leve+1);//字母数字组合
            }else if(this.currOpType=='add'){
                this.editForm.pdeptid='A0'
                this.editForm.levelType="L1"
                this.editForm.branchId=this.userInfo.branchId 
                this.editForm.cpaType='0'
                this.editForm.state="1"
                this.editForm.deptType="2"
                this.editForm.displayDeptid=null
                this.editForm.cpaBranchId=this.editForm.branchId
                this.editForm.manager=this.userInfo.userid
                this.editForm.managerName=this.userInfo.username
            }
         },
        /**
         * 检查参数是否满足调用后台接口的条件
         * @returns true / false
         */
        preParamCheck(params){
             
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
        editSomeFieldsCheck(row,fieldName,$event,params){ 
            if(fieldName=='manager'){
                row.managerName=$event.username
                row.manager=$event.userid
                params.managerName=$event.username
                params.manager=$event.userid
            }else if(fieldName=='leader'){
                row.leaderName=$event.username
                row.leader=$event.userid
                params.leaderName=$event.username
                params.leader=$event.userid
            }else{
                params[fieldName]=$event
            }
           
            return true;
        }, 
    },
    mounted() {

    }
}

</script>

<style scoped>

</style>