<template>
  <div class="min-h-screen bg-gray-50 dark:bg-gray-900 py-8">
    <div class="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
      <!-- Header -->
      <div class="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6 mb-8">
        <div class="flex items-center justify-between">
          <div>
            <h1 class="text-3xl font-bold text-gray-900 dark:text-white">Member Dashboard</h1>
            <p class="text-gray-600 dark:text-gray-400 mt-1">
              Welcome back, {{ authStore.userFullName }}!
            </p>
          </div>
          <button
            @click="handleSignOut"
            class="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-md transition-colors duration-200"
          >
            Sign Out
          </button>
        </div>
      </div>

      <!-- Loading State -->
      <div v-if="isLoading" class="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-8 text-center">
        <div class="flex items-center justify-center space-x-3">
          <svg class="animate-spin h-5 w-5 text-blue-600" fill="none" viewBox="0 0 24 24">
            <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
            <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
          </svg>
          <span class="text-gray-900 dark:text-white">Loading profile...</span>
        </div>
      </div>

      <!-- Error State -->
      <div v-else-if="error" class="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-4 mb-8">
        <div class="flex">
          <svg class="h-5 w-5 text-red-400" fill="currentColor" viewBox="0 0 20 20">
            <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clip-rule="evenodd" />
          </svg>
          <div class="ml-3">
            <p class="text-sm text-red-800 dark:text-red-400">{{ error }}</p>
            <button @click="retryLoadProfile" class="text-red-600 hover:text-red-800 text-xs mt-1">
              Try again
            </button>
          </div>
        </div>
      </div>

      <!-- Success Message -->
      <div v-if="successMessage" class="bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg p-4 mb-8">
        <div class="flex">
          <svg class="h-5 w-5 text-green-400" fill="currentColor" viewBox="0 0 20 20">
            <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clip-rule="evenodd" />
          </svg>
          <p class="ml-3 text-sm text-green-800 dark:text-green-400">{{ successMessage }}</p>
        </div>
      </div>

      <!-- Profile Form -->
      <div v-else class="space-y-8">
        <!-- User Information Card -->
        <div class="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6">
          <h2 class="text-xl font-semibold text-gray-900 dark:text-white mb-4">Account Information</h2>
          <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Email
              </label>
              <input
                type="email"
                :value="authStore.user?.email"
                disabled
                class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-gray-50 dark:bg-gray-700 text-gray-500 dark:text-gray-400"
              />
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Member Since
              </label>
              <input
                type="text"
                :value="formatDate(authStore.user?.joinDate)"
                disabled
                class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-gray-50 dark:bg-gray-700 text-gray-500 dark:text-gray-400"
              />
            </div>
          </div>
        </div>

        <!-- Profile Form -->
        <form @submit.prevent="saveProfile" class="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6">
          <h2 class="text-xl font-semibold text-gray-900 dark:text-white mb-6">Profile & Medical Information</h2>

          <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
            <!-- Personal Information -->
            <div class="space-y-4">
              <h3 class="text-lg font-medium text-gray-900 dark:text-white">Personal Information</h3>

              <div>
                <label for="firstName" class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  First Name
                </label>
                <input
                  id="firstName"
                  v-model="profile.firstName"
                  type="text"
                  required
                  class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>

              <div>
                <label for="lastName" class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Last Name
                </label>
                <input
                  id="lastName"
                  v-model="profile.lastName"
                  type="text"
                  required
                  class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>

              <div>
                <label for="contactNumber" class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Contact Number
                </label>
                <input
                  id="contactNumber"
                  v-model="profile.contactNumber"
                  type="tel"
                  class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
            </div>

            <!-- Emergency & Medical Information -->
            <div class="space-y-4">
              <h3 class="text-lg font-medium text-gray-900 dark:text-white">Emergency & Medical</h3>

              <div>
                <label for="emergencyContactName" class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Emergency Contact Name
                </label>
                <input
                  id="emergencyContactName"
                  v-model="profile.emergencyContactName"
                  type="text"
                  class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>

              <div>
                <label for="emergencyContactNumber" class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Emergency Contact Number
                </label>
                <input
                  id="emergencyContactNumber"
                  v-model="profile.emergencyContactNumber"
                  type="tel"
                  class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
            </div>
          </div>

          <!-- Medical Information -->
          <div class="mt-6 space-y-4">
            <div>
              <label for="medicalConditions" class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Medical Conditions
              </label>
              <textarea
                id="medicalConditions"
                v-model="profile.medicalConditions"
                rows="3"
                class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                placeholder="List any medical conditions we should be aware of..."
              ></textarea>
            </div>

            <div>
              <label for="allergies" class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Allergies
              </label>
              <textarea
                id="allergies"
                v-model="profile.allergies"
                rows="3"
                class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                placeholder="List any allergies..."
              ></textarea>
            </div>
          </div>

          <!-- Submit Button -->
          <div class="mt-6 flex justify-end">
            <button
              type="submit"
              :disabled="isSaving"
              class="px-6 py-2 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white rounded-md transition-colors duration-200 disabled:cursor-not-allowed"
            >
              <span v-if="isSaving" class="flex items-center">
                <svg class="animate-spin h-4 w-4 mr-2" fill="none" viewBox="0 0 24 24">
                  <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                  <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Saving...
              </span>
              <span v-else>Save Profile</span>
            </button>
          </div>
        </form>

        <!-- Quick Actions -->
        <div class="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6">
          <h2 class="text-xl font-semibold text-gray-900 dark:text-white mb-4">Quick Actions</h2>
          <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
            <router-link
              to="/timetable"
              class="flex items-center justify-center px-4 py-3 bg-blue-50 dark:bg-blue-900/20 text-blue-700 dark:text-blue-400 rounded-md hover:bg-blue-100 dark:hover:bg-blue-900/30 transition-colors duration-200"
            >
              View Class Timetable
            </router-link>
            <router-link
              to="/subscriptions"
              class="flex items-center justify-center px-4 py-3 bg-green-50 dark:bg-green-900/20 text-green-700 dark:text-green-400 rounded-md hover:bg-green-100 dark:hover:bg-green-900/30 transition-colors duration-200"
            >
              Manage Subscription
            </router-link>
            <router-link
              to="/contact"
              class="flex items-center justify-center px-4 py-3 bg-purple-50 dark:bg-purple-900/20 text-purple-700 dark:text-purple-400 rounded-md hover:bg-purple-100 dark:hover:bg-purple-900/30 transition-colors duration-200"
            >
              Contact Support
            </router-link>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/auth'

// Profile interface
interface MemberProfile {
  firstName: string
  lastName: string
  contactNumber: string
  emergencyContactName: string
  emergencyContactNumber: string
  medicalConditions: string
  allergies: string
}

// State
const authStore = useAuthStore()
const router = useRouter()
const isLoading = ref(true)
const isSaving = ref(false)
const error = ref<string | null>(null)
const successMessage = ref<string | null>(null)

// Profile data
const profile = reactive<MemberProfile>({
  firstName: '',
  lastName: '',
  contactNumber: '',
  emergencyContactName: '',
  emergencyContactNumber: '',
  medicalConditions: '',
  allergies: ''
})

// Initialize profile data
onMounted(async () => {
  await loadProfile()
})

const loadProfile = async () => {
  isLoading.value = true
  error.value = null

  try {
    // Initialize with user data from auth store
    if (authStore.user) {
      profile.firstName = authStore.user.firstName
      profile.lastName = authStore.user.lastName
    }

    // TODO: Replace with actual API call to load profile
    await new Promise(resolve => setTimeout(resolve, 1000)) // Simulate API call

    // Mock additional profile data
    profile.contactNumber = '+44 7700 900123'
    profile.emergencyContactName = 'Jane Doe'
    profile.emergencyContactNumber = '+44 7700 900456'
    profile.medicalConditions = ''
    profile.allergies = ''

  } catch (err) {
    error.value = 'Failed to load profile information'
  } finally {
    isLoading.value = false
  }
}

const saveProfile = async () => {
  isSaving.value = true
  error.value = null
  successMessage.value = null

  try {
    // TODO: Replace with actual API call to save profile
    await new Promise(resolve => setTimeout(resolve, 1500)) // Simulate API call

    successMessage.value = 'Profile updated successfully!'

    // Clear success message after 5 seconds
    setTimeout(() => {
      successMessage.value = null
    }, 5000)

  } catch (err) {
    error.value = 'Failed to save profile. Please try again.'
  } finally {
    isSaving.value = false
  }
}

const handleSignOut = async () => {
  await authStore.logout()
  router.push('/member')
}

const retryLoadProfile = () => {
  loadProfile()
}

const formatDate = (dateString?: string): string => {
  if (!dateString) return 'Unknown'
  return new Date(dateString).toLocaleDateString('en-GB', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  })
}
</script>
