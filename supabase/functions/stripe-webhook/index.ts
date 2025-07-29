// supabase/functions/stripe-webhook/index.ts
import { serve } from "https://deno.land/std@0.224.0/http/server.ts"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.45.0'
import Stripe from 'https://esm.sh/stripe@17.3.0'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type, stripe-signature',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
}

console.log('🚀 WEBHOOK FUNCTION LOADING - THIS SHOULD APPEAR IN LOGS!')

serve(async (req) => {
  // Handle CORS preflight
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    console.log('🔔 Webhook received:', req.method)

    // Get environment variables
    const stripeSecretKey = Deno.env.get('STRIPE_SECRET_KEY')
    const webhookSecret = Deno.env.get('STRIPE_WEBHOOK_SECRET')
    const supabaseUrl = Deno.env.get('PROJECT_URL')
    const supabaseServiceKey = Deno.env.get('SERVICE_ROLE_KEY')

    if (!stripeSecretKey || !webhookSecret || !supabaseUrl || !supabaseServiceKey) {
      console.error('❌ Missing required environment variables')
      return new Response('Server configuration error', { status: 500, headers: corsHeaders })
    }

    // Initialize Stripe
    const stripe = new Stripe(stripeSecretKey, {
      apiVersion: '2025-06-30.basil',
      httpClient: Stripe.createFetchHttpClient(),
    })

    // Initialize Supabase
    const supabase = createClient(supabaseUrl, supabaseServiceKey, {
      auth: {
        autoRefreshToken: false,
        persistSession: false
      }
    })

    // Get Stripe signature
    const signature = req.headers.get('stripe-signature') || req.headers.get('Stripe-Signature')
    const body = await req.text()

    if (!signature) {
      console.error('❌ No Stripe signature found')
      return new Response('Missing Stripe signature', { status: 400, headers: corsHeaders })
    }

    // Verify webhook signature
    let event: Stripe.Event
    try {
      event = await stripe.webhooks.constructEventAsync(body, signature, webhookSecret)
      console.log('✅ Webhook verified, event type:', event.type)
    } catch (err) {
      console.error('❌ Webhook signature verification failed:', err.message)
      return new Response(`Webhook Error: ${err.message}`, { status: 400, headers: corsHeaders })
    }

    // Process the event
    switch (event.type) {
      case 'checkout.session.completed':
        console.log('🛒 Handling checkout.session.completed')
        await handleCheckoutCompleted(stripe, supabase, event.data.object as Stripe.Checkout.Session)
        break

      case 'customer.subscription.created':
      case 'customer.subscription.updated':
        console.log(`🔄 Handling ${event.type}`)
        await handleSubscriptionChange(stripe, supabase, event.data.object as Stripe.Subscription)
        break

      case 'customer.subscription.deleted':
        console.log('🗑️ Handling customer.subscription.deleted')
        await handleSubscriptionCancellation(supabase, event.data.object as Stripe.Subscription)
        break

      default:
        console.log(`ℹ️ Unhandled event type: ${event.type}`)
    }

    return new Response(JSON.stringify({ received: true }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      status: 200,
    })

  } catch (error) {
    console.error('💥 Webhook handler failed:', error)
    return new Response(JSON.stringify({
      error: 'Internal server error',
      details: error instanceof Error ? error.message : 'Unknown error'
    }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    })
  }
})

async function handleCheckoutCompleted(stripe: Stripe, supabase: any, session: Stripe.Checkout.Session) {
  console.log('🛒 Processing checkout session:', session.id)

  try {
    const userId = session.metadata?.supabase_user_id
    if (!userId) {
      console.error('❌ No supabase_user_id in checkout session metadata')
      return
    }

    const subscriptionId = session.subscription as string
    if (!subscriptionId) {
      console.error('❌ No subscription ID in checkout session')
      return
    }

    const subscription = await stripe.subscriptions.retrieve(subscriptionId)
    console.log('📦 Retrieved subscription:', subscription.id)

    await handleSubscriptionChange(stripe, supabase, subscription, userId)

  } catch (error) {
    console.error('💥 Error in handleCheckoutCompleted:', error)
  }
}

async function handleSubscriptionChange(stripe: Stripe, supabase: any, subscription: Stripe.Subscription, userIdOverride?: string) {
  console.log('📝 Processing subscription change:', subscription.id)

  try {
    let userId = userIdOverride
    let planId = subscription.metadata.plan_id

    // If no plan_id in subscription metadata, try to get it from the checkout session
    if (!planId) {
      console.log('🔍 No plan_id in subscription metadata, checking checkout sessions...')

      // Get all checkout sessions for this subscription
      const sessions = await stripe.checkout.sessions.list({
        subscription: subscription.id,
        limit: 1
      })

      if (sessions.data.length > 0) {
        const checkoutSession = sessions.data[0]
        planId = checkoutSession.metadata?.plan_id
        console.log('📋 Found plan_id in checkout session:', planId)

        // Also get user_id from checkout session if we don't have it
        if (!userId) {
          userId = checkoutSession.metadata?.supabase_user_id
          console.log('👤 Found user_id in checkout session:', userId)
        }
      }
    }

    if (!userId) {
      const customerId = subscription.customer as string
      const customer = await stripe.customers.retrieve(customerId)

      if (!customer || customer.deleted) {
        console.error('❌ Customer not found or deleted:', customerId)
        return
      }

      const customerEmail = (customer as Stripe.Customer).email
      if (!customerEmail) {
        console.error('❌ Customer has no email address')
        return
      }

      // CORRECT METHOD: Use listUsers and filter by email
      console.log('🔍 Looking up user by email:', customerEmail)
      const { data: usersResponse, error: userError } = await supabase.auth.admin.listUsers()

      if (userError) {
        console.error('❌ Error listing users:', userError)
        return
      }

      const user = usersResponse.users.find((u: any) => u.email === customerEmail)
      if (!user) {
        console.error('❌ No user found for email:', customerEmail)
        return
      }

      userId = user.id
      console.log('✅ Found user by email:', userId)
    }

    console.log('✅ Processing subscription for user:', userId)

    if (!planId) {
      console.error('❌ No plan_id found in subscription or checkout session metadata')
      console.log('📋 Subscription metadata:', subscription.metadata)
      return
    }

    console.log('✅ Using plan_id:', planId)

    const { data: plan, error: planError } = await supabase
      .from('subscription_plans')
      .select('id, name')
      .eq('id', planId)
      .single()

    if (planError || !plan) {
      console.error('❌ Plan not found in database:', planId, planError)
      return
    }

    console.log('✅ Plan found:', plan.name)

    // Deactivate existing subscriptions
    await supabase
      .from('user_subscriptions')
      .update({
        status: 'cancelled',
        cancelled_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      })
      .eq('user_id', userId)
      .eq('status', 'active')

    // Check if subscription already exists to prevent duplicates
    const { data: existingSubscription } = await supabase
      .from('user_subscriptions')
      .select('id')
      .eq('stripe_subscription_id', subscription.id)
      .single()

    if (existingSubscription) {
      console.log('⚠️ Subscription already exists, updating instead of creating:', subscription.id)

      // Update existing subscription instead of creating new one
      const { data: updateData, error: updateError } = await supabase
        .from('user_subscriptions')
        .update({
          status: subscription.status === 'active' ? 'active' : subscription.status,
          updated_at: new Date().toISOString()
        })
        .eq('stripe_subscription_id', subscription.id)
        .select()

      if (updateError) {
        console.error('❌ Error updating subscription:', updateError)
        return
      }

      console.log('✅ Subscription updated successfully:', updateData)
      return
    }

    // Create new subscription with enhanced date handling
    let currentPeriodStart: string
    let currentPeriodEnd: string

    try {
      // In the new Stripe API version, timestamps are in subscription.items.data[0]
      const subscriptionItem = subscription.items?.data?.[0]

      console.log('🕐 Subscription timestamps - checking both locations:', {
        root_current_period_start: subscription.current_period_start,
        root_current_period_end: subscription.current_period_end,
        item_current_period_start: subscriptionItem?.current_period_start,
        item_current_period_end: subscriptionItem?.current_period_end,
        billing_cycle_anchor: subscription.billing_cycle_anchor,
        start_date: subscription.start_date
      })

      // Try to get timestamps from subscription item first (new API structure)
      let startTimestamp = subscriptionItem?.current_period_start || subscription.current_period_start
      let endTimestamp = subscriptionItem?.current_period_end || subscription.current_period_end

      // Fallback to other timestamp fields if needed
      if (!startTimestamp) {
        startTimestamp = subscription.billing_cycle_anchor || subscription.start_date
      }

      // If we still don't have end timestamp, calculate from start + 1 month
      if (!endTimestamp && startTimestamp) {
        // Add approximately 30 days (in seconds) to start timestamp
        endTimestamp = startTimestamp + (30 * 24 * 60 * 60)
      }

      // Check if timestamps exist and are valid numbers
      if (startTimestamp && typeof startTimestamp === 'number') {
        const startDate = new Date(startTimestamp * 1000)
        if (!isNaN(startDate.getTime())) {
          currentPeriodStart = startDate.toISOString()
        } else {
          throw new Error('Invalid start date after conversion')
        }
      } else {
        throw new Error('Missing or invalid current_period_start')
      }

      if (endTimestamp && typeof endTimestamp === 'number') {
        const endDate = new Date(endTimestamp * 1000)
        if (!isNaN(endDate.getTime())) {
          currentPeriodEnd = endDate.toISOString()
        } else {
          throw new Error('Invalid end date after conversion')
        }
      } else {
        throw new Error('Missing or invalid current_period_end')
      }

      console.log('✅ Converted dates successfully:', { currentPeriodStart, currentPeriodEnd })

    } catch (dateError) {
      console.error('💥 Date conversion error:', dateError)
      console.log('📋 Available timestamp fields:', {
        billing_cycle_anchor: subscription.billing_cycle_anchor,
        start_date: subscription.start_date,
        created: subscription.created,
        items_data_length: subscription.items?.data?.length
      })

      // Enhanced fallback using available Stripe timestamps
      const now = new Date()

      // Try to use billing_cycle_anchor or created timestamp as fallback
      if (subscription.billing_cycle_anchor && typeof subscription.billing_cycle_anchor === 'number') {
        currentPeriodStart = new Date(subscription.billing_cycle_anchor * 1000).toISOString()
        // Calculate end date as 30 days from start
        const endTime = subscription.billing_cycle_anchor + (30 * 24 * 60 * 60)
        currentPeriodEnd = new Date(endTime * 1000).toISOString()
      } else if (subscription.created && typeof subscription.created === 'number') {
        currentPeriodStart = new Date(subscription.created * 1000).toISOString()
        // Calculate end date as 30 days from created
        const endTime = subscription.created + (30 * 24 * 60 * 60)
        currentPeriodEnd = new Date(endTime * 1000).toISOString()
      } else {
        // Last resort: use current time
        currentPeriodStart = now.toISOString()
        const fallbackEnd = new Date(now.getTime() + (30 * 24 * 60 * 60 * 1000))
        currentPeriodEnd = fallbackEnd.toISOString()
      }

      console.log('⚠️ Using enhanced fallback dates:', { currentPeriodStart, currentPeriodEnd })
    }

    const subscriptionData = {
      user_id: userId,
      plan_id: planId,
      stripe_subscription_id: subscription.id,
      stripe_customer_id: subscription.customer as string,
      status: subscription.status === 'active' ? 'active' : subscription.status,
      current_period_start: currentPeriodStart,
      current_period_end: currentPeriodEnd,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    }

    console.log('💾 Creating new subscription:', subscriptionData)

    const { data: insertData, error: insertError } = await supabase
      .from('user_subscriptions')
      .insert(subscriptionData)
      .select()

    if (insertError) {
      console.error('❌ Error inserting subscription:', insertError)
      return
    }

    console.log('✅ Subscription saved successfully:', insertData)

    // Update user profile
    await supabase
      .from('profiles')
      .upsert({
        id: userId,
        stripe_customer_id: subscription.customer as string,
        updated_at: new Date().toISOString()
      })

    console.log('✅ Profile updated with Stripe customer ID')

  } catch (error) {
    console.error('💥 Error in handleSubscriptionChange:', error)
  }
}

async function handleSubscriptionCancellation(supabase: any, subscription: Stripe.Subscription) {
  console.log('🗑️ Processing subscription cancellation:', subscription.id)

  try {
    const { data, error } = await supabase
      .from('user_subscriptions')
      .update({
        status: 'cancelled',
        cancelled_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      })
      .eq('stripe_subscription_id', subscription.id)
      .select()

    if (error) {
      console.error('❌ Error cancelling subscription:', error)
      return
    }

    console.log('✅ Subscription cancelled:', data)
  } catch (error) {
    console.error('💥 Error in handleSubscriptionCancellation:', error)
  }
}
