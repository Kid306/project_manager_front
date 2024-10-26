<template>
   <mdp-select-table :key="xmProduct?.id+'_'+selProject?.id" v-model="myVal" ref="select" :width="width" :init-name="initName" :clearable="clearable" :loadFun="listXmTestCasedb"  :initLoad="initLoad" :displayLoad="displayLoad" :show-style="showStyle" :placeholder="placeholder" :columnCfgs="[{property:'id',label:'测试库编号'},{property:'name',label:'测试库名称'}]" @change2="onChange2" @change3="onChange3" @clear="onClear" @change="onChange" @click="onRowClick" :disabled="disabled" title="测试库">
      <template #toolbar> <el-button  icon="search" @click="$refs['tableDialog'].open()">更多</el-button></template>
    </mdp-select-table>  
     <mdp-dialog ref="tableDialog" width="90%">
      <template #default = "{dialog}">
        <XmTestCasedbMng subOpType="select" 
        :xmProduct="xmProduct"
        :selProject="selProject"
        :multiple="multiple"
          @cancel="dialog.close()"
          @select="onTableDataSelect"
         />
      </template>
    </mdp-dialog> 
</template>

<script>
 import { listXmTestCasedb } from '@/api/xm/core/xmTestCasedb';

import { mapState } from 'pinia'
import { useUserStore } from '@/store/modules/user'
 
// 在 Vue 3 中，可以使用 defineAsyncComponent 方法来创建异步组件
import { defineAsyncComponent } from 'vue';
 
// 创建一个异步组件，它会从一个外部API动态导入组件
const XmTestCasedbMng = defineAsyncComponent(() =>
  import('../xmTestCasedb/XmTestCasedbMng.vue') // 假设LazyComponent.vue是你想要懒加载的组件
);
 
export default {
  components: { XmTestCasedbMng },
  name: 'XmTestCasedbSelect',
  computed:{
    myVal:{
      set(val){
        this.$emit('update:modelValue',val)
      },
      get(){
        return this.modelValue
      }
    }
  },
  props:{  
    xmProduct:Object,
    selProject: Object, 
    multiple: Boolean,
    placeholder:{
      type:String,
      default:"用例库"
    },
    modelValue:{
      type:String,
      default:null,
    }, 
    disabled:{
      type:Boolean,
      default:false
    },
    showStyle:{
      type:String,
      default:'origin'
    },
    width:{
      type: String,
      default: null
    },   
    clearable:{
      type:Boolean,
      default:true,
    },
    /**
    * 当tag 模式下，定位出问题后，设置此参数可解决问题
    */
    relative:{
      type: Boolean,
      default: false
    },
    /**
     * 初始化时，如果已知名称，用此属性可以反显
     */
    initName:{
      type: [String,Array],
      default: null
    },
    
    /**
     * 初始化时，initLoad=true将进行远程调用，否则不进行远程调用
     */
     initLoad:{
      type: Boolean,
      default: false
    },
    /**
    * 是否根据modelValue值变化进行远程调用加载数据进行名字反显。用于只知道id，不知道name的情况下，自动反显所用。
    * 当initName有值时，该参数无效
    */
    displayLoad:{
      type: Boolean,
      default: false,
    }
  },
  data(){
    return {  
    }
  },
  methods:{  
    listXmTestCasedb,
    onTableDataSelect(row){ 
      this.$refs['select'].onTableDataSelect(row)
      this.$refs['tableDialog'].close();
    },
    onChange2(row){ 
      
      this.$emit("select", row); 
      this.$emit("change2", row);
    },
    
    onChange3(row){ 
        this.$emit("change3", row);
      },
    onChange(val){  
      this.$emit("change", val); 
    },
    onClear(){ 
      this.$emit("clear");
    },
    onRowClick(row){
      this.$emit('row-click',row)
    }
  },
  mounted(){ 
  }, 
}
</script>
<style lang="scss" scoped /> 
  
