import type { APIResponse } from '../httpbase/types'
import type { UserInfo, ChangePwdParams, BindEmailParams, BindEmailConfirmParams, BindPhoneParams, BindPhoneConfirmParams, ChangeEmailParams } from './types'
import { httpApiClient } from '../httpbase'

export const userApi = {
  /**
   * 获取用户详细信息
   * @returns API 响应，data 字段为用户详细信息
   */
  getUserInfo: async (): Promise<APIResponse<UserInfo>> => {
    return httpApiClient.get<APIResponse<UserInfo>>('/api/user/info')
  },

  /**
   * 修改密码
   * @param params - 修改密码请求数据
   * @returns API 响应
   */
  changePwd: async (params: ChangePwdParams): Promise<APIResponse<void>> => {
    return httpApiClient.post<APIResponse<void>>('/api/user/change-pwd', params)
  },

  /**
   * 绑定邮箱
   * @param params - 绑定邮箱请求数据
   * @returns API 响应
   */
  bindEmail: async (params: BindEmailParams): Promise<APIResponse<void>> => {
    return httpApiClient.post<APIResponse<void>>('/api/user/bind-email', params)
  },

  /**
   * 验证绑定邮箱
   * @param params - 验证绑定邮箱请求数据
   * @returns API 响应
   */
  bindEmailConfirm: async (params: BindEmailConfirmParams): Promise<APIResponse<void>> => {
    return httpApiClient.post<APIResponse<void>>('/api/user/bind-email-confirm', params)
  },

  /**
   * 更换邮箱
   * @param params - 更换邮箱请求数据
   * @returns API 响应
   */
  changeEmail: async (params: ChangeEmailParams): Promise<APIResponse<void>> => {
    return httpApiClient.post<APIResponse<void>>('/api/user/change-email', params)
  },

  /**
   * 绑定手机号
   * @param params - 绑定手机号请求数据
   * @returns API 响应
   */
  bindPhone: async (params: BindPhoneParams): Promise<APIResponse<void>> => {
    return httpApiClient.post<APIResponse<void>>('/api/user/bind-phone', params)
  },

  /**
   * 验证绑定手机号
   * @param params - 验证绑定手机号请求数据
   * @returns API 响应
   */
  bindPhoneConfirm: async (params: BindPhoneConfirmParams): Promise<APIResponse<void>> => {
    return httpApiClient.post<APIResponse<void>>('/api/user/bind-phone-confirm', params)
  },

  /**
   * 更新用户资料
   * @param params - 更新用户资料请求数据
   * @returns API 响应，data 字段为更新后的用户信息
   */
  updateUserInfo: async (params: UserInfo): Promise<APIResponse<UserInfo>> => {
    return httpApiClient.put<APIResponse<UserInfo>>('/api/user/updataInfo', params)
  }
}