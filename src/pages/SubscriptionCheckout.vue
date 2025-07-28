<template>
  <div class="subscription-checkout-page">
    <div class="container">
      <!-- Page Header -->
      <div class="page-header">
        <h1>Choose Your Membership</h1>
        <p>Select the perfect plan for your Muay Thai journey</p>
      </div>

      <!-- Loading/Error States -->
      <div v-if="authStore.isLoading" class="status-message">
        <div class="spinner"></div>
        <p>Loading membership plans...</p>
      </div>

      <div v-if="error" class="error-message">
        <svg class="error-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="2"
            d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
          />
        </svg>
        <span>{{ error }}</span>
      </div>

      <!-- Membership Plans -->
      <section class="plans-section" v-if="!authStore.isLoading && !error">
        <div class="membership-plans-grid">
          <div
            class="plan-card"
            v-for="plan in membershipPlans"
            :key="plan.id"
            :class="{ selected: selectedPlan?.id === plan.id }"
          >
            <div class="plan-header">
              <h3>{{ plan.name }}</h3>
              <div class="price">
                £{{ (plan.price_monthly / 100).toFixed(2) }}<span class="price-period">/month</span>
              </div>
            </div>

            <div class="plan-description" v-if="plan.description">
              {{ plan.description }}
            </div>

            <ul class="plan-features" v-if="plan.features && plan.features.length">
              <li v-for="feature in plan.features" :key="feature">
                <svg class="feature-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="M5 13l4 4L19 7"
                  />
                </svg>
                {{ feature }}
              </li>
            </ul>

            <button
              class="btn btn-primary plan-select-btn"
              @click="selectPlan(plan)"
              :disabled="selectedPlan?.id === plan.id"
            >
              {{ selectedPlan?.id === plan.id ? "Selected" : "Choose Plan" }}
            </button>
          </div>
        </div>
      </section>

      <!-- Payment Section -->
      <section class="payment-section" v-if="selectedPlan">
        <div class="payment-card">
          <div class="card-header">
            <h2>Complete Your Payment</h2>
          </div>

          <div class="selected-plan-summary">
            <div class="summary-content">
              <h3>{{ selectedPlan.name }}</h3>
              <p class="summary-price">
                £{{ (selectedPlan.price_monthly / 100).toFixed(2) }}/month
              </p>
              <p class="summary-description" v-if="selectedPlan.description">
                {{ selectedPlan.description }}
              </p>
            </div>
          </div>

          <div class="payment-form">
            <div class="payment-placeholder">
              <svg class="payment-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z"
                />
              </svg>
              <p>Payment integration with Stripe will be implemented here.</p>
              <p class="payment-note">
                Selected plan: <strong>{{ selectedPlan.name }}</strong>
              </p>
            </div>

            <div class="payment-actions">
              <button class="btn btn-ghost" @click="clearSelection">Choose Different Plan</button>
              <button class="btn btn-primary" disabled>Continue to Payment</button>
            </div>
          </div>
        </div>
      </section>

      <!-- Auth Required Message -->
      <div v-if="!authStore.isAuthenticated" class="auth-required">
        <div class="auth-content">
          <svg class="auth-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
            />
          </svg>
          <h3>Login Required</h3>
          <p>Please log in to manage your subscription and access member benefits.</p>
          <router-link to="/member" class="btn btn-primary">Login to Continue</router-link>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from "vue"
import { useRouter } from "vue-router"
import { useAuthStore } from "@/stores/auth"
import { supabase } from "@/lib/supabase"
import type { SubscriptionPlan } from "@/types"

const authStore = useAuthStore()
const router = useRouter()

// State
const membershipPlans = ref<SubscriptionPlan[]>([])
const selectedPlan = ref<SubscriptionPlan | null>(null)
const error = ref<string | null>(null)

// Load subscription plans from Supabase
const loadMembershipPlans = async () => {
  try {
    const { data, error: plansError } = await supabase
      .from("subscription_plans")
      .select("*")
      .eq("is_active", true)
      .order("sort_order")

    if (plansError) {
      console.error("Failed to load plans:", plansError)
      error.value = plansError.message
      return
    }

    membershipPlans.value = data || []
  } catch (err) {
    const errorMessage = err instanceof Error ? err.message : "Failed to load membership plans"
    error.value = errorMessage
    console.error("Load plans error:", err)
  }
}

// Select a plan
const selectPlan = (plan: SubscriptionPlan) => {
  selectedPlan.value = plan
}

// Clear selection
const clearSelection = () => {
  selectedPlan.value = null
}

// Initialize component
onMounted(async () => {
  await authStore.checkAuthStatus()
  if (!authStore.isAuthenticated) {
    router.push("/member")
    return
  }

  await loadMembershipPlans()
})
</script>

<style scoped>
.subscription-checkout-page {
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
  font-size: 1.125rem;
  color: var(--text-secondary);
}

/* Status Messages */
.status-message {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 3rem 1rem;
  text-align: center;
  color: var(--text-secondary);
}

.spinner {
  width: 2rem;
  height: 2rem;
  border: 3px solid var(--border-color);
  border-top: 3px solid var(--accent-gold);
  border-radius: 50%;
  animation: spin 1s linear infinite;
  margin-bottom: 1rem;
}

@keyframes spin {
  0% {
    transform: rotate(0deg);
  }
  100% {
    transform: rotate(360deg);
  }
}

.error-message {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.75rem;
  padding: 1rem 1.5rem;
  background-color: rgba(178, 34, 34, 0.1);
  border: 1px solid var(--accent-red);
  border-radius: 0.5rem;
  color: var(--accent-red);
  margin: 0 auto 2rem;
  max-width: 600px;
}

.error-icon {
  width: 1.25rem;
  height: 1.25rem;
  flex-shrink: 0;
}

/* Plans Section */
.plans-section {
  margin-bottom: 3rem;
}

.membership-plans-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(320px, 1fr));
  gap: 2rem;
  margin-bottom: 2rem;
}

.plan-card {
  background-color: var(--bg-secondary);
  border: 2px solid var(--border-color);
  border-radius: 1rem;
  padding: 2rem;
  text-align: center;
  transition: all 0.3s ease;
  position: relative;
  overflow: hidden;
}

.plan-card:hover {
  transform: translateY(-4px);
  box-shadow: var(--shadow-medium);
  border-color: var(--accent-gold);
}

.plan-card.selected {
  border-color: var(--accent-gold);
  background-color: var(--bg-tertiary);
}

.plan-card.selected::before {
  content: "";
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  height: 4px;
  background: var(--gradient-primary);
}

.plan-header h3 {
  font-size: 1.5rem;
  font-weight: 700;
  color: var(--accent-gold);
  margin-bottom: 1rem;
}

.price {
  font-size: 2.5rem;
  font-weight: 900;
  color: var(--text-primary);
  margin-bottom: 1.5rem;
  line-height: 1;
}

.price-period {
  font-size: 1rem;
  font-weight: 400;
  color: var(--text-secondary);
}

.plan-description {
  color: var(--text-secondary);
  margin-bottom: 1.5rem;
  font-style: italic;
  line-height: 1.5;
}

.plan-features {
  list-style: none;
  padding: 0;
  margin: 1.5rem 0;
  text-align: left;
}

.plan-features li {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  padding: 0.5rem 0;
  color: var(--text-primary);
}

.feature-icon {
  width: 1rem;
  height: 1rem;
  color: var(--accent-gold);
  flex-shrink: 0;
}

.plan-select-btn {
  width: 100%;
  margin-top: 1.5rem;
}

/* Payment Section */
.payment-section {
  margin-top: 3rem;
}

.payment-card {
  background-color: var(--bg-secondary);
  border: 1px solid var(--border-color);
  border-radius: 1rem;
  max-width: 600px;
  margin: 0 auto;
  overflow: hidden;
}

.card-header {
  background-color: var(--bg-tertiary);
  padding: 1.5rem 2rem;
  border-bottom: 1px solid var(--border-color);
}

.card-header h2 {
  font-size: 1.5rem;
  font-weight: 700;
  color: var(--text-primary);
  margin: 0;
  text-align: center;
}

.selected-plan-summary {
  padding: 2rem;
  border-bottom: 1px solid var(--border-color);
}

.summary-content {
  text-align: center;
}

.summary-content h3 {
  font-size: 1.25rem;
  font-weight: 600;
  color: var(--accent-gold);
  margin-bottom: 0.5rem;
}

.summary-price {
  font-size: 1.875rem;
  font-weight: 700;
  color: var(--text-primary);
  margin-bottom: 0.5rem;
}

.summary-description {
  color: var(--text-secondary);
  font-style: italic;
}

.payment-form {
  padding: 2rem;
}

.payment-placeholder {
  text-align: center;
  padding: 2rem;
  background-color: var(--bg-primary);
  border-radius: 0.5rem;
  margin-bottom: 1.5rem;
}

.payment-icon {
  width: 3rem;
  height: 3rem;
  color: var(--text-secondary);
  margin: 0 auto 1rem;
}

.payment-placeholder p {
  color: var(--text-secondary);
  margin-bottom: 0.5rem;
}

.payment-note {
  color: var(--text-primary);
  font-size: 0.875rem;
}

.payment-actions {
  display: flex;
  gap: 1rem;
  justify-content: center;
  flex-wrap: wrap;
}

/* Auth Required */
.auth-required {
  max-width: 500px;
  margin: 3rem auto;
}

.auth-content {
  background-color: var(--bg-secondary);
  border: 1px solid var(--border-color);
  border-radius: 1rem;
  padding: 3rem 2rem;
  text-align: center;
}

.auth-icon {
  width: 3rem;
  height: 3rem;
  color: var(--accent-gold);
  margin: 0 auto 1rem;
}

.auth-content h3 {
  font-size: 1.5rem;
  font-weight: 700;
  color: var(--text-primary);
  margin-bottom: 1rem;
}

.auth-content p {
  color: var(--text-secondary);
  margin-bottom: 2rem;
  line-height: 1.6;
}

/* Button Styles */
.btn {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  padding: 0.75rem 1.5rem;
  font-size: 0.95rem;
  font-weight: 500;
  text-decoration: none;
  border: 1px solid var(--border-color);
  border-radius: 0.5rem;
  cursor: pointer;
  transition: all 0.2s ease;
  background: transparent;
  color: var(--text-primary);
  gap: 0.5rem;
}

.btn:hover {
  background-color: var(--hover-bg);
  transform: translateY(-1px);
}

.btn:disabled {
  opacity: 0.6;
  cursor: not-allowed;
  transform: none;
}

.btn-primary {
  background: var(--accent-gold);
  color: var(--bg-primary);
  border-color: var(--accent-gold);
}

.btn-primary:hover:not(:disabled) {
  background: #b8860b;
  border-color: #b8860b;
}

.btn-ghost {
  background: transparent;
  color: var(--text-secondary);
  border-color: var(--border-color);
}

.btn-ghost:hover {
  color: var(--text-primary);
  border-color: var(--text-secondary);
}

/* Responsive Design */
@media (max-width: 768px) {
  .payment-actions {
    flex-direction: column;
  }

  .membership-plans-grid {
    grid-template-columns: 1fr;
  }

  .plan-card {
    padding: 1.5rem;
  }

  .payment-card {
    margin: 0 1rem;
  }
}
</style>
