<template>
  <div class="subscription-checkout-page content-section">
    <div class="page-hero">
      <h1 class="page-title">Choose Your Membership</h1>
    </div>

    <section class="section plans-section">
      <div v-if="authStore.isLoading" class="status-message">Loading membership plans...</div>
      <div v-if="error" class="error-message">Error: {{ error }}</div>

      <div class="membership-plans-grid" v-if="!authStore.isLoading && !error">
        <div class="plan-card" v-for="plan in membershipPlans" :key="plan.id">
          <h3>{{ plan.name }}</h3>
          <p class="price">£{{ (plan.price_monthly / 100).toFixed(2) }}/month</p>
          <div class="plan-description" v-if="plan.description">
            {{ plan.description }}
          </div>
          <ul v-if="plan.features && plan.features.length">
            <li v-for="feature in plan.features" :key="feature">{{ feature }}</li>
          </ul>
          <button
            class="btn btn-primary"
            @click="selectPlan(plan)"
            :disabled="selectedPlan?.id === plan.id"
          >
            {{ selectedPlan?.id === plan.id ? "Selected" : "Choose Plan" }}
          </button>
        </div>
      </div>
    </section>

    <section class="section payment-section" v-if="selectedPlan">
      <h2>Complete Your Payment</h2>
      <div class="selected-plan-summary">
        <h3>{{ selectedPlan.name }}</h3>
        <p>£{{ (selectedPlan.price_monthly / 100).toFixed(2) }}/month</p>
      </div>

      <div class="payment-form">
        <p>Payment integration with Stripe will be implemented here.</p>
        <p>Selected plan: {{ selectedPlan.name }}</p>
        <button class="btn btn-secondary" @click="clearSelection">Choose Different Plan</button>
      </div>
    </section>

    <div v-if="!authStore.isAuthenticated" class="auth-required">
      <p>Please log in to manage your subscription.</p>
      <router-link to="/member" class="btn btn-primary">Login</router-link>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from "vue"
import { useRouter } from "vue-router"
import { useAuthStore } from "@/stores/auth"
import { supabase } from "@/lib/supabase"

const authStore = useAuthStore()
const router = useRouter()

// State
const membershipPlans = ref<any[]>([])
const selectedPlan = ref<any>(null)
const error = ref<string | null>(null)

// Load subscription plans from Supabase
const loadMembershipPlans = async () => {
  try {
    const { data, error: plansError } = await supabase
      .from('subscription_plans')
      .select('*')
      .eq('is_active', true)
      .order('sort_order')

    if (plansError) throw plansError

    membershipPlans.value = data || []
  } catch (err: any) {
    error.value = err.message || "Failed to load membership plans"
  }
}

// Select a plan
const selectPlan = (plan: any) => {
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

.membership-plans-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 30px;
  max-width: 1200px;
  margin: 0 auto;
}

.plan-card {
  background: #2a2a2a;
  padding: 30px;
  border-radius: 10px;
  text-align: center;
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.3);
  transition: transform 0.3s;
}

.plan-card:hover {
  transform: translateY(-5px);
}

.plan-card h3 {
  color: #c9302c;
  margin-bottom: 15px;
  font-size: 1.5rem;
}

.price {
  font-size: 2rem;
  font-weight: bold;
  color: #e0e0e0;
  margin-bottom: 20px;
}

.plan-description {
  color: #bbb;
  margin-bottom: 20px;
  font-style: italic;
}

.plan-card ul {
  list-style: none;
  padding: 0;
  margin-bottom: 30px;
}

.plan-card li {
  padding: 5px 0;
  color: #e0e0e0;
}

.plan-card li:before {
  content: "✓ ";
  color: #27ae60;
  font-weight: bold;
}

.payment-section {
  max-width: 600px;
  margin: 40px auto;
  background: #2a2a2a;
  padding: 30px;
  border-radius: 10px;
}

.payment-section h2 {
  text-align: center;
  color: #c9302c;
  margin-bottom: 30px;
}

.selected-plan-summary {
  background: #333;
  padding: 20px;
  border-radius: 5px;
  margin-bottom: 30px;
  text-align: center;
}

.selected-plan-summary h3 {
  color: #e0e0e0;
  margin-bottom: 10px;
}

.payment-form {
  text-align: center;
}

.auth-required {
  text-align: center;
  background: #2a2a2a;
  padding: 40px;
  border-radius: 10px;
  max-width: 500px;
  margin: 40px auto;
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
  margin: 5px;
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
  padding: 20px;
  color: #e0e0e0;
}

.error-message {
  text-align: center;
  padding: 20px;
  color: #e74c3c;
  background: rgba(231, 76, 60, 0.1);
  border: 1px solid #e74c3c;
  border-radius: 5px;
  margin: 20px auto;
  max-width: 600px;
}
</style>
