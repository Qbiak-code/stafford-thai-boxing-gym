// scripts/setup-stripe-products.js
// Run this script to create products and prices in Stripe
// First set your environment variables, then run: node scripts/setup-stripe-products.js

import Stripe from 'stripe';
import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

// Get the directory of this script
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Load environment variables from project root (one level up)
const envPath = path.join(__dirname, '..', '.env');
dotenv.config({ path: envPath });

// Check for required environment variables
if (!process.env.STRIPE_SECRET_KEY) {
  console.error('❌ STRIPE_SECRET_KEY is required. Please set it in your .env file or as an environment variable.');
  console.error(`📄 Looking for .env file at: ${envPath}`);
  process.exit(1);
}

if (!process.env.SUPABASE_URL) {
  console.error('❌ SUPABASE_URL is required. Please set it in your .env file.');
  process.exit(1);
}

if (!process.env.SERVICE_ROLE_KEY) {
  console.error('❌ SERVICE_ROLE_KEY is required. Please set it in your .env file.');
  process.exit(1);
}

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);
const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SERVICE_ROLE_KEY
);

const membershipPlans = [
  {
    name: 'Basic Membership',
    description: 'Access to all group classes and gym facilities',
    price: 4500, // £45.00 in pence
    features: [
      'Unlimited group classes',
      'Access to gym facilities',
      'Basic equipment usage',
      'Beginner-friendly instruction'
    ]
  },
  {
    name: 'Premium Membership',
    description: 'Everything in Basic plus personal training sessions',
    price: 7500, // £75.00 in pence
    features: [
      'Everything in Basic',
      '2 personal training sessions per month',
      'Advanced technique workshops',
      'Nutrition guidance',
      'Competition training access'
    ]
  },
  {
    name: 'Elite Membership',
    description: 'Comprehensive training with unlimited personal sessions',
    price: 12000, // £120.00 in pence
    features: [
      'Everything in Premium',
      'Unlimited personal training',
      'One-on-one coaching',
      'Custom training programs',
      'Priority class booking',
      'Event and seminar access'
    ]
  }
];

async function setupStripeProducts() {
  console.log('🚀 Setting up Stripe products...');
  console.log(`📄 Using .env file: ${envPath}`);
  console.log(`Using Stripe API: ${process.env.STRIPE_SECRET_KEY.substring(0, 12)}...`);

  for (const plan of membershipPlans) {
    try {
      console.log(`\n📦 Creating product: ${plan.name}`);

      // Create product in Stripe
      const product = await stripe.products.create({
        name: plan.name,
        description: plan.description,
        metadata: {
          type: 'membership',
          features: JSON.stringify(plan.features)
        }
      });

      console.log(`   ✅ Product created: ${product.id}`);

      // Create price in Stripe
      const price = await stripe.prices.create({
        product: product.id,
        unit_amount: plan.price,
        currency: 'gbp',
        recurring: {
          interval: 'month'
        },
        metadata: {
          plan_name: plan.name
        }
      });

      console.log(`   ✅ Price created: ${price.id} (£${(plan.price / 100).toFixed(2)}/month)`);

      // First, check if plan exists in Supabase
      const { data: existingPlan, error: checkError } = await supabase
        .from('subscription_plans')
        .select('id')
        .eq('name', plan.name)
        .maybeSingle();

      if (checkError) {
        console.error(`   ❌ Error checking existing plan: ${checkError.message}`);
        continue;
      }

      let supabaseResult;
      if (existingPlan) {
        // Update existing plan
        supabaseResult = await supabase
          .from('subscription_plans')
          .update({
            stripe_product_id: product.id,
            stripe_price_id: price.id,
            price_monthly: plan.price,
            features: plan.features,
            description: plan.description,
            updated_at: new Date().toISOString()
          })
          .eq('id', existingPlan.id)
          .select();
      } else {
        // Insert new plan
        supabaseResult = await supabase
          .from('subscription_plans')
          .insert({
            name: plan.name,
            description: plan.description,
            price_monthly: plan.price,
            features: plan.features,
            stripe_product_id: product.id,
            stripe_price_id: price.id,
            is_active: true,
            sort_order: membershipPlans.indexOf(plan)
          })
          .select();
      }

      const { data, error } = supabaseResult;

      if (error) {
        console.error(`   ❌ Failed to update Supabase for ${plan.name}:`, error.message);
      } else {
        console.log(`   ✅ Updated in Supabase: ${existingPlan ? 'Updated existing' : 'Created new'} plan`);
      }

    } catch (error) {
      console.error(`❌ Failed to create ${plan.name}:`, error.message);
    }
  }

  console.log('\n🎉 Stripe products setup complete!');
  console.log('\n📋 Next steps:');
  console.log('1. Check your Stripe Dashboard to verify products were created');
  console.log('2. Test the subscription flow on your website');
  console.log('3. Set up your webhook endpoint in Stripe Dashboard');
}

// Run the setup
setupStripeProducts().catch(error => {
  console.error('💥 Setup failed:', error.message);
  process.exit(1);
});
