<template>
    <el-row :gutter="5">
        <el-col :span="toggle?0:6" v-if="!xmTestCase || !xmTestCase.id">
            <xm-func-tree v-if="xmProductCpd && xmProductCpd.id" :xm-product="xmProductCpd"
                @check-change="onXmFuncRowClick" />
        </el-col>
        <el-col :span="(!xmTestCase || !xmTestCase.id ? (toggle?24:18) : 24)">
            <ContentWrap>
                <template #header>
                    <el-space>
                        <el-button v-if="!xmTestCase || !xmTestCase.id" :icon="toggle?'DArrowRight':'DArrowLeft'" @click="onToggleClick" plain title="展开/收起左边"/>

                        <mdp-hi-query :column-configs="columnConfigs" v-model="hiQueryParams"
                            @change="onHiQueryParamsChange" />
                        <el-button icon="zoom-out" @click="searchReset()" title="重置查询条件并查询" />

                        <span v-if="currOpType == 'mng'">
                            <el-button type="primary" @click="batchExec" icon="video-play" plain title="批量执行测试用例"/>  
                            <el-button :disabled="disBtn('addBtn') || !checkBtnQx('addBtn', menuDefId)" type="primary"
                                @click="showAdd" icon="plus" plain />
                            <el-button
                                :disabled="disBtn('delBtn') || !checkBtnQx('delBtn', menuDefId) || sels.length === 0 || load.del == true"
                                type="danger" v-loading="load.del" @click="batchDel" icon="delete" plain />
                        </span>


                        <mdp-export @excel="export2Excel()"/>
                        <mdp-table-configs :column-configs="columnConfigs" v-model="checkedColumns" />
 
                        <el-button @click="$refs['kanbanDlg'].open()"  title="看板" type="success" plain>板</el-button>  

                        <span v-if="currOpType == 'select' && multiple == true">
                            <el-button :disabled="disBtn('selectBtn') || sels.length === 0" type="primary"
                                @click="selectListConfirm" icon="check">确认选择</el-button>
                        </span>
                    </el-space>
                </template>
                <el-space>
                    <xm-iteration-select v-model="filters.linkIterationId" v-if="xmProductCpd?.id" :xm-product="xmProductCpd"/>
                    <xm-menu-select v-model="filters.menuId" v-if="xmProductCpd?.id" :xm-product="xmProductCpd"/>
                    <mdp-select placeholder="用例状态" clearable itemCode="testCaseStatus" v-model="filters.caseStatus"
                        effect="dark" />
                    <mdp-select placeholder="测试方式" clearable itemCode="testType" v-model="filters.testType"
                        effect="dark" />
                    <mdp-select itemCode="priority" v-model="filters.priority" clearable/>
                    <mdp-select placeholder="执行结果" clearable itemCode="testStepTcode" v-model="filters.execStatus"
                        effect="dark" />
                    <xm-user-select :xm-product="xmProductCpd" :sel-project="xmProject" v-model="filters.execUserid" placeholder="执行人" />
                    <el-input v-model="filters['caseName']"  placeholder="用例名称" clearable />
                    <el-button v-loading="load.list" :disabled="load.list == true" @click="searchTableDatas"
                        icon="search">查询</el-button>

                </el-space>
            </ContentWrap>
            <!--列表 XmTestPlanCase 测试计划与用例关系表-->
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
                <el-table-column prop="caseName" label="用例名称" width="400"  sortable>
                    <template #default="scope"> 
                         <el-link @click="showEdit(scope.row, scope.$index)">{{scope.row.sortNo||(scope.$index+1)}} {{ scope.row.caseName }} </el-link>
                    </template>
                </el-table-column>
                <el-table-column prop="caseStatus" label="用例状态" width="120" show-overflow-tooltip  sortable>
                    <template #default="scope">
                        <mdp-select show-style="tag" itemCode="testCaseStatus" v-model="scope.row.caseStatus" effect="dark"
                            @change="editSomeFields(scope.row, 'caseStatus', $event)" :disabled="true" />
                    </template>
                </el-table-column>
                <el-table-column prop="execRate" label="进度" width="120" show-overflow-tooltip sortable>
                    <template #default="scope">
                    <span
                        :style="{ borderRadius: '30px', color: scope.row.execRate >= 100 ? 'green' : 'blue' }"
                    >
                        {{ (scope.row.execRate != null ? scope.row.execRate : 0) + '%' }}
                    </span>
                    </template>
                </el-table-column>
                <template v-if="currOpType!='select'">
                    <el-table-column prop="testType" label="执行方式" width="120"  sortable>
                        <template #default="scope">
                            <mdp-select show-style="tag" itemCode="testType" v-model="scope.row.testType"
                                @change="editSomeFields(scope.row, 'testType', $event)" :disabled="true" />
                        </template>
                    </el-table-column>
                    <el-table-column prop="execStatus" label="执行结果" width="120" show-overflow-tooltip itemCode="testStepTcode"  sortable>
                        <template #default="scope">
                            <mdp-select show-style="tag" itemCode="testStepTcode" v-model="scope.row.execStatus"
                                effect="dark" @change="editSomeFields(scope.row, 'execStatus', $event)" />
                        </template>
                    </el-table-column>
                    
                    <el-table-column prop="bugs" label="缺陷数" min-width="120"  sortable/>
                    <el-table-column prop="execUsername" label="执行人姓名" min-width="120"  sortable>
                        <template #default="scope">
                            <xm-user-select :xm-product="{id:scope.row.productId}" :sel-project="{id:scope.row.projectId}" show-style="tag" v-model="scope.row.execUserid"
                                :init-name="scope.row.execUsername"
                                @change2="editSomeFields(scope.row, 'execUserid', $event)" />
                        </template>
                    </el-table-column>
                    
                    <el-table-column prop="execDate" label="执行时间" min-width="120" colType="date"  sortable/>
                    <el-table-column prop="priority" label="优先级" width="120" itemCode="priority"  sortable>
                        <template #default="scope">
                            <mdp-select show-style="tag" itemCode="priority" v-model="scope.row.priority"
                                @change="editSomeFields(scope.row, 'priority', $event)" />
                        </template>
                    </el-table-column>
                    <el-table-column prop="remark" label="执行备注" min-width="150" show-overflow-tooltip>
                        <template #default="scope">
                            <span> {{ scope.row.remark }} </span>
                        </template>
                    </el-table-column>
                    
                    <el-table-column prop="productId" label="产品号" min-width="120" show-overflow-tooltip colPrefix="res." sortable/>
                    <el-table-column prop="projectId" label="项目号" min-width="120" show-overflow-tooltip  sortable/>
                    <el-table-column prop="planId" label="计划号" min-width="120" show-overflow-tooltip  sortable/>
                    <el-table-column prop="caseId" label="用例号" min-width="120" show-overflow-tooltip sortable/>  
                    <el-table-column prop="sortNo" label="排序号" min-width="150" show-overflow-tooltip  sortable/>
					<el-table-column prop="actWorkload" label="实际工时"  width="120" show-overflow-tooltip sortable/> 
					<el-table-column prop="initWorkload" label="原估工时"  width="120" show-overflow-tooltip sortable/> 
					<el-table-column prop="budgetWorkload" label="预估工时"  width="120" show-overflow-tooltip sortable/> 
                    <el-table-column prop="ctime" label="创建时间" min-width="120" colType="date" show-overflow-tooltip   sortable/>
                 </template>
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
    <!--编辑 XmTestPlanCase 测试计划与用例关系表界面-->
    <mdp-dialog title="测试执行" ref="dlg" v-model="editFormVisible" fullscreen width="90%" top="20px" append-to-body
        :close-on-click-modal="false">
        <xm-test-plan-case-edit sub-op-type="edit" :formData="editForm" :xm-test-casedb="xmTestCasedb"
            :xm-test-plan="xmTestPlan" :visible="editFormVisible" @cancel="editFormVisible = false" @submit="afterEditSubmit"
            @edit-fields="onEditFields" @next="nextEdit" />
    </mdp-dialog>

    <!--新增 XmTestPlanCase 测试计划与用例关系表界面-->
    <mdp-dialog title="选择测试用例" v-model="addFormVisible" width="80%" top="20px" append-to-body :close-on-click-modal="false">
        <xm-test-case-list subOpType="select" multiple :xm-test-plan="xmTestPlan" :xm-test-casedb="xmTestCasedb"
            :visible="addFormVisible" @cancel="addFormVisible = false" @select="onXmTestCaseSelect" />
    </mdp-dialog>


    <mdp-dialog title="批量执行自动化测试用例" v-model="doBatchExecVisible" width="600" top="20px" append-to-body
        :close-on-click-modal="false">
        <el-result v-if="load.doBatch" icon="warning" title="警告提示"
            :subTitle="'正在批量执行测试用例，请勿关闭窗口,当前进度【' + batchProgress + '%】'" />
        <el-result v-if="!load.doBatch" icon="success" title="执行完毕"
            :subTitle="'成功用例【' + okCasesNum + '】,失败【' + errCasesNum + '】,忽略【' + igCasesNum + '】'">
            <template #extra>
                <el-button type="primary" size="medium" @click="doBatchBack">返回</el-button>
            </template>
        </el-result>
    </mdp-dialog>
    
	
    <mdp-dialog ref="kanbanDlg" :title="'执行用例看板'" fullscreen append-to-body :close-on-click-modal="false">
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
import { listXmTestPlanCase, delXmTestPlanCase, batchDelXmTestPlanCase, editSomeFieldsXmTestPlanCase, importFromTestCase } from '@/api/xm/core/xmTestPlanCase';

import { autoStepToAxios, initEnvVars } from '@/api/xm/core/xmTestAutoStep.js';//全局公共库

import { mapState } from 'pinia'
import { useUserStore } from '@/store/modules/user'
import axios from 'axios'//免登录访问

import { defineAsyncComponent } from 'vue';
import { getAccessToken } from '@/utils/auth'
import { MdpTableMixin } from '@/components/mdp-ui/mixin/MdpTableMixin.js'

export default {
    mixins: [MdpTableMixin],
    name: 'xmTestPlanCaseMng',
    components: {
        XmTestPlanCaseEdit: defineAsyncComponent(() => import("./XmTestPlanCaseEdit.vue")),
    },
    props: ['visible', 'xmTestPlan', 'xmTestCasedb', 'xmTestCase', 'xmProduct', 'xmProject', 'subOpType'],
    computed: {
        ...mapState(useUserStore, ['userInfo']),
        xmProductCpd() {
            if (this.xmProduct && this.xmProduct.id) {
                return this.xmProduct
            }
            if (this.xmTestCasedb && this.xmTestCasedb.id) {
                return { id: this.xmTestCasedb.productId, productName: this.xmTestCasedb.productName }
            }
            if (this.xmTestPlan && this.xmTestPlan.id) {
                return { id: this.xmTestPlan.productId, productName: this.xmTestPlan.productName }
            }
            if (this.xmTestCase && this.xmTestCase.id) {
                return { id: this.xmTestCase.productId, productName: this.xmTestCase.productName }
            }
            return {}
        }

    },
    watch: {
        visible(val) {
            if (val == true) {
                this.initData();
                this.searchTableDatas()
            }
        }
    },
    data() {
        return {
            pkNames: ['planId', 'caseId'],
            filters: {
                name: '',
                testType: '',
                caseStatus: '',
                execStatus: ''
            },
            xmFunc: null,
            batchProgress: 0,
            okCasesNum: 0,
            errCasesNum: 0,
            igCasesNum: 0,
            pageInfo: {//分页数据
                total: 0,//服务器端收到0时，会自动计算总记录数，如果上传>0的不自动计算。
                pageSize: 10,//每页数据
                count: true,//是否需要重新计算总记录数
                pageNum: 1,//当前页码、从1开始计算
                orderFields: ['ctime'],//排序列 如 ['sex','student_id']，必须为数据库字段
                orderDirs: ['desc']//升序 asc,降序desc 如 性别 升序、学生编号降序 ['asc','desc']
            },
            load: { list: false, edit: false, del: false, add: false, doBatch: false },//查询中... 
            addFormVisible: false,//新增xmTestPlanCase界面是否显示
            addForm: {
                bugs: '', execUserid: '', caseId: '', ltime: '', ctime: '', execStatus: '', execUsername: '', planId: '', caseName: '', priority: '', remark: '', testStep: ''
            },

            editFormVisible: false,//编辑界面是否显示
            editForm: {
                bugs: '', execUserid: '', caseId: '', ltime: '', ctime: '', execStatus: '', execUsername: '', planId: '', caseName: '', priority: '', remark: '', testStep: ''
            },
            doBatchExecVisible: false,
            apis: {
                list: listXmTestPlanCase,
                del: delXmTestPlanCase,
                batchDel: batchDelXmTestPlanCase,
                editSomeFields: editSomeFieldsXmTestPlanCase
            },
            toggle: true,
            hadInit:false,
        }
    },//end data
    methods: {

			 
        onToggleClick(){
         this.toggle=!this.toggle
         if(!this.hadInit){
           this.hadInit=true
         }
        },
        //获取列表 XmTestPlanCase 测试计划与用例关系表
        preQueryParamCheck(params) {

            if (this.xmTestCasedb && this.xmTestCasedb.id) {
                params.casedbId = this.xmTestCasedb.id
            }

            if (this.xmTestCase && this.xmTestCase.id) {
                params.caseId = this.xmTestCase.id
            }
            if (this.xmTestPlan && this.xmTestPlan.id) {
                params.planId = this.xmTestPlan.id
            }
            if (this.xmFunc && this.xmFunc.id) {
                params.funcPidPathsLike = this.xmFunc.pidPaths
            }
            if (this.xmProductCpd && this.xmProductCpd.id) {
                params.productId = this.xmProductCpd.id
            }
            return true;
        },

        //显示编辑界面 XmTestPlanCase 测试计划与用例关系表
        showEdit: function (row, index) {
            this.editFormVisible = true;
            this.editForm = Object.assign({}, row);
        },
        //显示新增界面 XmTestPlanCase 测试计划与用例关系表
        showAdd: function () {
            if(!this.xmTestPlan||!this.xmTestPlan.id){
                this.$message.error("请在测试计划下进行执行用例的维护")
                return;
            }
            this.addFormVisible = true;
            //this.addForm=Object.assign({}, this.editForm);
        },
        editSomeFieldsCheck(row, fieldName, $event, params) {

            if (fieldName == 'execUserid') {
                params.execUserid = $event.userid
                params.execUsername = $event.username
            } else {
                params[fieldName] = $event
            }
            return true;
        },
        doBatchBack() {
            this.doBatchExecVisible = false;
            this.searchTableDatas();
        },
        editSomeFieldsForExec(sels, fieldName, $event) {
            let params = {};
            params['$pks'] = sels.map(i => { return { caseId: i.caseId, planId: i.planId } })
            params[fieldName] = $event
            var func = editSomeFieldsXmTestPlanCase
            func(params).then(res => {

            }).catch((e) => { })
        },
        onXmTestCaseSelect(cases) { 
            if (cases == null || cases.length <= 0) {
                this.$notify({ position: 'bottom-left', showClose: true, message: "请至少选择一条用例进行导入", type: 'error' })
                return;

            }
            if (cases.some(k => k.testType != this.xmTestPlan.testType)) {
                if (this.xmTestPlan.testType == '1') {
                    this.$notify({ position: 'bottom-left', showClose: true, message: "当前计划为自动化测试计划，请选择自动测试的用例加入", type: 'error' })
                    return;
                }
            }
            this.addFormVisible = false;
            importFromTestCase({ planId: this.xmTestPlan.id, caseIds: cases.map(i => i.id) }).then(res => {
                let tips = res.tips
                this.$notify({ position: 'bottom-left', showClose: true, message: tips.msg, type: tips.isOk?'success':'error' })

                if(tips.isOk){
                    this.searchTableDatas();
                }
               
            })
        },
        batchExec() {
            if (this.sels.length == 0) {
                this.$notify({ position: 'bottom-left', showClose: true, message: '测试用例为0条，无须执行', type: 'error' });
                return;
            }
            if (this.sels.length > 100) {
                this.$notify({ position: 'bottom-left', showClose: true, message: '一次批量执行测试用例不能超过' + (100) + '条', type: 'error' });
                return;
            }
            this.doBatchExec(this.sels)
        },
        async doBatchExec(planCases) {
            this.doBatchExecVisible = true;
            this.load.doBatch = true;
            var igCases = planCases.filter(k => !k.autoStep || k.testType != '1')
            if (igCases.length > 0) {
                this.editSomeFieldsForExec(igCases, "execStatus", '1')
            }
            this.igCasesNum = igCases.length;
            this.batchProgress = Math.round(igCases.length / planCases.length)
            var cases = planCases.filter(k => k.autoStep && k.testType == '1')
            var execAll = []
            var env = initEnvVars(this.xmTestCasedb ? this.xmTestCasedb.envJson : null, this.xmTestPlan ? this.xmTestPlan.envJson : null);
            var curlDomain=window.location.protocol+"//"+window.location.host; //  
			var apiGate=this.$mdp.getUri(curlDomain,import.meta.env.VITE_API_BASE_PATH,import.meta.env.VITE_API_VERSION)

			env['accessToken']=getAccessToken()
			env['curlDomain']=curlDomain
			env['apiGate']=apiGate
			Object.keys(this.userInfo).forEach(k=>{
				env['userInfo.'+k]=this.userInfo[k]
			})
            for (let k of cases) {
                var data = await this.sendMsgForTestSetting(k, env)
                execAll.push(data)
                this.batchProgress = Math.round((igCases.length + execAll.length) / planCases.length)

            }
            var okCases = execAll.filter(k => k.execStatus == '2')
            this.okCasesNum = okCases.length
            if (okCases.length > 0) {
                this.editSomeFieldsForExec(okCases, "execStatus", '2')
            }

            var errCases = execAll.filter(k => k.execStatus == '4')
            this.errCasesNum = errCases.length;
            if (errCases.length > 0) {
                this.editSomeFieldsForExec(errCases, "execStatus", '4')
            }
            this.load.doBatch = false;
        },
        sendMsgForTestSetting: function (planCase, env) {
            return new Promise((resolve, reject) => {
                var autoStepObj = JSON.parse(planCase.autoStep)
                if (!autoStepObj.url) {
                    planCase.execStatus = '1'
                    resolve(planCase)
                } else {
                    var axiosObj = autoStepToAxios(autoStepObj, env)
                    //axiosObj.headers['Access-Control-Allow-Origin']='*'
                    //axios.defaults.withCredentials = true // 若跨域请求需要带 cookie 身份识别
                    //axios.defaults.headers.post['Content-Type'] = 'application/x-www-form-urlencoded'
                    axios(axiosObj).then(res => {
                        if (autoStepObj.expectResult) {
                            var func = new Function('res', 'env', autoStepObj.expectResult)
                            var result = func(res, env)
                            planCase.execStatus = result == true ? "2" : "4"
                        } else {
                            planCase.execStatus = res.status == 200 ? "2" : "4"

                        }
                        resolve(planCase)
                    }).catch(res => {
                        var func = new Function('res', 'env', autoStepObj.expectResult)
                        var result = func(res, env)
                        if (result == true) {
                            planCase.execStatus = "2"
                        } else {
                            planCase.execStatus = "4"
                        }
                        resolve(planCase)
                    })
                }
            })


        },
        onXmFuncRowClick(row, checked) {
            this.xmFunc = checked ? row : null
            this.searchTableDatas();
        }, 
        nextEdit(c) {
            
            var index = this.tableDatas.findIndex(k => k.caseId == c.caseId && k.planId == c.planId)
            if (index == this.tableDatas.length - 1) {
                this.editFormVisible = false;
                this.$notify({ position: 'bottom-left', showClose: true, message: "已是最后一条数据", type: 'success' })
                return;
            }  
            this.editFormVisible = false;
            var data = this.tableDatas[index + 1]  
            setTimeout(()=>this.showEdit(data),100) 

            
        }
    },//end methods
    mounted() { 
            this.initData()
            this.searchTableDatas(); 
    }
}

</script>

<style scoped />
