<template>
	<ContentWrap :hiderFooter="false">
		<template #header>
			

			 <el-space>
				导入方式
			<el-tooltip content="注意：1.请确保路由配置文件中，每个路由的.name属性具有唯一性，并且以英文编码为准，不要翻译成中文。.name属性类似主键一般，具有重要作用;<br />
				2.路由与后台菜单表的映射关系为:name--> rid , path --> rpath , fullPath --> accUrl , meta.title --> mname ;<br />
				3.菜单id由模块id+accUrl进行短码hash而得。因此，路由没发生变化的话，菜单id也不会发生变化；因此，您可以根据需要不断重新导路由到菜单表。">
				<Icon icon="ep:warning" />  
			</el-tooltip>
				<el-radio v-model="importType" label="0">当前系统菜单</el-radio>
				<el-radio v-model="importType" label="1">json字符串</el-radio>
		</el-space>
		</template>
		<div  v-if="importType=='1'">
		<div>
			JSON字符串 
		</div>
		<el-input
			type="textarea"
			:rows="10"
			placeholder="请从路由配置文件拷贝路由数组黏贴尽来，只拷贝路由数组，其它的导入文件之类无须拷贝"
			v-model="jsonRoutersText"/>
		</div>
		<el-row :gutter="50" >
		<el-col :span="12"  class="border">
			<!--新增界面 MenuDef 前端功能菜单表--> 
			<div class="padding-bottom padding-top">请选择需要导入的菜单</div>
 
 			<el-tree class="border" v-if="importType==0"    :node-key="id" :data="routersTreeData" :default-expanded-keys="defaultExpandedKeys" :props="routerProps" show-checkbox ref="permissionRoutersTree"/>
 
 			<el-tree class="border" v-else-if=" jsonRouters && jsonRouters.length>0 "  :node-key="id"  :default-expanded-keys="defaultExpandedKeys" ref="permissionRoutersTree" show-checkbox :data="routersTreeData" :props="routerProps" />
 
		</el-col>
		
		<el-col :span="12"  class="border"> 
			<div class="padding-bottom padding-top">请选择目标模块</div>
			<menu-tree class="border padding" :disabledRule="disabledRule" v-loading="load.list" :checkStrictly="true"  :refresh="refresh" :expand-on-click-node="false" showCheckbox  @check-change="menuTreeCheckChange" ref="pmenuTree"/> 
		</el-col>
	</el-row>
	<template #footer>

	</template>
	</ContentWrap> 
	
	<el-row class="footer">
		<el-button @click="handleCancel">取消</el-button>  
		<el-button v-loading="load.add" type="warning" @click="detect" >检测路由配置是否合格</el-button>   
		<el-button v-if="importType=='1'" v-loading="load.add" type="primary" @click="preview" >预览</el-button>   
		<el-button v-loading="load.add" type="primary" @click="batchImportMenus" >提交</el-button>    
	</el-row>
</template>

<script>
	import util from '@/components/mdp-ui/js/util';//全局公共库
	import {sn} from '@/components/mdp-ui/js/sequence.js';//全局公共库
	//import { listOption } from '@/api/mdp/meta/itemOption';//下拉框数据查询
	import {  addMenuDef, batchInsertMenuDef } from '@/api/mdp_pub/menuDef';
	import { listMenuModule } from '@/api/mdp_pub/menuDef'; 
	import MenuTree from './MenuTree.vue'
	import { mapState } from 'pinia'
import { useUserStore } from '@/store/modules/user'    
import { usePermissionStore } from '@/store/modules/permission'
const permissionStore = usePermissionStore()  
import { useI18n } from 'vue-i18n';
import treeTool from '@/components/mdp-ui/js/treeTool';

export default { 
	setup(){
		const {t} = useI18n()
		return {t}
	},
	    computed: {

	    	'routersTreeData': function(){ 
	    		var routers=this.importType=='0'?permissionStore.getRouters:this.jsonRouters

	    		routers.forEach((i,index)=>{  
						i.accUrl=i.path
						i.lvl='0'
	    			i.rpath=i.path
						i.icon=i.meta?i.meta.icon:''
						i.rid=i.name  
						i.id=this.$mdp.shortCode(i.accUrl)
	    			i.mname=i.meta&&i.meta.title?  this.t(i.meta.title):i.name; 
	    			i.isShow=i.meta?.hidden==true?'0':'1' 
						if(index<10){
							i.msort="0"+index
						}else{
							i.msort=index
						} 
	    			this.routersTreeDataFill(i.children,i)
	    		})
				
	    		return routers;
	    	},
		    ...mapState(useUserStore,[
		      'userInfo'
		    ])
		},
		props:['menuDef','visible','pmenu'],
		watch: {
	      'menuDef':function( menuDef ) {
	        this.addForm = menuDef;
	      },
	      'visible':function(visible) { 
	      	if(visible==true){
	      		//从新打开页面时某些数据需要重新加载，可以在这里添加
	      	}
	      } 
	    },
		data() {
			return {
				dicts:{},//下拉选择框的所有静态数据  params=[{moduleIdId:'0001',itemCode:'sex'}] 返回结果 {'sex':[{optionValue:'1',optionName:'男',seqOrder:'1',fp:'',isDefault:'0'},{optionValue:'2',optionName:'女',seqOrder:'2',fp:'',isDefault:'0'}]} 
				load:{ list: false, edit: false, del: false, add: false },//查询中...
				addFormRules: {
					id: [
						//{ required: true, message: '菜单编号不能为空', trigger: 'blur' }
					]
				},
				//新增界面数据 前端功能菜单表
				addForm: {
					id:'',pid:'',accUrl:'',msort:'',moduleId:'',icon:'',mname:'',rpath:'',rid:'',isShow:'1',menuType:'1' ,supVers:'0'
				},
				/**begin 在下面加自定义属性,记得补上面的一个逗号**/
				menuModules:[],//归属模块{id:'',cname:''}
				routerProps:{
					 children: 'children',
						label: 'mname',
						id:'name',  
				},
				importType:'0',
				jsonRouters:[],
				jsonRoutersText:'',
				refresh:false,//
				onlyLeaf:'0',
				defaultExpandedKeys:[]
				/**end 在上面加自定义属性**/
			}//end return
		},//end data
		methods: {   
			disabledRule:function(menu){
				menu.disabled=true
			},
			// 取消按钮点击 父组件监听@cancel="addFormVisible=false" 监听
			handleCancel:function(){ 
				this.$emit('cancel');
				this.$emit('close');
			},
			preview:function(){
				this.jsonRouters=[]
				try{
					this.jsonRoutersText=this.jsonRoutersText.replace(/component:([^,\}]*)/g,"component:''"); 
					this.jsonRoutersText=this.jsonRoutersText.replace(/t\((.*)\)/g,'$1');
					this.jsonRouters=eval('(' + this.jsonRoutersText + ')');
				}catch (err){ 
					console.error(err)
								this.$message.error("解析json串失败"+err);
								return; 
						}
			},
			batchImportMenus(){ 
				let routers=this.jsonRouters;
				if(this.importType=='1'){
					try{
						this.jsonRoutersText=this.jsonRoutersText.replace(/component[ ]*\:[_/'"() \w]*,{1}/g,"");
					}catch (err){ 
							this.$message.error("解析json串失败");
							return; 
					}
				}  
				routers=this.$refs.permissionRoutersTree.getCheckedNodes(false,this.onlyLeaf=='1'?false:true)
				
				let checkedNodes=this.$refs.pmenuTree.$refs.nodeTree.getCheckedNodes(false,false);
				
				
				if(checkedNodes==null || checkedNodes.length!=1 ){
					this.$message.error("请先选择需要导入到的目标模块");
					return;
				}
				var module=checkedNodes[0]
				let menus=[]; 
				if(routers.length<=0){
					this.$message.error("没有需要导入的菜单");
					return;
				}  
				
				var routersInit=JSON.parse(JSON.stringify(routers))
				var idMap=new Map();
				routersInit.forEach(i=>{
					idMap.set(i.id,this.$mdp.shortCode(module.id+i.accUrl)) 
				})
				routersInit.forEach(i=>{ 
					i.moduleId=module.id
					i.mcate=module.mcate
					i.menuType="1"
					i.pid=idMap.get(i.pid)||'M0'
					i.id=idMap.get(i.id)
					i.supVers="0"
					i.aroles=this.isAroles(i)
					
					delete i.children
					menus.push(i)
				}); 
				this.load.add=true;
				batchInsertMenuDef(menus).then(res=>{
					if(res.tips.isOk==true){
						this.$message.success("导入成功");
						this.refresh=!this.refresh;
					}else{
						this.$message.error(res.tips.msg);
					}
					this.load.add=false
				}).catch(res=>this.load.add=false);
			},
			jsonRoutersToMenuDef(menus,pmenu,route){ 
				if(route && route.children && route.children.length>0){
					let children=route.children;
					children.forEach(i=>{
						let mname=i.name&&i.name!=''&&i.name!=null?i.name:'未知名字'
						let menu={id:sn(),mname:mname,rid:mname,rpath:i.path?i.path:'',pid:pmenu.id,isShow:'1'};
						menus.push(menu);
						this.jsonRoutersToMenuDef(menus,menu,i);
					});
				}
				
			},
			isAroles(r){
				if(r.meta){
					if(r.meta.menu==true || (r.meta.roles&&r.meta.roles.length>0)){
						return "0"
					}else{
						return "1"
					}
				}else{
					return "1"
				}
			},
			//新增提交MenuDef 前端功能菜单表 父组件监听@submit="afterAddSubmit"
			addSubmit: function () {
				
				this.$refs.addForm.validate((valid) => {
					if (valid) {
						
						this.$confirm('确认提交吗？', '提示', {}).then(() => { 
							this.load.add=true
							let params = Object.assign({}, this.addForm); 
							params.pid=this.pmenu.id;
							addMenuDef(params).then((res) => {
								this.load.add=false
								var tips=res.tips;
								if(tips.isOk){
									this.$refs['addForm'].resetFields();
									this.$emit('submit');//  @submit="afterAddSubmit"
								}
								this.$message({ message: tips.msg, type: tips.isOk?'success':'error' }); 
							}).catch(() => this.load.add=false);
						});
					}
				});
			},
			/**begin 在下面加自定义方法,记得补上面的一个逗号**/
			menuTreeCheckChange: function(data,checked,leafChecked){ 
				if(checked){
					this.addForm.moduleId=data.moduleId;
					this.addForm.mcate=data.mcate
				}else{
					this.addForm.moduleId='';
					this.addForm.mcate=''
				}
			},
			routersTreeDataFill: function(routers,prouter){ 
	    		if(prouter==null){
	    			return;
	    		}
	    		if(routers==null){
	    			return;
	    		}
	    		routers.forEach((i,index)=>{  
						i.lvl=(parseInt(prouter.lvl)+1)+''
						i.accUrl=prouter.accUrl+"/"+i.path
	    			i.rpath= i.path
	    			i.pid=prouter.id  
						i.icon=i.meta?i.meta.icon:''
						i.id=this.$mdp.shortCode(i.accUrl)
	    			i.mname=i.meta&&i.meta.title? this.t(i.meta.title) : i.name ;
	    			i.isShow=i.meta?.hidden==true?'0':'1'
	    			i.menuType="1";
					if(index<10){
						i.msort=prouter.msort+".0"+index
					}else{
						i.msort=prouter.msort+"."+index
					}
					
	    			if(i.children && i.children.length>0){
	    				this.routersTreeDataFill(i.children,i)
	    			}
	    		})
	    	}, 
				detect(){
					let nameSet=new Set()
					let congfuRoutes=[]
					let callback=(currNode)=>{
						if(nameSet.has(currNode.name)){
							congfuRoutes.push(currNode)
						}else{
							nameSet.add(currNode.name)
						}
					}
					treeTool.treeCfg(this.routersTreeData,callback)
					
					if(congfuRoutes.length>0){
						this.$messageBox.alert("以下菜单名字重复【"+congfuRoutes.map(k=>"{name:"+k.name+", meta.title:"+k.mname+"}").join(",")+"】，请确保路由配置中name以英文编写，并确保全局唯一。",'warning',
							{
								confirmButtonText: 'OK', 
								type: 'warning',
							}
						)
						return;
					}

				}
			/**end 在上面加自定义方法**/
			
		},//end method
		components: {  
		    //在下面添加其它组件 'menu-def-edit':MenuDefEdit
			MenuTree
		},
		mounted() {
			
			
			this.addForm=Object.assign(this.addForm, this.menuDef);  
			//this.addForm.pid=this.pmenu.id
			listMenuModule({}).then(res=>this.menuModules=res.data);
			/**在下面写其它函数***/
			
		}//end mounted
	}

</script>

<style scoped>

</style>