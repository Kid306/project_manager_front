<template> 
    <task-mng :assigneeToMe="true"
      source="gzt" :defaultShowCalendar="true"  @pageInfo="onPageInfoChange"/> 
</template>

<script>
import TaskMng from "../mdp/workflow/ru/task/Index.vue";//

export default {
  name: 'TaskListAssigneeToMe',//end methods
  components: {
    'task-mng': TaskMng
    //在下面添加其它组件
  },
  props: [],
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
  methods: {
    onPageInfoChange(pageInfo){
      
      this.$emit('pageInfo',pageInfo)
    }
  }
}

</script>

<style scoped>

</style>
