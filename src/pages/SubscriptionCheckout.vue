<template>
  <div class="subscription-checkout-page">
    <div class="container">
      <!-- Page Header -->
      <div class="page-header">
        <h1>Choose Your Membership</h1>
        <p>Select the perfect plan for your Muay Thai journey</p>
      </div>

      <!-- Loading/Error States -->
      <div v-if="isLoading" class="status-message">
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
        <button @click="loadMembershipPlans" class="btn btn-ghost btn-sm">Try again</button>
      </div>

      <!-- Processing Payment Overlay -->
      <div v-if="isProcessingPayment" class="processing-overlay">
        <div class="processing-content">
          <div class="spinner large"></div>
          <h3>Processing Payment...</h3>
          <p>Redirecting you to secure checkout</p>
        </div>
      </div>

      <!-- Membership Plans -->
      <section class="plans-section" v-if="!isLoading && !error">
        <div class="membership-plans-grid">
          <div
            class="plan-card"
            v-for="plan in membershipPlans"
            :key="plan.id"
            :class="{ processing: isProcessingPayment && selectedPlan?.id === plan.id }"
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
              :disabled="isProcessingPayment"
            >
              {{
                isProcessingPayment && selectedPlan?.id === plan.id
                  ? "Processing..."
                  : "Choose Plan"
              }}
            </button>
          </div>
        </div>

        <!-- Additional Info Section -->
        <div class="info-section">
          <div class="info-card">
            <div class="info-header">
              <h3>What's Included</h3>
            </div>
            <div class="info-content">
              <div class="info-grid">
                <div class="info-item">
                  <svg class="info-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      stroke-width="2"
                      d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                    />
                  </svg>
                  <div>
                    <h4>Secure Payment</h4>
                    <p>Powered by Stripe with bank-level security</p>
                  </div>
                </div>
                <div class="info-item">
                  <svg class="info-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      stroke-width="2"
                      d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
                    />
                  </svg>
                  <div>
                    <h4>Cancel Anytime</h4>
                    <p>No long-term contracts or cancellation fees</p>
                  </div>
                </div>
                <div class="info-item">
                  <svg class="info-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      stroke-width="2"
                      d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z"
                    />
                  </svg>
                  <div>
                    <h4>Monthly Billing</h4>
                    <p>Automatic monthly payments, manage anytime</p>
                  </div>
                </div>
                <div class="info-item">
                  <svg class="info-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      stroke-width="2"
                      d="M18.364 5.636l-3.536 3.536m0 5.656l3.536 3.536M9.172 9.172L5.636 5.636m3.536 9.192L5.636 18.364M12 2.25a9.75 9.75 0 110 19.5 9.75 9.75 0 010-19.5z"
                    />
                  </svg>
                  <div>
                    <h4>Full Access</h4>
                    <p>All gym facilities and group classes included</p>
                  </div>
                </div>
              </div>
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
import { stripeService } from "@/services/stripe"
import { useModal } from "@/composables/useModal"
import type { SubscriptionPlan } from "@/types"

const authStore = useAuthStore()
const router = useRouter()
const { alert } = useModal()

// State
const membershipPlans = ref<SubscriptionPlan[]>([])
const selectedPlan = ref<SubscriptionPlan | null>(null)
const error = ref<string | null>(null)
const isLoading = ref(false)
const isProcessingPayment = ref(false)

// Load subscription plans from Supabase
const loadMembershipPlans = async () => {
  isLoading.value = true
  error.value = null

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
  } finally {
    isLoading.value = false
  }
}

// Select a plan and start checkout
const selectPlan = async (plan: SubscriptionPlan) => {
  if (isProcessingPayment.value) return

  selectedPlan.value = plan
  await startCheckout(plan)
}

// Start Stripe checkout process
const startCheckout = async (plan: SubscriptionPlan) => {
  isProcessingPayment.value = true
  error.value = null

  try {
    await stripeService.createSubscription(plan.id)
  } catch (err) {
    const errorMessage = err instanceof Error ? err.message : "Payment failed"
    error.value = errorMessage
    await alert(errorMessage, "Payment Error")
    selectedPlan.value = null
  } finally {
    isProcessingPayment.value = false
  }
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
  position: relative;
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

/* Processing Overlay */
.processing-overlay {
  position: fixed;
  inset: 0;
  background-color: rgba(0, 0, 0, 0.8);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
}

.processing-content {
  text-align: center;
  color: white;
}

.processing-content h3 {
  font-size: 1.5rem;
  margin: 1rem 0 0.5rem;
}

.processing-content p {
  color: rgba(255, 255, 255, 0.8);
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

.spinner.large {
  width: 3rem;
  height: 3rem;
  border-width: 4px;
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
  flex-wrap: wrap;
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
  margin-bottom: 4rem;
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

.plan-card.processing {
  opacity: 0.7;
  transform: scale(0.98);
}

.plan-card::before {
  content: "";
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  height: 4px;
  background: var(--gradient-primary);
  opacity: 0;
  transition: opacity 0.3s ease;
}

.plan-card:hover::before {
  opacity: 1;
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
  position: relative;
  overflow: hidden;
}

.plan-select-btn:disabled {
  opacity: 0.7;
  cursor: not-allowed;
}

/* Info Section */
.info-section {
  margin-top: 4rem;
}

.info-card {
  background-color: var(--bg-secondary);
  border: 1px solid var(--border-color);
  border-radius: 1rem;
  overflow: hidden;
}

.info-header {
  background-color: var(--bg-tertiary);
  padding: 1.5rem 2rem;
  border-bottom: 1px solid var(--border-color);
}

.info-header h3 {
  font-size: 1.5rem;
  font-weight: 700;
  color: var(--text-primary);
  margin: 0;
  text-align: center;
}

.info-content {
  padding: 2rem;
}

.info-grid {
  display: grid;
  grid-template-columns: 1fr;
  gap: 1.5rem;
}

@media (min-width: 768px) {
  .info-grid {
    grid-template-columns: repeat(2, 1fr);
  }
}

.info-item {
  display: flex;
  align-items: flex-start;
  gap: 1rem;
}

.info-icon {
  width: 1.5rem;
  height: 1.5rem;
  color: var(--accent-gold);
  flex-shrink: 0;
  margin-top: 0.25rem;
}

.info-item h4 {
  font-size: 1rem;
  font-weight: 600;
  color: var(--text-primary);
  margin: 0 0 0.25rem 0;
}

.info-item p {
  font-size: 0.875rem;
  color: var(--text-secondary);
  margin: 0;
  line-height: 1.4;
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

.btn-sm {
  padding: 0.5rem 1rem;
  font-size: 0.875rem;
}

/* Responsive Design */
@media (max-width: 768px) {
  .membership-plans-grid {
    grid-template-columns: 1fr;
  }

  .plan-card {
    padding: 1.5rem;
  }

  .info-content {
    padding: 1.5rem;
  }
}
</style>
