<template>
  <div class="profile-form">
    <form @submit.prevent="handleSubmit" class="form">
      <div class="form-section">
        <h3 class="section-title">基本信息</h3>
        
        <div class="form-item">
          <label for="name">登录名</label>
          <input
            id="name"
            :value="userInfo?.name"
            type="text"
            disabled
            class="input disabled"
          />
          <p class="form-hint">登录名不可修改</p>
        </div>

        <div class="form-item">
          <label for="nickname">称呼</label>
          <input
            id="nickname"
            v-model="formData.nickname"
            type="text"
            placeholder="请输入您的称呼"
            class="input"
          />
        </div>

        <div class="form-item">
          <label for="avatar">头像</label>
          <div class="avatar-section">
            <div class="avatar-preview">
              <img
                v-if="formData.avatar"
                :src="formData.avatar"
                alt="头像预览"
                class="avatar-image"
                @error="handleAvatarError"
              />
              <div v-else class="avatar-placeholder">
                <span>{{ avatarPlaceholder }}</span>
              </div>
            </div>
            <div class="avatar-input-group">
              <input
                id="avatar"
                v-model="formData.avatar"
                type="text"
                placeholder="请输入头像URL或上传头像"
                class="input"
              />
              <input
                ref="fileInputRef"
                type="file"
                accept="image/*"
                class="file-input"
                @change="handleFileSelect"
              />
              <button
                type="button"
                class="btn btn-upload"
                @click="triggerFileInput"
              >
                选择图片
              </button>
            </div>
            <p class="form-hint">支持 JPG、PNG 等图片格式，或直接输入图片 URL</p>
          </div>
        </div>

      </div>

      <div class="form-actions">
        <button type="button" class="btn btn-secondary" @click="handleReset">重置</button>
        <button type="submit" class="btn btn-primary" :disabled="loading">
          {{ loading ? '保存中...' : '保存' }}
        </button>
      </div>
    </form>
  </div>
</template>

<script setup lang="ts">
import { reactive, watch, ref, computed } from 'vue'
import type { UserInfo } from '@/apis/user-api/types'
import { userApi } from '@/apis/user-api/user-api'
import { toastSuccess, toastError, toastException } from '@/utils/toast'

interface Props {
  userInfo: UserInfo | null
}

const props = defineProps<Props>()

const emit = defineEmits<{
  updated: [userInfo: UserInfo]
}>()

const loading = ref(false)
const fileInputRef = ref<HTMLInputElement | null>(null)

const formData = reactive({
  nickname: '',
  avatar: '',
  email: '',
  phone: '',
})

// 头像占位符（显示昵称或用户名的首字母）
const avatarPlaceholder = computed(() => {
  const name = formData.nickname || props.userInfo?.name || 'U'
  return name.charAt(0).toUpperCase()
})

// 初始化表单数据
const initFormData = () => {
  if (props.userInfo) {
    formData.nickname = props.userInfo.nickname || ''
    formData.avatar = props.userInfo.avatar || ''
    formData.email = props.userInfo.email || ''
    formData.phone = props.userInfo.phone || ''
  }
}

// 监听 userInfo 变化，更新表单
watch(() => props.userInfo, initFormData, { immediate: true })

// 重置表单
const handleReset = () => {
  initFormData()
}

// 触发文件选择
const triggerFileInput = () => {
  fileInputRef.value?.click()
}

// 处理文件选择
const handleFileSelect = (event: Event) => {
  const target = event.target as HTMLInputElement
  const file = target.files?.[0]
  if (!file) return

  // 验证文件类型
  if (!file.type.startsWith('image/')) {
    toastError('请选择图片文件')
    return
  }

  // 验证文件大小（限制为 5MB）
  if (file.size > 5 * 1024 * 1024) {
    toastError('图片大小不能超过 5MB')
    return
  }

  // 读取文件并转换为 base64 或 Data URL
  const reader = new FileReader()
  reader.onload = (e) => {
    const result = e.target?.result
    if (typeof result === 'string') {
      formData.avatar = result
    }
  }
  reader.onerror = () => {
    toastError('图片读取失败')
  }
  reader.readAsDataURL(file)
}

// 处理头像加载错误
const handleAvatarError = () => {
  formData.avatar = ''
  toastError('头像加载失败，请检查图片 URL')
}

// 提交表单
const handleSubmit = async () => {
  if (!props.userInfo) {
    toastError('用户信息不存在')
    return
  }

  loading.value = true
  try {
    const res = await userApi.updateUserInfo({
      ...props.userInfo,
      nickname: formData.nickname,
      avatar: formData.avatar,
    } as UserInfo)

    // 假设后端返回格式为 { code, message, data }
    if ((res as any).code === 0 || (res as any).code === 200) {
      await toastSuccess('保存成功')
      // 触发更新事件，传递更新后的用户信息
      if ((res as any).data) {
        emit('updated', (res as any).data)
      }
    } else {
      toastError((res as any).message || '保存失败')
    }
  } catch (error: any) {
    await toastException(error, '保存失败')
  } finally {
    loading.value = false
  }
}
</script>

<style scoped>
.profile-form {
  width: 100%;
}

.form {
  display: flex;
  flex-direction: column;
  gap: 24px;
}

.form-section {
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.section-title {
  margin: 0 0 8px;
  font-size: 16px;
  font-weight: 600;
  color: #111827;
  padding-bottom: 12px;
  border-bottom: 1px solid #e5e7eb;
}

.form-item {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.form-item label {
  font-size: 14px;
  font-weight: 500;
  color: #374151;
}

.input {
  padding: 10px 12px;
  border: 1px solid #d1d5db;
  border-radius: 6px;
  font-size: 14px;
  color: #111827;
  background: #ffffff;
  transition: border-color 0.2s, box-shadow 0.2s;
}

.input:focus {
  outline: none;
  border-color: #2563eb;
  box-shadow: 0 0 0 3px rgba(37, 99, 235, 0.1);
}

.input.disabled {
  background: #f3f4f6;
  color: #6b7280;
  cursor: not-allowed;
}

.form-hint {
  margin: 0;
  font-size: 12px;
  color: #6b7280;
}

.avatar-section {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.avatar-preview {
  width: 100px;
  height: 100px;
  border-radius: 50%;
  overflow: hidden;
  border: 2px solid #e5e7eb;
  background: #f3f4f6;
  display: flex;
  align-items: center;
  justify-content: center;
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
  background: linear-gradient(135deg, #2563eb, #1d4ed8);
  color: #ffffff;
  font-size: 36px;
  font-weight: 600;
}

.avatar-input-group {
  display: flex;
  gap: 8px;
  align-items: center;
}

.avatar-input-group .input {
  flex: 1;
}

.file-input {
  display: none;
}

.btn-upload {
  padding: 10px 16px;
  border-radius: 6px;
  border: 1px solid #d1d5db;
  font-size: 14px;
  font-weight: 500;
  background: #ffffff;
  color: #374151;
  cursor: pointer;
  white-space: nowrap;
  transition: background-color 0.2s, border-color 0.2s;
}

.btn-upload:hover {
  background: #f9fafb;
  border-color: #9ca3af;
}

.form-actions {
  display: flex;
  gap: 12px;
  justify-content: flex-end;
  padding-top: 8px;
  border-top: 1px solid #e5e7eb;
}

.btn {
  padding: 10px 20px;
  border-radius: 6px;
  border: none;
  font-size: 14px;
  font-weight: 500;
  cursor: pointer;
  transition: background-color 0.2s, transform 0.05s;
}

.btn:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

.btn-primary {
  background: linear-gradient(135deg, #2563eb, #1d4ed8);
  color: #ffffff;
  box-shadow: 0 4px 12px rgba(37, 99, 235, 0.3);
}

.btn-primary:hover:not(:disabled) {
  background: linear-gradient(135deg, #1d4ed8, #1e40af);
  box-shadow: 0 6px 16px rgba(30, 64, 175, 0.35);
}

.btn-primary:active:not(:disabled) {
  transform: translateY(1px);
}

.btn-secondary {
  background: #ffffff;
  color: #374151;
  border: 1px solid #d1d5db;
}

.btn-secondary:hover {
  background: #f9fafb;
  border-color: #9ca3af;
}

.btn-secondary:active {
  transform: translateY(1px);
}

@media (max-width: 768px) {
  .form-actions {
    flex-direction: column;
  }

  .btn {
    width: 100%;
  }
}
</style>

