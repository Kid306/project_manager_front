<template> 
    <XmWorkloadSetDayList :xm-iteration="xmIteration" v-if="xmIteration?.id"/> 
</template>

<script> 
import XmWorkloadSetDayList from './WorkloadSetDayList.vue';
import { mapState } from 'pinia'
import { useXmStore } from '@/store/modules/xm'
export default {  
  
  computed: {
    ...mapState(useXmStore, ["xmIteration"]),
  },
  components: {
    XmWorkloadSetDayList,
  }, 

}
</script> 

