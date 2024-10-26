<template>
  <section>
    <task-mng
      :assigneeToMe="true" :biz-parent-pkid="bizPid" :biz-pkid="bizId" @pageInfo="(v)=>$emit('pageInfo',v)"
      :source="source"/>
  </section>
</template>

<script>
import TaskMng from "./Index.vue";//

export default {
  name: 'TaskListAssigneeToMe',//end methods
  components: {
    'task-mng': TaskMng
    //在下面添加其它组件
  },
  props: ['source', "bizPid", "bizId"],
  data() {
    return {
      filters: {
        key: '',
      },

      /**begin 自定义属性请在下面加 请加备注**/

      /**end 自定义属性请在上面加 请加备注**/
    }
  },
  mounted() {

  },//end data
  methods: {}
}

</script>

<style scoped>

</style>
