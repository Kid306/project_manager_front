<template>
	
		 <xm-group-mng :xm-product="xmProduct"  v-if="xmProduct?.id" />
	
</template>

<script>
	import util from '@/components/mdp-ui/js/util';//全局公共库
	 
	import {  listXmProject } from '@/api/xm/core/xmProject';
	import { mapState } from 'pinia'
import { useUserStore } from '@/store/modules/user'; 
import { useXmStore } from '@/store/modules/xm'; 
	import XmGroupMng from './XmGroupMng.vue'

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
		components: {  
			XmGroupMng,
			//在下面添加其它组件
		}, 
		activated(){ 
		},
		mounted() {   
		}
	}
</script>

<style scoped />