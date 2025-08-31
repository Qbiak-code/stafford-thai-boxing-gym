-- Stafford Thai Boxing Gym Database Schema
-- Supabase PostgreSQL Schema with Row Level Security (RLS)
-- EU Region for GDPR Compliance

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- =============================================
-- PROFILES TABLE
-- Extends auth.users with additional user data
-- =============================================
CREATE TABLE profiles (
    id UUID REFERENCES auth.users(id) ON DELETE CASCADE PRIMARY KEY,
    first_name TEXT,
    last_name TEXT,
    phone TEXT,
    emergency_contact TEXT,
    membership_type TEXT DEFAULT 'Basic',
    date_of_birth DATE,
    address_line_1 TEXT,
    address_line_2 TEXT,
    city TEXT,
    postcode TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- RLS Policies for profiles
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own profile"
    ON profiles FOR SELECT
    USING (auth.uid() = id);

CREATE POLICY "Users can update own profile"
    ON profiles FOR UPDATE
    USING (auth.uid() = id);

CREATE POLICY "Users can insert own profile"
    ON profiles FOR INSERT
    WITH CHECK (auth.uid() = id);

-- =============================================
-- SUBSCRIPTION PLANS TABLE
-- Available membership tiers and pricing
-- =============================================
CREATE TABLE subscription_plans (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    name TEXT NOT NULL,
    description TEXT,
    price_monthly INTEGER NOT NULL, -- Price in pence (e.g., 4999 = £49.99)
    features TEXT[], -- Array of feature descriptions
    is_active BOOLEAN DEFAULT true,
    sort_order INTEGER DEFAULT 0,
    stripe_price_id TEXT, -- Stripe Price ID for payments
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- RLS Policies for subscription_plans
ALTER TABLE subscription_plans ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Subscription plans are viewable by everyone"
    ON subscription_plans FOR SELECT
    USING (is_active = true);

-- =============================================
-- USER SUBSCRIPTIONS TABLE
-- Active user memberships and billing
-- =============================================
CREATE TABLE user_subscriptions (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    user_id UUID REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
    plan_id UUID REFERENCES subscription_plans(id) NOT NULL,
    stripe_subscription_id TEXT UNIQUE, -- Stripe Subscription ID
    status TEXT NOT NULL DEFAULT 'active', -- active, canceled, past_due, etc.
    current_period_start TIMESTAMP WITH TIME ZONE,
    current_period_end TIMESTAMP WITH TIME ZONE,
    canceled_at TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- RLS Policies for user_subscriptions
ALTER TABLE user_subscriptions ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own subscriptions"
    ON user_subscriptions FOR SELECT
    USING (auth.uid() = user_id);

-- =============================================
-- CLASSES TABLE
-- Gym class definitions and schedules
-- =============================================
CREATE TABLE classes (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    name TEXT NOT NULL,
    description TEXT,
    instructor TEXT,
    day_of_week INTEGER NOT NULL, -- 0=Sunday, 1=Monday, ..., 6=Saturday
    start_time TIME NOT NULL,
    end_time TIME NOT NULL,
    max_capacity INTEGER DEFAULT 20,
    class_type TEXT, -- e.g., 'Muay Thai', 'Fitness', 'Beginners'
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- RLS Policies for classes
ALTER TABLE classes ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Classes are viewable by everyone"
    ON classes FOR SELECT
    USING (is_active = true);

-- =============================================
-- CLASS BOOKINGS TABLE
-- Member class reservations
-- =============================================
CREATE TABLE class_bookings (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    user_id UUID REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
    class_id UUID REFERENCES classes(id) ON DELETE CASCADE NOT NULL,
    booking_date DATE NOT NULL, -- Specific date of the class
    status TEXT DEFAULT 'confirmed', -- confirmed, cancelled, attended, no_show
    booked_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),

    -- Ensure one booking per user per class per date
    UNIQUE(user_id, class_id, booking_date)
);

-- RLS Policies for class_bookings
ALTER TABLE class_bookings ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own bookings"
    ON class_bookings FOR SELECT
    USING (auth.uid() = user_id);

CREATE POLICY "Users can create own bookings"
    ON class_bookings FOR INSERT
    WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own bookings"
    ON class_bookings FOR UPDATE
    USING (auth.uid() = user_id);

-- =============================================
-- CONTACT SUBMISSIONS TABLE
-- Contact form submissions and inquiries
-- =============================================
CREATE TABLE contact_submissions (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    name TEXT NOT NULL,
    email TEXT NOT NULL,
    phone TEXT,
    subject TEXT,
    message TEXT NOT NULL,
    is_member BOOLEAN DEFAULT false,
    status TEXT DEFAULT 'new', -- new, in_progress, resolved
    responded_at TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- RLS Policies for contact_submissions
ALTER TABLE contact_submissions ENABLE ROW LEVEL SECURITY;

-- Only authenticated users can view contact submissions they created
CREATE POLICY "Users can view own contact submissions"
    ON contact_submissions FOR SELECT
    USING (
        CASE
            WHEN auth.uid() IS NOT NULL THEN
                email = (SELECT email FROM auth.users WHERE id = auth.uid())
            ELSE false
        END
    );

-- Anyone can insert contact submissions (public contact form)
CREATE POLICY "Anyone can create contact submissions"
    ON contact_submissions FOR INSERT
    WITH CHECK (true);

-- =============================================
-- GALLERY IMAGES TABLE
-- Photo gallery management
-- =============================================
CREATE TABLE gallery_images (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    title TEXT,
    description TEXT,
    image_url TEXT NOT NULL, -- Supabase Storage URL
    thumbnail_url TEXT, -- Optimized thumbnail URL
    alt_text TEXT,
    category TEXT DEFAULT 'general', -- general, training, events, facilities
    is_featured BOOLEAN DEFAULT false,
    sort_order INTEGER DEFAULT 0,
    uploaded_by UUID REFERENCES profiles(id),
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- RLS Policies for gallery_images
ALTER TABLE gallery_images ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Gallery images are viewable by everyone"
    ON gallery_images FOR SELECT
    USING (is_active = true);

-- =============================================
-- INDEXES FOR PERFORMANCE
-- =============================================

-- Profiles indexes
CREATE INDEX idx_profiles_membership_type ON profiles(membership_type);
CREATE INDEX idx_profiles_created_at ON profiles(created_at);

-- User subscriptions indexes
CREATE INDEX idx_user_subscriptions_user_id ON user_subscriptions(user_id);
CREATE INDEX idx_user_subscriptions_status ON user_subscriptions(status);
CREATE INDEX idx_user_subscriptions_period ON user_subscriptions(current_period_end);

-- Classes indexes
CREATE INDEX idx_classes_day_time ON classes(day_of_week, start_time);
CREATE INDEX idx_classes_active ON classes(is_active);
CREATE INDEX idx_classes_type ON classes(class_type);

-- Class bookings indexes
CREATE INDEX idx_class_bookings_user_id ON class_bookings(user_id);
CREATE INDEX idx_class_bookings_class_date ON class_bookings(class_id, booking_date);
CREATE INDEX idx_class_bookings_date ON class_bookings(booking_date);

-- Gallery images indexes
CREATE INDEX idx_gallery_images_category ON gallery_images(category);
CREATE INDEX idx_gallery_images_featured ON gallery_images(is_featured);
CREATE INDEX idx_gallery_images_active ON gallery_images(is_active);

-- Contact submissions indexes
CREATE INDEX idx_contact_submissions_status ON contact_submissions(status);
CREATE INDEX idx_contact_submissions_created ON contact_submissions(created_at);

-- =============================================
-- FUNCTIONS AND TRIGGERS
-- =============================================

-- Function to automatically update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Apply updated_at triggers to relevant tables
CREATE TRIGGER update_profiles_updated_at
    BEFORE UPDATE ON profiles
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_subscription_plans_updated_at
    BEFORE UPDATE ON subscription_plans
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_user_subscriptions_updated_at
    BEFORE UPDATE ON user_subscriptions
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_classes_updated_at
    BEFORE UPDATE ON classes
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_class_bookings_updated_at
    BEFORE UPDATE ON class_bookings
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_gallery_images_updated_at
    BEFORE UPDATE ON gallery_images
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- =============================================
-- INITIAL DATA
-- =============================================

-- Insert default subscription plans
INSERT INTO subscription_plans (name, description, price_monthly, features, sort_order) VALUES
('Basic', 'Essential gym access with limited classes', 2999, '{"Gym access", "2 classes per week", "Basic equipment"}', 1),
('Standard', 'Full gym access with unlimited classes', 4999, '{"Unlimited gym access", "Unlimited classes", "All equipment", "1 personal training session"}', 2),
('Premium', 'Complete access with personal training', 7999, '{"Unlimited gym access", "Unlimited classes", "All equipment", "4 personal training sessions", "Nutrition consultation", "Priority booking"}', 3);

-- Insert sample classes
INSERT INTO classes (name, description, instructor, day_of_week, start_time, end_time, class_type) VALUES
('Beginner Muay Thai', 'Introduction to Muay Thai fundamentals', 'John Smith', 1, '18:00', '19:00', 'Muay Thai'),
('Advanced Muay Thai', 'Advanced techniques and sparring', 'Jane Doe', 1, '19:30', '20:30', 'Muay Thai'),
('Fitness Kickboxing', 'High-intensity cardio workout', 'Mike Johnson', 3, '18:00', '19:00', 'Fitness'),
('Open Mat', 'Free training and practice time', 'Various', 6, '10:00', '12:00', 'Open Training'),
('Women Only Class', 'Muay Thai class for women only', 'Sarah Wilson', 5, '18:30', '19:30', 'Muay Thai');

-- =============================================
-- STORAGE BUCKETS (for Supabase Storage)
-- =============================================

-- Create storage bucket for gallery images
INSERT INTO storage.buckets (id, name, public) VALUES ('gallery', 'gallery', true);

-- RLS policies for storage
CREATE POLICY "Gallery images are publicly accessible"
    ON storage.objects FOR SELECT
    USING (bucket_id = 'gallery');

CREATE POLICY "Authenticated users can upload gallery images"
    ON storage.objects FOR INSERT
    WITH CHECK (bucket_id = 'gallery' AND auth.role() = 'authenticated');

-- =============================================
-- VIEWS FOR COMMON QUERIES
-- =============================================

-- View for class schedule with booking counts
CREATE VIEW class_schedule_view AS
SELECT
    c.*,
    COUNT(cb.id) as current_bookings,
    (c.max_capacity - COUNT(cb.id)) as available_spots
FROM classes c
LEFT JOIN class_bookings cb ON c.id = cb.class_id
    AND cb.booking_date >= CURRENT_DATE
    AND cb.status = 'confirmed'
WHERE c.is_active = true
GROUP BY c.id, c.name, c.description, c.instructor, c.day_of_week,
         c.start_time, c.end_time, c.max_capacity, c.class_type,
         c.is_active, c.created_at, c.updated_at
ORDER BY c.day_of_week, c.start_time;

-- View for user subscription status
CREATE VIEW user_subscription_status AS
SELECT
    p.id as user_id,
    p.first_name,
    p.last_name,
    p.email,
    us.status as subscription_status,
    sp.name as plan_name,
    sp.price_monthly,
    us.current_period_end,
    CASE
        WHEN us.current_period_end > NOW() THEN true
        ELSE false
    END as is_active
FROM profiles p
LEFT JOIN user_subscriptions us ON p.id = us.user_id
LEFT JOIN subscription_plans sp ON us.plan_id = sp.id
WHERE us.status = 'active' OR us.status IS NULL;

-- Grant select permissions on views
GRANT SELECT ON class_schedule_view TO authenticated;
GRANT SELECT ON user_subscription_status TO authenticated;

-- =============================================
-- SECURITY NOTES
-- =============================================

-- 1. All tables have Row Level Security (RLS) enabled
-- 2. Users can only access their own data (profiles, bookings, subscriptions)
-- 3. Public data (classes, subscription plans, gallery) is accessible to all
-- 4. Contact submissions use email matching for user access
-- 5. Storage bucket has public read access for gallery images
-- 6. All sensitive operations require authentication
-- 7. Timestamps are in UTC with timezone awareness

-- =============================================
-- MAINTENANCE QUERIES
-- =============================================

-- Clean up old contact submissions (older than 1 year)
-- CREATE OR REPLACE FUNCTION cleanup_old_contacts()
-- RETURNS void AS $$
-- BEGIN
--     DELETE FROM contact_submissions
--     WHERE created_at < NOW() - INTERVAL '1 year'
--     AND status = 'resolved';
-- END;
-- $$ LANGUAGE plpgsql;

-- Clean up cancelled bookings (older than 30 days)
-- CREATE OR REPLACE FUNCTION cleanup_old_bookings()
-- RETURNS void AS $$
-- BEGIN
--     DELETE FROM class_bookings
--     WHERE status = 'cancelled'
--     AND booking_date < CURRENT_DATE - INTERVAL '30 days';
-- END;
-- $$ LANGUAGE plpgsql;
