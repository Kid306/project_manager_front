<template>
	
 			<xm-project-edit sub-op-type="edit" :sel-project="selProject" :visible="editFormVisible" @cancel="editFormVisible=false" @submit="afterEditSubmit" @edit-fields="onEditFields" ref="projectEdit" />
 	
</template>

<script>
	import util from '@/components/mdp-ui/js/util';//全局公共库
	//import Sticky from '@/components/Sticky' // 粘性header组件

	import { mapState } from 'pinia'
import { useUserStore } from '@/store/modules/user'
	import { listXmProject } from '@/api/xm/core/xmProject';
	import  XmProjectEdit from './XmProjectEdit.vue';//修改界面

	export default {
		props: ["selProject"],
		computed: {
		    ...mapState(useUserStore,[
		      'userInfo','roles'
				]),
		},
		data() {
			return {
				 load:{ list: false, edit: false, del: false, add: false },//查询中...
				/**end 自定义属性请在上面加 请加备注**/
				editFormVisible:true,
			}
		},//end data
		methods: {
			//显示新增界面 XmProject xm_project
			afterEditSubmit(params){
				this.editFormVisible=true;
				this.$emit("submit",params);
			},
			onEditFields(row){ 
				this.$emit("edit-fields",row);
			}
			/**end 自定义函数请在上面加**/
		},//end methods
		components: {
			//在下面添加其它组件
			XmProjectEdit,
		},
		mounted() {
		}
	}

</script> 
