<template>
  <div class="flex">
    <el-card class="user w-1/3" shadow="hover">
      <template #header>
        <div class="card-header">
          <span>{{ t('profile.user.title') }}</span>
        </div>
      </template>
      <ProfileUser />
    </el-card>
    <el-card class="user ml-3 w-2/3" shadow="hover">
      <template #header>
        <div class="card-header">
          <span>{{ t('profile.info.title') }}</span>
        </div>
      </template>
      <div>
        <el-tabs v-model="activeName" class="profile-tabs" style="height: 400px" tab-position="top">
          <el-tab-pane label="基本信息" name="ChangeBaseInfo">
            <ChangeBaseInfo />
          </el-tab-pane> 
          <el-tab-pane :label="t('profile.info.resetPwd')" name="resetPwd">
            <ResetPwd />
          </el-tab-pane> 
 
          <el-tab-pane label="修改手机号码" name="changePhoneno">
            <ChangePhoneno />
          </el-tab-pane> 
 
          <el-tab-pane label="绑定邮箱" name="ChangeEmail">
            <ChangeEmail />
          </el-tab-pane> 
 
          <el-tab-pane label="绑定微信" name="BindWechat">
            <BindWechat />
          </el-tab-pane> 
 
          <el-tab-pane label="修改归属企业" name="ChangeBranch">
            <ChangeBranch />
          </el-tab-pane> 
        </el-tabs>
      </div>
    </el-card>
  </div>
</template>
<script lang="ts" setup> 
import ProfileUser from './components/ProfileUser.vue'
import ResetPwd from './components/ResetPwd.vue'
import ChangePhoneno from './components/ChangePhoneno.vue'  
import ChangeEmail from './components/ChangeEmail.vue'  
import BindWechat from './components/BindWechat.vue'   
import ChangeBaseInfo from './components/ChangeBaseInfo.vue'  
import ChangeBranch from './components/ChangeBranch.vue'  
const { t } = useI18n()
defineOptions({ name: 'Profile' })
const activeName = ref('ChangeBaseInfo')
</script>
<style scoped>
.user {
  max-height: 960px;
  padding: 15px 20px 20px;
}

.card-header {
  display: flex;
  justify-content: center;
  align-items: center;
}

:deep(.el-card .el-card__header, .el-card .el-card__body) {
  padding: 15px !important;
}

.profile-tabs > .el-tabs__content {
  padding: 32px;
  font-weight: 600;
  color: #6b778c;
}

.el-tabs--left .el-tabs__content {
  height: 100%;
}
</style>
