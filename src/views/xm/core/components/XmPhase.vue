<template>
  <MdpTree 
    ref="nodeTree"
    title="项目计划"
    showCheckbox
    :props="props"
    :load="getTask"
    :del="delXmTask"
    :batchDel="batchDelXmTask"
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
      <xm-project-select width="250px"
        v-model="filters.projectId" 
        v-if="!selProject || !selProject.id"
        ref="xmProjectSelect1"
        
        :link-iteration-id="xmIteration?xmIteration.id:null" :link-product-id="xmProduct?xmProduct.id:null"
        @change3="onProjectSelected"
        @clear="onProjectClearSelect"
        :clearable="!clearable?false:true"
      />
    </template>
    <template #nodeName="{ data }">
      <el-space>
        <icon
          :icon="
            getTaskIcon(data)
          "
        />
        <MdpSelect
          size="small"
          show-style="tag"
          itemCode="taskState"
          label="状态"
          v-model="data.taskState"
          disabled
        /><span :style="{ borderRadius: '30px', color: data.rate >= 100 ? 'green' : 'blue' }"
          >{{ formatRate(data.rate || 0) }}% </span
        >
        <div> {{ "(" + (data.subPlanCnt||'0')+"-"+ (data.subTaskCnt||'0') +")" }} {{ data.name }}</div>
      </el-space>
    </template>
  </MdpTree>

  <!--编辑 XmTask xm_project_menu界面-->
  <mdp-dialog ref="editDialog" width="100%" fullscreen append-to-body :close-on-click-modal="false">
    <template #default="{ visible, data, dialog }">
      <XmTaskEdit
        :formData="data.formData"
        :visible="visible"
        :xm-project="project"
        :xm-product="xmProduct"
        @cancel="dialog.close()"
        @submit="data.callback"
        @add-sub-task="data.addSubCallback"
        @fields-change="(res,isOk,params,row)=>data.callback(row)"
      />
    </template>
  </mdp-dialog>

  <!--新增 XmTask xm_project_menu界面-->
  <mdp-dialog ref="addDialog" fullscreen append-to-body :close-on-click-modal="false">
    <template #default="{visible, data, dialog }">
      <XmTaskAdd
        :visible="visible"
        :parent-task="data.parentTask"
        :formData="data.formData"
        :xm-product="xmProduct"
        :xm-project="project"
        @cancel="dialog.close()"
        @submit="data.callback"
      />
    </template>
  </mdp-dialog>
  <mdp-dialog append-to-body width="60%" top="20px" ref="parentMenuDialog">
    <template #default="{data,dialog}"> 
      <XmEpicFeatures showConfirm subOpType="select"
      :xm-product="xmProduct ? xmProduct : product"
      @confirm="(menu)=>{onParentMenuSelected(menu,data.checkKeys,data.callback);dialog.close()}"
    />
    </template>
  </mdp-dialog>
  <mdp-dialog append-to-body width="60%" top="20px" ref="parentDialog">
    <template #default="{data,dialog}"> 
      <XmPhase showConfirm subOpType="select"
      :sel-project="selProject ? selProject : project"
      @confirm="(task)=>{onParentTaskSelected(task,data.checkKeys,data.callback);dialog.close()}"
    />
    </template>
  </mdp-dialog>
</template>

<script>
import util from '@/components/mdp-ui/js/util' //全局公共库

import {
  delXmTask,
  batchDelXmTask,
  getTask,
  batchChangeParentTask, 
  batchImportTaskFromTemplate,
  calcProgress,
  calcProjectProgress,
} from '@/api/xm/core/xmTask'
 
 //新增界面 


import { mapState } from 'pinia'
import { useUserStore } from '@/store/modules/user'
 
 

// 创建一个异步组件，它会从一个外部API动态导入组件
const XmTaskAdd = defineAsyncComponent(() =>
  import('../xmTask/XmTaskAdd.vue') // 假设LazyComponent.vue是你想要懒加载的组件
);// 创建一个异步组件，它会从一个外部API动态导入组件
const XmTaskEdit = defineAsyncComponent(() =>
  import('../xmTask/XmTaskEdit.vue') // 假设LazyComponent.vue是你想要懒加载的组件
);
const XmTaskTreeMap = new Map()
export default {
  props: ['selProject', 'xmProduct', 'subOpType','multiple','showConfirm','hidden','params','projectRequired','clearable'],
  
  emits:['importTemplate', 'checkChange', 'projectSelect', 'projectClear','','addTopNode','importTop','importSub','editNode','addSubNode','changePid','confirm','nodeClick'],
  computed: {
    ...mapState(useUserStore, ['userInfo', 'roles']),
    
		hiddenCpd(){
      var isSelect=this.subOpType=='select'
			var hidden ={ 
				batchDel: true,
				del:isSelect,
				changePid: isSelect,
				addTop: isSelect,
				addSub: isSelect,
				edit: isSelect,
				filter: false,
				page: true,
				}
				hidden=Object.assign(hidden,this.hidden)
				return hidden
		},
    projectKey(){
      return this.xmProduct?.id+'-project-select-id'
    }
  },
  watch: {
    xmProduct: function () {
      this.$refs.nodeTree.refresh()
    },
  },
  data() {
    return {
      filters: {
        projectId: ''
      },
      project:null,
      props:{
         id: 'id', pid: 'parentTaskid', label: 'name' ,
         isLeaf:(n,node)=>{ 
          return n.subPlanCnt<=0||n.childrenCnt<=0
         }
      }
    }
  }, //end data
  methods: {
    clearCache(){
      XmTaskTreeMap.clear()
    },
    getTask(params, node) { 
      params.projectId = this.selProject?.id || this.project?.id 
      params.ntype='1'
      if(this.params){
        Object.assign(params,this.params)
      }
      if(!params.projectId){
        if(!this.projectRequired){
          return new Promise((resolve,reject)=>{
            resolve({tips:{isOk:true,msg:"ok"},data:[]})
          })
        }else{ 
          this.$message.error("请先选择项目") 
          return new Promise((resolve,reject)=>{
            reject('请先选择项目')
          })
        }
      }

      let codeKey=util.getCodeKey("tree_getTask",params)
        if(node.level===0){
          let datas=XmTaskTreeMap.get(codeKey)
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
          getTask(params).then(res=>{
            if(node.level===0){ 
              XmTaskTreeMap.set(codeKey,res.data)
            }
            resolve(res)
          })
        })   
    },
    delXmTask,
    batchDelXmTask,
    formatRate(num) {
      let precision = 0
      return (num * 1).toFixed(precision)
    },
    //显示编辑界面 XmTask xm_project_menu
    onEditClick: function (formData, callback, addSubCallback) {
      this.$refs['editDialog'].open({
        formData: formData,
        callback: callback,
        addSubCallback: addSubCallback
      })
    },
    //显示新增界面 XmTask xm_project_menu
    onAddTopClick: function (callback) {
      
      let ntype = '1'
      var parentTask = null
      var formData = {}
      if (!this.initProjectParams(formData)) {
        return
      } 
      formData.ntype='1'
      this.$refs['addDialog'].open({
        formData: formData,
        parentTask: parentTask,
        callback: callback
      })
    },
    initProjectParams(formData, parent) { 
      if (parent && parent.id) {
        formData.projectName = parent.projectName
        formData.projectId = parent.projectId
        if (this.project && parent.projectId == this.project.id) {
          formData.projectName = this.project.name
        } 
      } else {
        if(this.selProject && this.selProject.id){ 
          formData.projectId = this.selProject.id
          formData.projectName = this.selProject.name
        }else if (this.project && this.project?.id) {
          formData.projectId = this.project.id
          formData.projectName = this.project.name
        } else {
          this.$notify({
            position: 'bottom-left',
            showClose: true,
            message: '请先选择一个项目',
            type: 'warning'
          })
          return false
        }
      }
      if(this.xmProduct && this.xmProduct.id){
        formData.productId=this.xmProduct.id
        formData.productName=this.xmProduct.productName
      }

      return true
    },
    onAddSubClick: function (parent, callback) {
      var parentTask = parent
      var formData = {}
      if (!this.initProjectParams(formData, parent)) {
        return
      }
      formData.ntype='1'
      this.$refs['addDialog'].open({
        formData: formData,
        parentTask: parentTask,
        callback: callback
      })
    },
    onChangePidClick: function(idLinks,callback){
      batchChangeParentTask(idLinks).then(res=>{
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

    onProjectSelected: function (project) {
      this.project = project
      this.$refs.nodeTree.refresh()
      this.$emit('project-select', project)
      sessionStorage.setItem(this.projectKey,project?.id||'')
    },
    onProjectClearSelect: function () {
      this.project = null 
      this.$refs.nodeTree.refresh()
      this.$emit('project-clear')
      sessionStorage.removeItem(this.projectKey)
    },
 
    showImportFromMenuTemplate(row) {
      if (!this.product) {
        this.$notify.error('请选择产品模板')
        return
      }
      this.parentTask = row
      this.menuTemplateVisible = true
    },
    onSelectedMenuTemplates: function (menuTemplates) {
      if (menuTemplates == null || menuTemplates.length == 0) {
        this.menuTemplateVisible = false
        return
      }
      var menuTemplates2 = JSON.parse(JSON.stringify(menuTemplates))
      this.load.add = true
      let parents = menuTemplates2.filter((value) => {
        //如果我的上级为空，则我是最上级
        if (value.parentTaskid == 'undefined' || value.parentTaskid == null || value.parentTaskid == '') {
          return true

          //如果我的上级不在列表中，我作为最上级
        } else if (menuTemplates2.some((i) => value.parentTaskid == i.id)) {
          return false
        } else {
          return true
        }
      })
      if (this.parentTask != null && this.parentTask != undefined) {
        parents.forEach((i) => (i.parentTaskid = this.parentTask.id))
      } else {
        parents.forEach((i) => (i.parentTaskid = null))
      }
      let children = menuTemplates2.filter((value) => {
        if (menuTemplates2.some((i) => value.parentTaskid == i.id)) {
          return true
        } else {
          return false
        }
      })
      let translator = (parents, children) => {
        parents.forEach((parent) => {
          var newId = sn()
          var myChildren = []
          if (children != null && children.length > 0) {
            myChildren = children.filter((current) => current.parentTaskid === parent.id)
          }
          myChildren.forEach((current, index) => {
            current.parentTaskid = newId
            var mySubChildren = children.filter((c) => c.parentTaskid === current.id)
            translator([current], mySubChildren)
          })
          parent.id = newId
        })
      }

      translator(parents, children)
      menuTemplates2.forEach((i) => {
        i.productId = this.product.id
        i.productName = this.product.productName
      })
      batchAddXmTask(menuTemplates2)
        .then((res) => {
          this.menuTemplateVisible = false
          this.load.add = false
          var tips = res.tips
          if (tips.isOk) {
            this.getXmTasks()
          } else {
            this.$notify({
              position: 'bottom-left',
              showClose: true,
              message: tips.msg,
              type: 'error'
            })
          }
        })
        .catch((err) => (this.load.add = false))
    },

    loadTasksToXmTaskState: function () {
      if (!this.product) {
        if (!this.iteration) {
          this.$notify.warning('请先选择产品或者迭代')
          return
        }
      }
      this.load.edit = true
      let params = { productId: '' }
      if (!this.product) {
        params.productId = this.iteration.productId
      } else {
        params = { productId: this.product.id }
      }

      loadTasksToXmTaskState(params)
        .then((res) => {
          this.load.edit = false
          var tips = res.tips
          if (tips.isOk) {
            this.pageInfo.count = true
            this.xmTasks = []
            this.getXmTasks()
          }
          this.$notify({
            position: 'bottom-left',
            showClose: true,
            message: tips.msg,
            type: tips.isOk ? 'success' : 'error'
          })
        })
        .catch((err) => (this.load.edit = false))
    }, 
    onParentMenuSelected(menu,checkKeys,callback) {
      if (!menu || !menu.id) {
        this.$notify({
          position: 'bottom-left',
          showClose: true,
          message: '请先选择一个上级需求',
          type: 'warning'
        })
        return
      }
      if (menu.dclass != '1') {
        this.$notify({
          position: 'bottom-left',
          showClose: true,
          message: menu.menuName + '是特性，不能作为上级，请选择史诗作为上级',
          type: 'warning'
        })
        return
      }
      var params = {
        ids: checkKeys,
        parentTaskid: menu.id
      }
      batchChangeParentTask(params).then((res) => {
        var tips = res.tips
        if (tips.isOk) {
          this.$refs['nodeTree'].refresh()
        }
        this.$notify({
          position: 'bottom-left',
          showClose: true,
          message: tips.msg,
          type: tips.isOk ? 'success' : 'error'
        })
      })
    }, 
    getTaskIcon(task){
      if(task.milestone=='1'){
        return "ep:star-filled"
      }else if(task.ntype=='1'){
        return "ep:stopwatch"
      }else if(task.ntype=='0'){
        return "fa-solid:tasks"
      }else{
        return "ep:clock"
      }
    },
    refresh(){ 
      this.$refs['nodeTree'].refresh()
    }
  }, //end methods
  components: {
     XmTaskAdd,
     XmTaskEdit 
    //在下面添加其它组件
  },
  mounted() {
    this.project=this.selProject
    this.filters.projectId=this.project?.id||sessionStorage.getItem(this.projectKey)||''
  }
}
</script>

<style lang="scss" />
