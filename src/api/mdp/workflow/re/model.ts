import axios from '@/config/maxios'

import config from '@/api/mdp_pub/mdp_config'

const base = config.getWfCtx();

 
export type Model ={ 
  id: string
  formName: string
  key: string
  name: string
  description: string
  category: string
  formType: number
  formId: number
  formCustomCreatePath: string
  formCustomViewPath: string
  processDefinition: ProcessDefinitionVO
  status: number
  remark: string
  createTime: string 

}

export type ProcessDefinitionVO = {
id: string
version: number
deploymentTIme: string
suspensionState: number
}

export type ModelVO = {
model: Model
bpmnXml: string
}



export const getModelByKey =  (key: string) => { 
  return axios.get(  `${base}/workflow/re/model/queryByKey`,{params: {key:key}} )
}

export const getModel =  (id: string) => { 
  return axios.get(  `${base}/workflow/re/model/queryById`,{params: {id:id}} )
}

export const updateModel =  (data: ModelVO) => {
  return axios.post( `${base}/workflow/re/model/edit`,  data )
} 
export const createModel =  (data: ModelVO) => {
  return axios.post( `${base}/workflow/re/model/add`,data )
}
 
//普通查询 条件之间and关系  
export const listModel = params => { return axios.get(`${base}/workflow/re/model/list`, { params: params }); };

//普通查询 条件之间and关系
export const queryModelById = params => { return axios.get(`${base}/workflow/re/model/queryById`, { params: params }); };
`${base}/workflow/re/model/del`
//删除一条act_de_model params={id:'id 主键'}
export const delModel = params => { return axios.post(`${base}/workflow/re/model/del`,params); };

//批量删除act_de_model  params=[{id:'id 主键'}]
export const batchAddModel = params => { return axios.post(`${base}/workflow/re/model/batchAdd`, params); };

//批量删除act_de_model  params=[{id:'id 主键'}]
export const batchDelModel = params => { return axios.post(`${base}/workflow/re/model/batchDel`, params); };

//修改一条act_de_model记录
export const editModel = params => { return axios.post(`${base}/workflow/re/model/edit`, params); };

//新增一条act_de_model
export const addModel = params => { return axios.post(`${base}/workflow/re/model/add`, params); };

//部署
export const deployModel = params => { return axios.post(`${base}/workflow/re/model/deploy`, params); };


//批量修改某些字段
export const editSomeFieldsModel = params => { return axios.post(`${base}/workflow/re/model/editSomeFields`, params); };