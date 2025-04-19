// 引入unocss css
import '@/plugins/unocss'

// 导入全局的svg图标
import '@/plugins/svgIcon'

// 初始化多语言
import { setupI18n } from '@/plugins/vueI18n'

// 引入状态管理
import { setupStore } from '@/store'

// 全局组件
import { setupGlobCom } from '@/components'

// 引入 element-plus
import { setupElementPlus } from '@/plugins/elementPlus'

import ElementPlus from 'element-plus'
import 'element-plus/dist/index.css'

// 引入 form-create
import { setupFormCreate } from '@/plugins/formCreate'

import FcDesigner from '@/plugins/form-create-designer/src/index.js';

// 引入全局样式
import '@/styles/index.scss'

// 引入动画
import '@/plugins/animate.css'

// 路由
import router, { setupRouter } from '@/router'

// 权限
import { setupAuth } from '@/directives'

import { createApp } from 'vue'

import App from './App.vue'

import './permission'

import '@/plugins/tongji' // 百度统计
import Logger from '@/utils/Logger'

import VueDOMPurifyHTML from 'vue-dompurify-html' // 解决v-html 的安全隐患

//基础组件
import MdpComponents from '@/components/mdp-ui/index.js' 

//拓展的组件
import MdpExtComponents from '@/components/mdp-ui-ext/index.js' 


//拓展的组件
import XmComponents from '@/views/xm/index.js' 

//拓展的组件
//import MdpDesigner from '@/views/mdp/form/formDef/components/index.js' 
 

//import DataV from '@/views/datav/datav.js';


//公共api
import MdpPubApi from "@/api/mdp_pub";  

// 如果您正在使用CDN引入，请删除下面一行。
import * as ElementPlusIconsVue from '@element-plus/icons-vue'
 


// 创建实例
const setupAll = async () => {
  const app = createApp(App)

  await setupI18n(app)

  setupStore(app)

  setupGlobCom(app)

  app.use(ElementPlus)

  setupElementPlus(app)

  setupFormCreate(app) 

  app.use(FcDesigner)

  setupRouter(app)

  setupAuth(app)

  //注册公共组件
  app.use(MdpComponents)
  //注册公共扩展组件
  app.use(MdpExtComponents)  
  //注册的全局公共函数$mdp
  app.config.globalProperties.$mdp=MdpPubApi 
  //注册表单设计器
  //app.use(MdpDesigner) 

    //注册xm公共组件
    app.use(XmComponents)

  // const module = Object.keys(DataV);
  // for (const m of module) {
  //   if (m === 'Loading') continue; // 因为项目饿了么注册过这个组件，就不用datav提供的，跳过本次循环
  //   
  //   app.component(DataV[m].name, DataV[m]);
  // } 

  //app.use(DataV)

  await router.isReady()

  app.use(VueDOMPurifyHTML)

  for (const [key, component] of Object.entries(ElementPlusIconsVue)) {
    app.component(key, component)
  }

  app.mount('#app')
}

setupAll()

Logger.prettyPrimary(`欢迎使用`, import.meta.env.VITE_APP_TITLE)
