<template>
  <div class="min-h-screen flex items-center justify-center px-4">
    <div class="cute-card max-w-md w-full">
      <div class="text-center mb-8">
        <div class="text-4xl mb-4">🔐</div>
        <h1 class="cute-title">管理员登录</h1>
        <p class="cute-subtitle mt-2">请输入账号密码</p>
      </div>

      <form @submit.prevent="handleLogin" class="space-y-4">
        <div>
          <label class="block text-sm font-medium text-primary-600 mb-2">用户名</label>
          <input
            v-model="form.username"
            type="text"
            class="cute-input"
            placeholder="请输入用户名"
            required
          />
        </div>

        <div>
          <label class="block text-sm font-medium text-primary-600 mb-2">密码</label>
          <input
            v-model="form.password"
            type="password"
            class="cute-input"
            placeholder="请输入密码"
            required
          />
        </div>

        <p v-if="error" class="text-red-500 text-sm text-center">{{ error }}</p>

        <button
          type="submit"
          class="cute-btn w-full"
          :disabled="loading"
        >
          <span v-if="loading" class="animate-spin mr-2">⏳</span>
          {{ loading ? '登录中...' : '登录' }}
        </button>
      </form>

      <NuxtLink 
        to="/" 
        class="block text-center mt-6 text-primary-500 hover:text-primary-600"
      >
        ← 返回首页
      </NuxtLink>
    </div>
  </div>
</template>

<script setup lang="ts">
definePageMeta({
  layout: 'admin'
})

const authStore = useAuthStore()
const router = useRouter()

const form = reactive({
  username: '',
  password: ''
})
const loading = ref(false)
const error = ref('')

const handleLogin = async () => {
  loading.value = true
  error.value = ''
  
  const result = await authStore.login(form.username, form.password)
  
  if (result.success) {
    router.push('/admin')
  } else {
    error.value = result.error
  }
  
  loading.value = false
}

onMounted(() => {
  if (authStore.isAuthenticated) {
    router.push('/admin')
  }
})
</script>
