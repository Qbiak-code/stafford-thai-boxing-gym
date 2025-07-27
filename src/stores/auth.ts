import { ref, computed } from "vue"
import { defineStore } from "pinia"
import { supabase } from "@/lib/supabase"
import type { User, LoginCredentials, SignupData } from "@/types"

export const useAuthStore = defineStore("auth", () => {
  // State
  const user = ref<User | null>(null)
  const isLoading = ref(false)
  const error = ref<string | null>(null)

  // Getters
  const isAuthenticated = computed(() => !!user.value)
  const userFullName = computed(() =>
    user.value ? `${user.value.firstName} ${user.value.lastName}` : "",
  )

  // Actions
  const login = async (credentials: LoginCredentials): Promise<boolean> => {
    isLoading.value = true
    error.value = null

    try {
      const { data: authData, error: authError } = await supabase.auth.signInWithPassword({
        email: credentials.email,
        password: credentials.password,
      })

      if (authError) throw authError

      if (authData.user) {
        // Get user profile from profiles table
        const { data: profile, error: profileError } = await supabase
          .from("profiles")
          .select("*")
          .eq("id", authData.user.id)
          .single()

        if (profileError && profileError.code !== "PGRST116") {
          // PGRST116 is "not found" - we'll create profile if it doesn't exist
          throw profileError
        }

        user.value = {
          id: authData.user.id,
          email: authData.user.email!,
          firstName: profile?.first_name || "",
          lastName: profile?.last_name || "",
          membershipType: profile?.membership_type || "Basic",
          joinDate: profile?.created_at?.split("T")[0] || new Date().toISOString().split("T")[0],
        }

        return true
      }

      return false
    } catch (err: unknown) {
      error.value = err instanceof Error ? err.message : "Login failed"
      return false
    } finally {
      isLoading.value = false
    }
  }

  const signup = async (signupData: SignupData): Promise<boolean> => {
    isLoading.value = true
    error.value = null

    try {
      const { data: authData, error: authError } = await supabase.auth.signUp({
        email: signupData.email,
        password: signupData.password,
        options: {
          data: {
            first_name: signupData.firstName,
            last_name: signupData.lastName,
          },
        },
      })

      if (authError) throw authError

      if (authData.user) {
        // Create or update profile
        const { error: profileError } = await supabase.from("profiles").upsert({
          id: authData.user.id,
          first_name: signupData.firstName,
          last_name: signupData.lastName,
          membership_type: "Basic",
        })

        if (profileError) throw profileError

        user.value = {
          id: authData.user.id,
          email: authData.user.email!,
          firstName: signupData.firstName,
          lastName: signupData.lastName,
          membershipType: "Basic",
          joinDate: new Date().toISOString().split("T")[0],
        }

        return true
      }

      return false
    } catch (err: unknown) {
      error.value = err instanceof Error ? err.message : "Signup failed"
      return false
    } finally {
      isLoading.value = false
    }
  }

  const logout = async () => {
    try {
      const { error } = await supabase.auth.signOut()
      if (error) throw error
    } catch (err: unknown) {
      console.error("Logout error:", err instanceof Error ? err.message : "Unknown error")
    } finally {
      user.value = null
      error.value = null
    }
  }

  const checkAuthStatus = async (): Promise<boolean> => {
    isLoading.value = true

    try {
      const {
        data: { session },
        error,
      } = await supabase.auth.getSession()

      if (error) throw error

      if (session?.user) {
        // Get user profile
        const { data: profile, error: profileError } = await supabase
          .from("profiles")
          .select("*")
          .eq("id", session.user.id)
          .single()

        if (profileError && profileError.code !== "PGRST116") {
          throw profileError
        }

        user.value = {
          id: session.user.id,
          email: session.user.email!,
          firstName: profile?.first_name || "",
          lastName: profile?.last_name || "",
          membershipType: profile?.membership_type || "Basic",
          joinDate: profile?.created_at?.split("T")[0] || new Date().toISOString().split("T")[0],
        }

        return true
      }

      return false
    } catch (err: unknown) {
      error.value = err instanceof Error ? err.message : "Authentication check failed"
      return false
    } finally {
      isLoading.value = false
    }
  }

  const clearError = () => {
    error.value = null
  }

  // Initialize auth state on store creation
  const initializeAuth = async () => {
    await checkAuthStatus()

    // Listen for auth changes
    supabase.auth.onAuthStateChange(async (event, session) => {
      if (event === "SIGNED_IN" && session?.user) {
        await checkAuthStatus()
      } else if (event === "SIGNED_OUT") {
        user.value = null
        error.value = null
      }
    })
  }

  return {
    // State
    user,
    isLoading,
    error,
    // Getters
    isAuthenticated,
    userFullName,
    // Actions
    login,
    signup,
    logout,
    checkAuthStatus,
    clearError,
    initializeAuth,
  }
})
