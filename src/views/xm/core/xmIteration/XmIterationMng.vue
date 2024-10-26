<template>
  <ContentWrap>
    <template #header>
      <el-space wrap> 
        
        <mdp-hi-query
          :column-configs="columnConfigs"
          v-model="hiQueryParams"
          @change="onHiQueryParamsChange"
        />
        <el-button icon="zoom-out" @click="searchReset()" title="重置查询条件并查询" />
        <span v-if="currOpType=='mng'">



           <el-button type="danger" v-if="isTaskCenter != '1' && isMy != '1'" @click="batchDel" v-loading="load.del"
            icon="delete" title="批量删除" plain /> 

 
  
        </span> 

        <mdp-export @excel="export2Excel()"/>
        <mdp-table-configs :column-configs="columnConfigs" v-model="checkedColumns" />  
          <el-button @click="$refs['ganttDlg'].open()"  title="甘特图" type="warning"  plain>甘</el-button>
              <el-button @click="$refs['kanbanDlg'].open()"  title="看板" type="success" plain>板</el-button> 
        <el-button type="primary" @click="showAdd" icon="plus" plain />
      </el-space>
    </template>

    <el-space>
      <xm-product-select  
        v-if="!xmProduct || !xmProduct.id"
        ref="xmProductSelect1"  
        :link-project-id="selProject ? selProject.id : null"
        @change2="onProductSelected"
        @clear="onProductClearSelect"
       />
      <el-input 
        v-model="filters.id"
        style="width: 20%"
        placeholder="编号" 
       />
      <el-input v-model="filters.iterationName" style="width: 15%" placeholder="名称"/>
      <el-button
        type="primary"
        v-loading="load.list"
        :disabled="load.list == true"
        @click="searchTableDatas"
        icon="search"
       />  
    </el-space>
  </ContentWrap> 
      <!--列表 XmIteration 迭代定义-->
      <el-table
        ref="table"
        v-adaptive="{bottom:50}"
         :data="tableDatas" 
        @sort-change="sortChange"
        highlight-current-row
        v-loading="load.list"
        border
        @selection-change="selsChange"
        @row-click="rowClick"
        style="width: 100%"
      >
        <el-table-column
          type="selection"
          aria-disabled
          width="55"
         />
        <el-table-column prop="iterationName" label="迭代名称" min-width="260" >
          <template #default="scope">
            <el-link type="primary" @click="intoInfo(scope.row, scope.$index)">
              {{ scope.row.iterationName }}
            </el-link>
          </template>
        </el-table-column> 
        <el-table-column  sortable
          prop="adminUsername"
          label="负责人"
          min-width="80"
          show-overflow-tooltip
         />
        <el-table-column  sortable
          prop="istatus"
          label="迭代状态"
          min-width="100"  
          itemCode="iterationStatus"
         >
         <template #default="scope">
          <MdpSelect itemCode="iterationStatus" v-model="scope.row.istatus" disabled showStyle="tag"/>
        </template>
         </el-table-column>
        <el-table-column prop="finishRate" label="总进度" width="120" sortable>
          <template #default="scope">
             <el-tag style="width:4em;"
                :type="scope.row.finishRate >= 100 ? 'success' : 'warning'"
                >{{ scope.row.finishRate }}%</el-tag
              >
                <el-button title="点击统计进度，由任务汇总"
                  type="text"
                  circle
                  plain
                  icon="video-play"
                  @click.stop="loadTasksToXmIterationState(scope.row)"
                 />
          </template>
        </el-table-column>
        <el-table-column  sortable
          prop="startTime"
          label="开始时间"
          min-width="80" 
          show-overflow-tooltip
          colType="date"
         />
        <el-table-column sortable
          prop="endTime"
          label="结束时间"
          min-width="80" 
          show-overflow-tooltip
          colType="date"
         />
        <el-table-column
          prop="onlineTime"  sortable
          label="上线时间"
          min-width="80" 
          show-overflow-tooltip
          colType="date"
         />
        <el-table-column  
          prop="budgetWorkload"
          label="已分配工作量"
          min-width="80"
          show-overflow-tooltip
         />
        <el-table-column
          prop="actWorkload"  
          label="实际工作量"
          min-width="80"
          show-overflow-tooltip
         />
         
        <el-table-column  sortable
          prop="adminUserid"
          label="负责人号"
          min-width="80"
          show-overflow-tooltip
         />
        <el-table-column  sortable
          prop="cuserid"
          label="创建人号"
          min-width="80"
          show-overflow-tooltip
         />
        <el-table-column  sortable
          prop="productId"
          label="产品号"
          min-width="80"
          show-overflow-tooltip
         />
        <el-table-column  sortable
          prop="productName"
          label="产品"
          min-width="80"
          show-overflow-tooltip
         />
        <el-table-column  sortable
          prop="cusername"
          label="创建人"
          min-width="80"
          show-overflow-tooltip
         />
        <el-table-column  sortable
          prop="ctime"
          label="创建时间"
          min-width="80"
          colType="date"
          show-overflow-tooltip
         />
        <el-table-column label="操作" width="150" fixed="right">
          <template #default="scope">
            <el-button
              v-if="menukey == 'myFocus'"
              type="primary"
              @click.stop="focusOrUnfocus(scope.row)"
              >取消关注</el-button
            >
            <el-button
              v-else
              type="text"
              @click.stop="focusOrUnfocus(scope.row)"
              >关注</el-button
            >
            <el-button
              type="danger"
              @click="handleDel(scope.row, scope.$index)"
              icon="delete"
             />
          </template>
        </el-table-column>
      </el-table>
      <el-pagination
        layout="total, sizes, prev, pager, next"
        @current-change="handleCurrentChange"
        @size-change="handleSizeChange"
        :page-sizes="[10, 20, 50, 100, 500]"
        :current-page="pageInfo.pageNum"
        :page-size="pageInfo.pageSize"
        :total="pageInfo.total"
        style="float: right"
       />
      <mdp-gantt
        v-if="gstcVisible"
        :tree-data="xmIterationTreeData"
        :project-phase="{ startTime: '2020-06-01', endTime: '2020-12-30' }"
        :columns="ganrrColumns"
        :useRealTime="false"
       />

      <!--编辑 XmIteration 迭代定义界面-->
      <mdp-dialog
        title="编辑迭代定义"
        v-model="editFormVisible"
        size="50%"
        append-to-body
        :close-on-click-modal="false"
      >
        <xm-iteration-edit sub-op-type="edit"
          :xm-iteration="editForm"
          :visible="editFormVisible"
          @cancel="editFormVisible = false"
          @submit="afterEditSubmit"
         />
      </mdp-dialog>

      <!--新增 XmIteration 迭代定义界面-->
      <mdp-dialog
        title="新增迭代定义"
        v-model="addFormVisible"
        size="50%"
        append-to-body
        :close-on-click-modal="false"
      >
        <xm-iteration-add sub-op-type="add"
          :xm-product="xmProduct"
          :sel-project="selProject"
          :xm-iteration="addForm"
          :parent-iteration="parentIteration"
          :visible="addFormVisible"
          @cancel="addFormVisible = false"
          @submit="afterAddSubmit"
         />
      </mdp-dialog>

      <!--新增 XmIteration 迭代定义界面-->
      <mdp-dialog
        title="迭代报告"
        v-model="iterationStateVisible"
        fullscreen
        append-to-body
        :close-on-click-modal="false"
      >
        <xm-iteration-state-mng
          :xm-iteration="editForm"
          :visible="iterationStateVisible"
          @cancel="iterationStateVisible = false"
         />
      </mdp-dialog> 
  
      <MdpDialog ref="kanbanDlg" fullscreen title="迭代看板">
				<MdpTableKanban   @del="(d,cb)=>handleDel(d,0,cb)"
						@plus="(cb)=>showAdd(cb)"
						@edit="(d,cb)=>intoInfo(d,cb)"
						v-model="tableDatas" 
						:columnConfigs="columnConfigs"
						itemKey="id" 
						:contentFun="(item)=>item.iterationName"
					> 
					<template #toolbar="{element}">
						<MdpSelect showStyle="tag" itemCode="projectStatus" disabled v-model="element.istatus"/>
					</template>
					</MdpTableKanban>
				</MdpDialog>
</template>

<script>
import util from '@/components/mdp-ui/js/util';//全局公共库
import config from "@/api/mdp_pub/mdp_config"; //全局公共库

import {
  listXmIteration,
  listXmIterationWithState,
  delXmIteration,
  batchDelXmIteration,
  editXmIteration,
} from "@/api/xm/core/xmIteration";
import {
  loadTasksToXmIterationState,
} from "@/api/xm/core/xmIterationState";
import {
  addXmIterationLink,
  delXmIterationLink,
} from "@/api/xm/core/xmIterationLink";

import XmIterationAdd from './XmIterationEdit.vue'; //新增界面
import XmIterationEdit from './XmIterationEdit.vue'; //修改界面 

import { mapState } from 'pinia'
import { useUserStore } from '@/store/modules/user' 

	
import { MdpTableMixin } from '@/components/mdp-ui/mixin/MdpTableMixin.js'
import { useXmStore,useXmStore2 } from '@/store/modules/xm';

	export default {
		mixins:[MdpTableMixin],
  computed: {
    ...mapState(useUserStore,["userInfo", "roles"]),

    xmIterationTreeData() {
      return this.xmIterations;
    },
  },
  props: ["xmProduct", "selProject", "menuId", "visible"],
  watch: {
    visible: function (visible) {
		this.product=this.xmProduct
      if (visible == true) {
        this.searchTableDatas();
      }
    },
    xmProduct: function () {
		this.product=this.xmProduct
      	this.searchTableDatas();
    },
    selProject: function () {
      this.searchTableDatas();
    },
  },
  data() {
    const beginDate = new Date();
    const endDate = new Date();
    beginDate.setTime(beginDate.getTime() - 3600 * 1000 * 24 * 7 * 4 * 12);
    endDate.setTime(endDate.getTime() + 3600 * 1000 * 24 * 7 * 4 * 12);
    return {
      filters: {
        iterationName: "",
        queryScope: "", //迭代查询范围 iterationId\branchId\compete\''
        id: "", //迭代编号
		    xmProduct:null,
        onlineTimeStart:'',
        onlineTimeEnd:'',
      },
      xmIterations: [], //查询结果
      pageInfo: {
        //分页数据
        total: 0, //服务器端收到0时，会自动计算总记录数，如果上传>0的不自动计算。
        pageSize: 10, //每页数据
        count:true, //是否需要重新计算总记录数
        pageNum: 1, //当前页码、从1开始计算
        orderFields: ['ctime'], //排序列 如 ['sex','student_id']，必须为数据库字段
        orderDirs: ['desc'], //升序 asc,降序desc 如 性别 升序、学生编号降序 ['asc','desc']
      },
      load: { list: false, edit: false, del: false, add: false }, //查询中...
      sels: [], //列表选中数据
      dicts: {
        //sex:[],
      }, //下拉选择框的所有静态数据 params=[{categoryId:'0001',itemCode:'sex'}] 返回结果 {'sex':[{optionValue:'1',optionName:'男',seqOrder:'1',fp:'',isDefault:'0'},{optionValue:'2',optionName:'女',seqOrder:'2',fp:'',isDefault:'0'}]}

      addFormVisible: false, //新增xmIteration界面是否显示
      //新增xmIteration界面初始化数据
      addForm: {
        id: "",
        branchId: "",
        iterationName: "",
        startTime: "",
        endTime: "",
        onlineTime: "",
        pid: "",
        adminUserid: "",
        adminUsername: "",
        ctime: "",
        budgetCost: "",
        budgetWorkload: "",
        seqNo: "",
        istatus: "",
        cuserid: "",
        cusername: "",
        remark: "",
        iphase: "",
        isTpl: "",
        productId: "",
        productName:''
      },

      editFormVisible: false, //编辑界面是否显示
      //编辑xmIteration界面初始化数据
      editForm: {
        id: "",
        branchId: "",
        iterationName: "",
        startTime: "",
        endTime: "",
        onlineTime: "",
        pid: "",
        adminUserid: "",
        adminUsername: "",
        ctime: "",
        budgetCost: "",
        budgetWorkload: "",
        seqNo: "",
        istatus: "",
        cuserid: "",
        cusername: "",
        remark: "",
        iphase: "",
        isTpl: "",
        productId: "",
        productName:''
      },
      editFormInit: {
        id: "",
        branchId: "",
        iterationName: "",
        startTime: "",
        endTime: "",
        onlineTime: "",
        pid: "",
        adminUserid: "",
        adminUsername: "",
        ctime: "",
        budgetCost: "",
        budgetWorkload: "",
        seqNo: "",
        istatus: "",
        cuserid: "",
        cusername: "",
        remark: "",
        iphase: "",
        isTpl: "",
        productId: "",
        productName:''
      },

      /**begin 自定义属性请在下面加 请加备注**/
      valueChangeRows: [],
      parentIteration: null,
      iterationStateVisible: false,
      iterationSelectVisible: false,
      gstcVisible: false,
      maxTableHeight: 300,
      moreVisible:false,
      ganrrColumns: {
        children: "children",
        name: "iterationName",
        id: "id",
        pid: "pid",
        startDate: "startTime",
        endDate: "endTime",
      },
      menukey: "unFocus",
      apis:{
        list: listXmIterationWithState, 
        del: delXmIteration,
        batchDel: batchDelXmIteration
      }
      /**end 自定义属性请在上面加 请加备注**/
    };
  }, //end data
  methods: { 
    //获取列表 XmIteration 迭代定义
    preQueryParamCheck( params ) { 
      if (this.selProject) {
        params.linkProjectId = this.selProject.id;
      }
      if (this.menuId) {
        params.menuId = this.menuId;
      } 
      if(this.product?.id){
        params.productId=this.product.id
      }
      return true
    },

    //显示编辑界面 XmIteration 迭代定义
    showEdit: function (row, index) {
      this.editFormVisible = true;
      this.editForm = Object.assign({}, row);
    },
    //显示新增界面 XmIteration 迭代定义
    showAdd: function () {
      this.parentIteration = null;
      this.addFormVisible = true;
    },
    showSubAdd: function (row) {
      this.parentIteration = row;
      this.addFormVisible = true;
    },
    afterAddSubmit(xmIteration) {
      this.addFormVisible = false;
      this.pageInfo.count = true;
      this.searchTableDatas();
    },
    afterEditSubmit() {
      this.editFormVisible = false;
    },

    //进入info界面
    intoInfo(row) { 
      
      useXmStore2().setXmIteration(row).then(res=>{
        this.$router.push({
          path:'/xm/iteration/view/overview',
          query:{
            iterationId:row.id
          }
        })
      })
    },
      
    loadTasksToXmIterationState(row) {
      this.load.edit = true;
      loadTasksToXmIterationState({ id: row.id }).then((res) => {
        this.load.edit = false;
        var tips = res.tips;
        if (tips.isOk) {
          this.searchTableDatas();
        }
        this.$notify({
          position: "bottom-left",
          showClose: true,
          message: tips.msg,
          type: tips.isOk ? "success" : "error",
        });
      });
    },
     
    formatterDate(row, column, cellValue, index) {
      if (cellValue) {
        return cellValue.substr(0, 10);
      } else {
        return cellValue;
      }
    },
    focusOrUnfocus: function (row) {
      if (this.menukey == "myFocus") {
        this.$mdp.delUserFocus({
          pbizId: row.productId,
          focusType: "6",
          bizId: row.id,
          bizName: row.iterationName,
        }).then((res) => {
          var tips = res.tips;
          this.$notify({
            position: "bottom-left",
            showClose: true,
            message: tips.msg,
            type: tips.isOk ? "success" : "error",
          });
        });
      } else {
        this.$mdp.addUserFocus({
          pbizId: row.productId,
          focusType: "6",
          bizId: row.id,
          bizName: row.iterationName,
        }).then((res) => {
          var tips = res.tips;
          this.$notify({
            position: "bottom-left",
            showClose: true,
            message: tips.msg,
            type: tips.isOk ? "success" : "error",
          });
        });
      }
    },
	onProductSelected(row){
		this.product=row
	},
	onProductClearSelect(){
		this.product=null;
	}
  }, //end methods
  components: {
    "xm-iteration-add": XmIterationAdd,
    "xm-iteration-edit": XmIterationEdit, 
    
    //在下面添加其它组件
  },
  mounted() { 
	  this.product=this.xmProduct  
  },
};
</script>

<style scoped>
.more-label-font {
  text-align: center;
  float: left;
  padding-top: 5px;
}
</style>
