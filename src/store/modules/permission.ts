import { defineStore } from 'pinia'
import { store } from '@/store'
import { cloneDeep } from 'lodash-es'
import baseRouter from '@/router/modules/base'
import { flatMultiLevelRoutes, generateRoute,mergeRoutes } from '@/utils/routerHelper'
import { CACHE_KEY, useCache } from '@/hooks/web/useCache'

import { useUserStoreWithOut } from '@/store/modules/user'

const { wsCache } = useCache()

export interface PermissionState {
  routers: AppRouteRecordRaw[]
  addRouters: AppRouteRecordRaw[]
  menuTabRouters: AppRouteRecordRaw[]
}

export const usePermissionStore = defineStore('permission', {
  state: (): PermissionState => ({
    routers: [],
    addRouters: [],
    menuTabRouters: []
  }),
  getters: {
    getRouters(): AppRouteRecordRaw[] {
      return this.routers
    },
    getAddRouters(): AppRouteRecordRaw[] {
      return flatMultiLevelRoutes(cloneDeep(this.addRouters))
    },
    getMenuTabRouters(): AppRouteRecordRaw[] {
      return this.menuTabRouters
    }
  },
  actions: {
    async generateRoutes(): Promise<unknown> {
      return new Promise<void>(async (resolve) => {
        
        // 获得菜单列表，它在登录的时候，setUserInfoAction 方法中已经进行获取
        let res: AppCustomRouteRecordRaw[] = []
        if (wsCache.get(CACHE_KEY.ROLE_ROUTERS)) {
          res = wsCache.get(CACHE_KEY.ROLE_ROUTERS) as AppCustomRouteRecordRaw[]
        }

        const routerMap: AppRouteRecordRaw[] = generateRoute(res)
        // 动态路由，404一定要放到最后面
        
        this.addRouters = routerMap

        //获取用户角色
        const userStore = useUserStoreWithOut()
        const roles = userStore.getRoles
        const roleSet=new Set<string>()
        roles.forEach(r=>roleSet.add(r.roleid))
        
         //合并路由
        const allRouters=mergeRoutes(baseRouter,routerMap,userStore.getMenus,roleSet) 
        allRouters.forEach(k=>{
          if(!k.path.startsWith("/")){
            k.path="/"+k.path
          }
        })
        // 渲染菜单的所有路由
        // 这里hidden就变成了true
        // debugger
        this.routers = allRouters
        resolve()
      })
    },
    setMenuTabRouters(routers: AppRouteRecordRaw[]): void {
      this.menuTabRouters = routers
    }
  },
  persist: false
})

export const usePermissionStoreWithOut = () => {
  return usePermissionStore(store)
}
