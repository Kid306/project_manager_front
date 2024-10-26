<template>
	<ContentWrap> 
		<el-space wrap>
			<el-checkbox v-model="filters.isMy" false-label="" true-label="1">我的模板</el-checkbox>
			<el-radio v-model="filters.tplType" label="1">全网公开模板</el-radio>
			<el-radio v-model="filters.tplType" label="2">本企业模板</el-radio>
			<el-input style="width:300px;" v-model="filters.name" placeholder="模板名字"/>
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
					<el-table v-adaptive="{bottom:50}" ref="table" v-cloak  stripe :data="tableDatas" @sort-change="sortChange" highlight-current-row v-loading="load.list" @selection-change="selsChange" @row-click="rowClick" style="width: 100%;">
 						<el-table-column prop="name" label="项目模板(学习/参考)" min-width="200" >
							<template #default="scope">
								<div v-if="isSelect===true">{{scope.row.name}}</div>
								<el-link v-else @click.stop="intoInfo(scope.row)">{{scope.row.name}}</el-link>
							</template>
						</el-table-column>
						<el-table-column  label="" width="120" fixed="right" v-if="isSelect!==true">
							<template #default="scope">
								<el-button type="text" title="通过复制创建新的项目" @click="onCopyToBtnClick(scope.row)" :disabled="load.add" v-loading="load.add">复制</el-button>
								<el-button type="text" title="删除该模板" @click="handleDel(scope.row)" :disabled="load.del" v-loading="load.del">删除</el-button>
							</template>
						</el-table-column>
					</el-table> 

			<el-pagination  layout="total,  prev, next" @current-change="handleCurrentChange" @size-change="handleSizeChange" :page-sizes="[10,20, 50, 100, 500]" :current-page="pageInfo.pageNum" :page-size="pageInfo.pageSize"  :total="pageInfo.total"  style="float:right;" />
 
		<mdp-dialog
			title="通过复制创建新的模板或者新的项目"
			v-model="copyToVisible"
			append-to-body
			width="500" >
			<el-form>
			<el-form-item label="项目名称">
				<el-input v-model="xmProjectCopy.name" placeholder="新的项目名称"/>
			</el-form-item>
			<el-form-item  label="项目代号">
				<el-input v-model="xmProjectCopy.code"  placeholder="新的项目代号">
					<template #append>
						<el-button type="text" @click="createProjectCode">自动生成</el-button>
					</template>
				</el-input>
				<font color="blue" style="font-size:10px;">项目代号为合同上的项目代号，甲乙方共享;项目内部编号为 &nbsp;代号-四位随机码</font>
			</el-form-item>
			<el-form-item  label="目标">
				<el-radio v-model="xmProjectCopy.isTpl" label="1">复制为新的模板</el-radio>
				<el-radio v-model="xmProjectCopy.isTpl" label="0">复制为新的项目</el-radio>
			</el-form-item>
			<el-form-item  label="公开范围" v-if="xmProjectCopy.isTpl=='1'">
				<el-radio v-model="xmProjectCopy.tplType" label="1">向全网公开</el-radio>
				<el-radio v-model="xmProjectCopy.tplType" label="2">只向本企业公开</el-radio>
			</el-form-item>
			<el-form-item label="附加任务">
				<el-checkbox v-model="xmProjectCopy.copyPhase" true-label="1" false-label="0">拷贝计划</el-checkbox>
				<el-checkbox v-model="xmProjectCopy.copyTask" true-label="1" false-label="0">拷贝任务</el-checkbox>
				<el-checkbox v-model="xmProjectCopy.copyGroup" true-label="1" false-label="0">拷贝项目组织架构</el-checkbox>
				<el-checkbox v-model="xmProjectCopy.copyGroupUser" true-label="1" false-label="0">拷贝项目组成员</el-checkbox>
				<el-checkbox v-model="xmProjectCopy.copyProduct" true-label="1" false-label="0">拷贝关联产品及需求明细</el-checkbox>
			</el-form-item>
			</el-form>
			<template #footer>
				<span  class="footer">
					<el-button @click="copyToVisible = false">取 消</el-button>
					<el-button type="primary" @click="onCopyToConfirm" :disabled="load.add" v-loading="load.add">确 定</el-button>
				</span>
			</template>
		</mdp-dialog>
	

</template>

<script>
	
	import util from '@/components/mdp-ui/js/util';//全局公共库
	//import Sticky from '@/components/Sticky' // 粘性header组件
	import config from "@/api/mdp_pub/mdp_config"; //全局公共库

	import { listXmProject, editStatus, delXmProject, batchDelXmProject,copyTo,createProjectCode} from '@/api/xm/core/xmProject';
	
 	import { mapState } from 'pinia'
import { useUserStore } from '@/store/modules/user'

import { MdpTableMixin } from '@/components/mdp-ui/mixin/MdpTableMixin.js'

export default {
	mixins:[MdpTableMixin],
		props:['dataScope','showType','isSelect'],
		computed: {
			...mapState(useUserStore,[
				'userInfo','roles'
			]), 
		}, 
		data() { 
			return {
				filters: {
					key: '',
					productId:'',
					productName:'',
					tplType:'1',
				},   
				 
 				menukey: "all",   
				xmProjectCopy:{
					id:'',name:'',code:'',isTpl:'',copyPhase:'1',copyTask:'1',copyGroup:'1',copyGroupUser:'0',copyProduct:'1',tplType:'2',
				},
				copyToVisible:false,
				apis:{
					list:listXmProject
				}
			}
		},//end data
		methods: {
			 
			preQueryParamCheck( params ) {  
				params.isTpl="1"    
				if(params.isMy){
					params.createUserid=this.userInfo.userid
				}
				return true
			},  
 
			handleDel: function (row,index) {
				this.$prompt('将同步删除计划、组织、任务等，慎重起见，请输入项目代号:'+row.code, '提示', {
					confirmButtonText: '确定',
					cancelButtonText: '取消',
				}).then(({ value }) => {
					 if(value==row.code){
						 this.load.del=true;
						let params = { id: row.id };
						delXmProject(params).then((res) => {
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
			 
			onCopyToBtnClick(row){
				this.xmProjectCopy.id=row.id;
				this.xmProjectCopy.name=row.name+"(复制)";
				this.xmProjectCopy.isTpl=row.isTpl;
				this.copyToVisible=true;
			},
			onCopyToConfirm(){
				if(!this.xmProjectCopy.code){
					this.$notify({position:'bottom-left',showClose:true,message: '项目代号不能为空', type: 'error' });
					return;
				}

				copyTo(this.xmProjectCopy);
				this.$notify({position:'bottom-left',showClose:true,message: "已提交拷贝任务，执行需要1-5分钟，请稍后刷新项目列表", type:  'success' });
			}, 

			//进入info界面
			intoInfo(row) {
				this.selectProject = row;
				this.$router.push({ name:'projectOverview', query: {projectId:row.id,isTpl:"1"} })
 				//this.showInfo = true;
			},  
			createProjectCode(){
				createProjectCode({}).then(res=>{
					var tips=res.tips;
					if(tips.isOk){
						this.xmProjectCopy.code=res.data
					}
					this.$notify({position:'bottom-left',showClose:true,message: tips.msg, type: tips.isOk?'success':'error' });
				})
			} 

		},//end methods
		components: {
		}, 
	}

</script>

<style scoped>
*  .sub-navbar{
	background: #fafbfc;
}
.changebtn{
	float: right;
	padding: 2px 10px;
	display: flex;
	align-items: center;
	line-height: 0;
	height: 100%;
}
.changebtn > button{
	padding: 0;
	border: 0;
	color: #333;
}
.changebtn  i::before{
	font-size:20px;
}
.changebtn-active{
	color: #409EFF !important;
}
.app-container{
	padding: 10px;
}
.el-menu-demo{
	border: 0 !important;
	height: 50px;
	padding-left: 10px;
	background-color: #fafbfc;
}
.el-menu-demo>.el-menu-item,
.el-menu-demo>.el-sub-menu  .el-sub-menu__title{
	height: 100%;
	line-height: 50px;
	color: #909399;
}
.el-menu--horizontal>.el-menu-item:not(.is-disabled):focus,
.el-menu--horizontal>.el-menu-item:not(.is-disabled):hover,
.el-menu--horizontal>.el-sub-menu .el-sub-menu__title:hover{
	background-color: transparent;
}
.project-card{
	font-size: 12px;
	color: #999;
	margin: 10px 12px;
}
.project-card:hover{
	border-color: #00abfc;
}
.project-card  .el-card__body{
	padding: 20px 15px 10px;
}
.project-name{
	font-size: 16px;
	font-weight: 700;
	color: #333;
	height: 24px;
}
.project-id{
	margin-top: 4px;
	height: 18px;
}
.project-info{
	display: flex;
	margin-top: 8px;
}
.project-info>div{
	display: flex;
	flex-direction: column;
}
.info-item{
	width: 15%;
	text-align: center;
}
.info-item  span{
	display: block;
}
.item-total{
	font-size: 18px;
	color: #666;
}
.info-task{
	padding-left: 20px;
	width: 70%;
	border-left: 1px solid #efefef;
}
.finish-task{
	color: #00abfc !important;
}
.project-rate{
	margin: 15px 0;
}
.project-rate>.el-progress{
	display: flex;
	align-items: center;
}
.project-rate  .el-progress-bar{
	padding-right: 0;
	margin-right: 0;
}
.project-rate  .el-progress__text{
	margin-left: 5px;
}
.project-footer{
	display: flex;
}
.project-footer>div{
	width: 30%;
}
.project-footer>div:not(:first-child){
	width: 70%;
}
.project-period{
	text-align: right;
}
.see-more > i{
	background:#000;
}
/* 超过宽度则用...代替 */
.truncate{
	overflow: hidden;
	text-overflow: ellipsis;
	white-space: nowrap;
}
[v-cloak]{
	display: none;
}
.hidden-btn{
	margin-top: 5px;
	margin-bottom: 5px;
}
.right-btn{
	margin-top: 12px;
}
@media only screen and (max-height: 2400px) {
	.project-box{
		max-height: 1600x;
		overflow-y: auto;
	}
}
@media only screen and (max-height: 1200px) {
	.project-box{
		max-height: 800px;
		overflow-y: auto;
	}
}
@media only screen and (max-height: 980px) {
	.project-box{
		max-height: 600px;
		overflow-y: auto;
	}
}
@media only screen and (max-height: 640px) {
	.project-box{
		max-height: 300px;
		overflow-y: auto;
	}
}

.more-label-font{
	text-align:center;
	float:left;
	padding-top:5px;
}
</style>
