<template>
	
		<div class="padding-left padding-bottom padding-right">
			<span style="font-size:0.8em;color:#909399;">
				<h4>注意：</h4> 
				测试库的环境变量在整个测试库范围内共享。测试计划的环境变量在整个测试计划范围内共享。环境变量可以在自动化测试用例中通过<Strong>#{变量名}</Strong>进行引用，比如变量baseApi,可以通过 #{baseApi}进行引用<br/>
				赋值顺序：优先查找测试计划中变量，如果不存在，则从测试库中查找变量<br/> 
				内置的用户相关变量(无须定义，可以直接在脚本或者用例配置中使用)：<br/>
				用户编号: #{userInfo.userid}={{userInfo.userid}} 
				用户名称: #{userInfo.username}={{userInfo.username}} 
				用户机构号: #{userInfo.branchId}={{userInfo.branchId}} 
				用户bearer: #{accessToken},#{apiGate},#{curlDomain} 等等
			</span> 
		</div>
		<div class="padding"><el-button type="primary" @click="$refs['dlg'].open()">查看更多内置变量</el-button><el-button @click="$refs['envDlg'].open()">变量引用举例</el-button></div>
		<el-table
			:data="envList"
			style="width: 100%">
			<el-table-column
				prop="id"
				label="变量名(英文)"
				min-width="100">
				<template #default="scope">
					<el-input v-model="scope.row.id"/>
				</template>
			</el-table-column>
			<el-table-column
				prop="value"
				label="变量值"
				min-width="350">
				<template #default="scope">
					<el-input v-model="scope.row.value"/>
				</template>
			</el-table-column>  
			
			<el-table-column
				prop="name"
				label="备注"
				min-width="100">
				<template #default="scope">
					<el-input v-model="scope.row.name"/>
				</template>
			</el-table-column>  
			<el-table-column label="操作" width="100">
				<template #header>
					操作											
					<el-button v-if="!envList||envList.length==0" @click="addEnvRow({},0)" icon="plus" circle plain/>  
				</template>
				<template #default="scope">
					<el-button type="danger" @click="deleteEnvRow(scope.row,scope.$index)" icon="delete" circle plain/> 
					<el-button @click="addEnvRow(scope.row,scope.$index)" icon="plus" circle plain/> 
				</template>
			</el-table-column>
		</el-table>
		<slot name="submit" :value="envList">
			<el-row class="padding" style="float:right;"><el-button @click="saveData" type="primary">保存</el-button></el-row>
		</slot>
		<mdp-dialog width="90%" ref="dlg" title="内置变量">
			<el-descriptions
				title="均可以在用例配置中直接使用，无须定义，使用方法 #{userInfo.username}"
				direction="vertical"
				:column="4" 
				border
			>
				<el-descriptions-item label="用户名称">#{userInfo.username}</el-descriptions-item>
				<el-descriptions-item label="用户编号">#{userInfo.userid}</el-descriptions-item>
				<el-descriptions-item label="用户机构">#{userInfo.branchId}</el-descriptions-item>
				<el-descriptions-item label="机构名称">#{userInfo.branchName}</el-descriptions-item>
				<el-descriptions-item label="用户部门">#{userInfo.deptid}</el-descriptions-item>
				<el-descriptions-item label="部门名称">#{userInfo.deptName}</el-descriptions-item>
				<el-descriptions-item label="用户角色">#{userInfo.roles}</el-descriptions-item>
				<el-descriptions-item label="用户岗位">#{userInfo.posts}</el-descriptions-item>
				<el-descriptions-item label="用户邮箱">#{userInfo.email}</el-descriptions-item>
				<el-descriptions-item label="手机号码">#{userInfo.phoneno}</el-descriptions-item>
				<el-descriptions-item label="访问令牌">#{accessToken}</el-descriptions-item>   
				<el-descriptions-item label="当前域名">#{curlDomain}</el-descriptions-item>   
				<el-descriptions-item label="api网关">#{apiGate}</el-descriptions-item>   
			</el-descriptions>
			<div class="padding">访问令牌值 #{accessToken}：</div>
			<div class="padding border"><el-text>{{ accessToken }}</el-text></div>
			<div class="padding">当前域名值 #{curlDomain}：</div>
			<div class="padding border"><el-text>{{ curlDomain }}</el-text></div>
			<div class="padding">api网关值 #{apiGate}：</div>
			<div class="padding border"><el-text>{{ apiGate }}</el-text></div>
			<div class="padding">当前用户所有值 #{userInfo}：</div>
			<div class="padding border"><json-viewer :value="userInfo" copyable theme="my-awesome-json-theme" /></div>
 
		</mdp-dialog>
		
		<mdp-dialog width="90%" ref="envDlg" title="变量引用举例"> 
				 
			<div class="padding">url中引用变量：</div>
			<div class="padding border"><el-text>url=#{apiGate}/xm/product/list</el-text></div>
			<div class="padding">参数值取变量 ：</div>
			<div class="padding border"><el-text> userid= #{userInfo.userid} </el-text></div>
			<div class="padding">auth中token取变量：</div>
			<div class="padding border"><el-text>bearerToken=#{accessToken}</el-text></div>
			<div class="padding">脚本中使用环境变量：</div>
			<div class="padding border">
				if(res.data.userid=='#{userInfo.userid}'){
					return true
				}else{
					return false
				}
			</div> 
		</mdp-dialog>
 	
</template>

<script>
	import util from '@/components/mdp-ui/js/util';//全局公共库
	import { editSomeFieldsXmTestCasedb } from '@/api/xm/core/xmTestCasedb';
	import { getAccessToken } from '@/utils/auth'
	import { mapState } from 'pinia'
import { useUserStore } from '@/store/modules/user'; 
 
import JsonViewer from 'vue-json-viewer'
	export default { 
		props:['xmTestCasedb'],
		computed: {
		    ...mapState(useUserStore,[
		      'userInfo','roles'
				]), 
		}, 
		watch:{
			xmTestCasedb:{
				deep:true,
				handler:function(){
					this.initData();
				}
				
			}
		},
		data() {
			return {  
				envList:[{id:'',value:'',name:''}],
				accessToken: '',
				currDomain:'',
				apiGate:'',
			}
		},//end data
		methods: {  
			
			addEnvRow(row,index){
				this.envList.splice(index+1,0,{id:'',value:''})
			}, 
			deleteEnvRow(row,index){
				this.envList.splice(index,1)
			},
			
			saveData(){
				this.editSomeFields(this.xmTestCasedb,"envJson",JSON.stringify(this.envList));
			},
			initData(){
				if(this.xmTestCasedb.envJson){
					this.envList=JSON.parse(this.xmTestCasedb.envJson)
				}else{
					this.envList=[]
				}
				this.accessToken=getAccessToken()
				this.curlDomain=window.location.protocol+"//"+window.location.host; //  
				this.apiGate=this.$mdp.getUri(this.curlDomain,import.meta.env.VITE_API_BASE_PATH,import.meta.env.VITE_API_VERSION)

			 
			},
			
            editSomeFields(row,fieldName,$event){
                
                let params={};
                params['$pks']=[row].map(i=>i.id)
				params[fieldName]=$event  
                var func = editSomeFieldsXmTestCasedb
                func(params).then(res=>{
                  let tips = res.tips;
                  if(tips.isOk){
					row.envJson=$event
					this.$emit('edit-fields',row)
                    this.$notify({position:'bottom-left',showClose:true,message:tips.msg,type:tips.isOk?'success':'error'})
                  }else{ 
                    this.$notify({position:'bottom-left',showClose:true,message:tips.msg,type:tips.isOk?'success':'error'})
                  }
                }).catch((e)=> {})
            },
		},//end methods
		components: {  
			JsonViewer
 		},  
		mounted() {   
			this.initData()
		}
	}
</script>

<style scoped />