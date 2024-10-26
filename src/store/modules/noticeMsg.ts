
import { defineStore } from 'pinia'
interface NoticeMsgVO { 
  total: number
  data: object[]
}
export const useNoticeMsgStore = defineStore('notice-msg', {
  state:():NoticeMsgVO => ({  
      total:0,
      data:
      [
      /**{id:'消息编号 主键',sendUserid:'操作人id',sendUsername:'操作人名字',operTime:'操作时间',objType:'对象类型:项目-1/任务-2/产品-3/需求-4/bug-5/迭代-6/团队-7',msg:'备注-完整描述',gloNo:'全局根踪号，用于跟踪日志',branchId:'机构编号',ip:'ip地址',bizId:'业务主键编号',pbizId:'对象上级编号,项目时填项目编号，任务时填项目编号，产品时填产品编号，需求时填产品编号，bug时填产品编号，迭代时填产品编号',bizName:'对象名称',toUserid:'接收用户编号',toUsername:'接收用户名称',hadRead:'是否已读'} */
      ]
     
  }),
  getters:{
    getData():object[] {
      return this.data
    },
    getTotal():number {
      return this.total
    }
  },
  actions: {
     setNoticeMsg(noticeMsg:NoticeMsgVO){ 
       this.total=noticeMsg.total
       this.data=noticeMsg.data
     },
     setTotal(total:number){
      
      this.total=total
     },
     setData(data:object[]){
      this.data=[...data]
     },
     updateItem(item,idx){
      this.data.splice(idx, 1, item);
     }
 
  }
})