<template>
  <div :class="blockClasses">
    <component :is="blockComponent" :block="block" />
    
    <div v-if="showLikeButton" class="mt-4 flex justify-end">
      <LikeButton 
        :count="likeCount" 
        :liked="isLiked"
        @click="$emit('like')" 
      />
    </div>
  </div>
</template>

<script setup>
const props = defineProps({
  block: {
    type: Object,
    required: true
  },
  likeCount: {
    type: Number,
    default: 0
  }
})

defineEmits(['like'])

const blockClasses = computed(() => {
  const base = []
  if (props.block.type !== 'title' && props.block.type !== 'section') {
    base.push('mb-6')
  }
  return base
})

const showLikeButton = computed(() => {
  return ['richtext', 'image', 'video', 'pdf'].includes(props.block.type)
})

const isLiked = ref(false)

const blockComponent = computed(() => {
  const components = {
    title: 'TitleBlock',
    text: 'TextBlock',
    richtext: 'RichTextBlock',
    image: 'ImageBlock',
    video: 'VideoBlock',
    pdf: 'PdfBlock',
    section: 'SectionBlock'
  }
  return components[props.block.type] || 'TextBlock'
})
</script>
