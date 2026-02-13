export default defineNuxtRouteMiddleware(async (to) => {
  const authStore = useAuthStore()
  
  if (!authStore.isAuthenticated) {
    return navigateTo('/admin/login')
  }
  
  const isValid = await authStore.verifyToken()
  if (!isValid) {
    return navigateTo('/admin/login')
  }
})
