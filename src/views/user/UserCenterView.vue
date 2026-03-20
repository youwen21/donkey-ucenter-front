<template>
  <div class="user-center">
    <UserSidebar
      :user-info="userInfo"
      v-model:active-key="activeKey"
    />

    <section class="user-content">
      <ContentHeader
        :logout-loading="logoutLoading"
        @logout="handleLogout"
      />

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
import { onMounted, ref } from 'vue'
import { useRouter } from 'vue-router'
import { userApi } from '@/apis/user-api/user-api'
import { authApi } from '@/apis/auth-api/auth-api'
import type { UserInfo } from '@/apis/user-api/types'
import { toastException, toastSuccess, confirm } from '@/utils/toast'
import Overview from './components/Overview.vue'
import ProfileForm from './components/ProfileForm.vue'
import SecuritySettings from './components/SecuritySettings.vue'
import UserSidebar from './components/UserSidebar.vue'
import ContentHeader from './components/ContentHeader.vue'
import { userCenterStore } from '@/stores/userCenter'
import { menuItems } from './components/menuItems'
import type { MenuKey } from './constants'

const router = useRouter()

const activeKey = ref<MenuKey>('overview')

// 用户信息
const userInfo = ref<UserInfo | null>(null)
const loading = ref(false)
const logoutLoading = ref(false)

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
  const menuKey = key as MenuKey
  activeKey.value = menuKey
  
  // 更新 store 中的 header 信息
  const item = menuItems.find((item) => item.key === menuKey)
  if (item) {
    userCenterStore.setHeader(item.label, item.description)
  }
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
  // 初始化 header 为默认菜单项
  userCenterStore.setHeader('账户总览', '查看账户整体情况与概要信息。')
})
</script>

<style scoped>
.user-center {
  min-height: 100vh;
  display: grid;
  grid-template-columns: 260px minmax(0, 1fr);
  background: linear-gradient(135deg, #f9fafb, #e5e7eb);
}


.user-content {
  padding: 28px 32px 40px;
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

  .user-content {
    padding: 20px 16px 32px;
  }
}
</style>


