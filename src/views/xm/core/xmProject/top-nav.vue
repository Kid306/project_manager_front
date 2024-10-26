<template> 
      <el-menu
        :default-active="infotype"
        mode="horizontal"
        @select="setInfotype"
        class="menus"
        background-color="rgb(48, 65, 86)"
        text-color="rgb(191, 203, 217)"
        active-text-color="#409eff"
        style="margin:0 auto;overflow-x: auto;overflow-y: hidden;display: flex;" 
        :router="true"
      >
        
        <el-menu-item :index="'/xm/project/view/overview?projectId='+projectInfo.id">
          <template #title>
          <div class="flex items-center"
            style="max-width: 25em;font-weight: 600; font-size: 20px; color: #E6A23C"  
            :title="projectInfo.name"
          >  
              &nbsp;<el-avatar   style="background-color:#E6A23C;;width:50px;min-width: 50px;border: 2px solid silver;">项目</el-avatar> 
              &nbsp;<el-text size="large" truncated type="warning"><div style="max-width: 30em;font-weight: 600; font-size: 20px; color: #E6A23C">{{ projectInfo.name}}</div></el-text> 
            
          </div> 
        </template>
        </el-menu-item>
        <el-menu-item :index="'/xm/project/view/product?projectId='+projectInfo.id">
          <template #title><i class="s-opportunity"></i>产品</template>
        </el-menu-item> 
				<el-menu-item label="需求" :index="'/xm/project/view/menu?projectId='+projectInfo.id">
					 <template #title><i class="document"></i>需求</template> 
				</el-menu-item> 
        <el-menu-item :index="'/xm/project/view/iteration?projectId='+projectInfo.id">
          <template #title><i class="connection"></i>迭代</template>
        </el-menu-item>

        <el-menu-item :index="'/xm/project/view/milestone?projectId='+projectInfo.id">
          <template #title><i class="time"></i>里程碑</template>
        </el-menu-item>
        <el-menu-item :index="'/xm/project/view/plan?projectId='+projectInfo.id">
          <template #title><i class="time"></i>计划</template>
        </el-menu-item>
        <el-menu-item :index="'/xm/project/view/task?projectId='+projectInfo.id">
          <template #title><i class="time"></i>任务</template>
        </el-menu-item>
        <!--
        <el-menu-item :index="'/xm/project/view/task?projectId='+projectInfo.id" class="hidden-md-and-down">
          <template #title><i class="s-operation"></i>任务</template>
        </el-menu-item>
        -->
        <el-menu-item :index="'/xm/project/view/test/plan?projectId='+projectInfo.id">
          <template #title><i class="question"></i>测试</template>
        </el-menu-item>
        <el-menu-item :index="'/xm/project/view/question?projectId='+projectInfo.id">
          <template #title><i class="question"></i>缺陷</template>
        </el-menu-item>
        <el-menu-item :index="'/xm/project/view/group?projectId='+projectInfo.id">
          <template #title><i class="user-solid"></i>团队</template>
        </el-menu-item>
        <el-sub-menu index="caiwu" class="hidden-sm-and-down">
          <template #title><i class="coin"></i>财务</template>
          <el-menu-item :index="'/xm/pro/project/view/contract?projectId='+projectInfo.id">
            <template #title><i class="s-data"></i>合同管理</template>
          </el-menu-item>
          <el-menu-item :index="'/xm/pro/project/view/budget?projectId='+projectInfo.id">
            <template #title><i class="coin"></i>预算</template>
          </el-menu-item>
          <el-menu-item :index="'/xm/pro/project/view/cost?projectId='+projectInfo.id">
            <template #title><i class="coin"></i>费用</template>
          </el-menu-item>
        </el-sub-menu>
        <el-menu-item :index="'/xm/pro/project/view/rpt?projectId='+projectInfo.id">
          <template #title><i class="s-data"></i>效能</template>
        </el-menu-item>
        <el-sub-menu index="zhishi" class="hidden-md-and-down">
          <template #title>知识</template>
          <el-menu-item :index="'/xm/project/view/file?projectId='+projectInfo.id">
            <template #title><i class="document"></i>文档</template>
          </el-menu-item>
          <el-menu-item :index="'/xm/project/view/env?projectId='+projectInfo.id">
            <template #title><i class="setting"></i>环境清单</template>
          </el-menu-item>
          <el-menu-item :index="'/xm/project/view/record?projectId='+projectInfo.id">
            <template #title><i class="edit-outline"></i>日志</template>
          </el-menu-item>
        </el-sub-menu>
        <el-sub-menu index="更多">
          <template #title>更多 </template>
          <el-menu-item :index="'/xm/project/view/workloadDay?projectId='+projectInfo.id">
            <template #title
              ><i class="video-camera"></i>每日工时</template
            >
          </el-menu-item>
          <el-menu-item :index="'/xm/pro/project/view/workloadMonth?projectId='+projectInfo.id">
            <template #title
              ><i class="video-camera"></i>每月工时</template
            >
          </el-menu-item>   
          <el-menu-item :index="'/xm/project/view/env?projectId='+projectInfo.id">
            <template #title><i class="setting"></i>环境清单</template>
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
          <el-menu-item index="/xm/project/mng/me">
              <template #title
                ><i class="back"></i>回到项目列表页</template
              >
            </el-menu-item> 
            <el-menu-item index="/">
              <template #title
                ><i class="s-home"></i>首页</template
              >
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
    ...mapState(useXmStore,['projectInfo']),
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
