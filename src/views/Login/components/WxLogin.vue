<template>  
    <div class="center">
        <div id="login_container" v-loading="loading"></div> 
        <el-row class="center">
        <el-button  @click="$emit('close')"
            icon="back" class="back">返回</el-button><el-button style="width:70%;" @click="weixinLogin" icon="refresh">刷新二维码</el-button>
        </el-row> 
    </div>
</template>

<script> 
 
import { getTpaState } from '@/api/login'; 
export default {
    name: 'WxLogin',
    computed: {  
    },

    watch: { 
    },

    data() { 
        return { 
            loading:false,
        }
    },

    methods: {
         
        weixinLogin() {
            this.loading=true;
            var curlDomain = window.location.protocol + "//" + window.location.host; //   
            var mdpRedirectUri =this.$mdp.getUri(curlDomain,import.meta.env.VITE_CONTEXT,import.meta.env.VITE_UI_VERSION)+"?toPath=social/login/success"
            var tpaContext = this.$mdp.getTpaCtx();
            var domain = this.$mdp.getFixedDomain();
            var appType = this.$mdp.getWxpubConfig().appType;
            var scope = this.$mdp.getWxpubConfig().scope  
            var reUri=this.$mdp.getUri(domain,"/api/",import.meta.env.VITE_API_VERSION,tpaContext,`/login/token?authType=wechat_wxpub&appType=${appType}&redirectUri=${mdpRedirectUri}`)
           
            getTpaState().then(res => {
                var tips = res.tips;
                if (tips.isOk) {
                    this.$nextTick(()=>{
                        var state = res.data 
                        var obj = new WxLogin({
                            self_redirect: false,
                            id: "login_container",
                            appid: this.$mdp.getWxpubConfig().appid,
                            scope: scope,
                            redirect_uri: encodeURIComponent(reUri),
                            state: state,
                            style: "",
                            href: ""
                        });
                    })
                    this.loading=false;
                }
            })

        },

         

    }, 
    mounted() {
        const s = document.createElement('script');
        s.type = 'text/javascript';
        s.src = 'https://res.wx.qq.com/connect/zh_CN/htmledition/js/wxLogin.js';
        document.body.appendChild(s);
        this.$nextTick(()=>{
            this.weixinLogin()
        })
    }

}





</script>

<style lang="scss" scoped>
@import '../Index.scss';
</style>