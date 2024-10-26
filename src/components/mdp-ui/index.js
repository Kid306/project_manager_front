import MdpField from './mdp-field/Index.vue'
import MdpInput from './mdp-input/Index.vue' 
import MdpNumber from './mdp-number/Index.vue' 
import MdpDate from './mdp-date/Index.vue'
import MdpDateRange from './mdp-date-range/Index.vue' 
import MdpSelect from './mdp-select/Index.vue' 
import MdpSelectTable from './mdp-select-table/Index.vue'
import MdpDialog from './mdp-dialog/Index.vue'
import MdpTable from './mdp-table/Index.vue'
import MdpForm from './mdp-form/Index.vue'
import MdpTableConfigs from './mdp-table-configs/Index.vue'
import MdpHiQuery from './mdp-hi-query/Index.vue' 
import MdpGantt from './mdp-gantt/Index.vue' 
import MdpTree from './mdp-tree/Index.vue' 
import MdpKanban from './mdp-kanban/Index.vue' 
import MdpTableKanban from './mdp-table-kanban/Index.vue' 
import MdpRptHeader from './mdp-rpt/components/Header.vue' 
import MdpLrBox from './mdp-lr-box/Index.vue' 
import MdpExport from './mdp-export/Index.vue' 
// 表格高度设定指令
import {setupMdpDirective} from './directive'

import './mdp.scss' // global css


const compLists = {
    install: function(Vue) {
        //注册v-adaptive指令，控制表格离底部高度
        setupMdpDirective(Vue)

        // 注册并获取组件，然后在main.js中引用，在Vue.use()就可以了
        Vue.component('MdpField', MdpField)
        Vue.component('MdpInput', MdpInput)
        Vue.component('MdpNumber', MdpNumber)
        Vue.component('MdpDate', MdpDate)
        Vue.component('MdpDateRange', MdpDateRange)
        Vue.component('MdpSelect', MdpSelect)
        Vue.component('MdpSelectTable', MdpSelectTable)
        Vue.component('MdpDialog', MdpDialog)
        Vue.component('MdpTable', MdpTable)
        Vue.component('MdpForm', MdpForm)
        Vue.component('MdpTableConfigs', MdpTableConfigs)
        Vue.component('MdpHiQuery', MdpHiQuery)
        Vue.component('MdpGantt', MdpGantt)
        Vue.component('MdpTree', MdpTree)
        Vue.component('MdpKanban', MdpKanban)
        Vue.component('MdpTableKanban', MdpTableKanban)
        Vue.component('MdpRptHeader',MdpRptHeader)
        Vue.component('MdpLrBox',MdpLrBox)
        Vue.component('MdpExport',MdpExport)
        
    }
}
export default compLists