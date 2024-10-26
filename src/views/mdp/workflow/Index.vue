<template>
	<el-row>
		<el-steps :active="1">
		  <el-step title="模型设计" icon="edit"/>
		  <el-step title="发布" icon="picture"/>
		  <el-step title="业务发起审批" icon="picture"/>
		  <el-step title="流程流转" icon="picture"/>
		  <el-step title="归档" icon="picture"/>
		  <el-step title="历史查阅" icon="picture"/>
		</el-steps>
	</el-row>
</template>

<script>
	import config from '@/api/mdp_pub/mdp_config'; 
	export default {
		data() {
			return {
 
			}
		},
		methods: {
 
		},
		mounted() {
			 

		}
	}

</script>

<style scoped lang="scss">
	 
</style>