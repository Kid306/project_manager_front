<template>
	  
		<xm-menu-box v-if="xmProduct&& xmProduct.id" :xm-product="xmProduct" />
	
</template>

<script>
	import util from '@/components/mdp-ui/js/util';//全局公共库  
	import { mapState } from 'pinia'
import { useUserStore } from '@/store/modules/user'	  
import { useXmStore } from '@/store/modules/xm'	  
import { defineAsyncComponent } from  'vue'
	export default {  
		components: {    
 		}, 
		computed: {
		    ...mapState(useUserStore,[
		      'userInfo','roles' 
		    ]), 
            
		    ...mapState(useXmStore,[
		      'xmProduct' 
		    ]), 
			
        }, 
		watch: {   
	    },
		data() {
			return { 
				 

			}//end return
		},//end data
		methods: {  
			  
		},//end method
		mounted() { 
			
		}//end mounted
	}

</script>

<style lang="less" scoped> 

</style>