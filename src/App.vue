<template>
  <div class="app">
    <AppHeader />
    <main class="main-content">
      <router-view v-slot="{ Component }">
        <transition name="fade" mode="out-in">
          <component :is="Component" />
        </transition>
      </router-view>
    </main>
    <AppFooter />
    <Modal />
  </div>
</template>

<script setup lang="ts">
import { onMounted } from "vue"
import AppHeader from "@/components/AppHeader.vue"
import AppFooter from "@/components/AppFooter.vue"
import { useDarkMode } from "@/composables/useDarkMode"
import Modal from "@/components/Modal.vue"

const { initializeTheme } = useDarkMode()

onMounted(() => {
  // Initialize theme on app mount
  initializeTheme()
})
</script>

<style>
.app {
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  background-color: var(--bg-primary);
  color: var(--text-primary);
  transition:
    background-color 0.3s ease,
    color 0.3s ease;
}

.main-content {
  flex: 1;
}

/* Page transitions */
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.3s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>
