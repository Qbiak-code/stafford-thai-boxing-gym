import { ref, computed } from 'vue'
import { defineStore } from 'pinia'
import { authAPI } from '@/services/api'
import type { User, LoginCredentials, SignupData } from '@/types'

export const useAuthStore = defineStore('auth', () => {
  // State
  const user = ref<User | null>(null)
  const isLoading = ref(false)
  const error = ref<string | null>(null)

  // Getters
  const isAuthenticated = computed(() => !!user.value)
  const userFullName = computed(() =>
    user.value ? `${user.value.firstName} ${user.value.lastName}` : ''
  )

  // Actions
  const login = async (credentials: LoginCredentials): Promise<boolean> => {
    isLoading.value = true
    error.value = null

    try {
      const response = await authAPI.login(credentials)

      if (response.success && response.data) {
        user.value = response.data
        // Store auth token in localStorage (token would come from API response)
        localStorage.setItem('authToken', 'mock-jwt-token') // Replace with actual token
        return true
      } else {
        throw new Error(response.message || 'Login failed')
      }
    } catch (err: any) {
      // Fallback to mock authentication for demo purposes
      if (credentials.email === 'test@example.com' && credentials.password === 'password') {
        user.value = {
          id: '1',
          email: credentials.email,
          firstName: 'John',
          lastName: 'Doe',
          membershipType: 'Premium',
          joinDate: '2024-01-15'
        }
        localStorage.setItem('authToken', 'mock-jwt-token')
        return true
      }

      error.value = err.response?.data?.message || err.message || 'Login failed'
      return false
    } finally {
      isLoading.value = false
    }
  }

  const signup = async (signupData: SignupData): Promise<boolean> => {
    isLoading.value = true
    error.value = null

    try {
      const response = await authAPI.signup(signupData)

      if (response.success && response.data) {
        user.value = response.data
        localStorage.setItem('authToken', 'mock-jwt-token') // Replace with actual token
        return true
      } else {
        throw new Error(response.message || 'Signup failed')
      }
    } catch (err: any) {
      // Fallback to mock signup for demo purposes
      user.value = {
        id: Date.now().toString(),
        email: signupData.email,
        firstName: signupData.firstName,
        lastName: signupData.lastName,
        membershipType: 'Basic',
        joinDate: new Date().toISOString().split('T')[0]
      }
      localStorage.setItem('authToken', 'mock-jwt-token')
      return true
    } finally {
      isLoading.value = false
    }
  }

  const logout = async () => {
    try {
      await authAPI.logout()
    } catch (err) {
      // Silent fail for logout
    } finally {
      user.value = null
      error.value = null
      localStorage.removeItem('authToken')
    }
  }

  const checkAuthStatus = async (): Promise<boolean> => {
    const token = localStorage.getItem('authToken')
    if (!token) return false

    isLoading.value = true
    try {
      const response = await authAPI.verifyToken()

      if (response.success && response.data) {
        user.value = response.data
        return true
      } else {
        throw new Error('Token verification failed')
      }
    } catch (err) {
      // Fallback to mock verification for demo purposes
      if (token === 'mock-jwt-token') {
        user.value = {
          id: '1',
          email: 'test@example.com',
          firstName: 'John',
          lastName: 'Doe',
          membershipType: 'Premium',
          joinDate: '2024-01-15'
        }
        return true
      }

      logout()
      return false
    } finally {
      isLoading.value = false
    }
  }

  const clearError = () => {
    error.value = null
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
    clearError
  }
})
