<template>
	<ContentWrap>
        <template #header>
		<el-space wrap>
            
				<mdp-hi-query ref="hiQueryBtn"
          :column-configs="columnConfigs"
          v-model="hiQueryParams"
          @change="onHiQueryParamsChange"
        />
        <el-button icon="zoom-out" @click="searchReset()" title="重置查询条件并查询" ref="searchResetBtn"/>
   

        <mdp-export @excel="export2Excel()" ref="downloadBtn"/>
        <mdp-table-configs :column-configs="columnConfigs" v-model="checkedColumns" ref="columnConfigsBtn"/>   
 							 
 			    <el-button type="primary" @click="showAdd" icon="plus" plain/>
			    <el-button type="danger" v-loading="load.del" @click="batchDel" :disabled="this.sels.length===0 || load.del==true" icon="delete" plain/>

                
                      
            <el-button v-if="currOpType == 'select' && multiple == true" :disabled=" sels.length === 0" type="primary"
                @click="selectListConfirm" icon="check">确认选择</el-button>
  		</el-space>
    </template>
    <el-space wrap>
        <xm-product-select  v-if="!xmProduct" style="display:inline;"  :link-project-id="selProject?selProject.id:null" @change2="onProductSelected" @clear="clearProduct" />
			<el-input v-model="filters.name" style="width: 20%;" placeholder="模糊查询" clearable/>
            <el-button v-loading="load.list" :disabled="load.list==true" @click="searchTableDatas" icon="search">查询</el-button>

    </el-space>
</ContentWrap> 
			<!--列表 XmTestCasedb 测试用例库-->
			<el-table ref="table" :data="tableDatas" v-adaptive="{bottom:50}" @sort-change="sortChange" highlight-current-row v-loading="load.list" border @selection-change="selsChange" @row-click="rowClick" style="width: 100%;">
				<el-table-column  type="selection" width="55" show-overflow-tooltip fixed="left" />
				<el-table-column sortable type="index" width="55" show-overflow-tooltip  fixed="left" />
				<!--
				<el-table-column sortable prop="username" width="55" show-overflow-tooltip  fixed="left">
				    <span class="cell-text">  {{scope.row.username}}}  </span>
				    <span class="cell-bar"><el-input style="display:inline;" v-model="scope.row.username" placeholder="" @change="editSomeFields(scope.row,'username',$event)" :maxlength="22"/></span>
				</el-table-column>
				-->
 				<el-table-column prop="name" label="用例库名称" min-width="250">
				    <template #default="scope">
				        <span v-if="select!==true"><el-link @click="goCasedbInfo(scope.row)">{{scope.row.name}} </el-link> </span>
                        <span v-else> {{scope.row.name}}  </span> 
                    </template>
				</el-table-column> 
                    <el-table-column prop="productName" label="产品名称" min-width="120" show-overflow-tooltip>
                        <template #default="scope">
                            <span> {{scope.row.productName}} </span>
                        </template>
                    </el-table-column>
                    <el-table-column prop="cusername" label="负责人" min-width="120" show-overflow-tooltip>
                        <template #default="scope">
                            <xm-user-select :xm-product="{id:scope.row.productId,productName:scope.row.productName}" show-style="tag" v-model="scope.row.cuserid" :init-name="scope.row.cusername" :disabled="true"/>
                        </template>
                    </el-table-column>
                    <el-table-column prop="ctime" label="创建日期" min-width="120" show-overflow-tooltip>
                        <template #default="scope">
                            <span> {{scope.row.ctime}} </span>
                        </template>
                    </el-table-column> 
				<template v-if="currOpType=='select' && !multiple">
                    <el-table-column label="操作" width="180" fixed="right">
                        <template #default="scope">
                            <el-button type="primary" @click="$emit('select',scope.row)">选择</el-button>
                        </template>
				    </el-table-column>
                </template>

			</el-table>
			<el-pagination  layout="total, sizes, prev, pager, next" @current-change="handleCurrentChange" @size-change="handleSizeChange" :page-sizes="[10,20, 50, 100, 500]" :current-page="pageInfo.pageNum" :page-size="pageInfo.pageSize"  :total="pageInfo.total" style="float:right;" />
 
			<!--编辑 XmTestCasedb 测试用例库界面-->
			<mdp-dialog title="编辑测试用例库" v-model="editFormVisible"  width="70%"  append-to-body   :close-on-click-modal="false">
			    <xm-test-casedb-edit sub-op-type="edit" :formData="editForm"  :visible="editFormVisible" @cancel="editFormVisible=false" @submit="afterEditSubmit" />
			</mdp-dialog>

			<!--新增 XmTestCasedb 测试用例库界面-->
			<mdp-dialog title="新增测试用例库" v-model="addFormVisible"  width="70%"  append-to-body  :close-on-click-modal="false">
			    <xm-test-casedb-edit sub-op-type="add" :xm-product="product" :sel-project="selProject" :visible="addFormVisible" @cancel="addFormVisible=false" @submit="afterAddSubmit" />
			</mdp-dialog> 
</template>

<script>

import util from '@/components/mdp-ui/js/util';//全局公共库
import config from '@/api/mdp_pub/mdp_config';//全局公共库
import { listXmTestCasedb, delXmTestCasedb, batchDelXmTestCasedb,editSomeFieldsXmTestCasedb } from '@/api/xm/core/xmTestCasedb';
import  XmTestCasedbEdit from './XmTestCasedbEdit.vue';//新增修改界面
import { mapState } from 'pinia'
import { useUserStore } from '@/store/modules/user'
import { useXmStore,useXmStore2 } from '@/store/modules/xm'



		
import { MdpTableMixin } from '@/components/mdp-ui/mixin/MdpTableMixin.js'

export default {
	mixins:[MdpTableMixin],
    name:'xmTestCasedbMng',
    components: {
        XmTestCasedbEdit
    },
    props:['visible','xmProduct','selProject' ],
    computed: {
        ...mapState(useUserStore,['userInfo']), 

    },
    watch:{
        visible(val){
            if(val==true){
                this.initData();
                this.searchTableDatas()
            }
        }
    },
    data() {
        return {
            filters: {
                name: '', 
            }, 
            pageInfo:{//分页数据
                total:0,//服务器端收到0时，会自动计算总记录数，如果上传>0的不自动计算。
                pageSize:10,//每页数据
                count:true,//是否需要重新计算总记录数
                pageNum:1,//当前页码、从1开始计算
                orderFields:[],//排序列 如 ['sex','student_id']，必须为数据库字段
                orderDirs:[]//升序 asc,降序desc 如 性别 升序、学生编号降序 ['asc','desc']
            },
            addFormVisible: false,//新增xmTestCasedb界面是否显示
            addForm: {
                id:'',name:'',cuserid:'',cusername:'',ctime:'',cbranchId:'',productId:'',productName:''
            },

            editFormVisible: false,//编辑界面是否显示
            editForm: {
                id:'',name:'',cuserid:'',cusername:'',ctime:'',cbranchId:'',productId:'',productName:''
            }, 
            apis:{
                list: listXmTestCasedb,
                del: delXmTestCasedb,
                batchDel: batchDelXmTestCasedb,
                editSomeFields: editSomeFieldsXmTestCasedb
            },
            product:null,
        }
    },//end data
    methods: {
   

        //显示编辑界面 XmTestCasedb 测试用例库
        showEdit: function ( row,index ) {
            this.editFormVisible = true;
            this.editForm = Object.assign({}, row);
        },
        //显示新增界面 XmTestCasedb 测试用例库
        showAdd: function () {
            this.addFormVisible = true;
            //this.addForm=Object.assign({}, this.editForm);
        },
        
        initCurrData: function(){
            if(this.xmProduct?.id){ 
                this.product={...this.xmProduct}
            }else{
                this.product=null
            }
        },
        preQueryParamCheck(params){
            if(this.xmProduct?.id){
                params.productId=this.xmProduct.id
            }
            if(this.product?.id){
                params.productId=this.product.id
            }
            if(this.selProject?.id){
                params.linkProjectId=this.selProject.id
            }
            return true;
        },

        clearProduct(){
            this.product=null;
            this.searchTableDatas();
        },
        onProductSelected(product){
            this.product=product;
            this.searchTableDatas();
        },
        goCasedbInfo(row){
            useXmStore2().setTestCasedb(row) 
            this.$router.push({
                name:'testOverview',
                query:{
                    casedbId:row.id
                }
            })
        }
    },//end methods
    mounted() { 
        this.searchTableDatas(); 
    }
}

</script>

<style scoped />
