<template>
<el-form :model="editForm"  label-width="120px" :rules="editFormRules" ref="editFormRef">
    <el-card header="消息内容">
        
            <div>{{ editForm.msg }}</div> 
        <el-form-item label="跳转地址" prop="url" v-if="editForm.url">
            <el-link :href="editForm.url">{{ editForm.url }}</el-link>
         </el-form-item>
    </el-card>
    <el-card header="发送方"> 
        <el-form-item label="发送人" prop="sendUsername">
            {{ editForm.sendUsername }}({{ editForm.sendUserid }})
         </el-form-item>
        <el-form-item label="发送时间" prop="operTime">
            {{ editForm.operTime }}
         </el-form-item> 
        
        <el-form-item label="ip地址" prop="ip">
            {{ editForm.ip }}
         </el-form-item>
    </el-card>
    <el-card header="接收方"> 
        <el-form-item label="用户名称" prop="toUsername">
            {{ editForm.toUsername }} ({{ editForm.toUserid }})
         </el-form-item>
        <el-form-item label="是否已读" prop="hadRead">
            <mdp-select  show-style="tag" v-model="editForm.hadRead" :maxlength="50"   :disabled="true" :options="[{id:'1',name:'已读'},{id:'0',name:'未读'}]"/>
         </el-form-item>
    </el-card>   
</el-form>
<div class="footer">
    <el-button @click="close" icon="close">关闭</el-button>
    <el-button icon="submit" v-if="currOpType=='add'|| (currOpType=='edit' && someOpen==false)" v-loading="load.edit" type="primary" @click="saveSubmit" :disabled="disBtn('addBtn') || !checkBtnQx('addBtn',menuDefId) || load.edit">提交</el-button>
</div>
</template>

<script> 
import { MdpFormMixin } from '@/components/mdp-ui/mixin/MdpFormMixin.js';
import { mapState } from 'pinia'
import { useUserStore } from '@/store/modules/user'

export default {
    name:'NotifyMsgForm',
    mixins:[MdpFormMixin],
    computed: {
        ...mapState(useUserStore,['userInfo'])
    },
    props:{
       // 是否开启editSomeField模式
       someOpen:{
          type: Boolean,
          default: true,
      },
    },
    data() {
        return {
            menuDefId:'',//menu_def.id 菜单表菜单编号，用于按钮权限判断
            pkNames:["id"],//表格主键的java属性名称，驼峰命名，默认为id,支持多主键
            currOpType:'add',//表单 add、edit，所有按钮可动、detail-只看不能操作
            editFormRules: {
                id:[
                //{ required: true, message: '此项必填', trigger: 'change' },
                //{ min: 1,max: 200, message: '长度在1到200之间', trigger: 'change'}
                ]
            },
            editForm: {
                id:'',sendUserid:'',sendUsername:'',operTime:'',objType:'',msg:'',gloNo:'',branchId:'',ip:'',bizId:'',pbizId:'',bizName:'',toUserid:'',toUsername:'',hadRead:'',url:''
            },
            //增删改查(含批量)接口
            apis:{
                queryById: this.$mdp.queryNotifyMsgById,
                add: this.$mdp.addNotifyMsg,
                edit: this.$mdp.editNotifyMsg,
                editSomeFields: this.$mdp.editSomeFieldsNotifyMsg
            },
        }
    },
    methods: {
         //由组件扩展添加其它的初始页面的逻辑(mounted+onOpen都会调用此函数，建议只添加公共逻辑)
         initCurrData(){

         },
        /**
         * 检查参数是否满足调用后台接口的条件
         * @returns true / false
         */
        preParamCheck(params){
            return true;
        },
        /**
         * 对修改的字段进行判断，返回false ,将取消更新数据库,由组件扩展
         * @param {*} row 当前选中的行
         * @param {*} fieldName 修改的字段名
         * @param {*} $event 修改后的值
         * @param {*} params 将要提交服务器的参数
         * @returns true/false 返回false ,将取消更新数据库
         */
        editSomeFieldsCheck(row,fieldName,$event,params){
            params[fieldName]=$event
            return true;
        },
    },
    mounted() {

    }
}

</script>

<style scoped>

</style>