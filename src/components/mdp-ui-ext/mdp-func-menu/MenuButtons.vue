<template>
		<el-row>
			超级管理员/平台管理员/系统管理员可以查询及维护所有菜单，其它人员只能查询修改本角色拥有的菜单
		</el-row>
		<el-row> 
 				<!--列表 MenuDef 前端功能菜单表-->
				<el-table v-adaptive :max-height="tableHeight" :data="menuDefs"  highlight-current-row v-loading="load.list" border @selection-change="selsChange" @row-click="rowClick" style="width: 100%;">
					<el-table-column sortable type="selection" width="40"/>
					<el-table-column sortable type="index" width="40"/>
					<el-table-column sortable prop="id" label="按钮编号" min-width="80" >
						<template #default="scope"><mdp-input v-model="scope.row.id" placeholder="按钮编号" /></template>
					</el-table-column>   
					<el-table-column sortable prop="mname" label="按钮名称" min-width="80">
						<template #default="scope"><mdp-input v-model="scope.row.mname" placeholder="按钮名称" /></template>
					</el-table-column> 
					 
					<el-table-column sortable prop="qxType" label="权限类型" min-width="80">
						<template #default="scope"><mdp-select @click="rowClick(scope.row)" item-code="qxType" v-model="scope.row.qxType" placeholder="权限类型" /></template>
					</el-table-column> 
					<el-table-column sortable label="操作" width="200" fixed="right">
						<template #default="scope"> 
							<el-button size="text" type="danger" @click="handleDel(scope.row,scope.$index)">删除</el-button>
						</template>
					</el-table-column>
				</el-table>
					<div class="add-item" @click="addOneButton" style="margin-top:15px;margin-bottom: 150px;" >
						+ 添加
					</div>
  
		</el-row>
		
		<el-row class="footer">
			<el-button type="primary" v-loading="load.edit" @click="batchSave" :disabled="this.sels.length===0 || load.edit==true">批量保存</el-button> 
			<el-button type="primary" v-loading="load.edit" @click="batchImport">模板导入</el-button>
			<el-button type="danger" v-loading="load.del" @click="batchDel" :disabled="this.sels.length===0">删除按钮</el-button>  
		</el-row>
</template>

<script>
	import util from '@/components/mdp-ui/js/util';//全局公共库 
	import { listMenuDef, delMenuDef, batchDelMenuDef,batchSaveMenuButton } from '@/api/mdp_pub/menuDef';  
	import { mapState } from 'pinia'
import { useUserStore } from '@/store/modules/user' 
	
	export default {
		props:['pmenu','visible'],
	    computed: {
		    ...mapState(useUserStore,[
		      'userInfo'
		    ])
		},
		watch:{
			'visible':function(visible){
				if(visible==true){
					this.searchMenuDefs();
				}
			}
		},
		data() {
			return {
				filters: {
					key: '',
					menuid:''
				},
				menuDefs: [],//查询结果
				pageInfo:{//分页数据
					total:0,//服务器端收到0时，会自动计算总记录数，如果上传>0的不自动计算。
					pageSize:10,//每页数据
					pageNum:1,//当前页码、从1开始计算
					orderFields:[],//排序列 如 ['sex','student_id']，必须为数据库字段
					orderDirs:[]//升序 asc,降序desc 如 性别 升序、学生编号降序 ['asc','desc']
				},
				load:{ list: false, edit: false, del: false, add: false },//查询中...
				sels: [],//列表选中数据
				dicts:{},//下拉选择框的所有静态数据 params=[{moduleIdId:'0001',itemCode:'sex'}] 返回结果 {'sex':[{optionValue:'1',optionName:'男',seqOrder:'1',fp:'',isDefault:'0'},{optionValue:'2',optionName:'女',seqOrder:'2',fp:'',isDefault:'0'}]} 
				
				addFormVisible: false,//新增menuDef界面是否显示
				//新增menuDef界面初始化数据
				addForm: {
					id:'',pid:'',accUrl:'',msort:'',moduleId:'',icon:'',mname:'',rpath:'',rid:'',isShow:'1'
				},
				
				editFormVisible: false,//编辑界面是否显示
				//编辑menuDef界面初始化数据
				editForm: {
					id:'',pid:'',accUrl:'',msort:'',moduleId:'',icon:'',mname:'',rpath:'',rid:'',isShow:'1'
				}, 
				btnTemplates:[
					{
						id:'addBtn',pid:'',mname:'新增',remark:'新增',qxType:'c',
					},
					{
						id:'searchBtn',pid:'',mname:'查询',remark:'查询',qxType:'r',
					},
					{
						id:'editBtn',pid:'',mname:'修改',remark:'修改',qxType:'u',
					},
					{
						id:'delBtn',pid:'',mname:'删除',remark:'删除',qxType:'d',
					},
					{
						id:'batchDelBtn',pid:'',mname:'批量删除',remark:'批量删除',qxType:'d',
					},
					{
						id:'exportBtn',pid:'',mname:'导出',remark:'导出',qxType:'r',
					},
					{
						id:'importBtn',pid:'',mname:'导入',remark:'导入',qxType:'c',
					},
					{
						id:'detailBtn',pid:'',mname:'明细',remark:'明细',qxType:'r',
					},
					{
						id:'printBtn',pid:'',mname:'打印',remark:'打印',qxType:'r',
					},
					{
						id:'approveBtn',pid:'',mname:'审核/批准/同意',remark:'审核/批准/同意',qxType:'u',
					},
					{
						id:'rejectBtn',pid:'',mname:'拒绝',remark:'拒绝',qxType:'u',
					},
				],
				tableHeight:500,
				/**end 自定义属性请在上面加 请加备注**/
			}
		},//end data
		methods: { 
			handleSizeChange(pageSize) { 
				this.pageInfo.pageSize=pageSize;
				this.pageInfo.count=true;
				
				this.getMenuDefs();
			},
			handleCurrentChange(pageNum) {
				this.pageInfo.pageNum = pageNum;
				this.getMenuDefs();
			},
			// 表格排序 obj.order=ascending/descending,需转化为 asc/desc ; obj.prop=表格中的排序字段,字段驼峰命名
			sortChange( obj ){
				var dir='asc';
				if(obj.order=='ascending'){
					dir='asc'
				}else{
					dir='desc';
				}
				if(obj.prop=='xxx'){
					this.pageInfo.orderFields=['xxx'];
					this.pageInfo.orderDirs=[dir];
				}
				this.getMenuDefs();
			},
			searchMenuDefs(){
				 
				 this.pageInfo.count=true;
				 this.getMenuDefs();
			},
			//获取列表 MenuDef 前端功能菜单表
			getMenuDefs() {
				let params = {
					pageSize: this.pageInfo.pageSize,
					pageNum: this.pageInfo.pageNum,
					total: this.pageInfo.total,count:this.pageInfo.count
				};
				if(this.pageInfo.orderFields!=null && this.pageInfo.orderFields.length>0){
					let orderBys=[];
					for(var i=0;i<this.pageInfo.orderFields.length;i++){ 
						orderBys.push(this.pageInfo.orderFields[i]+" "+this.pageInfo.orderDirs[i])
					}  
					params.orderBy= orderBys.join(",")
				}
				if(this.filters.key!==""){
					//params.key="%"+this.filters.key+"%"
				}else{
					//params.xxx=xxxxx
				}
				if(this.pmenu==null||this.pmenu.id==''||this.pmenu.id==null){
					this.$message.info("请选择菜单");
					return;
				}
				params.menuType='2'
				params.pid=this.pmenu.id;
				this.load.list = true;
				listMenuDef(params).then((res) => {
					var tips=res.tips;
					if(tips.isOk){ 
						this.pageInfo.total = res.total;this.pageInfo.count=false;
						this.menuDefs = res.data;
					}else{
						this.$message({ message: tips.msg, type: 'error' });
					} 
					this.load.list = false;
				}).catch(() => {
					this.load.list = false;
					//this.$message({ message: '通讯错误', type: 'error' });
				});
			},
 
			addOneButton(){
				this.menuDefs.push(Object.assign({isNew:true},this.addForm))
			},
			 
			afterAddSubmit(){
				this.addFormVisible=false;
				this.pageInfo.count=true;
				this.refresh=!this.refresh
				this.getMenuDefs();
			},
			afterEditSubmit(){
				this.editFormVisible=false;
			},
			//选择行menuDef
			selsChange: function (sels) {
				this.sels = sels;
			}, 
			//删除menuDef
			handleDel: function (row,index) { 
				if(row.isNew==true){
					this.menuDefs.splice(index,1)
					return;
				}
				this.$confirm('确认删除该记录吗?', '提示', {
					type: 'warning'
				}).then(() => { 
					this.load.del=true;
					let params = row;
					delMenuDef(params).then((res) => {
						this.load.del=false;
						var tips=res.tips;
						if(tips.isOk){ 
							this.pageInfo.count=true;
							this.getMenuDefs();
						}
						this.$message({ message: tips.msg, type: tips.isOk?'success':'error' }); 
					});
				}).catch(() =>this.load.del=false);
			},
			//批量删除menuDef
			batchDel: function () {
				
				this.$confirm('确认删除选中记录吗？', '提示', {
					type: 'warning'
				}).then(() => { 
					this.load.del=true;
					batchDelMenuDef(this.sels).then((res) => {
						this.load.del=false;
						var tips=res.tips;
						if( tips.isOk ){ 
							this.pageInfo.count=true;
							this.getMenuDefs(); 
						}
						this.$message({ message: tips.msg, type: tips.isOk?'success':'error'});
					});
				}).catch(() => this.load.del=false );
			},
			//批量删除menuDef
			batchSave: function () {
				
				this.$confirm('确认保存选中的'+this.sels.length+'条记录吗？', '提示', {
					type: 'warning'
				}).then(() => { 
					this.sels.forEach(i=>{
						i.pid=this.pmenu.id
						i.moduleId=this.pmenu.moduleId
						i.mcate=this.pmenu.mcate
					})
					this.load.edit=true;
					batchSaveMenuButton(this.sels).then((res) => {
						this.load.edit=false;
						var tips=res.tips;
						if( tips.isOk ){ 
							this.pageInfo.count=true;
							this.getMenuDefs(); 
						}
						this.$message({ message: tips.msg, type: tips.isOk?'success':'error'});
					});
				}).catch(() => this.load.edit=false );
			},
			rowClick: function(row, event, column){
				this.$emit('row-click',row, event, column);//  @row-click="rowClick"
			},
			batchImport(){
				this.btnTemplates.forEach(btnT=>{
					let btn=Object.assign({},this.addForm) 
					btn.mname=btnT.mname
					btn.id=this.pmenu.id+"_"+btnT.id
					btn.pid=this.pmenu.id
					btn.remark=btnT.remark
					btn.isNew=true
					btn.mcate=this.pmenu.mcate
					this.menuDefs.push(btn)
				})
			}
			
		},//end methods
		components: { 
		   
		},
		mounted() {    
			this.$nextTick(() => {
				this.tableHeight = window.innerHeight - 250;   
			}); 
			this.$nextTick(() => {
				this.getMenuDefs(); 
        	}); 
		}
	}

</script>

<style scoped>
.add-item{
		width:100%;
		border:1px dashed #e9efff;
		margin:0 auto;
		margin-bottom:5px; 
		text-align:center;
		padding:5px;
	}
	.add-tems:hover{
		cursor:pointer;
		color:#3388ff;
		border:1px dashed #3388ff;
	} 
</style>