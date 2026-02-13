<template>
  <div class="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4" @click.self="$emit('close')">
    <div class="bg-white rounded-3xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
      <div class="sticky top-0 bg-white border-b border-primary-100 px-6 py-4 flex items-center justify-between rounded-t-3xl">
        <h2 class="text-xl font-bold gradient-text">
          {{ block ? '编辑内容' : '添加内容' }}
        </h2>
        <button @click="$emit('close')" class="p-2 hover:bg-gray-100 rounded-full">
          <Icon name="lucide:x" class="w-5 h-5" />
        </button>
      </div>

      <form @submit.prevent="handleSave" class="p-6 space-y-6">
        <div>
          <label class="block text-sm font-medium text-primary-600 mb-2">内容类型 *</label>
          <select v-model="form.type" class="cute-input" required>
            <option value="">请选择类型</option>
            <option value="title">标题</option>
            <option value="text">文本</option>
            <option value="richtext">富文本</option>
            <option value="image">图片</option>
            <option value="video">视频</option>
            <option value="pdf">PDF</option>
            <option value="section">分区标题</option>
          </select>
        </div>

        <div>
          <label class="block text-sm font-medium text-primary-600 mb-2">标题</label>
          <input v-model="form.title" type="text" class="cute-input" placeholder="请输入标题" />
        </div>

        <div v-if="['text', 'richtext', 'section'].includes(form.type)">
          <label class="block text-sm font-medium text-primary-600 mb-2">
            {{ form.type === 'richtext' ? '富文本内容' : '文本内容' }}
          </label>
          <textarea 
            v-if="form.type !== 'richtext'"
            v-model="form.content" 
            class="cute-input min-h-[120px]" 
            placeholder="请输入内容"
          ></textarea>
          <div v-else class="border-2 border-primary-200 rounded-2xl overflow-hidden">
            <div class="bg-gray-50 border-b border-primary-200 p-2 flex gap-2">
              <button type="button" @click="insertFormat('bold')" class="px-3 py-1 rounded bg-white hover:bg-primary-50 font-bold">B</button>
              <button type="button" @click="insertFormat('italic')" class="px-3 py-1 rounded bg-white hover:bg-primary-50 italic">I</button>
              <button type="button" @click="insertFormat('underline')" class="px-3 py-1 rounded bg-white hover:bg-primary-50 underline">U</button>
              <button type="button" @click="insertFormat('link')" class="px-3 py-1 rounded bg-white hover:bg-primary-50">🔗</button>
            </div>
            <textarea 
              ref="richtextRef"
              v-model="form.content" 
              class="w-full min-h-[200px] p-4 outline-none" 
              placeholder="请输入HTML内容"
            ></textarea>
          </div>
        </div>

        <div v-if="['image', 'video', 'pdf'].includes(form.type)">
          <label class="block text-sm font-medium text-primary-600 mb-2">媒体文件</label>
          <div class="flex gap-4">
            <input 
              v-model="form.media_url" 
              type="text" 
              class="cute-input flex-1" 
              placeholder="输入URL或上传文件"
            />
            <label class="cute-btn-secondary cursor-pointer">
              <Icon name="lucide:upload" class="w-5 h-5 mr-2" />
              上传
              <input 
                type="file" 
                class="hidden" 
                :accept="acceptTypes"
                @change="handleFileUpload"
              />
            </label>
          </div>
        </div>

        <div v-if="['image', 'video', 'pdf'].includes(form.type)">
          <label class="block text-sm font-medium text-primary-600 mb-2">描述/替代文本</label>
          <input v-model="form.media_alt" type="text" class="cute-input" placeholder="请输入描述" />
        </div>

        <div class="flex items-center gap-2">
          <input 
            v-model="form.is_visible" 
            type="checkbox" 
            id="is_visible"
            class="w-5 h-5 rounded border-primary-300 text-primary-500 focus:ring-primary-500"
          />
          <label for="is_visible" class="text-sm text-gray-600">显示此内容</label>
        </div>

        <div class="flex gap-4 pt-4">
          <button type="button" @click="$emit('close')" class="cute-btn-secondary flex-1">
            取消
          </button>
          <button type="submit" class="cute-btn flex-1" :disabled="saving">
            {{ saving ? '保存中...' : '保存' }}
          </button>
        </div>
      </form>
    </div>
  </div>
</template>

<script setup lang="ts">
const props = defineProps<{
  block?: any
}>()

const emit = defineEmits<{
  close: []
  save: []
}>()

const api = useApi()
const config = useRuntimeConfig()
const authStore = useAuthStore()

const richtextRef = ref<HTMLTextAreaElement | null>(null)
const saving = ref(false)

const form = reactive({
  type: props.block?.type || '',
  title: props.block?.title || '',
  content: props.block?.content || '',
  media_url: props.block?.media_url || '',
  media_alt: props.block?.media_alt || '',
  is_visible: props.block?.is_visible ?? true
})

const acceptTypes = computed(() => {
  switch (form.type) {
    case 'image': return 'image/*'
    case 'video': return 'video/*'
    case 'pdf': return '.pdf'
    default: return ''
  }
})

const insertFormat = (format: string) => {
  if (!richtextRef.value) return
  const textarea = richtextRef.value
  const start = textarea.selectionStart
  const end = textarea.selectionEnd
  const selected = form.content.substring(start, end)
  
  let wrapped = selected
  switch (format) {
    case 'bold': wrapped = `<strong>${selected}</strong>`; break
    case 'italic': wrapped = `<em>${selected}</em>`; break
    case 'underline': wrapped = `<u>${selected}</u>`; break
    case 'link': wrapped = `<a href="#">${selected}</a>`; break
  }
  
  form.content = form.content.substring(0, start) + wrapped + form.content.substring(end)
}

const handleFileUpload = async (e: Event) => {
  const target = e.target as HTMLInputElement
  const file = target.files?.[0]
  if (!file) return

  const formData = new FormData()
  formData.append('file', file)

  try {
    const response = await $fetch(`${config.public.apiBase}/media/upload`, {
      method: 'POST',
      body: formData,
      headers: authStore.getAuthHeaders()
    })
    form.media_url = response.url
  } catch (error) {
    alert('文件上传失败')
    console.error(error)
  }
}

const handleSave = async () => {
  if (!form.type) {
    alert('请选择内容类型')
    return
  }

  saving.value = true
  
  try {
    const payload = {
      ...form,
      settings: {}
    }

    if (props.block?.id) {
      await api(`/content/${props.block.id}`, {
        method: 'PUT',
        body: payload
      })
    } else {
      await api('/content', {
        method: 'POST',
        body: {
          ...payload,
          sort_order: 999
        }
      })
    }

    emit('save')
  } catch (error) {
    alert('保存失败')
    console.error(error)
  } finally {
    saving.value = false
  }
}
</script>
