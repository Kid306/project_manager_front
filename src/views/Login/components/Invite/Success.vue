<template>
  <div class="page-container">
    <el-button @click="goIndex" icon='arrow-left' class="pan-back-btn">{{title}}首页</el-button>

        <h1 class="text-jumbo text-ginormous">tips:</h1>
       
        <el-descriptions :title=" '您好,以下是您在【'+title+'】的登录账号信息，请妥善保管！'" :column="3" border>
          <el-descriptions-item
            label="用户名称"
            label-align="center" 
            label-class-name="my-label"
            class-name="my-content" 
          >
          {{tips.username?decodeURIComponent(tips.username):"还没设置名称"}}
          </el-descriptions-item>
          <el-descriptions-item label="登录账号" label-align="center" align="center">
            {{ tips.userid?tips.userid:'暂时为空' }}  
          </el-descriptions-item>
          <el-descriptions-item label="登录密码" label-align="center" align="center">
            {{ tips.password?tips.password:'暂时为空' }}  
          </el-descriptions-item> 
        </el-descriptions>
         <h6>您可以：</h6>
         <ul class="list-unstyled"> 
          <li class="link-type">
            <router-link to="/user/profile/index" title="可以修改我的账户名称、密码等">修改账户(名称、密码、手机号等)</router-link>
          </li>   
          <li class="link-type">
            <router-link to="/index">首页</router-link>
          </li>   
          <li class="link-type">
             <a @click="LogOut">账户密码登录</a>
          </li>   
          <li class="link-type">
            <a @click="LogOut">微信扫码登录</a>
          </li>   
        </ul>
  </div>
</template>

<script>
import errGif from '@/assets/image/logo_cicle.png'

export default {
  name: 'page401',
  watch:{
    $route(to){ 
      this.tips=to.query
    }
  },
  data() {
    return {
      errGif: errGif + '?' + +new Date(),
      ewizardClap: 'https://wpimg.wallstcn.com/007ef517-bafd-4066-aae4-6883632d9646',
      dialogVisible: false,
      tips:{
        tipscode:'',
        isOk:'',
        msg:'',
        password:'',
        userid:'',
        username:''
      },
      title: import.meta.env.VITE_APP_TITLE
    }
  },
  methods: {
    goIndex(){
      this.$router.push({path:"/"})
    },
    
    LogOut(){  
        this.$router.push({ path: '/login' }) 
    },
    back() {
      if (this.$route.query.noGoBack) {
        this.$router.push({ path: '/' })
      } else {
        this.$router.go(-1)
      }
    }
  },
  mounted(){ 
      this.tips=this.$route.query  
      sessionStorage.removeItem("index-path")
  }
}
</script>

<style rel="stylesheet/scss" lang="scss" scoped>
  .page-container {
    width: 800px;
    margin: 100px auto;
    .pan-back-btn {
      background: #008489;
      color: #fff;
    }
    .pan-gif {
      margin: 0 auto;
      display: block;
    }
    .pan-img {
      display: block;
      margin: 0 auto;
      width: 100%;
    }
    .text-jumbo {
      font-size: 60px;
      font-weight: 700;
      color: #484848;
    }
    .list-unstyled {
      font-size: 14px;
      li {
        padding-bottom: 5px;
      }
      a {
        color: #008489;
        text-decoration: none;
        &:hover {
          text-decoration: underline;
        }
      }
    }
  }
</style>
