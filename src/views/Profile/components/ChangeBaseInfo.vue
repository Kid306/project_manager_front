<template>
  <el-form ref="formRef" :model="baseInfoForm" :rules="rules" :label-width="120">
    <el-form-item label="用户名称" prop="username">
      <el-input v-model="baseInfoForm.username"/>
    </el-form-item>
    <el-form-item label="用户昵称" prop="nickname">
      <el-input  v-model="baseInfoForm.nickname"/>  
    </el-form-item> 
    <el-form-item label="用户编号" prop="userid"  >
      <el-input  v-model="baseInfoForm.userid" :disabled="true"/>  
    </el-form-item> 
    <el-form-item label="登录编号" prop="displayUserid">
      <el-input  v-model="baseInfoForm.displayUserid">
        <template #append>
          <el-button @click="validDisplayUserid">同名检测</el-button>
        </template>
      </el-input>  
    </el-form-item> 
    <el-form-item label="性别" prop="sex">
      <el-radio-group v-model="baseInfoForm.sex" >
        <el-radio v-model="baseInfoForm.sex" label="0" border>男</el-radio>
        <el-radio v-model="baseInfoForm.sex" label="1" border>女</el-radio>
        <el-radio v-model="baseInfoForm.sex" label="2" border>其它</el-radio>
      </el-radio-group>
    </el-form-item> 
    <el-form-item>
      <XButton :title="t('common.save')" type="primary" @click="submit(formRef)" />
      <XButton :title="t('common.reset')" type="danger" @click="reset(formRef)" />
    </el-form-item>
  </el-form>
</template>
<script lang="ts" setup>
import type { FormInstance, FormRules } from 'element-plus'    
 
import { checkDisplayUserid } from '@/api/login';  
const {proxy}: any = getCurrentInstance()

import { useUserStore } from '@/store/modules/user'
const userInfoStore = useUserStore()
const userInfo = userInfoStore.getUserInfo

defineOptions({ name: 'ChangePhoneno' }) 

const { t } = useI18n()
const message = useMessage()
const formRef = ref<FormInstance>()
const baseInfoForm = reactive({ 
		 displayUserid:'',userid:'',nickname:'',username:''   ,sex:'' 
})
Object.assign(baseInfoForm,userInfo)
// 表单校验 

const rules = reactive<FormRules>({
  username: [
    { required: true, message: '此项必填', trigger: 'blur' },
    { min: 1, max: 30, message: '1-30位', trigger: 'blur' }
  ],
  userid: [
    { required: true, message:'此项必填', trigger: 'blur' },
    { min: 1, max: 20, message: '6-20位英文数字下横线组成', trigger: 'blur' }
  ],
  displayUserid: [
    { required: true, message:'此项必填', trigger: 'blur' },
    { min: 1, max: 30, message: '建议6-20位英文数字下横线组成，也可以为中文', trigger: 'blur' }
  ], 
  nickname: [
    { required: true, message:'此项必填', trigger: 'blur' }, 
    { min: 1, max: 30, message: '1-30位', trigger: 'blur' }
  ], 
})
 
const validDisplayUserid =async ()=>{
 let {tips} = await checkDisplayUserid(baseInfoForm.displayUserid);
 
 message.showTips(tips)
}
const submit = (formEl: FormInstance | undefined) => {
  if (!formEl) return
  formEl.validate(async (valid) => {
    if (valid) {
      let params = Object.assign({}, baseInfoForm); 
      let {tips} = await proxy.$mdp.editUser(params)
      message.showTips(tips)
    }
  })
}

const reset = (formEl: FormInstance | undefined) => {
  if (!formEl) return
  formEl.resetFields()
}
</script>
