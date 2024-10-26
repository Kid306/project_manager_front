<template>
	<section>
		<execution-mng isAll="true"/>
	</section>
</template>

<script>
	 
	import  ExecutionMng from "./Index.vue";//
	
	export default {
		name:'ExecutionListAll',
		data() {
			return {
				filters: {
					key: '', 
				},
				 
				/**begin 自定义属性请在下面加 请加备注**/
					
				/**end 自定义属性请在上面加 请加备注**/
			}
		},//end data
		methods: {
			 
			
		},//end methods
		components: { 
		    'execution-mng':ExecutionMng
		    //在下面添加其它组件
		},
		mounted() {
			 
		}
	}

</script>

<style scoped>

</style>