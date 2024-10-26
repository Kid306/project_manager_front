<template>
	<xm-question-list :query-scene="'my'" class="padding" />
</template>

<script>
	import util from '@/components/mdp-ui/js/util';//全局公共库

	import config from '@/api/mdp_pub/mdp_config';//全局公共库
	import { mapState } from 'pinia'
import { useUserStore } from '@/store/modules/user' 

	export default {
		computed: {
			...mapState(useUserStore,[
				'userInfo','roles'
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
