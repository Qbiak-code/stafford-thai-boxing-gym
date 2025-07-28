<template>
  <div class="timetable-page">
    <div class="container">
      <h1>Class Timetable</h1>

      <!-- Loading State -->
      <div v-if="loading" class="loading-state">
        <div class="spinner"></div>
        <p>Loading class schedule...</p>
      </div>

      <!-- Error State -->
      <div v-if="error" class="error-state">
        <p><strong>Error:</strong> {{ error }}</p>
        <button @click="loadClasses" class="btn btn-ghost btn-sm">
          Try again
        </button>
      </div>

      <!-- Weekly Schedule -->
      <div v-if="!loading && !error" class="timetable-container">
        <div class="timetable-grid">
          <div
            v-for="dayIndex in [1, 2, 3, 4, 5, 6, 7]"
            :key="dayIndex"
            class="day-column"
          >
            <!-- Day Header -->
            <div class="day-header">
              <h3>{{ weekDays[dayIndex] }}</h3>
            </div>

            <!-- Classes for this day -->
            <div class="classes-container">
              <div
                v-for="classItem in getClassesForDay(dayIndex)"
                :key="classItem.id"
                class="class-card"
                @click="showClassDetails(classItem)"
              >
                <div class="class-info">
                  <h4 class="class-name">{{ classItem.name }}</h4>
                  <p class="class-time">
                    {{ formatTime(classItem.start_time) }} - {{ formatTime(classItem.end_time) }}
                  </p>
                  <p class="class-instructor" v-if="classItem.instructor">
                    {{ classItem.instructor }}
                  </p>
                </div>

                <!-- Booking Button for Authenticated Users -->
                <div v-if="authStore.isAuthenticated" class="class-actions">
                  <button
                    @click.stop="openBookingModal(classItem)"
                    class="btn btn-primary btn-sm"
                  >
                    Book
                  </button>
                </div>
              </div>

              <!-- Empty day message -->
              <div v-if="getClassesForDay(dayIndex).length === 0" class="empty-day">
                <p>No classes</p>
              </div>
            </div>
          </div>
        </div>

        <!-- Summary Stats -->
        <div class="stats-grid">
          <div class="stat-card">
            <h3>Total Classes</h3>
            <p class="stat-number">{{ classes.length }}</p>
          </div>
          <div class="stat-card">
            <h3>Difficulty Levels</h3>
            <p class="stat-number">{{ uniqueDifficultyLevels.length }}</p>
          </div>
          <div class="stat-card">
            <h3>Instructors</h3>
            <p class="stat-number">{{ uniqueInstructors.length }}</p>
          </div>
        </div>

        <!-- Call to Action -->
        <div class="cta-section">
          <h3>Ready to Join a Class?</h3>
          <p>
            Book your first session and start your Muay Thai journey today
          </p>
          <div class="cta-buttons">
            <router-link to="/contact" class="btn btn-primary btn-lg">
              Book Trial Class
            </router-link>
            <router-link
              v-if="!authStore.isAuthenticated"
              to="/member"
              class="btn btn-ghost btn-lg"
            >
              Join as Member
            </router-link>
            <router-link
              v-else
              to="/member/dashboard"
              class="btn btn-ghost btn-lg"
            >
              Member Dashboard
            </router-link>
          </div>
        </div>
      </div>

      <!-- Booking Modal -->
      <div v-if="showBookingModal" class="booking-modal">
        <div class="modal-content">
          <div class="modal-header">
            <h3>Book a Class</h3>
            <button @click="closeBookingModal" class="close-button">
              <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>
              </svg>
            </button>
          </div>

          <div class="modal-body">
            <div class="date-selection">
              <label>Select Date:</label>
              <input
                v-model="selectedBookingDate"
                type="date"
                :min="today"
                class="date-input"
                @change="onDateChange"
              />
            </div>

            <div v-if="selectedBookingDate" class="available-classes">
              <label>Available Classes on {{ formatSelectedDate(selectedBookingDate) }}:</label>
              <div v-if="availableClassesForDate.length > 0" class="class-options">
                <div
                  v-for="classOption in availableClassesForDate"
                  :key="classOption.id"
                  class="class-option"
                  :class="{ 'selected': selectedClassForBooking?.id === classOption.id }"
                  @click="selectClass(classOption)"
                >
                  <div class="class-option-info">
                    <h4>{{ classOption.name }}</h4>
                    <p>{{ formatTime(classOption.start_time) }} - {{ formatTime(classOption.end_time) }}</p>
                    <p class="instructor" v-if="classOption.instructor">{{ classOption.instructor }}</p>
                  </div>
                  <div class="class-option-select">
                    <div class="radio-button" :class="{ 'selected': selectedClassForBooking?.id === classOption.id }"></div>
                  </div>
                </div>
              </div>
              <div v-else class="no-classes">
                <p>No classes available on this date.</p>
              </div>
            </div>

            <div class="modal-actions">
              <button
                @click="confirmBooking"
                :disabled="bookingLoading || !selectedBookingDate || !selectedClassForBooking"
                class="btn btn-primary"
              >
                {{ bookingLoading ? 'Booking...' : 'Confirm Booking' }}
              </button>
              <button
                @click="closeBookingModal"
                class="btn btn-ghost"
              >
                Cancel
              </button>
            </div>

            <div v-if="bookingError" class="error-message">
              {{ bookingError }}
            </div>
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

const availableClassesForDate = computed(() => {
  if (!selectedBookingDate.value) return []

  const selectedDate = new Date(selectedBookingDate.value)
  const dayOfWeek = selectedDate.getDay() === 0 ? 7 : selectedDate.getDay() // Convert Sunday from 0 to 7

  return classes.value.filter(classItem => classItem.day_of_week === dayOfWeek)
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

const onDateChange = () => {
  // When date changes, check if current selected class is still available
  if (selectedClassForBooking.value && availableClassesForDate.value.length > 0) {
    const classStillAvailable = availableClassesForDate.value.find(
      c => c.id === selectedClassForBooking.value?.id
    )

    if (!classStillAvailable) {
      // If current class isn't available on this day, select the first available class
      selectedClassForBooking.value = availableClassesForDate.value[0]
    }
  } else if (availableClassesForDate.value.length > 0) {
    // If no class was selected, select the first available
    selectedClassForBooking.value = availableClassesForDate.value[0]
  } else {
    // No classes available on this date
    selectedClassForBooking.value = null
  }
}

const selectClass = (classItem: ClassSession) => {
  selectedClassForBooking.value = classItem
}

const formatSelectedDate = (dateString: string): string => {
  const date = new Date(dateString)
  return date.toLocaleDateString('en-GB', {
    weekday: 'long',
    day: 'numeric',
    month: 'long'
  })
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

const showClassDetails = (classItem: ClassSession) => {
  selectedClass.value = classItem
}

// Initialize
onMounted(() => {
  loadClasses()
})
</script>

<style scoped>
/* Page Layout */
.timetable-page {
  min-height: 100vh;
  background-color: var(--bg-primary);
  padding: 2rem 0;
}

.container {
  max-width: 1400px;
  margin: 0 auto;
  padding: 0 1rem;
}

/* Page Header */
h1 {
  font-size: clamp(2rem, 6vw, 3rem);
  font-weight: 700;
  text-align: center;
  color: var(--text-primary);
  margin-bottom: 3rem;
}

/* Loading and Error States */
.loading-state {
  text-align: center;
  padding: 3rem 0;
  color: var(--text-secondary);
}

.spinner {
  width: 2rem;
  height: 2rem;
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

/* Timetable Layout */
.timetable-container {
  display: flex;
  flex-direction: column;
  gap: 4rem;
}

.timetable-grid {
  display: grid;
  grid-template-columns: 1fr;
  gap: 1.5rem;
}

@media (min-width: 640px) {
  .timetable-grid {
    grid-template-columns: repeat(2, 1fr);
  }
}

@media (min-width: 768px) {
  .timetable-grid {
    grid-template-columns: repeat(3, 1fr);
  }
}

@media (min-width: 1024px) {
  .timetable-grid {
    grid-template-columns: repeat(4, 1fr);
  }
}

@media (min-width: 1280px) {
  .timetable-grid {
    grid-template-columns: repeat(7, 1fr);
  }
}

/* Day Column */
.day-column {
  background-color: var(--bg-secondary);
  border: 1px solid var(--border-color);
  border-radius: 1rem;
  overflow: hidden;
  transition: all 0.3s ease;
  min-height: 300px;
}

.day-column:hover {
  box-shadow: var(--shadow-medium);
}

.day-header {
  background-color: var(--bg-tertiary);
  padding: 1rem;
  text-align: center;
  border-bottom: 1px solid var(--border-color);
}

.day-header h3 {
  font-size: 1rem;
  font-weight: 600;
  color: var(--text-primary);
  margin: 0;
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

/* Classes Container */
.classes-container {
  padding: 1rem;
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
  min-height: 200px;
}

/* Class Card */
.class-card {
  background-color: var(--bg-primary);
  border: 1px solid var(--border-color);
  border-radius: 0.75rem;
  padding: 0.75rem;
  cursor: pointer;
  transition: all 0.3s ease;
  border-left: 3px solid var(--accent-gold);
}

.class-card:hover {
  transform: translateY(-2px);
  box-shadow: var(--shadow-subtle);
  border-left-color: var(--accent-red);
}

.class-info {
  margin-bottom: 0.75rem;
}

.class-name {
  font-size: 0.875rem;
  font-weight: 600;
  color: var(--text-primary);
  margin: 0 0 0.25rem 0;
  line-height: 1.2;
}

.class-time {
  font-size: 0.75rem;
  color: var(--text-secondary);
  margin: 0 0 0.25rem 0;
  line-height: 1.3;
}

.class-instructor {
  font-size: 0.75rem;
  color: var(--accent-gold);
  margin: 0;
  line-height: 1.3;
}

.class-actions {
  display: flex;
  justify-content: flex-end;
}

.class-actions .btn {
  padding: 0.375rem 0.75rem;
  font-size: 0.75rem;
}

/* Empty Day */
.empty-day {
  display: flex;
  align-items: center;
  justify-content: center;
  height: 100%;
  color: var(--text-muted);
  font-size: 0.875rem;
  text-align: center;
  padding: 2rem;
}

/* Stats Grid */
.stats-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 2rem;
}

.stat-card {
  background-color: var(--bg-secondary);
  border: 1px solid var(--border-color);
  border-radius: 1rem;
  padding: 2rem;
  text-align: center;
  transition: all 0.3s ease;
}

.stat-card:hover {
  transform: translateY(-2px);
  box-shadow: var(--shadow-medium);
}

.stat-card h3 {
  font-size: 1rem;
  font-weight: 600;
  color: var(--text-secondary);
  margin: 0 0 0.5rem 0;
}

.stat-number {
  font-size: 2rem;
  font-weight: 700;
  color: var(--accent-gold);
  margin: 0;
}

/* Call to Action */
.cta-section {
  text-align: center;
  background-color: var(--bg-secondary);
  padding: 3rem 2rem;
  border-radius: 1rem;
  border: 1px solid var(--border-color);
}

.cta-section h3 {
  font-size: 1.5rem;
  font-weight: 700;
  color: var(--text-primary);
  margin: 0 0 1rem 0;
}

.cta-section p {
  font-size: 1rem;
  color: var(--text-secondary);
  margin: 0 0 2rem 0;
  max-width: 32rem;
  margin-left: auto;
  margin-right: auto;
}

.cta-buttons {
  display: flex;
  flex-direction: column;
  gap: 1rem;
  align-items: center;
}

@media (min-width: 640px) {
  .cta-buttons {
    flex-direction: row;
    justify-content: center;
  }
}

/* Booking Modal */
.booking-modal {
  position: fixed;
  inset: 0;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 50;
  padding: 1rem;
}

.modal-content {
  background-color: var(--bg-secondary);
  border: 1px solid var(--border-color);
  border-radius: 1rem;
  max-width: 28rem;
  width: 100%;
  box-shadow: var(--shadow-strong);
}

.modal-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1.5rem;
  border-bottom: 1px solid var(--border-color);
}

.modal-header h3 {
  font-size: 1.25rem;
  font-weight: 600;
  color: var(--text-primary);
  margin: 0;
}

.close-button {
  background: none;
  border: none;
  color: var(--text-secondary);
  cursor: pointer;
  padding: 0.25rem;
  border-radius: 0.25rem;
  transition: all 0.2s ease;
}

.close-button:hover {
  color: var(--text-primary);
  background-color: var(--hover-bg);
}

.modal-body {
  padding: 1.5rem;
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
}

.date-selection label,
.available-classes label {
  display: block;
  font-weight: 500;
  color: var(--text-primary);
  margin-bottom: 0.5rem;
}

.date-input {
  width: 100%;
  padding: 0.75rem;
  border: 1px solid var(--border-color);
  border-radius: 0.5rem;
  background-color: var(--bg-primary);
  color: var(--text-primary);
  font-size: 1rem;
}

.class-options {
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
  margin-top: 0.5rem;
}

.class-option {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 1rem;
  border: 1px solid var(--border-color);
  border-radius: 0.75rem;
  background-color: var(--bg-primary);
  cursor: pointer;
  transition: all 0.3s ease;
}

.class-option:hover {
  border-color: var(--accent-gold);
  box-shadow: var(--shadow-subtle);
}

.class-option.selected {
  border-color: var(--accent-gold);
  background-color: var(--bg-tertiary);
}

.class-option-info h4 {
  font-size: 0.875rem;
  font-weight: 600;
  color: var(--text-primary);
  margin: 0 0 0.25rem 0;
}

.class-option-info p {
  font-size: 0.75rem;
  color: var(--text-secondary);
  margin: 0 0 0.25rem 0;
}

.class-option-info .instructor {
  color: var(--accent-gold);
  margin: 0;
}

.radio-button {
  width: 1.25rem;
  height: 1.25rem;
  border: 2px solid var(--border-color);
  border-radius: 50%;
  transition: all 0.3s ease;
  position: relative;
}

.radio-button.selected {
  border-color: var(--accent-gold);
}

.radio-button.selected::after {
  content: '';
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  width: 0.5rem;
  height: 0.5rem;
  background-color: var(--accent-gold);
  border-radius: 50%;
}

.no-classes {
  text-align: center;
  padding: 2rem;
  color: var(--text-muted);
  font-style: italic;
}

.modal-actions {
  display: flex;
  gap: 0.75rem;
}

.modal-actions .btn {
  flex: 1;
  justify-content: center;
}

.error-message {
  background-color: rgba(178, 34, 34, 0.1);
  border: 1px solid var(--accent-red);
  color: var(--accent-red);
  padding: 1rem;
  border-radius: 0.5rem;
  font-size: 0.875rem;
}
</style>
