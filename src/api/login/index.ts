import axios from '@/config/maxios'
import { getRefreshToken,removeToken } from '@/utils/auth'
import type { UserLoginVO } from './types'


import config from '@/api/mdp_pub/mdp_config'
 

export interface SmsCodeVO {
  mobile: string
  scene: number
}

export interface SmsLoginVO {
  mobile: string
  code: string
}

// 登录
export const login = (data: UserLoginVO) => {
  return axios.post(config.getLoginCtx()+'/login/token?grantType='+data.grantType, data )
}

// 刷新访问令牌
export const refreshToken = () => {
  return axios.post('/system/auth/refresh-token?refreshToken=' + getRefreshToken() )
}

// 使用租户名，获得租户编号
export const getTenantIdByName = (name: string) => {
  return axios.get('/system/tenant/get-id-by-name?name=' + name )
}

// 使用租户域名，获得租户信息
export const getTenantByWebsite = (website: string) => {
  return axios.get('/system/tenant/get-by-website?website=' + website )
}

// 登出
export const loginOut = () => {
  return axios.post('/system/auth/logout' )
}

 //获取用户的信息
export function getUserInfo(params) {
  if( !params || !params.scopes ){
    params={
      scopes:['userInfo','roles','posts','menus','qxs','depts','branchs']
    }
  }
  const data=params;
  return axios.request({
    url: config.getLoginCtx()+'/user/info',
    method: 'post',
    data
  })
}

//获取登录验证码
export const sendSmsCode = (data: SmsCodeVO) => {
  return axios.post( '/system/auth/send-sms-code', data )
}

// 短信验证码登录
export const smsLogin = (data: SmsLoginVO) => {
  return axios.post('/system/auth/sms-login', data )
}

// 社交快捷登录，使用 code 授权码
export function socialLogin(type: string, code: string, state: string) {
  return axios.post( '/system/auth/social-login', {
      type,
      code,
      state
    } )
}

// 社交授权的跳转
export const socialAuthRedirect = (type: number, redirectUri: string) => {
  return axios.get( '/system/auth/social-auth-redirect?type=' + type + '&redirectUri=' + redirectUri,{})
}
// 获取验证图片以及 token
export const getCode = (data) => {
  return axios.postOriginal({ url: 'system/captcha/get', data })
}

// 滑动或者点选验证
export const reqCheck = (data) => {
  return axios.postOriginal({ url: 'system/captcha/check', data })
}
export function switchUser(userloginid, password,grantType,authType,deptid,userid) { 
  const data = {
    userloginid: userloginid,
    password: password, 
    authType:authType,
    deptid:deptid,
    userid:userid,
  }
  return axios.request({
    url: config.getLoginCtx()+'/login/token?grantType='+grantType,
    method: 'post',
    data
  })
}
export function setDefLogin(userid,defLogin) { 
  const data = {
    userid: userid,
    defLogin:defLogin
  }
  return axios.request({
    url: config.getLoginCtx()+'/user/setDefLogin',
    method: 'post',
    data
  })
}
export function checkUserid(userid ) { 
  const data = {
    userid: userid
  }
  return axios.request({
    url: config.getLoginCtx()+'/user/check/userid',
    method: 'post',
    data
  })
}
export function checkDisplayUserid(displayUserid ) { 
  const data = {
    displayUserid: displayUserid
  }
  return axios.request({
    url: config.getLoginCtx()+'/user/check/displayUserid',
    method: 'post',
    data
  })
}

export function updatePhoneno(params ) { 
  const data = params
  return axios.request({
    url: config.getLoginCtx()+'/user/update/phoneno',
    method: 'post',
    data
  })
}
export function checkPhoneno(phoneno ) { 
  const data = {
    phoneno: phoneno
  }
  return axios.request({
    url: config.getLoginCtx()+'/user/check/phoneno',
    method: 'post',
    data
  })
}
export function queryByUserloginid( params ) {  
  return axios.request({
    url: config.getLoginCtx()+'/user/queryByUserloginid',
    method: 'get',
    params:params
  })
}

export function doRegister( userInfo ) {
  removeToken();
  const data = {
    username:userInfo.username,
    userid:userInfo.displayUserid,
    displayUserid:userInfo.displayUserid,
    password:userInfo.password,
    phoneno:userInfo.phoneno,
    smsCode:userInfo.smsCode,
    deptid:userInfo.deptid,
    branchId:userInfo.branchId
  }
  return axios.request({
    url: config.getLoginCtx()+'/user/register',
    method: 'post',
    data
  })
}

export function resetPasswordByPhoneno( userInfo ) {
   const data = {  
    newPassword:userInfo.newPassword,
    phoneno:userInfo.phoneno,
    smsCode:userInfo.smsCode, 
    userid:userInfo.userid
  }
  return axios.request({
    url: config.getLoginCtx()+'/user/password/reset?type=sms',
    method: 'post',
    data
  })
}


/**
 * 发送邮件
 */

export function sendEmail(params) {  
  const data=params;
  return axios.request({
    url: config.getLoginCtx()+'/user/sendEmail',
    method: 'post',
    data
  })
}
/**
 * 验证邮箱
 */

export function validEmailCode(params) {   
  return axios.request({
    url: config.getLoginCtx()+'/user/validEmailCode',
    method: 'get',
    params:params
  })
}


/**
 * 获取第三方登录需要state参数，防止crfs攻击
 * @param 
 * @returns 
 */
export function getTpaState( ) {  
   return axios.request({
    url: '/tpa/login/wechat/wxpub/state',
    method: 'post', 
    data:{}
  })
}

/**
 * 获取查询当前登录账户的所有关联账户
  * @returns 
 */
 export function queryMyUsers( ) {  
  return axios.request({
    url: config.getLoginCtx()+'/user/queryMyUsers',
    method: 'get'
  })
}