<template>
	 
			<!--新增界面 XmIteration 迭代定义-->
			<el-form :model="editForm"  label-width="120px" :rules="editFormRules" ref="editForm" label-position="left">

				<el-form-item label="迭代名称" prop="iterationName">
					<el-input v-model="editForm.iterationName" placeholder="迭代名称 选择起止日期+产品后会自动生成名字"  @change="editSomeFields(editForm,'iterationName',$event)"/>
						<el-row class="label-font-color" v-if="currOpType!=='add'"> <span >迭代编号：{{editForm.id}}  </span><el-divider direction="vertical" />归属产品：{{editForm.productName?editForm.productName:editForm.productId}}
					</el-row>
					<el-text v-if="currOpType=='add'" type="primary">选择起止日期、产品后自动生成迭代名称，格式：  SP{序号} {开始日}~{结束日} {产品名称}</el-text>
				</el-form-item>
				<el-form-item label="归属产品" prop="productId" v-if="currOpType==='add'">
					<xm-product-select width="100%" show-style="tag" v-if=" (!xmProduct||!xmProduct.id)" ref="xmProductSelect" v-model="editForm.productId" :link-project-id="selProject?selProject.id:null"   @select="onProductRowClick" @clear="onProductClearSelect" />
					{{ xmProduct && xmProduct.id?xmProduct.productName||xmProduct.id:''}}
				</el-form-item>
				
				<el-form-item label="时间安排" />
				<el-row>
					<el-col :span="12">
						<el-form-item prop="onlineTime" label-width="0px">
							<mdp-date show-style="x" size="medium" label="上线时间"  type="date" placeholder="选择日期" v-model="editForm.onlineTime" value-format="YYYY-MM-DD HH:mm:ss" format="YYYY-MM-DD" @change="editSomeFields(editForm,'onlineTime',$event)" />
						</el-form-item>
					</el-col>
					<el-col :span="12">

						<el-form-item prop="startTime"  label-width="0px">
							<mdp-date-range show-style="x" label="起止时间"  start-key="startTime" end-key="endTime" v-model="editForm" placeholder="选择日期"   value-format="YYYY-MM-DD HH:mm:ss" format="YYYY-MM-DD" @change="editSomeFields(editForm,'startTime',$event)" />
						</el-form-item>
					</el-col>
				</el-row>
				
				<el-form-item label="管理人员" />
				<el-row>
					<el-col :span="12">
						<el-form-item prop="adminUserid" label-width="0px">
              <xm-user-select :xm-product="{id:editForm.productId}" :sel-project="{id:editForm.projectId}" show-style="x" size="medium" label="负责人姓名" v-model="editForm.adminUserid" :init-name="editForm.adminUsername" @change2="editSomeFields(editForm,'adminUserid',$event)"/>
 						</el-form-item>
					</el-col>
					<el-col :span="12">
						<el-form-item  prop="istatus" label-width="0px">
							<mdp-select  show-style="x" size="medium" label="状态" itemCode="iterationStatus" v-model="editForm.istatus" @change="editSomeFields(editForm,'istatus',$event)"/>

						</el-form-item>
					</el-col>
				</el-row>
			</el-form>
			<el-row v-if="currOpType=='add'" style="float:right;">
				<el-button type="primary" @click="addSubmit">保存</el-button>
			</el-row> 
	
</template>

<script>
	import util from '@/components/mdp-ui/js/util';//全局公共库
	import { addXmIteration,editSomeFieldsXmIteration } from '@/api/xm/core/xmIteration';
	import { mapState } from 'pinia'
import { useUserStore } from '@/store/modules/user'

import { useXmStore,useXmStore2 } from '@/store/modules/xm'



	export default {
		computed: {
		    ...mapState(useUserStore,[
		      'userInfo','roles'
		    ]), 
		},
		props:['xmIteration','visible','subOpType','xmProduct','selProject'],
		watch: {
			'xmIteration':{
				handler(){
					 this.initData();
				},
				deep:true,
			},
	      'visible':function(visible) {
	      	if(visible==true){
				this.initData();
	      	}
	      },
		  'editForm.startTime':function(val){
			  this.calcName()
		  },
		  'editForm.productName':function(val){
				this.calcName()
		  }
	    },
		data() {
			return {
				currOpType:'add',
				dicts:{iterationStatus:[]},//下拉选择框的所有静态数据  params=[{categoryId:'0001',itemCode:'sex'}] 返回结果 {'sex':[{optionValue:'1',optionName:'男',seqOrder:'1',fp:'',isDefault:'0'},{optionValue:'2',optionName:'女',seqOrder:'2',fp:'',isDefault:'0'}]}
				load:{ list: false, add: false, del: false, edit: false },//查询中...
				editFormRules: {
					iterationName: [
						{ required: true, message: '迭代名称不能为空', trigger: 'change' },
						{ min:10,max:250, message: '名称长度在10-250个字符', trigger: 'change' }
					],
					startTime: [
						{ required: true, message: '开始时间不能为空', trigger: 'change' },
					],
					endTime: [
						{ required: true, message: '结束时间不能为空', trigger: 'change' },
					],
					onlineTime: [
						{ required: true, message: '上线时间不能为空', trigger: 'change' },
					],
					productId: [ 
					{ required: true, message: '产品不能为空', trigger: 'change' },
					]
				},
				//新增界面数据 迭代定义,
				editForm: {
					id:'',branchId:'',iterationName:'',startTime:'',endTime:'',onlineTime:'',pid:'',adminUserid:'',adminUsername:'',ctime:'',budgetCost:'',budgetWorkload:'',seqNo:'',istatus:'',cuserid:'',cusername:'',remark:'',iphase:'',isTpl:'',productId:'',productName:''
				},
				editFormBak: {
					id:'',branchId:'',iterationName:'',startTime:'',endTime:'',onlineTime:'',pid:'',adminUserid:'',adminUsername:'',ctime:'',budgetCost:'',budgetWorkload:'',seqNo:'',istatus:'',cuserid:'',cusername:'',remark:'',iphase:'',isTpl:'',productId:'',productName:''
				},
				/**begin 在下面加自定义属性,记得补上面的一个逗号**/
				userSelectVisible:false,
				/**end 在上面加自定义属性**/
			}//end return
		},//end data
		methods: {
			calcName(){
				if(this.currOpType!=='add'){
					return;
			  }
				
				if(!this.editForm.startTime){
					return;
			  }
				let start=this.$mdp.initMoment(this.editForm.startTime).format('YYYYMMDD')
				let end=this.$mdp.initMoment(this.editForm.endTime).format('YYYYMMDD')
			  this.editForm.iterationName='SP1 '+start+'~'+end+' '+(this.editForm.productName||this.editForm.productId)+'-请修改'
			},
			// 取消按钮点击 父组件监听@cancel="editFormVisible=false" 监听
			handleCancel:function(){
				this.$refs['editForm'].resetFields();
				this.$emit('cancel');
			},
			/**begin 在下面加自定义方法,记得补上面的一个逗号**/

			onUserSelected: function(users) {
				if(users.length>1){
					this.$notify.error("只能选一个人");
					return;
				}
				var user=users[0]
				this.editSomeFields(this.editForm,'adminUserid',user)
				this.userSelectVisible = false;
			},

           editSomeFields(row,fieldName,$event){
				if(this.currOpType==='add'){
					return;
				} 

						let params={};
						params['ids']=[row].map(i=>i.id)
						if(fieldName=='adminUserid'){
							params['adminUserid']=$event.userid
							params['adminUsername']=$event.username
						}else if(fieldName=='startTime'){
							params['startTime']=row.startTime
							params['endTime']=row.endTime
						}else{
							params[fieldName]=$event
						}

						var func = editSomeFieldsXmIteration
						func(params).then(res=>{
						let tips = res.tips; 
						if(tips.isOk){
							this.editFormBak=Object.assign(this.editFormBak,this.editForm)
							Object.assign(this.editForm,params)
							this.$emit('edit-fields',params)
						}else{
							Object.assign(this.editForm,this.editFormBak)
							this.$notify({position:'bottom-left',showClose:true,message:tips.msg,type:tips.isOk?'success':'error'})
						}
						}).catch((e)=>{ 
							Object.assign(this.editForm,this.editFormBak)
						}
							)
  

            },
			initData(){
				this.currOpType=this.subOpType
				this.editForm=Object.assign(this.editForm, this.xmIteration);
				if(this.currOpType==='add'){
					this.editForm.cuserid=this.userInfo.userid
					this.editForm.cusername=this.userInfo.username
					this.editForm.adminUserid=this.userInfo.userid
					this.editForm.adminUsername=this.userInfo.username;
					if(this.xmProduct && this.xmProduct.id){
						this.editForm.productId=this.xmProduct.id
						this.editForm.productName=this.xmProduct.productName;
					}
					this.editForm.istatus='0'
					this.editForm.onlineTime=this.$mdp.moment().endOf('week').format('YYYY-MM-DD HH:mm:ss')
					this.editForm.startTime=this.$mdp.moment().startOf('week').format('YYYY-MM-DD HH:mm:ss')
					this.editForm.endTime=this.$mdp.moment().endOf('week').format('YYYY-MM-DD HH:mm:ss')
					this.calcName()
				}
				this.editFormBak={...this.editForm}
			},
			onProductRowClick(product){
				this.editForm.productId=product.id
				this.editForm.productName=product.productName 
			},
			onProductClearSelect(){
				this.editForm.productId=''
				this.editForm.productName=''
			},
						//新增提交XmIteration 迭代定义 父组件监听@submit="afterAddSubmit"
			addSubmit: function () {
				this.$refs.editForm.validate((valid) => {
					if (valid) {
						var params={...this.editForm}
						this.$confirm('确认提交迭代吗？', '提示', {}).then(() => {
							this.load.add=true
							addXmIteration(params).then((res) => {
								this.load.add=false
								var tips=res.tips;
								if(tips.isOk){
									this.$emit('submit',res.data);//  @submit="afterAddSubmit"
								}
								this.$notify({position:'bottom-left',showClose:true,message: tips.msg, type: tips.isOk?'success':'error' });
							}).catch( err  => this.load.add=false);
						});
					}else{
						this.$notify({position:'bottom-left',showClose:true,message: "表单验证不通过", type: 'error' });
					}
				});
			},
			/**end 在上面加自定义方法**/

		},//end method
		components: {
			//在下面添加其它组件 'xm-iteration-edit':XmIterationEdit
			
		},
		mounted() { 
				this.initData() 

			/**在下面写其它函数***/

		}//end mounted
	}

</script>

<style scoped>

</style>
