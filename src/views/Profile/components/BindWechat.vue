<template> 
      <div class="center">
        <div>  
          <div id="login_container" ></div> 
        </div>
        <p>扫码登录，自动绑定个人微信号，接收重要信息通知(如果已绑定，可以重新绑定)</p>
        <el-alert>如果二维码未出现，刷新下页面</el-alert>
      </div> 
</template>
<script lang="ts" setup> 
const {proxy}: any = getCurrentInstance()
import { useUserStore } from '@/store/modules/user'

defineOptions({ name: 'WechatBind' })
 
const message = useMessage() 
var scanCodeForm = reactive({
  joinUserid:'',sendBranchId:'',sendUserid:'',inviteId:'',sendBranchName:'',sendUsername:'',sendTime:'',inviteState:'',inviteScene:'',inviteType:'',objType:'',joinUsername:''
})

const userStore = useUserStore()  
const userInfo=userStore.getUserInfo
// 表单校验 
 
var load = {list:false}
const initScanCode = ()=>{  
  if(!userInfo || !userInfo.userid){
    return;
  }
  load.list=true;
  proxy.$mdp.createInviteId({inviteScene:'2',inviteType:'1',joinUserid:userInfo.userid,joinUsername:userInfo.username}).then(res=>{
    var tips = res.tips
      load.list=false;
    if(tips.isOk){
      scanCodeForm=Object.assign({},res.data)
      weixinLogin();
    }else{
      message.error(tips.msg);
    }
    
  })
}

const weixinLogin = ()=>{
  var curlDomain=window.location.protocol+"//"+window.location.host; //   
  var mdpRedirectUri = proxy.$mdp.getUri(curlDomain,import.meta.env.VITE_CONTEXT,import.meta.env.VITE_UI_VERSION)+"?toPath=user/profile/index"
  var tpaContext=proxy.$mdp.getTpaCtx();
  var domain=proxy.$mdp.getFixedDomain();
  var appType=proxy.$mdp.getWxpubConfig().appType;
  var scope=proxy.$mdp.getWxpubConfig().scope
  var state=scanCodeForm.inviteId
  var reUri=proxy.$mdp.getUri(domain,"/api/",import.meta.env.VITE_API_VERSION,tpaContext,`/login/token?authType=wechat_wxpub&appType=${appType}&redirectUri=${mdpRedirectUri}`)
           
  new WxLogin({
    self_redirect:false,
    id:"login_container", 
    appid: proxy.$mdp.getWxpubConfig().appid, 
    scope: scope, 
    redirect_uri: encodeURIComponent(reUri),
    state: state,
    style: "",
    href: ""
  });  
}

const init = () => {
			
			var s1 = document.createElement('script');
			s1.type = 'text/javascript';
			s1.src = 'https://res.wx.qq.com/connect/zh_CN/htmledition/js/wxLogin.js';
			document.body.appendChild(s1); 
      nextTick(()=>{
        initScanCode(); 
      })
      
}

onMounted(async () => {
   init()
})
</script>
