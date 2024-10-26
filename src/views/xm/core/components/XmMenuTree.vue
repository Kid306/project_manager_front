<template>
  <MdpTree
    ref="nodeTree"
    title="史诗、特性、用户故事树"
    showCheckbox
    :props="props"
    :load="listXmMenuWithState" 
    :multiple="multiple"
    :showConfirm="showConfirm"
    :hidden="hiddenCpd"
    :clearCacheFun="clearCache"
    @confirm = "(d)=>{$emit('confirm',d);$emit('select',d)}"
    @check-change="(d,c,i)=>$emit('check-change',d,c,i)"
    @node-click="(d,n,c)=>$emit('node-click',d,n,c)"
    rootId="0"
    :draggable="false"
  >
    <template #topToolbar>
      <xm-product-select width="300px"
        :isTpl="isTpl"
        :clearable="!clearable?false:true"
        v-model="filters.productId" 
        v-if="!xmProduct || !xmProduct.id"
        ref="xmProductSelect1"
        :link-project-id="selProject ? selProject.id : null"
        @change2="onProductSelected"
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
          show-style="tag"
          itemCode="menuStatus"
          label="状态"
          v-model="data.status"
          disabled
        /><span :style="{ borderRadius: '30px', color: data.finishRate >= 100 ? 'green' : 'blue' }"
          >{{ formatRate(data.finishRate || 0) }}%</span
        >
        <div>{{ data.menuName }}</div>
      </el-space>
    </template>
  </MdpTree>
</template>

<script>
import util from '@/components/mdp-ui/js/util' //全局公共库

import { 
  listXmMenuWithState, 
} from '@/api/xm/core/xmMenu' 
 



import { mapState } from 'pinia'
import { useUserStore } from '@/store/modules/user'

// 在 Vue 3 中，可以使用 defineAsyncComponent 方法来创建异步组件
import { defineAsyncComponent } from 'vue';
  
const XmMenuTreeMap2 = new Map()
export default {
  props: ['selProject', 'xmProduct', 'subOpType','multiple','showConfirm','hidden','params','productRequired','clearable','isTpl'],
  computed: {
    ...mapState(useUserStore, ['userInfo', 'roles']),
    
		hiddenCpd(){
      var isSelect=this.subOpType=='select'
			var hidden ={ 
				batchDel: true,
				del:true,
				changePid: true,
				addTop: true,
				addSub: true,
				edit: true,
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
        id: 'menuId', pid: 'pmenuId', label: 'menuName',
        isLeaf:(n)=>{
          return n.childrenCnt<=0 || n.subEfCnt<=0
        }
      }
    }
  }, //end data
  methods: {
    clearCache(){
      XmMenuTreeMap2.clear();
    },
    listXmMenuWithState(params, node) {
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
      
      let codeKey=util.getCodeKey("tree_listXmMenuWithState2",params)
        if(node.level===0){
          let datas=XmMenuTreeMap2.get(codeKey)
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
              XmMenuTreeMap2.set(codeKey,res.data)
            }
            resolve(res)
          })
        })  
    }, 
    refresh(){ 
      this.$refs.nodeTree.refresh()
    },
    formatRate(num) {
      let precision = 0
      return (num * 1).toFixed(precision)
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
  mounted() {
    this.product=this.xmProduct
  }
}
</script>

<style lang="scss" />
