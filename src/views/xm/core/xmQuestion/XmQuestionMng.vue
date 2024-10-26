<template> 
    <el-row :gutter="5">
        <el-col :span="toggle?0:6">
             <div v-show="!toggle">
                <xm-func-tree v-if="product?.id" :xm-product="product" @check-change="onXmFuncRowClick" @product-select="onProductSelected" @product-clear="clearProduct"/>
								<div v-else class="padding"> 
									<xm-product-select  width="100%" v-model="productId" v-if="!xmProduct?.id&&!xmIteration?.id"  :link-project-id="selProject?selProject.id:null" @change2="onProductSelected" @clear="clearProduct" />
									</div>
							
							</div> 
        </el-col>
        <el-col :span="toggle?24:18">
 
    <ContentWrap>
      <template #header>
        <el-space wrap>
					<el-button :icon="toggle?'DArrowRight':'DArrowLeft'" @click="onToggleClick" plain title="展开/收起左边"/>

          <mdp-hi-query :column-configs="columnConfigs" v-model="hiQueryParams" @change="onHiQueryParamsChange"/>
          <el-button icon="zoom-out" @click="searchReset()" title="重置查询条件并查询"/> 
         <mdp-export @excel="export2Excel()"/>
          <mdp-table-configs :column-configs="columnConfigs" v-model="checkedColumns"/>
					<el-button @click="$refs['kanbanDlg'].open()" type="success" plain>板</el-button> 
					<span v-if="currOpType=='mng'">
							<el-button type="warning" @click="showMenuVisible()" plain title="关联需求">故事</el-button>
              <el-button :disabled="disBtn('addBtn') || !checkBtnQx('addBtn',menuDefId) " type="primary" @click="showAdd" icon="plus" plain/>
              <el-button :disabled="disBtn('delBtn') || !checkBtnQx('delBtn',menuDefId) || sels.length===0 || load.del==true" type="danger" v-loading="load.del" @click="batchDel" icon="delete" plain/>
          </span>
					
					<MdpSelectTag multiple v-model="filters.tagIdList"/>
					<MdpSelect v-model="filters.queryScene" placeholder="场景" :options="[
						{id:'myPartyin',name:'我参与过的缺陷'},
						{id:'myResolve',name:'我解决过的缺陷'},
						{id:'myCreate',name:'我创建的缺陷'},
						{id:'myHandler',name:'我负责过的缺陷'},
						{id:'myAsk',name:'我提出的缺陷'},
						{id:'retest1',name:'次数>1 回归测试'},
						{id:'retest2',name:'次数>2 回归测试'},
						{id:'retest3',name:'次数>3 回归测试'}
				]"/>
          <span  v-if="currOpType=='select' &&  multiple==true">
              <el-button :disabled="disBtn('selectBtn') || sels.length===0" type="primary" @click="selectListConfirm" icon="check">确认选择</el-button>
          </span>  
        </el-space>
      </template>  
 
    <el-space wrap>  
			<xm-product-select v-model="productId" v-if="!xmProduct?.id&&!xmIteration?.id  && toggle"  :link-project-id="selProject?selProject.id:null" @change2="onProductSelected" @clear="clearProduct" />
			<xm-iteration-select v-model="filters.linkIterationId" v-if="product?.id && !xmIteration?.id" :xm-product="product"/>	
			<XmMenuSelect v-model="filters.menuId" :xm-product="product" :sel-project="selProject" v-if="!xmMenu?.menuId"/>
				<xm-project-select v-model="filters.projectId" v-if="!selProject?.id"  ref="xmProjectSelect"  :link-product-id="xmProduct?xmProduct.id:null" @change2="onProjectConfirm" @clear="clearProject" />
				<XmTaskSelect v-model="filters.taskId" :xm-product="product" :sel-project="project" v-if="project?.id"/>
				<xm-user-select :xm-product="product" :sel-project="project" v-model="filters.handlerUserid" placeholder="负责人"/>
				<xm-user-select :xm-product="product" :sel-project="project" v-model="filters.createUserid" placeholder="创建人"/>

				<mdp-select v-model="filters.bugStatus" placeholder="状态"   clearable itemCode="bugStatus"/>

				<mdp-select  v-model="filters.priority" placeholder="优先级"    clearable  itemCode="priority"/> 
 
				<el-input style="width:10em;" v-model="filters.name" placeholder="缺陷名称" clearable/> 
        <el-button v-loading="load.list" :disabled="load.list==true" @click="searchTableDatas()" icon="search" type="primary" :size="size">查询</el-button>
     </el-space>  
    

  </ContentWrap>
				<!--列表 XmQuestion xm_question-->
				<el-table  element-loading-text="努力加载中" element-loading-spinner="loading"  ref="table" v-adaptive="{bottom:50}" :data="tableDatas" @sort-change="sortChange" highlight-current-row v-loading="load.list" border @selection-change="selsChange" @row-click="rowClick" style="width: 100%;">
 					<el-table-column  label="全选" type="selection" min-width="50"  fixed="left" />

					 <el-table-column prop="name" label="缺陷名称"  width="400" fixed="left">
						<template #default="scope">
							<el-popover placement="right-start"
								:width="200"  :show-after="200"
 							>
							<template #reference>
								<el-link @click="showEdit(scope.row)">{{ scope.row.sortNo||(scope.$index+1) }} &nbsp; {{ scope.row.name }}</el-link>
							</template>
							<template #default>
								<el-button @click="copy3(scope.row, scope.$index)" icon="document-copy" type="warning" title="复制一行除了主键不一样，其它都一样的数据">复制</el-button>
              <el-button @click="showEdit(scope.row)" icon="edit" type="primary">编辑</el-button>
								</template>
							</el-popover> 
						</template>
					</el-table-column>
					<el-table-column prop="bugStatus" label="状态"  width="120"  item-code="bugStatus" sortable>
						<template #default="scope">
										 <mdp-select show-style="tag"   v-model="scope.row.bugStatus" placeholder="类型" itemCode="bugStatus"  @change="editSomeFields(scope.row,'bugStatus',$event)"/>
						</template>
					</el-table-column>
					<el-table-column prop="rate" label="进度" width="100" show-overflow-tooltip sortable>
						<template #default="scope">
							<span
								:style="{ borderRadius: '30px', color: scope.row.rate >= 100 ? 'green' : 'blue' }"
							>
								{{ (scope.row.rate != null ? scope.row.rate : 0) + '%' }}
							</span>
						</template>
					</el-table-column>
					<el-table-column prop="priority" label="优先级"  width="120" itemCode="priority" sortable>
						<template #default="scope">
										 <mdp-select show-style="tag"  v-model="scope.row.priority" placeholder="优先级" itemCode="priority"    @change="editSomeFields(scope.row,'priority',$event)"/>
 						</template>
					</el-table-column>
					<el-table-column prop="solution" label="解决方案"  width="120" itemCode="bugSolution" sortable>
						<template #default="scope">
										 <mdp-select show-style="tag"  v-model="scope.row.solution" placeholder="类型" itemCode="bugSolution"   @change="editSomeFields(scope.row,'solution',$event)"/>
						</template>
					</el-table-column>
					<el-table-column prop="bugSeverity" label="严重程度"  width="120" itemCode="bugSeverity" sortable>
						<template #default="scope">
										 <mdp-select show-style="tag"  v-model="scope.row.bugSeverity" placeholder="类型" itemCode="bugSeverity"   @change="editSomeFields(scope.row,'bugSeverity',$event)"/>
						</template>
					</el-table-column> 
					<el-table-column prop="handlerUsername" label="负责人"  width="120" show-overflow-tooltip sortable>
						<template #default="scope">
							<xm-user-select :xm-product="product||{id:scope.row.productId}" :sel-project="project||{id:scope.row.projectId}" show-style="tag"  :key="scope.row.id" v-model="scope.row.handlerUserid" :init-name="scope.row.handlerUsername" @change2="editSomeFields(scope.row,'handlerUserid',$event)"/>
						</template>
					</el-table-column>
					<el-table-column prop="tagNames" label="标签"  width="120" show-overflow-tooltip sortable>
						<template #default="scope">
									<MdpSelectTag showStyle="tag" multiple v-model="scope.row.tagIds" :init-name="scope.row.tagNames" @change2="editSomeFields(scope.row,'tagIds',$event)"/>
						</template>
					</el-table-column>
					<el-table-column prop="projectId" label="项目"  width="120" show-overflow-tooltip sortable/> 
					<el-table-column prop="productId" label="产品"  width="120" show-overflow-tooltip sortable/>
					<el-table-column prop="askUsername" label="提出人"  width="120" show-overflow-tooltip sortable/>
					<el-table-column prop="createUsername" label="创建人"  width="120" show-overflow-tooltip sortable/>

					<el-table-column prop="actWorkload" label="实际工时"  width="120" show-overflow-tooltip sortable/> 
					<el-table-column prop="initWorkload" label="原估工时"  width="120" show-overflow-tooltip sortable/> 
					<el-table-column prop="budgetWorkload" label="预估工时"  width="120" show-overflow-tooltip sortable/>  
					<el-table-column prop="endTime" label="关闭时间" width="120" show-overflow-tooltip colType="date" sortable/>
					<el-table-column prop="createTime" label="创建时间" width="120" show-overflow-tooltip colType="date" sortable/>

					<el-table-column prop="ltime" label="更新时间"  width="120" show-overflow-tooltip colType="date" sortable/> 

					<el-table-column prop="menuName" label="需求名称" width="120" show-overflow-tooltip sortable/> 
					<el-table-column prop="caseName" label="用例"  width="120" show-overflow-tooltip sortable/>
					<el-table-column prop="id" label="缺陷编号" width="120" show-overflow-tooltip sortable/> 
					<el-table-column prop="sortNo" label="排序号" width="120" show-overflow-tooltip sortable/> 
					<el-table-column prop="taskId" label="任务编号" width="120" show-overflow-tooltip sortable/>
					<el-table-column prop="funcId" label="模块编号" width="120" show-overflow-tooltip kbName="funcName" sortable/>
					<el-table-column prop="funcName" label="模块名称" width="120" show-overflow-tooltip sortable/>
					<el-table-column prop="askUserid" label="提出人编号"  width="120" show-overflow-tooltip kbName="askUsername" sortable/>
					<el-table-column prop="createUserid" label="创建人编号"  width="120" show-overflow-tooltip  kbName="createUsername" sortable/>
					<el-table-column prop="caseId" label="用例编号"  width="120" show-overflow-tooltip  kbName="caseName" sortable/> 
					<el-table-column prop="menuId" label="需求编号" width="120" show-overflow-tooltip kbName="menuName" sortable/>

				</el-table>
			 <el-pagination  layout="total, sizes, prev, pager, next" @current-change="handleCurrentChange" @size-change="handleSizeChange" :page-sizes="[10,20, 50, 100, 500]" :current-page="pageInfo.pageNum" :page-size="pageInfo.pageSize"  :total="pageInfo.total" style="float:right;" />
</el-col>
</el-row>
			<!--编辑 XmQuestion xm_question界面-->
			<mdp-dialog ref="editFormDialog" title="编辑缺陷"   fullscreen  :close-on-click-modal="false" append-to-body>
				<template #default="{visible,data,dialog}">
					<xm-question-edit :xm-menu="xmMenu" :xmTask="xmTask" :sel-project="project||{id:editForm.projectId,name:editForm.projectName} " :xm-product="product"  :xm-iteration="xmIteration" :formData="data.formData" :visible="visible" @cancel="dialog.close()" @submit="afterEditSubmit" @edit-fields="onEditFields" />
				</template>
			</mdp-dialog>

			<!--新增 XmQuestion xm_question界面-->
			<mdp-dialog ref="formDialog" title="新增缺陷"   fullscreen    append-to-body   :close-on-click-modal="false">
				<template #default="{visible,dialog}">
					<XmQuestionEdit  :xm-menu="xmMenu" :xm-func="xmFunc" :xmTask="xmTask" sub-op-type="add" :xm-test-plan-case="xmTestPlanCase" :xm-test-plan="xmTestPlan" :xm-product="product" :xm-iteration="xmIteration" :xm-test-case="xmTestCase" :qtype="qtype" :sel-project="project " :formData="addForm" :visible="visible" @cancel="dialog.close()" @submit="afterAddSubmit" />
				</template>
			</mdp-dialog>
 			<mdp-dialog append-to-body title="需求选择" v-model="menuVisible"    width="90%"   :close-on-click-modal="false">
				<xm-menu-box subOpType="select" :visible="menuVisible"   :xm-product="product"  @select="onSelectedMenu"  />
			</mdp-dialog>

  <!-- 缺陷看板-->
  <mdp-dialog ref="kanbanDlg"
    title="缺陷看板"  
    fullscreen  
  > 
    <MdpTableKanban @del="(d,cb)=>handleDel(d,0,cb)"
      @plus="(cb)=>showAdd(cb)"
      @edit="(d,cb)=>showEdit(d,cb)"
      v-model="tableDatas" 
      :columnConfigs="columnConfigs"
      itemKey="id" 
      :contentFun="(item)=>item.name"
    > 
    <template #toolbar="{element}">
      <MdpSelect showStyle="tag" itemCode="bugStatus" disabled v-model="element.bugStatus"/>
    </template>
    </MdpTableKanban>
  </mdp-dialog>
  	
</template>

<script>
	import util from '@/components/mdp-ui/js/util';//全局公共库

	import config from '@/api/mdp_pub/mdp_config';//全局公共库
	//import Sticky from '@/components/Sticky' // 粘性header组件

	import { listXmQuestion,addXmQuestion,delXmQuestion, batchDelXmQuestion, editStatus ,editXmQuestionSomeFields, editXmQuestion} from '@/api/xm/core/xmQuestion';
 
	import { mapState } from 'pinia'
import { useUserStore } from '@/store/modules/user' 
	
 
import { defineAsyncComponent } from 'vue';
 
import { MdpTableMixin } from '@/components/mdp-ui/mixin/MdpTableMixin.js';

	export default {
		mixins:[MdpTableMixin],
		computed: {
			...mapState(useUserStore,[
				'userInfo','roles'
			]),
		},
		props: ["selProject",'qtype','xmTestPlanCase','xmTestCase','xmTestPlan','xmIteration','xmProduct','queryScene','xmMenu','xmTask'],
		watch:{
			selProject:function(selProject){
				this.project=this.selProject
				this.searchReset();
			},
			qtype:function(){
				this.searchReset();
			},
			xmIteration:function(){
				this.searchReset();
			},
			xmProduct:function(){
				this.product=this.xmProduct
				this.searchReset();
			}
		},
		data() { 
			return { 
				pkNames:['id'],
				filters: {
					name: '',
					bugStatus:'',
					priority:'',
					solution:'',
					bugSeverity:'',
					hisHandleStatus:null,
					tagIdList:[],
					id:'',
					projectId:'',
					productId:'',
					menuId:''

				},
				pageInfo:{//分页数据
					total:0,//服务器端收到0时，会自动计算总记录数，如果上传>0的不自动计算。
					pageSize:10,//每页数据
					count:true,//是否需要重新计算总记录数
					pageNum:1,//当前页码、从1开始计算
					orderFields:['ltime'],//排序列 如 ['sex','student_id']，必须为数据库字段
					orderDirs:['desc']//升序 asc,降序desc 如 性别 升序、学生编号降序 ['asc','desc']
				},   
				 
				project:null,
				menus:[],
				product:null,   
				menuVisible:false,
				apis:{
					list: listXmQuestion,
					add: addXmQuestion,
					edit: editXmQuestion,
					editSomeFields: editXmQuestionSomeFields,
					del: delXmQuestion,
					batchDel: batchDelXmQuestion
				},
				currOpType:'mng',
				toggle:true,
				hadInit:false,
				xmFunc: null,

			}

		},//end data
		methods: { 
			onToggleClick(){
				this.toggle=!this.toggle
				if(!this.hadInit){
					this.hadInit=true
				}
			},
			
			onXmFuncRowClick(row, checked) {
            this.xmFunc = checked ? row : null
            this.searchTableDatas()
        },  
        /**
         * 检查参数是否满足调用后台接口的条件
         * 
         * @param params 提交给后台的参数池,map类型
         * @returns true / false
         */
			preQueryParamCheck(params){  

				if(this.product){
					params.productId=this.product.id
				}  
				if(this.xmTestPlanCase){
					params.planId=this.xmTestPlanCase.planId
					params.caseId=this.xmTestPlanCase.caseId
				}

				if(this.xmTestPlan){
					params.planId=this.xmTestPlan.id
					params.projectId=this.xmTestPlan.projectId
				}
				if(this.xmTestCase){
					params.caseId=this.xmTestCase.id
				}
				if(this.xmIteration){
					params.linkIterationId=this.xmIteration.id
				}

				if(this.xmMenu){
					params.menuId=this.xmMenu.menuId
				}

				if(this.xmFunc){
					params.funcId=this.xmFunc.id
				}
				
				if(this.project){
					params.projectId = this.project.id;
				}
				if(this.xmProduct){
					params.productId = this.xmProduct.id;
				}

				// {id:'myPartyin',name:'我参与过的缺陷'},
				// 		{id:'myResolve',name:'我解决过的缺陷'},
				// 		{id:'myCreate',name:'我创建的缺陷'},
				// 		{id:'myHandler',name:'我负责过的缺陷'},
				// 		{id:'myAsk',name:'我提出的缺陷'},
				// 		{id:'retest1',name:'次数>1 回归测试'},
				// 		{id:'retest2',name:'次数>2 回归测试'},
				// 		{id:'retest3',name:'次数>3 回归测试'}
				if(params.queryScene){
					if(params.queryScene=='myPartyin'){
						params.his="1"
						params.hisHandlerUserid=this.userInfo.userid
						params.hisTargetUserid=this.userInfo.userid
					}else if(params.queryScene=='myResolve'){ 
						params.his="1"
						params.hisHandlerUserid=this.userInfo.userid 
						params.hisHandleStatus="3"
					}else if(params.queryScene=='myCreate'){  
						params.createUserid=this.userInfo.userid 
					}else if(params.queryScene=='myAsk'){  
						params.askUserid=this.userInfo.userid 
					}else if(params.queryScene=='retest1'){ 
						params.his="1"
						params.retestCount="1"
					}else if(params.queryScene=='retest2'){ 
						params.his="1"
						params.retestCount="2"
					}else if(params.queryScene=='retest3'){ 
						params.his="1"
						params.retestCount="3"
					}
				}
				return true; 
			},
			clearProduct(){
				this.product=null;
				this.filters.linkIterationId=''
			},
			onProductSelected(product){
				this.product=product;
				this.filters.linkIterationId=''
			},
			//显示新增界面 XmQuestion xm_question
			showAdd: function () {
				if(!this.project || !this.project.id){
					this.$notify({position:'bottom-left',showClose:true,message: "请先选中项目", type: 'warning' });
					return;
				}
				this.openForm({parentOpType:this.currOpType,subOpType:'add'})
			},
			showEdit(formData){
				this.openForm({formRefId:'editFormDialog',formData:formData})
			},
			onUserConfirm:function(groupUsers,option){
				if(option.action=='createUser'){
					if(groupUsers==null || groupUsers.length==0){
						this.filters.createUser=null
					}else{
						var user=groupUsers[0]
						this.filters.createUser=user
					}
				}else if(option.action=='hisHandler'){
					if(groupUsers==null || groupUsers.length==0){
						this.filters.hisHandler=null
					}else{
						var user=groupUsers[0]
						this.filters.hisHandler=user
					}
				}else if(option.action=='editHandlerUserid'){
					 this.editSomeFields(option.data,"handlerUserid",groupUsers)
					 return;
				}
				this.selectUserVisible=false

			},
			onProjectConfirm:function(project){
				this.project=project
			},
			showApprovaInfo:function(row){
				var msgFields=[];
				if(row.mainTitle!=null && row.mainTitle!=""){
					msgFields.push("流程【"+row.mainTitle+"】");
				}

				if(row.taskName!=null && row.taskName!=""){
					msgFields.push("当前环节【"+row.taskName+"】");
				}

				if(row.assigneeName!=null && row.assigneeName!=""){
					msgFields.push("执行人【"+row.assigneeName+"】");
				}

				if(row.commentMsg!=null && row.commentMsg!=""){
					msgFields.push("审批意见【"+row.commentMsg+"】");
				}
				var msg=msgFields.join(",");
				return msg;
			},

			sendToProcessApprova:function(row,bizKey){
				// 传过来的参数格式
				if(row.flowState=='1'){
					this.$notify.error("已经发起，不允许重复发起");
					return;
				}
				let extVars={projectId:row.projectId,branchId:this.userInfo.branchId,questionId:row.id}
				let jsonExtVars=JSON.stringify(extVars);

				var currDomain=window.location.protocol+"//"+window.location.host;
				var fullPath=this.$route.fullPath;
				var bizUrl=currDomain+'/#'+fullPath+'?extVars='+jsonExtVars

				let params={
					bizKey:bizKey,
					bizUrl:bizUrl,
					resUrl:'',
					bizId:row.id,
					bizPid:row.id,
					mainContext:'',
					extVars:extVars,
					flowVars:{
						subscribeTaskEvent:'TASK_COMPLETED',
						data:{
							id:row.id,
							branchId:this.userInfo.branchId,
							projectId:row.projectId,

						}
					},
				}
				if(bizKey=="xm_question_up_approva"){
					//预算变更审核
					params.mainTitle='关于缺陷【'+row.name+"】升级的申请";
					params.mainContext='项目编号：'+row.projectId+','+'项目名称：'+row.projectName+',任务名称：'+row.taskName
										+'<br/>'+row.askUsername+'于'+row.createTime+'提出缺陷('+row.id+')：'+row.name
										+'<br/>缺陷描述：'+row.description;
					params.restUrl=config.getXmCtx()+"/xm/core/xmQuestion/processApprova";
					this.$router.push({ name: 'bizStartProc', query: {paramsId:this.$mdp.setCacheParams(params)} });

				}else {
					this.$notify.error("不支持的审批事项");
					return;
				}
				//this.$useXmStore.addVisitedViews( {path:'/mdp/workflow/re/procdef/ProcdefListForBizStart',query:{params:jsonParmas}})
			},
			clearProject(){
				this.project=null
			},
			handleCommand(command) {
				if(command.type=='sendToProcessApprova'){
					this.sendToProcessApprova(command.data,command.bizKey);
				}
			},
			getBadge(row){
				var msg="";
				if(row.bugStatus=='closed'){
					return ""
				}
				if(row.handlerUsername){
					if(row.remarks){
						var remarks=row.remarks;
						remarks=remarks.replace(/<\w?>/g,"");
						remarks=remarks.replace(/<\/\w?>/g,"");
						if(remarks.length<=10){
							msg='已指派给'+row.handlerUsername+','+remarks
						}else{
							msg='已指派给'+row.handlerUsername+','+remarks.substr(0,10)+"..."
						}

					}else{
						msg='已指派给'+row.handlerUsername;
					}
				}else{
					msg=row.createUsername+'创建的缺陷'
				}
				return msg;
			}, 
			editSomeFieldsCheck(row,fieldName,$event,params){ 
				
				if(fieldName==='handlerUserid'){
					if($event){
						params[fieldName]=$event.userid;
						params.handlerUsername=$event.username
					}else{
						return;
					}
				}else if(fieldName==='tagIds'){
					if($event){
						params[fieldName]=$event.map(i=>i.tagId).join(",");
						params.tagNames=$event.map(i=>i.tagName).join(",");
					}else{
						return;
					}
				}else if(fieldName==='workload'){
					params={...params,...$event}
				}else if(fieldName==='projectId'){
					params.projectId=$event.id
				}else if(fieldName==='productId'){
					params.productId=$event.id
				}else if(fieldName==='menuId'){
					params.productId=$event.productId
					params.menuId=$event.menuId
					params.menuName=$event.menuName
				}else{
					params[fieldName]=$event
				} 
				return true;
			},  
			showMenuVisible(){
				if(this.sels.length<=0){
					this.$message.error("请至少选中一个缺陷")
				}else{
					this.menuVisible=true
				}
			},
			onSelectedMenu(menu){
				this.editSomeFields(this.sels[0],'menuId',menu)
				this.menuVisible=false
			}, 
			copy3(row){ 
				this.copy2({...row,remarks:''})
			}
 
		},//end methods
		components: { 
				XmQuestionEdit:defineAsyncComponent(()=>import('./XmQuestionEdit.vue')),  
		},
		mounted() {
			if(this.selProject){
				this.project={...this.selProject}
				this.filters.projectId=this.selProject.id
			}
			if(this.xmProduct){
				this.product={...this.xmProduct}
				this.productId=this.xmProduct.id
			}
			if(this.queryScene=='my'){
				this.filters.handlerUserid=this.userInfo.userid;
			}
		}
	}

</script> 
