# Credit-Based Payment System Design
## Stafford Thai Boxing Gym - Payment & Credit System Redesign

### Current System vs New System

**Current System:**
- Simple monthly subscriptions with unlimited access
- Basic binary booking system (confirmed/cancelled)
- No credit tracking or usage limits

**New System:**
- Credit-based monthly memberships with specific class allowances
- One-off payments that add credits to account
- Flexible credit consumption based on class type
- Credit balance tracking and expiry management

---

## Database Schema Changes

### 1. Enhanced Subscription Plans
```sql
-- Update subscription_plans table
ALTER TABLE subscription_plans ADD COLUMN IF NOT EXISTS plan_type VARCHAR(20) DEFAULT 'monthly' CHECK (plan_type IN ('monthly', 'one_off'));
ALTER TABLE subscription_plans ADD COLUMN IF NOT EXISTS credit_amount INTEGER DEFAULT 0;
ALTER TABLE subscription_plans ADD COLUMN IF NOT EXISTS credit_validity_days INTEGER DEFAULT 30;
ALTER TABLE subscription_plans ADD COLUMN IF NOT EXISTS allowed_class_types TEXT[] DEFAULT '{}';
ALTER TABLE subscription_plans ADD COLUMN IF NOT EXISTS restrictions JSONB DEFAULT '{}';

-- Example data structure for restrictions:
-- {
--   "beginner_classes": 8,
--   "intermediate_classes": 4,
--   "private_sessions": 1,
--   "class_types_allowed": ["beginner", "intermediate"],
--   "booking_window_days": 7
-- }
```

### 1a. Enhanced Classes for Group Private Sessions
```sql
-- Add group booking support to classes table
ALTER TABLE classes ADD COLUMN IF NOT EXISTS is_group_bookable BOOLEAN DEFAULT FALSE;
ALTER TABLE classes ADD COLUMN IF NOT EXISTS min_group_size INTEGER DEFAULT 1;
ALTER TABLE classes ADD COLUMN IF NOT EXISTS max_group_size INTEGER DEFAULT 1;
ALTER TABLE classes ADD COLUMN IF NOT EXISTS group_pricing JSONB DEFAULT '{}';
ALTER TABLE classes ADD COLUMN IF NOT EXISTS gender_restriction VARCHAR(20) DEFAULT 'none' CHECK (gender_restriction IN ('none', 'ladies_only', 'men_only'));

-- Example group_pricing structure for private classes (future-proof for scaling):
-- {
--   "1": {"credit_cost": 3, "price_pence": 3000},
--   "2": {"credit_cost": 2, "price_pence": 2000}, 
--   "3": {"credit_cost": 2, "price_pence": 1700},
--   "4": {"credit_cost": 2, "price_pence": 1500},
--   "5": {"credit_cost": 1, "price_pence": 1300}
-- }
```

### 2. User Credit System
```sql
-- Create user_credits table
CREATE TABLE user_credits (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  credit_type VARCHAR(50) NOT NULL, -- 'monthly_allowance', 'one_off_purchase', 'bonus'
  credits_total INTEGER NOT NULL DEFAULT 0,
  credits_used INTEGER NOT NULL DEFAULT 0,
  credits_remaining INTEGER GENERATED ALWAYS AS (credits_total - credits_used) STORED,
  source_type VARCHAR(20) NOT NULL CHECK (source_type IN ('subscription', 'purchase', 'bonus')),
  source_id UUID, -- References subscription or purchase
  valid_from TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  expires_at TIMESTAMP WITH TIME ZONE,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes
CREATE INDEX idx_user_credits_user_id ON user_credits(user_id);
CREATE INDEX idx_user_credits_active ON user_credits(user_id, is_active, expires_at);
CREATE INDEX idx_user_credits_expiry ON user_credits(expires_at) WHERE is_active = true;
```

### 2a. Group Bookings System
```sql
-- Create group bookings coordination table
CREATE TABLE group_bookings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  class_id UUID REFERENCES classes(id) ON DELETE CASCADE,
  booking_date DATE NOT NULL,
  start_time TIME NOT NULL,
  end_time TIME NOT NULL,
  organizer_user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  max_participants INTEGER NOT NULL,
  current_participants INTEGER DEFAULT 0,
  total_credit_cost INTEGER NOT NULL,
  status VARCHAR(20) DEFAULT 'open' CHECK (status IN ('open', 'full', 'confirmed', 'cancelled')),
  is_private_group BOOLEAN DEFAULT FALSE,
  group_code VARCHAR(10) UNIQUE, -- For joining private groups
  metadata JSONB DEFAULT '{}',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Indexes for group bookings
CREATE INDEX idx_group_bookings_class_date ON group_bookings(class_id, booking_date);
CREATE INDEX idx_group_bookings_status ON group_bookings(status, booking_date);
CREATE INDEX idx_group_bookings_code ON group_bookings(group_code) WHERE group_code IS NOT NULL;
```

### 2b. User Profile for Gender Restrictions
```sql
-- Add gender field to profiles for ladies-only class restrictions
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS gender VARCHAR(20) CHECK (gender IN ('male', 'female', 'other', 'prefer_not_to_say'));
```

### 3. Enhanced Class Booking System
```sql
-- Add credit cost to classes table
ALTER TABLE classes ADD COLUMN IF NOT EXISTS credit_cost INTEGER DEFAULT 1;
ALTER TABLE classes ADD COLUMN IF NOT EXISTS class_category VARCHAR(50) DEFAULT 'general';

-- Update class_bookings table
ALTER TABLE class_bookings ADD COLUMN IF NOT EXISTS credits_used INTEGER DEFAULT 1;
ALTER TABLE class_bookings ADD COLUMN IF NOT EXISTS credit_source_id UUID REFERENCES user_credits(id);
ALTER TABLE class_bookings ADD COLUMN IF NOT EXISTS booking_type VARCHAR(20) DEFAULT 'standard' CHECK (booking_type IN ('standard', 'waitlist', 'free'));

-- Add group booking support to class_bookings
ALTER TABLE class_bookings ADD COLUMN IF NOT EXISTS group_booking_id UUID REFERENCES group_bookings(id) ON DELETE CASCADE;
ALTER TABLE class_bookings ADD COLUMN IF NOT EXISTS is_group_organizer BOOLEAN DEFAULT FALSE;
ALTER TABLE class_bookings ADD COLUMN IF NOT EXISTS group_position INTEGER DEFAULT 1; -- 1st, 2nd, 3rd participant
```

### 4. One-off Purchases Tracking
```sql
-- Create purchases table for one-off payments
CREATE TABLE user_purchases (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  plan_id UUID REFERENCES subscription_plans(id),
  stripe_payment_intent_id VARCHAR(255),
  amount_paid INTEGER NOT NULL, -- in pence
  credits_granted INTEGER NOT NULL,
  status VARCHAR(20) DEFAULT 'pending' CHECK (status IN ('pending', 'completed', 'failed', 'refunded')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
```

---

## New Subscription Plans Structure

### Monthly Membership Plans

#### 1. Basic Membership (£45/month)
```json
{
  "name": "Basic Membership",
  "plan_type": "monthly",
  "price_monthly": 4500,
  "credit_amount": 8,
  "credit_validity_days": 30,
  "restrictions": {
    "allowed_class_types": ["beginner", "general"],
    "beginner_classes": 8,
    "booking_window_days": 7,
    "max_classes_per_week": 3
  }
}
```

#### 2. Premium Membership (£75/month)
```json
{
  "name": "Premium Membership",  
  "plan_type": "monthly",
  "price_monthly": 7500,
  "credit_amount": 12,
  "credit_validity_days": 30,
  "restrictions": {
    "allowed_class_types": ["beginner", "intermediate", "general"],
    "beginner_classes": 8,
    "intermediate_classes": 4,
    "booking_window_days": 14,
    "max_classes_per_week": 4
  }
}
```

#### 3. Elite Membership (£120/month)
```json
{
  "name": "Elite Membership",
  "plan_type": "monthly", 
  "price_monthly": 12000,
  "credit_amount": 20,
  "credit_validity_days": 30,
  "restrictions": {
    "allowed_class_types": ["beginner", "intermediate", "advanced", "private"],
    "unlimited_group_classes": true,
    "private_sessions": 2,
    "booking_window_days": 30
  }
}
```

### One-off Purchase Options

#### 1. Single Class Pass (£15)
```json
{
  "name": "Single Class Pass",
  "plan_type": "one_off",
  "price_monthly": 1500,
  "credit_amount": 1,
  "credit_validity_days": 30,
  "restrictions": {
    "allowed_class_types": ["beginner", "general"],
    "booking_window_days": 7
  }
}
```

#### 2. 5-Class Bundle (£65)
```json
{
  "name": "5-Class Bundle",
  "plan_type": "one_off", 
  "price_monthly": 6500,
  "credit_amount": 5,
  "credit_validity_days": 60,
  "restrictions": {
    "allowed_class_types": ["beginner", "intermediate", "general"],
    "booking_window_days": 14
  }
}
```

#### 3. Private Session Credits (Group Pricing - Scalable)
```json
{
  "name": "Private 1-on-1 Session",
  "plan_type": "one_off",
  "price_monthly": 3000,
  "credit_amount": 3,
  "credit_validity_days": 90,
  "restrictions": {
    "allowed_class_types": ["private"],
    "group_size": 1,
    "booking_window_days": 30
  }
},
{
  "name": "Private 2-Person Group Session (Per Person)",
  "plan_type": "one_off", 
  "price_monthly": 2000,
  "credit_amount": 2,
  "credit_validity_days": 90,
  "restrictions": {
    "allowed_class_types": ["private"],
    "group_size": 2,
    "requires_group_formation": true,
    "booking_window_days": 30
  }
},
{
  "name": "Private 3-Person Group Session (Per Person)",
  "plan_type": "one_off",
  "price_monthly": 1700,
  "credit_amount": 2,
  "credit_validity_days": 90,
  "restrictions": {
    "allowed_class_types": ["private"],
    "group_size": 3,
    "requires_group_formation": true,
    "booking_window_days": 30
  }
},
{
  "name": "Private Large Group Session (4+ People)",
  "plan_type": "one_off",
  "price_monthly": 1500,
  "credit_amount": 2,
  "credit_validity_days": 90,
  "restrictions": {
    "allowed_class_types": ["private"],
    "group_size_min": 4,
    "group_size_max": 10,
    "requires_group_formation": true,
    "booking_window_days": 30,
    "custom_pricing": true
  }
}
```
```

---

## Class Credit Costs

### Group Classes
- **Beginner Classes**: 1 credit (open to all)
- **Intermediate Classes**: 1 credit (open to all)
- **Advanced Classes**: 2 credits (open to all)
- **Ladies Classes**: 1 credit (**ladies only** - men cannot book, ladies can book any class)

### Private Sessions (Group Pricing - Scalable)
- **1-on-1 Private**: 3 credits (£30)
- **2-Person Private Group**: 2 credits per person (£20 each, £40 total)
- **3-Person Private Group**: 2 credits per person (£17 each, £51 total)
- **Future Scaling**: System designed to support groups of 4, 5, or more with flexible pricing

**Group Size Scaling Examples:**
- **4-Person Group**: 2 credits per person (£15 each, £60 total)
- **5-Person Group**: 1 credit per person (£13 each, £65 total)
- **6+ Person Groups**: Custom pricing via group_pricing JSONB field

**How Group Private Sessions Work:**
1. **Organizer creates group session** specifying group size (1-10+ people, configurable)
2. **Each person pays the group rate** based on total group size
3. **Friends join using group code** (for private groups)
4. **Session confirmed** when group reaches specified size
5. **Credits deducted immediately** when each person joins

**Gender Restrictions:**
- **Ladies Classes**: Automatically restrict male users from booking
- **All Other Classes**: Open to all genders
- **Ladies can book any class type** (no restrictions for female users)

---

## Implementation Plan

### Phase 1: Database Migration
1. **Run migration scripts** to add new columns and tables
2. **Migrate existing subscriptions** to credit-based system
3. **Set up RLS policies** for new tables
4. **Create database functions** for credit management

### Phase 2: Backend API Updates

#### New API Endpoints
```typescript
// Credit management
GET /api/credits/balance
GET /api/credits/history  
POST /api/credits/purchase

// Enhanced booking
POST /api/bookings/create - now checks credits
GET /api/bookings/available - shows credit requirements
DELETE /api/bookings/:id - refunds credits if applicable

// Group private sessions
POST /api/group-bookings/create - create group private session
POST /api/group-bookings/:id/join - join existing group
GET /api/group-bookings/available - find joinable groups
DELETE /api/group-bookings/:id/leave - leave group session

// New purchase flow
POST /api/purchases/create-checkout
POST /api/purchases/webhook - handle one-off payments
```

#### Updated Services
```typescript
// Credit service
class CreditService {
  async getUserCreditBalance(userId: string): Promise<CreditBalance>
  async deductCredits(userId: string, amount: number, bookingId: string): Promise<boolean>
  async refundCredits(userId: string, bookingId: string): Promise<boolean>
  async grantCredits(userId: string, credits: CreditGrant): Promise<boolean>
  async expireCredits(): Promise<void> // Cron job
}

// Enhanced booking service  
class BookingService {
  async checkCreditRequirement(classId: string, userId: string): Promise<BookingEligibility>
  async createBookingWithCredits(booking: BookingRequest): Promise<BookingResult>
  async validateGenderRestriction(classId: string, userId: string): Promise<boolean>
}

// Group booking service
class GroupBookingService {
  async createGroupSession(request: GroupSessionRequest): Promise<GroupBooking>
  async joinGroupSession(userId: string, groupId: string, code?: string): Promise<boolean>
  async getAvailableGroups(classType: string, date?: string): Promise<GroupBooking[]>
  async leaveGroupSession(userId: string, groupId: string): Promise<boolean>
  async validateGroupSize(classId: string, groupSize: number): Promise<boolean>
}
```

### Phase 3: Frontend Updates

#### New Components
- **CreditBalance.vue** - Shows current credits and expiry
- **CreditHistory.vue** - Credit usage history
- **PurchaseCredits.vue** - One-off credit purchase flow
- **BookingModal.vue** - Enhanced with credit costs
- **GroupBookingModal.vue** - Create/join group private sessions
- **GroupSessionCard.vue** - Display available group sessions

#### Updated Pages
- **MemberDashboard.vue** - Add credit balance display
- **ClassTimetable.vue** - Show credit costs per class
- **SubscriptionCheckout.vue** - Support both monthly and one-off

### Phase 4: Stripe Integration Updates

#### Enhanced Webhook Handling
```typescript
// Handle both subscriptions and one-off payments
switch (event.type) {
  case 'checkout.session.completed':
    // Check if subscription or one-off purchase
    if (session.mode === 'subscription') {
      await handleSubscriptionCredits(session)
    } else {
      await handleOneOffPurchase(session)  
    }
    break
    
  case 'payment_intent.succeeded':
    await handleOneOffPaymentSuccess(paymentIntent)
    break
}
```

---

## Credit Management Rules

### Credit Allocation
- **Monthly subscriptions**: Credits granted on subscription start/renewal
- **One-off purchases**: Credits granted immediately on payment success
- **Bonus credits**: Manual allocation by admin

### Credit Expiry
- **Monthly allowances**: Expire at end of billing period
- **Purchased credits**: Expire based on plan validity days
- **Unused credits**: No rollover for monthly plans
- **Grace period**: 7 days notification before expiry

### Credit Usage Priority
1. **Expiring soonest first** (FIFO)
2. **Purchased credits before monthly allowance**
3. **Bonus credits last**

### Refund Policy
- **Class cancellation**: Full credit refund if >24h notice
- **Late cancellation**: 50% credit refund
- **No-show**: No refund
- **Gym cancellation**: Full credit refund + bonus credit

---

## User Experience Flow

### Monthly Subscriber Journey
1. **Purchase subscription** → Credits allocated for period
2. **View credit balance** in dashboard
3. **Book classes** → Credit cost shown upfront
4. **Receive confirmation** → Credits deducted
5. **Cancellation** → Credits refunded per policy
6. **Renewal** → New credits allocated

### One-off Purchase Journey  
1. **Browse classes** → See credit requirements
2. **Purchase credits** → One-off payment flow
3. **Credits added** to account immediately
4. **Book classes** using available credits
5. **Top up** credits as needed

### Admin Management
- **Monitor credit usage** patterns
- **Issue bonus credits** for service issues
- **Manage expired credits** cleanup
- **View purchase analytics**

---

## Migration Strategy

### Existing User Migration
```sql
-- Grant credits to existing active subscribers
INSERT INTO user_credits (
  user_id, 
  credit_type,
  credits_total,
  source_type, 
  source_id,
  expires_at
) 
SELECT 
  us.user_id,
  'monthly_allowance',
  CASE 
    WHEN sp.name ILIKE '%basic%' THEN 8
    WHEN sp.name ILIKE '%premium%' THEN 12  
    WHEN sp.name ILIKE '%elite%' THEN 20
    ELSE 8
  END,
  'subscription',
  us.id,
  us.current_period_end
FROM user_subscriptions us
JOIN subscription_plans sp ON us.plan_id = sp.id  
WHERE us.status = 'active';
```

### Gradual Rollout
1. **Phase 1**: Deploy with feature flag disabled
2. **Phase 2**: Enable for new users only
3. **Phase 3**: Migrate existing users in batches
4. **Phase 4**: Full rollout with monitoring

---

## Monitoring & Analytics

### Key Metrics
- **Credit utilization rates** per plan
- **Purchase conversion rates** 
- **Class booking patterns**
- **Credit expiry waste**
- **Revenue per credit**

### Alerts
- **High credit expiry rates**
- **Low credit utilization** 
- **Payment failures**
- **Unusual booking patterns**

---

## Technical Context & Current System

### Current Tech Stack
- **Frontend**: Vue 3 + TypeScript + Vite + Tailwind CSS v4
- **State Management**: Pinia
- **Authentication**: Supabase Auth
- **Database**: Supabase PostgreSQL (EU region)
- **Payments**: Stripe UK
- **Hosting**: Cloudflare Pages

### Current Database Schema (Key Tables)
```sql
-- Current tables that need modification
subscription_plans (
  id, name, description, price_monthly, features, is_active, sort_order, 
  stripe_product_id, stripe_price_id, created_at, updated_at
)

user_subscriptions (
  id, user_id, plan_id, status, stripe_subscription_id, stripe_customer_id,
  current_period_start, current_period_end, created_at, updated_at
)

classes (
  id, name, instructor, day_of_week, start_time, end_time, max_capacity,
  description, class_type, difficulty_level, is_active, created_at
)

class_bookings (
  id, user_id, class_id, booking_date, status, created_at, updated_at
)

profiles (
  id, first_name, last_name, phone, emergency_contact, membership_type,
  stripe_customer_id, created_at, updated_at
)
```

### Current API Structure
- **Location**: `src/services/api.ts`
- **Key Services**: classesAPI, subscriptionsAPI, profileAPI
- **Auth Store**: `src/stores/auth.ts` (Pinia)
- **Types**: `src/types/index.ts`

### Current Stripe Integration
- **Edge Functions**: 
  - `supabase/functions/create-checkout-session/index.ts`
  - `supabase/functions/customer-portal/index.ts`
  - `supabase/functions/stripe-webhook/index.ts`
- **Service**: `src/services/stripe.ts`

---

## Complete Database Migration Scripts

### 1. Add New Columns to Existing Tables
```sql
-- subscription_plans modifications
ALTER TABLE subscription_plans 
ADD COLUMN IF NOT EXISTS plan_type VARCHAR(20) DEFAULT 'monthly' 
  CHECK (plan_type IN ('monthly', 'one_off')),
ADD COLUMN IF NOT EXISTS credit_amount INTEGER DEFAULT 0,
ADD COLUMN IF NOT EXISTS credit_validity_days INTEGER DEFAULT 30,
ADD COLUMN IF NOT EXISTS allowed_class_types TEXT[] DEFAULT '{}',
ADD COLUMN IF NOT EXISTS restrictions JSONB DEFAULT '{}';

-- classes modifications  
ALTER TABLE classes 
ADD COLUMN IF NOT EXISTS credit_cost INTEGER DEFAULT 1,
ADD COLUMN IF NOT EXISTS class_category VARCHAR(50) DEFAULT 'general';

-- class_bookings modifications
ALTER TABLE class_bookings 
ADD COLUMN IF NOT EXISTS credits_used INTEGER DEFAULT 1,
ADD COLUMN IF NOT EXISTS credit_source_id UUID,
ADD COLUMN IF NOT EXISTS booking_type VARCHAR(20) DEFAULT 'standard' 
  CHECK (booking_type IN ('standard', 'waitlist', 'free'));

-- profiles modifications
ALTER TABLE profiles 
ADD COLUMN IF NOT EXISTS credit_balance INTEGER DEFAULT 0,
ADD COLUMN IF NOT EXISTS last_credit_check TIMESTAMP WITH TIME ZONE DEFAULT NOW();
```

### 2. Create New Tables
```sql
-- User credits tracking
CREATE TABLE user_credits (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  credit_type VARCHAR(50) NOT NULL, 
  credits_total INTEGER NOT NULL DEFAULT 0,
  credits_used INTEGER NOT NULL DEFAULT 0,
  credits_remaining INTEGER GENERATED ALWAYS AS (credits_total - credits_used) STORED,
  source_type VARCHAR(20) NOT NULL CHECK (source_type IN ('subscription', 'purchase', 'bonus')),
  source_id UUID,
  valid_from TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  expires_at TIMESTAMP WITH TIME ZONE,
  is_active BOOLEAN DEFAULT true,
  metadata JSONB DEFAULT '{}',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- One-off purchases
CREATE TABLE user_purchases (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  plan_id UUID REFERENCES subscription_plans(id),
  stripe_payment_intent_id VARCHAR(255) UNIQUE,
  stripe_checkout_session_id VARCHAR(255) UNIQUE,
  amount_paid INTEGER NOT NULL,
  credits_granted INTEGER NOT NULL,
  status VARCHAR(20) DEFAULT 'pending' 
    CHECK (status IN ('pending', 'completed', 'failed', 'refunded')),
  completed_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Credit transaction log
CREATE TABLE credit_transactions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  credit_id UUID REFERENCES user_credits(id) ON DELETE CASCADE,
  transaction_type VARCHAR(20) NOT NULL 
    CHECK (transaction_type IN ('debit', 'credit', 'refund', 'expire')),
  amount INTEGER NOT NULL,
  booking_id UUID REFERENCES class_bookings(id),
  description TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Indexes for performance
CREATE INDEX idx_user_credits_user_id ON user_credits(user_id);
CREATE INDEX idx_user_credits_active ON user_credits(user_id, is_active, expires_at);
CREATE INDEX idx_user_credits_expiry ON user_credits(expires_at) WHERE is_active = true;
CREATE INDEX idx_user_purchases_user_id ON user_purchases(user_id);
CREATE INDEX idx_user_purchases_stripe ON user_purchases(stripe_payment_intent_id, stripe_checkout_session_id);
CREATE INDEX idx_credit_transactions_user_id ON credit_transactions(user_id);
CREATE INDEX idx_credit_transactions_credit_id ON credit_transactions(credit_id);
```

### 3. RLS Policies
```sql
-- user_credits policies
ALTER TABLE user_credits ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can view own credits" ON user_credits FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Service role can manage credits" ON user_credits FOR ALL USING (auth.role() = 'service_role');

-- user_purchases policies  
ALTER TABLE user_purchases ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can view own purchases" ON user_purchases FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Service role can manage purchases" ON user_purchases FOR ALL USING (auth.role() = 'service_role');

-- credit_transactions policies
ALTER TABLE credit_transactions ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can view own transactions" ON credit_transactions FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Service role can manage transactions" ON credit_transactions FOR ALL USING (auth.role() = 'service_role');
```

### 4. Database Functions
```sql
-- Function to deduct credits and create transaction
CREATE OR REPLACE FUNCTION deduct_user_credits(
  p_user_id UUID,
  p_amount INTEGER,
  p_booking_id UUID DEFAULT NULL,
  p_description TEXT DEFAULT NULL
) RETURNS BOOLEAN AS $
DECLARE
  credit_record RECORD;
  remaining_to_deduct INTEGER := p_amount;
  deducted_amount INTEGER;
BEGIN
  -- Get active credits ordered by expiry (FIFO)
  FOR credit_record IN 
    SELECT * FROM user_credits 
    WHERE user_id = p_user_id 
      AND is_active = true 
      AND credits_remaining > 0
      AND (expires_at IS NULL OR expires_at > NOW())
    ORDER BY expires_at ASC NULLS LAST, created_at ASC
  LOOP
    IF remaining_to_deduct <= 0 THEN EXIT; END IF;
    
    deducted_amount := LEAST(credit_record.credits_remaining, remaining_to_deduct);
    
    -- Update credits used
    UPDATE user_credits 
    SET credits_used = credits_used + deducted_amount,
        updated_at = NOW()
    WHERE id = credit_record.id;
    
    -- Create transaction record
    INSERT INTO credit_transactions (
      user_id, credit_id, transaction_type, amount, booking_id, description
    ) VALUES (
      p_user_id, credit_record.id, 'debit', deducted_amount, p_booking_id, p_description
    );
    
    remaining_to_deduct := remaining_to_deduct - deducted_amount;
  END LOOP;
  
  RETURN remaining_to_deduct = 0;
END;
$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to get user credit balance
CREATE OR REPLACE FUNCTION get_user_credit_balance(p_user_id UUID)
RETURNS TABLE (
  total_credits INTEGER,
  expiring_soon INTEGER,
  expires_next DATE
) AS $
BEGIN
  RETURN QUERY
  SELECT 
    COALESCE(SUM(credits_remaining), 0)::INTEGER as total_credits,
    COALESCE(SUM(CASE WHEN expires_at <= NOW() + INTERVAL '7 days' THEN credits_remaining ELSE 0 END), 0)::INTEGER as expiring_soon,
    MIN(expires_at::DATE) as expires_next
  FROM user_credits
  WHERE user_id = p_user_id 
    AND is_active = true 
    AND credits_remaining > 0
    AND (expires_at IS NULL OR expires_at > NOW());
END;
$ LANGUAGE plpgsql SECURITY DEFINER;
```

---

## Updated TypeScript Types

### New Types to Add to `src/types/index.ts`
```typescript
// Credit system types
export interface UserCredit {
  id: string
  user_id: string
  credit_type: string
  credits_total: number
  credits_used: number
  credits_remaining: number
  source_type: 'subscription' | 'purchase' | 'bonus'
  source_id: string | null
  valid_from: string
  expires_at: string | null
  is_active: boolean
  metadata: Record<string, any>
  created_at: string
  updated_at: string
}

export interface CreditBalance {
  total_credits: number
  expiring_soon: number
  expires_next: string | null
  breakdown: {
    subscription: number
    purchased: number
    bonus: number
  }
}

export interface UserPurchase {
  id: string
  user_id: string
  plan_id: string
  stripe_payment_intent_id: string | null
  stripe_checkout_session_id: string | null
  amount_paid: number
  credits_granted: number
  status: 'pending' | 'completed' | 'failed' | 'refunded'
  completed_at: string | null
  created_at: string
  updated_at: string
  plan?: SubscriptionPlan
}

export interface CreditTransaction {
  id: string
  user_id: string
  credit_id: string
  transaction_type: 'debit' | 'credit' | 'refund' | 'expire'
  amount: number
  booking_id: string | null
  description: string | null
  created_at: string
}

// Enhanced existing types
export interface EnhancedSubscriptionPlan extends SubscriptionPlan {
  plan_type: 'monthly' | 'one_off'
  credit_amount: number
  credit_validity_days: number
  allowed_class_types: string[]
  restrictions: {
    beginner_classes?: number
    intermediate_classes?: number
    advanced_classes?: number
    private_sessions?: number
    class_types_allowed?: string[]
    booking_window_days?: number
    max_classes_per_week?: number
    unlimited_group_classes?: boolean
    group_size?: number
    requires_group_formation?: boolean
  }
}

export interface EnhancedClassSession extends ClassSession {
  credit_cost: number
  class_category: string
  is_group_bookable: boolean
  min_group_size: number
  max_group_size: number
  group_pricing: {
    [key: string]: {
      credit_cost: number
      price_pence: number
    }
  }
}

export interface EnhancedClassBooking extends ClassBooking {
  credits_used: number
  credit_source_id: string | null
  booking_type: 'standard' | 'waitlist' | 'free'
  group_booking_id: string | null
  is_group_organizer: boolean
  group_position: number
}

// New group booking types
export interface GroupBooking {
  id: string
  class_id: string
  booking_date: string
  start_time: string
  end_time: string
  organizer_user_id: string
  max_participants: number
  current_participants: number
  total_credit_cost: number
  status: 'open' | 'full' | 'confirmed' | 'cancelled'
  is_private_group: boolean
  group_code: string | null
  metadata: {
    per_person_credits: number
    group_size: number
    pricing: any
  }
  created_at: string
  updated_at: string
  class?: EnhancedClassSession
  organizer?: any
  participants?: EnhancedClassBooking[]
}

export interface GroupSessionRequest {
  classId: string
  bookingDate: string
  groupSize: number
  isPrivateGroup: boolean
}

export interface GroupJoinRequest {
  groupBookingId: string
  groupCode?: string
}

// New request/response types
export interface BookingEligibility {
  canBook: boolean
  creditCost: number
  availableCredits: number
  restrictions: string[]
  errors: string[]
}

export interface CreditPurchaseRequest {
  planId: string
  returnUrl?: string
}

export interface CreditGrantRequest {
  userId: string
  credits: number
  validityDays: number
  source: 'bonus' | 'compensation' | 'manual'
  description?: string
}
```

---

## Implementation Checklist

### Phase 1: Database & Backend Foundation
- [X] **1.1** Run database migration scripts (tables, columns, indexes)
- [x] **1.2** Set up RLS policies for new tables
- [x] **1.3** Create and test database functions (deduct_credits, get_balance)
- [x] **1.4** Update existing sample data with credit information
- [ ] **1.5** Create database backup before migration

### Phase 2: API Services Update
- [ ] **2.1** Update `src/types/index.ts` with new types
- [ ] **2.2** Create `src/services/credits.ts` service
  - [ ] `getUserCreditBalance(userId: string)`
  - [ ] `getCreditHistory(userId: string)`
  - [ ] `deductCredits(userId: string, amount: number, bookingId: string)`
  - [ ] `refundCredits(bookingId: string)`
  - [ ] `grantCredits(grantRequest: CreditGrantRequest)`
- [ ] **2.3** Update `src/services/api.ts` 
  - [ ] Enhance `classesAPI.bookClass()` to check/deduct credits
  - [ ] Add `classesAPI.checkBookingEligibility()` (includes gender restrictions)
  - [ ] Update `subscriptionsAPI.getPlans()` for plan types
  - [ ] Add `purchasesAPI` for one-off payments
  - [ ] Add gender restriction validation for ladies-only classes
- [ ] **2.4** Create `src/services/purchases.ts`
  - [ ] `createPurchaseCheckout(request: CreditPurchaseRequest)`
  - [ ] `getPurchaseHistory(userId: string)`
- [ ] **2.5** Create `src/services/groupBookings.ts`
  - [ ] `createGroupSession(request: GroupSessionRequest)`
  - [ ] `joinGroupSession(userId: string, groupId: string, code?: string)`
  - [ ] `getAvailableGroups(classType: string, date?: string)`
  - [ ] `leaveGroupSession(userId: string, groupId: string)`
  - [ ] `validateGroupSize(classId: string, groupSize: number)` (future-proof for scaling)
  - [ ] `getOptimalGroupPricing(classId: string, groupSize: number)` (dynamic pricing)

### Phase 3: Stripe Integration Updates
- [ ] **3.1** Update `supabase/functions/create-checkout-session/index.ts`
  - [ ] Support both subscription and one-off payment modes
  - [ ] Handle credit-based plan metadata
- [ ] **3.2** Create `supabase/functions/create-purchase-session/index.ts`
  - [ ] Dedicated function for one-off credit purchases
- [ ] **3.3** Update `supabase/functions/stripe-webhook/index.ts`
  - [ ] Handle `payment_intent.succeeded` for one-off purchases
  - [ ] Grant credits on successful payments
  - [ ] Create entries in `user_purchases` table
- [ ] **3.4** Update `src/services/stripe.ts`
  - [ ] Add `createCreditPurchase()` method
  - [ ] Handle both subscription and purchase flows

### Phase 4: Frontend Components
- [ ] **4.1** Create `src/components/CreditBalance.vue`
  - [ ] Display total credits, expiring soon, breakdown
  - [ ] Visual progress bars for credit usage
- [ ] **4.2** Create `src/components/CreditHistory.vue`
  - [ ] Transaction history with filtering
  - [ ] Credit source information
- [ ] **4.3** Create `src/components/PurchaseCredits.vue`
  - [ ] One-off credit purchase options
  - [ ] Integration with Stripe checkout
- [ ] **4.4** Update `src/components/Modal.vue`
  - [ ] Enhanced booking modal showing credit costs
  - [ ] Credit insufficient warnings
- [ ] **4.5** Create `src/components/GroupBookingModal.vue`
  - [ ] Create group private sessions interface
  - [ ] Join existing group sessions
  - [ ] Group code sharing functionality
- [ ] **4.6** Create `src/components/GroupSessionCard.vue`
  - [ ] Display available group sessions
  - [ ] Show participant count and pricing
  - [ ] Join/leave group actions

### Phase 5: Page Updates
- [ ] **5.1** Update `src/pages/MemberDashboard.vue`
  - [ ] Add credit balance widget
  - [ ] Credit history section
  - [ ] Quick credit purchase options
  - [ ] Update profile form to include gender field (for ladies-only class access)
- [ ] **5.2** Update `src/pages/ClassTimetable.vue`
  - [ ] Show credit cost for each class
  - [ ] Credit-based booking eligibility
  - [ ] Enhanced booking modal with credit info
  - [ ] Gender restriction warnings for ladies-only classes
  - [ ] Group private session creation/joining interface
- [ ] **5.3** Update `src/pages/SubscriptionCheckout.vue`
  - [ ] Support both monthly and one-off plans
  - [ ] Clear credit allocation information
  - [ ] Separate purchase flows
- [ ] **5.4** Create `src/pages/PurchaseCredits.vue`
  - [ ] Dedicated page for credit purchases
  - [ ] Bundle options and pricing
  - [ ] Success/failure handling

### Phase 6: Enhanced Features
- [ ] **6.1** Create `src/composables/useCredits.ts`
  - [ ] Reactive credit balance
  - [ ] Credit check functions
  - [ ] Purchase state management
- [ ] **6.2** Update `src/stores/auth.ts`
  - [ ] Include credit balance in user state
  - [ ] Credit refresh methods
- [ ] **6.3** Add credit expiry notifications
  - [ ] Email notifications (external service)
  - [ ] In-app notifications
- [ ] **6.4** Create admin credit management
  - [ ] Manual credit grants
  - [ ] Credit usage analytics
  - [ ] Expiry management

### Phase 7: Migration & Testing
- [ ] **7.1** Create migration script for existing users
  - [ ] Grant appropriate credits to current subscribers
  - [ ] Preserve existing bookings
- [ ] **7.2** Create test data and scenarios
  - [ ] Different credit scenarios
  - [ ] Expiry edge cases
  - [ ] Purchase flows
- [ ] **7.3** Set up monitoring
  - [ ] Credit balance alerts
  - [ ] Purchase failure tracking
  - [ ] Usage analytics
- [ ] **7.4** Create rollback plan
  - [ ] Database rollback scripts
  - [ ] Feature flag implementation

### Phase 8: Documentation & Deployment
- [ ] **8.1** Update API documentation
- [ ] **8.2** Create user guide for credit system
- [ ] **8.3** Update admin documentation
- [ ] **8.4** Deploy with feature flags
- [ ] **8.5** Gradual rollout plan
- [ ] **8.6** Monitor and optimize

### Critical Configuration Files to Update
- [ ] **Environment Variables**
  - Add any new Stripe webhook endpoints
  - Credit expiry notification settings
- [ ] **Database Triggers**
  - Auto-update credit balances
  - Booking validation triggers
- [ ] **Cron Jobs** (if needed)
  - Credit expiry cleanup
  - Notification sending

This comprehensive checklist ensures nothing is missed when implementing the credit-based system. Each item can be tracked and verified independently.