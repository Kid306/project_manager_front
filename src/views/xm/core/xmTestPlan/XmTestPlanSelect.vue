<template> 
    <mdp-dialog append-to-body modal-append-to-body width="80%" top="20px" v-model="visible">
		 <xm-test-plan-mng subOpType="select" :params="{casedbId:casedbId,productId:productId,projectId:projectId}"/>
    </mdp-dialog>
	
</template>

<script> 
import XmTestPlanMng from './XmTestPlanMng.vue'
export default {
    name:'xmTestPlanSelect',
    components: {
        XmTestPlanMng
    },
    props:['casedbId','productId','projectId'], 
}

</script> 
