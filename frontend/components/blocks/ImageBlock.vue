<template>
  <div>
    <h3 v-if="block.title" class="text-xl font-semibold text-primary-600 mb-3">
      {{ block.title }}
    </h3>
    <div class="rounded-2xl overflow-hidden shadow-cute">
      <img 
        :src="block.media_url" 
        :alt="block.media_alt || block.title"
        class="w-full h-auto object-cover"
        loading="lazy"
      />
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
