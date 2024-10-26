<template>
	<section>
		<StartIndex :startParams="startParams" v-if="startParams.bizKey"/>
	</section>
</template>

<script>
	 
	import  StartIndex from "./Index.vue";//
	
	export default {
		name:'BizStartProc',
		watch:{
			'$route'(to, from) { 
				this.initStartParams()
			}
		},
		data() {
			return {
				 
				startParams:{
					//params可能是外部传入，或者内部初始化而来
					//procDefId: '', //客户选择的启动流程
					mainTitle: '', //主标题，由mainContext的首行提取
					mainContext: '',
					bizUrl: '', //前端跳转  //自带参数，建议只带主键
					bizKey: '', //用于选中流程模型并原样输出到restUrl
					restUrl: '', //后端接口同步
					formId: '', //form 表单编号,对应引擎的formKey
					bizId: '', //业务主键
					bizPid: '', //如果是多级主键，指上级的主键，默认与bizId相同
					flowVars: {//需要提交给流程引擎的变量，外部的变量是不提交给引擎的
						data:{// data节点一般用来存储表单数据、主题业务数据等，根随流程引擎流转，调restUrl接口时，会一并推送到对方接口

						}
					} 
				}
			}
		},//end data
		methods: {
			 initStartParams(){ 
				
				let paramsId = this.$route.query.paramsId
				if(paramsId){
					let params=this.$mdp.getCacheParams(paramsId)
					Object.assign(this.startParams,params)
				}else{
					this.startParams={}
				}
			 }
			
		},//end methods
		components: {  
			StartIndex
		},
		mounted() {
			 this.initStartParams()
		}
	}

</script>

<style scoped>

</style>