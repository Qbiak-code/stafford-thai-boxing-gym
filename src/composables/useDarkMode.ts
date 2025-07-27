import { ref, computed, watch } from "vue"

const isDark = ref(false)

export function useDarkMode() {
  // Initialize dark mode from localStorage or system preference
  const initializeDarkMode = () => {
    const stored = localStorage.getItem("darkMode")
    if (stored !== null) {
      isDark.value = JSON.parse(stored)
    } else {
      // Check system preference
      isDark.value = window.matchMedia("(prefers-color-scheme: dark)").matches
    }
    updateDomClass()
  }

  // Update DOM class
  const updateDomClass = () => {
    const htmlElement = document.documentElement
    if (isDark.value) {
      htmlElement.classList.add("dark")
    } else {
      htmlElement.classList.remove("dark")
    }
  }

  // Toggle dark mode
  const toggleDarkMode = () => {
    isDark.value = !isDark.value
    localStorage.setItem("darkMode", JSON.stringify(isDark.value))
    updateDomClass()
  }

  // Set dark mode explicitly
  const setDarkMode = (value: boolean) => {
    isDark.value = value
    localStorage.setItem("darkMode", JSON.stringify(value))
    updateDomClass()
  }

  // Auto-initialize when composable is used
  if (typeof window !== "undefined") {
    initializeDarkMode()
  }

  return {
    isDark: computed(() => isDark.value),
    toggleDarkMode,
    setDarkMode,
    initializeDarkMode,
  }
}
