export type UserLoginVO = {
  userloginid: string
  password: string
  captchaVerification: string
  authType?: string
  deptid?: string
  userid?: string
  grantType:string
} 
export type AccessToken={
  tokenValue:string // 访问令牌
  issuedAt: Date //过期时间
  expiresAt: Date //过期时间
}
export type TokenType = { 
  accessToken: AccessToken // 访问令牌
  refreshToken: string // 刷新令牌 
}

export type UserVO = {
  id: number
  username: string
  nickname: string
  deptId: number
  email: string
  mobile: string
  sex: number
  avatar: string
  loginIp: string
  loginDate: string
}
