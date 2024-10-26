<template>    
  <span style="width:100%;"> 
               <el-input v-if="showStyle=='origin'||showStyle==''||!showStyle" :disabled="disabled"  v-model="myVal" :placeholder="placeholder" :min="min" :max="max" :size="size" :step="step" :resize="resize" :readonly="readonly" :type="type" :autosize="autosize" :rows="rows" @change="onChange"/>
 						<span v-else :class="showStyle=='x'?{'field-box-x':true}:{'field-box':true}" @click="showSelect">  
              <slot> 
              <span class="field-info"  :class="{enabled:!(disabled||readonly)}"> 
                
                <slot v-if="showStyle=='x'" name="avater" :value="myVal" :field="{label:label,color:color,icon:icon,disabled:disabled,clearable:clearable}" >
                     <el-avatar  :class="{'field-avater':true,'dashed-circle':avaterCpd.isNull,disabled:disabled===true,enabled:disabled!==true}" :icon="avaterCpd.icon" :style="{backgroundColor:avaterCpd.color}">{{formatImgFront(avaterCpd.innerText)}}</el-avatar>  
                 </slot>
                <slot name="info" v-if="showStyle=='x'">
                  <span class="info-box">
                  <span class="field-value">
                    <slot name="value" :value="myVal" :field="{label:label,color:color,icon:icon,disabled:disabled,clearable:clearable}">
                      <span  v-if="!avaterCpd.isNull">{{avaterCpd.innerText}}</span> 
                      <span v-else class="label-font-color">无</span>
                    </slot> 
                  </span>  
                    <span class="field-label" >
                      <slot name="label"> {{label}}</slot> 
                    </span>
                    
                </span>   
                </slot>
                <slot name="info" v-else>
                    <slot name="value" :value="myVal" :field="{label:label,color:color,icon:icon,disabled:disabled,clearable:clearable}">
                      <span  v-if="!avaterCpd.isNull">{{avaterCpd.innerText}}</span> 
                      <span v-else class="label-font-color">无</span>
                    </slot> 
                </slot>
							</span>  
              <div class="field-oper-box">
              <span class="field-oper" ref="operRef"  :class="{disabled:disabled===true,enabled:disabled!==true}"> 
                      <slot name="oper"   :value="myVal" :field="{label:label,color:color,icon:icon,disabled:disabled,clearable:clearable}">
                        <el-input v-model="myVal" :disabled="disabled" :placeholder="placeholder" :min="min" :max="max" :size="size" :step="step" :resize="resize" :readonly="readonly" :type="type" :autosize="autosize" :rows="rows" @change="onChange" />
                      </slot>  
              </span>  
            </div>
              </slot>
						</span> 
            </span>
  </template>
  
  <script> 


import {MdpFieldMixin} from "../mixin/MdpFieldMixin.js" 
  export default {
    name: 'mdp-number-x',
    mixins:[MdpFieldMixin], 
    props:{
      /**
       * text，textarea 和其他 原生 input 的 type 值
       */
       type:{
        type:String,
        default:'text'
      },
      /**
       * 最小值
       */
      min:{
        type:Number,
        default:null,
      },
      
      /**
       * 输入框行数，只对 type="textarea" 有效	
       */
       rows:{
        type:Number,
        default:2,
      },
      
      
      /**
       * 最大值
       */
       max:{
        type:Number,
        default:null,
      },
      /**
       * 步长
       */
       step:{
        type:Number,
        default:null,
      },  
      /**
       * 自适应内容高度，只对 type="textarea" 有效，可传入对象，如，{ minRows: 2, maxRows: 6 }
       */
      autosize:{
        type:Boolean,Object,
        default: false,
      },
      /**
       * 是否只读
       */
       readonly	:{
        type:Boolean,
        default:false,
      },
      /**
       * 控制是否能被用户缩放	
       * none, both, horizontal, vertical	
       */
       resize	:{
        type:String,
        default:null,
      }, 
    },
    methods:{ 
    }
  }
  </script>
  

<style lang="scss" scoped>  
    @import url('../index.scss');
</style> 
  