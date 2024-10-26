/// <reference types="vite/client" />

declare module '*.vue' {
  import { DefineComponent } from 'vue'
  // eslint-disable-next-line @typescript-eslint/no-explicit-any, @typescript-eslint/ban-types
  const component: DefineComponent<{}, {}, any>
  export default component
}

interface ImportMetaEnv {
  readonly VITE_APP_TITLE: string
  readonly VITE_PORT: number
  readonly VITE_OPEN: string
  readonly VITE_DEV: string
  readonly VITE_APP_CAPTCHA_ENABLE: boolean
  readonly VITE_APP_TENANT_ENABLE: string
  readonly VITE_APP_DOCALERT_ENABLE: string
  //附件上传地址
  readonly VITE_UPLOAD_ATT_URL: string 
  //图片上传地址
  readonly VITE_UPLOAD_IMAGE_URL: string 
  readonly VITE_API_BASE_PATH: string 
  readonly VITE_BASE_PATH: string
  readonly VITE_DROP_DEBUGGER: string
  readonly VITE_DROP_CONSOLE: string
  readonly VITE_SOURCEMAP: string
  readonly VITE_OUT_DIR: string
  readonly VITE_CONTEXT: string
  readonly VITE_API_VERSION: string
  readonly VITE_UI_VERSION: string
  
  //固定网址
  readonly VITE_FIXED_DOMAIN: string

  //开源项目地址
  readonly VITE_OPEN_SOURCE_LINK: string

  //微信开放平台 appid
  readonly VITE_WXOPEN_APPID: string

  //是否开启工作流，如果开启，登录后自动查代办，如果不开启，不查代办
  readonly VITE_WF_OPEN: boolean

  //定义菜单涉及的模块范围，后台拉取的动态菜单，如果在此范围内，才会动态加载，如果未定义，则全部拉取
  readonly VITE_MODULE_SCOPE:string[]

  /**
   * 说明： VITE_CTX_*为定义唛盟各个子系统的context;
   * context指向子系统的微服务名称，spring.application.name
   * 
   * 1. 用于前端请求路径前缀映射，
   *    前端页面一般部署在 ./{VITE_CONTEXT}/{VITE_UI_VERSION?}
   * 
   * 2. api导航到对应子系统等
   *    api一般按以下格式规范组装 ./{VITE_API_BASE_PATH}/{VITE_API_VERSION}/{VITE_CONTEXT}
   */

  //登录相关，如果后端启用oauth2,则返回 oauth2client ，如果后端不启用oauth2,后端账户使用mdp-lcode服务，则返回 lcode
  readonly VITE_CTX_LOGIN: string

  //项目管理子系统
  readonly VITE_CTX_XM: string

  //低代码子系统
  readonly VITE_CTX_LCODE: string

  //内容管理子系统，开源版本由lcode接管
  readonly VITE_CTX_ARC: string

  //数据模型 目前由lcode接管
  readonly VITE_CTX_DM: string

  //协同办公
  readonly VITE_CTX_OA: string

  //系统管理,目前由lcode接管
  readonly VITE_CTX_SYS: string

  //智能表单，目前由lcode接管
  readonly VITE_CTX_FORM: string

  //商城-面向消费用户端
  readonly VITE_CTX_MALL: string

  //商城管理端
  readonly VITE_CTX_MALLM: string

  //即时通讯
  readonly VITE_CTX_IM: string

  //短信
  readonly VITE_CTX_SMS: string

  //唛盟内置的应用购买模块订单 目前由lcode接管
  readonly VITE_CTX_MO: string

  //众包，目前由xm接管
  readonly VITE_CTX_CROWD: string

  //第三方集成系统
  readonly VITE_CTX_TPA: string

  //工作流
  readonly VITE_CTX_WF: string
 

}

declare global {
  interface ImportMeta {
    readonly env: ImportMetaEnv
  }
}
