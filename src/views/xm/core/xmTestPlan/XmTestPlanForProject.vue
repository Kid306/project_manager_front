<template>
    <XmTestPlanMng  v-if="projectInfo?.id" :params="{projectId:projectInfo?.id}" :selProject="projectInfo"/>
</template>

<script>
 
 import { mapState } from 'pinia'
import { useUserStore } from '@/store/modules/user'
import { useXmStore } from '@/store/modules/xm'
import XmTestPlanMng from './XmTestPlanMng.vue'
export default {
    name:'XmTestPlanForProject', 
    components:{XmTestPlanMng},
    computed: {
        ...mapState(useUserStore,['userInfo']),
        ...mapState(useXmStore,['projectInfo']), 
    }, 
}

</script>

<style scoped />
