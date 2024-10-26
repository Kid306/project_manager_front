<template> 
<ContentWrap>
	
		<el-space>
			<xm-project-select  v-if="!selProject"  v-model="projectId"  :link-iteration-id="xmIteration?xmIteration.id:null" :link-product-id="xmProduct?xmProduct.id:null"  @change3="onProjectRowClick" @clear="onProjectClearSelect" />

			<el-input v-model="filters.groupName" clearable placeholder="名称过滤"/>
			<el-button  type="primary" @click="searchXmGroups" icon="search">刷新</el-button>
			<el-button  type="plain" @click="showAllGroupDlg" icon="histogram">小组数据对比</el-button>
			<el-button class="hidden-lg-and-down" type="plain" @click="showRecord()" icon="document">变化日志</el-button>
			<!-- <el-button class="hidden-lg-and-down" type="plain" @click="doSearchImGroupsByProjectId" icon="document">绑定即聊情况</el-button> -->
			<el-button class="hidden-md-and-down" @click="groupRoleDescVisible=true" icon="document">角色说明</el-button>
			<el-text type="info">架构图-右键-操作</el-text>

			<el-popover
				placement="bottom"
				width="500"
				trigger="click">
  					<el-button   @click="groupRoleDescVisible=true" icon="document">角色说明</el-button>
					 <el-text type="info">注意：点击架构图-右键进行新增等操作</el-text>
 					<template #reference><el-link type="warning"  v-if="!selProject" icon="search">更多</el-link></template>
			</el-popover>
  		</el-space>
			</ContentWrap>  
			<Vue3TreeOrg @contextmenu.prevent v-adaptive :data="okrTreeData" v-loading="load.list" ref="tree" :props="{'id':'id','pid':'pgroupId',label:'label',isLeaf:(d)=>d.chidlren?.length>0}"
 				:node-draggable="true"
				:horizontal="false"
				:collapsable="true"
				:default-expand-level="10"
				:only-one-node="false" 
				:clone-node-drag="false" 
				center
				:define-menus="defineMenus"
				@on-restore="restore"
				@on-contextmenu="onMenus"
				@on-node-click="onNodeClick" 
				@node-click="handleNodeClick" 
				:filter-node-method="filterNode"
				
				:before-drag-end="beforeDragEnd"
          @on-node-drag="nodeDragMove"
          @on-node-drag-end="nodeDragEnd"
  			/> 
			<!--编辑 XmGroup xm_group界面-->
			<mdp-dialog title="编辑小组信息" v-model="editFormVisible"  width="60%"  append-to-body   :close-on-click-modal="false">
				  <xm-group-edit sub-op-type="edit" :formData="editForm" :visible="editFormVisible" @cancel="editFormVisible=false" @submit="afterEditSubmit" />
			</mdp-dialog>

			<!--新增 XmGroup xm_group界面-->
			<mdp-dialog title="新增小组信息" v-model="addFormVisible"  width="60%"  append-to-body  :close-on-click-modal="false">
				<xm-group-edit sub-op-type="add" :formData="addForm" :visible="addFormVisible" @cancel="addFormVisible=false" @submit="afterAddSubmit" />
			</mdp-dialog> 
			<mdp-dialog append-to-body
				title="角色说明"
				width="60%"
				v-model="groupRoleDescVisible"
				direction="rtl"
				ref="drawer"
				>
				<el-row class="page-main  padding">
					<el-collapse>

						<el-collapse-item title="项目经理：项目整体、团队、进度、质量、计划、风险、沟通管理等" name="3">
							<div>项目：立项、项目预算、项目进度、项目成本、项目合同、项目延期、项目预算变更等</div>
							<div>团队：建立项目管理组、建立业务组、指定组长、组员管理（加人、减人、指派组长）等</div>
							<div>计划：建立计划、计划预算管理、基于计划细化任务、迭代计划制定与执行等</div>
							<div>任务：建立任务、删除任务、指派责任人、任务预算变更、任务提交测试、测试结果反馈、任务结算</div>
							<div>质量：审核测试方案、定时查看质量报告</div>
							<div>风险：风险预测、风险应对措施管理等</div>
							<div>需求：确保任务与需求的关联关系正确、范围正确，及时跟进需求的变化。 </div>
						</el-collapse-item>
						<el-collapse-item title="项目管理者: 项目经理、技术经理、项目副经理、技术副经理等具有全项目范围管理权限的管理人员。由项目经理指派。" name="4">
										<div>团队：建立项目管理组、建立业务组、指定组长、组员管理（加人、减人、指派组长）等</div>
										<div>进度计划：建立计划、细化计划、计划管理、计划预算管理等 </div>
										<div>任务：建立任务、删除任务、指派责任人、任务预算变更、任务提交测试、测试结果反馈、任务结算</div>
										<div>质量：审核测试方案、定时查看质量报告等</div>
										<div>风险：风险预测、风险应对措施管理等</div>
										<div>需求：确保任务与需求的关联关系正确、范围正确，及时跟进需求的变化。</div>
						</el-collapse-item>
						<el-collapse-item title="组长：每个小组的组长，由项目管理者指定" name="5">
										<div>团队：组员管理（加人、减人）</div>
										<div>进度计划：建立计划、细化计划、计划管理、计划预算管理、定期查看小组的工作进度情况、各成员的进度情况跟踪</div>
										<div>任务：建立任务、删除任务、指派责任人、任务预算变更、任务提交测试、测试结果反馈、任务结算</div>
										<div>质量：审核测试方案、定时查看质量报告等</div>
										<div>风险：风险预测、风险应对措施管理等</div>
										<div>需求：确保任务与需求的关联关系正确、范围正确，及时跟进需求的变化。</div>
						</el-collapse-item>
						<el-collapse-item title="任务责任人：每个任务的责任人，由组长、项目管理者指定" name="6">
									<div> 团队：对任务的候选人、执行人进行统一管理、跟踪</div>
										<div>进度计划：定期查看负责的任务的进度情况、各成员的进度情况跟踪</div>
										<div>任务：任务预算变更、任务提交测试、测试结果反馈、任务结算</div>
										<div>质量：审核测试方案、定时查看质量报告等</div>
										<div>风险：风险预测、风险应对措施管理等</div>
										<div>需求：确保任务与需求的关联关系正确、范围正确，及时跟进需求的变化。</div>
						</el-collapse-item>
						<el-collapse-item title="任务候选人：每个任务的候选人，由任务责任人、组长、项目管理者指定或者由用户自行加入。" name="7">
									<div> 团队：查看团队成员、加入任务候选人队列、退出任务候选人队列、不能加入具体的小组</div>
										<div>进度计划：定期查看已关注的任务的进度情况</div>
										<div>任务：关注任务、取消关注任务、查询任务、加入任务候选人队列、退出候选人队列等 </div>
										<div>需求：查看相关的需求及其滚动信息</div>
						</el-collapse-item>
						<el-collapse-item title="任务执行人：每个任务的具体执行人，由任务责任人、组长、项目管理者指定。" name="8">
									<div> 团队：查看团队成员、加入业务小组、退出小组</div>
										<div>进度计划：定期查看已执行的任务的进度情况</div>
										<div>任务：关注任务、取消关注任务、查询任务、加入任务候选人队列、退出候选人队列、提交测试、提交结算申请等</div>
										<div>需求：查看相关的需求及其滚动信息</div>
						</el-collapse-item>
						<el-collapse-item title="产品经理" name="9">
									<div> 团队：查看团队成员、加入业务小组、退出小组</div>
										<div>进度计划：定期查看已执行的任务的进度情况</div>
										<div>任务：关注任务、取消关注任务、查询任务、加入任务候选人队列、退出候选人队列、提交测试、提交结算申请等</div>
										<div>需求：查看相关的需求及其滚动信息</div>
						</el-collapse-item>
						<el-collapse-item title="测试经理" name="10" />
						<el-collapse-item title="开发者" name="11" />
						<el-collapse-item title="项目管理委员会" name="1">
							<div>用户决策：根据场景可给予用户操作建议或安全提示，但不能代替用户进行决策；</div>
							<div>结果可控：用户可以自由的进行操作，包括撤销、回退和终止当前操作等。</div>
						</el-collapse-item>
						<el-collapse-item title="客户项目经理" name="2">
							<div>用户决策：根据场景可给予用户操作建议或安全提示，但不能代替用户进行决策；</div>
							<div>结果可控：用户可以自由的进行操作，包括撤销、回退和终止当前操作等。</div>
						</el-collapse-item>
					</el-collapse>

				</el-row>
				<el-row class="footer">
					<el-button  type="primary" @click="groupRoleDescVisible=false">关闭</el-button>
				</el-row>
			</mdp-dialog>
			<mdp-dialog append-to-body title="选择员工" v-model="userSelectVisible" width="90%">
				<mdp-dept-user multiple @select="onUserSelected"/>
 			</mdp-dialog>

			<mdp-dialog v-if="project" :title="project==null?'操作日志':project.name+'团队操作日志'" center   v-model="xmRecordVisible"  width="80%"  :close-on-click-modal="false" append-to-body>
				<xm-record  :visible="xmRecordVisible" :project-id="project.id"  objType="7"  :simple="1" />
			</mdp-dialog>  
			<mdp-dialog ref="allGroupDlg"  center   fullscreen  :close-on-click-modal="false" append-to-body>
				<xm-group-state-mng :selProject="project"   />
			</mdp-dialog>
			<mdp-dialog ref="oneGroupDlg" center    fullscreen :close-on-click-modal="false" append-to-body>
				<xm-group-state-mng :xm-group="editForm" :sel-project="project"     />
			</mdp-dialog> 
			<mdp-dialog  v-if="currNodeType=='group'&&editForm.groupName" center  :title="(editForm==null?editForm.groupName:'')+'小组成员管理'" v-model="groupUserVisible"  width="80%"  :close-on-click-modal="false" append-to-body>
				<xm-group-user-mng  :xm-group="editForm" :visible="groupUserVisible"  />
			</mdp-dialog>
			<mdp-dialog    v-model="candidateVisible"  width="80%"  :close-on-click-modal="false" append-to-body>
				<xm-task-execuser-select  :sel-project="project" :visible="candidateVisible" multiple @select="onExecuserSelect" />
			</mdp-dialog> 
</template>

<script>
import util from '@/components/mdp-ui/js/util';//全局公共库
import treeTool from '@/components/mdp-ui/js/treeTool';//全局公共库
import config from '@/api/mdp_pub/mdp_config';//全局公共库

import { listXmGroup, delXmGroup, batchDelXmGroup,getGroups } from '@/api/xm/core/xmGroup';
import  XmGroupEdit from './XmGroupEdit.vue';//新增修改界面
import { mapState } from 'pinia'
import { useUserStore } from '@/store/modules/user'


import {Vue3TreeOrg} from 'vue3-tree-org';
import "vue3-tree-org/lib/vue3-tree-org.css";

//import { listImGroup} from '@/api/mdp/im/group/imGroup';
//import { publishMessage} from '@/api/mdp/im/imPush';

import { listXmGroupUser, delXmGroupUser, batchDelXmGroupUser,batchAddXmGroupUser } from '@/api/xm/core/xmGroupUser';



import  XmGroupStateMng from '../xmGroupState/XmGroupStateMng.vue';//修改界面
import  XmGroupUserMng from '../xmGroupUser/XmGroupUserMng.vue';//修改界面

import  XmRecord from '../xmRecord/XmRecord.vue';//修改界面
 
import XmTaskExecuserSelect from '../xmTaskExecuser/XmTaskExecuserSelect.vue';

	export default {
	    name:'xmGroupMng',
		components: {XmRecord,
		    XmGroupEdit,Vue3TreeOrg,XmGroupStateMng,XmGroupUserMng,

XmTaskExecuserSelect,
		},
		props:["visible","selProject" ,"isSelectSingleUser","isSelectMultiUser",'xmProduct','xmIteration','pgClass'],
		computed: {
		    ...mapState(useUserStore,['userInfo']),
			expandedKeys(){
				var expandedKeys=[]
				if(this.xmProduct&&this.xmProduct.id){
					 expandedKeys.push(this.xmProduct.id)
				}else if(this.selProject && this.selProject.id){
					 expandedKeys.push(this.selProject.id)
				}else if(this.xmIteration){
					 expandedKeys.push(this.xmIteration.id)
				}else{
					var groupsLvl1=this.xmGroups.filter(i=>i.lvl<=1)
					expandedKeys.push(...groupsLvl1)
				}
				return expandedKeys;
			},
			okrTreeData(){
				var groups=JSON.parse(JSON.stringify(this.xmGroups));
				groups.forEach(i=>{
					if(i.pgroupId==''){
						i.pgroupId=null;
					}
					i.currNodeType='group'
					i.label=i.groupName
					if(i.groupUsers){
						var groupUsers=i.groupUsers;
						groupUsers.forEach(u=>{
							u.id=u.groupId+"_"+u.userid
							u.pgroupId=u.groupId
							u.label=u.username
							u.currNodeType='groupUser'
							u.children=[]
						})
						i.children=groupUsers
					}else{
						i.children=[]
					}
				})
				var groupsTree=treeTool.translateDataToTree(groups,'pgroupId','id')
				var topLabel=this.userInfo.branchName+"-组织架构"
				var currNodeType='project'
				var topdata={}
				if(this.project && this.project.id){
					topLabel=this.project.name+"-项目组织架构"
					currNodeType='project'
					topdata=this.project
					topdata.leaderUserid=this.project.pmUserid
					topdata.leaderUsername=this.project.pmUsername
					topdata.assUserid=this.project.assUserid
					topdata.assUsername=this.project.assUsername 
					topdata.pgroupId=''
				}else if(this.xmProduct && this.xmProduct.id){

					if(this.xmProduct.productName){
						topLabel=this.xmProduct.productName+"-产品组织架构"
					}else{
						topLabel=this.xmProduct.id+"-产品组织架构"
					}
					currNodeType='product'
					topdata=this.xmProduct
					topdata.pgroupId=''
					topdata.leaderUserid=this.xmProduct.pmUserid
					topdata.leaderUsername=this.xmProduct.pmUsername
					topdata.assUserid=this.xmProduct.assUserid
					topdata.assUsername=this.xmProduct.assUsername
				}else{
					return {}
				}
				var data={
					...topdata,
					label:topLabel,
					currNodeType:currNodeType,
					children:groupsTree||[]
					} 
				return data;
			},
			projectKey(){
				if(this.xmIteration?.id){
					return this.xmProduct?.id+'-'+this.xmIteration?.id+'-project-select-id'
				}
				return this.xmProduct?.id+'-project-select-id'
			}
		},
		watch:{
            visible(val){
                if(val==true){
                    this.initData();
                    this.searchXmGroups()
                }
            },

			selProject(){
				this.project=this.selProject;
				this.projectId=this.selProject?.id||sessionStorage.getItem(this.projectKey)
				this.searchTableDatas();
			},
			xmProduct(){
				this.searchTableDatas();
			},
			"filters.groupName":function(val) {
				this.$refs.tree.filter(val);
			},
		},
		data() {
			return {
				filters: {
					groupName: '', 
				},
				project: null,
				projectId:null,
				xmGroups: [],//查询结果
				pageInfo:{//分页数据
					total:0,//服务器端收到0时，会自动计算总记录数，如果上传>0的不自动计算。
					pageSize:50,//每页数据
					count:true,//是否需要重新计算总记录数
					pageNum:1,//当前页码、从1开始计算
					orderFields:[],//排序列 如 ['sex','student_id']，必须为数据库字段
					orderDirs:[]//升序 asc,降序desc 如 性别 升序、学生编号降序 ['asc','desc']
				},
				load:{ list: false, edit: false, del: false, add: false },//查询中...
				sels: [],//列表选中数据
				dicts:{
				    //sex: [{id:'1',name:'男'},{id:'2',name:'女'}]
				},//下拉选择框的所有静态数据 params={categoryId:'all',itemCodes:['sex']} 返回结果 {sex: [{id:'1',name:'男'},{id:'2',name:'女'}]}
				addFormVisible: false,//新增xmGroup界面是否显示
				addForm: {
					id:'',groupName:'',projectId:'',pgTypeId:'',pgTypeName:'',leaderUserid:'',leaderUsername:'',ctime:'',ltime:'',productId:'',branchId:'',pgClass:'',pgroupId:'',lvl:'',pidPaths:'',isTpl:'',assUserid:'',assUsername:'',childrenCnt:'',userCnt:'',qxCode:'',calcWorkload:'',ntype:'',crowBranchId:'',crowBranchName:'',isCrow:''
				},

				addFormInit: {
					id:'',groupName:'',projectId:'',pgTypeId:'',pgTypeName:'',leaderUserid:'',leaderUsername:'',ctime:'',ltime:'',productId:'',branchId:'',pgClass:'',pgroupId:'',lvl:'',pidPaths:'',isTpl:'',assUserid:'',assUsername:'',childrenCnt:'',userCnt:'',qxCode:'',calcWorkload:'',ntype:'',crowBranchId:'',crowBranchName:'',isCrow:''
				},
				editFormVisible: false,//编辑界面是否显示
				editForm: {
					id:'',groupName:'',projectId:'',pgTypeId:'',pgTypeName:'',leaderUserid:'',leaderUsername:'',ctime:'',ltime:'',productId:'',branchId:'',pgClass:'',pgroupId:'',lvl:'',pidPaths:'',isTpl:'',assUserid:'',assUsername:'',childrenCnt:'',userCnt:'',qxCode:'',calcWorkload:'',ntype:'',crowBranchId:'',crowBranchName:'',isCrow:''
				},
				maxTableHeight:300,


				userSelectVisible: false,
				xmRecordVisible:false,
				xmGroupStateVisible:false,
				imGroups:[],
				imGroupVisible:false,
				groupRoleDescVisible:false,
				groupOperSelectVisible:false,
				currNodeType:'',//project/product/iteration/group/groupUser
				groupUserVisible:false,
				selectProjectVisible:false,
				candidateVisible:false,
			}
		},//end data
		methods: { 
			defineMenus:function(e, node) {  
				let currNodeType=node.$$data.currNodeType
				this.currNodeType=currNodeType
				if (currNodeType=='project') {
					return [  
							{ name:'新建小组', command: 'showProjectGroupAdd' },
					]
				} else if (currNodeType=='product') {
					return [  
							{ name:'新建小组', command: 'showProductGroupAdd' },
					]
				} else if (currNodeType=='group') {
					return [  
							{ name:'新建下级小组', command: 'showAddSub' },
							{ name:'修改小组信息', command: 'edit' },
							{ name:'删除小组', command: 'del' },
							{ name:'拉部门人员进组', command: 'addDeptUsers' },
							{ name:'拉竞标人员进组', command: 'addHxUsers' },
							{ name:'查看小组进度', command: 'showOneGroupDlg' },
					]
				}else if (currNodeType=='groupUser') {
					return [  
							{ name:'将用户移出小组', command: 'delGroupUser' },
					]
				} else{
					return []
				}
			},
			
			onMenus({ node, command }) {
				let formData=node.$$data
				delete formData.children
				if(command=='showAddSub'){
					this.showAddSub(formData)
				}else if(command=='showProjectGroupAdd'){
					this.showProductGroupAdd()
				}else if(command=='showProductGroupAdd'){
					this.showProductGroupAdd()
				}else if(command=='edit'){
					this.showEdit(formData)
				}else if(command=='addDeptUsers'){
					this.editForm=formData
					this.userSelectVisible=true
				}else if(command=='addHxUsers'){
					this.editForm=formData
					this.candidateVisible=true
				}else if(command=='del'){
					this.handleDel(formData)
				}else if(command=='delGroupUser'){
					this.handleDelGroupUser(formData)
				}else if(command=='showOneGroupDlg'){
					this.editForm=formData
					this.showOneGroupDlg()
				} 
			},
			restore(){

			},
			onNodeClick(){

			},
			nodeDragMove(data) {
				console.log(data);
			},
			beforeDragEnd(node, targetNode) { 

				return new Promise((resolve, reject) => {
					 
					if (!targetNode) reject() 
					let targetData=targetNode.$$data
					let currData=node.$$data 
					if(currData.currNodeType=='groupUser'){
						if(targetData.currNodeType!='group'){
							reject()
						}else if(currData.groupId==targetData.id){
							reject()
						}else{
							resolve()
						}
					}else if(currData.currNodeType=='group'){
						if(targetData.currNodeType=='groupUser'){
							reject()
						}else if(targetData.currNodeType=='group'){
							if(currData.pgroupId==targetData.id){
								reject()
							}else if(currData.id==targetData.id){
								reject()
							}else{
								resolve()
							}
						}else{
							resolve()
						}
					}else{
						reject()
					}
					 
				})
			},
			nodeDragEnd(data, isSelf) {
				
				console.log(data, isSelf);
			},
			showRecord(){
				if(!this.project||!this.project.id){
					this.$message.warning("请先选中项目")
					return;
				}
				this.xmRecordVisible=true
			},
			handleSizeChange(pageSize) {
				this.pageInfo.pageSize=pageSize;
				this.searchTableDatass();
			},
			handleCurrentChange(pageNum) {
				this.pageInfo.pageNum = pageNum;
				this.searchTableDatass();
			},
			// 表格排序 obj.order=ascending/descending,需转化为 asc/desc ; obj.prop=表格中的排序字段,字段驼峰命名
			sortChange( obj ){
				if(obj.order==null){
					this.pageInfo.orderFields=[];
					this.pageInfo.orderDirs=[];
				}else{
					var dir='asc';
					if(obj.order=='ascending'){
						dir='asc'
					}else{
						dir='desc';
					}

					this.pageInfo.orderFields=[util.toLine(obj.prop)];
					this.pageInfo.orderDirs=[dir];
				}
				this.searchTableDatass();
			},
			searchXmGroups(){ 
				if(!this.project||!this.project.id){
					this.$message.success("请先选中项目")
					return;
				}
				 this.pageInfo.count=true;
				 this.searchTableDatass();
			}, 
			showAllGroupDlg(){
				if(!this.project ||!this.project.id){
					this.$message.success("请先选中项目")
					return;
				}else{
					this.$refs.allGroupDlg.open({title:this.project.projectName+"项目全体小组数据对比分析"})
				}
			},
			showOneGroupDlg(){ 
				if(!this.editForm ||!this.editForm.id){
					this.$message.success("请先选中小组")
					return;
				}else{
					this.$refs.oneGroupDlg.open({title:this.editForm.groupName+"小组数据分析"})
				}
			},
			//获取列表 XmGroup xm_group
			searchTableDatass() {
				
				let params = {
					pageSize: this.pageInfo.pageSize,
					pageNum: this.pageInfo.pageNum,
					total: this.pageInfo.total,
					count:this.pageInfo.count
				};
				if(this.pageInfo.orderFields!=null && this.pageInfo.orderFields.length>0){
					let orderBys=[];
					for(var i=0;i<this.pageInfo.orderFields.length;i++){
						orderBys.push(this.pageInfo.orderFields[i]+" "+this.pageInfo.orderDirs[i])
					}
					params.orderBy= orderBys.join(",")
				}
				if( (!this.project || !this.project.id)){
					return;
				}
				if(this.project && this.project.id){
					params.projectId=this.project.id
				}
				if(this.filters.groupName){
					params.groupName=this.filters.groupName
				}
				if(this.filters.groupNameKey){
					params.groupNameKey=this.filters.groupNameKey
				}
				if(this.filters.groupUsernameKey){
					params.groupUsernameKey=this.filters.groupUsernameKey
				}
				if(this.filters.mngUsernamegroupName){
					params.mngUsernamekey=this.filters.mngUsernamekey
				}
				var func=getGroups
				this.load.list = true;
				func(params).then((res) => {
					var tips=res.tips;
					if(tips.isOk){
						this.pageInfo.total = res.total;
						this.pageInfo.count=false;
						this.xmGroups = res.data;
					}else{
						this.$notify({position:'bottom-left',showClose:true, message: tips.msg, type: 'error' });
					}
					this.load.list = false;
				}).catch( err => this.load.list = false );
			},

			//显示编辑界面 XmGroup xm_group
			showEdit: function ( row,index ) {
				this.editFormVisible = true;
				this.editForm = Object.assign({}, row);
			},
			//显示新增界面 XmGroup xm_group
			showProjectGroupAdd: function () {
				if(!this.project || !this.project.id){
					this.$notify({position:'bottom-left',showClose:true, message: "请先选择项目", type:  'warning' });
					return;
				}
				this.addForm={...this.addFormInit}
				 if(this.currNodeType=='project'){
					this.addForm.pgroupId=null
					this.addForm.pgroupName=null
					this.addForm.productId=null
					this.addForm.pgClass="0"
					this.addForm.projectId=this.project.id
					this.addForm.groupName=this.project.name+"-项目管理组"
					this.addFormVisible = true;
				} 
				if(this.xmProduct && this.xmProduct.id){ 
					this.addForm.productId=this.xmProduct.id
				} 
				//this.addForm=Object.assign({}, this.editForm);
			},
			//显示新增界面 XmGroup xm_group
			showProductGroupAdd: function () {  
				this.showProjectGroupAdd()
			},
			//显示新增界面 XmGroup xm_group
			showAddSub: function (row) {

				if(!row){
					return;
				}
				this.addForm={...row}
				this.addForm.pgroupId=row.id
				this.addForm.pgroupName=row.groupName
				this.addForm.groupName=row.groupName+"-"+"下级小组xx"
				this.addForm.id=null
				this.addFormVisible = true;
				//this.addForm=Object.assign({}, this.editForm);
			},
			afterAddSubmit(res){
				this.addFormVisible=false;
				//this.pageInfo.count=true;
				this.groupOperSelectVisible=false;
				this.xmGroups.push(res.data)
				//this.searchTableDatass();
			},
			afterEditSubmit(){
				this.editFormVisible=false;
				this.groupOperSelectVisible=false;
				this.searchTableDatass();
			},
			//选择行xmGroup
			selsChange: function (sels) {
				this.sels = sels;
			},
			//删除xmGroup
			handleDel: function (row,index) {
				this.$confirm('确认删除该记录吗?', '提示', {
					type: 'warning'
				}).then(() => {
					this.load.del=true;
					this.groupOperSelectVisible=false;
					let params = { id: row.id };
					delXmGroup(params).then((res) => {
						this.load.del=false;
						var tips=res.tips;
						if(tips.isOk){
							this.pageInfo.count=true;
							this.searchTableDatass();
						}
						this.$notify({position:'bottom-left',showClose:true, message: tips.msg, type: tips.isOk?'success':'error' });
					}).catch( err  => this.load.del=false );
				});
			},
			//批量删除xmGroup
			batchDel: function () {

				this.$confirm('确认删除选中记录吗？', '提示', {
					type: 'warning'
				}).then(() => {
					this.load.del=true;
					batchDelXmGroup(this.sels).then((res) => {
						this.load.del=false;
						this.groupOperSelectVisible=false;
						var tips=res.tips;
						if( tips.isOk ){
							this.pageInfo.count=true;
							this.searchTableDatass();
						}
						this.$notify({position:'bottom-left',showClose:true, message: tips.msg, type: tips.isOk?'success':'error'});
					}).catch( err  => this.load.del=false );
				});
			}, 
			doSearchImGroupsByProjectId(){

				var params={bizPid:this.selProject.id}
				// listImGroup(params).then(res=>{
				// 	this.imGroupVisible=true;
				// 	var tips = res.tips;
				// 	if(tips.isOk){
				// 		this.imGroups=res.data;
				// 	}
				// 	this.$notify({position:'bottom-left',showClose: true,
				// 		message: tips.msg,
				// 		type: tips.isOk ? 'success' : 'error'
				// 	});
				// });
			},
			doCreateImGroup(group){
				if(group.groupUsers && group.groupUsers.length>0){
					var params={
						msgId:sn(),
						groupId:group.id,
						groupName:group.name,
						msgType:'group',
						action:'channelGroupCreate',
						cuserid:this.userInfo.userid,
						cusername:this.userInfo.username,
						branchId:this.userInfo.branchId,
						bizId:group.id,
						bizPid:this.selProject.id,
						users:group.groupUsers.map(gu=>{
							return {
								userid:gu.userid,
								username:gu.username
							}
						})
					}
				// 	publishMessage(params).then(res=>{
				// 		var tips = res.tips;
				// 		if(tips.isOk){
				// 			params.id=params.groupId
				// 			this.imGroups.push(params);
				// 		}
				// 		this.$notify({position:'bottom-left',showClose: true,
				// 			message: tips.msg,
				// 			type: tips.isOk ? 'success' : 'error'
				// 		});
				// 	})
				// }else{
				// 	that.$notify({
				// 		message: "组员为空，不允许绑定",
				// 		type:   'error'
				// 	});
				 }

			},
			onExecuserSelect:function(users){
				this.candidateVisible=false;

				if(users && users.length>0){
					var arrs=[];
					users.forEach(i=>{
						if(!arrs.some(k=>k.userid==i.userid)){
							i.userid=i.bidUserid
							i.username=i.bidUsername
							i.branchId=i.bidBranchId
							i.branchName=''
							arrs.push(i)
						}

					})
					this.onUserSelected(arrs);
				}
			},

			//选择接收人
			onUserSelected: function(groupUsers) {
 
				this.load.add=true;
				if(groupUsers==null||groupUsers.length==0){
					return;
				}

				var params=groupUsers.map(i=>{
					var u={
						userid:i.userid,
						username:i.username,
						obranchId:i.branchId,
						obranchName:i.branchName,
						groupId:this.editForm.id,
					} 
					u.projectId=this.editForm.projectId 
					u.productId=this.editForm.productId
					u.pgClass=this.editForm.pgClass 
					return u;
				})
				batchAddXmGroupUser(params).then(res=>{

					this.load.add=false;
					this.groupOperSelectVisible=false;
					this.userSelectVisible=false;
					var tips = res.tips
					if(tips.isOk){
						this.searchXmGroups()
					}
					this.$notify({position:'bottom-left',showClose:true, message: tips.msg, type: tips.isOk?'success':'error'});
				})

			},
			rowClick: function(row, event, column){
			    if(event.label!='操作' && event.type!='selection'){
			        this.showEdit(row)
			    }
				this.$emit('row-click',row, event, column);//  @row-click="rowClick"
			},
            initData: function(){ 
				if(this.selProject){
					this.project=this.selProject;
					
				}
				this.projectId=this.selProject?.id||sessionStorage.getItem(this.projectKey)||''
            },
			renderCurrentClass (node) {
				return 'label-bg-blue'
			},
			handleNodeClick (data) {
				if(data.currNodeType){
					this.currNodeType=data.currNodeType //project/product/iteration/group/groupUser
				}else{
					this.currNodeType=''
				}

				this.editForm=data;
				this.groupOperSelectVisible=true;
			},
			renderContent (h, node) {
			 
 
			},

			//删除xmGroupUser
			handleDelGroupUser: function (row,index) {
				this.$confirm('确认删除该记录吗?', '提示', {
					type: 'warning'
				}).then(() => {
					this.load.del=true;
					let params = row;
					delXmGroupUser(params).then((res) => {
						this.load.del=false;
						var tips=res.tips;
						if(tips.isOk){
							this.groupOperSelectVisible=false;
							this.pageInfo.count=true;
							this.searchTableDatass();
						}
						this.$notify({position:'bottom-left',showClose:true, message: tips.msg, type: tips.isOk?'success':'error' });
					}).catch( err  => this.load.del=false );
				});
			},
			onPorjectConfirm(project){
				this.addForm={...this.addFormInit}
				this.addForm.projectId=project.id
				this.addForm.groupName=project.name+"-管理小组"
				this.addForm.projectName=project.name
				this.addForm.pgClass="0"
				this.addFormVisible=true;
				this.selectProjectVisible=false;
			},
			onProjectRowClick(project){
				
				this.project=project;
				sessionStorage.setItem(this.projectKey,project?.id||'')
				this.searchXmGroups();
			},
			onProjectClearSelect(){
				this.project=null 
				this.xmGroups=[]
				sessionStorage.removeItem(this.projectKey)
				this.searchXmGroups();
			},
			filterNode(value, data) {
				if (!value) return true;
				var match=false;
				if(data.leaderUsername){
					match=data.leaderUsername.indexOf(value)!==-1;
					if(match==true){
						return true;
					}
				}
				if(data.assUsername){
					match=data.assUsername.indexOf(value)!==-1;
					if(match==true){
						return true;
					}
				}
				if(data.groupName){
					match=data.groupName.indexOf(value)!==-1;
					if(match==true){
						return true;
					}
				}

				if(data.crowBranchName){
					match=data.crowBranchName.indexOf(value)!==-1;
					if(match==true){
						return true;
					}
				}
				return data.label.indexOf(value) !== -1;
			},
		},//end methods
		mounted() { 
			    this.initData()
					
				this.searchXmGroups(); 
		}
	}

</script>
<style>
.label-class-blue{
  color: #1989fa;
}
.label-bg-blue{
  background: #1989fa;
  color: #fff;
}
.diy-wrapper{
  padding:10px
}
.no-padding{
  padding: 0 !important;
}
.diy-wrapper.left-child{
  border: 1px solid red;
}
.diy-con-name{
	color: black;
}
.diy-con-content{
	padding-top:5px;
	color:dimgrey;
	font-size: 12px;
}
.crrentClass{
  border: 1px solid red;
  color: blue;
}
</style>
<style scoped />
