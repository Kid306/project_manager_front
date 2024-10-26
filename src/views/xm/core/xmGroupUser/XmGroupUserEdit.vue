<template>
	 
 		<!--编辑界面 XmGroupUser xm_group_user-->
			<el-form :model="editForm"  label-width="120px" :rules="editFormRules" ref="editFormRef">
				<el-form-item label="归属产品" prop="productId" v-if="false"> 
					<XmProductSelect  width="100%" v-model="editForm.productId" displayLoad :disabled="currOpType!='add'"/>
				</el-form-item>
				<el-form-item label="归属项目" prop="projectId"> 
					<XmProjectSelect width="100%" v-model="editForm.projectId" displayLoad :disabled="currOpType!='add'"/>
				</el-form-item>
				<el-form-item label="小组名称" prop="groupName"> 
					<el-text type="primary">{{editForm.groupName}}</el-text>
				</el-form-item>
				<el-form-item label="组员姓名" prop="username">
					<el-input v-model="editForm.username" placeholder="组员姓名"/>
				</el-form-item>
				<el-form-item label="" prop="status">
					<el-checkbox v-model="editForm.status" true-label="1" false-label="0" placeholder="当前状态">是否已加入</el-checkbox>
					<el-checkbox v-model="editForm.isPri" true-label="1" false-label="0" placeholder="是否私人加入">是否私人加入</el-checkbox>
				</el-form-item>
				<el-form-item label="排序号" prop="seqNo">
					<el-input-number v-model="editForm.seqNo" :min="0" :max="200" />
				</el-form-item>
				<el-form-item label="原归属机构名称" prop="obranchName"> 
					<MdpSelectBranch width="100%" v-model="editForm.obranchId" :init-name="editForm.obranchName" @change2="(v)=>editForm.obranchName=v.name"/>
				</el-form-item>
				<el-form-item label="加入时间" prop="joinTime">
					<el-date-picker type="date" placeholder="选择日期" v-model="editForm.joinTime"  value-format="YYYY-MM-DD HH:mm:ss" format="YYYY-MM-DD" />
				</el-form-item>
				<el-form-item label="离组时间" prop="outTime">
					<el-date-picker type="date" placeholder="选择日期" v-model="editForm.outTime"  value-format="YYYY-MM-DD HH:mm:ss" format="YYYY-MM-DD" />
				</el-form-item>
			</el-form> 

		<el-row class="footer">
		    <el-button @click="handleCancel">取消</el-button>
            <el-button v-loading="load.edit" type="primary" @click="saveSubmit" :disabled="load.edit==true">提交</el-button>
		</el-row>
	
</template>

<script>
	import util from '@/components/mdp-ui/js/util';//全局公共库
	import config from "@/api/mdp_pub/mdp_config"; //全局公共库import

	import { addXmGroupUser,editXmGroupUser } from '@/api/xm/core/xmGroupUser';
	import { mapState } from 'pinia'
import { useUserStore } from '@/store/modules/user'



 //新增界面 
import { MdpFormMixin } from '@/components/mdp-ui/mixin/MdpFormMixin';
	export default {
		mixins:[MdpFormMixin],
	    name:'xmGroupUserEdit', 
		computed: {
		    ...mapState(useUserStore,[ 'userInfo'  ]),

		},
		props:['xmGroupUser','visible','subOpType'],

		watch: {
	      'xmGroupUser':function( xmGroupUser ) {
	        if(xmGroupUser){
	            this.editForm = xmGroupUser;
	        }

	      },
	      'visible':function(visible) {
	      	if(visible==true){
 	      		this.initData()
	      	}
	      }
	    },
		data() {
			return {
			    currOpType:'add',//add/edit
 				load:{ list: false, edit: false, del: false, add: false },//查询中...
				dicts:{},//下拉选择框的所有静态数据 params={categoryId:'all',itemCodes:['sex']} 返回结果 {sex: [{id:'1',name:'男'},{id:'2',name:'女'}]}
				editFormRules: {
					groupId: [
						//{ required: true, message: '小组编号不能为空', trigger: 'blur' }
					]
				},
				editForm: {
					joinTime:'',groupId:'',userid:'',username:'',outTime:'',status:'',obranchId:'',isPri:'',seqNo:'',projectId:'',productId:'',pgClass:'',obranchName:''
				},

			}//end return
		},//end data
		methods: {
			// 取消按钮点击 父组件监听@cancel="editFormVisible=false" 监听
			handleCancel:function(){
				this.$refs['editFormRef'].resetFields();
				this.$emit('cancel');
			},
			//新增、编辑提交XmGroupUser xm_group_user父组件监听@submit="afterEditSubmit"
			saveSubmit: function () {
				this.$refs.editFormRef.validate((valid) => {
					if (valid) {
						this.$confirm('确认提交吗？', '提示', {}).then(() => {
							this.load.edit=true
							let params = Object.assign({}, this.editForm);
							var func=addXmGroupUser
							if(this.currOpType=='edit'){
							    func=editXmGroupUser
							}
							func(params).then((res) => {
                                this.load.edit=false
                                var tips=res.tips;
                                if(tips.isOk){
                                    this.editForm=res.data
                                    this.initData()
                                    this.currOpType="edit";
                                    this.$emit('submit');//  @submit="afterAddSubmit"
                                }
                                this.$notify({position:'bottom-left',showClose:true, message: tips.msg, type: tips.isOk?'success':'error' });
                            }).catch( err =>this.load.edit=false);
						});
					}else{
					    this.$notify({position:'bottom-left',showClose:true, message: "表单验证不通过，请修改表单数据再提交", type: 'error' });
					}
				});
			},
			initData: function(){
			    this.currOpType=this.subOpType
			    if(this.xmGroupUser){
                    this.editForm = Object.assign({},this.xmGroupUser);
                }

                if(this.subOpType=='edit'){

                }else{

                }
            },

		},//end method
		mounted() {
		    this.$nextTick(() => {

                this.initData()
            });
		}
	}

</script>

<style scoped>

</style>
