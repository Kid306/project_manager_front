<template>
  <div :key="xmProduct?.id" v-if="xmProduct?.id"> 
    <top-nav/> 
    <router-view v-slot="{Component}">
      <keep-alive>
        <component :is="Component"/>
      </keep-alive>
      </router-view>
  </div>
  
</template>

<script>
import util from '@/components/mdp-ui/js/util';//全局公共库
//import Sticky from '@/components/Sticky' // 粘性header组件

import { mapState } from 'pinia'
import { useUserStore } from '@/store/modules/user'
import { useXmStore,useXmStore2 } from '@/store/modules/xm'
import topNav from './top-nav.vue'

import { listXmProductWithState } from '@/api/xm/core/xmProduct';

export default {
  computed: {
    ...mapState(useUserStore,["userInfo", "roles"]),
    ...mapState(useXmStore,["xmProduct"]),
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

    if(!this.$route.query.productId){
      this.$message.error("地址不合规")
      this.$router.back(-1)
    }
    if(!this.xmProduct||this.xmProduct.id!=this.$route.query.productId){
      listXmProductWithState({id:this.$route.query.productId,isTpl:this.$route.query.isTpl}).then(res=>{
        var tips = res.tips;
        if(tips.isOk ){
          if( res.data.length==1){
            useXmStore2().setXmProduct(res.data[0])
          }else{
            this.$message.error("产品不存在，请确保产品编号正确")
            this.$router.push({
              path:'/xm/product/mng'
            })
          }

        }else{
          this.$message.error(tips.msg)
          this.$router.push({
            path:'/xm/product/mng'
          })
        }
      })
    }
  },
  beforeUnmount(){
    useXmStore2().setXmProduct(null)
  }
};
</script>

<style rel="stylesheet/scss" lang="scss" scoped>

</style>
