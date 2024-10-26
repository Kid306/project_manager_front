
  /**
   * 说明： VITE_CTX_*为定义唛盟各个子系统的context;
   * 1. 用于前端请求路径前缀映射，
   *    前端页面一般部署在 ./{VITE_CONTEXT}/
   * 
   * 2. api导航到对应子系统等
   *    api一般按以下格式规范组装 ./{VITE_API_BASE_PATH}/{VITE_API_VERSION}/{VITE_CONTEXT}
   */

import util from '@/components/mdp-ui/js/util';//全局公共库
export default {
  //登录相关，如果后端启用oauth2,则返回 oauth2client ，如果后端不启用oauth2,后端账户使用mdp-lcode服务，则返回 lcode ,如果使用mdp-sys提供服务，则返回sys
  getLoginCtx:function(){
    return import.meta.env.VITE_CTX_LOGIN||'lcode'
  },

  //模块订单 如果后端使用mdp-lcode提供订单服务，则返回lcode,如果使用mdp-sys服务，则返回sys
  getMoCtx(){
    return import.meta.env.VITE_CTX_MO||'lcode'
  },
  // 如果后端使用mdp-lcode提供账户管理服务，则返回lcode,如果使用mdp-sys提供服务，则返回sys
  getSysCtx: function() {
    return import.meta.env.VITE_CTX_SYS||'lcode'
  },

  // 图片内容服务api路径，如果后端使用mdp-lcode提供图片文件服务，则返回lcode,如果使用mdp-arc提供图片文件服务，则返回arc
  getArcCtx: function() {
    return import.meta.env.VITE_CTX_ARC||'arc'
  },

  // 数据模型服务api路径
  getDmCtx: function() {
    return import.meta.env.VITE_CTX_DM||'lcode'
  },
  // 表单服务api路径
  getFormCtx: function() {
    return import.meta.env.VITE_CTX_FORM||'lcode'
  },
  // 低代码平台
  getLcodeCtx: function() {
    return import.meta.env.VITE_CTX_LCODE||'lcode'
  },
  //短信相关
  getSmsCtx: function() {
    return import.meta.env.VITE_CTX_SMS||'sms'
  },
  // 工作流api路径
  getWfCtx: function() {
    return import.meta.env.VITE_CTX_WF||'workflow'
  },
  // 协同办公系统api路径
  getOaCtx: function() {
    return import.meta.env.VITE_CTX_OA||'oa'
  },
  //项目管理
  getXmCtx: function(){
    return import.meta.env.VITE_CTX_XM||'xm'
  },
  //即时通讯
  getImCtx:function(){
    return import.meta.env.VITE_CTX_IM||'im'
  },
  //付款
  getPayCtx:function() {
    return import.meta.env.VITE_CTX_TPA||'tpa'
  },
  getTpaCtx: function(){
    return import.meta.env.VITE_CTX_TPA||'tpa'
  },
  // 商城管理后台api路径
  getMallmCtx: function() {
    return import.meta.env.VITE_CTX_MALLM||'mallm'
  }, 
  // 图片展示或下载路径
  getArcFileUploadBasePath: function() { 
    return util.getUri(this.getBaseDomainUrl(),this.getApiBase(),this.getArcCtx());
  }, 
  // 图片展示或下载路径
  getArcImagePath: function() {  
    let url = util.getUri(this.getBaseDomainUrl(),this.getApiBase(),this.getArcCtx());
    return url;
  }, 

  getApiBase:function(){ 
    return util.getUri("/",import.meta.env.VITE_API_BASE_PATH,import.meta.env.VITE_API_VERSION,"/") 
  }, 
  //当前系统域名
  getBaseDomainUrl:function(){
    var curlDomain=window.location.protocol+"//"+window.location.host; //   返回https://mp.csdn.net
    return curlDomain
  },
  getFixedDomain:function(){
    return import.meta.env.VITE_FIXED_DOMAIN||"https://www.maimengcloud.com"
  },
  //系统名称
  getSysName: function() {
    return import.meta.env.VITE_APP_TITLE||'唛盟项目管理'
  },
  getWxpubConfig:function(){
    var config={
      appid: import.meta.env.VITE_WXOPEN_APPID||'wx2671d5db8346b6fc',
      appname:import.meta.env.VITE_APP_TITLE||'唛盟项目管理',
      appType:'wxopen',
      scope:'snsapi_login'
    }
    return config;
  },
  /**
   * 本系统支持的动态组件编号列表
   * @returns
   */
  getSupportComponents:function(){
    return ['myFocus']
  },
  getOpenSourceLink:function(){
    return import.meta.env.VITE_OPEN_SOURCE_LINK||"https://gitee.com/qingqinkj218/collections/375320"
  }

}
