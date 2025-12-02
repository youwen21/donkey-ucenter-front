/**
 * 用户详细信息
 */
export interface UserInfo {
  id: number // ID
  name: string // 登陆名
  nickname: string // 称呼
  avatar: string // 头像
  email: string // 邮箱
  phone: string // 手机号
  status: number // 状态
  create_time: string | null // 创建时间
}
  
    
/**
 * 找回密码请求
 */
export interface ResetPwdParams {
  email: string // 邮箱
}

/**
 * 重置密码确认请求
 */
export interface ResetPwdConfirmParams {
  email: string // 邮箱
  code: string // 重置密码的验证码
  password: string // 新密码
}

/**
 * 修改密码请求
 */
export interface ChangePwdParams {
  oldPassword: string // 旧密码
  newPassword: string // 新密码
}

/**
 * 绑定邮箱请求
 */
export interface BindEmailParams {
  email: string // 邮箱地址
}

/**
 * 验证绑定邮箱请求
 */
export interface BindEmailConfirmParams {
  email: string // 邮箱
  code: string // 验证码
}

/**
 * 更换邮箱请求
 */
export interface ChangeEmailParams {
  newEmail: string // 新邮箱地址
  code: string // 新邮箱收到的验证码
  password: string // 密码（用于验证身份）
}

/**
 * 绑定手机号请求
 */
export interface BindPhoneParams {
  phone: string // 手机号
}

/**
 * 验证绑定手机号请求
 */
export interface BindPhoneConfirmParams {
  phone: string // 手机号
  code: string // 验证码
}

/**
 * 更新用户资料请求
 */
export interface UpdateUserProfileParams {
  nickname?: string // 称呼
  avatar?: string // 头像
}