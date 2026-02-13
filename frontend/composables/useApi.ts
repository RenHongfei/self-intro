export const useApi = () => {
  const config = useRuntimeConfig()
  const authStore = useAuthStore()
  
  const api = $fetch.create({
    baseURL: config.public.apiBase,
    onRequest({ options }) {
      if (authStore.isAuthenticated) {
        options.headers = {
          ...options.headers,
          ...authStore.getAuthHeaders()
        }
      }
    },
    onResponseError({ response }) {
      if (response.status === 401) {
        authStore.logout()
        navigateTo('/admin/login')
      }
    }
  })
  
  return api
}
