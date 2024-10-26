<template>
	 <div style="width:100%;">
 				<!-- 扩展字段[{name:'中文名称',id:'编号',value:'值',remark:'备注',type:'支持简单的1-普通文本2-数字，3-日期，8-富文本，9单图文，15-是否'}] -->
				<el-row>
						<el-col :span="1">
							#
						</el-col>
						<el-col :span="11">
							操作
						</el-col>
						<el-col :span="8">
							说明
						</el-col>
						<el-col :span="1">
							缺陷
						</el-col>
						<el-col :span="3">
							结论
						</el-col>
					</el-row>
					<el-divider /> 
				<el-row v-for="(item, index) in extInfosList" :key="index">

						<el-col :span="1">
							{{index+1}}
						</el-col>
						<el-col :span="11">
							<span>{{item.op}}</span><br/>
							<span><span style="color:#C0C4CC;">预期：</span>{{item.eresult}}</span>
 						</el-col>
						<el-col :span="8">
							<el-input  v-model="item.aresult" clearable placeholder="说明" />
						</el-col>
						
						<el-col :span="1"> 
															<slot name="addBug">
 								<el-button @click="addBug(item,index)" icon="plus"  circle/>
							</slot> 
						</el-col>
						<el-col :span="3">
							<el-form-item label-width="0">
								<mdp-select width="100px" show-style="tag" label="结果"  itemCode="testStepTcode" v-model="item.tcode"/>
							</el-form-item>
							</el-col>
				</el-row> 

				<el-divider v-if="extInfosList.length>0"/>
				</div>
</template>

<script>
	import util from '@/components/mdp-ui/js/util';//全局公共库
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
					set(val){
						this.$emit('update:modelValue',val)
					},
					get(){
						return this.modelValue
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
				dicts:{
					testStepTcode:[],
				},
				extInfosList:[],//[{name:'中文名称',id:'编号',value:'值',link:'超链接',remark:'备注',type:'支持简单的1-普通文本2-数字，3-日期，8-富文本，9单图文，15-是否'}]

			}
		},//end data
		methods: {
			...util,
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
				}
			},


			getExecStatusIcon(execStatus){

				var icons=['arrow-up','right','check','minus','close'];
				if(!execStatus){
					return icons[0]
				}
				return icons[parseInt(execStatus)]
			},
			addBug(item,index){
				if(Array.isArray(this.value)){
					this.$emit("add-bug",val)
				}else{
					this.$emit("add-bug",JSON.stringify(val))
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

<style  lang="scss" scoped>

</style>
