<template>
	
    <el-row class="page-main " style="overflow-x: hidden;">
      <el-row style="margin-bottom:10px">
        <el-card class="box-card" style="padding:0px ;height:100px">
          <div>
            <el-row style="padding:10px">
              <el-steps :active="calcMenuCurrStep" finish-status="success" align-center>
                <el-step :title="item.name" v-for="(item,index) in dicts['menuStatus']" :key="index" />
              </el-steps>
            </el-row>
          </div>
        </el-card>
      </el-row>
      <el-row :gutter="10" style="margin-bottom:10px">
        <el-col :span="12" >
          <el-card class="box-card" style="padding:0px ;height:425px">
            <template #header>
              <span>需求信息</span>
            </template >
            <el-row style="margin-bottom:18px">
              <el-row>
                <span>需求管理员</span> <span v-text="this.xmMenu.mmUsername"  ></span>
              </el-row>
              <el-row />
            </el-row>
            <el-row style="margin-bottom:18px">
              <el-col :span="8">
                <div class="item">
                  <div class="icon" style="background-color:  rgb(79, 140, 255);">
                    <i class="right"></i>
                  </div>
                  <div class="info">
                    <div v-text="this.xmMenu.taskCnt" ></div>
                    <div class="title">总任务量</div>
                  </div>
                </div>
              </el-col>
              <el-col :span="8">
                <div class="item">
                  <div class="icon" style="background-color:  rgb(255, 153, 51);">
                    <i class="loading"></i>
                  </div>
                  <div class="info">
                    <div v-text="notStart" ></div>
                    <div class="title">待完成</div>
                  </div>
                </div>
              </el-col>
              <el-col :span="8">
                <div class="item">
                  <div class="icon" style="background-color:  rgb(0, 153, 51);">
                    <i class="check"></i>
                  </div>
                  <div class="info">
                    <div v-text="this.xmMenu.taskFinishCnt"  ></div>
                    <div class="title">已完成</div>
                  </div>
                </div>
              </el-col>
            </el-row>
            <el-row style="margin-bottom:18px">
              <div class="item">
                <div class="icon2" style="background-color:  rgb(204, 204, 204);">
                  <i class="date"></i>
                </div>
                <div class="info">
                  <div v-text="menuStartTime+'~'+menuEndTime" ></div>
                  <div class="title">需求计划周期</div>
                </div>
              </div>
            </el-row>
            <el-row style="margin-bottom:18px">
              <div class="item">
                <div class="icon2" style="background-color:  rgb(204, 204, 204);">
                  <i class="star-off"></i>
                </div>
                <div class="info">
                  <div class="title"> 关联项目数： {{this.xmMenu.projectCnt}}</div>
                </div>
              </div>
            </el-row>
            <el-row style="margin-bottom:18px">
              <div class="item">
                <div class="icon2" style="background-color:  rgb(204, 204, 204);">
                  <i class="refresh"></i>
                </div>
                <div class="info">
                  <div class="title"> 关联迭代数： {{(this.xmMenu.iterationCnt)}} </div>
                </div>
              </div>
            </el-row>
            <el-row style="margin-bottom:18px">
              <div class="item">
                <div class="icon2" style="background-color:  rgb(204, 204, 204);">
                  <i class="alarm-clock"></i>
                </div>
                <div>
                  <div class="progress-item">
                    <el-progress :percentage="taskProgress" />
                    <div class="title">任务进度</div>
                  </div>
                </div>
              </div>
            </el-row>
          </el-card>
        </el-col>
        <el-col :span="12" >
          <el-card class="box-card" style="height:425px">
            <template #header>
              <span>所有工作项数量分布</span>
            </template >
            <div>
              <div id="allChart" :style="{width: '100%', height: '350px'}" ></div>
            </div>
          </el-card>
        </el-col>
      </el-row>
      <el-row :gutter="10" style="margin-bottom:10px">
        <el-col>
          <el-card class="box-card" style="padding:0px ;height:425px">
            <template #header>
              <span>项目工时</span>
            </template >
            <div>
              <el-row >
                <div class="item">
                  <el-col :span="8">
                    <div>
                      <div style="text-align:center;">
                        <span style="font-size:24px;" v-text="estimateWorkload"  ></span>
                        <span style="font-size:5px;">h</span>
                      </div>
                      <div style="text-align:center;font-size:5px;">预估工时</div>
                    </div>
                  </el-col>
                  <el-col :span="8">
                    <div>
                      <div style="text-align:center;">
                        <span style="font-size:24px;" v-text="this.xmMenu.actWorkload"  ></span>
                        <span style="font-size:5px;">h</span>
                      </div>
                      <div style="text-align:center;font-size:5px;">登记工时</div>
                    </div>
                  </el-col>
                  <el-col :span="8">
                    <div>
                      <div style="text-align:center;">
                        <span style="font-size:24px;" v-text="workloadProgress"  ></span>
                        <span style="font-size:5px;">%</span>
                      </div>
                      <div style="text-align:center;font-size:5px;">工时进度</div>
                    </div>
                  </el-col>
                </div>
              </el-row>
              <el-row >
                <div class="item">
                  <el-col :span="8">
                    <div>
                      <div style="text-align:center;">
                        <span style="font-size:24px;" v-text="remainWorkload"  ></span>
                        <span style="font-size:5px;">h</span>
                      </div>
                      <div style="text-align:center;font-size:5px;">剩余工时</div>
                    </div>
                  </el-col>
                  <el-col :span="8">
                    <div>
                      <div style="text-align:center;">
                        <span style="font-size:24px;" v-text="deviation"  ></span>
                        <span style="font-size:5px;">h</span>
                      </div>
                      <div style="text-align:center;font-size:5px;">预估偏差</div>
                    </div>
                  </el-col>
                  <el-col :span="8">
                    <div>
                      <div style="text-align:center;">
                        <span style="font-size:24px;" v-text="deviationRate||0"  ></span>
                        <span style="font-size:5px;">%</span>
                      </div>
                      <div style="text-align:center;font-size:5px;">预估偏差率</div>
                    </div>
                  </el-col>
                </div>
              </el-row>
              <el-row>
                <span style="margin-left:20px;">项目预计进度</span>
                <el-progress style="width: 90%;margin-left:20px;margin-top: 10px;margin-bottom: 20px;"  :stroke-width="14" :percentage="planProgress" />
              </el-row>
              <el-row>
                <span style="margin-left:20px;">项目实际进度</span>
                <el-progress style="width: 90%;margin-left:20px;margin-top: 10px;" color="#47CBF6" :stroke-width="14" :percentage="realProgress" />
              </el-row>
            </div>
          </el-card>
        </el-col>
      </el-row>
      <el-row :gutter="10" style="margin-bottom:10px">
        <el-col :span="12" >
          <el-card class="box-card" style="height:425px">
            <template #header>
              <span>缺陷情况</span>
            </template >
            <div style="'100%'">
              <div id="bugPieChart" :style="{width: '100%', height: '300px'}" ></div>
            </div>
          </el-card>
        </el-col>
        <el-col :span="12" >
          <el-card class="box-card" style="height:425px">
            <template #header>
              <span>用例情况</span>
            </template >
            <div>
              <div id="casePie" :style="{width: '100%', height: '410px'}" ></div>
            </div>
          </el-card>
        </el-col>
      </el-row>
    </el-row>
	
</template>

<script>
	import util from '@/components/mdp-ui/js/util';//全局公共库
  import * as echarts from 'echarts';
	import { mapState } from 'pinia'
import { useUserStore } from '@/store/modules/user'


	export default {
		computed: {
      ...mapState(useUserStore,['userInfo','roles']),
      notStart: function() {
        return this.xmMenu.taskCnt-this.xmMenu.taskFinishCnt;
      },
      taskProgress: function (){
        return this.xmMenu.finishRate;
      },
      menuStartTime: function (){
        if(this.xmMenu.planStartTime){
          return this.xmMenu.planStartTime.substring(0,10);
        } else{
          return '暂无';
        }
      },
      menuEndTime: function (){
        if(this.xmMenu.planEndTime){
          return this.xmMenu.planEndTime.substring(0,10);
        } else{
          return '暂无';
        }
      },
      estimateWorkload:function(){
         let now = new Date();
          let startTime = new Date(this.xmMenu.planStartTime);
          let endTime = new Date(this.xmMenu.planEndTime);
          if(now<startTime){
            return 0;
          }
          if(now<=endTime){
            let allDays=endTime-startTime;
            return Math.round((now-startTime)/allDays*this.xmMenu.budgetWorkload)
          }else{
            return this.xmMenu.budgetWorkload;
          }
      },
      workloadProgress:function (){
        return Math.round(this.xmMenu.actWorkload/this.xmMenu.budgetWorkload*100);
      },
      deviation:function (){
          return Math.round(this.xmMenuCpd.actWorkload-this.xmMenuCpd.estimateWorkload);
      },
      deviationRate:function (){
        if(!this.xmMenuCpd.estimateWorkload || this.xmMenuCpd.estimateWorkload==0){
          return 100
        }
        return Math.round(this.deviation/this.xmMenuCpd.estimateWorkload*100);
      },
      remainWorkload:function (){
        return Math.round(this.xmMenu.budgetWorkload - this.xmMenu.actWorkload);
      },
      planProgress:function (){
         return Math.round(this.xmMenuCpd.estimateWorkload/this.budgetWorkload *100);
      },
      realProgress:function (){
        if(this.xmMenu.actWorkload < this.xmMenu.budgetWorkload){
          return Math.round(this.xmMenu.actWorkload/this.xmMenu.budgetWorkload*100)
        }else{
          return 100;
        }
      },
      xmMenuCpd(){
        return this.xmMenu
      },

			calcMenuCurrStep(){
				var menuStatus= this.dicts.menuStatus
				if(!menuStatus){
					return 1;
				}else{
					var status=menuStatus.findIndex(i=>this.xmMenu.status==i.id)
					if(status>=0){
						return status+1;
					}else{
						return 1;
					}
				}
			}

    },

    props:['xmMenu'],
    watch:{
      xmMenuCpd:function(){
        this.drawAllBar();
        this.drawPieBug();
        this.drawCasePie();
      }
    },
    data() {
      return {
        isActive:true,
        dicts:{},
      };
    },

    methods:{
      drawAllBar() {
        // 基于准备好的dom，初始化echarts实例
        let allChart = echarts.init(document.getElementById("allChart"));
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
            data: ['测试用例', '任务', '缺陷']
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
                  value: this.xmMenu.testCases,
                  itemStyle: {
                    normal:{
                      color: '#99CCFF'
                    }
                  }
                },
                {
                  value: this.xmMenu.taskCnt,
                  itemStyle: {
                    normal:{
                      color: '#99CCFF'
                    }
                  }
                },
                {
                    value: this.xmMenu.bugCnt,
                  itemStyle: {
                    normal:{
                      color: '#99CCFF'
                    }
                  }
                },
              ],
              type: 'bar'
            }
          ]
        };

        // 绘制图表
        allChart.setOption(option);

      },
      drawPieBug() {
        let bugPieChart = echarts.init(document.getElementById("bugPieChart"));
        let option = {
          tooltip: {
            trigger: 'item',
            formatter: '{b} : {c} ({d}%)'
          },
          legend: {
            orient: 'vertical',
            left: 'left',
          },
          series: [
            {
              center:['55%','40%'],//饼图位置
              type: 'pie',
              radius: '50%',//饼图半径大小
              label:{            //饼图图形上的文本标签
                normal:{
                  show:true,
                  position:'outer', //标签的位置:内部
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
                {value: this.xmMenu.closedBugs,
                  itemStyle: {
                    normal:{
                      color: '#5470C6'
                    }
                  },
                  name: '已关闭'},
                {value: this.xmMenu.resolvedBugs,
                  itemStyle: {
                    normal:{
                      color: '#91CC75'
                    }
                  },
                  name: '已解决'},
                {value: this.xmMenu.activeBugs,
                  itemStyle: {
                    normal:{
                      color: '#FAC858'
                    }
                  },
                  name: '已激活'},
                {value: this.xmMenu.confirmedBugs,
                  itemStyle: {
                    normal:{
                      color: '#EE6666'
                    }
                  },
                  name: '已确认'},
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
        // 绘制图表
        bugPieChart.setOption(option);
      },
      drawCasePie() {
        let casePie = echarts.init(document.getElementById("casePie"));
        let option = {
          tooltip: {
            trigger: 'item',
            formatter: '{b} :<br/> {c} ({d}%)'
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
                {value: this.xmMenu.execCases,
                  itemStyle: {
                    normal:{
                      color: '#73C0DE'
                    }
                  },
                  name: '测试中用例'},
                {value: this.xmMenu.designCases,
                  itemStyle: {
                    normal:{
                      color: '#FAC858'
                    }
                  },
                  name: '设计中用例'},
                {value: this.xmMenu.finishCases,
                  itemStyle: {
                    normal:{
                      color: '#91CC75'
                    }
                  },
                  name: '完成用例'},
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

        // 绘制图表
        casePie.setOption(option);
      },
    },

    mounted() {


      this.$nextTick(() => {
      });
      this.drawAllBar();
      this.drawPieBug();
      this.drawCasePie();
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

.icon {
  color: #fff;
  height: 30px;
  width: 30px;
  border-radius: 15px;
  text-align: center;
  line-height: 30px;
  font-size: 20px;
  display: inline-block;
  margin-right: 5px;
}

.icon2 {
  color: #000000;
  height: 30px;
  width: 30px;
  border-radius: 15px;
  text-align: center;
  line-height: 30px;
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

<style>
.app-container{
  padding: 20px;
  padding-bottom: 0;
}
</style>
