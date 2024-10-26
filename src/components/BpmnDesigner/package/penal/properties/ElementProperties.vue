<template>
  <div class="panel-tab__content">

    <el-table v-adaptive :data="elementPropertyList" max-height="240" fit border>
      <el-table-column label="序号" width="50px" type="index" /> 
      <el-table-column label="属性码" prop="name" min-width="100px" show-overflow-tooltip />
      <el-table-column label="属性值" prop="value" min-width="100px" show-overflow-tooltip />
      <el-table-column label="操作" width="110px">
        <template #default="scope">
          <el-button link @click="openAttributesForm(scope.row, scope.$index)" size="small">
            编辑
          </el-button>
          <el-divider direction="vertical" />
          <el-button
            link
            size="small"
            style="color: #ff4d4f"
            @click="removeAttributes(scope.row, scope.$index)"
          >
            移除
          </el-button>
        </template>
      </el-table-column>
    </el-table>
    <div class="element-drawer__button">
      <XButton
        type="primary"
        preIcon="ep:plus"
        title="添加属性"
        @click="openAttributesForm(null, -1)"
      />
    </div>

    <el-dialog
      v-model="propertyFormModelVisible"
      title="属性配置"
      width="600px"
      append-to-body
      destroy-on-close
    >
      <el-form :model="propertyForm" label-width="80px" ref="attributeFormRef">
        <el-tabs v-model="attType">
          <el-tab-pane label="自定义属性" name="selfDef" v-if="disTab('selfDef')">
            <el-form-item label="属性码" prop="name" title="英文编码，驼峰命名">
              <el-input v-model="propertyForm.name" clearable />
            </el-form-item>
            <el-form-item label="属性值" prop="value">
              <el-input v-model="propertyForm.value" clearable />
            </el-form-item>
          </el-tab-pane>
          <el-tab-pane label="正文模板" name="wfMainBody"  v-if="disTab('wfMainBody') ">
            <el-form-item label="模板库">
              <MdpSelect itemCode="wf_main_body_tpl" @change2="onWfMainBodyChange" placeholder="工作流正文模板"/>
            </el-form-item> 
            <el-form-item label="正文" prop="value">
              <el-input type="textarea" :rows="10" v-model="propertyForm.value" clearable />
            </el-form-item>
          </el-tab-pane>
          <el-tab-pane label="附件列表" name="wfAtts"  v-if="disTab('wfAtts')">
            <el-form-item label="附件库"> 
              <el-button @click="$refs['atts'].open()">从附件库选择</el-button>
            </el-form-item> 
            <el-form-item label="附件" prop="value">
              <el-input type="textarea" :rows="10" v-model="propertyForm.value" clearable />
            </el-form-item>
          </el-tab-pane>
          <el-tab-pane label="数据外推地址" name="wfPushUrl"  v-if="disTab('wfPushUrl')">
            <el-form-item label="url库">
              <MdpSelect itemCode="wf_push_url" @change2="onWfPushUrlChange" placeholder="数据外推地址"/>
            </el-form-item> 
            <el-form-item label="url" prop="value">
              <el-input type="textarea" :rows="10" v-model="propertyForm.value" clearable />
            </el-form-item>
          </el-tab-pane>
          <el-tab-pane label="消息推送" name="wfMsgScope"  v-if="disTab('wfMsgScope')">
            <el-form-item label="推送对象">
              <MdpSelect v-model="propertyForm.value" itemCode="msg_push_target_type"   @change2="onWfMsgPushTargetTypeChange" placeholder="数据推送对象外推地址"/>
            </el-form-item> 
          </el-tab-pane>
          <el-tab-pane label="审核提示" name="wfTips"  v-if="disTab('wfTips')"> 
            
            <el-form-item label="提示语" prop="value">
              <el-input type="textarea" :rows="10" v-model="propertyForm.value" clearable @change="onWfHelpTipsChange"/>
            </el-form-item>
          </el-tab-pane>
          <el-tab-pane label="主办人" name="wfSponsors"  v-if="disTab('wfSponsors')" @change="onWfSponsorsChange"> 
            
            <el-form-item label="主办人" prop="value">
              <MdpSelectUser v-model="value"/>
             </el-form-item>
          </el-tab-pane>
          <el-tab-pane label="监控人" name="wfMonitors"  v-if="disTab('wfMonitors')" @change="onWfMonitorsChange"> 
            
            <el-form-item label="监控人" prop="value">
              <MdpSelectUser v-model="value"/>
             </el-form-item>
          </el-tab-pane>
        </el-tabs>
       

      </el-form>
      <template #footer>
        <el-button @click="propertyFormModelVisible = false">取 消</el-button>
        <el-button type="primary" @click="saveAttribute">确 定</el-button>
      </template>
    </el-dialog>
    <MdpDialog ref="atts">
      <MdpSelectAtt @select="onWfAttsChange"/>
    </MdpDialog>
  </div>
</template>

<script lang="ts" setup>
import TableNameVue from '@/views/mdp/form/formDef/components/input/TableName.vue'
import { ElMessageBox } from 'element-plus'
import { tr } from 'node_modules/element-plus/es/locale'
defineOptions({ name: 'ElementProperties' })
const props = defineProps({
  id: String,
  type: String
})
const prefix = inject('prefix')
// const width = inject('width')
const attType= ref<string>('selfDef')
const tabNameList=ref<string[]>(['selfDef','wfMainBody','wfTips','wfMsgScope','wfAtts','wfPushUrl','wfSponsors','wfMonitors'])
const elementPropertyList = ref<any[]>([])
const propertyForm = ref<any>({})
const editingPropertyIndex = ref(-1)
const propertyFormModelVisible = ref(false)
const bpmnElement = ref()
const otherExtensionList = ref()
const bpmnElementProperties = ref()
const bpmnElementPropertyList = ref()
const attributeFormRef = ref()
const bpmnInstances = () => (window as any)?.bpmnInstances
const elementType=ref()
const resetAttributesList = () => {
  console.log(window, 'windowwindowwindowwindowwindowwindowwindow')
  bpmnElement.value = bpmnInstances().bpmnElement
  elementType.value=bpmnElement.value.type.split(':')[1] || ''
  otherExtensionList.value = [] // 其他扩展配置
  bpmnElementProperties.value =
    // bpmnElement.value.businessObject?.extensionElements?.filter((ex) => {
    bpmnElement.value.businessObject?.extensionElements?.values.filter((ex) => {
      if (ex.$type !== `${prefix}:Properties`) {
        otherExtensionList.value.push(ex)
      }
      return ex.$type === `${prefix}:Properties`
    }) ?? []

  // 保存所有的 扩展属性字段
  bpmnElementPropertyList.value = bpmnElementProperties.value.reduce(
    (pre, current) => pre.concat(current.values),
    []
  )
  // 复制 显示
  elementPropertyList.value = JSON.parse(JSON.stringify(bpmnElementPropertyList.value ?? []))
}


const disTab = (tabName) => {

  if(editingPropertyIndex.value>=0){
    return tabName==attType.value
  }else{
    if(tabName==tabNameList.value[0]){
      return true
    }else if(elementType.value=='Process'){
      return true
    }else{
      return false;
    }
   
  }
}
const openAttributesForm = (attr, index) => {
  editingPropertyIndex.value = index
  propertyForm.value = index === -1 ? {} : JSON.parse(JSON.stringify(attr))
  if(tabNameList.value.some(k=>k==propertyForm.value.name)){
    attType.value=propertyForm.value.name
  }else{
    attType.value=tabNameList.value[0]
  } 
  propertyFormModelVisible.value = true
  nextTick(() => {
    if (attributeFormRef.value) attributeFormRef.value.clearValidate()
  })
}
const removeAttributes = (attr, index) => {
  console.log(attr, 'attr')
  ElMessageBox.confirm('确认移除该属性吗？', '提示', {
    confirmButtonText: '确 认',
    cancelButtonText: '取 消'
  })
    .then(() => {
      elementPropertyList.value.splice(index, 1)
      bpmnElementPropertyList.value.splice(index, 1)
      // 新建一个属性字段的保存列表
      const propertiesObject = bpmnInstances().moddle.create(`${prefix}:Properties`, {
        values: bpmnElementPropertyList.value
      })
      updateElementExtensions(propertiesObject)
      resetAttributesList()
    })
    .catch(() => console.info('操作取消'))
}
const onWfAttsChange = (atts) => {
  propertyForm.value.name='wfAtts'
  propertyForm.value.value=atts.map(k=>k.url).join(",")
}
const onWfMainBodyChange = (option) => {
  propertyForm.value.name='wfMainBody'
  propertyForm.value.value=option.value
}
const onWfHelpTipsChange = (tipss) => {
  propertyForm.value.name='wfTips'
  propertyForm.value.value=tipss
}
const onWfMsgPushTargetTypeChange = (option) => {
  propertyForm.value.name='wfMsgScope'
  propertyForm.value.value=option.value
}
const onWfPushUrlChange = (url) => { 
  propertyForm.value.name='wfPushUrl'
  propertyForm.value.value=url
}
const onWfSponsorsChange = (v) => { 
  propertyForm.value.name='wfSponsors'
  propertyForm.value.value=v
}
const onWfMonitorsChange = (v) => { 
  propertyForm.value.name='wfMonitors'
  propertyForm.value.value=v
}
const saveAttribute = () => {
  console.log(propertyForm.value, 'propertyForm.value')
  if(attType.value!='selfDef'){
    propertyForm.value.name=attType.value
  } 
  const { name, value } = propertyForm.value
  if (editingPropertyIndex.value !== -1) {
    bpmnInstances().modeling.updateModdleProperties(
      toRaw(bpmnElement.value),
      toRaw(bpmnElementPropertyList.value)[toRaw(editingPropertyIndex.value)],
      { 
        name,
        value
      }
    )
  } else {
    // 新建属性字段
    const newPropertyObject = bpmnInstances().moddle.create(`${prefix}:Property`, { 
      name,
      value
    })
    // 新建一个属性字段的保存列表
    const propertiesObject = bpmnInstances().moddle.create(`${prefix}:Properties`, {
      values: bpmnElementPropertyList.value.concat([newPropertyObject])
    })
    updateElementExtensions(propertiesObject)
  }
  propertyFormModelVisible.value = false
  resetAttributesList()
}
const updateElementExtensions = (properties) => {
  const extensions = bpmnInstances().moddle.create('bpmn:ExtensionElements', {
    values: otherExtensionList.value.concat([properties])
  })
  bpmnInstances().modeling.updateProperties(toRaw(bpmnElement.value), {
    extensionElements: extensions
  })
}

watch(
  () => props.id,
  (val) => {
    if (val) {
      val && val.length && resetAttributesList()
    }
  },
  { immediate: true }
)
</script>
