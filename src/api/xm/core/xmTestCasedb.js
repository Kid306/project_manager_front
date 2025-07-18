import axios from '@/config/maxios'


import config from '@/api/mdp_pub/mdp_config'

let base = config.getXmCtx();

/**-------------------------与后端通讯接口------------------请写在下面-------------------------------------------- */
/**
 * 测试用例库
 *1    默认只开放普通查询，所有查询，只要上传	 分页参数 {pageNum:当前页码从1开始,pageSize:每页记录数,total:总记录【数如果是0后台会自动计算总记录数非0不会自动计算】}，后台都会自动按分页查询 其它 api用到再打开，没用到的api请注释掉，
 *2 查询、新增、修改的参数格式  params={id:'主键 主键',name:'用例库名称',cuserid:'创建人',cusername:'创建人姓名',ctime:'创建日期',cbranchId:'归属机构编号',productId:'产品编号',productName:'产品名称'}
 **/
 
//普通查询 条件之间and关系  
export const listXmTestCasedb = params => { return axios.get(`${base}/xm/core/xmTestCasedb/list`, { params: params }); };

//删除一条测试用例库 params={id:'主键 主键'}
export const delXmTestCasedb = params => { return axios.post(`${base}/xm/core/xmTestCasedb/del`,params); };

//批量删除测试用例库  params=[{id:'主键 主键'}]
export const batchDelXmTestCasedb = params => { return axios.post(`${base}/xm/core/xmTestCasedb/batchDel`, params); };

//修改一条测试用例库记录
export const editXmTestCasedb = params => { return axios.post(`${base}/xm/core/xmTestCasedb/edit`, params); };

//新增一条测试用例库
export const addXmTestCasedb = params => { return axios.post(`${base}/xm/core/xmTestCasedb/add`, params); };

//批量修改某些字段
export const editSomeFieldsXmTestCasedb = params => { return axios.post(`${base}/xm/core/xmTestCasedb/editSomeFields`, params); };

