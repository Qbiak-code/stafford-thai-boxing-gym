<template>
  <div class="member-login-page content-section">
    <div class="page-hero">
      <h1 class="page-title">Member Portal Login</h1>
    </div>

    <!-- Show auth forms if not authenticated -->
    <div v-if="!authStore.isAuthenticated" class="auth-container">
      <!-- Tab Navigation -->
      <div class="tab-navigation">
        <button
          :class="['tab-button', { active: activeTab === 'login' }]"
          @click="activeTab = 'login'"
        >
          Login
        </button>
        <button
          :class="['tab-button', { active: activeTab === 'signup' }]"
          @click="activeTab = 'signup'"
        >
          Sign Up
        </button>
      </div>

      <!-- Login Form -->
      <div v-if="activeTab === 'login'" class="auth-form">
        <h2>Login to Your Account</h2>
        <form @submit.prevent="handleLogin">
          <div class="form-group">
            <label for="login-email">Email</label>
            <input
              type="email"
              id="login-email"
              v-model="loginForm.email"
              required
              :disabled="authStore.isLoading"
            />
          </div>
          <div class="form-group">
            <label for="login-password">Password</label>
            <input
              type="password"
              id="login-password"
              v-model="loginForm.password"
              required
              :disabled="authStore.isLoading"
            />
          </div>
          <button type="submit" class="btn btn-primary auth-button" :disabled="authStore.isLoading">
            {{ authStore.isLoading ? "Signing In..." : "Sign In" }}
          </button>
        </form>
      </div>

      <!-- Signup Form -->
      <div v-if="activeTab === 'signup'" class="auth-form">
        <h2>Create New Account</h2>
        <form @submit.prevent="handleSignup">
          <div class="form-group">
            <label for="signup-email">Email</label>
            <input
              type="email"
              id="signup-email"
              v-model="signupForm.email"
              required
              :disabled="authStore.isLoading"
            />
          </div>
          <div class="form-group">
            <label for="signup-password">Password</label>
            <input
              type="password"
              id="signup-password"
              v-model="signupForm.password"
              required
              :disabled="authStore.isLoading"
            />
          </div>
          <div class="form-group">
            <label for="signup-firstName">First Name</label>
            <input
              type="text"
              id="signup-firstName"
              v-model="signupForm.firstName"
              required
              :disabled="authStore.isLoading"
            />
          </div>
          <div class="form-group">
            <label for="signup-lastName">Last Name</label>
            <input
              type="text"
              id="signup-lastName"
              v-model="signupForm.lastName"
              required
              :disabled="authStore.isLoading"
            />
          </div>
          <div class="form-group">
            <label for="signup-phone">Phone (Optional)</label>
            <input
              type="tel"
              id="signup-phone"
              v-model="signupForm.phone"
              :disabled="authStore.isLoading"
            />
          </div>
          <button type="submit" class="btn btn-primary auth-button" :disabled="authStore.isLoading">
            {{ authStore.isLoading ? "Creating Account..." : "Create Account" }}
          </button>
        </form>
      </div>

      <!-- Error Message -->
      <div v-if="authStore.error" class="error-message">
        {{ authStore.error }}
        <button @click="authStore.clearError" class="btn-link">Dismiss</button>
      </div>
    </div>

    <!-- Show authenticated state -->
    <div v-else class="authenticated-state">
      <h2>Welcome back, {{ authStore.userFullName }}!</h2>
      <p>You are already logged in.</p>
      <div class="auth-actions">
        <router-link to="/member/dashboard" class="btn btn-primary">Go to Dashboard</router-link>
        <button @click="handleSignOut" class="btn btn-secondary">Sign Out</button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, onMounted } from "vue"
import { useRouter } from "vue-router"
import { useAuthStore } from "@/stores/auth"
import type { LoginCredentials, SignupData } from "@/types"

const authStore = useAuthStore()
const router = useRouter()

const activeTab = ref<'login' | 'signup'>('login')

const loginForm = reactive<LoginCredentials>({
  email: "",
  password: "",
})

const signupForm = reactive<SignupData>({
  email: "",
  password: "",
  firstName: "",
  lastName: "",
  phone: "",
})

const handleLogin = async () => {
  const success = await authStore.login(loginForm)
  if (success) {
    router.push("/member/dashboard")
  }
}

const handleSignup = async () => {
  const success = await authStore.signup(signupForm)
  if (success) {
    router.push("/member/dashboard")
  }
}

const handleSignOut = async () => {
  await authStore.logout()
  // Reset forms
  Object.assign(loginForm, { email: "", password: "" })
  Object.assign(signupForm, { email: "", password: "", firstName: "", lastName: "", phone: "" })
}

onMounted(async () => {
  // Initialize auth and check if user is already logged in
  await authStore.initializeAuth()
  if (authStore.isAuthenticated) {
    router.push("/member/dashboard")
  }
})
</script>

<style scoped>
.member-login-page {
  padding: 40px 20px;
  text-align: center;
  background-color: #1a1a1a;
  color: #e0e0e0;
  min-height: 100vh;
}

.page-hero {
  margin-bottom: 40px;
}

.page-title {
  font-size: 2.5rem;
  color: #c9302c;
  margin-bottom: 20px;
}

.auth-container {
  max-width: 400px;
  margin: 0 auto;
  background: #2a2a2a;
  padding: 30px;
  border-radius: 10px;
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.3);
}

.tab-navigation {
  display: flex;
  margin-bottom: 30px;
  border-radius: 5px;
  overflow: hidden;
}

.tab-button {
  flex: 1;
  padding: 12px;
  background: #333;
  color: #e0e0e0;
  border: none;
  cursor: pointer;
  transition: background-color 0.3s;
}

.tab-button.active {
  background: #c9302c;
  color: white;
}

.tab-button:hover {
  background: #444;
}

.tab-button.active:hover {
  background: #a02622;
}

.auth-form h2 {
  margin-bottom: 25px;
  color: #e0e0e0;
}

.form-group {
  margin-bottom: 20px;
  text-align: left;
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

.auth-button {
  width: 100%;
  padding: 12px;
  margin-top: 10px;
  font-size: 16px;
  font-weight: 600;
}

.error-message {
  margin-top: 20px;
  padding: 15px;
  background: rgba(231, 76, 60, 0.1);
  border: 1px solid #e74c3c;
  border-radius: 5px;
  color: #e74c3c;
}

.btn-link {
  background: none;
  border: none;
  color: #e74c3c;
  cursor: pointer;
  text-decoration: underline;
  margin-left: 10px;
}

.authenticated-state {
  max-width: 500px;
  margin: 0 auto;
  background: #2a2a2a;
  padding: 40px;
  border-radius: 10px;
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.3);
}

.authenticated-state h2 {
  color: #27ae60;
  margin-bottom: 20px;
}

.authenticated-state p {
  color: #e0e0e0;
  margin-bottom: 30px;
}

.auth-actions {
  display: flex;
  gap: 15px;
  justify-content: center;
}

.auth-actions .btn {
  padding: 12px 24px;
  text-decoration: none;
  border-radius: 5px;
  font-weight: 600;
  transition: all 0.3s;
}
</style>
