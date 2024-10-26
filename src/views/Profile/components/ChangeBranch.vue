<template>
  <el-form ref="formRef" :model="baseInfoForm" :rules="rules" :label-width="120">
 
    <el-form-item label="当前归属企业">
        {{userInfo.branchId}}-{{ userInfo.branchName }}
        <el-alert type="warning">加入新的企业，你将失去原有企业的一切信息，请慎重操作</el-alert> 

    </el-form-item>  
    <el-form-item label="目标企业" prop="joinBranchId"> 
        <mdp-select-table :init-name="userInfo.branchName" show-style="origin" placeholder="企业" :props="{id:'id',name:'branchName'}" v-model="baseInfoForm.joinBranchId" :load-fun="$mdp.listBranch" />
     </el-form-item> 
    <el-form-item label="加入原因" prop="joinReason"> 
      
      <el-input type="textarea" v-model="baseInfoForm.joinReason" rows="4"/>
     </el-form-item> 
    <el-form-item>
      <XButton :title="t('common.save')" type="primary" @click="submit(formRef)" />
      <XButton :title="t('common.reset')" type="danger" @click="reset(formRef)" />
    </el-form-item>
  </el-form>
</template>
<script lang="ts" setup>
import type { FormInstance, FormRules } from 'element-plus'    
 
const {proxy}: any = getCurrentInstance()

import { useUserStore } from '@/store/modules/user'
const userInfoStore = useUserStore()
const userInfo = userInfoStore.getUserInfo

defineOptions({ name: 'ChangePhoneno' }) 

const { t } = useI18n()
const message = useMessage()
const formRef = ref<FormInstance>()
const baseInfoForm = reactive({ 
  joinUserid:'',joinBranchId:'',joinUsername:'',joinDeptid:'',joinReason:''
})
baseInfoForm.joinUserid=userInfo.userid
baseInfoForm.joinUsername=userInfo.username
baseInfoForm.joinReason=userInfo.username+"申请加入公司，请审核"
// 表单校验 

const rules = reactive<FormRules>({ 
  branchId: [
    { required: true, message:'此项必填', trigger: 'blur' },
   ],  
})
  
const submit = (formEl: FormInstance | undefined) => {
  if (!formEl) return
  formEl.validate(async (valid) => {
    if (valid) {
      let params = Object.assign({}, baseInfoForm); 
      let {tips} = await proxy.$mdp.addUserJoinRequire(params)
      message.showTips(tips)
    }
  })
}

const reset = (formEl: FormInstance | undefined) => {
  if (!formEl) return
  formEl.resetFields()
}
</script>
