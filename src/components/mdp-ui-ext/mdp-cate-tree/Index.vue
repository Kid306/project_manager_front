<template>
	<MdpTree
		ref="nodeTree"
		title="分类"
		showCheckbox
		:props="propsCpd"
		:load="listCategory"
		:del="delCategory"
		:batchDel="batchDelCategory"
		:multiple="multiple"
		:showConfirm="showConfirm"
		:hidden="hiddenCpd"
		:clearCacheFun="clearCache"
		@addTopNode="(cb) => onAddTopClick(cb)"
		@editNode="(d, cb, subcb) => onEditClick(d, cb, subcb)"
		@addSubNode="(p, cb) => onAddSubClick(p, cb)" 
		@changePid="(cks,cb) => onChangePidClick(cks,cb)"
		@confirm = "(d)=>{$emit('confirm',d);$emit('select',d)}"
		@check-change="(d,c,i)=>$emit('check-change',d,c,i)"
		@node-click="(d,n,c)=>$emit('node-click',d,n,c)"
		rootId="0"
		:draggable="true"
	>
		<template #topToolbar>
			<mdp-select width="250px" :disabled="categoryType" v-model="filters.categoryType" item-code="categoryType"  placeholder="主题" clearable @change="onCategoryTypeChange"/> 
		</template>
		<template #nodeName="{ data }">
			<el-space>  
				 <div><Icon v-if="data.imageUrls" :icon="data.imageUrls"/>{{data.name}}</div>
			</el-space>
		</template>
		<template #nodeToolbar="{data}">
			<el-button type="primary" v-if="data.qxLvl=='2'" @click="$refs['qxSetDialog'].open({category:data})">配置限制规则</el-button>
		</template>
	</MdpTree>

	<!--编辑 Category xm_project_func界面-->
	<mdp-dialog ref="editDialog" width="30%" append-to-body :close-on-click-modal="false">
		<template #default="{ data,dialog }">
			<el-form ref="editForm" :model="editForm" label-width="150" 	>
			<el-form-item label="主题"  prop="categoryType" :rules="[
				{ required: true, message: '主题不能为空'}
				]">
				<mdp-select width="100%" v-model="editForm.categoryType" item-code="categoryType" placeholder="请选择主题" :disabled="data.formData.categoryType"/> 
			</el-form-item>
			<el-form-item label="分类编号"  prop="id" :rules="[
				{ required: true, message: '不能为空'}
				]">
				{{editForm.id}}
			</el-form-item>
			<el-form-item label="分类名称"  prop="name"
			:rules="[
				{ required: true, message: '名称不能为空'}
				]">
				<el-input v-model="editForm.name" />
			</el-form-item>


			<el-form-item label="图标" >
				  <IconSelect v-model="editForm.imageUrls"/>
			</el-form-item> 
			<el-form-item label="配置" >
				<el-checkbox v-model="editForm.isLeaf" auto-complete="off"  true-label="0" false-label="1">是否可添加子分类</el-checkbox>

				<el-checkbox v-model="editForm.limitType" auto-complete="off"  true-label="1" false-label="2">文章数目是否限制为1篇</el-checkbox>

				<el-checkbox v-model="editForm.isAuth" auto-complete="off" true-label="1" false-label="0">文章发布是否需要审核</el-checkbox>
			</el-form-item> 
			

			<el-form-item label="权限" >
				<el-radio v-model="editForm.qxLvl" auto-complete="off"  label="0">全网公开</el-radio>
				<el-radio v-model="editForm.qxLvl" auto-complete="off"  label="1">内部公开</el-radio>
				<el-radio v-model="editForm.qxLvl" auto-complete="off"  label="2">受限</el-radio> 
				<el-button type="primary" v-if="editForm.qxLvl=='2'" @click="$refs['qxSetDialog'].open({category:editForm})">配置限制规则</el-button>
				<el-checkbox v-model="editForm.pqx" auto-complete="off"  true-label="1" false-label="0">所有子类遵守上级权限规则</el-checkbox> 
			</el-form-item> 
		</el-form>
		
		<div class="footer">
			<el-button @click="dialog.close()">关 闭</el-button>
			<el-button type="primary" v-loading="loading.edit" @click="editSubmit(data.callback)">确 定</el-button>
		</div>
		</template>
	</mdp-dialog>

	<!--新增 Category xm_project_func界面-->
	<mdp-dialog ref="addDialog" width="30%" append-to-body :close-on-click-modal="false" title="新增分类">
		<template #default="{ data, dialog }">
			<el-form ref="addForm" :model="addForm" label-width="150" 	>
			<el-form-item label="主题"  prop="categoryType" :rules="[
				{ required: true, message: '主题不能为空'}
				]"> 
				<mdp-select width="100%" v-model="addForm.categoryType" :disabled="(data.parent && data.parent.categoryType)||data.formData.categoryType" item-code="categoryType" placeholder="请选择主题"/> 
			</el-form-item>
			
			<el-form-item label="上级分类">
				
				<el-tag>{{  data.parent && data.parent.id && data.parent.id!='0'? "上级："+data.parent.name:"顶级分类0" }}</el-tag>

			</el-form-item>
			<el-form-item label="分类编号" prop="id">
				<el-input v-model="addForm.id" placeholder="如果为空，则系统自动生成"/>
			</el-form-item>
			<el-form-item label="分类名称"  prop="name"
			:rules="[
				{ required: true, message: '名称不能为空'}
				]">
				<el-input v-model="addForm.name" />
			</el-form-item>

			<el-form-item label="图标" >
				  <IconSelect v-model="addForm.imageUrls"/>
			</el-form-item> 

			<el-form-item label="配置" prop="name">
				<el-checkbox v-model="addForm.isLeaf" auto-complete="off"  true-label="0" false-label="1">是否可添加子分类</el-checkbox>

				<el-checkbox v-model="addForm.limitType" auto-complete="off"  true-label="1" false-label="2">文章数目是否限制为1篇</el-checkbox>

				<el-checkbox v-model="addForm.isAuth" auto-complete="off" true-label="1" false-label="0">文章发布是否需要审核</el-checkbox>
			</el-form-item> 
			<el-form-item label="权限" >
				<el-radio v-model="addForm.qxLvl" auto-complete="off"  label="0">全网公开</el-radio>
				<el-radio v-model="addForm.qxLvl" auto-complete="off"  label="1">内部公开</el-radio>
				<el-radio v-model="addForm.qxLvl" auto-complete="off"  label="2">受限</el-radio> 
				<el-checkbox v-model="addForm.pqx" auto-complete="off"  true-label="1" false-label="0">所有子类遵守上级权限规则</el-checkbox> 
			</el-form-item> 
		</el-form>
		
		<div class="footer">
			<el-button @click="dialog.close()">关闭</el-button>
			<el-button type="primary" v-loading="loading.add"  @click="addSubmit(data.parent,data.callback)">确 定</el-button>
		</div>
		</template>
	</mdp-dialog> 
	<mdp-dialog ref="qxSetDialog" title="配置权限">
	<template #default="{visible,data,dialog}">
		<category-qx-set :visible="visible" :category="data.category" @close="dialog.close()" @submit="dialog.close()"/>
	</template>
</mdp-dialog> 
</template>

<script>
import util from '@/components/mdp-ui/js/util' //全局公共库
const MdpCateTreeMap=new Map()
import CategoryQxSet from './QxSet.vue';
import {
	addCategory,
	editCategory,
	delCategory,
	batchDelCategory,
	listCategory,
	batchChangeParent,
} from '@/api/mdp_pub/larc'  
import { mapState } from 'pinia'
import { useUserStore } from '@/store/modules/user'
 
export default {
	props: {
	'subOpType':{type:String,defalut:'mng'},
	'multiple':{type:Boolean,default:false},
	'showConfirm':{type:Boolean,default:false},
	'hidden':{type:Object,default:()=>null},
	'params':{type:Object,default:()=>null},
	'clearable':{type:Boolean,default:true},
	categoryType:{//主题
		type:String,
				default:null
	},
			crelyType:{
				type:String,
				default:''
			},
			crelyId:{
				type:String,
				default:''
			},
			crelyStype:{
				type:String,
				default:'',
			},
			crelySid:{
				type:String,
				default:''
			}
		},
	computed: {
		...mapState(useUserStore, ['userInfo', 'roles']),
		
				hiddenCpd(){
			var isSelect=this.subOpType=='select'
						var hidden ={ 
								batchDel: true,
								del:isSelect,
								importTop:false,
								importSub:false,
								changePid: false,
								addTop: isSelect,
								addSub: isSelect,
								edit: isSelect,
								filter: false,
								page: true,
								}
								hidden=Object.assign(hidden,this.hidden)
								return hidden
				},
				propsCpd(){
					return { id: 'id', pid: 'pid', label: 'name' , isLeaf:(data,n)=>{
						return data.childNum<=0
					}}
				}
	}, 
	data() {
		return {
			filters: {
				categoryType: ''
			}, 
			addForm:{id:'',pid:'',name:'',isLeaf:'0',isAuth:'0',limitType:'2',categoryType:'',pqx:'',qxLvl:''},
			editForm:{id:'',pid:'',name:'',isLeaf:'0',isAuth:'0',limitType:'2',categoryType:'',pqx:'',qxLvl:''},
			loading:{add:false,edit:false,list:false}	
		}
	}, //end data
	methods: {
		clearCache(){
			MdpCateTreeMap.clear()
		},
		listCategory(params, node) {   
			Object.assign(params,this.filters)
			if(this.params){
				Object.assign(params,this.params)
			}   
			if(this.crelyType){
				params.crelyType=this.crelyType
			}
			if(this.crelyStype){
				params.crelyStype=this.crelyStype
			}
			if(this.crelyId){
				params.crelyId=this.crelyId
			}
			if(this.crelySid){
				params.crelySid=this.crelySid
			}
      let codeKey=util.getCodeKey("tree_listCategory",params)
        if(node.level===0){
          let datas=MdpCateTreeMap.get(codeKey)
          if(datas && datas.length>0){ 
            return new Promise((resolve)=>{
              resolve({
                tips:{
                  msg:'ok',
                  isOk:true,
                },
                data: datas
              }) 
            })
          }
        } 
        return new Promise((resolve,reject)=>{
          listCategory(params).then(res=>{
            if(node.level===0){ 
              MdpCateTreeMap.set(codeKey,res.data)
            }
            resolve(res)
          })
        })  
		},
		delCategory,
		batchDelCategory,
		//显示编辑界面 Category xm_project_func
		onEditClick: function (formData, callback, addSubCallback) {
			this.editForm={...formData}
			this.$refs['editDialog'].open({
				formData: formData,
				callback: callback,
				addSubCallback: addSubCallback
			})
		},
		//显示新增界面 Category xm_project_func
		onAddTopClick: function (callback) { 
			var formData = {}
			if (!this.initExtParams(formData)) {
				return
			}
			Object.assign(this.addForm,formData)
			this.$refs['addDialog'].open({
				formData: formData,
				parent: null,
				callback: callback
			})
		},
		initExtParams(formData, parent) {
			if(this.categoryType){
				formData.categoryType=this.categoryType
			}
			if(this.filters.categoryType){
				formData.categoryType=this.filters.categoryType
			}
			if(parent?.id){
				formData.categoryType=parent.categoryType
				formData.pid=parent.id
			}
			return true
		},
		onAddSubClick: function (parent, callback) { 
			var formData = {}
			if (!this.initExtParams(formData, parent)) {
				return
			}  
			Object.assign(formData,parent)
			formData.pid=parent.id 
			formData.id=null
			this.addForm={...formData}
			this.$refs['addDialog'].open({
				formData: formData,
				parent: parent,
				callback: callback
			})
		}, 
		onChangePidClick: function(idLinks,callback){  
			batchChangeParent(idLinks).then(res=>{
				let {tips}=res
				if(tips.isOk){
					MdpCateTreeMap.clear()
						if(callback){
							callback(true)
						}
						this.$message.success(tips.msg)
					}else{ 
						this.$message.error(tips.msg)
					}
				}) 
		},
		
		refresh(){ 
			this.$refs['nodeTree'].refresh() 
		},
		onCategoryTypeChange(ctype){
			this.$refs.nodeTree.refresh()
		},
		addSubmit(parent,callback){
			var branchId=this.userInfo.branchId
				 
				this.addForm.branchId=branchId 
				if(this.crelyType){
					this.addForm.crelyType=this.crelyType
				}
				
				if(this.crelyId){
					this.addForm.crelyId=this.crelyId
				}
				
				if(this.crelyStype){
					this.addForm.crelyStype=this.crelyStype
				}
				
				if(this.crelySid){
					this.addForm.crelySid=this.crelySid
				}
				if(this.filters.categoryType){
					this.addForm.categoryType=this.filters.categoryType
				}
				if(this.categoryType){

					this.addForm.categoryType=this.categoryType
				}
				this.$refs.addForm.validate((valid) => {
					if (valid) {
						this.$confirm('确认提交吗？', '提示', {}).then(() => {
							this.loading.add = true;
							addCategory(this.addForm).then(res=>{
								this.loading.add=false;
								if(res.tips.isOk){  
									this.$message.success(res.tips.msg);   
									this.$refs.addDialog.close()
									callback(res.data)
								}else{
									this.$message.error(res.tips.msg);
								}
							}).catch(e=>this.loading.add = false  );

						});
					}
				});
		},
		editSubmit(callback){
				this.$refs.editForm.validate((valid) => {
					if (valid) {
						this.$confirm('确认提交吗？', '提示', {}).then(() => {
							this.loading.edit = true;
							editCategory(this.editForm).then(res=>{ 
								if(res.tips.isOk){ 
									this.loading.edit = false
									this.$refs.editDialog.close();
									this.$message.success(res.tips.msg);   
									callback(this.editForm)
								}else{
									this.$message.error(res.tips.msg);
								}
							}).catch(e=>this.loading.edit = false  );

						});
					}
				});
		}
		 
	}, //end methods
	components: { CategoryQxSet
	},
	mounted() { 
	}
}
</script>

<style lang="scss" />
