<template>
  <div id="data-branch" ref="appRef">
    <div class="bg">
      <dv-loading v-if="loading">加载中</dv-loading>
      <div  class="host-body">
        <!-- 第一行 -->
          <div class="row_1">
            <dv-decoration-10 class="dv-dec-10" />
            <div class="middle">
              <dv-decoration-8 class="dv-dec-8" :color="['#568aea', '#000000']" />
              <div class="title">
                <span class="title-text">机构综合数据监控</span>
                <dv-decoration-6 class="dv-dec-6" :reverse="true" :color="['#50e3c2', '#67a1e5']"/>
              </div>
              <dv-decoration-8 class="dv-dec-8" :reverse="true" :color="['#568aea', '#000000']" />
            </div>
            <dv-decoration-10 class="dv-dec-10-s" />
          </div>

          <!-- 第二行 -->
          <div class="row_2">
            <digital-flop :data="digitalFlopData" :title="'汇总数据'"/>
          </div>

          <!-- 第三行 -->
          <div class="row_3">
            <div class="left">
              <ranking-board :data="rankingBoardData" :title="'项目进度'" />
            </div>
            <div class="right">
              <div class="r_top">
                <div class="top_1">
                  <rose-chart :data="roseChartData" :title="'资金分布'"/>
                </div>
                <div class="top_2">
                  <water-level-chart :data="waterLevelChartData" :title="'计划资金累计完成情况'"/>
                </div>
                <div class="top_3">
                  <scroll-board  :data="scrollBoardData" :title="'动态'" :header="['时间','操作人','动作','备注']"/>
                </div>
              </div>
              <div class="r_bottom">
                <cards :data="cardsData" :title="'产品'" />
              </div>
            </div>
          </div>
      </div>
    </div>
  </div>
</template>

<script> 
import digitalFlop from './digitalFlop.vue'
import rankingBoard from './rankingBoard.vue'
import roseChart from './roseChart.vue'
import waterLevelChart from './waterLevelChart.vue'
import scrollBoard from './scrollBoard.vue'
import cards from './cards.vue'
import { listXmBranchState  } from '@/api/xm/core/xmBranchState'; 
import { listXmProjectState} from '@/api/xm/core/xmProjectState';
import { listXmBranchTaskTypeState } from '@/api/xm/core/xmBranchTaskTypeState';
import { listXmRecord } from '@/api/xm/core/xmRecord';
import { listXmProductState } from '@/api/xm/core/xmProductState';
import { mapState } from 'pinia'
import { useUserStore } from '@/store/modules/user'
import drawMixin from "../utils/drawMixin";
  

export default {
  name: 'BranchDataView',
  mixins: [ drawMixin ],
  components: { 
    digitalFlop,
    rankingBoard,
    roseChart,
    waterLevelChart,
    scrollBoard,
    cards
  },
  computed: {
    ...mapState(useUserStore,[
      'userInfo'
    ]),
    digitalFlopData(){
       if(!this.xmBranchState){
        return null;
      }
      var digitalFlopData = [
        {
          title: '累计金额',
          number: {
            number: [(this.floatValue(this.xmBranchState.budgetNouserAt) + this.floatValue(this.xmBranchState.budgetIuserAt) + this.floatValue(this.xmBranchState.budgetOuserAt))/10000],
            content: '{nt}',
            textAlign: 'right',
            style: {
              fill: '#40faee',
              fontWeight: 'bold'
            }
          },
          unit: '万元'
        },
        {
          title: '发布总任务数',
          number: {
            number: [this.xmBranchState.taskCnt ],
            content: '{nt}',
            textAlign: 'right',
            style: {
              fill: '#4d99fc',
              fontWeight: 'bold'
            }
          },
          unit: '个'
        },
        {
          title: '项目',
          number: {
            number: [this.xmBranchState.projectCnt ],
            content: '{nt}',
            textAlign: 'right',
            style: {
              fill: '#f46827',
              fontWeight: 'bold'
            }
          },
          unit: '个'
        },
        {
          title: '参与人数',
          number: {
            number: [this.xmBranchState.planWorkerCnt],
            content: '{nt}',
            textAlign: 'right',
            style: {
              fill: '#40faee',
              fontWeight: 'bold'
            }
          },
          unit: '人'
        },
        {
          title: '客户',
          number: {
            number: [this.xmBranchState.productCnt],
            content: '{nt}',
            textAlign: 'right',
            style: {
              fill: '#4d99fc',
              fontWeight: 'bold'
            }
          },
          unit: '个'
        },
        {
          title: '需求',
          number: {
            number: [this.xmBranchState.menuCnt],
            content: '{nt}',
            textAlign: 'right',
            style: {
              fill: '#f46827',
              fontWeight: 'bold'
            }
          },
          unit: '个'
        },
        {
          title: '产品',
          number: {
            number: [this.xmBranchState.productCnt],
            content: '{nt}',
            textAlign: 'right',
            style: {
              fill: '#40faee',
              fontWeight: 'bold'
            }
          },
          unit: '个'
        },
        {
          title: '测试用例',
          number: {
            number: [this.xmBranchState.testCases],
            content: '{nt}',
            textAlign: 'right',
            style: {
              fill: '#4d99fc',
              fontWeight: 'bold'
            }
          },
          unit: '个'
        },
        {
          title: '迭代',
          number: {
            number: [this.xmBranchState.iterationCnt],
            content: '{nt}',
            textAlign: 'right',
            style: {
              fill: '#f46827',
              fontWeight: 'bold'
            }
          },
          unit: '个'
        }
      ]
      return digitalFlopData;
    },
    rankingBoardData(){
      if( !this.xmProjectStates || this.xmProjectStates.length==0 ){
        return [];
      }
      var rankingBoardData=this.xmProjectStates.map(i=>{
        return {name:i.projectName,value:i.finishRate+'%'}
      })
      return rankingBoardData
    },
    roseChartData(){
      var taskTypeList=this.options.taskType 
      if(this.xmBranchTaskTypeStates && this.xmBranchTaskTypeStates.length>0){
        var xmBranchTaskTypeStates=this.xmBranchTaskTypeStates.filter(i=>i.planAmount>0);
        var roseChartData=xmBranchTaskTypeStates.map(i=>{
           
          if(!taskTypeList || taskTypeList.length==0){
            return {
              name:i.taskType?i.taskType:'其它',
              value:i.planAmount?i.planAmount:0
            }
          }else{
            var taskTypes=taskTypeList.filter(k=>k.optionValue==i.taskType)
            if(taskTypes && taskTypes.length>0){
              var taskType=taskTypes[0]
              return {
                name:taskType.optionName,
                value:i.planAmount?i.planAmount:0
              }
            }else{
              return {
                name:i.taskType?i.taskType:'其它',
                value:i.planAmount?i.planAmount:0
              }
            }
          }
        })
        return roseChartData
      }else{
        return null;
      }
        
    },
    waterLevelChartData(){
      if(this.xmBranchState){
        var data={}
        var allAmount=this.floatValue(this.xmBranchState.budgetNouserAt) + this.floatValue(this.xmBranchState.budgetIuserAt) + this.floatValue(this.xmBranchState.budgetOuserAt);
        data.finishNum= this.floatValue(this.xmBranchState.actNouserAt) + this.floatValue(this.xmBranchState.actIuserAt) +this.floatValue(this.xmBranchState.actOuserAt) 
        data.finishPercent= parseFloat(data.finishNum/allAmount * 100).toFixed(0)
        return data;
     }else{
        return null;
      }
    },
    scrollBoardData(){
       if(this.xmRecords && this.xmRecords.length>0){
           var data = this.xmRecords.map(i=>{
             return [i.operTime,i.operUsername,i.action,i.remarks]
           })
           return data;
      }else{
          return null;
        }
    },

    cardsData(){
      if(this.xmProductStates && this.xmProductStates.length>0){
        //var totalPlanWorkload=this.floatValue(this.xmBranchState.budgetWorkload)
        var totalPlanWorkload=100000
        var xmProductStates=this.xmProductStates.map(i=>{
           i['totalPlanWorkload']=totalPlanWorkload
           return i;
        })
        return xmProductStates.slice(0, 5);
      }else{
        return null;
      }
    }
  },

  data () {
    return {
      loading: true,
      xmBranchState:null,
      xmProjectStates:[],
      xmBranchTaskTypeStates:[],
      xmRecords:[],
      xmProductStates:[],
      options:{
        taskType:[],
      },
      
      xmRecordPageInfo:{//分页数据
        total:0,//服务器端收到0时，会自动计算总记录数，如果上传>0的不自动计算。
        pageSize:20,//每页数据
        count:false,//是否需要重新计算总记录数
        pageNum:1,//当前页码、从1开始计算
        orderFields:["oper_time"],//排序列 如 ['sex','student_id']，必须为数据库字段
        orderDirs:["desc"]//升序 asc,降序desc 如 性别 升序、学生编号降序 ['asc','desc']
      },
      
      xmProjectStatePageInfo:{//分页数据
        total:0,//服务器端收到0时，会自动计算总记录数，如果上传>0的不自动计算。
        pageSize:20,//每页数据
        count:false,//是否需要重新计算总记录数
        pageNum:1,//当前页码、从1开始计算
        orderFields:["budget_workload"],//排序列 如 ['sex','student_id']，必须为数据库字段
        orderDirs:["desc"]//升序 asc,降序desc 如 性别 升序、学生编号降序 ['asc','desc']
      },
      
      
      xmProductStatePageInfo:{//分页数据
        total:0,//服务器端收到0时，会自动计算总记录数，如果上传>0的不自动计算。
        pageSize:20,//每页数据
        count:false,//是否需要重新计算总记录数
        pageNum:1,//当前页码、从1开始计算
        orderFields:["budget_workload"],//排序列 如 ['sex','student_id']，必须为数据库字段
        orderDirs:["desc"]//升序 asc,降序desc 如 性别 升序、学生编号降序 ['asc','desc']
      },
    }
  },
  methods: {
    getXmBranchState(){
      var params = {
        branchId:this.userInfo.branchId
      }
      listXmBranchState(params).then(res=>{
        var tips = res.tips;
        if(tips.isOk){
          if(res.data.length>0){
             this.xmBranchState=res.data[0]
          }
          setTimeout(() => {
            this.loading = false;
          }, 100);
        }
      });
    },
    getXmProjectStates(){
      let params = {
					pageSize: this.xmProjectStatePageInfo.pageSize,
					pageNum: this.xmProjectStatePageInfo.pageNum,
					total: this.xmProjectStatePageInfo.total,
					count:this.xmProjectStatePageInfo.count
				};
				if(this.xmProjectStatePageInfo.orderFields!=null && this.xmProjectStatePageInfo.orderFields.length>0){
					let orderBys=[];
					for(var i=0;i<this.xmProjectStatePageInfo.orderFields.length;i++){ 
						orderBys.push(this.xmProjectStatePageInfo.orderFields[i]+" "+this.xmProjectStatePageInfo.orderDirs[i])
					}  
					params.orderBy= orderBys.join(",")
				}  
      params.branchId=this.userInfo.branchId
      listXmProjectState(params).then(res=>{
        var tips = res.tips;
        if(tips.isOk){
          if(res.data.length>0){
             this.xmProjectStates=res.data
          }
        }
      });
    },
    
    getXmBranchTaskTypeStates(){
      var params = {
        branchId:this.userInfo.branchId
      }
      listXmBranchTaskTypeState(params).then(res=>{
        var tips = res.tips;
        if(tips.isOk){
          if(res.data.length>0){
             this.xmBranchTaskTypeStates=res.data
          }
        }
      });
    },//获取列表 XmRecord xm_record
			getXmRecords() {
				let params = {
					pageSize: this.xmRecordPageInfo.pageSize,
					pageNum: this.xmRecordPageInfo.pageNum,
					total: this.xmRecordPageInfo.total,
					count:this.xmRecordPageInfo.count
				};
				if(this.xmRecordPageInfo.orderFields!=null && this.xmRecordPageInfo.orderFields.length>0){
					let orderBys=[];
					for(var i=0;i<this.xmRecordPageInfo.orderFields.length;i++){ 
						orderBys.push(this.xmRecordPageInfo.orderFields[i]+" "+this.xmRecordPageInfo.orderDirs[i])
					}  
					params.orderBy= orderBys.join(",")
				} 
 				listXmRecord(params).then((res) => {
					var tips=res.tips;
					if(tips.isOk){ 
						this.xmRecordPageInfo.total = res.data.total;
						this.xmRecordPageInfo.count=false;
						this.xmRecords = res.data;
					}else{
 					} 
 				}) ;
      },
    //获取列表 XmProductState 功能状态表,无需前端维护，所有数据由汇总统计得出
    getXmProductStates() {
      let params = {
        pageSize: this.xmProductStatePageInfo.pageSize,
        pageNum: this.xmProductStatePageInfo.pageNum,
        total: this.xmProductStatePageInfo.total,
        count:this.xmProductStatePageInfo.count
      };
      if(this.xmProductStatePageInfo.orderFields!=null && this.xmProductStatePageInfo.orderFields.length>0){
        let orderBys=[];
        for(var i=0;i<this.xmProductStatePageInfo.orderFields.length;i++){ 
          orderBys.push(this.xmProductStatePageInfo.orderFields[i]+" "+this.xmProductStatePageInfo.orderDirs[i])
        }  
        params.orderBy= orderBys.join(",")
      } 
      params.branchId=this.userInfo.branchId
       listXmProductState(params).then((res) => {
        var tips=res.tips;
        if(tips.isOk){ 
          this.xmProductStatePageInfo.total = res.data.total;
          this.xmProductStatePageInfo.count=false;
          this.xmProductStates = res.data;
        }else{
         } 
       }) ;
    },
    floatValue(value){
      if(!value){
        return 0.0;
      }else{
        return value
      }
    }
  },
  mounted(){
    this.getXmBranchState();
    this.getXmProjectStates();
    this.getXmBranchTaskTypeStates();
    this.getXmRecords();
    this.getXmProductStates();

    this.$mdp.getDictOptions('taskType').then(res=>this.options=res) 
  }
}
</script>

<style lang="less">
  @import './index.less';
</style>
