import { ref, onMounted, watch } from "vue"

export function useDarkMode() {
  const isDark = ref(false)

  // Initialize dark mode from localStorage or system preference
  const initDarkMode = () => {
    try {
      const stored = localStorage.getItem("darkMode")
      if (stored !== null) {
        isDark.value = stored === "true"
      } else {
        // Check system preference
        isDark.value = window.matchMedia("(prefers-color-scheme: dark)").matches
      }
      updateHtmlClass()
    } catch (error) {
      // Fallback to light mode if localStorage is not available
      isDark.value = false
      updateHtmlClass()
    }
  }

  // Update the HTML class for dark mode
  const updateHtmlClass = () => {
    try {
      const htmlElement = document.documentElement
      if (isDark.value) {
        htmlElement.classList.add("dark")
      } else {
        htmlElement.classList.remove("dark")
      }
    } catch (error) {
      // Silent fail - DOM manipulation might not be available in SSR
    }
  }

  // Toggle dark mode
  const toggleDarkMode = () => {
    isDark.value = !isDark.value
  }

  // Watch for changes and persist to localStorage
  watch(isDark, (newValue) => {
    try {
      localStorage.setItem("darkMode", newValue.toString())
      updateHtmlClass()
    } catch (error) {
      // Silent fail if localStorage is not available
    }
  })

  // Initialize on mount
  onMounted(() => {
    initDarkMode()
  })

  return {
    isDark,
    toggleDarkMode,
  }
}
