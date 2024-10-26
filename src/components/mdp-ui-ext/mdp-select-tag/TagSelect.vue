<template>  
        <el-space wrap class="padding-bottom">
					<template v-if="editVisible">
          <el-checkbox 
            v-model="isPub"
            true-label="1"
            false-label="0"
          >公共分类</el-checkbox>
          <el-input 
            v-model="needAddTagCategoryNameInputValue"
            placeholder="回车直接快速添加标签分类"
            @keyup.enter="addTagCategorySubmitMethod"
          />
          <el-button type="primary"  @click="addTagCategorySubmitMethod" icon="finished">保存分类</el-button> 
					<el-button @click="editVisible=false" icon="back">返回</el-button> 

				</template> 
				<el-button v-if=" currOpType=='mng' " @click="searchTableDatas" v-loading="load.list" icon="search">刷新标签</el-button>  
				<el-button type="primary" v-if=" currOpType=='mng' && editVisible==false" @click="editVisible=true" icon="edit">去管理标签</el-button>
				<el-button v-if=" editVisible==false && currOpType=='select' " @click="selectListConfirm" v-loading="load.list"  icon="finished" type="warning">确认选择</el-button>  
 
			</el-space>   
    <div v-if="editVisible==false">
      <template v-for="(item,index) in convertTags" :key="item.categoryId">
           <div>
						<el-text tag="b">
 							{{item.categoryName+(item.pubc=='1'?'(公共)':'')}} 
						</el-text>
          </div>
         <div style="margin-left:30px;display:flex;flex-wrap: wrap;width: 100%;">
          <div
            :class="v.checked?'checkCopyButton':'copyButton'"
            v-for="(v,valueIndex) in item.values"
            :key="valueIndex"
            @click="clickTagMethod(index,valueIndex)"
          >
            {{v.tagName +(v.pubTag=='1'?'':'')}} 
          </div>  
        </div>
      </template>
    </div>
    <div v-else  ref="table">
      <template v-for="(item,index) in convertTags" :key="item.categoryId">
        <h5>
          <div>
            {{item.categoryName+(item.pubc=='1'?'(公共)':'')}}
            <el-button circle plain size="small"
              icon="delete" type="danger" class="closeStyle"
              @click.stop="delTagCategoryMethod(item.categoryId,index)"
          />:
          </div>
        </h5>
        <el-space style="margin-left:30px;display:flex;flex-wrap: wrap;width: 100%;">
          <div
            :class="'copyButton'"
            v-for="(v,valueIndex) in item.values"
            :key="valueIndex"
            @click="clickTagMethod(index,valueIndex)"
          >
            {{v.tagName +(v.pubTag=='1'?'':'')}}
            <el-button size="small" plain circle type="danger"
              icon="delete" class="closeStyle"
              @click.stop="delTagMethod(v.tagId,index,valueIndex)"
            />
          </div>
          <div class="input-tag" v-if="item.showAddButtonVisible">
            <el-input
              style="width:200px;"
              v-model="item.showAddButtonInputValue"
              placeholder="请输入标签,回车即可"
              @keyup.enter="addTagMethod(index)"
              autofocus
            />
          </div>
          <div v-else class="add" @click="showAddButtonMethod(index)">
            <el-button icon="plus" type="primary" plain circle/>
          </div>
        </el-space>
      </template>
    </div> 
    
    <div v-if="editVisible==false" class="footer"> 
          <el-button v-if="currOpType!='mng'" type="primary"  @click="selectListConfirm" icon="finished">确认选择</el-button>
          <el-button  @click="searchTableDatas" v-loading="load.list" icon="search">刷新标签</el-button> 
          <el-button   @click="editVisible=true" icon="edit">去管理标签</el-button>  
      </div>
    
      <div v-if="editVisible==true" class="footer"> 
           <el-button  @click="editVisible=false" icon="back">返回</el-button> 
       </div> 
</template>

<script>

import { mapState } from 'pinia'
import { useUserStore } from '@/store/modules/user' 
import { MdpTableMixin } from '../../mdp-ui/mixin/MdpTableMixin.js';
 

export default {
name:'tagMng',
mixins:[MdpTableMixin],
components: { 
},
computed: {
	...mapState(useUserStore,['userInfo'])
},
watch:{
},
data() {
    return {
        menuDefId:'',//menu_def.id 菜单表菜单编号，用于按钮权限判断
        menuDefName:'arc_tag',//menu_def.name 功能名称，用于导出excel等文件名
        refId:'tag',//引用编号，<table :ref="refId+'Table'"> <form :ref="refId+'Form'">
        pkNames:["branchId", "id"],//表格主键的java属性名称，驼峰命名，默认为id,支持多主键
        currOpType:'mng',//表格 mng-综合管理具有最大权限，所有按钮可动、detail-只看不能操作
        filters:{//查询参数

        },
        defaultFilters:{//默认查询参数,第一次打开界面的时候用到，恢复默认值的时候用到

        },

        defaultCheckColumnNum:8,//默认展示的表格列数，前8列 

        editVisible:false,
        //增删改查(含批量)接口
        apis:{
            list: this.$mdp.getAllTag,
            add: this.$mdp.addTag,
            del: this.$mdp.delTag,   
            addCategory:this.$mdp.addTagCategory,
            delCategory:this.$mdp.delTagCategory,
        },
        isPub:'0',
        convertTags:[],
        needAddTagCategoryNameInputValue:'',

    }
},
methods: {
     //页面初始化需要配置的特殊逻辑写这里
      initCurrData(){ 
				if(this.subOpType=='mng'){
					this.editVisible=true;
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
      afterList(tableDatas,isOk,apiName){
		
        if (isOk) {   
          let allTag = tableDatas;
          let convert = [];
          for (let i = 0; i < allTag.length; i++) {
          let flag = true; //判断是否需要添加
          var tag = allTag[i];
          for (let j = 0; j < convert.length; j++) {
    
            if (tag.tagId && tag.categoryId == convert[j].categoryId) {
            let json = {
              "isSaveInDatabase": true,
              "checked": tag.checked ? true : false,
              "tagId": tag.tagId,
              "tagName": tag.tagName,
              "pubTag": tag.pubTag,
            }
            if (this.tagIds && this.tagIds.some(id => id == json.tagId)) {
              json.checked = true;
            }
            convert[j].values.push(json);
            flag = false;
            break;
            }
          }
          if (flag) {
            let json = {
            "showAddButtonVisible": false, //添加标签按钮
            "showAddButtonInputValue": '', //添加标签按钮的输入框的值
            "categoryId": tag.categoryId,
            "categoryName": tag.categoryName,
            "pubc": tag.pubc,
            "values": [{
              "isSaveInDatabase": false,
              "checked": false,
              "tagId": tag.tagId,
              "tagName": tag.tagName,
              "pubTag": tag.pubTag,
            }]
            }
            if (!json.values[0].tagId) {
            json.values = [];
            } else {
    
            if (this.tagIds && this.tagIds.some(id => id == json.values[0].tagId)) {
              json.values[0].checked = true;
            }
            }
            convert.push(json);
          }
          }
          this.convertTags = convert;
        }
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
    //添加标签分类的方法
		addTagCategorySubmitMethod() { 
		  if (!(this.userInfo.isPlatformAdmin || this.userInfo.isSuperAdmin)) {
			if (this.isPub == '1') {
			  this.$message({
				message: "你不是平台管理员不能添加公共标签分类",
				type: 'error'
			  });
			  return;
			}
		  }
  
		  if (this.convertTags.some(i => i.categoryName == this.needAddTagCategoryNameInputValue)) {
			this.$message({
			  message: "标签分类已经存在",
			  type: 'error'
			});
			return false;
		  }
		  if (!this.needAddTagCategoryNameInputValue) {
        this.$message({
			  message: "标签分类名称不能为空",
			  type: 'error'
			});
			return;
		  }
		  let params = {
			"branchId": this.userInfo.branchId,
			"shopId": this.userInfo.shopId,
			"categoryName": this.needAddTagCategoryNameInputValue,
			"isPub": this.isPub
		  };
		  this.load.list = true;
		  this.apis.addCategory(params).then((res) => {
			this.load.list = false;
			var tips = res.tips;
			if (tips.isOk) {
			  this.needAddTagCategoryNameInputValue = '';
			  let json = {
				"showAddButtonVisible": false, //添加标签按钮
				"showAddButtonInputValue": '', //添加标签按钮的输入框的值
				"categoryId": res.data.id,
				"categoryName": res.data.categoryName,
				"values": [],
				"pubc": res.data.isPub
			  }
			  this.convertTags.push(json);
			}
			this.$message({position:'bottom-left',showClose: true,
			  message: tips.msg,
			  type: tips.isOk ? 'success' : 'error'
			});
		  }).catch(err => this.load.list = false);
		}, 
		//删除标签分类的方法
		delTagCategoryMethod(categoryId, index) {
   
		  if (!categoryId) {
			return;
		  };
		  let params = {
			"shopId": this.userInfo.shopId,
			"branchId": this.userInfo.branchId,
			"id": categoryId
		  }
		  if (!this.userInfo.isPlatformAdmin && !this.userInfo.isSuperAdmin) {
			if (this.convertTags.some(i => i.pubc == '1' && i.categoryId == categoryId)) {
			  this.$message({position:'bottom-left',showClose: true,
				message: "公共分类不允许删除",
				type: 'error'
			  });
			  return;
			}
		  }
		  this.$confirm('此操作将永久删除该标签分类, 并连同该标签分类下面的标签也删除，是否继续?', '提示', {
			confirmButtonText: '确定',
			cancelButtonText: '取消',
			type: 'warning'
		  }).then(() => {
			this.load.list = true;
			this.apis.delCategory(params).then((res) => {
			  this.load.list = false;
			  var tips = res.tips;
			  if (tips.isOk) {
				this.convertTags.splice(index, 1);
				/*this.getTags();*/
			  }
			  this.$message({position:'bottom-left',showClose: true,
				message: tips.msg,
				type: tips.isOk ? 'success' : 'error'
			  });
			}).catch(err => this.load.list = false);
		  }).catch(() => {
  
		  });
		},
    clickTagMethod(index, valueIndex) {
		  this.convertTags[index].values[valueIndex].checked = !this.convertTags[index].values[valueIndex].checked;
		},
  
		//显示添加按钮的方法
		showAddButtonMethod(index) {
		  this.convertTags[index].showAddButtonVisible = true;
		},
		//添加标签的方法
		addTagMethod(index) {
		  if (!this.userInfo.isPlatformAdmin && !this.userInfo.isSuperAdmin) {
			if (this.isPub == '1') {
			  this.$message({position:'bottom-left',showClose: true,
				message: "不是平台管理员，不允许增加公共标签",
				type: 'error'
			  });
			  return;
			}
		  }
		  if (this.convertTags.some(i => {
			  return i.values.some(tag => tag.tagName == this.convertTags[index].showAddButtonInputValue)
			})) {
			this.$message({position:'bottom-left',showClose: true,
			  message: "标签已经存在",
			  type: 'error'
			});
			return false;
		  }
		  if (!this.convertTags[index].pubc) {
			if (this.isPub == '1') {
			  this.$message({position:'bottom-left',showClose: true,
				message: "该分类不是公共分类，不能添加公共标签",
				type: 'error'
			  });
			  return false;
			}
		  } 
		  let tagName = this.convertTags[index].showAddButtonInputValue;
		  let categoryId = this.convertTags[index].categoryId;
		  let params = {
			"branchId": this.userInfo.branchId, 
			"categoryId": categoryId,
			"tagName": tagName,
			"isPub": this.isPub
		  };
  
		  if (!params.tagName) {
			return
		  }
		  console.log("params")
		  console.log(params)
		  this.load.list = true;
		  this.apis.add(params).then((res) => {
			this.load.list = false;
			var tips = res.tips;
			if (tips.isOk) {
			  let json = {
				"isSaveInDatabase": false,
				"checked": false,
				"tagId": res.data.id,
				"tagName": res.data.tagName,
				"pubTag": res.data.isPub
			  }
			  this.convertTags[index].showAddButtonInputValue = '';
			  this.convertTags[index].values.push(json);
			}
			this.$message({position:'bottom-left',showClose: true,
			  message: tips.msg,
			  type: tips.isOk ? 'success' : 'error'
			});
		  }).catch(err => this.load.list = false);
		},
		//删除标签的方法
		delTagMethod(tagId, index, valueIndex) {
		  if (!this.userInfo.isPlatformAdmin && !this.userInfo.isSuperAdmin) {
			if (this.convertTags[index].values.some(i => i.pubTag == '1' && i.tagId == tagId)) {
			  this.$message({position:'bottom-left',showClose: true,
				message: "公共标签不允许删除",
				type: 'error'
			  });
			  return;
			}
		  } 
  
		  let params = {
			"id": tagId
		  }
		  console.log("params.id-------------------------" + params.id);
		  if (!params.id) {
			return;
		  }
  
		  this.$confirm('此操作将永久删除该标签, 是否继续?', '提示', {
			confirmButtonText: '确定',
			cancelButtonText: '取消',
			type: 'warning'
		  }).then(() => {
			this.load.list = true;
			this.apis.del(params).then((res) => {
			  this.load.list = false;
			  var tips = res.tips;
			  if (tips.isOk) {
				this.convertTags[index].values.splice(valueIndex, 1);
				/*this.getTags();*/
			  }
			  this.$message({position:'bottom-left',showClose: true,
				message: tips.msg,
				type: tips.isOk ? 'success' : 'error'
			  });
			}).catch(err => this.load.list = false);
		  }).catch(() => {
  
		  });
		},
		//添加标签分类的显示的方法
		showwAddTagCategoryVisibleMethod() {
		  this.showwAddTagCategoryVisible = true;
		},
    
    selectListConfirm:function(){
      var tags=[]
      this.convertTags.forEach(k=>{
        if(k.values){
          k.values.forEach(x=>{
            if(x.checked){
              x.categoryId=k.categoryId
              x.categoryName=k.categoryName
              tags.push(x)
            }
          })
        }
      })
	  if(!tags || tags.length==0){
		this.$emit('select',null)
	  }else if(this.multiple){
		this.$emit('select',tags)
	  }else{
		this.$emit('select',tags[0])
	  }
        
    },
},
mounted() {
	this.initCurrData()
}
}

</script>

<style scoped>
.copyButton {
	margin-left: 5px;
	margin-top:2px;
	border-radius: 20px;
	padding: 10px 1px;
	border: 1px solid rgb(220, 223, 230);
	/* color:#039; */
  }
  
  .copyButton:hover {
	color: #409eff;
	border-color: #c6e2ff;
	background-color: #ecf5ff;
	cursor: default;
  }
  
  .checkCopyButton {
	/*color: #fff;*/
	margin-left: 5px;
	margin-top:2px;
	border-radius: 20px;
	padding: 10px 1px;
	border: 1px solid #ffa00a;
	/*background-color: rgba(230, 162, 60, .1);*/
	/* background-color: #f9f9f9; */
	background-color: #fff;
	/*border-color: rgba(230,162,60,.2);*/
	color: #ffa00a;
  }
  
  .add {
	display: flex;
	align-items: center;
	margin-left: 10px;
	margin-top: 2px;
  }
  
  .add:hover {
	cursor: pointer;
	animation: myrotate 0.5s linear infinite;
  }
  
  .input-tag {
	margin-left: 10px;
	margin-top: 2px;
	align-self: center;
  }
  .closeStyle {
		width: 20px;
	padding: 1px;
  }
  
  .closeStyle:hover {
	cursor: pointer;
	/* border-color:#f40; */
	/* border: 1px solid #f40; */
	background-color: #ffa00a;
	color: #fff;
	border-radius: 50%;
	padding: 1px;
	animation: myrotate 1s linear;
  }
  
  .addTagSquare {
	width: 15px;
	height: 15px;
	display: inline-block;
	background-color: #ffa00a;
	animation: myrotate 2s linear infinite;
  }
  
  .closeTagSquare {
	width: 15px;
	height: 15px;
	display: inline-block;
	background-color: #fff;
	animation: myrotate 2s linear infinite;
  }
  @keyframes myrotate {
	0% {
	  transform: rotate(0deg);
	  box-shadow: 0px 0px 10px #fff;
	}
  
	50% {
	  transform: rotate(180deg);
	  box-shadow: 0px 0px 45px #fff;
	}
  
	100% {
	  transform: rotate(360deg);
	  box-shadow: 0px 0px 10px #fff;
	}
  } 
</style>