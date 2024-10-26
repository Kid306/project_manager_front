<template>
  <el-form ref="formRef" :model="emailForm" :label-width="120">
       <el-steps :active="0" finish-status="success" class="padding" align-center>
        <el-step title="1 输入新邮箱-提交"/>
        <el-step title="2 收邮件，点击链接"/>
        <el-step title="3 自动验证新邮箱"/>
      </el-steps>
      <el-divider/>
     <el-form-item label="邮箱" prop="email" :rules="[{required:true,message:'邮箱不能为空'},{validator:validateEmail}]">
							<el-input v-model="emailForm.email"/> 
		</el-form-item>  
    <el-form-item>
      <el-button type="primary" @click="registerEmail" v-if="!userInfo.email">发送邮件</el-button>
			<el-button type="primary" @click="changeEmail" v-if="userInfo.email">发送邮件</el-button>
    </el-form-item>
  </el-form>
</template>
<script lang="ts" setup>
import type { FormInstance } from 'element-plus' 
 
import { sendEmail } from '@/api/login';  
const {proxy}: any = getCurrentInstance()
import { useUserStore } from '@/store/modules/user'

defineOptions({ name: 'ChangePhoneno' })

const message = useMessage()
const formRef = ref<FormInstance>()
const emailForm = reactive({
  email: ''
})

// 表单校验 
 
const validateEmail = (rule, value, callback) => {
  if (value=='') {
    callback();
  } else {
  if (value !== '') {
    var reg = /^([a-zA-Z]|[0-9])(\w|\-)+@[a-zA-Z0-9]+\.([a-zA-Z]{2,4})$/;
    if(!reg.test(value)){
        callback(new Error('邮箱格式不正确'));
    }  
  }
  callback();
  }
}
const userStore = useUserStore()  
const userInfo=userStore.getUserInfo
 
const registerEmail = ()=>{
  if(emailForm.email){
    var curlDomain=window.location.protocol+"//"+window.location.host;  
    
    sendEmail({codeScene:'1',codeEmail:emailForm.email,userType:'staff',callbackUri:proxy.$mdp.getUri(curlDomain,proxy.$mdp.getSysCtx(),import.meta.env.VITE_API_VERSION,"/#/",'/updateUserInfo')}).then(res=>{
      var tips = res.tips;
      if(tips.isOk){
        message.notify({ message: "邮件已发送，请到收件箱收取邮件，并点击其链接进行自动验证。", type: 'success' }); 
      }else{
        message.notify({ message: tips.msg, type: tips.isOk?'success':'error' }); 
      }
      
    })
  }else{
    message.notify({ message: "请输入邮箱号码", type: 'error' }); 
  }
}
const changeEmail = ()=>{
  if(emailForm.email){
    
    var curlDomain=window.location.protocol+"//"+window.location.host;  
    sendEmail({codeScene:'3',codeEmail:emailForm.email,userType:'staff',callbackUri:proxy.$mdp.getUri(curlDomain,proxy.$mdp.getSysCtx(),import.meta.env.VITE_API_VERSION,"/#/",'/changeEmailStepOne')}).then(res=>{
      var tips = res.tips;
      if(tips.isOk){
        message.notify({ message: "邮件已发送，请到收件箱收取邮件，并点击其链接进行验证原邮箱。", type: 'success' }); 
      }else{
        message.notify({ message: tips.msg, type: tips.isOk?'success':'error' }); 
      }
    })
  }else{ 
    message.notify({ message: "请输入邮箱号码", type: 'error' }); 
  }
} 
</script>
