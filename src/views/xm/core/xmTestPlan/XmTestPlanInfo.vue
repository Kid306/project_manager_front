<template>
    <ContentWrap>
        <template #header>
            <el-space wrap>
                <el-button icon="back" @click="goBackToPlanList()" type="primary" plain />
                <el-divider direction="vertical" />
                <el-link :type="subPage == 'testPlanEdit' ? 'primary' : ''" @click="subPage = 'testPlanEdit'"><i
                        class="setting"></i>{{ xmTestPlan.name }}</el-link>
                <el-divider direction="vertical" />
                <el-link :type="subPage == 'testPlanEnv' ? 'primary' : ''" @click="subPage = 'testPlanEnv'"><i
                        class="setting"></i>&nbsp;环境变量</el-link>
                <el-divider direction="vertical" />
                <el-link :type="subPage == 'testPlanCase' ? 'primary' : ''" @click="subPage = 'testPlanCase'"><i
                        class="video-play"></i>&nbsp;执行测试</el-link>
                <el-divider direction="vertical" />
                <el-link :type="subPage == 'testBug' ? 'primary' : ''" @click="subPage = 'testBug'"><i
                        class="question"></i>&nbsp;缺陷</el-link>
                <el-divider direction="vertical" />
                <el-link :type="subPage == 'xmRpt' ? 'primary' : ''" @click="subPage = 'xmRpt'"><i
                        class="s-data"></i>&nbsp;报表</el-link>

                <span style="float: right">
                    <span>
                        <MdpSelect show-style="tag" itemCode="testPlanStatus" :modelValue="xmTestPlan.status" disabled />
                        <span style="color: #c0c4cc">&nbsp;通过率&nbsp;</span>{{ calcTongGuoRate }}%&nbsp;&nbsp;<span
                            style="color: #c0c4cc">&nbsp;已测/总用例&nbsp;</span>{{ calcYiCeshiCases }}&nbsp;/&nbsp;{{
                                calcTotalCases }}&nbsp;&nbsp;
                        <div style="display: inline-flex" class="hidden-md-and-down"><el-progress style="width: 100px"
                                :stroke-width="22" :text-inside="true"
                                :status="calcYiCeshiCases > 0 && xmTestPlan.errCases <= 0 ? 'success' : 'exception'"
                                :percentage="calcProgress" />
                        </div>
                    </span>
                    <span>
                        <el-divider direction="vertical" />

                        <el-button @click="calcRptData" icon="video-play">统计</el-button>
                    </span>
                    <span>
                        <el-divider direction="vertical" />

                        <el-button @click="subPage='log'" icon="">日志</el-button>
                    </span>
                </span>
            </el-space>
        </template>
 
            <xm-test-plan-edit subOpType="edit" v-if="subPage == 'testPlanEdit'" :formData="xmTestPlan" :xm-test-casedb="xmTestCasedb" />
            <xm-test-plan-env v-if="subPage == 'testPlanEnv'" :xm-test-plan="xmTestPlan" :xm-test-casedb="xmTestCasedb" />
            <xm-test-plan-case-list v-if="subPage == 'testPlanCase'" :xm-test-plan="xmTestPlan"
                :xm-test-casedb="xmTestCasedb" />
            <xm-question-list v-if="subPage == 'testBug'" :xm-test-plan="xmTestPlan" :xm-test-casedb="xmTestCasedb"
                :xm-product="{ id: xmTestPlan.productId, productName: xmTestPlan.productName }"
                :sel-project="{ id: xmTestPlan.projectId, name: xmTestPlan.projectName }" />

            <xm-rpt v-if="subPage == 'testRpt'" key="rpt" ref="rpt" :xm-test-casedb="xmTestCasedb"
                :xm-test-plan="xmTestPlan"
                :xm-product="{ id: xmTestCasedb.productId, productName: xmTestCasedb.productName }"
                :xm-project="{ id: xmTestPlan.projectId, name: xmTestPlan.projectName }" category="测试计划级" />

            <xm-rpt v-if="subPage == 'xmRpt'" key="xmRpt" ref="xmRpt" :xm-test-casedb="xmTestCasedb"
                :xm-test-plan="xmTestPlan"
                :xm-product="{ id: xmTestCasedb.productId, productName: xmTestCasedb.productName }"
                :xm-project="{ id: xmTestPlan.projectId, name: xmTestPlan.projectName }" category="测试计划级" />
            <xm-record v-if="subPage=='log'" :project-id="xmTestPlan.projectId" :product-id="xmTestPlan.productId" :pbizId="xmTestPlan.id"/>
    </ContentWrap>
</template>

<script>
import util from '@/components/mdp-ui/js/util' //全局公共库
import config from '@/api/mdp_pub/mdp_config' //全局公共库
import { mapState } from 'pinia'
import { useUserStore } from '@/store/modules/user'

import { defineAsyncComponent } from 'vue'
import { listXmTestPlan, calcXmTestPlan } from '@/api/xm/core/xmTestPlan'
import XmTestPlanEnv from '../xmTestPlan/XmTestPlanEnv.vue'
import XmTestPlanEdit from '../xmTestPlan/XmTestPlanEdit.vue'

import XmRecord from '../xmRecord/XmRecord.vue'
export default {
    name: 'XmTestPlanInfo',
    components: {
        XmRecord, XmTestPlanEnv,
        XmTestPlanEdit 
    },
    props: ['visible', 'xmTestCasedb', 'xmTestPlan'],
    computed: {
        ...mapState(useUserStore, ['userInfo']),
        calcProgress() {
            if (!this.xmTestPlan || !this.xmTestPlan.id) {
                return 0
            }
            var totalCases = parseInt(this.xmTestPlan.totalCases ? this.xmTestPlan.totalCases : 0)
            var yiCeshiCases =
                parseInt(this.xmTestPlan.okCases ? this.xmTestPlan.okCases : 0) +
                parseInt(this.xmTestPlan.errCases ? this.xmTestPlan.errCases : 0) +
                parseInt(this.xmTestPlan.igCases ? this.xmTestPlan.igCases : 0) +
                parseInt(this.xmTestPlan.blCases ? this.xmTestPlan.blCases : 0)
            if (totalCases > 0) {
                return parseInt((yiCeshiCases * 100) / totalCases)
            } else if (yiCeshiCases > 0) {
                return 100
            } else {
                return 0
            }
        },
        calcTongGuoRate() {
            if (!this.xmTestPlan || !this.xmTestPlan.id) {
                return 0
            }
            var tongGuoCases = parseInt(this.xmTestPlan.okCases ? this.xmTestPlan.okCases : 0)
            var totalCases =
                parseInt(this.xmTestPlan.totalCases || 0) - parseInt(this.xmTestPlan.toTestCases || 0)
            if (tongGuoCases > 0) {
                if (totalCases > 0) {
                    return parseInt((tongGuoCases * 100) / totalCases)
                } else {
                    return 100
                }
            } else {
                return 0
            }
        },
        calcTotalCases() {
            if (!this.xmTestPlan || !this.xmTestPlan.id) {
                return 0
            }
            return parseInt(this.xmTestPlan.totalCases ? this.xmTestPlan.totalCases : 0)
        },
        calcYiCeshiCases() {
            if (!this.xmTestPlan || !this.xmTestPlan.id) {
                return 0
            }
            return (
                parseInt(this.xmTestPlan.okCases ? this.xmTestPlan.okCases : 0) +
                parseInt(this.xmTestPlan.errCases ? this.xmTestPlan.errCases : 0) +
                parseInt(this.xmTestPlan.igCases ? this.xmTestPlan.igCases : 0) +
                parseInt(this.xmTestPlan.blCases ? this.xmTestPlan.blCases : 0)
            )
        }
    },
    watch: {
        visible(val) {
            if (val == true) {
            }
        },
        xmTestPlan: {
            deep: true,
            handler() {
                this.subPage = 'testPlanEdit'
            }
        }
    },
    data() {
        return {
            dicts: {
                testPlanStatus: [],
                testType: []
            },
            subPage: 'testPlanEdit' //testPlanCase,testBug
        }
    }, //end data
    methods: { 
        showRptConfig() {
            this.$refs['rpt'].isRptCfg = true
        },
        showExportToolBar() {
            this.$refs['rpt'].showExportToolBar()
        },
        calcRptData() {
            var row = this.xmTestPlan
            calcXmTestPlan({ id: row.id }).then((res) => {
                var tips = res.tips
                this.$notify({
                    position: 'bottom-left',
                    showClose: true,
                    message: tips.msg,
                    type: tips.isOk ? 'success' : 'error'
                })
                if (tips.isOk) {
                    this.$emit('refresh')
                }
            })
        },
        goBackToPlanList() {
            this.$router.go(-1)
        }
    }, //end methods
    mounted() { }
}
</script>
