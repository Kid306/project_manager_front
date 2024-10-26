/**
 * mdp框架前端与后端交互扩展组件使用到的公共api 
 * 一般情况下请勿将业务代码加入此文件，业务代码及其它模块及api应该放入各自单独的api文件中，如果实在要添加，请添加到$mdp.js文件中，实现全局调用
 */

import util from '@/components/mdp-ui/js/util';//全局公共库
import axios from '@/config/maxios'
import config from './mdp_config' 
import { getAccessToken } from '@/utils/auth'

const mdpExtCache=new Map();

let sysBase = config.getSysCtx();

let arcBase = config.getArcCtx() 

let formBase = config.getFormCtx() 

let workflowBase = config.getWfCtx() 

var funcs = {


/**
 * sys_user 用户表
 *1  默认只开放普通查询，所有查询，只要上传	 分页参数 {pageNum:当前页码从1开始,pageSize:每页记录数,total:总记录【数如果是0后台会自动计算总记录数非0不会自动计算】}，后台都会自动按分页查询 其它 api用到再打开，没用到的api请注释掉，
  *2 查询、新增、修改的参数格式  params={userid:'内部用户编号(账户编号)，如果是机构管理员账户，则=机构号 主键',unionid:'全局唯一编号，也叫主账户，同一个人（比如同一个微信号，同一个邮箱，同一个手机号视为同一个人）。同一个人在mdp有唯一的主账号。',displayUserid:'登录展示使用用户编号',locked:'是否被锁定0否1是',startdate:'启用日期',nickname:'昵称',username:'用户名称',phoneno:'移动电话号码',password:'密码',salt:'盐值',pwdtype:'密码类型1指纹2密码',headimgurl:'头像地址',country:'国家',city:'城市',province:'省份',address:'详细地址',sex:'性别',enddate:'到期日期',districtId:'区县编号',email:'邮箱',fgOne:'指纹1',fgTwo:'指纹2',fgThr:'指纹3',idCardNo:'身份证号码',officePhoneno:'办公室电话',bizProcInstId:'当前流程实例编号',bizFlowState:'当前流程状态',memType:'从平台角度看会员类型0-个人账户、1-企业管理员账户、2-企业员工账户，个人账户无须绑定机构号，个人子账户可升级为企业员工账户，企业账户必须绑定机构编号branchId个人账户升级后，保留个人主账户，个人子账户绑定企业编号成为企业员工账户',orgId:'机构会员自己的机构会员的机构号，理解为客户的客户',emailBak:'备用邮箱',pwdStrong:'1-高风险，2-中风险，3-低风险',lockType:'锁定类型:0-注册等待邮箱验证，1-注册等待修改初始密码，2-注册等待验证手机号码，3-密码高风险，等待重新修改密码，9-业务需要锁定禁止登录，10-账户被锁定，请联系客服',lockRemark:'锁定原因',ltime:'更新日期',atype:'相对于平台来说的账户类型0-子账户，1-主账户。',branchId:'机构主子账户归属的机构编号,如果是个人，这里填虚拟机构编号，作为虚拟的机构号，方便将来升级成企业号',continent:'洲别',cpaType:'从入驻企业角度看协作类型0-企业内部人员，1-客户，2-供应商，3-上级机构，4-下属机构',cpaOrg:'协作组织0-个人，1机构，如果是机构，机构号填入orgId',roleids:'个人账户拥有的角色，逗号分割',birthday:'生日',shopId:'商户编号',profeId:'职业编号',profeName:'职业名称',gradeId:'等级会员，根据经验值而定',gradeName:'等级会员名称',ilvlId:'权益等级青铜、白银、黄金、紫金、钻石',ilvlName:'权益等级名称',istatus:'会员权益状态0-无效，1-有效，2-过期',istime:'权益开始时间',ietime:'权益结束时间',validLvls:'人工验证结果，当审核状态为2时，同步到sys_user表同一个字段，或者sys_branch同一个字段',features:'个性化签名',profeType:'职业类型1-开发类，2-测试类，3-设计类，4-管理类；',ustatus:'用户账户状态0-初始，1-起效，2-注销申请，3-注销后删除',creditId:'信用等级编号',creditScore:'信用等级分数',guardId:'服务保障等级0-初始，1-金，2-银，3-铜',open:'是否对互联网用户开放查询0-否1是',remark:'简介备注',bizHours:'营业时间说明09:00-12:00',skillIds:'技能编号列表',skillNames:'技能名称列表'}
  **/ 
listUser: params => { return axios.get(`/${sysBase}/mdp/sys/user/list`, { params: params }); },


//查询一个用户
queryUserById : params => { return axios.get(`${sysBase}/mdp/sys/user/detail`, { params: params });},

//查询当前登录人的基础信息
getMyUserBaseInfo : params => { return axios.get(`${sysBase}/mdp/sys/user/getMyUserBaseInfo`, { params: params });},

//修改用户信息
editUser : params => { return axios.post(`${sysBase}/mdp/sys/user/edit`, params);}, 

//批量修改用户的某些字段
editSomeFieldsUser : params => { return axios.post(`${sysBase}/mdp/sys/user/editSomeFields`, params);},

//管理人员帮别人重置密码
resetPasswordByAdmin : params => { return axios.post(`${sysBase}/mdp/sys/user/resetPassword`, params);},

//修改自己的密码
changePassword : params => { return axios.post(`${sysBase}/mdp/sys/user/changePassword`, params);},


//更新当前登录着的头像
editHeadimgurl : params => { return axios.post(`${sysBase}/mdp/sys/user/editHeadimgurl`, params); },

//查询机构列表 
listBranch : params => { return axios.get(`${sysBase}/mdp/sys/branch/list`, { params: params }); },

/**
* sys_dept
*1    默认只开放普通查询，所有查询，只要上传	 分页参数 {pageNum:当前页码从1开始,pageSize:每页记录数,total:总记录【数如果是0后台会自动计算总记录数非0不会自动计算】}，后台都会自动按分页查询 其它 api用到再打开，没用到的api请注释掉，
*2 查询、新增、修改的参数格式  params={deptid:'部门编号 主键',deptName:'部门全称',pdeptid:'上级部门编号',deptType:'参考数据字典deptType',state:'状态A正常E无效',manager:'负责人编号',leader:'上级领导编号',shortName:'简称',displayDeptid:'部门编码外部使用',orgType:'参考数据字典orgType',managerName:'负责人名称',leaderName:'上级领导名称',branchId:'云用户机构编号',levelType:'层级类型(科云：0国,1省,2市,3区县,4街道,5自然村)',idPath:'部门编号路径',bizProcInstId:'当前流程实例编号',bizFlowState:'当前流程状态',ltime:'最后更新时间',isCbCenter:'是否为成本中心0否1是'}
**/ 
listDept: params => { return axios.get(`/${sysBase}/mdp/sys/dept/list`, { params: params }); },

addDept: params => { return axios.post(`/${sysBase}/mdp/sys/dept/add`,  params ); },
editDept: params => { return axios.post(`/${sysBase}/mdp/sys/dept/edit`,  params ); },
delDept: params => { return axios.post(`/${sysBase}/mdp/sys/dept/del`,  params ); },
editSomeFieldsDept: params => { return axios.post(`/${sysBase}/mdp/sys/dept/editSomeFields`,  params ); },
batchDelDept: params => { return axios.post(`/${sysBase}/mdp/sys/dept/batchDel`,  params ); },

batchChangeDeptParent: params => { return axios.post(`/${sysBase}/mdp/sys/dept/batchChangeParent`,  params ); },


/**
 * 角色列表
 * @param {*} params 
 * @returns 
 */
listRole: params => { return axios.get(`/${sysBase}/mdp/sys/role/list`, { params: params }); },

/**
 * 岗位列表
 * @param {*} params 
 * @returns 
 */
 listPost: params => { return axios.get(`/${sysBase}/mdp/sys/post/list`, { params: params }); },


  // start - mdp meta 元数据管理 相关api

  /**
   * 数据项定义
   *查询、新增、修改的参数格式  params={id:'主键 主键',itemCode:'代码，小写,下横线分割，请不要用驼峰命名',itemName:'名称',remark:'备注',categoryId:'分类编号',itemSize:'长度',itemType:'类型',branchId:'机构编号',deptid:'部门编号',cmenu:'是否创建菜单',values:'默认值,如果是列表，则存储列表编号，多个逗号分割',names:'默认名称，如果是列表，则存储列表名称，多个则逗号分割',options:'item_type=4,5时的选项列表[{value:值,name:显示名称}]',inputFormat:'输入提示',required:'是否必须0否1是',seq:'排序顺序',table:'表名',show:'是否显示0否1是',qx:'权限，是否可以0-新增，1-删除，2-编辑，3-查询，多个以逗号分割'}
  **/
 
//普通查询 条件之间and关系  
listItem : params => { return axios.get(`/${sysBase}/mdp/meta/item/list`, { params: params }); },


//删除一条数据项定义 params={id:'主键 主键'}
delItem : params => { return axios.post(`/${sysBase}/mdp/meta/item/del`,params); },

//批量删除数据项定义  params=[{id:'主键 主键'}]
batchDelItem : params => { return axios.post(`/${sysBase}/mdp/meta/item/batchDel`, params); },

//修改一条数据项定义记录
editItem : params => { return axios.post(`/${sysBase}/mdp/meta/item/edit`, params); },

//新增一条数据项定义
addItem : params => { return axios.post(`/${sysBase}/mdp/meta/item/add`, params); },


/**
 * 数据项取值列表
 *查询、新增、修改的参数格式  params={id:'主键 主键',itemId:'数据项编号',optionValue:'选项值',optionName:'选项名称',keys:'快捷键',isShow:'是否显示',seqOrder:'顺序',fp:'第一扩展字段',tp:'第三扩展字段',sp:'第二扩展字段',isDefault:'是否默认',cdate:'创建日期',branchId:'机构编号',deptid:'部门编号'}
 **/
 
//普通查询 条件之间and关系  
listItemOption : params => { return axios.get(`/${sysBase}/mdp/meta/itemOption/list`, { params: params }); }, 

//删除一条数据项取值列表 params={id:'主键 主键'}
delItemOption : params => { return axios.post(`/${sysBase}/mdp/meta/itemOption/del`,params); },

//批量删除数据项取值列表  params=[{id:'主键 主键'}]
batchDelItemOption : params => { return axios.post(`/${sysBase}/mdp/meta/itemOption/batchDel`, params); },

//修改一条数据项取值列表记录
editItemOption : params => { return axios.post(`/${sysBase}/mdp/meta/itemOption/edit`, params); },

//新增一条数据项取值列表
addItemOption : params => { return axios.post(`/${sysBase}/mdp/meta/itemOption/add`, params); },

//普通查询 条件之间and关系
queryItemOptionById : params => { return axios.get(`/${sysBase}/mdp/meta/itemOption/queryById`, { params: params }); },

//批量修改某些字段
editSomeFieldsItemOption : params => { return axios.post(`/${sysBase}/mdp/meta/itemOption/editSomeFields`, params); }, 

//刷新缓存
refresh : params => { return axios.post(`/${sysBase}/mdp/meta/itemOption/refresh`, params); },

  // end - mdp meta 元数据管理 相关api

  // start form 智能表单 相关api

  listFormDef : params => { return axios.get(`${formBase}/mdp/form/formDef/list`, { params: params }); },
  getFormDefById : params => { return axios.get(`${formBase}/mdp/form/formDef/queryById`, { params: params }); },

  

  addFormDef : params => { return axios.post(`${formBase}/mdp/form/formDef/add`,params);},
  editFormDef : params => { return axios.post(`${formBase}/mdp/form/formDef/edit`,params);},

listFormDefCacheFirst : params => { 
  var baseCode='list-form-fields'
  var codeKey=util.getCodeKey(baseCode,params); 
   return new Promise((resolve,reject)=>{
    var data=funcs.listFormDefFromCache(codeKey,baseCode,params) 
    if(data){
      var res2={
        tips:{
          isOk:true,
          tipscode:'ok',
          msg:'成功'
        },
        data:data
      }
      resolve({data:res2})  
    }else{
      
      var lockKey=codeKey+'@lock'
      var lock=sessionStorage.getItem(lockKey)
       let func = function(){ 
        var data=funcs.listFormDefFromCache(codeKey,baseCode,params) 
        if(data){
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
        }  
        funcs.listFormDef(params).then(res=>{ 
            sessionStorage.removeItem(lockKey)
            if(res.tips && res.tips.isOk ){
              sessionStorage.setItem(codeKey,JSON.stringify(res.data))
              var res2={
                tips:res.tips,
                data:res.data
              }
              mdpExtCache.set(codeKey,res2)
              resolve(res2) 
              
            }else{
              mdpExtCache.set(codeKey,null)
              reject(res) 
            }
          }).catch(e=>{
            mdpExtCache.set(codeKey,null)
            sessionStorage.removeItem(lockKey)
            reject(e)  
          }) 
      }
      if(lock){
        setTimeout(()=>{
          func();
        },2000)
      }else{
        func();
      }
      
    } 
  })  
},
  /**
 * 从缓存中获取字典列表，该函数不会向后端请求
 * */
   listFormDefFromCache : (codeKey) => {
    var item=mdpExtCache.get(codeKey)
    if(item && item.formDef && item.formDef.id){
      return item
    }
    var clistStr=sessionStorage.getItem(codeKey);
    if (clistStr&& clistStr!='null' && clistStr!='undefined') {
      let item = JSON.parse(clistStr)
      return item;
    }else{
      return null;
    }
}, 

removeFormFieldsCache:(formId)=>{
  var baseCode='list-form-fields'
  var params={formId:formId}
  var codeKey=util.getCodeKey(baseCode,params); 
  mdpExtCache.set(codeKey,null)
  sessionStorage.removeItem(codeKey)

},

goToFormDesign: formDefId => {
  var url= util.getUri(window.location.protocol + '//' + window.location.host, workflowBase+'/' + import.meta.env.VITE_UI_VERSION ,"/#/", '/mdp/form/design/'+formDefId)
   util.openWin(url)
},
  // end form

  /**
 * 微信邀请用户加入公司需要state参数，防止crfs攻击
 * @returns 
 */
 getInviteTpaState: () => {  
    return axios({
      url: '/tpa/invite/wechat/wxpub/state',
      method: 'post', 
      data:{}
    })
  },

  /**
 * 微信绑定用户加入公司需要state参数，防止crfs攻击
 * @param {joinUserid:'需要绑定微信的用户编号',joinUsername:'用户名称',sendUserid:'发起邀请人编号',sendUsername:'发起邀请人姓名'}
 * @returns 
 */
   getBindTpaState: (params) => {  
    return axios({
      url: '/tpa/bind/wechat/wxpub/state',
      method: 'post', 
      data:params
    })
  },
}

export default funcs


