import MdpSelectUser from './mdp-select-user/Index.vue' 
import MdpSelectDept from './mdp-select-dept/Index.vue'  
import MdpDeptTree from './mdp-select-dept/DeptTree.vue'  
import MdpSelectTag from './mdp-select-tag/Index.vue' 
import MdpSelectImage from './mdp-select-image/Index.vue' 
import MdpImage from './mdp-image/Index.vue' 
import MdpSelectAtt from './mdp-select-att/Index.vue' 
import MdpMetaItem from './mdp-meta-item/Index.vue' 
import MdpMetaOption from './mdp-meta-option/Index.vue' 
import MdpExtInfos from './mdp-ext-infos/Index.vue' 
import MdpSelectCate from './mdp-select-cate/Index.vue' 
import MdpSelectMeta from './mdp-select-meta/Index.vue'  
import MdpCateTree from './mdp-cate-tree/Index.vue' 
import MdpFormData from './mdp-expand/FormData.vue' 
import MdpFormExpand from './mdp-expand/FormExpand.vue' 
import MdpColumnExpand from './mdp-expand/ColumnExpand.vue'  
import MdpFuncMenu from './mdp-func-menu/Index.vue'  
import MdpFocus from './mdp-focus/Index.vue'    
import MdpSelectBranch from './mdp-select-branch/Index.vue'   
import MdpDeptUser from './mdp-select-user/UserSelect.vue'   

const compLists = {
    install: function(Vue) {
        // 注册并获取组件，然后在main.js中引用，在Vue.use()就可以了
        Vue.component('MdpSelectUser', MdpSelectUser) 
        Vue.component('MdpSelectDept', MdpSelectDept) 
        Vue.component('MdpDeptTree', MdpDeptTree) 
        Vue.component('MdpSelectTag', MdpSelectTag) 
        Vue.component('MdpSelectImage', MdpSelectImage) 
        Vue.component('MdpImage', MdpImage) 
        Vue.component('MdpSelectAtt', MdpSelectAtt) 
        Vue.component('MdpMetaItem', MdpMetaItem) 
        Vue.component('MdpSelectMeta', MdpSelectMeta) 
        Vue.component('MdpMetaOption', MdpMetaOption) 
        Vue.component('MdpExtInfos', MdpExtInfos) 
        Vue.component('MdpCateTree', MdpCateTree) 
        Vue.component('MdpSelectCate', MdpSelectCate) 
        Vue.component('MdpFormData', MdpFormData) 
        Vue.component('MdpFormExpand', MdpFormExpand) 
        Vue.component('MdpColumnExpand', MdpColumnExpand) 
        Vue.component('MdpFuncMenu',MdpFuncMenu)
        Vue.component('MdpFocus',MdpFocus)
        Vue.component('MdpSelectBranch',MdpSelectBranch)
        Vue.component('MdpDeptUser',MdpDeptUser)
    }
}
export default compLists