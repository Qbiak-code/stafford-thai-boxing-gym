<template>
  <header class="bg-gray-200  shadow-md sticky top-0 z-50 transition-colors duration-200">
    <div class="container mx-auto px-4 flex items-center justify-between h-16">
      <router-link to="/" class="flex items-center no-underline">
        <h1 class="toolbar-title font-bold text-xl">Stafford Thai Boxing Gym</h1>
      </router-link>

      <!-- Desktop Navigation -->
      <nav class="hidden md:flex items-center space-x-4">
        <router-link
          v-for="item in navItems"
          :key="item.title"
          :to="item.to"
          class="nav-link px-3 py-2 font-medium"
        >
          {{ item.title }}
        </router-link>

        <!-- Dark Mode Toggle -->
        <button
          @click="toggleDarkMode"
          class="p-2 rounded-lg transition-colors duration-200"
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

        <router-link
          to="/contact"
          class="ml-4 px-4 py-2 bg-blue-600 text-white rounded-md transition-colors duration-200"
        >
          Join Now
        </router-link>
      </nav>

      <!-- Mobile Menu Button -->
      <button class="md:hidden p-2" @click="drawer = !drawer" aria-label="Toggle menu">
        <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="2"
            d="M4 6h16M4 12h16M4 18h16"
          ></path>
        </svg>
      </button>
    </div>

    <!-- Mobile Navigation Drawer -->
    <div v-if="drawer" class="md:hidden border-t shadow-lg">
      <nav class="py-2">
        <router-link
          v-for="item in navItems"
          :key="item.title"
          :to="item.to"
          class="nav-link block px-4 py-3 font-medium"
          @click="drawer = false"
        >
          {{ item.title }}
        </router-link>

        <button @click="toggleDarkMode" class="flex items-center w-full px-4 py-3 font-medium">
          <svg
            v-if="isDark"
            class="w-5 h-5 mr-3"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z"
            ></path>
          </svg>
          <svg v-else class="w-5 h-5 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z"
            ></path>
          </svg>
          {{ isDark ? "Light Mode" : "Dark Mode" }}
        </button>

        <router-link
          to="/contact"
          class="block mx-4 my-3 px-4 py-2 bg-blue-600 text-white text-center rounded-md"
          @click="drawer = false"
        >
          Join Now
        </router-link>
      </nav>
    </div>
  </header>
</template>

<script setup lang="ts">
import { ref } from "vue"
import { useDarkMode } from "@/composables/useDarkMode"

const drawer = ref(false)
const { isDark, toggleDarkMode } = useDarkMode()

const navItems = [
  { title: "Home", to: "/", icon: "home" },
  { title: "About", to: "/about", icon: "face" },
  { title: "Timetable", to: "/timetable", icon: "face" },
  { title: "Gallery", to: "/gallery", icon: "face" },
  { title: "Contact", to: "/contact", icon: "face" },
  { title: "Member Zone", to: "/member/dashboard", icon: "face" },
]
</script>
