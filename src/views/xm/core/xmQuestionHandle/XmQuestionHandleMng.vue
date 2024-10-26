<template>
	 
			<!--列表 XmQuestionHandle xm_question_handle-->
			<el-table ref="table" :data="tableDatas" @sort-change="sortChange" highlight-current-row v-loading="load.list" border @selection-change="selsChange" @row-click="rowClick" style="width: 100%;">
				<el-table-column prop="handlerUsername" label="负责人" width="150" sortable>
					<template #default="{row,$index}">
						
						 <div v-if="row.targetUsername && row.handlerUsername!=row.targetUsername">
							{{ $index+1 }}{{ row.handlerUsername }} <icon icon="ep:arrow-right"/> {{row.targetUsername}}
						</div>
						<div v-else>
							{{ $index+1 }}{{ row.handlerUsername }}
						</div>
					</template>
				</el-table-column> 
				<el-table-column prop="handleStatus" label="状态" width="80"  sortable>
					<template #default="scope">
						<mdp-select show-style="tag" itemCode="bugStatus" v-model="scope.row.handleStatus" :disabled="true" />
 					</template>
				</el-table-column>
				<el-table-column prop="receiptTime" label="时间" width="150" show-overflow-tooltip  sortable/>

				<el-table-column prop="receiptMessage" label="操作说明" min-width="250">
					<template #default="scope" >
						<el-link @click="showBigDialog(scope.row)" >
							<div class="image-box-bug" style="max-height:200px;overflow-y: scroll;">

								<div  v-html="scope.row.receiptMessage" ></div>
							</div>

						</el-link>
					</template>
				</el-table-column>
 			</el-table>
			<el-pagination  layout="total, sizes, prev, pager, next" @current-change="handleCurrentChange" @size-change="handleSizeChange" :page-sizes="[10,20, 50, 100, 500]" :current-page="pageInfo.pageNum" :page-size="pageInfo.pageSize"  :total="pageInfo.total" style="float:right;" />
  
			<MdpDialog width="80%" ref="dlg" title="操作日志明细">
		<template #default="{data}">   
					<el-form label-position="left"> 
						<el-row>
							<el-col :span="6">

								<el-form-item label="缺陷编号：" prop="questionId">
							<icon icon="fa:bug" color="red"/>	 {{data.questionId}} 
							</el-form-item> 
							</el-col>
							<el-col :span="6">

								<el-form-item label="缺陷状态：" prop="handleStatus">
								<MdpSelect v-model="data.handleStatus" itemCode="bugStatus" :disabled="true" showStyle="tag"/> 
							</el-form-item>
							</el-col>
							<el-col :span="6">

								<el-form-item label="解决方案：" prop="handleSolution">
								<MdpSelect v-model="data.handleSolution" itemCode="bugSolution" :disabled="true" showStyle="tag"/>  
							</el-form-item>
							</el-col>
							<el-col :span="6">

								<el-form-item label="负责人：">
								<div v-if="data.targetUsername && data.handlerUsername!=data.targetUsername">
								 {{ data.handlerUsername }} <icon icon="ep:arrow-right"/> {{data.targetUsername}}
								</div>
								<div v-else>
								 {{ data.handlerUsername }}
								</div>
							</el-form-item>  
							</el-col>
							<el-col :span="6">

								<el-form-item label="操作人：" prop="operUsername">
								<el-tag type="warning">{{data.operUsername||'无'}}</el-tag>
							</el-form-item>  
							</el-col>
							<el-col :span="6">

							
								<el-form-item label="操作时间：" prop="createTime">
								<el-tag type="warning">{{data.createTime}}</el-tag>
							</el-form-item>  
							</el-col> 
						</el-row>
							
						</el-form> 
			<el-form label-position="top">  
							<el-form-item label="操作说明：" prop="receiptMessage">
								<div class="image-box-bug padding border"> 
											<div  v-html="data.receiptMessage" ></div>
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
	//import Sticky from '@/components/Sticky' // 粘性header组件

	import { listXmQuestionHandle, delXmQuestionHandle, batchDelXmQuestionHandle } from '@/api/xm/core/xmQuestionHandle';
	import { mapState } from 'pinia'
import { useUserStore } from '@/store/modules/user'
import { MdpTableMixin } from '@/components/mdp-ui/mixin/MdpTableMixin.js';

	export default {
		mixins:[MdpTableMixin],
		props:["bug","visible"],
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
				}, 
				pageInfo:{//分页数据
					total:0,//服务器端收到0时，会自动计算总记录数，如果上传>0的不自动计算。
					pageSize:10,//每页数据
					count:true,//是否需要重新计算总记录数
					pageNum:1,//当前页码、从1开始计算
					orderFields:['last_update_time'],//排序列 如 ['sex','student_id']，必须为数据库字段
					orderDirs:['desc']//升序 asc,降序desc 如 性别 升序、学生编号降序 ['asc','desc']
				}, 
				//新增xmQuestionHandle界面初始化数据
				addForm: {
					id:'',handlerUserid:'',handlerUsername:'',handleSolution:'',receiptMessage:'',receiptTime:'',handleStatus:'',bizProcInstId:'',bizFlowState:'',questionId:'',lastUpdateTime:'',createTime:'',actWorkload:'',actCostAmount:'',urls:'',targetUserid:'',targetUsername:''
				}, 
				//编辑xmQuestionHandle界面初始化数据
				editForm: {
					id:'',handlerUserid:'',handlerUsername:'',handleSolution:'',receiptMessage:'',receiptTime:'',handleStatus:'',bizProcInstId:'',bizFlowState:'',questionId:'',lastUpdateTime:'',createTime:'',actWorkload:'',actCostAmount:'',urls:'',targetUserid:'',targetUsername:''
				}, 
				bigDialogVisible:false,
				/**begin 自定义属性请在下面加 请加备注**/
				apis:{
					list: listXmQuestionHandle,
				}
				/**end 自定义属性请在上面加 请加备注**/
			}
		},//end data
		methods: { 
			//获取列表 XmQuestionHandle xm_question_handle
			preQueryParamCheck(params) { 
				if(this.bug){
					params.questionId=this.bug.id
				} 
				return true;
			},

			//显示编辑界面 XmQuestionHandle xm_question_handle
			showEdit: function ( row,index ) {
				this.editFormVisible = true;
				this.editForm = Object.assign({}, row);
			}, 
			rowClick: function(row, event, column){
				this.$emit('row-click',row, event, column);//  @row-click="rowClick"
			},
			showBigDialog(row){ 
				this.$refs['dlg'].open(row)
			} 

		},//end methods
		components: {

		    //在下面添加其它组件
		},
		mounted() { 
		}
	}

</script>

 <style lang="less">
.image-box-bug {
  width: 100%; /* 容器宽度百分百 */ 
  overflow: hidden; /* 超出容器的图片部分将被隐藏 */
}
 
.image-box-bug img {
  width: 100%; /* 图片宽度百分百 */ 
  object-fit:contain; /* 裁剪并覆盖容器 */
}
</style> 
