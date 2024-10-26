
import { defineStore } from 'pinia' 
import { store } from '@/store'
import {  useCache } from '@/hooks/web/useCache'

const { wsCache } = useCache('sessionStorage')

const iterationKey='xm-iteration-store';
const productKey='xm-product-store';
const projectKey='xm-project-info-store';
const testCasedbKey='xm-test-casedb-store';

export interface XmVO {
  xmIteration:any, // 迭代
  xmProduct:any, // 产品
  projectInfo:any, // 项目
  testCasedb:any, //测试库
}
 export const useXmStore = defineStore('xm',{
  state:():XmVO => ({    
    xmIteration: wsCache.get(iterationKey),
    xmProduct: wsCache.get(productKey),
    projectInfo: wsCache.get(projectKey),
    testCasedb: wsCache.get(testCasedbKey),
  }),
  getters:{
    getXmIteration():any {
      return this.xmIteration
    },
    
    getXmProduct():any {
      return this.xmProduct
    },
    
    getProjectInfo():any {
      return this.projectInfo
    },
    
    getTestCasedb():any {
      return this.testCasedb
    }
  },
  actions: {
     async setXmIteration(xmIteration:any){  
      this.xmIteration=xmIteration
      wsCache.set(iterationKey,xmIteration)
     },
     async setXmProduct(xmProduct:any){
      this.xmProduct=xmProduct
      wsCache.set(productKey,xmProduct)
     },
     async setProjectInfo(projectInfo:any){
      this.projectInfo=projectInfo
      wsCache.set(projectKey,projectInfo)
     },
     async setTestCasedb(testCasedb:any){ 
      this.testCasedb=testCasedb
      wsCache.set(testCasedbKey,testCasedb)
     } 
 
  }
}) 

export const useXmStore2 = () => {
   return useXmStore(store) 
}