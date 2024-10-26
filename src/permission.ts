import router from './router'
import type { RouteRecordRaw } from 'vue-router'
import { isRelogin } from '@/config/axios/service'
import { getAccessToken, removeToken,setToken } from '@/utils/auth'
import { useTitle } from '@/hooks/web/useTitle'
import { useNProgress } from '@/hooks/web/useNProgress'
import { usePageLoading } from '@/hooks/web/usePageLoading' 
import { useUserStoreWithOut } from '@/store/modules/user'
import { usePermissionStoreWithOut } from '@/store/modules/permission'

import {  ElMessageBox } from 'element-plus' 

const { start, done } = useNProgress()

const { loadStart, loadDone } = usePageLoading()

const parseURL = (
  url: string | null | undefined
): { basePath: string; paramsObject: { [key: string]: string } } => {
  // 如果输入为 null 或 undefined，返回空字符串和空对象
  if (url == null) {
    return { basePath: '', paramsObject: {} }
  }

  // 找到问号 (?) 的位置，它之前是基础路径，之后是查询参数
  const questionMarkIndex = url.indexOf('?')
  let basePath = url
  const paramsObject: { [key: string]: string } = {}

  // 如果找到了问号，说明有查询参数
  if (questionMarkIndex !== -1) {
    // 获取 basePath
    basePath = url.substring(0, questionMarkIndex)

    // 从 URL 中获取查询字符串部分
    const queryString = url.substring(questionMarkIndex + 1)

    // 使用 URLSearchParams 遍历参数
    const searchParams = new URLSearchParams(queryString)
    searchParams.forEach((value, key) => {
      // 封装进 paramsObject 对象
      paramsObject[key] = value
    })
  }

  // 返回 basePath 和 paramsObject
  return { basePath, paramsObject }
}

// 路由不重定向白名单
const whiteList = [
  '/login',
  '/auth-redirect',
  '/bind',
  '/register',
  '/changeEmailStepTwo',
  '/invite/code',
]

const  getIndexPathUrl = (indexPath:string,queryParams2:any) =>{
	if(indexPath==null){
		indexPath=""
	}
	const queryParams=queryParams2?{...queryParams2}:{}
	delete queryParams.accessToken
  delete queryParams.toPath
	//router.push({path:'/invite/success',query:queryParams}) 
	const indexQua=indexPath.indexOf("?")
	let indexUri="";
	if(indexQua<0){
		indexUri=indexPath
	}else{
		indexUri=indexPath.substr(0,indexQua)
	}
	let indexPathUrl="";
	if(Object.keys(queryParams).length>0){
		indexPathUrl=indexUri+"?"+Object.keys(queryParams).map(k=>k+'='+queryParams[k]).join('&')
	}else{
		indexPathUrl=indexUri;
	} 
	return indexPathUrl
}
 

const curlDomain=window.location.protocol+"//"+window.location.host; //  

const uris=[curlDomain,import.meta.env.VITE_CONTEXT]
if(import.meta.env.VITE_VITE_UI_VERSION){
  uris.push(import.meta.env.VITE_VITE_UI_VERSION)
}
const baseUrl=uris.join("/")
const url=window.location.href;
const {paramsObject:query} = parseURL(url)
const accessToken=query.accessToken
if(accessToken){
  setToken({accessToken:{tokenValue:accessToken,issuedAt:new Date(),expiresAt:new Date()},refreshToken:""}) 
  location.replace(getIndexPathUrl(baseUrl+"/#/"+query.toPath,query))
}else if(query.isOk==='false'){ 
     
    const msg=query.msg||"登录出错，请重新登录"
    ElMessageBox.confirm(msg, '登录出错', {
      showCancelButton: false,
      closeOnClickModal: false,
      showClose: false,
      confirmButtonText: '重新登录',
      type: 'warning'
    }).then(() => {
      window.location.href = baseUrl+'/#/login'
    })  
  
}

// 路由加载前
router.beforeEach(async (to, from, next) => {
  
  start()
  loadStart()  
  if (getAccessToken()) {
    if (to.path === '/login') {
      next({ path: '/' })
    } else { 
      const userStore = useUserStoreWithOut()
      const permissionStore = usePermissionStoreWithOut()
      if (!userStore.getIsSetUser) {
        isRelogin.show = true
        await userStore.setUserInfoAction()
        isRelogin.show = false
        // 后端过滤菜单
        await permissionStore.generateRoutes()
        permissionStore.getAddRouters.forEach((route) => {
          router.addRoute(route as unknown as RouteRecordRaw) // 动态添加可访问路由表
        })
        const redirectPath = from.query.redirect || to.path
        // 修复跳转时不带参数的问题
        const redirect = decodeURIComponent(redirectPath as string)
        const { basePath, paramsObject: query } = parseURL(redirect)
        const nextData = to.path === redirect ? { ...to, replace: true } : { path: redirect, query }
        next(nextData)
      } else { 
        let checkOk=true;
        const isSuperAdmin=userStore.getUserInfo?.isSuperAdmin||userStore.getUserInfo?.isPlatformAdmin
        if(isSuperAdmin){
          next()
        }else if(to.meta?.menu){//如果是后端授权，检查是否有权限访问 
          if(userStore.getMenus?.some(m=>m.accUrl==to.path)){
            next()
          }else{
            checkOk=false
          }
        }else if(to.meta?.roles && to.meta.roles.length>0){
          if(userStore.getRoles?.some(r=>to.meta.roles?.some(rid=>rid==r.roleid))){
            next()
          }else{
            checkOk=false
          }
        }
        else{
          next()
        }  
        if(checkOk==false){
          ElMessageBox.confirm('无权限访问', '权限检查', {
            showCancelButton: false,
            closeOnClickModal: false,
            showClose: false,
            confirmButtonText: '取消访问',
            type: 'warning'
          }).then(() => {  
            done() // 结束Progress
            loadDone()
          })  
        }
      }
    }
  } else {
    if (whiteList.find(k=>to.path.indexOf(k)==0)) {
      next()
    } else {
      next(`/login?redirect=${to.fullPath}`) // 否则全部重定向到登录页
    }
  }
})

router.afterEach((to) => {
  useTitle(to?.meta?.title as string)
  done() // 结束Progress
  loadDone()
})
