<template>    
<span style="width:100%;"> 
    <span :class="showStyle=='x'?{'field-box-x':true}:{'field-box':true}"  @click="showSelect">  
      <slot> 
        <span class="field-info"  :class="{disabled:disabled===true,enabled:disabled!==true}"> 
          <slot v-if="showStyle=='x'" class="field-avater" name="avater" :value="myVal" :field="{label:label,color:color,icon:icon,disabled:disabled,clearable:clearable}" >
            <el-avatar :size="size" :class="{'dashed-circle':avaterCpd.isNull,disabled:disabled===true,enabled:disabled!==true}" :icon="avaterCpd.icon" :style="{backgroundColor:avaterCpd.color}">{{formatImgFront(avaterCpd.innerText)}}</el-avatar>  
          </slot>
          <slot name="info" :value="myVal" :field="{label:label,color:color,icon:icon,disabled:disabled,clearable:clearable}">
            <span v-if="showStyle=='x'" class="info-box">
              <div class="field-value">
                <slot name="value" :value="myVal" :field="{label:label,color:color,icon:icon,disabled:disabled,clearable:clearable}">
                  <div  v-if="!avaterCpd.isNull" :style="{width:width?width:'100px'}">  <el-text truncated> {{avaterCpd.innerText}} </el-text></div> 
                  <div v-else class="label-font-color">无</div>
                </slot> 
              </div>  
              <div class="field-label" >
                <slot name="label"> {{label}}</slot> 
              </div>   
            </span>
            <span v-else>
              <div  class="field-value">
                <slot name="value" :value="myVal" :field="{label:label,color:color,icon:icon,disabled:disabled,clearable:clearable}">
                  <div  v-if="!avaterCpd.isNull" :style="{width:width?width:'100px'}"><el-text truncated> {{avaterCpd.innerText}} </el-text></div> 
                  <div v-else class="label-font-color">无</div>
                </slot> 
              </div>
            </span>
          </slot> 
        </span>  
        <div class="field-oper-box">
        <span class="field-oper" ref="operRef"  :class="{disabled:disabled===true,enabled:disabled!==true}"> 
          <slot name="oper"   :value="myVal" :field="{label:label,color:color,icon:icon,disabled:disabled,clearable:clearable}">
            <el-input v-model="myVal" :placeholder="placeholder" @change="onChange"/>
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
    name: 'MdpFieldX',
    mixins:[MdpFieldMixin], 
  }
  </script>
  

<style lang="scss" scoped>  
    @import url('../index.scss');
</style> 
  