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
                        
			    <el-button v-if="currOpType=='mng'" type="primary" @click="showAdd" icon="plus" plain/>
			    <el-button v-if="currOpType=='mng'" type="danger" v-loading="load.del" @click="batchDel" :disabled="this.sels.length===0 || load.del==true" icon="delete" plain/>
                
                <el-button @click="$refs['kanbanDlg'].open()" type="success" plain>板</el-button> 
            </el-space>
        </template>
        <el-space wrap>
             <xm-product-select v-model="filters.productId" v-if="!xmProduct?.id && !xmTestCasedb?.id && !xmIteration?.id" :linkProjectId="project?.id||''" @change2="(p)=>product=p" @clear="product=null"/>
             <xm-iteration-select v-model="filters.linkIterationId" v-if="productCpd?.id && !xmIteration?.id" :xm-product="productCpd" :linkProjectId="selProject?.id||''"/>
             <xm-project-select v-model="filters.projectId" v-if="!selProject?.id" :linkProductId="productCpd?.id||''" @change2="(p)=>project=p" @clear="project=null"/>
            <mdp-select clearable placeholder="状态" itemCode="testPlanStatus" v-model="filters.status" effect="dark"/>
            <XmTestCasedbSelect  v-model="filters.casedbId" planceholder="测试库" v-if=" !xmTestCasedb?.id" :xmProduct="productCpd" :selProject="selProject"/>
            <xm-user-select :xm-product="productCpd" :sel-project="project" v-model="filters.cuserid" placeholder="负责人"/>

            <mdp-select  clearable placeholder="结果" itemCode="testPlanTcode" v-model="filters.tcode" effect="dark" />
            <mdp-select placeholder="测试方式"  clearable itemCode="testType" v-model="filters.testType" effect="dark"/>
			<el-input v-model="filters.name"  placeholder="模糊查询"  clearable/>

			<el-button v-loading="load.list" :disabled="load.list==true" @click="searchTableDatas" icon="search">查询</el-button>
 
        </el-space> 
    </ContentWrap>

			<!--列表 XmTestPlan 测试计划-->
			<el-table ref="table" :data="tableDatas" v-adaptive="{bottom:50}" @sort-change="sortChange" highlight-current-row v-loading="load.list" border @selection-change="selsChange" @row-click="rowClick" style="width: 100%;">
				<el-table-column  type="selection" width="55" show-overflow-tooltip fixed="left" />
 				<el-table-column prop="name" label="计划名称" width="350"   sortable>
				    <template #default="scope">
				         <el-link type="primary" @click="goToTestPlan(scope.row)">{{ (scope.$index+1) }} {{scope.row.name}}</el-link>  
 
                    </template>
				</el-table-column>
                <el-table-column prop="cusername" label="负责人" min-width="120" show-overflow-tooltip   sortable>
				    <template #default="scope">
                        <xm-user-select :xm-product="{id:scope.row.productId}" :sel-project="{id:scope.row.projectId}" show-style="tag" v-model="scope.row.cuserid" :init-name="scope.row.cusername" :disabled="true"/>
                    </template>
				</el-table-column>
                <el-table-column prop="totalCases" label="用例数" width="100" show-overflow-tooltip   sortable/>
				<el-table-column prop="status" label="状态" width="120"  itemCode="testPlanStatus"   sortable>
				    <template #default="scope">
                        <mdp-select show-style="tag" itemCode="testPlanStatus" v-model="scope.row.status" effect="dark" @change="editSomeFields(scope.row,'status',$event)"/>
                   </template>
				</el-table-column>

				<el-table-column prop="testType" label="测试方式" width="120" itemCode="testType"   sortable>
				    <template #default="scope">
                        <mdp-select show-style="tag" itemCode="testType" v-model="scope.row.testType" effect="dark" @change="editSomeFields(scope.row,'testType',$event)"/>
                   </template>
				</el-table-column>
				<el-table-column prop="tcode" label="测试结果" width="120" itemCode="testPlanTcode"   sortable>
				    <template #default="scope">

                        <mdp-select show-style="tag" itemCode="testPlanTcode" v-model="scope.row.tcode" effect="dark" @change="editSomeFields(scope.row,'tcode',$event)"/>

                    </template>
				</el-table-column>
				<el-table-column prop="totalCases" label="进度" min-width="120"   sortable>
				    <template #default="scope">
                        <el-tooltip :open-delay="300" :content="'总用例数:'+scope.row.totalCases+'   成功:'+scope.row.okCases +'  失败:'+scope.row.errCases+'  忽略:'+scope.row.igCases+'  阻塞:'+scope.row.blCases">
                            <el-progress   :stroke-width="22" :text-inside="true"  :status="scope.row.totalCases>0 && scope.row.errCases<=0 ?'success':'exception'" :percentage="scope.row.totalCases>0?parseInt((parseInt(scope.row.okCases)+parseInt(scope.row.igCases)+parseInt(scope.row.errCases)+parseInt(scope.row.blCases))*100/parseInt(scope.row.totalCases)):0"/>
                        </el-tooltip>
                     </template>
				</el-table-column>
				<el-table-column prop="totalCases" label="统计" width="80" show-overflow-tooltip kbIgnore>
				    <template #default="scope">
                        <el-tooltip content="点击统计进度"
                            ><el-button
                            icon="video-play"
                            @click.stop="calcXmTestPlan(scope.row)"/></el-tooltip>
                     </template>
				</el-table-column>
				<el-table-column prop="stime" label="开始时间"  width="120" show-overflow-tooltip colType="date"  sortable>
				    <template #default="scope">
				        <span> {{scope.row.stime}} </span>
                    </template>
				</el-table-column>
				<el-table-column prop="etime" label="结束时间"  width="120" show-overflow-tooltip  colType="date"  sortable>
				    <template #default="scope">
				        <span> {{scope.row.etime}} </span>
                    </template>
				</el-table-column>
                
                <el-table-column prop="projectName" label="项目" min-width="180" show-overflow-tooltip  sortable/>
                <el-table-column prop="projectId" label="项目号" min-width="120" show-overflow-tooltip  sortable/>
                
                <el-table-column prop="productId" label="产品号" min-width="120" show-overflow-tooltip  sortable/>
                <el-table-column prop="cuserid" label="负责人号" min-width="120" show-overflow-tooltip   sortable/>
			</el-table>
			<el-pagination  layout="total, sizes, prev, pager, next" @current-change="handleCurrentChange" @size-change="handleSizeChange" :page-sizes="[10,20, 50, 100, 500]" :current-page="pageInfo.pageNum" :page-size="pageInfo.pageSize"  :total="pageInfo.total" style="float:right;" />
 			<!--编辑 XmTestPlan 测试计划界面-->
			<mdp-dialog title="编辑测试计划" v-model="editFormVisible"  width="70%"  append-to-body   :close-on-click-modal="false">
			    <xm-test-plan-edit sub-op-type="edit" :formData="editForm" :xm-test-casedb="xmTestCasedb"  @cancel="editFormVisible=false" @submit="afterEditSubmit" @edit-fields="onEditFields" />
			</mdp-dialog>

			<!--新增 XmTestPlan 测试计划界面-->
			<mdp-dialog title="新增测试计划" v-model="addFormVisible"  width="70%"  append-to-body  :close-on-click-modal="false">
			    <xm-test-plan-edit :visible="addFormVisible" sub-op-type="add" :selProject="project" :xmProduct="productCpd" :formData="addForm" :xm-test-casedb="xmTestCasedb"  @cancel="addFormVisible=false" @submit="afterAddSubmit" />
			</mdp-dialog>
            

            <mdp-dialog ref="kanbanDlg" :title="'测试计划看板'" fullscreen append-to-body :close-on-click-modal="false">
                <MdpTableKanban  @del="(d,cb)=>handleDel(d,0,cb)"
                @plus="(cb)=>showAdd(cb)"
                @edit="(d,cb)=>showEdit(d,cb)"
                v-model="tableDatas" 
                :columnConfigs="columnConfigs"
                itemKey="id" 
                :contentFun="(item)=>item.name"
                > 
                <template #toolbar="{element}">
                <MdpSelect showStyle="tag" itemCode="testPlanStatus" disabled v-model="element.status"/>
                </template>
                </MdpTableKanban>
            </mdp-dialog>
 	
</template>

<script>

import util from '@/components/mdp-ui/js/util';//全局公共库
import config from '@/api/mdp_pub/mdp_config';//全局公共库
import { listXmTestPlan, delXmTestPlan, batchDelXmTestPlan,editSomeFieldsXmTestPlan,calcXmTestPlan } from '@/api/xm/core/xmTestPlan';
import  XmTestPlanEdit from './XmTestPlanEdit.vue';//新增修改界面

import { mapState } from 'pinia'
import { useUserStore } from '@/store/modules/user'

		
import { MdpTableMixin } from '@/components/mdp-ui/mixin/MdpTableMixin.js'

export default {
	mixins:[MdpTableMixin],
    name:'xmTestPlanMng',
    components: {
        XmTestPlanEdit,
    },
    props:['visible','xmTestCasedb','selProject','xmIteration','xmProduct'],
    computed: {
        ...mapState(useUserStore,['userInfo']),
        productCpd(){
            if(this.xmProduct?.id){
                return this.xmProduct
            }else if(this.product?.id){
                return this.product
            }else if(this.xmIteration?.id){
                return {id:this.xmIteration.productId,productName:this.xmIteration.productName}
            }else if(this.xmTestCasedb?.id){
                return {id:this.xmTestCasedb.productId,productName:this.xmTestCasedb.productName}
            }else{
                return null
            }
        }

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
                status:'',
                tcode:'',
                testType:'',
            },
             pageInfo:{//分页数据
                total:0,//服务器端收到0时，会自动计算总记录数，如果上传>0的不自动计算。
                pageSize:10,//每页数据
                count:true,//是否需要重新计算总记录数
                pageNum:1,//当前页码、从1开始计算
                orderFields:['ctime'],//排序列 如 ['sex','student_id']，必须为数据库字段
                orderDirs:['desc']//升序 asc,降序desc 如 性别 升序、学生编号降序 ['asc','desc']
            },
          
             addFormVisible: false,//新增xmTestPlan界面是否显示
            addForm: {
                id:'',name:'',casedbId:'',casedbName:'',projectId:'',projectName:'',cuserid:'',cusername:'',ctime:'',stime:'',etime:'',status:'',tcode:'',totalCases:'',okCases:'',errCases:'',igCases:'',blCases:'',productId:'',productName:'',flowState:''
            },

            editFormVisible: false,//编辑界面是否显示
            editForm: {
                id:'',name:'',casedbId:'',casedbName:'',projectId:'',projectName:'',cuserid:'',cusername:'',ctime:'',stime:'',etime:'',status:'',tcode:'',totalCases:'',okCases:'',errCases:'',igCases:'',blCases:'',productId:'',productName:'',flowState:''
            }, 
            apis:{
                list: listXmTestPlan,
                editSomeFields: editSomeFieldsXmTestPlan,
                batchDel: batchDelXmTestPlan,
            },
            product:null,
            project:null,
        }
    },//end data
    methods: { 
        //获取列表 XmTestPlan 测试计划
        preQueryParamCheck(params) {
             
            if(this.xmTestCasedb && this.xmTestCasedb.id){
                params.casedbId=this.xmTestCasedb.id
            }
            return true;
        },
 
        //显示新增界面 XmTestPlan 测试计划
        showAdd: function () {
            if(this.xmTestCasedb?.id){
                this.addForm.casedbId=this.xmTestCasedb.id
                this.addForm.casedbName=this.xmTestCasedb.name
                this.addForm.productId=this.xmTestCasedb.productId
                this.addForm.productName=this.xmTestCasedb.productName
            } 
            this.addFormVisible = true;
            //this.addForm=Object.assign({}, this.editForm);
        }, 
         
      editSomeFieldsCheck(row,fieldName,$event,params){
        
        params[fieldName]=$event 
        return true;
      },  
        goToTestPlan(row){
			var key="xm-test-plan-info-"+row.id
            sessionStorage.setItem(key,JSON.stringify(row))
            this.$router.push({
                path:'/xm/test/view/plan/detail',
                query:{
					casedbId:row.casedbId,
                    id:row.id
                }
            })
        },        
        onEditFields(row){ 
            this.afterEditFields(row) 
            var key="xm-test-plan-info-"+this.editForm.id
            sessionStorage.setItem(key,JSON.stringify(this.editForm))
        },
        calcXmTestPlan(row){
            calcXmTestPlan({id:row.id}).then(res=>{
                var tips=res.tips
                this.$notify({position:'bottom-left',showClose:true,message:tips.msg,type:tips.isOk?'success':'error'})
                if(tips.isOk){
                    this.searchTableDatas();
                }
            })
        }

    },//end methods
    mounted() { 
           // this.initData() 
           this.product=this.xmProduct
           this.project=this.selProject
    }
}

</script>

<style scoped />
