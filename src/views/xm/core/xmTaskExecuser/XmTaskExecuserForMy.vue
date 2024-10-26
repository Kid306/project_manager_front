<template>
	 
			 <xm-task-execuser-mng :is-my="1" /> 
	
</template>

<script>
	import { mapState } from 'pinia'
import { useUserStore } from '@/store/modules/user';
	import XmTaskExecuserMng from './XmTaskExecuserMng.vue';
	
	export default { 
		props: [],
		computed: {
			...mapState(useUserStore,[
				'userInfo','roles'
			]),
			 
		}, 
		watch: {
			 
		},
		data() {
			return {
				 
			}
		},//end data
		methods: {
			  
			
		},//end methods
		components: { 
		   XmTaskExecuserMng
		    //在下面添加其它组件
		},
		mounted() {
		}
	}

</script>

<style scoped>
 
</style>