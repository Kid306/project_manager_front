<template>
    <div class="login_container"> 
        <div class="login_content"> 
            <div class="left wl-1/2" >
              
            </div>
            <div class="right wl-1/2">
               
                <div class="logo">
                    <img src="@/assets/image/logo_cicle.png"/>
                    <span>唛盟</span>
                    
                </div>
                <div class="theme"> <ThemeSwitch @change="themeChange" style="float:right;"/></div>
                <div class="login_box">
                   
                    <div class="login_box_content">
                        
                        <div class="top" style="line-height:50%;">
                            <span class="title">平台{{status == 'Register' ? '注册' : '登录' }}</span>
                            <span v-if="status == 'PwdLogin'" >没有账号？<el-link style="color:#409EFF;" @click="status = 'Register' ">点此注册</el-link> </span>
                            <span v-else>已有账号？<el-link style="color:#409EFF;" @click="status = 'PwdLogin' ">点此登录</el-link> </span>
                        </div>
                        <div class="login_form">
                            <PwdLogin v-if="status == 'PwdLogin'" ref="PwdLogin"/>
                            <Register v-else-if="status=='Register'" @close="status='PwdLogin'" @registration-complete="handleStatusChangeEvent"/>
                            <SmsLogin v-else-if="status=='SmsLogin'" @close="status='PwdLogin'" />
                            <WxLogin v-else-if="status=='WxLogin'" @close="status='PwdLogin'"/>
                            <ResetPwd v-else-if="status=='ResetPwd'" @close="status='PwdLogin'"/>
                        
                            <div class="oper" v-if="status=='PwdLogin'">
                                <el-link @click="status='ResetPwd'">忘记密码</el-link>
                                <el-link @click="$refs['starDialog'].open({action:'DemoLogin'})"  class="btn">演示账户登录</el-link>
                                <el-link @click="status='SmsLogin'"  class="btn">手机号登录</el-link> 
                            </div>
                        </div>
                        <div class="bottom" v-if="status=='PwdLogin'||status=='SmsLogin'">
                            <el-divider content-position="center" style="text-decoration-color:antiquewhite;">第三方登录方式</el-divider>
                            <div class="other"> 
                                <img src="@/assets/image/module/weixin.png" @click="$refs['starDialog'].open({action:'WxLogin'})"/>
                            </div>
                        </div>
                    </div>

                </div>
            </div>
        </div>
    </div>
    <mdp-dialog ref="starDialog" width="600px" title="hi~同学，来支持一下【唛盟开源】吧，为项目点个Star!">
            <el-row class="center">
                <el-button size="large" @click="toStar" target="_blank" type="warning"
                    icon="el-icon-star-off">唛盟项目</el-button>
            </el-row>
            <template #footer="{ data, dialog }">
                <el-button @click="dialog.close()">取消</el-button><el-button type="primary"
                    @click="doLoginByAction(data.action)">已点赞，继续登陆</el-button>
            </template>
        </mdp-dialog> 
</template>

<script> 

import { ThemeSwitch } from '@/layout/components/ThemeSwitch'  
import { useAppStore } from '@/store/modules/app'  

const appStore = useAppStore()

import PwdLogin from './components/PwdLogin.vue';
import Register from './components/Register.vue';
import SmsLogin from './components/SmsLogin.vue';
import WxLogin from './components/WxLogin.vue'; 
import ResetPwd from './components/ResetPwd.vue'; 

export default {
    name: 'login',
    components: {PwdLogin, Register,WxLogin,SmsLogin,ResetPwd,ThemeSwitch},
    data() {
        return {
            status: "PwdLogin",
        }
    },

    methods: {
        // 组件通知时间
        handleStatusChangeEvent(status) {
            debugger
            this.status = status
        },

        doLoginByAction(action) {
            this.$refs['starDialog'].close();
            
            if(action=='DemoLogin'){
                this.status='PwdLogin'
                this.$refs['PwdLogin'].loginByShowAccount()
            }else{
                this.status=action
            }
        },
        toStar() {
            window.open(this.$mdp.getOpenSourceLink())
        },
        themeChange(){
            
            const color = getCssVar('--el-bg-color')
            appStore.setMenuTheme(color)
            appStore.setHeaderTheme(color)
        }
    },


    created() {
    }, 

}





</script>

<style lang="scss" scoped> 
@import './Index.scss';
</style>



