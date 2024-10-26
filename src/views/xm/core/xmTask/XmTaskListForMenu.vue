<template> 
	<xm-task-box :key="menuId" v-if="menuId" :menuId="menuId"  queryScope="task"/>
</template> 
<script>
  

	export default { 
		props:['menuId'],
	}

</script> 