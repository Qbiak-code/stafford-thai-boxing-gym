import axios from 'axios'
import type {
  User,
  LoginCredentials,
  SignupData,
  ClassSession,
  SubscriptionPlan,
  ContactForm,
  ApiResponse
} from '@/types'

// Create axios instance with base configuration
const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || 'http://localhost:3001/api',
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
})

// Request interceptor to add auth token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('authToken')
    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }
    return config
  },
  (error) => {
    return Promise.reject(error)
  }
)

// Response interceptor for error handling
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Handle unauthorized access
      localStorage.removeItem('authToken')
      window.location.href = '/member'
    }
    return Promise.reject(error)
  }
)

// Authentication API
export const authAPI = {
  async login(credentials: LoginCredentials): Promise<ApiResponse<User>> {
    const response = await api.post('/auth/login', credentials)
    return response.data
  },

  async signup(signupData: SignupData): Promise<ApiResponse<User>> {
    const response = await api.post('/auth/signup', signupData)
    return response.data
  },

  async logout(): Promise<ApiResponse<null>> {
    const response = await api.post('/auth/logout')
    return response.data
  },

  async verifyToken(): Promise<ApiResponse<User>> {
    const response = await api.get('/auth/verify')
    return response.data
  },

  async refreshToken(): Promise<ApiResponse<{ token: string }>> {
    const response = await api.post('/auth/refresh')
    return response.data
  },
}

// Classes API
export const classesAPI = {
  async getSchedule(): Promise<ApiResponse<ClassSession[]>> {
    const response = await api.get('/classes/schedule')
    return response.data
  },

  async bookClass(classId: string): Promise<ApiResponse<null>> {
    const response = await api.post(`/classes/${classId}/book`)
    return response.data
  },

  async cancelBooking(classId: string): Promise<ApiResponse<null>> {
    const response = await api.delete(`/classes/${classId}/book`)
    return response.data
  },

  async getUserBookings(): Promise<ApiResponse<ClassSession[]>> {
    const response = await api.get('/classes/bookings')
    return response.data
  },
}

// Subscriptions API
export const subscriptionsAPI = {
  async getPlans(): Promise<ApiResponse<SubscriptionPlan[]>> {
    const response = await api.get('/subscriptions/plans')
    return response.data
  },

  async createPaymentIntent(planId: string): Promise<ApiResponse<{ clientSecret: string }>> {
    const response = await api.post('/subscriptions/payment-intent', { planId })
    return response.data
  },

  async confirmSubscription(paymentIntentId: string): Promise<ApiResponse<null>> {
    const response = await api.post('/subscriptions/confirm', { paymentIntentId })
    return response.data
  },

  async getUserSubscription(): Promise<ApiResponse<SubscriptionPlan | null>> {
    const response = await api.get('/subscriptions/user')
    return response.data
  },

  async cancelSubscription(): Promise<ApiResponse<null>> {
    const response = await api.delete('/subscriptions/user')
    return response.data
  },
}

// Contact API
export const contactAPI = {
  async submitForm(formData: ContactForm): Promise<ApiResponse<null>> {
    const response = await api.post('/contact', formData)
    return response.data
  },
}

// Health check
export const healthAPI = {
  async check(): Promise<ApiResponse<{ status: string }>> {
    const response = await api.get('/health')
    return response.data
  },
}

export default api
