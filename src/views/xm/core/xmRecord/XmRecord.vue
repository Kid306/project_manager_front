<template>
	<ContentWrap>
		<template #header>
			<el-space wrap>
				<mdp-hi-query :column-configs="columnConfigs" v-model="hiQueryParams" @change="onHiQueryParamsChange"/>
          <el-button icon="zoom-out" @click="searchReset()" title="重置查询条件并查询"/>
          
          <span v-if="currOpType=='mng'">
              <el-button :disabled="disBtn('addBtn') || !checkBtnQx('addBtn',menuDefId) " type="primary" @click="showAdd" icon="plus" plain/>
              <el-button :disabled="disBtn('delBtn') || !checkBtnQx('delBtn',menuDefId) || sels.length===0 || load.del==true" type="danger" v-loading="load.del" @click="batchDel" icon="delete" plain/>
          </span> 
          
         <mdp-export @excel="export2Excel()"/>
          <mdp-table-configs :column-configs="columnConfigs" v-model="checkedColumns"/>

			</el-space>

		</template>
		<el-space>
			<MdpSelect  v-if="!simple" itemCode="objType" v-model="filters.objType" placeholder="对象类型"/>
			<XmProjectSelect v-model="filters.projectId" :link-product-id="productId" v-if="!projectId && !bizId"/>
			<XmProductSelect v-model="filters.productId" :link-project-id="projectId" v-if="!productId&& !bizId"/>
			<el-input v-model="filters.remarks"  placeholder="操作说明"/>
			<el-input v-model="filters.operUsername"  placeholder="操作人"/>
 			<el-button type="primary" v-loading="load.list" :disabled="load.list==true" @click="searchTableDatas">查询</el-button>
		</el-space>
		
	</ContentWrap> 
			<!--列表 XmRecord xm_record-->
			<el-table  ref="table" v-adaptive="{bottom:50}" :data="tableDatas" @sort-change="sortChange" highlight-current-row v-loading="load.list" border @selection-change="selsChange" @row-click="rowClick" style="width: 100%;">
				<el-table-column sortable type="index" width="40" />
				<el-table-column prop="operUsername" label="操作人" min-width="100"   sortable/>
				
				<el-table-column prop="objType" label="类型" width="80"  sortable>
					<template #default="scope">
						<MdpSelect v-model="scope.row.objType" itemCode="objType" :disabled="true" showStyle="tag"/>
					</template>
					</el-table-column>
				<el-table-column prop="projectId" label="项目/产品" v-if="!simple" min-width="80" show-overflow-tooltip  sortable>
					<template #default="scope">
						{{scope.row.projectId?scope.row.projectId:scope.row.productId}}
					</template>
				</el-table-column>   
				<el-table-column prop="remarks" label="操作说明" min-width="350">
					<template #default="scope">
						<el-link @click="$refs['dlg'].open(scope.row)" >
							<div class="image-box-record" style="width:100%;max-height:200px;overflow-y: scroll;"> 
								<div  v-html="scope.row.remarks" ></div>
							</div>

						</el-link>
					</template>

				</el-table-column>  
				
				<el-table-column prop="operTime" label="操作时间" min-width="80"  show-overflow-tooltip  sortable/> 
			</el-table> 
		<el-pagination  layout="total, sizes, prev, pager, next" @current-change="handleCurrentChange" @size-change="handleSizeChange" :page-sizes="[10,20, 50, 100, 500]" :current-page="pageInfo.pageNum" :page-size="pageInfo.pageSize"  :total="pageInfo.total" style="float:right;" />
	<MdpDialog width="80%" ref="dlg">
		<template #default="{data}">   
					<el-form label-position="left"> 
						<el-row>
							<el-col :span="6">
						<el-form-item label="对象类型：" prop="objType">
								<MdpSelect v-model="data.objType" itemCode="objType" :disabled="true" showStyle="tag"/> 
							</el-form-item>

							</el-col>
							<el-col :span="6" v-if="data.projectId||data.productId">

								<el-form-item label="归属项目：" prop="projectId" v-if="data.projectId">
								{{data.projectId}}
							</el-form-item>
							<el-form-item label="归属产品：" prop="productId"  v-else-if="data.productId">
								{{data.productId}}
							</el-form-item> 
							</el-col>
							<el-col :span="6">
							<el-form-item label="对象编号：" prop="bizId">
								{{data.bizId}}
							</el-form-item>

							</el-col>
							<el-col :span="6">
							<el-form-item label="上级编号：" prop="bizId">
								{{data.bizId}}
							</el-form-item> 

							</el-col>
							<el-col :span="6">
							<el-form-item label="操作：" prop="action">
								<el-tag type="warning">{{data.action}}</el-tag>
							</el-form-item> 

							</el-col>
							<el-col :span="6">
							<el-form-item label="操作人：" prop="username">
								<el-tag type="warning">{{data.operUsername}}</el-tag>
							</el-form-item> 

							</el-col>
							<el-col :span="6">
							<el-form-item label="操作人ip：" prop="ip">
								<el-tag type="warning">{{data.ip}}</el-tag>
							</el-form-item> 

							</el-col>
							<el-col :span="6">
							<el-form-item label="操作时间：" prop="operTime">
								<el-tag type="warning">{{data.operTime}}</el-tag>
							</el-form-item> 

							</el-col>
						</el-row>
							


						</el-form> 
					<el-form label-position="top">  
							<el-form-item label="操作说明：" prop="remarks">
								<div class="image-box-record padding border"> 
											<div  v-html="data.remarks" ></div>
									</div>
							</el-form-item> 
						</el-form>  
			

		</template>
		<template #footer>
			<el-button icon="close" @click="$refs['dlg'].close()">关闭</el-button>
		</template>
	</MdpDialog>
</template>

<script>
	import util from '@/components/mdp-ui/js/util';//全局公共库 

	import { listXmRecord, delXmRecord, batchDelXmRecord } from '@/api/xm/core/xmRecord';
	import { mapState } from 'pinia'
import { useUserStore } from '@/store/modules/user'
import { MdpTableMixin } from '@/components/mdp-ui/mixin/MdpTableMixin.js';

	export default {
		mixins:[MdpTableMixin],
		computed: {
		    ...mapState(useUserStore,[
		      'userInfo','roles'
		    ])
		},
		props:["projectId",'productId',"objType","bizId","simple" ,"visible",'pbizId','topId'],
		watch:{ 
			bizId:function(bizId){
				this.searchTableDatas();
			}
		},
		data() {
			return {
				currOpType: 'select',
				filters: {
					key: '',
					objType:'',
				}, 
				pageInfo:{//分页数据
					total:0,//服务器端收到0时，会自动计算总记录数，如果上传>0的不自动计算。
					pageSize:10,//每页数据
					count:true,//是否需要重新计算总记录数
					pageNum:1,//当前页码、从1开始计算
					orderFields:["oper_time"],//排序列 如 ['sex','student_id']，必须为数据库字段
					orderDirs:["desc"]//升序 asc,降序desc 如 性别 升序、学生编号降序 ['asc','desc']
				},
  
				addFormVisible: false,//新增xmRecord界面是否显示
				//新增xmRecord界面初始化数据
				addForm: {
					id:'',projectId:'',operUserid:'',operUsername:'',operTime:'',objType:'',action:'',oldValue:'',newValue:'',remarks:'',taskId:'',reqNo:'',branchId:'',ip:''
				},

				editFormVisible: false,//编辑界面是否显示
				//编辑xmRecord界面初始化数据
				editForm: {
					id:'',projectId:'',operUserid:'',operUsername:'',operTime:'',objType:'',action:'',oldValue:'',newValue:'',remarks:'',taskId:'',reqNo:'',branchId:'',ip:''
				}, 
				apis:{
					list: listXmRecord,
					del: delXmRecord,
					batchDel: batchDelXmRecord
				}
			}
		},//end data
		methods: {
			 
			//获取列表 XmRecord xm_record
			preQueryParamCheck( params ) {
				 
				if(this.projectId){
					params.projectId=this.projectId;
				}
				if(this.productId){
					params.productId=this.productId;
				}
				if(this.bizId){
					params.bizId=this.bizId;
				}
				if(this.pbizId){
					params.pbizId=this.pbizId;
				}
				if(this.topId){
					params.topId=this.topId;
				}
			 return  true;
			},
			initCurrData(){
				this.filters.objType=this.objType
				this.filters.bizId=this.bizId
				this.filters.projectId=this.projectId
				this.filters.productId=this.productId
				this.searchTableDatas()
			}

		},//end methods
		components: {

		    //在下面添加其它组件
		},
		mounted() {  
			this.initData()
		}
	}

</script>
<style lang="less">
.image-box-record {
  width: 100%; /* 容器宽度百分百 */ 
  overflow: hidden; /* 超出容器的图片部分将被隐藏 */
}
 
.image-box-record img {
  width: 100%; /* 图片宽度百分百 */ 
  object-fit:contain; /* 裁剪并覆盖容器 */
} 
</style> 
