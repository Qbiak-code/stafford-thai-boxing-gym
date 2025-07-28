<template>
  <div class="contact-page">
    <div class="container">
      <!-- Page Header -->
      <div class="page-header">
        <h1>Contact Us</h1>
        <p>Get in touch with us for any questions or to book your trial class</p>
      </div>

      <!-- Main Content -->
      <div class="contact-content">
        <!-- Contact Form -->
        <div class="contact-form-section">
          <div class="form-card">
            <div class="card-header">
              <h2>Send us a message</h2>
            </div>
            <div class="card-content">
              <form @submit.prevent="handleSubmit" class="contact-form">
                <div class="form-row">
                  <div class="form-group">
                    <label for="name">Name</label>
                    <input
                      type="text"
                      id="name"
                      v-model="formData.name"
                      required
                      :disabled="submitting"
                      class="form-input"
                    />
                  </div>
                  <div class="form-group">
                    <label for="email">Email</label>
                    <input
                      type="email"
                      id="email"
                      v-model="formData.email"
                      required
                      :disabled="submitting"
                      class="form-input"
                    />
                  </div>
                </div>

                <div class="form-group">
                  <label for="subject">Subject (Optional)</label>
                  <input
                    type="text"
                    id="subject"
                    v-model="formData.subject"
                    :disabled="submitting"
                    class="form-input"
                  />
                </div>

                <div class="form-group">
                  <label for="message">Message</label>
                  <textarea
                    id="message"
                    v-model="formData.message"
                    rows="6"
                    required
                    :disabled="submitting"
                    class="form-textarea"
                  ></textarea>
                </div>

                <button
                  type="submit"
                  :disabled="submitting"
                  class="btn btn-primary btn-lg submit-btn"
                >
                  {{ submitting ? "Sending..." : "Send Message" }}
                </button>
              </form>

              <!-- Status Message -->
              <div
                v-if="statusMessage"
                :class="['status-message', { success: isSuccess, error: !isSuccess }]"
              >
                {{ statusMessage }}
              </div>
            </div>
          </div>
        </div>

        <!-- Contact Info -->
        <div class="contact-info-section">
          <div class="info-card">
            <div class="card-header">
              <h2>Get in Touch</h2>
            </div>
            <div class="card-content">
              <div class="contact-details">
                <!-- Address -->
                <div class="contact-item">
                  <div class="contact-icon">
                    <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path
                        stroke-linecap="round"
                        stroke-linejoin="round"
                        stroke-width="2"
                        d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                      ></path>
                      <path
                        stroke-linecap="round"
                        stroke-linejoin="round"
                        stroke-width="2"
                        d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
                      ></path>
                    </svg>
                  </div>
                  <div class="contact-info">
                    <h4>Address</h4>
                    <p>19b Raleigh Hall Industrial Estate</p>
                    <p>Eccleshall</p>
                    <p>ST21 6JL</p>
                  </div>
                </div>

                <!-- Phone -->
                <div class="contact-item">
                  <div class="contact-icon">
                    <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path
                        stroke-linecap="round"
                        stroke-linejoin="round"
                        stroke-width="2"
                        d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"
                      ></path>
                    </svg>
                  </div>
                  <div class="contact-info">
                    <h4>Phone</h4>
                    <p>07813 449416</p>
                  </div>
                </div>

                <!-- Email -->
                <div class="contact-item">
                  <div class="contact-icon">
                    <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path
                        stroke-linecap="round"
                        stroke-linejoin="round"
                        stroke-width="2"
                        d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                      ></path>
                    </svg>
                  </div>
                  <div class="contact-info">
                    <h4>Email</h4>
                    <p>info@staffordthaiboxing.com</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <!-- Opening Hours -->
          <div class="hours-card">
            <div class="card-header">
              <h3>Training Hours</h3>
            </div>
            <div class="card-content">
              <div class="hours-list">
                <div class="hours-item">
                  <span class="day">Monday</span>
                  <span class="time">6:00 PM - 8:00 PM</span>
                </div>
                <div class="hours-item">
                  <span class="day">Tuesday</span>
                  <span class="time">Private Sessions</span>
                </div>
                <div class="hours-item">
                  <span class="day">Wednesday</span>
                  <span class="time">6:00 PM - 8:00 PM</span>
                </div>
                <div class="hours-item">
                  <span class="day">Thursday</span>
                  <span class="time">Private Sessions</span>
                </div>
                <div class="hours-item">
                  <span class="day">Friday</span>
                  <span class="time">6:00 PM - 8:00 PM</span>
                </div>
                <div class="hours-item">
                  <span class="day">Saturday</span>
                  <span class="time">Closed</span>
                </div>
                <div class="hours-item">
                  <span class="day">Sunday</span>
                  <span class="time">10:00 AM - 12:00 PM</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Map Section -->
      <div class="map-section">
        <div class="map-header">
          <h2>Find Us</h2>
          <p>Located in the heart of Staffordshire</p>
        </div>
        <div class="map-container">
          <iframe
            src="https://www.google.com/maps/embed?pb=!1m14!1m8!1m3!1d308237.842178429!2d-2.2454212!3d52.8744671!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x487a65ad2723eee7%3A0xaf502b401f3e47b2!2sStafford%20Thaiboxing%20Gym!5e0!3m2!1sen!2suk!4v1753648312764!5m2!1sen!2suk"
            width="100%"
            height="450"
            style="border: 0"
            allowfullscreen=""
            loading="lazy"
            referrerpolicy="no-referrer-when-downgrade"
            class="map-iframe"
          ></iframe>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive } from "vue"
import { supabase } from "@/lib/supabase"

// Form data
const formData = reactive({
  name: "",
  email: "",
  subject: "",
  message: "",
})

const submitting = ref(false)
const statusMessage = ref<string | null>(null)
const isSuccess = ref(false)

const handleSubmit = async () => {
  submitting.value = true
  statusMessage.value = null
  isSuccess.value = false

  try {
    const { error } = await supabase.from("contact_submissions").insert({
      name: formData.name,
      email: formData.email,
      subject: formData.subject,
      message: formData.message,
      status: "new",
      marketing_consent: false,
      gdpr_consent: true,
    })

    if (error) throw error

    statusMessage.value = "Message sent successfully! We'll get back to you soon."
    isSuccess.value = true

    // Clear form
    Object.assign(formData, { name: "", email: "", subject: "", message: "" })
  } catch (err: any) {
    statusMessage.value = err.message || "Failed to send message. Please try again."
    isSuccess.value = false
  } finally {
    submitting.value = false
  }
}
</script>

<style scoped>
.contact-page {
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
  text-align: center;
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

/* Contact Content */
.contact-content {
  display: grid;
  grid-template-columns: 1fr;
  gap: 3rem;
  margin-bottom: 4rem;
}

@media (min-width: 1024px) {
  .contact-content {
    grid-template-columns: 1.2fr 1fr;
  }
}

/* Cards */
.form-card,
.info-card,
.hours-card {
  background-color: var(--bg-secondary);
  border: 1px solid var(--border-color);
  border-radius: 1rem;
  overflow: hidden;
  transition: all 0.3s ease;
}

.form-card:hover,
.info-card:hover,
.hours-card:hover {
  box-shadow: var(--shadow-medium);
}

.card-header {
  padding: 1.5rem;
  border-bottom: 1px solid var(--border-color);
  background-color: var(--bg-tertiary);
}

.card-header h2,
.card-header h3 {
  font-size: 1.25rem;
  font-weight: 600;
  color: var(--text-primary);
  margin: 0;
}

.card-content {
  padding: 1.5rem;
}

/* Contact Form */
.contact-form {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
}

.form-row {
  display: grid;
  grid-template-columns: 1fr;
  gap: 1rem;
}

@media (min-width: 640px) {
  .form-row {
    grid-template-columns: 1fr 1fr;
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

.form-input,
.form-textarea {
  padding: 0.75rem;
  border: 1px solid var(--border-color);
  border-radius: 0.5rem;
  background-color: var(--bg-primary);
  color: var(--text-primary);
  font-size: 1rem;
  transition: all 0.3s ease;
}

.form-input:focus,
.form-textarea:focus {
  outline: none;
  border-color: var(--accent-gold);
  box-shadow: 0 0 0 3px rgba(218, 165, 32, 0.1);
}

.form-input:disabled,
.form-textarea:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

.form-textarea {
  resize: vertical;
  min-height: 120px;
}

.submit-btn {
  width: 100%;
  justify-content: center;
  margin-top: 0.5rem;
}

/* Status Message */
.status-message {
  margin-top: 1.5rem;
  padding: 1rem;
  border-radius: 0.5rem;
  font-weight: 500;
  text-align: center;
}

.status-message.success {
  background-color: rgba(34, 197, 94, 0.1);
  border: 1px solid #22c55e;
  color: #22c55e;
}

.status-message.error {
  background-color: rgba(178, 34, 34, 0.1);
  border: 1px solid var(--accent-red);
  color: var(--accent-red);
}

/* Contact Details */
.contact-details {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
}

.contact-item {
  display: flex;
  align-items: flex-start;
  gap: 1rem;
}

.contact-icon {
  width: 2.5rem;
  height: 2.5rem;
  background-color: var(--accent-gold);
  border-radius: 0.75rem;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}

.contact-icon svg {
  width: 1.25rem;
  height: 1.25rem;
  color: var(--bg-primary);
}

.contact-info h4 {
  font-size: 1rem;
  font-weight: 600;
  color: var(--text-primary);
  margin: 0 0 0.5rem 0;
}

.contact-info p {
  color: var(--text-secondary);
  margin: 0 0 0.25rem 0;
  line-height: 1.4;
}

/* Hours Card */
.hours-card {
  margin-top: 2rem;
}

.hours-list {
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
}

.hours-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0.5rem 0;
  border-bottom: 1px solid var(--border-color);
}

.hours-item:last-child {
  border-bottom: none;
}

.day {
  font-weight: 500;
  color: var(--text-primary);
}

.time {
  color: var(--text-secondary);
  font-size: 0.875rem;
}

/* Map Section */
.map-section {
  background-color: var(--bg-secondary);
  border: 1px solid var(--border-color);
  border-radius: 1rem;
  overflow: hidden;
  transition: all 0.3s ease;
}

.map-section:hover {
  box-shadow: var(--shadow-medium);
}

.map-header {
  padding: 2rem;
  text-align: center;
  background-color: var(--bg-tertiary);
  border-bottom: 1px solid var(--border-color);
}

.map-header h2 {
  font-size: 1.5rem;
  font-weight: 700;
  color: var(--text-primary);
  margin-bottom: 0.5rem;
}

.map-header p {
  color: var(--text-secondary);
  font-size: 1rem;
}

.map-container {
  position: relative;
  overflow: hidden;
}

.map-iframe {
  width: 100%;
  height: 450px;
  border: none;
  transition: all 0.3s ease;
}

.map-iframe:hover {
  filter: brightness(1.05);
}

/* Responsive Adjustments */
@media (max-width: 640px) {
  .contact-item {
    flex-direction: column;
    text-align: center;
  }

  .hours-item {
    flex-direction: column;
    gap: 0.25rem;
    text-align: center;
  }
}
</style>
