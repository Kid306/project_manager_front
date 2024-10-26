import axios from '@/config/maxios'
import config from '@/api/mdp_pub/mdp_config'
let arcBase = config.getArcCtx();

 
import { getAccessToken } from '@/utils/auth'
/**
 * 获取文件、附件上传的请求路径，全路径
 */
 export const  getArcAttUploadPath = () => {  return import.meta.env.VITE_UPLOAD_ATT_URL||`${config.getArcFileUploadBasePath()}/mdp/arc/att/attachment/upload` }

 /**
  * 获取图片上传的请求路径，全路径
  * @returns 
  */
  export const getArcImageUploadPath = () => {  return import.meta.env.VITE_UPLOAD_IMAGE_URL||`${config.getArcImagePath()}/mdp/arc/img/image/upload`}
 
 /**
  * 预览图片是 url= $mdp.getArcImagePreviewBasePath()/图片url
  * @returns 
  */
  export const getArcImagePreviewBasePath = () => { return `${config.getArcImagePath()}` }
 
 /**
  * 文件上传下载时带上token
  * @returns 
  */
  export const getArcUploadHeader = () => { return {Authorization: "Bearer "+ getAccessToken()} }

  
// --arc tag 相关api

//普通查询 条件之间and关系  
export const getAllTag = params => { return axios.get(`/${arcBase}/mdp/arc/tag/getAllTag`, { params: params }); }

//删除一条arc_tag params={id:'标签编号 主键'}
export const delTag = params => { return axios.post(`/${arcBase}/mdp/arc/tag/del`,params); }

//新增一条arc_tag
export const addTag = params => { return axios.post(`/${arcBase}/mdp/arc/tag/add`, params); }

//新增一条arc_tag_category 及相关标签
export const delTagCategory = params => { return axios.post(`/${arcBase}/mdp/arc/tag/deleteTagCategory`, params); }

//新增一条arc_tag_category
export const addTagCategory = params => { return axios.post(`/${arcBase}/mdp/arc/tagCategory/add`, params); }

// -- end arc tag 相关api


// -- arc image 图片库相关api 

/**
* 图片素材库
* 查询、新增、修改的参数格式  params={id:'主键 主键',name:'附件名称',url:'访问路径',relativePath:'硬盘存放路径',fileSuffix:'后缀名',rootPath:'根目录',createDate:'存入时间',fileSize:'文件大小',deptid:'归属部门',tag:'标签',remark:'备注信息',categoryId:'图片分类',storageName:'硬盘存储名字(不带后缀)',urlPrefix:'链接前缀',isOutUrl:'是否外部链接',outUrl:'外部链接',branchId:'机构编号',archiveType:'0|知识库',relyTypes:'参考类型，开放式字段，1-开源社区，2-项目论坛,逗号',relyIds:'参考编号,逗号',relySubTypes:'参考子类型,逗号',relySubIds:'参考子编号,逗号',cuserid:'创建人编号',cusername:'创建人姓名',cdate:'创建时间'}
**/ 
export const listImage = params => { return axios.get(`/${arcBase}/mdp/arc/img/image/list`, { params: params }); }


//批量删除图片素材库  params=[{id:'主键 主键'}]
export const batchDelImage = params => { return axios.post(`/${arcBase}/mdp/arc/img/image/batchDel`, params); }


//普通查询 条件之间and关系  
export const listImageCategory = params => { return axios.get(`/${arcBase}/mdp/arc/img/imageCategory/list`, { params: params }); } 

//删除一条图片分类 params={id:'主键 主键'}
export const delImageCategory = params => { return axios.post(`/${arcBase}/mdp/arc/img/imageCategory/del`,params); }


//修改一条图片分类记录
export const editImageCategory = params => { return axios.post(`/${arcBase}/mdp/arc/img/imageCategory/edit`, params); }

//新增一条图片分类
export const addImageCategory = params => { return axios.post(`/${arcBase}/mdp/arc/img/imageCategory/add`, params); }

//批量删除
export const batchDelImageCategory = params => { return axios.post(`/${arcBase}/mdp/arc/img/imageCategory/batchDel`, params); }


//批量修改上下级
export const batchChangeParentImageCategory = params => { return axios.post(`/${arcBase}/mdp/arc/img/imageCategory/batchChangeParent`, params); }

  // end -- arc image 图片库相关api 


  // -- arc att 附件相关api

  /**
  * 档案类目
  * 查询、新增、修改的参数格式  params={id:'分类主键 主键',categoryType:'0知识库-1新闻类2企业内部通知公告类3平台通知公告4其它5论坛6公文7归档8网站栏目,关联基础数据categoryType',pid:'上级分类',name:'分类名称',sortOrder:'分类排序',isShow:'是否显示',branchId:'机构编号',imageUrls:'图片列表逗号分割',isLeaf:'是否叶子节点0否1是，叶子节点不允许再建立下级，非叶子节点不允许挂文章',limitType:'文章限制,1-单篇文章，2-多篇文章',isAuth:'文章是否需要审核0-否1是',paths:'上级分类路径，逗号分割，包括自身'}
  **/
//普通查询 条件之间and关系  
export const listCategory  = params => { return axios.get(`/${arcBase}/mdp/arc/pub/category/list`, { params: params }); }

//普通查询 条件之间and关系
export const queryCategoryById  = params => { return axios.get(`/${arcBase}/mdp/arc/pub/category/queryById`, { params: params }); } 

//批量删除档案类目  params=[{id:'分类主键 主键'}]
export const batchAddCategory  = params => { return axios.post(`/${arcBase}/mdp/arc/pub/category/batchAdd`, params); }

//批量删除档案类目  params=[{id:'分类主键 主键'}]
export const batchDelCategory  = params => { return axios.post(`/${arcBase}/mdp/arc/pub/category/batchDel`, params); }

//批量删除档案类目  params=[{id:'分类主键 主键'}]
export const delCategory  = params => { return axios.post(`/${arcBase}/mdp/arc/pub/category/del`, params); }


//修改一条档案类目记录
export const editCategory  = params => { return axios.post(`/${arcBase}/mdp/arc/pub/category/edit`, params); }

//新增一条档案类目
export const addCategory  = params => { return axios.post(`/${arcBase}/mdp/arc/pub/category/add`, params); } 

export const batchChangeParent= params => { return axios.post(`/${arcBase}/mdp/arc/pub/category/batchChangeParent`, params); } 

//查询分类权限
export const listCategoryQx  = params => { return axios.get(`/${arcBase}/mdp/arc/pub/categoryQx/list`, { params: params }); }

//查询分类权限
export const queryCategoryQxById  = params => { return axios.get(`/${arcBase}/mdp/arc/pub/categoryQx/queryById`, { params: params }); } 
  

//修改一条档案类目记录权限
export const editCategoryQx  = params => { return axios.post(`/${arcBase}/mdp/arc/pub/categoryQx/edit`, params); }

//新增一条档案类目权限
export const addCategoryQx  = params => { return axios.post(`/${arcBase}/mdp/arc/pub/categoryQx/add`, params); } 

/**
* 档案附件表
*查询、新增、修改的参数格式  params={id:'主键 主键',name:'附件名称',url:'访问路径',relativePath:'硬盘存放路径',fileSuffix:'后缀名',cdnUrl:'内容加速器访问路径',isImg:'是否图片',archiveId:'档案主编号',isCdn:'是否使用CDN',rootPath:'根目录',createDate:'存入时间',canDown:'是否可下载',canDel:'是否可删除',canRead:'是否可读',bizId:'业务编号、产品编号、商品编号等',remark:'业务名称、产品名称、商品名称等',storeName:'存储名字',fileSize:'文件大小',branchId:'云用户机构编号',deptid:'部门编号',archiveType:'0|知识库',categoryId:'分类编号'}
**/

//普通查询 条件之间and关系  
export const  listAttachment  = params => { return axios.get(`/${arcBase}/mdp/arc/att/attachment/list`, { params: params }); }

//普通查询 条件之间and关系
export const  queryAttachmentById  = params => { return axios.get(`/${arcBase}/mdp/arc/att/attachment/queryById`, { params: params }); }

//删除一条档案附件表 params={id:'主键 主键'}
export const  delAttachment  = params => { return axios.post(`/${arcBase}/mdp/arc/att/attachment/del`,params); } 

//批量删除档案附件表  params=[{id:'主键 主键'}]
export const  batchDelAttachment  = params => { return axios.post(`/${arcBase}/mdp/arc/att/attachment/batchDel`, params); }

//修改一条档案附件表记录
export const  editAttachment  = params => { return axios.post(`/${arcBase}/mdp/arc/att/attachment/edit`, params); }

//新增一条档案附件表
export const addAttachment  = params => { return axios.post(`/${arcBase}/mdp/arc/att/attachment/add`, params); }

//批量修改某些字段
export const  editSomeFieldsAttachment  = params => { return axios.post(`/${arcBase}/mdp/arc/att/attachment/editSomeFields`, params); }

  // end -- arc att 附件相关api 

  
