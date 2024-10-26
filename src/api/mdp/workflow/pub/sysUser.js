import axios from '@/config/maxios'

 import config from '@/api/mdp_pub/mdp_config'

let base = config.getWfCtx();
 
 
//普通查询 条件之间and关系  
export const listSysUser = params => { return axios.get(`${base}/workflow/users`, { params: params }); };
 