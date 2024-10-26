<template>   
  <el-card> 
      <el-form v-model="procinstExpand" label-position="left" label-width="150">
        <el-form-item label="主办人" prop="sponsors">
          <MdpSelectUser v-model="procinstExpand.sponsors" multiple split="," width="100%"/>
        </el-form-item>
        <el-form-item label="监控人"  prop="monitors">
          <MdpSelectUser v-model="procinstExpand.monitors"  multiple split=","  width="100%"/>
        </el-form-item>
        
        <el-form-item label="计划完成时间">
          <el-date-picker v-model="procinstExpand.planFinishTime" format="YYYY-MM-DD" value-format="YYYY-MM-DD HH:mm:ss"/>
        </el-form-item>
      </el-form> 
  </el-card>
        <ProcMainQx /> 
</template>

<script>
import seq from '@/components/mdp-ui/js/sequence';//全局公共库
import util from '@/components/mdp-ui/js/util';//全局公共库import
import config from '@/api/mdp_pub/mdp_config';//全局公共库import 
import {mapState} from 'pinia'
import {useUserStore} from '@/store/modules/user'  
import ProcMainQx from './ProcMainQx.vue';

export default {
  name: 'StartFlow',
  computed: {
    ...mapState(useUserStore, [
      'userInfo', 'myDepts'
    ]), 
  }, 
  components: {  
    ProcMainQx
  },
  watch: { 
  },
  data() {
    
    return {
      procinstExpand:{sponsors:'',monitors:'',planFinishTime:''},
      procdef:null,
      activeName:'1',
      bpmnXml:null,
    }
  },

  methods:{
    toBpmnDesigner(){
      if(!this.procdef||!this.procdef.key){
        this.$message.error("请先选择流程图")
      }
      this.$router.push({name:'WfDesigner',query:{modelKey:this.procdef.key}})
    },
    onStartPre(res){
      
      this.bpmnXml=res.bpmnXml 
    },
    onFormSubmit(formData,fcApi){
      

    },
    onProcdefSelect(procdef){
      if(procdef.suspensionState!='1'){
        this.$message.error("流程状态必须为激活状态") 
        return;
      }
      this.procdef=procdef
      this.activeName='2'
    }
  },
  mounted() {
     

  },  
}

</script>

<style scoped>

</style>
