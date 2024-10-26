<template>
  <el-scrollbar v-adaptive="{bottom:10}">
  <MdpRptHeader :showParams="true" btn-title="查询条件">
    <el-form :model="filters">
      <el-form-item label="归属项目" v-if="!xmProject?.id">
        <xm-project-select  ref="xmProjectSelect" 
          :link-product-id="xmProduct?.id" @change2="onProjectSelected" @clear="onProjectClear" />
      </el-form-item>
      <el-form-item label="人员编号" v-if="queryScope !== 'my' && (!user || !user.userid)">
        <xm-user-select :xm-product="xmProduct||product"  :sel-project="xmProject||project" label="选择人员" :clearable="true" v-model="filters.userid" />
      </el-form-item>

      <el-form-item label="任务" v-if="project?.id"> 
        <xm-task-select v-model="filters.taskId" :sel-project="project"/>
      </el-form-item>
      <el-form-item label="日期区间"> 
        <mdp-date-range v-model="filters" type="daterange" value-format="YYYY-MM-DD" start-key="startBizDate" end-key="endBizDate"/>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" icon="search" @click="listProjectWorkloadSetDay">查询</el-button>
      </el-form-item>
    </el-form>
  </MdpRptHeader>
  <div class="row-box">
    <div class="echart-box" :id="id"></div>
  </div>
  <el-table ref="xmWorkloadTable" :data="xmProjectWorkloadSetDays" highlight-current-row v-loading="load.list"
    @row-click="rowClick" border style="width: 100%" :header-cell-style="{ 'text-align': 'center' }"
    :cell-style="{ 'text-align': 'center' }">
    <el-table-column sortable type="index" width="55" show-overflow-tooltip fixed="left" />
    <el-table-column prop="bizDate" label="工时日期" width="120" show-overflow-tooltip sortable fixed="left">
      <template #default="scope">
        <span>{{ scope.row.bizDate }}</span>
      </template>
    </el-table-column>
    <el-table-column prop="workload" label="登记工时" min-width="120" show-overflow-tooltip sortable>
      <template #default="scope">
        <el-link type="primary" style="display: inline" @click="showPopover(scope.row, 'workload', '', '')">{{
          scope.row.workload }}h</el-link>
      </template>
    </el-table-column>
    <el-table-column prop="toConfirmWorkload" label="待确认" min-width="120" show-overflow-tooltip sortable>
      <template #default="scope">
        <el-link type="primary" style="display: inline" @click="showPopover(scope.row, 'toConfirmWorkload', '0', '')">{{
          scope.row.toConfirmWorkload }}h</el-link>
      </template>
    </el-table-column>
    <el-table-column prop="hadConfirmWorkload" label="已确认" min-width="120" show-overflow-tooltip sortable>
      <template #default="scope">
        <el-link type="success" style="display: inline" @click="showPopover(scope.row, 'hadConfirmWorkload', '1', '')">{{
          scope.row.hadConfirmWorkload }}h</el-link>
      </template>
    </el-table-column>
    <el-table-column prop="notNeedSetWorkload" label="无须结算" min-width="120" show-overflow-tooltip sortable>
      <template #default="scope">
        <el-link type="info" style="display: inline" @click="showPopover(scope.row, 'notNeedSetWorkload', '1', '0')">{{
          scope.row.notNeedSetWorkload }}h</el-link>
      </template>
    </el-table-column>
    <el-table-column prop="toSetSworkload" label="待结算" min-width="120" show-overflow-tooltip sortable>
      <template #default="scope">
        <el-link type="warning" style="display: inline" @click="showPopover(scope.row, 'toSetSworkload', '1', '1')">{{
          scope.row.toSetSworkload }}h</el-link>
      </template>
    </el-table-column>
    <el-table-column prop="hadCommitSworkload" label="已提交审核" min-width="120" show-overflow-tooltip sortable>
      <template #default="scope">
        <el-link type="primary" style="display: inline" @click="showPopover(scope.row, 'hadCommitSworkload', '1', '2')">{{
          scope.row.hadCommitSworkload }}h</el-link>
      </template>
    </el-table-column>
    <el-table-column prop="hadAgreeSworkload" label="已审核" min-width="120" show-overflow-tooltip sortable>
      <template #default="scope">
        <el-link type="primary" style="display: inline" @click="showPopover(scope.row, 'hadAgreeSworkload', '1', '3')">{{
          scope.row.hadAgreeSworkload }}h</el-link>
      </template>
    </el-table-column>
    <el-table-column prop="hadSetSworkload" label="已结算" min-width="120" show-overflow-tooltip sortable>
      <template #default="scope">
        <el-link type="danger" style="display: inline" @click="showPopover(scope.row, 'hadSetSworkload', '1', '4')">{{
          scope.row.hadSetSworkload }}h</el-link>
      </template>
    </el-table-column>
  </el-table>
</el-scrollbar>
  <mdp-dialog width="90%" ref="workloadDlg"  append-to-body>
    <template #default="{visible,data}">
    <XmWorkloadMng :visible="visible" :params="data.params" />
      </template>
  </mdp-dialog>
</template>

<script>
import util from '@/components/mdp-ui/js/util';//全局公共库
import { sn } from '@/components/mdp-ui/js/sequence';//全局公共库

import { mapState } from 'pinia'
import { useUserStore } from '@/store/modules/user'

import * as echarts from 'echarts';
 //新增界面
import { listProjectWorkloadSetDay } from "@/api/xm/core/xmWorkload";
  
import { defineAsyncComponent } from 'vue';
export default {
  components: {

    
    XmWorkloadMng: defineAsyncComponent(()=>import('@/views/xm/core/xmWorkload/XmWorkloadMng.vue')),

  },
  props: ["xmProduct", "xmProject", "queryScope", 'user'],
  computed: {
    ...mapState(useUserStore, ["userInfo", "roles"]),
    dataSetCpd() {
      return [
        ["日期", ...this.xmProjectWorkloadSetDays.map((i) => i.bizDate)],
        //['登记工时',...this.xmProjectWorkloadSetDays.map(i=>i.workload)],
        [
          "待确认",
          ...this.xmProjectWorkloadSetDays.map((i) => i.toConfirmWorkload),
        ],
        [
          "已确认",
          ...this.xmProjectWorkloadSetDays.map((i) => i.hadConfirmWorkload),
        ],
        [
          "无需结算",
          ...this.xmProjectWorkloadSetDays.map((i) => i.notNeedSetWorkload),
        ],
        [
          "待结算",
          ...this.xmProjectWorkloadSetDays.map((i) => i.toSetSWorkload),
        ],
        [
          "已提交审核",
          ...this.xmProjectWorkloadSetDays.map((i) => i.hadCommitSworkload),
        ],
        [
          "已审核",
          ...this.xmProjectWorkloadSetDays.map((i) => i.hadAgreeSworkload),
        ],
        [
          "已结算",
          ...this.xmProjectWorkloadSetDays.map((i) => i.hadSetSworkload),
        ],
      ];
    },
  },
  watch: {
    dataSetCpd() {
      this.$nextTick(() => {
        this.drawCharts();
      });
    },
  },
  data() {
    return {
      filters: {
        category: "",
        product: null,
        iteration: null, 
        startBizDate: "",
        endBizDate: "",
        userid: "",
        username: '',
        taskId: "",
      },
      dicts: {}, //下拉选择框的所有静态数据  params=[{categoryId:'0001',itemCode:'sex'}] 返回结果 {'sex':[{optionValue:'1',optionName:'男',seqOrder:'1',fp:'',isDefault:'0'},{optionValue:'2',optionName:'女',seqOrder:'2',fp:'',isDefault:'0'}]}
      load: { list: false, edit: false, del: false, add: false }, //查询中...
      dateRanger: [],
      maxTableHeight: 300,
      visible: false,
      xmProjectWorkloadSetDays: [],
      editForm: {
        bizDate: "",
        toConfirmWorkload: 0,
        hadConfirmWorkload: 0,
        toSetSWorkload: 0,
        hadAgreeSworkload: 0,
        hadCommitSworkload: 0,
      },
      columnProp: "",
      workloadDialogVisible: false,
      wstatus: "",
      sstatus: "",
      stateName: {
        workload: "所有",
        toConfirmWorkload: "待确认",
        hadConfirmWorkload: "已确认",
        notNeedSetWorkload: '无需结算',
        toSetSworkload: "待结算",
        hadAgreeSworkload: "已审核待结算",
        hadCommitSworkload: "已提交待审核",
        hadSetSworkload: "已结算",
      },
      id: sn(),
    }; //end return
  }, //end data
  methods: {
    listProjectWorkloadSetDay() {
      var params = {};
      if (this.project) {
        params.projectId = this.project.id;
      }

      if (this.filters.startBizDate && this.filters.endBizDate) {
        params.startBizDate = this.filters.startBizDate;
        params.endBizDate = this.filters.endBizDate;
      }
      if (this.filters.userid) {
        params.userid = this.filters.userid;
      }
      if (this.filters.taskId) {
        params.taskId = this.filters.taskId;
      }
      if (this.user && this.user.userid) {
        params.userid = this.user.userid;
      }
      this.load.list = true;
      listProjectWorkloadSetDay(params).then((res) => {
        this.xmProjectWorkloadSetDays = res.tips.isOk
          ? res.data
          : this.xmProjectWorkloadSetDays;
        this.load.list = false;
      });
    },
    initData() {
      this.product = this.xmProduct;
      this.project = this.xmProject;
      this.iteration = this.xmIteration;
      this.xmProjectWorkloadSetDays = [];
      if (this.queryScope == "my") {
        this.filters.userid = this.userInfo.userid;
      }
      this.$mdp.setDateRange(this.filters,"startBizDate","endBizDate","YYYY-MM-DD",[-15,15])
      this.$nextTick(() => {
        this.listProjectWorkloadSetDay();
      });
    },
    drawCharts() {
      this.myChart = echarts.init(
        document.getElementById(this.id)
      );
      var myChart=this.myChart
      this.myChart.on("updateAxisPointer", function (event) {
        const xAxisInfo = event.axesInfo[0];
        if (xAxisInfo) {
          const dimension = xAxisInfo.value + 1;
          myChart.setOption({
            series: {
              id: "pie",
              label: {
                formatter: "{b}: {@[" + dimension + "]} ({d}%)",
              },
              encode: {
                value: dimension,
                tooltip: dimension,
              },
            },
          });
        }
      });
      this.myChart.setOption({
        title: {
          text: "工时日报表",
        },
        tooltip: {
          trigger: "axis",
          showContent: false,
        },
        legend: {},

        dataset: {
          source: this.dataSetCpd,
        },
        xAxis: {
          type: "category",
        },
        yAxis: { gridIndex: 0 },
        grid: { top: "55%" },
        series: [
          {
            name: "待确认",
            type: "line",
            seriesLayoutBy: "row",
            smooth: true,
            emphasis: { focus: "series" },
          },
          {
            name: "已确认",
            type: "line",
            seriesLayoutBy: "row",
            smooth: true,
            emphasis: { focus: "series" },
          },
          {
            name: "无需结算",
            type: "line",
            seriesLayoutBy: "row",
            smooth: true,
            emphasis: { focus: "series" },
          },
          {
            name: "待结算",
            type: "line",
            seriesLayoutBy: "row",
            smooth: true,
            emphasis: { focus: "series" },
          },
          {
            name: "已提交审核",
            type: "line",
            seriesLayoutBy: "row",
            smooth: true,
            emphasis: { focus: "series" },
          },

          {
            name: "已审核",
            type: "line",
            seriesLayoutBy: "row",
            smooth: true,
            emphasis: { focus: "series" },
          },
          {
            name: "已结算",
            type: "line",
            seriesLayoutBy: "row",
            smooth: true,
            emphasis: { focus: "series" },
          },
          {
            type: "pie",
            id: "pie",
            radius: "30%",
            center: ["50%", "25%"],
            emphasis: {
              focus: "self",
            },
            label: {
              formatter: "{b}: {@日期} ({d}%)",
            },
            encode: {
              itemName: "日期",
              value: "日期",
              tooltip: "日期",
            },
          },
        ],
      });
    },

    onProjectSelected(project) {
      this.project = project;
      this.xmProjectWorkloadSetDays = [];
      this.listProjectWorkloadSetDay();
    },

    onProjectClear() {
      this.project = null;

      this.xmProjectWorkloadSetDays = [];
    },
    rowClick(row, column, event) {
      this.editForm = row;
      this.columnProp = column.property;
    },
    showPopover(row, fieldName, wstatus, sstatus) {
       let data={params:{}}
       data.params={...this.filters,wstatus:wstatus,sstatus:sstatus,bizDate:row.bizDate}
       data.title=`【${row.bizDate}】的工时记录`
       if(this.project?.id){
        data.params.projectId=this.project.id
        data.title=`【${this.project.name}】`+data.title
       }
       if(this.product?.id){
        data.params.productId=this.product.id
        data.title=`【${this.product.productName}】`+data.title
       }
       
      this.$refs['workloadDlg'].open(data)
    },
  }, //end method
  mounted() {
    this.initData();
  }, //end mounted
};
</script> 
