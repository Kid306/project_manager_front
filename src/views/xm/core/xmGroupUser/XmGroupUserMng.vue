<template>
	<ContentWrap>
		<template #header>
			<el-space>
				<mdp-hi-query
          :column-configs="columnConfigs"
          v-model="hiQueryParams"
          @change="onHiQueryParamsChange"
        />
        <el-button icon="zoom-out" @click="searchReset()" title="重置查询条件并查询" />

        <span v-if="currOpType == 'mng'">
          <el-button
            :disabled="disBtn('addBtn') || !checkBtnQx('addBtn', menuDefId)"
            type="primary"  plain
            @click="showAdd()"
            icon="plus"
          />
          <el-button
            :disabled="
              disBtn('delBtn') ||
              !checkBtnQx('delBtn', menuDefId) ||
              sels.length === 0 ||
              load.del == true
            "  plain
            type="danger"
            v-loading="load.del"
            @click="batchDel"
            icon="delete"
          />
 
        </span> 
        <mdp-export @excel="export2Excel()"/>
        <mdp-table-configs :column-configs="columnConfigs" v-model="checkedColumns" /> 
        <el-button @click="$refs['kanbanDlg'].open()" type="primary" plain>板</el-button> 
 
			</el-space>
		</template>
		<el-space>
			<XmProjectSelect v-model="filters['res.projectId']" placeholder="项目"/>
			<el-input v-model="filters.groupName" style="width:15%;" clearable placeholder="小组名称查询"/>
			<el-input v-model="filters.leaderUsername" style="width:15%;" clearable placeholder="组长名称查询"/>
			<el-input v-model="filters.assUsername" style="width:15%;" clearable placeholder="副组长名称查询"/>
			<el-input v-model="filters.username" style="width:15%;" clearable placeholder="组员名称查询"/>
			<el-button type="primary" v-loading="load.list" :disabled="load.list==true" @click="searchTableDatas" icon="search">查询</el-button>

		</el-space>
	</ContentWrap> 
			<!--列表 XmGroupUser xm_group_user-->
			<el-table ref="table" :data="tableDatas" v-adaptive="{bottom:50}" @sort-change="sortChange" highlight-current-row v-loading="load.list" border @selection-change="selsChange" @row-click="rowClick" style="width: 100%;">
				<el-table-column  type="selection" width="55" /> 
				<el-table-column prop="username" label="成员姓名" min-width="150" show-overflow-tooltip  sortable>
					<template #default="scope">
					
						<el-popover placement="right-start"
								:width="200" :show-after="200"
 							>
							<template #reference>
								<el-link @click="showEdit(scope.row)"> 
                {{ scope.row.seqNo||(scope.$index+1) }} &nbsp; {{ scope.row.username }}
                </el-link>
							</template>
							<template #default>
               <el-button @click="showEdit(scope.row)" icon="edit" type="primary">编辑</el-button>
               <el-button @click="handleDel(scope.row)" icon="delete" type="danger">删除</el-button>
								</template>
							</el-popover> 
					</template>
				</el-table-column>
				<el-table-column prop="groupName" label="组名" min-width="250" show-overflow-tooltip sortable />

				<el-table-column prop="joinTime" label="加入时间" min-width="120" show-overflow-tooltip colType="date" sortable/>

 				<el-table-column prop="leaderUsername" label="组长" min-width="150" show-overflow-tooltip  sortable colPrefix="g."/>
 				<el-table-column prop="assUsername" label="副组长" min-width="150" show-overflow-tooltip sortable colPrefix="g." /> 
				
				 <el-table-column prop="projectId" label="项目编号" min-width="150" show-overflow-tooltip sortable/>
				 <el-table-column prop="productId" label="产品号" min-width="150" show-overflow-tooltip  sortable colPrefix="g."/>

				<el-table-column prop="status" label="已加入" min-width="80" show-overflow-tooltip itemCode="yesOrNo">
					<template #default="scope">  
						<MdpSelect showStyle="tag" itemCode="yesOrNo" v-model="scope.row.status" disabled />
					</template>
				</el-table-column> 
				
				<el-table-column prop="groupId" label="组号" min-width="150" show-overflow-tooltip kbName="groupName"  sortable/>
				
				<el-table-column prop="leaderUserid" label="组长编号" min-width="150" show-overflow-tooltip sortable colPrefix="g."/>
 				<el-table-column prop="assUserid" label="副组长编号" min-width="150" show-overflow-tooltip   sortable colPrefix="g."/> 
 				<el-table-column prop="isPri" label="个人" min-width="80" show-overflow-tooltip itemCode="yesOrNo"> 
					<template #default="scope">  
						<MdpSelect showStyle="tag" itemCode="yesOrNo" v-model="scope.row.isPri" disabled />
					</template>
				 </el-table-column>
				 <el-table-column prop="obranchName" label="归属机构" min-width="120" show-overflow-tooltip sortable/>
				 <el-table-column prop="outTime" label="离队时间" min-width="120" show-overflow-tooltip colType="date"  sortable/>

				<el-table-column prop="obranchId" label="归属机构号" min-width="120" show-overflow-tooltip kbName="obranchName"  sortable/>
				<el-table-column prop="seqNo" label="排序号" min-width="120" show-overflow-tooltip sortable/> 
			</el-table>
			<el-pagination  layout="total, sizes, prev, pager, next" @current-change="handleCurrentChange" @size-change="handleSizeChange" :page-sizes="[10,20, 50, 100, 500]" :current-page="pageInfo.pageNum" :page-size="pageInfo.pageSize"  :total="pageInfo.total" style="float:right;" />
 			<!--编辑 XmGroupUser xm_group_user界面-->
			<mdp-dialog title="编辑组员信息" v-model="editFormVisible"  width="60%"  append-to-body   :close-on-click-modal="false">
				  <xm-group-user-edit sub-op-type="edit" :xm-group-user="editForm" :visible="editFormVisible" @cancel="editFormVisible=false" @submit="afterEditSubmit" />
			</mdp-dialog>

			<!--新增 XmGroupUser xm_group_user界面-->
			<mdp-dialog title="新增组员信息" v-model="addFormVisible"  width="60%"  append-to-body  :close-on-click-modal="false">
				<xm-group-user-edit sub-op-type="add" :visible="addFormVisible" @cancel="addFormVisible=false" @submit="afterAddSubmit" />
			</mdp-dialog> 
			<mdp-dialog ref="kanbanDlg"
					title="看板"  
					fullscreen  
				> 
					<MdpTableKanban @del="(d,cb)=>handleDel(d,0,cb)"
						@plus="(cb)=>showAdd(cb)"
						@edit="(d,cb)=>showEdit(d,cb)"
						v-model="tableDatas" 
						:columnConfigs="columnConfigs"
						itemKey="userid" 
						:contentFun="(item)=>item.username"
						:init="{x:'joinTime',y:'groupId'}"
					> 
					<template #toolbar="{element}">
						<MdpSelect showStyle="tag" itemCode="menuStatus" disabled v-model="element.status"/>
					</template>
					</MdpTableKanban>
				</mdp-dialog>
</template>

<script>
	import util from '@/components/mdp-ui/js/util';//全局公共库
	import config from '@/api/mdp_pub/mdp_config';//全局公共库

	import { listXmGroupUser, delXmGroupUser, batchDelXmGroupUser } from '@/api/xm/core/xmGroupUser';
	import  XmGroupUserEdit from './XmGroupUserEdit.vue';//新增修改界面
	import { mapState } from 'pinia'
import { useUserStore } from '@/store/modules/user'
 

import { MdpTableMixin } from '@/components/mdp-ui/mixin/MdpTableMixin.js'

	export default {
		mixins:[MdpTableMixin],
	    name:'xmGroupUserMng',
		components: {
		    XmGroupUserEdit
		},
		props:['visible','xmGroup'],
		computed: {
		    ...mapState(useUserStore,['userInfo']),

		},
		watch:{
            visible(val){
                if(val==true){
                    this.initData();
                    this.searchTableDatas()
                }
            }
		},
		data() {
			return {
				pkNames:['groupId','userid'],
				filters: {
					groupName: '',
					groupName:'',
					leaderUsername:'',
					assUsername:'',
					username:'',
				}, 
				pageInfo:{//分页数据
					total:0,//服务器端收到0时，会自动计算总记录数，如果上传>0的不自动计算。
					pageSize:10,//每页数据
					count:true,//是否需要重新计算总记录数
					pageNum:1,//当前页码、从1开始计算
					orderFields:[],//排序列 如 ['sex','student_id']，必须为数据库字段
					orderDirs:[]//升序 asc,降序desc 如 性别 升序、学生编号降序 ['asc','desc']
				},
 				addFormVisible: false,//新增xmGroupUser界面是否显示
				addForm: {
					joinTime:'',groupId:'',userid:'',username:'',outTime:'',status:'',obranchId:'',isPri:'',seqNo:'',projectId:'',productId:'',pgClass:'',obranchName:''
				},

				editFormVisible: false,//编辑界面是否显示
				editForm: {
					joinTime:'',groupId:'',userid:'',username:'',outTime:'',status:'',obranchId:'',isPri:'',seqNo:'',projectId:'',productId:'',pgClass:'',obranchName:''
				}, 
				apis:{
					list: listXmGroupUser,
					del: delXmGroupUser,
					batchDel: batchDelXmGroupUser
				}
			}
		},//end data
		methods: {
		 
			//获取列表 XmGroupUser xm_group_user
			preQueryParamCheck( params ) {
				 
				if(this.xmGroup){
					params.groupId=this.xmGroup.id
				} 
				return true
			},

			//显示编辑界面 XmGroupUser xm_group_user
			showEdit: function ( row,index ) {
				this.editFormVisible = true;
				this.editForm = Object.assign({}, row);
			},
			//显示新增界面 XmGroupUser xm_group_user
			showAdd: function () {
				this.$message.warning("请到团队管理中进行成员维护")
				return;
				//this.addFormVisible = true;
				//this.addForm=Object.assign({}, this.editForm);
			},
			afterAddSubmit(){
				this.addFormVisible=false;
				this.pageInfo.count=true;
				this.getXmGroupUsers();
			},
			afterEditSubmit(){
				this.editFormVisible=false;
			},
			 
            initData: function(){

            },

		},//end methods
		mounted() {
			this.$nextTick(() => {

			    this.initData()
				this.searchTableDatas();


                //this.maxTableHeight =util.calcTableMaxHeight('.el-table');

        	});
		}
	}

</script>

<style scoped />
