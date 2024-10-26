<template>
	
		 <xm-test-casedb-edit v-if="testCasedb&&testCasedb.id" :formData="testCasedb" />
	
</template>

<script>  
	import { mapState } from 'pinia'
import { useUserStore } from '@/store/modules/user'; 
import { useXmStore } from '@/store/modules/xm'; 
	import XmTestCasedbEdit from './XmTestCasedbEdit.vue'

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
			XmTestCasedbEdit,
			//在下面添加其它组件
		},  
		mounted() {   
		}
	}
</script>

<style scoped />