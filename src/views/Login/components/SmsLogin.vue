<template>  
    <el-form autoComplete="on" :model="loginForm" :rules="loginRules" ref="loginForm" label-position="top">

        <el-form-item prop="phoneno" label="手机号码">
            <el-input class="inp" name="phoneno" type="text" v-model="loginForm.phoneno" autoComplete="on"
                placeholder="手机号码" />
        </el-form-item>
        <el-form-item prop="smsCode" label="短信验证码">
            <el-input  v-model="loginForm.smsCode"
                autoComplete="on" placeholder="短信验证码" >
                <template #append>
                    <el-button  :disabled="abledBut" @click.prevent="sendPhonenoSmsCode('login')">
                        <span  v-if="!abledBut">发送验证码</span>
                        <span  v-else>({{ setTimeNum }}s)</span>
                    </el-button>
                </template>
            </el-input>
        </el-form-item> 

            <el-button  class="login" :loading="loading" @click.prevent="handleLogin">
                <span class="text">登 录</span>
            </el-button> 
       
    </el-form>   
</template>

<script>
import { sendNoAuthSmsCode } from '@/api/sms/sms';  
import * as authUtil from '@/utils/auth'
import { usePermissionStore } from '@/store/modules/permission'
import * as LoginApi from '@/api/login'

  import md5 from 'js-md5';
 const permissionStore = usePermissionStore()
export default {
    name: 'SmsLogin',
    computed: {  
    },

    watch: {
        /* 使用watch来响应数据的变化 */
        //监听倒计时数据的变化，小于0的时候，清除定时器，解开按钮，重置倒计时
        setTimeNum(newVal, oldVal) {
            if (newVal < 0) {
                clearInterval(this.timeWrap)
                this.abledBut = false
                this.setTimeNum = 60
            }
        }, 
    },

    data() {
        
        const validatePhoneno = (rule, value, callback) => {
            if (this.loginForm.authType == 'sms') {
                if (value.length != 11) {
                    callback(new Error('手机号码必须为11位号码'))
                } else {
                    callback()
                }
            } else {
                callback()
            }
        }
        const validateSmsCode = (rule, value, callback) => {
            if (this.loginForm.authType == 'sms') {
                if (value.length != 6) {
                    callback(new Error('请输入6位短信验证码'))
                } else {
                    callback()
                }
            } else {
                callback()
            }
        }
        return {
            loginForm: { 
                authType: 'password_display_userid',//password/sms/password_display_userid 分别为账户密码、短信验证码快捷登录
                phoneno: '',//手机号码
                smsCode: '',//短信验证码
            },
            loginRules: { 
                phoneno: [{ required: true, trigger: 'blur', validator: validatePhoneno }],
                smsCode: [{ required: true, trigger: 'blur', validator: validateSmsCode }],
            }, 
            setTimeNum: 60,  // 倒计时时间
            timeWrap: null,  // 定时器标识 
            redirect:'',
            abledBut:false,
        }
    },

    methods: { 

        sendPhonenoSmsCode(scene) {
            var params = {
                phoneno: this.loginForm.phoneno,
                scene: scene
            }
            sendNoAuthSmsCode(params).then(res => {
                if (res.tips.isOk) {
                    this.$message.success("发送成功");
                    if (this.setTimeNum > 0) {
                        this.abledBut = true
                        this.timeWrap = setInterval(() => {
                            this.setTimeNum -= 1
                        }, 1000)
                    }
                } else {
                    this.$message.error(res.tips.msg);
                }
            })
        }, 

        handleLogin() {
            this.$refs.loginForm.validate(valid => {
                if (valid) {
                    this.loading = true 
                    var loginParams = {} 
                    loginParams.userloginid = this.loginForm.phoneno
                    loginParams.password = this.loginForm.smsCode
                    loginParams.grantType = "password"
                    loginParams.authType = "sms" 
                    this.loginApi(loginParams) 
                } else {
                    return false
                }
            })
        },
        loginApi(loginParams){
            LoginApi.login(loginParams).then(res=>{
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
          
    }, 
    mounted() { 
    }

}





</script>

<style lang="scss" scoped>
@import '../Index.scss';
</style>