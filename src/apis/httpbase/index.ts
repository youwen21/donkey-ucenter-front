/**
 * HTTP 基础模块导出
 */
import { HttpAPIClient } from './client'
export { requestConfig , responseCodes } from './config'
export type {
  RequestConfig,
  APIResponse,
  InterceptedResponse,
  RequestInterceptor,
  ResponseInterceptor,
  ErrorInterceptor,
  MessageType,
  ClientConfig,
  ResponseCodes
} from './types'

export const httpApiClient = new HttpAPIClient()
// 默认导出（保持向后兼容）
export default httpApiClient