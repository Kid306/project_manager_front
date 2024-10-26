<template>
	<xm-question-list class="padding" v-if="xmIteration && xmIteration.id" :xm-product="xmProduct" :xm-iteration="xmIteration" />
</template>

<script>
	import util from '@/components/mdp-ui/js/util';//全局公共库

	import config from '@/api/mdp_pub/mdp_config';//全局公共库
	  
	import { mapState } from 'pinia'
import { useUserStore } from '@/store/modules/user' 
import { useXmStore } from '@/store/modules/xm' 
import { defineAsyncComponent } from  'vue'

	export default {
		computed: {
			...mapState(useUserStore,[
				'userInfo','roles','xmIteration'
			]),
			...mapState(useXmStore,[ 'xmIteration'
			]),
			xmProduct(){
				if(this.xmIteration && this.xmIteration.id){
					return {id:this.xmIteration.productId,productName:this.xmIteration.productName}
				}else{
					return null;
				}
				
			}
		}, 
		 
		data() {
			 
			return {
				 

			}

		},//end data
		methods: {
			 

		},//end methods
		components: { 
		},
		mounted() {
			 
		}
	}

</script>

<style lang="scss" scoped>
 
</style>
