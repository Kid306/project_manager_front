<template>
  <div class="panel-tab__content">
    <el-form label-width="90px" :model="elementBaseInfo" :rules="rules"> 
       <div v-if="elementBaseInfo.$type == 'bpmn:Process'">
        <!-- 如果是 Process 信息的时候，使用自定义表单 -->
        <el-form-item label="流程标识" prop="id">
          <el-input
            v-model="elementBaseInfo.id"
            placeholder="请输入流标标识" 
            @change="handleKeyUpdate"
            :disabled="model && model.model?.id && isCopy!==true"
          />  
        </el-form-item>
        <el-form-item label="流程名称" prop="name">
          <el-input
            v-model="elementBaseInfo.name"
            placeholder="请输入流程名称"
            clearable
            @change="handleNameUpdate"
          />
        </el-form-item>
        <el-form-item label="归属分类" prop="category">
          <MdpSelectCate
            v-model="elementBaseInfo.category"
            placeholder="归属分类"
            clearable
            @change="handleCategoryUpdate"
          /> 
        </el-form-item>
      </div>
      <div v-else>
        <el-form-item label="ID">
          <el-input v-model="elementBaseInfo.id" clearable @change="updateBaseInfo('id')" />
        </el-form-item>
        <el-form-item label="名称">
          <el-input v-model="elementBaseInfo.name" clearable @change="updateBaseInfo('name')" />
        </el-form-item>
      </div>
    </el-form>
  </div>
</template>
<script lang="ts" setup>
import {inject} from 'vue'
defineOptions({ name: 'ElementBaseInfo' })
const isCopy = inject('isCopy')

const props = defineProps({
  businessObject: {
    type: Object,
    default: () => {}
  }, 
  model:{
    type: Object,
    default: () => {}
  },
}) 
const bpmnElement = ref()
const elementBaseInfo = ref<any>({})
// 流程表单的下拉框的数据
// const forms = ref([])
// 流程模型的校验
const rules = reactive({
  id: [{ required: true, message: '流程标识不能为空', trigger: 'blur' }],
  name: [{ required: true, message: '流程名称不能为空', trigger: 'blur' }]
})

const bpmnInstances = () => (window as any)?.bpmnInstances
const resetBaseInfo = () => { 

  bpmnElement.value = bpmnInstances()?.bpmnElement
  elementBaseInfo.value = bpmnElement.value.businessObject  
  if(!elementBaseInfo.value['id']||elementBaseInfo.value['id']=='undefined'){
    elementBaseInfo.value['id']=''
    elementBaseInfo.value['key']=''
  }
  if(!elementBaseInfo.value['name']||elementBaseInfo.value['name']=='undefined'){
    elementBaseInfo.value['name']=''
  } 
  if(!elementBaseInfo.value.$attrs['category']||elementBaseInfo.value.$attrs['category']=='undefined'){
    elementBaseInfo.value['category']=''
  }else{
    elementBaseInfo.value['category']=elementBaseInfo.value.$attrs['category']
  }
}
const handleKeyUpdate = (value) => {
  // 校验 value 的值，只有 XML NCName 通过的情况下，才进行赋值。否则，会导致流程图报错，无法绘制的问题
  if (!value) {
    return
  }
  if (!value.match(/[a-zA-Z_][\-_.0-9a-zA-Z$]*/)) {
    console.log('key 不满足 XML NCName 规则，所以不进行赋值')
    return
  }
  console.log('key 满足 XML NCName 规则，所以进行赋值')

  // 在 BPMN 的 XML 中，流程标识 key，其实对应的是 id 节点
  elementBaseInfo.value['id'] = value
  elementBaseInfo.value['key'] = value

  setTimeout(() => {
    updateBaseInfo('id')
  }, 100)
}
const handleNameUpdate = (value) => {
  console.log(elementBaseInfo, 'elementBaseInfo')
  if (!value) {
    return
  }
  elementBaseInfo.value['name'] = value

  setTimeout(() => {
    updateBaseInfo('name')
  }, 100)
}
const handleCategoryUpdate = (value) => { 
  if (!value) {
    return
  }
  elementBaseInfo.value['category'] = value

  setTimeout(() => {
    updateBaseInfo('category')
  }, 100)
}
 
const updateBaseInfo = (key) => {
  console.log(key, 'key')
  // 触发 elementBaseInfo 对应的字段
  const attrObj = Object.create(null)
  // console.log(attrObj, 'attrObj')
  attrObj[key] = elementBaseInfo.value[key] 
  if (key === 'id') { 
    bpmnInstances().modeling.updateProperties(toRaw(bpmnElement.value), {
      id: elementBaseInfo.value[key],
      key:elementBaseInfo.value[key],
      di: { id: `${elementBaseInfo.value[key]}_di` }
    })
  } else {
    console.log(attrObj, 'attrObj')
    bpmnInstances().modeling.updateProperties(toRaw(bpmnElement.value), attrObj)
  }
}

watch(
  () => props.businessObject,
  (val) => { 
    if (val) {
      // nextTick(() => {
      resetBaseInfo()
      // })
    }
  }
)

   
onBeforeUnmount(() => {
  bpmnElement.value = null
})
</script>
