<template>
	
		 <xm-menu-detail v-if="$route?.query?.menuId" :key="$route?.query?.menuId" :formData="{menuId:$route?.query?.menuId}"  :reload="true" />
	
</template>

<script>
	 
	export default {  
		 
	}
</script> 