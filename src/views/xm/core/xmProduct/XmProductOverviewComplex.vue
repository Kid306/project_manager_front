<template>
  <el-row>
    <el-col :span="3" class="padding-top padding-left"> 
      <el-scrollbar v-adaptive> 
        <el-steps :active="calcProductPstatusStep" finish-status="success" direction="vertical">
          <el-step v-for="(i, index) in dicts['xmProductPstatus']" :title="i.name" :key="index">
            <template #description>
              <el-row v-if="i.id == '0'"><!--打开-->
                <span v-if="xmProduct.pstatus == i.id">
                  <el-button class="step-btn" type="warning" plain @click="jumpTo('productMenu')">需求管理</el-button>
                  <el-button class="step-btn" type="warning" plain @click="showPanelName = 'setting'">产品设置</el-button>
                  <el-button class="step-btn" type="warning" plain @click="linkProject()">关联项目</el-button>

                  <el-popconfirm @confirm="editXmProductSomeFields(xmProduct, 'pstatus', '1')" title="将产品状态设为研发中?">

                    <template #reference><el-button class="step-btn" type="danger" icon="d-caret" plain>设为研发中 </el-button>
                    </template>

                  </el-popconfirm>
                </span>
                <span v-if="xmProduct.pstatus != i.id">
                  <el-button class="step-btn" type="warning" plain @click="jumpTo('productMenu')">需求管理</el-button>
                  <el-button class="step-btn" type="warning" plain @click="showPanelName = 'setting'">产品设置</el-button>
                  <el-button class="step-btn" type="warning" plain @click="linkProject()">关联项目</el-button>
                </span>
              </el-row>
              <el-row v-else-if="i.id == '1'"><!--研发中-->
                <span v-if="xmProduct.pstatus == i.id">
                  <el-button class="step-btn" type="warning" plain @click="jumpTo('productIteration')">迭代管理</el-button>
                  <el-button class="step-btn" type="warning" plain @click="jumpTo('productQuestion')">缺陷管理</el-button>
                  <el-button class="step-btn" type="warning" plain @click="jumpTo('productProjectLink')">项目管理</el-button>
                  <el-button class="step-btn" type="warning" plain @click="jumpTo('productRpt')">效能分析</el-button>
                  <el-popconfirm @confirm="editXmProductSomeFields(xmProduct, 'pstatus', '2')" title="将产品状态设为已完成?">

                    <template #reference><el-button class="step-btn" type="danger" icon="d-caret" plain>设为已完成 </el-button>
                    </template>

                  </el-popconfirm>
                </span>
                <span v-if="xmProduct.pstatus != i.id">
                  <el-button class="step-btn" type="warning" plain @click="jumpTo('productIteration')">迭代管理</el-button>
                  <el-button class="step-btn" type="warning" plain @click="jumpTo('productQuestion')">缺陷管理</el-button>
                  <el-button class="step-btn" type="warning" plain @click="jumpTo('productProjectLink')">项目管理</el-button>
                  <el-button class="step-btn" type="warning" plain @click="jumpTo('productRpt')">效能分析</el-button>
                </span>
              </el-row>
              <el-row v-else-if="i.id == '2'"><!--已完成-->
                <span v-if="xmProduct.pstatus == i.id">

                  <el-popconfirm @confirm="editXmProductSomeFields(xmProduct, 'pstatus', '3')" title="将产品状态设为已关闭?">

                    <template #reference><el-button class="step-btn" type="danger" icon="d-caret" plain>设为已关闭 </el-button>
                    </template>

                  </el-popconfirm>
                </span>
                <span v-if="xmProduct.pstatus != i.id"></span>
              </el-row>
              <el-row v-else-if="i.id == '3'"><!--已关闭-->
                <span v-if="xmProduct.pstatus == i.id">
                  <el-popconfirm @confirm="editXmProductSomeFields(xmProduct, 'pstatus', '0')" title="将产品状态设为打开状态?">

                    <template #reference><el-button class="step-btn" type="danger" icon="d-caret" plain>重新打开 </el-button>
                    </template>

                  </el-popconfirm>
                </span>
                <span v-if="xmProduct.pstatus != i.id"></span>
              </el-row>
            </template>
          </el-step>
        </el-steps>
      </el-scrollbar>
    </el-col>
    <el-col :span="21" class="padding-left padding-right">
      <el-tabs v-model="showPanelName">
        <el-tab-pane label="产品概览" name="overview">
          <xm-product-overview v-show="showPanelName == 'overview' && xmProduct && xmProduct.id" :xm-product="xmProduct" />

        </el-tab-pane>
        <el-tab-pane label="设置" name="setting">
          <xm-product-setting v-if="showPanelName == 'setting'" :xm-product="xmProduct" />
        </el-tab-pane>
        <el-tab-pane label="产品详情" name="detail">
          <xm-product-edit v-if="showPanelName == 'detail'" :xm-product="xmProduct" subOpType="edit"/>
        </el-tab-pane>
        <el-tab-pane label="配置关联项目" name="productProjectLink">
          <xm-product-project-link-mng v-if="showPanelName == 'productProjectLink'" :xm-product="xmProduct" />
        </el-tab-pane>
        <el-tab-pane label="执行数据汇总计划" name="productCalc">
          <div v-if="showPanelName == 'productCalc'" class="padding">
            <div class="padding">
              <el-button type="primary" @click="loadTasksToXmProductState"
                v-loading="load.calcProduct">计算产品汇总数据</el-button>
              <br />
              <font color="blue" style="font-size:10px;">将从项目任务及产品任务中汇总进度、预算工作量、实际工作量、预算金额、实际金额、缺陷数、需求数等数据到产品统计表</font>
            </div>
            <div class="padding">
              <el-button type="primary" @click="loadTasksToXmMenuState" v-loading="load.calcMenu">计算所有需求数据</el-button>
              <br />
              <font color="blue" style="font-size:10px;">将从项目任务汇总进度、预算工作量、实际工作量、预算金额、实际金额等数据到需求统计表</font>
            </div>
          </div>
        </el-tab-pane>
        <el-tab-pane label="当前审批流" name="currFlow">
          <task-mng v-if="showPanelName === 'currFlow'" ref="currFlow" :pbiz-id="xmProduct.id" />
        </el-tab-pane>
        <el-tab-pane label="历史审批流" name="hisFlow">
          <procinst-mng v-if="showPanelName === 'hisFlow'" ref="hisFlow" isAll="true" :pbiz-id="xmProduct.id" />
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
import { useXmStore, useXmStore2 } from '@/store/modules/xm'
import XmProductOverview from './XmProductOverview.vue';
import XmProductEdit from './XmProductEdit.vue';
import XmProductSetting from './XmProductSetting.vue';
import XmProductProjectLinkMng from '../xmProductProjectLink/XmProductProjectLinkMng.vue';
import { loadTasksToXmProductState } from '@/api/xm/core/xmProductState';
import { listXmProductWithState } from '@/api/xm/core/xmProduct';
import { loadTasksToXmMenuState } from '@/api/xm/core/xmMenuState';
import TaskMng from '@/views/mdp/workflow/ru/task/TaskListAssigneeToMe.vue';
import ProcinstMng from '@/views/mdp/workflow/hi/procinst/ProcinstListAll.vue';

import { editXmProductSomeFields } from "@/api/xm/core/xmProduct";


export default {
  components: { XmProductOverview, XmProductEdit, XmProductProjectLinkMng, TaskMng, ProcinstMng, XmProductSetting },
  computed: {
    ...mapState(useUserStore, ["userInfo"]),
    ...mapState(useXmStore, ["xmProduct"]),
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
  },
  watch: {
  },
  data() {
    return {

      dicts: { xmProductPstatus: [] },
      maxTableHeight: 500,
      showPanelName: 'overview',
      load: { calcProduct: false, calcMenu: false }
    };
  },

  methods: {

    jumpTo(name) {
      this.$router.push({
        name: name,
        query: {
          productId: this.xmProduct.id
        }
      })
    },
    loadTasksToXmProductState: function () {
      this.load.calcProduct = true;

      let params = { productId: this.xmProduct.id };
      loadTasksToXmProductState(params).then((res) => {
        this.load.calcProduct = false;
        var tips = res.tips;
        if (tips.isOk) {
          this.getProduct(this.xmProduct.id)
        }
        this.$notify({ position: 'bottom-left', showClose: true, message: tips.msg, type: tips.isOk ? 'success' : 'error' });
      }).catch(err => this.load.calcProduct = false);
    },

    getProduct(id) {
      listXmProductWithState({ id: id }).then(res => {
        var tips = res.tips;
        if (tips.isOk) {
          Object.assign(this.xmProduct, res.data[0])
          localStorage.setItem("xm-product-info-route", JSON.stringify(this.xmProduct))
          this.$emit('edit-fields', this.xmProduct)
          this.showInfo = true;
        } else {

        }
      })
    },

    loadTasksToXmMenuState: function () {
      this.load.calcMenu = true;
      let params = { productId: this.xmProduct.id };
      loadTasksToXmMenuState(params).then((res) => {
        this.load.calcMenu = false;
        var tips = res.tips;
        this.$notify({ position: 'bottom-left', showClose: true, message: tips.msg, type: tips.isOk ? 'success' : 'error' });
      }).catch(err => this.load.calcMenu = false);
    },
    onMenuToolBarSelect(menuIndex) {
      this.showPanelName = menuIndex;
    },
    showCurrFlow() {
      this.showPanelName = "currFlow";
    },
    showHisFlow() {
      this.showPanelName = "hisFlow";
    },
    showDetail() {
      this.showPanelName = "detail";
    },
    showProjectGaiSuan() {
      this.showPanelName = "detail";
      this.$nextTick(() => {
        this.$refs[
          "projectEdit"
        ].currTabPane = "4";
      });
    },
    showProjectShouYi() {
      this.showPanelName = "detail";
      this.$nextTick(() => {
        this.$refs[
          "projectEdit"
        ].currTabPane = "5";
      });
    },
    linkProject() {
      this.showPanelName = "productProjectLink";
    },
    createProduct() {
      this.infotype = "产品";
      this.$nextTick(() => {
        this.addProductVisible = true;
      });
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
      this.showPanelName = tab.name;
    },

    editXmProductSomeFields(row, fieldName, $event) {
      var func = (params) => {
        editXmProductSomeFields(params).then(res => {
          var tips = res.tips;
          if (tips.isOk) {
            this.$emit('edit-fields', params)
            Object.assign(row, params)
            useXmStore2().setXmProduct(row)
          } else {
            this.$notify({ position: 'bottom-left', showClose: true, message: tips.msg, type: tips.isOk ? 'success' : 'error' })
          }
        })
      }
      var params = { '$pks': [row.id] };
      params[fieldName] = $event
      func(params)
    },
  },

  mounted() {
    this.$mdp.getDictOptions('xmProductPstatus').then(res => {
      this.dicts.xmProductPstatus = res
    })
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

.step-btn {
  margin-left: 0px;
  margin-bottom: 5px;
}
</style>
