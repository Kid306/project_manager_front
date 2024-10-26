<template> 
  <span style="width:100%;"> 
     <el-date-picker v-if="showStyle=='origin'||showStyle==''||!showStyle" :type="type" :style="styleObj"  v-model="dateRange" :value-format="valueFormat" :format="format" 
      unlink-panels 
      :range-separator="rangeSepaSrator"
      :start-placeholder="startPlaceholder"
      :end-placeholder="endPlaceholder"  
      @change="onDateRangeChange"   
      :shortcuts="shortcutsCpd"  
      />    
   <span v-else :class="showStyle=='x'?{'field-box-x':true}:{'field-box':true}" >  

    <span class="field-info"  :class="{disabled:disabled===true,enabled:disabled!==true}">
      <slot  name="avater" v-if="showStyle=='x'" > 
        <el-avatar :size="size"  :class="{'field-avater':true,'dashed-circle':avaterCpd.isNull,disabled:disabled===true,enabled:disabled!==true}"  :icon="avaterCpd.isNull?'calendar':''" :style="{backgroundColor:avaterCpd.color}">{{ formatImgFront(avaterCpd.innerText) }}</el-avatar> 
       </slot> 
      <slot name="info" :value="dateRange" > 
        <span v-if="showStyle=='x'" class="info-box">
          <div class="field-value">
            <slot name="value"> 
              <div  v-if="!avaterCpd.isNull" class="w-100px"><el-text truncated>{{avaterCpd.innerText}}</el-text></div> 
              <div v-else class="label-font-color">无</div>
            </slot> 
          </div> 
          <div class="field-label">
              <slot name="label">{{label||'请选择日期'}}</slot>
          </div>  
        </span>
        <span v-else class="field-value">
          <slot name="value" :value="dateRange" :field="{label:label,color:color,icon:icon,disabled:disabled,clearable:clearable}">
            <div  v-if="!avaterCpd.isNull">{{avaterCpd.innerText}}</div> 
            <div v-else class="label-font-color">无</div>
          </slot> 
        </span> 
      </slot>  
    </span>   
    
    <span class="field-oper-box">
    <span v-if="disabled!==true" class="field-oper"  :class="{disabled:disabled===true,enabled:disabled!==true}">
          
        <el-date-picker :type="type" :style="styleObj"  v-model="dateRange" :value-format="valueFormat" :format="format" 
            unlink-panels 
            :range-separator="rangeSepaSrator"
            :start-placeholder="startPlaceholder"
            :end-placeholder="endPlaceholder" 
            @change="onDateRangeChange"  
            :shortcuts="shortcutsCpd" 
            />  
    </span>
    </span>
  </span>  
  </span>
</template>

<script> 
import moment from 'moment'
import util from '../js/util.js' 
import {MdpFieldMixin} from "../mixin/MdpFieldMixin.js"  

export default {
  name: 'mdp-date-range',  
  mixins:[MdpFieldMixin],    
  computed: {
        avaterCpd(){  
            var isEmpty=!this.dateRange||this.dateRange.length==0
            var obj={isNull:isEmpty,icon:this.icon?this.icon:'full-screen',color:this.color?this.color:'#E4E7ED',innerText:'-'} 
            if(isEmpty){
                return obj;
            }else{
                if(this.color){
                    obj.color=this.color
                }else{
                    obj.color= this.getColorByValue(this.dateRange) 
                }

                if(this.icon){
                    obj.icon=this.icon
                }else{
                    obj.icon='calendar'
                } 
                obj.innerText=this.formatDateRange(this.dateRange)
            } 
            return obj;
        },  
     modelValueCpd(){
      if(this.startKey){
        if(!this.modelValue){
          return null
        }else{
          return (this.modelValue[this.startKey]||"")+(this.modelValue[this.endKey]||"")
        }
      }else{
        return this.modelValue
      }
     },
    shortcutsCpd(){
      if(!this.shortcuts){
        return this.shortcuts
      }else{
        return util.getPickerOptions(this.type)
      }
    },

     
  },
  data(){
      return { 
        dateRange:['',''],  
      }
  },
  watch:{  
    modelValueCpd(v,o){
      this.dateRange=this.getValue()
    }
  },
  props: {
    
      showAvater:{
          type:Boolean,
          default:true,
      },
      disabled:{
        type:Boolean,
        default:false,
      },
    modelValue: {
      type: Object,Array,
      default: function(){
        return null
      }
    }, 
    label:{
      type:String,
      default:'起止时间',
    },
    /**
     *  'datetimerange' | 'daterange' | 'monthrange'
     */
    type: {
      type: String,
      default: 'daterange'
    }, 
    startKey: {
      type: String,
      default: null
    }, 
     
    styleObj:{
        typeof:Object,
        default:function(){return { maxWidth:'100%' }}
    },
    
    endKey: {
      type: String,
      default: null
    }, 
    
    valueFormat: {
      type: String,
      default: 'YYYY-MM-DD HH:mm:ss'
    }, 
    
    format: {
      type: String,
      default: 'YYYY-MM-DD'
    }, 
    startPlaceholder: {
      type: String,
      default: '开始日期'
    }, 
    
    endPlaceholder: {
      type: String,
      default: '结束日期'
    }, 
    rangeSepaSrator:{ 
      type: String,
      default: '~'
    },
    shortcuts:{
        typeof:Array,
        default:()=>{
          return []
        }
    },
    autoDefault:{
        type:Boolean,
        default:false,
    },
    defaultRange:{
        type:Array,
        default:function(){
            return []
        }
    },
    icon:{
      type:String,
      default:'ep:calendar'
    }
  },
  methods: {  
    setValue(val){  
            var mv={}
            if(this.startKey){ 
              var start=null
              var end=null
              if(!val){
                start=null
                end=null
              }else{
                if(val.length>1){
                  start=val[0]
                  end=val[1]
                }else if(val.length>0){
                  start=val[0]
                }
                if(!start){
                  start=null
                }
                if(!end){
                  end=null
                }
              }
              var mvStart=null;
              var mvEnd=null
              if(this.modelValue){
                mvStart=this.modelValue[this.startKey]
                mvEnd=this.modelValue[this.endKey]
              }
              if(!mvStart){
                mvStart=null
              }
              if(!mvEnd){
                mvEnd=null
              }
              if(start==mvStart && end==mvEnd){
                return;
              }
              mv[this.startKey]=start
              mv[this.endKey]=end
              if(!this.modelValue){
                  this.$emit('change',mv)
                  this.$emit('change2',mv)
                  this.$emit('update:modelValue',mv)
              }else{
                var m2=this.modelValue
                Object.assign(m2,mv)
                this.$emit('update:modelValue',m2)
                this.$emit('change',mv)
                this.$emit('change2',m2)
              } 
            }else{
              if(!val && !this.modelValue){
                return;
              }
              this.$emit('change',val)
              this.$emit('change2',val)
              this.$emit('update:modelValue',val)
            } 
    },
    getValue(){ 
            if(this.startKey){
              if(this.modelValue){
                return [this.modelValue[this.startKey]||'',this.modelValue[this.endKey]||'']
              }else{
                return ['','']
              }
            }else{
              if(this.modelValue){
                return this.modelValue
              }else{
                return ['','']
              } 
            } 
    },
    getDefaultValue(){ 
      if(this.autoDefault){
          var defaultValue=[]
          var defaultRange=this.defaultRange 
          if(this.type=='monthrange'){
              mtype="months"
              if(!defaultRange||defaultRange.length<=0){ 
                defaultRange=[-1,1]
              }
              var start=moment().add(defaultRange[0],'months').startOf('month')
              var end = moment().add(defaultRange[1],'months').endOf('month')
              defaultValue=[start,end]
          }else{
            if(!defaultRange||defaultRange.length<=0){ 
                defaultRange=[-15,15]
            }
            var start=moment().add(defaultRange[0],'days').startOf('day')
            var end = moment().add(defaultRange[1],'days').endOf('day')
            defaultValue=[start,end]
          } 
          return defaultValue
        }else{
          return null
        }
    },
      formatDateRange(myVal){
        if(!myVal||myVal.length==0){
          return "-"
        }else{
          if(myVal.length==1){
            return util.formatDate(new Date(myVal[0]),this.format)
          }else if(myVal.length==2){
             return (myVal[0]?util.formatDate(new Date(myVal[0]),this.format):'')+this.rangeSepaSrator+(myVal[1]?util.formatDate(new Date(myVal[1]),this.format):'')
          }
        }
      },
      initData(){ 
        var isNull=this.isNull()
        if(isNull){ 
          var defaultValue=this.getDefaultValue()
          if(defaultValue && defaultValue.length>1){
            this.dateRange=[util.formatDate(defaultValue[0]),util.formatDate(defaultValue[1])] 
            this.setValue(this.dateRange)
            this.$emit('init')
          }
        }else{
          this.dateRange=this.getValue()
        }
      },
      isNull(){
        if(!this.modelValue){
          return true
        }else{
          if(this.startKey){
            if(!this.modelValue[this.startKey]){
              return true
            }
          }else{
            if(Array.isArray(this.modelValue)){
              if(this.modelValue.length<=0){
                return true
              }else if(!this.modelValue[0] && !this.modelValue[1]){
                return true
              }
            }else if(this.modelValue.length<=0){
              return true
            }
          }
        }
        return false
      },
      onDateRangeChange(dates){  
        this.setValue(dates)
      }, 
  },
  mounted(){
      this.initData();
  }
}
</script>

<style lang="scss" scoped>  
  @import url('../index.scss');
</style>
