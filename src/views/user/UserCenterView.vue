<template>
  <div class="user-center">
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
        <button
          v-for="item in menuItems"
          :key="item.key"
          :class="['menu-item', { active: activeKey === item.key }]"
          @click="activeKey = item.key"
        >
          {{ item.label }}
        </button>
      </nav>
    </aside>

    <section class="user-content">
      <header class="content-header">
        <div class="header-left">
          <h1 class="title">{{ activeItem?.label }}</h1>
          <p class="subtitle">{{ activeItem?.description }}</p>
        </div>
        <button class="logout-btn" @click="handleLogout" :disabled="logoutLoading">
          <span class="logout-icon">🚪</span>
          <span class="logout-text">{{ logoutLoading ? '退出中...' : '退出登录' }}</span>
        </button>
      </header>

      <div class="content-card" v-if="activeKey === 'overview'">
        <Overview :user-info="userInfo" @navigate="handleNavigate" />
      </div>

      <div class="content-card" v-else-if="activeKey === 'profile'">
        <ProfileForm :user-info="userInfo" @updated="handleProfileUpdated" />
      </div>

      <div class="content-card" v-else-if="activeKey === 'security'">
        <SecuritySettings :user-info="userInfo" @updated="handleProfileUpdated" />
      </div>

      <div class="content-card" v-else-if="activeKey === 'settings'">
        <h2>系统设置</h2>
        <p>预留：通知偏好、个性化设置等内容。</p>
      </div>
    </section>
  </div>
</template>

<script setup lang="ts">
import { computed, onMounted, ref } from 'vue'
import { useRouter } from 'vue-router'
import { userApi } from '@/apis/user-api/user-api'
import { authApi } from '@/apis/auth-api/auth-api'
import type { UserInfo } from '@/apis/user-api/types'
import { toastException, toastSuccess, confirm } from '@/utils/toast'
import Overview from './components/Overview.vue'
import ProfileForm from './components/ProfileForm.vue'
import SecuritySettings from './components/SecuritySettings.vue'

type MenuKey = 'overview' | 'profile' | 'security' | 'settings'

const menuItems: { key: MenuKey; label: string; description: string }[] = [
  { key: 'overview', label: '账户总览', description: '查看账户整体情况与概要信息。' },
  { key: 'profile', label: '个人资料', description: '管理您的基础信息与联系方式。' },
  { key: 'security', label: '安全设置', description: '提升账号安全，管理登录与密码。' },
  // { key: 'settings', label: '系统设置', description: '个性化您的使用体验。' },
]

const router = useRouter()

const activeKey = ref<MenuKey>('overview')

// 用户信息
const userInfo = ref<UserInfo | null>(null)
const loading = ref(false)
const logoutLoading = ref(false)

const username = computed(() => userInfo.value?.nickname || userInfo.value?.name || '游客')
const usernameFirstLetter = computed(() => username.value.charAt(0) || 'U')

const activeItem = computed(() => menuItems.find((item) => item.key === activeKey.value))

const fetchUserInfo = async () => {
  loading.value = true
  try {
    const res = await userApi.getUserInfo()
    // 这里假设后端返回格式为 { code, message, data }
    if ((res as any).data) {
      userInfo.value = (res as any).data
    } else {
      throw new Error('未获取到用户信息')
    }
  } catch (error: any) {
    await toastException(error, '获取用户信息失败')
  } finally {
    loading.value = false
  }
}

const handleProfileUpdated = (updatedUserInfo: UserInfo) => {
  // 更新本地用户信息
  userInfo.value = updatedUserInfo
}

const handleNavigate = (key: string) => {
  activeKey.value = key as MenuKey
}

// 退出登录
const handleLogout = async () => {
  const confirmed = await confirm('确认退出', '确定要退出登录吗？', '确定', '取消')
  if (!confirmed) {
    return
  }

  logoutLoading.value = true
  try {
    const res = await authApi.logout()
    if ((res as any).code === 0 || (res as any).code === 200) {
      await toastSuccess('退出登录成功')
      // 跳转到登录页
      router.push('/login')
    }
  } catch (error: any) {
    // 即使接口失败，也跳转到登录页（清除本地状态）
    await toastException(error, '退出登录失败')
    router.push('/login')
  } finally {
    logoutLoading.value = false
  }
}

onMounted(() => {
  fetchUserInfo()
})
</script>

<style scoped>
.user-center {
  min-height: 100vh;
  display: grid;
  grid-template-columns: 260px minmax(0, 1fr);
  background: linear-gradient(135deg, #f9fafb, #e5e7eb);
}

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
  gap: 8px;
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

.user-content {
  padding: 28px 32px 40px;
}

.content-header {
  margin-bottom: 20px;
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: 16px;
}

.header-left {
  flex: 1;
}

.content-header .title {
  margin: 0 0 4px;
  font-size: 22px;
  font-weight: 600;
  color: #111827;
}

.content-header .subtitle {
  margin: 0;
  font-size: 13px;
  color: #6b7280;
}

.logout-btn {
  display: flex;
  align-items: center;
  gap: 6px;
  padding: 8px 16px;
  background: #ffffff;
  border: 1px solid #ef4444;
  border-radius: 6px;
  color: #ef4444;
  font-size: 14px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s;
  white-space: nowrap;
}

.logout-btn:hover:not(:disabled) {
  background: #fee2e2;
  border-color: #dc2626;
  color: #dc2626;
  transform: translateY(-1px);
  box-shadow: 0 4px 12px rgba(239, 68, 68, 0.2);
}

.logout-btn:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

.logout-icon {
  font-size: 16px;
}

.logout-text {
  font-size: 14px;
}

.content-card {
  padding: 20px 18px;
  background: #ffffff;
  border-radius: 12px;
  box-shadow: 0 10px 26px rgba(15, 23, 42, 0.08);
  font-size: 14px;
  color: #374151;
}

.content-card h2 {
  margin: 0 0 8px;
  font-size: 18px;
  font-weight: 600;
  color: #111827;
}

@media (max-width: 768px) {
  .user-center {
    grid-template-columns: 1fr;
  }

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

  .user-content {
    padding: 20px 16px 32px;
  }

  .content-header {
    flex-direction: column;
    align-items: flex-start;
    gap: 12px;
  }

  .logout-btn {
    width: 100%;
    justify-content: center;
  }
}
</style>


