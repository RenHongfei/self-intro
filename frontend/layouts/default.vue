<template>
  <div class="min-h-screen relative overflow-hidden">
    <div class="fixed inset-0 pointer-events-none overflow-hidden">
      <div class="absolute top-10 left-10 w-20 h-20 bg-cute-pink/30 rounded-full blur-xl animate-float"></div>
      <div class="absolute top-1/4 right-20 w-32 h-32 bg-cute-lavender/40 rounded-full blur-2xl animate-float" style="animation-delay: 1s"></div>
      <div class="absolute bottom-20 left-1/4 w-24 h-24 bg-cute-mint/30 rounded-full blur-xl animate-float" style="animation-delay: 0.5s"></div>
      <div class="absolute bottom-1/3 right-10 w-16 h-16 bg-cute-peach/40 rounded-full blur-lg animate-float" style="animation-delay: 1.5s"></div>
    </div>

    <slot />

    <footer class="relative z-10 mt-20 py-8 text-center text-primary-400">
      <p class="flex items-center justify-center gap-2">
        Made with <span class="text-red-400 animate-pulse">❤️</span> by 小明
      </p>
    </footer>
  </div>
</template>
