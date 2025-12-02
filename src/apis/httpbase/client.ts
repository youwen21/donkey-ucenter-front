/**
 * API 客户端
 * 职责：设置请求  api 和返回状态码检查
 * api 返回格式：{
 *  code: number,
 *  message: string,
 *  data: any
 * }
 */
import type {
  RequestConfig,
  APIResponse,
  InterceptedResponse,
  RequestInterceptor,
  ResponseInterceptor,
  ErrorInterceptor,
  MessageType,
  ClientConfig
} from './types'
import { requestConfig as defaultConfig, responseCodes } from './config'

/**
 *  API 客户端类
 */
export class HttpAPIClient {
  private config: ClientConfig
  private requestInterceptor!: RequestInterceptor
  private responseInterceptor!: ResponseInterceptor
  private errorInterceptor!: ErrorInterceptor

  constructor(config?: Partial<ClientConfig>) {
    this.config = { ...defaultConfig, ...config }
    this.setupInterceptors()
  }

  /**
   * 设置拦截器
   */
  private setupInterceptors(): void {
    // 请求拦截器
    this.requestInterceptor = (config: RequestConfig): RequestConfig => {
      // 添加认证令牌
      // const token = authController.getToken()
      // if (token) {
      //   config.headers = config.headers || {}
      //   config.headers.Authorization = `Bearer ${token}`
      // }

      // config.url 不是http开头，则添加 baseURL
      if (!config.url.startsWith('http')) {
        config.url = `${this.config.baseURL}${config.url}`
      }

      // 确保 config.headers 存在
      if (!config.headers) {
        config.headers = {}
      }

      // 如果config.headers 不是application/json，则添加 Content-Type: application/json
      if (!config.headers['Content-Type']) {
        config.headers['Content-Type'] = 'application/json'
      }

      // 添加时间戳防止缓存
      if (config.method === 'GET' || !config.method) {
        config.params = {
          ...config.params,
          _t: Date.now()
        }
      }

      return config
    }

    // 响应拦截器
    this.responseInterceptor = <T = any>(response: InterceptedResponse<T>): APIResponse<T> | T => {
      const { data, status } = response

      // 处理业务状态码
      if (data && typeof data === 'object' && 'code' in data) {
        const apiResponse = data as APIResponse<T>

        switch (apiResponse.code) {
          case responseCodes.LOGIN_EXPIRED:
            debugger
            this.handleLoginExpired()
            return Promise.reject(new Error('登录已过期')) as any
          case responseCodes.UNAUTHORIZED:
            this.handleUnauthorized()
            return Promise.reject(new Error('未授权访问')) as any
          case responseCodes.FORBIDDEN:
            this.handleForbidden()
            return Promise.reject(new Error('权限不足')) as any
          default:
            return apiResponse
        }
      }

      // 处理HTTP状态码
      if (status >= 200 && status < 300) {
        return data as T
      } else {
        return Promise.reject(new Error(`HTTP错误: ${status}`)) as any
      }
    }

    // 错误拦截器
    this.errorInterceptor = (error: Error | any, config?: RequestConfig): Promise<never> => {
      // console.error('请求错误:', error)

      // 注意：fetch API 的错误处理与 axios 不同
      // fetch 只有在网络错误时才会 reject，HTTP 错误状态码不会自动 reject
      // 所以这里主要处理网络错误和其他异常

      if (error.name === 'AbortError') {
        console.error('请求超时')
      } else if (error.message) {
        // 如果是我们手动抛出的错误（如 HTTP 错误）
        if (error.message.includes('HTTP')) {
          console.error(error.message)
        } else {
          console.error('网络错误，请检查网络连接:', error.message)
        }
      } else {
        console.error('请求异常:', error)
      }

      return Promise.reject(error)
    }
  }

  /**
   * 处理登录过期
   */
  private async handleLoginExpired(): Promise<void> {
    console.warn('登录已过期，正在清除登录信息...')

    try {
      // 清除登录信息
      // await authController.logout()

      // 跳转到登录页面
      this.redirectToLogin()

      // 显示提示信息
      this.showMessage('登录已过期，请重新登录', 'warning')
    } catch (error) {
      console.error('处理登录过期时出错:', error)
    }
  }

  /**
   * 处理未授权
   */
  private handleUnauthorized(): void {
    console.warn('未授权访问')
    this.showMessage('请先登录', 'warning')
    this.redirectToLogin()
  }

  /**
   * 处理权限不足
   */
  private handleForbidden(): void {
    console.warn('权限不足')
    this.showMessage('权限不足，无法访问该资源', 'error')
  }

  /**
   * 跳转到登录页面
   */
  private redirectToLogin(): void {
    try {
      // 获取当前路由信息
      const currentRoute = window.location.pathname + window.location.search

      // 跳转到登录页面，并保存当前页面路径
      window.location.href = `/login?redirect=${encodeURIComponent(currentRoute)}`
    } catch (error) {
      console.error('跳转登录页面失败:', error)
      // 备用方案：直接跳转到登录页
      window.location.href = '/login'
    }
  }

  /**
   * 显示消息提示
   */
  private showMessage(message: string, type: MessageType = 'info'): void {
    // 这里可以集成消息提示组件，如 Element Plus 的 Message
    // 暂时使用 console 输出
    console.log(`[${type.toUpperCase()}] ${message}`)

    // 如果项目中使用了消息提示组件，可以这样调用：
    // import { ElMessage } from 'element-plus'
    // ElMessage[type](message)
  }

  /**
   * 发送请求
   */
  async request<T = any>(config: RequestConfig): Promise<T> {
    try {
      // 应用请求拦截器
      const interceptedConfig = await this.requestInterceptor(config)

      // 构建 URL（处理 GET 请求的 params）
      let url = interceptedConfig.url
      if ((interceptedConfig.method === 'GET' || !interceptedConfig.method) && interceptedConfig.params) {
        const queryString = new URLSearchParams(
          Object.entries(interceptedConfig.params).reduce((acc, [key, value]) => {
            acc[key] = String(value)
            return acc
          }, {} as Record<string, string>)
        ).toString()
        url = queryString ? `${url}?${queryString}` : url
      }

      // 发送请求
      const fetchOptions: RequestInit = {
        method: interceptedConfig.method || 'GET',
        headers: interceptedConfig.headers,
        signal: AbortSignal.timeout(interceptedConfig.timeout || this.config.timeout)
      }

      // 如果配置了 credentials，则携带 cookie
      if (this.config.credentials || interceptedConfig.credentials) {
        fetchOptions.credentials = this.config.credentials || interceptedConfig.credentials || 'include'
      }

      // 处理请求体（非 GET 请求）
      if (interceptedConfig.method && interceptedConfig.method !== 'GET' && interceptedConfig.data) {
        if (interceptedConfig.data instanceof FormData) {
          // FormData 不需要设置 Content-Type，浏览器会自动设置
          fetchOptions.body = interceptedConfig.data
          // 删除 Content-Type，让浏览器自动设置
          if (fetchOptions.headers) {
            delete (fetchOptions.headers as Record<string, string>)['Content-Type']
          }
        } else {
          fetchOptions.body = JSON.stringify(interceptedConfig.data)
        }
      }

      const response = await fetch(url, fetchOptions)

      // 检查响应状态
      if (!response.ok) {
        // 对于 HTTP 错误状态码，也进行业务状态码检查
        if (response.status === responseCodes.UNAUTHORIZED) {
          this.handleUnauthorized()
          throw new Error('未授权访问')
        } else if (response.status === responseCodes.FORBIDDEN) {
          this.handleForbidden()
          throw new Error('权限不足')
        } else if (response.status === responseCodes.NOT_FOUND) {
          console.error('请求的资源不存在')
          throw new Error(`HTTP ${response.status}: ${response.statusText}`)
        } else if (response.status === responseCodes.SERVER_ERROR) {
          console.error('服务器内部错误')
          throw new Error(`HTTP ${response.status}: ${response.statusText}`)
        } else {
          throw new Error(`HTTP ${response.status}: ${response.statusText}`)
        }
      }

      // 解析响应数据
      let data: any
      if (interceptedConfig.responseType === 'blob') {
        data = await response.blob()
      } else if (interceptedConfig.responseType === 'text') {
        data = await response.text()
      } else if (interceptedConfig.responseType === 'arraybuffer') {
        data = await response.arrayBuffer()
      } else {
        data = await response.json()
      }

      // 获取暴露的自定义响应头（需要后端设置 Access-Control-Expose-Headers）
      // 例如：X-Total-Count, X-Auth-Token, X-Request-Id 等
      const exposedHeaders: Record<string, string> = {}
      const headerNames = ['X-Total-Count', 'X-Auth-Token', 'X-Request-Id', 'X-Page-Size', 'X-Page-Number']
      headerNames.forEach(headerName => {
        const value = response.headers.get(headerName)
        if (value !== null) {
          exposedHeaders[headerName] = value
        }
      })

      // 应用响应拦截器，传递响应头和状态码
      return this.responseInterceptor<T>({
        data,
        status: response.status,
        headers: exposedHeaders,
        fullResponse: response // 保留完整响应对象，以便需要时访问其他信息
      }) as Promise<T>

    } catch (error) {
      // 应用错误拦截器
      return this.errorInterceptor(error, config)
    }
  }

  /**
   * GET 请求
   */
  get<T = any>(url: string, params: Record<string, any> = {}, config: Partial<RequestConfig> = {}): Promise<T> {
    return this.request<T>({
      url,
      method: 'GET',
      params,
      ...config
    })
  }

  /**
   * POST 请求
   */
  post<T = any>(url: string, data: any = {}, config: Partial<RequestConfig> = {}): Promise<T> {
    return this.request<T>({
      url,
      method: 'POST',
      data,
      ...config
    })
  }

  /**
   * PUT 请求
   */
  put<T = any>(url: string, data: any = {}, config: Partial<RequestConfig> = {}): Promise<T> {
    return this.request<T>({
      url,
      method: 'PUT',
      data,
      ...config
    })
  }

  /**
   * DELETE 请求
   */
  delete<T = any>(url: string, config: Partial<RequestConfig> = {}): Promise<T> {
    return this.request<T>({
      url,
      method: 'DELETE',
      ...config
    })
  }

  /**
   * PATCH 请求
   */
  patch<T = any>(url: string, data: any = {}, config: Partial<RequestConfig> = {}): Promise<T> {
    return this.request<T>({
      url,
      method: 'PATCH',
      data,
      ...config
    })
  }

  /**
   * 上传文件
   */
  upload<T = any>(url: string, file: File, config: Partial<RequestConfig> = {}): Promise<T> {
    const formData = new FormData()
    formData.append('file', file)

    return this.request<T>({
      url,
      method: 'POST',
      data: formData,
      headers: {
        // 不设置 Content-Type，让浏览器自动设置
      },
      ...config
    })
  }

  /**
   * 下载文件
   */
  async download(url: string, filename: string = '', config: Partial<RequestConfig> = {}): Promise<void> {
    const blob = await this.request<Blob>({
      url,
      method: 'GET',
      responseType: 'blob',
      ...config
    })

    const downloadUrl = window.URL.createObjectURL(blob)
    const link = document.createElement('a')
    link.href = downloadUrl
    link.download = filename || 'download'
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
    window.URL.revokeObjectURL(downloadUrl)
  }
}

