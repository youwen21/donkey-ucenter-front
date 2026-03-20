export type MenuKey = 'overview' | 'profile' | 'security' | 'settings'

export interface MenuItem {
  key: MenuKey
  label: string
  description: string
}

export interface MenuGroup {
  items: MenuItem[]
}

