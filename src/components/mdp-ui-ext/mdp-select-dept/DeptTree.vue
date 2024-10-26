<template>
	<MdpTree
		ref="nodeTree"
		title="部门"
		showCheckbox
		:props="propsCpd"
		:load="listDept"
		:del="delDept"
		:batchDel="batchDel"
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
		rootId="A0"
		:draggable="true"
	> 
		<template #nodeName="{ data }">
			<el-space>  
				 <div><Icon v-if="data.icon" :icon="data.icon"/>{{data.deptName}}</div>
			</el-space>
		</template> 
	</MdpTree>

	<!--编辑 Dept xm_project_func界面-->
	<mdp-dialog ref="editDialog" width="60%" append-to-body :close-on-click-modal="false">
		<template #default="{ data,dialog }">
			<DeptForm :subOpType="data.subOpType" :formData="data.formData" @edit-fields="data.callback" @close="dialog.close()"/>
		</template>
	</mdp-dialog>

	<!--新增 Dept xm_project_func界面-->
	<mdp-dialog ref="addDialog" width="60%" append-to-body :close-on-click-modal="false">
		<template #default="{ data,dialog }">
			 <DeptForm :subOpType="data.subOpType" :formData="data.formData" :parentDept="data.parent" @add-submit="data.callback($event);dialog.close();" @close="dialog.close()"/>
		</template>
	</mdp-dialog>  
</template>

<script>
import util from '@/components/mdp-ui/js/util' //全局公共库 
import { mapState } from 'pinia'
import { useUserStore } from '@/store/modules/user'
import DeptForm from './Form.vue'
const MdpDeptTreeMap=new Map();
export default { 
	props: {
	'subOpType':{type:String,defalut:'mng'},
	'multiple':{type:Boolean,default:false},
	'showConfirm':{type:Boolean,default:false},
	'hidden':{type:Object,default:()=>null},
	'params':{type:Object,default:()=>null},
	'clearable':{type:Boolean,default:true},
			relyType:{
				type:String,
				default:''
			},
			relyId:{
				type:String,
				default:''
			},
			relyStype:{
				type:String,
				default:'',
			},
			relySid:{
				type:String,
				default:''
			}
		},
	computed: {
		...mapState(useUserStore, ['userInfo', 'roles']),
		
				hiddenCpd(){
			var isSelect=this.subOpType=='select'
						var hidden ={ 
								batchDel:true,
								del:isSelect,
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
					return { id: 'deptid', pid: 'pdeptid', label: 'deptName' , isLeaf:(data,n)=>{
						
						return data.childNum<=0
					}}
				}
	}, 
	data() {
		return {
			filters: {

			},  
			loading:{add:false,edit:false,list:false}	
		}
	}, //end data
	methods: {
		clearCache(){
			MdpDeptTreeMap.clear()
		},
		listDept(params, node) {  
			Object.assign(params,this.filters)
			if(this.params){
				Object.assign(params,this.params)
			}  
			let codeKey=util.getCodeKey("tree_listDept",params)
        if(node.level===0){
          let datas=MdpDeptTreeMap.get(codeKey)
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
          this.$mdp.listDept(params).then(res=>{
            if(node.level===0){ 
              MdpDeptTreeMap.set(codeKey,res.data)
            }
            resolve(res)
          })
        })  
		},
		delDept(p){return this.$mdp.delDept(p) },
		refresh(){ 
			this.$refs['nodeTree'].refresh()

		},
		addDept(p){return this.$mdp.addDept(p)},
		batchDel(p){
			return  this.$mdp.batchDelDept(p)
		},
		editDept(p){return this.$mdp.editDept(p)},
		batchChangeParent(p){return this.$mdp.batchChangeDeptParent(p)},
		//显示编辑界面 Dept xm_project_func
		onEditClick: function (formData, callback, addSubCallback) {  
			this.$refs['editDialog'].open({
				subOpType:'edit',
				formData: formData,
				callback: callback,
				addSubCallback: addSubCallback
			})
		},
		//显示新增界面 Dept xm_project_func
		onAddTopClick: function (callback) { 
			var formData = {}
			if (!this.initExtParams(formData)) {
				return
			} 
			this.$refs['addDialog'].open({
				
				subOpType:'add',
				formData: formData,
				parent: null,
				callback: callback
			})
		},
		initExtParams(formData, parent) {
			return true
		},
		onAddSubClick: function (parent, callback) { 
			var formData = {}
			if (!this.initExtParams(formData, parent)) {
				return
			}   
			Object.assign(formData,parent)
			formData.pdeptid=parent.deptid 
			formData.deptid=null 
			this.$refs['addDialog'].open({
				subOpType:'subAdd',
				formData: formData,
				parent: parent,
				callback: callback
			})
		}, 
		onChangePidClick: function(idLinks,callback){  
			this.batchChangeParent(idLinks).then(res=>{
				let {tips}=res
				if(tips.isOk){ 
						if(callback){
							callback(true)
						}
						this.$message.success(tips.msg)
					}else{ 
						this.$message.error(tips.msg)
					}
				}) 
		},  
	}, //end methods
	components: { 
		DeptForm
	},
	mounted() { 
	}
}
</script>

<style lang="scss" />
