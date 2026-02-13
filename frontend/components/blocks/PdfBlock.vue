<template>
  <div>
    <h3 v-if="block.title" class="text-xl font-semibold text-primary-600 mb-3">
      {{ block.title }}
    </h3>
    <div class="rounded-2xl overflow-hidden shadow-cute bg-gray-100">
      <iframe 
        :src="block.media_url"
        class="w-full h-96"
        frameborder="0"
      ></iframe>
    </div>
    <p v-if="block.media_alt" class="text-sm text-gray-500 mt-2 text-center">
      {{ block.media_alt }}
    </p>
    <a 
      :href="block.media_url"
      target="_blank"
      class="inline-flex items-center gap-2 mt-3 text-primary-500 hover:text-primary-600"
    >
      <Icon name="lucide:external-link" class="w-4 h-4" />
      在新窗口打开PDF
    </a>
  </div>
</template>

<script setup>
defineProps({
  block: {
    type: Object,
    required: true
  }
})
</script>
