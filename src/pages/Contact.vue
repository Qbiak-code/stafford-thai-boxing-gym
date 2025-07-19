<template>
  <div class="contact-page content-section">
    <div class="page-hero">
      <h1 class="page-title">Contact Us</h1>
    </div>

    <section class="section contact-form-section">
      <form @submit.prevent="handleSubmit" class="contact-form">
        <div class="form-group">
          <label for="name">Name</label>
          <input type="text" id="name" v-model="formData.name" required>
        </div>
        <div class="form-group">
          <label for="email">Email</label>
          <input type="email" id="email" v-model="formData.email" required>
        </div>
        <div class="form-group">
          <label for="subject">Subject (Optional)</label>
          <input type="text" id="subject" v-model="formData.subject">
        </div>
        <div class="form-group">
          <label for="message">Message</label>
          <textarea id="message" v-model="formData.message" rows="6" required></textarea>
        </div>

        <button type="submit" class="btn btn-primary" :disabled="submitting">
          {{ submitting ? 'Sending...' : 'Send Message' }}
        </button>

        <p v-if="statusMessage" :class="{ 'success-message': isSuccess, 'error-message': !isSuccess }">
          {{ statusMessage }}
        </p>
      </form>
    </section>

    <section class="section map-section">
      <h2 class="section-title">Find Us</h2>
      <div class="google-map-placeholder">
        <iframe
          src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d2448.9711674482597!2d-2.128710323366914!3d52.80210086884617!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x487a55ed99e9b085%3A0x6b7c5b7b7b7b7b7b!2sStafford%20Thai%20Boxing%20Gym!5e0!3m2!1sen!2suk!4v1718361600000!5m2!1sen!2suk"
          width="100%" height="450" style="border:0;" allowfullscreen="" loading="lazy"
          referrerpolicy="no-referrer-when-downgrade"></iframe>
      </div>
      <div class="contact-details">
        <p><strong>Address:</strong> [Your Gym Address Here]</p>
        <p><strong>Phone:</strong> [Your Phone Number Here]</p>
        <p><strong>Email:</strong> [Your Contact Email Here]</p>
      </div>
    </section>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive } from 'vue';
import axios from 'axios';

// Reactive form data
const formData = reactive({
  name: '',
  email: '',
  subject: '',
  message: '',
});

const submitting = ref(false);
const statusMessage = ref<string | null>(null);
const isSuccess = ref(false);

// Replace with your actual Contact Form API Gateway Endpoint URL
const CONTACT_API_ENDPOINT = 'https://2xdtf9knb5.execute-api.eu-west-2.amazonaws.com/dev/staffordthai-contact-form-lambda';

const handleSubmit = async () => {
  submitting.value = true;
  statusMessage.value = null;
  isSuccess.value = false;

  try {
    const response = await axios.post(CONTACT_API_ENDPOINT, formData);

    if (response.status === 200) {
      statusMessage.value = response.data.message || "Message sent successfully!";
      isSuccess.value = true;
      // Clear form
      formData.name = '';
      formData.email = '';
      formData.subject = '';
      formData.message = '';
    } else {
      statusMessage.value = response.data.message || "Failed to send message. Please try again.";
      isSuccess.value = false;
    }
  } catch (error: any) {
    console.error('Error submitting contact form:', error);
    statusMessage.value = error.response?.data?.message || "An error occurred. Please try again later.";
    isSuccess.value = false;
  } finally {
    submitting.value = false;
  }
};
</script>

<style scoped>
.contact-page { /* General page styling */ }
.contact-form-section { /* Section padding/margin */ }
.contact-form {
  max-width: 600px; margin: 0 auto; padding: 30px;
  background-color: #2c2c2c; border-radius: 8px; box-shadow: 0 4px 15px rgba(0,0,0,0.4);
}
.form-group { margin-bottom: 20px; }
.form-group label { display: block; margin-bottom: 8px; font-weight: bold; color: white; }
.form-group input, .form-group textarea {
  width: calc(100% - 20px); padding: 10px; border: 1px solid #555; border-radius: 4px;
  background-color: #1a1a1a; color: white; font-size: 1rem;
  transition: border-color 0.3s ease;
}
.form-group input:focus, .form-group textarea:focus { border-color: #e74c3c; outline: none; }
.btn-primary { /* Inherits from global styles, adjust if needed */ }
.success-message { color: #27ae60; margin-top: 15px; font-weight: bold; }
.error-message { color: #e74c3c; margin-top: 15px; font-weight: bold; }

.google-map-placeholder { margin-top: 30px; border-radius: 8px; overflow: hidden; box-shadow: 0 4px 15px rgba(0,0,0,0.4); }
.contact-details { margin-top: 30px; font-size: 1.1rem; }
.contact-details p { margin-bottom: 10px; }
</style>
