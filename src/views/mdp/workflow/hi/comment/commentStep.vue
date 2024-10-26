<template>  
        <div v-if="!comments || comments.length<=0" style="padding-left: 10px;">暂无信息</div>
        <el-steps :space="60" direction="vertical" process-status="process" finish-status="success" :active="comments.length">
          <el-step v-for="(item,index) in comments " :key="index" >
            <template #title> 
                {{ item.name == '' || item.name == null ? item.message : item.name }}
                  &nbsp;&nbsp;<span style="color:rgb(133, 118, 118);font-size:10px;">{{item.username}} 提交于 {{ formatTaskTime(item.time) }} </span>
            </template>
            <template
              #description> 
              <span style=" font-size:14px;color: rgb(89, 78, 78);">意见：</span>
              <el-divider  direction="vertical"/>
              <div style="display: inline-block;font-size:14px;color: rgb(26, 23, 23);">{{ item.message }}</div>
            </template>
          </el-step>
          <el-step v-if="task && task.taskId" status="process" icon="edit">
            <template #title> 
              {{ task.taskName||task.name }} 
              &nbsp;&nbsp;<span style="color:rgb(133, 118, 118);font-size:10px;"> 于 {{ formatTaskTime(task.startTime) }}  分配给 {{task.assigneeName}} </span>
            </template> 
          </el-step>
        </el-steps> 
</template>

<script>
import util from '@/components/mdp-ui/js/util';//全局公共库
//import {getCompanyEmployees, selectCacheOptions,getDefaultValue,getCodeName } from '../../../../../api/common/code';//下拉框数据查询
import {addComment, listComment} from '@/api/mdp/workflow/hi/comment';
import moment from "moment";

export default {//end method
  components: {
    //在下面添加其它组件 'comment-edit':CommentEdit
  },
  // props: ['procInstId', 'task'],
  props: {
    procInstId: {
      type: String,
      default: () => ("")
    },
    task: {
      type: Object,
      default: () => ({})
    }
  },
  data() {
    return {
      options: {},//下拉选择框的所有静态数据
      addLoading: false,
      addFormRules: {
        id: [
          //{ required: true, message: 'id_', trigger: 'blur' }
        ]
      },
      //新增界面数据 act_hi_comment
      addForm: {
        id: '',
        type: '',
        time: '',
        userId: '',
        taskId: '',
        procInstId: '',
        action: '',
        message: '',
        fullMsg: ''
      },
      /**begin 在下面加自定义属性,记得补上面的一个逗号**/
      comments: []
      /**end 在上面加自定义属性**/
    }//end return
  },
  computed: {
    screenWidth: function () {
      return screen.width;
    },
  },
  watch: {
    procInstId() {
      this.getComments();
    }
  },
  mounted() {
    this.getComments();

  },//end data
  methods: {
    // 取消按钮点击 父组件监听@cancel="addFormVisible=false" 监听
    handleCancel: function () {
      this.$emit('cancel');
    },
    //新增提交Comment act_hi_comment 父组件监听@submit="afterAddSubmit"
    addSubmit: function () {
      this.$refs.addForm.validate((valid) => {
        if (valid) {
          this.$confirm('确认提交吗？', '提示', {}).then(() => {
            this.addLoading = true;
            let params = Object.assign({}, this.addForm);
            addComment(params).then((res) => {
              this.addLoading = false;
              var tips = res.tips;
              if (tips.isOk) {
                this.$refs['addForm'].resetFields();
                this.$emit('submit');//  @submit="afterAddSubmit"
              }
              this.$message({
                position: 'bottom-left',
                showClose: true,
                message: tips.msg,
                type: tips.isOk ? 'success' : 'error'
              });
            }).catch(() => {
              this.addLoading = false;
            });
          });
        }
      });
    },
    formatTaskTime(time) {
      return moment(time).format("DD日HH时");
    },
    /**begin 在下面加自定义方法,记得补上面的一个逗号**/
    //获取列表 Comment act_hi_comment
    getComments() {
      if (!this.procInstId) {
        return;
      }
      let params = {'res.procInstId': this.procInstId};
      params.pageNum = '1';
      params.pageSize = '50';
      listComment(params).then((res) => {
        var tips = res.tips;
        if (tips.isOk) {
          var commentsTeam = res.data;
          this.comments = commentsTeam
          this.$emit('get-comments', this.comments)
        } else {

          this.$message({
            position: 'bottom-left',
            showClose: true,
            message: tips.msg,
            type: 'error'
          });
        }
      }).catch(() => {

      });
    },
    labelWidth: function () {
      if (screen.width <= 375) {
        return "5px"
      } else if (screen.width <= 500) {
        return "5px"
      } else if (screen.width <= 1024) {
        return "100px"
      } else {
        return "120px"
      }
    },
    labelName: function () {
      if (screen.width <= 375) {
        return ""
      } else if (screen.width <= 500) {
        return ""
      } else if (screen.width <= 1024) {
        return "流转信息"
      } else {
        return "流转信息"
      }
    },
    /**end 在上面加自定义方法**/

  }//end mounted
}

</script>

<style scoped>

</style>
