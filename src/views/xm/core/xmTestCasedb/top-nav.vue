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
        
      <el-menu-item :index="'/xm/test/view/overview?casedbId='+testCasedb.id">
        <template #title> 
          
          <div class="flex items-center"
            style="max-width:30em;font-weight: 600; font-size: 24px; color: #E6A23C"  
            :title="testCasedb.name"
          >  
              &nbsp;<el-avatar   style="background-color:#E6A23C;width:50px;min-width: 50px;border: 2px solid silver;"><icon icon="fa:bug" size="24" color="red" style="margin-right:0px;"/></el-avatar> 
              &nbsp;<el-text size="large" truncated type="warning"><div style="font-weight: 600; font-size: 20px; color: #E6A23C" >{{ testCasedb.name}}</div></el-text> 
            
          </div> 
        </template>
        </el-menu-item>
        <el-menu-item :index="'/xm/test/view/case?casedbId='+testCasedb.id">
          <template #title><i class="odometer"></i>用例管理</template>
        </el-menu-item> 
				<el-menu-item label="需求" :index="'/xm/test/view/flow?casedbId='+testCasedb.id">
					 <template #title><i class="document"></i>用例评审</template> 
				</el-menu-item> 
        <el-menu-item :index="'/xm/test/view/plan?casedbId='+testCasedb.id">
          <template #title><i class="connection"></i>测试计划</template>
        </el-menu-item> 
        <el-menu-item :index="'/xm/test/view/env?casedbId='+testCasedb.id">
            <template #title><i class="setting"></i>环境变量</template>
          </el-menu-item> 
        <el-menu-item :index="'/xm/pro/test/view/rpt?casedbId='+testCasedb.id">
          <template #title><i class="time"></i>统计分析</template>
        </el-menu-item>
 
        <el-menu-item :index="'/xm/test/view/group?casedbId='+testCasedb.id">
          <template #title><i class="user-solid"></i>团队</template>
        </el-menu-item>
 
        <el-menu-item :index="'/xm/test/view/record?casedbId='+testCasedb.id">
          <template #title><i class="edit-outline"></i>日志</template>
        </el-menu-item>
        <el-sub-menu index="更多">
          <template #title>更多 </template> 
          <el-menu-item index="/forum">
            <template #title><i class="date"></i>论坛</template>
          </el-menu-item>
          <el-menu-item index="/im">
            <template #title><i class="date"></i>即聊</template>
          </el-menu-item>
          <el-menu-item index="/helpCenter">
            <template #title><i class="date"></i>客服</template>
          </el-menu-item>
          <el-menu-item index="/xm/test/casedb/mng" >
              <template #title
                ><i class="back"></i>回到测试库列表页</template
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
    ...mapState(useXmStore,['testCasedb']),
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
