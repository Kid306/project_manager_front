export {}
declare global {
  interface Fn<T = any> {
    (...arg: T[]): T
  }

  type Nullable<T> = T | null

  type ElRef<T extends HTMLElement = HTMLDivElement> = Nullable<T>

  type Recordable<T = any, K = string> = Record<K extends null | undefined ? string : K, T>

  type ComponentRef<T> = InstanceType<T>

  type LocaleType = 'zh-CN' | 'en'

  declare type TimeoutHandle = ReturnType<typeof setTimeout>
  declare type IntervalHandle = ReturnType<typeof setInterval>

  type AxiosHeaders =
    | 'application/json'
    | 'application/x-www-form-urlencoded'
    | 'multipart/form-data'

  type AxiosMethod = 'get' | 'post' | 'delete' | 'put' | 'GET' | 'POST' | 'DELETE' | 'PUT'

  type AxiosResponseType = 'arraybuffer' | 'blob' | 'document' | 'json' | 'text' | 'stream'

  interface AxiosConfig {
    params?: any
    data?: any
    url?: string
    method?: AxiosMethod
    headersType?: string
    responseType?: AxiosResponseType
  }

  interface IResponse<T = any> {
    code?: string
    tips?: Tips
    data: T extends any ? T : T & any
  } 
  interface PageParam {
    pageSize?: number //每页数据
    pageNo?: number //当前页码、从1开始计算 
  }

  interface PageInfo extends PageParam {
    pageSize?: number //每页数据
    pageNum?: number //当前页码、从1开始计算
    total?: number //服务器端收到0时，会自动计算总记录数，如果上传>0的不自动计算。
    count?: boolean //是否需要重新计算总记录数
    orderFields?: string[] //排序列 如 ['sex','student_id']，必须为数据库字段
    orderDirs?: string[] //升序 asc,降序desc 如 性别 升序、学生编号降序 ['asc','desc']
  }
  interface Tips {
    isOk: boolean
    msg?: string
    tipscode?: string
    gloNo?: string
    moreMsg?: string

  }
  interface Tree {
    id: number
    name: string
    children?: Tree[] | any[]
  }
}
