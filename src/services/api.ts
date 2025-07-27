import { supabase } from '@/lib/supabase'
import type {
  ClassSession,
  SubscriptionPlan,
  ContactForm,
  ApiResponse,
  ClassBooking,
  UserSubscription,
  GalleryImage,
  UserProfile
} from '@/types'

// Additional types for events
interface Event {
  id: string
  title: string
  description: string | null
  event_date: string
  start_time: string | null
  end_time: string | null
  location: string | null
  max_participants: number | null
  current_participants: number | null
  is_active: boolean | null
  created_at: string
}

// Helper function to handle errors consistently
const handleError = (error: unknown): string => {
  if (error instanceof Error) {
    return error.message
  }
  if (typeof error === 'string') {
    return error
  }
  if (error && typeof error === 'object' && 'message' in error) {
    return String(error.message)
  }
  return 'An unknown error occurred'
}

// Classes API
export const classesAPI = {
  async getSchedule(): Promise<ApiResponse<ClassSession[]>> {
    try {
      const { data, error } = await supabase
        .from('classes')
        .select('*')
        .eq('is_active', true)
        .order('day_of_week', { ascending: true })
        .order('start_time', { ascending: true })

      if (error) throw error

      return {
        success: true,
        data: data || []
      }
    } catch (error) {
      return {
        success: false,
        error: handleError(error)
      }
    }
  },

  async bookClass(classId: string, bookingDate: string): Promise<ApiResponse<null>> {
    try {
      const { error } = await supabase
        .from('class_bookings')
        .insert({
          class_id: classId,
          user_id: (await supabase.auth.getUser()).data.user?.id,
          booking_date: bookingDate,
          status: 'confirmed'
        })

      if (error) throw error

      return { success: true }
    } catch (error) {
      return {
        success: false,
        error: handleError(error)
      }
    }
  },

  async cancelBooking(bookingId: string): Promise<ApiResponse<null>> {
    try {
      const { error } = await supabase
        .from('class_bookings')
        .update({ status: 'cancelled' })
        .eq('id', bookingId)
        .eq('user_id', (await supabase.auth.getUser()).data.user?.id)

      if (error) throw error

      return { success: true }
    } catch (error) {
      return {
        success: false,
        error: handleError(error)
      }
    }
  },

  async getUserBookings(): Promise<ApiResponse<ClassBooking[]>> {
    try {
      const { data, error } = await supabase
        .from('class_bookings')
        .select(`
          *,
          class:classes(*)
        `)
        .eq('user_id', (await supabase.auth.getUser()).data.user?.id)
        .eq('status', 'confirmed')
        .gte('booking_date', new Date().toISOString().split('T')[0])
        .order('booking_date', { ascending: true })

      if (error) throw error

      return {
        success: true,
        data: data || []
      }
    } catch (error) {
      return {
        success: false,
        error: handleError(error)
      }
    }
  },

  async getWeeklySchedule(): Promise<ApiResponse<ClassSession[]>> {
    try {
      const { data, error } = await supabase
        .from('weekly_schedule')
        .select('*')

      if (error) throw error

      return {
        success: true,
        data: data || []
      }
    } catch (error) {
      return {
        success: false,
        error: handleError(error)
      }
    }
  }
}

// Subscriptions API
export const subscriptionsAPI = {
  async getPlans(): Promise<ApiResponse<SubscriptionPlan[]>> {
    try {
      const { data, error } = await supabase
        .from('subscription_plans')
        .select('*')
        .eq('is_active', true)
        .order('sort_order', { ascending: true })

      if (error) throw error

      return {
        success: true,
        data: data || []
      }
    } catch (error) {
      return {
        success: false,
        error: handleError(error)
      }
    }
  },

  async getUserSubscription(): Promise<ApiResponse<UserSubscription | null>> {
    try {
      const { data, error } = await supabase
        .from('user_subscriptions')
        .select(`
          *,
          plan:subscription_plans(*)
        `)
        .eq('user_id', (await supabase.auth.getUser()).data.user?.id)
        .eq('status', 'active')
        .single()

      if (error && error.code !== 'PGRST116') throw error // PGRST116 = not found

      return {
        success: true,
        data: data || null
      }
    } catch (error) {
      return {
        success: false,
        error: handleError(error)
      }
    }
  },

  async createPaymentIntent(planId: string): Promise<ApiResponse<{ clientSecret: string }>> {
    try {
      // This will need to call a Supabase Edge Function for Stripe integration
      // For now, return a mock response
      return {
        success: true,
        data: { clientSecret: 'mock_client_secret' }
      }
    } catch (error) {
      return {
        success: false,
        error: handleError(error)
      }
    }
  },

  async confirmSubscription(paymentIntentId: string): Promise<ApiResponse<null>> {
    try {
      // This will need to call a Supabase Edge Function for Stripe integration
      // For now, return success
      return { success: true }
    } catch (error) {
      return {
        success: false,
        error: handleError(error)
      }
    }
  },

  async cancelSubscription(): Promise<ApiResponse<null>> {
    try {
      const { error } = await supabase
        .from('user_subscriptions')
        .update({
          status: 'cancelled',
          cancelled_at: new Date().toISOString()
        })
        .eq('user_id', (await supabase.auth.getUser()).data.user?.id)
        .eq('status', 'active')

      if (error) throw error

      return { success: true }
    } catch (error) {
      return {
        success: false,
        error: handleError(error)
      }
    }
  }
}

// Contact API
export const contactAPI = {
  async submitForm(formData: ContactForm): Promise<ApiResponse<null>> {
    try {
      const { error } = await supabase
        .from('contact_submissions')
        .insert({
          name: formData.name,
          email: formData.email,
          phone: formData.phone || null,
          subject: formData.subject || null,
          message: formData.message,
          marketing_consent: formData.consent_marketing || false,
          gdpr_consent: true
        })

      if (error) throw error

      return { success: true }
    } catch (error) {
      return {
        success: false,
        error: handleError(error)
      }
    }
  }
}

// Gallery API
export const galleryAPI = {
  async getImages(): Promise<ApiResponse<GalleryImage[]>> {
    try {
      const { data, error } = await supabase
        .from('gallery_images')
        .select('*')
        .order('is_featured', { ascending: false })
        .order('sort_order', { ascending: true })

      if (error) throw error

      return {
        success: true,
        data: data || []
      }
    } catch (error) {
      return {
        success: false,
        error: handleError(error)
      }
    }
  },

  async getFeaturedImages(): Promise<ApiResponse<GalleryImage[]>> {
    try {
      const { data, error } = await supabase
        .from('gallery_images')
        .select('*')
        .eq('is_featured', true)
        .order('sort_order', { ascending: true })
        .limit(6)

      if (error) throw error

      return {
        success: true,
        data: data || []
      }
    } catch (error) {
      return {
        success: false,
        error: handleError(error)
      }
    }
  }
}

// Events API
export const eventsAPI = {
  async getUpcomingEvents(): Promise<ApiResponse<Event[]>> {
    try {
      const { data, error } = await supabase
        .from('events')
        .select('*')
        .gte('event_date', new Date().toISOString().split('T')[0])
        .order('event_date', { ascending: true })
        .limit(10)

      if (error) throw error

      return {
        success: true,
        data: data || []
      }
    } catch (error) {
      return {
        success: false,
        error: handleError(error)
      }
    }
  }
}

// Profile API
export const profileAPI = {
  async updateProfile(profileData: Partial<UserProfile>): Promise<ApiResponse<null>> {
    try {
      const { error } = await supabase
        .from('profiles')
        .update({
          ...profileData,
          updated_at: new Date().toISOString()
        })
        .eq('id', (await supabase.auth.getUser()).data.user?.id)

      if (error) throw error

      return { success: true }
    } catch (error) {
      return {
        success: false,
        error: handleError(error)
      }
    }
  },

  async getProfile(): Promise<ApiResponse<UserProfile>> {
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', (await supabase.auth.getUser()).data.user?.id)
        .single()

      if (error) throw error

      return {
        success: true,
        data: data
      }
    } catch (error) {
      return {
        success: false,
        error: handleError(error)
      }
    }
  }
}

// Health check
export const healthAPI = {
  async check(): Promise<ApiResponse<{ status: string }>> {
    try {
      // Simple query to check if database is accessible
      const { error } = await supabase.from('subscription_plans').select('id').limit(1)

      if (error) throw error

      return {
        success: true,
        data: { status: 'healthy' }
      }
    } catch (error) {
      return {
        success: false,
        error: handleError(error),
        data: { status: 'unhealthy' }
      }
    }
  }
}

export default {
  classes: classesAPI,
  subscriptions: subscriptionsAPI,
  contact: contactAPI,
  gallery: galleryAPI,
  events: eventsAPI,
  profile: profileAPI,
  health: healthAPI
}
