<template>
  <header class="content-header">
    <div class="header-left">
      <h1 class="title">{{ title }}</h1>
      <p class="subtitle">{{ subtitle }}</p>
    </div>
    <button class="logout-btn" @click="handleLogout" :disabled="logoutLoading">
      <span class="logout-icon">🚪</span>
      <span class="logout-text">{{ logoutLoading ? '退出中...' : '退出登录' }}</span>
    </button>
  </header>
</template>

<script setup lang="ts">
import { userCenterStore } from '@/stores/userCenter'

interface Props {
  logoutLoading?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  logoutLoading: false,
})

const emit = defineEmits<{
  logout: []
}>()

const { title, subtitle } = userCenterStore.state

const handleLogout = () => {
  emit('logout')
}
</script>

<style scoped>
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

@media (max-width: 768px) {
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

