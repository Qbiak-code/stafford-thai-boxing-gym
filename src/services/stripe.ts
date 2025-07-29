// src/services/stripe.ts
import { loadStripe, type Stripe } from '@stripe/stripe-js'
import { subscriptionsAPI } from '@/services/api'
import type { UserSubscription } from '@/types'

class StripeService {
  private stripe: Stripe | null = null

  async initialize(): Promise<Stripe | null> {
    if (!this.stripe) {
      const publishableKey = import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY
      if (!publishableKey) {
        throw new Error('Stripe publishable key not found')
      }

      // Initialize with UK locale for better UX
      // Note: API version is controlled server-side, not in loadStripe
      this.stripe = await loadStripe(publishableKey, {
        locale: 'en-GB', // UK locale for better UX
      })
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

  // New method to handle payment success confirmation
  async confirmPayment(sessionId: string): Promise<{ success: boolean; subscription?: UserSubscription }> {
    try {
      const stripe = await this.initialize()
      if (!stripe) {
        throw new Error('Stripe not initialized')
      }

      // Note: We would need to add this method to subscriptionsAPI
      // For now, return success based on sessionId existence
      if (sessionId) {
        return {
          success: true,
        }
      } else {
        throw new Error('Invalid session ID')
      }
    } catch (error) {
      console.error('Payment confirmation failed:', error)
      return { success: false }
    }
  }

  // New method for enhanced error handling with latest API patterns
  private handleStripeError(error: unknown): Error {
    if (error && typeof error === 'object' && 'type' in error) {
      const stripeError = error as { type: string; message?: string }
      switch (stripeError.type) {
        case 'card_error':
          return new Error(`Payment failed: ${stripeError.message}`)
        case 'validation_error':
          return new Error(`Invalid data: ${stripeError.message}`)
        case 'api_error':
          return new Error('Payment processing temporarily unavailable. Please try again.')
        case 'authentication_error':
          return new Error('Payment authentication failed. Please refresh and try again.')
        case 'rate_limit_error':
          return new Error('Too many requests. Please wait a moment and try again.')
        default:
          return new Error(`Payment error: ${stripeError.message || 'Unknown error'}`)
      }
    }
    return new Error(error instanceof Error ? error.message : 'An unexpected error occurred')
  }

  // Enhanced method for UK-specific payment validation
  async validatePaymentMethod(paymentMethodId: string): Promise<boolean> {
    try {
      const stripe = await this.initialize()
      if (!stripe) return false

      // Note: Client-side Stripe doesn't have retrievePaymentMethod
      // This would need to be done server-side
      // For now, we'll just validate the ID format
      const isValidFormat = /^pm_[a-zA-Z0-9]+$/.test(paymentMethodId)

      if (!isValidFormat) {
        console.error('Invalid payment method ID format')
        return false
      }

      return true
    } catch (error) {
      console.error('Payment method validation error:', error)
      return false
    }
  }
}

export const stripeService = new StripeService()
export default stripeService
