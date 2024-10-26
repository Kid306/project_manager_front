<template>
  <el-tabs v-model="activeName" tab-position="top">
    <el-tab-pane label="选择流程" name="1">
      <template #label>
        <Icon icon="ep:arrow-right" color="blue" /> &nbsp;&nbsp;
        <icon icon="fa:stack-overflow" />&nbsp;&nbsp;<el-tag type="warning" v-if="procdef">{{ procdef.version }}.{{ procdef.rev }}</el-tag>{{
          procdef ? '已选【' + procdef.name + '】' : '请选择流程'
        }}
      </template>
      <SelectProcdef @select="onProcdefSelect" sub-op-type="select" :biz-key="params?.bizKey||''"/>
    </el-tab-pane>
    <el-tab-pane label="标题与正文" name="2" v-if="procdef">
      <template #label>
        <Icon icon="ep:arrow-right" color="blue" /> &nbsp;&nbsp;
        <icon icon="ep:star-filled" size="24" /> &nbsp;&nbsp; 标题与正文
        <el-tooltip :content="mainExtAttrs?.wfTips || '自动读取正文第一行作为标题'"
          ><Icon icon="ep:info-filled" /></el-tooltip
        >
      </template>
      <div>
        <el-row>
          标题：<h1> {{ titleCpd }}</h1>
        </el-row>
        <Editor :height="400" v-model="params.mainContext" />
      </div>
    </el-tab-pane>
    <el-tab-pane label="表单信息" name="3" v-if="mainExtAttrs && mainExtAttrs.formKey">
      <template #label>
        <Icon icon="ep:arrow-right" color="blue" /> &nbsp;&nbsp;
        <Icon icon="ep:tickets" size="16" />&nbsp;&nbsp;表单信息
      </template>
      <AiForm
        v-if="mainExtAttrs?.formKey"
        :formDefId="mainExtAttrs?.formKey"
        :disApi="true"
        @submit="onFormSubmit"
      />
    </el-tab-pane>
    <el-tab-pane label="流程参数配置" name="4"  v-if="procdef">
      <template #label>
        <Icon icon="ep:arrow-right" color="blue" /> &nbsp;&nbsp;
        <Icon icon="ep:setting" />&nbsp;&nbsp;流程参数配置
      </template>
      <ProcExpand  ref="procinstExpand"/>
    </el-tab-pane>
    <el-tab-pane label="附件上传" name="5"  v-if="procdef">
      <template #label>
        <Icon icon="ep:arrow-right" color="blue" /> &nbsp;&nbsp;
        <Icon icon="ep:upload-filled" />&nbsp;&nbsp;附件上传
      </template>
      <MdpSelectAtt />
    </el-tab-pane>

    <el-tab-pane label="查看流程图" name="6"  v-if="procdef">
      <template #label>
        <Icon icon="ep:arrow-right" color="blue" />&nbsp;&nbsp;
        <icon icon="fa:image" />&nbsp;&nbsp;查看流程图
        <el-button type="warning" plain size="small" text @click.stop="toBpmnDesigner()"
          >设计流程</el-button
        >
      </template>

      <bpmn-viewer v-if="bpmnXml && activeName == '6'" :bpmnXml="bpmnXml" />
    </el-tab-pane>
  </el-tabs>
  <el-row class="footer"> <el-button @click="doStartProc" type="primary"  v-if="procdef" :disabled="load.startProc">提交审核</el-button></el-row>
</template>

<script> 
import util from '@/components/mdp-ui/js/util' //全局公共库import
import config from '@/api/mdp_pub/mdp_config' //全局公共库import
import SelectProcdef from '../Index.vue'
import BpmnViewer from '../../model/BpmnViewer.vue'
import { mapState } from 'pinia'
import { useUserStore } from '@/store/modules/user'
import ProcExpand from './components/ProcExpand.vue'
import { Editor } from '@/components/Editor'
import { startProc, startPre } from '@/api/mdp/workflow/ru/execution' 
import AiForm from './components/AiForm.vue'

export default {
  name: 'StartFlow',
  computed: {
    ...mapState(useUserStore, ['userInfo', 'myDepts']),

    titleCpd() { 
      
      if(this.startParams?.mainTitle){
        return this.startParams.mainTitle
      }
      if (!this.params.mainContext) {
        return this.params.mainTitle
      }
      let str = this.getFirstLineOfRichText(this.params.mainContext)
      str = str.replace(/<[^>]*>/g, '')
      return str
    }
  },
  props:{
    /**
     * 外部传入的流程参数，原样覆盖到params中
        mainTitle: '', //主标题，为空则由mainContext的首行提取
        mainContext: '',//流程正文，文本内容
        bizUrl: '', //前端跳转  //自带参数，建议只带主键
        bizKey: '', //用于启动流程第一部，过滤指定业务大类的流程模型。选中流程模型并原样输出到restUrl
        restUrl: '', //该参数告诉后端引擎需要将流程数据同步到指定地址，后端接口同步
        formId: '', //form 表单编号,对应引擎的formKey，自定义表单中的表单编号
        bizId: '', //业务主键
        bizPid: '', //如果是多级主键，指上级的主键，默认与bizId相同
        flowVars: { //需要提交给流程引擎的变量，外部的变量是不提交给引擎的
          data:{// data节点一般用来存储表单数据、主题业务数据等，根随流程引擎流转，调restUrl接口时，会一并推送到对方接口

						}
        }
     */
    startParams:{
      type: Object,
      default:()=>{
        return {}
      }
    }
  },
  components: {
    SelectProcdef,
    BpmnViewer,
    ProcExpand,
    Editor,
    AiForm
  },
  watch: {},
  data() {
    return {
      load:{startProc:false},
      procdef: null,
      activeName: '1',
      bpmnXml: null,

      params: {
        //params可能是外部传入，或者内部初始化而来
        procDefId: '', //客户选择的启动流程
        mainTitle: '', //主标题，由mainContext的首行提取
        mainContext: '',
        bizUrl: '', //前端跳转  //自带参数，建议只带主键
        bizKey: '', //用于选中流程模型并原样输出到restUrl
        restUrl: '', //后端接口同步
        formId: '', //form 表单编号,对应引擎的formKey
        bizId: '', //业务主键
        bizPid: '', //如果是多级主键，指上级的主键，默认与bizId相同
        flowVars: {//需要提交给流程引擎的变量，外部的变量是不提交给引擎的
          data:{// data节点一般用来存储表单数据、主题业务数据等，根随流程引擎流转，调restUrl接口时，会一并推送到对方接口

          }

        } 
      },
      /**
       * 流程启动时，需要下放流程的参数给前端，用于做页面展示或者控制
       * @param procDefId
       * @return
       * {
       *     strategy:  字符串，候选人分配策略
       *     mainExtAttrs: {name:value} ,map类型，流程属性配置
       *     data: ProcessDefinition, 流程定义信息
       * }
       */
      strategy: '',
      mainExtAttrs: null,
      formDef: null //自定义表单
    }
  }, 
  mounted() {
    this.initData()
    this.doStartPre()
  },
  methods: {
    initData(){
      Object.assign(this.params,this.startParams)
    },
    toBpmnDesigner() {
      if (!this.procdef || !this.procdef.key) {
        this.$message.error('请先选择流程图')
      }
      this.$router.push({ name: 'WfDesigner', query: { modelKey: this.procdef.key } })
    }, 
    onProcdefSelect(procdef) {
      
      if (procdef.suspensionState != '1') {
        this.$message.error('流程状态必须为激活状态')
        return
      }
      this.procdef = procdef
      this.activeName = '2'

      this.doStartPre()
    },
    getFirstLineOfRichText(richText) {
      // 正则表达式匹配到第一个段落标签的结束或者第一个换行符
      const regex = /<p[^>]*>([\s\S]*?)(?=\n|<\/p>)/i
      const match = richText.match(regex)
      return match ? match[0] : ''
    },
    async doStartProc() {
      if(!this.procdef){
        this.$message.error("请先选择流程图")
        return;
      } 
      var procinstExpand=this.$refs['procinstExpand'].procinstExpand 
      var params = { ...this.params, procDefId: this.procdef.id, mainTitle: this.titleCpd, ...procinstExpand }
      this.load.startProc=true
      let { tips, data } = await startProc(params)
      this.load.startProc=false
      this.$message({ message: tips.msg, type: tips.isOk ? 'success' : 'error' })
      if (tips.isOk) {
        this.$router.push({ name: 'ExecutionListMyStart' })
      }
    },
    async onFormSubmit(formData, fcApi) {
      
      var params = {
        ...this.params,
        procDefId: this.procdef.id,
        formData: formData,
        formId: this.mainExtAttrs.formKey,
        mainTitle: this.titleCpd
      }
      let { tips, data } = await startProc(params)
      this.$message({ message: tips.msg, type: tips.isOk ? 'success' : 'error' })
      if (tips.isOk) {
        this.$router.push({ name: 'ExecutionListMyStart' })
      }
    },
    doStartPre() { 
      if(!this.procdef || !this.procdef.id){
        this.$message.warning("请先选择流程图")
        return;
      } 
      this.params.mainTitle=this.procdef.name
      startPre({ procDefId: this.procdef.id }).then((res) => {
        let { tips, data, mainExtAttrs, strategy,bpmnXml } = res
        if (tips.isOk) { 
          this.mainExtAttrs = mainExtAttrs || {}
          this.strategy = strategy
          this.bpmnXml=bpmnXml
          this.$emit('startPre', res)
        } else {
          this.$message.error(tips.msg)
        }
      })
    }
  }
}
</script>

<style scoped></style>
