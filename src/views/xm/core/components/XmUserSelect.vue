<template>
   <mdp-select-user :key="xmProduct?.id+'_'+selProject?.id" v-model="myVal" ref="select" :width="width" :clearable="clearable" :init-name="initName" :initLoad="initLoad" :displayLoad="displayLoad" :show-style="showStyle" :placeholder="placeholder" @change2="onChange2" @change3="onChange3" @clear="onClear" @change="onChange" @click="onRowClick" :disabled="disabled" :label="label">
      <template #toolbar> 
        <el-button  icon="search" @click="$refs['tableDialog'].open()" v-if="xmProduct?.id||selProject?.id">项目组成员</el-button>
        <el-button v-if="userInfo?.userid" @click="onToolbarClick({userid:userInfo?.userid,username:userInfo?.username,branchId:userInfo?.branchId})">我</el-button>

        <el-button v-if="selProject?.admUserid" @click="onToolbarClick({userid:selProject.admUserid,username:selProject.admUsername})">项目总控</el-button>
        <el-button v-if="selProject?.pmUserid" @click="onToolbarClick({userid:selProject.pmUserid,username:selProject.pmUsername})">项目经理</el-button>
        <el-button v-if="selProject?.assUserid" @click="onToolbarClick({userid:selProject.assUserid,username:selProject.assUsername})">项目副理</el-button>
        <el-button v-if="xmProduct?.admUserid" @click="onToolbarClick({userid:xmProduct.admUserid,username:xmProduct.admUsername})">产品总控</el-button>
        <el-button v-if="xmProduct?.pmUserid" @click="onToolbarClick({userid:xmProduct.pmUserid,username:xmProduct.pmUsername})">产品经理</el-button>
        <el-button v-if="xmProduct?.assUserid" @click="onToolbarClick({userid:xmProduct.assUserid,username:xmProduct.assUsername})">产品副理</el-button>
        <slot name="toolbar"></slot>
      </template>
    
    </mdp-select-user>  
     <mdp-dialog ref="tableDialog" width="90%" v-if="xmProduct?.id||selProject?.id">
      <template #default = "{dialog}">
        <XmGroupUserSelect subOpType="select" 
        :xmProduct="xmProduct" 
        :selProject="selProject"
        :multiple="multiple"
          @cancel="dialog.close()"
          @select="onTableDataSelect"
         />
      </template>
    </mdp-dialog> 
</template>

<script>
 
import { mapState } from 'pinia'
import { useUserStore } from '@/store/modules/user'
 
// 在 Vue 3 中，可以使用 defineAsyncComponent 方法来创建异步组件
import { defineAsyncComponent } from 'vue';
 
// 创建一个异步组件，它会从一个外部API动态导入组件
const XmGroupUserSelect = defineAsyncComponent(() =>
  import('./XmGroupUserSelect.vue') // 假设LazyComponent.vue是你想要懒加载的组件
);
 
export default {
  components: { XmGroupUserSelect },
  emits:['change','change2','change3','row-click','clear','select'],
  name: 'XmUserSelect',
  computed:{
    
    ...mapState(useUserStore,[
		      'userInfo','roles'
				]), 
    myVal:{
      set(val){
        this.$emit('update:modelValue',val)
      },
      get(){
        return this.modelValue
      }
    }
  },
  props:{  
    xmProduct:Object, 
    selProject: Object, 
    menuId:{
      type: String,
      default:null,
    },
    multiple: Boolean,
    label:{
      type:String,
      default:"用户"
    },
    placeholder:{
      type:String,
      default:"用户"
    },
    modelValue:{
      type:String,
      default:null,
    }, 
    disabled:{
      type:Boolean,
      default:false
    },
    showStyle:{
      type:String,
      default:'origin'
    },
    width:{
      type: String,
      default: null
    },   
    clearable:{
      type:Boolean,
      default:true,
    },
    /**
    * 当tag 模式下，定位出问题后，设置此参数可解决问题
    */
    relative:{
      type: Boolean,
      default: false
    },
    /**
     * 初始化时，如果已知名称，用此属性可以反显
     */
    initName:{
      type: [String,Array],
      default: null
    },
    
    /**
     * 初始化时，initLoad=true将进行远程调用，否则不进行远程调用
     */
     initLoad:{
      type: Boolean,
      default: false
    },
    /**
    * 是否根据modelValue值变化进行远程调用加载数据进行名字反显。用于只知道id，不知道name的情况下，自动反显所用。
    * 当initName有值时，该参数无效
    */
    displayLoad:{
      type: Boolean,
      default: false,
    },
    title:{
      type: String,
      default:'用户'
    }
  },
  data(){
    return {  
    }
  },
  methods:{  
    onToolbarClick(user){
      if(this.multiple){
      this.$refs['select'].onTableDataSelect([user])
      this.$refs['tableDialog'].close();
      }else{
      this.$refs['select'].onTableDataSelect(user)
      this.$refs['tableDialog'].close();
      }
    },
    onTableDataSelect(row){  
      if(this.multiple){
        if(row.some(k=>k.currNodeType!='groupUser')){
          this.$message.error("请选择用户节点")
          return ;
        }
      }else{
        if(row.currNodeType!='groupUser'){ 
          this.$message.error("请选择用户节点")
          return ;
        }
      }
      this.$refs['select'].onTableDataSelect(row)
      this.$refs['tableDialog'].close(); 
    },
    onChange2(row){ 
      
      this.$emit("select", row); 
      this.$emit("change2", row);
    },
    onChange3(row){ 
      this.$emit("change3", row);
    },
    onChange(val){  
      this.$emit("change", val); 
    },
    onClear(){ 
      this.$emit("clear");
    },
    onRowClick(row){
      this.$emit('row-click',row)
    }
  },
  mounted(){ 
  }, 
}
</script>
<style lang="scss" scoped /> 
  
