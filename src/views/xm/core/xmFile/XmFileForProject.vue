<template>
	
		<mdp-select-att v-if="projectInfo?.id"  crely-type="xm-project" :crely-id="projectInfo.id" :bizId="projectInfo.id" subOpType="mng"/>
	
</template>

<script> 
	  
	import { mapState } from 'pinia'
import { useUserStore } from '@/store/modules/user';  
import { useXmStore } from '@/store/modules/xm';   

	export default {  
		computed: {
		    ...mapState(useUserStore,[
		      'userInfo','roles'
				]), 
				
		    ...mapState(useXmStore,['projectInfo']), 
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
			//在下面添加其它组件
		}, 
		activated(){ 
		},
		mounted() {   
		}
	}
</script>

<style scoped />