<template>
  <div class="comment-box">
    <div class="w-box">
      <div class="edit">
        <!-- <img :src="getHeadimgurl(userInfo.userid,userInfo.headimgurl)" class="avatar" @error="onImgError(userInfo.userid,$event)" /> -->
        <div class="input-box">
          <el-input type="textarea" :rows="8" placeholder="请输入你的评论" v-model="commentTxt"/>
        </div>
      </div>
      <div class="bottom-btns">
        <!-- <img src="../../../../../static/images/expression.png" class="expression" /> -->
        <el-button type="primary" @click="publishComment">发表评论</el-button>
      </div>
    </div>
    <div v-if="commentsList.length > 0" class="comment-list">
      <comment-list v-for="(item) in commentsList" :modelValue="item" :parent="item" :key="item.id" @getList="getXmMenuComments" />
      <div class="page-set">
        <el-pagination layout="total, sizes, prev, pager, next" @current-change="handleCurrentChange"
        @size-change="handleSizeChange" :page-sizes="[10, 20, 50, 100, 500]" :current-page="pageInfo.pageNum"
        :page-size="pageInfo.pageSize" :total="pageInfo.total" />
      </div>
    </div>
    <div v-else class="no-msg">
      <!-- <img src="../../../../../static/images/no-comment.png" class="no-pic" /> -->
      <span>当前文章暂无评论 ~~</span>
    </div>
  </div>
</template>

<script>

import { listXmMenuComment, addXmMenuComment,delXmMenuComment, batchDelXmMenuComment,editSomeFieldsXmMenuComment } from '@/api/xm/core/xmMenuComment';
import commentList from './comment-list.vue';
import { mapState } from 'pinia'
import { useUserStore } from '@/store/modules/user';
 
export default {
  name: 'commentArea',
  props: ['targetId'],
  components: {
    commentList,
  },
  computed: {
    ...mapState(useUserStore,['userInfo']),
  },
  data() {
    return {
      avatarUrl: '',
      commentTxt: '',
      commentsList: [],

      pageInfo: {//分页数据
        total: 0,//服务器端收到0时，会自动计算总记录数，如果上传>0的不自动计算。
        pageSize: 10,//每页数据
        count:true,//是否需要重新计算总记录数
        pageNum: 1,//当前页码、从1开始计算
        orderFields: ['CDATE'],//排序列 如 ['sex','student_id']，必须为数据库字段
        orderDirs: ['desc']//升序 asc,降序desc 如 性别 升序、学生编号降序 ['asc','desc']
      },
    };
  },
  methods: { 
    handleSizeChange(pageSize) {
      this.pageInfo.pageSize = pageSize;
      this.getXmMenuComments();
    },
    handleCurrentChange(pageNum) {
      this.pageInfo.pageNum = pageNum;
      this.getXmMenuComments();
    }, 
    // 格式化评论数据
    commentListFormat() {
      this.commentsList.forEach((item) => { 
        item.childList=[]
        // 将回复该评论的评论放入childList中
        let arr = this.commentsList.filter((i) => i.pid === item.id);
        if (arr.length > 0) {
          item.childList = arr;
        }
      });
      // 过滤出最高级
      this.commentsList = this.commentsList.filter((item) => item.pid === null);
    },
    publishComment() {
      if (this.userInfo.userid) {
        let params = {
          menuId: this.targetId,
          context: this.commentTxt,
        };
        if (params.context) {
          addXmMenuComment(params).then((res) => {
            let tips = res.tips;
            if (tips.isOk) {
              this.$message({
                type: 'success',
                message: '评论成功',
              });
              this.commentTxt = ''; 
              this.getXmMenuComments();
            } else {
              this.$message({
                message: tips.msg,
                type: 'error',
              });
            }
          });
        } else {
          this.$message({
            type: 'error',
            message: '评论内容不能为空',
          });
        }
      } else {
        this.$message({
          type: 'error',
          message: '您还没有登录，请先登录！',
        });
      }
    },
    getXmMenuComments() {
      if (!this.targetId) {
        return;
      }

      let params = {
        pageSize: this.pageInfo.pageSize,
        pageNum: this.pageInfo.pageNum,
        total: this.pageInfo.total,
        count: this.pageInfo.count,
        menuId: this.targetId,
        pidIsNull: "1",
      };
      if (this.pageInfo.orderFields != null && this.pageInfo.orderFields.length > 0) {
        let orderBys = [];
        for (var i = 0; i < this.pageInfo.orderFields.length; i++) {
          orderBys.push(this.pageInfo.orderFields[i] + " " + this.pageInfo.orderDirs[i])
        }
        params.orderBy = orderBys.join(",")
      }

      listXmMenuComment(params).then((res) => {
        let tips = res.tips;
        if (tips.isOk) {
          this.pageInfo.total = res.total;
          this.pageInfo.count = false;
          let list = res.data;
          this.commentsList = list;
          if (res.children && res.children.length > 0) {
            this.commentsList.push(...res.children)
          }

          this.commentListFormat();

        } else {
          this.$message({
            message: tips.msg,
            type: 'error',
          });
        }
      });
    },
  },
  mounted() { 
    this.getXmMenuComments();
  },
};
</script>

<style lang="scss" scoped>
.comment-box {
  .w-box {
    margin-bottom: 50px;

    .edit {
      display: flex;

      .avatar {
        width: 50px;
        height: 50px;
        margin-right: 24px;
        border-radius: 50%;
        border: 1px solid #f1f1f1;
      }

      .input-box {
        width: calc(100%);
      }
    }

    .bottom-btns {
      margin-top: 14px;
      display: flex;
      justify-content: flex-end;
      align-items: center;

      .expression {
        width: 22px;
        height: 22px;
        margin-right: 16px;
        border-radius: 50%;
        cursor: pointer;
      }

      .expression:hover {
        opacity: 0.8;
      }
    }
  }

  .comment-list {
    .page-set {
      text-align: right;
    }
  }

  .no-msg {
    padding: 40px 0;
    display: flex;
    justify-content: center;
    align-items: center;
    font-size: 16px;
    color: #b5b5b5;

    .no-pic {
      width: 60px;
      height: 60px;
      margin-right: 12px;
    }
  }
}
</style>