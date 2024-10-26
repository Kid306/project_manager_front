<template> 
<el-form :model="editForm"  label-width="120px"   ref="editForm">
	<el-form-item label="">
		<el-steps :active="currStep" finish-status="success">
			<el-step title="1 输入新邮箱"/>
			<el-step title="2 登录新邮箱，接收邮件，点击链接"/>
			<el-step title="3 自动验证，绑定邮箱成功"/>
		</el-steps>
	</el-form-item>
	<el-form-item v-loading="editLoading">
			<el-button type="primary" @click="doLogin">登录</el-button>
	</el-form-item>
</el-form> 
</template>

<script>
	import util from '@/components/mdp-ui/js/util';//全局公共库
	import { validEmailCode } from '@/api/login';
	export default {
		data() { 
			return { 
				valiCode:'',//验证码
				currStep:'2'
			}
		},
		methods: {  
			validEmailCode(){
				this.editLoading=true;
				validEmailCode({valiCode:this.valiCode,userType:'staff'}).then(res=>{
					var tips = res.tips;
					if(tips.isOk){
						this.currStep="3"
					} 
					this.editLoading=false;
					this.$message({ message: tips.msg, type: tips.isOk?'success':'error' });
				})
			},
			doLogin(){
				this.$router.push({path: '/login' });
			}
		}, 
		mounted() {
			var valiCode=this.$route.query.valiCode; 
			if(valiCode){
				this.valiCode=valiCode;
				this.validEmailCode();
			}
		}
	}

</script>

<style scoped>
</style>
