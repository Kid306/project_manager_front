<template>
  <el-row :gutter="5">

		<el-col :span="toggle?0:6"> 
      <xm-epic-features :productRequired="productRequired" v-if="hadInit" ref="tree" v-show="toggle==false"
        :xm-product="xmProductCpd"
        :sel-project="selProject"
        @import-template="onTreeImportTemplate"
        @check-change="onEpicFeaturesRowClick"
        @product-select="onProductSelected"
        @product-clear="onProductClearSelect"
      /> 
    </el-col>
    <el-col :span="toggle?24:18" v-if="xmProductCpd && xmProductCpd.id">
      <xm-menu-mng :deriveId="deriveId"  :subOpType="subOpType" :multiple="multiple" :params="paramsCpd" :iterationFilterType="iterationFilterType"
        @select="$emit('select',$event)"
        @change="$emit('change',$event)"
        @change2="$emit('change2',$event)"
        @import-template="onImportTemplate"
        :xm-product="xmProductCpd"
        :sel-project="selProject"
        :parent-menu="parentMenu"
        :xm-iteration="xmIteration"
        queryScope="story"
      >
      <template #expandBtn>
					<el-button :icon="toggle?'DArrowRight':'DArrowLeft'" @click="onToggleClick" plain title="展开/收起左边"/>
				</template>
      </xm-menu-mng>
    </el-col>

    <el-col :span="toggle?24:18" v-else-if="product && product.id">
      <xm-menu-mng :deriveId="deriveId" :subOpType="subOpType" :multiple="multiple" :params="paramsCpd" :iterationFilterType="iterationFilterType"
        @select="$emit('select',$event)"
        @change="$emit('change',$event)"
        @change2="$emit('change2',$event)"
        @import-template="onImportTemplate"
        :xm-product="product"
        :sel-project="selProject"
        :parent-menu="parentMenu"
        :xm-iteration="xmIteration"
        queryScope="story"
      >
      <template #expandBtn>
					<el-button :icon="toggle?'DArrowRight':'DArrowLeft'" @click="onToggleClick" plain title="展开/收起左边"/>
				</template>
      </xm-menu-mng>
    </el-col>
  </el-row>
</template>

<script>
import util from '@/components/mdp-ui/js/util' //全局公共库

import { mapState } from 'pinia'
import { useUserStore } from '@/store/modules/user'
// 在 Vue 3 中，可以使用 defineAsyncComponent 方法来创建异步组件
import { defineAsyncComponent } from 'vue';
 
 
// 创建一个异步组件，它会从一个外部API动态导入组件
const XmMenuMng = defineAsyncComponent(() =>
  import('../xmMenu/XmMenuMng.vue') // 假设LazyComponent.vue是你想要懒加载的组件
);// 创建一个异步组件，它会从一个外部API动态导入组件
 
export default {
  props: ['xmProduct', 'xmIteration', 'selProject','productRequired' ,'multiple','isTpl','subOpType','iterationFilterType','deriveId'],
  components: { 
    XmMenuMng
  },
  computed: {
    ...mapState(useUserStore, ['userInfo', 'roles']),
    xmProductCpd() {
      
      if (this.xmProduct && this.xmProduct.id) {
        return this.xmProduct
      }
      if (this.xmIteration && this.xmIteration.id && this.xmIteration.productId) {
        return { id: this.xmIteration.productId, productName: this.xmIteration.productName }
      }
      return null
    }, 
    paramsCpd(){
      if(this.parentMenu?.menuId){ 
        return {pmenuId:this.parentMenu?.menuId}
      }else{
        return null
      }
    }
  },
  watch: {},
  data() {
    return {
       product: null,
       productId:null,
      parentMenu: null,
				toggle: false,
				hadInit: false, 
    } //end return
  }, //end data
  methods: {
			 
       onToggleClick(){
         this.toggle=!this.toggle
         if(!this.hadInit){
           this.hadInit=true
         }
        },
    onEpicFeaturesRowClick(menu, checked) {
      if (checked == false) {
        this.parentMenu = null
      } else {
        this.parentMenu = menu
      }
    },
    onProductSelected(product) {
      this.product = product
      this.parentMenu = null
    },
    onProductClearSelect() {
      this.product = null
      this.parentMenu = null
    },
    onImportTemplate(){
      this.$refs['tree']?.refresh()
    },
    onTreeImportTemplate(parentMenu){
      this.parentMenu=parentMenu
    }
  }, //end method
  mounted() {
    this.product = { ...this.xmProduct }
    if (this.xmIteration && this.xmIteration.id) {
      if (!this.xmProduct || !this.xmProduct.id) {
        this.product = {
          id: this.xmIteration.productId,
          productName: this.xmIteration.productName
        }
      }
    } 
    if((this.product && this.product.id)){
      this.toggle=true
      this.hadInit=false
    }else{
      this.toggle=false
      this.hadInit=true
    }
  } //end mounted
}
</script>

<style lang="less" scoped />
