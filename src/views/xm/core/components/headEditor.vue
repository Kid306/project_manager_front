<template>
  <div class="comment-list head-editor clearfix">
    <div class="comment-avater">
      <el-avatar icon="user-solid" />
    </div>
    <div class="comment-wrap">
      <div class="clearfix">
        <vue-editor :id="id" :branch-id="userInfo.branchId" v-model="msg" />
      </div>
      <div style="margin-top:20px;" ></div>
      <el-button @click="submitData" class="toolbar"  type="primary">发布</el-button>
    </div>
  </div>
</template>

<script>
import util from '@/components/mdp-ui/js/util';//全局公共库
import { mapState } from 'pinia'
import { useUserStore } from '@/store/modules/user';
import { Editor as VueEditor } from '@/components/Editor'
import {sn} from '@/components/mdp-ui/js/sequence';
export default {
  props:["id","user","projectId","taskId","quoteId","replyId"],
  computed: {
    ...mapState(useUserStore,[
      'userInfo','roles',
    ]),
  },
  data() {
    return {
      msg: '',
    }
  },
  methods: {
    submitData() {
      let params = {
        content: this.msg,
        sendUserid: this.user.id,
        sendUsername: this.user.name,
      }
      if(typeof(this.projectId) != "undefined"){
        params.projectId = this.projectId;
      }
      else if(typeof(this.taskId) != "undefined") {
        params.taskId = this.taskId;
      }
      if(typeof(this.quoteId) != "undefined") {
        params.quoteId = this.quoteId;
      }
      else if(typeof(this.replyId) != "undefined") {
        params.replyId = this.replyId;
      }
      this.$emit('getMessage',params);
      this.msg = '';
    },
  },
  mounted() {
    this.$nextTick(() => {
    });
  },
  components: {
    VueEditor,
  },
}
</script>

<style lang="scss" scoped>
.head-editor{
	border: none;
  padding: 0 15px 10px 60px;
	margin-top: 15px;
	position: relative;
}
.comment-avater{
	position: absolute;
	left: 10px;
	top: 0;
}
.toolbar{
	float: right;
	margin: .25rem 0;
}
.clearfix::after {
	clear: both;
	content: "";
}
</style>
