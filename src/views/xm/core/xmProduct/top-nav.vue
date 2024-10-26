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
        
      <el-menu-item :index="'/xm/product/view/overview?productId='+xmProduct.id">
        <template #title>
          <div class="flex items-center"
            style="max-width: 25em;"  
            :title="xmProduct.productName"
          >
            &nbsp; <el-avatar style="background-color:#409EFF;width:50px;min-width: 50px;border: 2px solid silver;">产品</el-avatar>&nbsp;<el-text size="large" truncated type="primary"><div style="font-weight: 600; font-size: 20px; color: #409EFF">{{ xmProduct.productName }}</div></el-text> 
          </div> 
        </template> 
        </el-menu-item>
        <el-menu-item :index="'/xm/product/view/project?productId='+xmProduct.id">
          <template #title><i class="odometer"></i>项目</template>
        </el-menu-item> 
				<el-menu-item label="需求" :index="'/xm/product/view/menu?productId='+xmProduct.id">
					 <template #title><i class="document"></i>需求</template> 
				</el-menu-item> 
				<el-menu-item label="模块" :index="'/xm/product/view/func?productId='+xmProduct.id">
					 <template #title><i class="document"></i>模块</template> 
				</el-menu-item> 
        <el-menu-item :index="'/xm/product/view/iteration?productId='+xmProduct.id">
          <template #title><i class="connection"></i>迭代</template>
        </el-menu-item>

        <el-menu-item :index="'/xm/product/view/plan?productId='+xmProduct.id">
          <template #title><i class="time"></i>计划</template>
        </el-menu-item>
        <el-menu-item :index="'/xm/product/view/task?productId='+xmProduct.id">
          <template #title><i class="time"></i>任务</template>
        </el-menu-item>
        <!--
        <el-menu-item :index="'/xm/product/view/task?productId='+xmProduct.id" class="hidden-md-and-down">
          <template #title><i class="s-operation"></i>任务</template>
        </el-menu-item>
        -->
        <el-menu-item :index="'/xm/product/view/test/plan?productId='+xmProduct.id">
          <template #title><i class="question"></i>测试</template>
        </el-menu-item>
        <el-menu-item :index="'/xm/product/view/question?productId='+xmProduct.id">
          <template #title><i class="question"></i>缺陷</template>
        </el-menu-item>
        <el-menu-item :index="'/xm/product/view/group?productId='+xmProduct.id">
          <template #title><i class="user-solid"></i>团队</template>
        </el-menu-item>
        <el-sub-menu index="caiwu" class="hidden-sm-and-down">
          <template #title><i class="coin"></i>财务</template>
          <el-menu-item :index="'/xm/pro/product/view/contract?productId='+xmProduct.id">
            <template #title><i class="s-data"></i>合同管理</template>
          </el-menu-item>
          <el-menu-item :index="'/xm/pro/product/view/budget?productId='+xmProduct.id">
            <template #title><i class="coin"></i>预算</template>
          </el-menu-item>
          <el-menu-item :index="'/xm/pro/product/view/cost?productId='+xmProduct.id">
            <template #title><i class="coin"></i>费用</template>
          </el-menu-item>
        </el-sub-menu>
        <el-menu-item :index="'/xm/pro/product/view/rpt?productId='+xmProduct.id">
          <template #title><i class="s-data"></i>效能</template>
        </el-menu-item>
        <el-sub-menu index="zhishi" class="hidden-md-and-down">
          <template #title>知识</template>
          <el-menu-item :index="'/xm/product/view/file?productId='+xmProduct.id">
            <template #title><i class="document"></i>文档</template>
          </el-menu-item>
          <el-menu-item :index="'/xm/product/view/env?productId='+xmProduct.id">
            <template #title><i class="setting"></i>环境清单</template>
          </el-menu-item>
          <el-menu-item :index="'/xm/product/view/record?productId='+xmProduct.id">
            <template #title><i class="edit-outline"></i>日志</template>
          </el-menu-item>
        </el-sub-menu>
        <el-sub-menu index="更多">
          <template #title>更多 </template>
          <el-menu-item :index="'/xm/product/view/workloadDay?productId='+xmProduct.id">
            <template #title
              ><i class="video-camera"></i>每日工时</template
            >
          </el-menu-item>
          <el-menu-item :index="'/xm/pro/product/view/workloadMonth?productId='+xmProduct.id">
            <template #title
              ><i class="video-camera"></i>每月工时</template
            >
          </el-menu-item>   
          <el-menu-item :index="'/xm/product/view/env?productId='+xmProduct.id">
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
          <el-menu-item index="/xm/product/mng" >
              <template #title
                ><i class="back"></i>回到产品列表页</template
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
    ...mapState(useXmStore,["xmProduct"]),
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
