<template>
	
		 <xm-test-plan-info v-if="xmTestPlan?.id"  :xm-test-casedb="testCasedb" :xm-test-plan="xmTestPlan" @refresh="onRefresh"/>
	
</template>

<script>  
	import { mapState } from 'pinia'
import { useUserStore } from '@/store/modules/user'; 
import { useXmStore } from '@/store/modules/xm'; 
	import XmTestPlanInfo from './XmTestPlanInfo.vue'
	import { listXmTestPlan } from '@/api/xm/core/xmTestPlan';

	export default {  
		computed: {
		    ...mapState(useUserStore,[
		      'userInfo','roles'
				]), 
		    ...mapState(useXmStore,[ 'testCasedb'
				]), 
		}, 
		watch:{
			 $route(){ 
				this.initData();
			 }
		},
		data() {
			return {  
				xmTestPlan:null,
			}
		},//end data
		methods: {  
			  initData(){
					
				var planId=this.$route.query.id
				if(planId){  
					var key="xm-test-plan-info-"+planId
					var str=sessionStorage.getItem(key)
					if(str && str!='null' && str!='undefined'){
						this.xmTestPlan=JSON.parse(str)
					}else{
						this.onRefresh()
					}
				} 
			  },
				onRefresh(){
					var planId=this.$route.query.id
					listXmTestPlan({id:planId}).then(res=>{
						var key="xm-test-plan-info-"+planId
						if(res.tips.isOk && res.data.length>0){
							sessionStorage.setItem(key,JSON.stringify(res.data[0])) 
								this.xmTestPlan=res.data[0]
						}
						
					})
				}
		},//end methods
		components: {  
			XmTestPlanInfo,
			//在下面添加其它组件
		},  
		mounted() {    
			this.initData();
		}
	}
</script>