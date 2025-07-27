// Core Types for Stafford Thai Boxing Gym Portal

// User Authentication & Profile
export interface User {
  id: string
  email: string
  firstName: string
  lastName: string
  membershipType: string
  joinDate: string
}

export interface LoginCredentials {
  email: string
  password: string
}

export interface SignupData {
  email: string
  password: string
  firstName: string
  lastName: string
  phone?: string
  emergencyContact?: string
}

export interface UserProfile {
  id: string
  first_name: string | null
  last_name: string | null
  phone: string | null
  emergency_contact: string | null
  membership_type: string | null
  created_at: string
  updated_at: string
}

// Classes & Booking
export interface ClassSession {
  id: string
  name: string
  instructor: string | null
  day_of_week: number | null // 0-6 (Sunday-Saturday)
  start_time: string
  end_time: string
  max_capacity: number | null
  description: string | null
  is_active: boolean | null
  created_at: string
}

export interface ClassBooking {
  id: string
  user_id: string
  class_id: string
  booking_date: string
  status: 'confirmed' | 'cancelled'
  created_at: string
  class?: ClassSession // Populated via join
}

// Subscriptions & Payments
export interface SubscriptionPlan {
  id: string
  name: string
  description: string | null
  price_monthly: number // in pence (UK)
  price_yearly: number | null // in pence (UK)
  stripe_price_id: string | null
  features: Record<string, unknown> | null
  is_active: boolean | null
  vat_rate?: number // UK VAT rate (20%)
}

export interface UserSubscription {
  id: string
  user_id: string
  plan_id: string
  stripe_subscription_id: string | null
  status: 'active' | 'inactive' | 'cancelled' | 'past_due'
  start_date: string | null
  end_date: string | null
  created_at: string
  updated_at: string
  plan?: SubscriptionPlan // Populated via join
}

// Contact & Communications
export interface ContactForm {
  name: string
  email: string
  phone?: string
  subject?: string
  message: string
  consent_marketing?: boolean // GDPR consent
}

export interface ContactSubmission {
  id: string
  name: string
  email: string
  phone: string | null
  subject: string | null
  message: string
  status: 'new' | 'read' | 'replied'
  created_at: string
}

// Gallery & Media
export interface GalleryImage {
  id: string
  title: string | null
  description: string | null
  image_url: string
  thumbnail_url: string | null
  alt_text: string | null
  is_featured: boolean | null
  sort_order: number | null
  created_at: string
}

// API Response Types
export interface ApiResponse<T> {
  success: boolean
  data?: T
  message?: string
  error?: string
}

export interface PaginatedResponse<T> {
  data: T[]
  count: number
  page: number
  limit: number
  total_pages: number
}

// Stripe Payment Types
export interface PaymentIntent {
  client_secret: string
  amount: number
  currency: string
  metadata?: Record<string, string>
}

export interface StripeCustomer {
  id: string
  email: string
  name: string
  phone?: string
  address?: {
    line1: string
    line2?: string
    city: string
    postal_code: string
    country: string
  }
}

// UK-Specific Types
export interface UKAddress {
  line1: string
  line2?: string
  city: string
  county?: string
  postcode: string
  country: 'GB'
}

export interface UKPhoneNumber {
  number: string
  country_code: '+44'
  is_mobile: boolean
}

// Form Validation Types
export interface ValidationError {
  field: string
  message: string
}

export interface FormState<T> {
  data: T
  errors: ValidationError[]
  isValid: boolean
  isSubmitting: boolean
}

// Calendar & Schedule Types
export interface WeeklySchedule {
  [key: number]: ClassSession[] // Day of week (0-6) mapped to classes
}

export interface ScheduleEvent {
  id: string
  title: string
  start: Date
  end: Date
  class_id?: string
  description?: string
  instructor?: string
  max_capacity?: number
  current_bookings?: number
}

// Admin Types
export interface AdminDashboardStats {
  total_members: number
  active_subscriptions: number
  monthly_revenue: number
  popular_classes: {
    class_name: string
    booking_count: number
  }[]
  recent_signups: number
  retention_rate: number
}

export interface AdminUser {
  id: string
  email: string
  role: 'admin' | 'instructor' | 'staff'
  permissions: string[]
  created_at: string
}

// Notification Types
export interface Notification {
  id: string
  user_id: string
  type: 'booking_confirmation' | 'payment_success' | 'class_cancelled' | 'membership_expiry'
  title: string
  message: string
  read: boolean
  created_at: string
  data?: Record<string, unknown>
}

// Member Profile Extension (for dashboard profile management)
export interface MemberProfile {
  id: string
  first_name: string | null
  last_name: string | null
  phone: string | null
  emergency_contact_name: string | null
  emergency_contact_phone: string | null
  medical_conditions: string | null
  allergies: string | null
  created_at: string
  updated_at: string
}

// Export utility types
export type DeepPartial<T> = {
  [P in keyof T]?: T[P] extends object ? DeepPartial<T[P]> : T[P]
}

export type RequiredFields<T, K extends keyof T> = T & Required<Pick<T, K>>

// Database row types (for Supabase)
export type DatabaseRow<T> = T
export type DatabaseInsert<T> = Omit<T, 'id' | 'created_at' | 'updated_at'> & {
  id?: string
  created_at?: string
  updated_at?: string
}
export type DatabaseUpdate<T> = Partial<Omit<T, 'id' | 'created_at'>> & {
  updated_at?: string
}
