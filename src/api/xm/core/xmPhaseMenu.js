import axios from '@/config/maxios'

import config from '@/api/mdp_pub/mdp_config'

let base = config.getXmCtx();
 

export const batchAddXmPhaseMenu = params => { return axios.post(`${base}/xm/core/xmPhaseMenu/batchAdd`, params); };

export const batchDelXmPhaseMenu = params => { return axios.post(`${base}/xm/core/xmPhaseMenu/batchDel`, params); };


