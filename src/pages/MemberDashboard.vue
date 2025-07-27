<template>
  <div class="min-h-screen bg-gray-50 dark:bg-gray-900 py-8">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <!-- Page Header -->
      <div class="mb-8">
        <h1 class="text-3xl font-bold text-gray-900 dark:text-white">Member Dashboard</h1>
        <p class="mt-2 text-gray-600 dark:text-gray-300" v-if="authStore.user">
          Welcome back, {{ authStore.userFullName }}!
        </p>
      </div>

      <!-- Loading State -->
      <div v-if="isLoading" class="text-center py-12">
        <div class="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
        <p class="mt-4 text-gray-600 dark:text-gray-300">Loading your dashboard...</p>
      </div>

      <!-- Error State -->
      <div v-if="error" class="bg-red-100 dark:bg-red-900/20 border border-red-400 text-red-700 dark:text-red-300 px-4 py-3 rounded mb-8">
        <p><strong>Error:</strong> {{ error }}</p>
        <button @click="loadDashboardData" class="mt-2 text-sm underline hover:no-underline">
          Try again
        </button>
      </div>

      <!-- Dashboard Content -->
      <div v-if="!isLoading && authStore.user" class="space-y-8">

        <!-- Quick Stats -->
        <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
          <!-- Membership Status -->
          <div class="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
            <div class="flex items-center">
              <div class="flex-shrink-0">
                <svg class="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                </svg>
              </div>
              <div class="ml-4">
                <h3 class="text-lg font-medium text-gray-900 dark:text-white">Membership</h3>
                <p class="text-2xl font-bold text-green-600">
                  {{ currentSubscription?.plan?.name || authStore.user.membershipType }}
                </p>
                <p class="text-sm text-gray-500 dark:text-gray-400">
                  {{ currentSubscription?.status === 'active' ? 'Active' : 'Inactive' }}
                </p>
              </div>
            </div>
          </div>

          <!-- Upcoming Classes -->
          <div class="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
            <div class="flex items-center">
              <div class="flex-shrink-0">
                <svg class="w-8 h-8 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"></path>
                </svg>
              </div>
              <div class="ml-4">
                <h3 class="text-lg font-medium text-gray-900 dark:text-white">Next Classes</h3>
                <p class="text-2xl font-bold text-blue-600">
                  {{ upcomingBookings.length }}
                </p>
                <p class="text-sm text-gray-500 dark:text-gray-400">
                  This week
                </p>
              </div>
            </div>
          </div>

          <!-- Member Since -->
          <div class="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
            <div class="flex items-center">
              <div class="flex-shrink-0">
                <svg class="w-8 h-8 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"></path>
                </svg>
              </div>
              <div class="ml-4">
                <h3 class="text-lg font-medium text-gray-900 dark:text-white">Member Since</h3>
                <p class="text-2xl font-bold text-purple-600">
                  {{ formatMemberSince(authStore.user.joinDate) }}
                </p>
                <p class="text-sm text-gray-500 dark:text-gray-400">
                  {{ membershipDuration }}
                </p>
              </div>
            </div>
          </div>
        </div>

        <!-- Main Content Grid -->
        <div class="grid grid-cols-1 lg:grid-cols-3 gap-8">

          <!-- Left Column - Profile & Subscription -->
          <div class="lg:col-span-1 space-y-6">

            <!-- Profile Management -->
            <div class="bg-white dark:bg-gray-800 rounded-lg shadow">
              <div class="px-6 py-4 border-b border-gray-200 dark:border-gray-700">
                <h3 class="text-lg font-medium text-gray-900 dark:text-white">Profile</h3>
              </div>
              <div class="p-6">
                <form @submit.prevent="saveProfile" class="space-y-4">
                  <div>
                    <label class="block text-sm font-medium text-gray-700 dark:text-gray-300">First Name</label>
                    <input
                      v-model="profile.first_name"
                      type="text"
                      class="px-3 py-2 mt-1 block w-full rounded-md border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white shadow-sm focus:border-blue-500 focus:ring-blue-500"
                    />
                  </div>
                  <div>
                    <label class="block text-sm font-medium text-gray-700 dark:text-gray-300">Last Name</label>
                    <input
                      v-model="profile.last_name"
                      type="text"
                      class="px-3 py-2 mt-1 block w-full rounded-md border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white shadow-sm focus:border-blue-500 focus:ring-blue-500"
                    />
                  </div>
                  <div>
                    <label class="block text-sm font-medium text-gray-700 dark:text-gray-300">Phone</label>
                    <input
                      v-model="profile.phone"
                      type="tel"
                      class="px-3 py-2 mt-1 block w-full rounded-md border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white shadow-sm focus:border-blue-500 focus:ring-blue-500"
                    />
                  </div>
                  <div>
                    <label class="block text-sm font-medium text-gray-700 dark:text-gray-300">Emergency Contact</label>
                    <input
                      v-model="profile.emergency_contact"
                      type="text"
                      placeholder="Name and phone number"
                      class="px-3 py-2 mt-1 block w-full rounded-md border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white shadow-sm focus:border-blue-500 focus:ring-blue-500"
                    />
                  </div>
                  <button
                    type="submit"
                    :disabled="savingProfile"
                    class="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50"
                  >
                    {{ savingProfile ? 'Saving...' : 'Save Profile' }}
                  </button>
                </form>
              </div>
            </div>

            <!-- Subscription Info -->
            <div class="bg-white dark:bg-gray-800 rounded-lg shadow">
              <div class="px-6 py-4 border-b border-gray-200 dark:border-gray-700">
                <h3 class="text-lg font-medium text-gray-900 dark:text-white">Subscription</h3>
              </div>
              <div class="p-6">
                <div v-if="currentSubscription" class="space-y-4">
                  <div>
                    <h4 class="font-medium text-gray-900 dark:text-white">{{ currentSubscription.plan?.name }}</h4>
                    <p class="text-2xl font-bold text-green-600">
                      £{{ ((currentSubscription.plan?.price_monthly || 0) / 100).toFixed(2) }}/month
                    </p>
                  </div>
                  <div class="text-sm text-gray-600 dark:text-gray-400">
                    <p><strong>Status:</strong> {{ currentSubscription.status }}</p>
                    <p v-if="currentSubscription.next_billing_date">
                      <strong>Next billing:</strong> {{ formatDate(currentSubscription.next_billing_date) }}
                    </p>
                  </div>
                  <div class="pt-4 space-y-2">
                    <router-link
                      to="/subscriptions"
                      class="block w-full text-center bg-gray-100 dark:bg-gray-700 text-gray-900 dark:text-white py-2 px-4 rounded-md hover:bg-gray-200 dark:hover:bg-gray-600"
                    >
                      Manage Subscription
                    </router-link>
                  </div>
                </div>
                <div v-else class="text-center">
                  <p class="text-gray-600 dark:text-gray-400 mb-4">No active subscription</p>
                  <router-link
                    to="/subscriptions"
                    class="bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700"
                  >
                    Choose Plan
                  </router-link>
                </div>
              </div>
            </div>
          </div>

          <!-- Right Column - Classes & Bookings -->
          <div class="lg:col-span-2 space-y-6">

            <!-- Upcoming Classes -->
            <div class="bg-white dark:bg-gray-800 rounded-lg shadow">
              <div class="px-6 py-4 border-b border-gray-200 dark:border-gray-700 flex justify-between items-center">
                <h3 class="text-lg font-medium text-gray-900 dark:text-white">Upcoming Classes</h3>
                <router-link
                  to="/timetable"
                  class="text-blue-600 hover:text-blue-700 text-sm font-medium"
                >
                  View Timetable
                </router-link>
              </div>
              <div class="p-6">
                <div v-if="upcomingBookings.length > 0" class="space-y-4">
                  <div
                    v-for="booking in upcomingBookings.slice(0, 5)"
                    :key="booking.id"
                    class="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-700 rounded-lg"
                  >
                    <div>
                      <h4 class="font-medium text-gray-900 dark:text-white">
                        {{ booking.class?.name }}
                      </h4>
                      <p class="text-sm text-gray-600 dark:text-gray-400">
                        {{ formatDate(booking.booking_date) }} at {{ formatTime(booking.class?.start_time) }}
                      </p>
                      <p class="text-xs text-gray-500 dark:text-gray-500" v-if="booking.class?.instructor">
                        with {{ booking.class.instructor }}
                      </p>
                    </div>
                    <div class="flex space-x-2">
                      <span class="px-2 py-1 bg-green-100 text-green-800 text-xs rounded-full">
                        {{ booking.status }}
                      </span>
                      <button
                        @click="cancelBooking(booking.id)"
                        class="text-red-600 hover:text-red-700 text-sm"
                      >
                        Cancel
                      </button>
                    </div>
                  </div>
                </div>
                <div v-else class="text-center py-8">
                  <svg class="w-12 h-12 mx-auto text-gray-400 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"></path>
                  </svg>
                  <h4 class="text-lg font-medium text-gray-900 dark:text-white mb-2">No upcoming classes</h4>
                  <p class="text-gray-600 dark:text-gray-400 mb-4">Book your first class to get started!</p>
                  <router-link
                    to="/timetable"
                    class="bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700"
                  >
                    Browse Classes
                  </router-link>
                </div>
              </div>
            </div>

            <!-- Quick Actions -->
            <div class="bg-white dark:bg-gray-800 rounded-lg shadow">
              <div class="px-6 py-4 border-b border-gray-200 dark:border-gray-700">
                <h3 class="text-lg font-medium text-gray-900 dark:text-white">Quick Actions</h3>
              </div>
              <div class="p-6">
                <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <router-link
                    to="/timetable"
                    class="flex items-center p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg hover:bg-blue-100 dark:hover:bg-blue-900/30 transition-colors"
                  >
                    <svg class="w-8 h-8 text-blue-600 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"></path>
                    </svg>
                    <div>
                      <h4 class="font-medium text-gray-900 dark:text-white">Book Classes</h4>
                      <p class="text-sm text-gray-600 dark:text-gray-400">View timetable and book</p>
                    </div>
                  </router-link>

                  <router-link
                    to="/subscriptions"
                    class="flex items-center p-4 bg-green-50 dark:bg-green-900/20 rounded-lg hover:bg-green-100 dark:hover:bg-green-900/30 transition-colors"
                  >
                    <svg class="w-8 h-8 text-green-600 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z"></path>
                    </svg>
                    <div>
                      <h4 class="font-medium text-gray-900 dark:text-white">Manage Subscription</h4>
                      <p class="text-sm text-gray-600 dark:text-gray-400">Change or cancel plan</p>
                    </div>
                  </router-link>

                  <router-link
                    to="/contact"
                    class="flex items-center p-4 bg-purple-50 dark:bg-purple-900/20 rounded-lg hover:bg-purple-100 dark:hover:bg-purple-900/30 transition-colors"
                  >
                    <svg class="w-8 h-8 text-purple-600 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"></path>
                    </svg>
                    <div>
                      <h4 class="font-medium text-gray-900 dark:text-white">Contact Us</h4>
                      <p class="text-sm text-gray-600 dark:text-gray-400">Get help or ask questions</p>
                    </div>
                  </router-link>

                  <button
                    @click="signOut"
                    class="flex items-center p-4 bg-red-50 dark:bg-red-900/20 rounded-lg hover:bg-red-100 dark:hover:bg-red-900/30 transition-colors"
                  >
                    <svg class="w-8 h-8 text-red-600 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"></path>
                    </svg>
                    <div>
                      <h4 class="font-medium text-gray-900 dark:text-white">Sign Out</h4>
                      <p class="text-sm text-gray-600 dark:text-gray-400">Log out of your account</p>
                    </div>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Success Message -->
      <div v-if="successMessage" class="fixed bottom-4 right-4 bg-green-500 text-white px-6 py-3 rounded-lg shadow-lg">
        {{ successMessage }}
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, onMounted, computed } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/auth'
import { subscriptionsAPI, classesAPI, profileAPI } from '@/services/api'
import type { UserSubscription, ClassBooking, UserProfile } from '@/types'

const authStore = useAuthStore()
const router = useRouter()

// State
const isLoading = ref(false)
const savingProfile = ref(false)
const error = ref<string | null>(null)
const successMessage = ref<string | null>(null)

// Data
const currentSubscription = ref<UserSubscription | null>(null)
const upcomingBookings = ref<ClassBooking[]>([])
const profile = reactive({
  first_name: '',
  last_name: '',
  phone: '',
  emergency_contact: ''
})

// Computed
const membershipDuration = computed(() => {
  if (!authStore.user?.joinDate) return ''
  const joinDate = new Date(authStore.user.joinDate)
  const now = new Date()
  const months = Math.floor((now.getTime() - joinDate.getTime()) / (1000 * 60 * 60 * 24 * 30))

  if (months < 1) return 'New member'
  if (months < 12) return `${months} month${months > 1 ? 's' : ''}`

  const years = Math.floor(months / 12)
  const remainingMonths = months % 12
  return `${years} year${years > 1 ? 's' : ''}${remainingMonths > 0 ? ` ${remainingMonths}mo` : ''}`
})

// Methods
const loadDashboardData = async () => {
  if (!authStore.user) return

  isLoading.value = true
  error.value = null

  try {
    // Load all data in parallel
    const [subscriptionResponse, bookingsResponse, profileResponse] = await Promise.all([
      subscriptionsAPI.getUserSubscription(),
      classesAPI.getUserBookings(),
      profileAPI.getProfile()
    ])

    // Handle subscription
    if (subscriptionResponse.success) {
      currentSubscription.value = subscriptionResponse.data
    }

    // Handle bookings
    if (bookingsResponse.success && bookingsResponse.data) {
      upcomingBookings.value = bookingsResponse.data
    }

    // Handle profile
    if (profileResponse.success && profileResponse.data) {
      Object.assign(profile, {
        first_name: profileResponse.data.first_name || '',
        last_name: profileResponse.data.last_name || '',
        phone: profileResponse.data.phone || '',
        emergency_contact: profileResponse.data.emergency_contact || ''
      })
    }

  } catch (err: unknown) {
    const errorMessage = err instanceof Error ? err.message : 'Failed to load dashboard data'
    error.value = errorMessage
    console.error('Dashboard loading error:', err)
  } finally {
    isLoading.value = false
  }
}

const saveProfile = async () => {
  savingProfile.value = true
  error.value = null

  try {
    const response = await profileAPI.updateProfile(profile)

    if (response.success) {
      successMessage.value = 'Profile updated successfully!'
      setTimeout(() => {
        successMessage.value = null
      }, 3000)

      // Update auth store
      await authStore.checkAuthStatus()
    } else {
      throw new Error(response.error || 'Failed to save profile')
    }
  } catch (err: unknown) {
    const errorMessage = err instanceof Error ? err.message : 'Failed to save profile'
    error.value = errorMessage
  } finally {
    savingProfile.value = false
  }
}

const cancelBooking = async (bookingId: string) => {
  if (!confirm('Are you sure you want to cancel this booking?')) return

  try {
    const response = await classesAPI.cancelBooking(bookingId)

    if (response.success) {
      // Remove from local state
      upcomingBookings.value = upcomingBookings.value.filter(b => b.id !== bookingId)
      successMessage.value = 'Booking cancelled successfully!'
      setTimeout(() => {
        successMessage.value = null
      }, 3000)
    } else {
      throw new Error(response.error || 'Failed to cancel booking')
    }
  } catch (err: unknown) {
    const errorMessage = err instanceof Error ? err.message : 'Failed to cancel booking'
    error.value = errorMessage
  }
}

const signOut = async () => {
  await authStore.logout()
  router.push('/member')
}

const formatDate = (dateString: string): string => {
  const date = new Date(dateString)
  return date.toLocaleDateString('en-GB', {
    weekday: 'short',
    month: 'short',
    day: 'numeric'
  })
}

const formatTime = (timeString: string | undefined): string => {
  if (!timeString) return ''
  try {
    const [hours, minutes] = timeString.split(':')
    const hour = parseInt(hours, 10)
    const period = hour >= 12 ? 'PM' : 'AM'
    const displayHour = hour === 0 ? 12 : hour > 12 ? hour - 12 : hour
    return `${displayHour}:${minutes} ${period}`
  } catch {
    return timeString
  }
}

const formatMemberSince = (dateString: string): string => {
  const date = new Date(dateString)
  return date.toLocaleDateString('en-GB', {
    month: 'short',
    year: 'numeric'
  })
}

// Initialize
onMounted(async () => {
  await authStore.checkAuthStatus()
  if (authStore.isAuthenticated) {
    await loadDashboardData()
  } else {
    router.push('/member')
  }
})
</script>

<style scoped>
/* Custom styles if needed */
input:focus {
  outline: none;
  box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
}
</style>
