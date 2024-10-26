<template>
	
		 <mdp-select-att v-if="xmProduct?.id" archive-type="0" crely-type="xm-product" :crely-id="xmProduct.id" :bizId="xmProduct.id"  subOpType="mng"/>
	
</template>

<script> 
	  
	import { mapState } from 'pinia'
import { useUserStore } from '@/store/modules/user';  
import { useXmStore } from '@/store/modules/xm';  

	export default {  
		computed: {
		    ...mapState(useUserStore,[
		      'userInfo','roles'
				]), 
		    ...mapState(useXmStore,['xmProduct']), 
		}, 
		watch:{
			 
		},
		data() {
			return {  
			}
		},//end data
		methods: {  
			
		},//end methods
		components: {   
			//在下面添加其它组件
		}, 
		activated(){ 
		},
		mounted() {   
		}
	}
</script>

<style scoped />