<template>
	 
		<!--编辑界面 XmWorkload 工时登记表-->
			<el-form :model="editForm" label-width="100px"  :rules="editFormRules" ref="editFormRef">
				<el-row v-if="(bizType=='1' && editForm.ntype==='0')||(bizType!='1' && bizType!='5')">
					<el-col :span="8" v-if="false">
						<el-form-item label="原估工时" prop="initWorkload" title="指一个人(按2-4年工作经验标准算)完成当前任务需要的工作时长。只允许填写一次。">
							 <el-input  :controls="false" type="number" :step="8" style="width:80%;"  v-model="editForm.initWorkload" placeholder="原估工时" @change="editSomeFields(editForm,'initWorkload',$event)" :disabled="initVal?.initWorkload>0"/> &nbsp;小时
						</el-form-item>
					</el-col>
					<el-col :span="8">
						<el-form-item label="预估工时" prop="budgetWorkload" title="指一个人(按2-4年工作经验标准算)完成当前任务需要的工作时长。在任务执行过程中，随时根据预估工作量进行填写。">
							 <el-input  :controls="false" type="number" :step="8" style="width:80%;"  v-model="editForm.budgetWorkload" placeholder="预估工时" @change="editSomeFields(editForm,'budgetWorkload',$event)"/> &nbsp;小时
						</el-form-item>
					</el-col>
					<el-col :span="8">
						<el-form-item label="已登工时" prop="actWorkload">
							{{editForm.actWorkload?editForm.actWorkload:0}} &nbsp; 小时<el-tag type="primary">{{editForm.rate}}%</el-tag>
 						</el-form-item>
					</el-col>
				</el-row>
				<el-row v-else>
					<el-col :span="8">
							<el-form-item label="原估工时" prop="initWorkload" v-if="false">
								{{editForm.initWorkload}} &nbsp;小时
 							</el-form-item>
					</el-col>
					<el-col :span="8">
						<el-form-item label="预估工时" prop="budgetWorkload">
							 {{editForm.budgetWorkload}} &nbsp;小时
						</el-form-item>
					</el-col>
					<el-col :span="8">
						<el-form-item label="已登工时" prop="actWorkload">
							{{editForm.actWorkload?editForm.actWorkload:0}} &nbsp; 小时,<el-tag type="primary">{{editForm.rate}}%</el-tag>
 						</el-form-item>
					</el-col>
				</el-row>
			</el-form> 
			<XmWorkloadMng v-if="parentOpType!='add' && ((bizType=='1'&& editForm.ntype=='0')||(bizType=='5' && editForm.dclass=='3')||bizType=='2'||bizType=='3'||bizType=='4')" :visible="visible" :biz-type="bizType" :xm-task="xmTask" :xm-menu="xmMenu" :xm-test-case="xmTestCase" :xm-test-plan-case="xmTestPlanCase" :xm-question="xmQuestion"  @add-submit="onWorkloadSubmit" />
 	
</template>

<script>
	import util from '@/components/mdp-ui/js/util';//全局公共库
	import config from "@/api/mdp_pub/mdp_config"; //全局公共库import

	import { getTaskDetail, editXmTaskSomeFields } from '@/api/xm/core/xmTask';

	import { editSomeFieldsXmTestCase } from '@/api/xm/core/xmTestCase';
	import { editSomeFieldsXmTestPlanCase } from '@/api/xm/core/xmTestPlanCase';
	import { editXmQuestionSomeFields } from '@/api/xm/core/xmQuestion';
	import { mapState } from 'pinia'
import { useUserStore } from '@/store/modules/user'
	import XmWorkloadMng from './XmWorkloadMng.vue';

	export default {
	    name:'xmWorkloadEdit',
	    components: {
				XmWorkloadMng,
        },
		computed: {
		    ...mapState(useUserStore,[ 'userInfo'  ]),
			initVal(){

				var params={}
				if( this.bizType=='1'){
					params.id=this.xmTask.id
					params.initWorkload=this.xmTask.initWorkload
					params.budgetWorkload=this.xmTask.budgetWorkload
					params.actWorkload=this.xmTask.actWorkload
					params.ntype=this.xmTask.ntype
				}
				if(  this.bizType=='5' ){
					params.menuId=this.xmMenu.menuId
					params.initWorkload=this.xmMenu.initWorkload
					params.budgetWorkload=this.xmMenu.budgetWorkload
					params.actWorkload=this.xmMenu.actWorkload
					params.ntype=this.xmMenu.ntype
					params.dclass=this.xmMenu.dclass
				}
				if( this.bizType=='2'){
					params.id=this.xmQuestion.id
					params.initWorkload=this.xmQuestion.initWorkload
					params.budgetWorkload=this.xmQuestion.budgetWorkload
					params.actWorkload=this.xmQuestion.actWorkload
				}
				if( this.bizType=='3'){
					params.id=this.xmTestCase.id
					params.initWorkload=this.xmTestCase.initWorkload
					params.budgetWorkload=this.xmTestCase.budgetWorkload
					params.actWorkload=this.xmTestCase.actWorkload
				}
				if( this.bizType=='4'){
					params.planId=this.xmTestPlanCase.planId
					params.caseId=this.xmTestPlanCase.caseId
					params.initWorkload=this.xmTestPlanCase.initWorkload
					params.budgetWorkload=this.xmTestPlanCase.budgetWorkload
					params.actWorkload=this.xmTestPlanCase.actWorkload
				}
				if(params.budgetWorkload!==null && params.budgetWorkload!=='' && params.budgetWorkload>0){
					params.rate= parseInt((params.actWorkload>0?params.actWorkload:0) / params.budgetWorkload * 100)
				}else{
					params.rate= 0
				}
				return params
			}

		},
		props:['xmTask','visible','bizType'/*报工类型1-任务，2-缺陷，3-测试用例设计，4-测试执行 */,'parentOpType'/** 父组件操作add,edit*/,
		'xmMenu','xmTestCase','xmQuestion','xmTestPlanCase'],

		watch: { 
			initVal:{
				handler(){
					this.initData();
				},
				deep:true,
			}
	    },
		data() {
			return {
 				load:{ list: false, edit: false, del: false, add: false },//查询中...
				dicts:{},//下拉选择框的所有静态数据 params={categoryId:'all',itemCodes:['sex']} 返回结果 {sex: [{id:'1',name:'男'},{id:'2',name:'女'}]}
				editFormRules: {
					id: [
						//{ required: true, message: '主键不能为空', trigger: 'blur' }
					]
				},//新增界面数据 xm_task
				editForm: {

					id:'',name:'',parentTaskid:'',parentTaskname:'',projectId:'',projectName:'',level:'3',sortLevel:'0',executorUserid:'',executorUsername:'',
					preTaskid:'',preTaskname:'',startTime:'',endTime:'',milestone:'',description:'',remarks:'',createUserid:'',createUsername:'',createTime:'',taskOut:'0',
					rate:0,budgetCost:'',budgetWorkload:'',actCost:'',actWorkload:'',taskState:'0',taskClass:'0',toTaskCenter:'0',actStartTime:'',actEndTime:'',taskType:'4',planType:'w2',settleSchemel:'1',ntype:'0',childrenCnt:0
					,rworkload:null,dclass:'',
				},
                maxTableHeight:300,
			}//end return
		},//end data
		methods: {
			// 取消按钮点击 父组件监听@cancel="editFormVisible=false" 监听
			handleCancel:function(){
				this.$emit('cancel');
			},
			//新增、编辑提交XmWorkload 工时登记表父组件监听@submit="afterEditSubmit"
			saveSubmit: function () {
			},
			initData: function(){

				this.editForm=Object.assign({},this.initVal)
				this.editFormBak=Object.assign({},this.editForm)
            },



			editSomeFields(row,fieldName,$event){
				var emit="edit-fields"
				var params={$pks:[row.id]};
				if(this.parentOpType=='add'){
					params[fieldName]=$event
					this.$emit(emit,params);
					return;
				}
				var func=null;
				
				if(this.bizType==='1'){
					func=editXmTaskSomeFields

				}else if(this.bizType==='2'){
					func=editXmQuestionSomeFields
				}else if(this.bizType==='3'){
					func=editSomeFieldsXmTestCase
				}else if(this.bizType==='4'){
					func=editSomeFieldsXmTestPlanCase
					params={$pks:[{planId:row.planId,caseId:row.caseId}]};
				}else if(this.bizType==='5'){
					this.editForm=Object.assign(this.editForm,this.editFormBak)
					this.$notify({position:'bottom-left',showClose:true,message:"需求数据不允许手工修改",type:'error'})
					return
				}
				params[fieldName]=$event
				if(fieldName==='budgetWorkload'){
					var total=row.budgetWorkload;
					if(row.actWorkload>0 && row.rworkload>0){
						total=Math.round(row.actWorkload,2)+Math.round(row.rworkload,2)
					}
					var rate=Math.round(Math.round(row.actWorkload,2)/total*100)
					if(rate>100){
						rate=100;
					}
					params.rate=rate
					row.rate=rate
					
					if(!this.initVal.initWorkload||this.initVal.initWorkload<=0){
						params.initWorkload=params.budgetWokload
					}
				} 
				func(params).then(res=>{
					var tips = res.tips;
					if(tips.isOk){
						this.$emit(emit,params);
						this.$message.success("更新成功")
					}else{
						this.editForm=Object.assign(this.editForm,this.editFormBak)
						this.$notify({position:'bottom-left',showClose:true,message:tips.msg,type:tips.isOk?'success':'error'})
					}
				})
			},
			onWorkloadSubmit(){
				
				if(this.bizType=='1'){
					getTaskDetail({id:this.xmTask.id}).then(res=>{
						var tips = res.tips 
						if(tips.isOk){
							if(res.data){
								//Object.assign(this.xmTask,res.data[0])
								let xmTask=res.data
								Object.assign(this.editForm,xmTask)
								Object.assign(this.editFormBak,xmTask)
								this.$emit('edit-fields',this.editForm)
							}
						}
					})
				}
			}
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
