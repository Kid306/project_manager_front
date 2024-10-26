<template> 
	<xm-task-box :key="xmIteration?.id" v-if="xmIteration?.id" :xmProduct="{id:xmIteration.productId,productName:xmIteration.productName}" :xmIteration="xmIteration"  queryScope="task"/>
</template> 
<script>
 
import { mapState } from 'pinia'
import { useXmStore } from '@/store/modules/xm' 

	export default { 
		computed: { 
			...mapState(useXmStore,[ 'xmIteration']),   
		},  
	}

</script> 