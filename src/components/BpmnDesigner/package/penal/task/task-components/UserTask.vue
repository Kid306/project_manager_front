<template>
  <el-form label-width="100px">
    <el-form-item label="规则类型" prop="candidateStrategy"> 
      <mdp-select v-model="userTaskForm.candidateStrategy" itemCode="bpm_task_candidate_strategy" @change="changeCandidateStrategy"/>
    </el-form-item>
    <el-form-item
      v-if="userTaskForm.candidateStrategy == '10'"
      label="指定角色"
      prop="candidateParam"
    > 
      <mdp-select v-model="userTaskForm.candidateParam" :props="{id:'roleid',name:'rolename'}" :load-fun="$mdp.listRole" :multiple="true" 
        @change="updateElementTask" split=","/>
    </el-form-item>
    <el-form-item
      v-if="userTaskForm.candidateStrategy == '20' || userTaskForm.candidateStrategy == '21'"
      label="指定部门"
      prop="candidateParam"
      span="24"
    > 
      <mdp-select-dept v-model="userTaskForm.candidateParam" multiple 
        @change="updateElementTask"  split=","/>
    </el-form-item>
    <el-form-item
      v-if="userTaskForm.candidateStrategy == '22'"
      label="指定岗位"
      prop="candidateParam"
      span="24"
    > 
      <mdp-select v-model="userTaskForm.candidateParam" :props="{id:'id',name:'postName'}" :load-fun="$mdp.listPost" multiple 
        @change="updateElementTask"  split=","/>
    </el-form-item>
    <el-form-item
      v-if="userTaskForm.candidateStrategy == '30'"
      label="指定用户"
      prop="candidateParam"
      span="24"
    >
    <mdp-select-user v-model="userTaskForm.candidateParam" @change="updateElementTask" :multiple="true" split=","/>
      
    </el-form-item>      

    <el-form-item  label-width="0px"
      v-if="userTaskForm.candidateStrategy == '31'"
      label=""
      prop="candidateParam"
      span="24"
    > 
    <el-alert type="success">该任务由上一步提交人的部门领导审批</el-alert>
    </el-form-item>       

    <el-form-item  label-width="0px"
      v-if="userTaskForm.candidateStrategy == '32'"
      label=""
      prop="candidateParam"
      span="24"
    > 
    <el-alert type="success">该任务由流程发起人的部门领导审批</el-alert>
    </el-form-item>

    <el-form-item  label-width="0px"
      v-if="userTaskForm.candidateStrategy == '35'"
      label=""
      prop="candidateParam"
      span="24"
    > 
    <el-alert type="success">该任务将按发起人启动流程时设定的审批人策略执行</el-alert>
    </el-form-item>

    <el-form-item  label-width="0px"
      v-if="userTaskForm.candidateStrategy == '36'"
      label=""
      prop="candidateParam"
      span="24"
    > 
    <el-alert type="success">当前任务节点将由发起人进行处理；</el-alert>
    </el-form-item>

    <el-form-item  label-width="0px"
      v-if="userTaskForm.candidateStrategy == '37'"
      label=""
      prop="candidateParam"
      span="24"
    > 
    <el-alert type="success">当前任务节点将由流程主办进行处理；您可以在自定义属性中配置主办人</el-alert>
    </el-form-item>

    <el-form-item  label-width="0px"
      v-if="userTaskForm.candidateStrategy == '38'"
      label=""
      prop="candidateParam"
      span="24"
    > 
    <el-alert type="success">当前任务节点将由流程监控人进行处理；您可以在自定义属性里配置监控人</el-alert>
    </el-form-item>
    
    <el-form-item label-width="0px"
      v-if="userTaskForm.candidateStrategy == '39'"
      label=""
      prop="candidateParam"
      span="24"
    > 
    <el-alert type="success">当前任务节点将由上一步任务执行人手工选定人员</el-alert>
    </el-form-item> 

    <el-form-item
      v-if="userTaskForm.candidateStrategy == '40'"
      label="指定用户组"
      prop="candidateParam"
    > 
      <mdp-select-tag v-model="userTaskForm.candidateParam" 
        @change="updateElementTask" :multiple="true" split=","/>
    </el-form-item>
    <el-form-item
      v-if="userTaskForm.candidateStrategy == '41'"
      label="指定项目组，由项目经理审批"
      prop="candidateParam"
    > 
      <mdp-select-project v-model="userTaskForm.candidateParam" 
        @change="updateElementTask" :multiple="true" split=","/>
    </el-form-item>
    <el-form-item
      v-if="userTaskForm.candidateStrategy == '42'"
      label="指定项目组内组员审批"
      prop="candidateParam"
    > 
      <mdp-select-project-user v-model="userTaskForm.candidateParam" 
        @change="updateElementTask" :multiple="true" split=","/>
    </el-form-item>
    <el-form-item
      v-if="userTaskForm.candidateStrategy == '90'"
      label="查询条件"
      prop="candidateParam"
    > 
      <MdpHiQuery v-model="userTaskForm.candidateParam" :columnConfigs="columnConfigs"
        @change="updateElementTask"/>
    </el-form-item>
    <el-form-item
      v-if="userTaskForm.candidateStrategy == '60'"
      label="流程表达式"
      prop="candidateParam"
    >
      <el-input
        type="textarea"
        v-model="userTaskForm.candidateParam[0]"
        clearable
        style="width: 72%"
        @change="updateElementTask"
      />
      <el-button class="ml-5px" size="small" type="success" @click="openProcessExpressionDialog"
        >选择表达式</el-button
      >
      <!-- 选择弹窗 -->
      <MdpDialog ref="processExpressionDialogRef">
        <MdpSelect itemCode="wf_task_candidate_expression" @select="selectProcessExpression" />
        </MdpDialog>
    </el-form-item>
  </el-form>
</template>

<script lang="ts" setup>   

defineOptions({ name: 'UserTask' })
const props = defineProps({
  id: String,
  type: String
})
const userTaskForm = ref({
  candidateStrategy: undefined, // 分配规则
  candidateParam: '' // 分配选项
})
const bpmnElement = ref()
const bpmnInstances = () => (window as any)?.bpmnInstances
 

const resetTaskForm = () => {
  
  const attrs = bpmnElement.value.businessObject
  if (!attrs) {
    return
  } 
  if (attrs.candidateStrategy != undefined) {
    userTaskForm.value.candidateStrategy =  attrs.candidateStrategy as any
  } else {
    userTaskForm.value.candidateStrategy = undefined
  }
  if (attrs.candidateParam && attrs.candidateParam.length > 0) { 
      userTaskForm.value.candidateParam = attrs.candidateParam 
  } else {
    userTaskForm.value.candidateParam = ''
  }
}

/** 更新 candidateStrategy 字段时，需要清空 candidateParam，并触发 bpmn 图更新 */
const changeCandidateStrategy = () => {
  userTaskForm.value.candidateParam = ''
  updateElementTask()
}

/** 选中某个 options 时候，更新 bpmn 图  */
const updateElementTask = () => {
  bpmnInstances().modeling.updateProperties(toRaw(bpmnElement.value), {
    candidateStrategy: userTaskForm.value.candidateStrategy,
    candidateParam: userTaskForm.value.candidateParam
  })
}

// 打开监听器弹窗
const processExpressionDialogRef = ref()
const selectProcessExpression = (expression) => {
  userTaskForm.value.candidateParam = expression.expression
}
const columnConfigs = [
  {label:'用户名称',property:'username',colPrefix:'res.'},
  {label:'部门编号',property:'deptid',colPrefix:'dpu.'},
  {label:'用户编号',property:'userid',colPrefix:'res.'},
  {label:'岗位编号',property:'postId',colPrefix:'dpu.'},

]

watch(
  () => props.id,
  () => {
    bpmnElement.value = bpmnInstances().bpmnElement
    nextTick(() => {
      resetTaskForm()
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
