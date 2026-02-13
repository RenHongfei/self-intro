<template>
  <button 
    class="like-btn"
    :class="{ liked: liked }"
    @click.stop="$emit('click')"
  >
    <span 
      class="text-xl transition-transform duration-300"
      :class="{ 'animate-heart-beat': liked }"
    >
      {{ liked ? '❤️' : '🤍' }}
    </span>
    <span class="font-medium" :class="liked ? 'text-white' : 'text-primary-600'">
      {{ count }}
    </span>
  </button>
</template>

<script setup>
defineProps({
  count: {
    type: Number,
    default: 0
  },
  liked: {
    type: Boolean,
    default: false
  }
})

defineEmits(['click'])
</script>
