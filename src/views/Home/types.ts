export type WorkplaceTotal = {
  project: number
  access: number
  todo: number
}

export type Project = {
  name: string
  icon: string
  message: string
  personal: string
  time: Date | number | string
}

export type Notice = {
  msg: string
  operTime: Date | number | string
  sendUserid: string
  sendUsername: string
  id: string
  branchId: string
  toUserid: string
  toUsername: string
  hadRead: string
  url: string
  bizId: string
  pbizId: string 
}

export type Shortcut = {
  name: string
  context: string
  icon: string
  path: string
}

export type RadarData = {
  personal: number
  team: number
  max: number
  name: string
}
export type AnalysisTotalTypes = {
  users: number
  messages: number
  moneys: number
  shoppings: number
}

export type UserAccessSource = {
  value: number
  name: string
}

export type WeeklyUserActivity = {
  value: number
  name: string
}

export type MonthlySales = {
  name: string
  estimate: number
  actual: number
}
