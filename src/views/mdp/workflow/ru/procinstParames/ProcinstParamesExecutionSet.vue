<template>  
  <ContentWrap :hideFooter="false">
    <template #header>
      <el-space wrap> 

        <el-button  @click="handlePrint" icon="printer">打印
        </el-button>
        <el-button  v-if="isArchive" @click="handleArchive"><Icon icon="fa:copy"/>&nbsp;&nbsp;归档</el-button>
        <el-button  @click="showDiagram()"><Icon icon="fa:stack-overflow"/>&nbsp;&nbsp;流程图</el-button>
        <el-button  @click="showNodeInfoDialog()"><Icon icon="fa-solid:user-check"/>&nbsp;&nbsp;审批人</el-button>
        <el-button  @click="showComment=!showComment"
            icon="document">{{ showComment == false ? "显示流转信息" : "隐藏流转信息" }}
        </el-button>
        <el-button
            @click="showMainContext=!showMainContext" icon="document" >
          {{ showMainContext == false ? "显示正文" : "隐藏正文" }}
        </el-button>
        <el-button
            @click="showMainContextOnly=!showMainContextOnly" icon="finished">
          {{ showMainContextOnly == false ? "只看正文" : "显示全部" }}
        </el-button>

        <el-button  @click="$refs['attTplDialog'].open({})" icon="document-copy">附件模板
        </el-button>

        <el-button  @click="$refs['attDialog'].open({})" icon="document-copy">流程附件
        </el-button>
        
      </el-space> 
    </template>

    <!--新增界面 ProcinstParames 流程实例参数设置表-->
    <el-form :model="addForm" label-width="120px" :rules="addFormRules" ref="addForm" :inline="false"> 
        <el-form-item label="流程标题"  v-if="showMainContextOnly==false">
          <div>{{ addForm.mainTitle }}</div> 
        </el-form-item>
        <el-form-item label="发起人员"  v-if="showMainContextOnly==false">  
          由&nbsp; <span class="name-font" v-if="addForm.startDeptName">{{ addForm.startDeptName }} - </span>  <span class="name-font">{{ addForm.startUsername }}</span>
          于&nbsp;<span class="name-font">{{ addForm.startDate }}</span> &nbsp;发起
           
        </el-form-item>
        <el-form-item label="流程标签"  v-if="showMainContextOnly==false">  
          <MdpSelectTag showStyle="tag" v-model="addForm.tagIds" :initName="addForm.tagName" split="," multiple :onChange2="onTagChange" displayLoad/>
           
        </el-form-item>
        <el-form-item label="流程正文" v-if="showMainContext||showMainContextOnly">
          <div v-html="addForm.mainContext"></div>  
        </el-form-item>
        <el-form-item label="流转记录" v-if="showComment && showMainContextOnly==false">
          <comment-step
              v-if="procInstId" ref="commentStepRef" :task="taskInfo"
              :procInstId="procInstId" @get-comments="getComments"/>  
        </el-form-item>
        <el-form-item label="主办监控" v-if="showMainContextOnly==false" >
          <el-space>
                主办&nbsp;&nbsp;
              <mdp-select-user relative   showStyle="tag"
                  placeholder="主办人" v-model="addForm.sponsors" :multiple="true"  @change2="(v)=>onSmChange(v,'sponsors')" displayLoad
                  split="," title="主办人"/>
              &nbsp;&nbsp;监控&nbsp;&nbsp;
              <mdp-select-user relative    showStyle="tag"
                  placeholder="监控人" v-model="addForm.monitors" :multiple="true" @change2="(v)=>onSmChange(v,'monitors')" displayLoad
                  split="," title="监控人"/>
              </el-space>
        </el-form-item>
        <el-form-item label="预计时间"  v-if="showMainContextOnly==false">
          <el-space>
          预计于 <mdp-date relative width="120px"
              v-model="addForm.planFinishTime" showStyle="tag"
              type="date" value-format="YYYY-MM-DD HH:mm:ss" 
              placeholder="选择计划完成日期" @change="updateFlowPlanFinishTime"/>
           完成  
        </el-space>
        </el-form-item>
        <div v-if="task.taskId && showMainContextOnly==false">
          <el-form-item :label="'办理意见'" prop="reason"> 
              <el-select v-model="task.action" placeholder="请选择办理意见" style="width:100%;">
                <div v-if="task.action!='claim'">
                  <el-option
                      v-show="taskInfo && taskInfo.delegation!='PENDING'" label="同意"
                      value="agree"/>
                  <el-option
                      v-show="taskInfo && taskInfo.delegation!='PENDING'" label="不同意，但流程继续"
                      value="disAgree"/>
                      
                  <el-option label="拒绝,流程将终止" value="reject"/>
                  <el-option label="驳回" value="rollback"/>
                  <el-option label="转主办" value="sponsors"/>
                  <el-option label="转发起人" value="transferToStartUser"/>
                  <el-option
                      v-show="taskInfo && taskInfo.delegation!='RESOLVED'"
                      label="转办" value="transfer"/>
                  <el-option label="委办,他人提交后任务回到委托人处" value="delegate"/>
                  <el-option
                      v-show="taskInfo && taskInfo.delegation!='RESOLVED' && taskInfo.delegation=='PENDING'"
                      label="返回给原执行人" value="resolve"/>
                      
                  <el-option label="加签，支持前加签、后加签" value="addSign"/> 
                  <el-option label="减签" value="subSign"/>
                </div>
                <div v-else>
                  <el-radio label="claim">领取任务</el-radio>
                </div>
              </el-select>   
          </el-form-item>
          <el-form-item  v-if="showMainContextOnly==false">  
              <el-input type="textarea" :rows="3" v-model="task.reason"
                  auto-complete="off"/> 
          </el-form-item>

          <!-- 加签-->
          
          <el-form-item  v-if="showMainContextOnly==false" label="加签方式" v-show="task.action=='addSign'">  
              <MdpSelect v-model="task.signType" itemCode="wfSignType"/>
          </el-form-item>

          <el-form-item  v-if="showMainContextOnly==false"
              v-show="task.action=='rollback'" label="驳回节点"
              prop="targetActKey">
            <el-col :span="10"> 
              <mdp-select
                  style="width:100%"   :options="comments.filter(k=>k.taskId)" :props="{id:'taskDefKey',name:'name'}" @clear="rollbackSelectChange()"
                  @change2="rollbackSelectChange" placeholder="请选择">
                  <template #options="{options}">
                    <el-option v-for="(option,index) in options" :key="index" :modelValue="option['id']" :label="option['name']" @click="rollbackSelectChange(option)"> 

                      <span style="float: left">{{ option.name }}</span>
                      <span style="float: right; color: #8492a6; font-size: 13px">{{
                          option.username
                        }}-{{ option.message }}</span>
                    </el-option> 
                  </template> 
              </mdp-select>
            </el-col>
          </el-form-item>
          <el-form-item  v-if="showMainContextOnly==false"
              v-show="task.action=='addSign' ||needAssignee=='need-single-assignee'|| needAssignee=='need-multiple-assignee'||(actAssignee&&actAssignee.showNextAssignees=='1')"
              :label="nextAssigneesLabel" prop="nextAssignees"> 
              <mdp-select-user style="width:100%;"
                  :multiple="true" @change2=" nextAssigneesSelectChange " @clear="()=>{task.nextAssignees=[];nextAssigneesName=[]}"/> 
          </el-form-item>
          <el-form-item  v-if="showMainContextOnly==false"
              v-show="task.action=='transfer'||task.action=='delegate'||(actAssignee&&actAssignee.showNextAssignees=='2')"
              :label="nextAssigneesLabel" prop="assignee"> 
              <mdp-select-user style="width:100%;" @clear="()=>task.assignee=''"
                  :multiple="false" @change2=" assigneesSelectChange"/> 
          </el-form-item>
        </div> 
      </el-form> 

    <template #footer >
      
      <el-row class="footer">
      <el-button @click="handleCancel" icon="close">关闭</el-button>
      <el-button v-if="screenWidth>=500" @click="handlePrint" icon="printer">打印</el-button>
      <el-button v-if="isArchive" @click="handleArchive"><Icon icon="fa:copy"/>归档</el-button>
      <el-button v-if="task.taskId" @click="addComment" :loading="addLoading" icon="finished">
        只存办理意见
      </el-button>
      <el-button
          v-if="task.action!='claim' && task.taskId" type="primary" @click="completeHandle"
          :loading="addLoading" icon="finished">提交任务
      </el-button>
      <el-button
          v-if="task.action=='claim' && task.taskId" @click="completeHandle"
          :loading="addLoading" icon="finished">领取任务
      </el-button>
      <el-button
          v-if="task.action=='claim' && task.taskId  && task.sponsors && task.sponsors.indexOf(userInfo.userid)>=0"
          @click="showTaskCandidateSet" :loading="addLoading" icon="s-check">添加候选人
      </el-button>

      </el-row> 
    </template>
  </ContentWrap> 
        <mdp-dialog
            ref="nodeInfosSetDialog"
            title="查看审批人"
            width="70%">
          <template #default="{visible:visibleInfos,data:dataInfos}">
            <procinst-node-info-set
                :node-infos="dataInfos.nodeInfos" :visible="visibleInfos"
                @cancel="dialog.close();"
                @confirm="onNodeInfosConfirm"/>

          </template>
        </mdp-dialog> 
    

    <mdp-dialog ref="diagramDialog">
      <template #default="{visible:visibleDiagram,data:dataDiagram}">
        <el-image v-if="visibleDiagram" :fit="'contain'" :src="dataDiagram.diagramUrl">
          <div ref="error" class="image-slot">
            <Icon icon="ep:picture-filled"/>
          </div>
          <div ref="placeholder" class="image-slot">
            正在全力加载中。。。。。。。。。。
            <i class="loading"></i>
          </div>
        </el-image>
      </template>
    </mdp-dialog>
    <mdp-dialog ref="attTplDialog" width="85%" title="附件模板">
      <template #default="{}">
        <mdp-select-att
            sub-op-type="mng" crely-type="procDefId"
            :crely-id="addForm.procDefId"/>
      </template>
    </mdp-dialog>
    <mdp-dialog ref="attDialog" width="85%" title="流程附件">
      <template #default="{}">
        <mdp-select-att
            sub-op-type="mng" crely-type="procDefId" :crely-id="addForm.procDefId"
            crely-stype="procInstId" :crely-sid="addForm.procInstId"/>
      </template>
    </mdp-dialog> 
</template>

<script>
import {sn} from '@/components/mdp-ui/js/sequence';//全局公共库
import util from '@/components/mdp-ui/js/util';//全局公共库import
import config from '@/api/mdp_pub/mdp_config';//全局公共库import
import {listProcinstParames, editPlanFinishTime} from '@/api/mdp/workflow/ru/procinstExpand';
import {completeTask, addComment,listCandDelSign} from '@/api/mdp/workflow/ru/task'; 
import CommentStep from "@/views/mdp/workflow/hi/comment/commentStep.vue";//评论
import html2canvas from "html2canvas"
import {getNodeInfos, updateNodeInfos} from '@/api/mdp/workflow/ru/procinstNodeInfo';
import {mapState} from 'pinia'
import {useUserStore} from '@/store/modules/user' 
import ProcinstNodeInfoSet from "@/views/mdp/workflow/ru/procinstParames/ProcinstNodeInfoSet.vue";
import {editSm,editSomeFieldsProcinstExpand} from '@/api/mdp/workflow/ru/procinstExpand'

import moment from "moment";

export default {
  name: 'ProcinstParamesExecutionSet',
  components: {
    //在下面添加其它组件 'procinst-parames-edit':ProcinstParamesEdit 
    'comment-step': CommentStep, ProcinstNodeInfoSet
  },
  props: {
    procDefId: {
      type: String,
      default: () => ("")
    },
    procInstId: {
      type: Object,
      default: () => ({})
    },
    taskInfo: {
      type: Object,
      default: () => ({})
    },
    visible: {
      type: Boolean,
      default: () => false
    },
    isArchive: {
      type: Object,
      default: () => ({})
    }
  },
  data() {
    var validateNextAssignees = (rule, value, callback) => { 
      if (this.needAssignee == 'need-multiple-assignee' && this.task.nextAssignees.length < this.needAssigneeNum) {//need-multiple-assignee 需要一个或者多个 need-single-assignee 只需要一个
        callback(new Error(this.needAssigneeMsg)); 
        return;
      }else if (this.needAssignee == 'need-single-assignee') {
        if (!this.task.nextAssignees || this.task.nextAssignees.length<=0) {
          callback(new Error(this.needAssigneeMsg)); 
          return;
        }  
      } else if(this.task.action=='addSign'){
        if (!this.task.nextAssignees || this.task.nextAssignees.length<=0) {
          callback(new Error("请选择1个或者多个加签处理人"));
          return;
        }  
      }
      callback();
    };
    
    var validateAssignee = (rule, value, callback) => { 
     if (this.task.action == 'transfer') {
        if (!this.task.assignee) {
          callback(new Error('请选择一个代办人'));
          return;
        } 
      } else if (this.task.action == 'delegate') {
        if (!this.task.assignee) {
          callback(new Error('请选择一个协办人'));
          return;
        } 
      }
      callback();
    };
    var validateAction = (rule, value, callback) => {
      var userid = this.userInfo.userid;
      var taskId = this.taskInfo.taskId;
      var assignee = this.taskInfo.assignee;
      var action = this.task.action;
      if (taskId == null || taskId == '') {
        callback(new Error('该任务已经完成或者过时，不能进行任何提交操作'))
      } else if ((assignee == null || assignee == '') && action != 'claim') {
        callback(new Error('该任务属于候选任务，需要候选人先领取'))
      } else if (action == 'agree' || action == 'disAgree' || action == 'rollback') {
        if (assignee == null || assignee == '') {
          callback(new Error('该任务未指派给任何人,您不能进行【同意/不同意/拒绝/驳回】 操作'))
        }
        if (assignee != userid) {
          callback(new Error('该任务属于【' + this.taskInfo.assigneeName + '】,您不能进行【同意/不同意/拒绝/驳回】 操作'));
        }
      } else if (action == 'transfer') {
        if (userid != assignee && !this.sponsors.some(i => i.userid == userid)) {
          callback(new Error('任务执行人【' + this.taskInfo.assigneeName + '】及主办才可以指派给他人代办'));
        }
      } else if (action == 'claim') {
        if (assignee != null && assignee != '') {
          callback(new Error('该任务已经由' + assigneeName + '领取，您不能再领取'));
        }
      } else if (action == 'delegate') {
        if (this.taskInfo.delegation == 'PENDING') {
          callback(new Error('该任务已属于协办任务，不能再进行协办操作'));
        }
        if (assignee != userid && !this.sponsors.some(i => i.userid == userid)) {
          callback(new Error('只有执行人及主办可以委托他人办理'));
        }
      } else if (action == 'resolve') {
        if (this.taskInfo.delegation != 'PENDING') {
          callback(new Error('该任务不属于协办任务，不能完成此操作'));
        }
        if (assignee != userid && !this.sponsors.some(i => i.userid == userid)) {
          callback(new Error('只有执行人及主办可以进行该操作'));
        }
      } else if (action == 'over') {
        if (assignee != this.taskInfo.userid && !this.sponsors.some(i => i.userid == userid)) {
          callback(new Error('只有发起人及主办可以将流程强制结束'));
        }
      }
      callback();
    };
    var validateTargetActKey = (rule, value, callback) => {
      if (this.task.action == 'rollback') {
        if ((this.task.targetActKey== '' || this.task.targetActKey == null)) {
          callback(new Error('请选择要驳回的目标节点'));
        }
      }
      callback();
    };

    var validatePlanFinishTime = (rule, value, callback) => {
      if (this.taskInfo.planFinishTime != value) {
        if (!this.sponsors.some(i => i.userid == this.userInfo.userid) && this.taskInfo.startUserId!=this.userInfo.userid) {
          callback(new Error('只有主办、发起人可以更改'));
        }
      }
      //callback();

      callback();
    };

    return {
      options: {},//下拉选择框的所有静态数据 
      addLoading: false,
      listLoading: false,
      addFormRules: {
        id: [
          //{ required: true, message: '主键', trigger: 'blur' }
        ],
        nextAssignees: [
          {validator: validateNextAssignees, trigger: 'change'}
        ],
        targetActKey: [
          {validator: validateTargetActKey, trigger: 'change'}
        ],
        action: [
          {validator: validateAction, trigger: 'change'}
        ],
        planFinishTime: [
          {validator: validatePlanFinishTime, trigger: 'change'}
        ],
        assignee: [
          {validator: validateAssignee, trigger: 'change'}
        ]


      },
      comments: [],//评论
      userSelectVisible: false,
      //新增界面数据 流程实例参数设置表
      addForm: {
        id: sn(),
        isRefForm: '',
        monitors: '',
        sponsors: '',
        procInstId: '',
        planFinishTime: '',
        formId: '',
        formShowType: '',
        procDefId: '',
        userid: '',
        startDate: '',
        isTemplate: '',
        mainContext: '',
        mainTitle: '',
        deptid: '',
        categoryId: '',
        lastTaskId: '',
        lastComment: '',
        lastTaskDefId: '',
        flowState: '',
        lastUserid: ''
      },
      defaultAddForm: {
        id: sn(),
        isRefForm: '',
        monitors: '',
        sponsors: '',
        procInstId: '',
        formId: '',
        formShowType: '',
        procDefId: '',
        userid: '',
        startDate: '',
        isTemplate: '',
        mainContext: '',
        mainTitle: '',
        deptid: '',
        categoryId: '',
        lastTaskId: '',
        lastComment: '',
        lastTaskDefId: '',
        flowState: '',
        lastUserid: ''
      }, 
      sponsors: [],//
      monitors: [],//
      //上传服务器的任务参数
      task: {
        taskId: '',//当前任务节点
        reason: '同意',
        assignee: '',// 转办、委办处理人
        action: 'complete',
        nextAssignees: [], //会签、加签、等
        targetActKey:'',//驳回操作需要选定驳回的流程节点编码
        signType:'before',//before-前加签、after-后加签
        formData:null,  // 表单数据，
        formId: '',     // 表单编号
      },
      /**从父组件传过来的任务信息
       taskInfo:{id:'',rev:'',executionId:'',procInstId:'',procDefId:'',name:'',parentTaskId:'',description:'',taskDefKey:'',owner:'',assignee:'',delegation:'',priority:'',createTime:'',dueDate:'',category:'',suspensionState:'',tenantId:'',formKey:'',claimTime:'',
       mainTitle:'',sponsors:'',userid:'',deptid:''
       }
       **/
      needAssignee: '',//need-multiple-assignee 需要一个或者多个 need-single-assignee 只需要一个
      needAssigneeMsg: '',
      needAssigneeNum: 0,//需要多少个会签人员
      modelFilesVisible: false,
      actAssignee: null,
      qxCode: '',
      showAttachment: false,
      showComment: true,
      showMainContext: true,
      showMainContextOnly: false,
      nodeInfos: [],
      nodeInfoVisible: false,
      formDataChangeLogs: [],
      nextAssigneesName:[],
      assigneeName:'',
      dataBak:{},
      /**end 在上面加自定义属性**/
    }//end return
  },
  computed: {
    ...mapState(useUserStore, [
      'userInfo'
    ]),
    screenWidth: function () {
      return screen.width;
    },
    disabledSm:function(){
      var all=`${this.taskInfo.startUserId},${this.taskInfo.startUserid},${this.taskInfo.sponsors},${this.taskInfo.monitors}`
      if(all.indexOf(this.userInfo.userid)){
        return false
      }else{
        return true
      }
    },
    nextAssigneesLabel: function () {
      let action = this.task.action;
      if (action == 'disAgree') {
        return "下一步办理人"
      } else if (action == 'agree') {
        return "下一步办理人"
      } else if (action == 'transfer') {
        return "代办人"
      } else if (action == 'delegate') {
        return "协办人"
      }else if (action == 'addSign') {
        return "加签处理人"
      } 
      return "下一步办理人"
    }
  },//end method
  watch: {
    'procInstId': function (procInstId) {

    },
    'taskInfo': function (taskInfo) {
      this.$nextTick(() => {
        this.comments = []
      })
      taskInfo.taskName=taskInfo.taskName||taskInfo.name // 流程监控那边过来的是叫 taskName

      this.task.taskId = taskInfo.taskId
      this.task.nextAssignees = [];
      this.nextAssigneesName=[]
      this.assigneeName=''
      this.needAssignee = '';
      this.needAssigneeNum = -1;
      this.task.targetActKey = '' 
      this.addForm.formId = this.taskInfo.formId;
      this.addForm.isRefForm = this.taskInfo.isRefForm;
      this.addForm.monitors = this.taskInfo.monitors;
      this.addForm.sponsors = this.taskInfo.sponsors;
      this.addForm.mainTitle = this.taskInfo.mainTitle;
      this.addForm.tagIds = this.taskInfo.tagIds;
      this.addForm.tagNames = this.taskInfo.tagNames;
      this.addForm.mainQx = this.taskInfo.mainQx;
      this.qxCode = this.addForm.mainQx 
      if (this.taskInfo.assignee == null || this.taskInfo.assignee == '') {
        this.task.action = 'claim'
      } else if (taskInfo.delegation != 'PENDING') {
        this.task.action = 'agree'
      } else if (taskInfo.delegation != 'RESOLVED' && taskInfo.delegation == 'PENDING') {
        this.task.action = 'resolve';
      }
      this.dataBak={...this.addForm}

    },
    'task.action': function (action) {
      this.needAssignee = ""
      this.task.nextAssignees = []
      this.task.targetActKey = ''
      this.tranActionComments(this.task.nextAssignees);
      this.$refs.addForm.validateField('action');

    },

    'task.nextAssignees': function (nextAssignees) {
      this.tranActionComments(nextAssignees);
    },
    'visible': function (visible) {
      if (visible == false) {
        return;
      }
      var date = new Date()
      this.modelFilesVisible = false;
      this.needAssignee = ""
      this.task.nextAssignees = []
      this.task.targetActKey = ''
      this.$nextTick(() => {
        this.getProcinstParamess();
      });
    }
  },
  mounted() {  
    if (this.taskInfo) { 
      this.task.taskId = this.taskInfo.taskId 
      this.task.nextAssignees = [];
      this.task.assignee = ''  
      this.needAssignee = '';
      this.assigneeName=''
      this.task.targetActKey = '' 
      this.addForm.formId = this.taskInfo.formId; 
      this.addForm.monitors = this.taskInfo.monitors;
      this.addForm.sponsors = this.taskInfo.sponsors; 
      this.addForm.mainTitle = this.taskInfo.mainTitle ? this.taskInfo.mainTitle : []; 
      this.addForm.tagIds = this.taskInfo.tagIds;
      this.addForm.tagNames = this.taskInfo.tagNames;
      this.addForm.mainQx = this.taskInfo.mainQx;
      this.qxCode = this.addForm.mainQx 

      if (this.taskInfo.assignee == null || this.taskInfo.assignee == '') {
        this.task.action = 'claim'
      } else if (this.taskInfo.delegation != 'PENDING') {
        this.task.action = 'agree'
      } else if (this.taskInfo.delegation != 'RESOLVED' && this.taskInfo.delegation == 'PENDING') {
        this.task.action = 'resolve';
      }
    }
    if (this.procInstId) {
      this.$nextTick(() => {
        this.getProcinstParamess();
      });
      //this.listNodeInfos();
    }
    this.dataBak={...this.addForm}
    /**在下面写其它函数***/

  },//end data
  methods: {
    listCandDelSign,
    async onSmChange(users,field){
      if(!this.taskInfo.taskId){
        this.$message.error("当前流程不允许更改"); 
        this.$nextTick(()=>{
          this.addForm.sponsors=this.dataBak.sponsors
          this.addForm.monitors=this.dataBak.monitors
        })

        return;
      }
      var params = {taskId:this.taskInfo.taskId,procInstId:this.taskInfo.procInstId}
      var ds=users.map(u=>u.userid).join(',');
      var usernames=users.map(u=>u.username).join(',');
      if(field=='sponsors'){
        params.sponsors=ds
        params.reason=`${this.userInfo.username}将主办人修改为[${usernames}]`
       }else{ 
        params.monitors=ds 
        params.reason=`${this.userInfo.username}将监控人修改为[${usernames}]`
      }
      
      let {tips} = await editSm(params)
      if(tips.isOk){
        this.$message.success(tips.msg)
        this.$refs['commentStepRef'].getComments();
      }else{
        this.$message.error(tips.msg)
      }
    },
    onFormDataChange(formData, changeLogs) {
      this.formDataChangeLogs = changeLogs
    },
    nextAssigneesSelectChange: function (users) {
      
    
      this.task.nextAssignees=users?users.map(k=>k.userid):[]
      this.nextAssigneesName=users?users.map(k=>k.username):[]
      this.$refs.addForm.validateField('nextAssignees');
      this.$refs.addForm.validateField('action');
      this.tranActionComments()
    },
    assigneesSelectChange: function(user){
      this.task.assignee=user?user.userid:''
      this.assigneeName=user?user.username:''
      this.$refs.addForm.validateField('assignee');
      this.$refs.addForm.validateField('action');
      
      this.tranActionComments()
    },
    rollbackSelectChange: function (comment) {  
      if(comment){

        this.task.targetActKey=comment.taskDefKey
        this.$refs.addForm.validateField('targetActKey');    
      }else{
        
      this.task.targetActKey=''
      this.$refs.addForm.validateField('targetActKey');    
      }
    },
    tranActionComments() { 
      var action = this.task.action;
      var currentUsername = this.userInfo.username;
      var assigneeName=this.assigneeName
      var usernames = this.nextAssigneesName.join(",")
      if (action == 'sponsors') {
        this.task.reason = '请主办' + this.sponsors.map(i => i.username).join(",") + '处理';
      } else if (action == 'disAgree') {
        this.task.reason = '不同意';
      } else if (action == 'agree') {
        this.task.reason = '同意';
      } else if (action == 'transferToStartUser') {
        this.task.reason = '请发起人' + this.taskInfo.startUsername + '处理';
      }else if (action == 'addSign') {
        this.task.reason = '请' + usernames + '审批';
      }else if (action == 'transfer') {
        this.task.reason = '请' + assigneeName + '代办';
      } else if (action == 'claim') {
        this.task.reason = currentUsername + "领取了任务";
      } else if (action == 'delegate') {
        this.task.reason = '委托' + assigneeName + '办理';
      } else if (action == 'resolve') {
        this.task.reason = currentUsername + '已协办完成';
      } else if (action == 'over') {
        this.task.reason = currentUsername + '将流程结束';
      } else if (action == 'rollback') {
        this.$refs.addForm.validateField('targetActKey ');
        this.task.reason = currentUsername + '将流程驳回';
      }
      this.$refs.addForm.validateField('nextAssignees');
      this.$refs.addForm.validateField('assignee');
    },
    getComments: function (comments) {
      
      let temp = comments.filter(i => i.taskDefKey != this.taskInfo.taskDefKey);
      let commentsTemp = [];
      temp.forEach(i => {
        if (!commentsTemp.some(item => item.taskDefKey == i.taskDefKey)) {
          commentsTemp.push(i)
        }
      })
      this.$nextTick(() => {
        this.comments = commentsTemp
      })

    },

    addComment: function () { 
      if (this.task.reason == '') {
        this.$message({
          position: 'bottom-left',
          showClose: true,
          message: "办理意见不能为空",
          type: 'error'
        });
        return;
      }
      this.addLoading = true;
      var comment = {
        userid: this.userInfo.userid,
        taskId: this.task.taskId,
        procInstId: this.taskInfo.procInstId,
        commentMsg: this.task.reason
      };
      addComment(comment).then(res => {
        if (res.tips.isOk) {
          this.$refs['commentStepRef'].getComments();
          this.addLoading = false;
          this.addForm.reason = ""
          this.$message({
            position: 'bottom-left',
            showClose: true,
            message: '保存办理意见成功',
            type: 'success'
          });
        } else {
          this.addLoading = false;
          this.$message({
            position: 'bottom-left',
            showClose: true,
            message: res.tips.msg,
            type: 'error'
          });
        }
      }).catch(e => {
        this.addLoading = false;
      })
    },
    // 取消按钮点击 父组件监听@cancel="addFormVisible=false" 监听
    handleCancel: function () {

      this.modelFilesVisible = false;
      this.addLoading = false;
      this.listLoading = false;
      this.$emit('cancel');
    },
    //新增提交ProcinstParames 流程实例参数设置表 父组件监听@submit="afterAddSubmit"
    startSubmit: function (formData) {
      this.$refs.addForm.validate((valid) => {
        if (valid) {
          this.$confirm('确认提交吗？', '提示', {}).then(() => {
            this.addLoading = true;  
            let params = { taskId:'',action:'',assignee:'',nextAssignees:[] ,formData: formData};

            params = Object.assign(params, this.task);  
            if(this.task.action=='resolve'){
              params.action='agree'
            }
            if(this.task.action=='transferToStartUser'){
              params.action='transfer'
              params.assignee=this.taskInfo.userid
            }
            completeTask(params).then((res) => {
              this.addLoading = false;
              var tips = res.tips;
              if (tips.isOk) {
                this.$emit('submit', res, tips.isOk, 'add');//  @submit="afterAddSubmit"
                this.needAssignee = ''
                this.needAssigneeMsg = ''
                this.needAssigneeNum = -1
                this.$message({
                  position: 'bottom-left',
                  showClose: true,
                  message: tips.msg,
                  type: tips.isOk ? 'success' : 'error'
                });
                this.handleCancel();
              } else if (tips.tipscode == 'need-multiple-assignee') {//need-multiple-assignee 需要一个或者多个 need-single-assignee 只需要一个
                this.needAssignee = tips.tipscode
                this.needAssigneeMsg = tips.msg
                this.needAssigneeNum = tips.needAssigneeNum;
                this.$refs.addForm.validateField('nextAssignees');
                this.$message({
                  position: 'bottom-left',
                  showClose: true,
                  message: tips.msg,
                  type: tips.isOk ? 'success' : 'error'
                });

              } else if (tips.tipscode == 'need-single-assignee') {
                this.needAssignee = tips.tipscode
                this.needAssigneeMsg = tips.msg
                this.needAssigneeNum = 1;
                this.$refs.addForm.validateField('nextAssignees');
                this.$message({
                  position: 'bottom-left',
                  showClose: true,
                  message: tips.msg,
                  type: tips.isOk ? 'success' : 'error'
                });

              } else {
                this.$message({
                  position: 'bottom-left',
                  showClose: true,
                  message: tips.msg,
                  type: tips.isOk ? 'success' : 'error'
                });
              }

            }).catch(() => {
              this.addLoading = false;
            });
          });
        }
      });
    }, 
    /**begin 在下面加自定义方法,记得补上面的一个逗号**/
    //获取列表 ProcdefParames 流程定义参数设置表
    getProcinstParamess() {
      let params = {
        procInstId: this.procInstId
      };

      this.listLoading = true;
      listProcinstParames(params).then((res) => {
        var tips = res.tips;
        if (tips.isOk) {
          if (res.data.length > 0) {
            this.addForm = Object.assign(this.addForm, res.data[0]);
            this.dataBak={...this.addForm}
          } else {
            this.addForm = Object.assign(this.addForm, this.defaultAddForm); 
            this.dataBak={...this.addForm}
          }
        } else {
          this.$message({
            position: 'bottom-left',
            showClose: true,
            message: tips.msg,
            type: 'error'
          });
        }
        this.listLoading = false;
      }).catch(() => {
        this.listLoading = false;

      });
    },

    showDiagram() {

      var diagramUrl =
          "." +
          import.meta.env.VITE_API_BASE_PATH +
          "/" +
          import.meta.env.VITE_API_VERSION +
          "/" +
          config.getWfCtx() +
          "/mdp/workflow/ru/diagram/" + this.procDefId + '/' + this.procInstId
      this.$refs['diagramDialog'].open({diagramUrl: diagramUrl})
    },

    handleUploadChange() {
    },
    completeHandle() {
      if (this.task.action == 'claim') {
        this.task.nextAssignees = [{
          userid: this.userInfo.userid,
          username: this.userInfo.username
        }];
      }
      if (this.addForm.formId == '' || this.addForm.formId == null || this.addForm.isRefForm != '1') {
        this.startSubmit()
      } else {
        this.$refs['flowFormRef'].editSubmit();
      }

    },
    handlePrint() {
      this.$nextTick(() => {
        html2canvas(document.getElementById("flowinfoTab")).then(canvas => {
          //生成base64图片数据
          var dataUrl = canvas.toDataURL();

          var newImg = document.createElement("img");
          newImg.src = dataUrl;
          var printWindow = window.open(newImg.src, "_blank");
          if (printWindow == null) {
            this.$message({
              position: 'bottom-left',
              showClose: true,
              message: '无法打开打印窗口，请检查是否浏览器阻止弹出框',
              type: 'error'
            });
          } else {

            this.$nextTick(() => {
              printWindow.document.write('<img  src="' + newImg.src + '" />');
              printWindow.print();

            });
          }
        });
      });
    },


    onTagChange(tags) { 
      var params={'$pks':[this.taskInfo.procInstId],tagIds:tags.map(k=>k.tagId).join(","),tagNames:tags.map(k=>k.tagName).join(",")}
      editSomeFieldsProcinstExpand(params).then(res=>{
        let {tips,data}=res
        this.$message({message:tips.msg,type:tips.isOk?'success':'error'})
        if(tips.isOk){
          this.addForm.tagNames=params.tagNames
        }
      })
    },
    //流程归档
    handleArchive() {
      this.$nextTick(() => {
        html2canvas(document.getElementById("flowinfoTab")).then(canvas => {
          //生成base64图片数据
          var fileData = canvas.toDataURL();
          let params = {
            fileName: this.addForm.id + ".png",
            fileData: fileData,
            archiveId: this.addForm.id,
            categoryId: this.addForm.categoryId
          }
          this.$mdp.uploadBase64ArchiveAttachment(params).then(res => {
            if (res.tips.isOk) {
              this.fileList.push(res.data);
            } else {
              this.$message.warning(res.tips.msg);
              return false;
            }
          });
          var userid = sessionStorage.getItem("userid");
          var archive = {
            id: this.addForm.id,
            categoryId: this.addForm.categoryId,
            tagNames: '工作流,归档',
            deptid: sessionStorage.getItem("deptid"),
            userid: userid,
            isShare: '1',
            url: '',
            archiveAbstract: '',
            archiveContext: this.addForm.mainContext,
            archiveTitle: this.addForm.mainTitle,
            archivingUserid: userid,
            isFromArchiving: '1',
            archivingDate: null,
            createDate: null,
            authorUserid: userid,
            authorName: '',
            canDel: '0',
            canEdit: '0',
            canRead: '1',
            bizKey: this.addForm.procInstId,
            encryptType: '0'
          }
          addWorkflowArchive(archive).then(res => {
            if (res.tips.isOk) {
              this.$message.success(res.tips.msg);
            } else {
              this.$message.error(res.tips.msg);
            }
          });
        });
      });
    },
    showNodeInfoDialog: function () {
      if (this.nodeInfos && this.nodeInfos.length > 0) {
        this.nodeInfoVisible = true;
      } else {
        this.listNodeInfos(true)
      }

    },
    listNodeInfos(showNodeInfoDialog) {
      var params = {procInstId: this.taskInfo.procInstId}
      getNodeInfos(params).then(res => {
        if (res.tips.isOk) {
          this.nodeInfos = res.data;
          if (res.data.length > 0) {
            var actId = this.taskInfo.actId
            if (!actId || actId == '') {
              actId = this.taskInfo.taskDefKey
            }
            var data = res.data.filter(i => i.actId == actId);
            if (data.length > 0) {
              this.actAssignee = data[0]
              if (this.qxCode && this.qxCode.endsWith("1") && this.actAssignee.qxCode) {
                this.qxCode = this.actAssignee.qxCode
              }
            } else {
              this.actAssignee = null;
            }
            if (showNodeInfoDialog) {
              this.$refs['nodeInfosSetDialog'].open({nodeInfos: this.nodeInfos})
            }
          }
        }
      });
    },
    updateFlowPlanFinishTime: function () {
      if (this.addForm.planFinishTime == null || this.addForm.planFinishTime == '') {
        this.$message.error("计划完成时间不能为空");
        returnn;
      }
      if(!this.taskInfo.taskId){
        this.$message.error("当前流程不允许更改");
      } 
      
      this.addForm.planFinishTime=moment(this.addForm.planFinishTime).format("YYYY-MM-DD HH:mm:ss");
      this.addLoading = true;
      var params = {
        procInstId: this.taskInfo.procInstId,
        taskId: this.taskInfo.taskId,
        reason: '',
        oldPlanFinishTime: this.taskInfo.planFinishTime,
        planFinishTime: this.addForm.planFinishTime
      }

      editPlanFinishTime(params).then(res => {
        this.addLoading = false
        if (res.tips.isOk) {
          this.$refs['commentStepRef'].getComments();
          this.$message.success("更新成功");
        } else {
          this.$message.error(res.tips.msg);
        }
      })
    },
    onNodeInfosCancel: function () {
      this.nodeInfoVisible = false;
    },
    onNodeInfosConfirm: function (nodeInfos) {
      updateNodeInfos(nodeInfos).then(res => {
        var tips = res.tips;
        if (tips.isOk) {
          this.nodeInfos = res.data;
          this.nodeInfoVisible = false;
        }
        this.$message({
          position: 'bottom-left',
          showClose: true,
          message: tips.msg,
          type: tips.isOk ? 'success' : 'error'
        });
      })

    },

    /**end 在上面加自定义方法**/

  }//end mounted
}

</script>

<style scoped>
.wf-title {
  text-align: center;
  font-size: 1.2em;
  overflow-x: auto;
  overflow-y: auto;

}

.wf-sub-title {
  text-align: center;
  font-size: 1.1em;
  overflow-x: auto;
  overflow-y: auto;
}

.wf-sub-sub-title {
  font-size: 0.6em;
  text-align: center;
}

.wf-main-context-box {
  border: 1px dashed #000;
  margin-bottom: 10px;
  margin-top: 10px;
}

.wf-main-context p {
  color: #585858;
}

.wf-main-context p > img {
  max-width: 100%;
}

.more-label-font {
  text-align: center;
  float: left;
  padding-top: 5px;
}

.page-bottom {
  height: calc(5vh);
}

.name-font {
  color: lightseagreen;
}
</style>
