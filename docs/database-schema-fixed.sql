-- Stafford Thaiboxing Gym Database Schema - FIXED VERSION
-- For Supabase PostgreSQL (EU region for GDPR compliance)
-- This version fixes the infinite recursion issue in RLS policies

-- Create custom functions for common operations
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
AS '
BEGIN
  INSERT INTO public.profiles (id, first_name, last_name)
  VALUES (new.id, new.raw_user_meta_data->>''first_name'', new.raw_user_meta_data->>''last_name'');
  RETURN new;
END;
';

-- User profiles table (extends Supabase auth.users)
CREATE TABLE public.profiles (
  id UUID REFERENCES auth.users(id) ON DELETE CASCADE PRIMARY KEY,
  first_name TEXT,
  last_name TEXT,
  phone TEXT,
  emergency_contact TEXT,
  membership_type TEXT DEFAULT 'Basic' CHECK (membership_type IN ('Basic', 'Premium', 'Elite', 'Student')),
  date_of_birth DATE,
  address_line1 TEXT,
  address_line2 TEXT,
  city TEXT,
  county TEXT,
  postcode TEXT,
  country TEXT DEFAULT 'GB',
  marketing_consent BOOLEAN DEFAULT false,
  terms_accepted_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Trigger to create profile when user signs up
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
    AFTER INSERT ON auth.users
    FOR EACH ROW EXECUTE PROCEDURE public.handle_new_user();

-- Classes table
CREATE TABLE public.classes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  description TEXT,
  instructor TEXT,
  day_of_week INTEGER CHECK (day_of_week >= 0 AND day_of_week <= 6),
  start_time TIME NOT NULL,
  end_time TIME NOT NULL,
  max_capacity INTEGER DEFAULT 20 CHECK (max_capacity > 0),
  difficulty_level TEXT DEFAULT 'Beginner' CHECK (difficulty_level IN ('Beginner', 'Intermediate', 'Advanced', 'All Levels')),
  equipment_required TEXT[],
  price_per_session INTEGER DEFAULT 0,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Class bookings table
CREATE TABLE public.class_bookings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
  class_id UUID REFERENCES public.classes(id) ON DELETE CASCADE,
  booking_date DATE NOT NULL,
  status TEXT DEFAULT 'confirmed' CHECK (status IN ('confirmed', 'cancelled', 'attended', 'no_show')),
  payment_status TEXT DEFAULT 'pending' CHECK (payment_status IN ('pending', 'paid', 'refunded')),
  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(user_id, class_id, booking_date)
);

-- Subscription plans table
CREATE TABLE public.subscription_plans (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  description TEXT,
  price_monthly INTEGER NOT NULL CHECK (price_monthly > 0),
  price_yearly INTEGER CHECK (price_yearly > 0),
  stripe_price_id_monthly TEXT,
  stripe_price_id_yearly TEXT,
  features JSONB DEFAULT '[]'::jsonb,
  max_classes_per_month INTEGER,
  includes_personal_training BOOLEAN DEFAULT false,
  includes_nutrition_plan BOOLEAN DEFAULT false,
  trial_period_days INTEGER DEFAULT 7,
  setup_fee INTEGER DEFAULT 0,
  vat_rate DECIMAL(4,2) DEFAULT 20.00,
  is_active BOOLEAN DEFAULT true,
  sort_order INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- User subscriptions table
CREATE TABLE public.user_subscriptions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
  plan_id UUID REFERENCES public.subscription_plans(id),
  stripe_customer_id TEXT,
  stripe_subscription_id TEXT UNIQUE,
  status TEXT NOT NULL CHECK (status IN ('active', 'inactive', 'cancelled', 'past_due', 'trialing', 'incomplete')),
  billing_cycle TEXT DEFAULT 'monthly' CHECK (billing_cycle IN ('monthly', 'yearly')),
  start_date DATE,
  end_date DATE,
  trial_end_date DATE,
  next_billing_date DATE,
  cancelled_at TIMESTAMP WITH TIME ZONE,
  cancellation_reason TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Contact form submissions table
CREATE TABLE public.contact_submissions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  phone TEXT,
  subject TEXT,
  message TEXT NOT NULL,
  status TEXT DEFAULT 'new' CHECK (status IN ('new', 'read', 'replied', 'resolved')),
  user_agent TEXT,
  ip_address INET,
  marketing_consent BOOLEAN DEFAULT false,
  gdpr_consent BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  replied_at TIMESTAMP WITH TIME ZONE,
  replied_by UUID REFERENCES public.profiles(id)
);

-- Gallery images table
CREATE TABLE public.gallery_images (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT,
  description TEXT,
  image_url TEXT NOT NULL,
  thumbnail_url TEXT,
  alt_text TEXT NOT NULL,
  file_size INTEGER,
  mime_type TEXT,
  width INTEGER,
  height INTEGER,
  is_featured BOOLEAN DEFAULT false,
  category TEXT DEFAULT 'general' CHECK (category IN ('general', 'classes', 'events', 'facilities', 'members')),
  sort_order INTEGER DEFAULT 0,
  uploaded_by UUID REFERENCES public.profiles(id),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Events/announcements table
CREATE TABLE public.events (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  description TEXT,
  event_date DATE NOT NULL,
  start_time TIME,
  end_time TIME,
  location TEXT,
  max_participants INTEGER,
  current_participants INTEGER DEFAULT 0,
  price INTEGER DEFAULT 0,
  registration_required BOOLEAN DEFAULT false,
  registration_deadline DATE,
  is_featured BOOLEAN DEFAULT false,
  category TEXT DEFAULT 'general' CHECK (category IN ('general', 'seminar', 'competition', 'social', 'workshop')),
  created_by UUID REFERENCES public.profiles(id),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Event registrations table
CREATE TABLE public.event_registrations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  event_id UUID REFERENCES public.events(id) ON DELETE CASCADE,
  user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
  status TEXT DEFAULT 'registered' CHECK (status IN ('registered', 'cancelled', 'attended', 'no_show')),
  payment_status TEXT DEFAULT 'pending' CHECK (payment_status IN ('pending', 'paid', 'refunded')),
  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(event_id, user_id)
);

-- SIMPLIFIED Admin users table - FIXED to prevent recursion
CREATE TABLE public.admin_users (
  id UUID REFERENCES public.profiles(id) ON DELETE CASCADE PRIMARY KEY,
  role TEXT NOT NULL CHECK (role IN ('super_admin', 'admin', 'instructor', 'staff')),
  permissions TEXT[] DEFAULT '{}',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Helper function to check if user is admin (prevents recursion)
CREATE OR REPLACE FUNCTION public.is_admin(user_uuid UUID)
RETURNS BOOLEAN
LANGUAGE sql
SECURITY DEFINER
STABLE
AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.admin_users
    WHERE id = user_uuid
  );
$$;

-- ============================================================================
-- ROW LEVEL SECURITY POLICIES - FIXED VERSION
-- ============================================================================

-- Profiles
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can view own profile" ON public.profiles FOR SELECT USING (auth.uid() = id);
CREATE POLICY "Users can update own profile" ON public.profiles FOR UPDATE USING (auth.uid() = id);
CREATE POLICY "Anyone can insert profiles during signup" ON public.profiles FOR INSERT WITH CHECK (true);
-- Admin access using function (no recursion)
CREATE POLICY "Admins can view all profiles" ON public.profiles FOR SELECT TO authenticated USING (public.is_admin(auth.uid()));

-- Admin users - SIMPLIFIED policies to prevent recursion
ALTER TABLE public.admin_users ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can view own admin status" ON public.admin_users FOR SELECT USING (auth.uid() = id);
-- Only super admins can manage admin users (direct check, no function call)
CREATE POLICY "Super admins can manage admin users" ON public.admin_users FOR ALL TO authenticated USING (
  auth.uid() IN (SELECT id FROM public.admin_users WHERE role = 'super_admin')
);

-- Classes
ALTER TABLE public.classes ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Anyone can view active classes" ON public.classes FOR SELECT USING (is_active = true);
CREATE POLICY "Admins can manage classes" ON public.classes FOR ALL TO authenticated USING (public.is_admin(auth.uid()));

-- Class bookings
ALTER TABLE public.class_bookings ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can view own bookings" ON public.class_bookings FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can create own bookings" ON public.class_bookings FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update own bookings" ON public.class_bookings FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Admins can view all bookings" ON public.class_bookings FOR SELECT TO authenticated USING (public.is_admin(auth.uid()));

-- Subscription plans
ALTER TABLE public.subscription_plans ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Anyone can view active plans" ON public.subscription_plans FOR SELECT USING (is_active = true);
CREATE POLICY "Admins can manage plans" ON public.subscription_plans FOR ALL TO authenticated USING (public.is_admin(auth.uid()));

-- User subscriptions
ALTER TABLE public.user_subscriptions ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can view own subscriptions" ON public.user_subscriptions FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can update own subscriptions" ON public.user_subscriptions FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Admins can view all subscriptions" ON public.user_subscriptions FOR SELECT TO authenticated USING (public.is_admin(auth.uid()));
CREATE POLICY "System can insert subscriptions" ON public.user_subscriptions FOR INSERT WITH CHECK (true);

-- Contact submissions
ALTER TABLE public.contact_submissions ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Anyone can submit contact forms" ON public.contact_submissions FOR INSERT WITH CHECK (true);
CREATE POLICY "Admins can view all submissions" ON public.contact_submissions FOR SELECT TO authenticated USING (public.is_admin(auth.uid()));

-- Gallery images
ALTER TABLE public.gallery_images ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Anyone can view gallery" ON public.gallery_images FOR SELECT USING (true);
CREATE POLICY "Admins can manage gallery" ON public.gallery_images FOR ALL TO authenticated USING (public.is_admin(auth.uid()));

-- Events
ALTER TABLE public.events ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Anyone can view events" ON public.events FOR SELECT USING (true);
CREATE POLICY "Admins can manage events" ON public.events FOR ALL TO authenticated USING (public.is_admin(auth.uid()));

-- Event registrations
ALTER TABLE public.event_registrations ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can view own registrations" ON public.event_registrations FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can create own registrations" ON public.event_registrations FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update own registrations" ON public.event_registrations FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Admins can view all registrations" ON public.event_registrations FOR SELECT TO authenticated USING (public.is_admin(auth.uid()));

-- ============================================================================
-- INDEXES FOR PERFORMANCE
-- ============================================================================

CREATE INDEX idx_profiles_email ON public.profiles USING btree (id);
CREATE INDEX idx_class_bookings_user_id ON public.class_bookings USING btree (user_id);
CREATE INDEX idx_class_bookings_class_id ON public.class_bookings USING btree (class_id);
CREATE INDEX idx_class_bookings_date ON public.class_bookings USING btree (booking_date);
CREATE INDEX idx_user_subscriptions_user_id ON public.user_subscriptions USING btree (user_id);
CREATE INDEX idx_user_subscriptions_status ON public.user_subscriptions USING btree (status);
CREATE INDEX idx_admin_users_role ON public.admin_users USING btree (role);
CREATE INDEX idx_contact_submissions_status ON public.contact_submissions USING btree (status);
CREATE INDEX idx_events_date ON public.events USING btree (event_date);

-- ============================================================================
-- SAMPLE DATA (OPTIONAL)
-- ============================================================================

-- Insert sample subscription plans
INSERT INTO public.subscription_plans (name, description, price_monthly, features, sort_order) VALUES
('Basic', 'Access to group classes', 4999, '["Unlimited group classes", "Equipment provided", "Beginner friendly"]', 1),
('Premium', 'Group classes + personal training', 7999, '["Unlimited group classes", "1 personal training session/month", "Nutrition guidance", "Equipment provided"]', 2),
('Elite', 'Full access + unlimited personal training', 12999, '["Unlimited group classes", "Unlimited personal training", "Nutrition plan", "Equipment provided", "Priority booking"]', 3);

-- Insert sample classes
INSERT INTO public.classes (name, description, instructor, day_of_week, start_time, end_time, difficulty_level) VALUES
('Beginner Muay Thai', 'Introduction to Muay Thai fundamentals', 'John Smith', 1, '18:00', '19:00', 'Beginner'),
('Advanced Muay Thai', 'Advanced techniques and sparring', 'John Smith', 1, '19:30', '20:30', 'Advanced'),
('Fitness Kickboxing', 'High-intensity cardio workout', 'Sarah Jones', 3, '18:00', '19:00', 'All Levels'),
('Competition Training', 'Training for competitive fighters', 'John Smith', 5, '19:00', '20:30', 'Advanced');
