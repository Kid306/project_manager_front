<template>
	
		<el-row>
			<el-col :xl="3" :lg="3" :md="3" :sm="3" :xs="5" class="padding-top padding-left"> 
 						<xm-iteration-select v-model="iterationId" v-if="projectInfo?.id||xmProduct?.id"  width="100%" ref="xmIterationSelect"   :link-project-id="projectInfo?.id" :xm-product="xmProduct"  @change3="onIterationRowClick" @clear="onIterationClearSelect" />
							<el-scrollbar v-adaptive>
  								<el-steps space="40" v-if="xmIteration&&xmIteration.id"
								:active="calcIterationStatusStep"
								finish-status="success"
								direction="vertical"
								>
								<el-step class="padding-top"
									v-for="(i, index) in dicts['iterationStatus']"
									:title="i.name"
									:key="index"
								>
									<template #description>
									<el-row v-if="i.id == '0'"
										><!--打开-->
										<span v-if="xmIteration.istatus == i.id">
										<el-button
											class="step-btn"
											type="warning"

											plain
											@click="showPanel = 'menus'"
											>需求管理</el-button
										>
										<el-button
											class="step-btn"
											type="warning"

											plain
											@click="showIterationMenu"
											>配置需求范围</el-button
										>

										<el-popconfirm @confirm="editSomeFields(xmIteration, 'istatus', '1')" title="将迭代状态改为评审中?">

											<template #reference><el-button class="step-btn" type="danger" icon="d-caret"  plain>开启需求评审  </el-button> </template>

										</el-popconfirm>
										</span>
										<span v-if="xmIteration.istatus != i.id">
										<el-button
											class="step-btn"
											type="warning"

											plain
											@click="showPanel = 'menus'"
											>需求管理</el-button
										>
										<el-button
											class="step-btn"
											type="warning"

											plain
											@click="showIterationMenu"
											>需求范围</el-button
										>
										</span>
									</el-row>
									<el-row v-else-if="i.id == '1'"
										><!--需求评审-->
										<span v-if="xmIteration.istatus == i.id">
										<el-button
											class="step-btn"
											type="warning"

											plain
											@click="showIterationMenu"
											>确认需求范围</el-button
										>
										<el-button
											class="step-btn"
											type="warning"

											plain
											@click="showPanel='bugs'"
											>缺陷登记</el-button
										>

										<el-popconfirm @confirm="editSomeFields(xmIteration, 'istatus', '2')" title="将迭代状态改为计划中?">

											<template #reference><el-button class="step-btn" type="danger" icon="d-caret"  plain>进入计划会  </el-button> </template>

										</el-popconfirm>
										</span>
										<span v-if="xmIteration.istatus != i.id"  ></span>
									</el-row>
									<el-row v-else-if="i.id == '2'"
										><!--计划会-->
										<span v-if="xmIteration.istatus == i.id">
										<el-button
											class="step-btn"
											type="warning"

											plain
											@click="showIterationDetail"
											>迭代计划</el-button
										>
										<el-button
											class="step-btn"
											type="warning"

											plain
											@click="showPanel = 'tasks'"
											>任务管理</el-button
										>

										<el-popconfirm @confirm="editSomeFields(xmIteration, 'istatus', '3')" title="将迭代状态改为研发中?">

											<template #reference><el-button class="step-btn" type="danger" icon="d-caret"  plain>设为研发中  </el-button> </template>

										</el-popconfirm>
										</span>
										<span v-if="xmIteration.istatus != i.id">
										<el-button
											class="step-btn"
											type="warning"

											plain
											@click="showIterationDetail"
											>迭代计划</el-button
										>
										<el-button
											class="step-btn"
											type="warning"

											plain
											@click="showPanel = 'tasks'"
											>任务管理</el-button
										>
										</span>
									</el-row>
									<el-row v-else-if="i.id == '3'"
										><!--研发中-->
										<span v-if="xmIteration.istatus == i.id">
										<el-button
											class="step-btn"
											type="warning"

											plain
											@click="showPanel = 'tasks'"
											>任务管理</el-button
										>
										<el-button
											class="step-btn"
											type="warning"

											plain
											@click="showPanel = '效能'"
											>效能分析</el-button
										>
										<el-popconfirm @confirm="editSomeFields(xmIteration, 'istatus', '4')" title="将迭代状态改为测试中?">

											<template #reference><el-button class="step-btn" type="danger" icon="d-caret"  plain>设为测试中  </el-button> </template>

										</el-popconfirm>
										</span>
										<span v-if="xmIteration.istatus != i.id">
										<el-button
											class="step-btn"
											type="warning"

											plain
											@click="showPanel = '效能'"
											>效能分析</el-button
										>
										</span>
									</el-row>
									<el-row v-else-if="i.id == '4'"
										><!--测试中-->
										<span v-if="xmIteration.istatus == i.id">
											<el-button
												class="step-btn"
												type="warning"

												plain
												@click="showPanel = 'bugs'"
												>缺陷管理</el-button
											>
											<el-popconfirm @confirm="editSomeFields(xmIteration, 'istatus', '5')" title="将迭代状态改为待上线?">

												<template #reference><el-button class="step-btn" type="danger" icon="d-caret"  plain>设为待上线  </el-button> </template>

											</el-popconfirm>
										</span>

										<span v-if="xmIteration.istatus != i.id">
											<el-button
												class="step-btn"
												type="warning"

												plain
												@click="showPanel = 'bugs'"
												>缺陷管理</el-button
											>
										</span>
									</el-row>
									<el-row v-else-if="i.id == '5'"
										><!--上线中-->
										<span v-if="xmIteration.istatus == i.id">
											<el-popconfirm @confirm="editSomeFields(xmIteration, 'istatus', '6')" title="将迭代状态改为已完成?">

												<template #reference><el-button class="step-btn" type="danger" icon="d-caret"  plain>设为已完成  </el-button> </template>

											</el-popconfirm>
										</span>
										<span v-if="xmIteration.istatus != i.id"  ></span>
									</el-row>
									<el-row v-else-if="i.id == '6'"
										><!--已完成-->
										<span v-if="xmIteration.istatus == i.id">
											<el-popconfirm @confirm="editSomeFields(xmIteration, 'istatus', '7')" title="将迭代状态改为已关闭?">

												<template #reference><el-button class="step-btn" type="danger" icon="d-caret"  plain>设为已关闭  </el-button> </template>

											</el-popconfirm>
										</span>
										<span v-if="xmIteration.istatus != i.id"  ></span>
									</el-row>
									<el-row v-else-if="i.id == '7'"
										><!--已关闭-->
										<span v-if="xmIteration.istatus == i.id">
										<el-popconfirm @confirm="editSomeFields(xmIteration, 'istatus', '0')" title="将迭代状态改为已打开?">

												<template #reference><el-button class="step-btn" type="danger" icon="d-caret"  plain>重新打开  </el-button> </template>

											</el-popconfirm>
										</span>
									</el-row>
									</template>
								</el-step>
								</el-steps>  
							</el-scrollbar>
 			</el-col>
			<el-col :xl="21" :lg="21" :md="21" :sm="21" :xs="19" class="padding-left padding-right">
				<el-tabs v-model="showPanel"  v-if="xmIteration && xmIteration.id">
					<el-tab-pane label="迭代概览"  name="iterationOverview" >

						<xm-iteration-overview v-show="xmIteration && showPanel=='iterationOverview'"  :xm-iteration="xmIteration" :sel-project="projectInfo" @edit-fields="onEditFields"/>

					</el-tab-pane>
					<el-tab-pane label="执行统计"  name="iterationCalc" >
						  <div v-if="showPanel=='iterationCalc'">
							<el-row>
							<el-button type="primary" @click="loadTasksToXmIterationState" v-loading="load.calcIteration">计算迭代统计数据</el-button>
							<br/>
								<font color="blue" style="font-size:10px;">将从项目任务中汇总进度、预算工作量、实际工作量、预算金额、实际金额、缺陷数、需求数等数据到迭代统计表;
								<br/>
								<strong>注意：</strong>该统计实时统计迭代涉及到的各方面数据，执行量较大，一般更改了任务进度数据、重新调整了需求范围，需要迭代的实时数据的情况下，再手动执行。

								</font>
							</el-row>
						</div>
					</el-tab-pane>

					<el-tab-pane label="迭代详情" name="detail">
						<xm-iteration-edit subOpType="edit" v-if="showPanel=='detail'" :xm-iteration="xmIteration" @edit-fields="onEditFields" :xm-product="xmProductCpd" />
					</el-tab-pane>
					<el-tab-pane label="需求列表" name="menus">
						<xm-menu-box v-if="xmIteration && showPanel=='menus'" :xm-product="xmProductCpd"  :xm-iteration="xmIteration" :sel-project="projectInfo" />
					</el-tab-pane>
					<el-tab-pane label="配置需求范围" name="iterationMenuMng">
      					<xm-iteration-menu-mng v-if="showPanel=='iterationMenuMng'" :xm-iteration="xmIteration" :xm-product="xmProductCpd" />
					</el-tab-pane>
					<el-tab-pane label="任务列表" name="tasks">
						<xm-task-box v-if="xmIteration && showPanel=='tasks'" :xm-product="xmProductCpd" :xm-iteration="xmIteration" :sel-project="projectInfo" />
					</el-tab-pane>
					<el-tab-pane label="缺陷列表" name="bugs">
						<xm-question-list v-if="xmIteration && showPanel=='bugs'" :xm-product="xmProductCpd" :xm-iteration="xmIteration" :sel-project="projectInfo" />
					</el-tab-pane>
					<el-tab-pane label="效能分析" name="效能">
						<xm-rpt v-if="xmIteration && showPanel=='效能'" :xm-project="projectInfo" :xm-iteration="xmIteration" :xm-product="xmProductCpd" category="迭代级" />
 					</el-tab-pane>
				</el-tabs>
				<el-row />

			</el-col>

		</el-row>

		<mdp-dialog  width="60%" top="20px" v-model="iterationAddVisible" append-to-body>
					<xm-iteration-add op-type="add"  :xm-product="xmProduct" :sel-project="projectInfo" :visible="iterationAddVisible" @cancel="iterationAddVisible=false" @submit="afterIterationAddSubmit" />
 		</mdp-dialog>
	
</template>

<script>
	import util from '@/components/mdp-ui/js/util';//全局公共库
	import config from '@/api/mdp_pub/mdp_config';//全局公共库

	import { delXmIterationLink } from '@/api/xm/core/xmIterationLink';
 
	import { mapState } from 'pinia'
import { useUserStore } from '@/store/modules/user'  
import { useXmStore,useXmStore2 } from '@/store/modules/xm'    
	import XmIterationOverview from './XmIterationOverview.vue';

	import XmIterationEdit from './XmIterationEdit.vue';
	import  XmIterationAdd from './XmIterationEdit.vue';//新增界面 

	import XmIterationMenuMng from '../xmIterationMenu/XmIterationMenuMng.vue';
	import { editSomeFieldsXmIteration } from '@/api/xm/core/xmIteration';
	import {  loadTasksToXmIterationState } from '@/api/xm/core/xmIterationState'; 
import {  listXmIterationWithState } from "@/api/xm/core/xmIteration";
	export default {
		computed: {
		    ...mapState(useUserStore,[
		      'userInfo','roles'
			]),
		    ...mapState(useXmStore,[
		      'projectInfo','xmProduct'
			]),

			calcIterationStatusStep() {
			if (this.dicts["iterationStatus"] && this.xmIteration) {
				var index = this.dicts["iterationStatus"].findIndex((i) => {
				if (i.id == this.xmIteration.istatus) {
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
			xmProductCpd(){
				if(this.xmProduct && this.xmProduct.id){
					return this.xmProduct
				}
				if(this.xmIteration && this.xmIteration.id && this.xmIteration.productId){
					return {id:this.xmIteration.productId,productName:this.xmIteration.productName}
				}
				return null
			},
			iterationKey(){
				return this.xmProduct?.id+"-"+this.projectInfo?.id+"-iteration-select-id"
			}
		},
		props:['visible'],
		watch:{
			visible:function(visible){
				if(visible==true){
				}
			}
		},
		data() {
			 return{
				dicts:{iterationStatus:[]},
				load:{calcIteration:false},
				xmIteration:null,
				showPanel:'iterationOverview',//menus,tasks,bugs,iterationStateShow
				iterationAddVisible:false,
				maxTableHeight:700,
				iterationId:null,
				/**end 自定义属性请在上面加 请加备注**/
			}
		},//end data
		methods: {
			loadTasksToXmIterationState(){
				this.load.calcIteration=true;
				loadTasksToXmIterationState({id:this.xmIteration.id}).then(res=>{
					
					var tips =res.tips; 
          if(tips.isOk){
            listXmIterationWithState({id:this.xmIteration.id}).then(res2=>{ 
              var tips2=res2.tips;
							this.load.calcIteration=false;
							this.$message({showClose:true,message: tips2.msg, type: tips2.isOk?'success':'error'});  
              if(tips2.isOk && res2.data.length>0){
                var data=res2.data[0] 
                useXmStore2().setXmIteration(data)
                this.onEditFields(data)
              }
            })
          }else{
						this.load.calcIteration=false;
						this.$message({showClose:true,message: tips.msg, type: tips.isOk?'success':'error'});  
					}
 				});
			},

			/**end 自定义函数请在上面加**/
			onIterationRowClick(iteration){ 
					this.xmIteration=iteration 
					sessionStorage.setItem(this.iterationKey,iteration?.id||'')
					this.iterationId=iteration?.id
			},

			onIterationClearSelect(){
				this.xmIteration=null;
				this.iterationId=null
			},
			afterIterationAddSubmit(iteration){
				this.$refs.xmIterationSelect.xmIterations.push(iteration)
				this.$refs.xmIterationSelect.rowClick(iteration);
				this.iterationAddVisible=false;
			},
			tabClick(tab){
				this.showPanel=tab.name
			},

			editSomeFields(row,fieldName,$event){
				let params={};
				params['ids']=[row].map(i=>i.id)
				params[fieldName]=$event
				var func = editSomeFieldsXmIteration
				func(params).then(res=>{
					let tips = res.tips;
					if(tips.isOk){
					Object.assign(row,params)
					this.$emit('edit-fields',params)
					}else{
						this.$notify({position:'bottom-left',showClose:true,message:tips.msg,type:tips.isOk?'success':'error'})
					}
				}).catch((e)=>Object.assign(this.editForm,this.editFormBak))
			},
			showIterationMenu(){
				this.showPanel='iterationMenuMng'
			},
			showIterationDetail(){
				this.showPanel='detail'
			},
			onEditFields(row){
				Object.assign(this.xmIteration,row)
				useXmStore2().setXmIteration(this.xmIteration)
				this.$emit('edit-fields',row)
			}
		},//end methods
		components: {
      XmIterationOverview,  
			XmIterationAdd,
			XmIterationEdit,
			XmIterationMenuMng, 

		},
		mounted() {

			this.$mdp.getDictOptions('iterationStatus').then(res=>this.dicts.iterationStatus=res) 
			this.iterationId=sessionStorage.getItem(this.iterationKey)||'' 

			}
	}

</script>

<style scoped>
  .more-label-font{
  	text-align:center;
  	float:left;
  	padding-top:5px;
  }
.step-btn{
	margin-left:0px;margin-bottom: 5px;
}
</style>
