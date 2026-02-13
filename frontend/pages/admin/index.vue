<template>
  <div class="min-h-screen">
    <header class="bg-white/80 backdrop-blur-md border-b border-primary-100 sticky top-0 z-50">
      <div class="max-w-6xl mx-auto px-4 py-4 flex items-center justify-between">
        <div class="flex items-center gap-4">
          <NuxtLink to="/" class="text-2xl">🌸</NuxtLink>
          <h1 class="text-xl font-bold gradient-text">内容管理</h1>
        </div>
        
        <div class="flex items-center gap-4">
          <button @click="showAddModal = true" class="cute-btn">
            <Icon name="lucide:plus" class="w-5 h-5 mr-2" />
            添加内容
          </button>
          <button @click="handleLogout" class="cute-btn-secondary">
            <Icon name="lucide:log-out" class="w-5 h-5" />
          </button>
        </div>
      </div>
    </header>

    <main class="max-w-6xl mx-auto px-4 py-8">
      <div class="grid gap-4">
        <div
          v-for="block in contentBlocks"
          :key="block.id"
          class="cute-card flex items-start gap-4"
          draggable="true"
          @dragstart="dragStart($event, block)"
          @dragover.prevent
          @drop="drop($event, block)"
        >
          <div class="cursor-move text-gray-400 hover:text-primary-500 pt-1">
            <Icon name="lucide:grip-vertical" class="w-5 h-5" />
          </div>
          
          <div class="flex-1">
            <div class="flex items-center gap-2 mb-2">
              <span class="px-2 py-1 text-xs rounded-full bg-primary-100 text-primary-600">
                {{ typeLabels[block.type] }}
              </span>
              <span v-if="!block.is_visible" class="px-2 py-1 text-xs rounded-full bg-gray-100 text-gray-500">
                已隐藏
              </span>
            </div>
            <h3 class="font-semibold text-gray-800">{{ block.title || '无标题' }}</h3>
            <p class="text-sm text-gray-500 line-clamp-2">{{ block.content }}</p>
          </div>
          
          <div class="flex items-center gap-2">
            <button
              @click="toggleVisibility(block)"
              class="p-2 rounded-lg hover:bg-gray-100 transition-colors"
              :title="block.is_visible ? '隐藏' : '显示'"
            >
              <Icon 
                :name="block.is_visible ? 'lucide:eye' : 'lucide:eye-off'" 
                class="w-5 h-5"
                :class="block.is_visible ? 'text-primary-500' : 'text-gray-400'"
              />
            </button>
            <button
              @click="editBlock(block)"
              class="p-2 rounded-lg hover:bg-gray-100 transition-colors"
            >
              <Icon name="lucide:edit" class="w-5 h-5 text-blue-500" />
            </button>
            <button
              @click="deleteBlock(block)"
              class="p-2 rounded-lg hover:bg-gray-100 transition-colors"
            >
              <Icon name="lucide:trash-2" class="w-5 h-5 text-red-500" />
            </button>
          </div>
        </div>
      </div>

      <div v-if="contentBlocks.length === 0" class="text-center py-20">
        <div class="text-4xl mb-4">📝</div>
        <p class="text-gray-500">还没有内容，点击上方按钮添加</p>
      </div>
    </main>

    <ContentEditor
      v-if="showAddModal || editingBlock"
      :block="editingBlock"
      @close="closeEditor"
      @save="handleSave"
    />
  </div>
</template>

<script setup lang="ts">
definePageMeta({
  layout: 'admin',
  middleware: 'auth'
})

const api = useApi()
const authStore = useAuthStore()
const router = useRouter()

interface ContentBlock {
  id: number
  type: string
  title: string
  content: string
  media_url: string
  media_alt: string
  settings: Record<string, any>
  sort_order: number
  is_visible: boolean
}

const contentBlocks = ref<ContentBlock[]>([])
const showAddModal = ref(false)
const editingBlock = ref<ContentBlock | null>(null)

const typeLabels: Record<string, string> = {
  title: '标题',
  text: '文本',
  richtext: '富文本',
  image: '图片',
  video: '视频',
  pdf: 'PDF',
  section: '分区'
}

const fetchContent = async () => {
  try {
    const response = await api('/content/admin')
    contentBlocks.value = response
  } catch (e) {
    console.error('Failed to fetch content:', e)
  }
}

const toggleVisibility = async (block: ContentBlock) => {
  try {
    await api(`/content/${block.id}`, {
      method: 'PUT',
      body: {
        ...block,
        is_visible: !block.is_visible
      }
    })
    await fetchContent()
  } catch (e) {
    console.error('Failed to toggle visibility:', e)
  }
}

const editBlock = (block: ContentBlock) => {
  editingBlock.value = { ...block }
}

const deleteBlock = async (block: ContentBlock) => {
  if (!confirm('确定要删除这个内容块吗？')) return
  
  try {
    await api(`/content/${block.id}`, { method: 'DELETE' })
    await fetchContent()
  } catch (e) {
    console.error('Failed to delete block:', e)
  }
}

let draggedBlock: ContentBlock | null = null

const dragStart = (e: DragEvent, block: ContentBlock) => {
  draggedBlock = block
}

const drop = async (e: DragEvent, targetBlock: ContentBlock) => {
  if (!draggedBlock || draggedBlock.id === targetBlock.id) return
  
  const items = [...contentBlocks.value]
  const draggedIndex = items.findIndex(b => b.id === draggedBlock!.id)
  const targetIndex = items.findIndex(b => b.id === targetBlock.id)
  
  items.splice(draggedIndex, 1)
  items.splice(targetIndex, 0, draggedBlock!)
  
  contentBlocks.value = items
  
  try {
    await api('/content/sort/order', {
      method: 'PUT',
      body: {
        items: items.map((b, index) => ({
          id: b.id,
          sort_order: index
        }))
      }
    })
  } catch (e) {
    console.error('Failed to update sort order:', e)
    fetchContent()
  }
}

const closeEditor = () => {
  showAddModal.value = false
  editingBlock.value = null
}

const handleSave = async () => {
  closeEditor()
  await fetchContent()
}

const handleLogout = () => {
  authStore.logout()
  router.push('/admin/login')
}

onMounted(() => {
  fetchContent()
})
</script>
