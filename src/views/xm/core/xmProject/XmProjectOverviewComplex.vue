<template>
  
    <el-row>
      <el-col :span="3" class="padding-top padding-left" >  
        <el-scrollbar v-adaptive> 
        <el-steps  :active="calcProjectStatusStep" finish-status="success" direction="vertical">
          <el-step
            v-for="(i, index) in dicts['projectStatus']"
            :title="i.name"
            :key="index"
          >
            <template #description>
               <el-row v-if="i.id=='0'"><!--初始-->
			   		<span v-if="projectInfo.status==i.id">
						<el-button class="step-btn" type="warning"    plain @click="createProduct()">创建产品</el-button>
						<el-button class="step-btn" type="warning"    plain @click="linkProduct()">关联产品</el-button>
						<el-button class="step-btn" type="warning"    plain @click="showPanelName='setting'">项目配置</el-button>
						<el-button class="step-btn" type="warning"    plain @click="jumpTo('projectEnv')">环境清单</el-button>
						<el-button class="step-btn" type="danger" icon="d-caret"    plain @click="editXmProjectSomeFields(projectInfo,'status','1')">进入售前</el-button>
					</span>
					<span v-if="projectInfo.status!=i.id"> 						
						<el-button class="step-btn" type="warning"    plain @click="linkProduct()">关联产品</el-button>            
            <el-button class="step-btn" type="warning"    plain @click="showPanelName='setting'">项目配置</el-button>  
						<el-button class="step-btn" type="warning"    plain @click="jumpTo('projectEnv')">环境清单</el-button>
					</span> 
			   </el-row>
               <el-row v-else-if="i.id=='1'"><!--售前-->
			   		<span v-if="projectInfo.status==i.id">
						<el-button class="step-btn" type="warning"    plain @click="jumpTo('projectMenu')">需求管理</el-button>
						<el-button class="step-btn" type="danger" icon="d-caret"    plain @click="editXmProjectSomeFields(projectInfo,'status','2')">设为立项中</el-button>
					</span>
					<span v-if="projectInfo.status!=i.id">
						<el-button class="step-btn" type="warning"    plain @click="jumpTo('projectMenu')">需求管理</el-button> 
					</span> 
			   </el-row>
               <el-row v-else-if="i.id=='2'"><!--立项中-->
			   		<span v-if="projectInfo.status==i.id">
						<el-button class="step-btn" type="warning"    plain @click="jumpTo('projectContract')">签订合同</el-button>
						<el-button class="step-btn" type="warning"    plain @click="jumpTo('projectGroup')">创建团队</el-button>
						<el-button class="step-btn" type="warning"    plain @click="jumpTo('projectPlan')">创建计划</el-button>
						<el-button class="step-btn" type="warning"    plain @click="jumpTo('projectBudget')">预算清单</el-button>
						<el-button class="step-btn" type="warning"    plain @click="showProjectGaiSuan()">项目估算</el-button>
						<el-button class="step-btn" type="warning"    plain @click="showProjectShouYi()">项目收益</el-button>
						<el-button class="step-btn" type="danger" icon="d-caret"     plain @click="editXmProjectSomeFields(projectInfo,'status','3')">设为立项中</el-button>
					</span>
					<span v-if="projectInfo.status!=i.id">
						<el-button class="step-btn" type="warning"    plain @click="jumpTo('projectContract')">合同管理</el-button>
						<el-button class="step-btn" type="warning"    plain @click="jumpTo('projectGroup')">团队管理</el-button>  
						<el-button class="step-btn" type="warning"    plain @click="jumpTo('projectPlan')">计划管理</el-button> 
						<el-button class="step-btn" type="warning"    plain @click="jumpTo('projectBudget')">预算管理</el-button>
						<el-button class="step-btn" type="warning"    plain @click="showProjectGaiSuan()">项目估算</el-button>
						<el-button class="step-btn" type="warning"    plain @click="showProjectShouYi()">项目收益</el-button>
					</span> 
			   </el-row>
               <el-row v-else-if="i.id=='3'"><!--实施中-->
			   		<span v-if="projectInfo.status==i.id">
						<el-button class="step-btn" type="warning"    plain @click="jumpTo('projectMilestone')">里程碑</el-button>
						<el-button class="step-btn" type="warning"    plain @click="jumpTo('projectIteration')">迭代管理</el-button>
						<el-button class="step-btn" type="warning"    plain @click="jumpTo('projectPlan')">任务管理</el-button>
						<el-button class="step-btn" type="warning"    plain @click="jumpTo('projectQuestion')">缺陷管理</el-button>
						<el-button class="step-btn" type="warning"    plain @click="jumpTo('projectWorkloadDay')">每日工时</el-button>
						<el-button class="step-btn" type="warning"    plain @click="jumpTo('projectWorkloadMonth')">每月工时</el-button> 
						<el-button class="step-btn" type="warning"    plain @click="jumpTo('projectCost')">费用管理</el-button> 
						<el-button class="step-btn" type="warning"    plain @click="jumpTo('projectRpt')">效能分析</el-button> 
						<el-button class="step-btn" type="danger" icon="d-caret"    plain @click="editXmProjectSomeFields(projectInfo,'status','4')">暂停项目</el-button>
						<el-button class="step-btn" type="warning"    plain @click="projectChangeRequire()">变更申请</el-button>
						<el-button class="step-btn" type="danger" icon="d-caret"    plain @click="editXmProjectSomeFields(projectInfo,'status','5')">设为结项中</el-button>
					</span>
					<span v-if="projectInfo.status!=i.id">
						<el-button class="step-btn" type="warning"    plain @click="jumpTo('projectMilestone')">里程碑</el-button>
						<el-button class="step-btn" type="warning"    plain @click="jumpTo('projectIteration')">迭代管理</el-button>
						<el-button class="step-btn" type="warning"    plain @click="jumpTo('projectPlan')">任务管理</el-button>
						<el-button class="step-btn" type="warning"    plain @click="jumpTo('projectQuestion')">缺陷管理</el-button>
						<el-button class="step-btn" type="warning"    plain @click="jumpTo('projectWorkloadDay')">每日工时</el-button>
						<el-button class="step-btn" type="warning"    plain @click="jumpTo('projectWorkloadMonth')">每月工时</el-button> 
						<el-button class="step-btn" type="warning"    plain @click="jumpTo('projectCost')">费用管理</el-button> 
						<el-button class="step-btn" type="warning"    plain @click="jumpTo('projectRpt')">效能分析</el-button> 
						<el-button v-if="projectInfo.status<i.id" class="step-btn"  type="danger" icon="d-caret"    plain @click="editXmProjectSomeFields(projectInfo,'status','5')">结项申请</el-button>
						<el-button class="step-btn" type="warning"    plain @click="showDetail()">变更申请</el-button>
					</span> 
			   </el-row>
               <el-row v-else-if="i.id=='4'"><!--暂停中-->
			   		<span v-if="projectInfo.status==i.id"> 
						<el-button class="step-btn"  type="danger" icon="d-caret"    plain @click="editXmProjectSomeFields(projectInfo,'status','3')">重新激活</el-button>
					</span>  
			   </el-row>
        <el-row v-else-if="i.id=='5'"><!--结项中-->
			   		<span v-if="projectInfo.status==i.id"> 
              <el-button class="step-btn" type="warning"    plain @click="showDetail()">结项申请</el-button>
              <el-button class="step-btn" type="warning"    plain @click="showCurrFlow()">结项审批</el-button>
            </span>
            <span v-if="projectInfo.status!=i.id">
              <el-button class="step-btn" type="warning"    plain @click="showHisFlow()">结项审批</el-button>  
            </span>  
			   </el-row>
          <el-row v-else-if="i.id=='6'"><!--已结项--> 
              <span v-if="projectInfo.status==i.id"> 
                
                <el-popconfirm @confirm="editXmProjectSomeFields(projectInfo, 'status', '7')" title="将项目状态改为售后?">

                  <template #reference><el-button class="step-btn" type="danger" icon="d-caret"  plain>转入售后  </el-button> </template>

                </el-popconfirm>
               </span> 
              <span v-if="projectInfo.status!=i.id"  ></span>  
          </el-row>
          <el-row v-else-if="i.id=='7'"><!--售后-->
              <span v-if="projectInfo.status==i.id"> 
                
                <el-popconfirm @confirm="editXmProjectSomeFields(projectInfo, 'status', '8')" title="将项目状态改为已完成?">

                  <template #reference><el-button class="step-btn" type="danger" icon="d-caret"  plain>设为已完成  </el-button> </template>

                </el-popconfirm>
               </span> 
          </el-row>
          <el-row v-else-if="i.id=='8'"><!--已完成-->
              <span v-if="projectInfo.status==i.id"> 
                <el-popconfirm @confirm="editXmProjectSomeFields(projectInfo, 'status', '9')" title="将项目状态改为已关闭?">

                  <template #reference><el-button class="step-btn" type="danger" icon="d-caret"  plain>关闭项目  </el-button> </template>

                </el-popconfirm>
               </span> 
              
          </el-row>
          <el-row v-else-if="i.id=='9'"><!--已关闭-->  
            <span v-if="projectInfo.status==i.id"> 
              <el-popconfirm @confirm="editXmProjectSomeFields(projectInfo, 'status', '3')" title="将项目状态改为实施中?">

                <template #reference><el-button class="step-btn" type="danger" icon="d-caret"  plain>重新实施  </el-button> </template>

              </el-popconfirm>
            </span>
          </el-row> 
        </template>
          </el-step>
        </el-steps> 
      </el-scrollbar>
      </el-col>
      <el-col :span="21"  class="padding-left padding-right">
        <el-tabs v-model="showPanelName">
          <el-tab-pane
            label="项目概览"
            name="overview" 
          > 
          <xm-project-overview  v-show="showPanelName=='overview' && projectInfo && projectInfo.id" :sel-project="projectInfo" @edit-fields="onEditFields"/>

          </el-tab-pane>
          <el-tab-pane
            label="项目设置"
            name="setting" 
          > 
          <xm-project-setting  v-if="showPanelName=='setting'" :sel-project="projectInfo" @edit-fields="onEditFields" ref="detail" /> 

          </el-tab-pane>
          <el-tab-pane
            label="项目详情"
            name="detail" 
          > 
          <xm-project-detail subOpType="edit" v-if="showPanelName=='detail'" :sel-project="projectInfo" @submit="afterEditSubmit" @edit-fields="onEditFields" ref="detail" /> 

          </el-tab-pane>
          <el-tab-pane
            label="关联产品"
            name="productProjectLink" 
          > 
          <xm-product-project-link-mng v-if="showPanelName=='productProjectLink'" :sel-project="projectInfo" />

          </el-tab-pane>
          <el-tab-pane
            label="执行项目数据统计计划"
            name="projectCalc" 
          > 
          <div v-if="showPanelName=='projectCalc'" class="padding">
          <div class="padding">
            <el-button type="primary" @click="loadTasksToXmProjectState" v-loading="load.calcProject">计算项目数据</el-button>
            <br/>
              <font color="blue" style="font-size:10px;">将从项目任务中汇总进度、预算工作量、实际工作量、预算金额、实际金额、缺陷数、需求数等数据到项目统计表</font>
          </div>
          <!-- <div class="padding">
            <el-button  type="primary" @click="loadTasksSettleToXmProjectState"  v-loading="load.calcSettle">计算项目结算数据</el-button>
            <br/>
              <font color="blue"  style="font-size:10px;">将从项目任务汇总结算数据项目统计表</font>
          </div> -->
        </div>
          </el-tab-pane>
          <el-tab-pane
            label="当前审批流"
            name="currFlow" 
          > 
          <task-mng v-if="showPanelName === 'currFlow' " ref="currFlow" :pbiz-id="projectInfo.id" @submit="afterFlowSubmit" />  

          </el-tab-pane>
          <el-tab-pane
            label="历史审批流"
            name="hisFlow" 
          > 
          <procinst-mng v-if="showPanelName === 'hisFlow' " ref="hisFlow" isAll="true" :pbiz-id="projectInfo.id" />  
          </el-tab-pane> 
        </el-tabs> 
        
        
        
      </el-col>
    </el-row>
  
</template>

<script>
import util from "@/components/mdp-ui/js/util"; // 全局公共库
//import Sticky from "@/components/Sticky"; // 粘性header组件
import { mapState } from 'pinia'
import { useUserStore } from '@/store/modules/user' 
import { useXmStore,useXmStore2 } from '@/store/modules/xm'
import XmProjectOverview from './XmProjectOverview.vue';
import XmProjectDetail from './XmProjectDetail.vue';
import XmProjectSetting from './XmProjectSetting.vue';
import XmProductProjectLinkMng from '../xmProductProjectLink/XmProductProjectLinkMng.vue'; 

import TaskMng from '@/views/mdp/workflow/ru/task/TaskListAssigneeToMe.vue'; 
import ProcinstMng from '@/views/mdp/workflow/hi/procinst/ProcinstListAll.vue';
import {  loadTasksToXmProjectState , loadTasksSettleToXmProjectState} from '@/api/xm/core/xmProjectState';
import { listXmProject} from '@/api/xm/core/xmProject'; 

import { getDefOptions,editXmProjectSomeFields } from "@/api/xm/core/xmProject";



export default {
  components: { XmProjectOverview, XmProjectDetail, XmProductProjectLinkMng ,TaskMng,ProcinstMng,XmProjectSetting},
  computed: {
    ...mapState(useUserStore,["userInfo"]),
    ...mapState(useXmStore,['projectInfo']),
    calcProjectStatusStep() {
      if (this.dicts["projectStatus"] && this.projectInfo) {
        var index = this.dicts["projectStatus"].findIndex((i) => {
          if (i.id == this.projectInfo.status) {
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
  watch:{
  },
  data() {
    return {
      showPanelName:'overview',
      maxTableHeight:500, 
      dicts:  getDefOptions(), 
      load:{calcProject:false,calcSettle:false}
    };
  },

  methods:{
    jumpTo(name){
      this.$router.push({
        name:name,
        query:{
          projectId:this.projectInfo.id
        }
      })
    },
    afterEditSubmit(project){
      this.$emit('submit',project)
    },
    onMenuToolBarSelect(menuIndex){
      this.showPanelName=menuIndex;
    },
    
    loadTasksToXmProjectState(){
        var row=this.projectInfo;
        var params={projectId:row.id}
        
        this.load.calcProject=true;
      loadTasksToXmProjectState(params).then((res) => { 
          var tips=res.tips;  
          if(!tips.isOk){
            this.$message({showClose:true,message: tips.msg, type: tips.isOk?'success':'error'}); 
            this.load.calcProject=false;
            return;
          }
 
          listXmProject({id:this.projectInfo.id}).then(res=>{
            this.load.calcProject=false;
            var tips = res.tips; 
            this.$message({showClose:true,message: tips.msg, type: tips.isOk?'success':'error'}); 
            if(tips.isOk){
              var projectInfo=res.data[0] 
              this.onEditFields(projectInfo)
            }
          })
        }).catch( err  => this.load.calcProject=false ); 
    },
    loadTasksSettleToXmProjectState(){
        var row=this.projectInfo;
        var params={projectId:row.id}
      loadTasksSettleToXmProjectState(params).then((res) => {
          this.load.calcProject=false;
          var tips=res.tips; 
          this.$notify({position:'bottom-left',showClose:true,message: tips.msg, type: tips.isOk?'success':'error'});
        }).catch( err  => this.load.calcProject=false ); 
    },
    
    afterFlowSubmit(){
      
      listXmProject({id:this.projectInfo.id}).then(res=>{
        var tips = res.tips;
        if(tips.isOk){
          var projectInfo=res.data[0]
          this.afterEditSubmit(projectInfo)
        }
      })
    },
    
			onEditFields(row){  
        Object.assign(this.projectInfo,row)
        useXmStore2().setProjectInfo(this.projectInfo)
				this.$emit("edit-fields",row);
			},
      goBack() {
      localStorage.setItem("project-infotype", "项目概览");  
      this.$router.back(-1); 
    },
    goHome(){ 
      localStorage.setItem("project-infotype", "项目概览");  
      this.$router.push({path:'/'}) 
    },
     
      showCurrFlow(){
        this.showPanelName='currFlow'
      },
      showHisFlow(){
        this.showPanelName='hisFlow'
      },
      showDetail(){
        this.showPanelName='detail'
      },
      showProjectGaiSuan(){ 
        this.showPanelName='detail' 
        this.$nextTick(()=>{ 
          this.$refs['detail'].$refs['projectEdit'].currTabPane='4'
        })
      },
      showProjectShouYi(){
        this.showPanelName='detail' 
        this.$nextTick(()=>{  
          this.$refs['detail'].$refs['projectEdit'].currTabPane='5'
        })
        
      },
      showMenusPage(){
        this.infotype='需求'  
      },
      linkProduct(){
        this.showPanelName='productProjectLink' 
      },
      createProduct(){
        this.infotype='产品'
        this.$nextTick(()=>{
          this.$refs['xmProductComplex'].addProductVisible=true
        })
      }, 
      editXmProjectSomeFields(row,fieldName,$event){  
        var func=(params)=>{
          editXmProjectSomeFields(params).then(res=>{
            var tips = res.tips;
            if(tips.isOk){
              this.$emit('edit-fields',params)
              Object.assign(row,params)  
              useXmStore2().setProjectInfo(row)
            }else{    
              this.$notify({position:'bottom-left',showClose:true,message:tips.msg,type:tips.isOk?'success':'error'})
            }
          })
        }
        var params={'$pks':[row.id]};  
        params[fieldName]=$event  
        func(params) 
      },
    tabClick(tab) {
      this.showPanelName = tab.name;
    },
  },

  mounted() {
    
    
    this.$nextTick(() => {
    });
  },

};
</script>

<style scoped lang="scss">
.menus {
  .el-menu-item {
    padding-left: 0px !important;
  }
}
/* 超过宽度则用...代替 */
.truncate {
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}
.step-btn{
	margin-left:0px;margin-bottom: 5px;
}
</style>
