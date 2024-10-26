<template>
  <span style="width:100%;"> 
  <el-date-picker v-if="showStyle == 'origin' || showStyle == '' || !showStyle" v-model="myVal" :value-format="valueFormat"
    :format="format" @change="onChange" :type="type" :shortcuts="shortcutsCpd" :disabled="disabled" />

  <span v-else :class="showStyle == 'x' ? { 'field-box-x': true } : { 'field-box': true }" @click="showSelect">
    <slot>
      <span class="field-info" :class="{ disabled: disabled === true, enabled: disabled !== true }">

        <slot v-if="showStyle == 'x'" name="avater" :value="myVal"
          :field="{ label: label, color: color, icon: icon, disabled: disabled, clearable: clearable }">
           <el-avatar
            :class="{ 'field-avater': true, 'dashed-circle': avaterCpd.isNull, disabled: disabled === true, enabled: disabled !== true }"
             :icon="avaterCpd.isNull?'calendar':''"
            :style="{ backgroundColor: avaterCpd.color }">{{ formatImgFront(avaterCpd.innerText) }}</el-avatar>
         </slot>
        <slot name="info">
          <span v-if="showStyle == 'x'" class="info-box">
            <div class="field-value">
              <slot name="value" :value="myVal"
                :field="{ label: label, color: color, icon: icon, disabled: disabled, clearable: clearable }">
                <div v-if="!avaterCpd.isNull" class="w-100px"><el-text truncated>{{ avaterCpd.innerText }}</el-text></div>
                <div v-else class="label-font-color">无</div>
              </slot>
            </div>
            <div class="field-label">
              <slot name="label"> {{ label }}</slot>
            </div>
          </span>
          <span v-else>
            <slot name="value" :value="myVal"
              :field="{ label: label, color: color, icon: icon, disabled: disabled, clearable: clearable }">
              <div v-if="!avaterCpd.isNull">{{ avaterCpd.innerText }}</div>
              <div v-else class="label-font-color">无</div>
            </slot>
          </span>
        </slot>
      </span>
      <div class="field-oper-box">
      <span class="field-oper" ref="operRef" :class="{ disabled: disabled === true, enabled: disabled !== true }">
        <slot name="oper" :value="myVal"
          :field="{ label: label, color: color, icon: icon, disabled: disabled, clearable: clearable }">
          <el-date-picker v-model="myVal" :value-format="valueFormat" :format="format" :type="type" @change="onChange"
            :disabled="disabled" :shortcuts="shortcutsCpd" />
        </slot>
      </span>
    </div>
    </slot>
  </span>
  </span>
</template>
    
<script>

import util from '@/components/mdp-ui/js/util';//全局公共库

import { MdpFieldMixin } from "../mixin/MdpFieldMixin.js"
import moment from 'moment';
export default {
  name: 'mdp-date',
  mixins: [MdpFieldMixin],
  computed: {

    avaterCpd() {
      var isEmpty = !this.myVal || this.myVal.length == 0
      var obj = { isNull: isEmpty, icon: this.icon ? this.icon : 'full-screen', color: this.color ? this.color : '#E4E7ED', innerText: '-' }
      if (isEmpty) {
        return obj;
      } else {
        if (this.color) {
          obj.color = this.color
        } else {
          obj.color = this.getColorByValue(this.myVal)
        }

        if (this.icon) {
          obj.icon = this.icon
        } else {
          obj.icon = 'calendar'
        }
        obj.innerText = this.formatDate(this.myVal)
      }
      return obj;
    },
    shortcutsCpd(){
      if(!this.shortcuts){
        return this.shortcuts
      }else{
        return util.getPickerOptions(this.type)
      }
    }
  },
  props: {
    modelValue:{
      type: String,Date,
      default: null,
    },
    /**
     * 'year' | 'years' |'month' | 'date' | 'dates' | 'datetime' | 'week' |
     */
    type: {
      type: String,
      default: 'date'
    },
    showAvater: {
      type: Boolean,
      default: true,
    },
    valueFormat: {
      type: String,
      default: 'YYYY-MM-DD HH:mm:ss'
    },
    defaultValue:{
      type: Date,
      default: ()=>{
        return null
      }
    },
    autoDefault:{
        type:Boolean,
        default:false,
    },
    format: {
      type: String,
      default: 'YYYY-MM-DD'
    },
    shortcuts: {
      type: Array,
      default: () => { return [] }
    },
  },
  methods: {
    getDefaultValue(){ 
      if(this.autoDefault){ 
          if(!this.defaultValue){
            return moment()
          }else{
            return this.defaultValue
          } 
        }else{
          return this.defaultValue
        }
    },
    formatDate(myVal) {
      if (!myVal || myVal.length == 0) {
        return "-"
      } else {
        if (myVal instanceof Date) {
          return util.formatDate(myVal, this.format)
        } else {
          return util.formatDate(new Date(myVal), this.format)
        }
      }
    },
    initData(){ 
        var isNull=!this.modelValue
        if(isNull){ 
          var defaultValue=this.getDefaultValue()
          if(defaultValue){
             this.myVal=util.formatDate(defaultValue,this.valueFormat)
             this.$emit('init')
          }
        }
      },
  },
  mounted() {
  }
}
</script>
    
  
<style lang="scss" scoped>  @import url('../index.scss');</style> 
    