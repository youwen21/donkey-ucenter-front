<template>
  <aside class="user-sidebar">
    <div class="user-profile">
      <div class="avatar">
        <span>{{ usernameFirstLetter }}</span>
      </div>
      <div class="info">
        <h2 class="name">{{ username }}</h2>
        <p class="role">普通用户</p>
      </div>
    </div>

    <nav class="menu">
      <div
        v-for="(group, groupIndex) in menuGroups"
        :key="groupIndex"
        class="menu-group"
      >
        <button
          v-for="item in group.items"
          :key="item.key"
          :class="['menu-item', { active: activeKey === item.key }]"
          @click="handleMenuClick(item.key)"
        >
          {{ item.label }}
        </button>
      </div>
    </nav>
  </aside>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import type { UserInfo } from '@/apis/user-api/types'
import { userCenterStore } from '@/stores/userCenter'
import type { MenuKey, MenuItem, MenuGroup } from '../constants'

interface Props {
  userInfo: UserInfo | null
  activeKey: MenuKey
}

const props = defineProps<Props>()

const emit = defineEmits<{
  'update:activeKey': [key: MenuKey]
}>()

// 菜单数据在此组件中维护
// 分组菜单：账户总览一组，业务一组，个人资料和安全设置一组
const menuGroups: MenuGroup[] = [
  {
    // 账户总览组
    items: [
      { key: 'overview', label: '账户总览', description: '查看账户整体情况与概要信息。' },
    ],
  },
  // {
  //   // 业务组
  //   items: [
  //     { key: 'i18n', label: 'i18n项目', description: '管理国际化项目配置。' },
  //     { key: 'ai-key', label: 'AI大模型key配置', description: '配置和管理AI大模型的API密钥。' },
  //   ],
  // },
  {
    // 个人资料和安全设置组
    items: [
      { key: 'profile', label: '个人资料', description: '管理您的基础信息与联系方式。' },
      { key: 'security', label: '安全设置', description: '提升账号安全，管理登录与密码。' },
    ],
  },
]

// 扁平化的菜单项列表，用于查找等操作
const menuItems: MenuItem[] = menuGroups.flatMap((group) => group.items)

const username = computed(() => props.userInfo?.nickname || props.userInfo?.name || '游客')
const usernameFirstLetter = computed(() => username.value.charAt(0) || 'U')

const handleMenuClick = (key: MenuKey) => {
  const item = menuItems.find((item) => item.key === key)
  if (item) {
    userCenterStore.setHeader(item.label, item.description)
  }
  emit('update:activeKey', key)
}
</script>

<style scoped>
.user-sidebar {
  padding: 24px 20px;
  background: #0f172a;
  color: #e5e7eb;
  display: flex;
  flex-direction: column;
  gap: 24px;
}

.user-profile {
  display: flex;
  align-items: center;
  gap: 12px;
}

.avatar {
  width: 44px;
  height: 44px;
  border-radius: 999px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: radial-gradient(circle at 30% 20%, #38bdf8, #2563eb);
  color: #ffffff;
  font-weight: 600;
  font-size: 20px;
  box-shadow: 0 6px 18px rgba(37, 99, 235, 0.5);
}

.info .name {
  margin: 0;
  font-size: 18px;
  font-weight: 600;
}

.info .role {
  margin: 2px 0 0;
  font-size: 12px;
  opacity: 0.8;
}

.menu {
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.menu-group {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.menu-group:not(:last-child) {
  padding-bottom: 20px;
  border-bottom: 1px solid rgba(148, 163, 184, 0.2);
}

.menu-item {
  text-align: left;
  padding: 10px 12px;
  border-radius: 8px;
  border: none;
  background: transparent;
  color: #cbd5f5;
  font-size: 14px;
  cursor: pointer;
  transition: background-color 0.15s, color 0.15s, transform 0.05s;
}

.menu-item:hover {
  background: rgba(148, 163, 184, 0.16);
}

.menu-item.active {
  background: linear-gradient(135deg, #2563eb, #1d4ed8);
  color: #ffffff;
  transform: translateY(1px);
}

@media (max-width: 768px) {
  .user-sidebar {
    flex-direction: row;
    align-items: center;
    justify-content: space-between;
  }

  .menu {
    flex-direction: row;
    flex-wrap: wrap;
    justify-content: flex-end;
  }

  .menu-item {
    font-size: 13px;
    padding: 6px 10px;
  }
}
</style>

