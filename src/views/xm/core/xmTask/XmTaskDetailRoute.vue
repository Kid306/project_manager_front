<template>
	 
		<xm-task-detail v-if="$route?.query?.id" :key="$route?.query?.id" :formData="{id:$route?.query?.id}" :reload="true" /> 
	
</template>

<script> 

	export default {   
	}
</script>