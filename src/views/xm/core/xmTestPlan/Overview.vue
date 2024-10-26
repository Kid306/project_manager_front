<template>
	
		 <xm-test-plan-mng v-if="testCasedb&&testCasedb.id" :xm-test-casedb="testCasedb" />
	
</template>

<script>  
	import { mapState } from 'pinia'
import { useUserStore } from '@/store/modules/user'; 
import { useXmStore } from '@/store/modules/xm'; 
	import XmTestPlanMng from './XmTestPlanMng.vue'

	export default {  
		computed: {
		    ...mapState(useUserStore,[
		      'userInfo','roles'
				]), 
		    ...mapState(useXmStore,[ 'testCasedb'
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
			XmTestPlanMng,
			//在下面添加其它组件
		},  
		mounted() {   
		}
	}
</script>

<style scoped />