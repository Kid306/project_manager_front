<template> 
  <mdp-lr-box :lspan="6" ref="lrbox">
    <template #left>
      <image-category-tree    show-checkbox ref="categoryTree"
				@check-change="handleLeftCategoryNodeClick"/>
    </template> 
      <ContentWrap> 
				<el-space wrap>
					<el-input v-model="filters.name"  placeholder="名称" clearable title="支持>、<、 >=、<=、!=、*字符*、$IS NULL、$IN 1,2,3、$between 1,5等操作符"/>
					<el-input v-model="filters.url"  placeholder="url" clearable title="支持>、<、 >=、<=、!=、*字符*、$IS NULL、$IN 1,2,3、$between 1,5等操作符"/>

					<el-button v-loading="load.list" :disabled="load.list==true" @click="searchTableDatas()" icon="search" type="primary" plain/>

				</el-space>
        <template #header>
				<el-space wrap> 
            <el-button :icon="$refs.lrbox?.myExpand?'DArrowLeft':'DArrowRight'" @click="$refs.lrbox.toggle()" plain title="展开/收起左边"/>

            <mdp-hi-query :column-configs="columnConfigs" v-model="hiQueryParams" @change="onHiQueryParamsChange" :columnConfigs="myColumnConfigs"/>
            <el-button icon="zoom-out"  @click="searchReset()" plain/> 
            <span v-if="currOpType=='mng'">
						<el-button :disabled="disBtn('addBtn') || !checkBtnQx('addBtn',menuDefId) " type="primary" @click="openForm({parentOpType:currOpType,subOpType:'add',formData:addForm,title:'上传图片'})" icon="plus" plain/>
						<el-button :disabled="disBtn('delBtn') || !checkBtnQx('delBtn',menuDefId) || sels.length===0 || load.del==true" type="danger" v-loading="load.del" @click="batchDel" icon="delete"  plain/>
 
					</span>
					<span  v-else-if="currOpType=='select' ">
            <el-button  type="primary" @click="openForm({parentOpType:currOpType,subOpType:'add',formData:addForm,title:'上传图片'})" icon="plus"  plain/>
						<el-button :disabled="  sels.length===0 || load.del==true" type="danger" v-loading="load.del" @click="batchDel" icon="delete"  plain/>
						<el-button :disabled="disBtn('selectBtn') || sels.length===0" type="primary" @click="selectListConfirm" icon="check"  plain>确认选择</el-button>
					</span>
				</el-space>
        </template>
      </ContentWrap>
        <el-space wrap class="padding-left">  
					<div v-for="(o, index) in tableDatas " :key="index"> 
							<div class="img_box"  @click="selectImg(o)">
								<div class="blank" v-show="o.show">
									<div class="black_blank"></div>
									<div class="select_blank"></div>
								</div>
 									<img  :src="converUrl(o)" class="image"/>
               </div>   
              <div>
                  <span class="ellipsis" :title="o.name">{{o.name?o.name:'无标题'}}</span>  
                </div>
                <div>
                  <el-space>
								    <el-button  text size="small"   @click="openForm({formData:o,subOpType:'edit'})">编辑</el-button>
                    <el-button  text size="small"   @click="openForm({formData:o,subOpType:'edit'})">预览</el-button>
                  </el-space>
                </div>
					</div>   
        </el-space>  
    <el-pagination v-adaptive
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
        
  <!--新增修改明细 Image 图片素材库界面-->
  <mdp-dialog :ref="refId+'FormDialog'">
      <template #default="{visible,data}">
            <image-form :ref="refId+'Form'" :visible="visible" :parent-op-type="currOpType" :sub-op-type="data.subOpType" :form-data="data.formData" @close="onFormClose" @submit="afterFormSubmit" @fields-change="afterEditSomeFields"/>
      </template>
  </mdp-dialog>  
</template>

<script>

import { MdpTableMixin } from '../../mdp-ui/mixin/MdpTableMixin.js'; 
import  ImageForm from './Form.vue';//新增修改明细界面 
import  ImageCategoryTree from './Tree.vue';//树

import { mapState } from 'pinia'
import { useUserStore } from '@/store/modules/user'
export default {
    name:'MdpSelectImage',
    mixins:[MdpTableMixin],
    computed: {
        ...mapState(useUserStore,['userInfo'])
    },
    components: {
        ImageForm,ImageCategoryTree
    },
    computed: {
    },
    watch:{
    },
    data() {
        return {
            menuDefId:'',//menu_def.id 菜单表菜单编号，用于按钮权限判断
            menuDefName:'图片素材库',//menu_def.name 功能名称，用于导出excel等文件名
            refId:'image',//引用编号，<table :ref="refId+'Table'"> <form :ref="refId+'Form'">
            pkNames:["id"],//表格编号的java属性名称，驼峰命名，默认为id,支持多编号
            currOpType:'select',//表格 mng-综合管理具有最大权限，所有按钮可动、detail-只看不能操作
            filters:{//查询参数

            },
            defaultFilters:{//默认查询参数,第一次打开界面的时候用到，恢复默认值的时候用到

            },

            defaultCheckColumnNum:8,//默认展示的表格列数，前8列

            //增删改查(含批量)接口
            apis:{
                list: this.$mdp.listImage,
                add: this.$mdp.addImage,
                del: this.$mdp.delImage,
                edit: this.$mdp.editImage,
                editSomeFields: this.$mdp.editSomeFieldsImage,
                batchAdd: this.$mdp.batchAddImage,
                batchDel: this.$mdp.batchDelImage,
                batchEdit: this.$mdp.batchEditImage,
            },
            myColumnConfigs:[ 
              {property:'categoryId',label:'分类编号'},
              {property:'archiveType',label:'主题'},
              {property:'id',label:'编号'},
              {property:'url',label:'url'},
              {property:'fileSuffix',label:'文件后缀'},
              {property:'fileSize',label:'文件大小' ,colType:'int'},
              {property:'createDate',label:'创建日期' ,colType:'Date'},
              {property:'cdate',label:'创建日期' ,colType:'Date'},
              {property:'storageName',label:'硬盘存储路径'},
              {property:'cuserid',label:'上传人号'},
              {property:'cusername',label:'上传人'},
              {property:'relyTypes',label:'参考类型'},
              {property:'relyIds',label:'参考编号'},
              {property:'relySubTypes',label:'参考子类型'},
              {property:'relySubIds',label:'参考子编号'},
              {property:'remark',label:'备注'},
            ]
        }
    },
    methods: {
         //页面初始化需要配置的特殊逻辑写这里
          initCurrData(){
            this.currOpType='select'
            if(this.tableDatas.length>0){
              return;
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
			 
              return true;
          },

          //页面数据加载完后需要对数据进行加工处理的
          afterList(res,isOk,apiName){
            if(isOk==false|| !res){
              return;
            }
            let temps=res;
            temps.forEach(i=>i.show=false);
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
            if(!formRefId){
                formRefId=this.getRefId()+"FormDialog"
            }
			if(subOpType=='add'){
				if(!this.filters.categoryId){
					this.$message.error("请先选择一个分类");
					return ;
				}
				formData.categoryId=this.filters.categoryId
				formData.archiveType=this.filters.archiveType
				formData.storageName=""
				formData.id=null;
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
		handleLeftCategoryNodeClick(data,checked, indeterminate) {    
			if(checked){  
				this.filters.categoryId=data.id 
			} else{  
				this.filters.categoryId='' 
			} 
			this.searchTableDatas();
		},
		
		converUrl(image){
			if("1"==image.isOutUrl){
				return image.outUrl;
			}
			if(image.url!=null  && !image.url.indexOf('http')==0 && !image.url.indexOf('www')==0){ 
        return this.$mdp.getUri(this.$mdp.getArcImagePreviewBasePath(),image.url)
			}
			return image.url;
		},
		
		selectImg(image){ 
			if(image.show==true){
				image.show=false;
				let index=this.sels.indexOf(image);
				this.sels.splice(index,1);
			}else{
				//this.images.forEach(i=>i.show=false);
				image.show=true;
				this.sels.push(image);
			}  
		},
    },
    mounted() {

    }
}

</script>

<style scoped>
  
.img_box {
  width: 150px;
  height:150px;  
}
  .image {
    max-width: 150px; 
    height: 150px;
    object-fit: cover;
  }

  .blank{
		position:relative;
	}
  .black_blank{
  	position: absolute;
    top: 0;
    left: 0;
	background:rgba(0,0,0,.6);
    width: 100%;
    height: 150px;
    vertical-align: middle;
    display: inline-block;
  } 
  .select_blank{
  	position: absolute;
    top: 0;
    left: 0;
    background: transparent url(./selected_image.png) no-repeat 0 0;
    width: 100%;
    height: 150px;
    vertical-align: middle;
    display: inline-block;
    background-position: 50% 70%;
  }
    

  .ellipsis {
    white-space: nowrap; /* 确保文本在一行内显示 */
    overflow: hidden; /* 隐藏超出容器的文本 */
    text-overflow: ellipsis; /* 使用省略号表示文本被截断 */
    max-width: 150px; /* 定义容器宽度 */
  }
</style>