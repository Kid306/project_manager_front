<template>
  
    <top-nav v-if="projectInfo && projectInfo.id"/> 
    
    <router-view v-slot="{Component}" v-if="projectInfo && projectInfo.id">
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

import { listXmProject } from '@/api/xm/core/xmProject';

export default {
  computed: {
    ...mapState(useUserStore,["userInfo", "roles"]),
    ...mapState(useXmStore,["projectInfo"]),
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
    
    if(!this.$route.query.projectId){
      this.$message.error("地址不合规")
      this.$router.back(-1)
    }
    if(!this.projectInfo||this.projectInfo.id!=this.$route.query.projectId){
      listXmProject( {id:this.$route.query.projectId,isTpl:this.$route.query.isTpl}).then(res=>{
        var tips = res.tips;
        if(tips.isOk ){
          if( res.data.length==1){
            useXmStore2().setProjectInfo(res.data[0])
          }else{
            this.$message.error("项目不存在，请确保项目编号正确")
            this.$router.push({
              path:'/xm/project/mng/me'
            })
          }

        }else{
          this.$message.error(tips.msg)
          this.$router.push({
            path:'/xm/project/mng/me'
          })
        }
      })
    }
  },
  beforeUnmount(){
    useXmStore2().setProjectInfo(null)
  }
};
</script>

<style rel="stylesheet/scss" lang="scss" scoped>

</style>
