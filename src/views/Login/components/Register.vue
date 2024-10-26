<template>
  <div>
    <div class="login_form">
        <el-form  autoComplete="on" :model="loginForm" :rules="loginRules" ref="loginForm" label-position="top">
          

            <el-form-item prop="displayUserid"  label="登录账号"> 
                <el-input   name="displayUserid" type="text" v-model="loginForm.displayUserid" autoComplete="on" placeholder="登录账号" />
            </el-form-item>

            <el-form-item prop="password"  label="登录密码"> 
                <el-input  show-password  name="password" :type="passwordType" v-model="loginForm.password" autoComplete="on" placeholder="密码"/>
            </el-form-item>

            
            <el-form-item prop="username"  label="用户名称"> 
                <el-input  name="username"  v-model="loginForm.username" autoComplete="on" placeholder="用户名称" />
            </el-form-item>
            
            <el-form-item prop="phoneno" label="手机号码"> 
                <el-input  name="phoneno" type="text" v-model="loginForm.phoneno" autoComplete="on" placeholder="手机号码"/>
            </el-form-item>

            <el-form-item prop="smsCode" label="短信验证码"> 
                <el-input  name="smsCode" type="text" v-model="loginForm.smsCode" autoComplete="on" placeholder="短信验证码">
                <template #append>
                  <el-button :disabled="abledBut" @click.prevent="sendPhonenoSmsCode">  
                    <span class="text" v-if="!abledBut">发送验证码</span>
                    <span class="text" v-else>({{setTimeNum}}s)</span>
                 </el-button> 
                </template> 
                </el-input>
              <span v-if="phonenoUsers!=null && phonenoUsers.length>0"> 该手机号已注册有{{phonenoUsers.length}}个账户 
                <el-button type="text"  @click="phonenoUsersVisible=true">查看明细</el-button>
              </span>
            </el-form-item>


            <el-button class="register" :loading="loading" @click.prevent="handleRegister">
                <span class="text">注 册</span>
            </el-button>




        </el-form>
        
        <el-dialog
          title="查看已有账户"
          v-model="phonenoUsersVisible"
          width="600" append-to-body> 
          <el-table :data="phonenoUsers">
            <el-table-column prop="userid" label="编号"/>
            <el-table-column prop="displayUserid" label="登录账号"/>
            <el-table-column prop="username" label="姓名"/>
            
            <el-table-column prop="branchName" label="企业"/>
          </el-table>
        </el-dialog> 
    </div>
  </div>

  
</template>

<script>
import { sendNoAuthSmsCode } from '@/api/sms/sms';
import { checkPhoneno,checkDisplayUserid,doRegister,queryByUserloginid } from '@/api/login';
 
import md5 from 'js-md5';


export default { 
  name: 'Register',
  data() {
    const validateDisplayUserid = (rule, value, callback) => { 
        if( !value || value.length<3){
          callback(new Error('请输入3位以上用户账号'))
        }else{
          callback()
        }  
    }
    const validatePassword = (rule, value, callback) => { 
        if( !value || value.length<6){
          callback(new Error('密码最少为六位'))
        }else{
          callback()
        }  
    }
    const validatePhoneno = (rule, value, callback) => { 
        if( !value || value.length !=11 ){
          callback(new Error('手机号码必须为11位号码'))
        }else{
          callback()
        }  
    }
    const validateSmsCode = (rule, value, callback) => { 
        if( !value || value.length !=6 ){
          callback(new Error('请输入6位短信验证码'))
        }else{
          callback()
        }  
    }
    const validateUsername = (rule, value, callback) => { 
        if( !value || value.length <2 ){
          callback(new Error('请输入用户名称'))
        }else{
          callback()
        }  
    }
    return {
      loginForm: {
        username:'', 
        displayUserid: '',
        password: '',
        authType:'password_display_userid',//password/sms/password_display_userid 分别为账户密码、短信验证码快捷登录
        phoneno:'',//手机号码
        smsCode:'',//短信验证码
      },
      loginRules: {
        
        username: [{ required: true, trigger: 'change', validator: validateUsername }],
        displayUserid: [{ required: true, trigger: 'change', validator: validateDisplayUserid }],
        password: [{ required: true, trigger: 'change', validator: validatePassword }],
        phoneno: [{ required: true, trigger: 'change', validator: validatePhoneno }],
        smsCode: [{ required: true, trigger: 'change', validator: validateSmsCode }],
      }, 
      passwordType: 'password',
      
      loading: false,
      showTpLoginDialog: false, //显示第三方登陆对话框
      deptSelectVisible:false,//显示选择部门对话框
      userDeptid:'',//选中的部门编号 
      addBranchFormVisible:false,  //显示添加机构对话框 
      phonenoUsers:[],
      phonenoUsersVisible:false,
      
      abledBut: false, //是否禁止
		  setTimeNum: 60,  // 倒计时时间
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
    sendPhonenoSmsCode(){
      if(!this.loginForm.phoneno){
        this.$message.error("手机号码不能为空");
        return;
      }
      if(this.loginForm.phoneno.length !=11 ){
        this.$message.error("手机号码必须为11位");
        return;
      }
      var params={
        phoneno:this.loginForm.phoneno,
        scene:"register"
      } 
      queryByUserloginid({userloginid:this.loginForm.phoneno,idType:"phoneno"}).then(res0=>{  
        if(res0.tips.isOk){
          this.phonenoUsers=res0.data.data; 
          // 下方先注释掉Sms短信服务，修改验证码鉴权逻辑
          this.$message.success("发送成功");
          this.$emit('registration-complete', "Register")
          // sendNoAuthSmsCode(params).then(res=>{
          //   console.log(res)
          //   if(res.tips.isOk){
          //     this.$message.success("发送成功");
              
          //     if (this.setTimeNum > 0) {
          //           this.abledBut = true
          //           this.timeWrap = setInterval(() => {
          //               this.setTimeNum -= 1
          //           }, 1000)
          //       }
          //   }else{
          //     this.$message.error(res.tips.msg);
          //   }
          // })
        }else{
          this.$message.error(res0.data.tips.msg);
        }
      })
      
    },
    checkDisplayUserid(){
      if(!this.loginForm.displayUserid){
        this.$message.error("账号不能为空");
        return;
      }
      checkDisplayUserid(this.loginForm.displayUserid).then(res0=>{
        if(res0.data.tips.isOk){
           this.$message.success("该账户可以注册");
        }else{
          this.$message.error("该账户已存在，不允许再注册！");
        }
      })
      
    },
    
    getQueryVariable(variable,url){
      var query =url;
      if(url==null || url==undefined || url==''){
        query=window.location.href;

      }
      //alert(query);
      var query2=query.split("?");
      if(query2.length>1){
        query=query2[1];
      }else{
        query=""
        return null;
      }

          var vars = query.split("&");
          for (var i=0;i<vars.length;i++) {
                  var pair = vars[i].split("=");
                  if(pair[0] == variable){return pair[1];}
          }
          return null;
    },
    handleRegister() {
      this.loading = true 
      this.$refs.loginForm.validate(valid => {
        if (valid) { 
          let params={
        		  displayUserid:this.loginForm.displayUserid,
              password:md5(this.loginForm.password),
              deptid:this.userDeptid,
              phoneno:this.loginForm.phoneno,
              smsCode:this.loginForm.smsCode,
              username:this.loginForm.username,
          } 
          var branchId=this.getQueryVariable("branchId")
          if(branchId){
            params.branchId=branchId
          }
          doRegister(params).then(res=>{
            this.loading = false  
            if(res.tips.isOk){
              this.$message.success(res.tips.msg);
              // this.$router.push({ path:  })
            }else{
              this.$message.error(res.tips.msg);
            }
          })
        } else {
            this.loading = false  
           return false
        }
      })
    }, 
  }, 
  computed: {  
  }
}
</script>


<style lang="scss" scoped>
@import '../Index.scss';
</style>