<template>
  
      <el-row v-adaptive="{bottom:50}"  :gutter="10">
          <el-col :span="8" >
            <el-card class="box-card" style="padding:0px ;height:425px">
              <template #header>
                <span>项目信息</span>

                <el-popover :show-after="200"
                  placement="bottom"
                  title="标题"
                  width="200"
                  trigger="click" >

                  <div class="padding">
                    <el-button type="primary" @click="loadTasksToXmProjectState" v-loading="load.calcProject">计算项目数据</el-button>
                    <br/>
                      <font color="blue" style="font-size:10px;">将从项目任务中汇总进度、预算工作量、实际工作量、预算金额、实际金额、缺陷数、需求数等数据到项目统计表</font>
                  </div>
                  <!-- <div class="padding">
                    <el-button  type="primary" @click="loadTasksSettleToXmProjectState"  v-loading="load.calcSettle">计算项目结算数据</el-button>
                    <br/>
                      <font color="blue"  style="font-size:10px;">将从项目任务汇总结算数据项目统计表</font>
                  </div>  -->
                  <template #reference><el-button style="float:right;" icon="video-play" type="text">统计  </el-button> </template>
 
                  </el-popover> 
              </template>
              <el-row style="margin-bottom:10px"> 
                  <span>项目负责人</span>&nbsp;<span><b>{{pmUsername}}</b></span> 
              </el-row>
              <el-row style="margin-bottom:10px">
                <el-col :span="8">
                  <div class="item">
                    <div class="icon1" style="background-color:  rgb(79, 140, 255);"> 
                      <icon icon="ep:right"/>
                    </div>
                    <div class="info">
                      <div v-text="totalTask" ></div>
                      <div class="title">总任务量</div>
                    </div>
                  </div>
                </el-col>
                <el-col :span="8">
                  <div class="item">
                    <div class="icon1" style="background-color:  rgb(255, 153, 51);"> 
                      <icon icon="ep:loading"/>
                    </div>
                    <div class="info">
                      <div v-text="notStart" ></div>
                      <div class="title">待完成</div>
                    </div>
                  </div>
                </el-col>
                <el-col :span="8">
                  <div class="item">
                    <div class="icon1" style="background-color:  rgb(0, 153, 51);">
                      <i class="check"></i>
                      <icon icon="ep:check"/>
                    </div>
                    <div class="info">
                      <div v-text="competeTasks"  ></div>
                      <div class="title">已完成</div>
                    </div>
                  </div>
                </el-col>
              </el-row>
              <el-row style="margin-bottom:10px">
                <div class="item">
                  <div class="icon2" style="background-color:  rgb(204, 204, 204);"> 
                      <icon icon="ep:calendar"/>
                  </div>
                  <div class="info"> 
                    <div class="title">周期：{{taskStartTime+'~'+taskEndTime}}</div>
                  </div>
                </div>
              </el-row>
              <el-row style="margin-bottom:10px">
                <div class="item">
                  <div class="icon2" style="background-color:  rgb(204, 204, 204);"> 
                      <icon icon="ep:star"/>
                  </div>
                  <div class="info">
                    <div class="title"> 需求数： {{this.selProject.menuCnt||0}}</div>
                  </div>
                </div>
              </el-row>
              <el-row style="margin-bottom:10px">
                <div class="item">
                  <div class="icon2" style="background-color:  rgb(204, 204, 204);"> 
                      <icon icon="ep:alarm-clock"/>
                  </div>
                  <div>
                    <div class="progress-item">
                      <el-progress :percentage="realProgress" />

                      <el-tag v-if="planProgress>realProgress" type="danger" effect="dark">整体进度 落后{{ planProgress-realProgress }}%</el-tag>
                          <el-tag v-else-if="planProgress<realProgress" type="warning" effect="dark">整体进度 超前{{ realProgress-planProgress }}%</el-tag>
                          <el-tag v-else effect="dark" type="success">整体进度 理想</el-tag>
                      <div class="title" ></div>
                    </div>
                  </div>
                </div>
              </el-row>
            </el-card>
          </el-col>
          <el-col :span="8" >
            <el-card class="box-card" style="height:425px">
              <template #header>
                <span>总预算情况</span>
              </template >
              <div> 
                <Echart :options="drawCostPie()" :height="320"/>
              </div>
            </el-card>
          </el-col>

          <el-col :span="8" >
            <el-card class="box-card" style="height:425px">
              <template #header>
                <span>关联产品和迭代情况</span>
              </template >
              <div>
                 <Echart :options="drawIterationProduct()" :height="350"/>
              </div>
            </el-card>
          </el-col>
          <el-col :span="16" >
            <el-card class="box-card" style="padding:0px ;height:425px">
              <template #header>
                <span>项目工时</span>
              </template > 
                <el-row> 
                    <el-col :span="8">
                      <div>
                        <div style="text-align:center;">
                          <span style="font-size:24px;" v-text="this.selProject.budgetWorkload"  ></span>
                          <span style="font-size:12px;">h</span>
                        </div>
                        <div style="text-align:center;font-size:12px;">总估工时</div>
                      </div>
                    </el-col>
                    <el-col :span="8">
                      <div>
                        <div style="text-align:center;">
                          <span style="font-size:24px;" v-text="this.selProject.estimateWorkload"  ></span>
                          <span style="font-size:12px;">h</span>
                        </div>
                        <div style="text-align:center;font-size:12px;">应完成工时</div>
                      </div>
                    </el-col>
                    <el-col :span="8">
                      <div>
                        <div style="text-align:center;">
                          <span style="font-size:24px;" v-text="this.selProject.actWorkload"  ></span>
                          <span style="font-size:12px;">h</span>
                        </div>
                        <div style="text-align:center;font-size:12px;" title="已登记的工时">已完成工时</div>
                      </div>
                    </el-col> 
                </el-row>
                <el-row  > 
                    <el-col :span="8">
                      <div title="总估工时-已完成工时">
                        <div style="text-align:center;">
                          <span style="font-size:24px;" v-text="remainWorkload"  ></span>
                          <span style="font-size:12px;">h</span>
                        </div>
                        <div style="text-align:center;font-size:12px;">剩余工时</div>
                      </div>
                    </el-col>
                    <el-col :span="8">
                      <div title="已完成工时-当前应完成工时">
                        <div style="text-align:center;">
                          <span style="font-size:24px;" v-text="deviation"  ></span>
                          <span style="font-size:12px;">h</span>
                        </div>
                        <div style="text-align:center;font-size:12px;">预估偏差</div>
                      </div>
                    </el-col>
                    <el-col :span="8">
                      <div title="（已完成工时-当前应完成工时）/ 当前应完成工时">
                        <div style="text-align:center;">
                          <span style="font-size:24px;" v-text="deviationRate||0"  ></span>
                          <span style="font-size:12px;">%</span>
                        </div>
                        <div style="text-align:center;font-size:12px;">预估偏差率</div>
                      </div>
                    </el-col> 
                </el-row>
                <el-row>
                  <span style="margin-left:20px;" title="应完成工时/总预估工时">预计进度</span>
                  <el-progress style="width: 90%;margin-left:20px;margin-top: 10px;margin-bottom: 20px;"   :stroke-width="14" :percentage="planProgress" />
                </el-row>
                <el-row>
                  <span style="margin-left:20px;" title="实际工时/总预估工时">实际进度</span>
                  <el-progress style="width: 90%;margin-left:20px;margin-top: 10px;"  color="#47CBF6" :stroke-width="14" :percentage="realProgress" />
                </el-row> 
            </el-card>
          </el-col>
          <el-col :span="8" >
            <el-card class="box-card" style="height:425px">
              <template #header>
                <span>合作开发工作量分布</span>
              </template >
              <div>
                 
                <Echart :options="drawWorkload()" :height="320"/>
              </div>
            </el-card>
          </el-col>
          <el-col :span="8" >
            <el-card class="box-card" style="height:425px">
              <template #header>
                <span>所有工作项数量分布</span>
              </template >
              <div>
                 <Echart :options="drawAllBar()" :height="320"/>
              </div>
            </el-card>
          </el-col>
          <el-col :span="8" >
            <el-card class="box-card" style="height:425px">
              <template #header>
                <span>需求情况</span>
              </template >
              <div> 
                <Echart :options="drawMenuPie()" :height="320"/>
              </div>
            </el-card>
          </el-col>

          <el-col :span="8" >
            <el-card class="box-card" style="padding:0px ;height:425px">
              <template #header>
                <span>任务状态分布</span>
              </template >
              <div>
                 
                <Echart :options="drawTask()" :height="350"/>
              </div>
            </el-card>
          </el-col>
          <el-col :span="8" >
            <el-card class="box-card" style="height:425px">
              <template #header>
                <span>测试用例情况</span>
              </template >
              <div>
                 
                <Echart :options="drawTestCasePie()" :height="320"/>
              </div>
            </el-card>
          </el-col>

          <el-col :span="8" >
            <el-card class="box-card" style="height:425px">
              <template #header>
                <span>缺陷情况</span>
              </template >
              <div> 
                
                <Echart :options="drawPieBug()" :height="320"/>
              </div>
            </el-card>
          </el-col>
        </el-row>
  
</template>

<script>
import util from "@/components/mdp-ui/js/util"; // 全局公共库
import { mapState } from 'pinia'
import { useUserStore } from '@/store/modules/user'
import { useXmStore,useXmStore2 } from '@/store/modules/xm'

	import {  getDefOptions} from '@/api/xm/core/xmProject';
	import { listXmProject} from '@/api/xm/core/xmProject';
  import {  loadTasksToXmProjectState , loadTasksSettleToXmProjectState} from '@/api/xm/core/xmProjectState';
  
export default {
  computed: {
    ...mapState(useUserStore,["userInfo"]),
    ...mapState(useXmStore,['projectInfo']),
    competeTasks: function (){
      return this.selProject.taskCnt-this.selProject.taskUnstartCnt-this.selProject.taskExecCnt;
    },
    notStart: function() {
      return  this.selProject.taskUnstartCnt+this.selProject.taskExecCnt;
    },
    totalTask: function() {
      return this.selProject.taskCnt;
    },
    taskStartTime: function (){
      return this.selProject.startTime?this.selProject.startTime.substring(0,10):'';
    },
    taskEndTime: function (){
      return this.selProject.endTime?this.selProject.endTime.substring(0,10):'';
    },
    pmUsername: function (){
      return this.selProject.pmUsername;
    },
    workloadProgress:function (){
      if(!this.selProject.actWorkload||!this.selProject.budgetWorkload){
        return 0;
      }
      return Math.round(this.selProject.actWorkload/this.selProject.budgetWorkload*100);
    },
    deviation:function (){

        return  Math.round(this.selProject.actWorkload-this.selProject.estimateWorkload)

    },
    deviationRate:function (){
      if(!this.selProject.estimateWorkload || this.selProject.estimateWorkload==0){
        return 100
      }
      return Math.round(this.deviation/this.selProject.estimateWorkload*100);
    },
    remainWorkload:function (){
      return Math.round(this.selProject.budgetWorkload - this.selProject.actWorkload);
    },
    planProgress:function (){
      if(!this.selProject.estimateWorkload||!this.selProject.budgetWorkload){
        return 0;
      }
        return Math.round(this.selProject.estimateWorkload/this.selProject.budgetWorkload*100);
    },
    realProgress:function (){
      if(!this.selProject.actWorkload||!this.selProject.budgetWorkload){
        return 0;
      }
      if(this.selProject.actWorkload < this.selProject.budgetWorkload){
        return Math.round(this.selProject.actWorkload/this.selProject.budgetWorkload*100)
      }else{
        return 100;
      }
    },
    xmProjectStateCpd(){
      return this.selProject
    },
    calcProjectStatusStep(){
      if(this.dicts['projectStatus'] && this.selProject){
        var index=this.dicts['projectStatus'].findIndex(i=>{
          if(i.id==this.selProject.status){
            return true;
          }else{
            return false;
          }
        })
        return index+1;
      }else{
        return 0;
      }
    }

  },

  props:['selProject'],
  watch:{
    xmProjectStateCpd:function(){ 
    }
  },
  data() {
    return {
      load:{list:false,add:false,calcProject:false,calcSettle:false},
      isActive: true,
      maxTableHeight:300,
      dicts: getDefOptions(),//下拉选择框的所有静态数据 params=[{categoryId:'0001',itemCode:'sex'}] 返回结果 {'sex':[{optionValue:'1',optionName:'男',seqOrder:'1',fp:'',isDefault:'0'},{optionValue:'2',optionName:'女',seqOrder:'2',fp:'',isDefault:'0'}]}
    };
  },

  methods:{
    drawAllBar() { 
      let option = {
        tooltip: {
          trigger: 'axis',
          axisPointer: {
            type: 'shadow'
          }
        },
        grid: {
          left: '3%',
          right: '4%',
          bottom: '10%',
          containLabel: true
        },
        yAxis: {
          type: 'value'
        },
        xAxis: {
          type: 'category',
          data: ['需求', '任务','用例', '缺陷']
        },
        series: [
          {
            label: {
              normal:{
                show: true,
                position: 'top',
                color:'#000000',
              }
            },
            data: [
              {
                value: this.selProject.menuCnt,
                itemStyle: {
                  normal:{
                    color: '#91CC75'
                  }
                }
              },
              {
                value: this.selProject.taskCnt,
                itemStyle: {
                  normal:{
                    color: '#FAC858'
                  }
                }
              },
              {
                value: this.selProject.testCases,
                itemStyle: {
                  normal:{
                    color: '#99CCFF'
                  }
                }
              },
              {
                value: this.selProject.bugCnt,
                itemStyle: {
                  normal:{
                    color: '#EE6666'
                  }
                }
              },
            ],
            type: 'bar'
          }
        ]
      }; 
      return option;
    },

    drawMenuPie() {
       let option = {
						title: {
							left: 'center'
						},
						tooltip: {
							trigger: 'item',

						},
						calculable: true,

						legend:{
              show:true,
							bottom: 'bottom',
							data:['打开','执行中','已完成','已关闭'],
						},
						graphic: {
							type: 'text',
							left: 'center',
              top: '40%',
							style: {
							// text: '总数',
							text:
								'需求数'+this.selProject.menuCnt,

							textAlign: 'center',
							fill: '#333',
							width: 30,
							height: 30,
							fontSize: 14
							}
						},

						series: [
							{
							type: 'pie',
              center:['50%','40%'],
							radius: ['35%','60%'],
							data:[{name:'打开',value:this.selProject.menuUnstartCnt},{name:'执行中',value:this.selProject.menuExecCnt},{name:'已完成',value:this.selProject.menuFinishCnt},{name:'已关闭',value:this.selProject.menuCloseCnt}],
							emphasis: {
								itemStyle: {
								shadowBlur: 10,
								shadowOffsetX: 0,
								shadowColor: 'rgba(0, 0, 0, 0.5)'
								}
							},

							label: {
								show: true,
								formatter:'{b}: {c}  ({d}%)'
							},
							}
						]
      };
      return option
    },

    drawTestCasePie() {
       let option = {
						title: {
							left: 'center'
						},
						tooltip: {
							trigger: 'item',

						},
						calculable: true,

						legend:{
              show:true,
							bottom: 'bottom',
							data:['设计中','执行中','已完成'],
						},
						graphic: {
							type: 'text',
							left: 'center',
              top: '40%',
							style: {
							// text: '总数',
							text:
								'用例数'+this.selProject.testCases,

							textAlign: 'center',
							fill: '#333',
							width: 30,
							height: 30,
							fontSize: 14
							}
						},

						series: [
							{
							type: 'pie',
              center:['50%','40%'],
							radius: ['35%','60%'],
							data:[{name:'设计中',value:this.selProject.designCases},{name:'执行中',value:this.selProject.execCases},{name:'已完成',value:this.selProject.finishCases}],
							emphasis: {
								itemStyle: {
								shadowBlur: 10,
								shadowOffsetX: 0,
								shadowColor: 'rgba(0, 0, 0, 0.5)'
								}
							},

							label: {
								show: true,
								formatter:'{b}: {c}  ({d}%)'
							},
							}
						]
      };

      return option
    },
    drawTask() {
       let option = {
						title: {
							left: 'center'
						},
						tooltip: {
							trigger: 'item',

						},
						calculable: true,

            grid: {
              left: '3%',
              right: '4%',
              bottom: '10%',
              containLabel: true
            },
            yAxis: {
              type: 'value'
            },
            xAxis: {
              type: 'category',
							data:['未开始','执行中','已完工','已结算','已关闭'],
            },
						series: [
							{
              label: {
                normal:{
                  show: true,
                  position: 'top',
                  color:'#000000',
                }
              },
							type: 'bar',
              center:['50%','40%'],

							data:[
                {name:'未开始',value:this.selProject.taskUnstartCnt,
                itemStyle: {
                  normal:{
                    color: '#FAC858'
                  }
                }
                },
                {name:'执行中',value:this.selProject.taskExecCnt,
                itemStyle: {
                  normal:{
                    color: '#91CC75'
                  }
                }},
                {name:'已完工',value:this.selProject.taskFinishCnt,
                itemStyle: {
                  normal:{
                    color: '#FAC858'
                  }
                }},
                {name:'已结算',value:this.selProject.taskSetCnt,
                itemStyle: {
                  normal:{
                    color: '#99CCFF'
                  }
                }},
                {name:'已关闭',value:this.selProject.taskCloseCnt,
                itemStyle: {
                  normal:{
                    color: '#EE6666'
                  }
                }}],
							}
						]
      };

      return option
    },
    drawPieBug() { 
      let option = {
        title: {
							left: 'center'
						},
        tooltip: {
          trigger: 'item',
          formatter: '{b} : {c} ({d}%)'
        },
        legend: {
          show:true,
					bottom: 'bottom',
          data:['已激活','已确认','已解决','已关闭']
        },
        graphic: {
          type: 'text',
          left: 'center',
          top: '40%',
          style: {
          // text: '总数',
          text:
            '缺陷数'+this.selProject.bugCnt,

          textAlign: 'center',
          fill: '#333',
          width: 30,
          height: 30,
          fontSize: 14
          }
        },
        series: [
          {

            type: 'pie',
            center:['50%','40%'],
            radius: ['35%','60%'],
            label:{
								show: true,
								formatter:'{b}: {c}  ({d}%)'
            },
            data: [
              {value: this.selProject.activeBugs,
                itemStyle: {
                  normal:{
                    color: '#FAC858'
                  }
                },
                name: '已激活'},
              {value: this.selProject.confirmedBugs,
                itemStyle: {
                  normal:{
                    color: '#EE6666'
                  }
                },
                name: '已确认'},
              {value: this.selProject.resolvedBugs,
                itemStyle: {
                  normal:{
                    color: '#91CC75'
                  }
                },
                name: '已解决'},
              {value: this.selProject.closedBugs,
                itemStyle: {
                  normal:{
                    color: '#5470C6'
                  }
                },
                name: '已关闭'},
            ],
          }
        ]
      };
      return option
    },
    drawCostPie() { 
      let option = {
        tooltip: {
          trigger: 'item',
          formatter: '{b} : {c} ({d}%)'
        },
        legend: {
          bottom: 10,
          left: 'center',
        },
        series: [
          {
            center:['55%','40%'],//饼图位置
            type: 'pie',
            radius: '50%',//饼图半径大小
            label:{            //饼图图形上的文本标签
              normal:{
                show:true,
                position:'outer', //标签的位置:外部
                textStyle : {
                  fontWeight : 100 ,
                  fontSize: document.body.clientWidth / 120, //标签字体大小
                  color: "#000000"
                },
                formatter:'{b}\n{c}({d}%)',//b：name,c:value,d:占比
                alignTo:'edge',
                margin:10
              }
            },
            data: [
              {value: this.selProject.budgetNouserAt,
                itemStyle: {
                  normal:{
                    color: '#FAC858'
                  }
                },
                name: '非人力'},
              {value: this.selProject.budgetIuserAt,
                itemStyle: {
                  normal:{
                    color: '#73C0DE'
                  }
                },
                name: '内部人力'},
              {value: this.selProject.budgetOuserAt,
                itemStyle: {
                  normal:{
                    color: '#5470C6'
                  }
                },
                name: '外购人力'},
            ],
            emphasis: {
              itemStyle: {
                shadowBlur: 10,
                shadowOffsetX: 0,
                shadowColor: 'rgba(0, 0, 0, 0.5)'
              }
            }
          }
        ]
      };

      return option
    },
    drawWorkload() {
       let option = {
        tooltip: {
          trigger: 'item',
          formatter: '{b} :<br/> {c} ({d}%)'
        },
        legend: {
          bottom: 10,
          left: 'center',
        },
        graphic: {
          type: 'text',
          left: 'center',
          top: '40%',
          style: {
          // text: '总数',
          text:
            '总工时:'+this.selProject.budgetWorkload,

          textAlign: 'center',
          fill: '#333',
          width: 30,
          height: 30,
          fontSize: 14
          }
        },
        series: [
          {
            type: 'pie',
            center:['50%','40%'],
            radius: ['35%','60%'],
            label:{            //饼图图形上的文本标签
              normal:{
                show:true,
                position:'outer', //标签的位置:外部
                textStyle : {
                  fontWeight : 100 ,
                  fontSize: document.body.clientWidth / 120, //标签字体大小
                  color: "#000000"
                },
                formatter:'{b}\n{c}({d}%)',//b：name,c:value,d:占比
                alignTo:'edge',
                margin:10
              }
            },

            data: [
              {value: this.selProject.budgetIuserWorkload,
                itemStyle: {
                  normal:{
                    color: '#91CC75'
                  }
                },
                name: '内部人力'},
              {value: this.selProject.budgetOuserWorkload,
                itemStyle: {
                  normal:{
                    color: '#3BA272'
                  }
                },
                name: '外购人力'},
            ],
            emphasis: {
              itemStyle: {
                shadowBlur: 10,
                shadowOffsetX: 0,
                shadowColor: 'rgba(0, 0, 0, 0.5)'
              }
            }
          }
        ]
      };
      return option
    },
    drawIterationProduct() {
       let option = {
        tooltip: {
          trigger: 'axis',
          formatter: '{b} : {c}',
          axisPointer: {            // 坐标轴指示器，坐标轴触发有效
            type: 'shadow'        // 默认为直线，可选为：'line' | 'shadow'
          },
        },
        xAxis: {
          type: 'category',
          data: ['产品数', '迭代数']
        },
        yAxis: {
          type: 'value'
        },
        series: [{
            label: {
              normal:{
                show: true,
                position: 'top',
                color:'#000000',
              }
            },

          data: [
            {
                value: this.selProject.productCnt,
                itemStyle: {
                  normal:{
                    color: '#91CC75'
                  }
                }
              },
              {
                value: this.selProject.iterationCnt,
                itemStyle: {
                  normal:{
                    color: '#FAC858'
                  }
                }
              },

        ],
          type: 'bar',
        }]
      };
      return option
    },


    loadTasksToXmProjectState(){
        var row=this.selProject;
        var params={projectId:row.id}
        this.load.calcProject=true;
      loadTasksToXmProjectState(params).then((res1) => {
          let tips=res1.tips
          if(!tips.isOk){
            this.load.calcProject=false
            this.$message({showClose:true,message: tips.msg, type: tips.isOk?'success':'error'});
            return;
          }
           listXmProject({id:row.id}).then(res=>{ 
            var tips = res.tips; 
            this.load.calcProject=false; 
            this.$message({showClose:true,message: tips.msg, type: tips.isOk?'success':'error'}); 
            if(tips.isOk){ 
              var selProject=res.data[0] 
              this.$emit("edit-fields",selProject);
            }
          })

        }).catch( err  => this.load.calcProject=false );
    },
    loadTasksSettleToXmProjectState(){
        var row=this.selProject;
        var params={projectId:row.id}
      loadTasksSettleToXmProjectState(params).then((res) => {
          this.load.calcProject=false;
          var tips=res.tips;
          this.$notify({position:'bottom-left',showClose:true,message: tips.msg, type: tips.isOk?'success':'error'});
        }).catch( err  => this.load.calcProject=false );
    },
  },

  mounted() { 
 

  },

};
</script>

<style scoped lang="scss">
.container {
  margin: 10px;
}

.header {
  display: flex;
  justify-content: flex-start;
  padding: 10px;

  span {
    padding-right: 15px;
  }
}

.col {
  margin-bottom: 20px;
}

.icon1 {
  color: #fff;
  border-radius: 15px;
  text-align: center;
  font-size: 20px;
  display: inline-block;
  margin-right: 5px;
  margin-left: 5px;
}

.icon2 {
  color: #000000;
  border-radius: 15px;
  text-align: center;
  font-size: 20px;
  display: inline-block;
  margin-right: 5px;
  margin-left: 5px;
}

.item {
  display: flex;
  justify-content: flex-start;
  position: relative;
  .progress-item{
    position:absolute; width:80%;
  }
}

.card-font {
  color: #000000;
  font-size: 12px;

  .el-col {
    margin-bottom: 20px;
  }
}

.calendar-header {
  display: flex;
  justify-content: space-between;

  .cal-header-boxs {
    flex: 1;
    display: flex;
    justify-content: flex-end;

    .cal-header-box {
      padding: 5px;
      height: 45px;
      margin-left: 10px;
    }

    .box-icon {
      text-align: center;
    }

    .box-info {
      text-align: center;
      font-size: 12px;
      color: #000000;
    }
  }
}

.el-tag:hover {
  cursor: pointer;
}

.value {
  cursor: pointer;
}

.reference {
  margin-top: 10px;
  font-size: 12px;
}

.click {
  background: #e9f7ff;
}

.calendar-box {
  display: flex;
  justify-content: flex-start;
}
</style>

