
/**
 * 认证相关类型定义
 */

/**
 * 登录/注册表单
 */
export interface AuthForm {
    username: string
    password: string
    remember?: boolean
  }
  
  /**
   * 用户基本信息
   */
  export interface UserBaseInfo {
    id: number
    name: string // 登陆名
    nickname: string // 称呼
    avatar: string // 头像
  }
  
  /**
   * 登录响应数据
   */
  export interface LoginResponse {
    token: string
    params: Record<string, string>
    user: UserBaseInfo
  }
  
  