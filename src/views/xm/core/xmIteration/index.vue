<template>
  
    <top-nav v-if="xmIteration&&xmIteration.id"/> 

    <router-view v-if="xmIteration && xmIteration.id" v-slot="{Component}">
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
import { listXmIterationWithState } from '@/api/xm/core/xmIteration';

export default {
  computed: {
    ...mapState(useUserStore,["userInfo", "roles"]),
    ...mapState(useXmStore,["xmIteration"]),
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

    if(!this.$route.query.iterationId){
      this.$message.error("地址不合规")
      this.$router.back(-1)
    }
    if(!this.xmIteration||this.xmIteration.id!=this.$route.query.iterationId){
      listXmIterationWithState({id:this.$route.query.iterationId}).then(res=>{
        var tips = res.tips;
        if(tips.isOk ){
          if( res.data.length==1){
            useXmStore2().setXmIteration(res.data[0])
          }else{
            this.$message.error("迭代编号不存在，请确保迭代编号正确")
            this.$router.push({
              path:'/xm/iteration/mng'
            })
          }

        }else{
          this.$message.error(tips.msg)
          this.$router.push({
            path:'/xm/iteration/mng'
          })
        }
      })
    }
  },
  beforeUnmount(){
    useXmStore2().setXmIteration(null)
  }
};
</script>

<style rel="stylesheet/scss" lang="scss" scoped>

</style>
