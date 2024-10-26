<template>
	<el-collapse v-model="activeName">
		<el-collapse-item title="内容查看编辑权限" name="1">
			<template #title>
						<div>&nbsp;&nbsp;内容查看编辑权限</div>
					</template>
			<el-table :data="mainFields" border>
          <el-table-column type="index"/>
          <el-table-column label="属性名称" prop="title" width="150px"/>
          <el-table-column label="隐藏" prop="hidden">
            <template #header>
              <div class="titleCenter"><el-checkbox :true-label="false" :false-label="true" v-model="formCfg.hidden" @change="onAllCheck('hidden',$event)"> &nbsp;&nbsp;可查看 </el-checkbox></div>
            </template>
            <template #default="{row}">
              <el-checkbox v-model="row.hidden" />
            </template>
          </el-table-column>
          
          <el-table-column label="可编辑" prop="disabled">
            <template #header>
              <div class="titleCenter"><el-checkbox :true-label="false" :false-label="true" v-model="formCfg.disabled" @change="onAllCheck('disabled',$event)"><span>&nbsp;&nbsp;可编辑</span></el-checkbox> </div>
            </template>
            <template #default="{row}">
              <el-checkbox v-model="row.disabled"/>
            </template>
          </el-table-column>
          
          <el-table-column label="必填" prop="required"> 
            <template #header>
              <div class="titleCenter"> <el-checkbox v-model="formCfg.required" @change="onAllCheck('required',$event)"><span>&nbsp;&nbsp;必填</span> </el-checkbox></div>
            </template>
            <template #default="{row}">
              <el-checkbox v-model="row.required"/>
            </template>
          </el-table-column>
          
          <el-table-column label="摘要">
            <template #header>
              <div class="titleCenter"><el-checkbox v-model="formCfg.abs" @change="onAllCheck('abs',$event)"><span>&nbsp;&nbsp;摘要</span> </el-checkbox></div>
            </template>
            <template #default="{row}">
              <el-checkbox v-model="row.abs"/>
            </template>
          </el-table-column>
        </el-table> 
		</el-collapse-item>
		<el-collapse-item title="其它配置" name="2">
			<template #title>
						<div>&nbsp;&nbsp;其它配置</div>
					</template>
			<el-form class="padding-left">
				<el-form-item label="推送渠道">
					
					<el-checkbox v-model="msgc.inner"> 站内信</el-checkbox> 
					<el-checkbox v-model="msgc.im"> im </el-checkbox> 
					<el-checkbox v-model="msgc.wxpub"> 公众号、小程序</el-checkbox> 
					<el-checkbox v-model="msgc.app"> app </el-checkbox> 
					<el-checkbox v-model="msgc.sms"> 短信</el-checkbox> 
				</el-form-item> 
				
					
				<el-form-item  label="发起流程">

					<el-checkbox  v-model="start.editQx"> 可重设权限</el-checkbox> 
					<el-checkbox  v-model="start.nodeInfo"> 允许重新配置各节点审核人</el-checkbox>  
					<el-checkbox  v-model="start.disFillForm"> 仅发起人填单</el-checkbox>
				</el-form-item> 
				</el-form>
		</el-collapse-item>
		<el-collapse-item title="表单字段权限配置" name="3">
			<template #title>
						<div>&nbsp;&nbsp;表单字段权限配置</div>
					</template>
		 
		</el-collapse-item>
	</el-collapse>
	

			
		<el-row class="footer" v-if="false"> 
			<el-button type="primary" @click="confirm">确认</el-button> 
		</el-row>  
</template>

<script>
	import util from '@/components/mdp-ui/js/util';//全局公共库 
	
	import qxutil from './qxutil';//全局公共库 
	import { mapState } from 'pinia'
import { useUserStore } from '@/store/modules/user'
	
	export default { 
		name:'ActQxCodeSet',
		computed: {
		    ...mapState(useUserStore,[
		      'userInfo'
		    ])
		},
		props:['qxCode' ],
		watch: {
	      'qxCode':function( qxCode ) { 
	      }, 
	    },
		data() {
			return {
				activeName:'1',
				mainFields:[],
				formCfg:{
					hidden:false,
					disabled:false,
					required:false,
					abs:false
				},
				msgc:{},
				start: {},
			}//end return
		},//end data
		methods: {   
			onAllCheck(field){
				this.mainFields.forEach(k=>k[field]=this.formCfg[field])
			},
			 
 			confirm: function () {
				  
			},
			 
			initData(){  
 				this.mainFields=qxutil.initMainFields(this.qxCode) 
				var fs=this.mainFields.splice(this.mainFields.length-2,2)
				this.msgc=fs[0]
				this.start=fs[1]

			} 
			
		},//end method
		components: {  
		    
		},
		mounted() {
				this.initData();
		}
	}

</script>

<style scoped>

</style>