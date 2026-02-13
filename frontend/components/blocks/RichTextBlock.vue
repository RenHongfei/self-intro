<template>
  <div>
    <h3 v-if="block.title" class="text-xl font-semibold text-primary-600 mb-3">
      {{ block.title }}
    </h3>
    <div 
      class="prose prose-lg max-w-none text-gray-700"
      v-html="block.content"
    ></div>
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
