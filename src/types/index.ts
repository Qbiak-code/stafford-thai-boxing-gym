// User and Authentication Types
export interface User {
  id: string
  email: string
  firstName: string
  lastName: string
  membershipType?: string
  joinDate: string
}

export interface LoginCredentials {
  email: string
  password: string
}

export interface SignupData extends LoginCredentials {
  firstName: string
  lastName: string
  confirmPassword: string
}

// Class and Schedule Types
export interface ClassSession {
  id: string
  title: string
  description: string
  instructor: string
  startTime: string
  endTime: string
  maxParticipants: number
  currentParticipants: number
  level: 'Beginner' | 'Intermediate' | 'Advanced' | 'All Levels'
  type: 'Muay Thai' | 'Fitness' | 'Technique' | 'Sparring'
}

export interface WeeklySchedule {
  [key: string]: ClassSession[]
}

// Subscription and Payment Types
export interface SubscriptionPlan {
  id: string
  name: string
  description: string
  price: number
  duration: number // in months
  features: string[]
  popular?: boolean
}

export interface PaymentIntent {
  clientSecret: string
  amount: number
  currency: string
}

// Contact and Inquiry Types
export interface ContactForm {
  name: string
  email: string
  phone?: string
  subject: string
  message: string
}

// Gallery Types
export interface GalleryImage {
  id: string
  url: string
  alt: string
  caption?: string
  category: 'training' | 'events' | 'facilities' | 'competitions'
}

// API Response Types
export interface ApiResponse<T> {
  success: boolean
  data: T
  message?: string
  error?: string
}

export interface PaginatedResponse<T> extends ApiResponse<T[]> {
  pagination: {
    page: number
    limit: number
    total: number
    totalPages: number
  }
}

// Navigation Types
export interface NavItem {
  title: string
  to: string
  requiresAuth?: boolean
}

// Form Validation Types
export interface ValidationError {
  field: string
  message: string
}

export interface FormState {
  isLoading: boolean
  errors: ValidationError[]
  isValid: boolean
}
