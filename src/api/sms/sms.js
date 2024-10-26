import axios from '@/config/maxios'
 

import config from '@/api/mdp_pub/mdp_config'

let base=config.getSmsCtx();

/**
 * 发送短信验证码、验证短信验证码接口
 **/
 
// 简单sms测试验证码
export const sendNoAuthTestSmsCode = params => {
  
}

//发送短信验证码
export const sendNoAuthSmsCode = params => { return axios.post(`${base}/sms/sendSmsCode`, params); };

//发送短信验证码
export const sendSmsCode = params => { return axios.post(`${base}/sms/sendSmsCode`, params); };

//验证短信验证码 
export const validateSmsCode = params => { return axios.post(`${base}/sms/validateSmsCode`, params); };