<template> 
  <XmWorkloadSetDayList :xm-project="projectInfo" v-if="projectInfo?.id"/> 
</template>

<script> 
import XmWorkloadSetDayList from './WorkloadSetDayList.vue';
import { mapState } from 'pinia'
import { useXmStore } from '@/store/modules/xm'
export default {  

computed: {
  ...mapState(useXmStore, ["projectInfo"]),
},
components: {
  XmWorkloadSetDayList,
}, 

}
</script> 

