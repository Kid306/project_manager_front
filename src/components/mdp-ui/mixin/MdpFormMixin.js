import util from "../js/util"  

export const MdpFormMixin = {

    computed: { 
        pageVisible:{
            set(val){
                this.$emit('update:visible',val)
                this.$emit(val?'open':'close',val)
                if(val==false){
                    this.$emit('cancel',this.currOpType); //兼容旧版，以后不需要这个事件了，改成 @close
                }
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

            load:{ list: false, edit: false, del: false, add: false,batchAdd:false,batchDel:false,batchEdit:false,editSomeFields:false },//查询中...

            pkNames:[/** branchId1,branchId2 */],//表格主键的java属性名称，驼峰命名，默认为id,
            dataBak:{},//数据被修改前进行备份
            _dataInit:null,
            menuDefId:'',//menu_def.id 菜单表菜单编号，用于菜单权限判断，按钮权限判断
            editForm:{},//编辑页面数据
            //增删改查(含批量)接口
            apis:{
                add:null,
                edit:null,
                editSomeFields:null,
                queryById:null,
            },
            defaultDisBtnRules:{
                addBtn:false,
                delBtn:false,
                detailBtn:false,
                searchBtn:false,
                exportBtn:false,
                importBtn:false,
                printBtn:false,
            },//判断是否可编辑
            custDisBtnRules:{//初始化时会将defaultDisabledRules覆盖进 disabledRules

            },
            /**
             * 当前页面的currOpType,操作类型 list -列表，detail-明细，add-新增，edit-修改，mng-综合管理
             */   
            currOpType: 'add'
         }
     },
     watch:{ 
        pageVisible(val){   
            if(val==true){
                this.onOpen()
            }else{ 
                this.onClose()
            }
        },
        currOpType(val){
            
            this.defaultDisBtnRulesInit(this.currOpType)
            this.disBtnRulesInit(val)
        }
     },
     props: {
        /**
         * 上级页面的currOpType，用于多级权限判断，参考currOpType
         */
        parentOpType:{//
            type:String,
            default:null
        },
        subOpType:{
            type: String,
            default: null,
        },
        /**
         * 控制页面是否进行显示，用于弹框时
         */
        visible:{
            type:Boolean,
            default:false
        },
        /**
         * 表单数据
         */
        formData:{
            type: Object,
            default:function(){
                return null;
            },
        },
        /**
         * 是否显示按钮烂
         */
        showBtn:{
            type:Boolean,
            default:true
        },
        /**
         * 自定义表单编号，用于加载表单配置信息,建议用表名进行编码
         */
        expandId:{
            type:String,
            default:null,
        },
        /**
         * 用于存储自定义表单的数据的字段名称，驼峰命名，后台自动转为下横线
         */
        expandFieldName:{
            type:String,
            default:'extInfos'
        },
        /**
         * 是否显示 自定义表单信息
         */
        showExpand:{
            type:Boolean,
            default:false
        },
        columnConfigs:{
            type:Array,
            default:function(){
                return null
            }
        },
        labelPosition:{
            type: String,
            default:'left'
        },
        labelWidth:{
            type: String,
            default:null
        },
        someOpen:{
            type: Boolean,
            default: true,
        }

     },
     methods: {
        /**
         * 页面打开时
         */
        onOpen(){
            
            this.$nextTick(()=>{
                var form=this.$refs['editFormRef'];
                if(!form){
                    form=this.$refs['editForm'];
                }
                if(form){
                    form.resetFields();
                }
                if(this._dataInit){
                    this.editForm={...this._dataInit}
                }
                this.initData()
            })
        },
        open(){
            this.pageVisible=true;
        },
        close(){
            this.pageVisible=false;
        },
        /**
         * 页面关闭时
         */
        onClose(){
            
            var form=this.$refs['editFormRef'];
            if(!form){
                form=this.$refs['editForm'];
            }
            if(form){
                form.resetFields();
            }

        },
         //由组件扩展添加其它的初始页面的逻辑(mounted+onOpen都会调用此函数，建议只添加公共逻辑)
         initCurrData(){ 
         },
        /**
         * 检查参数是否满足调用后台接口的条件
         * @returns true / false
         */
        preParamCheck(params){
            return true;
        }, 
        initData(){  
            if(this.subOpType){
                this.currOpType=this.subOpType
            }
            if(this.formData){
                Object.assign(this.editForm,this.formData)
            }
            this.defaultDisBtnRulesInit(this.currOpType)
            this.disBtnRulesInit(this.custDisBtnRules)
            this.$nextTick(()=>{ 
                this.initCurrData();
                this.dataBak=Object.assign({},this.editForm)
            })
         },
        /**
         * 取消按钮点击 父组件监听@cance" 监听，逐渐作废，改成close ，父组件监听@close
         *  */
        handleCancel:function(){ 
            this.pageVisible=false;
            this.$emit('cancel',true)
            this.$emit('close',true)
        },
        apiCheck(func,apiName){
            if(!func){
                this.$message({ message: apiName+"为空", type: 'error' });
                return false;
            }

            return true;
        },
        stringOfExpand(params,expandFieldName){
            if(params && params[expandFieldName] && params[expandFieldName] instanceof Object){
                params[expandFieldName]=JSON.stringify(params[expandFieldName])
            }
        },

        //新增、编辑提交@submit="afterFormSubmit"
        saveSubmit: function () {
            
            var form=this.$refs['editFormRef'];
            if(!form){
                form=this.$refs['editForm'];
            }
            form.validate((valid) => {
                if (valid) {
                    this.$confirm('确认提交吗？', '提示', {}).then(() => {
                        this.load.edit=true
                        let params = Object.assign({}, this.editForm);
                        this.stringOfExpand(params,this.expandFieldName)
                        if(!this.preParamCheck(params)){
                            this.load.edit=false
                            return;
                        }
                        
                        var func=this.apis.add
                        if(this.currOpType=='edit'){
                            func=this.apis.edit
                        }
                        func(params).then((res) => {
                            this.load.edit=false
                            var tips=res.tips;
                            if(tips.isOk){
                                this.afterSubmit(res,tips.isOk,this.currOpType);
                            }else{
                                if(this.currOpType=='edit'){
                                    if(!this.isDataBakNull() && this.justPkIsMatch(this.editForm,this.dataBak)){
                                        Object.assign(this.editForm,this.dataBak)
                                    } 
                                }
                            }
                            this.$message({  message: tips.msg, type: tips.isOk?'success':'error' });
                        }).catch( err =>this.load.edit=false);
                    });
                }else{
                    this.$message({ showClose:true, message: "表单验证不通过，请修改表单数据再提交", type: 'error' });
                }
            });
        },
        /**
         * 将一个对象的主键赋值给参数
         * @param {*} row
         * @param {*} params
         */
        setPk(row,params){
            var pkNames=this.pkNames&&this.pkNames.length>0?this.pkNames:['id']
            pkNames.forEach(k=>params[k]=row[k])
        },

        /**
         * 批量接口【editSomeFields用到】获取主键,填值到params中。
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
        editSomeFieldQxCheck(){
            if(this.currOpType=='add' || this.currOpType=='subAdd' || this.currOpType=='detail'){
                return false;
            }else{

                return true;
            }
        },
        /**
         * 对修改的字段进行判断，返回false ,将取消更新数据库,由组件扩展
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
            var sels=[row]
            if(!this.editSomeFieldsCheck(row,fieldName,$event,params)){
                return;
            }
            if(!this.editSomeFieldQxCheck()){
                return;
            }
            this.setPks(sels,params);
            var apiName="apis.editSomeFields"
            if(!this.apiCheck(this.apis.editSomeFields,apiName)){
                return;
            }
            this.load.editSomeFields=true;
            var func = this.apis.editSomeFields;
             
            var form=this.$refs[this.refId+'Form']; 
            if(!form){
                form=this.$refs['editFormRef'];
            } 
            if(!form){
                form=this.$refs['editForm'];
            }
            if(!form){
                //this.$message({ message: "未找到ref命名为['"+this.refId+'Form'+"','editFormRef','editForm']的任何一个表单", type: 'error' }); 
                return
            }
            form.validateField([fieldName],(valid) => {
                if (valid) {
                    func(params).then(res=>{
                        var tips = res.tips;
                        if(tips.isOk){
                            Object.assign(row,params) 
                            that.editSomeFieldsEmit(res,tips.isOk,params,row)
                            that.afterEditSomeFields(res,tips.isOk,params,row)
                            that.dataBak=Object.assign({},this.editForm)
                        }else{
                            if(!this.isDataBakNull() && this.justPkIsMatch(row,this.dataBak)){
                                Object.assign(row,this.dataBak)
                            }
                            
                            that.afterEditSomeFields(res,tips.isOk,params,row)
                        }

                        that.$message({message:tips.msg,type:tips.isOk?'success':'error'})
                    }).catch(err=>{
                        this.load.editSomeFields=false;
                    });
                }else{
                    this.$message({ message: "表单验证不通过，请修改表单数据再提交.", type: 'error' });
                }
            });

        },
        afterSubmit(res,isOk,currOpType){
            if(isOk && /add/i.test(currOpType)){
                var tips=res.tips
                this.currOpType='edit'
                if(res.data){
                    this.editForm=Object.assign(this.editForm,res.data) 
                }
            }
            if(isOk){
                
                this.pageVisible=false
                this.dataBak={...this.editForm}
                this.$emit("submit",res,isOk,currOpType) 
                if(/add/i.test(currOpType)){
                    this.$emit("add-submit",this.editForm) 
                }else if(/edit/i.test(currOpType)){ 
                    this.$emit("edit-submit",this.editForm) 
                }
                
                
            }

        },
        
        editSomeFieldsEmit(res,isOk,params,row){
            if(isOk){
                this.$emit("fields-change",res,isOk,params,row)  
                this.$emit("edit-fields", params);
            }

        },
        afterEditSomeFields(res,isOk,params,row){
 

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
            return this.$mdp.checkBtnQx(tnId,menuDefId)
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
         * 判断字段等是否禁用
         * true 禁用 false 不禁用
         */ 
         disFieldCalc:function(){  
           if(/add|edit|mng/i.test(this.currOpType)){
            return false
           }else{
            return true
           }
            
        }, 
        /**
         * 设置某个关键词、按钮、输入框禁用 custBtnRules['addBtn']=false
         * 判断某个对象是否可编辑 this.disBtn('addBtn')==false
         */
        disBtnRulesInit(custBtnRules){

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
     mounted(){
        
        if(this.editForm){
            this._dataInit={...this.editForm}
        } 
        this.initData(); 
     }
}
