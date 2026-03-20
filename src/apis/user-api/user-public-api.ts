
/**
 * 用户公开 API（不需要登录验证）
 */
import type { APIResponse } from '../httpbase/types'
import type { AuthForm, LoginResponse } from '../auth-api/types'
import type { ResetPwdParams, ResetPwdConfirmParams } from './types'
import { httpApiClient } from '../httpbase'

export const userPublicApi = {
  /**
   * 用户注册
   * @param form - 注册表单数据
   * @returns API 响应，data 字段为登录响应数据
   */
  register: async (form: AuthForm): Promise<APIResponse<LoginResponse>> => {
    return httpApiClient.post<APIResponse<LoginResponse>>('/api/user/public/register', form)
  },

  /**
   * 找回密码 - 发送重置密码邮件
   * @param params - 找回密码请求数据
   * @returns API 响应
   */
  resetPwd: async (params: ResetPwdParams): Promise<APIResponse<void>> => {
    return httpApiClient.post<APIResponse<void>>('/api/user/public/reset-pwd', params)
  },

  /**
   * 重置密码确认
   * @param params - 重置密码确认请求数据
   * @returns API 响应
   */
  resetPwdConfirm: async (params: ResetPwdConfirmParams): Promise<APIResponse<void>> => {
    return httpApiClient.post<APIResponse<void>>('/api/user/public/reset-pwd-confirm', params)
  }
}