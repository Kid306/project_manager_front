<template>
	  
		<!--编辑界面 XmGroup xm_group-->
			<el-form :model="editForm"  label-width="120px" :rules="editFormRules" ref="editFormRef">
				<el-form-item label="小组名称" prop="groupName">
					<el-input v-model="editForm.groupName" placeholder="团队名称">
						<template v-if="currOpType=='edit'" #append>{{editForm.lvl}}级</template>
					</el-input>
				</el-form-item> 
				<el-form-item label="组长" prop="leaderUsername">
					<xm-user-select :xm-product="{id:editForm.productId}" :sel-project="{id:editForm.projectId}" width="100%" v-model="editForm.leaderUserid" :init-name="editForm.leaderUsername" @change2="(u)=>editForm.leaderUsername=u.username"/> 
					<el-text type="info">组长人员必须由项目经理/副经理先拉进项目组</el-text>
				</el-form-item>
				<el-form-item label="副组长" prop="assUsername">
					<xm-user-select :xm-product="{id:editForm.productId}" :sel-project="{id:editForm.projectId}" width="100%" v-model="editForm.assUserid" :init-name="editForm.assUsername" @change2="(u)=>editForm.assUsername=u.username"/>
					<el-text type="info">副组长人员必须先由项目经理/副经理拉进项目组</el-text>
				</el-form-item> 
				<el-form-item label="归属项目" prop="projectId">
					<XmProjectSelect width="100%" v-model="editForm.projectId" displayLoad disabled/>
 					<el-text type="info">小组必须指定归属项目，创立小组后不允许变更项目</el-text>
				</el-form-item> 
				<el-form-item label="归属产品" prop="productId">
					<XmProductSelect width="100%" v-model="editForm.productId" :link-project-id="editForm.projectId"/>
 					<el-text type="info">关联上产品，产品经理可以将小组成员指派为需求负责人</el-text>
				</el-form-item> 
				<el-form-item label="启用状态" prop="pgClass"> 
						<el-checkbox v-model="editForm.pgClass" true-label="1" false-label="0">是否启用</el-checkbox>
 				</el-form-item>
				<el-form-item label="企业协作" prop="isCrow"> 
						<el-checkbox v-model="editForm.isCrow" true-label="1" false-label="0">是否属于协作公司</el-checkbox>
 				</el-form-item>
				
				 <el-form-item label="协作公司" prop="crowBranchId" v-if="editForm.isCrow=='1'">
						<mdp-select-branch width="100%" v-model="editForm.crowBranchId" :init-name="editForm.crowBranchName"  @change2="branchRowClick" />

 						<el-text type="info" size="mini">如果该团队属于某协作公司，请选择协作公司。</el-text>
					</el-form-item>
			</el-form> 

		<div   class="footer">
		    <el-button @click="handleCancel">取消</el-button>
            <el-button v-loading="load.edit" type="primary" @click="saveSubmit" :disabled="load.edit==true">提交</el-button>
		</div>
 
	
</template>

<script>
	import util from '@/components/mdp-ui/js/util';//全局公共库
	import config from "@/api/mdp_pub/mdp_config"; //全局公共库import

	import { addXmGroup,editXmGroup } from '@/api/xm/core/xmGroup';
	import { mapState } from 'pinia'
import { useUserStore } from '@/store/modules/user'  

 //新增界面 


import { MdpFormMixin } from '@/components/mdp-ui/mixin/MdpFormMixin';
	export default {
		mixins:[MdpFormMixin],
	    name:'formDataEdit', 
		computed: {
		    ...mapState(useUserStore,[ 'userInfo'  ]),

		},
		props:['formData','visible','subOpType'],

		watch: { 
	    },
		data() {
			return {
			    currOpType:'add',//add/edit
 				editFormRules: {
					projectId: [
						{ required: true, message: '此项必填', trigger: 'change' }
					],
					
					groupName: [
						{ required: true, message: '此项必填', trigger: 'change' }
					]
				},
				editForm: {
					id:'',groupName:'',projectId:'',pgTypeId:'',pgTypeName:'',leaderUserid:'',leaderUsername:'',ctime:'',ltime:'',productId:'',branchId:'',pgClass:'',pgroupId:'',lvl:'',pidPaths:'',isTpl:'',assUserid:'',assUsername:'',childrenCnt:'',userCnt:'',qxCode:'',calcWorkload:'',ntype:'',crowBranchId:'',crowBranchName:'',isCrow:''
				},  
				apis:{
					add: addXmGroup,
					edit: editXmGroup,
				}
			}//end return
		},//end data
		methods: {  
			initCurrData: function(){
			    this.currOpType=this.subOpType
			    if(this.formData){
                    this.editForm = Object.assign({},this.formData);
                }

                if(this.subOpType=='edit'){

                }else{
					if(!this.editForm.leaderUserid){
						this.editForm.leaderUserid=this.userInfo.userid
						this.editForm.leaderUsername=this.userInfo.username
					}
					if(!this.editForm.assUserid){
						this.editForm.assUserid=this.userInfo.userid
						this.editForm.assUsername=this.userInfo.username
					}
                }
            }, 
			branchRowClick: function(row){ 
				this.editForm.crowBranchId=row.id
				this.editForm.crowBranchName=row.branchName
			},

		},//end method
		mounted() { 
        this.initData() 
		}
	}

</script>

<style scoped>

</style>
