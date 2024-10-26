<template>
  <section>
    <el-row style="padding-top:10px;">
      <!--新增界面 ProcinstParames 流程实例参数设置表-->
      <el-table
        :data="nodeInfoList"
        style="width: 100%">
        <el-table-column
          prop="actName"
          label="节点名称"
          min-width="100"/>
        <el-table-column
          prop="showNextAssignees"
          label="已配置人员"
          min-width="250">
          <template #default="scope">
            <mdp-hi-query
              v-if="scope.row.toCreater!='1'" :column-configs="hxColumnConfigs"
              v-model="scope.row.conditions" @change="(e)=>scope.row.conditions=e"
              btn-name="配置条件">
              <template #userid="slotProps">
                <mdp-select-user v-model="slotProps.data.sqlVal"/>
              </template>
              <template #userid2="slotProps">
                <mdp-select-user v-model="slotProps.data.sqlVal"/>
              </template>

              <template #postId="slotProps">
                <mdp-select
                  :multiple="true" v-model="slotProps.data.sqlVal" placeholder="请选择"
                  split="," :options="posts" :props="{id:'id',name:'postName'}"/>
              </template>

              <template #deptid="slotProps">
                <mdp-select-dept v-model="slotProps.data.sqlVal" multiple split=","/>
              </template>
            </mdp-hi-query>
            <el-button
              round v-if="scope.row.toCreater!='1'" 
              @click="$refs['previewUsersDialog'].open({hiQueryParams:scope.row.conditions})">
              预览候选人
            </el-button>
            <mdp-select
              @click="rowClick(scope.row)" round v-if="scope.row.toCreater!='1'"
              item-code="wf_hx_type" v-model="scope.row.hxType"
              :placeholder="'候选人选定策略'"/>

            <el-button
              round v-if="scope.row.toCreater!='1'" 
              @click="setAssigneeAsStartUser(scope.row)">转发起人
            </el-button>

            <el-button
              round v-if="scope.row.toCreater=='1' && scope.row.candidate!='1'" 
              @click="()=>{scope.row.toCreater='0';scope.row.candidate='1'}">
              当前发起人接任务，点击转候选人
            </el-button>
          </template>
        </el-table-column>
        <el-table-column
          prop="showNextAssignees"
          label="手选执行人"
          width="150">

          <template #default="scope">
            <el-checkbox
              v-if="scope.row.allowOverUser!='0'" v-model="scope.row.showNextAssignees"
              label="可手选" true-label="1" false-label="0" border/>
          </template>
        </el-table-column>
        <el-table-column
          prop="candidate"
          label="候选任务"
          width="120">
          <template #default="scope">
            <el-checkbox
              v-if="scope.row.allowOverUser!='0'" v-model="scope.row.candidate"
              label="候选" true-label="1" false-label="0" border/>
          </template>
        </el-table-column>

        <el-table-column
          prop="qxCode"
          label="权限配置"
          min-width="100">
          <template #default="scope">
            <el-button type="plain" @click="$refs['qxSetDialog'].open(scope.row)">配置权限
            </el-button>
          </template>
        </el-table-column>
      </el-table>

      <mdp-dialog
        ref="qxSetDialog"
        title="配置流程节点权限">
        <template #default="{visible,data,dialog}">
          <act-qx-code-set
            :formFields="[]" :visible="visible" :qxCode="data.qxCode"
            @cancel="dialog.close()" @confirm="(qxCode)=>data.qxCode=qxCode"/>
        </template>
      </mdp-dialog>
      <mdp-dialog
        ref="candidateSetDialog"
        title="选择候选人/候选部门/候选岗位">
        <template #default="{visible,data,dialog}">
          <act-candidate-set
            :visible="visible" :actAssignee="data" @cance="dialog.close()" @confirm="(nodeInfo)=>{
						Object.assign(data,nodeInfo);
						dialog.close();
					}" @close="dialog.close()"/>
        </template>

      </mdp-dialog>


      <mdp-dialog
        ref="previewUsersDialog"
        title="预览候选人列表"
        width="80%">
        <template #default="{visible,data}">
          <mdp-table
            :show-hi-query="false" :visible="visible" :crudApis="{list:listSysUser}"
            :column-cfgs="userColumnConfigs"
            :default-hi-query-params="data.hiQueryParams"/>
        </template>
      </mdp-dialog>
    </el-row>

    <el-row class="footer">
      <el-button @click="handleCancel" icon="back">关闭</el-button>
      <el-button type="primary" @click="confirm" icon="finished">确定</el-button>
    </el-row>
  </section>
</template>

<script>
import {mapState} from 'pinia'
import {useUserStore} from '@/store/modules/user' 

import {listSysUser} from '@/api/mdp/workflow/pub/sysUser';

export default {
  name: 'ProcinstNodeInfoSet',
  computed: {
    ...mapState(useUserStore, [
      'userInfo'
    ])
  },//end method
  components: { 
  },
  props: ['nodeInfos'],
  watch: {
    'visible': function (visible) {
      if (visible == true) {
        this.nodeInfoList = JSON.parse(JSON.stringify(this.nodeInfos))
      }
    }
  },
  data() {
    return {
      /**begin 在下面加自定义属性,记得补上面的一个逗号**/
      nodeInfoList: [],//id:'',actId:'',actName:'',procDefId:'',assignees:'',isMultiple:'' ,
      nodeInfoListOld: [],//用于恢复

      hxColumnConfigs: [
        {property: 'userid', label: '用户', slot: 'userid', slot2: 'userid2', colPrefix: 'res.'},

        {property: 'postId', label: '岗位', slot: 'postId'},

        {property: 'deptid', label: '部门', slot: 'deptid'},
      ],
      userColumnConfigs: [
        {property: 'userid', label: '用户', colPrefix: 'res.'},
        {property: 'username', label: '名称'},
      ],
      roles: [],
      posts: [],
      /**end 在上面加自定义属性**/
    }//end return
  },
  mounted() {
    var jsonStrData = JSON.stringify(this.nodeInfos);
    this.nodeInfoList = JSON.parse(jsonStrData)
    this.$mdp.listRole({branchId: "$IN" + this.userInfo.branchId + "," + "platform-branch-001"}).then(res => this.roles = res.data)
    /**在下面写其它函数***/
    this.$mdp.listPost({branchId: "$IN" + this.userInfo.branchId + "," + "platform-branch-001"}).then(res => this.posts = res.data)

  },//end data
  methods: {
    listSysUser,
    // 取消按钮点击 父组件监听@cancel="addFormVisible=false" 监听
    handleCancel: function () {
      this.$emit('cancel');
    },
    confirm: function () {
      this.$emit('confirm', this.nodeInfoList);
    },
    showAssigneeTips(nodeInfo) {
      var tips = [];
      if (nodeInfo.toCreater == '1') {
        tips.push("流程发起人作为执行人")
      } else if (nodeInfo.candidate == '1') {

        if (!nodeInfo.conditions) {
          tips.push("未配置任何候选人/候选部门/候选岗位");
        }

      } else {
        if (!nodeInfo.conditions) {
          tips.push("未配置任何任务执行人");
        }
      }
      return tips.join(",");
    },
    setAssigneeAsStartUser(nodeInfoSeleced) {
      if (nodeInfoSeleced.allowOverUser == '0') {
        this.$message.error("当前节点不允许变更执行人")
        return;
      }
      nodeInfoSeleced.toCreater = '1'
      nodeInfoSeleced.candidate = '0'
      nodeInfoSeleced.showNextAssignees = '0'

    }

  }
}

</script>
<style scoped>

.actConfig {
  margin-bottom: 14px;
}
</style>
