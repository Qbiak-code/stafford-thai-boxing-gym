<template>
  <div class="member-login-page">
    <div class="container">
      <div class="page-hero">
        <h1>Member Portal</h1>
        <p>Access your training schedule and manage your membership</p>
      </div>

      <!-- Show auth forms if not authenticated -->
      <div v-if="!authStore.isAuthenticated && !emailConfirmationSent" class="auth-container">
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
          <h2>Welcome Back</h2>
          <form @submit.prevent="handleLogin">
            <div class="form-group">
              <label for="login-email">Email Address</label>
              <input
                type="email"
                id="login-email"
                v-model="loginForm.email"
                required
                :disabled="authStore.isLoading"
                class="form-input"
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
                class="form-input"
              />
            </div>
            <button
              type="submit"
              class="btn btn-primary btn-lg auth-button"
              :disabled="authStore.isLoading"
            >
              {{ authStore.isLoading ? "Signing In..." : "Sign In" }}
            </button>
          </form>
        </div>

        <!-- Signup Form -->
        <div v-if="activeTab === 'signup'" class="auth-form">
          <h2>Join Our Community</h2>
          <form @submit.prevent="handleSignup">
            <div class="form-row">
              <div class="form-group">
                <label for="signup-firstName">First Name</label>
                <input
                  type="text"
                  id="signup-firstName"
                  v-model="signupForm.firstName"
                  required
                  :disabled="authStore.isLoading"
                  class="form-input"
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
                  class="form-input"
                />
              </div>
            </div>
            <div class="form-group">
              <label for="signup-email">Email Address</label>
              <input
                type="email"
                id="signup-email"
                v-model="signupForm.email"
                required
                :disabled="authStore.isLoading"
                class="form-input"
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
                class="form-input"
              />
            </div>
            <div class="form-group">
              <label for="signup-phone">Phone (Optional)</label>
              <input
                type="tel"
                id="signup-phone"
                v-model="signupForm.phone"
                :disabled="authStore.isLoading"
                class="form-input"
              />
            </div>
            <button
              type="submit"
              class="btn btn-primary btn-lg auth-button"
              :disabled="authStore.isLoading"
            >
              {{ authStore.isLoading ? "Creating Account..." : "Create Account" }}
            </button>
          </form>
        </div>

        <!-- Error message -->
        <div v-if="authStore.error" class="error-message">
          {{ authStore.error }}
          <button @click="authStore.clearError" class="btn btn-ghost btn-sm">Dismiss</button>
        </div>
      </div>

      <!-- Email Confirmation State -->
      <div v-if="emailConfirmationSent" class="confirmation-message">
        <div class="confirmation-icon">
          <svg class="icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
            />
          </svg>
        </div>
        <h2>Check Your Email</h2>
        <div class="confirmation-content">
          <p>We've sent a confirmation link to:</p>
          <p class="email-highlight">{{ confirmationEmail }}</p>
          <p>
            Please click the link in your email to activate your account, then return here to log
            in.
          </p>

          <div class="confirmation-actions">
            <button @click="backToLogin" class="btn btn-primary">Back to Login</button>
            <button
              @click="resendConfirmation"
              class="btn btn-ghost"
              :disabled="resendCooldown > 0"
            >
              {{ resendCooldown > 0 ? `Resend in ${resendCooldown}s` : "Resend Email" }}
            </button>
          </div>
        </div>
      </div>

      <!-- Loading state for authenticated users -->
      <div v-else-if="authStore.isAuthenticated" class="redirect-state">
        <div class="loading-message">
          <div class="spinner"></div>
          <h2>Redirecting to your dashboard...</h2>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, onMounted, watch } from "vue"
import { useRouter } from "vue-router"
import { useAuthStore } from "@/stores/auth"
import type { LoginCredentials, SignupData } from "@/types"
import { supabase } from "@/lib/supabase.ts"

const authStore = useAuthStore()
const router = useRouter()

const emailConfirmationSent = ref(false)
const confirmationEmail = ref("")
const resendCooldown = ref(0)

const activeTab = ref<"login" | "signup">("login")

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

  if (!success) {
    if (authStore.error?.includes("check your email")) {
      emailConfirmationSent.value = true
      confirmationEmail.value = signupForm.email
      authStore.clearError()
    }
  } else if (success) {
    router.push("/member/dashboard")
  }
}

const resendConfirmation = async () => {
  if (resendCooldown.value > 0) return

  try {
    await supabase.auth.resend({
      type: "signup",
      email: confirmationEmail.value,
    })

    resendCooldown.value = 60
    const timer = setInterval(() => {
      resendCooldown.value--
      if (resendCooldown.value <= 0) {
        clearInterval(timer)
      }
    }, 1000)
  } catch (err) {
    console.error("Failed to resend confirmation:", err)
  }
}

const backToLogin = () => {
  emailConfirmationSent.value = false
  confirmationEmail.value = ""
  activeTab.value = "login"
  Object.assign(signupForm, { email: "", password: "", firstName: "", lastName: "", phone: "" })
}

onMounted(async () => {
  await authStore.initializeAuth()
  if (authStore.isAuthenticated) {
    router.push("/member/dashboard")
  }
})

watch(
  () => authStore.isAuthenticated,
  (isAuthenticated) => {
    if (isAuthenticated) {
      router.push("/member/dashboard")
    }
  },
)
</script>

<style scoped>
.member-login-page {
  min-height: 100vh;
  background-color: var(--bg-primary);
  padding: 2rem 0;
}

.container {
  max-width: 28rem;
  margin: 0 auto;
  padding: 0 1rem;
}

.page-hero {
  text-align: center;
  margin-bottom: 3rem;
}

.page-hero h1 {
  font-size: clamp(2rem, 6vw, 2.5rem);
  font-weight: 700;
  color: var(--text-primary);
  margin-bottom: 0.5rem;
}

.page-hero p {
  color: var(--text-secondary);
  font-size: 1rem;
}

.auth-container {
  background-color: var(--bg-secondary);
  border: 1px solid var(--border-color);
  border-radius: 1rem;
  padding: 2rem;
  box-shadow: var(--shadow-medium);
}

.tab-navigation {
  display: flex;
  margin-bottom: 2rem;
  border-radius: 0.5rem;
  overflow: hidden;
  border: 1px solid var(--border-color);
}

.tab-button {
  flex: 1;
  padding: 0.75rem 1rem;
  background-color: var(--bg-primary);
  color: var(--text-secondary);
  border: none;
  cursor: pointer;
  transition: all 0.3s ease;
  font-weight: 500;
}

.tab-button:hover {
  background-color: var(--hover-bg);
  color: var(--text-primary);
}

.tab-button.active {
  background-color: var(--accent-gold);
  color: var(--bg-primary);
}

.auth-form h2 {
  margin-bottom: 1.5rem;
  color: var(--text-primary);
  text-align: center;
  font-size: 1.5rem;
  font-weight: 600;
}

.form-row {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 1rem;
}

.form-group {
  margin-bottom: 1.5rem;
}

.form-group label {
  display: block;
  margin-bottom: 0.5rem;
  color: var(--text-primary);
  font-weight: 500;
  font-size: 0.875rem;
}

.form-input {
  width: 100%;
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

.form-input:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

.auth-button {
  width: 100%;
  justify-content: center;
  margin-top: 0.5rem;
}

.error-message {
  margin-top: 1.5rem;
  padding: 1rem;
  background-color: rgba(178, 34, 34, 0.1);
  border: 1px solid var(--accent-red);
  border-radius: 0.5rem;
  color: var(--accent-red);
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 1rem;
}

.confirmation-message {
  background-color: var(--bg-secondary);
  border: 1px solid var(--border-color);
  border-radius: 1rem;
  padding: 3rem 2rem;
  text-align: center;
  box-shadow: var(--shadow-medium);
}

.confirmation-icon {
  width: 4rem;
  height: 4rem;
  background-color: var(--accent-gold);
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  margin: 0 auto 1.5rem;
}

.confirmation-icon .icon {
  width: 2rem;
  height: 2rem;
  color: var(--bg-primary);
}

.confirmation-message h2 {
  color: var(--text-primary);
  margin-bottom: 1.5rem;
  font-size: 1.5rem;
  font-weight: 600;
}

.confirmation-content p {
  color: var(--text-secondary);
  margin-bottom: 1rem;
  line-height: 1.5;
}

.email-highlight {
  color: var(--accent-gold) !important;
  font-weight: 600;
  font-size: 1.1em;
}

.confirmation-actions {
  display: flex;
  flex-direction: column;
  gap: 1rem;
  margin-top: 2rem;
}

@media (min-width: 480px) {
  .confirmation-actions {
    flex-direction: row;
    justify-content: center;
  }
}

.redirect-state {
  background-color: var(--bg-secondary);
  border: 1px solid var(--border-color);
  border-radius: 1rem;
  padding: 3rem 2rem;
  text-align: center;
  box-shadow: var(--shadow-medium);
}

.loading-message {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 1rem;
}

.spinner {
  width: 2.5rem;
  height: 2.5rem;
  border: 3px solid var(--border-color);
  border-top: 3px solid var(--accent-gold);
  border-radius: 50%;
  animation: spin 1s linear infinite;
}

@keyframes spin {
  from {
    transform: rotate(0deg);
  }
  to {
    transform: rotate(360deg);
  }
}

.loading-message h2 {
  color: var(--text-primary);
  font-size: 1.25rem;
  font-weight: 600;
}
</style>
