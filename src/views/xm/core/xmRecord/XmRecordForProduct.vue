<template>
	
		 <xm-record-mng v-if="xmProduct?.id" :product-id="xmProduct.id"/>
	
</template>

<script> 
	  
	import { mapState } from 'pinia'
import { useUserStore } from '@/store/modules/user'; 
import { useXmStore } from '@/store/modules/xm'; 
	import XmRecordMng from './XmRecord.vue'

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
			XmRecordMng,
			//在下面添加其它组件
		}, 
		activated(){ 
		},
		mounted() {   
		}
	}
</script>

<style scoped />