<template> 
	<FormCreate v-if="formDef" v-model:api="fApi" :option="option" :rule="rule" @submit="onFormSubmit"/>
</template>

<script>
import formCreate from "@form-create/element-ui";

import axios from '@/config/maxios'
import util from '@/components/mdp-ui/js/util';//全局公共库 
import { mapState } from 'pinia'
import { useUserStore } from '@/store/modules/user'    
export default { 
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
       formDefId(){
        this.init()
       }
    },
    props:{
        modelValue:{
            type: Object,
            default:function(){
                return null
            }
        },
        formDefId:{
            type: String,
            default: null
        },
        params:{
            type: Object,
            default:function(){
                return {}
            }
        },
        /**
         * 是否禁用原来的后台api
         */
        disApi:{
            type: Boolean,
            default: false
        }
    },
    data() {
        return {  
            formDef:null,
            fApi:null, 
            rule:[],
            option:[],
            crudApisCfg:{
                list:null,
                add:null,
                edit:null,
                del:null,
                query:null,
                editSomeFields:null
            }
        }
    },
    methods: { 
        onFormSubmit(formData,fcApi){  
            
            if( this.disApi || !this.crudApisCfg || !this.crudApisCfg.add || this.crudApisCfg.add.apiType=='5'){
                this.$emit('submit',formData,fcApi)
                return;
            } 
            
            if(this.crudApisCfg.add.apiType=='2'){
                    
                if(!this.crudApisCfg.add.params||!this.crudApisCfg.add.params.tableName){
                        this.$message.error("未配置新增接口参数，不支持保存数据")
                        return;
                } 
                this.execApi(this.crudApisCfg.add,formData,fcApi)
            } 
        },
       async init(){
            if(!this.formDefId){
                this.formDef=null
                this.rule=null
                this.option=null
                return;
            }
            
            let {tips,data} = await this.$mdp.getFormDefById({id:this.formDefId});
            if(!tips.isOk){
                this.$message.error(tips.msg)
                return;
            }
            this.formDef=data
            if(!this.formDef){
                return;
            }
            var formId=this.formDef.id
            if(!formId){
                return;
            }
 
            var formDef=this.formDef
            if(formDef.options){
                this.option=JSON.parse(formDef.options)
                if(this.option.form.crudApisCfg){
                     this.crudApisCfg=JSON.parse(this.option.form.crudApisCfg)
                } 
            }
            if(formDef.rules){
                this.rule=JSON.parse(formDef.rules)
            } 
            var apiType=this.crudApisCfg.query?.apiType
             if(['1','2','3'].includes(apiType) ){
                this.execApi(this.crudApisCfg.query,this.value)
             }
            this.$emit('initOk',this.formDef,this.fcApi)
        },
        
        parseJson(jsonStr){
            try{
                var json=JSON.parse(jsonStr)
                return json;
            } catch (e){
                return eval("("+jsonStr+")")
            }
            
        },
        tplParse(tplStr,formData){
            if(!tplStr){
                return tplStr
            }else{
                var userInfoKey="userInfo."
                var formDataKey="formData."
                var paramsKey="params."
                const result = tplStr.replace(/\${(.*?)}/g, (match, key) => {
                    var indexOf=key.indexOf(userInfoKey)
                    if( indexOf>=0){
                        var columnName=key.substring(userInfoKey.length)
                        var camelName=this.$mdp.toCamel(columnName) 
                        return "'"+this.userInfo[camelName]+"'" 
                    }else{
                        indexOf=key.indexOf(formDataKey)
                        if(indexOf>=0){
                            var columnName=key.substring(formDataKey.length)
                            var camelName=this.$mdp.toCamel(columnName) 
                            return "'"+formData[camelName]+"'" 
                        }else{
                            indexOf=key.indexOf(paramsKey)
                            if(indexOf>=0){
                                var columnName=key.substring(paramsKey.length)
                                var camelName=this.$mdp.toCamel(columnName) 
                                return "'"+this.params[camelName]+"'" 
                            }
                            return match
                        }
                        
                    } 
                });
                return result;
            }
        },
        execApi(api,formData,fcApi){
            if(this.disApi){
                return;
            }
            var func=api.method=='get'?axios.get:axios.post
            var paramsStr=api.paramsStr
            if(paramsStr){
                paramsStr=this.tplParse(paramsStr,formData)
            } 
            var params={}
            if(paramsStr){
                params=this.parseJson(paramsStr)
            } 
            Object.assign(params,api.params)
            var p=Object.assign({},formData,params)
            func(api.action,api.method=='get'?{params:p}:p).then(res=>{
                let {tips,data}=res
                if(tips){
                    if(tips.isOk){
                        this.$message({message:tips.msg,type:'success'})
                    }else{
                        this.$message({message:tips.msg,type:'error'})
                    }
                }else{
                    this.$message({message:"接口正常，返回结果："+JSON.stringify(res),type:'success'})
                }
            }).catch(e=>{  
                    this.$message({message:"接口异常，返回结果："+e.message,type:'error'}) 
            })
        },
    },
    components: {   
        FormCreate:formCreate.$form()
    },
    mounted() {    
        this.init()
    }
}

</script>

<style scoped>

</style>