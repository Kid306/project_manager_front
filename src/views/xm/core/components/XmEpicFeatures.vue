<template>
  <MdpTree
    ref="nodeTree"
    title="史诗、特性"
    showCheckbox
    :props="props"
    :load="listXmMenuWithState"
    :del="delXmMenu"
    :batchDel="batchDelXmMenu"
    :multiple="multiple"
    :showConfirm="showConfirm"
    :hidden="hiddenCpd"
    :clearCacheFun="clearCache"
    @addTopNode="(cb) => onAddTopClick(cb)"
    @importTop="(cb)=>showImportFromMenuTemplate(null,cb)"
    @importSub="(p,cb)=>showImportFromMenuTemplate(p,cb)"
    @editNode="(d, cb, subcb) => onEditClick(d, cb, subcb)"
    @addSubNode="(p, cb) => onAddSubClick(p, cb)"
    @changePid="(cks,cb) => onChangePidClick(cks,cb)"
    @confirm = "(d)=>{$emit('confirm',d);$emit('select',d)}"
    @check-change="(d,c,i)=>$emit('check-change',d,c,i)"
    @node-click="(d,n,c)=>$emit('node-click',d,n,c)"
    rootId="0"
    :draggable="true"
    :allow-drop="allowDrop"
  >
    <template #topToolbar>
      <xm-product-select width="250px"
        :isTpl="isTpl"
        :clearable="!clearable?false:true"
        v-model="filters.productId" 
        v-if="!xmProduct || !xmProduct.id"
        ref="xmProductSelect1"
        :link-project-id="selProject ? selProject.id : null"
        @change3="onProductSelected"
        @clear="onProductClearSelect"
      />
    </template>
    <template #nodeName="{ data }">
      <el-space>
        <icon
          :icon="
            data.dclass == '1' ? 'ep:promotion' : data.dclass == '2' ? 'ep:flag' : 'ep:document'
          "
        />
        <MdpSelect
          size="small"
          show-style="tag"
          itemCode="menuStatus"
          label="状态"
          v-model="data.status"
          disabled
        /><span :style="{ borderRadius: '30px', color: data.finishRate >= 100 ? 'green' : 'blue' }"
          >{{ formatRate(data.finishRate || 0) }}% </span
        >
        <div>{{ "(" + (data.subEfCnt||'0')+"-"+ (data.subStoryCnt||'0') +")" }} {{  data.menuName }}</div>
      </el-space>
    </template>
  </MdpTree>

  <!--编辑 XmMenu xm_project_menu界面-->
  <mdp-dialog ref="editDialog" width="100%" fullscreen append-to-body :close-on-click-modal="false">
    <template #default="{ visible, data, dialog }">
      <xm-menu-edit
        :formData="data.formData"
        :visible="visible"
        :sel-project="selProject"
        @cancel="dialog.close()"
        @submit="data.callback"
        @add-sub-menu="data.addSubCallback"
        @edit-fields="data.callback"
      />
    </template>
  </mdp-dialog>

  <!--新增 XmMenu xm_project_menu界面-->
  <mdp-dialog ref="addDialog" fullscreen append-to-body :close-on-click-modal="false">
    <template #default="{visible, data, dialog }">
      <xm-menu-add
        :visible="visible"
        :parent-menu="data.parentMenu"
        :formData="data.formData"
        @cancel="dialog.close()"
        @submit="data.callback"
      />
    </template>
  </mdp-dialog>
  <mdp-dialog
    title="需求模板"
    v-model="templateVisible"
    width="80%"
    append-to-body
    :close-on-click-modal="false"
  >
    <xm-menu-tree  subOpType="select"
      multiple isTpl 
      showConfirm
      @cancel="templateVisible = false"
      @select="onSelectedMenuTemplates"
    />
  </mdp-dialog> 
</template>

<script>
import util from '@/components/mdp-ui/js/util' //全局公共库

import {
  delXmMenu,
  batchDelXmMenu,
  listXmMenuWithState,
  batchChangeParentMenu,
  batchAddXmMenu,
} from '@/api/xm/core/xmMenu'
 

import { mapState } from 'pinia'
import { useUserStore } from '@/store/modules/user'

// 在 Vue 3 中，可以使用 defineAsyncComponent 方法来创建异步组件
import { defineAsyncComponent } from 'vue';
 
 
// 创建一个异步组件，它会从一个外部API动态导入组件
const XmMenuAdd = defineAsyncComponent(() =>
  import('../xmMenu/XmMenuAdd.vue') // 假设LazyComponent.vue是你想要懒加载的组件
);// 创建一个异步组件，它会从一个外部API动态导入组件
const XmMenuEdit = defineAsyncComponent(() =>
  import('../xmMenu/XmMenuEdit.vue') // 假设LazyComponent.vue是你想要懒加载的组件
);
const XmMenuTreeMap = new Map()
export default {
  props: ['selProject', 'xmProduct', 'subOpType','multiple','showConfirm','hidden','params','productRequired','clearable','isTpl'],
   emits:['importTemplate', 'checkChange', 'productSelect', 'productClear','','addTopNode','importTop','importSub','editNode','addSubNode','changePid','confirm','nodeClick'],
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
    productKey(){
      if(!this.isTpl && this.isTpl!='1') return this.selProject?.id+'-product-select-id'
      return this.selProject?.id+'-isTpl'+'-product-select-id'
    }
  },
  watch: {
    xmProduct: function () {
      this.$refs.nodeTree.refresh()
    },
  },
  data() {
    return {
      load:{list:false,add:false},
      filters: {
        productId: ''
      },
      product:null, 
      props:{
        id: 'menuId', pid: 'pmenuId', label: 'menuName',
        isLeaf:(n)=>{
          return n.childrenCnt<=0 || n.subEfCnt<=0
        }
      },
      templateVisible:false
    }
  }, //end data
  methods: {
    clearCache(){
      XmMenuTreeMap.clear();
    },
    listXmMenuWithState(params, node) {
      params.productId = this.xmProduct?.id || this.product?.id
      params.dclass='$IN1,2'
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
      
      let codeKey=util.getCodeKey("tree_listXmMenuWithState",params)
        if(node.level===0){
          let datas=XmMenuTreeMap.get(codeKey)
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
          listXmMenuWithState(params).then(res=>{
            if(node.level===0){ 
              XmMenuTreeMap.set(codeKey,res.data)
            }
            resolve(res)
          })
        })  
    },
    delXmMenu,
    batchDelXmMenu,
    refresh(){ 
      this.$refs.nodeTree.refresh()
    },
    formatRate(num) {
      let precision = 0
      return (num * 1).toFixed(precision)
    },
    //显示编辑界面 XmMenu xm_project_menu
    onEditClick: function (formData, callback, addSubCallback) {
      this.$refs['editDialog'].open({
        formData: formData,
        callback:  callback,
        addSubCallback: addSubCallback
      })
    },
    //显示新增界面 XmMenu xm_project_menu
    onAddTopClick: function (callback) {
      let dclass = '1'
      var parentMenu = null
      var formData = {}
      if (!this.initProductParams(formData)) {
        return
      }
      formData.dclass = dclass
      this.$refs['addDialog'].open({
        formData: formData,
        parentMenu: parentMenu,
        callback: callback
      })
    },
    initProductParams(formData, parent) {
      if (parent && parent.menuId) {
        formData.productName = parent.productName
        formData.productId = parent.productId
        if (this.product && parent.productId == this.product.id) {
          formData.productName = this.product.productName
        }
        if (this.iteration && this.iteration.id) {
          formData.productId = this.iteration.productId
          formData.iterationId = this.iteration.id
          formData.iterationName = this.iteration.iterationName
        }
      } else {
        if(this.xmProduct && this.xmProduct.id){ 
          formData.productId = this.product.id
          formData.productName = this.product.productName
        }else if (this.product && this.product?.id) {
          formData.productId = this.product.id
          formData.productName = this.product.productName
        } else if (this.iteration && this.iteration?.id) {
          formData.productId = this.iteration.productId
          formData.iterationId = this.iteration.id
          formData.iterationName = this.iteration.iterationName
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
      var parentMenu = parent
      var formData = {}
      if (!this.initProductParams(formData, parent)) {
        return
      }
      formData.dclass = parseInt(parent.dclass || 1) + 1 + ''
      this.$refs['addDialog'].open({
        formData: formData,
        parentMenu: parentMenu,
        callback: callback
      })
    },
    onChangePidClick: function(idLinks,callback){ 


      batchChangeParentMenu(idLinks).then(res=>{
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

    onProductSelected: function (product) {
      this.product = product
      sessionStorage.setItem(this.productKey,product?.id||'')
      this.$refs['nodeTree'].refresh()
      this.$emit('product-select', product)
    },
    onProductClearSelect: function () {
      this.product = null
      this.$refs['nodeTree'].refresh()
      this.$emit('product-clear')
      sessionStorage.removeItem(this.productKey)
    },
    allowDrop:function(startNode, dropNode, type){ 
 
      if(startNode.data.dclass<=dropNode.data.dclass && type=='inner'){
        return false;
      }else if(startNode.data.dclass<dropNode.data.dclass){
        return false;
      }
      return true

    },
    
    showImportFromMenuTemplate(parentMenu,callback) {
      if (!this.product) {
        this.$notify.warning('请选择产品')
        return
      }
      this.parentMenu=parentMenu;
      //this.parentMenu=row
      this.templateVisible = true
    },
    onSelectedMenuTemplates: function (menuTemplates,callback) {
      if (menuTemplates == null || menuTemplates.length == 0) {
        this.templateVisible = false
        return
      } 
      if(this.parentMenu?.menuId){
        if(this.parentMenu.dclass=='1'){
          let ms=menuTemplates.filter(k=>k.dclass<='1')
          if(ms.length>0){
            this.$message.error("【"+ms.map(k=>k.menuName).join(",")+"】为史诗，不能导入到同为史诗的【"+this.parentMenu.menuName+"】中，请选中特性或者用户故事进行导入")
            return;
          }
        }else if(this.parentMenu.dclass=='2'){
          let ms=menuTemplates.filter(k=>k.dclass<='2')
          if(ms.length>0){
            this.$message.error("【"+ms.map(k=>k.menuName).join(",")+"】为史诗/特性，不能导入到特性【"+this.parentMenu.menuName+"】中，请选中用户故事进行导入")
            return;
          }
        }else if(this.parentMenu.dclass>'2'){
          this.$message.error("不允许导入任何需求到到故事【"+this.parentMenu.menuName+"】中") 
          return;
        } 
      }

      let msg="将导入"+menuTemplates.length+"个需求到产品【"+this.product.productName+"】中【根目录】下，确认提交吗？"
      if(this.parentMenu?.menuId){
        msg="将导入"+menuTemplates.length+"个需求到产品【"+this.product.productName+"】中的【"+this.parentMenu.menuName+"】下，确认提交吗？"
      }
      this.$confirm(msg, '提示', {}).then(() => {

        var menuTemplates2 = JSON.parse(JSON.stringify(menuTemplates)) 
        let pmenuId=this.parentMenu?.menuId||'0' 
        let productId=this.parentMenu?.menuId?this.parentMenu.productId:this.product.id
        var params={xmMenus:menuTemplates2,pmenuId:pmenuId,productId: productId}
        batchAddXmMenu(params)
          .then((res) => {
            this.templateVisible = false
            this.load.add = false
            var tips = res.tips 
            if(tips.isOk){
              this.$emit('import-template',this.parentMenu) 
              this.refresh()
            }
              this.$notify({
                position: 'bottom-left',
                showClose: true,
                message: tips.msg,
                type: tips.isOk?'success':'error'
              }) 
          })
          .catch((err) => (this.load.add = false))

      })
     
    },
 
  }, //end methods
  components: {
    'xm-menu-add': XmMenuAdd,
    'xm-menu-edit': XmMenuEdit
    
    //在下面添加其它组件
  },
  mounted() {
    this.product=this.xmProduct
    this.filters.productId=this.xmProduct?.id||sessionStorage.getItem(this.productKey)||'' 
  }
}
</script>

<style lang="scss" />
