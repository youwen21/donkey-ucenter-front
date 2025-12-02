<template>
  <div class="overview">
    <!-- 用户基本信息卡片 -->
    <div class="info-card">
      <div class="user-header">
        <div class="avatar-wrapper">
          <img
            v-if="userInfo?.avatar"
            :src="userInfo.avatar"
            alt="头像"
            class="avatar-image"
            @error="handleAvatarError"
          />
          <div v-else class="avatar-placeholder">
            <span>{{ avatarPlaceholder }}</span>
          </div>
        </div>
        <div class="user-info">
          <h2 class="user-name">{{ userInfo?.nickname || userInfo?.name || '游客' }}</h2>
          <p class="user-id">ID: {{ userInfo?.id || '-' }}</p>
        </div>
      </div>
    </div>

    <!-- 账户信息网格 -->
    <div class="info-grid">
      <div class="info-item">
        <div class="info-label">
          <span class="info-icon">👤</span>
          <span>登录名</span>
        </div>
        <div class="info-value">{{ userInfo?.name || '-' }}</div>
      </div>

      <div class="info-item">
        <div class="info-label">
          <span class="info-icon">📧</span>
          <span>邮箱</span>
        </div>
        <div class="info-value">
          <span v-if="userInfo?.email" class="value-text">{{ userInfo.email }}</span>
          <span v-else class="value-empty">未绑定</span>
        </div>
      </div>

      <div class="info-item">
        <div class="info-label">
          <span class="info-icon">📱</span>
          <span>手机号</span>
        </div>
        <div class="info-value">
          <span v-if="userInfo?.phone" class="value-text">{{ userInfo.phone }}</span>
          <span v-else class="value-empty">未绑定</span>
        </div>
      </div>

      <div class="info-item">
        <div class="info-label">
          <span class="info-icon">📅</span>
          <span>注册时间</span>
        </div>
        <div class="info-value">{{ formatDate(userInfo?.create_time) }}</div>
      </div>

      <div class="info-item">
        <div class="info-label">
          <span class="info-icon">✅</span>
          <span>账户状态</span>
        </div>
        <div class="info-value">
          <span :class="['status-badge', getStatusClass(userInfo?.status)]">
            {{ getStatusText(userInfo?.status) }}
          </span>
        </div>
      </div>
    </div>

    <!-- 快捷操作 -->
    <div class="quick-actions">
      <h3 class="section-title">快捷操作</h3>
      <div class="actions-grid">
        <button class="action-btn" @click="$emit('navigate', 'profile')">
          <span class="action-icon">✏️</span>
          <span class="action-text">编辑资料</span>
        </button>
        <button class="action-btn" @click="$emit('navigate', 'security')">
          <span class="action-icon">🔒</span>
          <span class="action-text">安全设置</span>
        </button>
      </div>
    </div>

  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import type { UserInfo } from '@/apis/user-api/types'

interface Props {
  userInfo: UserInfo | null
}

const props = defineProps<Props>()

const emit = defineEmits<{
  navigate: [key: string]
}>()

// 头像占位符
const avatarPlaceholder = computed(() => {
  const name = props.userInfo?.nickname || props.userInfo?.name || 'U'
  return name.charAt(0).toUpperCase()
})

// 处理头像加载错误
const handleAvatarError = () => {
  // 头像加载失败时，可以在这里处理
}

// 格式化日期
const formatDate = (date: string | null | undefined): string => {
  if (!date) return '-'
  try {
    const d = new Date(date)
    return d.toLocaleDateString('zh-CN', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
    })
  } catch {
    return date
  }
}

// 获取状态文本
const getStatusText = (status: number | undefined): string => {
  if (status === undefined || status === null) return '未知'
  // 假设 1 表示正常，0 表示禁用等，根据实际业务调整
  switch (status) {
    case 1:
      return '正常'
    case 0:
      return '禁用'
    default:
      return '未知'
  }
}

// 获取状态样式类
const getStatusClass = (status: number | undefined): string => {
  if (status === undefined || status === null) return 'status-unknown'
  switch (status) {
    case 1:
      return 'status-active'
    case 0:
      return 'status-inactive'
    default:
      return 'status-unknown'
  }
}
</script>

<style scoped>
.overview {
  width: 100%;
  display: flex;
  flex-direction: column;
  gap: 24px;
}

.info-card {
  padding: 24px;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  border-radius: 12px;
  color: #ffffff;
}

.user-header {
  display: flex;
  align-items: center;
  gap: 16px;
}

.avatar-wrapper {
  width: 80px;
  height: 80px;
  border-radius: 50%;
  overflow: hidden;
  border: 3px solid rgba(255, 255, 255, 0.3);
  background: rgba(255, 255, 255, 0.2);
  flex-shrink: 0;
}

.avatar-image {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.avatar-placeholder {
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  background: rgba(255, 255, 255, 0.2);
  color: #ffffff;
  font-size: 32px;
  font-weight: 600;
}

.user-info {
  flex: 1;
}

.user-name {
  margin: 0 0 4px;
  font-size: 24px;
  font-weight: 600;
  color: #ffffff;
}

.user-id {
  margin: 0;
  font-size: 14px;
  opacity: 0.9;
  color: #ffffff;
}

.info-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 16px;
}

.info-item {
  padding: 16px;
  background: #f9fafb;
  border-radius: 8px;
  border: 1px solid #e5e7eb;
}

.info-label {
  display: flex;
  align-items: center;
  gap: 8px;
  margin-bottom: 8px;
  font-size: 13px;
  color: #6b7280;
  font-weight: 500;
}

.info-icon {
  font-size: 16px;
}

.info-value {
  font-size: 15px;
  color: #111827;
  font-weight: 500;
}

.value-text {
  color: #111827;
}

.value-empty {
  color: #9ca3af;
  font-style: italic;
}

.status-badge {
  display: inline-block;
  padding: 4px 12px;
  border-radius: 12px;
  font-size: 12px;
  font-weight: 500;
}

.status-active {
  background: #d1fae5;
  color: #065f46;
}

.status-inactive {
  background: #fee2e2;
  color: #991b1b;
}

.status-unknown {
  background: #f3f4f6;
  color: #6b7280;
}

.quick-actions {
  padding: 20px;
  background: #f9fafb;
  border-radius: 8px;
  border: 1px solid #e5e7eb;
}

.section-title {
  margin: 0 0 16px;
  font-size: 16px;
  font-weight: 600;
  color: #111827;
}

.actions-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
  gap: 12px;
}

.action-btn {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 8px;
  padding: 16px;
  background: #ffffff;
  border: 1px solid #e5e7eb;
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.2s;
}

.action-btn:hover {
  background: #f9fafb;
  border-color: #2563eb;
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(37, 99, 235, 0.15);
}

.action-icon {
  font-size: 24px;
}

.action-text {
  font-size: 14px;
  color: #374151;
  font-weight: 500;
}

@media (max-width: 768px) {
  .info-grid {
    grid-template-columns: 1fr;
  }

  .actions-grid {
    grid-template-columns: 1fr;
  }

  .user-header {
    flex-direction: column;
    text-align: center;
  }
}
</style>

