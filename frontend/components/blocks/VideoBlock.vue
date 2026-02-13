<template>
  <div>
    <h3 v-if="block.title" class="text-xl font-semibold text-primary-600 mb-3">
      {{ block.title }}
    </h3>
    <div class="rounded-2xl overflow-hidden shadow-cute bg-black">
      <video 
        :src="block.media_url"
        controls
        class="w-full h-auto"
        :poster="block.settings?.poster"
      >
        您的浏览器不支持视频播放
      </video>
    </div>
    <p v-if="block.media_alt" class="text-sm text-gray-500 mt-2 text-center">
      {{ block.media_alt }}
    </p>
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
