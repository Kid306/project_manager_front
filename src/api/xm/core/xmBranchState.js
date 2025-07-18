import axios from '@/config/maxios'

import config from '@/api/mdp_pub/mdp_config'

let base = config.getXmCtx();


/**
 * 机构内所有项目指标汇总
 *1    默认只开放普通查询，所有查询，只要上传	 分页参数 {currentPage:当前页码从1开始,pageSize:每页记录数,total:总记录【数如果是0后台会自动计算总记录数非0不会自动计算】}，后台都会自动按分页查询 其它 api用到再打开，没用到的api请注释掉，
 *2 查询、新增、修改的参数格式  params={branchId:'机构编号 主键',bizDate:'统计日期yyyy-mm-dd类型',totalFileCnt:'文件数据',totalBugCnt:'bug数目',totalTaskCnt:'任务数',totalBudgetNouserAmount:'项目总非人力预算-来自项目表',totalStaffCnt:'总参与人数',calcTime:'统计执行日期',calcStatus:'0-暂时的1稳定的，暂时的可以被覆盖，稳定的不允许覆盖',totalCostNouserAmount:'项目总非人力成本',totalClosedBugCnt:'已关闭bug总数',totalResolvedBugCnt:'已解决bug总数',totalCompleteTaskCnt:'已完成任务总数-来自任务表',totalPhaseCnt:'项目阶段计划数',totalCompletePhaseCnt:'项目阶段计划已完成数',totalNeedPayAmount:'待付款总金额',totalFinishPayAmount:'已付款总金额',totalNeedColAmount:'待收款总金额',totalFinishColAmount:'已收款总金额',totalCostUserAmount:'项目总人力成本',totalBudgetIuserAmount:'项目总内部人力预算-来自项目表',totalPlanWorkload:'项目总预算工作量-来自项目表',totalRiskCnt:'项目风险总数',totalCompleteRiskCnt:'已完成风险总数',branchName:'机构名称',totalBudgetOuserAmount:'项目总外购人力预算-来自项目表',totalCompleteWorkload:'已完成工作量-来自计划中实际完成工作量',totalCostIuserAmount:'项目总内部人力成本金额',totalCostOuserAmount:'项目总外购人力成本金额',totalProgress:'项目进度0~100之间，来自任务表',totalActiveBugCnt:'激活的bug总数',totalConfirmedBugCnt:'已解决bug总数',projectStatus:'项目状态，0-初始，1-立项中，2-执行中，3-已结项，4-暂停',totalActWorkload:'实际总工作量，来自任务表',totalActOutWorkload:'实际外购总工作量，来自任务表',totalActInnerWorkload:'实际内部总工作量，来自任务表',totalTaskBudgetCostAt:'已经分配到任务的总预算',totalTaskOutCnt:'外购任务数，来自任务表',totalNeedPayCnt:'待付款笔数',totalFinishPayCnt:'完成付款总比数',totalFinishPayUserCnt:'已付款总人数',totalNeedPayUserCnt:'待付款总人数',totalPlanIuserWorkload:'内部人力总工作量-应该大于或等于阶段计划内部人力总成本',totalPlanOuserWorkload:'外购人力总工作量-应该大于或等于阶段计划外购人力总成本',testCases:'测试案例总数',execCases:'测试中案例总数',designCases:'设计中案例总数',finishCases:'完成案例总数',iterationCnt:'迭代数',productCnt:'产品数',menuCnt:'故事数',projectCnt:'项目数量',productBudgetWorkload:'产品总工时',productActWorkload:'产品实际完成总工作量',estimateWorkload:'预估完成工作量',execTaskCnt:'执行中任务数=任务表开始日期小于当前日期，进度<100的任务',toStartTaskCnt:'待开始的任务数=任务表中开始日期大于当前日期的任务数',execMenuCnt:'执行中需求=需求表中开始日期小于小于当前日期，进度<100的需求',toStartMenuCnt:'待开始需求数=需求表中开始日期大于当前日期的需求数',minStartTime:'最早开始日期',maxEndTime:'最晚结束时间'}
 **/
 
//普通查询 条件之间and关系  
export const listXmBranchState = params => { return axios.get(`${base}/xm/core/xmBranchState/list`, { params: params }); };

//模糊查询机构内所有项目指标汇总 条件之间or关系  
//export const listXmBranchStateKey = params => { return axios.get(`${base}/xm/core/xmBranchState/listKey`, { params: params }); };

//删除一条机构内所有项目指标汇总 params={branchId:'机构编号 主键'}
export const delXmBranchState = params => { return axios.post(`${base}/xm/core/xmBranchState/del`,params); };

//批量删除机构内所有项目指标汇总  params=[{branchId:'机构编号 主键'}]
export const batchDelXmBranchState = params => { return axios.post(`${base}/xm/core/xmBranchState/batchDel`, params); };

//修改一条机构内所有项目指标汇总记录
export const editXmBranchState = params => { return axios.post(`${base}/xm/core/xmBranchState/edit`, params); };

//新增一条机构内所有项目指标汇总
export const addXmBranchState = params => { return axios.post(`${base}/xm/core/xmBranchState/add`, params); };

export const loadProjectStateToXmBranchState = params => { return axios.post(`${base}/xm/core/xmBranchState/loadProjectStateToXmBranchState`,params); };
