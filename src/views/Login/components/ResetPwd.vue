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
                    <el-button class="sendCode"  :disabled="abledBut" @click.prevent="sendPhonenoSmsCode('login')">
                        <span class="text" v-if="!abledBut">发送验证码</span>
                        <span class="text" v-else>({{ setTimeNum }}s)</span>
                    </el-button>
                </template>
            </el-input>
        </el-form-item> 
        <el-form-item prop="password" label="新密码">
            <el-input class="inp" name="password" v-model="loginForm.password" autoComplete="on"
                placeholder="新密码" type="password"/>
        </el-form-item>
            <el-button  class="login" :loading="loading" @click.prevent="handleResetPasswordByPhoneno">
                <span class="text">重置密码</span>
            </el-button> 
       
    </el-form>   
</template>

<script>
import { sendNoAuthSmsCode } from '@/api/sms/sms';   
 import * as LoginApi from '@/api/login' 
import md5 from 'js-md5';
import { resetPasswordByPhoneno } from '@/api/login';  
export default {
    name: 'ResetPwd',
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
                if (value.length != 11) {
                    callback(new Error('手机号码必须为11位号码'))
                } else {
                    callback()
                } 
        }
        const validateSmsCode = (rule, value, callback) => { 
                if (value.length != 6) {
                    callback(new Error('请输入6位短信验证码'))
                } else {
                    callback()
                }
        }
        
        const validatePassword = (rule, value, callback) => {
            if (value.length < 6) {
                callback(new Error('密码最少为六位'))
            } else {
                callback()
            } 
        }
        return {
            loginForm: { 
                phoneno: '',//手机号码
                smsCode: '',//短信验证码
                password:''
            },
            loginRules: { 
                phoneno: [{ required: true, trigger: 'blur', validator: validatePhoneno }],
                smsCode: [{ required: true, trigger: 'blur', validator: validateSmsCode }],
                password: [{ required: true, trigger: 'blur', validator: validatePassword }]
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
        

        handleResetPasswordByPhoneno() {
            this.loading = true 
            this.$refs.loginForm.validate(valid => {
                if (valid) { 
                    let params={
                        newPassword:md5(this.loginForm.password),
                        phoneno:this.loginForm.phoneno,
                        smsCode:this.loginForm.smsCode
                    } 
                    resetPasswordByPhoneno(params).then(res=>{
                        this.loading = false  
                        if(res.tips.isOk){
                            this.$message.success(res.tips.msg); 
                            this.$emit('close')
                        }else{
                            this.$message.error(res.tips.msg);
                        }
                    })
                } else {
                    this.loading = false  
                    return false
                }
            })
        }
          
    }, 
    mounted() { 
    }

}





</script>

<style lang="scss" scoped>
@import '../Index.scss';
</style>