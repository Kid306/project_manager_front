<template> 
 
    <el-card shadow="never" class="mt-8px">
        <template #header>
            <div class="h-3 flex justify-between" style="align-items: center;">
            <span style="width:4rem;">{{ t('workplace.apps') }}</span> 
            <el-input style="height:35px;" v-model="keyWords" @change="searchMenu" placeholder="模糊搜索, enter回车键搜索"/> 
          </div>
        </template> 
                <el-card v-if="xmgl.length>0" shadow="never" class="mt-8px">
                    
                    <template #header>
                        <div class="h-3 flex justify-between">
                        <span>项目管理</span> 
                    </div>
                    </template>
                    <el-row>
                        <el-col v-for="item in xmgl" :key="`team-${item.name}`" :span="8"  @click="selectItem(item)">
                            
                                <div class="container">
                                    <img  :src="item.logoUrl" alt="" class="img_box"/> <span>{{item.name}}</span> 
                                </div>  
                        </el-col>
                    </el-row>
                </el-card> 
                <el-card v-if="oa.length>0" shadow="never" class="mt-8px">
                    
                    <template #header>
                        <div class="h-3 flex justify-between">
                        <span>协同办公</span> 
                    </div>
                    </template>
                    <el-row>
                        <el-col v-for="item in oa" :key="`team-${item.name}`" :span="8"  @click="selectItem(item)">
                            
                                <div class="container">
                                    <img  :src="item.logoUrl" alt="" class="img_box"/> <span>{{item.name}}</span> 
                                </div>  
                        </el-col>
                    </el-row>
                </el-card> 
                <el-card v-if="mall.length>0" shadow="never" class="mt-8px">
                    
                    <template #header>
                        <div class="h-3 flex justify-between">
                        <span>电商营销</span> 
                    </div>
                    </template>
                    <el-row>
                        <el-col v-for="item in mall" :key="`team-${item.name}`" :span="8"  @click="selectItem(item)">
                            
                                <div class="container">
                                    <img  :src="item.logoUrl" alt="" class="img_box"/> <span>{{item.name}}</span> 
                                </div>  
                        </el-col>
                    </el-row>
                </el-card> 
  
    </el-card>
</template>

<script>
import config from '@/api/mdp_pub/mdp_config';
import {modulesOfIcon} from "./modulesOfIcon.js";
import {modulesOfRouter} from "./modulesOfRouter.js";

import NProgress from 'nprogress' // progress bar

import { mapState } from 'pinia'
import { useUserStore } from '@/store/modules/user' 
const { t } = useI18n()
export default { 
    props: {
        modelValue:{
            type:Object,
            default:()=>{
                return null;
            }
        },
        showAppNum:{
            type:Number,
            default:8
        }
    },
    computed: {
        ...mapState(useUserStore,[
            'userInfo'
        ]), 
    },
    
    watch: { 
        'keyWords': 'filterModule'
    },

    data() {
        return {
            menuLoading: false,  
            oa:[],xmgl:[],mall:[],
            keyWords: null,
            filterVal: '',
            allMenus:[],
        }
    },

    methods: {
        t,
        searchMenu(val) {
            this.keyWords = val;
        },

        filterModule() { 
            
            let val = this.keyWords;
            let tempData=this.allMenus
            this.xmgl = tempData.filter(res => {return res.mcate == '2' && res.name?.indexOf(val)>=0})
            this.oa = tempData.filter(res => {return res.mcate == '1' && res.name?.indexOf(val)>=0})
            this.mall = tempData.filter(res => {return res.mcate == '3' && res.name?.indexOf(val)>=0}) 
        },
 
        selectItem(item) { 
                var context="";
                //路由跳转
                let path = "";
                modulesOfRouter.forEach(e => {
                    if(e.id == item.id) {
                        path = e.path; 
                        context=e.context
                    }
                })

                if(path != "") {
                    if(context != import.meta.env.VITE_CONTEXT) { 
                         window.open(this.$mdp.getUri(config.getBaseDomainUrl(),context,import.meta.env.VITE_UI_VERSION,"/#/",path));
                        NProgress.done() // if current page is login will not trigger afterEach hook, so manually handle it
                    }else {
                        this.$router.push({path: path})
                    }
                }
                this.visible = false; 
        },

        goBuy(item) {
            this.visible = false;
            if(import.meta.env.VITE_CONTEXT==this.$mdp.getSysCtx()){
                //前往购买页面
                this.$router.push({path:'/my/order/index',query:{moduleId:item.id}})
            }else{ 
                var fullpath=this.$mdp.getUri(config.getBaseDomainUrl,this.$mdp.getSysCtx(),import.meta.env.VITE_UI_VERSION,"/#/","/my/order/index")+"?moduleId="+item.id
                window.open(fullpath);
                NProgress.done() // if current page is login will not trigger afterEach hook, so manually handle it
            }
            
        },

        //获取所有模块
        getAllModules() {
            this.menuLoading = true
            this.$mdp.getAllMenuModule({}).then(res => {
                let tempData = res.data;
                tempData.forEach(k=>{
                    k.isBuy=false; 
                    modulesOfIcon.forEach(element => {
                        if(k.id == element.id) {
                            k.logoUrl = element.logoUrl;
                        }
                    }); 
                }) 
                
                   
                    this.xmgl = tempData.filter(res => {return res.mcate == '2'})
                    this.oa = tempData.filter(res => {return res.mcate == '1'})
                    this.mall = tempData.filter(res => {return res.mcate == '3'}) 
                    this.allMenus=tempData
                }).finally(() => this.menuLoading = false)
        },


    },

    created() {
        this.getAllModules();
    }

}
</script>
 

<style lang="scss" scoped>
@import './index.scss';

</style>