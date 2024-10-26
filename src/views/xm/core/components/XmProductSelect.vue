<template>  
   <mdp-select-table :key="linkProjectId+'_'+isTpl" v-model="myVal"  :initLoad="initLoad" :init-name="initName" :displayLoad="displayLoad"  :width="width" :clearable="clearable" ref="select" :show-style="showStyle" :placeholder="placeholder" :columnCfgs="[{property:'id',label:'产品编号'},{property:'productName',label:'产品名称'}]" :load-fun="listXmProductWithState" :params="{linkProjectId:linkProjectId,isTpl:(isTpl?'1':'')}" @change2="onChange2" @change3="onChange3" @clear="onClear" @change="onChange" @click="onRowClick" :disabled="disabled"  title="产品">
      <template #toolbar><el-button  icon="plus" @click="$refs['addDialog'].open()">创建产品</el-button><el-button  icon="search" @click="$refs['select'].$refs['tableDialog'].open()">更多产品</el-button></template>
   </mdp-select-table> 
   
   <mdp-dialog ref="addDialog">
    <template #default = "{visible,dialog}">
      <xm-product-add sub-op-type="add"
        :visible="visible"
        :sel-project="{ id: linkProjectId, name: '' }"
        @cancel="dialog.close()"
        @submit="afterAddSubmit"
      /> 
    </template>
  </mdp-dialog> 
</template> 

<script>  

 import { listXmProductWithState } from "@/api/xm/core/xmProduct";
import XmProductAdd from "../xmProduct/XmProductEdit.vue";
export default {
  components: { XmProductAdd }, 
  emits:['change','change2','change3','row-click','clear','select'],
  name: 'xm-product-select',
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
    /**
     * 项目编号
     */
      linkProjectId:{
      type:String,
      default:null,
    }, 
    placeholder:{
      type:String,
      default:"产品"
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
    isTpl:{
      type: Boolean,
      default: null
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
      default: true
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
    listXmProductWithState, 
    afterAddSubmit(row){  
      this.$refs['select'].onTableDataSelect(this.multiple?[row]:row)
      this.$refs['addDialog'].close();
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
  