<template>
	<xm-question-list class="padding" :sel-project="projectInfo" />
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
				'userInfo','roles','projectInfo'
			]),
			...mapState(useXmStore,[ 'projectInfo'
			]),
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
