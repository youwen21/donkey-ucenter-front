import type { MenuItem } from '../constants'

// 菜单项数据由 UserSidebar 组件维护
// 这里导出扁平化的菜单项列表，供其他组件使用
export const menuItems: MenuItem[] = [
  { key: 'overview', label: '账户总览', description: '查看账户整体情况与概要信息。' },
  { key: 'profile', label: '个人资料', description: '管理您的基础信息与联系方式。' },
  { key: 'security', label: '安全设置', description: '提升账号安全，管理登录与密码。' },
]
