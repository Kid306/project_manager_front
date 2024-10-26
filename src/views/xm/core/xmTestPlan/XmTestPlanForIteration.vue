<template>
    <XmTestPlanMng subOpType="list" v-if="xmIteration?.id" :params="{linkIterationId:xmIteration?.id}" :xmProduct="{id:xmIteration.productId,productName:xmIteration.productName}" :xmIteration="xmIteration"/>
</template>

<script>
 
 import { mapState } from 'pinia'
import { useUserStore } from '@/store/modules/user'
import { useXmStore } from '@/store/modules/xm'
import XmTestPlanMng from './XmTestPlanMng.vue'
export default {
    name:'XmTestPlanForIteration', 
    components:{XmTestPlanMng},
    computed: {
        ...mapState(useUserStore,['userInfo']),
        ...mapState(useXmStore,['xmIteration']), 
    }, 
}

</script>

<style scoped />
