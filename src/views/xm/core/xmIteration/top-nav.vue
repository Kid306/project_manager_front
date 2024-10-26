<template>
   
      <el-menu
        :default-active="infotype"
        mode="horizontal"
        @select="setInfotype"
        class="menus"
        style="margin:0 auto;overflow-x: auto;overflow-y: hidden;display: flex;" 
        background-color="rgb(48, 65, 86)"
        text-color="rgb(191, 203, 217)"
        active-text-color="#409eff"
        :router="true"
      >
        <el-menu-item :index="'/xm/iteration/view/overview?iterationId='+xmIteration.id">
          <template #title>
          <div class="flex items-center"
            style="max-width: 25em; font-weight: 600; font-size: 20px; color: #ff8c00" 
            :title="xmIteration.iterationName"
          >  &nbsp;<el-avatar class="top-icon"  style="background-color:#2ab453;width:45px;min-width: 45px;border: 2px solid silver;">迭代</el-avatar> 
          &nbsp;<el-text size="large" truncated type="success"><div style="font-weight: 600; font-size: 20px; color: #2ab453" >{{ xmIteration.iterationName }}</div></el-text> 
 
          </div> 
          </template>
        </el-menu-item>
        <!--
        <el-menu-item :index="'/xm/iteration/view/project?iterationId='+xmIteration.id">
          <template #title><i class="odometer"></i>项目</span>
        </el-menu-item> 
        -->
				<el-menu-item label="需求" :index="'/xm/iteration/view/menu?iterationId='+xmIteration.id" class="hidden-md-and-down">
					 <template #title><i class="document"></i>需求</template> 
				</el-menu-item>     
				<el-menu-item label="模块" :index="'/xm/iteration/view/func?iterationId='+xmIteration.id" class="hidden-md-and-down">
					 <template #title><i class="document"></i>模块</template> 
				</el-menu-item>  
        <el-menu-item :index="'/xm/iteration/view/task?iterationId='+xmIteration.id" class="hidden-md-and-down">
          <template #title><i class="s-operation"></i>任务</template>
        </el-menu-item>
        <el-menu-item :index="'/xm/iteration/view/test/plan?iterationId='+xmIteration.id">
          <template #title><i class="question"></i>测试</template>
        </el-menu-item> 
        <el-menu-item :index="'/xm/iteration/view/question?iterationId='+xmIteration.id">
          <template #title><i class="question"></i>缺陷</template>
        </el-menu-item> 
        <el-menu-item :index="'/xm/iteration/view/group?iterationId='+xmIteration.id">
          <template #title><i class="user-solid"></i>团队</template>
        </el-menu-item>  
        <el-menu-item :index="'/xm/pro/iteration/view/rpt?iterationId='+xmIteration.id">
          <template #title><i class="s-data"></i>效能</template>
        </el-menu-item> 
        <el-sub-menu index="更多">
          <template #title>更多 </template>
          <el-menu-item :index="'/xm/iteration/view/workloadDay?iterationId='+xmIteration.id">
            <template #title><i class="video-camera"></i>每日工时</template>
          </el-menu-item>
          <el-menu-item :index="'/xm/pro/iteration/view/workloadMonth?iterationId='+xmIteration.id">
            <template #title
              ><i class="video-camera"></i>每月工时</template
            >
          </el-menu-item>   
          <el-menu-item index="/forum">
            <template #title><i class="date"></i>论坛</template>
          </el-menu-item>
          <el-menu-item index="/im">
            <template #title><i class="date"></i>即聊</template>
          </el-menu-item>
          <el-menu-item index="/helpCenter">
            <template #title><i class="date"></i>客服</template>
          </el-menu-item>
          <el-menu-item index="/xm/iteration/mng" >
              <template #title><i class="back"></i>回到迭代列表页</template>
            </el-menu-item> 
            <el-menu-item index="/">
              <template #title><i class="s-home"></i>首页</template>
            </el-menu-item> 
        </el-sub-menu>
        
        <el-menu-item :index="'/'">
          <template #title><i class="s-home"></i>首页</template>
        </el-menu-item>
      </el-menu> 
  
</template>

<script> 
 
 
import { mapState } from 'pinia'
import { useUserStore } from '@/store/modules/user'
import { useXmStore } from '@/store/modules/xm'

export default {
  props: ["visible"],
  computed: {
    ...mapState(useUserStore,["userInfo", "roles"]),
    ...mapState(useXmStore,["xmIteration"]),
  },
  watch: {
    $route:{
      handler(newVal,oldValu){ 
        this.infotype=newVal.fullPath 
      },
      deep:true,
      immediate:true,
    }
  },
  data() {
    return { 
      infotype:'',  
    };
  }, //end data
  methods: {    
    setInfotype(infotype) {  
        this.infotype = infotype;  
    },   
     
  }, //end methods
  components: {
     
    //在下面添加其它组件
  }, 
  mounted() {   
    this.infotype=this.$route.fullPath
  },
};
</script>

<style rel="stylesheet/scss" lang="scss" scoped>
.menus {
  .el-menu-item {
    padding-left: 0px !important;
  }
}
/* 超过宽度则用...代替 */
.truncate {
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}
.step-btn{
	margin-left:0px;margin-bottom: 5px;
}
</style>
