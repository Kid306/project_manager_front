<template> 
	<xm-menu-edit :key="formData?.menuId" v-loading="load.list" v-if="formData?.menuId" :formData="formData" :reload="reload" :visible="formData&&formData.menuId" /> 
</template>

<script>    
import { defineAsyncComponent } from 'vue';
	export default {  
		props:['formData','reload'],  
		data() {
			 return {
				load:{list:false}
			 }
		},//end data
		methods: { 
			  
			
		},//end methods
		components: {  
			XmMenuEdit:defineAsyncComponent(()=>import('../xmMenu/XmMenuEdit.vue'))
			//在下面添加其它组件
		},  
		mounted() {  
			 
		}
	}
</script>

<style scoped />