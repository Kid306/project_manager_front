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
		    ...mapState(useXmStore,['xmIteration']), 
			  xmProduct(){
				if(this.xmIteration && this.xmIteration.id){
					return {id:this.xmIteration.productId,productName:this.xmIteration.productName}
				}else{
					return null;
				}
			  }
		}, 
		watch:{
			 
		},
		data() {
			return {  
			}
		},//end data
		methods: {  
		},//end methods 
		mounted() {   
		}
	}
</script>

<style scoped />