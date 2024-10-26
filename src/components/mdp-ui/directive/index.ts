import type { App } from 'vue'
import adaptive from './adaptive'   
/**
 * 导出mdp平台自定义指令：v-xxx
 * @methods adaptive 元素固定高度: v-adaptive 
 */
 export const setupMdpDirective = (app: App<Element>) => {
  app.directive('adaptive',  adaptive)
}
