<template> 
				<!-- 扩展字段[{name:'中文名称',id:'编号',value:'值',remark:'备注',type:'支持简单的1-普通文本2-数字，3-日期，8-富文本，9单图文，15-是否'}] -->
				<el-row>
						<el-col :span="2">
							#
						</el-col>
						<el-col :span="9">
							操作
						</el-col>
						<el-col :span="9">
							预期结果
						</el-col>
						<el-col :span="4">
							操作
						</el-col>
					</el-row>
					<el-divider />
				<el-row v-for="(item, index) in extInfosList" :key="index" class="padding-top">
					 
						<el-col :span="2">
							{{index+1}}
						</el-col>
						<el-col :span="9">
							<el-input class="padding-right" v-model="item.op" clearable placeholder="操作步骤" />
						</el-col>
						<el-col :span="9">
							<el-input class="padding-right" v-model="item.eresult" clearable placeholder="预期结果" />
						</el-col>
						<el-col :span="4" style="margin-bottom:0px;">
							<el-button  @click.prevent="removeExtInfosItem(item,index)" type="danger" icon="delete" plain/>
							<el-button @click="addExtInfosItem(item,index)" type="primary" icon="plus" plain/> 
						</el-col> 
				</el-row>
				<el-divider v-if="extInfosList.length>0"/>
				<el-space wrap v-if="!extInfosList || extInfosList.length<=0"> 
					<el-button @click="addExtInfosFirstItem" icon="plus" type="primary" plain><slot>新增步骤</slot></el-button>
					<slot name="footer"></slot>  
				</el-space>
	
</template>

<script> 
	import { mapState } from 'pinia'
import { useUserStore } from '@/store/modules/user'
	  
 	
	export default {  
		name: 'testStepConfig',
		props:['modelValue','unConfig'],
		computed: {
		    ...mapState(useUserStore,[
		      'userInfo'
		    ]),
				value:{
					get(){
						return this.modelValue
					},
					set(val){
						this.$emit('update:modelValue',val)
					}
				}
		},
		watch:{
			value(val){
				
				this.initData();
			},
			extInfosList:{
				deep:true,
				handler(val,oldVal){  
					if(Array.isArray(this.value)){
						this.$emit("update:modelValue",val)
					}else{ 
						this.$emit("update:modelValue",JSON.stringify(val))
					}
				}
			}, 
		},
		data() { 
			return{ 
				extInfosList:[],//[{name:'中文名称',id:'编号',value:'值',link:'超链接',remark:'备注',type:'支持简单的1-普通文本2-数字，3-日期，8-富文本，9单图文，15-是否'}]

			}
		},//end data
		methods: { 
			save(){
				if(Array.isArray(this.value)){
					this.$emit("finish",this.extInfosList)
				}else{ 
					this.$emit("finish",JSON.stringify(this.extInfosList))
				} 
			},
			addExtInfosFirstItem(){
				if(!this.extInfosList){
					this.extInfosList=[]
				}
				this.extInfosList.push({id:'',op:'',eresult:'',aresult:'',tcode:'0'})
			},
			addExtInfosItem(item,index){ 
				this.extInfosList.splice(index+1,0,{id:'',op:'',eresult:'',aresult:'',tcode:'0'})
			},
			removeExtInfosItem(item,index){
				this.extInfosList.splice(index,1)
			},
			initData(){
				if(this.value){
					if(Array.isArray(this.value)){
						this.extInfosList=this.value
					}else{
						this.extInfosList=JSON.parse(this.value)
					}
				}else{
					this.extInfosList=[]
					//this.addExtInfosFirstItem();
				}
			}
		},//end methods
		components: {   
		},
		mounted() { 
			 this.initData();
			
			
		}
	}

</script>

<style scoped>
	 
</style>