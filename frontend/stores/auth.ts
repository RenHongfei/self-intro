import { defineStore } from 'pinia'

export const useAuthStore = defineStore('auth', () => {
  const config = useRuntimeConfig()
  const token = ref(useCookie('auth-token').value || '')
  const user = ref(null)

  const isAuthenticated = computed(() => !!token.value)

  const login = async (username, password) => {
    try {
      const response = await $fetch(`${config.public.apiBase}/auth/login`, {
        method: 'POST',
        body: { username, password }
      })
      
      token.value = response.token
      user.value = response.user
      
      const cookie = useCookie('auth-token', { 
        maxAge: 60 * 60 * 24 * 7,
        path: '/'
      })
      cookie.value = response.token
      
      return { success: true }
    } catch (e) {
      return { success: false, error: e.data?.error || '登录失败' }
    }
  }

  const logout = () => {
    token.value = ''
    user.value = null
    const cookie = useCookie('auth-token')
    cookie.value = null
  }

  const verifyToken = async () => {
    if (!token.value) return false
    
    try {
      const response = await $fetch(`${config.public.apiBase}/auth/verify`, {
        headers: {
          Authorization: `Bearer ${token.value}`
        }
      })
      return response.valid
    } catch {
      logout()
      return false
    }
  }

  const getAuthHeaders = () => ({
    Authorization: `Bearer ${token.value}`
  })

  return {
    token,
    user,
    isAuthenticated,
    login,
    logout,
    verifyToken,
    getAuthHeaders
  }
})
