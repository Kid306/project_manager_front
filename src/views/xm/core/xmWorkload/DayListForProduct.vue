<template> 
    <XmWorkloadSetDayList :xm-product="xmProduct" v-if="xmProduct?.id"/> 
</template>

<script> 
import XmWorkloadSetDayList from './WorkloadSetDayList.vue';
import { mapState } from 'pinia'
import { useXmStore } from '@/store/modules/xm'
export default {  
  
  computed: {
    ...mapState(useXmStore, ["xmProduct"]),
  },
  components: {
    XmWorkloadSetDayList,
  }, 

}
</script> 

