<template>
	
		 <xm-question-detail v-if="$route?.query?.id" :key="$route?.query?.id" :xmQuestion="{id:$route?.query?.id}"  :reload="true" />
	
</template>

<script> 

	export default {  
		 
	}
</script>