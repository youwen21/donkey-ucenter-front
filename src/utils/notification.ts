import Swal, { type SweetAlertOptions } from 'sweetalert2'
import 'sweetalert2/dist/sweetalert2.min.css'

// 名称规则 学习
// https://cloud.tencent.com/developer/article/1025695

// 文档
// https://github.com/sweetalert2/sweetalert2
// https://sweetalert2.github.io/

/**
 * Toast 配置
 */
const defaultToastConfig: SweetAlertOptions = {
  toast: true,
  position: 'top-end',
  showConfirmButton: false,
  timer: 3000,
  timerProgressBar: true,
  didOpen: (toast) => {
    toast.addEventListener('mouseenter', Swal.stopTimer)
    toast.addEventListener('mouseleave', Swal.resumeTimer)
  }
}

/**
 * 成功提示
 * @param message - 提示消息
 * @param title - 标题，可选
 */
export const notifySuccess = (message: string = '操作成功', title: string = '') => {
  return Swal.fire({
    ...defaultToastConfig,
    icon: 'success',
    title: title || message,
    text: title ? message : ''
  })
}

/**
 * 错误提示
 * @param message - 提示消息
 * @param title - 标题，可选
 */
export const notifyError = (message: string = '操作失败', title: string = '') => {
  return Swal.fire({
    ...defaultToastConfig,
    icon: 'error',
    title: title || message,
    text: title ? message : ''
  })
}

/**
 * 警告提示
 * @param message - 提示消息
 * @param title - 标题，可选
 */
export const notifyWarning = (message: string = '警告', title: string = '') => {
  return Swal.fire({
    ...defaultToastConfig,
    icon: 'warning',
    title: title || message,
    text: title ? message : ''
  })
}

/**
 * 信息提示
 * @param message - 提示消息
 * @param title - 标题，可选
 */
export const notifyInfo = (message: string = '提示', title: string = '') => {
  return Swal.fire({
    ...defaultToastConfig,
    icon: 'info',
    title: title || message,
    text: title ? message : ''
  })
}

/**
 * 确认对话框
 * @param title - 标题
 * @param text - 内容
 * @param confirmButtonText - 确认按钮文字，默认 '确定'
 * @param cancelButtonText - 取消按钮文字，默认 '取消'
 * @param icon - 图标类型，默认 'warning'
 * @returns 返回 true 表示确认，false 表示取消
 */
export const confirm = async (
  title: string = '确认操作',
  text: string = '确定要执行此操作吗？',
  confirmButtonText: string = '确定',
  cancelButtonText: string = '取消',
  icon: SweetAlertOptions['icon'] = 'warning'
): Promise<boolean> => {
  const result = await Swal.fire({
    title,
    text,
    icon,
    showCancelButton: true,
    confirmButtonText,
    cancelButtonText,
    confirmButtonColor: '#1890ff',
    cancelButtonColor: '#999'
  })
  return result.isConfirmed
}

/**
 * 处理异常信息并显示错误提示
 * @param error - 异常对象或错误信息
 * @param title - 标题，默认 '操作失败'
 */
export const notifyException = (error: Error | { response?: { data?: { message?: string }, statusText?: string }, data?: { message?: string }, message?: string } | string, title: string = '操作失败') => {
  let message = '操作失败，请稍后重试'

  // 如果是字符串，直接使用
  if (typeof error === 'string') {
    message = error
  }
  // 如果是 Error 对象， Exception 异常
  else if (error instanceof Error) {
    message = error.message || message
  }
  // 如果是对象
  else if (error && typeof error === 'object') {
    // 优先取 response.data.message 响应错误）
    if (error.response?.data?.message) {
      message = error.response.data.message
    }
    // 取 data.message
    else if (error.data?.message) {
      message = error.data.message
    }
    // 取 message
    else if (error.message) {
      message = error.message
    }
    // 取 response.statusText
    else if (error.response?.statusText) {
      message = error.response.statusText
    }
  }

  return Swal.fire({
    ...defaultToastConfig,
    icon: 'error',
    title,
    text: message
  })
}

/**
 * 自定义 Toast
 * @param options - Swal 配置选项
 */
export const notify = (options: Partial<SweetAlertOptions>) => {
  return Swal.fire({
    ...defaultToastConfig,
    ...options
  } as SweetAlertOptions)
}

// 默认导出所有方法
export default {
  success: notifySuccess,
  error: notifyError,
  warning: notifyWarning,
  info: notifyInfo,
  confirm,
  exception: notifyException,
  notify
}

