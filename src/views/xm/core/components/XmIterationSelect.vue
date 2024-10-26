<template>  
     <mdp-select-table :key="linkProjectId+'_'+xmProduct?.id" v-model="myVal"  :initLoad="initLoad" :displayLoad="displayLoad" ref="select" :width="width" :clearable="clearable" :show-style="showStyle" :placeholder="placeholder"  :columnCfgs="[{property:'id',label:'迭代编号'},{property:'iterationName',label:'迭代名称'}]"  :load-fun="listXmIterationWithState" :params="{linkProjectId:linkProjectId,productId:xmProduct?.id}" @change2="onChange2" @change3="onChange3" @clear="onClear" @change="onChange" @click="onRowClick" :disabled="disabled"  title="迭代">
        <template #toolbar><el-button  icon="plus" @click="$refs['addDialog'].open()">创建迭代</el-button><el-button  icon="search" @click="$refs['select'].$refs['tableDialog'].open()">更多迭代</el-button></template>
     </mdp-select-table> 
     
     <mdp-dialog ref="addDialog">
      <template #default = "{visible,dialog}">
        <xm-iteration-add sub-op-type="add"
          :visible="visible"
          :sel-project="{ id: linkProjectId, name: '' }"
          :xm-product="xmProduct"
          @cancel="dialog.close()"
          @submit="afterAddSubmit"
         />
      </template>
    </mdp-dialog> 
  </template> 
  
  <script>  
  
   import { listXmIterationWithState } from "@/api/xm/core/xmIteration";
  import XmIterationAdd from "../xmIteration/XmIterationEdit.vue";
  export default {
    components: { XmIterationAdd },
    name: 'xm-iteration-select',
    emits:['change','change2','change3','row-click','clear','select'],
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
      xmProduct:{
        type:Object,
        default:()=>null,
      },
      placeholder:{
        type:String,
        default:"迭代"
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
      listXmIterationWithState, 
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
  <style lang="scss" scoped>   
  
  </style> 
    