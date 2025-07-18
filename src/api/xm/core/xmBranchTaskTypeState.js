import axios from '@/config/maxios'

import config from '@/api/mdp_pub/mdp_config'

let base = config.getXmCtx();


/**
 * 按机构编号任务类型汇总
 *1    默认只开放普通查询，所有查询，只要上传	 分页参数 {currentPage:当前页码从1开始,pageSize:每页记录数,total:总记录【数如果是0后台会自动计算总记录数非0不会自动计算】}，后台都会自动按分页查询 其它 api用到再打开，没用到的api请注释掉，
 *2 查询、新增、修改的参数格式  params={id:'主键 主键',taskType:'任务类型',planWorkload:'工作量',planAmount:'预算金额',actWorkload:'实际完成工作量',actAmount:'实际完成金额',branchId:'机构编号',bizDate:'业务日期yyyy-MM-dd型',calcTime:'计算日期',planOuserAt:'外购资金预算',planIuserAt:'内购资金预算',actOuserAt:'实际外购成本',actIuserAt:'实际内购成本',planOuserWorkload:'计划外购工作量',planIuserWorkload:'计划内购工作量',actOuserWorkload:'实际外购工作量',actIuserWorkload:'实际内购工作量',planNouserAt:'计划非人力成本',actNouserAt:'实际非人力成本',branchName:'机构名称'}
 **/
 
//普通查询 条件之间and关系  
export const listXmBranchTaskTypeState = params => { return axios.get(`${base}/xm/core/xmBranchTaskTypeState/list`, { params: params }); };

//模糊查询按机构编号任务类型汇总 条件之间or关系  
//export const listXmBranchTaskTypeStateKey = params => { return axios.get(`${base}/xm/core/xmBranchTaskTypeState/listKey`, { params: params }); };

//删除一条按机构编号任务类型汇总 params={id:'主键 主键'}
export const delXmBranchTaskTypeState = params => { return axios.post(`${base}/xm/core/xmBranchTaskTypeState/del`,params); };

//批量删除按机构编号任务类型汇总  params=[{id:'主键 主键'}]
export const batchDelXmBranchTaskTypeState = params => { return axios.post(`${base}/xm/core/xmBranchTaskTypeState/batchDel`, params); };

//修改一条按机构编号任务类型汇总记录
export const editXmBranchTaskTypeState = params => { return axios.post(`${base}/xm/core/xmBranchTaskTypeState/edit`, params); };

//新增一条按机构编号任务类型汇总
export const addXmBranchTaskTypeState = params => { return axios.post(`${base}/xm/core/xmBranchTaskTypeState/add`, params); };