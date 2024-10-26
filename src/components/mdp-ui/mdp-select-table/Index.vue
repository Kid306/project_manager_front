<template> 
  <span style="width:100%;">    
    <span v-if="showStyle=='origin'||showStyle==''||!showStyle" :title="title||placeholder">
    <el-select v-if="showType=='select'" :style="{width:width?width:'auto'}" :multiple-limit="limit" :no-data-text="noDataText" :no-match-text="noMatchText" :popper-class="popperClass" :reserve-keyword="reserveKeyword" :size="size" :multiple="multiple" :placeholder="placeholder" :disabled="disabled"  class="my-select" ref="selectRef" v-model="myVal" @change="onChange" :clearable="clearable" @visible-change="$emit('visible-change',$event)" @focus="$emit('focus',$event)" @blur="$emit('blur',$event)" @clear="$emit('clear',$event)" @click="$emit('click',$event)" @remove-tag="$emit('remove-tag',$event)">
          
            <el-option disabled value="" style="height:40px;">
              <slot name="toolbar">
                <div><el-button @click.stop="$refs['tableDialog'].open({itemCode:itemCode})" icon="search" type="primary" plain title="查询更多数据" />
                  <el-button type="warning" icon="refresh" @click="doRefresh()" plain title="从后台重新加载，刷新数据"/>
                  <slot name="toolbarExt">

                  </slot>
                </div>
              </slot>
            </el-option>
            <slot name="options" :options="optionsCpd" :item="item">

                <el-option :style="styleObj" v-for="(option,index) in optionsCpd" :key="index" :value="option[propsCpd['id']]" :label="option[propsCpd['name']]"> 
                        <div class="avatar-container" v-if="propsCpd.imgUrl">
                         <div class="avatar-wrapper">
                            <el-avatar class="user-avatar" :src="option[propsCpd.imgUrl]" :style="{backgroundColor:getMyColor(option)}">{{option[propsCpd['name']]?.substr(0,2)}}</el-avatar> 
                            <span class="username">{{option[propsCpd['name']]}}</span> 
                             <Icon v-if="multiple==false &&  myVal && myVal==option[propsCpd['id']]" icon="ep:check"/> 
                            <i v-else>&nbsp;&nbsp;</i>  
                        </div> 
                      </div>
                      <div v-else>
                        <span :style="{backgroundColor:getMyColor(option),color:'white'}" class="padding">  
                              <Icon v-if="option.icon" :icon="option.icon"/> 
                            {{option[propsCpd['name']]}}
                        </span>  
                        <Icon v-if="isCheck(option)" icon="ep:check" color="blue"/> 
                        <i v-else>&nbsp;&nbsp;</i> 
                      </div>
                </el-option>
                
            </slot>
    </el-select>     
  </span>
  <span v-else-if="showStyle=='tag' && disabled==true">
    <span v-if="multiple===true" >
      <span v-if="sels && sels.length>0">
        <el-tag :size="size" v-for="option,idx in sels" :key="idx" :color="getMyColor(option)" :closable="closable" :effect="effect" >{{ option[propsCpd['name']] }}</el-tag>
      </span>
      <span v-else-if="myVal && myVal.length>0">
        <el-tag :size="size" v-for="id,idx in myVal" :key="idx" :color="getMyColorById(id)" :closable="closable" :effect="effect">{{ id }}</el-tag>
      </span>
      <el-tag v-else>{{  noMatchText ||'无' }}</el-tag>
    </span> 
    <span v-else>
        <el-tag :class="{'dashed-border':disabled==false}" :size="size" v-if="sels" :color="getMyColor(sels)" :closable="closable" :effect="effect" >{{sels[propsCpd['name']]||noMatchText}}</el-tag>
        <el-tag  :size="size" v-else-if="myVal" :color="getMyColorById(myVal)" :effect="effect">{{ myVal }}</el-tag>
        <el-tag   v-else>{{ noMatchText ||'无'}}</el-tag>
    </span>
  </span>
  <span v-else :title="title||placeholder">
    <div :class="showStyle=='x'?{'field-box-x':true}:{'field-box':true}" @click="showSelect"> 
      <span class="field-info" :class="{disabled:disabled===true,enabled:disabled!==true,hidden:selectOpen==true}">
        <slot name="avater" class="field-avater" v-if="showStyle=='x'"> 
          <el-avatar :size="size" :src="avaterCpd[propsCpd.imgUrl]"
            :icon="avaterCpd.icon"
            :style="{ backgroundColor: getMyColor( avaterCpd ) }"
            >{{ avaterCpd.icon?"":formatImgFront(avaterCpd[propsCpd['name']]) }}</el-avatar> 
        </slot>
        <slot name="info">
          <span v-if="showStyle=='x'" class="info-box">
            <div v-if="multiple==true" class="field-value">
              <div  v-if="sels&&sels.length>0" :style="{width:width?width:'100px'}">
                 <el-text truncated>{{ sels.map(k=>k[propsCpd['name']]).join(split) }}</el-text>
              </div>
              <div class="field-value" v-else-if="myVal && myVal.length>0">
                {{ myVal.join(split) }}
              </div>
              <div>{{ noMatchText || '无'}}</div>
            </div> 
            <div v-else class="field-value">
              <div  v-if="sels" :style="{width:width?width:'100px'}">
                <el-text truncated>{{ sels[propsCpd['name']] }}</el-text>
              </div>
              <div v-else-if="myVal">
                {{ myVal }}
              </div>
              <div v-else>{{ noMatchText || '无'}}</div>
            </div>
            <div class="field-label">{{ label||title||placeholder ||'无' }}</div>
          </span>
          <span v-else>
            <div v-if="multiple===true">
              <div v-if="sels && sels.length>0" >
                <el-tag :size="size" v-for="option,idx in sels" :key="idx" :color="getMyColor(option)" :closable="closable" :effect="effect">{{ option[propsCpd['name']] }}</el-tag>
              </div>
              <div v-else-if="myVal && myVal.length>0" >
                <el-tag :size="size" v-for="id,idx in myVal" :key="idx" :color="getMyColorById(id)" :closable="closable" :effect="effect">{{ id }}</el-tag>
              </div>
              <el-tag v-else>{{  noMatchText ||'无' }}</el-tag>
            </div> 
            <div v-else>
                <el-tag :class="{'dashed-border':disabled==false}" :size="size" v-if="sels" :color="getMyColor(sels)" :closable="closable" :effect="effect" >{{sels[propsCpd['name']]||noMatchText}}</el-tag>
                <el-tag  :size="size" v-else-if="myVal" :color="getMyColorById(myVal)" :effect="effect">{{ myVal }}</el-tag>
                <el-tag   v-else>{{ noMatchText ||'无'}}</el-tag>
            </div>
          </span> 
        </slot>
      </span> 
      <span :class="{'field-oper-box':true,relative:relative}">
      <span class="field-oper" :class="{disabled:disabled===true,enabled:disabled!==true,nohidden:selectOpen===true}">
        <slot name="oper">
          <el-select :disabled="disabled" :style="{width:width?width:'auto'}" :multiple="multiple" :multiple-limit="limit" :auto-complete="autoComplete" :filter-method="filterMethod" :collapse-tags="collapseTags" :filterable="filterable" :name="name" :no-data-text="noDataText" :no-match-text="noMatchText" :popper-class="popperClass" :reserve-keyword="reserveKeyword" :size="size" v-if="showType=='select'" class="my-select" ref="selectRef" v-model="myVal" @change="onChange" :clearable="clearable" @visible-change="visibleChange" @focus="$emit('focus',$event)" @blur="$emit('blur',$event)" @clear="$emit('blur',$event)" @click="$emit('click',$event)" @remove-tag="$emit('remove-tag',$event)">
 
                <el-option disabled value="" style="height:40px;" >
                  <slot name="toolbar">
                    <div><el-button  @click.stop="$refs['tableDialog'].open({itemCode:itemCode})" icon="search" title="查询更多数据" type="primary" plain/>
                    <el-button icon="refresh" type="warning" title="刷新数据" @click="doRefresh()" plain/>
                    <slot name="toolbarExt">

                    </slot>
                    </div>
                  </slot>
                  </el-option>
                  <slot name="options" :options="optionsCpd" :item="item">
                    <el-option :style="styleObj" :key="index"  v-for="(option,index) in optionsCpd" :value="option[propsCpd['id']]" :label="option[propsCpd['name']]"> 
                        <div v-if="propsCpd.imgUrl" class="avatar-container">
                         <div class="avatar-wrapper">
                            <el-avatar class="user-avatar" :src="option[propsCpd.imgUrl]" :style="{backgroundColor:getMyColor(option)}">{{option[propsCpd['name']]}}</el-avatar> 
                            <span class="username">{{option[propsCpd['name']]}}</span> 
                             <Icon v-if="multiple==false &&  myVal && myVal==option[propsCpd['id']]" icon="ep:check"/> 
                            <i v-else>&nbsp;&nbsp;</i>  
                        </div>
                      </div>
                      <div v-else>
                        <span :style="{backgroundColor:getMyColor(option),color:'white'}" class="padding el-tag--dark">  
                                      <Icon v-if="option.icon" :icon="option.icon"/> 
                                  {{option[propsCpd['name']]}}
                              </span>  
                              <Icon v-if="isCheck(option)" icon="ep:check"/> 
                              <i v-else>&nbsp;&nbsp;&nbsp;</i>  
                      </div>
                      </el-option>
                  </slot> 
          </el-select>    
        </slot>
      </span> 
    </span> 
    </div>
  </span> 
    <mdp-dialog ref="tableDialog" title="选择数据" width="80%">
        <template #default="{visible}"> 
            <mdp-table :multiple="multiple" sub-op-type="select" @loadDatas="onTableLoadDatas" :params="params" :visible="visible" :crud-apis="{list:loadFun}" :props="props" :column-cfgs="columnConfigs" @select="onTableDataSelect"/> 
        </template>
      </mdp-dialog>
    </span>
  </template> 
  
  <script>  
  import {MdpSelectMixin } from "../../mdp-ui/mixin/MdpSelectMixin.js"
   const tableDataCacheMap=new Map();  
  export default {
    components: {  },
    name: 'mdp-select-table',
    mixins:[MdpSelectMixin], 
    computed:{
      columnConfigs(){
        if(this.columnCfgs && this.columnCfgs.length>0){
          return this.columnCfgs
        }else{ 
          var idColumn={property:this.propsCpd['id'],label:'编号'}
          var nameColumn={property:this.propsCpd['name'],label:'名称'}
          var columnConfigs=[]
          if(this.propsCpd.imgUrl){ 
            columnConfigs.push({property:this.propsCpd['imgUrl'],label:'图像'})
          }
          columnConfigs.push(idColumn)
          columnConfigs.push(nameColumn)

          return columnConfigs; 
        }
      },
      /**
       * 如果定义了props属性，默认按客户定义的来，如果未定义，则进行以下推测
       * 如果定义了columnCfgs，将取第一列作为id,取第二列作为name,不需要配置
       * 如果都未定义，返回 {id:'id',name:'name'}
       */
      propsCpd(){
        if(this.props==null){
          if(this.columnCfgs && this.columnCfgs.length>0){
            return {id:this.columnCfgs[0].property,name:this.columnCfgs[1].property}
          }else{
            return {id:'id',name:'name'}
          }
        }else{
          return this.props
        }
        
      }, 
    },
    watch:{ 

    },
    props:{
      columnCfgs:{
        type:Array,
        default:null,
      },
    },
    data(){
      return {   
        selectOpen:false
      }
    },
    methods:{ 
      visibleChange($event){
        this.$emit('visibleChange',$event)
      },
      doRefresh(){
        this.initItemOptions(true)
      },
      getCacheList(){ 
        var tableDataCacheList=tableDataCacheMap.get(this.codeKey) 
        return tableDataCacheList
      },
      /**
       * 返回新添加的数据[...]
       */
      setCacheList(datas){

        var tableDataCacheList=tableDataCacheMap.get(this.codeKey)
        if(!tableDataCacheList){
          tableDataCacheList=[] 
        }
        if(datas==null || datas.length==0){
          tableDataCacheMap.set(this.codeKey,tableDataCacheList)
          return [];
        }
        var dataArr=[]
        
        if(Array.isArray(datas)){
          dataArr=datas
        }else{
          dataArr=[datas]
        }
        var idKey=this.propsCpd['id']
        var notExists=dataArr.filter(d=>!tableDataCacheList.some(c=>c[idKey]==d[idKey]))
        if(notExists.length>0){
          tableDataCacheList.push(...notExists)
        }
        
        tableDataCacheMap.set(this.codeKey,tableDataCacheList)
        return notExists
      },
      initItemOptions(refresh){  
        var tableDataCacheList=this.getCacheList();
        if(tableDataCacheList && tableDataCacheList.length>0){
          this.item={itemType:'4',options:tableDataCacheList}
        }else{ 
          this.item={itemType:'4',options:[]} 
        } 
        if(!refresh && !this.initLoad){
          return;
        }
        if(this.modelValue && this.modelValue.length>0){
          var mVals=[]
            if(Array.isArray(this.modelValue)){
              mVals=this.modelValue
            }else{
              mVals=this.modelValue.split(this.split)
            }
            var notExistsVals=mVals.filter(v=>!this.item.options.some(k=>k[this.propsCpd['id']]==v))
            if(notExistsVals && notExistsVals.length>0){
              if(!this.loadFun){
                return;
              }  
                this.loadRemoteDatasByFun(false,notExistsVals).then(res=>{ 
                  res.data.forEach(k=>{
                    if(!this.item.options.some(m=>m[this.propsCpd.id]==k[this.propsCpd.id])){
                      this.item.options.unshift(k) 
                    } 
                  })
                })  
                
            }
        }else{//如果 没有条件，默认不执行
          
          if(!this.loadFun){
            return;
          }
          if(!this.initLoad){
            return
          }
          
          this.loadRemoteDatasByFun(false).then(res=>{ 
            this.item.options=this.getCacheList()   
          })
        }
      }, 
      onTableDataSelect(tableDatas){  
        if(!tableDatas||tableDatas.length==0){
           return;
        }
        if(this.multiple){
          if(this.limit>0){
            if(Array.isArray(tableDatas)){
              if(tableDatas.length>this.limit){
                this.$message("最多只能选择"+this.limit+"个")
                return;
              }
            }
          }
        }
         this.setCacheList(tableDatas)
        if(this.multiple){
           tableDatas.forEach(k=>{
            if(!this.optionsCpd.some(m=>m[this.propsCpd.id]==k[this.propsCpd.id])){
              this.item.options.unshift(k) 
            } 
           })
           this.myVal=tableDatas.map(k=>k[this.propsCpd['id']]) 
        }else{ 
          if(!this.optionsCpd.some(m=>m[this.propsCpd.id]==tableDatas[this.propsCpd.id])){
            this.item.options.unshift(tableDatas) 
          } 
          this.myVal=tableDatas[this.propsCpd['id']]  
        }
        this.onClose();
        this.$refs['tableDialog'].close();
      },
      onClose(){ 
      },
      getFromCache(initIds){ 
        var datas=this.getCacheList()
        if(datas==null || datas.length==0){
          return datas
        }
        if(!initIds || initIds.length==0){
          return datas
        }
        var idKey=this.propsCpd['id']
        if(initIds && initIds.length>0){
          if(initIds.some(k=> !datas.some(d=>d[idKey]==k))){
            return null
          }else{
            return datas
          } 
        }
      },
       /**
       * 做请求排序锁定处理，防止在列表中多次查询下拉列表数据 
       **/
       loadRemoteDatasByFun(refresh)
      {

        var codeKey=this.codeKey; 
        return new Promise((resolve,reject)=>{ 
            var intervalCount=0
            var interalFunc=null
            var lockKey=codeKey+'@lock'
            var lock=sessionStorage.getItem(lockKey)
            var getFromCache=this.getFromCache
            var idKey=this.propsCpd['id']
            var loadFun=this.loadFun
            var setCacheList=this.setCacheList
            var params=Object.assign({pageSize:10,pageNum:1},this.params)

            let func = function(){ 
              intervalCount=intervalCount+1; 
              lock=sessionStorage.getItem(lockKey)

              var data=refresh?null:getFromCache() 
              if(data!=null && data!='undefined'  && data!=undefined){
                var res2={
                  tips:{
                    isOk:true,
                    tipscode:'ok',
                    msg:'成功'
                  },
                  data:data
                }
                resolve(res2)
                sessionStorage.removeItem(lockKey)
                clearInterval(interalFunc) 
                return;
              }
              if(intervalCount>5){ 
                sessionStorage.removeItem(lockKey)
                clearInterval(interalFunc) 
                reject("等待超时")
                return;
              }
              
              if(lock){
                return;
              }
              if(!loadFun){
                return;
              } 
              sessionStorage.setItem(lockKey,"1")
              loadFun(params).then(res=>{
                clearInterval(interalFunc) 
                  if(res.tips && res.tips.isOk){
                    if(!res.data || res.data.length==0){
                      setCacheList([])
                      sessionStorage.removeItem(lockKey)
                      resolve({tips:res.tips,data:[]})  
                      return;
                    }
                    sessionStorage.removeItem(lockKey)
                    var res2={
                      tips:res.tips,
                      data:res.data
                    }
                    
                    setCacheList(res2.data)
                    resolve(res2) 
                  }else{
                    sessionStorage.removeItem(lockKey) 
                    reject(res)  
                  }
                }).catch(e=>{
                  clearInterval(interalFunc) 
                  sessionStorage.removeItem(lockKey)
                  reject(e)  
                })
            }
            if(lock){
              interalFunc = setInterval(()=>{
                func();
              },2000)
            }else{
              func();
            } 
        })
      },
      onTableLoadDatas(res){
        let {tips,data} = res
        if(tips.isOk && data && data.length>0){
          
          let idKey=this.propsCpd['id']
          let dataNotExists=data.filter(k=>!this.item.options.some(o=>o[idKey]==k[idKey]))
          if(dataNotExists.length>0){
            this.setCacheList(dataNotExists) 
            this.item.options.unshift(...dataNotExists) 
          }
         
           
        } 
           
      }
    },
    mounted(){
        this.initMyValByValue();
        this.initData();
        this.initItemOptions();
        
        
    }, 
  }
  </script>
  <style lang="scss" scoped>  
    @import url('../index.scss');
    
  </style> 
  