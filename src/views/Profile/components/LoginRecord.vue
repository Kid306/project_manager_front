<template>
<ContentWrap> 
		<el-space wrap>


			<el-input v-model="filters.userid" style="width: 8em;" placeholder="用户编号" clearable title="支持>、<、 >=、<=、!=、*字符*、$IS NULL、$IN 1,2,3、$between 1,5等操作符"/>
			<el-input v-model="filters.username" style="width:  8em;" placeholder="用户名称" clearable title="支持>、<、 >=、<=、!=、*字符*、$IS NULL、$IN 1,2,3、$between 1,5等操作符"/>
			<el-input v-model="filters.username" style="width:  8em;" placeholder="ip" clearable title="支持>、<、 >=、<=、!=、*字符*、$IS NULL、$IN 1,2,3、$between 1,5等操作符"/>
			<mdp-date-range v-model="filters" placeholder="登陆时间" start-key="loginTimeStart" end-key="loginTimeEnd"/>
			<el-button v-loading="load.list" :disabled="load.list==true" @click="searchTableDatas()" icon="search" type="primary">查询</el-button>
			<span v-if="currOpType=='mng'">
				</span>
			<span v-else-if="currOpType=='select' &&  this.multiple==true">
					<el-button :disabled="disBtn('selectBtn') || this.sels.length===0" type="primary" @click="selectListConfirm" icon="check"/>
			</span>
		</el-space>
	<template #header>
			<el-space wrap>
				<mdp-select item-code="user_type" v-model="filters.userType" placeholder="登陆通道"/>
				<mdp-select item-code="login_type" v-model="filters.loginType" placeholder="登陆方式"/>
				<mdp-select item-code="mem_type" v-model="filters.loginType" placeholder="会员类型"/>
							<mdp-hi-query :column-configs="columnConfigs" v-model="hiQueryParams" @change="onHiQueryParamsChange"/>
							<el-button icon="zoom-out" @click="searchReset()" title="重置查询条件"/>
							<el-button icon="download" @click="export2Excel()" title="导出当前结果" />
              <mdp-table-configs :column-configs="columnConfigs" v-model="checkedColumns"/>
			</el-space>
	</template>
	</ContentWrap> 
			<!--列表 UserLoginRecord 用户登录信息登记-->
			<el-table v-adaptive :ref="refId+'Table'"  :data="tableDatas" @sort-change="sortChange" highlight-current-row v-loading="load.list" border @selection-change="selsChange" @row-click="rowClick" style="width: 100%;">
				<el-table-column  type="selection" width="55" show-overflow-tooltip fixed="left" v-if="currOpType=='mng' || this.multiple==true" />
				<el-table-column sortable type="index" width="55" show-overflow-tooltip  fixed="left"/>
				<el-table-column prop="userid"  label="用户编号" min-width="120" show-overflow-tooltip col-type="String" v-if="showCol('userid')"  sortable>
				    <template #default="scope">
                            <mdp-input show-style="tag" v-model="scope.row.userid" :maxlength="64" @change.prevent="editSomeFields(scope.row,'userid',$event)" :disabled="disField"/>
				    </template>
				</el-table-column>
				<el-table-column prop="username"  label="登录用户名" min-width="120" show-overflow-tooltip col-type="String" v-if="showCol('username')"  sortable>
				    <template #default="scope">
                            <mdp-input show-style="tag" v-model="scope.row.username" :maxlength="50" @change.prevent="editSomeFields(scope.row,'username',$event)" :disabled="disField"/>
				    </template>
				</el-table-column>
				<el-table-column prop="loginTime"  label="登录时间" min-width="120" show-overflow-tooltip col-type="Date" v-if="showCol('loginTime')"  sortable>
				    <template #default="scope">
                            <mdp-date type="date" placeholder="选择日期" show-style="tag" v-model="scope.row.loginTime" @change="editSomeFields(scope.row,'loginTime',$event)"  value-format="YYYY-MM-DD HH:mm:ss" format="YYYY-MM-DD" :disabled="disField"/>
				    </template>
				</el-table-column>
				<el-table-column prop="loginStatus"  label="登陆成功" min-width="120" show-overflow-tooltip col-type="String" v-if="showCol('loginStatus')"  sortable>
				    <template #default="scope">
                            <mdp-select @click="rowClick(scope.row)" item-code="yesOrNo" show-style="tag" v-model="scope.row.loginStatus" :maxlength="1" @change="editSomeFields(scope.row,'loginStatus',$event)" :disabled="disField"/>
				    </template>
				</el-table-column>
				<el-table-column prop="phoneno"  label="登录手机号" min-width="120" show-overflow-tooltip col-type="String" v-if="showCol('phoneno')"  sortable>
				    <template #default="scope">
                            <mdp-input show-style="tag" v-model="scope.row.phoneno" :maxlength="64" @change.prevent="editSomeFields(scope.row,'phoneno',$event)" :disabled="disField"/>
				    </template>
				</el-table-column>
				<el-table-column prop="loginIp"  label="登录ip" min-width="120" show-overflow-tooltip col-type="String" v-if="showCol('loginIp')"  sortable>
				    <template #default="scope">
                            <mdp-input show-style="tag" v-model="scope.row.loginIp" :maxlength="50" @change.prevent="editSomeFields(scope.row,'loginIp',$event)" :disabled="disField"/>
				    </template>
				</el-table-column>
				<el-table-column prop="userType"  label="登陆通道" min-width="120" show-overflow-tooltip col-type="String" v-if="showCol('userType')"  sortable>
				    <template #default="scope">
                            <mdp-select @click="rowClick(scope.row)" item-code="user_type" show-style="tag" v-model="scope.row.userType" :maxlength="10" @change="editSomeFields(scope.row,'userType',$event)" :disabled="disField"/>
				    </template>
				</el-table-column>

				<el-table-column prop="memType"  label="会员类型" min-width="120" show-overflow-tooltip col-type="String" v-if="showCol('memType')"  sortable>
				    <template #default="scope">
                            <mdp-select @click="rowClick(scope.row)" item-code="mem_type" show-style="tag" v-model="scope.row.memType" :maxlength="1" @change="editSomeFields(scope.row,'memType',$event)" :disabled="disField"/>
				    </template>
				</el-table-column>

				<el-table-column prop="branchId"  label="机构编号" min-width="120" show-overflow-tooltip col-type="String" v-if="showCol('branchId')"  sortable>
				    <template #default="scope">
                            <mdp-input show-style="tag" v-model="scope.row.branchId" :maxlength="64" @change.prevent="editSomeFields(scope.row,'branchId',$event)" :disabled="disField"/>
				    </template>
				</el-table-column>
				<el-table-column prop="loginMsg"  label="登录说明" min-width="120" show-overflow-tooltip col-type="String" v-if="showCol('loginMsg')"  sortable>
				    <template #default="scope">
                            <mdp-input show-style="tag" v-model="scope.row.loginMsg" :maxlength="255" @change.prevent="editSomeFields(scope.row,'loginMsg',$event)" :disabled="disField"/>
				    </template>
				</el-table-column>
				<el-table-column prop="authType"  label="授权码" min-width="120" show-overflow-tooltip col-type="String" v-if="showCol('authType')"  sortable>
				    <template #default="scope">
                            <mdp-select @click="rowClick(scope.row)" item-code="auth_type" show-style="tag" v-model="scope.row.authType" :maxlength="50" @change="editSomeFields(scope.row,'authType',$event)" :disabled="disField"/>
				    </template>
				</el-table-column>
				<el-table-column prop="grantType"  label="授权方式" min-width="120" show-overflow-tooltip col-type="String" v-if="showCol('grantType')"  sortable>
				    <template #default="scope">
                            <mdp-select @click="rowClick(scope.row)" item-code="grant_type" show-style="tag" v-model="scope.row.grantType" :maxlength="50" @change="editSomeFields(scope.row,'grantType',$event)" :disabled="disField"/>
				    </template>
				</el-table-column>
				<el-table-column prop="loginType"  label="登陆方式" min-width="120" show-overflow-tooltip col-type="String" v-if="showCol('loginType')"  sortable>
				    <template #default="scope">
                            <mdp-select @click="rowClick(scope.row)" item-code="login_type" show-style="tag" v-model="scope.row.loginType" :maxlength="1" @change="editSomeFields(scope.row,'loginType',$event)" :disabled="disField"/>
				    </template>
				</el-table-column>
				<el-table-column prop="loginDeviceId"  label="登录设备编号" min-width="120" show-overflow-tooltip col-type="String" v-if="showCol('loginDeviceId')"  sortable>
				    <template #default="scope">
                            <mdp-input show-style="tag" v-model="scope.row.loginDeviceId" :maxlength="50" @change.prevent="editSomeFields(scope.row,'loginDeviceId',$event)" :disabled="disField"/>
				    </template>
				</el-table-column>
				<el-table-column prop="loginDeviceSn"  label="设备特征码" min-width="120" show-overflow-tooltip col-type="String" v-if="showCol('loginDeviceSn')"  sortable>
				    <template #default="scope">
                            <mdp-input show-style="tag" v-model="scope.row.loginDeviceSn" :maxlength="50" @change.prevent="editSomeFields(scope.row,'loginDeviceSn',$event)" :disabled="disField"/>
				    </template>
				</el-table-column>
				<el-table-column prop="userAgent"  label="请求特征码" min-width="120" show-overflow-tooltip col-type="String" v-if="showCol('userAgent')"  sortable>
				    <template #default="scope">
                            <mdp-input show-style="tag" v-model="scope.row.userAgent" :maxlength="800" @change.prevent="editSomeFields(scope.row,'userAgent',$event)" :disabled="disField"/>
				    </template>
				</el-table-column>
				<el-table-column prop="reqNo"  label="请求号" min-width="120" show-overflow-tooltip col-type="String" v-if="showCol('reqNo')"  sortable>
				    <template #default="scope">
                            <mdp-input show-style="tag" v-model="scope.row.reqNo" :maxlength="50" @change.prevent="editSomeFields(scope.row,'reqNo',$event)" :disabled="disField"/>
				    </template>
				</el-table-column>
				<el-table-column prop="deviceType"  label="设备类型" min-width="120" show-overflow-tooltip col-type="String" v-if="showCol('deviceType')"  sortable>
				    <template #default="scope">
                            <mdp-input show-style="tag" v-model="scope.row.deviceType" :maxlength="50" @change.prevent="editSomeFields(scope.row,'deviceType',$event)" :disabled="disField"/>
				    </template>
				</el-table-column>
				<el-table-column prop="os"  label="操作系统" min-width="120" show-overflow-tooltip col-type="String" v-if="showCol('os')"  sortable>
				    <template #default="scope">
                            <mdp-input show-style="tag" v-model="scope.row.os" :maxlength="10" @change.prevent="editSomeFields(scope.row,'os',$event)" :disabled="disField"/>
				    </template>
				</el-table-column>
				<el-table-column prop="osVersion"  label="操作系统版本如Android" min-width="120" show-overflow-tooltip col-type="String" v-if="showCol('osVersion')"  sortable>
				    <template #default="scope">
                            <mdp-input show-style="tag" v-model="scope.row.osVersion" :maxlength="50" @change.prevent="editSomeFields(scope.row,'osVersion',$event)" :disabled="disField"/>
				    </template>
				</el-table-column>
				<el-table-column prop="osName"  label="操作系统名称如Android" min-width="120" show-overflow-tooltip col-type="String" v-if="showCol('osName')"  sortable>
				    <template #default="scope">
                            <mdp-input show-style="tag" v-model="scope.row.osName" :maxlength="50" @change.prevent="editSomeFields(scope.row,'osName',$event)" :disabled="disField"/>
				    </template>
				</el-table-column>
				<el-table-column prop="renderingEngine"  label="浏览器渲染引擎" min-width="120" show-overflow-tooltip col-type="String" v-if="showCol('renderingEngine')"  sortable>
				    <template #default="scope">
                            <mdp-input show-style="tag" v-model="scope.row.renderingEngine" :maxlength="50" @change.prevent="editSomeFields(scope.row,'renderingEngine',$event)" :disabled="disField"/>
				    </template>
				</el-table-column>
				<el-table-column prop="deviceManufacturer"  label="设备生产厂商" min-width="120" show-overflow-tooltip col-type="String" v-if="showCol('deviceManufacturer')"  sortable>
				    <template #default="scope">
                            <mdp-input show-style="tag" v-model="scope.row.deviceManufacturer" :maxlength="50" @change.prevent="editSomeFields(scope.row,'deviceManufacturer',$event)" :disabled="disField"/>
				    </template>
				</el-table-column>
				<el-table-column prop="browerGroup"  label="浏览器组" min-width="120" show-overflow-tooltip col-type="String" v-if="showCol('browerGroup')"  sortable>
				    <template #default="scope">
                            <mdp-input show-style="tag" v-model="scope.row.browerGroup" :maxlength="50" @change.prevent="editSomeFields(scope.row,'browerGroup',$event)" :disabled="disField"/>
				    </template>
				</el-table-column>
				<el-table-column prop="borderName"  label="浏览器名称" min-width="120" show-overflow-tooltip col-type="String" v-if="showCol('borderName')"  sortable>
				    <template #default="scope">
                            <mdp-input show-style="tag" v-model="scope.row.borderName" :maxlength="50" @change.prevent="editSomeFields(scope.row,'borderName',$event)" :disabled="disField"/>
				    </template>
				</el-table-column>
				<el-table-column prop="borderVersion"  label="浏览器版本" min-width="120" show-overflow-tooltip col-type="String" v-if="showCol('borderVersion')"  sortable>
				    <template #default="scope">
                            <mdp-input show-style="tag" v-model="scope.row.borderVersion" :maxlength="50" @change.prevent="editSomeFields(scope.row,'borderVersion',$event)" :disabled="disField"/>
				    </template>
				</el-table-column>
				<el-table-column prop="longitude"  label="经度" min-width="120" show-overflow-tooltip col-type="BigDecimal" v-if="showCol('longitude')"  sortable>
				    <template #default="scope">
                            <mdp-input show-style="tag" v-model="scope.row.longitude" @change.prevent="editSomeFields(scope.row,'longitude',$event)" :maxlength="10" :disabled="disField"/>
				    </template>
				</el-table-column>
				<el-table-column prop="latitude"  label="纬度" min-width="120" show-overflow-tooltip col-type="BigDecimal" v-if="showCol('latitude')"  sortable>
				    <template #default="scope">
                            <mdp-input show-style="tag" v-model="scope.row.latitude" @change.prevent="editSomeFields(scope.row,'latitude',$event)" :maxlength="10" :disabled="disField"/>
				    </template>
				</el-table-column>
				<el-table-column prop="regionId"  label="区域编号" min-width="120" show-overflow-tooltip col-type="String" v-if="showCol('regionId')"  sortable>
				    <template #default="scope">
                            <mdp-input show-style="tag" v-model="scope.row.regionId" :maxlength="50" @change.prevent="editSomeFields(scope.row,'regionId',$event)" :disabled="disField"/>
				    </template>
				</el-table-column>
				<el-table-column prop="regionName"  label="定位街道名称" min-width="120" show-overflow-tooltip col-type="String" v-if="showCol('regionName')"  sortable>
				    <template #default="scope">
                            <mdp-input show-style="tag" v-model="scope.row.regionName" :maxlength="255" @change.prevent="editSomeFields(scope.row,'regionName',$event)" :disabled="disField"/>
				    </template>
				</el-table-column>
				<el-table-column prop="formatAddress"  label="定位格式化地址名称" min-width="120" show-overflow-tooltip col-type="String" v-if="showCol('formatAddress')"  sortable>
				    <template #default="scope">
                            <mdp-input show-style="tag" v-model="scope.row.formatAddress" :maxlength="255" @change.prevent="editSomeFields(scope.row,'formatAddress',$event)" :disabled="disField"/>
				    </template>
				</el-table-column>
				<el-table-column prop="districtId"  label="定位区县编号" min-width="120" show-overflow-tooltip col-type="String" v-if="showCol('districtId')"  sortable>
				    <template #default="scope">
                            <mdp-input show-style="tag" v-model="scope.row.districtId" :maxlength="50" @change.prevent="editSomeFields(scope.row,'districtId',$event)" :disabled="disField"/>
				    </template>
				</el-table-column>
				<el-table-column prop="shopId"  label="商户编号" min-width="120" show-overflow-tooltip col-type="String" v-if="showCol('shopId')"  sortable>
				    <template #default="scope">
                            <mdp-input show-style="tag" v-model="scope.row.shopId" :maxlength="64" @change.prevent="editSomeFields(scope.row,'shopId',$event)" :disabled="disField"/>
				    </template>
				</el-table-column>
				<el-table-column prop="locationId"  label="门店编号" min-width="120" show-overflow-tooltip col-type="String" v-if="showCol('locationId')"  sortable>
				    <template #default="scope">
                            <mdp-input show-style="tag" v-model="scope.row.locationId" :maxlength="64" @change.prevent="editSomeFields(scope.row,'locationId',$event)" :disabled="disField"/>
				    </template>
				</el-table-column>

				<el-table-column prop="authId"  label="授权码" min-width="120" show-overflow-tooltip col-type="String" v-if="showCol('authId')"  sortable>
				    <template #default="scope">
                            <mdp-input show-style="tag" v-model="scope.row.authId" :maxlength="64" @change.prevent="editSomeFields(scope.row,'authId',$event)" :disabled="disField"/>
				    </template>
				</el-table-column>
				<el-table-column prop="mdpAppid"  label="mdp平台appid" min-width="120" show-overflow-tooltip col-type="String" v-if="showCol('mdpAppid')">
				    <template #default="scope">
                            <mdp-input show-style="tag" v-model="scope.row.mdpAppid" :maxlength="64" @change.prevent="editSomeFields(scope.row,'mdpAppid',$event)" :disabled="disField"/>
				    </template>
				</el-table-column>
				<el-table-column prop="lockNo"  label="批处理编号" min-width="120" show-overflow-tooltip col-type="String" v-if="showCol('lockNo')">
				    <template #default="scope">
                            <mdp-input show-style="tag" v-model="scope.row.lockNo" :maxlength="64" @change.prevent="editSomeFields(scope.row,'lockNo',$event)" :disabled="disField"/>
				    </template>
				</el-table-column>
				<el-table-column prop="lockStatus"  label="锁定状态" min-width="120" show-overflow-tooltip col-type="String" v-if="showCol('lockStatus')"  sortable>
				    <template #default="scope">
                            <mdp-input show-style="tag" v-model="scope.row.lockStatus" :maxlength="1" @change.prevent="editSomeFields(scope.row,'lockStatus',$event)" :disabled="disField"/>
				    </template>
				</el-table-column>
				<el-table-column prop="lockTime"  label="批处理时间" min-width="120" show-overflow-tooltip col-type="Date" v-if="showCol('lockTime')"  sortable>
				    <template #default="scope">
                            <mdp-date type="date" placeholder="选择日期" show-style="tag" v-model="scope.row.lockTime" @change="editSomeFields(scope.row,'lockTime',$event)"  value-format="YYYY-MM-DD HH:mm:ss" format="YYYY-MM-DD" :disabled="disField"/>
				    </template>
				</el-table-column>
				<el-table-column prop="loginBranchId"  label="登录机构号" min-width="120" show-overflow-tooltip col-type="String" v-if="showCol('loginBranchId')"  sortable>
				    <template #default="scope">
                            <mdp-input show-style="tag" v-model="scope.row.loginBranchId" :maxlength="64" @change.prevent="editSomeFields(scope.row,'loginBranchId',$event)" :disabled="disField"/>
				    </template>
				</el-table-column>
			</el-table>  
			<el-pagination class="padding-top"
				layout="slot,total, sizes, prev, next,pager,jumper"
				@current-change="handleCurrentChange"
				@size-change="handleSizeChange"
				:page-sizes="[10,20, 50, 100, 500]"
				:current-page="pageInfo.pageNum"
				:page-size="pageInfo.pageSize"
				:total="pageInfo.total"
				style="float:right;"
			/> 
</template>

<script>

import { MdpTableMixin } from '@/components/mdp-ui/mixin/MdpTableMixin.js';
import { mapState } from 'pinia'
import { useUserStore } from '@/store/modules/user'

export default {
    name:'userLoginRecordMng',
    mixins:[MdpTableMixin],
		props:{
			subOpType:{
				type:String,
				default:'detail'
			}
		},
    components: {
    },
    computed: {
    },
    watch:{
    },
    data() {
        return {
            menuDefId:'',//menu_def.id 菜单表菜单编号，用于按钮权限判断
            menuDefName:'用户登录信息登记',//menu_def.name 功能名称，用于导出excel等文件名
            refId:'userLoginRecord',//引用编号，<table :ref="refId+'Table'"> <form :ref="refId+'Form'">
            pkNames:["id"],//表格主键的java属性名称，驼峰命名，默认为id,支持多主键
            
            filters:{//查询参数

            },
            defaultFilters:{//默认查询参数,第一次打开界面的时候用到，恢复默认值的时候用到

            },

            pageInfo:{//分页数据
                total:0,//服务器端收到0时，会自动计算总记录数，如果上传>0的不自动计算。
                pageSize: this.pageable?10:1500,//每页数据
                count:false,//是否需要重新计算总记录数
                pageNum:1,//当前页码、从1开始计算
                orderFields:['login_time'],//排序列 如 ['sex','student_id']，必须为数据库字段
                orderDirs:['desc']//升序 asc,降序desc 如 性别 升序、学生编号降序 ['asc','desc']
            },
            defaultCheckColumnNum:24,//默认展示的表格列数，前8列

            editable:false,//是否可编辑模式

            //增删改查(含批量)接口
            apis:{
                list: this.$mdp.listUserLoginRecord,
            }
        }
    },
    methods: {
         //页面初始化需要配置的特殊逻辑写这里
          initCurrData(){
             this.searchTableDatas();
          },

          /**
           * 检查参数是否满足调用后台接口的条件
           *
           * @param params 提交给后台的参数池,map类型
           * @returns true / false
           */
          preQueryParamCheck(params){
              return true;
          },

          //页面数据加载完后需要对数据进行加工处理的
          afterList(tableDatas,isOk,apiName){

          },

          /**
           * 对修改的字段进行判断，返回false ,将取消更新数据库
           * @param {*} row 当前选中的行
           * @param {*} fieldName 修改的字段名
           * @param {*} $event 修改后的值
           * @param {*} params 将要提交服务器的参数
           * @returns true/false 返回false ,将取消更新数据库
           */
          editSomeFieldsCheck(row,fieldName,$event,params){
              if(this.currOpType=='add'||this.currOpType=='detail'){
                  return false;
              }
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
