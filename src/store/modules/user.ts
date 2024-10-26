import { store } from '@/store'
import { defineStore } from 'pinia'
import { getAccessToken, removeToken } from '@/utils/auth'
import { CACHE_KEY, useCache, deleteUserCache } from '@/hooks/web/useCache'
import { getUserInfo as getUserDetail, loginOut } from '@/api/login'   
import { buildCustomRawRouterTree } from '@/utils/routerHelper'
import { FuncMenu } from '@/types/funcMenu'

const { wsCache } = useCache()
interface Role {
  roleid: string
  rolename: string
  dataLvl: string
}
 
interface Post {
  id: string
  postName: string
}
interface UserInfo {
  userid: string // 用户编码
  headimgurl: string //头像
  nickname: string //昵称
  branchId: string //机构号
  branchName: string //机构名称
  deptid: string //归属部门编号
  deptName: string //归属部门名称
  username: string //用户姓名
  displayUserid: string //用户登录编号
  userType: string // staff 员工 / cust 客户
  startdate: string //创建日期
  email: string //邮箱
  phoneno: string //电话
  isSuperAdmin: Boolean, //超级管理员
  isPlatformAdmin: Boolean,//平台管理员
  isMainBranchAdmin: Boolean,//主机构管理员
  isBranchAdmin: Boolean //机构管理员 子账号

}

interface UserVO {
  // USER 缓存
  permissions: string[]
  roles: Role[],
  menus: FuncMenu[],
  posts: Post[],
  isSetUser: boolean
  userInfo: UserInfo
}

export const useUserStore = defineStore('admin-user', {
  state: (): UserVO => ({
    permissions: [],
    roles: [],
    menus: [],
    posts: [],
    isSetUser: false,
    userInfo: {
      userid: '',
      username:'',
      displayUserid:'',
      headimgurl: '',
      nickname: '',
      branchId:'',
      branchName:'',
      deptid: '',
      deptName: '',
      userType:'',
      isSuperAdmin: false,
      isPlatformAdmin: false,
      isMainBranchAdmin: false,
      isBranchAdmin: false,
      email:'',
      phoneno:'',
      startdate:''
    }
  }),
  getters: {
    getPermissions(): string[] {
      return this.permissions
    },
    getRoles(): Role[] {
      return this.roles
    },
    getMenus(): FuncMenu[] {
      return this.menus
    },
    getPosts(): Post[]{
      return this.posts
    },
    getIsSetUser(): boolean {
      return this.isSetUser
    },
    getUserInfo(): UserInfo {
      return this.userInfo
    }
  },
  actions: { 
    async setUserInfoAction() {
      if (!getAccessToken()) {
        this.resetState()
        return null
      } 
      let user = wsCache.get(CACHE_KEY.USER)
      if (!user) {
        user = await getUserDetail({})
      }
      this.permissions = user.permissions
      // 测试账号这里的roles一般是 [user | branchAdmin]
      this.roles = user.roles
      
      //过滤掉不在模块范围内的菜单
      const moduleScope=import.meta.env.VITE_MODULE_SCOPE
      if(moduleScope && moduleScope.length>0){
        const ms=user.menus
        if(ms && ms.length>0){
          this.menus=ms.filter(k=>k.moduleId?moduleScope.findIndex(m=>m==k.moduleId)>=0:true)
        }else{
          this.menus=ms
        }
      }else{
        this.menus=user.menus
      }
      this.posts=user.posts
      this.userInfo = user.userInfo
      this.roles.forEach(role=>{
        if(role.roleid=='superAdmin'){
          this.userInfo.isSuperAdmin=true
        }
        if(role.roleid=='platformAdmin'){
          this.userInfo.isPlatformAdmin=true
        }
        if(role.roleid=='branchAdmin'){
          this.userInfo.isBranchAdmin=true
        }
      })
      if(this.userInfo.userid==this.userInfo.branchId){
        this.userInfo.isMainBranchAdmin=true
      }
      this.isSetUser = true
      const rawRoutes=buildCustomRawRouterTree(this.menus);
      
      wsCache.set(CACHE_KEY.USER, user)
      wsCache.set(CACHE_KEY.ROLE_ROUTERS, rawRoutes)
    },
    async setUserHeadimgurlAction(headimgurl: string) {
      
      const user = wsCache.get(CACHE_KEY.USER)
      // NOTE: 是否需要像`setUserInfoAction`一样判断`userInfo != null`
      this.userInfo.headimgurl = headimgurl
      user.userInfo.headimgurl = headimgurl
      
      wsCache.set(CACHE_KEY.USER, user)
    },
    async setUserNicknameAction(nickname: string) {
      const user = wsCache.get(CACHE_KEY.USER)
      // NOTE: 是否需要像`setUserInfoAction`一样判断`userInfo != null`
      this.userInfo.nickname = nickname
      user.userInfo.nickname = nickname
      wsCache.set(CACHE_KEY.USER, user)
    },
    async loginOut() {
      //await loginOut()
      removeToken()
      deleteUserCache() // 删除用户缓存
      this.resetState()
    },
    resetState() {
      this.permissions = []
      this.roles = []
      this.menus = []
      this.posts = []
      this.isSetUser = false
      this.userInfo = {
        userid: '',
        displayUserid:'',
        headimgurl: '',
        nickname: '游客',
        branchId:'游客',
        branchName:'游客',
        deptid: '游客',
        deptName: '游客',
        username:'游客',
        userType:'staff',
        isSuperAdmin: false,
        isPlatformAdmin: false,
        isMainBranchAdmin: false,
        isBranchAdmin: false,
        startdate:'',
        email:'',
        phoneno:''
      }
    }
  }
})

export const useUserStoreWithOut = () => {
  return useUserStore(store)
}
