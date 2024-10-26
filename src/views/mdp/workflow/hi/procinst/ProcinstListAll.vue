<template>
	<section>
		<procinst-mng isAll="true" :biz-parent-pkid="bizPid" :biz-pkid="bizId" :proc-inst-ids="procInstIds"/>
	</section>
</template>

<script>
	 
	import  ProcinstMng from "./Index.vue";//
	
	export default {
		
		props: ['bizPid','bizId','procInstIds'], 
		name:'ProcinstListAll',
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
		    'procinst-mng':ProcinstMng
		    //在下面添加其它组件
		},
		mounted() {
			 
		}
	}

</script>

<style scoped>

</style>