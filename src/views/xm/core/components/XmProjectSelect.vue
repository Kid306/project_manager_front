<template>   
     <mdp-select-table :key="linkProductId" v-model="myVal" ref="select" :init-name="initName" :initLoad="initLoad" :displayLoad="displayLoad" :width="width" :clearable="clearable" :show-style="showStyle" :placeholder="placeholder" :columnCfgs="[{property:'id',label:'项目编号'},{property:'name',label:'项目名称'}]" :load-fun="listXmProject" :params="{linkProductId:linkProductId,isTpl:(isTpl?'1':'')}" @change2="onChange2" @change3="onChange3" @clear="onClear" @change="onChange" @click="onRowClick" :disabled="disabled" title="项目">
      <template #toolbar><el-button  icon="plus" @click="$refs['addDialog'].open()">创建项目</el-button><el-button  icon="search" @click="$refs['select'].$refs['tableDialog'].open()">更多项目</el-button></template>
    </mdp-select-table>  
     <mdp-dialog ref="addDialog" style="width:100%;">
      <template #default = "{visible,dialog}">
        <xm-project-add sub-op-type="add"
          :visible="visible"
          :xm-product="{ id: linkProductId, name: '' }"
          @cancel="dialog.close()"
          @submit="afterAddSubmit"
         />
      </template>
    </mdp-dialog> 
  </template> 
  
  <script>  
  
   import { listXmProject } from "@/api/xm/core/xmProject";
  import XmProjectAdd from "../xmProject/XmProjectEdit.vue";
  export default {
    components: { XmProjectAdd },
    name: 'xm-project-select',
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
        linkProductId:{
        type:String,
        default:null,
      }, 
      placeholder:{
        type:String,
        default:"项目"
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
      listXmProject, 
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
  <style lang="less" scoped>   
  
  </style> 
    