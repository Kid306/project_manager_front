<template>
    <XmTestPlanMng v-if="xmProduct?.id" :params="{productId:xmProduct?.id}" :xmProduct="xmProduct"/>
</template>

<script>
 
 import { mapState } from 'pinia'
import { useUserStore } from '@/store/modules/user'
import { useXmStore } from '@/store/modules/xm'
import XmTestPlanMng from './XmTestPlanMng.vue'
export default {
    name:'XmTestPlanForProduct', 
    components:{XmTestPlanMng},
    computed: {
        ...mapState(useUserStore,['userInfo']),
        ...mapState(useXmStore,['xmProduct']), 
    }, 
}

</script>

<style scoped />
