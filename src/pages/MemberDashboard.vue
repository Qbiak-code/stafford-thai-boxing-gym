<template>
  <div class="dashboard-page">
    <div class="container">
      <!-- Page Header -->
      <div class="page-header">
        <h1>Member Dashboard</h1>
        <p v-if="authStore.user">
          Welcome back, {{ authStore.userFullName }}!
        </p>
      </div>

      <!-- Loading State -->
      <div v-if="isLoading" class="loading-state">
        <div class="spinner"></div>
        <p>Loading your dashboard...</p>
      </div>

      <!-- Error State -->
      <div v-if="error" class="error-state">
        <p><strong>Error:</strong> {{ error }}</p>
        <button @click="loadDashboardData" class="btn btn-ghost btn-sm">
          Try again
        </button>
      </div>

      <!-- Dashboard Content -->
      <div v-if="!isLoading && authStore.user" class="dashboard-content">

        <!-- Quick Stats -->
        <div class="stats-grid">
          <!-- Membership Status -->
          <div class="stat-card membership-card">
            <div class="stat-icon">
              <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <div class="stat-content">
              <h3>Membership</h3>
              <p class="stat-value">
                {{ currentSubscription?.plan?.name || authStore.user.membershipType }}
              </p>
              <p class="stat-label">
                {{ currentSubscription?.status === 'active' ? 'Active' : 'Inactive' }}
              </p>
            </div>
          </div>

          <!-- Upcoming Classes -->
          <div class="stat-card classes-card">
            <div class="stat-icon">
              <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
            </div>
            <div class="stat-content">
              <h3>Next Classes</h3>
              <p class="stat-value">
                {{ upcomingBookings.length }}
              </p>
              <p class="stat-label">
                This week
              </p>
            </div>
          </div>

          <!-- Member Since -->
          <div class="stat-card duration-card">
            <div class="stat-icon">
              <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
              </svg>
            </div>
            <div class="stat-content">
              <h3>Member Since</h3>
              <p class="stat-value">
                {{ formatMemberSince(authStore.user.joinDate) }}
              </p>
              <p class="stat-label">
                {{ membershipDuration }}
              </p>
            </div>
          </div>
        </div>

        <!-- Main Content Grid -->
        <div class="main-grid">

          <!-- Left Column - Profile & Subscription -->
          <div class="left-column">

            <!-- Profile Management -->
            <div class="dashboard-card">
              <div class="card-header">
                <h3>Profile Information</h3>
              </div>
              <div class="card-content">
                <form @submit.prevent="saveProfile" class="profile-form">
                  <div class="form-row">
                    <div class="form-group">
                      <label>First Name</label>
                      <input
                        v-model="profile.first_name"
                        type="text"
                        class="form-input"
                      />
                    </div>
                    <div class="form-group">
                      <label>Last Name</label>
                      <input
                        v-model="profile.last_name"
                        type="text"
                        class="form-input"
                      />
                    </div>
                  </div>
                  <div class="form-group">
                    <label>Phone Number</label>
                    <input
                      v-model="profile.phone"
                      type="tel"
                      class="form-input"
                    />
                  </div>
                  <div class="form-group">
                    <label>Emergency Contact</label>
                    <input
                      v-model="profile.emergency_contact"
                      type="text"
                      placeholder="Name and phone number"
                      class="form-input"
                    />
                  </div>
                  <button
                    type="submit"
                    :disabled="savingProfile"
                    class="btn btn-primary"
                  >
                    {{ savingProfile ? 'Saving...' : 'Save Profile' }}
                  </button>
                </form>
              </div>
            </div>

            <!-- Subscription Info -->
            <div class="dashboard-card">
              <div class="card-header">
                <h3>Subscription</h3>
              </div>
              <div class="card-content">
                <div v-if="currentSubscription" class="subscription-info">
                  <div class="subscription-details">
                    <h4>{{ currentSubscription.plan?.name }}</h4>
                    <p class="price">
                      £{{ ((currentSubscription.plan?.price_monthly || 0) / 100).toFixed(2) }}/month
                    </p>
                  </div>
                  <div class="subscription-meta">
                    <p><strong>Status:</strong> {{ currentSubscription.status }}</p>
                    <p v-if="currentSubscription.next_billing_date">
                      <strong>Next billing:</strong> {{ formatDate(currentSubscription.next_billing_date) }}
                    </p>
                  </div>
                  <div class="subscription-actions">
                    <router-link
                      to="/subscriptions"
                      class="btn btn-ghost"
                    >
                      Manage Subscription
                    </router-link>
                  </div>
                </div>
                <div v-else class="no-subscription">
                  <p>No active subscription</p>
                  <router-link
                    to="/subscriptions"
                    class="btn btn-primary"
                  >
                    Choose Plan
                  </router-link>
                </div>
              </div>
            </div>
          </div>

          <!-- Right Column - Classes & Actions -->
          <div class="right-column">

            <!-- Upcoming Classes -->
            <div class="dashboard-card">
              <div class="card-header">
                <h3>Upcoming Classes</h3>
                <router-link
                  to="/timetable"
                  class="header-link"
                >
                  View Timetable
                </router-link>
              </div>
              <div class="card-content">
                <div v-if="upcomingBookings.length > 0" class="bookings-list">
                  <div
                    v-for="booking in upcomingBookings.slice(0, 5)"
                    :key="booking.id"
                    class="booking-item"
                  >
                    <div class="booking-info">
                      <h4>{{ booking.class?.name }}</h4>
                      <p class="booking-time">
                        {{ formatDate(booking.booking_date) }} at {{ formatTime(booking.class?.start_time) }}
                      </p>
                      <p class="booking-instructor" v-if="booking.class?.instructor">
                        with {{ booking.class.instructor }}
                      </p>
                    </div>
                    <div class="booking-actions">
                      <span class="status-badge">{{ booking.status }}</span>
                      <button
                        @click="cancelBooking(booking.id)"
                        class="btn btn-ghost btn-sm"
                      >
                        Cancel
                      </button>
                    </div>
                  </div>
                </div>
                <div v-else class="empty-state">
                  <div class="empty-icon">
                    <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                  </div>
                  <h4>No upcoming classes</h4>
                  <p>Book your first class to get started!</p>
                  <router-link
                    to="/timetable"
                    class="btn btn-primary"
                  >
                    Browse Classes
                  </router-link>
                </div>
              </div>
            </div>

            <!-- Quick Actions -->
            <div class="dashboard-card">
              <div class="card-header">
                <h3>Quick Actions</h3>
              </div>
              <div class="card-content">
                <div class="actions-grid">
                  <router-link
                    to="/timetable"
                    class="action-item"
                  >
                    <div class="action-icon action-icon-primary">
                      <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                      </svg>
                    </div>
                    <div class="action-content">
                      <h4>Book Classes</h4>
                      <p>View timetable and book</p>
                    </div>
                  </router-link>

                  <router-link
                    to="/subscriptions"
                    class="action-item"
                  >
                    <div class="action-icon action-icon-secondary">
                      <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
                      </svg>
                    </div>
                    <div class="action-content">
                      <h4>Manage Subscription</h4>
                      <p>Change or cancel plan</p>
                    </div>
                  </router-link>

                  <router-link
                    to="/contact"
                    class="action-item"
                  >
                    <div class="action-icon action-icon-tertiary">
                      <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                      </svg>
                    </div>
                    <div class="action-content">
                      <h4>Contact Us</h4>
                      <p>Get help or ask questions</p>
                    </div>
                  </router-link>

                  <button
                    @click="signOut"
                    class="action-item logout-action"
                  >
                    <div class="action-icon action-icon-logout">
                      <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                      </svg>
                    </div>
                    <div class="action-content">
                      <h4>Sign Out</h4>
                      <p>Log out of your account</p>
                    </div>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Success Message -->
      <div v-if="successMessage" class="success-toast">
        {{ successMessage }}
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, onMounted, computed } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/auth'
import { useModal } from '@/composables/useModal'
import { subscriptionsAPI, classesAPI, profileAPI } from '@/services/api'
import type { UserSubscription, ClassBooking, UserProfile } from '@/types'

const authStore = useAuthStore()
const router = useRouter()
const { confirmCancel, alert } = useModal()

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
  const confirmed = await confirmCancel('Are you sure you want to cancel this booking?')
  if (!confirmed) return

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
    await alert(errorMessage, 'Error')
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
.dashboard-page {
  min-height: 100vh;
  background-color: var(--bg-primary);
  padding: 2rem 0;
}

.container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 1rem;
}

/* Page Header */
.page-header {
  margin-bottom: 3rem;
}

.page-header h1 {
  font-size: clamp(2rem, 6vw, 3rem);
  font-weight: 700;
  color: var(--text-primary);
  margin-bottom: 0.5rem;
}

.page-header p {
  color: var(--text-secondary);
  font-size: 1.125rem;
}

/* Loading and Error States */
.loading-state {
  text-align: center;
  padding: 4rem 0;
  color: var(--text-secondary);
}

.spinner {
  width: 2.5rem;
  height: 2.5rem;
  border: 3px solid var(--border-color);
  border-top: 3px solid var(--accent-gold);
  border-radius: 50%;
  animation: spin 1s linear infinite;
  margin: 0 auto 1rem;
}

@keyframes spin {
  from { transform: rotate(0deg); }
  to { transform: rotate(360deg); }
}

.error-state {
  background-color: rgba(178, 34, 34, 0.1);
  border: 1px solid var(--accent-red);
  color: var(--accent-red);
  padding: 2rem;
  border-radius: 1rem;
  text-align: center;
  margin-bottom: 2rem;
}

/* Dashboard Content */
.dashboard-content {
  display: flex;
  flex-direction: column;
  gap: 3rem;
}

/* Stats Grid */
.stats-grid {
  display: grid;
  grid-template-columns: 1fr;
  gap: 1.5rem;
}

@media (min-width: 640px) {
  .stats-grid {
    grid-template-columns: repeat(2, 1fr);
  }
}

@media (min-width: 1024px) {
  .stats-grid {
    grid-template-columns: repeat(3, 1fr);
  }
}

.stat-card {
  background-color: var(--bg-secondary);
  border: 1px solid var(--border-color);
  border-radius: 1rem;
  padding: 1.5rem;
  display: flex;
  align-items: center;
  gap: 1rem;
  transition: all 0.3s ease;
}

.stat-card:hover {
  transform: translateY(-2px);
  box-shadow: var(--shadow-medium);
}

.stat-icon {
  width: 3rem;
  height: 3rem;
  border-radius: 0.75rem;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}

.stat-icon svg {
  width: 1.5rem;
  height: 1.5rem;
}

.membership-card .stat-icon {
  background-color: var(--accent-gold);
  color: var(--bg-primary);
}

.classes-card .stat-icon {
  background-color: var(--accent-red);
  color: var(--text-primary);
}

.duration-card .stat-icon {
  background-color: var(--bg-tertiary);
  color: var(--text-primary);
}

.stat-content h3 {
  font-size: 0.875rem;
  font-weight: 500;
  color: var(--text-secondary);
  margin: 0 0 0.25rem 0;
}

.stat-value {
  font-size: 1.5rem;
  font-weight: 700;
  color: var(--text-primary);
  margin: 0 0 0.25rem 0;
}

.stat-label {
  font-size: 0.75rem;
  color: var(--text-muted);
  margin: 0;
}

/* Main Grid */
.main-grid {
  display: grid;
  grid-template-columns: 1fr;
  gap: 2rem;
}

@media (min-width: 1024px) {
  .main-grid {
    grid-template-columns: 1fr 1.5fr;
  }
}

.left-column,
.right-column {
  display: flex;
  flex-direction: column;
  gap: 2rem;
}

/* Dashboard Cards */
.dashboard-card {
  background-color: var(--bg-secondary);
  border: 1px solid var(--border-color);
  border-radius: 1rem;
  overflow: hidden;
  transition: all 0.3s ease;
}

.dashboard-card:hover {
  box-shadow: var(--shadow-medium);
}

.card-header {
  padding: 1.5rem;
  border-bottom: 1px solid var(--border-color);
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.card-header h3 {
  font-size: 1.125rem;
  font-weight: 600;
  color: var(--text-primary);
  margin: 0;
}

.header-link {
  color: var(--accent-gold);
  text-decoration: none;
  font-size: 0.875rem;
  font-weight: 500;
  transition: color 0.3s ease;
}

.header-link:hover {
  color: var(--accent-red);
}

.card-content {
  padding: 1.5rem;
}

/* Profile Form */
.profile-form {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
}

.form-row {
  display: grid;
  grid-template-columns: 1fr; /* Stack on mobile */
  gap: 1rem;
}

@media (min-width: 480px) {
  .form-row {
    grid-template-columns: 1fr 1fr; /* Side by side on larger screens */
  }
}

.form-group {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.form-group label {
  font-size: 0.875rem;
  font-weight: 500;
  color: var(--text-primary);
}

.form-input {
  padding: 0.75rem;
  border: 1px solid var(--border-color);
  border-radius: 0.5rem;
  background-color: var(--bg-primary);
  color: var(--text-primary);
  font-size: 1rem;
  transition: all 0.3s ease;
}

.form-input:focus {
  outline: none;
  border-color: var(--accent-gold);
  box-shadow: 0 0 0 3px rgba(218, 165, 32, 0.1);
}

/* Subscription Info */
.subscription-info {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
}

.subscription-details h4 {
  font-size: 1.125rem;
  font-weight: 600;
  color: var(--text-primary);
  margin: 0 0 0.5rem 0;
}

.price {
  font-size: 1.5rem;
  font-weight: 700;
  color: var(--accent-gold);
  margin: 0;
}

.subscription-meta p {
  margin: 0 0 0.5rem 0;
  color: var(--text-secondary);
  font-size: 0.875rem;
}

.subscription-actions {
  padding-top: 1rem;
  border-top: 1px solid var(--border-color);
}

.no-subscription {
  text-align: center;
  padding: 1rem 0;
}

.no-subscription p {
  color: var(--text-secondary);
  margin-bottom: 1rem;
}

/* Bookings List */
.bookings-list {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.booking-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1rem;
  background-color: var(--bg-primary);
  border: 1px solid var(--border-color);
  border-radius: 0.75rem;
  transition: all 0.3s ease;
}

.booking-item:hover {
  border-color: var(--accent-gold);
}

.booking-info h4 {
  font-size: 0.875rem;
  font-weight: 600;
  color: var(--text-primary);
  margin: 0 0 0.25rem 0;
}

.booking-time {
  font-size: 0.75rem;
  color: var(--text-secondary);
  margin: 0 0 0.25rem 0;
}

.booking-instructor {
  font-size: 0.75rem;
  color: var(--accent-gold);
  margin: 0;
}

.booking-actions {
  display: flex;
  align-items: center;
  gap: 0.75rem;
}

.status-badge {
  padding: 0.25rem 0.75rem;
  background-color: var(--accent-gold);
  color: var(--bg-primary);
  border-radius: 1rem;
  font-size: 0.75rem;
  font-weight: 500;
  text-transform: capitalize;
}

/* Empty State */
.empty-state {
  text-align: center;
  padding: 2rem 0;
}

.empty-icon {
  width: 3rem;
  height: 3rem;
  margin: 0 auto 1rem;
  color: var(--text-muted);
}

.empty-icon svg {
  width: 100%;
  height: 100%;
}

.empty-state h4 {
  font-size: 1.125rem;
  font-weight: 600;
  color: var(--text-primary);
  margin: 0 0 0.5rem 0;
}

.empty-state p {
  color: var(--text-secondary);
  margin-bottom: 1.5rem;
}

/* Actions Grid */
.actions-grid {
  display: grid;
  grid-template-columns: 1fr;
  gap: 1rem;
}

@media (min-width: 640px) {
  .actions-grid {
    grid-template-columns: repeat(2, 1fr);
  }
}

.action-item {
  display: flex;
  align-items: center;
  gap: 1rem;
  padding: 1rem;
  background-color: var(--bg-primary);
  border: 1px solid var(--border-color);
  border-radius: 0.75rem;
  text-decoration: none;
  transition: all 0.3s ease;
  cursor: pointer;
}

.action-item:hover {
  transform: translateY(-2px);
  box-shadow: var(--shadow-subtle);
}

.logout-action {
  background: none;
  border: 1px solid var(--border-color);
  width: 100%;
  text-align: left;
}

.action-icon {
  width: 2.5rem;
  height: 2.5rem;
  border-radius: 0.5rem;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}

.action-icon svg {
  width: 1.25rem;
  height: 1.25rem;
}

.action-icon-primary {
  background-color: var(--accent-gold);
  color: var(--bg-primary);
}

.action-icon-secondary {
  background-color: var(--accent-red);
  color: var(--text-primary);
}

.action-icon-tertiary {
  background-color: var(--bg-tertiary);
  color: var(--text-primary);
}

.action-icon-logout {
  background-color: rgba(178, 34, 34, 0.1);
  color: var(--accent-red);
}

.action-content h4 {
  font-size: 0.875rem;
  font-weight: 600;
  color: var(--text-primary);
  margin: 0 0 0.25rem 0;
}

.action-content p {
  font-size: 0.75rem;
  color: var(--text-secondary);
  margin: 0;
}

/* Success Toast */
.success-toast {
  position: fixed;
  bottom: 2rem;
  right: 2rem;
  background-color: var(--accent-gold);
  color: var(--bg-primary);
  padding: 1rem 1.5rem;
  border-radius: 0.75rem;
  box-shadow: var(--shadow-strong);
  font-weight: 500;
  z-index: 1000;
  animation: slideIn 0.3s ease-out;
}

@keyframes slideIn {
  from {
    transform: translateX(100%);
    opacity: 0;
  }
  to {
    transform: translateX(0);
    opacity: 1;
  }
}
</style>
