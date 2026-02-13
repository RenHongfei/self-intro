<template>
  <div class="text-center">
    <h1 class="cute-title mb-4">
      {{ block.title }}
    </h1>
    <p v-if="block.content" class="cute-subtitle">
      {{ block.content }}
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
