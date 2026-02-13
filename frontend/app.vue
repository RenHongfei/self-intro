<template>
  <NuxtLayout>
    <NuxtPage />
  </NuxtLayout>
</template>

<script setup>
const contentStore = useContentStore()

onMounted(() => {
  contentStore.fetchContent()
  contentStore.fetchLikes()
})
</script>
