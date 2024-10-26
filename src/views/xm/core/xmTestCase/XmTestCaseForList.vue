<template>
	
		 <xm-test-case-list  v-if="testCasedb&&testCasedb.id" :xm-test-casedb="testCasedb" scene="mng" />
	
</template>

<script>  
	import { mapState } from 'pinia' 
import { useXmStore } from '@/store/modules/xm';  

	export default {  
		computed: { 
		    ...mapState(useXmStore,[ 'testCasedb' ]), 
		}, 
	}
</script> 