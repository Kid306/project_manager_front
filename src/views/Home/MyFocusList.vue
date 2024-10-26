<template>
    <el-row :gutter="20">
        <el-col :xl="12" 
              :lg="12"
              :md="12"
              :sm="24"
              :xs="24" class="mb-8px">
            <el-card class="box-card">
                <template #header > 
                    <div class="avatar-container">
                        <div class="avatar-wrapper"  @click="gotolink($mdp.getXmCtx(),'/xm/product/mng')">  
                            <Icon icon="logos:productboard-icon" size="24px"/>&nbsp;产品

                        </div>    
                    </div>
                </template>
                <div v-for="(o,index) in products" :key="index" class="list-item">
                     <el-link @click="toBizPage(o)">{{o.bizName }}</el-link>
                    <div class="tool-bar">
                        <span class="u-btn"> 
                            <el-button     type="text"  @click="handleDel(o,index)" icon="remove-outline" title="取消关注" >取消关注 </el-button>     
                        </span>
                    </div>
                    
                </div>
            </el-card>
        </el-col>
        <el-col :xl="12"  
              :lg="12"
              :md="12"
              :sm="24"
              :xs="24" class="mb-8px">
            <el-card class="box-card">
                <template #header > 
                    <div class="avatar-container">
                        <div class="avatar-wrapper" @click="gotolink($mdp.getXmCtx(),'/xm/project/mng/me')">  
                           <Icon icon="logos:xamarin" size="24px"/> &nbsp;项目

                        </div>    
                    </div>
                </template>
                <div v-for="(o,index) in projects" :key="index" class="list-item">
                     <el-link @click="toBizPage(o)">{{o.bizName }}</el-link>
                    <div class="tool-bar">
                        <span class="u-btn"> 
                            <el-button     type="text"  @click="handleDel(o,index)" icon="remove-outline" title="取消关注" >取消关注 </el-button>     
                        </span>
                    </div>
                    
                </div>
            </el-card>
        </el-col>
        <el-col  :xl="12" 
              :lg="12"
              :md="12"
              :sm="24"
              :xs="24" class="mb-8px">
            <el-card class="box-card">
                <template #header > 
                    <div class="avatar-container">
                        <div class="avatar-wrapper" @click="gotolink($mdp.getXmCtx(),'/xm/product/iteration/mng')"> 
                            <Icon icon="logos:zapier-icon" size="24px"/>&nbsp;迭代
                        </div>    
                    </div>
                </template>
                <div v-for="(o,index) in iterations" :key="index" class="list-item">
                     <el-link @click="toBizPage(o)">{{o.bizName }}</el-link>
                    <div class="tool-bar">
                        <span class="u-btn"> 
                            <el-button   type="text"  circle @click="handleDel(o,index)" icon="remove-outline" title="取消关注">取消关注 </el-button>     
                        </span>
                    </div> 
                </div>
            </el-card>
        </el-col>
        <el-col  :xl="12" 
              :lg="12"
              :md="12"
              :sm="24"
              :xs="24" class="mb-8px">
            <el-card class="box-card">
                <template #header > 
                    <div class="avatar-container">
                        <div class="avatar-wrapper" @click="gotolink($mdp.getXmCtx(),'/xm/product/menu/mng')"> 
                           <Icon icon="logos:cloudacademy-icon" size="24px"/> &nbsp;需求
                        </div>    
                    </div>
                </template>
                <div v-for="(o,index) in menus" :key="index" class="list-item">
                     <el-link @click="toBizPage(o)">{{o.bizName }}</el-link>
                    <div class="tool-bar">
                        <span class="u-btn"> 
                            <el-button   type="text"  circle @click="handleDel(o,index)" icon="remove-outline" title="取消关注">取消关注 </el-button>     
                        </span>
                    </div> 
                </div>
            </el-card>
        </el-col>
        <el-col  :xl="12" 
              :lg="12"
              :md="12"
              :sm="24"
              :xs="24" class="mb-8px">
            <el-card class="box-card">
                <template #header >
                    <div class="avatar-container">
                        <div class="avatar-wrapper" @click="gotolink($mdp.getXmCtx(),'/xm/project/task/center/me')"> 
                            <Icon icon="logos:codeception" size="24px"/>&nbsp;任务
                        </div>    
                    </div>
                </template>
                <div v-for="(o,index) in tasks" :key="index" class="list-item">
                         <el-link @click="toBizPage(o)"> {{o.bizName }}</el-link>
                    <div class="tool-bar">
                        <span class="u-btn"> 
                            <el-button   type="text" @click="handleDel(o,index)" icon="remove-outline" title="取消关注"> 取消关注</el-button>     
                        </span>
                    </div> 
                </div>
            </el-card>
        </el-col>  
        <el-col  :xl="12"  
              :lg="12"
              :md="12"
              :sm="24"
              :xs="24" class="mb-8px">
            <el-card class="box-card">
                <template #header >
                    <div class="avatar-container">
                        <div class="avatar-wrapper" @click="gotolink($mdp.getXmCtx(),'/xm/test/question/mng/me')"> 
                            <Icon icon="logos:testing-library" size="24px"/>&nbsp;缺陷
                        </div>    
                    </div>
                </template>
                <div v-for="(o,index) in bugs" :key="index" class="list-item">
                         <el-link @click="toBizPage(o)"> {{o.bizName }}</el-link>
                    <div class="tool-bar">
                        <span class="u-btn"> 
                            <el-button   type="text" @click="handleDel(o,index)" icon="remove-outline" title="取消关注"> 取消关注</el-button>     
                        </span>
                    </div> 
                </div>
            </el-card>
        </el-col>  
    </el-row>
</template>

<script>

 import { mapState } from 'pinia'
import { useUserStore } from '@/store/modules/user'

export default {
    name:'userFocusMng',
    components: {
    },
    props:['visible'],
    computed: {
        ...mapState(useUserStore,['userInfo']),
        products(){
            return this.userFocuss.filter(k=>k.focusType=='3')
        },
        projects(){
            return this.userFocuss.filter(k=>k.focusType=='1')
        },
        iterations(){
            return this.userFocuss.filter(k=>k.focusType=='6')
        }, 
        menus(){
            return this.userFocuss.filter(k=>k.focusType=='4')
        }, 
        tasks(){
            return this.userFocuss.filter(k=>k.focusType=='2')
        },
        bugs(){
            return this.userFocuss.filter(k=>k.focusType=='5')
        }

    },
    watch:{
        visible(val){
            if(val==true){
                this.initData(); 
            }
        },
        pageInfo:{
            immediate: true, // 使watch立即生效
            handler(){
                this.$emit('pageInfo',this.pageInfo)
            }
        }
    },
    data() {
        return {
            filters: {
                key: ''
            },
            userFocuss: [],//查询结果
            pageInfo:{//分页数据
                total:0,//服务器端收到0时，会自动计算总记录数，如果上传>0的不自动计算。
                pageSize:10,//每页数据
                count:false,//是否需要重新计算总记录数
                pageNum:1,//当前页码、从1开始计算
                orderFields:[],//排序列 如 ['sex','student_id']，必须为数据库字段
                orderDirs:[]//升序 asc,降序desc 如 性别 升序、学生编号降序 ['asc','desc']
            },
            load:{ list: false, edit: false, del: false, add: false },//查询中... 
            editForm: {
                userid:'',username:'',bizId:'',focusType:'',pbizId:'',bizName:'',pbizName:'',ftime:'',ubranchId:''
            }, 
        }
    },//end data
    methods: { 
        gotolink(context,path){ 
            if(!context){
                context=import.meta.env.VITE_CONTEXT
            }
            if(context==import.meta.env.VITE_CONTEXT){
                this.$router.push({path:path});
            }else{ 
                var curlDomain=window.location.protocol+"//"+window.location.host; //   
                this.$mdp.openWin(this.$mdp.getUri(curlDomain,context,import.meta.env.VITE_UI_VERSION,"/#/",path))
                //NProgress.done() // if current page is login will not trigger afterEach hook, so manually handle it
            }

        },
        searchUserFocuss:function(){
             this.pageInfo.count=true;
             this.getUserFocuss();
        },
        //获取列表 UserFocus 我关注的项目或者任务
        getUserFocuss() {
            
            let params = {
                pageSize: this.pageInfo.pageSize,
                pageNum: this.pageInfo.pageNum,
                total: this.pageInfo.total,
                count:this.pageInfo.count
            };
            if(this.pageInfo.orderFields!=null && this.pageInfo.orderFields.length>0){
                let orderBys=[];
                for(var i=0;i<this.pageInfo.orderFields.length;i++){
                    orderBys.push(this.pageInfo.orderFields[i]+" "+this.pageInfo.orderDirs[i])
                }
                params.orderBy= orderBys.join(",")
            }
            if(this.filters.key){
                params.key=this.filters.key
            }

            this.load.list = true;
            this.$mdp.myFocusForIndex(params).then((res) => {
                
                var tips=res.tips;
                if(tips.isOk){
                    this.pageInfo.total = res.total;
                    this.pageInfo.count=false;
                    this.userFocuss = res.data;
                 }else{
                    this.$message({ position:'bottom-left',showClose:true, message: tips.msg, type: 'error' });
                }
                this.load.list = false;
            }).catch( err => this.load.list = false );
        }, 
        toBizPage(bizObj){
            bizObj.objType=bizObj.focusType
            if(bizObj.url){
                this.$mdp.openWin(bizObj.url)
            }else{
                
                var curlDomain=window.location.protocol+"//"+window.location.host; //  
                var baseUrl=this.$mdp.getUri(curlDomain,`${import.meta.env.VITE_CONTEXT}/${import.meta.env.VITE_UI_VERSION}`,"/#/",path)
                var xmContext=this.$mdp.getXmCtx();
                if(bizObj.focusType=='1'){//项目 
                    var path="/xm/project/view/overview"
                    if(xmContext==import.meta.env.VITE_CONTEXT){
                        this.$router.push({path:path,query:{projectId:bizObj.bizId}})
                    }else{
                        baseUrl=this.$mdp.getUri(curlDomain,`${xmContext}/${import.meta.env.VITE_UI_VERSION}`,"/#/",path)+`?projectId=${bizObj.bizId}`
                        this.$mdp.openWin(baseUrl)
                    }
                    
                }else if(bizObj.focusType=='2'){//任务
                    var path="/xm/project/task/detail"
                    if(xmContext==import.meta.env.VITE_CONTEXT){
                        this.$router.push({path:path,query:{id:bizObj.bizId}})
                    }else{
                        baseUrl=this.$mdp.getUri(curlDomain,`${xmContext}/${import.meta.env.VITE_UI_VERSION}`,"/#/",path)+`?id=${bizObj.bizId}`
                        this.$mdp.openWin(baseUrl)
                    }
                }else if(bizObj.focusType=='3'){//产品
                    var path="/xm/product/view/overview"
                    if(xmContext==import.meta.env.VITE_CONTEXT){
                        this.$router.push({path:path,query:{productId:bizObj.bizId}})
                    }else{
                        baseUrl=this.$mdp.getUri(curlDomain,`${xmContext}/${import.meta.env.VITE_UI_VERSION}`,"/#/",path)+`?productId=${bizObj.bizId}`
                        this.$mdp.openWin(baseUrl)
                    }
                }else if(bizObj.focusType=='4'){//需求
                    var path="/xm/product/menu/detail"
                    if(xmContext==import.meta.env.VITE_CONTEXT){
                        this.$router.push({path:path,query:{menuId:bizObj.bizId}})
                    }else{
                        baseUrl=this.$mdp.getUri(curlDomain,`${xmContext}/${import.meta.env.VITE_UI_VERSION}`,"/#/",path)+`?menuId=${bizObj.bizId}`
                        this.$mdp.openWin(baseUrl)
                    }
                }else if(bizObj.focusType=='5'){//bug
                    var path="/xm/test/question/detail"
                    if(xmContext==import.meta.env.VITE_CONTEXT){
                        this.$router.push({path:path,query:{id:bizObj.bizId}})
                    }else{
                        baseUrl=this.$mdp.getUri(curlDomain,`${xmContext}/${import.meta.env.VITE_UI_VERSION}`,"/#/",path)+`?id=${bizObj.bizId}`
                        this.$mdp.openWin(baseUrl)
                    }
                }else if(bizObj.focusType=='6'){//迭代
                    var path="/xm/iteration/view/overview"
                    if(xmContext==import.meta.env.VITE_CONTEXT){
                        this.$router.push({path:path,query:{iterationId:bizObj.bizId}})
                    }else{
                        baseUrl=this.$mdp.getUri(curlDomain,`${xmContext}/${import.meta.env.VITE_UI_VERSION}`,"/#/",path)+`?iterationId=${bizObj.bizId}`
                        this.$mdp.openWin(baseUrl)
                    }
                }else if(bizObj.focusType=='7'){//团队
                    var path="/xm/project/group"
                    if(xmContext==import.meta.env.VITE_CONTEXT){
                        this.$router.push({path:path,query:{projectId:bizObj.bizId}})
                    }else{
                        baseUrl=this.$mdp.getUri(curlDomain,`${xmContext}/${import.meta.env.VITE_UI_VERSION}`,"/#/",path)+`?projectId=${bizObj.bizId}`
                        this.$mdp.openWin(baseUrl)
                    }  
                }else if(bizObj.focusType=='8'){//组织
                     //待完善
                }else if(bizObj.focusType=='9'){//个人
                    //待完善
                }else if(bizObj.focusType=='H'){//合同
                     //待完善
                }
            }
        },   
        //删除userFocus
        handleDel: function (row,index) { 
            this.load.del=true;
            let params = {  userid:row.userid,  bizId:row.bizId,  pbizId:row.pbizId };
            this.$mdp.delUserFocus(params).then((res) => {
                this.load.del=false;
                var tips=res.tips;
                if(tips.isOk){
                    this.searchUserFocuss();
                }
                this.$message({ position:'bottom-left', showClose:true, message: tips.msg, type: tips.isOk?'success':'error' });
            }).catch( err  => this.load.del=false );
            
        }, 
       
        rowClick: function(row, event, column){
            this.editForm=row
            this.editFormBak={...row};
            this.$emit('row-click',row, event, column);//  @row-click="rowClick"
        },
        initData: function(){

        },

    },//end methods
    mounted() {
        this.$nextTick(() => {
            this.initData() 
            this.searchUserFocuss(); 
             

        });
    }
}

</script>

<style lang="scss"  scoped>
.box-card{
    height: 150px;
}

.avatar-container {
    height: 20px;
    display: flex;
    align-items: center; 
    .avatar-wrapper {
        cursor: pointer;
        display: flex;
        flex-direction: row;
        align-items: center;
        .user-avatar {
            height: 34px;
            width: 34px;
            border-radius: 50%;
            margin-right: 12px;
        }
        .username{
            color: #7D7D7D;
            font-size: 18px;
            margin-right: 2px;
        }
        .el-icon-caret-bottom {
            font-size: 22px;
        }
    }
}


.tool-bar{
	visibility: hidden;
	float: right;
}

.list-item{
    margin-bottom: 15px;
}

.list-item:hover{
	.tool-bar{
		visibility: visible;
		.u-btn{   
			float: right;
		} 
	}
}
</style>