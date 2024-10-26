<template>
  <el-form ref="formRef" :model="phonenoForm" :rules="rules" :label-width="120">
    <el-form-item label="手机号码" prop="phoneno">
      <el-input v-model="phonenoForm.phoneno" />
    </el-form-item>
    <el-form-item label="短信验证码" prop="smsCode">
      <el-input  v-model="phonenoForm.smsCode">
        <template #append>
          <el-button @click="sendPhonenoSmsCode('userPhoneno')" :disabled="smsCodeTime>0">发送短信验证码{{smsCodeTime>0?'('+smsCodeTime+'秒)':''}}</el-button>
        </template>
      </el-input>
    </el-form-item> 
    <el-form-item>
      <XButton :title="t('common.save')" type="primary" @click="submit(formRef)" />
      <XButton :title="t('common.reset')" type="danger" @click="reset(formRef)" />
    </el-form-item>
  </el-form>
</template>
<script lang="ts" setup>
import type { FormInstance, FormRules } from 'element-plus' 
import { sendSmsCode } from '@/api/sms/sms'; 
import { updatePhoneno } from '@/api/login';  
 

defineOptions({ name: 'ChangePhoneno' })

let smsCodeTime=ref(0)
let timeWrap=ref(0)

const { t } = useI18n()
const message = useMessage()
const formRef = ref<FormInstance>()
const phonenoForm = reactive({
  phoneno: '',
  smsCode: '', 
})

// 表单校验 

const rules = reactive<FormRules>({
  phoneno: [
    { required: true, message: '此项必填', trigger: 'blur' },
  ],
  smsCode: [
    { required: true, message:'此项必填', trigger: 'blur' },
    { min: 6, max: 6, message: '请输入长度为6位的短信验证码', trigger: 'blur' }
  ], 
})


const sendPhonenoSmsCode = (scene)=>{ 
  var params={
    phoneno:phonenoForm.phoneno,
    scene:scene
  }
  sendSmsCode(params).then(res=>{
    if(res.tips.isOk){
      message.success("发送成功");
      smsCodeTime.value=60;
      if (smsCodeTime.value > 0) { 
        timeWrap.value = setInterval(() => {
          smsCodeTime.value -= 1
        }, 1000)
      }
    }else{
      message.error(res.tips.msg);
    }
  })
}

const submit = (formEl: FormInstance | undefined) => {
  if (!formEl) return
  formEl.validate(async (valid) => {
    if (valid) {
      let {tips} = await updatePhoneno({phoneno: phonenoForm.phoneno, smsCode:phonenoForm.smsCode})
      if(tips.isOk){
        message.success(tips.msg)
      }else{
        message.error(tips.msg)
      }
      message.success(t('common.updateSuccess'))
    }
  })
}

const reset = (formEl: FormInstance | undefined) => {
  if (!formEl) return
  formEl.resetFields()
}
</script>
