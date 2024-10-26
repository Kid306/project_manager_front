<template>
    <el-row :gutter="5">
        <el-col :span="toggle?0:6">
             <div v-show="!toggle">
                <xm-func-tree v-if="hadInit" :xm-product="xmProductCpd" @check-change="onXmFuncRowClick" @product-select="product=$event" @product-clear="product=null"/>
            </div>
        </el-col>
        <el-col :span="toggle?24:18">

            <ContentWrap>
                <template #header>
                    <el-space wrap>  
                        <el-button :icon="toggle?'DArrowRight':'DArrowLeft'" @click="onToggleClick" plain title="展开/收起左边"/>
                         
                        <mdp-hi-query ref="hiQueryBtn" :column-configs="columnConfigs" v-model="hiQueryParams"
                            @change="onHiQueryParamsChange" />
                        <el-button icon="zoom-out" @click="searchReset()" title="重置查询条件并查询" ref="searchResetBtn" />


                        <mdp-export @excel="export2Excel()" ref="downloadBtn" />
                        <mdp-table-configs :column-configs="columnConfigs" v-model="checkedColumns"
                            ref="columnConfigsBtn" />

                        <el-button @click="$refs['kanbanDlg'].open()"  title="看板" type="success" plain>板</el-button>  
                        <span v-if="currOpType=='mng'">

                        <el-button type="primary" @click="showAdd" icon="plus" plain />
                        <el-button type="danger" v-loading="load.del" @click="batchDel"
                            :disabled="this.sels.length === 0 || load.del == true" icon="delete" plain />
                        </span>
                        
                        <span v-if="currOpType == 'select' && multiple == true">
                            <el-button :disabled=" sels.length === 0" type="primary"
                                @click="selectListConfirm" icon="check">确认选择</el-button>
                        </span>
                        <XmTestCasedbSelect v-if="(xmProductCpd?.id||product?.id) && !xmTestCasedb?.id" width="100%" v-model="filters.casedbId"  :xmProduct="xmProductCpd||product"  @change2="testCasedb=$event" @clear="testCasedb=null"/>

                    </el-space>
                </template>
                <el-space wrap>
                     <xm-iteration-select v-if="xmProductCpd?.id||product?.id" v-model="filters.iterationId" :xm-product="xmProductCpd?.id?xmProduct:product"/>
                    <xm-menu-select v-if="xmProductCpd?.id" v-model="filters.menuId" :xm-product="xmProductCpd||product"/>
                    <xm-user-select placeholder="负责人" :xm-product="xmProductCpd" v-model="filters.cuserid" />
                    <mdp-select placeholder="用例状态" clearable itemCode="testCaseStatus" v-model="filters.caseStatus"
                        effect="dark" />
                    <mdp-select placeholder="测试方式" clearable itemCode="testType" v-model="filters.testType"
                        effect="dark" />

                        <mdp-select placeholder="优先级" clearable itemCode="priority" v-model="filters.cpriority"
                        effect="dark" />
                    <el-input v-model="filters.caseName" style="width: 20%;" placeholder="名称"  clearable />

                    <el-button v-loading="load.list" :disabled="load.list == true" @click="searchTableDatas" icon="search"
                        type="primary">查询</el-button>

                </el-space>

            </ContentWrap>
            <!--列表 XmTestCase 测试用例-->
            <el-table ref="table" :data="tableDatas" v-adaptive="{ bottom: 50 }" @sort-change="sortChange"
                highlight-current-row v-loading="load.list" border @selection-change="selsChange" @row-click="rowClick"
                style="width: 100%;">
                <el-table-column type="selection" width="55" show-overflow-tooltip fixed="left" />
                <!--
                        <el-table-column sortable prop="username" width="55" show-overflow-tooltip  fixed="left">
                            <span class="cell-text">  {{scope.row.username}}}  </span>
                            <span class="cell-bar"><el-input style="display:inline;" v-model="scope.row.username" placeholder="" @change="editSomeFields(scope.row,'username',$event)" :maxlength="22"/></span>
                        </el-table-column>
                        -->
                <el-table-column prop="caseName" label="标题" width="400"  sortable>
                         <template #default="scope">
							<el-popover placement="right-start"
								:width="200"  :show-after="200"
 							>
							<template #reference>
								<el-link @click="showEdit(scope.row)">{{ scope.row.sortNo||(scope.$index+1) }} {{ scope.row.caseName }}</el-link>
							</template>
							<template #default>
								<el-button @click="copy2(scope.row, scope.$index)" icon="document-copy" type="warning" title="复制一行除了主键不一样，其它都一样的数据">复制</el-button>
                                <el-button @click="showEdit(scope.row)" icon="edit" type="primary">编辑</el-button>
								</template>
							</el-popover> 
						</template>
                 </el-table-column>
                <el-table-column prop="caseStatus" label="状态" width="120" show-overflow-tooltip itemCode="testCaseStatus"  sortable>
                    <template #default="scope">
                        <mdp-select show-style="tag" itemCode="testCaseStatus" v-model="scope.row.caseStatus" effect="dark"
                            @change="editSomeFields(scope.row, 'caseStatus', $event)" />
                    </template>
                </el-table-column>
                <el-table-column prop="rate" label="进度" width="120" show-overflow-tooltip sortable>
                    <template #default="scope">
                    <span
                        :style="{ borderRadius: '30px', color: scope.row.rate >= 100 ? 'green' : 'blue' }"
                    >
                        {{ (scope.row.rate != null ? scope.row.rate : 0) + '%' }}
                    </span>
                    </template>
                </el-table-column>
                <el-table-column prop="testType" label="测试方式" min-width="120" show-overflow-tooltip itemCode="testType"  sortable>
                    <template #default="scope">
                        <mdp-select show-style="tag" itemCode="testType" v-model="scope.row.testType" effect="dark"
                            @change="editSomeFields(scope.row, 'testType', $event)" />
                    </template>
                </el-table-column>                
                <el-table-column prop="cpriority" label="优先级" min-width="120" show-overflow-tooltip itemCode="priority"  sortable>
                    <template #default="scope">
                        <mdp-select show-style="tag" itemCode="priority" v-model="scope.row.cpriority" effect="dark"
                            @change="editSomeFields(scope.row, 'cpriority', $event)" />
                    </template>
                </el-table-column>
                <el-table-column prop="cusername" label="负责人" min-width="120" show-overflow-tooltip  sortable>
                    <template #default="scope">
                        <xm-user-select :xm-product="xmProductCpd?.id?xmProductCpd:{id:scope.row.productId}"  show-style="tag" v-model="scope.row.cuserid" :init-name="scope.row.cusername"
                            @change2="editSomeFields(scope.row, 'cuserid', $event)" />
                    </template>
                </el-table-column>
                <el-table-column prop="funcName" label="模块" min-width="150" show-overflow-tooltip sortable>
                    <template #default="scope">
                        <span> {{ scope.row.funcName }} </span>
                    </template>
                </el-table-column>
                <el-table-column prop="verNum" label="版本号" min-width="80" show-overflow-tooltip sortable/>

                <el-table-column prop="menuName" label="故事" min-width="150" show-overflow-tooltip  sortable/>
                <el-table-column prop="casedbId" label="用例库号" min-width="150" show-overflow-tooltip kbName="casedbName"  sortable/>
                <el-table-column prop="casedbName" label="用例库" min-width="150" show-overflow-tooltip kbName="casedbName"  sortable/>

                <el-table-column prop="actWorkload" label="实际工时"  width="120" show-overflow-tooltip sortable/> 
					<el-table-column prop="initWorkload" label="原估工时"  width="120" show-overflow-tooltip sortable/> 
					<el-table-column prop="budgetWorkload" label="预估工时"  width="120" show-overflow-tooltip sortable/> 
                <el-table-column prop="id" label="用例号" min-width="150" show-overflow-tooltip kbName="caseName"  sortable/>
                <el-table-column prop="funcId" label="模块号" min-width="150" show-overflow-tooltip kbName="funcName"  sortable/>
                <el-table-column prop="menuId" label="故事号" min-width="150" show-overflow-tooltip kbName="menuName"  sortable/>
                <el-table-column prop="cuserid" label="负责人号" min-width="150" show-overflow-tooltip kbName="cusername"  sortable/>
                <el-table-column prop="productId" label="产品号" min-width="150" show-overflow-tooltip  sortable/>
                <el-table-column prop="sortNo" label="排序号" min-width="150" show-overflow-tooltip  sortable/>
                <el-table-column prop="ctime" label="创建时间" min-width="150" show-overflow-tooltip sortable colType="date"/>
                <template v-if="currOpType == 'select' && !multiple"> 
                    <el-table-column label="操作" min-width="100" fixed="right">
                        <template #default="scope">
                            <el-button type="primary" @click="$emit('select', scope.row)">选择</el-button>
                        </template>
                    </el-table-column>
                </template>
            </el-table>
            <el-pagination layout="total, sizes, prev, pager, next" @current-change="handleCurrentChange"
                @size-change="handleSizeChange" :page-sizes="[10, 20, 50, 100, 500]" :current-page="pageInfo.pageNum"
                :page-size="pageInfo.pageSize" :total="pageInfo.total" style="float:right;" />


        </el-col>
    </el-row> 
        <!--编辑 XmTestCase 测试用例界面-->
        <mdp-dialog ref="editDlg" title="编辑测试用例" v-model="editFormVisible" fullscreen width="90%" top="20px" append-to-body
            :close-on-click-modal="false">
            <template #default="{ data, visible, dialog }">
                <xm-test-case-edit sub-op-type="edit" :xm-func="xmFunc" :formData="data.formData" :visible="visible"
                    :xm-test-casedb="xmTestCasedb" @cancel="dialog.close()"
                    @submit="($event) => { afterEditSubmit($event), dialog.close() }" @edit-fields="onEditFields" />

            </template>
        </mdp-dialog>

        <!--新增 XmTestCase 测试用例界面-->
        <mdp-dialog ref="addDlg" title="新增测试用例" v-model="addFormVisible" fullscreen width="90%" top="20px" append-to-body
            :close-on-click-modal="false">
            <template #default="{ data, visible, dialog }">
                <xm-test-case-edit sub-op-type="add" :xm-func="xmFunc" :xm-menu="xmMenu" :formData="data.formData" :xm-product="xmProduct"
                    :xm-test-casedb="testCasedb" :visible="visible" @cancel="dialog.close()"
                    @submit="($event) => { afterAddSubmit($event); dialog.close() }" />

            </template>
        </mdp-dialog> 
        <mdp-dialog ref="kanbanDlg" :title="'用例看板'" fullscreen append-to-body :close-on-click-modal="false">
            <MdpTableKanban  @del="(d,cb)=>handleDel(d,0,cb)"
                @plus="(cb)=>showAdd(cb)"
                @edit="(d,cb)=>showEdit(d,cb)"
                v-model="tableDatas" 
                :columnConfigs="columnConfigs"
                itemKey="id" 
                :contentFun="(item)=>item.caseName"
                > 
                <template #toolbar="{element}">
                <MdpSelect showStyle="tag" itemCode="testCaseStatus" disabled v-model="element.caseStatus"/>
                </template>
            </MdpTableKanban>
    </mdp-dialog>
    
</template>

<script>

import util from '@/components/mdp-ui/js/util';//全局公共库
import config from '@/api/mdp_pub/mdp_config';//全局公共库
import { listXmTestCase, delXmTestCase, batchDelXmTestCase, editSomeFieldsXmTestCase, addXmTestCase } from '@/api/xm/core/xmTestCase';
 
import { defineAsyncComponent } from 'vue';
import { mapState } from 'pinia'
import { useUserStore } from '@/store/modules/user'
import { MdpTableMixin } from '@/components/mdp-ui/mixin/MdpTableMixin';
export default {
    mixins: [MdpTableMixin],
    name: 'xmTestCaseMng',
    components: {
        XmTestCaseEdit: defineAsyncComponent(()=>import('./XmTestCaseEdit.vue'))
    },
    props: ['visible', 'xmTestCasedb', 'scene', 'xmMenu', 'xmProduct'],
    computed: {
        ...mapState(useUserStore, ['userInfo']),
        xmProductCpd() {
            if (this.xmProduct && this.xmProduct.id) {
                return this.xmProduct
            }
            if (this.xmTestCasedb && this.xmTestCasedb.id) {
                return { id: this.xmTestCasedb.productId, productName: this.xmTestCasedb.productName }
            }
            if (this.xmMenu && this.xmMenu.id) {
                return { id: this.xmMenu.productId, productName: this.xmMenu.productName }
            }
            return null
        }

    }, 
    data() {
        return {
            filters: {
                caseName: '',
                caseStatus: '',
                testType: '',
            }, 
            addForm: {
                id: '', caseName: '', caseRemark: '', testStep: '', expectResult: '', menuId: '', menuName: '', ctime: '', ltime: '', luserid: '', lusername: '', cbranchId: '', moduleId: '', moduleName: '', caseStatus: '', cuserid: '', cusername: '', productId: '', verNum: '', casedbId: '', casedbName: ''
            },

            editForm: {
                id: '', caseName: '', caseRemark: '', testStep: '', expectResult: '', menuId: '', menuName: '', ctime: '', ltime: '', luserid: '', lusername: '', cbranchId: '', moduleId: '', moduleName: '', caseStatus: '', cuserid: '', cusername: '', productId: '', verNum: '', casedbId: '', casedbName: ''
            },
            xmFunc: null,
            product: null,
            testCasedb:null,
            apis: {
                add: addXmTestCase,
                list: listXmTestCase,
                del: delXmTestCase,
                batchDel: batchDelXmTestCase,
                editSomeFields: editSomeFieldsXmTestCase
            },
            toggle: true,
            hadInit: false,
            
            pageInfo:{//分页数据
                total:0,//服务器端收到0时，会自动计算总记录数，如果上传>0的不自动计算。
                pageSize:10,//每页数据
                count:true,//是否需要重新计算总记录数
                pageNum:1,//当前页码、从1开始计算
                orderFields:['ctime'],//排序列 如 ['sex','student_id']，必须为数据库字段
                orderDirs:['desc']//升序 asc,降序desc 如 性别 升序、学生编号降序 ['asc','desc']
            },
        }
    },//end data
    methods: {

			 
        onToggleClick(){
         this.toggle=!this.toggle
         if(!this.hadInit){
           this.hadInit=true
         }
        },
        preQueryParamCheck(params) {

            if (this.xmFunc && this.xmFunc.id) {
                params.funcPidPathsLike = this.xmFunc.pidPaths
            }
            if (this.xmTestCasedb && this.xmTestCasedb.id) {
                params.casedbId = this.xmTestCasedb.id
            }

            if (this.xmProduct && this.xmProduct.id) {
                params.productId = this.xmProduct.id
            }
            if(this.product?.id){
                params.productId=this.product.id
            }
            if(this.testCasedb?.id){
                params.casedbId=this.testCasedb.id
            }

            if (this.xmMenu && this.xmMenu.menuId) {
                params.menuId = this.xmMenu.menuId
            }
            return true;
        },

        //显示编辑界面 XmTestCase 测试用例
        showEdit: function (row, index) {
            this.$refs['editDlg'].open({ formData: row })
        },
        //显示新增界面 XmTestCase 测试用例
        showAdd: function () {
            if(!this.testCasedb?.id){
                this.$message.error("请先选择用例库")
                return;
            }
            this.$refs['addDlg'].open({ formData: {} })
        },

        editSomeFieldsCheck(row, fieldName, $event,params) {  
            if (fieldName == 'cuserid') {
                params.cuserid = $event.userid
                params.cusername = $event.username
            } else {
                params[fieldName] = $event
            }
            return true;
        },

        initCurrData: function () {

            if (this.scene=='caseFlow') {
                this.filters.caseStatus = '1'
            }else{
                this.filters.caseStatus=''
            }
            this.product = this.xmProduct
            this.testCasedb=this.xmTestCasedb
            
            this.searchTableDatas()
        },
        onXmFuncRowClick(row, checked) {
            this.xmFunc = checked ? row : null
            this.searchReset()
        },  
    },//end methods
    mounted() {
        this.initData()
    }
}

</script>

<style scoped />
