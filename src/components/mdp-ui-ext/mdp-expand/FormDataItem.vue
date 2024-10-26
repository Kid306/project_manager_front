<template>
	<section v-if="field.hidden!='1'">
		<el-row>  
			<el-row v-if="field.extType=='row'" :gutter="gutter">     
				<el-col  v-for="child,idx in field.children" :key="idx" :span="calcSpan(child,field)">
					<mdp-form-data-item :field="child" :parent-field="field" :gutter="gutter" :span="span" v-model="editForm" @change="onChildChange"  :style="styleObjCpd"/>
				</el-col> 
			</el-row>  
			<el-card v-else-if="field.extType=='card'" :gutter="gutter"> 
				<template #header >
					<span class="clearfix">{{ field.title }}</span> 
				</template>    
				<el-row :gutter="gutter" v-if="field.children && field.children.length>0"> 
						<el-col  v-for="child,idx in field.children" :key="idx" :span="calcSpan(child,field)">
							<mdp-form-data-item :field="child" :parent-field="field" :gutter="gutter" :span="span" v-model="editForm" @change="onChildChange"  :style="styleObjCpd"/>
						</el-col> 
				</el-row> 
			</el-card> 
			<el-tabs v-else-if="field.extType=='tabs'" v-model="editForm[field.idCamel]">     
				<el-tab-pane :label="tab" v-for=" tab,tidx in tabListCpd" :key="tidx" :name="tab">
					<el-row :gutter="gutter"> 
						<el-col  v-for="child,idx in field.children.filter(c=>c.gname==tab||!c.gname)" :key="idx" :span="calcSpan(child,field)">
							<mdp-form-data-item :field="child" :parent-field="field" :gutter="gutter" :span="span" v-model="editForm" @change="onChildChange" :style="styleObjCpd" />
						</el-col> 
					</el-row> 
				</el-tab-pane> 
			</el-tabs> 
			<el-form-item v-else :label="field.title" :prop="field.idCamel">  
				<div  v-if="field.nr"></div>
			<!--用户-->
				<mdp-select-user v-else-if=" field.extType=='user'" :show-style="field.showStyle" :disabled="field.ne" :multiple="field.mul=='1'" v-model="editForm[field.idCamel]" :label-width="labelWidthCpd" :label="field.title"  :placeholder="field.hol"  split="," @change="onFieldChange" :style="styleObjCpd"/>
				
			<!--部门-->
				<mdp-selecct-dept v-else-if=" field.extType=='dept'" :show-style="field.showStyle" :disabled="field.ne" :branch-id="userInfo.branchId" :show-checkbox="field.mul=='1'" :multiple="field.mul=='1'" split="," @change="onFieldChange" :style="styleObjCpd"/>

			<!--标签-->
				<mdp-select-tag  v-else-if=" field.extType=='tag'" :show-style="field.showStyle" :disabled="field.ne" :multiple="field.mul=='1'" v-model="editForm[field.idCamel]" :label-width="labelWidthCpd" :label="field.title"  :placeholder="field.hol"  split="," @change="onFieldChange" :style="styleObjCpd"/>
			<!--下拉框-->
				<mdp-select v-else-if=" ['select','radio','checkbox'].some(k=>k==field.typ)"  :show-style="field.showStyle" :disabled="field.ne" :show-type="field.typ"  :item-code="field.dict" :multiple="field.mul=='1'" v-model="editForm[field.idCamel]" :label-width="labelWidthCpd" :label="field.title"  :placeholder="field.hol" split="," @change="onFieldChange" :style="styleObjCpd"/>			 
			 
			<!--html-->
				<el-popover v-else-if=" field.extType=='html'"
					placement="top-start"
					width="400"
					trigger="hover">
					<el-input  type="textarea" rows="4" v-model="editForm[field.idCamel]" :style="styleObjCpd" :disabled="field.ne" @change="onFieldChange"/>
					<template #reference>
						<div  v-html="editForm[field.idCamel]||field.defaultValue||'无'"></div>
					</template>
					
				</el-popover>
			<!--link 链接-->
				<el-popover v-else-if=" field.extType=='link'"
					placement="top-start"
					width="400"
					trigger="hover">
					<el-input v-model="editForm[field.idCamel]" :disabled="field.ne" @change="onFieldChange"/>
					<template #reference >

						<el-link  :href="editForm[field.idCamel]" target="_blank" :style="styleObjCpd">{{ editForm[field.idCamel]||field.title }}</el-link> 
					</template>
				</el-popover>
			<!--image-->
				<el-popover v-else-if=" field.extType=='image'"
					placement="top-start" 
					trigger="hover">
					<el-button  @click="$refs['imageDialog'].open({formData:editForm,item:item})" :disabled="field.ne">上传图片</el-button> 
					<template #reference>
						<el-image     :style="styleObjCpd"
						:src="editForm[field.idCamel]"
						fit="contain" /> 
					</template>
					
				</el-popover>
			<!--att 附件-->
				<el-popover v-else-if=" field.extType=='att'"
					placement="top-start" 
					trigger="hover">
					<el-button  @click="$refs['attDialog'].open({formData:editForm,item:item})" :disabled="field.ne">上传附件</el-button> 
					<template #reference> 
						<el-link  :href="editForm[field.idCamel]" target="_blank" :style="styleObjCpd">{{ editForm[field.idCamel]||field.title }}</el-link> 
					</template>
				</el-popover>
			<!--其它类型-->
				<mdp-input :show-style="field.showStyle"  :disabled="field.ne" v-else-if="field.typ=='text'" :style="styleObjCpd"  v-model="editForm[field.idCamel]" :label-width="labelWidthCpd" :label="field.title" auto-complete="off" :placeholder="field.hol"  clearable @change="onFieldChange"/>
				<mdp-number :show-style="field.showStyle" :disabled="field.ne"   v-else-if="field.typ=='number'" :style="styleObjCpd" v-model="editForm[field.idCamel]" :label-width="labelWidthCpd" :label="field.title" auto-complete="off"  placeholder="请输入内容"  clearable @change="onFieldChange"/>
				<mdp-number :show-style="field.showStyle" :disabled="field.ne"   v-else-if="field.typ=='amount'" :style="styleObjCpd" v-model="editForm[field.idCamel]" :label-width="labelWidthCpd" :label="field.title" auto-complete="off"  placeholder="请输入内容"  clearable @change="onFieldChange"/>
				<mdp-input :show-style="field.showStyle" :disabled="field.ne"   v-else-if="field.typ=='textarea'"  :style="styleObjCpd" type="textarea" :rows="2" v-model="editForm[field.idCamel]" :label-width="labelWidthCpd" :label="field.title"  placeholder="请输入内容" @change="onFieldChange"/>
				<el-time-picker :show-style="field.showStyle" :disabled="field.ne"   v-else-if="field.typ=='time'" :style="styleObjCpd" v-model="editForm[field.idCamel]"  placeholder="任意时间点" value-format="HH:mm:ss" format="HH:mm:ss" @change="onFieldChange"/> 
				<mdp-date :show-style="field.showStyle" :disabled="field.ne"   v-else-if="field.typ=='date'" :style="styleObjCpd" v-model="editForm[field.idCamel]" align="right" type="date" value-format="YYYY-MM-DD" format="YYYY-MM-DD" placeholder="选择日期" :picker-options="pickerOptions" @change="onFieldChange"/>
				<mdp-date :show-style="field.showStyle" :disabled="field.ne" v-else-if="field.typ=='datetime'" :style="styleObjCpd" v-model="editForm[field.idCamel]" type="datetime"  value-format="YYYY-MM-DD HH:mm:ss" format="YYYY-MM-DD HH:mm:ss" placeholder="选择日期时间" align="right" :picker-options="pickerOptions" @change="onFieldChange"/>
				<mdp-date :show-style="field.showStyle" :disabled="field.ne" v-else-if="field.typ=='month'" :style="styleObjCpd" v-model="editForm[field.idCamel]" type="month" value-format="yyyy-MM" format="yyyy-MM" placeholder="选择月份" @change="onFieldChange"/>
				<mdp-date :show-style="field.showStyle" :disabled="field.ne" v-else-if="field.typ=='year'" :style="styleObjCpd" v-model="editForm[field.idCamel]" type="month" value-format="yyyy" format="yyyy" placeholder="选择年" @change="onFieldChange"/>
				<mdp-date-range :show-style="field.showStyle" :disabled="field.ne"   v-else-if="field.typ=='daterange'" :style="styleObjCpd" :value="editForm[field.idCamel]?editForm[field.idCamel].split(','):[]" align="right" type="daterange" value-format="YYYY-MM-DD" format="YYYY-MM-DD" placeholder="选择日期" :picker-options="pickerOptions" @change="(vs)=>{editForm[field.idCamel]=vs.join(',');onFieldChange(vs)}"/>  
			</el-form-item>        
				 
		</el-row> 

		
		<mdp-dialog ref="imageDialog" title="选择图片" width="80%" :modal="false">
			<template #default="{visible,data,dialog}">
				<mdp-select-image v-if="visible" :visible="visible" @select="(imgs)=>{
					if(data.field.mul=='1'){ 
						$set(data.formData,data.field.idCamel,imgs&&imgs.length>0?imgs.map(i=>i.url).join(','):null) 
					}else{
						$set(data.formData,data.field.idCamel,imgs&&imgs.length>0?imgs[0].url:null) 
					}
					dialog.close();
				}"/>
			</template> 
		</mdp-dialog>  
		<mdp-dialog ref="attDialog" title="选择文件" width="80%" :modal="false">
			<template #default="{visible,data,dialog}">
				<mdp-select-att v-if="visible" :visible="visible" :multiple="data.field.mul=='1'" @select="(imgs)=>{ 
					if(data.field.mul=='1'){ 
						$set(data.formData,data.field.idCamel,imgs&&imgs.length>0?imgs.map(i=>i.url).join(','):null) 
					}else{
						$set(data.formData,data.field.idCamel,imgs&&imgs.length>0?imgs[0].url:null) 
					} 
					 dialog.close();
				}" split=","/>
			</template> 
		</mdp-dialog>  
	</section>
</template>

<script> 

import { mapState } from 'pinia'
import { useUserStore } from '@/store/modules/user' 	  
	/**
	 * 表单数据填单
	 */
	export default { 
	    computed: {
		    
				...mapState(useUserStore,[
					'userInfo'
				  ]),
			labelWidthCpd:function(){
				if(this.labelWidth){
					return this.labelWidth
				}
				return this.labelWidthCalc();
			},  
			tabListCpd(){
				if(!this.field.gname){
					return []
				}
				return this.field.gname.split(",")
			},
			styleObjCpd(){
				return this.parseFieldStyleObj();
			}
		},
		props:{ 
			value:{type:Object,default:null}, 
			field:{type:Object,default:null}, 
			labelWidth:{type:String,default:null},			
			labelPosition:{type:String,default:null},
			span:{
				type:Number,
				default:24
			}, 
			parentField:{
				type:Object,
				default:function(){
					return {}
				}
			}, 
			gutter:{
				type:Number,
				default:0
			}
		},
		watch: {
			value:function(){
				this.initData()
			}, 
			field:function(field) {   
			},  
	    },	
		data() {
			return {
				pickerOptions: this.$mdp.getPickerOptions(), 
				editForm:{},
			} 
		}, 
		methods: { 
			labelWidthCalc:function(){
				if (screen.width <=375){
					return "80px"
				}else  if (screen.width <= 500){
						return "80px"
				}else if (screen.width<=1024){
						return "100px"
				}else {
						return "120px"
				}
			} ,   
			initData(){
				
				if(this.value){
					this.editForm=Object.assign({},this.value)
				}else{
					this.editForm={}
				}
			},
			
			onChildChange(val,field){
				this.$emit('input',val)
				this.$emit('change',val,field)
			},   
			calcSpan(child,parent){ 
				if(child.span>0){
					return child.span
				}else{
					return this.span
				}  
			},
			
			onFieldChange(val){  
				
				this.$emit('input',this.editForm)
				this.$emit('change',this.editForm,this.field) 
				
			},
			
			parseFieldStyleObj(){
				if(this.field.styleObj && this.field.styleObj.indexOf("{")>=0 && this.field.styleObj.indexOf("}")>0){
					return JSON.parse(this.field.styleObj)
				}else{
					return {}
				}
			}
		},//end method
		components: {   
			"mdp-form-data-item": ()=>import('@/components/mdp-ui-ext/mdp-expand/FormDataItem.vue'),
		},
		mounted() {    
			this.initData();   
		}//end mounted
	}

</script>

<style scoped>

</style>