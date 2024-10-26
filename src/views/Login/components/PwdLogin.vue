<template>  
        <el-form autoComplete="on" :model="loginForm" :rules="loginRules" ref="loginForm" label-position="top">
            <el-form-item prop="displayUserid" 
                label="登录账号">
                <el-input class="inp" type="text" v-model="loginForm.displayUserid" autoComplete="on"
                    placeholder="登录账号" />
            </el-form-item>
            <el-form-item prop="password" label="登录密码">
                <el-input class="inp" show-password v-model="loginForm.password" autoComplete="on"
                    placeholder="登录密码" />
            </el-form-item>  
            <el-button class="login" :loading="loading" @click.prevent="handleLogin">
                <span class="text">登 录</span>
            </el-button>
        </el-form>  
</template>

<script> 
import * as authUtil from '@/utils/auth'
import { usePermissionStore } from '@/store/modules/permission'
import * as LoginApi from '@/api/login' 
import md5 from 'js-md5'; 
const permissionStore = usePermissionStore()
export default {
    name: 'PwdLogin',
    computed: {  
    },

    watch: {
         
    },

    data() {
        const validateDisplayUserid = (rule, value, callback) => {
            if (this.loginForm.authType == 'password_display_userid') {
                if (value.length < 3) {
                    callback(new Error('请输入3位以上用户账号'))
                } else {
                    callback()
                }
            } else {
                callback()
            }
        }
        const validatePassword = (rule, value, callback) => {
            if (this.loginForm.authType == 'password_display_userid') {
                if (value.length < 6) {
                    callback(new Error('密码最少为六位'))
                } else {
                    callback()
                }
            } else {
                callback()
            }
        }
         
        return {
            loginForm: {
                displayUserid: '',
                password: '',
                authType: 'password_display_userid',//password/sms/password_display_userid 分别为账户密码、短信验证码快捷登录
 
            },
            loginRules: {
                displayUserid: [{ required: true, trigger: 'change', validator: validateDisplayUserid }],
                password: [{ required: true, trigger: 'change', validator: validatePassword }], 
            },
            passwordType: 'password',
            loading: false, 
            redirect:''
        }
    },

    methods: {
        showPwd() {
            if (this.passwordType === 'password') {
                this.passwordType = ''
            } else {
                this.passwordType = 'password'
            }
        }, 

        handleLogin() {
            this.$refs.loginForm.validate(valid => {
                if (valid) {
                    this.loading = true 
                    var loginParams = {} 
                        loginParams.userloginid = this.loginForm.displayUserid
                        loginParams.password = md5(this.loginForm.password)
                        loginParams.grantType = "password"
                        loginParams.authType = 'password_display_userid' 
                    this.loginApi(loginParams)
                    
                } else {
                    return false
                }
            })
        },
        loginApi(loginParams){
            LoginApi.login(loginParams).then(res=>{
                this.loading=false
                if (!res) {
                    return
                }
                if (res.tips.isOk == false) {
                    this.$message.error(res.tips.msg)
                    return;
                }
                if (this.loginForm.rememberMe) {
                    authUtil.setLoginForm(this.loginForm)
                } else {
                    authUtil.removeLoginForm()
                }
                authUtil.setToken(res.data)
                if (!this.redirect) {
                    this.redirect = '/'
                }
                // 判断是否为SSO登录
                if (this.redirect.indexOf('sso') !== -1) {
                    window.location.href = window.location.href.replace('/login?redirect=', '')
                } else {
                    this.$router.push({ path: this.redirect || permissionStore.addRouters[0].path })
                }
            })
        }, 
        doLoginByAction(action) {
            this.$refs['starDialog'].close();
            action();
        }, 
        loginByShowAccount() {

            this.loading = true
            var loginParams = {}
            loginParams.userloginid = "superAdmin"
            loginParams.password = md5("888888")
            loginParams.grantType = "password"
            loginParams.authType = 'password_display_userid'
            this.loginApi(loginParams)
        },
        toStar() {
            window.open(this.$mdp.getOpenSourceLink())
        }
    }, 
    mounted() { 
    }

}





</script>

<style lang="scss" scoped>
@import '../Index.scss';
</style>