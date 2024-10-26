<template>
	
		<div class="padding-left padding-bottom padding-right">
			<span style="font-size:0.8em;color:#909399;">
				<h4>注意：</h4> 
 				测试计划的环境变量在整个测试计划范围内共享。<br/> 
				环境变量可以在自动化测试用例中通过<Strong>#{变量名}</Strong>进行引用，比如变量baseApi,可以通过 #{baseApi}进行引用<br/>
				赋值顺序：优先查找测试计划中变量，如果不存在，则从测试库中查找变量<br/>
				
				内置的用户相关变量(无须定义，可以直接在脚本或者用例配置中使用)：<br/>
				用户编号: #{userInfo.userid}={{userInfo.userid}} 
				用户名称: #{userInfo.username}={{userInfo.username}} 
				用户机构号: #{userInfo.branchId}={{userInfo.branchId}} 
				用户bearer: #{accessToken},#{apiGate},#{curlDomain} 等等
			</span>
		</div>
		<div class="padding"><el-button type="primary" @click="$refs['dlg'].open()">查看测试库中的变量</el-button></div>

		<el-table
			:data="envList"
			style="width: 100%">
			<el-table-column
				prop="id"
				label="参数名(英文)"
				min-width="100">
				<template #default="scope">
					<el-input v-model="scope.row.id"/>
				</template>
			</el-table-column>
			<el-table-column
				prop="value"
				label="参数值"
				min-width="250">
				<template #default="scope">
					<el-input v-model="scope.row.value"/>
				</template>
			</el-table-column>  
			
			<el-table-column
				prop="name"
				label="备注"
				min-width="150">
				<template #default="scope">
					<el-input v-model="scope.row.name"/>
				</template>
			</el-table-column>  
			<el-table-column label="操作" width="280">
				<template #header>
					操作	
					<div style="display:flex;">								
						<el-button v-if="!envList||envList.length==0" @click="addEnvRow({},0)" icon="plus"/>  
						<el-button v-if="!envList||envList.length==0" @click="importFromCasedb({},0)" icon="plus" plain>从测试库导入</el-button> 
					</div>		
				</template>
				<template #default="scope">
					<el-button type="danger" @click="deleteEnvRow(scope.row,scope.$index)" icon="delete" circle plain/> 
					<el-button @click="addEnvRow(scope.row,scope.$index)" icon="plus" circle plain/>  
					<el-button @click="importFromCasedb(scope.row,scope.$index)" icon="plus" plain>从测试库导入</el-button> 
				</template>
			</el-table-column>
		</el-table>
		<slot name="submit" :value="envList">
			<el-row class="padding" style="float:right;"><el-button @click="saveData" type="primary">保存</el-button></el-row>
		</slot> 
		<mdp-dialog append-to-body title="选择测试库环境变量" width="90%" top="10px" v-model="xmTestCasedbEnvVisible">
			<xm-test-casedb-env-select :xmTestCasedb="xmTestCasedb" @select="onCasedbEnvSelect" />
		</mdp-dialog>
		<mdp-dialog ref="dlg" width="90%"  title="查看测试库中的环境变量">
			<xm-test-casedb-env :xmTestCasedb="xmTestCasedb"/>
		</mdp-dialog>
</template>

<script>
	import util from '@/components/mdp-ui/js/util';//全局公共库
	import { editSomeFieldsXmTestPlan } from '@/api/xm/core/xmTestPlan';
	import XmTestCasedbEnvSelect from '../xmTestCasedb/XmTestCasedbEnvSelect.vue';
	import XmTestCasedbEnv from '../xmTestCasedb/XmTestCasedbEnv.vue';
	import { mapState } from 'pinia'
import { useUserStore } from '@/store/modules/user'; 
 
	export default { 
		props:['xmTestPlan','xmTestCasedb'],
		computed: {
		    ...mapState(useUserStore,[
		      'userInfo','roles'
				]), 
		}, 
		watch:{
			xmTestPlan:{
				deep:true,
				handler:function(){
					this.initData();
				}
				
			}
		},
		data() {
			return {  
				envList:[{id:'',value:'',name:''}],
				xmTestCasedbEnvVisible:false,
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
				this.editSomeFields(this.xmTestPlan,"envJson",JSON.stringify(this.envList));
			},
			initData(){
				if(this.xmTestPlan.envJson){
					this.envList=JSON.parse(this.xmTestPlan.envJson)
				}else{
					this.envList=[]
				}
			},
			importFromCasedb(row,index){
				this.xmTestCasedbEnvVisible=true;
			},
			onCasedbEnvSelect(rows){
				if(rows && rows.length>0){
					this.envList.push(...rows)
				}
				this.xmTestCasedbEnvVisible=false;
				
			},
            editSomeFields(row,fieldName,$event){
                
                let params={};
                params['$pks']=[row].map(i=>i.id)
				params[fieldName]=$event  
                var func = editSomeFieldsXmTestPlan
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
			XmTestCasedbEnvSelect,XmTestCasedbEnv
 		},  
		mounted() {   
			this.initData()
		}
	}
</script>

<style scoped />