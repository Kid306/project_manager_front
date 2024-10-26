<template>
  <el-row>
    <el-col :xl="3" :lg="3" :md="3" :sm="3" :xs="5" class="padding-top padding-left"> 
        <xm-project-select v-model="projectId" v-if="xmProduct?.id" width="100%" show-style="origin" ref="xmProjectSelect" 
          :link-product-id="xmProduct?.id"
          @change3="onProjectRowClick" @clear="onProjectClearSelect" />
       <el-scrollbar always>
        <el-steps class="padding-top" :active="calcProjectStatusStep" finish-status="success" direction="vertical" v-if="selProject">
          <el-step space="40" v-for="(i, index) in dicts['projectStatus']" :title="i.name" :key="index">
            <template #description>
              <el-row v-if="i.id == '0'"><!--初始-->
                <span v-if="selProject.status == i.id">

                  <el-popconfirm @confirm="editXmProjectSomeFields(selProject, 'status', '1')" title="将项目状态改为售前?">

                    <template #reference><el-button class="step-btn" type="danger" icon="d-caret" plain>进入售前 </el-button>
                    </template>

                  </el-popconfirm>
                  <el-button class="step-btn" type="warning" plain
                    @click="editXmProjectSomeFields(selProject, 'status', '1')">进入售前</el-button>
                </span>
                <span v-if="selProject.status != i.id"></span>
              </el-row>
              <el-row v-else-if="i.id == '1'"><!--售前-->
                <span v-if="selProject.status == i.id">
                  <el-button class="step-btn" type="warning" plain @click="showMenusPage">需求管理</el-button>
                  <el-popconfirm @confirm="editXmProjectSomeFields(selProject, 'status', '2')"
                    title="将项目状态改为立项中，立项中的项目可以发起立项申请流程?">

                    <template #reference><el-button class="step-btn" type="danger" icon="d-caret" plain>设为立项中 </el-button>
                    </template>

                  </el-popconfirm>
                </span>
                <span v-if="selProject.status != i.id">
                  <el-button class="step-btn" type="warning" plain @click="showMenusPage">需求管理</el-button>
                </span>
              </el-row>
              <el-row v-else-if="i.id == '2'"><!--立项中-->
                <span v-if="selProject.status == i.id">
                  <el-button class="step-btn" type="warning" plain @click="showPanel = 'group'">创建团队</el-button>
                  <el-button class="step-btn" type="warning" plain @click="showPanel = 'plan'">创建计划</el-button>
                  <el-button class="step-btn" type="warning" plain @click="showProjectGaiSuan()">项目估算</el-button>
                  <el-button class="step-btn" type="warning" plain @click="showProjectShouYi()">项目收益</el-button>

                  <el-popconfirm @confirm="editXmProjectSomeFields(selProject, 'status', '2')"
                    title="将项目状态改为立项中，立项中的项目可以发起立项申请流程?">

                    <template #reference><el-button class="step-btn" type="danger" icon="d-caret" plain>设为立项中 </el-button>
                    </template>

                  </el-popconfirm>
                </span>
                <span v-if="selProject.status != i.id">
                  <el-button class="step-btn" type="warning" plain @click="showPanel = 'group'">团队管理</el-button>
                  <el-button class="step-btn" type="warning" plain @click="showPanel = 'plan'">计划管理</el-button>
                  <el-button class="step-btn" type="warning" plain @click="showProjectGaiSuan()">项目估算</el-button>
                  <el-button class="step-btn" type="warning" plain @click="showProjectShouYi()">项目收益</el-button>
                </span>
              </el-row>
              <el-row v-else-if="i.id == '3'"><!--实施中-->
                <span v-if="selProject.status == i.id">
                  <el-button class="step-btn" type="warning" plain @click="showPanel = 'milestone'">里程碑</el-button>
                  <el-button class="step-btn" type="warning" plain @click="showPanel = 'tasks'">任务管理</el-button>
                  <el-button class="step-btn" type="warning" plain @click="showPanel = 'bugs'">缺陷管理</el-button>
                  <el-popconfirm @confirm="editXmProjectSomeFields(selProject, 'status', '4')"
                    title="将项目状态改为暂停中，暂停中的项目不允许进行操作，恢复状态后才可以继续?">

                    <template #reference><el-button class="step-btn" type="danger" icon="d-caret" plain>暂停项目 </el-button>
                    </template>
                  </el-popconfirm>
                  <el-button class="step-btn" type="warning" plain @click="projectChangeRequire()">变更申请</el-button>
                  <el-popconfirm @confirm="editXmProjectSomeFields(selProject, 'status', '5')"
                    title="将项目状态改为结项中，结项申请中的项目可以发起结项流程?">
                    <template #reference><el-button class="step-btn" type="danger" icon="d-caret" plain>设为结项中 </el-button>
                    </template>
                  </el-popconfirm>
                </span>
                <span v-if="selProject.status != i.id">
                  <el-button class="step-btn" type="warning" plain @click="showPanel = 'tasks'">任务管理</el-button>
                  <el-button class="step-btn" type="warning" plain @click="showPanel = 'bugs'">缺陷管理</el-button>
                  <el-button class="step-btn" type="warning" plain @click="projectChangeRequire()">变更申请</el-button>
                </span>
              </el-row>
              <el-row v-else-if="i.id == '4'"><!--暂停中-->
                <span v-if="selProject.status == i.id">
                  <el-popconfirm @confirm="editXmProjectSomeFields(selProject, 'status', '3')" title="将项目重新激活?">

                    <template #reference><el-button class="step-btn" type="danger" icon="d-caret" plain>重新激活 </el-button>
                    </template>

                  </el-popconfirm>
                </span>
              </el-row>
              <el-row v-else-if="i.id == '5'"><!--结项中-->
                <span v-if="selProject.status == i.id"></span>
                <span v-if="selProject.status != i.id">

                </span>
              </el-row>
              <el-row v-else-if="i.id == '6'"><!--已结项-->
                <span v-if="selProject.status == i.id">

                  <el-popconfirm @confirm="editXmProjectSomeFields(selProject, 'status', '7')" title="将项目状态改为售后?">

                    <template #reference><el-button class="step-btn" type="danger" icon="d-caret" plain>转入售后 </el-button>
                    </template>

                  </el-popconfirm>
                </span>
                <span v-if="selProject.status != i.id"></span>
              </el-row>
              <el-row v-else-if="i.id == '7'"><!--售后-->
                <span v-if="selProject.status == i.id">

                  <el-popconfirm @confirm="editXmProjectSomeFields(selProject, 'status', '8')" title="将项目状态改为已完成?">

                    <template #reference><el-button class="step-btn" type="danger" icon="d-caret" plain>设为已完成 </el-button>
                    </template>

                  </el-popconfirm>
                </span>
              </el-row>
              <el-row v-else-if="i.id == '8'"><!--已完成-->
                <span v-if="selProject.status == i.id">
                  <el-popconfirm @confirm="editXmProjectSomeFields(selProject, 'status', '9')" title="将项目状态改为已关闭?">

                    <template #reference><el-button class="step-btn" type="danger" icon="d-caret" plain>关闭项目 </el-button>
                    </template>

                  </el-popconfirm>
                </span>

              </el-row>
              <el-row v-else-if="i.id == '9'"><!--已关闭-->
                <span v-if="selProject.status == i.id">
                  <el-popconfirm @confirm="editXmProjectSomeFields(selProject, 'status', '3')" title="将项目状态改为实施中?">

                    <template #reference><el-button class="step-btn" type="danger" icon="d-caret" plain>重新实施 </el-button>
                    </template>

                  </el-popconfirm>
                </span>
              </el-row>
            </template>
          </el-step>
        </el-steps>
      </el-scrollbar>
    </el-col>
    <el-col :xl="21" :lg="21" :md="21" :sm="21" :xs="19" class="padding-left">
      <el-tabs v-model="showPanel" v-if="selProject && selProject.id" >
        <el-tab-pane label="项目概览" name="projectOverview">
          <xm-project-overview  :xm-product="xmProduct"
            :xm-iteration="xmIteration" :sel-project="selProject" @edit-fields="onEditFields"/>
        </el-tab-pane>
        <el-tab-pane label="项目详情" name="detail"> 
          <xm-project-detail  subOpType="edit" :sel-project="selProject" @submit="onEditFields" ref="detail"
            @edit-fields="onEditFields" /> 
        </el-tab-pane>
        <el-tab-pane label="配置关联的产品" name="productProjectLink">
          <xm-product-project-link-mng v-if="showPanel=='productProjectLink'" class="padding-top"  
            :sel-project="selProject" />
        </el-tab-pane>
        <!--
					<el-tab-pane label="配置关联的迭代"   name="iterationProjectLink" v-if="selProject&&selProject.id" >
						<xm-iteration-link-for-project v-if="showPanel=='iterationProjectLink'" :sel-project="selProject" />
					</el-tab-pane>  
					-->
        <el-tab-pane label="需求" name="menus">
          <xm-menu-box  :xm-product="xmProduct" :xm-iteration="xmIteration" v-if="showPanel=='menus'"
            :sel-project="selProject" simple/>
        </el-tab-pane>

        <el-tab-pane label="计划" name="plan">
          <xm-plan   queryScope="plan" ptype="0" v-if="showPanel=='plan'"
            :xm-product="xmProduct" :xm-iteration="xmIteration" :sel-project="selProject" />
        </el-tab-pane>
        <el-tab-pane label="任务" name="tasks">
          <XmTaskBox   queryScope="task" ptype="0" :xm-product="xmProduct" v-if="showPanel=='tasks'"
            :xm-iteration="xmIteration" :sel-project="selProject" />
        </el-tab-pane>
        <el-tab-pane label="缺陷" name="bugs">
          <xm-question-list   :xm-product="xmProduct" :xm-iteration="xmIteration" v-if="showPanel=='bugs'"
            :sel-project="selProject" />
        </el-tab-pane>
        <el-tab-pane label="团队" name="group">
          <xm-group-mng   :sel-project="selProject" v-if="showPanel=='group'"/>
        </el-tab-pane>
        <el-tab-pane label="执行统计" name="projectCalc">
          <div  >
            <div>
              <el-button type="primary" @click="loadTasksToXmProjectState"
                v-loading="load.calcProject">计算项目数据</el-button>
              <br />
              <font color="blue" style="font-size: 10px">将从项目任务中汇总进度、预算工作量、实际工作量、预算金额、实际金额、缺陷数、需求数等数据到项目统计表</font>
            </div>
            <!--
              <div>
                <el-button
                  type="primary"
                  @click="loadTasksSettleToXmProjectState"
                  v-loading="load.calcSettle"
                  >计算项目结算数据</el-button
                >
                <br />
                <font color="blue" style="font-size: 10px"
                  >将从项目任务汇总结算数据项目统计表</font
                >
              </div>
              -->
          </div>
        </el-tab-pane>

        <el-tab-pane label="效能分析" name="效能">
          <xm-rpt  :xm-project="selProject" :xm-iteration="xmIteration" v-if="showPanel=='效能'"
            :xm-product="xmProduct" category="项目级" />
        </el-tab-pane>
      </el-tabs>
    </el-col>
  </el-row>

  <mdp-dialog width="80%" v-model="projectAddVisible" top="20px" append-to-body>
    <xm-project-add :visible="projectAddVisible" op-type="add" :xm-product="xmProduct" @cancel="projectAddVisible = false"
      @submit="afterProjectAddSubmit" />
  </mdp-dialog>
</template>

<script>
import util from '@/components/mdp-ui/js/util';//全局公共库
import config from "@/api/mdp_pub/mdp_config"; //全局公共库  
import { mapState } from 'pinia'
import { useUserStore } from '@/store/modules/user'
import { useXmStore,useXmStore2 } from '@/store/modules/xm'
  

import XmProjectOverview from "./XmProjectOverview.vue";

import XmProjectAdd from "./XmProjectEdit.vue"; //新增界面
import XmProjectDetail from "./XmProjectDetail.vue"; //新增界面

import XmProductProjectLinkMng from "../xmProductProjectLink/XmProductProjectLinkMng.vue";
import xmGroupMng from '../xmGroup/XmGroupMng.vue';  

import {

  getDefOptions,
  editXmProjectSomeFields,
  listXmProject
} from "@/api/xm/core/xmProject";
import {
  loadTasksToXmProjectState,
  loadTasksSettleToXmProjectState,
} from "@/api/xm/core/xmProjectState";
export default {
  computed: {
    ...mapState(useUserStore, ["userInfo", "roles"]),
    ...mapState(useXmStore, ["xmProduct","xmIteration"]),
    calcProjectStatusStep() {
      if (this.dicts["projectStatus"] && this.selProject) {
        var index = this.dicts["projectStatus"].findIndex((i) => {
          if (i.id == this.selProject.status) {
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
    projectKey(){
      return this.xmProduct?.id+'-project-select-id'
    }
  },
  props: ["visible"],
  watch: {
    visible: function (visible) {
      if (visible == true) {
      }
    },
  },
  data() {
    return {
      load: {
        calcProject: false,
      },
      dicts: {
        "projectType": [], "priority": [], "projectStatus": []
      },
      selProject: null,
      showPanel: "projectOverview", //menus,tasks,bugs,iterationStateShow
      projectAddVisible: false, 
      projectId: null,
      /**end 自定义属性请在上面加 请加备注**/
    };
  }, //end data
  methods: {
    /**end 自定义函数请在上面加**/
    onProjectRowClick(xmProject) {
      this.selProject = xmProject;
      this.projectId=xmProject?.id
      sessionStorage.setItem(this.projectKey,xmProject?.id||'')
    },

    onProjectClearSelect() {
      this.selProject = null;
      this.projectId=null
      sessionStorage.removeItem(this.projectKey)
    },
    tabClick(tab) {
      this.showPanel = tab.name;
    },
    afterProjectAddSubmit(project) {
      this.projectAddVisible = false;
      if (this.$refs.xmProjectSelect) {
        this.$refs.xmProjectSelect.xmProjects.push(project);
        this.$refs.xmProjectSelect.rowClick(project);
      }
    },

    loadTasksToXmProjectState() {
      var row = this.selProject;
      var params = { projectId: row.id };
      
      this.load.calcProject = true;
      loadTasksToXmProjectState(params)
        .then((res) => {
          
          var tips = res.tips; 

          if(!tips.isOk){
            this.$message({showClose:true,message: tips.msg, type: tips.isOk?'success':'error'}); 
            this.load.calcProject = false;
            return;
          } 
           

          listXmProject({id:row.id}).then(res=>{
            this.load.calcProject=false;
            tips = res.tips; 
            this.$message({showClose:true,message: tips.msg, type: tips.isOk?'success':'error'}); 
             if(tips.isOk){
              var selProject=res.data[0] 
              this.onEditFields(selProject)
            }
          }) 
        })
        .catch((err) => (this.load.calcProject = false));
    },
    loadTasksSettleToXmProjectState() {
      var row = this.selProject;
      var params = { projectId: row.id };
      loadTasksSettleToXmProjectState(params)
        .then((res) => {
          this.load.calcProject = false;
          var tips = res.tips;
          this.$notify({
            position: "bottom-left",
            showClose: true,
            message: tips.msg,
            type: tips.isOk ? "success" : "error",
          });
        })
        .catch((err) => (this.load.calcProject = false));
    },
    onEditFields(row) {
      Object.assign(this.selProject, row);
      this.$emit("edit-fields", row);
      useXmStore2().setProjectInfo(this.selProject)
    },
    showCurrFlow() {
      this.showPanel = "currFlow";
    },
    showHisFlow() {
      this.showPanel = "hisFlow";
    },
    showDetail() {
      this.showPanel = "detail";
    },
    projectChangeRequire() {
      this.showPanel = "detail";
      this.$nextTick(() => {
        this.$refs["detail"].$refs['projectEdit'].currTabPane = "3";
      });
    },
    showProjectGaiSuan() {
      this.showPanel = "detail";
      this.$nextTick(() => {
        this.$refs["detail"].$refs['projectEdit'].currTabPane = "4";
      });
    },
    showProjectShouYi() {
      this.showPanel = "detail";
      this.$nextTick(() => {
        this.$refs["detail"].$refs['projectEdit'].currTabPane = "5";
      });
    },
    showMenusPage() {
      this.showPanel = "menus";
    },


    editXmProjectSomeFields(row, fieldName, $event) {

      var func = (params) => {
        editXmProjectSomeFields(params).then(res => {
          var tips = res.tips;
          if (tips.isOk) {

            Object.assign(row, params)
            Object.assign(this.selProject, row)
            this.$emit('edit-fields', row)
            useXmStore2().setProjectInfo(this.selProject)
            this.editFormBak = Object.assign({}, row)
          } else {
            Object.assign(this.editForm, this.editFormBak)
            this.$notify({ position: 'bottom-left', showClose: true, message: tips.msg, type: tips.isOk ? 'success' : 'error' })
          }
        })
      }
      var params = { '$pks': [row.id] };

      params[fieldName] = $event

      func(params)
    },
  }, //end methods
  components: { 
    XmProjectAdd,
    XmProjectDetail,
    XmProjectOverview,
    XmProductProjectLinkMng,
    xmGroupMng,
  }, 
  mounted() {

    this.$mdp.getDictOptions('projectStatus').then(res => this.dicts.projectStatus = res)
    let projectId = sessionStorage.getItem(this.projectKey)
    if(projectId){
      this.projectId=projectId
    }else{
      this.projectId=null
    }
  },
};
</script>

<style lang="less" scoped>
.more-label-font {
  text-align: center;
  float: left;
  padding-top: 5px;
}

.step-btn {
  margin-left: 0px;
  margin-bottom: 5px;
}
</style>
