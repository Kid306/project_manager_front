<template>
  <el-text type="info" size="small"> 拖动左上角的小圆点可对其排序 </el-text>
  <VueDraggable
    :list="formData"
    :animation="200"
    :handle="'.drag-icon'"
    :item-key="itemKey"
    :group="group" 
  >
    <template #item="{ element, index }">
      <div @dblclick="showEdit(element,index)"
        class="mb-4px flex flex-col gap-4px border border-gray-2 border-rounded rounded border-solid p-8px ele-box"
      >
        <!-- 操作按钮区 -->
        <div class="m--8px m-b-4px flex flex-row items-center justify-between bg-gray-1 p-8px" >
          <el-tooltip content="拖动排序,双击内容区可以编辑数据" delay="1000">
            <div class="flex items-center drag-icon"><Icon icon="ic:round-drag-indicator" class="cursor-move"/>{{ index+1 }}&nbsp;&nbsp;</div>
          </el-tooltip> 
         
          <slot name="toolbar" :element="element" :index="index"></slot>
          <el-tooltip content="删除">
            <Icon
              icon="ep:delete"
              class="cursor-pointer text-red-5"
              v-if="formData.length > 1"
              @click.prevent="handleDelete(index)"
            />
          </el-tooltip>
        </div>
        <!-- 内容区 -->
        <slot :element="element" :index="index"></slot>
      </div>
    </template>
  </VueDraggable>
  <el-tooltip :disabled="limit < 1" :content="`最多添加${limit}个`">
    <el-button title="添加" 
      plain size="small"
      :disabled="limit > 0 && formData.length >= limit"
      @click="handleAdd"
    >
      <Icon icon="ep:plus" /> 
    </el-button>
  </el-tooltip>
</template>

<script setup lang="ts">
// 拖拽组件
import VueDraggable from 'vuedraggable'  
import { any, array } from 'vue-types'
import { propTypes } from '@/utils/propTypes'
import { cloneDeep } from 'lodash-es'

// 拖拽组件封装
defineOptions({ name: 'Draggable' })

// 定义属性
const props = defineProps({
  // 绑定值
  modelValue: array<any>().isRequired,
  // 空的元素：点击添加按钮时，创建元素并添加到列表；默认为空对象
  emptyItem: any<unknown>().def({}),
  // 数量限制：默认为0，表示不限制
  limit: propTypes.number.def(0),
  // 组名
  group: propTypes.string.def('group'),
  
  // 主键
  itemKey: propTypes.string.def('id')
})
// 定义事件,add\del等与原生冲突，因此改叫preAdd\preDel\preEdit等
const emit = defineEmits(['update:modelValue','plus','del','edit'])
const  formData  = ref(props.modelValue) 
// 处理添加
const handleAdd = () => {

  const callback=(d)=>{
    
    if(!d){
      return;
    }
    let data=null
    if(d && d[props.itemKey]){
      data=d
    }else{
      if(d.data && d.data[props.itemKey]){
        data=d.data
      }
    }
    if(data){ 
      formData.value.push(cloneDeep(data || {}))
    }
  }
  emit('plus',callback)
  
}
 
// 处理编辑
const showEdit = (element: any) => {
  
  const callback=(d)=>{
     Object.assign(element,d)
  }
  emit('edit',element,callback)
}
// 处理删除
const handleDelete = (index: number) => {
  
  const callback=()=>{
    formData.value.splice(index, 1)
  }
  emit('del',formData.value[index],callback)
}

</script>

<style lang="scss" scoped>
/* 默认样式 */
.ele-box {
  border: 1px solid #ccc; /* 定义元素的边框 */
  padding: 10px; /* 内边距 */
  transition: border-color 0.3s; /* 边框颜色过渡效果 */
}
 
/* 鼠标悬停时的样式 */
.ele-box:hover {
  cursor: pointer;
  border-color: hsl(237, 73%, 48%); /* 鼠标悬停时的边框颜色 */
}
</style>

