-- Stafford Thai Boxing Gym Database Schema
-- For Supabase PostgreSQL (EU region for GDPR compliance)
-- FIXED VERSION - Run this instead

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

-- Admin users table
CREATE TABLE public.admin_users (
                                    id UUID REFERENCES public.profiles(id) ON DELETE CASCADE PRIMARY KEY,
                                    role TEXT NOT NULL CHECK (role IN ('super_admin', 'admin', 'instructor', 'staff')),
                                    permissions TEXT[] DEFAULT '{}',
                                    created_by UUID REFERENCES public.profiles(id),
                                    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
                                    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Notifications table
CREATE TABLE public.notifications (
                                      id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
                                      user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
                                      type TEXT NOT NULL CHECK (type IN ('booking_confirmation', 'payment_success', 'class_cancelled', 'membership_expiry', 'event_reminder', 'general')),
                                      title TEXT NOT NULL,
                                      message TEXT NOT NULL,
                                      data JSONB DEFAULT '{}'::jsonb,
                                      read BOOLEAN DEFAULT false,
                                      read_at TIMESTAMP WITH TIME ZONE,
                                      expires_at TIMESTAMP WITH TIME ZONE,
                                      created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Audit log table
CREATE TABLE public.audit_log (
                                  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
                                  user_id UUID REFERENCES public.profiles(id),
                                  action TEXT NOT NULL,
                                  table_name TEXT,
                                  record_id UUID,
                                  old_values JSONB,
                                  new_values JSONB,
                                  ip_address INET,
                                  user_agent TEXT,
                                  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes for performance
CREATE INDEX idx_profiles_membership_type ON public.profiles(membership_type);
CREATE INDEX idx_classes_day_time ON public.classes(day_of_week, start_time) WHERE is_active = true;
CREATE INDEX idx_class_bookings_user_date ON public.class_bookings(user_id, booking_date);
CREATE INDEX idx_class_bookings_class_date ON public.class_bookings(class_id, booking_date);
CREATE INDEX idx_user_subscriptions_status ON public.user_subscriptions(status);
CREATE INDEX idx_user_subscriptions_user_active ON public.user_subscriptions(user_id) WHERE status = 'active';
CREATE INDEX idx_contact_submissions_status ON public.contact_submissions(status, created_at);
CREATE INDEX idx_gallery_images_featured ON public.gallery_images(is_featured, sort_order) WHERE is_featured = true;
CREATE INDEX idx_events_date ON public.events(event_date);
CREATE INDEX idx_notifications_user_unread ON public.notifications(user_id, read) WHERE read = false;

-- Row Level Security Policies

-- Profiles
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can view own profile" ON public.profiles FOR SELECT USING (auth.uid() = id);
CREATE POLICY "Users can update own profile" ON public.profiles FOR UPDATE USING (auth.uid() = id);
CREATE POLICY "Admins can view all profiles" ON public.profiles FOR SELECT TO authenticated USING (
                                                                        EXISTS (SELECT 1 FROM public.admin_users WHERE id = auth.uid())
                                                                        );

-- Classes
ALTER TABLE public.classes ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Anyone can view active classes" ON public.classes FOR SELECT USING (is_active = true);
CREATE POLICY "Admins can manage classes" ON public.classes FOR ALL TO authenticated USING (
  EXISTS (SELECT 1 FROM public.admin_users WHERE id = auth.uid())
);

-- Class bookings
ALTER TABLE public.class_bookings ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can view own bookings" ON public.class_bookings FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can create own bookings" ON public.class_bookings FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update own bookings" ON public.class_bookings FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Admins can view all bookings" ON public.class_bookings FOR SELECT TO authenticated USING (
                                                                              EXISTS (SELECT 1 FROM public.admin_users WHERE id = auth.uid())
                                                                              );

-- Subscription plans
ALTER TABLE public.subscription_plans ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Anyone can view active plans" ON public.subscription_plans FOR SELECT USING (is_active = true);
CREATE POLICY "Admins can manage plans" ON public.subscription_plans FOR ALL TO authenticated USING (
  EXISTS (SELECT 1 FROM public.admin_users WHERE id = auth.uid())
);

-- User subscriptions
ALTER TABLE public.user_subscriptions ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can view own subscriptions" ON public.user_subscriptions FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can update own subscriptions" ON public.user_subscriptions FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Admins can view all subscriptions" ON public.user_subscriptions FOR SELECT TO authenticated USING (
                                                                                       EXISTS (SELECT 1 FROM public.admin_users WHERE id = auth.uid())
                                                                                       );
CREATE POLICY "System can insert subscriptions" ON public.user_subscriptions FOR INSERT WITH CHECK (true);

-- Contact submissions
ALTER TABLE public.contact_submissions ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Anyone can submit contact forms" ON public.contact_submissions FOR INSERT WITH CHECK (true);
CREATE POLICY "Admins can view all submissions" ON public.contact_submissions FOR SELECT TO authenticated USING (
                                                                                             EXISTS (SELECT 1 FROM public.admin_users WHERE id = auth.uid())
                                                                                             );

-- Gallery images
ALTER TABLE public.gallery_images ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Anyone can view gallery" ON public.gallery_images FOR SELECT USING (true);
CREATE POLICY "Admins can manage gallery" ON public.gallery_images FOR ALL TO authenticated USING (
  EXISTS (SELECT 1 FROM public.admin_users WHERE id = auth.uid())
);

-- Events
ALTER TABLE public.events ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Anyone can view events" ON public.events FOR SELECT USING (true);
CREATE POLICY "Admins can manage events" ON public.events FOR ALL TO authenticated USING (
  EXISTS (SELECT 1 FROM public.admin_users WHERE id = auth.uid())
);

-- Event registrations
ALTER TABLE public.event_registrations ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can view own registrations" ON public.event_registrations FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can create own registrations" ON public.event_registrations FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update own registrations" ON public.event_registrations FOR UPDATE USING (auth.uid() = user_id);

-- Admin users
ALTER TABLE public.admin_users ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Admins can view admin users" ON public.admin_users FOR SELECT TO authenticated USING (
                                                                          EXISTS (SELECT 1 FROM public.admin_users WHERE id = auth.uid())
                                                                          );
CREATE POLICY "Super admins can manage admin users" ON public.admin_users FOR ALL TO authenticated USING (
  EXISTS (SELECT 1 FROM public.admin_users WHERE id = auth.uid() AND role = 'super_admin')
);

-- Notifications
ALTER TABLE public.notifications ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can view own notifications" ON public.notifications FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can update own notifications" ON public.notifications FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "System can create notifications" ON public.notifications FOR INSERT WITH CHECK (true);

-- Audit log (Admin only)
ALTER TABLE public.audit_log ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Admins can view audit log" ON public.audit_log FOR SELECT TO authenticated USING (
                                                                      EXISTS (SELECT 1 FROM public.admin_users WHERE id = auth.uid())
                                                                      );
CREATE POLICY "System can create audit entries" ON public.audit_log FOR INSERT WITH CHECK (true);

-- Function to check class capacity before booking
CREATE OR REPLACE FUNCTION public.check_class_capacity()
RETURNS trigger
LANGUAGE plpgsql
AS '
DECLARE
  max_cap INTEGER;
  current_bookings INTEGER;
BEGIN
  SELECT max_capacity INTO max_cap
  FROM public.classes
  WHERE id = NEW.class_id;

  SELECT COUNT(*) INTO current_bookings
  FROM public.class_bookings
  WHERE class_id = NEW.class_id
    AND booking_date = NEW.booking_date
    AND status = ''confirmed'';

  IF current_bookings >= max_cap THEN
    RAISE EXCEPTION ''Class is full. Maximum capacity: %'', max_cap;
  END IF;

  RETURN NEW;
END;
';

-- Trigger to check capacity before booking
DROP TRIGGER IF EXISTS check_class_capacity_trigger ON public.class_bookings;
CREATE TRIGGER check_class_capacity_trigger
    BEFORE INSERT OR UPDATE ON public.class_bookings
                         FOR EACH ROW
                         WHEN (NEW.status = 'confirmed')
                         EXECUTE FUNCTION public.check_class_capacity();

-- Function to update subscription status
CREATE OR REPLACE FUNCTION public.update_subscription_status()
RETURNS trigger
LANGUAGE plpgsql
AS '
BEGIN
  IF NEW.status = ''cancelled'' AND OLD.status != ''cancelled'' THEN
    NEW.cancelled_at = NOW();
    NEW.end_date = CURRENT_DATE;
  END IF;

  IF NEW.status = ''active'' AND NEW.billing_cycle = ''monthly'' THEN
    NEW.next_billing_date = NEW.start_date + INTERVAL ''1 month'';
  ELSIF NEW.status = ''active'' AND NEW.billing_cycle = ''yearly'' THEN
    NEW.next_billing_date = NEW.start_date + INTERVAL ''1 year'';
  END IF;

  NEW.updated_at = NOW();
  RETURN NEW;
END;
';

-- Trigger to update subscription status
DROP TRIGGER IF EXISTS update_subscription_status_trigger ON public.user_subscriptions;
CREATE TRIGGER update_subscription_status_trigger
    BEFORE UPDATE ON public.user_subscriptions
    FOR EACH ROW
    EXECUTE FUNCTION public.update_subscription_status();

-- Enable realtime for admin dashboards
ALTER PUBLICATION supabase_realtime ADD TABLE public.class_bookings;
ALTER PUBLICATION supabase_realtime ADD TABLE public.contact_submissions;
ALTER PUBLICATION supabase_realtime ADD TABLE public.user_subscriptions;
ALTER PUBLICATION supabase_realtime ADD TABLE public.notifications;

-- Create views for common queries
CREATE VIEW public.weekly_schedule AS
SELECT
    c.*,
    COUNT(cb.id) as current_bookings
FROM public.classes c
         LEFT JOIN public.class_bookings cb ON c.id = cb.class_id
    AND cb.booking_date >= CURRENT_DATE
    AND cb.booking_date < CURRENT_DATE + INTERVAL '7 days'
        AND cb.status = 'confirmed'
        WHERE c.is_active = true
        GROUP BY c.id
        ORDER BY c.day_of_week, c.start_time;

-- Insert default subscription plans
INSERT INTO public.subscription_plans (name, description, price_monthly, price_yearly, features, max_classes_per_month, trial_period_days) VALUES
                                                                                                                                               ('Basic Monthly', 'Perfect for beginners - 8 classes per month', 4999, NULL, '["8 classes per month", "Access to beginner classes", "Basic gym access"]', 8, 7),
                                                                                                                                               ('Premium Monthly', 'Most popular - unlimited classes', 7999, 8999, '["Unlimited classes", "All class levels", "Personal training discount", "Nutrition guidance"]', NULL, 7),
                                                                                                                                               ('Elite Monthly', 'Complete package with 1-on-1 training', 12999, 14999, '["Unlimited classes", "2 personal training sessions", "Nutrition plan", "Priority booking", "Guest passes"]', NULL, 7),
                                                                                                                                               ('Student Monthly', 'Discounted rate for students', 3999, NULL, '["8 classes per month", "Student ID required", "Basic gym access"]', 8, 7);

-- Insert sample classes
INSERT INTO public.classes (name, description, instructor, day_of_week, start_time, end_time, max_capacity, difficulty_level) VALUES
                                                                                                                                  ('Muay Thai Fundamentals', 'Learn the basics of Muay Thai including stance, basic strikes, and footwork', 'John Smith', 1, '18:00', '19:00', 15, 'Beginner'),
                                                                                                                                  ('Advanced Muay Thai', 'Advanced techniques, sparring, and fight preparation', 'Sarah Johnson', 1, '19:30', '20:30', 12, 'Advanced'),
                                                                                                                                  ('Fitness Kickboxing', 'High-energy cardio workout with Muay Thai techniques', 'Mike Wilson', 2, '18:30', '19:30', 20, 'All Levels'),
                                                                                                                                  ('Muay Thai Technique', 'Focus on proper technique and pad work', 'John Smith', 3, '18:00', '19:00', 15, 'Intermediate'),
                                                                                                                                  ('Sparring Class', 'Controlled sparring for experienced students', 'Sarah Johnson', 4, '19:00', '20:00', 10, 'Advanced'),
                                                                                                                                  ('Beginner Friendly', 'Perfect introduction to Muay Thai', 'Mike Wilson', 5, '18:00', '19:00', 20, 'Beginner'),
                                                                                                                                  ('Saturday Warriors', 'Weekend intensive training session', 'John Smith', 6, '10:00', '11:30', 15, 'Intermediate');