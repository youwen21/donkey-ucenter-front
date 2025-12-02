<template>
  <div class="security-settings">
    <!-- 修改密码 -->
    <div class="form-section">
      <h3 class="section-title">修改密码</h3>
      <form @submit.prevent="handleChangePassword" class="form">
        <div class="form-item">
          <label for="oldPassword">密码</label>
          <input
            id="oldPassword"
            v-model="passwordForm.oldPassword"
            type="password"
            placeholder="请输入当前密码"
            class="input"
            required
          />
        </div>

        <div class="form-item">
          <label for="newPassword">新密码</label>
          <input
            id="newPassword"
            v-model="passwordForm.newPassword"
            type="password"
            placeholder="请输入新密码"
            class="input"
            required
            minlength="6"
          />
          <p class="form-hint">密码长度至少6位</p>
        </div>

        <div class="form-item">
          <label for="confirmNewPassword">确认新密码</label>
          <input
            id="confirmNewPassword"
            v-model="passwordForm.confirmNewPassword"
            type="password"
            placeholder="请再次输入新密码"
            class="input"
            required
          />
        </div>

        <div class="form-actions">
          <button type="button" class="btn btn-secondary" @click="handleResetPassword">重置</button>
          <button type="submit" class="btn btn-primary" :disabled="passwordLoading">
            {{ passwordLoading ? '修改中...' : '修改密码' }}
          </button>
        </div>
      </form>
    </div>

    <!-- 绑定/更换邮箱 -->
    <div class="form-section">
      <h3 class="section-title">邮箱绑定</h3>
      <div v-if="userInfo?.email && !showChangeEmail" class="email-status">
        <div class="status-item">
          <span class="status-label">当前邮箱：</span>
          <span class="status-value">{{ userInfo.email }}</span>
        </div>
        <p class="form-hint">邮箱已绑定</p>
        <button type="button" class="btn btn-change" @click="showChangeEmail = true">
          更换邮箱
        </button>
      </div>
      <!-- 更换邮箱表单 -->
      <form v-else-if="userInfo?.email && showChangeEmail" @submit.prevent="handleChangeEmail" class="form">
        <div class="form-item">
          <label for="currentEmail">当前邮箱</label>
          <input
            id="currentEmail"
            :value="userInfo.email"
            type="email"
            disabled
            class="input disabled"
          />
        </div>

        <div class="form-item">
          <label for="newEmail">新邮箱地址</label>
          <input
            id="newEmail"
            v-model="changeEmailForm.newEmail"
            type="email"
            placeholder="请输入新邮箱地址"
            class="input"
            required
          />
        </div>

        <div v-if="changeEmailCodeSent" class="form-item">
          <label for="changeEmailCode">验证码</label>
          <div class="code-input-group">
            <input
              id="changeEmailCode"
              v-model="changeEmailForm.code"
              type="text"
              placeholder="请输入新邮箱收到的验证码"
              class="input"
              required
              maxlength="6"
            />
            <button
              type="button"
              class="btn btn-code"
              :disabled="changeEmailCodeCountdown > 0"
              @click="handleSendChangeEmailCode"
            >
              {{ changeEmailCodeCountdown > 0 ? `${changeEmailCodeCountdown}秒后重发` : '发送验证码' }}
            </button>
          </div>
        </div>

        <div class="form-item">
          <label for="changeEmailPassword">密码</label>
          <input
            id="changeEmailPassword"
            v-model="changeEmailForm.password"
            type="password"
            placeholder="请输入密码以验证身份"
            class="input"
            required
          />
          <p class="form-hint">请输入当前密码以验证身份</p>
        </div>

        <div class="form-actions">
          <button
            type="button"
            class="btn btn-secondary"
            @click="handleCancelChangeEmail"
          >
            取消
          </button>
          <button
            v-if="!changeEmailCodeSent"
            type="button"
            class="btn btn-primary"
            :disabled="changeEmailLoading"
            @click="handleSendChangeEmailCode"
          >
            {{ changeEmailLoading ? '发送中...' : '发送验证码' }}
          </button>
          <button
            v-else
            type="submit"
            class="btn btn-primary"
            :disabled="changeEmailLoading"
          >
            {{ changeEmailLoading ? '更换中...' : '确认更换' }}
          </button>
        </div>
      </form>
      <!-- 绑定邮箱表单（未绑定状态） -->
      <form v-else @submit.prevent="handleSendEmailCode" class="form">
        <div class="form-item">
          <label for="email">邮箱地址</label>
          <input
            id="email"
            v-model="emailForm.email"
            type="email"
            placeholder="请输入邮箱地址"
            class="input"
            required
          />
        </div>

        <div v-if="emailSent" class="form-item">
          <label for="emailCode">验证码</label>
          <div class="code-input-group">
            <input
              id="emailCode"
              v-model="emailForm.code"
              type="text"
              placeholder="请输入验证码"
              class="input"
              required
              maxlength="6"
            />
            <button
              type="button"
              class="btn btn-code"
              :disabled="emailCodeCountdown > 0"
              @click="handleSendEmailCode"
            >
              {{ emailCodeCountdown > 0 ? `${emailCodeCountdown}秒后重发` : '发送验证码' }}
            </button>
          </div>
        </div>

        <div class="form-actions">
          <button
            v-if="!emailSent"
            type="submit"
            class="btn btn-primary"
            :disabled="emailLoading"
          >
            {{ emailLoading ? '发送中...' : '发送验证码' }}
          </button>
          <template v-else>
            <button
              type="button"
              class="btn btn-secondary"
              @click="handleCancelBindEmail"
            >
              取消
            </button>
            <button
              type="button"
              class="btn btn-primary"
              :disabled="emailLoading"
              @click="handleConfirmBindEmail"
            >
              {{ emailLoading ? '绑定中...' : '确认绑定' }}
            </button>
          </template>
        </div>
      </form>
    </div>

    <!-- 绑定手机号 -->
    <!-- <div class="form-section">
      <h3 class="section-title">手机号绑定</h3>
      <div v-if="userInfo?.phone" class="email-status">
        <div class="status-item">
          <span class="status-label">当前手机号：</span>
          <span class="status-value">{{ userInfo.phone }}</span>
        </div>
        <p class="form-hint">手机号已绑定</p>
      </div>
      <form v-else @submit.prevent="handleSendPhoneCode" class="form">
        <div class="form-item">
          <label for="phone">手机号</label>
          <input
            id="phone"
            v-model="phoneForm.phone"
            type="tel"
            placeholder="请输入手机号"
            class="input"
            required
            pattern="[0-9]{11}"
            maxlength="11"
          />
          <p class="form-hint">请输入11位手机号码</p>
        </div>

        <div v-if="phoneSent" class="form-item">
          <label for="phoneCode">验证码</label>
          <div class="code-input-group">
            <input
              id="phoneCode"
              v-model="phoneForm.code"
              type="text"
              placeholder="请输入验证码"
              class="input"
              required
              maxlength="6"
            />
            <button
              type="button"
              class="btn btn-code"
              :disabled="phoneCodeCountdown > 0"
              @click="handleSendPhoneCode"
            >
              {{ phoneCodeCountdown > 0 ? `${phoneCodeCountdown}秒后重发` : '发送验证码' }}
            </button>
          </div>
        </div>

        <div class="form-actions">
          <button
            v-if="!phoneSent"
            type="submit"
            class="btn btn-primary"
            :disabled="phoneLoading"
          >
            {{ phoneLoading ? '发送中...' : '发送验证码' }}
          </button>
          <template v-else>
            <button
              type="button"
              class="btn btn-secondary"
              @click="handleCancelBindPhone"
            >
              取消
            </button>
            <button
              type="button"
              class="btn btn-primary"
              :disabled="phoneLoading"
              @click="handleConfirmBindPhone"
            >
              {{ phoneLoading ? '绑定中...' : '确认绑定' }}
            </button>
          </template>
        </div>
      </form>
    </div> -->

  </div>
</template>

<script setup lang="ts">
import { reactive, ref } from 'vue'
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

// 修改密码相关
const passwordLoading = ref(false)
const passwordForm = reactive({
  oldPassword: '',
  newPassword: '',
  confirmNewPassword: '',
})

// 绑定邮箱相关
const emailLoading = ref(false)
const emailSent = ref(false)
const emailCodeCountdown = ref(0)
const emailForm = reactive({
  email: '',
  code: '',
})

// 更换邮箱相关
const showChangeEmail = ref(false)
const changeEmailLoading = ref(false)
const changeEmailCodeSent = ref(false)
const changeEmailCodeCountdown = ref(0)
const changeEmailForm = reactive({
  newEmail: '',
  code: '',
  password: '',
})

// 绑定手机号相关
const phoneLoading = ref(false)
const phoneSent = ref(false)
const phoneCodeCountdown = ref(0)
const phoneForm = reactive({
  phone: '',
  code: '',
})

// 重置密码表单
const handleResetPassword = () => {
  passwordForm.oldPassword = ''
  passwordForm.newPassword = ''
  passwordForm.confirmNewPassword = ''
}

// 修改密码
const handleChangePassword = async () => {
  if (passwordForm.newPassword !== passwordForm.confirmNewPassword) {
    toastError('两次输入的新密码不一致')
    return
  }

  if (passwordForm.newPassword.length < 6) {
    toastError('新密码长度至少6位')
    return
  }

  passwordLoading.value = true
  try {
    const res = await userApi.changePwd({
      oldPassword: passwordForm.oldPassword,
      newPassword: passwordForm.newPassword,
    })

    if ((res as any).code === 0 || (res as any).code === 200) {
      await toastSuccess('密码修改成功')
      handleResetPassword()
    } else {
      toastError((res as any).message || '密码修改失败')
    }
  } catch (error: any) {
    await toastException(error, '密码修改失败')
  } finally {
    passwordLoading.value = false
  }
}

// 发送邮箱验证码
const handleSendEmailCode = async () => {
  if (!emailForm.email) {
    toastError('请输入邮箱地址')
    return
  }

  emailLoading.value = true
  try {
    const res = await userApi.bindEmail({
      email: emailForm.email,
    })

    if ((res as any).code === 0 || (res as any).code === 200) {
      await toastSuccess('验证码已发送，请查收邮箱')
      emailSent.value = true
      startEmailCountdown()
    } else {
      toastError((res as any).message || '发送验证码失败')
    }
  } catch (error: any) {
    await toastException(error, '发送验证码失败')
  } finally {
    emailLoading.value = false
  }
}

// 确认绑定邮箱
const handleConfirmBindEmail = async () => {
  if (!emailForm.code) {
    toastError('请输入验证码')
    return
  }

  emailLoading.value = true
  try {
    const res = await userApi.bindEmailConfirm({
      email: emailForm.email,
      code: emailForm.code,
    })

    if ((res as any).code === 0 || (res as any).code === 200) {
      await toastSuccess('邮箱绑定成功')
      // 重新获取用户信息
      const userInfoRes = await userApi.getUserInfo()
      if ((userInfoRes as any).data) {
        emit('updated', (userInfoRes as any).data)
      }
      // 重置表单
      emailForm.email = ''
      emailForm.code = ''
      emailSent.value = false
    } else {
      toastError((res as any).message || '邮箱绑定失败')
    }
  } catch (error: any) {
    await toastException(error, '邮箱绑定失败')
  } finally {
    emailLoading.value = false
  }
}

// 取消绑定邮箱
const handleCancelBindEmail = () => {
  emailForm.email = ''
  emailForm.code = ''
  emailSent.value = false
  emailCodeCountdown.value = 0
}

// 发送更换邮箱验证码
const handleSendChangeEmailCode = async () => {
  if (!changeEmailForm.newEmail) {
    toastError('请输入新邮箱地址')
    return
  }

  // 验证新邮箱不能和当前邮箱相同
  if (props.userInfo?.email && changeEmailForm.newEmail === props.userInfo.email) {
    toastError('新邮箱不能与当前邮箱相同')
    return
  }

  changeEmailLoading.value = true
  try {
    // 使用 bindEmail 接口发送验证码到新邮箱
    const res = await userApi.bindEmail({
      email: changeEmailForm.newEmail,
    })

    if ((res as any).code === 0 || (res as any).code === 200) {
      await toastSuccess('验证码已发送到新邮箱，请查收')
      changeEmailCodeSent.value = true
      startChangeEmailCountdown()
    } else {
      toastError((res as any).message || '发送验证码失败')
    }
  } catch (error: any) {
    await toastException(error, '发送验证码失败')
  } finally {
    changeEmailLoading.value = false
  }
}

// 更换邮箱
const handleChangeEmail = async () => {
  if (!changeEmailForm.newEmail) {
    toastError('请输入新邮箱地址')
    return
  }

  if (!changeEmailForm.code) {
    toastError('请输入验证码')
    return
  }

  if (!changeEmailForm.password) {
    toastError('请输入密码')
    return
  }

  changeEmailLoading.value = true
  try {
    const res = await userApi.changeEmail({
      newEmail: changeEmailForm.newEmail,
      code: changeEmailForm.code,
      password: changeEmailForm.password,
    })

    if ((res as any).code === 0 || (res as any).code === 200) {
      await toastSuccess('邮箱更换成功')
      // 重新获取用户信息
      const userInfoRes = await userApi.getUserInfo()
      if ((userInfoRes as any).data) {
        emit('updated', (userInfoRes as any).data)
      }
      // 重置表单
      handleCancelChangeEmail()
    } else {
      toastError((res as any).message || '邮箱更换失败')
    }
  } catch (error: any) {
    await toastException(error, '邮箱更换失败')
  } finally {
    changeEmailLoading.value = false
  }
}

// 取消更换邮箱
const handleCancelChangeEmail = () => {
  showChangeEmail.value = false
  changeEmailForm.newEmail = ''
  changeEmailForm.code = ''
  changeEmailForm.password = ''
  changeEmailCodeSent.value = false
  changeEmailCodeCountdown.value = 0
}

// 更换邮箱验证码倒计时
const startChangeEmailCountdown = () => {
  changeEmailCodeCountdown.value = 60
  const timer = setInterval(() => {
    changeEmailCodeCountdown.value--
    if (changeEmailCodeCountdown.value <= 0) {
      clearInterval(timer)
    }
  }, 1000)
}

// 发送手机号验证码
const handleSendPhoneCode = async () => {
  if (!phoneForm.phone) {
    toastError('请输入手机号')
    return
  }

  if (!/^1[3-9]\d{9}$/.test(phoneForm.phone)) {
    toastError('请输入正确的手机号')
    return
  }

  phoneLoading.value = true
  try {
    const res = await userApi.bindPhone({
      phone: phoneForm.phone,
    })

    if ((res as any).code === 0 || (res as any).code === 200) {
      await toastSuccess('验证码已发送，请查收短信')
      phoneSent.value = true
      startPhoneCountdown()
    } else {
      toastError((res as any).message || '发送验证码失败')
    }
  } catch (error: any) {
    await toastException(error, '发送验证码失败')
  } finally {
    phoneLoading.value = false
  }
}

// 确认绑定手机号
const handleConfirmBindPhone = async () => {
  if (!phoneForm.code) {
    toastError('请输入验证码')
    return
  }

  phoneLoading.value = true
  try {
    const res = await userApi.bindPhoneConfirm({
      phone: phoneForm.phone,
      code: phoneForm.code,
    })

    if ((res as any).code === 0 || (res as any).code === 200) {
      await toastSuccess('手机号绑定成功')
      // 重新获取用户信息
      const userInfoRes = await userApi.getUserInfo()
      if ((userInfoRes as any).data) {
        emit('updated', (userInfoRes as any).data)
      }
      // 重置表单
      phoneForm.phone = ''
      phoneForm.code = ''
      phoneSent.value = false
    } else {
      toastError((res as any).message || '手机号绑定失败')
    }
  } catch (error: any) {
    await toastException(error, '手机号绑定失败')
  } finally {
    phoneLoading.value = false
  }
}

// 取消绑定手机号
const handleCancelBindPhone = () => {
  phoneForm.phone = ''
  phoneForm.code = ''
  phoneSent.value = false
  phoneCodeCountdown.value = 0
}

// 邮箱验证码倒计时
const startEmailCountdown = () => {
  emailCodeCountdown.value = 60
  const timer = setInterval(() => {
    emailCodeCountdown.value--
    if (emailCodeCountdown.value <= 0) {
      clearInterval(timer)
    }
  }, 1000)
}

// 手机号验证码倒计时
const startPhoneCountdown = () => {
  phoneCodeCountdown.value = 60
  const timer = setInterval(() => {
    phoneCodeCountdown.value--
    if (phoneCodeCountdown.value <= 0) {
      clearInterval(timer)
    }
  }, 1000)
}
</script>

<style scoped>
.security-settings {
  width: 100%;
  display: flex;
  flex-direction: column;
  gap: 32px;
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

.form {
  display: flex;
  flex-direction: column;
  gap: 20px;
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

.form-hint {
  margin: 0;
  font-size: 12px;
  color: #6b7280;
}

.code-input-group {
  display: flex;
  gap: 12px;
  align-items: flex-start;
}

.code-input-group .input {
  flex: 1;
}

.btn-code {
  padding: 10px 16px;
  border-radius: 6px;
  border: 1px solid #d1d5db;
  font-size: 14px;
  font-weight: 500;
  background: #ffffff;
  color: #2563eb;
  cursor: pointer;
  white-space: nowrap;
  transition: background-color 0.2s, border-color 0.2s;
}

.btn-code:hover:not(:disabled) {
  background: #f0f9ff;
  border-color: #2563eb;
}

.btn-code:disabled {
  opacity: 0.6;
  cursor: not-allowed;
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

.email-status {
  padding: 16px;
  background: #f0f9ff;
  border: 1px solid #bae6fd;
  border-radius: 6px;
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.status-item {
  display: flex;
  align-items: center;
  gap: 8px;
  margin-bottom: 8px;
}

.status-label {
  font-size: 14px;
  color: #374151;
  font-weight: 500;
}

.status-value {
  font-size: 14px;
  color: #2563eb;
  font-weight: 600;
}

.btn-change {
  padding: 8px 16px;
  border-radius: 6px;
  border: 1px solid #2563eb;
  font-size: 14px;
  font-weight: 500;
  background: #ffffff;
  color: #2563eb;
  cursor: pointer;
  transition: background-color 0.2s, color 0.2s;
  align-self: flex-start;
}

.btn-change:hover {
  background: #f0f9ff;
  border-color: #1d4ed8;
  color: #1d4ed8;
}

@media (max-width: 768px) {
  .form-actions {
    flex-direction: column;
  }

  .btn {
    width: 100%;
  }

  .code-input-group {
    flex-direction: column;
  }

  .btn-code {
    width: 100%;
  }
}
</style>

