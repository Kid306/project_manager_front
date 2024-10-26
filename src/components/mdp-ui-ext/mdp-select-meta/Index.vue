<template> 
    <mdp-select-table v-model="myVal" ref="select" :relative="relative" :initName="initName" :initLoad="initLoad" :displayLoad="displayLoad" :multiple="multiple" :width="width" :split="split" :init-name="initName" :show-style="showStyle" :placeholder="placeholder" :columnCfgs="[{property:'id',label:'字典编号'},{property:'itemName',label:'字典名称'}]" :load-fun="$mdp.listItem"  @change2="onChange2" @clear="onClear" @change="onChange" @click="onRowClick" :disabled="disabled">
      <template #toolbar> <el-button type="primary" plain  icon="search" @click="$refs['tableDialog'].open()">字典列表</el-button></template>
   </mdp-select-table> 
      
      <mdp-dialog ref="tableDialog" title="选择字典" width="80%">
          <template #default="{visible}">
            <MdpMetaItem :visible="visible" :multiple="multiple" :subOpType="'select'" @select="onConfirm" @loadDatas="onTableLoadDatas"/>
          </template>
        </mdp-dialog>  
    </template> 
    
    <script> 
    import {MdpSelectMixin } from "../../mdp-ui/mixin/MdpSelectMixin.js"
    import MdpMetaItem from './../mdp-meta-item/Index.vue'
    export default {
  components: { MdpMetaItem },
  name: 'MdpSelectMeta', 
  props:{  
    placeholder:{
      type:String,
      default:"字典"
    },
    modelValue:{
      type:String,
      default:null,
    }, 
    showStyle:{
      type:String,
      default:'origin'
    },
    multiple:{
      type: Boolean,
      default: false
    },
    disabled:{
      type: Boolean,
      default:false
    },
    width:{
      type: String,
      default: null
    },
    split:{
      type: String,
      default:null,
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
  data(){
    return { 
    }
  },
  methods:{ 
    afterAddSubmit(row){  
      this.$refs['select'].onTableDataSelect(this.multiple?[row]:row)
    },
    
    onConfirm(row){  
      this.$refs['select'].onTableDataSelect(row)
      this.$refs['tableDialog'].close()
    },
    onChange2(row){ 
      
      this.$emit("selected", row); 
      this.$emit("change2", row);
    },
    onChange(val){ 
      this.$emit("change", val);
      this.$emit("input",val);
    },
    onClear(){ 
      this.$emit("clear");
    },
    onRowClick(row){
      this.$emit('row-click',row)
    }, 
    onTableLoadDatas(res){
      this.$refs['select'].onTableLoadDatas(res)
    }
  },
  mounted(){ 
  },
  
  beforeUnmount(){ 
   }
}
</script>
<style lang="scss" scoped>   
</style> 
    