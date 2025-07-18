import axios from '@/config/maxios'

import config from '@/api/mdp_pub/mdp_config'

let base = config.getXmCtx();


/**
 * xm_project_phase_baseline
 *1    默认只开放普通查询，所有查询，只要上传	 分页参数 {currentPage:当前页码从1开始,pageSize:每页记录数,total:总记录【数如果是0后台会自动计算总记录数非0不会自动计算】}，后台都会自动按分页查询 其它 api用到再打开，没用到的api请注释掉，
 *2 查询、新增、修改的参数格式  params={id:'基线主键 主键',baseCtime:'基线建立时间',phaseId:'阶段主键',name:'阶段名称',remark:'备注',parentId:'上级阶段编号',branchId:'机构编号',projectId:'当前项目编号',beginDate:'开始时间',endDate:'结束时间',planWorkingHours:'工时',planWorkingStaffNu:'投入人员数',ctime:'创建时间',totalBudgetNouser:'非人力成本总预算',totalBudgetIuser:'内部人力成本总预算',totalBudgetOuser:'外购人力成本总预算',baseRemark:'基线备注',baselineId:'项目级基线',bizProcInstId:'当前流程实例编号',bizFlowState:'当前流程状态0初始1审批中2审批通过3审批不通过4流程取消或者删除'}
 **/
 
//普通查询 条件之间and关系  
export const listXmPhaseBaseline = params => { return axios.get(`${base}/xm/core/xmPhaseBaseline/list`, { params: params }); };

//模糊查询xm_project_phase_baseline 条件之间or关系  
//export const listXmPhaseBaselineKey = params => { return axios.get(`${base}/xm/core/xmPhaseBaseline/listKey`, { params: params }); };

//删除一条xm_project_phase_baseline params={id:'基线主键 主键'}
export const delXmPhaseBaseline = params => { return axios.post(`${base}/xm/core/xmPhaseBaseline/del`,params); };

//批量删除xm_project_phase_baseline  params=[{id:'基线主键 主键'}]
export const batchDelXmPhaseBaseline = params => { return axios.post(`${base}/xm/core/xmPhaseBaseline/batchDel`, params); };

//修改一条xm_project_phase_baseline记录
export const editXmPhaseBaseline = params => { return axios.post(`${base}/xm/core/xmPhaseBaseline/edit`, params); };

//新增一条xm_project_phase_baseline
export const addXmPhaseBaseline = params => { return axios.post(`${base}/xm/core/xmPhaseBaseline/add`, params); };