<template> 
		<ContentWrap> 
			<template #header>
				
				<el-space wrap>
				<slot name="header">
					<slot name="topToolbar">

					</slot>
					<el-input v-if="!hiddenCpd.filter"  v-model="filterText" placeholder="名称" auto-complete="off" clearable/>
					
          <el-popover  placement="top-start" :title="title" width="300" trigger="hover" :show-after="200">
            <el-space wrap>  
								<el-button type="primary" v-if="!hiddenCpd.addTop" @click="addTopNode_()" icon="plus" plain>{{'新建顶级【'+title+'】'}}</el-button> 

                <el-button type="success" v-if="!hiddenCpd.importTop" @click="showImportTop()" icon="upload"  plain>{{'批量导入'}}</el-button>  
								<mdp-export excel word @excel="toExcel" @word="toWord"/>
								<el-button v-if="!hiddenCpd.batchDel" type="danger" @click="batchDel_()" icon="delete" :title="'批量删除'" plain/>
								<el-text type="warning">在树节点中【右键】可以【增删改查】,节点支持【拖拽】</el-text>

            </el-space>
            <template #reference>
              <el-button  type="primary" icon="more-filled" :title="'【'+title+'】的更多操作'" plain/>
            </template>
          </el-popover> 
				</slot> 
				
				<el-button v-if="!hiddenCpd.changePid && idLinks.size>0" type="warning" @click="changePid_()" icon="top" :title="'拖拽后必须保存才能正式生效'"  plain>拖拽后保存</el-button>
								<el-button v-if="!hiddenCpd.changePid && idLinks.size>0" @click="cancelChangePid()" icon="close" :title="'取消保存'"  plain>取消</el-button>
				<el-button v-if="showConfirm" type="warning" @click="confirm" icon="check" title="确认选择" /> 
			</el-space>  

			</template>
			<template #default>
				<el-tree v-adaptive v-if="treeVisible" v-loading="loading.addlist" :props="propsCpd" :filter-node-method="filterNode"
			:show-checkbox="showCheckbox" :expand-on-click-node="expandOnClickNode" :indent="indent" :node-key="propsCpd.id"
			:default-expanded-keys="defaultExpandedKeys" :default-checked-keys="defaultCheckedKeys" auto-expand-parent
			highlight-current @check-change="handleCheckChange" @current-change="handleCurrentChange" accordion
			@node-click="handleNodeClick" :check-on-click-node="true" check-strictly lazy :load="loadNode" ref="nodeTree"
			@contextmenu.prevent
			:draggable="draggable"
			@node-drag-start="handleDragStart"
			@node-drag-enter="handleDragEnter"
			@node-drag-leave="handleDragLeave"
			@node-drag-over="handleDragOver"
			@node-drag-end="handleDragEnd"
			@node-drop="handleDrop"
			:allowDrop="myAllowDrop"
			>

			<template #default="{ node, data }">
				<div @contextmenu.prevent title="右键可以增删改">
					<el-popover :open-delay="1000" placement="top-start" trigger="contextmenu" width="400">
						<slot name="nodebox" :node="node" :data="data">
								<el-button icon="plus" circle type="success" v-if="!(!data[propsCpd['id']] || data[propsCpd['id']] == rootId) && !hiddenCpd.addSub"
								@click.prevent.stop="addSubNode_(data, node)" :title="'添加子' + title" />
								<el-button icon="upload" circle type="success" v-if="!(!data[propsCpd['id']] || data[propsCpd['id']] == rootId) && !hiddenCpd.addSub"
								@click.prevent.stop="showImportSub(data, node)" :title="'批量导入' + title" />
							<el-button icon="edit" circle type="warning" v-if="!(!data[propsCpd['id']] || data[propsCpd['id']] == rootId) && !hiddenCpd.edit"
								@click.prevent.stop="editNode_(data, node)" :title="'修改' + title" />
							<el-button icon="delete" circle type="danger" v-if="!(!data[propsCpd['id']] || data[propsCpd['id']] == rootId) && !hiddenCpd.del"
								@click.prevent.stop="deleteNode_(data, node)" :title="'删除该' + title" /> 
								<el-button icon="refresh" circle type="success" v-if="!hiddenCpd.refresh"
								@click.prevent.stop="refresh()" :title="'刷新整棵树,重新加载数据，一般在数据不一致时操作'" />
								<slot name="nodeToolbar" :data="data" :node="node">

								</slot>
						</slot>

						<template #reference>
							<div style="min-width:300px;"><slot name="nodeName" :node="node" :data="data"> {{ data[propsCpd['label']] }}  </slot></div>
						</template>
					</el-popover>
				</div>
			</template>
		</el-tree>
		<el-pagination v-if="!hiddenCpd.page" layout="total, sizes" :page-size="pageInfo.pageSize"  :total="pageInfo.total" />
 
			</template>
		</ContentWrap>
		
</template>
  
<script>
import { mapState } from 'pinia'
import { useUserStore } from '@/store/modules/user'  
import {saveAs} from 'file-saver' 
import { asBlob } from 'html-docx-js-typescript'
export default {
	
	emits:['addTopNode','importTop','importSub','editNode','addSubNode','changePid','confirm','nodeClick'],
	watch: {
		filterText(val) {
			this.$refs.nodeTree.filter(val);
		},
		checkedKeys(val) {
			this.$refs.nodeTree.setCheckedKeys(val);
		},
	},
	components: {
	},
	computed: {
		defaultExpandedKeys() {
			return this.expandRowKeys
		},
		defaultCheckedKeys() {
			return this.checkedKeys;
		},
		...mapState(useUserStore, [
			'userInfo'
		]),
		hiddenCpd(){
			var hidden ={ 
				refresh: false,
				batchDel: false,
				del:false,
				changePid: false,
				addTop: false,
				importTop: true,
				importSub: true,
				addSub: false,
				edit: false,
				filter: false,
				page: true,
				}
				hidden=Object.assign(hidden,this.hidden)
				return hidden
		},
		propsCpd(){
			var props={
					id: 'id',
					label: 'name',
					pid: 'pid',
					children: 'children',
					isLeaf: function (n) {
						return n.childNum <= 0
					}
				}
				props=Object.assign(props,this.props)
				return props
		}
	},
	props: {
		'allowDrop':{type: Function,default:null},
		'draggable':{type: Boolean,default: false},
		'showCount': { type: Boolean, default: false },
		'showFilter': { type: Boolean, default: false },
		'multiple': { type: Boolean, default: false },
		'checkedKeys': Array,
		'defaultExpandAll': { type: Boolean, default: false },
		'expandOnClickNode': { type: Boolean, default: false },
		showCheckbox: { type: Boolean, default: false },
		showConfirm: { type: Boolean, default: false },
		'indent': Number,
		load: { type: Function, default: null },
		/**
		 * 主要是针对查询接口如果做了缓存，如果不先清理缓存，刷新还是从缓存load数据
		 */
		clearCacheFun: {type: Function, default: null},
		rootId: { type: String, default: 'A0' },
		title: {
			type: String,
			default: ''
		},
		props: {
			type: Object,
			default: () => {
				return {
					id: 'id',
					label: 'name',
					pid: 'pid',
					children: 'children',
					isLeaf: function (n,node) {
						return n.childNum <= 0
					}
				}
			}
		},
		del:{
			type: Function,
			default:null
		},
		batchDel:{
			type: Function,
			default: null,
		},
		hidden:{
			type:Object,
			default:()=>{
				return {
					refresh:true,
					batchDel: true,
					del:false,
					changePid: false,
					addTop: false,
					addSub: false,
					importTop: true,
					importSub: true,
					edit: false,
					filter: false,
					page: true,
				}

			}
		}

	},
	data() {
		return {
			idLinks:new Map(),//存储新的上下级关系，key=id,value=pid
			oldIdLinks: new Map(), //存储原来的上下级关系，key=id,value=pid,只存一次，拖拽开始的时候就存入
			draging: false,//拖拽成功后变成true,保存后变成false
			filterText: '', 
			expandRowKeys: [],
			root: null,
			resolve: null,
			treeVisible: true,
			isAddTop: false,
			current: {},
			pageInfo:{
				total:0,
				pageSize: 500,
				pageNum: 1,
				count: true
			},
			loading:{add:false,edit:false,list:false,del:false}
		}
	},
	methods: { 
		handleDragStart(node,event){

			this.$emit("node-drag-start",node,event)
		},
		
		handleDragEnter(draggingNode,dropNode,event){ 
			this.$emit("node-drag-enter",draggingNode,dropNode,event)
		},
		
		handleDragLeave(draggingNode,dropNode,event){

			this.$emit("node-drag-leave",draggingNode,dropNode,event)
		},
		
		handleDragOver(draggingNode,dropNode,event){

			this.$emit("node-drag-over",draggingNode,dropNode,event)

		},
		
		handleDragEnd(draggingNode,dropNode,dropType,event){

			this.$emit("node-drag-end",draggingNode,dropNode,dropType,event)
		},
		
		myAllowDrop(draggingNode,dropNode,dropType){
			 return this.allowDrop?this.allowDrop(draggingNode,dropNode,dropType):true
		},
		handleDrop(draggingNode,dropNode,dropType,event){ 
			
			this.draging=true
			let idKey=this.propsCpd['id']
			let pidKey=this.propsCpd['pid']
			let sdata=draggingNode.data
			var pnode=dropNode
			if(dropType!='inner'){
				pnode=dropNode.parent
			}
			let edata=pnode.data
			let oldPid=sdata[pidKey]
			let newPid=edata[idKey]  
			if(pnode.level==0){
				newPid=this.rootId
			}
			
				if(newPid==oldPid){
					this.idLinks.delete(sdata[idKey])
				}else{
					this.idLinks.set(sdata[idKey],newPid)
				}   
				if(dropType=="inner" && !pnode.expanded ){
					var callback=null;
					if(pnode.shouldLoadData()){
						callback=()=>{
						 //加载数据后需要手动添加一个节点，bug
						 pnode.insertChild({data:sdata}) 
						}
					} 
					pnode.expand(callback)
				}    
			this.$emit("node-drop",draggingNode,dropNode,dropType,event)

		},
		getCheckedKeys(){
 			return this.$refs.nodeTree.getCheckedKeys();
		}, 
		getCheckedNodes(){
 			return this.$refs.nodeTree.getCheckedNodes()
		},
		updateKeyChildren(key,data){
			
			this.$refs['nodeTree'].updateKeyChildren(key,data)
		},
		addTopNode(data){
			
			if(this.clearCacheFun){
					this.clearCacheFun()
				}
			this.$refs['nodeTree'].append(data,this.root) 
		},
		addTopNode_() {
			var callback = (data) => {  
					this.addTopNode({...data})
			}
			this.$emit('addTopNode',callback)
		},
		showImportTop(){
			var callback = () => {  
					this.refresh()
			}
			this.$emit('importTop',callback)
		},
		showImportSub(parent){
			var callback = () => {  
					this.refresh()
			}
			this.$emit('importSub',parent,callback)
		},
		addSubNode(parent,data){  
				if(!data){
					return 
				}
				
				var pnode=this.$refs.nodeTree.getNode(parent[this.propsCpd['id']])
				if(!pnode.expanded ){
					pnode.expand()
				}else{
					pnode.insertChild({data:data}) 
				}
				
				if(this.clearCacheFun){
					this.clearCacheFun()
				}
			},
		addSubNode_(parent, node, comp) { 
			
			var callback = (data) => {  
				 this.addSubNode(parent,{...data})
			}
			this.$emit('addSubNode',parent,callback)
		},
		editNode_(cdata, node, comp) { 

			var callback = (data) => {  
				
				if(!data){
					return
				} 
				Object.assign(node.data,data) 
			}
			var addSubCallback = (subData) => {
				this.addSubNode(cdata,subData)
			} 
			this.$emit('editNode',cdata,callback,addSubCallback)
		},
		deleteNode_(data, node, comp) {
			// if (!this.propsCpd.isLeaf(data)) {
			// 	this.$message.error("请先删除子元素");
			// 	return;
			// } 
			this.$confirm('确认删除吗？', '提示', {}).then(() => {
				var params = {}
				params[this.propsCpd['id']]=data[this.propsCpd['id']]
				this.del(params,data,node).then(res => {
					//console.log("res--"+JSON.stringify(res));
					if (res.tips.isOk) { 
						if(this.clearCacheFun){
							this.clearCacheFun()
						}
						this.$refs['nodeTree'].remove(data)
						this.$message.success(res.tips.msg);
					} else {
						this.$message.error(res.tips.msg);
					}
				});
			})
			return false;
		},
		cancelChangePid(){ 
			this.refresh()
		},
		changePid_(){ 
			if(this.idLinks.length==0){
				this.$message.error("没有数据改变，无须保存");
				return;
			}
			var callback = (refresh) => {
				this.idLinks=new Map()
				if(refresh)this.refresh()
			}
			var list=[]
			this.idLinks.forEach((value, key) => { 
				let d={}
				d[this.propsCpd['id']]=key
				d[this.propsCpd['pid']]=value
				list.push(d)
			});
			this.$emit('changePid',list,callback)
		},
		batchDel_() { 
			let checkedKeys = this.$refs.nodeTree.getCheckedKeys();
			if(checkedKeys.length==0){
				this.$message.error("请选择需要删除的记录");
				return;
			}
			this.$confirm('确认删除吗？', '提示', {}).then(() => { 
				 var params=[]
				checkedKeys.forEach(k=>{
					var d={}
					d[this.propsCpd['id']]=k
					params.push(d)
				})
				this.batchDel(params).then(res => { 
					if (res.tips.isOk) {
						this.refresh()
						this.$message.success(res.tips.msg);
					} else {
						this.$message.error(res.tips.msg);
					}
				});
			})
			return false;
		},
		handleCheckChange(data, checked, indeterminate) {
			let checkedKeys = this.$refs.nodeTree.getCheckedKeys(); 
			if (this.multiple === undefined || this.multiple === false || this.multiple === 'false') {
				if (checked == true) {
					if (checkedKeys.length > 1) {
						this.$refs.nodeTree.setCheckedKeys([data[this.propsCpd['id']]]);
						this.$emit('check-change', data, checked, indeterminate);
					} else {
						this.$emit('check-change', data, checked, indeterminate);
					}
				} else {
					if (checkedKeys.length == 0) {
						this.$emit('check-change', data, checked, indeterminate);
					}
				}
			} else {
				this.$emit('check-change', data, checked, indeterminate);
			}
		},
		handleCurrentChange(data, node) {
			this.$emit('current-change', data, node);
		},
		handleNodeClick(data, node, comp) {
			this.$emit('node-click', data, node, comp);
		},
		translateDataToTree(data) {
			if (!data) {
				return [];
			}
			return data
		},
		//重新获取部门树列表
		refresh() {
			if(this.clearCacheFun){
				this.clearCacheFun()
			}
			this.idLinks=new Map()
			this.treeVisible = false
			this.$nextTick(() => {
				this.treeVisible = true
			})
		},
		filterNode(value, data) {
			var pidKey = this.propsCpd['pid']
			var idKey = this.propsCpd['id']
			var labelKey = this.propsCpd['label']
			if (!value) return true;
			if (data[idKey].indexOf(value) >= 0 || data[idKey].indexOf(value) >= 0) {
				return true;
			} else {
				if (data[labelKey] && data[labelKey].indexOf(value) >= 0) {
					return true;
				}
			}
			return false;
		},
		confirm() {
			var nodes = this.$refs.nodeTree.getCheckedNodes(false, false)
			if (this.multiple) {
				this.$emit('confirm', nodes)
			} else {
				this.$emit('confirm', nodes && nodes.length > 0 ? nodes[0] : null)
			}

		},
		getCodeKey(){
			var itemCode=""
			if(this.load){
				itemCode=this.load.name
			}
			var codeKey='mdp-tree'+'@'+itemCode+'@'+this.rootId 
			return codeKey;
		},
		loadNode(node, resolve) {
			if (node.level === 0) {
				this.root = node
				this.resolve = resolve 
				let params = {};
				params[this.propsCpd['pid']] = this.rootId
				this.loading.addlist = true;
				this.load(params, node, resolve).then((res) => {
					var tips = res.tips;
					var data = res.data;
					this.loading.addlist = false;
					var tempData = this.translateDataToTree(data);  
					resolve(tempData)

				}).catch((err) => {
					
					this.loading.addlist = false;
				});
			} else {
				setTimeout(() => {
					let params = {};
					params[this.propsCpd['pid']] = node.data[this.propsCpd['id']]
					this.loading.addlist = true;
					this.load(params, node, resolve).then((res) => {
						var tips = res.tips;
						var data = res.data;
						this.loading.addlist = false;
						resolve(this.translateDataToTree(data))

					}).catch(() => {
						this.loading.addlist = false;
					});
				}, 500);

			}
		},
		toExcel(){
			this.export2Excel()
		},
		toWord(){ 
			let tree=this.$refs['nodeTree'];
			let datas=[]
			let callback=(curr,parent,lvl)=>{
				if(!curr.data||Object.keys(curr.data).length<=0){
					return;
				}else{
					curr.data.lvl_=lvl
					datas.push(curr.data)
				}
			}
			this.treeCfg(tree.root.childNodes,callback)
			
			if(datas.length==0){
				this.$message.error('没有数据可以导出')
				return;
			} 
			let seqNoKey=this.propsCpd['seqNo']
			let nameKey=this.propsCpd['label']
			let idKey=this.propsCpd['id']
			let pidKey=this.propsCpd['pid']
			let htmlList=datas.map((k,index)=>{ 
        let html=`<h${k.lvl_+1}>${k[seqNoKey]||''} ${k[nameKey]}</h${k.lvl_+1}>
        	<p>编号: ${k[idKey]} 上级编号: ${k[pidKey]}</p> 
        `
        return html;
      })
      let  all=htmlList.join("\n") 
			import("@/components/mdp-ui/js/Export2Word").then(word => { 
                    var fieldName=this.title + this.$mdp.formatDate(new Date(),'yyyyMMddHHmmss');
                     word.html2Word(all,fieldName)
                });  
		},
		
		export2Excel(){ 
			let tree=this.$refs['nodeTree'];
			let datas=[]
			let callback=(curr,parent,lvl)=>{
				if(!curr.data||Object.keys(curr.data).length<=0){
					return;
				}else{
					datas.push(curr.data)
				}
			}
			this.treeCfg(tree.root.childNodes,callback)
			
			if(datas.length==0){
				this.$message.error('没有数据可以导出')
				return;
			}
			let oneRow=datas[0]
			let propertys=Object.keys(oneRow)
			let cols=[]
			let idSet=new Set()
			if(this.propsCpd['seqNo']){ 
				cols.push({property:this.propsCpd['seqNo'],label:'序号'})
				idSet.add(this.propsCpd['seqNo'])
			} 
			cols.push({property:this.propsCpd['label'],label:'名称'})
			idSet.add(this.propsCpd['label'])
			cols.push({property:this.propsCpd['id'],label:'编号'})
			idSet.add(this.propsCpd['id'])
			cols.push({property:this.propsCpd['pid'],label:'上级编号'}) 
			idSet.add(this.propsCpd['pid'])
			propertys.forEach(p=>{
				if(!idSet.has(p)){
					cols.push({property:p,label:p})
				}
			})
			
            import("@/vendor/Export2Excel").then(excel => { 
                    var fieldName=this.title + this.$mdp.formatDate(new Date(),'YYYYMMDDHHmmss');
                    excel.export_json_to_excel({
                      header: cols.map(c=>c.label),
                      data:datas.map(d=>cols.map(c=>d[c.property])),
                      filename: fieldName,
                      autoWidth: true,
                      bookType: "xlsx"
                    });
                });  
         },
          
				 /**
				 * 遍历一棵树，对其节点进行数据转换 先根遍历
				 * @param {*} tree any[{children?:[]}]
				 * @param {*} callback callback(currNode,parent)
				 * returns void
				 */
				treeCfg(tree,callback){
					if(!tree){
						return;
					} 
					let treeCfg_ = (currNode,parent,callback,lvl2) => {
						if(!currNode){
							return;
						}
						callback(currNode,parent,lvl2)
						if(currNode.childNodes){
							currNode.childNodes.forEach(c=>{
								treeCfg_(c,currNode,callback,lvl2+1)
							})
						}
					}
					tree.forEach(k=>{
						callback(k,null,0)
						if(k.childNodes){
							k.childNodes.forEach(c=>{
								treeCfg_(c,k,callback,1)
							})
						}
					})
				},
	},
	mounted() {

	}
}

</script>
   
  