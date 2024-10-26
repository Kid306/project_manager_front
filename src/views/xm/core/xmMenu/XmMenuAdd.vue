<template>
	 
			<!--新增界面 XmMenu 项目需求表-->
			<el-form :model="addForm"  label-width="125px" label-position="left" :rules="addFormRules" ref="addForm"> 
								<el-form-item prop="menuName">
									<template #label>
										<div  class="big-icon" :style="{backgroundColor: calcMenuLabel.color }"> 
											<icon :icon="calcMenuLabel.icon"/>
										</div>
										{{calcMenuLabel.label}}
									</template>
									<el-input v-model="addForm.menuName" placeholder="名称" title="名称"/>
									<el-row class="label-font-color"><span v-if="addForm.productName">归属产品：{{ addForm.productName}} &nbsp;&nbsp;|&nbsp;&nbsp;</span><span v-if="addForm.productId"> 产品编号：{{ addForm.productId }}&nbsp;&nbsp;|&nbsp;&nbsp;</span><span v-if="  addForm.iterationName ">迭代名称：{{addForm.iterationName}}&nbsp;&nbsp;|&nbsp;&nbsp;</span><span v-if="addForm.iterationId">迭代编号：{{addForm.iterationId}}</span></el-row>
								</el-form-item>
						<el-row class="padding-bottom padding-left">
								<el-col :span="8"> 
									<mdp-field show-style="x" size="medium"   v-model="addForm.pmenuId" :label="addForm.dclass==='3'?'归属特性':(addForm.dclass==='2'?'归属史诗':'归属')" :icon="addForm.dclass==='2'?'promotion':'flag'" :color="addForm.dclass==='2'?'rgb(255, 153, 51)':'rgb(0, 153, 51)'">
										<template #oper>
										<el-button 
											@click="$refs['parentDialog'].open()"
											title="选择上级"
											icon="upload2"> 选择上级</el-button>
										</template>
									</mdp-field>  
								</el-col>
								<el-col  :span="8"> 
                  <xm-user-select :xm-product="xmProductCpd" :sel-project="selProject" show-style="x" size="medium" label="负责人" v-model="addForm.mmUserid" :init-name="addForm.mmUsername"/>
 								</el-col>
								<el-col  :span="8">
                   <xm-user-select :xm-product="xmProductCpd" :sel-project="selProject" show-style="x" size="medium" label="提出人" v-model="addForm.proposerId" :init-name="addForm.proposerName"/>
 								</el-col>
						</el-row> 

						<el-tabs v-model="activateTabPaneName">
					<el-tab-pane label="基本信息" name="1">
						
						<el-row>

							<el-col :span="12" >
								<el-form-item label="前置故事" prop="phaseId" > 
									<el-tag @close="addForm.phaseId=''" closable><el-text truncated style="max-width:30em;">{{ addForm.phaseId||'无前置' }}</el-text></el-tag>
 									<el-button type="text" @click="$refs['preStoryDlg'].open()" title="设置前置故事" v-if="addForm.dclass=='3'"> 设置</el-button> 
								</el-form-item>
							</el-col>
							<el-col :span="12">
								<el-form-item label="归属模块" prop="funcName" v-if="addForm.dclass >= '3'">
									<el-tag @close="addForm.funcName='';addForm.funcId=''" closable><el-text truncated style="max-width:30em;">{{ addForm.funcName||'未设置' }}</el-text></el-tag>
									<el-button type="text" @click="$refs['funcDialog'].open()" title="设置模块"> 设置</el-button>
								</el-form-item>
							</el-col>  
							<el-col :span="12">
								<el-form-item label="需求类型" prop="dtype">
									<mdp-select width="100%" itemCode="demandType" v-model="addForm.dtype"
										@change="editSomeFields(addForm, 'dtype', $event)" />
								</el-form-item>
							</el-col>
							<el-col :span="12">
								<el-form-item label="需求来源" prop="source">
									<mdp-select width="100%" itemCode="demandSource" v-model="addForm.source"
										@change="editSomeFields(addForm, 'source', $event)" />
								</el-form-item>
							</el-col>
							<el-col :span="12">
								<el-form-item label="需求层次" prop="dlvl">
									<mdp-select width="100%" itemCode="demandLvl" v-model="addForm.dlvl"
										@change="editSomeFields(addForm, 'dlvl', $event)" />
								</el-form-item>
							</el-col>
							<el-col :span="12">
								<el-form-item label="优先级" prop="priority">
									<mdp-select width="100%" itemCode="priority" v-model="addForm.priority"
										@change="editSomeFields(addForm, 'priority', $event)" />
								</el-form-item>
							</el-col>
							<el-col :span="12">
								<el-form-item label="排序序号" prop="seqNo">
									<el-input style="max-width:99%;" v-model="addForm.seqNo" title="序号 如 1.1，1.2.3，1.3.2等"
										placeholder="如1.0 ， 1.1 ， 1.1.1等" @change="editSomeFields(addForm, 'seqNo', $event)" />

								</el-form-item>
							</el-col>
							<el-col :span="12">
								<el-form-item label="版本号" prop="sinceVersion">
									<el-input style="max-width:99%;" v-model="addForm.sinceVersion"
										@change="editSomeFields(addForm, 'sinceVersion', $event)" />
								</el-form-item>
							</el-col>
							</el-row>
						</el-tab-pane>
						<el-tab-pane name="2" label="需求详情">
							 <el-text type="warning">可以从需求文档复制文字、表格等进行黏贴、复制图片黏贴(1张一次)</el-text>
							<el-form-item prop="remark" label-width="0px"> 
							<vue-editor v-if="activateTabPaneName=='2'" :editorConfig="{minHeight:'450',scroll:true,placeholder:'作为     ，我需要    ，因为    。'}" :key="'remark_' + addForm?.menuId"
								:editorId="'remark_' + addForm?.menuId" :branch-id="userInfo.branchId"
								v-model="addForm.remark" />  
								</el-form-item>
						</el-tab-pane>
						</el-tabs>
						<el-row class="footer">
									<el-button @click="handleCancel">关闭</el-button>
									<el-button v-loading="load.add" type="primary" @click="addSubmit(1)" :disabled="load.add==true">提交(关闭窗口)</el-button>
									<el-button v-loading="load.add" type="primary" @click="addSubmit(2)" :disabled="load.add==true">提交(继续新增)</el-button>
								</el-row> 
			</el-form>
 

		<mdp-dialog ref="parentDialog" append-to-body width="60%" top="20px" title="上级">
			<template #default>
				<XmEpicFeatures subOpType="select" showConfirm :xm-product="xmProductCpd" @select="onParentMenuSelected" />
			</template> 
		</mdp-dialog>

		<mdp-dialog ref="funcDialog" append-to-body title="模块选择"  width="60%">
			<template #default>
				<xm-func-tree subOpType="mng"  showConfirm @select="onFuncSelected" :xm-product="{id:addForm.productId,productName:addForm.productName}" />
			</template>
		</mdp-dialog>
	
		<mdp-dialog ref="preStoryDlg"
			append-to-body
			title="选择前置故事" 
			width="85%"
			:close-on-click-modal="false"
		>
			<XmMenuBox subOpType="select" multiple showConfirm @select="onPreStorySelect" :xm-product="xmProductCpd?.id?xmProductCpd:{id:addForm.productId}"/>
		</mdp-dialog>
</template>

<script>
	import util from '@/components/mdp-ui/js/util';//全局公共库

	import { addXmMenu } from '@/api/xm/core/xmMenu';
	import { mapState } from 'pinia'
import { useUserStore } from '@/store/modules/user' 

	import { Editor as VueEditor } from '@/components/Editor'

	export default {
		computed: {
		    ...mapState(useUserStore,[
		      'userInfo','roles'
		    ]),

			xmProductCpd(){
				if(this.parentMenu && this.parentMenu.menuId){
					return {id:this.parentMenu.productId,productName:this.parentMenu.productName}
				}
				if( this.formData && this.formData.productId){
					return {id:this.formData.productId,productName:this.formData.productName}
				}
				return null;
			},
			calcMenuLabel(){
				;
				var params={label:'用户故事',icon:'ep:document',color:' rgb(79, 140, 255)'};
				if(this.addForm.dclass==='1'){
					params={label:'史诗',icon:'ep:promotion',color:'rgb(255, 153, 51)'};
				}else if(this.addForm.dclass==='2'){
					params={label:'特性',icon:'ep:flag',color:'rgb(0, 153, 51)'};
				}else if(this.addForm.dclass==='3'){
					params={label:'用户故事',icon:'ep:document',color:' rgb(79, 140, 255)'};
				}
				return params;
			},
		},
		props:['formData','visible','parentMenu','derive'],
		watch: {
	      'visible':function(visible) {
	      	if(visible==true){
				 this.initData();
	      	}
	      },
	    },
		data() {
			return {
				load:{ list: false, edit: false, del: false, add: false },//查询中...
				addFormRules: {
					menuId: [
						//{ required: true, message: '需求编号不能为空', trigger: 'blur' }
					],
					menuName: [
						{ required: true, message: '需求名称不能为空', trigger: 'change' },
						{ min: 2, max: 250, message: '长度在 2 到 250 个字符', trigger: 'change' },//长度
					],
					mmUserid: [
						{ required: true, message: '负责人不能为空', trigger: 'change' }
					],
					remark: [
						{ max: 5000, message: '长度在 0 到 5000 个字符,汉字最多2500个汉字', trigger: 'change' },//长度
					],
				},
				//新增界面数据 项目需求表
				addForm: {
					startTime:'',menuId:'',menuName:'',pmenuId:'',productId:'',remark:'',status:'0',online:'0',demandUrl:'',codeUrl:'',designUrl:'',docUrl:'',helpUrl:'',operDocUrl:'',seqNo:'',mmUserid:'',mmUsername:'',ctime:'',ntype:'0',sinceVersion:'',childrenCnt:'0',ltime:'',tagIds:'',tagNames:'',pidPaths:'',lvl:'0',isTpl:'0',phaseId:'',iterationId:'',source:'1',proposerId:'',proposerName:'',dlvl:'0',dtype:'0',priority:'0',dclass:'',iterationName:'',endTime:'',funcId:'',funcName:'',comments:'',ups:'0',reads:'0'
				},
				addFormInit: {
					startTime:'',menuId:'',menuName:'',pmenuId:'',productId:'',remark:'',status:'0',online:'0',demandUrl:'',codeUrl:'',designUrl:'',docUrl:'',helpUrl:'',operDocUrl:'',seqNo:'',mmUserid:'',mmUsername:'',ctime:'',ntype:'0',sinceVersion:'',childrenCnt:'0',ltime:'',tagIds:'',tagNames:'',pidPaths:'',lvl:'0',isTpl:'0',phaseId:'',iterationId:'',source:'1',proposerId:'',proposerName:'',dlvl:'0',dtype:'0',priority:'0',dclass:'',iterationName:'',endTime:'',funcId:'',funcName:'',comments:'',ups:'0',reads:'0'
				},
				/**begin 在下面加自定义属性,记得补上面的一个逗号**/
				activateTabPaneName:'1',
				/**end 在上面加自定义属性**/
			}//end return
		},//end data
		methods: {
			// 取消按钮点击 父组件监听@cancel="addFormVisible=false" 监听
			handleCancel:function(){
 				this.$emit('cancel');
			},
			//新增提交XmMenu 项目需求表 父组件监听@submit="afterAddSubmit"
			addSubmit: function (submitType) {
				if(this.addForm.productId==null){
					this.$notify({position:'bottom-left',showClose:true,message: '请选择产品/或者上级需求进行新增', type:'error' });
					return;
				}
				if(this.addForm.dclass==='3' && !this.addForm.pmenuId){
					this.$notify({position:'bottom-left',showClose:true,message: '请选择上级(归属史诗、特性)', type:'error' });
					return;
				}
				this.$refs.addForm.validate((valid) => {
					if (valid) {

						this.$confirm('确认提交吗？', '提示', {}).then(() => {
							this.load.add=true
							let params = Object.assign({}, this.addForm);
							if(this.parentMenu!=null){
								params.productId=this.parentMenu.productId
								params.pmenuId=this.parentMenu.menuId
							}
							if(params.productId==null|| params.productId==''){
								this.$notify({position:'bottom-left',showClose:true,message: '产品编号不能为空', type:'error' });
								return;
							}
							if(params.remark=='作为   ，我需要   ，以便我能够   。'){
								params.remark=""
							} 
							addXmMenu(params).then((res) => {
								this.load.add=false
								var tips=res.tips;
								if(tips.isOk){
 									this.$emit('submit',res.data);//  @submit="afterAddSubmit"
									 if(submitType==1){
										this.handleCancel()
									}else{
										if(this.addForm.seqNo){
											var seqNos=this.addForm.seqNo.split(".")
											seqNos[seqNos.length-1]=parseInt(seqNos[seqNos.length-1])+1
											this.addForm.seqNo=seqNos.join(".");
										}

									}
								}
								this.$notify({position:'bottom-left',showClose:true,message: tips.msg, type: tips.isOk?'success':'error' });
							}).catch( err  => this.load.add=false);
						});
					}else{
						this.$notify({position:'bottom-left',showClose:true,message:"表单检查不通过，请修改后提交", type: 'error' });
					}
				});
			},
			/**begin 在下面加自定义方法,记得补上面的一个逗号**/

			toFixed(floatValue){
				if(floatValue ==null || floatValue=='' || floatValue == undefined){
					return 0;
				}else{
					return parseFloat(floatValue).toFixed(2);
				}
			},
			/**end 在上面加自定义方法**/
			initData(){ 
				
				this.addForm={...this.addFormInit}
				Object.assign(this.addForm, this.formData);
				this.addForm.mmUserid=this.userInfo.userid
				this.addForm.mmUsername=this.userInfo.username
				this.addForm.remark=this.addForm.remark||"<ol><li></li><li></li></ol>"
				if(this.parentMenu && this.parentMenu.menuId){ 
					if(this.parentMenu.childrenCnt){
						this.addForm.seqNo=(this.parentMenu.seqNo||'')+"."+(this.parentMenu.childrenCnt+1)
					}else{
						this.addForm.seqNo=(this.parentMenu.seqNo||'')+"."+1
					}
					
					this.addForm.productId=this.parentMenu.productId
					this.addForm.pmenuId=this.parentMenu.menuId
					this.addForm.pmenuName=this.parentMenu.menuName
					this.addForm.menuName=this.parentMenu.menuName+'-请修改补充'
					if(!this.addForm.dclass){
						if(this.parentMenu.dclass=='3'){
							this.addForm.dclass='3'
						}else if(this.parentMenu.dclass=='2'){
							this.addForm.dclass='3'
						}else if(this.parentMenu.dclass=='1'){
							this.addForm.dclass='2'
						}else if(this.parentMenu.dclass=='0'){
							this.addForm.dclass='1'
						}
					}

					if(this.addForm.dclass<3){
						this.addForm.calcType="3"
					}else{
						this.addForm.calcType="1"
					}

				}else{
					if(!this.derive){ 
						this.addForm.seqNo=''
					}
				}
				this.addForm.status='0'
			},
			onParentMenuSelected(pmenu){
				this.addForm.pmenuId=pmenu.menuId
				this.addForm.pmenuName=pmenu.menuName 
				this.$refs['parentDialog'].close()
			},

			onFuncSelected(row){
				this.addForm.funcId=row.id
				this.addForm.funcName=row.name
				this.$refs['funcDialog'].close()
			},
			
		
			onPreStorySelect(storys){
				if(storys && storys.length>3){
					this.$message.error('最多选3个故事')
					return;
				}
				this.addForm.phaseId=storys.map(k=>k.menuId).join(",") 
				this.$refs['preStoryDlg'].close()
			},
		},//end method
		components: { 
 			VueEditor
		},
		mounted() {



			this.initData()

			/**在下面写其它函数***/

		}//end mounted
	}

</script>

<style scoped />
