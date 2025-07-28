<template>
  <header class="header">
    <div class="container">
      <!-- Logo/Brand -->
      <router-link to="/" class="brand">
        <h1 class="brand-text">
          <span class="inline md:hidden">Stafford Thaiboxing Gym</span>
          <span class="hidden md:inline lg:hidden">ST</span>
          <span class="hidden lg:inline">Stafford Thaiboxing Gym</span>
        </h1>
      </router-link>

      <!-- Desktop Navigation -->
      <nav class="nav-desktop">
        <router-link
          v-for="item in navItems"
          :key="item.title"
          :to="item.to"
          class="nav-link"
          :class="{ 'active': $route.path === item.to }"
        >
          {{ item.title }}
        </router-link>

        <!-- Theme Toggle -->
        <button
          @click="toggleTheme"
          class="theme-toggle"
          :aria-label="isDark ? 'Switch to light mode' : 'Switch to dark mode'"
        >
          <!-- Moon icon for dark mode -->
          <svg v-if="isDark" class="icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                  d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
          </svg>
          <!-- Sun icon for light mode -->
          <svg v-else class="icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                  d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" />
          </svg>
        </button>

        <!-- Auth Button -->
        <router-link
          v-if="!authStore.isAuthenticated"
          to="/member"
          class="btn btn-primary btn-sm"
        >
          Login
        </router-link>
        <router-link
          v-else
          to="/member/dashboard"
          class="btn btn-ghost btn-sm"
        >
          Dashboard
        </router-link>
      </nav>

      <!-- Mobile menu button -->
      <button
        @click="toggleMobileMenu"
        class="mobile-menu-btn"
        :aria-label="isMobileMenuOpen ? 'Close menu' : 'Open menu'"
      >
        <svg v-if="!isMobileMenuOpen" class="icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16" />
        </svg>
        <svg v-else class="icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
        </svg>
      </button>
    </div>

    <!-- Mobile Navigation -->
    <div v-if="isMobileMenuOpen" class="nav-mobile">
      <nav class="mobile-nav-content">
        <router-link
          v-for="item in navItems"
          :key="item.title"
          :to="item.to"
          class="nav-link mobile-nav-link"
          :class="{ 'active': $route.path === item.to }"
          @click="closeMobileMenu"
        >
          {{ item.title }}
        </router-link>

        <!-- Mobile theme toggle -->
        <button
          @click="toggleTheme"
          class="mobile-theme-toggle"
        >
          <svg v-if="isDark" class="icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                  d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" />
          </svg>
          <svg v-else class="icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                  d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
          </svg>
          {{ isDark ? 'Light Mode' : 'Dark Mode' }}
        </button>

        <!-- Mobile auth buttons -->
        <div class="mobile-auth-buttons">
          <router-link
            v-if="!authStore.isAuthenticated"
            to="/member"
            class="btn btn-primary"
            @click="closeMobileMenu"
          >
            Login
          </router-link>
          <router-link
            v-else
            to="/member/dashboard"
            class="btn btn-ghost"
            @click="closeMobileMenu"
          >
            Dashboard
          </router-link>
        </div>
      </nav>
    </div>
  </header>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useDarkMode } from '@/composables/useDarkMode'
import { useAuthStore } from '@/stores/auth'

const { isDark, toggleTheme } = useDarkMode()
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

<style scoped>
.header {
  background-color: var(--bg-primary);
  border-bottom: 1px solid var(--border-color);
  position: sticky;
  top: 0;
  z-index: 50;
  transition: all 0.3s ease;
}

.container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 1rem;
  display: flex;
  align-items: center;
  justify-content: space-between;
  height: 4rem;
}

/* Brand */
.brand {
  text-decoration: none;
  color: var(--text-primary);
}

.brand-text {
  font-size: 1.25rem;
  font-weight: 600;
  margin: 0;
  background: var(--gradient-primary);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}

/* Desktop Navigation */
.nav-desktop {
  display: none;
  align-items: center;
  gap: 0.5rem;
}

@media (min-width: 768px) {
  .nav-desktop {
    display: flex;
  }
}

/* Theme Toggle */
.theme-toggle {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 2.5rem;
  height: 2.5rem;
  border: 1px solid var(--border-color);
  border-radius: 0.5rem;
  background: transparent;
  color: var(--text-secondary);
  cursor: pointer;
  transition: all 0.2s ease;
  margin-left: 0.5rem;
}

.theme-toggle:hover {
  background-color: var(--hover-bg);
  color: var(--text-primary);
  border-color: var(--text-secondary);
}

/* Mobile Menu Button */
.mobile-menu-btn {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 2.5rem;
  height: 2.5rem;
  border: 1px solid var(--border-color);
  border-radius: 0.5rem;
  background: transparent;
  color: var(--text-secondary);
  cursor: pointer;
  transition: all 0.2s ease;
}

.mobile-menu-btn:hover {
  background-color: var(--hover-bg);
  color: var(--text-primary);
}

@media (min-width: 768px) {
  .mobile-menu-btn {
    display: none;
  }
}

/* Icon */
.icon {
  width: 1.25rem;
  height: 1.25rem;
}

/* Mobile Navigation */
.nav-mobile {
  background-color: var(--bg-secondary);
  border-top: 1px solid var(--border-color);
  padding: 1rem 0;
}

.mobile-nav-content {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 1rem;
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.mobile-nav-link {
  padding: 0.75rem 1rem;
  border-radius: 0.5rem;
}

.mobile-theme-toggle {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  padding: 0.75rem 1rem;
  background: transparent;
  border: 1px solid var(--border-color);
  border-radius: 0.5rem;
  color: var(--text-secondary);
  cursor: pointer;
  transition: all 0.2s ease;
  margin-top: 0.5rem;
}

.mobile-theme-toggle:hover {
  background-color: var(--hover-bg);
  color: var(--text-primary);
}

.mobile-auth-buttons {
  margin-top: 1rem;
  padding-top: 1rem;
  border-top: 1px solid var(--border-color);
}

.mobile-auth-buttons .btn {
  width: 100%;
  justify-content: center;
}

/* Button size variants */
.btn-sm {
  padding: 0.5rem 1rem;
  font-size: 0.875rem;
}

.btn-ghost {
  border: 1px solid var(--border-color);
  color: var(--text-secondary);
  background: transparent;
}

.btn-ghost:hover {
  background-color: var(--hover-bg);
  color: var(--text-primary);
}
</style>
