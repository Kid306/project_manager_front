<template>
  <el-row :gutter="5">
    <el-col :span="myExpand?lspan:0"> 
      <slot name="left"></slot>
    </el-col>
    <el-col :span="myExpand?(24-lspan):24">
       <slot>

       </slot>
    </el-col>
  </el-row>
   
</template>

<script>
 
export default {
  name: 'MdpLmrBox',   
  watch:{
    expand(){
       this.myExpand=this.expand
    }
  },
  props:{
    lspan:{
      type: Number,
      default:6
    }, 
    expand:{
      type: Boolean,
      default: true,
    }
  },
  data() {
    return {
      myExpand:false,

    }
  },
  methods: {
     doExpand(expand){
      this.myExpand=expand
     },
     toggle(){
      this.myExpand=!this.myExpand
     }
  },
  mounted(){
    this.myExpand=this.expand
  }
}

</script>
