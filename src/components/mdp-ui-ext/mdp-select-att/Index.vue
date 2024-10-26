<template> 
	<mdp-lr-box :lspan="6" ref="lrbox">
		<template #left>
			<mdp-cate-tree :category-type="archiveType" :category-id="categoryId" :crely-type="crelyType" :crely-id="crelyId" :crely-stype="crelyStype" :crely-sid="crelySid" show-checkbox :expand-on-click-node="false"   @check-change="handleLeftCategoryNodeClick"/> 
		</template>
		<ContentWrap>
					<el-space wrap>
 						<el-input v-model="filters['res.name']" style="width:10em;" placeholder="名称" clearable title="支持>、<、 >=、<=、!=、*字符*、$IS NULL、$IN 1,2,3、$between 1,5等操作符"/>
						<el-input v-model="filters.relativePath"  style="width:10em;" placeholder="存储路径" clearable title="支持>、<、 >=、<=、!=、*字符*、$IS NULL、$IN 1,2,3、$between 1,5等操作符"/>
						<el-input v-model="filters.url" style="width:10em;"  placeholder="访问路径" clearable title="支持>、<、 >=、<=、!=、*字符*、$IS NULL、$IN 1,2,3、$between 1,5等操作符"/>

						<el-input style="width:10em;" v-if="currOpType!='select'" v-model="filters.archiveId"  placeholder="文章编号" clearable title="支持>、<、 >=、<=、!=、*字符*、$IS NULL、$IN 1,2,3、$between 1,5等操作符"/>
						<el-button v-loading="load.list" :disabled="load.list==true" @click="searchTableDatas()" icon="search" type="primary" plain/>
						
					</el-space>
					<template #header>
					<el-space  wrap> 
						<el-button :icon="$refs.lrbox?.myExpand?'DArrowLeft':'DArrowRight'" @click="$refs.lrbox.toggle()" plain title="展开/收起左边"/>

						<mdp-select v-model="filters.archiveType"  placeholder="主题" clearable item-code="categoryType"  width="100px" :disabled="filters.categoryId||archiveType"/>   

						<mdp-hi-query :column-configs="columnConfigs" v-model="hiQueryParams" @change="onHiQueryParamsChange"/>
						<el-button icon="zoom-out"  @click="searchReset()"/> 
						<span v-if="currOpType=='mng'">
							<el-button :disabled="disBtn('addBtn') || !checkBtnQx('addBtn',menuDefId) " type="primary" @click="openForm({parentOpType:currOpType,subOpType:'add',formData:addForm,title:'新增'})" icon="plus" plain/>
							<el-button :disabled="disBtn('delBtn') || !checkBtnQx('delBtn',menuDefId) || sels.length===0 || load.del==true" type="danger" v-loading="load.del" @click="batchDel" icon="delete" plain/>

						</span>
						<span  v-else-if="currOpType=='select'">
 							
							<el-button :disabled="!checkBtnQx('addBtn',menuDefId) " type="primary" @click="openForm({parentOpType:currOpType,subOpType:'add',formData:addForm,title:'新增'})" icon="plus" plain/>
							<el-button :disabled="!checkBtnQx('delBtn',menuDefId) || this.sels.length===0 || load.del==true" type="danger" v-loading="load.del" @click="batchDel" icon="delete" plain/>
              				<el-button v-if="multiple==true" :disabled="disBtn('selectBtn') || this.sels.length===0" type="primary" @click="selectListConfirm" icon="check" plain>确认选择</el-button>
						</span>
						
						<el-button icon="download" @click="export2Excel()" title="导出" />
						<mdp-table-configs :column-configs="columnConfigs" v-model="checkedColumns"/>
					</el-space> 
				</template>
				</ContentWrap>
						<!--列表 Attachment 档案附件表-->
						<el-table v-adaptive :ref="refId+'Table'"  :data="tableDatas" @sort-change="sortChange" highlight-current-row v-loading="load.list" border @selection-change="selsChange" @row-click="rowClick" style="width: 100%;">
							<el-table-column  type="selection" width="55" show-overflow-tooltip fixed="left" v-if="currOpType=='mng' || this.multiple==true"/>
							<el-table-column prop="name"  label="文件名称" min-width="250" col-type="String" v-if="showCol('name')"/>
							
							<el-table-column prop="archiveType"  label="主题" min-width="100" show-overflow-tooltip col-type="String" v-if="showCol('archiveType')">
								<template #default="scope">
										<mdp-select @click="rowClick(scope.row)" item-code="categoryType" show-style="tag" v-model="scope.row.archiveType" :maxlength="1" @change="editSomeFields(scope.row,'archiveType',$event)" :disabled="disField||true"/>
								</template>
							</el-table-column>
							 
							<el-table-column prop="createDate"  label="上传时间" min-width="120" show-overflow-tooltip col-type="Date" v-if="showCol('createDate')"/>
							
							<el-table-column prop="fileSize"  label="大小" min-width="120" show-overflow-tooltip col-type="BigDecimal" v-if="showCol('fileSize')"/>
							<el-table-column prop="canDown"  label="可下载" min-width="80" show-overflow-tooltip col-type="String" v-if="showCol('canDown')">
								<template #default="scope">
										<mdp-select show-style="tag" v-model="scope.row.canDown" itemCode="yesOrNo" :maxlength="1" @change="editSomeFields(scope.row,'canDown',$event)" :disabled="true"/>
								</template>
							</el-table-column>
							<el-table-column prop="canDel"  label="可删除" min-width="80" show-overflow-tooltip col-type="String" v-if="showCol('canDel')">
								<template #default="scope">
										<mdp-select show-style="tag" v-model="scope.row.canDel" itemCode="yesOrNo" :maxlength="1" @change="editSomeFields(scope.row,'canDel',$event)" :disabled="disField"/>
								</template>
							</el-table-column>
							<el-table-column prop="canRead"  label="可读" min-width="80" show-overflow-tooltip col-type="String" v-if="showCol('canRead')">
								<template #default="scope">
										<mdp-select show-style="tag" v-model="scope.row.canRead" itemCode="yesOrNo" :maxlength="1" @change="editSomeFields(scope.row,'canRead',$event)" :disabled="disField"/>
								</template>
							</el-table-column>
							
							<el-table-column prop="url"  label="访问路径" min-width="120" show-overflow-tooltip col-type="String" v-if="showCol('url')">
								<template #default="scope">
										<mdp-input show-style="tag" v-model="scope.row.url" :maxlength="250" @change="editSomeFields(scope.row,'url',$event)" :disabled="disField||true"/>
								</template>
							</el-table-column>
							<el-table-column prop="bizId"  label="业务编号" min-width="120" show-overflow-tooltip col-type="String" v-if="showCol('bizId')">
								<template #default="scope">
										<mdp-input show-style="tag" v-model="scope.row.bizId" :maxlength="150" @change="editSomeFields(scope.row,'bizId',$event)" :disabled="disField||true"/>
								</template>
							</el-table-column>
							<el-table-column prop="remark"  label="业务名称等" min-width="120" show-overflow-tooltip col-type="String" v-if="showCol('remark')">
								<template #default="scope">
										<mdp-input show-style="tag" v-model="scope.row.remark" :maxlength="1000" @change="editSomeFields(scope.row,'remark',$event)" :disabled="disField||true"/>
								</template>
							</el-table-column>
							<el-table-column prop="storeName"  label="存储名字" min-width="120" show-overflow-tooltip col-type="String" v-if="showCol('storeName')">
								<template #default="scope">
										<mdp-input show-style="tag" v-model="scope.row.storeName" :maxlength="50" @change="editSomeFields(scope.row,'storeName',$event)" :disabled="disField||true"/>
								</template>
							</el-table-column>
							<el-table-column prop="branchId"  label="云用户机构编号" min-width="120" show-overflow-tooltip col-type="String" v-if="showCol('branchId')">
								<template #default="scope">
										<mdp-input show-style="tag" v-model="scope.row.branchId" :maxlength="50" @change="editSomeFields(scope.row,'branchId',$event)" :disabled="disField||true"/>
								</template>
							</el-table-column>
              
							<el-table-column prop="deptid"  label="部门编号" min-width="120" show-overflow-tooltip col-type="String" v-if="showCol('deptid')">
								<template #default="scope">
										<mdp-input show-style="tag" v-model="scope.row.deptid" :maxlength="50" @change="editSomeFields(scope.row,'deptid',$event)" :disabled="disField||true"/>
								</template>
							</el-table-column>
							<el-table-column prop="categoryId"  label="分类编号" min-width="120" show-overflow-tooltip col-type="String" v-if="showCol('categoryId')">
								<template #default="scope">
										<mdp-input show-style="tag" v-model="scope.row.categoryId" :maxlength="50" @change="editSomeFields(scope.row,'categoryId',$event)" :disabled="disField||true"/>
								</template>
							</el-table-column>
							<el-table-column prop="id" label="编号" min-width="120" show-overflow-tooltip  col-type="String" v-if="showCol('id')"/>

							<el-table-column prop="relativePath"  label="硬盘存放路径" min-width="120" show-overflow-tooltip col-type="String" v-if="showCol('relativePath')">
								<template #default="scope">
										<mdp-input show-style="tag" v-model="scope.row.relativePath" :maxlength="1000" @change="editSomeFields(scope.row,'relativePath',$event)" :disabled="disField||true"/>
								</template>
							</el-table-column>
							<el-table-column prop="fileSuffix"  label="后缀名" min-width="120" show-overflow-tooltip col-type="String" v-if="showCol('fileSuffix')||true">
								<template #default="scope">
										<mdp-input show-style="tag" v-model="scope.row.fileSuffix" :maxlength="10" @change="editSomeFields(scope.row,'fileSuffix',$event)" :disabled="disField||true"/>
								</template>
							</el-table-column>
							<el-table-column prop="cdnUrl"  label="内容加速器访问路径" min-width="120" show-overflow-tooltip col-type="String" v-if="showCol('cdnUrl')">
								<template #default="scope">
										<mdp-input show-style="tag" v-model="scope.row.cdnUrl" :maxlength="250" @change="editSomeFields(scope.row,'cdnUrl',$event)" :disabled="disField||true"/>
								</template>
							</el-table-column>
							<el-table-column prop="archiveId"  label="档案主编号" min-width="120" show-overflow-tooltip col-type="String" v-if="showCol('archiveId')">
								<template #default="scope">
										<mdp-input show-style="tag" v-model="scope.row.archiveId" :maxlength="150" @change="editSomeFields(scope.row,'archiveId',$event)" :disabled="disField||true"/>
								</template>
							</el-table-column>
							<el-table-column prop="isCdn"  label="是否使用CDN" min-width="120" show-overflow-tooltip col-type="String" v-if="showCol('isCdn')">
								<template #default="scope">
										<mdp-input show-style="tag" v-model="scope.row.isCdn" :maxlength="1" @change="editSomeFields(scope.row,'isCdn',$event)" :disabled="disField||true"/>
								</template>
							</el-table-column>
							<el-table-column prop="rootPath"  label="根目录" min-width="120" show-overflow-tooltip col-type="String" v-if="showCol('rootPath')">
								<template #default="scope">
										<mdp-input show-style="tag" v-model="scope.row.rootPath" :maxlength="250" @change="editSomeFields(scope.row,'rootPath',$event)" :disabled="disField||true"/>
								</template>
							</el-table-column>
							<el-table-column label="操作" :width="currOpType=='mng'?180:100" fixed="right">  
								<template #default="scope">
									<div v-if="currOpType=='mng'">
										<el-button v-if="scope.row.canDown=='1' || scope.row.candRead=='1'" @click="handlePreview ( scope.row,scope.$index)" icon="download"/>
										<el-button v-if="scope.row.cuserid==userInfo.userid||userInfo.isBranchAdmin" :disabled="disBtn('editBtn') || !checkBtnQx('editBtn',menuDefId) " type="primary" @click="openForm({parentOpType:currOpType,subOpType:'edit',formData:scope.row,title:'修改'})" icon="edit" title="修改一条数据"/>
									</div> 
 									<el-button v-if="currOpType=='select' && !multiple"  type="primary" @click="selectConfirm(scope.row)" icon="check"/>
								</template>
							</el-table-column>
						</el-table> 
					<el-pagination
						layout="slot,total, sizes, prev, next,pager,jumper"
						@current-change="handleCurrentChange"
						@size-change="handleSizeChange"
						:page-sizes="[10,20, 50, 100, 500]"
						:current-page="pageInfo.pageNum"
						:page-size="pageInfo.pageSize"
						:total="pageInfo.total"
						style="float:right;"
					/>   
	</mdp-lr-box> 
			<!--新增修改明细 Attachment 档案附件表界面-->
            <mdp-dialog :ref="refId+'FormDialog'">
                <template #default="{visible,data}">
                     <attachment-form :ref="refId+'Form'" :visible="visible" :bizId="bizId"
					 :rely-type="crelyType" :rely-id="crelyId" :rely-stype="crelyStype" :rely-sid="crelySid"
					 :parent-op-type="currOpType" :sub-op-type="data.subOpType" :form-data="data.formData" @close="onFormClose" @submit="afterFormSubmit" @fields-change="afterEditSomeFields"/>
                </template>
            </mdp-dialog> 
</template>

<script>

import { MdpTableMixin } from '../../mdp-ui/mixin/MdpTableMixin.js';
 import  AttachmentForm from './Form.vue';//新增修改明细界面 

 
import { mapState } from 'pinia'
import { useUserStore } from '@/store/modules/user'
export default {
    name:'MdpSelectAtt',
    mixins:[MdpTableMixin],
    components: {
        AttachmentForm
    },
		computed:{
			...mapState(useUserStore,['userInfo'])
		},
	props:{
		/**
		 * 主题
		 */
		archiveType:{
			type:String,
			default:null,
		},
		/**
		 * 分类
		 */
		categoryId:{
			type:String,
			default:''
		},
		crelyType:{
			type:String,
			default:''
		},
		crelyId:{
			type:String,
			default:''
		},
		crelyStype:{
			type:String,
			default:'',
		},
		crelySid:{
			type:String,
			default:''
		},
		/**
		 * 需要绑定的业务编号
		 */
		bizId:{
			type:String,
			default:''
		} 
	}, 
    watch:{
    },
    data() {
        return {
            menuDefId:'',//menu_def.id 菜单表菜单编号，用于按钮权限判断
            menuDefName:'档案附件表',//menu_def.name 功能名称，用于导出excel等文件名
            refId:'attachment',//引用编号，<table :ref="refId+'Table'"> <form :ref="refId+'Form'">
            pkNames:["id"],//表格主键的java属性名称，驼峰命名，默认为id,支持多主键
            currOpType:'select',//表格 mng-综合管理具有最大权限，所有按钮可动、detail-只看不能操作
            filters:{//查询参数

            },
            defaultFilters:{//默认查询参数,第一次打开界面的时候用到，恢复默认值的时候用到

            }, 

            defaultCheckColumnNum:8,//默认展示的表格列数，前8列

            //增删改查(含批量)接口
            apis:{
                list: this.$mdp.listAttachment,
                add: this.$mdp.addAttachment,
                del: this.$mdp.delAttachment,
                edit: this.$mdp.editAttachment,
                editSomeFields: this.$mdp.editSomeFieldsAttachment,
                batchAdd: this.$mdp.batchAddAttachment,
                batchDel: this.$mdp.batchDelAttachment,
                batchEdit: this.$mdp.batchEditAttachment,
            }
        }
    },
    methods: {
         //页面初始化需要配置的特殊逻辑写这里
          initCurrData(){
			if(!this.subOpType){
				this.currOpType='select'
			}
             this.searchTableDatas();
          },

          /**
           * 检查参数是否满足调用后台接口的条件
           *
           * @param params 提交给后台的参数池,map类型
           * @returns true / false
           */
          preQueryParamCheck(params){ 
			if(this.archiveType){
				params.archiveType=this.archiveType
			}
			if(this.crelyType){
				params.crelyType=this.crelyType
			}
			
			if(this.crelyStype){
				params.crelyStype=this.crelyStype
			}
			
			if(this.crelyId){
				params.crelyId=this.crelyId
			}
			
			if(this.crelySid){
				params.crelySid=this.crelySid
			}
			 
			if(this.crelyType){
				params.relyType=this.crelyType
			}
			
			if(this.crelyStype){
				params.relyStype=this.crelyStype
			}
			
			if(this.crelyId){
				params.relyId=this.crelyId
			}
			
			if(this.crelySid){
				params.relySid=this.crelySid
			}
			if(this.bizId){
				params.bizId=this.bizId
			}
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

         /**
          * 打开某个子页面
          */
        openForm(res){
            let {parentOpType,formRefId,subOpType,formData} = res
            if(subOpType=='add'){
              if(!this.filters.categoryId){
                this.$message.error("请先选择一个分类");
                return ;
              }
              formData.categoryId=this.filters.categoryId
              formData.archiveType=this.filters.archiveType
							formData.relyType=this.crelyType||''
							formData.relyId=this.crelyId||''
							formData.relyStype=this.crelyStype||''
							formData.relySid=this.crelySid||''
              formData.storeName=""
              formData.id=null;
            }
            if(!formRefId){
                formRefId=this.getRefId()+"FormDialog"
            }
            if(!parentOpType){
                parentOpType=this.currOpType
            }
            var form=this.$refs[formRefId]
            if(form){
                res.parentOpType=parentOpType
                res.formRefId=formRefId
                form.open(res);
            }else{

            }

        },
		handleLeftCategoryNodeClick(data, checked, indeterminate){ 
			this.tableDatas=[]
			if(data.id=='0' || checked==false){//选择了根节点，默认不按分类查询
				this.filters.categoryId=null 
				this.filters.archiveType=null
			}else{
				this.filters.categoryId=data.id;  
				this.filters.archiveType=data.categoryType;  
			} 
			this.searchTableDatas();
		},
		converUrl(row){
			if("1"==row.isOutUrl){
				return row.outUrl;
			}
			if(row.url!=null  && !row.url.indexOf('http')==0 && !row.url.indexOf('www')==0){ 
        return this.$mdp.getUri(this.$mdp.getArcImagePreviewBasePath(),row.url)
			}
			return row.url;
		},
		handlePreview(row,index) { 
		        let relativePath=row.relativePath; 
		        let name=row.name;
		        var attachmentPreviewUrl=this.converUrl(row)+"?name="+name;
						this.$mdp.openWin(attachmentPreviewUrl) 
		  },
    },
    mounted() {

    }
}

</script>

<style scoped>
</style>