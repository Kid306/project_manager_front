<template>
        <el-popover :show-after="200"> 
          <template #reference> 
            <el-button v-if="hidden!==true" icon="download" title="导出当前结果数据"  plain />
          </template>
          <template #default>
            <el-space wrap> 
              <el-button v-if="excel!==false" @click="excelClick()" title="导出当前结果数据为excel" type="success"  plain><icon icon="fa:file-excel-o"/></el-button>
              <el-button v-if="word!==false" @click="wordClick()" title="导出当前结果数据word" type="primary" plain><icon icon="fa:file-word-o"/></el-button>
              <el-button v-if="pdf!==false" @click="pdfClick()" title="导出当前结果数据pdf" type="primary" plain><icon icon="fa:file-pdf-o"/></el-button>
              <slot>

              </slot>
            </el-space>
          </template>
        </el-popover>
   
</template>

<script>
 
export default {
  name: 'MdpLmrBox',   
  watch:{ 
  },
  props:{
    hidden:{
      type: Boolean,
      default:false
    },  
    excel:{
      type: Boolean,
      default:true
    }, 
    word:{
      type: Boolean,
      default:false
    },  
    pdf:{
      type: Boolean,
      default:false
    },  
  },
  data() {
    return {

    }
  },
  methods: {
     wordClick(){
      if(this.word===false){
        this.$message('不支持')
        return;
      }
      this.$emit('word')
     }, 
     excelClick(){
      if(this.excel===false){
        this.$message('不支持')
        return;
      }
      this.$emit('excel')
     }, 
     pdfClick(){
      if(this.pdf===false){
        this.$message('不支持')
        return;
      }
      this.$emit('pdf')
     }, 
  },
  mounted(){ 
  }
}

</script>
