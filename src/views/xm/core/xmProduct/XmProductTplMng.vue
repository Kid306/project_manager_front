<template>
	<ContentWrap> 
		<el-space wrap>
			<el-checkbox v-model="filters.isMy" false-label="" true-label="1">我的模板</el-checkbox>
			<el-input style="width:300px;" v-model="filters.key" placeholder="模板名字"/>
			<el-button @click="searchTableDatas" icon="search"/>

			
			<mdp-hi-query ref="hiQueryBtn"
          :column-configs="columnConfigs"
          v-model="hiQueryParams"
          @change="onHiQueryParamsChange"
        />
        <el-button icon="zoom-out" @click="searchReset()" title="重置查询条件并查询" ref="searchResetBtn"/> 

        <mdp-export @excel="export2Excel()" ref="downloadBtn"/>
        <mdp-table-configs :column-configs="columnConfigs" v-model="checkedColumns" ref="columnConfigsBtn"/>  
				 
		</el-space> 
	</ContentWrap> 
			<!--列表 XmProduct 产品表-->
			<el-table ref="table"  v-adaptive="{bottom:50}" :data="tableDatas" @sort-change="sortChange" highlight-current-row v-loading="load.list"  @selection-change="selsChange" @row-click="rowClick" style="width: 100%;">

				<el-table-column    label="序号" width="60" type="index"  v-if="showType!='simple'"/>
				  <el-table-column prop="productName" label="产品模板(参考学习用)" min-width="150" sortable show-overflow-tooltip>
					<template #default="scope">
						<el-link  @click="intoInfo(scope.row)">{{scope.row.productName}}</el-link>
					</template>
				</el-table-column>
				<el-table-column prop="code" label="产品代号" min-width="100" sortable/>
				<el-table-column prop="pstatus" label="状态" width="120" sortable :formatter="formatPstatus"/>
				<el-table-column prop="finishRate" label="进度" width="120" sortable>
					<template #default="scope">
						<font  ><el-tag :type="scope.row.finishRate>=100?'success':'warning'">{{scope.row.finishRate}}%</el-tag>
						</font>
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
				<el-table-column  label="" width="120" fixed="right">
					<template #default="scope">
						<el-button type="text" title="通过复制创建新的项目" @click="onCopyToBtnClick(scope.row)" :disabled="load.add" v-loading="load.add">复制</el-button>
						<el-button type="text" title="删除该模板" @click="handleDel(scope.row)" :disabled="load.del" v-loading="load.del">删除</el-button>
					</template>
				</el-table-column>
			</el-table>
			<el-pagination  layout="total, sizes, prev, pager, next" @current-change="handleCurrentChange" @size-change="handleSizeChange" :page-sizes="[10,20, 50, 100, 500]" :current-page="pageInfo.pageNum" :page-size="pageInfo.pageSize"  :total="pageInfo.total" style="float:right;" />
 

		<mdp-dialog
			title="通过复制创建新的模板或者新的产品"
			v-model="copyToVisible"
			width="500" >
			<el-form>
			<el-form-item label="产品名称">
				<el-input v-model="xmProductCopy.productName" placeholder="新的产品名称"/>
			</el-form-item>
			<el-form-item  label="产品代号">
				<el-input v-model="xmProductCopy.code"  placeholder="新的产品代号">

							<template #append>
								<el-button type="text" @click="createProductCode">自动生成</el-button>
							</template>
				</el-input>

						<font color="blue" style="font-size:10px;">产品代号为合同上的产品代号，甲乙方共享；产品内部编号为&nbsp;代号-四位随机码</font>
			</el-form-item>
			<el-form-item  label="目标">
				<el-radio v-model="xmProductCopy.isTpl" label="1">复制为新的模板</el-radio>
				<el-radio v-model="xmProductCopy.isTpl" label="0">复制为新的产品</el-radio>
			</el-form-item>
			<el-form-item label="附加任务">
				<el-checkbox v-model="xmProductCopy.copyMenu" true-label="1" false-label="0">拷贝需求列表</el-checkbox>
				<el-checkbox v-model="xmProductCopy.copyPhase" true-label="1" false-label="0">拷贝计划</el-checkbox>
				<el-checkbox v-model="xmProductCopy.copyGroup" true-label="1" false-label="0">拷贝组织架构</el-checkbox>
				<el-checkbox v-model="xmProductCopy.copyGroupUser" true-label="1" false-label="0">拷贝产品组成员</el-checkbox>
			</el-form-item>
			</el-form>
			<template #footer>
				<span class="footer">
					<el-button @click="copyToVisible = false">取 消</el-button>
					<el-button type="primary" @click="onCopyToConfirm" :disabled="load.add" v-loading="load.add">确 定</el-button>
				</span>
			</template>	
		</mdp-dialog>
	
</template>

<script>
	import util from '@/components/mdp-ui/js/util';//全局公共库
	//import Sticky from '@/components/Sticky' // 粘性header组件

	import { listXmProduct,listXmProductWithState, delXmProduct, batchDelXmProduct,copyTo,createProductCode } from '@/api/xm/core/xmProduct';
	import { addXmIterationLink,delXmIterationLink } from '@/api/xm/core/xmIterationLink';
	import { loadTasksToXmProductState } from '@/api/xm/core/xmProductState';
 	import  XmProductEdit from './XmProductEdit.vue';//修改界面
	import { mapState } from 'pinia'
import { useUserStore } from '@/store/modules/user'
	
import { MdpTableMixin } from '@/components/mdp-ui/mixin/MdpTableMixin.js'

	export default {
		mixins:[MdpTableMixin],
		props:['selProject','xmIteration'],
		computed: {
		    ...mapState(useUserStore,[
		      'userInfo','roles'
		    ])
		},
		watch:{
		},
		data() { 
			return {
				filters: {
					key: '',
					queryScope:'',//compete/branchId/''/productId
					id:'',//产品编号 
					isMy:'',

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
				xmProductCopy:{
					id:'',productName:'',code:'',isTpl:'',copyMenu:'1',copyPhase:'1',copyGroup:'1',copyGroupUser:'0'
				},
				copyToVisible:false, 
				apis:{
					list: listXmProductWithState, 
				}
			}
		},//end data
		methods: {
			 
			//获取列表 XmProduct 产品表
			preQueryParamCheck(params) {
				  
				 if(this.filters.isMy=='1'){
					 params.createUserid=this.userInfo.userid
				 }
				params.isTpl="1" 
				return true;
			},

			//显示编辑界面 XmProduct 产品表
			showEdit: function ( row,index ) {
				this.editFormVisible = true;
				this.editForm = Object.assign({}, row);
			},
			//显示新增界面 XmProduct 产品表
			showAdd: function () {
				this.addFormVisible = true;
				//this.addForm=Object.assign({}, this.editForm);
			},
			afterAddSubmit(xmProduct){
				this.addFormVisible=false;
				this.pageInfo.count=true;
				if(this.xmIteration){//如果是迭代试图进入的迭代界面，创建了产品直接添加产品与迭代的关系
					this.onXmProductSelect(xmProduct);
				}else{
					this.getXmProducts();
				}
			},
			afterEditSubmit(){
				this.editFormVisible=false;
				this.getXmProducts()
			},

			//进入info界面
			intoInfo(row) {
				this.editForm = row;
				this.$router.push({ name:'productOverview', query: {productId:row.id} })
				//this.showInfo = true;
			},
			//选择行xmProduct
			selsChange: function (sels) {
				this.sels = sels;
			},
			handleDel: function (row,index) {
				this.$prompt('将同步删除计划、组织、需求等，慎重起见，请输入产品代号:'+row.code, '提示', {
					confirmButtonText: '确定',
					cancelButtonText: '取消',
				}).then(({ value }) => {
					 if(value==row.code){
						this.load.del=true;
						let params = { id: row.id };
						delXmProduct(params).then((res) => {
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
			  

			onCopyToBtnClick(row){
				this.xmProductCopy.id=row.id;
				this.xmProductCopy.productName=row.productName+"(复制)";
				this.xmProductCopy.isTpl=row.isTpl;
				this.copyToVisible=true;
			},
			onCopyToConfirm(){
				if(!this.xmProductCopy.code){
					this.$notify({position:'bottom-left',showClose:true,message: '产品代号不能为空', type: 'error' });
					return;
				}

				this.load.add=true;
				copyTo(this.xmProductCopy).then(res=>{
					this.load.add=false;
					var tips = res.tips;
					if(tips.isOk){
						this.copyToVisible=false;
						if(this.xmProductCopy.isTpl=='1'){
							this.searchTableDatas()
						}
						this.$emit("copy",res.data)
					}

					this.$notify({position:'bottom-left',showClose:true,message: tips.msg, type: tips.isOk?'success':'error' });

				})
			},

			createProductCode(){
				createProductCode({}).then(res=>{
					var tips=res.tips;
					if(tips.isOk){
						this.xmProductCopy.code=res.data
					}
					this.$notify({position:'bottom-left',showClose:true,message: tips.msg, type: tips.isOk?'success':'error' });
				})
			},
			/**end 自定义函数请在上面加**/

		}, 
	}

</script>
 
 
