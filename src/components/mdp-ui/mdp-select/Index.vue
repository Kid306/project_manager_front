<template> 
<span style="width:99%;"> 
  <span v-if="showStyle=='origin'||showStyle==''||!showStyle" :title="title">
    <el-select v-if="showType=='select'" :style="{width:width?width:'auto'}" :multiple-limit="limit" :no-data-text="noDataText" :no-match-text="noMatchText" :popper-class="popperClass" :reserve-keyword="reserveKeyword" :size="size" :multiple="multiple" :placeholder="placeholder" :disabled="disabled"  class="my-select" ref="selectRef" v-model="myVal" @change="onChange" :clearable="clearable" @visible-change="$emit('visible-change',$event)" @focus="$emit('focus',$event)" @blur="$emit('blur',$event)" @clear="$emit('clear',$event)" @click="$emit('click',$event)" @remove-tag="$emit('remove-tag',$event)" append-to-body>
          
            <el-option disabled value="" style="height:40px;">
              <slot name="toolbar">
                <div><el-button v-if="itemCode" @click.stop="$refs['mdpMetaDialog'].open({itemCode:itemCode})" icon="setting" type="primary" plain title="如果没有数据，请去配置字典" />
                  <el-button type="warning" icon="refresh" @click="doRefresh()" plain title="从后台重新加载，刷新数据"/>
                  <slot name="toolbarExt">

                  </slot>
                </div>
              </slot>
            </el-option>
            <slot name="options" :options="optionsCpd" :item="item">

                <el-option :style="styleObj" v-for="(option,index) in optionsCpd" :key="index" :value="option[propsCpd['id']]" :label="option[propsCpd['name']]"> 
                 <span :style="{backgroundColor:getMyColor(option),color:'white'}" class="padding">  
                              <Icon v-if="option.icon" :icon="option.icon"/> 
                            {{option[propsCpd['name']]}}
                        </span>  
                        <Icon v-if="isCheck(option)" icon="ep:check" color="blue"/> 
                        <i v-else>&nbsp;&nbsp;</i> 
                </el-option>
                
            </slot>
    </el-select>  
    <span v-else-if="showType=='radio'">
        <el-radio :size="size" v-for="(option,index) in optionsCpd" v-model="myVal" :label="option.id" :key="index" @change="onChange" @focus="$emit('focus',$event)" @blur="$emit('blur',$event)" @clear="$emit('clear',$event)" @click="$emit('click',$event)">{{ option[propsCpd['name']] }}</el-radio> 
    </span>
    <span v-else-if="showType=='checkbox' && multiple==true">  
        <el-checkbox-group :size="size" v-model="myVal" @change="onChange" @focus="$emit('focus',$event)" @blur="$emit('blur',$event)" @clear="$emit('blur',$event)" @click="$emit('click',$event)">
            <el-checkbox  v-for="(option,index) in optionsCpd"  :label="option.id"  :key="index" :disabled="disabled">{{ option[propsCpd['name']] }}</el-checkbox > 
        </el-checkbox-group>
    </span>
    <span v-else-if="showType=='checkbox' && multiple==false">
            <el-checkbox :size="size" v-if="optionsCpd && optionsCpd.length>1" v-model="myVal" @change="onChange" :true-label="optionsCpd[0].id" :false-label="optionsCpd[1].id" @focus="$emit('focus',$event)" @blur="$emit('blur',$event)" @clear="$emit('clear',$event)" @click="$emit('click',$event)">{{ optionsCpd[0][propsCpd['name']] }}</el-checkbox > 
    </span>   
  </span>
  <span v-else-if="showStyle=='tag' && disabled==true" :style="{width:width?width:'auto'}">
    <span v-if="multiple===true">
      <span v-if="sels && sels.length>0">
        <el-tag :size="size" v-for="option,idx in sels" :key="idx" :color="getMyColor(option)" :closable="closable" :effect="effect">{{ option[propsCpd['name']] }}</el-tag>
      </span>
      <span v-else-if="myVal && myVal.length>0">
        <el-tag :size="size" v-for="id,idx in myVal" :key="idx" :color="getMyColorById(id)" :closable="closable" :effect="effect">{{ id }}</el-tag>
      </span>
      <el-tag v-else>{{  noMatchText ||'无' }}</el-tag>
    </span> 
    <span v-else>
        <el-tag :class="{'dashed-border':disabled==false}" :size="size" v-if="sels" :color="getMyColor(sels)" :closable="closable" :effect="effect">{{sels[propsCpd['name']]||noMatchText}}</el-tag>
        <el-tag  :size="size" v-else-if="myVal" :color="getMyColorById(myVal)">{{ myVal }}</el-tag>
        <el-tag   v-else>{{ noMatchText ||'无'}}</el-tag>
    </span>
  </span>
  <span v-else :title="title||placeholder" :style="{width:width?width:'auto'}">
    <div :class="showStyle=='x'?{'field-box-x':true}:{'field-box':true}" @click="showSelect"> 
      <span class="field-info" :class="{disabled:disabled===true,enabled:disabled!==true,hidden:selectOpen==true}">
        <slot name="avater"  v-if="showStyle=='x'"> 
          <el-avatar :size="size" class="field-avater" 
            :style="{ backgroundColor: getMyColor(avaterCpd) }"
            >{{ formatImgFront(avaterCpd[propsCpd['name']]) }}</el-avatar> 
        </slot>
        <slot name="info">
          <span v-if="showStyle=='x'" class="info-box">
            <div v-if="multiple==true" class="field-value">
              <div  v-if="sels&&sels.length>0" :style="{width:width?width:'100px'}">
               <el-text truncated> {{ sels.map(k=>k[propsCpd['name']]).join(split) }}</el-text>
              </div>
              <div class="field-value" v-else-if="myVal && myVal.length>0">
                {{ myVal.join(split) }}
              </div>
              <div>{{ noMatchText || '无'}}</div>
            </div> 
            <div v-else class="field-value" :style="{width:width?width:'100px'}">
              <div  v-if="sels">
                <el-text truncated> {{ sels[propsCpd['name']] }}</el-text>
              </div>
              <div v-else-if="myVal">
                {{ myVal }}
              </div>
              <div v-else>{{ noMatchText || '无'}}</div>
            </div>
            <div class="field-label">{{ label||title||placeholder ||'无' }}</div>
          </span>
          <span v-else>
            <div v-if="multiple===true">
              <div v-if="sels && sels.length>0">
                <el-tag :size="size" v-for="option,idx in sels" :key="idx" :color="getMyColor(option)" :closable="closable" :effect="effect">{{ option[propsCpd['name']] }}</el-tag>
              </div>
              <div v-else-if="myVal && myVal.length>0">
                <el-tag :size="size" v-for="id,idx in myVal" :key="idx" :color="getMyColorById(id)" :closable="closable" :effect="effect">{{ id }}</el-tag>
              </div>
              <el-tag v-else>{{  noMatchText ||'无' }}</el-tag>
            </div> 
            <div v-else>
                <el-tag :class="{'dashed-border':disabled==false}" :size="size" v-if="sels" :color="getMyColor(sels)" :closable="closable" :effect="effect">{{sels[propsCpd['name']]||noMatchText}}</el-tag>
                <el-tag  :size="size" v-else-if="myVal" :color="getMyColorById(myVal)">{{ myVal }}</el-tag>
                <el-tag   v-else>{{ noMatchText ||'无'}}</el-tag>
            </div>
          </span> 
        </slot>
      </span> 
      <span :class="{'field-oper-box':true,relative:relative}">
      <span class="field-oper" :class="{disabled:disabled===true,enabled:disabled!==true,nohidden:selectOpen===true}">
        <slot name="oper">
          <el-select :disabled="disabled" :style="{width:width?width:'auto'}" :multiple="multiple" :multiple-limit="limit" :auto-complete="autoComplete" :filter-method="filterMethod" :collapse-tags="collapseTags" :filterable="filterable" :name="name" :no-data-text="noDataText" :no-match-text="noMatchText" :popper-class="popperClass" :reserve-keyword="reserveKeyword" :size="size" v-if="showType=='select'" class="my-select" ref="selectRef" v-model="myVal" @change="onChange" :clearable="clearable" @visible-change="visibleChange" @focus="$emit('focus',$event)" @blur="$emit('blur',$event)" @clear="$emit('blur',$event)" @click="$emit('click',$event)" @remove-tag="$emit('remove-tag',$event)" append-to-body>
 
                <el-option disabled value="" style="height:40px;">
                  <slot name="toolbar">
                    <div><el-button v-if="itemCode" @click.stop="$refs['mdpMetaDialog'].open({itemCode:itemCode})" icon="setting" title="配置字典" type="primary" plain/>
                    <el-button icon="refresh" type="warning" title="刷新数据" @click="doRefresh()" plain/>
                    <slot name="toolbarExt">

                    </slot>
                    </div>
                  </slot>
                  </el-option>
                  <slot name="options" :options="optionsCpd" :item="item">
                    <el-option :style="styleObj" :key="index"  v-for="(option,index) in optionsCpd" :value="option[propsCpd['id']]" :label="option[propsCpd['name']]"> 
                       
                              <span :style="{backgroundColor:getMyColor(option),color:'white'}" class="padding el-tag--dark">  
                                      <Icon v-if="option.icon" :icon="option.icon"/> 
                                  {{option[propsCpd['name']]}}
                              </span>  
                              <Icon v-if="isCheck(option)" icon="ep:check"/> 
                              <i v-else>&nbsp;&nbsp;&nbsp;</i>  
                      </el-option>
                  </slot> 
          </el-select>   
          <div v-else-if="showType=='radio'">
              <el-radio :size="size" v-for="(option,index) in optionsCpd" v-model="myVal" @input="onChange" :label="option.id" :key="index" @focus="$emit('focus',$event)" @blur="$emit('blur',$event)" @clear="$emit('clear',$event)" @click="$emit('click',$event)">{{ option[propsCpd['name']] }}</el-radio> 
          </div>
          <div v-else-if="showType=='checkbox' && multiple==true"> 
              <el-checkbox-group :size="size" v-model="myVal" @change="onChange" @focus="$emit('focus',$event)" @blur="$emit('blur',$event)" @clear="$emit('blur',$event)" @click="$emit('click',$event)">
                  <el-checkbox  v-for="(option,index) in optionsCpd"  :label="option.id" :key="index">{{ option[propsCpd['name']] }}</el-checkbox > 
              </el-checkbox-group>
          </div>
          <div v-else-if="showType=='checkbox' && multiple==false">
                  <el-checkbox :size="size" v-if="optionsCpd.length>1" v-model="myVal" @change="onChange" :true-label="optionsCpd[0].id" :false-label="optionsCpd[1].id" @focus="$emit('focus',$event)" @blur="$emit('blur',$event)" @clear="$emit('clear',$event)" @click="$emit('click',$event)">{{ optionsCpd[0][propsCpd['name']] }}</el-checkbox > 
          </div>  
        </slot>
      </span> 
    </span>
    </div>
  </span>
  <mdp-dialog ref="mdpMetaDialog" width="70%">
    <template #default="{visible,data}">
      <mdp-meta-item v-if="data.itemCode" :visible="visible" sub-op-type="mng" :item-code="data.itemCode" @form-submit="onDictSubmit" @option-form-submit="onDictSubmit"/> 
    </template>
  </mdp-dialog>
</span>
</template> 

<script> 
import {MdpSelectMixin} from "../mixin/MdpSelectMixin.js"
export default {
  name: 'MdpSelect',
  mixins:[MdpSelectMixin], 
  data(){
    return {
      selectOpen:false
    }
  },
  methods:{
    doRefresh(){
      this.initItemOptions(true)
    },
    onDictSubmit(){
      this.clearCache()
      this.initItemOptions()
    },
    visibleChange(visible){ 
      this.selectOpen=visible
      this.$emit('visible-change',visible)
    }
  },
  mounted(){
      this.initMyValByValue();
      this.initData();
      this.initItemOptions();
  },
  
}
</script>
<style lang="scss" scoped>  
  @import url('../index.scss'); 
  .dashed-border {
    border-style:dotted;
    border-color: #c0c0c0; /* 边框颜色，可以根据需要修改 */
    border-width: 2px; /* 边框宽度，可以根据需要修改 */
  }
</style> 
