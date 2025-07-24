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
      console.warn("Could not initialize dark mode:", error)
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
        console.log("Dark mode enabled")
      } else {
        htmlElement.classList.remove("dark")
        console.log("Dark mode disabled")
      }
    } catch (error) {
      console.error("Error updating HTML class:", error)
    }
  }

  // Toggle dark mode
  const toggleDarkMode = () => {
    isDark.value = !isDark.value
    console.log("Toggled dark mode to:", isDark.value)
  }

  // Watch for changes and persist to localStorage
  watch(isDark, (newValue) => {
    try {
      localStorage.setItem("darkMode", newValue.toString())
      updateHtmlClass()
    } catch (error) {
      console.error("Error saving dark mode preference:", error)
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
