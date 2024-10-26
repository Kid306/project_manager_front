<template> 
		 <xm-test-casedb-mng v-if="xmProduct && xmProduct.id" :xm-product="xmProduct" />
	
</template>

<script>
	import util from '@/components/mdp-ui/js/util';//全局公共库
	  
	import { mapState } from 'pinia'
import { useUserStore } from '@/store/modules/user'; 
import { useXmStore } from '@/store/modules/xm'; 
	import XmTestCasedbMng from './XmTestCasedbMng.vue'

	export default {  
		computed: {
		    ...mapState(useUserStore,[
		      'userInfo','roles' 
				]), 
		    ...mapState(useXmStore,[ 'xmProduct'
				]), 
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
			XmTestCasedbMng, 
		},  
		mounted() {   
		}
	}
</script>

<style scoped />