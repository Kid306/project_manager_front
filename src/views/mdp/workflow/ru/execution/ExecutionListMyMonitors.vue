<template>
  <section>
    <execution-mng isMyMonitors="true"/>
  </section>
</template>

<script>

import ExecutionMng from "./Index.vue";//

export default {
  name: 'ExecutionListMyMonitors',//end methods
  components: {
    'execution-mng': ExecutionMng
    //在下面添加其它组件
  },
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
