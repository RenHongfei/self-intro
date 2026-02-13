<template>
  <NuxtLayout>
    <nav class="sticky top-0 z-50 backdrop-blur-md bg-white/70 border-b border-primary-100">
      <div class="max-w-6xl mx-auto px-4 py-3 flex items-center justify-between">
        <NuxtLink to="/" class="flex items-center gap-2 group">
          <span class="text-2xl group-hover:animate-wiggle">🌸</span>
          <span class="font-bold gradient-text">我的主页</span>
        </NuxtLink>
        
        <div class="flex items-center gap-4">
          <NuxtLink 
            v-for="item in contentStore.sections" 
            :key="item.id"
            :to="`#section-${item.id}`"
            class="text-primary-600 hover:text-primary-500 transition-colors px-3 py-1 rounded-full hover:bg-primary-50"
          >
            {{ item.title }}
          </NuxtLink>
          
          <NuxtLink 
            to="/admin" 
            class="cute-btn-secondary text-sm !px-4 !py-2"
          >
            <Icon name="lucide:settings" class="w-4 h-4" />
          </NuxtLink>
        </div>
      </div>
    </nav>

    <main class="relative z-10">
      <div v-if="contentStore.loading" class="flex items-center justify-center py-20">
        <div class="text-center">
          <div class="text-4xl animate-bounce-slow mb-4">🌸</div>
          <p class="text-primary-400">加载中...</p>
        </div>
      </div>

      <div v-else-if="contentStore.error" class="text-center py-20">
        <div class="text-4xl mb-4">😢</div>
        <p class="text-red-400">加载失败，请稍后重试</p>
      </div>

      <div v-else class="max-w-4xl mx-auto px-4 py-12">
        <section class="text-center mb-16">
          <div class="inline-block mb-6">
            <div class="w-32 h-32 mx-auto rounded-full bg-gradient-to-br from-primary-300 to-primary-500 p-1 shadow-cute-lg animate-float">
              <div class="w-full h-full rounded-full bg-white flex items-center justify-center text-5xl">
                👩‍💻
              </div>
            </div>
          </div>
          
          <ContentBlock 
            v-for="block in contentStore.heroBlocks" 
            :key="block.id"
            :block="block"
          />
        </section>

        <div class="space-y-8">
          <template v-for="block in contentStore.contentBlocksBySection" :key="block.id">
            <div v-if="block.type === 'section'" class="pt-8">
              <h2 
                :id="`section-${block.id}`"
                class="text-2xl font-bold text-primary-600 mb-6 flex items-center gap-3"
              >
                <span class="text-3xl">✨</span>
                {{ block.title }}
              </h2>
            </div>
            
            <ContentBlock 
              v-else
              :block="block"
              :like-count="contentStore.getLikeCount(block.id)"
              @like="contentStore.toggleLike(block.id)"
              class="cute-card"
            />
          </template>
        </div>
      </div>
    </main>
  </NuxtLayout>
</template>

<script setup>
const contentStore = useContentStore()
</script>
