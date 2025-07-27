<template>
  <div class="container mx-auto px-4 py-16">
    <h1 class="text-4xl font-bold text-center mb-12">Class Timetable</h1>

    <!-- Loading State -->
    <div v-if="loading" class="text-center py-12">
      <div class="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      <p class="mt-4 text-gray-600 dark:text-gray-300">Loading class schedule...</p>
    </div>

    <!-- Error State -->
    <div v-if="error" class="bg-red-100 dark:bg-red-900/20 border border-red-400 text-red-700 dark:text-red-300 px-4 py-3 rounded mb-8">
      <p><strong>Error:</strong> {{ error }}</p>
      <button @click="loadClasses" class="mt-2 text-sm underline hover:no-underline">
        Try again
      </button>
    </div>

    <!-- Weekly Schedule -->
    <div v-if="!loading && !error" class="max-w-6xl mx-auto">
      <div class="grid grid-cols-1 lg:grid-cols-7 gap-4 mb-8">
        <div
          v-for="dayIndex in [1, 2, 3, 4, 5, 6, 7]"
          :key="dayIndex"
          class="bg-white dark:bg-gray-800 rounded-lg shadow-lg overflow-hidden"
        >
          <!-- Day Header -->
          <div class="bg-blue-600 text-white p-4 text-center">
            <h3 class="font-bold text-lg">{{ weekDays[dayIndex] }}</h3>
          </div>

          <!-- Classes for this day -->
          <div class="p-4 space-y-3 min-h-[200px]">
            <div
              v-for="classItem in getClassesForDay(dayIndex)"
              :key="classItem.id"
              class="bg-gray-50 dark:bg-gray-700 rounded-lg p-3 border-l-4 border-blue-500 hover:shadow-md transition-shadow cursor-pointer"
              @click="showClassDetails(classItem)"
            >
              <h4 class="font-semibold text-sm mb-1">{{ classItem.name }}</h4>
              <p class="text-xs text-gray-600 dark:text-gray-300 mb-1">
                {{ formatTime(classItem.start_time) }} - {{ formatTime(classItem.end_time) }}
              </p>
              <p class="text-xs text-blue-600 dark:text-blue-400" v-if="classItem.instructor">
                {{ classItem.instructor }}
              </p>
              <div class="flex items-center justify-between mt-2">
                <span class="text-xs px-2 py-1 bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 rounded">
                  {{ classItem.difficulty_level }}
                </span>
                <span class="text-xs text-gray-500" v-if="classItem.max_capacity">
                  Max: {{ classItem.max_capacity }}
                </span>
              </div>

              <!-- Booking Button for Authenticated Users -->
              <div v-if="authStore.isAuthenticated" class="mt-3">
                <button
                  @click.stop="openBookingModal(classItem)"
                  class="w-full bg-green-600 text-white py-1 px-2 rounded text-sm hover:bg-green-700 transition-colors"
                >
                  Book Class
                </button>
              </div>
            </div>

            <!-- Empty day message -->
            <div v-if="getClassesForDay(dayIndex).length === 0" class="text-center text-gray-500 dark:text-gray-400 py-8">
              <p class="text-sm">No classes scheduled</p>
            </div>
          </div>
        </div>
      </div>

      <!-- Summary Stats -->
      <div class="grid grid-cols-1 md:grid-cols-3 gap-6 mt-12">
        <div class="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6 text-center">
          <h3 class="text-lg font-semibold mb-2">Total Classes</h3>
          <p class="text-3xl font-bold text-blue-600">{{ classes.length }}</p>
        </div>
        <div class="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6 text-center">
          <h3 class="text-lg font-semibold mb-2">Difficulty Levels</h3>
          <p class="text-3xl font-bold text-green-600">{{ uniqueDifficultyLevels.length }}</p>
        </div>
        <div class="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6 text-center">
          <h3 class="text-lg font-semibold mb-2">Instructors</h3>
          <p class="text-3xl font-bold text-purple-600">{{ uniqueInstructors.length }}</p>
        </div>
      </div>

      <!-- Call to Action -->
      <div class="text-center mt-12">
        <h3 class="text-2xl font-bold mb-4">Ready to Join a Class?</h3>
        <p class="text-lg mb-8 text-gray-600 dark:text-gray-300">
          Book your first session and start your Muay Thai journey today
        </p>
        <div class="space-x-4">
          <router-link
            to="/contact"
            class="inline-block px-8 py-3 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 transition-colors duration-200"
          >
            Book Trial Class
          </router-link>
          <router-link
            v-if="!authStore.isAuthenticated"
            to="/member"
            class="inline-block px-8 py-3 bg-green-600 text-white font-semibold rounded-lg hover:bg-green-700 transition-colors duration-200"
          >
            Join as Member
          </router-link>
          <router-link
            v-else
            to="/member/dashboard"
            class="inline-block px-8 py-3 bg-green-600 text-white font-semibold rounded-lg hover:bg-green-700 transition-colors duration-200"
          >
            Member Dashboard
          </router-link>
        </div>
      </div>
    </div>

    <!-- Booking Modal -->
    <div v-if="showBookingModal && selectedClassForBooking" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div class="bg-white dark:bg-gray-800 rounded-lg max-w-md w-full p-6">
        <div class="flex justify-between items-start mb-4">
          <h3 class="text-xl font-bold">Book {{ selectedClassForBooking.name }}</h3>
          <button @click="closeBookingModal" class="text-gray-400 hover:text-gray-600">
            <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>
            </svg>
          </button>
        </div>

        <div class="space-y-4">
          <div>
            <p><strong>Instructor:</strong> {{ selectedClassForBooking.instructor }}</p>
            <p><strong>Time:</strong> {{ formatTime(selectedClassForBooking.start_time) }} - {{ formatTime(selectedClassForBooking.end_time) }}</p>
            <p><strong>Day:</strong> {{ weekDays[selectedClassForBooking.day_of_week || 1] }}</p>
          </div>

          <div>
            <label class="block text-sm font-medium mb-2">Select Date:</label>
            <input
              v-model="selectedBookingDate"
              type="date"
              :min="today"
              class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white rounded-md"
            />
          </div>

          <div class="flex space-x-3 mt-6">
            <button
              @click="confirmBooking"
              :disabled="bookingLoading || !selectedBookingDate"
              class="flex-1 bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {{ bookingLoading ? 'Booking...' : 'Confirm Booking' }}
            </button>
            <button
              @click="closeBookingModal"
              class="flex-1 bg-gray-300 dark:bg-gray-600 text-gray-700 dark:text-gray-200 py-2 px-4 rounded-lg hover:bg-gray-400 dark:hover:bg-gray-500"
            >
              Cancel
            </button>
          </div>

          <div v-if="bookingError" class="text-red-600 text-sm">
            {{ bookingError }}
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { classesAPI } from '@/services/api'
import { useAuthStore } from '@/stores/auth'
import type { ClassSession } from '@/types'

const authStore = useAuthStore()

// State
const classes = ref<ClassSession[]>([])
const loading = ref(false)
const error = ref<string | null>(null)
const selectedClass = ref<ClassSession | null>(null)

// Booking state
const showBookingModal = ref(false)
const selectedClassForBooking = ref<ClassSession | null>(null)
const selectedBookingDate = ref('')
const bookingLoading = ref(false)
const bookingError = ref<string | null>(null)

// Week days (1 = Monday, 2 = Tuesday, ..., 7 = Sunday)
const weekDays = ['', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday']

// Today's date for min date restriction
const today = new Date().toISOString().split('T')[0]

// Computed properties
const uniqueDifficultyLevels = computed(() => {
  const levels = classes.value.map(c => c.difficulty_level).filter(Boolean)
  return [...new Set(levels)]
})

const uniqueInstructors = computed(() => {
  const instructors = classes.value.map(c => c.instructor).filter(Boolean)
  return [...new Set(instructors)]
})

// Methods
const loadClasses = async () => {
  loading.value = true
  error.value = null

  try {
    const response = await classesAPI.getSchedule()

    if (response.success && response.data) {
      classes.value = response.data
    } else {
      throw new Error(response.error || 'Failed to load classes')
    }
  } catch (err: unknown) {
    const errorMessage = err instanceof Error ? err.message : 'Failed to load class schedule'
    error.value = errorMessage
    console.error('Error loading classes:', err)
  } finally {
    loading.value = false
  }
}

const getClassesForDay = (dayIndex: number): ClassSession[] => {
  return classes.value
    .filter(classItem => classItem.day_of_week === dayIndex)
    .sort((a, b) => a.start_time.localeCompare(b.start_time))
}

const formatTime = (timeString: string): string => {
  try {
    // Handle time format (e.g., "18:00:00" or "18:00")
    const [hours, minutes] = timeString.split(':')
    const hour = parseInt(hours, 10)
    const minute = parseInt(minutes, 10)

    // Convert to 12-hour format
    const period = hour >= 12 ? 'PM' : 'AM'
    const displayHour = hour === 0 ? 12 : hour > 12 ? hour - 12 : hour

    return `${displayHour}:${minute.toString().padStart(2, '0')} ${period}`
  } catch (error) {
    return timeString // Fallback to original string if parsing fails
  }
}

const openBookingModal = (classItem: ClassSession) => {
  selectedClassForBooking.value = classItem
  showBookingModal.value = true
  bookingError.value = null

  // Set default date to next occurrence of this class
  const today = new Date()
  const targetDay = classItem.day_of_week || 1
  const daysUntilClass = (targetDay - (today.getDay() || 7) + 7) % 7
  const nextClassDate = new Date(today)
  nextClassDate.setDate(today.getDate() + (daysUntilClass === 0 ? 7 : daysUntilClass))
  selectedBookingDate.value = nextClassDate.toISOString().split('T')[0]
}

const closeBookingModal = () => {
  showBookingModal.value = false
  selectedClassForBooking.value = null
  selectedBookingDate.value = ''
  bookingError.value = null
}

const confirmBooking = async () => {
  if (!selectedClassForBooking.value || !selectedBookingDate.value) return

  bookingLoading.value = true
  bookingError.value = null

  try {
    const response = await classesAPI.bookClass(
      selectedClassForBooking.value.id,
      selectedBookingDate.value
    )

    if (response.success) {
      closeBookingModal()
      // Show success message or redirect to dashboard
      alert('Class booked successfully!')
    } else {
      throw new Error(response.error || 'Failed to book class')
    }
  } catch (err: unknown) {
    const errorMessage = err instanceof Error ? err.message : 'Failed to book class'
    bookingError.value = errorMessage
  } finally {
    bookingLoading.value = false
  }
}

// Initialize
onMounted(() => {
  loadClasses()
})
</script>

<style scoped>
/* Add any custom styles here */
.container {
  transition: all 0.3s ease;
}

@media (max-width: 1024px) {
  .grid-cols-1.lg\:grid-cols-7 {
    grid-template-columns: repeat(1, minmax(0, 1fr));
  }
}

@media (min-width: 640px) and (max-width: 1024px) {
  .grid-cols-1.lg\:grid-cols-7 {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }
}
</style>
