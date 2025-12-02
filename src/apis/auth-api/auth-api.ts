/**
 * 认证相关 API
 */
import type { APIResponse } from '../httpbase/types'
import type { AuthForm, LoginResponse } from './types'
import { httpApiClient } from '../httpbase'

// 创建认证 API 客户端实例（使用默认配置，与 httpApiClient 保持一致）
// const authClient = new HttpAPIClient(defaultConfig)

// /**
//  * 用户注册
//  * @param form - 注册表单数据
//  * @returns 登录响应数据
//  */
// const register = async (form: AuthForm): Promise<LoginResponse> => {
//   return authClient.post<LoginResponse>('/api/auth/register', form)
// }

// /**
//  * 用户登录
//  * @param form - 登录表单数据
//  * @returns 登录响应数据
//  */
// const login = async (form: AuthForm): Promise<LoginResponse> => {
//   return authClient.post<LoginResponse>('/api/auth/login', form)
// }

// /**
//  * 用户登出
//  */
// const logout = async (): Promise<void> => {
//   return authClient.post<void>('/api/auth/logout')
// }

/**
 * 认证 API 对象
 */
export const authApi = {
  /**
   * 用户注册
   * @param form - 注册表单数据
   * @returns API 响应，data 字段为登录响应数据
   */
  register: async (form: AuthForm): Promise<APIResponse<LoginResponse>> => {
    return httpApiClient.post<APIResponse<LoginResponse>>('/api/auth/register', form)
  },

  /**
   * 用户登录
   * @param form - 登录表单数据
   * @returns API 响应，data 字段为登录响应数据
   */
  login: async (form: AuthForm): Promise<APIResponse<LoginResponse>> => {
    return httpApiClient.post<APIResponse<LoginResponse>>('/api/auth/login', form)
  },

  /**
   * 用户登出
   */
  logout: async (): Promise<void> => {
    return httpApiClient.post<void>('/api/auth/logout')
  }
}

