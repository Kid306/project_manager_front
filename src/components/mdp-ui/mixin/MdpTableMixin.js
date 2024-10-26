import util from "../js/util" 
export const MdpTableMixin = {
     
    computed: {   
        
        commonColumnConfigs:function(){
            var cols= this.columnConfigs.filter(c=>c.isCommon)
            if(cols.length==0){
            cols=this.columnConfigs.filter(c=>c.property);
            }
            var sliceNum=cols.length>this.commonQueryNum?this.commonQueryNum:cols.length
            cols=cols.slice(0,sliceNum)
            return cols;
        },
        pageVisible:{
            set(val){
                this.$emit('update:visible',val) 
                this.$emit(val?'open':'close',val)
            },
            get(){
                return this.visible
            }
        },
        disField(){  
            return this.disFieldCalc()
        },
        disBtnRules(){
            
            var disRules=Object.assign({},this.defaultDisBtnRules,this.custDisBtnRules)
            return disRules;
        },
        
     },
     data(){
         return { 
            filters:{//查询参数

            },
            defaultFilters:{//默认查询参数,第一次打开界面的时候用到，恢复默认值的时候用到

            },
            tableDatas:[],//表格列表数据
            pageInfo:{//分页数据
                total:0,//服务器端收到0时，会自动计算总记录数，如果上传>0的不自动计算。
                pageSize: this.pageable?10:1500,//每页数据
                count:false,//是否需要重新计算总记录数
                pageNum:1,//当前页码、从1开始计算
                orderFields:[],//排序列 如 ['sex','student_id']，必须为数据库字段
                orderDirs:[]//升序 asc,降序desc 如 性别 升序、学生编号降序 ['asc','desc']
            },
            load:{ list: false, edit: false, del: false, add: false,batchAdd:false,batchDel:false,batchEdit:false,editSomeFields:false },//查询中...
            sels: [],//列表选中数据
            pkNames:[/** branchId1,branchId2 */],//表格主键的java属性名称，驼峰命名，默认为id,
            dataBak:{},//数据被修改前进行备份
            menuDefId:'',//menu_def.id 菜单表菜单编号，用于菜单权限判断，按钮权限判断
            menuDefName:'',//menu_def.name 功能名称，用于导出excel等文件名
            refId:'',//引用编号，<table :ref="refId+'Table'"> <form :ref="refId+'Form'">
            columnConfigs:[],//列字段配置信息，根据表格头自动初始化
            hiQueryParams:{},//高级查询条件，需要转换为hiQueryParams="json字符串格式"提交到后台,树状结构，{cid:'',label:'',property:'',children:[]}
            checkedColumns:[],//选中的表格属性列表，如[id,branchName,xx,xxx,...]

            addForm:{},//新增页面的数据
            editForm:{},//编辑页面数据
            //增删改查(含批量)接口
            apis:{
                list:null,
                add:null,
                del:null,
                edit:null,
                editSomeFields:null,
                batchAdd:null,
                batchDel:null,
                batchEdit:null,
            },
            defaultDisBtnRules:{
                addBtn:false,
                editBtn:false,
                copyBtn:false,
                delBtn:false,
                detailBtn:false,
                searchBtn:false,
                exportBtn:false,
                importBtn:false,
                printBtn:false,
                selectBtn:false, 
                selectConfirmBtn:false, 
            },//判断是否可编辑 
            custDisBtnRules:{

            },
            addFormVisible: false,//兼容旧版，请勿再用
            editFormVisible: false,//兼容旧版，请勿再用
            /**
             * 当前页面的currOpType,操作类型 list -列表，detail-明细，add-新增，edit-修改，mng-综合管理,select-查询并选择确认
             */
            currOpType: 'mng',
            
            showType:'table',// 表格展现模式，table-看板，card-卡片，kanban-看板
        }
     },
     watch:{   
        columnCfgs(){
            this.initTableColumnConfigs()
        }, 
        pageVisible(val){ 
            if(val==true){ 
                this.$nextTick(()=>{
                    this.onOpen();
                })
                
            }else{
                this.onClose();
            }
            
        },
        params(val){      
            //this.initTableColumnConfigs(); 
            this.initData();
        },
        currOpType(val){
            this.defaultDisBtnRulesInit(val)
            this.disBtnRulesInit(this.custBtnRules)
        },
        checkedColumns(cols){  
            
        },
        pageInfo:{ 
            handler(){
                this.$emit('pageInfo',this.pageInfo)
            },
            immediate: true // 使watch立即生效
        }
     },
     props: {   
        /**
         * 弹框时显示或者关闭
         */
        visible:{
            type:Boolean,
            default:false
        },
        /**
         * 上级页面的currOpType，用于多级权限判断，参考currOpType
         */
        parentOpType:{//
            type:String,
            default:null
        },
        /**
         * 当前页面的currOpType,操作类型 list -列表，detail-明细，add-新增，edit-修改，mng-综合管理,select-查询并选择确认
         */
        subOpType:{
            type:String,
            default:null,
        },
        bottomOffset:{
            type:[String,Number],
            default:45
        }, 
        
        /**
         * subOpType='select' 时有效
         * 是否多选
         */
         multiple:{
            type:Boolean,
            default:false,
        },
        /**
         * 用于初始话高级查询，常用查询等
         * {label:'列名',
         * property:'属性名',
         * sortNo:'排序从0-999，越小越靠前',
         * isCommon:'是否常用',
         * colType:'数据库字段类型 string/int/date/datatime/',
         * showHq:'是否显示在高级查询true/false',
         * showCol:'是否在表格中显示该列true/false',
         * sqlOper:'默认查询规则，默认eq gt/lt/ge/le/eq/ne/left_like/right_like/like/in/nin/bwtween/sql',
         * sqlVal:'默认值，多选的话逗号分隔'
         * beginVal:'如果sqlOper=between,值存于beginVal及envVal中',
         * endVal:'',
         * pk:'是否为主键，true/false',
         * itemCode:'字典表中itemCode字段，填写了该值将从字典表加载下拉列表'
         * colPrefix:'属性需要添加前缀是使用，比如res.id=xxxxx,此次填写res.',
         * disabledHq:'是否允许编辑查询条件',
         * kbName:'看板根据id取值的字段',
         * kbFormat:[日期类型的格式化YYYY-w周,YYYY-MM月,...等monent支持的任意格式],
         * }
         */
        columnCfgs:{
            type:Array,
            default: null,
        },
        /**
         * 需要从外部传入表格的参数，由此进入
         * params={defaultFilters,filters,其它参数}
         */
        params:{
            type:Object,
            default:null,
        },
        /**
         * 显示风格
         * origin,tag,x
         */
        showStyle:{
            type:String,
            default:null
        },
        defaultHiQueryParams:{
            type:Object,
            default:null,
        },
        pageable:{
            type: Boolean,
            default:true
        },
        pageSmall:{
            type: Boolean,
            default: false
        },
        pageLayout:{
            type: String,
            default: "slot,total, sizes, prev, next,pager,jumper"
        },
        pageSize: {
            type: Number,
            default: 10
        },
        operWidth:{
            type:[String,Number],
            default:null
        }, 
        showCheckbox:{
            type: Boolean,
            default: false
        },
        size:{
            type:String,
            default:null
        },
        preQueryCheck:{
            type: Function,
            default:()=>{
                return (page)=>{
                    return true
                }
            }
        },
        
        /**
         * 操作后台数据的api列表
         * crudApis:{
         *  list:xxxx,
         *  add: xxxx,
         *  edit: xxxx,
         *  del: xxxx,
         *  editSomeFields:xxx,
         * }
         */
        crudApis:{
            type:Object,
            default:null,
        },
        
        defaultCheckColumnNum:{
            type: Number,//默认展示的表格列数，前8列
            default: 30
        },
        
        /**
         * 是否开启editSomeField模式
         */
         someOpen:{
            type: Boolean,
            default: true,
        },
        
        expandId:'',//智能表单定义编号，用于低代码，扩展表字段，自定义表单等
     }, 
     created(){

     },
     mounted(){   
        this.initTableColumnConfigs(); 
        this.initData();
     },
     methods: { 
        openKanban(refName){
            if(!refName){
                refName='kanbanDlg'
            }
            //this.showType='kanban'
            this.$refs[refName]?.open()
        },
        onOpen(){ 
            //this.initTableColumnConfigs();//有些情况下表格初始化未成功，在页面打开的时候，重新初始化未初始成功的表格配置信息
            this.initData();
        },
        onClose(){

        },
        onFormClose(){ 
            var formDialog=this.$refs['formDlg'] //新版统一命名formDlg
            if(!formDialog){
                formDialog=this.$refs[this.refId+'FormDialog']//兼容旧版
            }
            if(formDialog){ 
                formDialog.close();
            }
        },
        defaultDisBtnRulesInit(currOpType){
            if(/add|edit|mng/i.test(currOpType)){
                Object.keys(this.defaultDisBtnRules).forEach(k=>this.defaultDisBtnRules[k]=false)
            }else if(/list/i.test(currOpType)){
                Object.keys(this.defaultDisBtnRules).forEach(k=>this.defaultDisBtnRules[k]=true)
                this.defaultDisBtnRules.detailBtn=false
                this.defaultDisBtnRules.exportBtn=false
                this.defaultDisBtnRules.printBtn=false
                this.defaultDisBtnRules.searchBtn=false 
             }else if(/detail/i.test(currOpType)){
                Object.keys(this.defaultDisBtnRules).forEach(k=>this.defaultDisBtnRules[k]=true)
                this.defaultDisBtnRules.detailBtn=false 
                this.defaultDisBtnRules.searchBtn=false 
             }else if(/select/i.test(currOpType)){
                Object.keys(this.defaultDisBtnRules).forEach(k=>this.defaultDisBtnRules[k]=true) 
                this.defaultDisBtnRules.searchBtn=false 
                if(this.multiple){
                    this.defaultDisBtnRules.selectConfirmBtn=false
                }else{
                    this.defaultDisBtnRules.selectBtn=false
                } 
             }
         },
        /**
         * 页面初始话进行数据初始处理。该函数由组件自行扩展，添加一些需要的其它逻辑判断
         */
         initCurrData(){  

            this.searchTableDatas();

         },

         /**
          * 此函数由组件扩展,给defaultFilters添加其它的额外默认参数
          */
         initDefaultFilters(){ 
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
        
        /**
          * 设置某个关键词、按钮、输入框禁用 custBtnRules['addBtn']=false
          * 判断某个对象是否可编辑 this.disBtn('addBtn')==false
          */
         disBtnRulesInit(custBtnRules){

        },
         initData(){  
            if(this.subOpType){
                this.currOpType=this.subOpType
            }
            this.defaultDisBtnRulesInit(this.currOpType)
            this.disBtnRulesInit(this.custDisBtnRules)
            this.$nextTick(()=>{   
                this.initDefaultFilters();
            
                if(this.defaultHiQueryParams){
                    this.hiQueryParams=this.defaultHiQueryParams
                }
               
                //Object.assign(this.filters,this.defaultFilters) 
                Object.assign(this.apis,this.crudApis)
                this.initCurrData();   
            })
            
         },

        handleSizeChange(pageSize) { 
            this.pageInfo.pageSize=pageSize; 
            this.loadTableDatas();
        },
        handleCurrentChange(pageNum) {
            this.pageInfo.pageNum = pageNum;
            this.loadTableDatas();
        }, 
        // 表格排序 obj.order=ascending/descending,需转化为 asc/desc ; obj.prop=表格中的排序字段,字段驼峰命名
        sortChange( obj ){
            if(obj.order==null){
                this.pageInfo.orderFields=[];
                this.pageInfo.orderDirs=[]; 
            }else{
                var dir='asc';
                if(obj.order=='ascending'){
                    dir='asc'
                }else{
                    dir='desc';
                } 
                let property=obj.prop
                let lineProp=util.toLine(property)
                
                let columnCfg=this.columnConfigs.find(k=>k.property==property)
                if(columnCfg?.colPrefix){
                    lineProp=columnCfg.colPrefix+lineProp
                }
                this.pageInfo.orderFields=[lineProp]; 
                this.pageInfo.orderDirs=[dir];
            }
            this.loadTableDatas();
        }, 
        searchTableDatas(params){  
             this.pageInfo.count=true; 
             this.pageInfo.total=0;
             this.pageInfo.pageNum=1;
             this.loadTableDatas(params);
        },
        searchReset() {
            //this.filters=Object.assign({},this.defaultFilters)
            this.hiQueryParams={}
            if(this.defaultHiQueryParams){
                this.hiQueryParams=this.defaultHiQueryParams
            }
            this.searchTableDatas();
        },
        /**
         * 根据表格头初始化columnConfigs
         * {label:'列名',
         * property:'属性名',
         * sortNo:'排序从0-999，越小越靠前',
         * isCommon:'是否常用',
         * colType:'数据库字段类型 string/int/date/datatime/',
         * showHq:'是否显示在高级查询true/false',
         * showCol:'是否在表格中显示该列true/false',
         * sqlOper:'默认查询规则，默认eq gt/lt/ge/le/eq/ne/left_like/right_like/like/in/nin/bwtween/sql',
         * sqlVal:'默认值，多选的话逗号分隔'
         * beginVal:'如果sqlOper=between,值存于beginVal及envVal中',
         * endVal:'',
         * pk:'是否为主键，true/false', 
         * itemCode:'字典表中itemCode字段，填写了该值将从字典表加载下拉列表'
         * colPrefix:'属性需要添加前缀是使用，比如res.id=xxxxx,此次填写res.',
         * disabledHq:'是否允许编辑查询条件',
         * }
         * @returns 
         */
        initTableColumnConfigs(){     
            var columnConfigs=[]
            if(this.columnCfgs && this.columnCfgs.length>0){
                columnConfigs.push(...this.columnCfgs)
                this.initTableExtInfoByColumnConfigs(columnConfigs)
            }else{ 
                var table=this.$refs[this.getRefId()+'Table']; 
                if(!table){
                    table=this.$refs['table']
                }
                if(!table){
                    return;
                }
                if(!table.store?.states?.columns){
                    return;
                }
                this.$nextTick(()=>{ 


                    const columns = table.$el.querySelectorAll('.el-table__inner-wrapper .hidden-columns div');

                    
                     table.store.states.columns.value.forEach((k,idx)=>{ 
                        
                        var column={} 
                        var elcol=columns[idx]
                        column.property=k.property
                        column.label=k.label 
                        column.showCol=true     
                        column.itemCode = elcol.getAttribute('itemcode') || elcol.getAttribute('item-code')
                        column.colType=elcol.getAttribute('coltype')  || elcol.getAttribute('col-type')
                        column.colPrefix=elcol.getAttribute('colprefix')  || elcol.getAttribute('col-prefix')
                        column.kbName=elcol.getAttribute('kbname')  || elcol.getAttribute('kb-name')
                        column.sortNo=elcol.getAttribute('sortno')  || elcol.getAttribute('sort-no')
                        column.isCommon=elcol.getAttribute('iscommon')  || elcol.getAttribute('is-common')
                        column.pk=elcol.getAttribute('pk')
                        column.showCol=elcol.getAttribute('showCol') || elcol.getAttribute('show-col')
                        column.showHq=elcol.getAttribute('showHq') || elcol.getAttribute('show-hq')
                        columnConfigs.push(column)
                        
                     })
                     
                     this.initTableExtInfoByColumnConfigs(columnConfigs)







                })
               
            } 
        }, 
        initTableExtInfoByColumnConfigs(columnConfigs){
            this.columnConfigs=columnConfigs
            if( !this.pkNames || this.pkNames.length<=0){
                this.pkNames=this.columnConfigs.filter(k=>k.pk==true).map(k=>k.property)
            }
           
            var colsIsCommon=this.columnConfigs.filter(c=>c.isCommon==true && c.property).map(c=>c.property) 
            var colsUnCommon=this.columnConfigs.filter(c=>c.isCommon!=true && c.property).map(c=>c.property)
            var defNum=this.defaultCheckColumnNum;
          
            var checkNum=this.columnConfigs.length<defNum?this.columnConfigs.length:defNum 
            if(colsIsCommon.length>0 && checkNum<=colsIsCommon.length){
                this.checkedColumns=colsIsCommon.splice(0,checkNum)
            }else{
                colsIsCommon.push(...colsUnCommon.splice(0,checkNum-colsIsCommon.length))
                this.checkedColumns=colsIsCommon
            } 
            var table=this.$refs['table'];// 新版统一叫 ref='table'
            if(!table){
                table=this.$refs[this.getRefId()+'Table']; //兼容旧版
            } 
             this.$nextTick(()=>{
                table?.doLayout() 
             })
           
            
        },

        getQueryParams(){
            let params = {
                pageSize: this.pageInfo.pageSize,
                pageNum: this.pageInfo.pageNum,
                total: this.pageInfo.total,
                count:this.pageInfo.count
            };
            if(this.pageInfo!=null){
                params = {
                    pageSize: this.pageInfo.pageSize,
                    pageNum: this.pageInfo.pageNum,
                    total: this.pageInfo.total,
                    count:this.pageInfo.count
                };
            }
            
            if(this.pageInfo.orderFields!=null && this.pageInfo.orderFields.length>0){
                let orderBys=[];
                for(var i=0;i<this.pageInfo.orderFields.length;i++){  
                    orderBys.push(this.pageInfo.orderFields[i]+" "+this.pageInfo.orderDirs[i])
                }  
                params.$orderBy= orderBys.join(",")
            }
            Object.assign(params,this.filters)
            
            if(this.params){ 
                Object.assign(params,this.params)
            }
            if(this.defaultFilters){
                Object.assign(params,this.defaultFilters)
            }
            this.clearNullParams(params)
            this.encodeHiQueryParams(params)
            return params;
        },
        clearNullParams(params){
            if(!params){
                return;
            }else{
                let keys=Object.keys(params)
                keys.forEach(k=>{
                    if(!params[k]||params[k]==''){
                        delete params[k]
                    }
                })
            }
        },
        /**
         * 对高级查询的参数进行编码，加入到参数池中用于提交给后台接口
         * params.hiQueryParams=encodeURI(JSON.stringify(hiParams))
         * @param {*} params 
         */
        encodeHiQueryParams(params){
            var hiQueryParams=this.filterHiQueryParams(this.hiQueryParams)
            if(hiQueryParams&&hiQueryParams.cid){
                params.hiQueryParams=encodeURI(JSON.stringify(hiQueryParams))
            }
            return params
        },
        /**
         * 对高级查询的条件进行过滤默认的无效条件，减少提交后台接口的体积
         * @param {*} hi 
         * @returns 
         */
        filterHiQueryParams(hi){
            var that=this;
            var condition={};
            if(hi==null || !hi.cid){
                return null;
            }else{
                if(hi.children&&hi.children.length>0){
                    if(hi.sqlLink=='AND'||hi.sqlLink=='OR'){
                        condition={cid:hi.cid,sqlLink:hi.sqlLink,children:[]}
                        hi.children.forEach(k=>{
                            var child=that.filterHiQueryParams(k);
                            if(child!=null && child.cid){
                                condition.children.push(child);
                            } 
                        })
                        return condition;
                    }else{
                        return null;
                    }
                }else{
                    if(hi.sqlLink=='AND'||hi.sqlLink=='OR'){
                        return null;
                    }else{
                        if(hi.sqlOper=='=' && !hi.sqlVal){
                            return null;
                        }else if(!hi.sqlOper){
                            return null;
                        }else if(hi.sqlOper!='$IS NULL' && hi.sqlOper!='$IS NOT NULL'){
                            if(hi.sqlVal==null || hi.sqlVal==''){
                                return null;
                            }
                        }
                        condition={cid:hi.cid,property:hi.property,sqlOper:hi.sqlOper,colType:hi.colType,sqlVal:hi.sqlVal,endVal:hi.endVal,colPrefix:hi.colPrefix}
                        return condition;
                    }
                }
            }
        },
        //获取列表 Item 数据项定义
        loadTableDatas(localParams) { 
            var apiName="apis.list"
            var params = this.getQueryParams();//查询条件
            if(localParams){
                Object.assign(params,localParams)
            }
            if(this.preQueryCheck){
                if(!this.preQueryCheck(this)){
                    return;
                }
            }
            if(!this.preQueryParamCheck(params)){
                return;
            }
            if(!this.apiCheck(this.apis.list,apiName)){
                return;
            }
            this.load.list = true;
            var func = this.apis.list;
            func(params).then((res) => {
                this.getResult(res,apiName) 
                this.load.list = false;
            }).catch( err => {
                this.load.list = false  
                }
            );
        },
        getResult(res,apiName){
            
            this.$emit('loadDatas',res)
            var tips=res.tips;
            
            if(tips.isOk){  
                this.pageInfo.total = res.total;
                this.pageInfo.count=false;
                var tableDatas = res.data; 
                this.tableDatas=tableDatas
                
                this.parseExpand(tableDatas,this.expandFieldName)
                this.afterList(res.data,tips.isOk,apiName)
                
            }else{
                this.$message({ message: tips.msg, type: 'error' });
            }  
        },
        parseExpand(tableDatas,expandFieldName){
            if(expandFieldName && tableDatas && tableDatas.length>0){
                tableDatas.forEach(d=>{
                        if(d[expandFieldName] && d[expandFieldName] instanceof String){
                            d[expandFieldName]=JSON.parse(d[expandFieldName])
                        }
                        if(d[expandFieldName] instanceof Array){
                            d[expandFieldName].forEach(k=>{
                                d[expandFieldName+"."+k.id]=k.value
                            })
                        } 
                    })
                }   
        },
        //页面数据加载完后需要对数据进行加工处理的
        afterList(tableDatas,isOk,apiName){ 
         },
        apiCheck(func,apiName){ 
            if(!func){
                if(this.crudApis){
                    Object.assign(this.apis,this.crudApis)
                    return  true;
                }
                this.$message({ message: apiName+"为空", type: 'error' });
                return false;
            }
             
            return true;
        },
        // 打开新增编辑窗口 ，即将作废
        openForm(res){    
             
            let {parentOpType,formRefId,subOpType,formData} = res
            if(!formRefId){
                formRefId='formDlg' //新版统一叫formDlg
            }
            var form=this.$refs[formRefId]

            if(!form){ //兼容旧版 
                formRefId='FormDlg'  
                form=this.$refs[formRefId] 
                if(!form){ 
                    formRefId='formDialog'  
                    form=this.$refs[formRefId] 
                    if(!form){ 
                        formRefId=this.getRefId()+"FormDialog"
                        form=this.$refs[formRefId] 
                        if(!form){ 
                            formRefId=this.getRefId()+"formDialog"
                            form=this.$refs[formRefId]
                        }
                    }
                } 
            }
            if(form){ 
                if(!parentOpType){
                    parentOpType=this.currOpType
                }
                res.parentOpType=parentOpType
                res.formRefId=formRefId 
                res.expandId=this.expandId
                res.showExpand=this.showExpand
                res.expandFieldName=this.expandFieldName
                form.open(res);
            }else{

            }
            
        },
        //表单新增/修改提交后的回调 ,打算作废，请尽量少用
        afterFormSubmit(res,isOk,currOpType){
            if(res==undefined || isOk || isOk==undefined){//兼容老代码，老代码有可能没有返回任何数据，所以res等都是undefined
                this.searchTableDatas();
            }
            this.$emit("form-submit",res,isOk,currOpType)
            //兼容旧版
            this.addFormVisible=false
            this.editFormVisible=false
        },
        //表单新增/修改时取消或者关闭 在表单组件上 @cancel="onFormCancel"
        onFormCancel(currOpType){
            this.$emit("form-cancel",currOpType) 
            //兼容旧版
            this.addFormVisible=false
            this.editFormVisible=false
        },
        //单条新增提交成功后回调 在表单组件上 @addSubmit="afterAddSubmit"
        afterAddSubmit(row){   
            this.$emit("add-submit",row)
            this.searchTableDatas();
            //兼容旧版
            this.addFormVisible=false
            this.editFormVisible=false
        },
        //单条修改  在表单组件上 @editSubmit="afterEditSubmit"
        afterEditSubmit(row){ 
            if(row==undefined){//兼容老代码，老代码有可能没有返回任何数据，所以row等都是undefined
                this.searchTableDatas();
            }else{ 
                if(this.justPkIsMatch(this.editForm,row)){
                    Object.assign(this.editForm,row)
                    this.dataBak={...this.editForm}
                }else{
                    this.searchTableDatas();
                }
            }
            this.$emit("edit-submit",row)
            
            //兼容旧版 
            this.editFormVisible=false
        }, 
        // 兼容旧版本 ，后期作废，表单修改某个字段后回调 在表单组件上 @editFields="afterEditFields"
        onEditFields(row){
            this.afterEditFields(row)
        },
        
        // 表单修改某个字段后回调 在表单组件上 @editFields="afterEditFields"
        afterEditFields(row){ 
            if(row==undefined){//兼容老代码，老代码有可能没有返回任何数据，所以row等都是undefined
                this.searchTableDatas();
            }else{ 
                if(this.justPkIsMatch(this.editForm,row)){ // 如果主键是匹配的，直接赋值
                    Object.assign(this.editForm,row)
                    this.dataBak={...this.editForm}
                }else{ // row有可能返回的是 {$pks:[],f1:'',f2:''}这种格式
                    let pkList=row['$pks']
                    if(pkList && pkList.length>1){// 如果更新的是多条数据，表单中应该不存在更新多条数据的情况
                        //this.searchTableDatas()
                    }else if(pkList && pkList.length==1){ // 大部分是这种情况，更新一条数据的某个或者多个字段
                        let pkNames=this.getPkNames()
                        if(pkNames.length==1){ // 单主键
                            if(pkList[0]==this.editForm[pkNames[0]]){ //主键相同，直接赋值
                                Object.assign(this.editForm,row)
                                this.dataBak={...this.editForm}
                            }else{// 主键不同，重新查询数据
                                this.searchTableDatas()
                            }
                        }else if(pkNames.length>1){ // 多主键
                            let pkList0=pkList[0]
                            Object.assign(row,pkList0) 
                            if(this.justPkIsMatch(this.editForm,row)){ // 主键相同，直接赋值
                                Object.assign(this.editForm,row)
                                this.dataBak={...this.editForm}
                            }else{ // 主键不同重新查询
                                this.searchTableDatas()
                            }
                        }else{ // 无主键， 直接查询
                            this.searchTableDatas();
                        }
                        
                    }else{ // 未知情况，不处理
                        //this.searchTableDatas()
                    }
                    
                }
            }
            this.$emit("edit-fields",row)
        }, 
        // 表格中进行单条删除/批量删除后回调此函数
        afterDelSubmit(res,isOk,apiName){ 
            if(res==undefined || isOk || isOk==undefined){//兼容老代码，老代码有可能没有返回任何数据，所以res等都是undefined
                this.searchTableDatas();
            }else if(isOk){
                this.searchTableDatas();
                this.$emit("del-submit",res,isOk,apiName)
            }
            
        },
        // 表格中 批量修改某些字段
        afterEditSomeFields(res,isOk,params,row){
            if(res==undefined || isOk==undefined){//兼容老代码，老代码有可能没有返回任何数据，所以res等都是undefined
                //this.searchTableDatas(); 
            }else if(isOk && params ){ // 成功更新， 需要对数据进行赋值
                let pkList=params['$pks']
                if(pkList && pkList.length==1){// 只更新了一条数据
                    let params2={...params}
                    delete params2.callback
                    delete params2['$pks']
                    Object.assign(row,params2)
                    if(params.callback){
                        params.callback(row)
                    }
                    if(!this.isDataBakNull && this.justPkIsMatch(row,this.dataBak)){
                        this.dataBak={...row}
                    }
                }else if(pkList && pkList.length>1){ // 更新了多条数据
                    let params2={...params} 
                    delete params2.callback
                    delete params2['$pks']
                    Object.assign(row,params2) 
                    if(params.callback){
                        params.callback(row)
                    }
                    if(!this.isDataBakNull && this.justPkIsMatch(row,this.dataBak)){
                        Object.assign(this.dataBak,params2)
                    }
                    this.sels?.forEach(k=>{
                        Object.assign(k,params2)
                    })
                }else{// 没有更新数据不处理

                }
            }
            this.$emit("fields-change",res,isOk,params,row)
            this.$emit('edit-fields',params)
        },
        //选择行
        selsChange: function (sels) { 
            this.sels = sels;
        }, 
        // 打开新增窗口
        showAdd(callback){
            this.addFormVisible=true // 兼容旧版

            // 新版 
            let form=this.$refs['formDlg']
            if(form){
                form.open({parentOpType:this.currOpType,subOpType:'add',formData:this.addForm||{},callback:callback})
            }
        },
        // 打开编辑界面
        showEdit(row,callback){
            if(row){ 
                this.editForm=row
                this.dataBak={...row}
            }
            this.editFormVisible=true //兼容旧版

            // 新版 
            let form=this.$refs['formDlg']
            if(form){
                form.open({parentOpType:this.currOpType,subOpType:'edit',formData:row,callback:callback})
            }
        },
        //打开查看界面
        showDetail(row,callback){
            if(row){ 
                this.editForm=row
                this.dataBak={...row}
            } 

            // 新版 
            let form=this.$refs['formDlg']
            if(form){
                form.open({parentOpType:this.currOpType,subOpType:'detail',formData:row,callback:callback})
            }
        },
        //删除
        handleDel: function (row,index,callback) { 
            
            this.$confirm('确认删除该记录吗?', '提示', {
                type: 'warning'
            }).then(() => { 
                var apiName="apis.del"
                if(!this.apiCheck(this.apis.del,apiName)){
                    return;
                }  
                this.load.del=true;
                this.load.batchDel=true;
                let params = {};
                this.getPkNames().forEach(k=>{
                    params[k]=row[k]
                })
                var func = this.apis.del;
                func(params).then((res) => {
                    this.load.del=false;
                    this.load.batchDel=false;
                    var tips=res.tips;
                    if(tips.isOk){ 
                        this.pageInfo.count=true;
                    }
                    this.$message({ message: tips.msg, type: tips.isOk?'success':'error' }); 
                    this.afterDelSubmit(res,tips.isOk,apiName)
                    if(callback){
                        callback(res)
                    }
                }).catch( err  => {
                    this.load.del=false  
                    this.load.batchDel=false;
                    this.afterDelSubmit(err,false,apiName)
                    }
                );
            });
        },
        //批量删除
        batchDel: function () {
            if(this.sels==null || this.sels.length==0){
                this.$message({ message: "未选择待删除数据", type: 'error' });
                return;
            }
            this.$confirm('确认删除选中记录吗？', '提示', {
                type: 'warning'
            }).then(() => { 
                var apiName="apis.batchDel"
                if(!this.apiCheck(this.apis.batchDel,apiName)){
                    return;
                }  
                this.load.batchDel=true;
                let params = this.getDelPks(this.sels);
                var func = this.apis.batchDel;
                func(params).then((res) => {
                    this.load.batchDel=false;
                    var tips=res.tips;
                    if( tips.isOk ){ 
                        this.pageInfo.count=true;
                    }
                    this.$message({ message: tips.msg, type: tips.isOk?'success':'error'});
                    this.afterDelSubmit(res,tips.isOk,apiName)
                }).catch( err  => {
                    this.load.batchDel=false 
                    this.afterDelSubmit(res,false,apiName);
                    } 
                );
            });
        },
        /**
         * 获取主键,填值到params中。 
         * @param {*} rows 
         * @returns 
         */
        setPks(rows,params){
            params.$pks=this.getPks(rows)
             
        },
        getPkNames(){
            var pkNames=this.pkNames&&this.pkNames.length>0?this.pkNames:['id']
            return pkNames;
        },
        
        /**
         * 获取主键列表
         * @param {} rows 
         * @returns 
         */
         getDelPks(rows){ 
            var pkNames=this.getPkNames(); 
            var pks=rows.map(k=>{
                var pk={}
                pkNames.forEach(name=>{
                    pk[name]=k[name]
                })
                return pk;
            }) 
            return pks 
        },
        /**
         * 获取主键列表
         * @param {} rows 
         * @returns 
         */
        getPks(rows){ 
            var pkNames=this.getPkNames();
            if(pkNames.length>1){
                var pks=rows.map(k=>{
                    var pk={}
                    pkNames.forEach(name=>{
                        pk[name]=k[name]
                    })
                    return pk;
                 }) 
                 return pks
            }else if(pkNames.length==1){
                var pks=rows.map(k=>{
                    var pk= k[pkNames[0]]
                    return pk;
                 }) 
                 return pks
            }
            return null;
        },

        /**
         * 判断两个对象的主键及值是否相等
         * @param {*} from
         * @param {*} to
         * @returns
         */
         justPkIsMatch(from,to){
            
            if(!from||!to){
                return false
            }
            var isMatch=true; 
            var pkNames=this.getPkNames()
            for(var i=0;i<pkNames.length;i++){
                
                let isNull=!from[pkNames[i]]||!to[pkNames[i]]
                isMatch=from[pkNames[i]]==to[pkNames[i]]
                if(isMatch && isNull){ 
                    return false;
                }
                if(isMatch==false){
                    return false; 
                }
            }

            return isMatch;
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
            
            params[fieldName]=$event
            return true;
        },
        editSomeFields(row,fieldName,$event){   
            if($event && $event.isTrusted){ 
                return;
            }
            var params={};
            var that=this;
            if(this.sels.length>0){
                if(!this.sels.some(k=>that.justPkIsMatch(k,row))){
                    this.$message({message:'请操作选中的行或者取消选中的行再操作其它行',type:'warning'})
                    return;
                }
                this.setPks(this.sels,params);
            }else{
                this.setPks([row],params)
            }
            if(!this.editSomeFieldsCheck(row,fieldName,$event,params)){
 
                return;
            }
            var apiName="apis.editSomeFields"
            if(!this.apiCheck(this.apis.editSomeFields,apiName)){
                return;
            }  

            this.load.editSomeFields=true; 
            var func = this.apis.editSomeFields; 
            var callback=params.callback
            if(callback){
                delete params.callback
            }
            func(params).then(res=>{
                this.load.editSomeFields=false; 
                var tips = res.tips;
                
                if(callback){
                    params.callback=callback
                } 
                if(tips.isOk){  
                    this.afterEditSomeFields(res,tips.isOk,params,row)
                    
                }else{ 
                    var isNull=this.isDataBakNull()
                    if(! isNull && this.justPkIsMatch(row,this.dataBak)){
                        Object.assign(row,this.dataBak)
                    }else{
                        this.searchTableDatas()
                    }
                } 
                this.$message({message:tips.msg,type:tips.isOk?'success':'error'})
                
            }).catch(err=>{
                this.load.editSomeFields=false;  
            });
        },
        rowClick: function(row, event, column){
            this.editForm=row
            this.dataBak=Object.assign({},row)
            this.$emit('row-click',row, event, column);//  @row-click="rowClick"
        },
        cellClick(row, column, cell, event){ 
            this.editForm=row
            this.dataBak={...row}
            this.$emit('cell-click',row,column,cell,event)
        },
        selectConfirm:function(row){
            this.$emit('select',row) 
            this.$emit('change',row)
            this.$emit('change2',row)
        },
        selectListConfirm:function(){
            this.$emit('select',this.sels)
            this.$emit('change',this.sels)
            this.$emit('change2',this.sels)
        },
        onCheckedColumnsChange(checkedColumns){  
            this.checkedColumns=checkedColumns

        },
        getRefId(){
            if(this.refId){
                return this.refId
            }else{
                this.refId=util.createSeqNo('auto_ref_')
                return this.refId;
            }
        },
        /**
         * 检查按钮是否具有权限
         * btnId 按钮编号 来源于menu_def.id 按钮
         * menuDefId: 来源于menu_def.id 菜单
         */
        checkBtnQx(btnId,menuDefId){
            if(!menuDefId){
                if(this.menuDefId){
                    menuDefId=this.menuDefId
                }else{
                    return true;
                }
            }
            return this.$mdp.checkBtnQx(btnId,menuDefId)
        },
        /**
         * 判断当前列是否应该显示
         * @param {*} property 
         * @returns 
         */
        showCol(property){ 
            
            if(!this.checkedColumns || this.checkedColumns.length==0){
                return true;
            }
            return this.checkedColumns.some(k=>k==property)
        },
        /**
         * 监听高级查询参数编号
         */
         onHiQueryParamsChange(hiQueryParams){
            this.hiQueryParams=hiQueryParams
            this.searchTableDatas();
         },
         export2Word(){
            import("@/components/mdp-ui/js/Export2Word").then(word => {
                var fileName=(this.menuDefName?this.menuDefName:this.getRefId())+"_"+util.formatDate(new Date(),'yyyyMMddHHmmss');
                word.exportWord('/tpl/tpl_mdp_menu.docx',{tableDatas:this.tableDatas},fieldName,10000)
            })
         },
         html2Word(htmlBody,fileName){
            import("@/components/mdp-ui/js/Export2Word").then(word => {
                var fileName1=(this.menuDefName?this.menuDefName:this.getRefId())+"_"+util.formatDate(new Date(),'yyyyMMddHHmmss');
                word.html2Word(htmlBody,fileName||fileName1)
            })
         },
        export2Excel(){
            var cols= this.columnConfigs.filter(k=>k.property)
            if(cols.length<=0){
                return;
            }
            import("@/vendor/Export2Excel").then(excel => {
                const tHeader = cols.map(c=>c.label); 
                const list = this.tableDatas;
                this.formatJson(cols, list).then(data=>{
                    var fieldName=(this.menuDefName?this.menuDefName:this.getRefId())+"_"+util.formatDate(new Date(),'yyyyMMddHHmmss');
                    excel.export_json_to_excel({
                      header: tHeader,
                      data,
                      filename: fieldName,
                      autoWidth: true,
                      bookType: "xlsx"
                    });
                }); 
               
              });
         },
         async formatJson(cols, jsonData) {
            
            // 准备字典数据
            const map= await this.getDictMap(cols.filter(k=>k.itemCode).map(k=>k.itemCode))
            
            return jsonData.map(v =>
                cols.map(c => { 
                    if(c.itemCode){
                        let kv=map.get(c.itemCode)
                        if(kv){
                            let v2=kv.get(v[c.property])
                            if(!v2){
                                return v[c.property]
                            }else{
                                return v[c.property]+'-'+v2
                            }
                        }else{
                            return v[c.property]
                        }
                    }else{
                        return v[c.property]; 
                    } 
                })
            );
        },
        /**
         * 
         * @param {*} itemCodes 字典列表,如['itemCode1','itemCode2']
         */
      async getDictMap(itemCodes){
            const itemCodeSet=new Set(Array.from(itemCodes))
            const map=new Map() 
            for(const v of itemCodeSet){
                let res= await this.$mdp.getDictOptions(v,{categoryId:'all'}) 
                var kv=new Map()
                res.forEach(i=>{
                    kv.set(i.id,i.name)
                })
                map.set(v,kv)
            }
             
            return map;
        },
        /**
         * 判断字段等是否禁用
         * true 禁用 false 不禁用
         */ 
         disFieldCalc(){  
           if(/add|edit|mng/i.test(this.currOpType)){
            return false
           }else{
            return true
           }
            
        },
        /**
         * 判断按钮等是否可编辑
         * @param {*} key 
         */ 
         disBtn(key){  
            if(key in this.disBtnRules){
                return this.disBtnRules[key]
            }else{
                return false;
            }
            
        }, 
            
         /**
          * 拷贝一条除了主键不一样，其它都一样的数据,如果存在多个主键，只需要更改第一个主键数据即可
          * @param {*} row 
          */
         copy(row){ 
            var params=Object.assign({},row)
             var pkNames=this.getPkNames();
            var firstPkName=pkNames[0] 
            params[firstPkName]=row[firstPkName]+"_1"
            var func=this.apis.add
            func(params).then(res=>{
                var tips = res.tips
                if(tips.isOk){
                    this.searchTableDatas(); 
                    this.$message.success(tips.msg)
                }else{
                    this.$message.error(tips.msg)
                }
            })
         },
         /**
          * 升级版，拷贝一条除了主键不一样，其它都一样的数据,如果存在多个主键，只需要更改第一个主键数据即可，主键置空，让服务器自动创建新的主键
          * @param {*} row 
          */
          copy2(row){ 
            var params=Object.assign({},row)
             var pkNames=this.getPkNames();
            var firstPkName=pkNames[0] 
            params[firstPkName]=null 
            var func=this.apis.add
            func(params).then(res=>{
                var tips = res.tips
                if(tips.isOk){
                    this.searchTableDatas(); 
                    this.$message.success(tips.msg)
                }else{
                    this.$message.error(tips.msg)
                }
            })
         },
         isDataBakNull(){
            if(!this.dataBak){
                return true
            }else if(Array.isArray(this.dataBak)){
                return this.dataBak.length===0
                 
            }else {
                return Object.keys(this.dataBak).length === 0
            }
         }
        /**end 自定义函数请在上面加**/
     },
}