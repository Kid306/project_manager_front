<template> 
			<el-form  v-if="configVisible" ref="extInfosRef">  
				<!-- 扩展字段[{name:'中文名称',id:'编号',value:'值',remark:'备注',type:'支持简单的1-普通文本2-数字，3-日期，8-富文本，9单图文，15-是否'}] -->
				<el-row v-for="(item, index) in extInfosList" :key="index">
					<el-form-item v-if="!item.type" > 
						<el-space>
						<el-select v-model="item.type" style="width:120px;">
							<el-option v-for="(it,indexx) in itemTypes" :key="indexx" :label="it.name" :value="it.id">{{it.name}} </el-option>
						</el-select>
						<el-input  style="width:10%;" v-model="item.id" placeholder="代码"/>:
						<el-input  style="width:10%;" v-model="item.name" placeholder="名称"/>:
						<el-input  v-model="item.value" placeholder="值"/> 
 						<el-button  @click.prevent="removeExtInfosItem(item,index)" icon="delete"/><el-button @click="addExtInfosItem(item,index)" icon="plus"/> 
						</el-space>
					</el-form-item>
					<el-form-item v-else-if="item.type=='1'" > <el-space>
						<el-select v-model="item.type"  style="width:120px;">
							<el-option v-for="(it,indexx) in itemTypes" :key="indexx" :label="it.name" :value="it.id">{{it.name}} </el-option>
						</el-select>
						<el-input  style="width:10%;" v-model="item.id" placeholder="代码"/>:
						<el-input  style="width:10%;" v-model="item.name" placeholder="名称"/>:
						<el-input  v-model="item.value" placeholder="值"/> 
 						<el-button  @click.prevent="removeExtInfosItem(item,index)" icon="delete"/><el-button @click="addExtInfosItem(item,index)" icon="plus"/> 
					</el-space>
					</el-form-item>
					<el-form-item v-else-if="item.type=='2'"  > <el-space>
						<el-select v-model="item.type" style="width:120px;">
							<el-option v-for="(it,indexx) in itemTypes" :key="indexx" :label="it.name" :value="it.id">{{it.name}} </el-option>
						</el-select>
						<el-input  style="width:10%;" v-model="item.id" placeholder="代码"/>:
						<el-input  style="width:10%;" v-model="item.name" placeholder="名称"/>:
						<el-input type="number"  v-model="item.value" placeholder="值"/> 
 						<el-button  @click.prevent="removeExtInfosItem(item,index)" icon="delete"/><el-button @click="addExtInfosItem(item,index)" icon="plus"/> 
					</el-space>
					</el-form-item>
					<el-form-item v-else-if="item.type=='3'"  > <el-space>
						<el-select v-model="item.type" style="width:120px;">
							<el-option v-for="(it,indexx) in itemTypes" :key="indexx" :label="it.name" :value="it.id">{{it.name}} </el-option>
						</el-select>
						<el-input  style="width:10%;" v-model="item.id" placeholder="代码"/>:
						<el-input  style="width:10%;" v-model="item.name" placeholder="名称"/>:
						<el-date-picker  value-format="YYYY-MM-DD HH:mm:ss" format="YYYY-MM-DD" v-model="item.value" placeholder="值"/>
 
 						<el-button  @click.prevent="removeExtInfosItem(item,index)" icon="delete"/><el-button @click="addExtInfosItem(item,index)" icon="plus"/> 
					</el-space>
					</el-form-item>
					<el-form-item v-else-if="item.type=='8'"  > <el-space>
						<el-select v-model="item.type" style="width:120px;">
							<el-option v-for="(it,indexx) in itemTypes" :key="indexx" :label="it.name" :value="it.id">{{it.name}} </el-option>
						</el-select>
						<el-input  style="width:10%;" v-model="item.id" placeholder="代码"/>:
						<el-input  style="width:10%;" v-model="item.name" placeholder="名称"/>:
						<el-input type="textarea" rows=6  v-model="item.value" placeholder="值"/> 
 						<el-button  @click.prevent="removeExtInfosItem(item,index)" icon="delete"/><el-button @click="addExtInfosItem(item,index)" icon="plus"/> 
					</el-space>
					</el-form-item>
					<el-form-item v-else-if="item.type=='9'"  > <el-space>
						<el-select v-model="item.type" style="width:120px;">
							<el-option v-for="(it,indexx) in itemTypes" :key="indexx" :label="it.name" :value="it.id">{{it.name}} </el-option>
						</el-select>
						<el-input  style="width:10%;" v-model="item.id" placeholder="代码"/>:
						<el-input  style="width:10%;" v-model="item.name" placeholder="图片名称"/>:
						<el-input  style="width:20%;" v-model="item.value" placeholder="图片访问地址"/> 
						<el-input  style="width:20%;" v-model="item.link" placeholder="跳转地址"/> 
						<el-input  style="width:20%;" v-model="item.remark" placeholder="图片备注"/>  
 						<el-button  @click.prevent="removeExtInfosItem(item,index)" icon="delete"/><el-button @click="addExtInfosItem(item,index)" icon="plus"/> 
					</el-space>
					</el-form-item>
					<el-form-item v-else-if="item.type=='15'"  > <el-space>
						<el-select v-model="item.type" style="width:120px;">
							<el-option v-for="(it,indexx) in itemTypes" :key="indexx" :label="it.name" :value="it.id">{{it.name}} </el-option>
						</el-select>
						<el-input  style="width:10%;" v-model="item.id" placeholder="代码"/>:
						<el-input  style="width:10%;" v-model="item.name" placeholder="名称"/>:
						<el-radio   v-model="item.value" :label="'1'" placeholder="">是</el-radio>
						<el-radio   v-model="item.value" :label="'0'" placeholder="">否</el-radio>  
						<el-button  @click.prevent="removeExtInfosItem(item,index)" icon="delete"/><el-button @click="addExtInfosItem(item,index)" icon="plus"/> 
					</el-space>
					</el-form-item>
					 
				</el-row>
				<el-form-item>
					<el-row class="padding">
					<el-button @click="configVisible=false" icon="back"><slot>返回</slot></el-button>
					<el-button @click="addExtInfosFirstItem" icon="plus"><slot>新增一行</slot> </el-button>
				</el-row>
				</el-form-item>
			</el-form> 
			<el-form  v-else ref="extInfosRef" :label-width="labelWidth">  
				<!-- 扩展字段[{name:'中文名称',id:'编号',value:'值',remark:'备注',type:'支持简单的1-普通文本2-数字，3-日期，8-富文本，9单图文，15-是否'}] -->
				<el-row>
					<el-col :span="span" v-for="(item, index) in extInfosList" :key="index">
						<el-form-item v-if="!item.type" :label="item.name">  
							<el-input  v-model="item.value" placeholder="值"/>  
						</el-form-item>
						<el-form-item v-else-if="item.type=='1'" :label="item.name"> 
							<el-input  v-model="item.value" placeholder="值"/> 
						</el-form-item>
						<el-form-item v-else-if="item.type=='2'" :label="item.name"> 
							<el-input type="number"  v-model="item.value" placeholder="值"/> 
						</el-form-item>
						<el-form-item v-else-if="item.type=='3'" :label="item.name"> 
							
							<el-date-picker  value-format="YYYY-MM-DD HH:mm:ss" format="YYYY-MM-DD" v-model="item.value" placeholder="值"/>
							
						</el-form-item>
						<el-form-item v-else-if="item.type=='8'" :label="item.name">  
							<el-input type="textarea" rows=6  v-model="item.value" placeholder="值"/>
							
						</el-form-item>
						<el-form-item v-else-if="item.type=='9'" :label="item.name">  
							<el-input   v-model="item.value" placeholder="请输入图片地址"/> 
						</el-form-item>
						<el-form-item v-else-if="item.type=='15'" :label="item.name">  
							<el-radio   v-model="item.value" :label="'1'" placeholder="">是</el-radio>
							<el-radio   v-model="item.value" :label="'0'" placeholder="">否</el-radio> 
						</el-form-item>
					</el-col>
				</el-row> 
				
				<el-form-item v-if="!cfgDisabled"> 
					<el-row class="padding">
						<el-button @click="configVisible=true" icon="setting"><slot>配置扩展字段</slot></el-button> 
					</el-row>
				</el-form-item>
			</el-form>  
</template>

<script>  
	 
 	
	export default {  
		name: 'MdpExtInfos',
		props:{
			modelValue:{
				type:Array,
				default:()=>{
					return []
				},
			},
			cfgDisabled:{
				type:Boolean,
				default:true,
			},
			span:{
				type:Number,
				default:24
			},
			labelWidth:{
				type:String,
				default:'120px'
			}
	
		},
		computed:{
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
						this.value=val
						this.$emit("change",val)
						this.$emit("change2",val)
					}else{ 
						var v=JSON.stringify(val);
						this.value=v;
						this.$emit("change",v)
						this.$emit("change2",v)
					}
				}
			}, 
		},
		data() { 
			return{
				configVisible:false,
				itemTypes:[//支持简单的1-普通文本2-数字，3-日期，8-富文本，9单图文，15-是否'
					{id:'1',name:'普通文本'},
					{id:'2',name:'数字'},
					{id:'3',name:'日期'},
					{id:'8',name:'富文本'},
					{id:'9',name:'单图文'},
					{id:'15',name:'是否'}
				],
				extInfosList:[],//[{name:'中文名称',id:'编号',value:'值',link:'超链接',remark:'备注',type:'支持简单的1-普通文本2-数字，3-日期，8-富文本，9单图文，15-是否'}]

			}
		},//end data
		methods: { 
			addExtInfosFirstItem(){
				if(!this.extInfosList){
					this.extInfosList=[]
				}
				this.extInfosList.push({id:'',name:'',value:'',url:'',extInfo:'',type:'1',remark:''})
			},
			addExtInfosItem(item,index){ 
				this.extInfosList.splice(index+1,0,{id:'',name:'',value:'',url:'',extInfo:'',type:'1',remark:''})
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