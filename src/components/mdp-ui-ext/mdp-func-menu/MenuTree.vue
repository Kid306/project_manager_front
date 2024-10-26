<template> 
	<el-card>
		<template #header>  
			<el-input v-model="nodeFilterText" placeholder="过滤" >	
				<template #append>
					<el-tooltip content="一级目录为模块，不属于菜单">
								<Icon icon="ep:warning"/> 
					</el-tooltip> 
				</template>		
			</el-input>
		</template>
		<el-tree  
			class="filter-tree"
			:data="treeData"
			:props="defaultTreeProps"
			:filter-node-method="filterNode"
			:show-checkbox="showCheckbox"
			:default-expand-all="defaultExpandAll"
			:expand-on-click-node="expandOnClickNode"
			:indent="indent"
			:node-key="nodeKey_"
			:default-expanded-keys="defaultExpandedKeys"
				:default-checked-keys="defaultCheckedKeys"
				auto-expand-parent
			@check-change="handleCheckChange"
			@current-change="handleCurrentChange"
			@node-click="handleNodeClick" 
			:render-content="renderContent"
			:check-strictly="checkStrictly"
			ref="nodeTree"/>  
	</el-card> 
</template>

<script>  
	import treeTool from '@/components/mdp-ui/js/treeTool'; 
	import { mapState } from 'pinia'
import { useUserStore } from '@/store/modules/user'   
	export default {

	    computed: {
		    ...mapState(useUserStore,[
		      'userInfo'
		    ])
		},
		watch: {
	      nodeFilterText(val) {
	        this.$refs.nodeTree.filter(val);
	      },
	      checkedKeys(val){
	      	 this.$refs.nodeTree.setCheckedKeys(val);
	      },
	      refresh(val){ 
	      	this.getTreeData(val);
	      },
	      currentKey(val){ 
	    	  this.$refs.nodeTree.setCheckedKeys([val]);
		  },
		  value(val){
		  	this.nodeid=val;
		  },
		  nodeid(val){
		  	this.$emit('input',val);
		  }
	    },
	    computed:{
	    	defaultExpandedKeys(){
	    		return this.defaultCheckedKeys;
	    	},
	    	defaultCheckedKeys(){
	    		if(this.value){
	    			return [this.value];
	    		}
	    		return this.checkedKeys;
	    	},
	    	nodeKey_(){
	    		return this.nodeKey?this.nodeKey:'id'
	    	},
			treeData(){
				var treeData= treeTool.translateDataToTree(this.menuDefs,'pid','id'); 
				var modules=JSON.parse(JSON.stringify(this.menuModules))
				var defModule={id:'un-set-module',pid:'Mo',mname:'未分配模块',children:[],moduleId:'un-set-module',isModule:true}
				modules.forEach(i=>{
					i.moduleId=i.id
					i.isModule=true
				})
				treeData.forEach(m=>{ 
					var module=modules.find(mo=>m.moduleId==mo.id)
					if(!module){
						defModule.children.push(m)
					}else{
						module.children.push(m)
					}

				})
				if(defModule.children.length>0){
					modules.push(defModule)
				}
				return modules;
			}
	    },
	    props: ['checkStrictly','disabledRule','value','visible','nodeKey','showCount','countTips','showFilter','rootKey','multiple','checkedKeys','refresh','defaultExpandAll','expandOnClickNode','showCheckbox','indent'],
		data() {
			return { 
				nodeFilterText: '',
				menuDefs:[], 
				defaultTreeProps:{
					
					id:this.nodeKey?this.nodeKey:'id',
					label:'mname',
					children: 'children',
					disabled: 'disabled'
				},  
				listLoading: false,
				nodeid:'',
				menuModules:[],
			}
		},
		methods: { 
			handleCheckChange(data, checked, indeterminate) {
				let checkedKeys=this.$refs.nodeTree.getCheckedKeys(); 
				console.log(this.multiple);
				if( this.multiple===undefined || this.multiple===false||this.multiple==='false'){
					if(checked==true){
						if(checkedKeys.length>1){ 
							this.$refs.nodeTree.setCheckedKeys([data[this.nodeKey_]]);
							this.$emit('check-change',data,checked,indeterminate);
							this.nodeid=data[this.nodeKey_];
						}else{
							this.$emit('check-change',data,checked,indeterminate);
							this.nodeid=data[this.nodeKey_];
						}
					}else{
						if(checkedKeys.length==0){
							this.nodeid='';
							this.$emit('check-change',data,checked,indeterminate);
						} 
					}
				}else{
					this.$emit('check-change',data,checked,indeterminate);
				} 
		    },
			handleCurrentChange(data, node) {
		    	this.$emit('current-change',data, node); 
		    },
		    handleNodeClick(data, node, comp) { 
				this.$emit('node-click',data, node, comp); 
		    },
		     
			//获取分类树列表
			getTreeData(refresh) {

				let id='';
				if(this.rootKey!='' && this.rootKey!=null){
					id=this.rootKey;
				}
				let params = { 
					id: id
				};
 				if(refresh){
 					params.refresh=true;
 				}
				this.listLoading = true;
				this.$mdp.listMenuTree(params).then((res) => {
					var tips=res.tips;
					if(tips.isOk==true){  
						this.menuDefs=res.data
						if(this.disabledRule){
							this.menuDefs.forEach(m=>this.disabledRule(m))
						}
						
					}else{
						this.$message({ message: tips.msg, type: 'error'});
					} 
					this.listLoading = false;
				}).catch(() => {
					this.listLoading = false;
				});
			}, 
			filterNode(value, data) {
		        if (!value) return true;
						if(data.name){
							return data.name.indexOf(value) !== -1;
						}else if(data.mname) {
							return data.mname.indexOf(value) !== -1;
						}else{
							return false;
						}
		        
		     },
		     renderContent(h, { node, data, store }) {
		    	 var countMsg='';	
		    	 if(this.countTips){
	    	 			countMsg=this.countTips;
	    	 		}
		    	 	if(this.showCount==true || this.showCount=='true'){
		    	 		let msg="";
		    	 		if(data.menuType=='2'){
		    	 			msg='-按钮';
		    	 			return h('span',{},[node.label,h('font',{style:{color:'red'}}, msg)]) ;
		    	 		}else{
		    	 			msg="("+ data.count +countMsg+")"; 
		    	 			return h('span',{},[node.label,h('font',{style:{color:'blue'}},msg )]) ;
		    	 		} 
		    	 	}else{
		    	 		let msg="";
		    	 		if(data.menuType=='2'){ 
		    	 			msg='-按钮';
		    	 			return h('span',{},[node.label,h('font',{style:{color:'red'}}, msg)]) ;
		    	 		}else{
		    	 			msg="("+(data.children==null?0:data.children.length)+countMsg+")"
		    	 			return h('span',{},[node.label,h('font',{style:{color:'blue'}},msg )]) ;
		    	 		}
		    	 		
		    	 	}
			        
			  }
		},
		mounted() { 
			
			this.$mdp.listMenuModule({}).then(res=>{
				var menuModules=res.data
				this.menuModules=menuModules.map(k=>{
					k.pid='M0'
					k.mname=k.name
					k.children=[]
					return k;
				})
			});
			this.nodeid=this.value;
			this.getTreeData(); 
		}
	}

</script>

<style scoped>

</style>