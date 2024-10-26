<template>
  
    <top-nav :key="testCasedb?.id" v-if="testCasedb&&testCasedb.id"/> 
    <router-view v-slot="{Component}" v-if="testCasedb&&testCasedb.id">
      <keep-alive>
        <component :is="Component"/>
      </keep-alive>
      </router-view>
</template>

<script>
import util from '@/components/mdp-ui/js/util';//全局公共库
//import Sticky from '@/components/Sticky' // 粘性header组件

import { mapState } from 'pinia'
import { useUserStore } from '@/store/modules/user'
import { useXmStore,useXmStore2 } from '@/store/modules/xm'
import topNav from './top-nav.vue'

import { listXmTestCasedb } from '@/api/xm/core/xmTestCasedb';

export default {
  computed: {
    ...mapState(useUserStore,["userInfo", "roles"]),
    ...mapState(useXmStore,['testCasedb']),
  },
  watch: {},
  data() {
    return {
    };
  }, //end data
  methods: {

  }, //end methods
  components: {
    topNav
    //在下面添加其它组件
  },
  mounted() {
    
    if(!this.$route.query.casedbId){
      this.$message.error("地址不合规")
      this.$router.back(-1)
    }
    if(!this.testCasedb||this.testCasedb.id!=this.$route.query.casedbId){
      listXmTestCasedb({id:this.$route.query.casedbId}).then(res=>{
        var tips = res.tips;
        
        if(tips.isOk ){
          if( res.data.length==1){
            useXmStore2().setTestCasedb(res.data[0])
          }else{
            this.$message.error("测试用例库不存在，请确保测试用例库编号正确")
            this.$router.back(-1)
          }

        }else{
          this.$message.error(tips.msg)
          this.$router.back(-1)
        }
      })
    }
  },
  beforeUnmount(){
    useXmStore2().setTestCasedb(null)
  }
};
</script>

<style rel="stylesheet/scss" lang="scss" scoped>

</style>
