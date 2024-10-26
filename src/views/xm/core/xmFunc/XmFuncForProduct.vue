<template>
	
		 <xm-func-tree v-if="xmProduct && xmProduct.id" :xm-product="xmProduct" />
	
</template>

<script>
	import util from '@/components/mdp-ui/js/util';//全局公共库
	  
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
		data() {
			return {  
			}
		},//end data 
	}
</script>

<style scoped />