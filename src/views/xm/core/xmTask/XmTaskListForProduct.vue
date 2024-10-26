<template> 
	<xm-task-box :key="xmProduct?.id" v-if="xmProduct?.id" :xmProduct="xmProduct"  queryScope="task"/>
</template> 
<script>
 
import { mapState } from 'pinia'
import { useXmStore } from '@/store/modules/xm' 

	export default { 
		computed: { 
			...mapState(useXmStore,[ 'xmProduct']),   
		},  
	}

</script> 