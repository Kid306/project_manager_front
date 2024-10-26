<template>    
    <span>
        <!--显示/隐藏列-->
        <el-button @click="showTableColumnConfigs" icon="setting" :size="size" title="配置表格显示列"/>
        <mdp-dialog append-to-body v-model="columnConfigsVisible" modal-append-to-body :width="width">
            <el-row class="center">
                    <el-transfer v-model="checkedColumns" :data="columnConfigsCpd" :props="{key:'property',label:'label'}"
                             :titles="['未选择', '已选择']"
                            :format="{
                                noChecked: '${total}',
                                hasChecked: '${checked}/${total}'
                            }"  
						    filterable
						    :render-content="renderFunc"
                            @change="onCheckColumnChange"
                    />  
                </el-row>
                <el-row class="footer">
                <el-button type="text" @click="columnConfigsVisible=false">取消</el-button>
                <el-button v-if="formDefId"  @click="goToFormDesign" type="success">设计</el-button>
                <el-button @click="columnConfigSubmit" type="primary">确定</el-button>
            </el-row> 
        </mdp-dialog> 
    </span>
  </template>
  
  <script>  
  export default {
    name: 'MdpTableConfigs', 
    props:{
        
        /**
         * 自定义表单编号，用于加载表单配置信息,建议用表名进行编码
         */
         formDefId:{
            type:String,
            default:null,
        },
        columnConfigs:{
            type:Array,
            default:()=>{
                return []
            }
        },
        width:{
            type:String,
            default:'1200px'
        },
        modelValue:{
            type:Array,
            default:()=>{
                return null
            }
        },
        size:{
            type:String,
            default:""
        }

    },
    watch:{
        value(val){
            if(!val){
                this.checkAllColumn=[]
                return;
            }
            if(typeof val == Array){
                this.checkedColumns=val
            }
            
        }
    },
    computed:{
        columnConfigsCpd:function(){
            return this.columnConfigs.filter(k=>k.property && k.label)
        },
        value:{
            set(val){
                this.$emit('update:modelValue',val)
            },
            get(){
                return this.modelValue
            }
        }
    },
    data(){
        return {
            columnConfigsVisible:false,//是否显示表格的列配置
            checkAllColumn:false,//是否全选
            isIndeterminate:false,
            checkedColumns:[],
        }
    },
    mounted(){ 
        
        this.checkedColumns=this.value
    },
    methods:{
        showTableColumnConfigs(){
            this.columnConfigsVisible=true;
        },
        onCheckAllColumnChange(val){ 
            this.checkedColumns = val ? this.columnConfigs.map(c=>c.property) : [];
            this.isIndeterminate = false; 
        },
        onCheckColumnChange(value){
            let checkedCount = value.length;
            let columnCount=this.columnConfigs.length;
            this.checkAllColumn = checkedCount === columnCount;
            this.isIndeterminate = checkedCount > 0 && checkedCount < columnCount;
        },
        columnConfigSubmit(){
             
           this.value=this.checkedColumns
           this.$emit("checked-columns-change",this.checkedColumns) 
           this.columnConfigsVisible=false;
        },
        renderFunc(h, option) {
            return `${ option.label }`;
        },
        goToFormDesign(){
            this.columnConfigsVisible=false;
            this.$mdp.goToFormDesign(this.formDefId)
        }
    }
  }
  </script>
<style lang="scss" scoped>  
@import url('../index.scss');
:deep(.el-transfer-panel)  {
  height: 400px; /* 穿梭框高度 */
  width: 400px;
}
 
:deep(.el-transfer-panel__list.is-filterable) {
  height: 400px; /* 穿梭框列表高度 */
}
 
:deep(.el-transfer-panel__body) {
  height: 400px; /* 穿梭框视图层高度 */
}
:deep(.el-transfer-panel__filter) {
  width: 400px; /* 修改搜索栏的宽度 */
} 

</style> 
