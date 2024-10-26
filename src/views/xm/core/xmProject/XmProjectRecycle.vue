<template>
	<ContentWrap>
		<el-space>
			 <el-input v-model="filters.name" style="width:60%;" placeholder="项目名称模糊查询"/>
			<el-button @click="searchTableDatas" icon="search"/>
		</el-space> 
	</ContentWrap>

			 <el-table  ref="table" border v-adaptive="{bottom:50}" v-cloak stripe :data="tableDatas" @sort-change="sortChange" highlight-current-row v-loading="load.list" @selection-change="selsChange" @row-click="rowClick" style="width: 100%;">
						<el-table-column  type="index" label="序号" width="80" sortable />
						<el-table-column prop="id" label="项目编码" min-width="150"  show-overflow-tooltip sortable/>
						<el-table-column prop="name" label="标题" min-width="200"  show-overflow-tooltip sortable/>
						<el-table-column prop="totalTaskCnt" label="任务数" min-width="80" />
						<el-table-column prop="totalCompleteTaskCnt" label="任务完成" min-width="80"   />
						<el-table-column prop="totalFileCnt" label="文档" min-width="80"   />
						<el-table-column prop="totalBugCnt" label="缺陷" min-width="80"   />
						<el-table-column label="进度" min-width="80"  >
							<template #default="scope">
								{{scope.row.finishRate}}%
							</template>
						</el-table-column>
						<el-table-column prop="startTime" label="起止时间" min-width="150"  show-overflow-tooltip sortable>
							<template #default="scope">
								{{scope.row.startTime? scope.row.startTime.substr(0,10) : ""}}~{{scope.row.endTime? scope.row.endTime.substr(0,10) : ""}}
							</template>
						</el-table-column>
						<el-table-column label="操作" width="120" fixed="right">
							<template #default="scope">
								<el-button  type="primary" @click.stop="unDel(scope.row)" >撤销删除</el-button>
							</template>
						</el-table-column>
					</el-table>
			<el-pagination  layout="total, sizes, prev, pager, next" @current-change="handleCurrentChange" @size-change="handleSizeChange" :page-sizes="[10,20, 50, 100, 500]" :current-page="pageInfo.pageNum" :page-size="pageInfo.pageSize"  :total="pageInfo.total" style="float:right;" />
 	

</template>

<script>
	
	import util from '@/components/mdp-ui/js/util';//全局公共库
	//import Sticky from '@/components/Sticky' // 粘性header组件
	import config from "@/api/mdp_pub/mdp_config"; //全局公共库

	import { listXmProject,unDelXmProject  } from '@/api/xm/core/xmProject';
	import { mapState } from 'pinia'
import { useUserStore } from '@/store/modules/user'
import { MdpTableMixin } from '@/components/mdp-ui/mixin/MdpTableMixin.js'

export default {
	mixins:[MdpTableMixin],
		computed: {
			...mapState(useUserStore,[
				'userInfo','roles'
			]),
		},
		data() {
			return {
				filters: {
					name: ''
				}, 
				apis:{
					list: listXmProject,
				}
			}
		},//end data
		methods: {
		 
			preQueryParamCheck(params) {
				 
				params.del="1"
				return true
			}, 
			unDel: function (row,index) {
				this.$prompt('将同步恢复计划、组织、任务等，慎重起见，请输入项目代号:'+row.code, '提示', {
					confirmButtonText: '确定',
					cancelButtonText: '取消',
				}).then(({ value }) => {
					 if(value==row.code){
						 this.load.del=true;
						let params = { id: row.id };
						unDelXmProject(params).then((res) => {
							this.load.del=false;
							var tips=res.tips;
							if(tips.isOk){
								this.pageInfo.count=true;
								this.searchTableDatas();
							}
							this.$notify({position:'bottom-left',showClose:true,message: tips.msg, type: tips.isOk?'success':'error' });
						}).catch( err  => this.load.del=false );
					 }else{
						 this.$notify({position:'bottom-left',showClose:true,message: "项目代号不正确", type: 'error' });
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

<style scoped />
