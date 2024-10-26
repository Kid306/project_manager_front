<template> 
	<xm-task-box :key="projectInfo?.id" v-if="projectInfo?.id" :sel-project="projectInfo" queryScope="plan"/>
</template> 
<script>
 
import { mapState } from 'pinia'
import { useXmStore } from '@/store/modules/xm' 

	export default { 
		computed: { 
			...mapState(useXmStore,[ 'projectInfo']),   
		},  
	}

</script> 