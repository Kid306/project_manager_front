<template>  
<MdpSelectTable :relative="relative" :initName="initName" :initLoad="initLoad" :displayLoad="displayLoad" :label="label" :width="width" :placeholder="placeholder" :show-style="showStyle" ref="select" v-model="myVal" :loadFun="$mdp.listBranch" :props="{id:'id',name:'branchName'}" @change2="(e)=>$emit('change2',e)" @change="(e)=>$emit('change',e)" :multiple="multiple" :split="split" :disabled="disabled" />
</template> 

<script>   
export default { 
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
  name: 'MdpSelectBranch',
  props:{   
    modelValue:{
      type: String,Array,
      default: null
    },
    multiple:{
      type: Boolean,
      default: false
    },
    showStyle:{
      type:String,
      default:'origin'
    },
    label:{
      type:String,
      default: '机构'
    },
    placeholder:{
      type:String,
      default: '机构'
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
  data(){
    return {
    }
  },
  methods:{
    
    onTableDataSelect(datas){  
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
