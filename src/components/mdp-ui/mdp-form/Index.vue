<template> 
 <slot :page="this" :editForm="editForm">
    <el-form v-model="editForm" :label-position="labelPosition" :label-width="labelWidth">
        <el-form-item v-for="col,idx in columnConfigs" :key="idx" :prop="col.property" :label="col.label">
            <mdp-select  v-if="col.itemCode" :itemCode="col.itemCode" type="select" v-model="editForm[col.property]" :disabled="disField" />

            <mdp-input v-else-if="col.colType=='String'" v-model="editForm[col.property]" :disabled="disField"/>
            <mdp-date-picker v-else-if="col.colType=='Date'" type="date" placeholder="选择日期" v-model="editForm[col.property]"  value-format="YYYY-MM-DD HH:mm:ss" format="YYYY-MM-DD" :disabled="disField"/>
            <mdp-select  v-else-if="col.colType=='boolean' || col.colType=='Boolean'" type="radio" v-model="editForm[col.property]" :disabled="disField" :options="[{id:'0',name:'否'},{id:'1',name:'是'}]" />
 
            <mdp-number v-else-if="col.colType=='Number'" v-model="editForm[col.property]" :disabled="disField"/>
            <mdp-number v-else-if="col.colType=='Integer' || col.colType=='int'" v-model="editForm[col.property]" :precision="0" :disabled="disField"/>
            <mdp-input v-else v-model="editForm[col.property]"  :disabled="disField"/>
        </el-form-item> 
    </el-form>
</slot>
<slot name="footer" :page="this">
    <el-row class="footer"  v-if="showBtn!==false">
        <el-button icon="close"  @click="close">
            关闭
        </el-button> 
        <el-button v-if="currOpType=='add' || currOpType=='subAdd'" v-loading="load.edit" type="primary" @click="saveSubmit" :disabled="disBtn('addBtn') || !checkBtnQx('addBtn',menuDefId) || load.edit">提交</el-button>
    </el-row> 
</slot>
</template>
    
<script>
import { MdpFormMixin } from '@/components/mdp-ui/mixin/MdpFormMixin.js'
export default {
  name: 'MdpForm',
  mixins: [MdpFormMixin], 
}
</script> 