<template> 
		<el-row :gutter="10">
			<el-col :span="8" class="border padding">
				<dept-tree
					show-root
					:show-count="false"
					:show-checkbox="true"
					:expand-on-click-node="false"
					@check-change="deptTreeCheckChange" 
					/>
			</el-col>
			<el-col :span="16" class="border padding">
				<ContentWrap>
					<el-space wrap>
					<el-input v-model="filters.userid" style="width: 15%;" placeholder="用户编号查询" clearable title="支持>、<、 >=、<=、!=、*陈*、$IS NULL、$IN 1,2,3、between 1,5等操作符"/>

					<el-input v-model="filters.displayUserid" style="width: 15%;" placeholder="登陆编号查询" clearable title="支持>、<、 >=、<=、!=、*陈*、$IS NULL、$IN 1,2,3、between 1,5等操作符"/>

					<el-input v-model="filters.username" style="width: 15%;" placeholder="名称查询" clearable title="支持>、<、 >=、<=、!=、*陈*、$IS NULL、$IN 1,2,3、between 1,5等操作符"/>
					<el-button v-loading="load.list" :disabled="load.list==true" @click="searchTableDatas()" icon="search" type="primary">查询</el-button>
 
				</el-space>
				<template #header>
				<el-space wrap> 
					<mdp-hi-query :column-configs="columnConfigs" v-model="hiQueryParams" @change="onHiQueryParamsChange"/>
					<el-button icon="zoom-out" @click="searchReset()" title="重置查询条件并查询"/> 
					<el-button v-if="multiple==true" :disabled="this.sels.length===0" type="primary" @click="selectListConfirm" icon="check">确认选择</el-button>

					</el-space>
				</template>
				</ContentWrap> 
					<!--列表 User 用户表-->
					<el-table v-adaptive :ref="refId+'Table'"  :data="tableDatas" @sort-change="sortChange" highlight-current-row v-loading="load.list" border @selection-change="selsChange" @row-click="rowClick" style="width: 100%;">
						<el-table-column  type="selection" width="55" show-overflow-tooltip fixed="left" v-if="multiple==true"/> 						
						<el-table-column prop="username"  label="用户名称" min-width="220" fixed="left" col-type="String" v-if="showCol('username')">
							
							<template #default="scope">
								<div class="avatar-container" @click="openForm({formData:scope.row,subOpType:'edit'})">
								<div class="avatar-wrapper">
									<img  v-if=" scope.row.headimgurl " class="user-avatar" :src="scope.row.headimgurl"/>
									<img  v-else class="user-avatar" src="../../../assets/image/user_img.gif"/>
									<span class="username"><i v-if="scope.row.sex=='0'" class="el-icon-female"></i><i v-else class="el-icon-male"></i> {{scope.row.username}}</span> 
								</div>    
							</div> 
							</template>
						</el-table-column>
						<el-table-column prop="userid" label="用户编号" min-width="120" show-overflow-tooltip col-type="String" v-if="showCol('userid')"/>
						<el-table-column prop="displayUserid"  label="登录编号" min-width="120" show-overflow-tooltip col-type="String" v-if="showCol('displayUserid')"/>

						<el-table-column prop="ustatus"  label="状态" min-width="120" show-overflow-tooltip col-type="String" v-if="showCol('ustatus')"/>

						<el-table-column prop="branchId"  label="机构编号" min-width="120" show-overflow-tooltip col-type="String" v-if="showCol('branchId')"/>

						
						<el-table-column prop="locked"  label="锁定" min-width="120" show-overflow-tooltip col-type="String" v-if="showCol('locked')"/>
						<el-table-column prop="startdate"  label="启用日期" min-width="120" show-overflow-tooltip col-type="Date" v-if="showCol('startdate')"/>
						<el-table-column prop="enddate"  label="到期日期" min-width="120" show-overflow-tooltip col-type="Date" v-if="showCol('enddate')"/>
						<el-table-column prop="profeName"  label="职业名称" min-width="120" show-overflow-tooltip col-type="String" v-if="showCol('profeName')"/>
						<el-table-column prop="memType"  label="会员类型" min-width="120" show-overflow-tooltip col-type="String" v-if="showCol('memType')"/>
						<el-table-column prop="gradeName"  label="会员等级" min-width="120" show-overflow-tooltip col-type="String" v-if="showCol('gradeName')"/>
						<el-table-column prop="ilvlName"  label="权益等级名称" min-width="120" show-overflow-tooltip col-type="String" v-if="showCol('ilvlName')"/>
						<el-table-column prop="istatus"  label="权益状态" min-width="120" show-overflow-tooltip col-type="String" v-if="showCol('istatus')"/>
						<el-table-column prop="istime"  label="权益开始时间" min-width="120" show-overflow-tooltip col-type="Date" v-if="showCol('istime')"/>
						<el-table-column prop="ietime"  label="权益结束时间" min-width="120" show-overflow-tooltip col-type="Date" v-if="showCol('ietime')"/>
						
						<el-table-column prop="phoneno"  label="电话" min-width="120" show-overflow-tooltip col-type="String" v-if="showCol('phoneno')"/>
						<el-table-column prop="continent"  label="洲别" min-width="120" show-overflow-tooltip col-type="String" v-if="showCol('continent')"/>
						<el-table-column prop="country"  label="国家" min-width="120" show-overflow-tooltip col-type="String" v-if="showCol('country')"/>
						<el-table-column prop="province"  label="省份" min-width="120" show-overflow-tooltip col-type="String" v-if="showCol('province')"/>
						<el-table-column prop="city"  label="城市" min-width="120" show-overflow-tooltip col-type="String" v-if="showCol('city')"/>
						<el-table-column prop="districtId"  label="区县编号" min-width="120" show-overflow-tooltip col-type="String" v-if="showCol('districtId')"/>

						<el-table-column prop="address"  label="详细地址" min-width="120" show-overflow-tooltip col-type="String" v-if="showCol('address')"/>
						<el-table-column prop="idCardNo"  label="身份证号码" min-width="120" show-overflow-tooltip col-type="String" v-if="showCol('idCardNo')"/>

						<el-table-column prop="email"  label="邮箱" min-width="120" show-overflow-tooltip col-type="String" v-if="showCol('email')"/>
						<el-table-column prop="emailBak"  label="备用邮箱" min-width="120" show-overflow-tooltip col-type="String" v-if="showCol('emailBak')"/>

						<el-table-column prop="officePhoneno"  label="办公室电话" min-width="120" show-overflow-tooltip col-type="String" v-if="showCol('officePhoneno')"/>
						<el-table-column prop="orgId"  label="归属机构" min-width="120" show-overflow-tooltip col-type="String" v-if="showCol('orgId')"/>
						<el-table-column prop="pwdStrong"  label="密码强度" min-width="120" show-overflow-tooltip col-type="String" v-if="showCol('pwdStrong')"/>
						<el-table-column prop="lockType"  label="锁定类型" min-width="120" show-overflow-tooltip col-type="String" v-if="showCol('lockType')"/>
						<el-table-column prop="lockRemark"  label="锁定原因" min-width="120" show-overflow-tooltip col-type="String" v-if="showCol('lockRemark')"/>
						<el-table-column prop="ltime"  label="更新日期" min-width="120" show-overflow-tooltip col-type="Date" v-if="showCol('ltime')"/>
						<el-table-column prop="atype"  label="账户类型" min-width="120" show-overflow-tooltip col-type="String" v-if="showCol('atype')"/>
						<el-table-column prop="cpaType"  label="协作类型" min-width="120" show-overflow-tooltip col-type="String" v-if="showCol('cpaType')"/>
						<el-table-column prop="cpaOrg"  label="协作组织" min-width="120" show-overflow-tooltip col-type="String" v-if="showCol('cpaOrg')"/>
						<el-table-column prop="roleids"  label="拥有的角色" min-width="120" show-overflow-tooltip col-type="String" v-if="showCol('roleids')"/>
						<el-table-column prop="birthday"  label="生日" min-width="120" show-overflow-tooltip col-type="Date" v-if="showCol('birthday')"/>
						<el-table-column prop="profeId"  label="职业编号" min-width="120" show-overflow-tooltip col-type="String" v-if="showCol('profeId')"/>
						<el-table-column prop="validLvls"  label="人工验证结果" min-width="120" show-overflow-tooltip col-type="String" v-if="showCol('validLvls')"/>
						<el-table-column prop="profeType"  label="职业" min-width="120" show-overflow-tooltip col-type="String" v-if="showCol('profeType')"/>
						<el-table-column prop="creditId"  label="信用等级编号" min-width="120" show-overflow-tooltip col-type="String" v-if="showCol('creditId')"/>
						<el-table-column prop="creditScore"  label="信用等级分数" min-width="120" show-overflow-tooltip col-type="Integer" v-if="showCol('creditScore')"/>
						<el-table-column prop="guardId"  label="服务保障等级" min-width="120" show-overflow-tooltip col-type="String" v-if="showCol('guardId')"/>
						<el-table-column prop="open"  label="开放" min-width="120" show-overflow-tooltip col-type="String" v-if="showCol('open')"/>
						<el-table-column prop="remark"  label="简介备注" min-width="120" show-overflow-tooltip col-type="String" v-if="showCol('remark')"/>
						<el-table-column prop="bizHours"  label="营业时间说明09:00-12:00" min-width="120" show-overflow-tooltip col-type="String" v-if="showCol('bizHours')"/>
						<el-table-column prop="skillIds"  label="技能编号列表" min-width="120" show-overflow-tooltip col-type="String" v-if="showCol('skillIds')"/>
						<el-table-column prop="skillNames"  label="技能名称列表" min-width="120" show-overflow-tooltip col-type="String" v-if="showCol('skillNames')"/>
						<el-table-column prop="unionid"  label="全局唯一编号" min-width="120" show-overflow-tooltip col-type="String" v-if="showCol('unionid')"/>
						<el-table-column prop="nickname"  label="昵称" min-width="120" show-overflow-tooltip col-type="String" v-if="showCol('nickname')"/>
						<el-table-column prop="features"  label="个性化签名" min-width="120" show-overflow-tooltip col-type="String" v-if="showCol('features')"/>
						<el-table-column prop="sex"  label="性别" min-width="120" show-overflow-tooltip col-type="String" v-if="showCol('sex')"/>
						<el-table-column prop="bizProcInstId"  label="当前流程实例编号" min-width="120" show-overflow-tooltip col-type="String" v-if="showCol('bizProcInstId')"/>
						<el-table-column prop="bizFlowState"  label="当前流程状态" min-width="120" show-overflow-tooltip col-type="String" v-if="showCol('bizFlowState')"/>
						<el-table-column prop="gradeId"  label="等级会员" min-width="120" show-overflow-tooltip col-type="String" v-if="showCol('gradeId')"/>
						<el-table-column prop="ilvlId"  label="权益等级" min-width="120" show-overflow-tooltip col-type="String" v-if="showCol('ilvlId')"/>
						
						<el-table-column label="操作" width="120" fixed="right" >
							<template #header> 
								<mdp-table-configs :column-configs="columnConfigs" v-model="checkedColumns"/>
							</template>
							<template #default="scope"> 
				        		<el-button v-if="multiple!==true"  type="primary" @click="selectConfirm(scope.row)" icon="view">选择</el-button> 
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
			</el-col>
		</el-row>  
</template>

<script>
 
import { MdpTableMixin } from '../../mdp-ui/mixin/MdpTableMixin.js'; 
 import DeptTree from "../mdp-select-dept/DeptTree.vue"; 

export default {
    name:'user-select',
    mixins:[MdpTableMixin],
    components: { 
		DeptTree,   
    },
    computed: {
    },
    watch:{
    },
    data() {
        return {
            menuDefId:'',//menu_def.id 菜单表菜单编号，用于按钮权限判断
            menuDefName:'用户表',//menu_def.name 功能名称，用于导出excel等文件名
            refId:'user',//引用编号，<table :ref="refId+'Table'"> <form :ref="refId+'Form'">
            pkNames:["userid"],//表格主键的java属性名称，驼峰命名，默认为id,支持多主键
            currOpType:'select',//表格 mng-综合管理具有最大权限，所有按钮可动、detail-只看不能操作
            filters:{//查询参数

            },
            defaultFilters:{//默认查询参数,第一次打开界面的时候用到，恢复默认值的时候用到

            },

            defaultCheckColumnNum:4,//默认展示的表格列数，前8列
			userInviteVisible:false,

            //增删改查(含批量)接口
            apis:{
                list: this.$mdp.listUser, 
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
          afterList(res,isOk,apiName){

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

         
		deptTreeCheckChange(data, isSelect, leafSelect) { 
			if(isSelect==false){
				this.dept=null;
				this.filters.deptid=''
			}else{
				this.dept = data;
				this.filters.deptid=this.dept.deptid
			} 
			this.searchTableDatas(); 
		},   
    },
    mounted() {

    }
}

</script>

<style scoped>
</style>