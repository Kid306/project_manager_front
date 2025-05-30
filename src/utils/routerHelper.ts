import type { RouteLocationNormalized, Router, RouteRecordNormalized } from 'vue-router'
import { createRouter, createWebHashHistory, RouteRecordRaw } from 'vue-router'
import { isUrl } from '@/utils/is'
import { cloneDeep, omit } from 'lodash-es'
import TreeTool from '@/components/mdp-ui/js/treeTool'
import { FuncMenu } from '@/types/funcMenu'
import { de } from 'element-plus/es/locale'
import { debug } from 'console'

const modules = import.meta.glob('../views/**/*.{vue,tsx}')
/**
 * 注册一个异步组件
 * @param componentPath 例:/bpm/oa/leave/detail
 */
export const registerComponent = (componentPath: string) => {
  for (const item in modules) {
    if (item.includes(componentPath)) {
      // 使用异步组件的方式来动态加载组件
      // @ts-ignore
      return defineAsyncComponent(modules[item])
    }
  }
}
/* Layout */
export const Layout = () => import('@/layout/Layout.vue')

export const getParentLayout = () => {
  return () =>
    new Promise((resolve) => {
      resolve({
        name: 'ParentLayout'
      })
    })
}

// 按照路由中meta下的rank等级升序来排序路由
export const ascending = (arr: any[]) => {
  arr.forEach((v) => {
    if (v?.meta?.rank === null) v.meta.rank = undefined
    if (v?.meta?.rank === 0) {
      if (v.name !== 'home' && v.path !== '/') {
        console.warn('rank only the home page can be 0')
      }
    }
  })
  return arr.sort((a: { meta: { rank: number } }, b: { meta: { rank: number } }) => {
    return a?.meta?.rank - b?.meta?.rank
  })
}

 /**
  * 后端授权 meta.menu=true机制
    1. 前端带有meta.menu=true的路由，如果后端没有返回同名路由，说明该前端路由必须隐藏
    2. 前端带有meta.menu=true的路由，如后端返回有同名路由，保留前端，剔除后端
    3. 前端没有meta.menu的路由，默认不做处理，如果后端返回同名，则将后端剔除
    4. 如果后端返回一个前端没有配置的路由，则需要添加到前端路由中

    前端授权 meta.roles=[roleid1,roleid2,...]机制
    1. 如果前端路由配置有meta.roles,进入角色判断，如果未配有，不进行判断，如果同时配有meta.menu,以meta.menu为准
    2. 以meta.roles的角色编号与当前登录用户拥有的角色匹配，任意匹配一个则视为授权通过

    超级管理员的问题：
    1. 如果当前登录用户为超级管理员，无视上述两种机制，一律授权通过

    后端返回了其它子系统的菜单问题
    1. 在前端全局配置项VITE_MODULE_SCOPE=[模块编号1,模块编号2]。设定本应用的模块范围，在设定范围内的动态菜单debugger才允许放行，否则忽略
    2. 如果全局配置为空，则默认全部放行
    
    以上为前后端路由合并需要做的工作。
  */
export const mergeRoutes = ( baseRouter: AppRouteRecordRaw[],routerMap:AppRouteRecordRaw[],menus:FuncMenu[],roleSet?:Set<string>):AppRouteRecordRaw[] => {
  // debugger
  //隐藏路由
  const baseRouterList=cloneDeep(baseRouter)
  const isSuperAdmin=roleSet?roleSet.has('superAdmin'):false 
  const msets=new Set()
  const bsets=new Set()
  let menuss=menus
  if(!menus){
    menuss=[]
  }
  menuss.forEach(m=>msets.add(m.accUrl))
  const travelFunc = (curr:AppRouteRecordRaw,parent:AppRouteRecordRaw) => {
    if(roleSet){ 
      if(!curr.meta?.hidden){
        if(curr.meta?.roles && !curr.meta?.menu){
          if(curr.meta.roles.findIndex(roleid=>roleSet.has(roleid))>=0){
            curr.meta.hidden=false
          }else{
            if(curr.meta.hidden!=true){
              curr.meta.hidden=!isSuperAdmin
            }
          
          }
        } 
      }
    } 
    let fullPath=curr.path
    if(parent){
      fullPath=parent.fullPath+"/"+curr.path
    }else{
      fullPath="/"+curr.path
    }
    fullPath=fullPath.replace("//","/")
    curr.fullPath=fullPath

    if(curr.meta?.menu){
      if(curr.meta.hidden!=true && msets.has(curr.fullPath)){
        curr.meta.hidden=false
      }else{ 
        if(curr.meta.hidden!=true){
          curr.meta.hidden=!isSuperAdmin
        }
      }
    } 
    if(parent && !parent.children?.some(k=> !k.meta?.hidden)){
      if(parent.meta){ 
        parent.meta.hidden=true
      }else{
        parent.meta={hidden:true}
      }
    }

    bsets.add(fullPath)
  }
  // 遍历整棵树
  // travel之后 /xm/product hidden 变为true
  TreeTool.treeCfg(baseRouterList, travelFunc) 

  const cb = (r:AppRouteRecordRaw,p:AppRouteRecordRaw) => {
 
    if(bsets.has(r.path)){
      r.meta.hidden=true
    }
    if(p && !p.children?.some(k=> !k.meta?.hidden)){
      if(p.meta){ 
        p.meta.hidden=true
      }
    }
  }
  
  TreeTool.treeCfg(routerMap, cb)
  
  const allRouters = baseRouterList.concat(routerMap).filter(k=>!!k.component) 
  return allRouters;
}

export const menu2route = (menu:FuncMenu): AppCustomRouteRecordRaw => { 
   const route = {
    icon: menu.icon,
    name:menu.id,
    id: menu.id,
    parentId: menu.pid,
    path: menu.accUrl, 
    component:'',
    meta:{
      icon:menu.icon,
      title:menu.mname,
      moduleId:menu.moduleId
    },
    redirect:'noredirect',
    visible:menu.isShow=='1'
  }
  return route
}

 

export const buildCustomRawRouterTree = (menus:FuncMenu[]):AppCustomRouteRecordRaw[] => {
  if(!menus||menus.length==0){
    return []
  } 
  const menusRoters=menus.map(m=>menu2route(m))
  const routes= TreeTool.translateDataToTree(menusRoters,"parentId","id",undefined) as AppCustomRouteRecordRaw[];
  return routes;
}

export const getRawRoute = (route: RouteLocationNormalized): RouteLocationNormalized => {
  if (!route) return route
  const { matched, ...opt } = route
  return {
    ...opt,
    matched: (matched
      ? matched.map((item) => ({
          meta: item.meta,
          name: item.name,
          path: item.path
        }))
      : undefined) as RouteRecordNormalized[]
  }
}

// 后端控制路由生成
export const generateRoute = (routes: AppCustomRouteRecordRaw[]): AppRouteRecordRaw[] => {
  
  const res: AppRouteRecordRaw[] = []
  const modulesRoutesKeys = Object.keys(modules)
  for (const route of routes) {
    const meta = {
      title: route.meta?.title||route.name,
      icon: route.icon,
      hidden: !route.visible,
      noCache: !route.keepAlive,
      alwaysShow:
        route.children &&
        route.children.length === 1 &&
        (route.alwaysShow !== undefined ? route.alwaysShow : true)
    }
    // 路由地址转首字母大写驼峰，作为路由名称，适配keepAlive
    let data: AppRouteRecordRaw = {
      path: route.path,
      name:
        route.componentName && route.componentName.length > 0
          ? route.componentName
          : toCamelCase(route.path, true),
      redirect: route.redirect,
      meta: meta
    }
    //处理顶级非目录路由
    if (!route.children && route.parentId == 0 && route.component) {
      data.component = Layout
      data.meta = {}
      data.name = toCamelCase(route.path, true) + 'Parent'
      data.redirect = ''
      meta.alwaysShow = true
      const childrenData: AppRouteRecordRaw = {
        path: '',
        name:
          route.componentName && route.componentName.length > 0
            ? route.componentName
            : toCamelCase(route.path, true),
        redirect: route.redirect,
        meta: meta,
      }
      const index = route?.component
        ? modulesRoutesKeys.findIndex((ev) => ev.includes(route.component))
        : modulesRoutesKeys.findIndex((ev) => ev.includes(route.path))
      childrenData.component = modules[modulesRoutesKeys[index]]
      data.children = [childrenData]
    } else {
      // 目录
      if (route.children) {
        data.component = Layout
        data.redirect = getRedirect(route.path, route.children)
        // 外链
      } else if (isUrl(route.path)) {
        data = {
          path: '/external-link',
          component: Layout,
          meta: {
            name: route.name
          },
          children: [data]
        } as AppRouteRecordRaw
        // 菜单
      } else {
        // 对后端传component组件路径和不传做兼容（如果后端传component组件路径，那么path可以随便写，如果不传，component组件路径会根path保持一致）
        const index = route?.component
          ? modulesRoutesKeys.findIndex((ev) => ev.includes(route.component))
          : modulesRoutesKeys.findIndex((ev) => ev.includes(route.path))
        data.component = modules[modulesRoutesKeys[index]]
      }
      if (route.children) {
        data.children = generateRoute(route.children)
      }
    }
    res.push(data as AppRouteRecordRaw)
  }
  return res
}
export const getRedirect = (parentPath: string, children: AppCustomRouteRecordRaw[]) => {
  if (!children || children.length == 0) {
    return parentPath
  }
  const path = generateRoutePath(parentPath, children[0].path)
  // 递归子节点
  if (children[0].children) return getRedirect(path, children[0].children)
}
const generateRoutePath = (parentPath: string, path: string) => {
  if (parentPath.endsWith('/')) {
    parentPath = parentPath.slice(0, -1) // 移除默认的 /
  }
  if (!path.startsWith('/')) {
    path = '/' + path
  }
  return parentPath + path
}
export const pathResolve = (parentPath: string, path: string) => {
  if (isUrl(path)) return path
  const childPath = !path || path.startsWith('/')  ? path : `/${path}`
  return `${parentPath}${childPath}`.replace(/\/\//g, '/')
}

// 路由降级
export const flatMultiLevelRoutes = (routes: AppRouteRecordRaw[]) => {
  const modules: AppRouteRecordRaw[] = cloneDeep(routes)
  for (let index = 0; index < modules.length; index++) {
    const route = modules[index]
    if (!isMultipleRoute(route)) {
      continue
    }
    promoteRouteLevel(route)
  }
  return modules
}

// 层级是否大于2
const isMultipleRoute = (route: AppRouteRecordRaw) => {
  if (!route || !Reflect.has(route, 'children') || !route.children?.length) {
    return false
  }

  const children = route.children

  let flag = false
  for (let index = 0; index < children.length; index++) {
    const child = children[index]
    if (child.children?.length) {
      flag = true
      break
    }
  }
  return flag
}

// 生成二级路由
const promoteRouteLevel = (route: AppRouteRecordRaw) => {
  let router: Router | null = createRouter({
    routes: [route as RouteRecordRaw],
    history: createWebHashHistory()
  })

  const routes = router.getRoutes()
  addToChildren(routes, route.children || [], route)
  router = null

  route.children = route.children?.map((item) => omit(item, 'children'))
}

// 添加所有子菜单
const addToChildren = (
  routes: RouteRecordNormalized[],
  children: AppRouteRecordRaw[],
  routeModule: AppRouteRecordRaw
) => {
  for (let index = 0; index < children.length; index++) {
    const child = children[index]
    const route = routes.find((item) => item.name === child.name)
    if (!route) {
      continue
    }
    routeModule.children = routeModule.children || []
    if (!routeModule.children.find((item) => item.name === route.name)) {
      routeModule.children?.push(route as unknown as AppRouteRecordRaw)
    }
    if (child.children?.length) {
      addToChildren(routes, child.children, routeModule)
    }
  }
}
const toCamelCase = (str: string, upperCaseFirst: boolean) => {
  str = (str || '')
    .replace(/-(.)/g, function (group1: string) {
      return group1.toUpperCase()
    })
    .replaceAll('-', '')

  if (upperCaseFirst && str) {
    str = str.charAt(0).toUpperCase() + str.slice(1)
  }

  return str
}
