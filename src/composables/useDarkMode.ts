import { ref, computed } from "vue"

const isDark = ref(true) // Default to dark mode

export function useDarkMode() {
  // Initialize theme from localStorage or default to dark
  const initializeTheme = () => {
    const stored = localStorage.getItem("theme")
    if (stored !== null) {
      isDark.value = stored === "dark"
    } else {
      // Default to dark mode for our app
      isDark.value = true
    }
    updateBodyClass()
  }

  // Update body class for theme
  const updateBodyClass = () => {
    const body = document.body
    if (isDark.value) {
      body.classList.remove("light-mode")
      // Default is dark mode (no class needed)
    } else {
      body.classList.add("light-mode")
    }
  }

  // Toggle between light and dark
  const toggleTheme = () => {
    isDark.value = !isDark.value
    localStorage.setItem("theme", isDark.value ? "dark" : "light")
    updateBodyClass()
  }

  // Set theme explicitly
  const setTheme = (theme: "light" | "dark") => {
    isDark.value = theme === "dark"
    localStorage.setItem("theme", theme)
    updateBodyClass()
  }

  // Auto-initialize when composable is used
  if (typeof window !== "undefined") {
    initializeTheme()
  }

  return {
    isDark: computed(() => isDark.value),
    toggleTheme,
    setTheme,
    initializeTheme,
  }
}
