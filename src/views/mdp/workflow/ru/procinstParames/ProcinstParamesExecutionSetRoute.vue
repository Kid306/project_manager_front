<template>
  <section>
    <el-row class="execution-set">
      <procinst-parames-execution-set
          :taskInfo='taskInfo' :procDefId="taskInfo.procDefId"
          :procInstId="taskInfo.procInstId" :visible="editFormVisible"
          @cancel="handleCancel" @submit="afterEditSubmit"/>
    </el-row>
  </section>
</template>

<script>

import ProcinstParamesExecutionSet from "./ProcinstParamesExecutionSet.vue";//

export default {
  name: 'ProcinstParamesExecutionSetRoute',//end methods
  components: {
    ProcinstParamesExecutionSet
    //在下面添加其它组件
  },
  data() {
    return {
      filters: {
        key: '',
      },
      taskInfo: {
        procDefId: '',
        procInstId: {}
      },
      editFormVisible: false,
      /**begin 自定义属性请在下面加 请加备注**/

      /**end 自定义属性请在上面加 请加备注**/
    }
  },
  activated() {
    this.initData();
  },
  mounted() {
    this.initData();
  },//end data
  methods: {
    afterEditSubmit: function () {
      var key = 'ProcinstParamesExecutionSetRoute'
      localStorage.removeItem(key)
      this.$store.dispatch('delVisitedViews', {
        path: '/mdp/workflow/ru/procinstParames/ProcinstParamesExecutionSetRoute',
        name: 'ProcinstParamesExecutionSetRoute'
      })

    },
    handleCancel: function () {
      var key = 'ProcinstParamesExecutionSetRoute'
      localStorage.removeItem(key)
      this.$store.dispatch('delVisitedViews', {
        path: '/mdp/workflow/ru/procinstParames/ProcinstParamesExecutionSetRoute',
        name: 'ProcinstParamesExecutionSetRoute'
      })
      this.$router.back(-1)
    },
    initData() {
      this.$nextTick(() => {
        var key = 'ProcinstParamesExecutionSetRoute'
        if (this.$route.params && this.$route.params.taskInfo) {
          this.editFormVisible = true;
          this.taskInfo = this.$route.params.taskInfo
          localStorage.setItem(key, JSON.stringify(this.taskInfo))
        } else {
          var taskInfoStr = localStorage.getItem(key)
          this.editFormVisible = true;
          this.taskInfo = Object.assign({}, this.taskInfo, JSON.parse(taskInfoStr))
        }
      })
    }

  }
}

</script>

<style scoped>
.execution-set {
  margin-left: 20px;
}
</style>
