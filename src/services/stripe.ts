// src/services/stripe.ts
import { loadStripe, type Stripe } from '@stripe/stripe-js'
import { subscriptionsAPI } from '@/services/api'

class StripeService {
  private stripe: Stripe | null = null

  async initialize(): Promise<Stripe | null> {
    if (!this.stripe) {
      const publishableKey = import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY
      if (!publishableKey) {
        throw new Error('Stripe publishable key not found')
      }
      this.stripe = await loadStripe(publishableKey)
    }
    return this.stripe
  }

  async createSubscription(planId: string): Promise<void> {
    try {
      const response = await subscriptionsAPI.createCheckoutSession(planId)

      if (response.success && response.data?.url) {
        // Redirect to Stripe Checkout
        window.location.href = response.data.url
      } else {
        throw new Error(response.error || 'Failed to create checkout session')
      }
    } catch (error) {
      console.error('Stripe subscription creation failed:', error)
      throw error
    }
  }

  async getCustomerPortalUrl(): Promise<string> {
    try {
      const response = await subscriptionsAPI.getCustomerPortalUrl()

      if (response.success && response.data?.url) {
        return response.data.url
      } else {
        throw new Error(response.error || 'Failed to create customer portal session')
      }
    } catch (error) {
      console.error('Customer portal creation failed:', error)
      throw error
    }
  }

  async cancelSubscription(): Promise<void> {
    try {
      const response = await subscriptionsAPI.cancelSubscription()

      if (!response.success) {
        throw new Error(response.error || 'Failed to cancel subscription')
      }
    } catch (error) {
      console.error('Subscription cancellation failed:', error)
      throw error
    }
  }
}

export const stripeService = new StripeService()
export default stripeService
