<template>
  
    <el-row>
      <el-col 
        :xl="3" :lg="3" :md="3" :sm="3" :xs="5" class="padding-top padding-left"
      >  
      <el-scrollbar v-adaptive>
        <el-steps space="40"
          :active="calcIterationStatusStep"
          finish-status="success"
          direction="vertical"
        >
          <el-step
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
                    @click="jumpTo('iterationMenu')"
                    >需求管理</el-button
                  > 
                  <el-button
                    class="step-btn"
                    type="warning"
                    
                    plain
                    @click="showPanel='iterationMenuMng'"
                    >配置需求范围</el-button
                  >  
											<el-popconfirm @confirm="editSomeFields(xmIteration, 'istatus', '1')" title="将迭代状态改为评审中?">
												<template #reference><el-button  class="step-btn" type="danger" icon="d-caret"  plain>开启需求评审</el-button></template>
											</el-popconfirm>
                </span>
                <span v-if="xmIteration.istatus != i.id">
                  <el-button
                    class="step-btn"
                    type="warning"
                    
                    plain
                    @click="jumpTo('iterationMenu')"
                    >需求管理</el-button
                  > 
                  <el-button
                    class="step-btn"
                    type="warning"
                    
                    plain
                    @click="showPanel='iterationMenuMng'"
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
                    @click="showPanel='iterationMenuMng'"
                    >确认需求范围</el-button
                  > 
                  <el-button
                    class="step-btn"
                    type="warning"
                    
                    plain
                    @click="jumpTo('iterationQuestion')"
                    >缺陷登记</el-button
                  > 
											<el-popconfirm @confirm="editSomeFields(xmIteration, 'istatus', '2')" title="将迭代状态改为计划中?">
												<template #reference><el-button  class="step-btn" type="danger" icon="d-caret"  plain>进入计划会</el-button></template>
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
                    @click="showPanel='detail'"
                    >迭代计划</el-button
                  >
                  <el-button
                    class="step-btn"
                    type="warning"
                    
                    plain
                    @click="jumpTo('iterationTask')"
                    >任务管理</el-button
                  >  
											<el-popconfirm @confirm="editSomeFields(xmIteration, 'istatus', '3')" title="将迭代状态改为研发中?">
												<template #reference><el-button  class="step-btn" type="danger" icon="d-caret"  plain>设为研发中</el-button></template>
											</el-popconfirm>
                </span>
                <span v-if="xmIteration.istatus != i.id">
                  <el-button
                    class="step-btn"
                    type="warning"
                    
                    plain
                    @click="showPanel='detail'"
                    >迭代计划</el-button
                  >
                  <el-button
                    class="step-btn"
                    type="warning"
                    
                    plain
                    @click="jumpTo('iterationTask')"
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
                    @click="jumpTo('iterationTask')"
                    >任务管理</el-button
                  >  
                  <el-button
                    class="step-btn"
                    type="warning"
                    
                    plain
                    @click="jumpTo('iterationRpt')"
                    >效能分析</el-button
                  >  
											<el-popconfirm @confirm="editSomeFields(xmIteration, 'istatus', '4')" title="将迭代状态改为测试中?">
												<template #reference><el-button  class="step-btn" type="danger" icon="d-caret"  plain>设为测试中</el-button></template>
											</el-popconfirm>
                </span>
                <span v-if="xmIteration.istatus != i.id"> 
                  <el-button
                    class="step-btn"
                    type="warning"
                    
                    plain
                    @click="jumpTo('iterationRpt')"
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
                    @click="jumpTo('iterationQuestion')"
                    >缺陷管理</el-button
                  >   
											<el-popconfirm @confirm="editSomeFields(xmIteration, 'istatus', '5')" title="将迭代状态改为待上线?">
												<template #reference><el-button  class="step-btn" type="danger" icon="d-caret"  plain>设为待上线</el-button></template>
											</el-popconfirm>
                </span>
              </el-row>
									<el-row v-else-if="i.id == '5'"
										><!--上线中-->
										<span v-if="xmIteration.istatus == i.id"> 
											<el-popconfirm @confirm="editSomeFields(xmIteration, 'istatus', '6')" title="将迭代状态改为已完成?">
												<template #reference><el-button  class="step-btn" type="danger" icon="d-caret"  plain>设为已完成</el-button></template>
											</el-popconfirm>
										</span>
										<span v-if="xmIteration.istatus != i.id"  ></span>
									</el-row>
									<el-row v-else-if="i.id == '6'"
										><!--已完成-->
										<span v-if="xmIteration.istatus == i.id"> 
											<el-popconfirm @confirm="editSomeFields(xmIteration, 'istatus', '7')" title="将迭代状态改为已关闭?">
												<template #reference><el-button  class="step-btn" type="danger" icon="d-caret"  plain>设为已关闭</el-button></template>
											</el-popconfirm>
										</span>
										<span v-if="xmIteration.istatus != i.id"  ></span>
									</el-row>
									<el-row v-else-if="i.id == '7'"
										><!--已关闭-->
										<span v-if="xmIteration.istatus == i.id"> 
										<el-popconfirm @confirm="editSomeFields(xmIteration, 'istatus', '0')" title="将迭代状态改为已打开?">
												<template #reference><el-button  class="step-btn" type="danger" icon="d-caret"  plain>重新打开</el-button></template>
											</el-popconfirm>
										</span> 
									</el-row>  
            </template>
          </el-step>
        </el-steps> 
      </el-scrollbar> 
      </el-col>
      <el-col  :xl="21" :lg="21" :md="21" :sm="21" :xs="19" class="padding-left padding-right">
        <el-tabs v-model="showPanel" >  
					<el-tab-pane label="迭代概览"  name="overview" > 
            <xm-iteration-overview v-show="showPanel=='overview'" :xm-iteration="xmIteration" @edit-fields="onEditFields"/>

 				 
					</el-tab-pane> 
					<el-tab-pane label="迭代详情"  name="detail" > 
						 
            <xm-iteration-edit subOpType="edit" v-if="showPanel=='detail'" :xm-iteration="xmIteration" @edit-fields="onEditFields" />

					</el-tab-pane>
					<el-tab-pane label="配置需求范围"  name="iterationMenuMng" > 
            <xm-iteration-menu-mng class="padding-right" v-if="showPanel=='iterationMenuMng'" :xm-iteration="xmIteration"  ref="iterationMenuMng" />

 				 
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
 import XmIterationOverview from './XmIterationOverview.vue';
import XmIterationEdit from './XmIterationEdit.vue'; 
import XmIterationMenuMng from '../xmIterationMenu/XmIterationMenuMng.vue';  
	import {  loadTasksToXmIterationState } from '@/api/xm/core/xmIterationState';
import {  listXmIterationWithState } from "@/api/xm/core/xmIteration";
import {editSomeFieldsXmIteration } from '@/api/xm/core/xmIteration'; 


export default {
  components: {XmIterationOverview,XmIterationEdit, XmIterationMenuMng },
  computed: {
    ...mapState(useUserStore,["userInfo"]), 
    ...mapState(useXmStore,["xmIteration"]),
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
  },

  watch:{
  },
  data() {
    return {
      dicts:{iterationStatus:[]},
      load:{calcIteration:false,},
      showPanel:'overview',
      maxTableHeight:300,
    };
  },

  methods:{
      jumpTo(name){
        this.$router.push({
          name:name,
          query:{
            iterationId:this.xmIteration.id
          }
        })
      },
			loadTasksToXmIterationState(){ 
				this.load.calcIteration=true;
				loadTasksToXmIterationState({id:this.xmIteration.id}).then(res=>{ 
					var tips =res.tips; 
          if(tips.isOk){
            listXmIterationWithState({id:this.xmIteration.id}).then(res2=>{ 
              this.load.calcIteration=false;
              var tips2=res2.tips;
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
    onMenuToolBarSelect(menuIndex){
      this.showPanel=menuIndex;
    },
    onEditFields(row){
      Object.assign(this.xmIteration,row)
      this.$emit('edit-fields',row)
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
          useXmStore2().setXmIteration(row)
          this.$emit('edit-fields',params)
        }else{ 
          this.$notify({position:'bottom-left',showClose:true,message:tips.msg,type:tips.isOk?'success':'error'})
        }
      }).catch((e)=>Object.assign(this.editForm,this.editFormBak))
    },
    tabClick(tab){  
				this.showPanel=tab.name 
			}, 
  },

  mounted() { 
    this.$mdp.getDictOptions('iterationStatus').then(res=>this.dicts.iterationStatus=res) 
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
