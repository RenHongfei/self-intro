<template>
  <div>
    <h3 v-if="block.title" class="text-xl font-semibold text-primary-600 mb-3">
      {{ block.title }}
    </h3>
    <p class="text-gray-700 leading-relaxed">
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
