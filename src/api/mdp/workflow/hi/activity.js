import axios from '@/config/maxios'

import config from '@/api/mdp_pub/mdp_config'

let base=config.getWfCtx();

//默认只开放普通查询，所有查询，只要上传	 分页参数 {currentPage:1,pageSize:10,total:0}，后台都会自动按分页查询 其它 api用到再打开，没用到的api请注释掉，

//普通查询
export const getActivityList  = params => { return axios.get(`${base}/workflow/hi/activity/list`, { params: params }); };
 
