<template>
  <header class="bg-white dark:bg-gray-900 shadow-md sticky top-0 z-50 transition-colors duration-300 border-b border-gray-200 dark:border-gray-700">
    <div class="container mx-auto px-4 flex items-center justify-between h-16">
      <router-link to="/" class="flex items-center no-underline">
        <h1 class="toolbar-title font-bold text-xl text-primary-600 dark:text-primary-400 transition-colors">
          Stafford Thaiboxing Gym
        </h1>
      </router-link>

      <!-- Desktop Navigation -->
      <nav class="hidden md:flex items-center space-x-4">
        <router-link
          v-for="item in navItems"
          :key="item.title"
          :to="item.to"
          class="nav-link px-3 py-2 font-medium text-gray-600 dark:text-gray-300 hover:text-primary-500 dark:hover:text-primary-400 transition-colors"
        >
          {{ item.title }}
        </router-link>

        <!-- Dark Mode Toggle -->
        <button
          @click="toggleDarkMode"
          class="p-2 rounded-lg transition-colors duration-200 hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-500 dark:text-gray-400 hover:text-primary-500 dark:hover:text-primary-400"
          :aria-label="isDark ? 'Switch to light mode' : 'Switch to dark mode'"
        >
          <!-- Sun icon for light mode -->
          <svg v-if="isDark" class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z"
            ></path>
          </svg>
          <!-- Moon icon for dark mode -->
          <svg v-else class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z"
            ></path>
          </svg>
        </button>

        <!-- Auth Buttons -->
        <router-link
          v-if="!authStore.isAuthenticated"
          to="/member"
          class="ml-4 px-4 py-2 bg-gray-600 hover:bg-gray-700 text-white rounded-md transition-colors duration-200"
        >
          Login
        </router-link>
        <router-link
          v-else
          to="/member/dashboard"
          class="ml-4 px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-md transition-colors duration-200"
        >
          Dashboard
        </router-link>
      </nav>

      <!-- Mobile menu button -->
      <button
        @click="toggleMobileMenu"
        class="md:hidden p-2 rounded-lg transition-colors duration-200 hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-500 dark:text-gray-400"
        :aria-label="isMobileMenuOpen ? 'Close menu' : 'Open menu'"
      >
        <svg v-if="!isMobileMenuOpen" class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16"></path>
        </svg>
        <svg v-else class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>
        </svg>
      </button>
    </div>

    <!-- Mobile Navigation -->
    <div
      v-if="isMobileMenuOpen"
      class="md:hidden bg-white dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700 transition-colors"
    >
      <nav class="px-4 py-4 space-y-2">
        <router-link
          v-for="item in navItems"
          :key="item.title"
          :to="item.to"
          class="block px-3 py-2 font-medium text-gray-600 dark:text-gray-300 hover:text-primary-500 dark:hover:text-primary-400 rounded-md hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
          @click="closeMobileMenu"
        >
          {{ item.title }}
        </router-link>

        <!-- Dark mode toggle for mobile -->
        <button
          @click="toggleDarkMode"
          class="w-full flex items-center px-3 py-2 text-gray-600 dark:text-gray-300 hover:text-primary-500 dark:hover:text-primary-400 rounded-md hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
        >
          <svg v-if="isDark" class="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z"></path>
          </svg>
          <svg v-else class="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z"></path>
          </svg>
          {{ isDark ? 'Light Mode' : 'Dark Mode' }}
        </button>

        <!-- Mobile auth buttons -->
        <router-link
          v-if="!authStore.isAuthenticated"
          to="/member"
          class="block w-full px-4 py-2 bg-gray-600 hover:bg-gray-700 text-white text-center rounded-md transition-colors duration-200 mt-4"
          @click="closeMobileMenu"
        >
          Login
        </router-link>
        <router-link
          v-else
          to="/member/dashboard"
          class="block w-full px-4 py-2 bg-green-600 hover:bg-green-700 text-white text-center rounded-md transition-colors duration-200 mt-4"
          @click="closeMobileMenu"
        >
          Dashboard
        </router-link>

        <router-link
          to="/contact"
          class="block w-full px-4 py-2 bg-primary-500 hover:bg-primary-600 text-white text-center rounded-md transition-colors duration-200 mt-4"
          @click="closeMobileMenu"
        >
          Join Now
        </router-link>
      </nav>
    </div>
  </header>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useDarkMode } from '@/composables/useDarkMode'
import { useAuthStore } from '@/stores/auth'

const { isDark, toggleDarkMode } = useDarkMode()
const authStore = useAuthStore()

const isMobileMenuOpen = ref(false)

const navItems = [
  { title: 'Home', to: '/' },
  { title: 'About', to: '/about' },
  { title: 'Classes', to: '/classes' },
  { title: 'Timetable', to: '/timetable' },
  { title: 'Gallery', to: '/gallery' },
  { title: 'Contact', to: '/contact' },
]

const toggleMobileMenu = () => {
  isMobileMenuOpen.value = !isMobileMenuOpen.value
}

const closeMobileMenu = () => {
  isMobileMenuOpen.value = false
}
</script>
