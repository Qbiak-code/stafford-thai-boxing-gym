<template>
  <div class="member-dashboard-page content-section">
    <div class="page-hero">
      <h1 class="page-title">Member Dashboard</h1>
    </div>

    <section class="section dashboard-content">
      <div v-if="authStore.user" class="user-welcome">
        <h2>Welcome, {{ authStore.userFullName }}!</h2>
        <p>Membership Type: {{ authStore.user.membershipType }}</p>
        <p>Member since: {{ new Date(authStore.user.joinDate).toLocaleDateString('en-GB') }}</p>
      </div>

      <div v-if="authStore.isLoading" class="status-message">Loading user info...</div>
      <div v-if="error" class="error-message">Error: {{ error }}</div>
      <div v-if="successMessage" class="success-message">{{ successMessage }}</div>

      <form @submit.prevent="saveProfile" v-if="authStore.user && !loadingProfile" class="profile-form">
        <h3>Update Your Profile</h3>

        <div class="form-group">
          <label for="firstName">First Name</label>
          <input type="text" id="firstName" v-model="profile.first_name" required />
        </div>

        <div class="form-group">
          <label for="lastName">Last Name</label>
          <input type="text" id="lastName" v-model="profile.last_name" required />
        </div>

        <div class="form-group">
          <label for="email">Email (Cannot be changed here)</label>
          <input type="email" id="email" :value="authStore.user?.email" disabled />
        </div>

        <div class="form-group">
          <label for="phone">Contact Number</label>
          <input type="tel" id="phone" v-model="profile.phone" />
        </div>

        <div class="form-group">
          <label for="emergencyContact">Emergency Contact</label>
          <input type="text" id="emergencyContact" v-model="profile.emergency_contact" placeholder="Name and phone number" />
        </div>

        <button type="submit" class="btn btn-primary" :disabled="savingProfile">
          {{ savingProfile ? "Saving..." : "Save Profile" }}
        </button>
      </form>

      <div class="dashboard-actions">
        <router-link to="/subscriptions" class="btn btn-secondary">Manage Subscription</router-link>
        <button @click="signOutUser" class="btn btn-secondary sign-out-btn">Sign Out</button>
      </div>
    </section>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, onMounted } from "vue"
import { useRouter } from "vue-router"
import { useAuthStore } from "@/stores/auth"
import { supabase } from "@/lib/supabase"

const authStore = useAuthStore()
const router = useRouter()

// Reactive state
const loadingProfile = ref(false)
const savingProfile = ref(false)
const error = ref<string | null>(null)
const successMessage = ref<string | null>(null)

// Profile data
const profile = reactive({
  first_name: "",
  last_name: "",
  phone: "",
  emergency_contact: ""
})

// Load user profile data
const fetchMemberProfile = async () => {
  if (!authStore.user) return

  loadingProfile.value = true
  error.value = null

  try {
    const { data, error: profileError } = await supabase
      .from("profiles")
      .select("*")
      .eq("id", authStore.user.id)
      .single()

    if (profileError) throw profileError

    if (data) {
      Object.assign(profile, {
        first_name: data.first_name || "",
        last_name: data.last_name || "",
        phone: data.phone || "",
        emergency_contact: data.emergency_contact || ""
      })
    }
  } catch (err: any) {
    error.value = err.message || "Failed to load profile"
  } finally {
    loadingProfile.value = false
  }
}

// Save profile changes
const saveProfile = async () => {
  if (!authStore.user) return

  savingProfile.value = true
  error.value = null
  successMessage.value = null

  try {
    const { error: updateError } = await supabase
      .from("profiles")
      .update({
        first_name: profile.first_name,
        last_name: profile.last_name,
        phone: profile.phone,
        emergency_contact: profile.emergency_contact,
        updated_at: new Date().toISOString()
      })
      .eq("id", authStore.user.id)

    if (updateError) throw updateError

    successMessage.value = "Profile updated successfully!"

    // Update the auth store user data
    await authStore.checkAuthStatus()

  } catch (err: any) {
    error.value = err.message || "Failed to save profile"
  } finally {
    savingProfile.value = false
  }
}

// Sign out user
const signOutUser = async () => {
  await authStore.logout()
  router.push("/member")
}

// Initialize component
onMounted(async () => {
  await authStore.checkAuthStatus()
  if (authStore.isAuthenticated) {
    await fetchMemberProfile()
  } else {
    router.push("/member")
  }
})
</script>

<style scoped>
.member-dashboard-page {
  padding: 40px 20px;
  background-color: #1a1a1a;
  color: #e0e0e0;
  min-height: 100vh;
}

.page-hero {
  text-align: center;
  margin-bottom: 40px;
}

.page-title {
  font-size: 2.5rem;
  color: #c9302c;
  margin-bottom: 20px;
}

.dashboard-content {
  max-width: 800px;
  margin: 0 auto;
}

.user-welcome {
  background: #2a2a2a;
  padding: 30px;
  border-radius: 10px;
  margin-bottom: 30px;
  text-align: center;
}

.user-welcome h2 {
  color: #27ae60;
  margin-bottom: 15px;
}

.user-welcome p {
  color: #e0e0e0;
  margin-bottom: 10px;
}

.profile-form {
  background: #2a2a2a;
  padding: 30px;
  border-radius: 10px;
  margin-bottom: 30px;
}

.profile-form h3 {
  color: #e0e0e0;
  margin-bottom: 25px;
  text-align: center;
}

.form-group {
  margin-bottom: 20px;
}

.form-group label {
  display: block;
  margin-bottom: 5px;
  color: #e0e0e0;
  font-weight: 500;
}

.form-group input {
  width: 100%;
  padding: 12px;
  border: 1px solid #444;
  border-radius: 5px;
  background: #333;
  color: #e0e0e0;
  font-size: 16px;
}

.form-group input:focus {
  outline: none;
  border-color: #c9302c;
  box-shadow: 0 0 0 2px rgba(201, 48, 44, 0.2);
}

.form-group input:disabled {
  background: #222;
  color: #999;
  cursor: not-allowed;
}

.dashboard-actions {
  display: flex;
  gap: 15px;
  justify-content: center;
  flex-wrap: wrap;
}

.btn {
  padding: 12px 24px;
  border: none;
  border-radius: 5px;
  font-size: 16px;
  font-weight: 600;
  cursor: pointer;
  text-decoration: none;
  display: inline-block;
  text-align: center;
  transition: all 0.3s;
}

.btn-primary {
  background: #c9302c;
  color: white;
}

.btn-primary:hover {
  background: #a02622;
}

.btn-secondary {
  background: #666;
  color: white;
}

.btn-secondary:hover {
  background: #555;
}

.status-message {
  text-align: center;
  padding: 15px;
  margin: 20px 0;
  background: #2a2a2a;
  border-radius: 5px;
  color: #e0e0e0;
}

.error-message {
  text-align: center;
  padding: 15px;
  margin: 20px 0;
  background: rgba(231, 76, 60, 0.1);
  border: 1px solid #e74c3c;
  border-radius: 5px;
  color: #e74c3c;
}

.success-message {
  text-align: center;
  padding: 15px;
  margin: 20px 0;
  background: rgba(39, 174, 96, 0.1);
  border: 1px solid #27ae60;
  border-radius: 5px;
  color: #27ae60;
}
</style>
