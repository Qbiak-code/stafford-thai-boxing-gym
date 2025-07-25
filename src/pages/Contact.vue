<template>
  <div class="min-h-screen transition-colors duration-200">
    <!-- Hero Section -->
    <div class="py-20">
      <div class="container mx-auto px-4 text-center">
        <h1 class="text-4xl md:text-5xl font-bold">Contact Us</h1>
      </div>
    </div>

    <!-- Contact Form Section -->
    <section class="py-16">
      <div class="container mx-auto px-4 max-w-4xl">
        <div class="grid grid-cols-1 lg:grid-cols-2 gap-12">
          <!-- Contact Form -->
          <div class="rounded-lg shadow-lg p-8">
            <h2 class="text-2xl font-bold mb-6">Send us a message</h2>
            <form @submit.prevent="handleSubmit" class="space-y-6">
              <div>
                <label for="name" class="block text-sm font-medium mb-2">Name</label>
                <input
                  type="text"
                  id="name"
                  v-model="formData.name"
                  required
                  class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
                />
              </div>
              <div>
                <label for="email" class="block text-sm font-medium mb-2">Email</label>
                <input
                  type="email"
                  id="email"
                  v-model="formData.email"
                  required
                  class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
                />
              </div>
              <div>
                <label for="subject" class="block text-sm font-medium mb-2"
                  >Subject (Optional)</label
                >
                <input
                  type="text"
                  id="subject"
                  v-model="formData.subject"
                  class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
                />
              </div>
              <div>
                <label for="message" class="block text-sm font-medium mb-2">Message</label>
                <textarea
                  id="message"
                  v-model="formData.message"
                  rows="6"
                  required
                  class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors resize-none"
                ></textarea>
              </div>

              <button
                type="submit"
                :disabled="submitting"
                class="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white font-semibold py-3 px-6 rounded-lg transition-colors duration-200"
              >
                {{ submitting ? "Sending..." : "Send Message" }}
              </button>

              <p
                v-if="statusMessage"
                :class="{ 'text-green-600': isSuccess, 'text-red-600': !isSuccess }"
                class="text-center font-medium"
              >
                {{ statusMessage }}
              </p>
            </form>
          </div>

          <!-- Contact Details -->
          <div class="space-y-8">
            <div class="rounded-lg shadow-lg p-8">
              <h2 class="text-2xl font-bold mb-6">Get in Touch</h2>
              <div class="space-y-4">
                <div class="flex items-start space-x-3">
                  <svg
                    class="w-6 h-6 text-blue-600 dark:text-blue-400 mt-1"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
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
                  <div>
                    <p class="font-semibold">Address</p>
                    <p class="">[Your Gym Address Here]</p>
                  </div>
                </div>
                <div class="flex items-start space-x-3">
                  <svg
                    class="w-6 h-6 text-blue-600 dark:text-blue-400 mt-1"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      stroke-width="2"
                      d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"
                    ></path>
                  </svg>
                  <div>
                    <p class="font-semibold">Phone</p>
                    <p class="">[Your Phone Number Here]</p>
                  </div>
                </div>
                <div class="flex items-start space-x-3">
                  <svg
                    class="w-6 h-6 text-blue-600 dark:text-blue-400 mt-1"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      stroke-width="2"
                      d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                    ></path>
                  </svg>
                  <div>
                    <p class="font-semibold">Email</p>
                    <p class="">[Your Contact Email Here]</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- Map Section -->
    <section class="py-16">
      <div class="container mx-auto px-4">
        <h2 class="text-3xl font-bold text-center mb-12">Find Us</h2>
        <div class="max-w-4xl mx-auto">
          <div class="rounded-lg overflow-hidden shadow-lg">
            <iframe
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d2448.9711674482597!2d-2.128710323366914!3d52.80210086884617!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x487a55ed99e9b085%3A0x6b7c5b7b7b7b7b7b!2sStafford%20Thai%20Boxing%20Gym!5e0!3m2!1sen!2suk!4v1718361600000!5m2!1sen!2suk"
              width="100%"
              height="450"
              style="border: 0"
              allowfullscreen=""
              loading="lazy"
              referrerpolicy="no-referrer-when-downgrade"
            ></iframe>
          </div>
        </div>
      </div>
    </section>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive } from "vue"
import axios from "axios"

// Reactive form data
const formData = reactive({
  name: "",
  email: "",
  subject: "",
  message: "",
})

const submitting = ref(false)
const statusMessage = ref<string | null>(null)
const isSuccess = ref(false)

// Replace with your actual Contact Form API Gateway Endpoint URL
const CONTACT_API_ENDPOINT =
  "https://2xdtf9knb5.execute-api.eu-west-2.amazonaws.com/dev/staffordthai-contact-form-lambda"

const handleSubmit = async () => {
  submitting.value = true
  statusMessage.value = null
  isSuccess.value = false

  try {
    const response = await axios.post(CONTACT_API_ENDPOINT, formData)

    if (response.status === 200) {
      statusMessage.value = response.data.message || "Message sent successfully!"
      isSuccess.value = true
      // Clear form
      formData.name = ""
      formData.email = ""
      formData.subject = ""
      formData.message = ""
    } else {
      statusMessage.value = response.data.message || "Failed to send message. Please try again."
      isSuccess.value = false
    }
  } catch (error: any) {
    console.error("Error submitting contact form:", error)
    statusMessage.value =
      error.response?.data?.message || "An error occurred. Please try again later."
    isSuccess.value = false
  } finally {
    submitting.value = false
  }
}
</script>

<style scoped>
/* Add any additional global styles here, if needed */
</style>
