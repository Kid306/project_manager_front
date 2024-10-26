<template>  
  <MdpSelectTable :relative="relative" :initName="initName" :initLoad="initLoad" :displayLoad="displayLoad" :label="label" :placeholder="placeholder" :width="width" :limit="limit" :disabled="disabled" :show-style="showStyle" ref="select" v-model="myVal" :loadFun="$mdp.getAllTag" :columnCfgs="[{property:'tagId',label:'标签编号'},{property:'tagName',label:'标签名称'}]" @change2="(e)=>$emit('change2',e)" @change="(e)=>$emit('change',e)" :multiple="multiple" :split="split">
    <template #toolbar>
      <el-button   icon="search" @click="$refs['tableDialog'].open()" type="primary" plain title="查找更多标签"/>
     </template>
  </MdpSelectTable>
    <mdp-dialog ref="tableDialog" title="选择标签" width="80%">
        <template #default="{visible}">
          <tag-select :visible="visible" sub-op-type="select" :multiple="multiple" @select="onTableDataSelect" @loadDatas="onTableLoadDatas"/>
        </template>
      </mdp-dialog>  
  </template> 
  
  <script> 
  import TagSelect from './TagSelect.vue'
  export default {
    components: { TagSelect },
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
    name: 'MdpSelectTag',
    props:{   
      modelValue:{
        type: [String,Array],
        default: null
      },
      multiple:{
        type: Boolean,
        default: false
      },
      split:{
        type: String,
        default:null,
      },
      showStyle:{
        type:String,
        default:'origin'
      },
      label:{
        type:String,
        default: '标签'
      },
      placeholder:{
        type:String,
        default: '标签'
      },
      disabled:{
        type: Boolean,
        default:false
      },
      width:{
        type: String,
        default: null
      },
      limit:{
        type: Number,
        default:3
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
      
      onTableDataSelect(datas){  
        if(!datas){
          return;
        }else{
          if(this.multiple){
            if(Array.isArray(datas)){
              if(datas.length>this.limit){
                this.$message.error("最多能选择"+this.limit+"个标签")
                return;
              }
            } 
          }
          
        }
        this.$refs['select'].onTableDataSelect(datas)
        this.$refs['tableDialog'].close();
      }, 
      onTableLoadDatas(res){
        this.$refs['select'].onTableLoadDatas(res)
      }
    },
    mounted(){ 
        
        
    },
  }
  </script>
  <style lang="scss" scoped>  
    @import '../../mdp-ui/index.scss';
  </style> 
  