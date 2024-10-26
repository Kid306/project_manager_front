<template>
	 
		 <xm-product-mng :data-scope="'all'" :source="source" />
	
</template>

<script>
	import util from '@/components/mdp-ui/js/util';//全局公共库
	//import Sticky from '@/components/Sticky' // 粘性header组件 
	import { mapState } from 'pinia'
import { useUserStore } from '@/store/modules/user'
 import XmProductMng from './XmProductMng.vue';
	
export default { 
	props: ['source'],
	computed: {
		...mapState(useUserStore,[
			'userInfo','roles'
		]), 
	},
	watch: {
			
	},
	data() {
		return {
				
			/**end 自定义属性请在上面加 请加备注**/
		}
	},//end data
	methods: {
			
		/**end 自定义函数请在上面加**/
		
	},//end methods
	components: {  
		XmProductMng,
		//在下面添加其它组件
	},
	mounted() { 
		this.$nextTick(() => {
				
		}); 
	}
}

</script>

<style scoped />