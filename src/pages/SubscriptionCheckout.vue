<template>
  <div class="subscription-checkout-page content-section">
    <div class="page-hero">
      <h1 class="page-title">Choose Your Membership</h1>
    </div>

    <section class="section plans-section">
      <p v-if="loadingPrices" class="status-message">Loading membership plans...</p>
      <p v-if="pricesError" class="error-message">Error loading plans: {{ pricesError }}</p>

      <div class="membership-plans-grid" v-if="!loadingPrices && !pricesError">
        <div class="plan-card" v-for="plan in membershipPlans" :key="plan.priceId">
          <h3>{{ plan.name }}</h3>
          <p class="price">{{ plan.currencySymbol }}{{ plan.amount }}/{{ plan.interval }}</p>
          <ul>
            <li v-for="feature in plan.features" :key="feature">{{ feature }}</li>
          </ul>
          <button
            class="btn btn-primary"
            @click="selectPlan(plan)"
            :disabled="selectedPlanId === plan.priceId"
          >
            {{ selectedPlanId === plan.priceId ? "Selected" : "Choose Plan" }}
          </button>
        </div>
      </div>
    </section>

    <section class="section payment-section" v-if="selectedPlanId">
      <h2>Complete Your Payment</h2>
      <p>
        You've selected: <strong>{{ selectedPlanName }}</strong> ({{ selectedPlanAmount }}/{{
          selectedPlanInterval
        }})
      </p>

      <form @submit.prevent="handleSubscription" class="payment-form">
        <!-- New: Div for Stripe Payment Element -->
        <div id="payment-element" class="form-group">
          <!-- Stripe Payment Element will inject payment form fields here -->
        </div>

        <!-- New: Div for Link Authentication Element (Optional, but often used with Payment Element) -->
        <div id="link-authentication-element" class="form-group"></div>

        <p v-if="cardError" class="error-message">{{ cardError }}</p>

        <button class="btn btn-primary" type="submit" :disabled="processing">
          {{ processing ? "Processing..." : `Pay ${selectedPlanAmount}` }}
        </button>
      </form>
      <p
        v-if="paymentStatus"
        :class="{ 'success-message': paymentSuccess, 'error-message': !paymentSuccess }"
      >
        {{ paymentStatus }}
      </p>
    </section>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, onMounted, watch } from "vue" // Import 'watch'
import { getCurrentUser, signOut, fetchUserAttributes, type AuthUser } from "aws-amplify/auth"
import { post } from "aws-amplify/api"

import { useRouter } from "vue-router"

// Stripe SDK Type Imports
import {
  loadStripe,
  type Stripe,
  type StripeElements,
  type StripePaymentElement,
  type StripeLinkAuthenticationElement,
} from "@stripe/stripe-js"

// --- Stripe.js and Elements Variables ---
let stripeInstance: Stripe | null = null
let elementsInstance: StripeElements | null = null
let paymentElementInstance: StripePaymentElement | null = null // New type
let linkAuthenticationElementInstance: StripeLinkAuthenticationElement | null = null // New type
const STRIPE_PUBLISHABLE_KEY =
  "pk_test_51RcmipR2Cb1fdyD4axtO8nmGvavQwdg6pA9dpUqe2WEQFjvRdvdqru6e1z51AoCvVxTMpkK2vzBn5n44E5FVTQhG00gUu6DvyD" // Replace

// --- Reactive State ---
interface MembershipPlan {
  priceId: string
  productId: string
  name: string
  amount: number
  currency: string
  currencySymbol: string
  interval: string
  features: string[]
}

interface SubscriptionSuccessResponse {
  message: string
  subscriptionId: string
  customerId: string
  clientSecret: string // New: Expect clientSecret from backend
}

const membershipPlans = ref<MembershipPlan[]>([])
const loadingPrices = ref(true)
const pricesError = ref<string | null>(null)

const selectedPlanId = ref<string | null>(null)
const selectedPlanName = ref<string>("")
const selectedPlanAmount = ref<string>("")
const selectedPlanInterval = ref<string>("")

const cardError = ref<string | null>(null) // Re-use for general payment element errors
const processing = ref(false)
const paymentStatus = ref<string | null>(null)
const paymentSuccess = ref(false)

const currentUser = ref<AuthUser | null>(null)
const router = useRouter()

// --- Helper Functions ---
const loadStripeScript = (): Promise<Stripe> => {
  return new Promise((resolve, reject) => {
    if (window.Stripe) {
      resolve(window.Stripe as Stripe)
      return
    }
    const script = document.createElement("script")
    script.src = "https://js.stripe.com/v3/" // Still loads the v3 library
    script.onload = () => {
      if (window.Stripe) {
        resolve(window.Stripe as Stripe)
      } else {
        reject(new Error("Stripe.js loaded but window.Stripe is not defined."))
      }
    }
    script.onerror = () => reject(new Error("Failed to load Stripe.js"))
    document.head.appendChild(script)
  })
}

// New: Function to create a Payment Intent on the backend
const createPaymentIntent = async (priceId: string): Promise<string> => {
  try {
    const authUser = await getCurrentUser()
    const apiResponse = await post({
      apiName: "memberProfile",
      path: "/create-payment-intent",
      options: {
        body: {
          priceId: priceId,
        },
      },
    }).response

    if (apiResponse.statusCode === 200) {
      const data = (await apiResponse.body.json()) as { clientSecret: string; message?: string }
      if (data.clientSecret) {
        return data.clientSecret
      } else {
        throw new Error(data.message || "Client secret not found in response.")
      }
    } else {
      const errorData: { message?: string } | null = await apiResponse.body.json()
      throw new Error(
        errorData?.message ||
          `Failed to create Payment Intent with status ${apiResponse.statusCode}.`,
      )
    }
  } catch (e: unknown) {
    if (e instanceof Error) {
      console.error("Error creating Payment Intent:", e)
      throw new Error("Failed to initiate payment. " + e.message)
    } else {
      throw new Error("Unknown error initiating payment.")
    }
  }
}

const setupStripePaymentElements = async (clientSecret: string) => {
  // Only mount if not already mounted and clientSecret is valid
  if (paymentElementInstance && elementsInstance && elementsInstance.update) {
    elementsInstance.update({ clientSecret }) // Update existing elements with new secret
    return
  }

  try {
    stripeInstance = await loadStripe(STRIPE_PUBLISHABLE_KEY)
    elementsInstance = stripeInstance.elements({ clientSecret, appearance: { theme: "dark" } }) // Use appearance for dark theme

    paymentElementInstance = elementsInstance.create("payment")
    paymentElementInstance.mount("#payment-element")

    linkAuthenticationElementInstance = elementsInstance.create("linkAuthentication")
    linkAuthenticationElementInstance.mount("#link-authentication-element")
  } catch (e: unknown) {
    if (e instanceof Error) {
      console.error("Error setting up Stripe Payment Elements:", e)
      cardError.value = "Failed to load payment form. Please try refreshing. " + e.message
    } else {
      console.error("Unknown error setting up Stripe Payment Elements:", e)
      cardError.value = "Failed to load payment form. An unknown error occurred."
    }
  }
}

const fetchMembershipPlans = async () => {
  loadingPrices.value = true
  pricesError.value = null
  try {
    membershipPlans.value = [
      {
        priceId: "price_1RcmmsR2Cb1fdyD4cHzpvfqR", // Replace with your actual Price ID
        productId: "prod_SXsXhT3Gc1aH4i", // Replace with your actual Product ID
        name: "Muay Thai Unlimited Membership",
        amount: 100.0,
        currency: "gbp",
        currencySymbol: "£",
        interval: "month",
        features: ["Unlimited Classes", "Open Gym Access", "Strength & Conditioning"],
      },
    ]
  } catch (e: unknown) {
    if (e instanceof Error) {
      console.error("Error fetching membership plans:", e)
      pricesError.value = "Failed to load membership plans. " + e.message
    } else {
      console.error("Unknown error fetching membership plans:", e)
      pricesError.value = "An unknown error occurred loading membership plans."
    }
  } finally {
    loadingPrices.value = false
  }
}

const selectPlan = async (plan: MembershipPlan) => {
  // Made async
  selectedPlanId.value = plan.priceId
  selectedPlanName.value = plan.name
  selectedPlanAmount.value = plan.currencySymbol + plan.amount.toFixed(2)
  selectedPlanInterval.value = plan.interval

  processing.value = true // Show loading while PI is created
  cardError.value = null

  try {
    const clientSecret = await createPaymentIntent(plan.priceId) // Get clientSecret from backend
    await setupStripePaymentElements(clientSecret) // Setup elements with the client secret
    document.getElementById("payment-element")?.scrollIntoView({ behavior: "smooth" })
  } catch (e: unknown) {
    if (e instanceof Error) {
      cardError.value = e.message
    } else {
      cardError.value = "Failed to initiate payment form."
    }
    selectedPlanId.value = null // Reset selection on error
  } finally {
    processing.value = false
  }
}

// --- Handle Subscription Payment (Client-side confirmation) ---
const handleSubscription = async () => {
  if (
    !selectedPlanId.value ||
    !stripeInstance ||
    !elementsInstance ||
    !paymentElementInstance ||
    !currentUser.value
  ) {
    cardError.value =
      "Please select a plan, and ensure payment form is loaded and you are logged in."
    return
  }

  processing.value = true
  cardError.value = null
  paymentStatus.value = null
  paymentSuccess.value = false

  try {
    // Confirm the payment on the client side using the Payment Element
    const { error: confirmError } = await stripeInstance.confirmPayment({
      elements: elementsInstance,
      confirmParams: {
        return_url: `${window.location.origin}/subscriptions-success`, // Redirect to a success page after payment
        // Payment method details can be automatically collected by Payment Element
      },
      redirect: "if_required", // Only redirect if required (e.g., 3D Secure)
    })

    if (confirmError) {
      cardError.value = confirmError.message || "Failed to confirm payment."
      paymentSuccess.value = false
      paymentStatus.value = null // Clear status if there's a direct error
      return
    }

    // If redirect is not required (e.g., successful card payment without 3DS)
    paymentStatus.value = "Subscription payment successful!"
    paymentSuccess.value = true
    // In a full app, you might want to fetch the subscription status from backend here
  } catch (e: unknown) {
    if (e instanceof Error) {
      console.error("Payment confirmation error:", e)
      paymentStatus.value = e.message || "Payment confirmation failed. Please try again."
    } else {
      console.error("Unknown payment confirmation error:", e)
      paymentStatus.value = "Payment confirmation failed. An unknown error occurred."
    }
    paymentSuccess.value = false
  } finally {
    processing.value = false
    setTimeout(() => (paymentStatus.value = null), 5000)
  }
}

// --- Sign Out Function (re-used) ---
const signOutUser = async () => {
  try {
    await signOut()
    router.push("/member")
  } catch (e: unknown) {
    if (e instanceof Error) {
      console.error("Error signing out:", e)
    } else {
      console.error("Unknown error signing out:", e)
    }
  }
}

// --- On Mounted Lifecycle Hook ---
onMounted(async () => {
  await fetchMembershipPlans()
  try {
    currentUser.value = await getCurrentUser()
  } catch (e: unknown) {
    console.warn("User not authenticated for subscription page:", e)
    router.push("/member")
    return
  }
  // setupStripePaymentElements is now called in selectPlan
})

// Watch for selectedPlanId changes to potentially re-mount/update elements if plan changes
watch(selectedPlanId, async (newVal, oldVal) => {
  if (newVal && newVal !== oldVal) {
    // If a new plan is selected, elements will be re-setup in selectPlan
    // Or if you change plans after initial setup, you might need to update elements
    // For now, selectPlan handles the initial setup.
  }
})
</script>

<style scoped>
/* Your existing scoped styles */
.subscription-checkout-page {
  padding: 40px 20px;
  text-align: center;
  background-color: #1a1a1a;
  min-height: calc(100vh - 150px);
}
.page-hero {
  margin-bottom: 30px;
}

.plans-section,
.payment-section {
  background-color: #2c2c2c;
  padding: 30px;
  border-radius: 8px;
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.4);
  max-width: 900px;
  margin: 30px auto;
}

.membership-plans-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
  gap: 25px;
  margin-top: 30px;
}

.plan-card {
  background-color: #1a1a1a;
  padding: 25px;
  border-radius: 8px;
  border: 1px solid #444;
  text-align: left;
  transition:
    transform 0.2s ease,
    border-color 0.2s ease;
}
.plan-card:hover {
  transform: translateY(-5px);
  border-color: #e74c3c;
}
.plan-card h3 {
  color: #e74c3c;
  font-size: 1.8rem;
  margin-bottom: 10px;
}
.plan-card .price {
  font-size: 2.2rem;
  font-weight: bold;
  color: white;
  margin-bottom: 20px;
}
.plan-card ul {
  list-style: none;
  padding: 0;
  margin-bottom: 20px;
}
.plan-card li::before {
  content: "✓";
  color: #27ae60;
  margin-right: 10px;
}
.plan-card button {
  width: 100%;
  padding: 12px;
  font-size: 1.1rem;
}

.payment-form {
  margin-top: 30px;
  max-width: 500px;
  margin-left: auto;
  margin-right: auto;
  text-align: left;
}

/* Updated styling for Payment Element container */
#payment-element,
#link-authentication-element {
  border: 1px solid #555;
  padding: 10px 12px;
  border-radius: 4px;
  background-color: #1a1a1a;
  margin-bottom: 20px;
  min-height: 40px; /* Payment Element can adjust its height */
}

/* Stripe Elements injects iframes, so direct styling of .StripeElement may not work */
/* Instead, rely on the styling passed in elementsInstance.create(..., { appearance: { theme: 'dark' } }); */

.status-message {
  color: #888;
  margin-top: 15px;
}
.success-message {
  color: #27ae60;
  margin-top: 15px;
  font-weight: bold;
}
.error-message {
  color: #e74c3c;
  margin-top: 15px;
  font-weight: bold;
}
</style>
