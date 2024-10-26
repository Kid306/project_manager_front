<template>
	<ContentWrap>

		<el-space>
			<xm-project-select v-if="!selProject?.id" v-model="projectId" :link-iteration-id="xmIteration ? xmIteration.id : null"
				:link-product-id="xmProduct ? xmProduct.id : null" @change3="onProjectRowClick" @clear="onProjectClearSelect" />

			<el-input v-model="filters.groupName" clearable placeholder="名称过滤" />
			<el-button type="primary" @click="searchXmGroups" icon="search">刷新</el-button>
		</el-space>
	</ContentWrap>
	<Vue3TreeOrg @contextmenu.prevent v-adaptive :data="okrTreeData" v-loading="load.list" ref="tree"
		:props="{ 'id': 'id', 'pid': 'pgroupId', label: 'label', isLeaf: (d) => d.chidlren?.length > 0 }" :node-draggable="true"
		:horizontal="false" :collapsable="true" :default-expand-level="10" :only-one-node="false" :clone-node-drag="false"
		center @on-restore="restore" @on-node-click="(e, d) => handleNodeClick(d)" :filter-node-method="filterNode"
		:before-drag-end="beforeDragEnd" @on-node-drag="nodeDragMove" @on-node-drag-end="nodeDragEnd" />
</template>

<script>
import util from '@/components/mdp-ui/js/util';//全局公共库
import treeTool from '@/components/mdp-ui/js/treeTool';//全局公共库
import config from '@/api/mdp_pub/mdp_config';//全局公共库

import { listXmGroup, delXmGroup, batchDelXmGroup, getGroups } from '@/api/xm/core/xmGroup';
import { mapState } from 'pinia'
import { useUserStore } from '@/store/modules/user'


import { Vue3TreeOrg } from 'vue3-tree-org';
import "vue3-tree-org/lib/vue3-tree-org.css";

//import { listImGroup} from '@/api/mdp/im/group/imGroup';
//import { publishMessage} from '@/api/mdp/im/imPush';

const XmGroupUserMap = new Map();

import { listXmGroupUser } from '@/api/xm/core/xmGroupUser';



export default {
	name: 'XmGroupUserSelect',
	components: {
		Vue3TreeOrg
	},
	props: ["visible", "selProject", "multiple", 'xmProduct', 'xmIteration', 'pgClass', 'subOpType'],
	computed: {
		...mapState(useUserStore, ['userInfo']),
		expandedKeys() {
			var expandedKeys = []
			if (this.xmProduct && this.xmProduct.id) {
				expandedKeys.push(this.xmProduct.id)
			} else if (this.selProject && this.selProject.id) {
				expandedKeys.push(this.selProject.id)
			} else if (this.xmIteration) {
				expandedKeys.push(this.xmIteration.id)
			} else {
				var groupsLvl1 = this.xmGroups.filter(i => i.lvl <= 1)
				expandedKeys.push(...groupsLvl1)
			}
			return expandedKeys;
		},
		okrTreeData() {
			var groups = JSON.parse(JSON.stringify(this.xmGroups));
			groups.forEach(i => {
				if (i.pgroupId == '') {
					i.pgroupId = null;
				}
				i.currNodeType = 'group'
				i.label = i.groupName
				if (i.groupUsers) {
					var groupUsers = i.groupUsers;
					groupUsers.forEach(u => {
						u.id = u.groupId + "_" + u.userid
						u.pgroupId = u.groupId
						u.label = u.username
						u.currNodeType = 'groupUser'
						u.children = []
					})
					i.children = groupUsers
				} else {
					i.children = []
				}
			})
			var groupsTree = treeTool.translateDataToTree(groups, 'pgroupId', 'id')
			var topLabel = this.userInfo.branchName + "-组织架构"
			var currNodeType = 'project'
			var topdata = {}
			if (this.project && this.project.id) {
				topLabel = (this.project.name ? this.project.name + "-" : "") + "项目组织架构"
				currNodeType = 'project'
				topdata = this.project
				topdata.leaderUserid = this.project.pmUserid
				topdata.leaderUsername = this.project.pmUsername
				topdata.assUserid = this.project.assUserid
				topdata.assUsername = this.project.assUsername
				topdata.pgroupId = ''
			} else if (this.xmProduct && this.xmProduct.id) {

				if (this.xmProduct.productName) {
					topLabel = (this.xmProduct.productName ? this.xmProduct.productName + "-" : "") + "产品组织架构"
				} else {
					topLabel = this.xmProduct.id + "-产品组织架构"
				}
				currNodeType = 'product'
				topdata = this.xmProduct
				topdata.pgroupId = ''
				topdata.leaderUserid = this.xmProduct.pmUserid
				topdata.leaderUsername = this.xmProduct.pmUsername
				topdata.assUserid = this.xmProduct.assUserid
				topdata.assUsername = this.xmProduct.assUsername
			} else {
				return {}
			}
			var data = {
				...topdata,
				label: topLabel,
				currNodeType: currNodeType,
				children: groupsTree || []
			}
			return data;
		},
		projectKey() {
			if (this.xmIteration?.id) {
				return this.xmProduct?.id + '-' + this.xmIteration?.id + '-project-select-id'
			}
			return this.xmProduct?.id + '-project-select-id'
		}
	},
	watch: {
		visible(val) {
			if (val == true) {
				this.initData();
				this.searchXmGroups()
			}
		},

		selProject() {
			this.project = this.selProject;
			this.projectId = this.selProject?.id || sessionStorage.getItem(this.projectKey)
			this.searchTableDatas();
		},
		xmProduct() {
			this.searchTableDatas();
		},
		"filters.groupName": function (val) {
			this.$refs.tree.filter(val);
		},
	},
	data() {
		return {
			filters: {
				groupName: '',
			},
			project: null,
			projectId: null,
			xmGroups: [],//查询结果
			pageInfo: {//分页数据
				total: 0,//服务器端收到0时，会自动计算总记录数，如果上传>0的不自动计算。
				pageSize: 50,//每页数据
				count: true,//是否需要重新计算总记录数
				pageNum: 1,//当前页码、从1开始计算
				orderFields: [],//排序列 如 ['sex','student_id']，必须为数据库字段
				orderDirs: []//升序 asc,降序desc 如 性别 升序、学生编号降序 ['asc','desc']
			},
			load: { list: false, edit: false, del: false, add: false },//查询中...
			sels: [],//列表选中数据
			dicts: {
				//sex: [{id:'1',name:'男'},{id:'2',name:'女'}]
			},//下拉选择框的所有静态数据 params={categoryId:'all',itemCodes:['sex']} 返回结果 {sex: [{id:'1',name:'男'},{id:'2',name:'女'}]}
			addForm: {
				id: '', groupName: '', projectId: '', pgTypeId: '', pgTypeName: '', leaderUserid: '', leaderUsername: '', ctime: '', ltime: '', productId: '', branchId: '', pgClass: '', pgroupId: '', lvl: '', pidPaths: '', isTpl: '', assUserid: '', assUsername: '', childrenCnt: '', userCnt: '', qxCode: '', calcWorkload: '', ntype: '', crowBranchId: '', crowBranchName: '', isCrow: ''
			},

			addFormInit: {
				id: '', groupName: '', projectId: '', pgTypeId: '', pgTypeName: '', leaderUserid: '', leaderUsername: '', ctime: '', ltime: '', productId: '', branchId: '', pgClass: '', pgroupId: '', lvl: '', pidPaths: '', isTpl: '', assUserid: '', assUsername: '', childrenCnt: '', userCnt: '', qxCode: '', calcWorkload: '', ntype: '', crowBranchId: '', crowBranchName: '', isCrow: ''
			},
			editFormVisible: false,//编辑界面是否显示
			editForm: {
				id: '', groupName: '', projectId: '', pgTypeId: '', pgTypeName: '', leaderUserid: '', leaderUsername: '', ctime: '', ltime: '', productId: '', branchId: '', pgClass: '', pgroupId: '', lvl: '', pidPaths: '', isTpl: '', assUserid: '', assUsername: '', childrenCnt: '', userCnt: '', qxCode: '', calcWorkload: '', ntype: '', crowBranchId: '', crowBranchName: '', isCrow: ''
			},
			groupOperSelectVisible: false,
			currNodeType: '',//project/product/iteration/group/groupUser 
		}
	},//end data
	methods: {
		restore() {

		},
		searchXmGroups() {
			if (!this.project || !this.project.id) {
				this.$message.success("请先选中项目")
				return;
			}
			this.pageInfo.count = true;
			this.searchTableDatas();
		},
		//获取列表 XmGroup xm_group
		searchTableDatas() {

			let params = {
				pageSize: this.pageInfo.pageSize,
				pageNum: this.pageInfo.pageNum,
				total: this.pageInfo.total,
				count: this.pageInfo.count
			};
			if (this.pageInfo.orderFields != null && this.pageInfo.orderFields.length > 0) {
				let orderBys = [];
				for (var i = 0; i < this.pageInfo.orderFields.length; i++) {
					orderBys.push(this.pageInfo.orderFields[i] + " " + this.pageInfo.orderDirs[i])
				}
				params.orderBy = orderBys.join(",")
			}
			if ((!this.project || !this.project.id)) {
				return;
			}
			if (this.project && this.project.id) {
				params.projectId = this.project.id
			}
			if (this.filters.groupName) {
				params.groupName = this.filters.groupName
			}
			if (this.filters.groupNameKey) {
				params.groupNameKey = this.filters.groupNameKey
			}
			if (this.filters.groupUsernameKey) {
				params.groupUsernameKey = this.filters.groupUsernameKey
			}
			if (this.filters.mngUsernamegroupName) {
				params.mngUsernamekey = this.filters.mngUsernamekey
			}
			var func = getGroups
			this.load.list = true;
			func(params).then((res) => {
				var tips = res.tips;
				if (tips.isOk) {
					this.pageInfo.total = res.total;
					this.pageInfo.count = false;
					this.xmGroups = res.data;
					XmGroupUserMap.set(this.projectKey + "-" + this.projectId,this.xmGroups)
				} else {
					this.$notify({ position: 'bottom-left', showClose: true, message: tips.msg, type: 'error' });
				}
				this.load.list = false;
			}).catch(err => this.load.list = false);
		},

		initData: function () {
			if (this.selProject) {
				this.project = this.selProject;

			}
			this.projectId = this.selProject?.id || sessionStorage.getItem(this.projectKey) || ''
			let xmGroups = XmGroupUserMap.get(this.projectKey + "-" + this.projectId)
			if (xmGroups) {
				this.xmGroups = xmGroups
			}else{
				this.searchTableDatas()
			}
		},
		renderCurrentClass(node) {
			return 'label-bg-blue'
		},
		handleNodeClick(data) {
			if (data.currNodeType) {
				this.currNodeType = data.currNodeType //project/product/iteration/group/groupUser
			} else {
				this.currNodeType = ''
			}

			this.editForm = data;
			this.$emit('select', data)
		},
		renderContent(h, node) {


		},


		onPorjectConfirm(project) {
			this.addForm = { ...this.addFormInit }
			this.addForm.projectId = project.id
			this.addForm.groupName = project.name + "-管理小组"
			this.addForm.projectName = project.name
			this.addForm.pgClass = "0"
			this.addFormVisible = true;
			this.selectProjectVisible = false;
		},
		onProjectRowClick(project) {

			this.project = project;
			sessionStorage.setItem(this.projectKey, project?.id || '')
			this.searchXmGroups();
		},
		onProjectClearSelect() {
			this.project = null
			this.xmGroups = []
			sessionStorage.removeItem(this.projectKey)
			this.searchXmGroups();
		},
		filterNode(value, data) {
			if (!value) return true;
			var match = false;
			if (data.leaderUsername) {
				match = data.leaderUsername.indexOf(value) !== -1;
				if (match == true) {
					return true;
				}
			}
			if (data.assUsername) {
				match = data.assUsername.indexOf(value) !== -1;
				if (match == true) {
					return true;
				}
			}
			if (data.groupName) {
				match = data.groupName.indexOf(value) !== -1;
				if (match == true) {
					return true;
				}
			}

			if (data.crowBranchName) {
				match = data.crowBranchName.indexOf(value) !== -1;
				if (match == true) {
					return true;
				}
			}
			return data.label.indexOf(value) !== -1;
		},
	},//end methods
	mounted() {
		this.initData() 
	}
}

</script>
<style>
.label-class-blue {
	color: #1989fa;
}

.label-bg-blue {
	background: #1989fa;
	color: #fff;
}

.diy-wrapper {
	padding: 10px
}

.no-padding {
	padding: 0 !important;
}

.diy-wrapper.left-child {
	border: 1px solid red;
}

.diy-con-name {
	color: black;
}

.diy-con-content {
	padding-top: 5px;
	color: dimgrey;
	font-size: 12px;
}

.crrentClass {
	border: 1px solid red;
	color: blue;
}
</style>
<style scoped />
