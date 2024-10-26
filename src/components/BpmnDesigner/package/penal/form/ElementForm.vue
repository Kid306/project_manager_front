<template>
  <div class="panel-tab__content">
    <el-form label-width="80px"> 
      <el-form-item label="流程表单">
          <MdpSelectTable :load-fun="$mdp.listFormDef" v-model="formCfg.formKey"  :columnCfgs="[{property:'id',label:'表单编号'},{property:'formName',label:'表单名称'}]" @change2="onFormSelect">
            <template #toolbarExt><el-button type="warning" icon="menu" @click="toFormDesigner()">去设计</el-button>
            </template>
            </MdpSelectTable>
      </el-form-item> 
      <el-form-item label="权限配置">
        <el-button @click="$refs['dialog'].open()">表单权限配置</el-button> 
      </el-form-item>  
      
      <el-alert type="success">每个节点可以单独设立表单，默认继承流程全局表单</el-alert>
    </el-form> 
    <MdpDialog ref="dialog" >
        <el-table :data="formAllFields">
          <el-table-column type="index"/>
          <el-table-column label="属性名称" prop="title" width="150px"/>
          <el-table-column label="可查看" prop="show">
            <template #header>
              <div class="titleCenter"><el-checkbox v-model="formCfg.allShow" @change="onAllCheck('show',$event)"/> &nbsp;&nbsp;可查看 </div>
            </template>
            <template #default="{row}">
              <el-checkbox v-model="row.show" />
            </template>
          </el-table-column>
          
          <el-table-column label="可编辑" prop="edit">
            <template #header>
              <div class="titleCenter"><el-checkbox v-model="formCfg.allEdit" @change="onAllCheck('edit',$event)"/><span>&nbsp;&nbsp;可编辑</span> </div>
            </template>
            <template #default="{row}">
              <el-checkbox v-model="row.edit"/>
            </template>
          </el-table-column>
          
          <el-table-column label="必填" prop="required"> 
            <template #header>
              <div class="titleCenter"> <el-checkbox v-model="formCfg.allRequired" @change="onAllCheck('required',$event)"/><span>&nbsp;&nbsp;必填</span> </div>
            </template>
            <template #default="{row}">
              <el-checkbox v-model="row.required"/>
            </template>
          </el-table-column>
          
          <el-table-column label="摘要">
            <template #header>
              <div class="titleCenter"><el-checkbox v-model="formCfg.allAbs" @change="onAllCheck('abs',$event)"/><span>&nbsp;&nbsp;摘要</span> </div>
            </template>
            <template #default="{row}">
              <el-checkbox v-model="row.abs"/>
            </template>
          </el-table-column>
        </el-table>
        <el-row class="footer"><el-button @click="confirm">确定</el-button></el-row>
    </MdpDialog>
  </div>
</template>

<script lang="ts" setup> 
import { getCurrentInstance } from "vue"
const {proxy} = getCurrentInstance()  
const {push} = useRouter()
interface FormCfg {
  bizKey?: string /**暂时不知何用 */
  formKey?: string /**表单编号 */
  formQx?:string /**表单权限表 field1,show,edit,required,abs|field2,show,edit,required,abs 类似这种，举例 field1,1,1,0,1|field2,0,1,0,0*/
}

defineOptions({ name: 'ElementForm' })

const props = defineProps({
  id: String,
  type: String
})
 
const toFormDesigner = () =>{
  push({name:'AiFormDesigner'})
}
const formAllFields= ref<any[]>([])
const bpmnElement = ref()
 
const formCfg = ref<FormCfg>({formKey:'',formQx:''})   

const bpmnInstances = () => (window as any)?.bpmnInstances
const resetFormList = () => {
  bpmnElement.value = bpmnInstances().bpmnElement
  let businessObject=bpmnElement.value.businessObject
  if(businessObject){
    
    let formKey=''
    if(businessObject.$type=='bpmn:Process'){
      formKey=bpmnElement.value.businessObject.$attrs.formKey 
    }else{
      formKey=bpmnElement.value.businessObject.formKey 
    }
    if(formKey){
      
      formCfg.value.formKey = formKey 
      formCfg.value.formQx=bpmnElement.value.businessObject.$attrs.formQx  
      
      proxy.$mdp.getFormDefById({id:formCfg.value.formKey}).then(res=>{
        let {tips,data} = res
        //message.showTips(tips)
        if(tips.isOk){
          let rules = JSON.parse(data.rules||"[]") /** {field:k.field,title:k.title,required:k.required}} */
           initFormAllFields(rules)
          formAllFields.value=rules
        }
      })
    }
  }
} 
  const onAllCheck = (allField,check) => {
    formAllFields.value.forEach(k=>k[allField]=check)
  }
 const initFormAllFields = (af) => {
  if(!formCfg.value.formQx){
    af.forEach(field=>{
      field.show=true
      field.edit=true
      field.abs=true
      field.required=field.required?field.required:true
    })
  }else{
    var formQxArr=formCfg.value.formQx?formCfg.value.formQx.split("|"):[]
    var formQxMap=new Map()
    formQxArr.forEach(field=>{
      let fieldQx=field.split(',')
      formQxMap.set(fieldQx[0],fieldQx)
    })
    af.forEach(field=>{
      if(formQxMap.has(field.field)){
        var fieldQx=formQxMap.get(field.field)
        if(fieldQx.length>4){
          field.show=fieldQx[1]=='1'
          field.edit=fieldQx[2]=='1'
          field.abs=fieldQx[3]=='1'
          field.required=fieldQx[4]=='1'
        }else{
          field.show=true
          field.edit=true
          field.abs=true
          field.required=field.required?field.required:true
        }
      }
    })
  }
  
 }
 const fieldToQx = (field) => { 
  var show=field.show?"1":"0"
  var edit=field.edit?"1":"0"
  var abs=field.abs?"1":"0"
  var req=field.req?"1":"0"
  return `${field.field},${show},${edit},${req},${abs}`
 }
 const dialog = ref()
  const confirm = () => {  
    updateElementExtensions() 
    dialog.value.close()
  }
const updateElementExtensions = () => {  
  
  const formQx=formAllFields.value?formAllFields.value.map(field=>fieldToQx(field)).join("|"):''
  bpmnElement.value = bpmnInstances().bpmnElement
  // 更新到元素上
  bpmnInstances().modeling.updateProperties(toRaw(bpmnElement.value) ,{
    formKey:formCfg.value.formKey,
    formQx: formQx, 
  })
}
const onFormSelect = (formDef) => {
  if(!formDef){
    formCfg.value.formQx=''
    formCfg.value.formKey='' 
    updateElementExtensions()
    return
  }
  let rules = JSON.parse(formDef.rules||"[]")
  formCfg.value.formQx=''
  formCfg.value.formKey=formDef.id 
  initFormAllFields(rules) 
  formAllFields.value=rules 
  updateElementExtensions()
}

onMounted(async () => {
  //formList.value = await FormApi.getFormSimpleList()
})
 
watch(
  () => props.id,
  () => {
    bpmnElement.value = bpmnInstances().bpmnElement
    nextTick(() => {
      resetFormList()
    })
  },
  { immediate: true }
)

onMounted(async () => { 
})

onBeforeUnmount(() => {
  bpmnElement.value = null
})
</script>
<style  scoped>
  .titleCenter{
    display: flex;  align-items: center;
  }
</style>
