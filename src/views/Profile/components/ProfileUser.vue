<template>
  <div>
    <div class="text-center">
      <UserAvatar :img="userInfo?.headimgurl" />
    </div>
    <ul class="list-group list-group-striped">
      <li class="list-group-item">
        <Icon class="mr-5px" icon="ep:user" />
        {{ t('profile.user.username') }}
        <div class="pull-right">{{ userInfo?.username }}</div>
      </li>
      <li class="list-group-item">
        <Icon class="mr-5px" icon="ep:phone" />
        {{ t('profile.user.mobile') }}
        <div class="pull-right">{{ userInfo?.phoneno }}</div>
      </li>
      <li class="list-group-item">
        <Icon class="mr-5px" icon="fontisto:email" />
        {{ t('profile.user.email') }}
        <div class="pull-right">{{ userInfo?.email }}</div>
      </li>
      <li class="list-group-item">
        <Icon class="mr-5px" icon="carbon:tree-view-alt" />
        {{ t('profile.user.branch') }}
        <div v-if="userInfo?.branchName" class="pull-right">{{ userInfo?.branchName }}</div>
      </li>
      <li class="list-group-item">
        <Icon class="mr-5px" icon="carbon:tree-view-alt" />
        {{ t('profile.user.dept') }}
        <div v-if="userInfo?.deptName" class="pull-right">{{ userInfo?.deptName }}</div>
      </li>
      <li class="list-group-item">
        <Icon class="mr-5px" icon="ep:suitcase" />
        {{ t('profile.user.posts') }}
        <div v-if="posts" class="pull-right">
          {{ posts.map((post) => post.postName).join(',') }}
        </div>
      </li>
      <li class="list-group-item">
        <Icon class="mr-5px" icon="icon-park-outline:peoples" />
        {{ t('profile.user.roles') }}
        <div v-if="roles" class="pull-right">
          {{ roles.map((role) => role.rolename).join(',') }}
        </div>
      </li>
      <li class="list-group-item">
        <Icon class="mr-5px" icon="ep:calendar" />
        {{ t('profile.user.createTime') }}
        <div class="pull-right">{{ formatDate(userInfo.startdate) }}</div>
      </li>
    </ul>
  </div>
</template>
<script lang="ts" setup>
import { formatDate } from '@/utils/formatTime' 
import UserAvatar from './UserAvatar.vue' 
import { useUserStore } from '@/store/modules/user'

//const {proxy}: any = getCurrentInstance() 
const userInfoStore = useUserStore()
const userInfo = computed(() => userInfoStore.userInfo)
const roles = computed(() => userInfoStore.roles)
const posts = computed(() => userInfoStore.posts)

defineOptions({ name: 'ProfileUser' })

const { t } = useI18n()   
</script>

<style scoped>
.text-center {
  position: relative;
  height: 120px;
  text-align: center;
}

.list-group-striped > .list-group-item {
  padding-right: 0;
  padding-left: 0;
  border-right: 0;
  border-left: 0;
  border-radius: 0;
}

.list-group {
  padding-left: 0;
  list-style: none;
}

.list-group-item {
  padding: 11px 0;
  margin-bottom: -1px;
  font-size: 13px;
  border-top: 1px solid #e7eaec;
  border-bottom: 1px solid #e7eaec;
}

.pull-right {
  float: right !important;
}
</style>
