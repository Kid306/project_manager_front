import util from "../js/util"
const smallTableDataCacheMap=new Map();  

export const MdpSelectMixin = {
     
    computed: { 
        avaterCpd(){  
            var isEmpty= !this.myVal || this.myVal.length==0
            var obj={isNull:isEmpty} 
            if(isEmpty){
                obj.icon='full-screen'
                obj.color='#E4E7ED'
                return obj;
            }else{
                var idKey=this.propsCpd['id']
                var nameKey=this.propsCpd['name']
                if(this.multiple==true){
                    if(this.sels && this.sels.length>0){
                        return this.sels[0]
                    }else{
                        var val=this.myVal[0]  
                        obj[nameKey]=val
                        obj[idKey]=val
                    }
                }else{
                    if(this.sels){
                        return this.sels
                    }else{
                        var val=this.myVal  
                        obj[nameKey]=val
                        obj[idKey]=val
                    }
                } 
            } 
            return obj;
        }, 
        optionsCpd(){ 
            var options=[] 
            var map=new Map();
            var idKey=this.propsCpd['id']
            var nameKey=this.propsCpd['name']
            if(this.initOptions){
                this.initOptions.forEach(k=>map.set(k[idKey],k))
             }
            if(this.options){
                this.options.forEach(k=>map.set(k[idKey],k))
             }
            if(this.plusOptions){
                this.plusOptions.forEach(k=>map.set(k[idKey],k)) 
            }  
            
            if(this.item && this.item.options){ 
                this.item.options.forEach(k=>map.set(k[idKey],k))   
            } 
            var options2=[]
            var needFilter=!!this.filterFun
            const valueIterator = map.values(); 
            const  all=[...valueIterator];
            for(let value of all) {
                if(needFilter){
                    if(!this.filterFun(value,options)){
                        continue;
                    }
                }
                options2.push(value)
            }   
            options2.sort( (k,b) =>{ 
                var start=k.seqOrder||k[idKey]
                var end=k.seqOrder||k[idKey]
                 return start-end
            }) 
            return options2
             
        },
        sels(){  
            var idKey=this.propsCpd['id']
            if(this.multiple){
                if( !this.myVal || this.myVal.length==0 ){
                    return this.optionsCpd.filter(k=>this.myVal==k[idKey])
                }
                if( Array.isArray(this.myVal) ){ 
                        return this.optionsCpd.filter(k=>this.myVal.some(v=>v==k[idKey]))  
                }else{
                    return this.optionsCpd.filter(k=>this.myVal==k[idKey])
                }
               
            }else{
                if( !this.myVal || this.myVal.length==0 ){
                    return null
                }else {
                    return this.optionsCpd.find(k=>k[idKey]==this.myVal)
                }
            }
        },
        codeKey(){ 
           if(this.itemCode){
                return util.getCodeKey(this.itemCode,this.params) 
           }else{
            
            if(this.loadFun){  
                return util.getCodeKey(this.loadFun.name,this.params)
            }else{
                return "xxxx"
            }
           
           }
        },
        propsCpd(){
            if(this.props){
                return this.props
            }else{
                return {id:'id',name:'name',imgUrl:null}
            }
        },
        myValCpd:{
            get(){
                
                if(this.multiple){//多选，永远返回数组，[]|[1,2,3,,4]
                    
                    if(!this.modelValue||this.modelValue==''){
                        return []
                    }else{
                        if(Array.isArray(this.modelValue)){
                            return this.modelValue
                        }else{
                            var split=this.split||","
                            return this.modelValue.split(split)
                        } 
                    }
                   
                }else{//单选，按原样返回， 如果客户端传属了数组进来，将没法正确显示
                    return this.modelValue
                } 
            },
            set(val){ 
                if(!this.modelValue && !val){
                    return;
                } 
                var uval; 
                if(this.multiple){
                    
                    if(this.split){//有分隔符，返回字符串  
                        
                        if(Array.isArray(val)){
                            uval=val.join(this.split) 
                        }else{ 
                            uval=val
                        }
                    }else{//没有分隔符，返回数组
                        if(Array.isArray(val)){
                            uval=val
                        }else{ 
                            if(!val){
                                uval=[]
                            }else{
                                uval=[val]
                            } 
                        } 
                    } 
                }else{//单选，永远返回字符串及单个对象
                    var uval=null
                    if(Array.isArray(val)){
                        if(val?.length>0){
                            uval=val[0]
                        }else{
                            uval=""
                        }
                    }else{
                        uval=val
                    }  
                } 
                if(uval==this.modelValue){
                    return;
                }  
                this.$emit('update:modelValue',uval)
                this.$emit('change',uval)
                if(this.sels){ 
                    this.$emit('change2',this.sels) 
                }  
            }
        }
     },
     data(){
         return {
            defaultColors:util.getDefaultColors(), 
            myVal: null,
             item:{
                itemType:'4',
                options:[]
             },
             initOptions:[],
         }
     },
     watch:{ 
        sels(v,ov){
            if(!v){
                return;
            }
            this.$emit('change3',v)
        },
        myValCpd:{
            handler(v,ov){ 
                
                if(!v && !ov){
                    return;
                }
                if(v?.length==0 && ov?.length==0){
                    return;
                }
                this.myVal=v
            },
            immediate:true,
        },
        myVal(v,ov){
            if(!v && !ov){
                return;
            }
            if(v?.length==0 && ov?.length==0){
                return;
            }
            this.myValCpd=this.myVal
        },
         codeKey(){  
             this.initItemOptions();
         },
         modelValue(){ 
            this.initMyValByValue()
         }
     },
     props: {
        title:{
            type: String,
            default:'',
        },
         itemCode:String,
         disabled:{
             type:Boolean,
             default:false,
         },
         closable:{
             type:Boolean,
             default:false,
         },
         effect:{
             type:String,
             default:'dark'//dark / light / plain	
         }, 
         autoSelect:{
             type:Boolean,
             default:false,
         },
         /**
          * 如果是itemCode，将提交后台过滤部分列表数据
          * 如果是loadFun,将提交后台参与过滤
          */
         params:{
             type:Object,
             default:null,
         },
         modelValue: {
             type:[String,Number,Array],
             default:'',
         },   
         clearable:{
            type:Boolean,
            default:true,
         },
         styleObj:{
           type:Object,
           default:function(){return { marginTop:'5px' }}
        },  
        
        label: {
            type: String,
            default: "",
        },
        emptyText:{
            type:String,
            default:'请选择'
        },
        options:{
            type:Array,
            default:null
        },
        /**
         * 在加载完options后追加进入列表的plusOptions.
         * 整个列表长度为 options+plusOptions 或者 后台返回的 options+plusOptions
         */
        plusOptions:{
            type:Array,
            default:null,
        },
        width:{
            type:[String,Number],
            default:null,
        },
        /**
         * 支持select radio checkbox 三种
         */
        showType:{
            type:String,
            default:'select'
        },
        /**
         * 控制组件的布局
         * origin 原始方式，保持element-ui原组件样式
         * tag 未编辑前以tag显示，鼠标放入后显示原生组件模样
         * x 综合布局，适合于表单追求美观的样式，将颜色+图标+布局进行柔和组成新的组件
         */
        showStyle:{
            type:String,
            default:'origin'
        },
        /**
         * 是否多选
         */
        multiple:{
            type:Boolean,
            default:false,
        },
        /**
         * 分隔符，如果多选，并且指定了分隔符，将接受分格符连接的字符串及返回分给符连接的字符串
         */
        split:{
            type:String,
            default:null
        },
        /**
         * 对列表进行转换，{
                id:'id',
                name:'name'
                imgUrl:'imgUrl'
            },
            将把option.id=>option.id,把option.name=>option.name
         */
        props:{
            type: Object,
            default: () => null,
        },
        /**
         * 从接口拉取数据的函数,加载顺序 options,itemCode,loadOption,
         * 其中 params为 params属性
         * loadFun(params).then(res=>options=res.data)
         */
        loadFun:{
            type:Function,
            default:null,
        },
        /**
         * 对选项值进行过滤，
         * 返回false将被过滤，返回true将在列表显示
         * true/false=filterFun(option,idx,options)
         */
        filterFun:{
            type:Function,
            default:null
        },
        /**
         * 指定每个选项的颜色,option.color属性
         * option.color=colorFun(option,idx,options) 
         */
        colorFun:{ 
            type:Function,
            default:null
        },
        icon:{
            type:String,
            default:null,
        },
        iconFun:{
            type: Function,
            default: null,
        },
        /**
         * placeholder
         */
         placeholder:{
            type: String,
            default:'请选择',
         },
         /**输入框尺寸	
          * medium/small/mini	
          */
         size:{
            type: String,
            default:''
         },
         /**
          * 多选时是否将选中值按文字的形式展示
          */
         collapseTags:{
            type:Boolean,
            default:true, 
         },
         /**
          * 多选时用户最多可以选择的项目数，为 0 则不限制
          */
          multipleLimit:{
            type:Number,
            default:0, 
         },
         /**
          * select input 的 name 属性
          */
          name:{
            type:String,
            default:'', 
         },
         /**
          * select input 的 autocomplete 属性
          */
          autoComplete:{
            type:String,
            default:'off', 
         },
         /**
          * 是否可搜索
          */
          filterable:{
            type:Boolean,
            default:false, 
         },
         /**
          * 搜素的时候，的过滤函数
          */
          filterMethod:{
            type:Function,
            default:null, 
         },
         /**
          * 搜索条件无匹配时显示的文字，也可以使用slot="empty"设置
          */
          noMatchText:{
            type:String,
            default:'', 
         },
         /**
          * 选项为空时显示的文字，也可以使用slot="empty"设置
          */
          noDataText:{
            type:String,
            default:'', 
         },
         /**
          * Select 下拉框的类名
          */
          popperClass:{
            type:String,
            default:'-', 
         },
         /**
          * 多选且可搜索时，是否在选中一个选项后保留当前的搜索关键词
          */
          reserveKeyword:{
            type:Boolean,
            default:false, 
         }, 
         /**
          * 当有时候，传入的值不一定在列表中存在，事先已值值对应的名称，则可以通过initName设置，此时就算下拉列表没有对应的选项，也会反显，而不是显示早的值
          */
         initName:{
            type:String,
            default:null
         },
         /**
          * 空头像的是否随机头像
          */
         ranHead:{
            type: Boolean,
            default: false,
         },
         limit: {
            type:Number,
            default:0
         },
         /**
          * 当tag 模式下，定位出问题后，设置此参数可解决问题
          */
         relative:{
            type: Boolean,
            default: false
         },
         /**
          * 是否进行初始化加载数据，字典默认为true,其它默认为false
          * 会根局initLoad来决定是否进行远程调用，加载下拉列表
          * 当itemCode有值，则该参数无效。当itemCode无值时，将调用loadFun进行远程数据加载
          */
         initLoad:{
            type: Boolean,
            default: false
         },
         /**
          * 是否根据modelValue值变化进行远程调用加载数据进行名字反显。用于只知道id，不知道name的情况下，自动反显所用。
          * 当initName有值时，该参数无效
          */
         displayLoad:{
            type: Boolean,
            default: false,
         }

     },
     methods: { 
        
      getCacheList(){ 
        var tableDataCacheList=smallTableDataCacheMap.get(this.codeKey) 
        return tableDataCacheList
      },
      setCacheList(datas){

        var tableDataCacheList=smallTableDataCacheMap.get(this.codeKey)
        if(!tableDataCacheList){
          tableDataCacheList=[] 
        }
        if(datas==null || datas.length==0){
          smallTableDataCacheMap.set(this.codeKey,tableDataCacheList)
          return;
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
        
        smallTableDataCacheMap.set(this.codeKey,tableDataCacheList)
      },
      getFromCache(){ 
        var datas=this.getCacheList()
        return datas
      },
       /**
       * 做请求排序锁定处理，防止在列表中多次查询下拉列表数据 
       **/
       loadRemoteDatasByFun(refresh)
      {

        var codeKey=this.codeKey;
        return new Promise((resolve,reject)=>{
          var data=this.getFromCache()
          if(!refresh && data!=null && data!=undefined && data!='undefined'){
            var res2={
              tips:{
                isOk:true,
                tipscode:'ok',
                msg:'成功'
              },
              data:data
            }
            resolve(res2)
            return;
          }else{
            if(!refresh){
                resolve({
                    tips:{
                        isOk: true,
                        tipscode:'ok',
                        msg:'成功'
                    },
                    data: []
                })
                return;
            }
            var intervalCount=0
            var interalFunc=null
            var lockKey=codeKey+'@lock'
            var lock=sessionStorage.getItem(lockKey)
            var getFromCache=this.getFromCache
            var idKey=this.propsCpd['id']
            var loadFun=this.loadFun
            var setCacheList=this.setCacheList
            var params=this.params

            let func = function(){ 
              intervalCount=intervalCount+1; 
              lock=sessionStorage.getItem(lockKey)

              var data=getFromCache() 
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

          }
        })
      }, 
        showSelect(){
            if(this.disabled){
              return;
            }
            if(this.$refs["operRef"]){
              if(this.$refs["operRef"].onFieldClick){ 
                this.$refs["operRef"].onFieldClick();
              }
            }
          },   
        isCheck(option){
            var idKey=this.propsCpd['id']
            if(!option && this.myVal){
                return false
            }else if(option && !option[idKey] && !this.myVal){
                return  false;
            }
            if(this.multiple){
                if(Array.isArray(this.myVal)){ 
                    return this.myVal.some(k=>k==option[idKey]) 
                }else {
                    return this.myVal==option[idKey]
                }  
            }else{
                return this.myVal==option[idKey]
            }
        },
        filterOptions(itemOptions){
            if(this.filterFun && itemOptions!=null && itemOptions.length>0){
                itemOptions=itemOptions.filter(k=>this.filterFun(k,itemOptions))
            }
            return itemOptions;
        },
        transOptions(itemOptions){ 
            return itemOptions;
        },  
        getColorById(id,option,itemOptions){ 
              return option?.color||util.getColorById(id);
        },
        getIconById(id,option,itemOptions){ 
            if(option?.icon){
                return option.icon
            }
             if(!id){
                return "full-screen"
             }else{
                return ''
             }

       },
        afterLoad(itemOptions){

            return itemOptions;
        },
        clearCache(){
            this.$mdp.clearDictCache(this.itemCode,this.params)  
            this.item.options=[]
        },
         initItemOptions(refresh){  
            if(this.itemCode){
                this.$mdp.ajaxGetDictOptions (this.itemCode,this.params,refresh).then(res=>{
                    if(res.tips.isOk){
                        
                       var item=res.data
                       var itemOptions=item.options?item.options:[] 
                       item.options=this.afterLoad(itemOptions)
                        this.item=item
                    }else{
                        this.item={itemType:'4'}
                        this.item.options=[]
                    }
                    
                })
            }else if(this.loadFun){ 
                if(this.initLoad){
                    this.loadRemoteDatasByFun(refresh).then(res=>{
                        this.item={itemType:'4'}
                        var itemOptions=res.data
                        this.item.options=this.afterLoad(itemOptions)
                    })
                }else{
                    this.item={
                        itemType:'4',
                        options:this.getCacheList()
                    }
                }
                
            }
             
         },
         onChange(val){    
            
         },
         onChange2(data){ 
             
         },
         initData(){    
         }, 
         /**
          * 只能初始化时执行一次，否则性能有问题
          * @returns 
          */
         initOptionsByInitName(myVal,myName){ 
            if(this.initOptions && this.initOptions.length>0){
                return;
            } 
            this.initOptions=myVal.map((v,idx)=>{
                var option={}
                option[this.propsCpd['id']]=v
                option[this.propsCpd['name']]=myName[idx]
                return option
            })
         },
         /**
          * 只能执行一次，性能问题
          * @returns
          */
         initMyValByValue(){    
            if((!this.initName||this.initName.length<=0) && !this.displayLoad){
                return;
            }
            if(!this.modelValue||this.modelValue.length<=0){
                return;
            }
            if(this.initOptions && this.initOptions.length>0){
                return;
            }

            if(this.initName){
                if(this.multiple){//多选，永远返回数组，[]|[1,2,3,,4]
                
                    var relVal=[]
                    var relName=[] 
                    if(Array.isArray(this.modelValue)){
                        relVal = this.modelValue
                        relName = this.initName
                    }else{
                        var split=this.split||","
                        relVal = this.modelValue.split(split)
                        relName = this.initName.split(split)
                    }  
                   this.initOptionsByInitName(relVal,relName)
                }else{//单选，按原样返回， 如果客户端传属了数组进来，将没法正确显示
                    var relVal = this.modelValue
                    var relName = this.initName
                    this.initOptionsByInitName([relVal],[relName])
                }
            }else {
                if(this.loadFun && this.displayLoad){  
                    var relVal=[]
                    if(this.multiple){//多选，永远返回数组，[]|[1,2,3,,4] 
                        if(Array.isArray(this.modelValue)){
                            relVal = this.modelValue
                        }else{
                            var split=this.split||","
                            relVal = this.modelValue.split(split)
                        }  
                    }else{//单选，按原样返回， 如果客户端传属了数组进来，将没法正确显示
                        relVal = [this.modelValue]  
                    }
                    var idKey=this.propsCpd.id
                    var initIds=relVal.filter(k=>!this.optionsCpd.some(o=>o[idKey]==k)) 
                    if(initIds.length>0){
                        var params={}
                        params[idKey]="$IN"+initIds.join(",")
                        this.loadFun(params).then(res=>{
                            let {tips,data}=res
                            if(tips.isOk && data && data.length>0){
                                this.initOptions.push(...data)
                                this.setCacheList(data)
                            }
                        })
                    }
                }
            }
            
            
            
         },
         getMyColor(option){
            
           let color= option.color?option.color:(this.colorFun?this.colorFun(option[this.propsCpd['id']]):this.getColorById(option[this.propsCpd['id']]))
            return color
        },
         getMyColorById(id){
           return  this.colorFun?this.colorFun(id):this.getColorById(id)
         },
         getMyIcon(option){
            return option.icon?option.icon:(this.iconFun?this.iconFun(option[this.propsCpd['id']]):this.getIconById(option[this.propsCpd['id']]))
        },
        focus(){
            var selectRef=this.$refs['selectRef']
            selectRef.focus();
        },
        blur(){
            var selectRef=this.$refs['selectRef']
            selectRef.blur();
        },
        formatImgFront(name){
             return name?.substring(0,2)
        }
     },
     
}