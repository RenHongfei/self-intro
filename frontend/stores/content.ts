import { defineStore } from 'pinia'

export const useContentStore = defineStore('content', () => {
  const config = useRuntimeConfig()
  const blocks = ref([])
  const likes = ref({})
  const loading = ref(false)
  const error = ref(null)

  const sections = computed(() => {
    return blocks.value.filter(b => b.type === 'section')
  })

  const heroBlocks = computed(() => {
    const firstSection = blocks.value.findIndex(b => b.type === 'section')
    if (firstSection > 0) {
      return blocks.value.slice(0, firstSection)
    }
    return blocks.value.filter(b => b.type === 'title' || b.type === 'text').slice(0, 2)
  })

  const contentBlocksBySection = computed(() => {
    const firstSection = blocks.value.findIndex(b => b.type === 'section')
    if (firstSection > 0) {
      return blocks.value.slice(firstSection)
    }
    return blocks.value.filter(b => b.type !== 'title').slice(2)
  })

  const fetchContent = async () => {
    loading.value = true
    error.value = null
    try {
      const response = await $fetch(`${config.public.apiBase}/content`)
      blocks.value = response
    } catch (e) {
      error.value = e
      console.error('Failed to fetch content:', e)
    } finally {
      loading.value = false
    }
  }

  const fetchLikes = async () => {
    try {
      const response = await $fetch(`${config.public.apiBase}/likes`)
      likes.value = response
    } catch (e) {
      console.error('Failed to fetch likes:', e)
    }
  }

  const toggleLike = async (contentBlockId) => {
    try {
      await $fetch(`${config.public.apiBase}/likes/${contentBlockId}`, {
        method: 'POST'
      })
      await fetchLikes()
    } catch (e) {
      console.error('Failed to toggle like:', e)
    }
  }

  const getLikeCount = (blockId) => {
    return likes.value[blockId] || 0
  }

  return {
    blocks,
    likes,
    loading,
    error,
    sections,
    heroBlocks,
    contentBlocksBySection,
    fetchContent,
    fetchLikes,
    toggleLike,
    getLikeCount
  }
})
