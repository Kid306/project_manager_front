<template>
  <div class="process-panel__container" :style="{ width: `${width}px` }">
    <el-collapse v-model="activeTab">
      <el-collapse-item name="base">
        <!-- class="panel-tab__title" -->
        <template #title>
         <Icon icon="ep:info-filled" />  <el-tag type="warning">V{{ model?.model?.version||1 }}.{{ model?.model?.rev||0 }}</el-tag>
          常规</template
        >
        <ElementBaseInfo
          :id-edit-disabled="idEditDisabled"
          :business-object="elementBusinessObject"
          :type="elementType"
          :model="model"
        /> 
      </el-collapse-item>
      <el-collapse-item name="message" v-if="elementType === 'Process'" key="message">
        <template #title><Icon icon="ep:comment" />消息与信号</template>
        <signal-and-massage />
      </el-collapse-item>
      <el-collapse-item name="condition" v-if="conditionFormVisible" key="condition">
        <template #title><Icon icon="ep:promotion" />流转条件</template>
        <flow-condition :business-object="elementBusinessObject" :type="elementType" />
      </el-collapse-item>
      <el-collapse-item name="form" v-if="formVisible" key="form">
        <template #title><Icon icon="ep:list" />表单</template>
        <element-form :id="elementId" :type="elementType" />
      </el-collapse-item>
      <el-collapse-item name="task" v-if="elementType.indexOf('Task') !== -1" key="task">
        <template #title><Icon icon="ep:checked" />任务（审批人）</template>
        <element-task :id="elementId" :type="elementType" />
      </el-collapse-item>
      <el-collapse-item
        name="multiInstance"
        v-if="elementType.indexOf('Task') !== -1"
        key="multiInstance"
      >
        <template #title><Icon icon="ep:help-filled" />多实例（会签配置）</template>
        <element-multi-instance :business-object="elementBusinessObject" :type="elementType" />
      </el-collapse-item>
      <el-collapse-item name="listeners" key="listeners">
        <template #title><Icon icon="ep:bell-filled" />执行监听器</template>
        <element-listeners :id="elementId" :type="elementType" />
      </el-collapse-item>
      <el-collapse-item name="taskListeners" v-if="elementType === 'UserTask'" key="taskListeners">
        <template #title><Icon icon="ep:bell-filled" />任务监听器</template>
        <user-task-listeners :id="elementId" :type="elementType" />
      </el-collapse-item>
      <el-collapse-item name="extensions" key="extensions">
        <template #title><Icon icon="ep:circle-plus-filled" />扩展属性</template>
        <element-properties :id="elementId" :type="elementType" />
      </el-collapse-item>
      <el-collapse-item name="other" key="other">
        <template #title><Icon icon="ep:promotion" />其他</template>
        <element-other-config :id="elementId" />
      </el-collapse-item>
    </el-collapse>
  </div>
</template>
<script lang="ts" setup>
import ElementBaseInfo from './base/ElementBaseInfo.vue'
import ElementOtherConfig from './other/ElementOtherConfig.vue'
import ElementTask from './task/ElementTask.vue'
import ElementMultiInstance from './multi-instance/ElementMultiInstance.vue'
import FlowCondition from './flow-condition/FlowCondition.vue'
import SignalAndMassage from './signal-message/SignalAndMessage.vue'
import ElementListeners from './listeners/ElementListeners.vue'
import ElementProperties from './properties/ElementProperties.vue'
// import ElementForm from './form/ElementForm.vue'
import UserTaskListeners from './listeners/UserTaskListeners.vue'

defineOptions({ name: 'MyPropertiesPanel' })

/**
 * 侧边栏
 * @Author MiyueFE
 * @Home https://github.com/miyuesc
 * @Date 2021年3月31日18:57:51
 */
const props = defineProps({
  bpmnModeler: {
    type: Object,
    default: () => {}
  },
  prefix: {
    type: String,
    default: 'camunda'
  },
  width: {
    type: Number,
    default: 400
  },
  idEditDisabled: {
    type: Boolean,
    default: false
  },
  model: {
    type: Object, // 流程模型的数据
    default: () => {}
  }
})

const activeTab = ref('base')
const elementId = ref('')
const elementType = ref('')
const elementBusinessObject = ref<any>({}) // 元素 businessObject 镜像，提供给需要做判断的组件使用
const conditionFormVisible = ref(false) // 流转条件设置
const formVisible = ref(false) // 表单配置
const bpmnElement = ref()

provide('prefix', props.prefix)
provide('width', props.width)
const bpmnInstances = () => (window as any)?.bpmnInstances

// 监听 props.bpmnModeler 然后 initModels
const unwatchBpmn = watch(
  () => props.bpmnModeler,
  () => {
    // 避免加载时 流程图 并未加载完成
    if (!props.bpmnModeler) {
      console.log('缺少props.bpmnModeler')
      return
    }

    console.log('props.bpmnModeler 有值了！！！')
    const w = window as any
    w.bpmnInstances = {
      modeler: props.bpmnModeler,
      modeling: props.bpmnModeler.get('modeling'),
      moddle: props.bpmnModeler.get('moddle'),
      eventBus: props.bpmnModeler.get('eventBus'),
      bpmnFactory: props.bpmnModeler.get('bpmnFactory'),
      elementFactory: props.bpmnModeler.get('elementFactory'),
      elementRegistry: props.bpmnModeler.get('elementRegistry'),
      replace: props.bpmnModeler.get('replace'),
      selection: props.bpmnModeler.get('selection')
    }

    console.log(bpmnInstances(), 'window.bpmnInstances')
    getActiveElement()
    unwatchBpmn()
  },
  {
    immediate: true
  }
)

const getActiveElement = () => {
  // 初始第一个选中元素 bpmn:Process
  initFormOnChanged(null)
  props.bpmnModeler.on('import.done', (e) => {
    console.log(e, 'eeeee')
    initFormOnChanged(null)
  })
  // 监听选择事件，修改当前激活的元素以及表单
  props.bpmnModeler.on('selection.changed', ({ newSelection }) => {
    initFormOnChanged(newSelection[0] || null)
  })
  props.bpmnModeler.on('element.changed', ({ element }) => {
    // 保证 修改 "默认流转路径" 类似需要修改多个元素的事件发生的时候，更新表单的元素与原选中元素不一致。
    if (element && element.id === elementId.value) {
      initFormOnChanged(element)
    }
  })
}
// 初始化数据
const initFormOnChanged = (element) => {
  let activatedElement = element
  if (!activatedElement) {
    activatedElement =
      bpmnInstances().elementRegistry.find((el) => el.type === 'bpmn:Process') ??
      bpmnInstances().elementRegistry.find((el) => el.type === 'bpmn:Collaboration')
  }
  if (!activatedElement) return
  console.log(`
              ----------
      select element changed:
                id:  ${activatedElement.id}
              type:  ${activatedElement.businessObject.$type}
              ----------
              `)
  console.log('businessObject: ', activatedElement.businessObject)
  bpmnInstances().bpmnElement = activatedElement
  bpmnElement.value = activatedElement
  elementId.value = activatedElement.id
  elementType.value = activatedElement.type.split(':')[1] || ''
  elementBusinessObject.value = JSON.parse(JSON.stringify(activatedElement.businessObject))
  conditionFormVisible.value = !!(
    elementType.value === 'SequenceFlow' &&
    activatedElement.source &&
    activatedElement.source.type.indexOf('StartEvent') === -1
  )
  formVisible.value = elementType.value === 'UserTask' || elementType.value === 'StartEvent' || elementType.value==='Process'
}

onBeforeUnmount(() => {
  const w = window as any
  w.bpmnInstances = null
  console.log(props, 'props1')
  console.log(props.bpmnModeler, 'props.bpmnModeler1')
})

watch(
  () => elementId.value,
  () => {
    activeTab.value = 'base'
  }
)
</script>
