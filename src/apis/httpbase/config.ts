/**
 * API 请求配置
 */
import type { ClientConfig, ResponseCodes } from './types'

/**
 * 请求配置
 */
export const requestConfig: ClientConfig = {
  baseURL: import.meta.env.VITE_API_BASE_URL || 'http://127.0.0.1:8000',
  timeout: 10000,
  credentials: 'include', // fetch请求携带cookie
  headers: {
    'Content-Type': 'application/json'
  }
}

/**
 * 响应状态码配置
 */
export const responseCodes: ResponseCodes = {
  SUCCESS: 0,
  UNAUTHORIZED: 1,
  FORBIDDEN: 403,
  NOT_FOUND: 404,
  SERVER_ERROR: 500,
  LOGIN_EXPIRED: 600 // 登录授权过期
}

