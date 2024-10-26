<template>

    <MyProcessViewer 
    :key="procInstId"
      :activityData="activityList"
      :prefix="bpmnControlForm.prefix"
      :processInstanceData="processInstance"
      :taskData="tasks"
      :value="bpmnXml"
      v-bind="bpmnControlForm"
    />
</template>
<script lang="ts" setup>
import { propTypes } from '@/utils/propTypes'
import { MyProcessViewer } from '@/components/BpmnDesigner/package'
import * as ModelApi from '@/api/mdp/workflow/re/model'
import { random } from 'lodash-es'

defineOptions({ name: 'BpmnViewer' })

const props = defineProps({
  loading: propTypes.bool, // 是否加载中
  procInstId: propTypes.string, // 流程实例的编号
  processInstance: propTypes.any, // 流程实例的信息
  tasks: propTypes.array, // 流程任务的数组
  bpmnXml: propTypes.string // BPMN XML
})
const bpmnControlForm = ref({
  prefix: 'flowable'
})
const activityList = ref([]) // 任务列表

/** 只有 loading 完成时，才去加载流程列表 */
watch(
  // () => props.loading,
  // async (value) => {
  //   if (value && props.procInstId) {
  //     activityList.value = await ModelApi.getActivityList({
  //       processInstanceId: props.procInstId
  //     })
  //   }
  // }
)
</script>
<style>
.box-card {
  width: 100%;
  margin-bottom: 20px;
}
</style>
