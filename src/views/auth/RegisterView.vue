<template>
  <div class="auth-wrapper">
    <div class="auth-page">
      <h1 class="auth-title">注册</h1>
      <form class="auth-form" @submit.prevent="onSubmit">
      <div class="form-item">
        <label for="username">用户名</label>
        <input
          id="username"
          v-model="form.username"
          type="text"
          placeholder="请输入用户名"
          required
        />
      </div>
      <div class="form-item">
        <label for="password">密码</label>
        <input
          id="password"
          v-model="form.password"
          type="password"
          placeholder="请输入密码"
          required
        />
      </div>
        <div class="form-item">
          <label for="confirmPassword">确认密码</label>
          <input
            id="confirmPassword"
            v-model="confirmPassword"
            type="password"
            placeholder="请再次输入密码"
            required
          />
        </div>
        <div class="form-item form-item-inline">
          <RouterLink to="/login" class="link">已有账号？去登录</RouterLink>
        </div>
        <button type="submit" class="btn primary">注册</button>
      </form>
    </div>
  </div>
</template>

<script setup lang="ts">
import { reactive, ref } from 'vue'
import { useRouter } from 'vue-router'
import type { AuthForm } from '@/apis/auth-api/types'
import { userPublicApi } from '@/apis/user-api/user-public-api'
import { toastError, toastSuccess, toastException } from '@/utils/toast'

const router = useRouter()

const form = reactive<AuthForm>({
  username: '',
  password: '',
  remember: false,
})

const confirmPassword = ref('')
const loading = ref(false)

const onSubmit = async () => {
  if (form.password !== confirmPassword.value) {
    toastError('两次密码输入不一致')
    return
  }

  loading.value = true
  try {
    const res = await userPublicApi.register(form)
    // 假设后端返回格式为 { code, message, data }
    if ((res as any).code === 0 || (res as any).code === 200) {
      await toastSuccess('注册成功')
      // 注册成功后跳转到登录页
      router.push('/login')
    } else {
      // 有 code 但非成功，优先展示后端 message
      toastError((res as any).message || '注册失败')
    }
  } catch (error: any) {
    await toastException(error, '注册失败')
  } finally {
    loading.value = false
  }
}
</script>

<style scoped>
.auth-wrapper {
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 40px 24px;
  background: radial-gradient(circle at top left, #e0f2fe 0, transparent 55%),
    radial-gradient(circle at bottom right, #fee2e2 0, transparent 55%),
    linear-gradient(135deg, #f9fafb, #e5e7eb);
}

.auth-page {
  max-width: 100%;
  width: 420px;
  margin: 80px auto;
  padding: 32px 28px;
  background: #ffffff;
  border-radius: 12px;
  box-shadow: 0 10px 30px rgba(15, 23, 42, 0.08);
}

.auth-title {
  margin: 0 0 24px;
  font-size: 24px;
  font-weight: 600;
  text-align: center;
  color: #111827;
}

.auth-form {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.form-item {
  display: flex;
  flex-direction: column;
  gap: 6px;
  font-size: 14px;
}

.form-item-inline {
  flex-direction: row;
  align-items: center;
  justify-content: flex-end;
}

label {
  color: #374151;
}

input[type='text'],
input[type='password'] {
  padding: 8px 10px;
  border-radius: 6px;
  border: 1px solid #d1d5db;
  font-size: 14px;
  transition: border-color 0.2s, box-shadow 0.2s;
}

input[type='text']:focus,
input[type='password']:focus {
  outline: none;
  border-color: #3b82f6;
  box-shadow: 0 0 0 1px rgba(59, 130, 246, 0.3);
}

.btn {
  margin-top: 8px;
  padding: 10px 16px;
  border-radius: 999px;
  border: none;
  font-size: 15px;
  cursor: pointer;
  transition: background-color 0.2s, box-shadow 0.2s, transform 0.05s;
}

.btn.primary {
  background: linear-gradient(135deg, #2563eb, #1d4ed8);
  color: #ffffff;
  box-shadow: 0 8px 18px rgba(37, 99, 235, 0.3);
}

.btn.primary:hover {
  background: linear-gradient(135deg, #1d4ed8, #1e40af);
  box-shadow: 0 10px 24px rgba(30, 64, 175, 0.35);
}

.btn:active {
  transform: translateY(1px);
  box-shadow: 0 6px 14px rgba(37, 99, 235, 0.25);
}

.link {
  font-size: 13px;
  color: #2563eb;
  text-decoration: none;
}

.link:hover {
  text-decoration: underline;
}
</style>


