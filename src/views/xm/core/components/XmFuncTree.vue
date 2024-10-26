<template>
    <MdpTree
      ref="nodeTree"
      title="功能模块"
      showCheckbox
      :props="props"
      :load="listXmFunc"
      :del="delXmFunc"
      :batchDel="batchDelXmFunc"
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
        <xm-product-select width="300px"
          :clearable="!clearable?false:true"
          v-model="filters.productId" 
          v-if="!xmProduct || !xmProduct.id"
          ref="xmProductSelect1"
          :link-project-id="linkProjectId"
          @change2="onProductSelected"
          @clear="onProductClearSelect"
        />
      </template>
      <template #nodeName="{ data }">
        <el-space> 
          <div>{{ data.name }}&nbsp;({{ data.childNum||0 }})</div>
        </el-space>
      </template>
    </MdpTree>
  
    <!--编辑 XmFunc xm_project_func界面-->
    <mdp-dialog ref="editDialog" width="30%" append-to-body :close-on-click-modal="false">
      <template #default="{ visible, data, dialog }">
        <xm-func-edit subOpType="edit"
          :formData="data.formData"
          :visible="visible"
          :linkProjectId="linkProjectId"
          @cancel="dialog.close()"
          @submit="data.callback" 
          @edit-fields="data.callback"
        />
      </template>
    </mdp-dialog>
  
    <!--新增 XmFunc xm_project_func界面-->
    <mdp-dialog ref="addDialog" width="30%" append-to-body :close-on-click-modal="false">
      <template #default="{visible, data, dialog }">
        <xm-func-add subOpType="add"
          :visible="visible"
          :parent-func="data.parentFunc"
          :formData="data.formData"
          @cancel="dialog.close()"
          @add-submit="data.callback"
        />
      </template>
    </mdp-dialog> 
  </template>
  
  <script>
  import util from '@/components/mdp-ui/js/util' //全局公共库
  
  import {
    delXmFunc,
    batchDelXmFunc,
    listXmFunc,
    batchChangeParent,
  } from '@/api/xm/core/xmFunc'
    

  
  
  import { mapState } from 'pinia'
  import { useUserStore } from '@/store/modules/user'
  
  // 在 Vue 3 中，可以使用 defineAsyncComponent 方法来创建异步组件
  import { defineAsyncComponent } from 'vue';
   
 
  // 创建一个异步组件，它会从一个外部API动态导入组件
  const XmFuncAdd = defineAsyncComponent(() =>
    import('../xmFunc/XmFuncEdit.vue') // 假设LazyComponent.vue是你想要懒加载的组件
  );// 创建一个异步组件，它会从一个外部API动态导入组件
  const XmFuncEdit = defineAsyncComponent(() =>
    import('../xmFunc/XmFuncEdit.vue') // 假设LazyComponent.vue是你想要懒加载的组件
  );
  const XmFuncTreeMap = new Map();
  export default {
    props: ['xmProduct', 'subOpType','multiple','showConfirm','hidden','params','productRequired','clearable'],
    computed: {
      ...mapState(useUserStore, ['userInfo', 'roles']),
      
          hiddenCpd(){
        var isSelect=this.subOpType=='select'
              var hidden ={ 
                  batchDel: true,
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
    },
    watch: {
      xmProduct: function () {
        this.$refs.nodeTree.refresh()
      },
    },
    data() {
      return {
        filters: {
          productId: ''
        },
        product:null,
        
        props:{
          id: 'id', pid: 'pid', label: 'name',
          isLeaf:(n,node)=>{
            return n.childNum<=0
          }
        },
      }
    }, //end data
    methods: {
      
		clearCache(){
			XmFuncTreeMap.clear()
		},
      listXmFunc(params, node) {
        params.productId = this.xmProduct?.id || this.product?.id 
        if(this.params){
          Object.assign(params,this.params)
        }
  
        if(!params.productId){
          if(!this.productRequired){
            return new Promise((resolve,reject)=>{
              resolve({tips:{isOk:true,msg:"ok"},data:[]})
            })
          }else{ 
            this.$message.error("请先选择产品") 
            return new Promise((resolve,reject)=>{
              reject('请先选择产品')
            })
          }
        }

        let codeKey=util.getCodeKey("tree_listXmFunc",params)
        if(node.level===0){
          let datas=XmFuncTreeMap.get(codeKey)
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
          listXmFunc(params).then(res=>{
            if(node.level===0){ 
              XmFuncTreeMap.set(codeKey,res.data)
            }
            resolve(res)
          })
        }) 
      },
      delXmFunc,
      batchDelXmFunc, 
      //显示编辑界面 XmFunc xm_project_func
      onEditClick: function (formData, callback, addSubCallback) { 
        this.$refs['editDialog'].open({
          formData: formData,
          callback: callback,
          addSubCallback: addSubCallback
        })

      },
      //显示新增界面 XmFunc xm_project_func
      onAddTopClick: function (callback) {
        var parentFunc = null
        var formData = {}
        if (!this.initProductParams(formData)) {
          return
        } 
        this.$refs['addDialog'].open({
          formData: formData,
          parentFunc: parentFunc,
          callback: callback
        })
      },
      initProductParams(formData, parent) {
        if (parent && parent.id) {
           formData.productId = parent.productId
          if (this.product && parent.productId == this.product.id) {
           } 
        } else {
          if(this.xmProduct && this.xmProduct.id){ 
            formData.productId = this.product.id
           }else if (this.product && this.product?.id) {
            formData.productId = this.product.id
           } else {
            this.$notify({
              position: 'bottom-left',
              showClose: true,
              message: '请先选择一个产品',
              type: 'warning'
            })
            return false
          }
        }
  
        return true
      },
      onAddSubClick: function (parent, callback) {
        var parentFunc = parent
        var formData = {}
        if (!this.initProductParams(formData, parent)) {
          return
        }  
        this.$refs['addDialog'].open({
          formData: formData,
          parentFunc: parentFunc,
          callback: callback
        })
      }, 
      onChangePidClick: function(idLinks,callback){  
        batchChangeParent(idLinks).then(res=>{
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
      
    refresh(){ 
      this.$refs.nodeTree.refresh()
    },
      onProductSelected: function (product) {
        this.product = product
        this.$refs['nodeTree'].refresh()
        this.$emit('product-select', product)
      },
      onProductClearSelect: function () {
        this.product = null
        this.$refs['nodeTree'].refresh()
        this.$emit('product-clear')
      }, 
       
    }, //end methods
    components: {
      'xm-func-add': XmFuncAdd,
      'xm-func-edit': XmFuncEdit
      //在下面添加其它组件
    },
    mounted() {
      this.product=this.xmProduct
    }
  }
  </script>
  
  <style lang="scss" />
  