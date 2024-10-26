<template>
  
    <el-row>
      <el-col :xl="3" :lg="3" :md="3" :sm="3" :xs="5" class="padding-top padding-left">  
             <xm-product-select  width="100%" v-if="projectInfo?.id" v-model="productId"
              ref="xmProductSelect" 
              :link-project-id="projectInfo?.id" 
              @change3="onProductRowClick"
              @clear="onProductClearSelect"
             />   

          <el-steps space="40" v-if="xmProduct && xmProduct.id" class="padding-top"
            :active="calcProductPstatusStep"
            finish-status="success"
            direction="vertical"
          >
            <el-step 
              v-for="(i, index) in dicts['xmProductPstatus']"
              :title="i.name"
              :key="index"
            >
              <template #description>
                <el-row v-if="i.id == '0'"
                  ><!--打开-->
                  <span v-if="xmProduct.pstatus == i.id||!xmProduct.pstatus">
                    <el-button
                      class="step-btn"
                      type="warning"
                      
                      plain
                      @click="showPanel = 'menus'"
                      >需求管理</el-button
                    >   
                    <el-popconfirm @confirm="editXmProductSomeFields(xmProduct, 'pstatus', '1')" title="将产品状态设为研发中?">

                      <template #reference><el-button class="step-btn" type="danger" icon="d-caret"  plain>设为研发中  </el-button> </template>

                    </el-popconfirm>
                  </span>
                  <span v-if="xmProduct.pstatus != i.id">
                    <el-button
                      class="step-btn"
                      type="warning"
                      
                      plain
                      @click="showPanel = 'menus'"
                      >需求管理</el-button
                    > 
                  </span>
                </el-row>
                <el-row v-else-if="i.id == '1'"
                  ><!--研发中-->
                  <span v-if="xmProduct.pstatus == i.id">
                    <el-button
                      class="step-btn"
                      type="warning"
                      
                      plain
                      @click="showPanel = 'iterationProductLink'"
                      >迭代管理</el-button
                    >
                    <el-button
                      class="step-btn"
                      type="warning"
                      
                      plain
                      @click="showPanel = 'bugs'"
                      >缺陷管理</el-button
                    >  
                    <el-popconfirm @confirm="editXmProductSomeFields(xmProduct, 'pstatus', '2')" title="将产品状态设为已完成?">

                      <template #reference><el-button class="step-btn" type="danger" icon="d-caret"  plain>设为已完成  </el-button> </template>

                    </el-popconfirm>
                  </span>
                  <span v-if="xmProduct.pstatus != i.id">
                    <el-button
                      class="step-btn"
                      type="warning"
                      
                      plain
                      @click="showPanel = 'iterationProductLink'"
                      >迭代管理</el-button
                    >
                    <el-button
                      class="step-btn"
                      type="warning"
                      
                      plain
                      @click="showPanel = 'bugs'"
                      >缺陷管理</el-button
                    >
                  </span>
                </el-row>
                <el-row v-else-if="i.id == '2'"
                  ><!--已完成-->
                  <span v-if="xmProduct.pstatus == i.id"> 
                    
                    <el-popconfirm @confirm="editXmProductSomeFields(xmProduct, 'pstatus', '3')" title="将产品状态设为已关闭?">

                      <template #reference><el-button class="step-btn" type="danger" icon="d-caret"  plain>设为已关闭  </el-button> </template>

                    </el-popconfirm>
                  </span>
                  <span v-if="xmProduct.pstatus != i.id"  ></span>
                </el-row>
                <el-row v-else-if="i.id == '3'"
                  ><!--已关闭-->
                  <span v-if="xmProduct.pstatus == i.id">   
                    <el-popconfirm @confirm="editXmProductSomeFields(xmProduct, 'pstatus', '0')" title="将产品状态设为打开状态?">

                      <template #reference><el-button class="step-btn" type="danger" icon="d-caret"  plain>重新打开  </el-button> </template>

                    </el-popconfirm>
                  </span>
                  <span v-if="xmProduct.pstatus != i.id"  ></span>
                </el-row> 
              </template>
            </el-step>
          </el-steps> 
      </el-col>
      <el-col :xl="21" :lg="21" :md="21" :sm="21" :xs="19" class="padding-left padding-right">
        <el-tabs v-model="showPanel"  v-if="xmProduct && xmProduct.id"> 
          <el-tab-pane
            label="产品概览"
            name="productOverview"
          >
            <xm-product-overview
              v-if="xmProduct && showPanel == 'productOverview'"
              :xm-product="xmProduct"
              :sel-project="projectInfo"
             />
          </el-tab-pane>

          <el-tab-pane
            label="产品详情"
            name="detail" 
          >
            <xm-product-edit subOpType="edit"
              v-if="showPanel == 'detail'"
              :xm-product="xmProduct"
             />
          </el-tab-pane>
          <el-tab-pane
            label="产品团队"
            name="group"
            v-if="xmProduct && xmProduct.id"
          > 
		        <xm-group-mng v-if="showPanel == 'group'" :xm-product="xmProduct"  :visible="xmProduct && xmProduct.id" />
          </el-tab-pane>
          <el-tab-pane
            label="配置关联的项目"
            lazy
            name="productProjectLink" 
          >
            <xm-product-project-link-mng
              v-if="showPanel == 'productProjectLink'"
              :xm-product="xmProduct"
             />
          </el-tab-pane>
          <el-tab-pane
            label="迭代"
            name="iterationProductLink" 
          >
            <xm-iteration-mng
              v-if="showPanel == 'iterationProductLink'"
              :xm-product="xmProduct"
             />
          </el-tab-pane>
          <el-tab-pane
            label="需求" 
            name="menus" 
          >
            <xm-menu-box
              v-if="xmProduct && showPanel == 'menus'"
              :xm-product="xmProduct"
              :xm-iteration="xmIteration"
              :sel-project="projectInfo"
              :disabled-mng="true"
             />
          </el-tab-pane>
          <el-tab-pane
            label="任务" 
            name="tasks" 
          >
            <xm-task-box
              v-if="xmProduct && showPanel == 'tasks'"
              queryScope="task"
              ptype="0"
              :xm-product="xmProduct"
              :xm-iteration="xmIteration"
              :sel-project="projectInfo"
             />
          </el-tab-pane>
          <el-tab-pane
            label="缺陷" 
            name="bugs" 
          >
            <xm-question-list
              v-if="xmProduct && showPanel == 'bugs'"
              :xm-product="xmProduct"
              :xm-iteration="xmIteration"
              :sel-project="projectInfo"
             />
          </el-tab-pane>
          <el-tab-pane
            label="执行统计"
            name="productCalc" 
          >
            <div
              v-if="showPanel == 'productCalc'"
              class="padding-left padding-right"
            >
              <el-row>
                <el-button
                  type="primary"
                  @click="loadTasksToXmProductState"
                  v-loading="load.calcProduct"
                  >计算产品汇总数据</el-button
                >
                <br />
                <font color="blue" style="font-size: 10px"
                  >将从项目任务及产品任务中汇总进度、预算工作量、实际工作量、预算金额、实际金额、缺陷数、需求数等数据到产品统计表</font
                >
              </el-row>
              <el-row>
                <el-button
                  type="primary"
                  @click="loadTasksToXmMenuState"
                  v-loading="load.calcMenu"
                  >计算所有需求数据</el-button
                >
                <br />
                <font color="blue" style="font-size: 10px"
                  >将从项目任务汇总进度、预算工作量、实际工作量、预算金额、实际金额等数据到需求统计表</font
                >
              </el-row>
            </div>
          </el-tab-pane>
          
					<el-tab-pane label="效能分析" name="效能"> 
						<xm-rpt v-if="xmProduct && showPanel=='效能'" :xm-project="projectInfo" :xm-iteration="xmIteration" :xm-product="xmProduct" category="产品级" />
 					</el-tab-pane> 
        </el-tabs>
        <el-row />
      </el-col>
    </el-row>

    <mdp-dialog
      append-to-body
      top="20px"
      width="60%"
      v-model="addProductVisible"
    >
      <xm-product-add  op-type="add"
        @cancel="addProductVisible = false"
        :sel-project="projectInfo"
        @submit="afterAddProductSubmit"
      />
    </mdp-dialog>
  
</template>

<script>
import util from '@/components/mdp-ui/js/util';//全局公共库
import config from "@/api/mdp_pub/mdp_config"; //全局公共库
import XmIterationMng from "../xmIteration/XmIterationMng.vue"; 
import { mapState } from 'pinia'
import { useUserStore } from '@/store/modules/user'
import { useXmStore,useXmStore2 } from '@/store/modules/xm'   


import XmProductOverview from './XmProductOverview.vue'; 
import XmProductProjectLinkMng from "../xmProductProjectLink/XmProductProjectLinkMng.vue";

import { loadTasksToXmProductState } from "@/api/xm/core/xmProductState";
import {  editXmProductSomeFields } from "@/api/xm/core/xmProduct";
import { loadTasksToXmMenuState } from "@/api/xm/core/xmMenuState";
import XmProductEdit from "./XmProductEdit.vue";
import XmProductAdd from './XmProductEdit.vue'; //新增界面
import XmGroupMng from '../xmGroup/XmGroupMng.vue'
 
export default {
  computed: {
    ...mapState(useUserStore,["userInfo", "roles"]),
    ...mapState(useXmStore,[ "projectInfo"]), 

    calcProductPstatusStep() {
      if (this.dicts["xmProductPstatus"] && this.xmProduct) {
        var index = this.dicts["xmProductPstatus"].findIndex((i) => {
          if (i.id == this.xmProduct.pstatus) {
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
    
    productKey(){
      return this.projectInfo?.id+'-product-select-id'
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
        calcProduct: false,
      },
      dicts: { xmProductPstatus: [] },
      xmProduct: null,
      showPanel: "productOverview", //menus,tasks,bugs,iterationStateShow
      productVisible: true,
      addProductVisible: false,
      maxTableHeight: 300,
      productId:null,
      /**end 自定义属性请在上面加 请加备注**/
    };
  }, //end data
  methods: {
    loadTasksToXmProductState: function () {
      this.load.calcProduct = true; 
      let params = { productId: this.xmProduct.id };
      loadTasksToXmProductState(params)
        .then((res) => {
          this.load.calcProduct = false;
          var tips = res.tips; 
          this.$notify({
            position: "bottom-left",
            showClose: true,
            message: tips.msg,
            type: tips.isOk ? "success" : "error",
          });
        })
        .catch((err) => (this.load.calcProduct = false));
    },

    loadTasksToXmMenuState: function () {
      this.load.calcMenu = true;
      let params = { productId: this.xmProduct.id };
      loadTasksToXmMenuState(params)
        .then((res) => {
          this.load.calcMenu = false;
          var tips = res.tips;
          this.$notify({
            position: "bottom-left",
            showClose: true,
            message: tips.msg,
            type: tips.isOk ? "success" : "error",
          });
        })
        .catch((err) => (this.load.calcMenu = false));
    },

    /**end 自定义函数请在上面加**/
    onProductRowClick(xmProduct) {
      this.xmProduct = xmProduct;
      this.productId=this.xmProduct?.id||''
      sessionStorage.setItem(this.productKey,this.productId)
    },
    afterAddProductSubmit(product) {
      this.$refs.xmProductSelect.xmProducts.push(product);
      this.$refs.xmProductSelect.rowClick(product);
      this.addProductVisible = false;
    },
    onProductClearSelect() {
      this.xmProduct = null;
      this.productId=null
      sessionStorage.removeItem(this.productKey)
    },
    tabClick(tab) {
      if (this.xmProduct == null || !this.xmProduct.id) {
        this.productVisible = true;
        this.$notify({
          position: "bottom-left",
          showClose: true,
          message: "请先选中左边产品",
          type: "warning",
        });
      }
      this.showPanel = tab.name;
    },

    editXmProductSomeFields(row, fieldName, $event) { 
      var func = (params) => {
        editXmProductSomeFields(params).then((res) => {
          var tips = res.tips;
          if (tips.isOk) {
            this.$emit("edit-fields", params);
            Object.assign(row, params);
            this.xmProductBak = Object.assign({}, row);
          } else {
            Object.assign(this.xmProduct, this.xmProductBak);
            this.$notify({
              position: "bottom-left",
              showClose: true,
              message: tips.msg,
              type: tips.isOk ? "success" : "error",
            });
          }
        });
      };
      var params = { '$pks': [row.id] };

      params[fieldName] = $event;

      if (fieldName == "description") {
        this.$refs.xmProduct.validateField("description", (err) => {
          if (err) {
            this.$notify({
              position: "bottom-left",
              showClose: true,
              message: err,
              type: "error",
            });
            return;
          } else {
            func(params);
          }
        });
      } else if (fieldName == "name") {
        this.$refs.xmProduct.validateField("name", (err) => {
          if (err) {
            this.$notify({
              position: "bottom-left",
              showClose: true,
              message: err,
              type: "error",
            });
            return;
          } else {
            func(params);
          }
        });
      } else {
        func(params);
      }
    },

    goBack() {
      localStorage.setItem("product-showPanel", "产品概览");

      if (window.history.length > 0) {
        this.$router.back(-1);
      } else {
        this.$router.push({ path: "/xm/product/mng" });
      }
    },

    onEditFields(row) {
      Object.assign(this.xmProduct, row);
      this.$emit("edit-fields", row);
    },
    showCurrFlow() {
      this.$refs["产品概览"].showPanelName = "currFlow";
    },
    showHisFlow() {
      this.$refs["产品概览"].showPanelName = "hisFlow";
    },
    showDetail() {
      this.$refs["产品概览"].showPanelName = "detail";
    },
    showProjectGaiSuan() {
      this.$refs["产品概览"].showPanelName = "detail";
      this.$nextTick(() => {
        this.$refs["产品概览"].$refs["detail"].$refs[
          "projectEdit"
        ].currTabPane = "4";
      });
    },
    showProjectShouYi() {
      this.$refs["产品概览"].showPanelName = "detail";
      this.$nextTick(() => {
        this.$refs["产品概览"].$refs["detail"].$refs[
          "projectEdit"
        ].currTabPane = "5";
      });
    },
    showMenusPage() {
      this.showPanel = "产品";
      this.$nextTick(() => {
        this.$refs["xmProductComplex"].showPanel = "menus";
      });
    },
    linkProject() {
      this.$refs["xmProductComplex"].showPanelName = "productProjectLink";
    },
    createProduct() {
      this.showPanel = "产品";
      this.$nextTick(() => {
        this.$refs["xmProductComplex"].addProductVisible = true;
      });
    },
  }, //end methods
  components: {
    //在下面添加其它组件
    XmIterationMng,  
    XmProductOverview,
    XmProductAdd, 
    XmProductProjectLinkMng,
    XmProductEdit,
    XmGroupMng, 
  },
  mounted() {
    this.$nextTick(() => {
      this.$mdp.getDictOptions('xmProductPstatus').then(res=>this.dicts['xmProductPstatus']=res)

      //this.maxTableHeight =util.calcTableMaxHeight(this.$refs.pageBody.$el);
    }); 
    this.productId=sessionStorage.getItem(this.productKey)||'' 
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
