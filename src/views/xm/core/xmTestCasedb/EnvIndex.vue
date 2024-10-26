<template>
	
		 <xm-test-casedb-env v-if="testCasedb&&testCasedb.id" :xmTestCasedb="testCasedb" @edit-fields="onEditFields" />
	
</template>

<script>
	import util from '@/components/mdp-ui/js/util';//全局公共库
	  
	import { mapState } from 'pinia'
import { useUserStore } from '@/store/modules/user'; 
import { useXmStore,useXmStore2 } from '@/store/modules/xm'
	import XmTestCasedbEnv from './XmTestCasedbEnv.vue'
	  

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
			onEditFields(row){
				let db=Object.assign({},this.testCasedb,row)
				useXmStore2().setTestCasedb(db)
			}
		},//end methods
		components: {  
			XmTestCasedbEnv, 
		},  
		mounted() {   
		}
	}
</script>

<style scoped />