<template>
  <flowable-bpmn v-model="xml" @ready="onReady"/>
</template>
 
<script>
import { ref } from 'vue'
 
export default {
  setup() {
    const xml = ref(''); // 初始化 BPMN XML
 
    const onReady = (bpmnViewer) => {
      // 当组件准备就绪时，可以操作 bpmnViewer 实例
    };
 
    return {
      xml,
      onReady
    }
  }
}
</script>