/**
 * API 请求和响应的类型定义
 */

/**
 * 请求配置接口
 */
export interface RequestConfig {
  url: string
  method?: 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH'
  data?: any
  params?: Record<string, any>
  headers?: Record<string, string>
  timeout?: number
  credentials?: RequestCredentials
  responseType?: 'json' | 'blob' | 'text' | 'arraybuffer'
}

/**
 * 响应状态码配置
 */
export interface ResponseCodes {
  SUCCESS: number
  UNAUTHORIZED: number
  FORBIDDEN: number
  NOT_FOUND: number
  SERVER_ERROR: number
  LOGIN_EXPIRED: number
}

/**
 * API 响应数据结构
 */
export interface APIResponse<T = any> {
  code: number
  data?: T
  message?: string
  [key: string]: any
}

/**
 * 拦截后的响应对象
 */
export interface InterceptedResponse<T = any> {
  data: APIResponse<T> | T
  status: number
  headers: Record<string, string>
  fullResponse?: Response
}

/**
 * 请求拦截器类型
 */
export type RequestInterceptor = (config: RequestConfig) => RequestConfig | Promise<RequestConfig>

/**
 * 响应拦截器类型
 */
export type ResponseInterceptor = <T = any>(response: InterceptedResponse<T>) => APIResponse<T> | T | Promise<APIResponse<T> | T>

/**
 * 错误拦截器类型
 */
export type ErrorInterceptor = (error: Error | any, config?: RequestConfig) => Promise<never>

/**
 * 消息类型
 */
export type MessageType = 'info' | 'success' | 'warning' | 'error'

/**
 * 客户端配置接口
 */
export interface ClientConfig {
  baseURL: string
  timeout: number
  credentials?: RequestCredentials
  headers: Record<string, string>
}
