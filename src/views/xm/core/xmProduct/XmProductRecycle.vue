<template>
<ContentWrap>
		<template #header>
			<el-space wrap>
				<mdp-hi-query ref="hiQueryBtn"
          :column-configs="columnConfigs"
          v-model="hiQueryParams"
          @change="onHiQueryParamsChange"
        />
        <el-button icon="zoom-out" @click="searchReset()" title="重置查询条件并查询" ref="searchResetBtn"/>
  

        <mdp-export @excel="export2Excel()" ref="downloadBtn"/>
        <mdp-table-configs :column-configs="columnConfigs" v-model="checkedColumns" ref="columnConfigsBtn"/>  
				 
 
			</el-space>
		</template>
				<el-space wrap>
					<mdp-select width="250px" v-model="filters.queryScope" :options="[
						{id:'branchId',name:userInfo.branchName+'机构下所有的产品'}, 
						{id:'compete',name:'我相关的产品'}, 
						{id:'productId',name:'按产品编号精确查找'},
						{id:'createUserid',name:'我创建的'},
						{id:'pmUserid',name:'我担任产品经理的'},
						{id:'assUserid',name:'我担任产品助理的'},
						{id:'admUserid',name:'我担任产品主管的'},
						{id:'myFocus',name:'我关注的'}, 
				]"   placeholder="产品查询范围" clear ref="queryScopeBtn" @change="onQueryScopeChange"/>
					<mdp-select placeholder="状态" itemCode="xmProductPstatus" v-model="filters.pstatus"/>
					<el-input v-if="filters.queryScope=='productId'" style="width:20%;"  v-model="filters.id"  placeholder="输入产品编号" @keyup.enter="searchTableDatas" clearable/>
					<el-input v-if="filters.queryScope!='productId'" v-model="filters.productName" style="width: 20%;" placeholder="名称查询" clearable/>
					<el-button ref="searchBtn" type="primary" v-loading="load.list" :disabled="load.list==true" @click="searchTableDatas" icon="search">查询</el-button>
 
				</el-space>
			</ContentWrap>    
			<!--列表 XmProduct 产品表-->
			<el-table  ref="table"  v-adaptive="{bottom:50}" :data="tableDatas" @sort-change="sortChange" :highlight-current-row="true" current-row-key="id" v-loading="load.list" border @selection-change="selsChange" @row-click="rowClick" style="width: 100%;">
 				 <el-table-column type="index" width="60"/> 
					<el-table-column prop="id" label="产品编码" min-width="150" sortable   show-overflow-tooltip/>
					<el-table-column prop="code" label="产品代号" min-width="150" sortable  show-overflow-tooltip/>

					<el-table-column prop="productName" label="产品名称" min-width="150" sortable  show-overflow-tooltip colPrefix="res."/>
				<el-table-column prop="pstatus" label="状态" width="120" sortable>
					<template #default="scope"> 
						<mdp-select  title="产品状态" itemCode="xmProductPstatus" show-style="tag" v-model="scope.row.pstatus" :disabled="true"/>
					</template>
				</el-table-column>
				<el-table-column prop="finishRate" label="进度" width="120" sortable>
					<template #default="scope">
						 <el-tag :type="scope.row.finishRate>=100?'success':'warning'">{{scope.row.finishRate}}%</el-tag> 
					</template>
				</el-table-column>
				<el-table-column prop="pmUsername" label="产品经理" width="120" sortable show-overflow-tooltip>
					<template #default="scope">
						<el-tag v-if="scope.row.pmUsername">{{scope.row.pmUsername}}</el-tag>
					</template>
				</el-table-column>

				<el-table-column label="工作量(人时)" width="200">
					<el-table-column prop="budgetWorkload" label="预计" width="120"  show-overflow-tooltip sortable />
					<el-table-column prop="actWorkload" label="实际" width="120"  show-overflow-tooltip sortable />
				</el-table-column>
				<el-table-column   label="操作" width="120" fixed="right"  >
					<template #default="scope">
						<el-button type="primary" @click="unDel( scope.row,scope.$index)">撤销删除</el-button>
					</template>
				</el-table-column>
			</el-table>
			<el-pagination  layout="total, prev, next" @current-change="handleCurrentChange" @size-change="handleSizeChange" :page-sizes="[10,20, 50, 100, 500]" :current-page="pageInfo.pageNum" :page-size="pageInfo.pageSize"  :total="pageInfo.total" style="float:right;" />
 
 
	
</template>

<script>
	import util from '@/components/mdp-ui/js/util';//全局公共库
	//import Sticky from '@/components/Sticky' // 粘性header组件

	import { delXmProduct, listXmProductWithState,unDelXmProduct } from '@/api/xm/core/xmProduct';
	import { mapState } from 'pinia'
import { useUserStore } from '@/store/modules/user'
	
	import { loadTasksToXmProductState } from '@/api/xm/core/xmProductState';

	import { MdpTableMixin } from '@/components/mdp-ui/mixin/MdpTableMixin.js'

export default {
	mixins:[MdpTableMixin], 
		computed: {
		    ...mapState(useUserStore,[
		      'userInfo','roles'
		    ])
		},
		data() { 
			return {
				filters: {
					key: '',
					queryScope:'compete',
					id:'',//产品编号 
				}, 
				pageInfo:{//分页数据
					total:0,//服务器端收到0时，会自动计算总记录数，如果上传>0的不自动计算。
					pageSize:10,//每页数据
					count:true,//是否需要重新计算总记录数
					pageNum:1,//当前页码、从1开始计算
					orderFields:[],//排序列 如 ['sex','student_id']，必须为数据库字段
					orderDirs:[]//升序 asc,降序desc 如 性别 升序、学生编号降序 ['asc','desc']
				},
 
				addFormVisible: false,//新增xmProduct界面是否显示
				//新增xmProduct界面初始化数据
				addForm: {
					id:'',productName:'',branchId:'',remark:''
				},

				editFormVisible: false,//编辑界面是否显示
				//编辑xmProduct界面初始化数据
				editForm: {
					id:'',productName:'',branchId:'',remark:''
				},    
				apis:{
					list: listXmProductWithState,
					del: delXmProduct,
				}
			}
		},//end data
		methods: {
			
			onQueryScopeChange(queryScope){
				if(queryScope=='myFocus'){
					this.$mdp.listUserFocus({focusType:'3',pageNum:1,pageSize:20}).then(res=>{
						let {tips,data} = res
						if(data && data.length>0){
							this.filters.id='$IN'+data.map(k=>k.bizId).join(",") 
						}
					})
				}else{
					this.filters.id=''
				}

			},
			//获取列表 XmProduct 产品表
			preQueryParamCheck( params ) {
				  params.del='1'
					return true;
			},
 
			unDel: function (row,index) {
				this.$prompt('将同步恢复计划、组织、需求等，慎重起见，请输入产品代号:'+row.code, '提示', {
					confirmButtonText: '确定',
					cancelButtonText: '取消',
				}).then(({ value }) => {
					 if(value==row.code){
						this.load.del=true;
						let params = { id: row.id };
						unDelXmProduct(params).then((res) => {
							this.load.del=false;
							var tips=res.tips;
							if(tips.isOk){
								this.pageInfo.count=true;
								this.searchTableDatas();
							}
							this.$notify({position:'bottom-left',showClose:true,message: tips.msg, type: tips.isOk?'success':'error' });
						}).catch( err  => this.load.del=false );
					 }else{
						 this.$notify({position:'bottom-left',showClose:true,message: "产品代号不正确", type: 'error' });
					 }
				}).catch(() => {
					return;
				});
			},
		},//end methods
		components: { 
		    //在下面添加其它组件
		},
		mounted() { 
		}
	}

</script>
<style scoped>
 
</style>
