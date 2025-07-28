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
    return String((error as { message: unknown }).message)
  }
  return 'An unknown error occurred'
}

// Helper function to get current user ID
const getCurrentUserId = async (): Promise<string> => {
  const { data: { user } } = await supabase.auth.getUser()
  if (!user?.id) {
    throw new Error('User not authenticated')
  }
  return user.id
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
      const userId = await getCurrentUserId()

      const { error } = await supabase
        .from('class_bookings')
        .insert({
          class_id: classId,
          user_id: userId,
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
      const userId = await getCurrentUserId()

      const { error } = await supabase
        .from('class_bookings')
        .update({ status: 'cancelled' })
        .eq('id', bookingId)
        .eq('user_id', userId)

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
      const userId = await getCurrentUserId()

      const { data, error } = await supabase
        .from('class_bookings')
        .select(`
          *,
          class:classes(*)
        `)
        .eq('user_id', userId)
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
      const userId = await getCurrentUserId()

      const { data, error } = await supabase
        .from('user_subscriptions')
        .select(`
          *,
          plan:subscription_plans(*)
        `)
        .eq('user_id', userId)
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
      console.log('Creating payment intent for plan:', planId)
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
      console.log('Confirming subscription for payment intent:', paymentIntentId)
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
      const userId = await getCurrentUserId()

      const { error } = await supabase
        .from('user_subscriptions')
        .update({
          status: 'cancelled',
          cancelled_at: new Date().toISOString()
        })
        .eq('user_id', userId)
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
      const userId = await getCurrentUserId()

      const { error } = await supabase
        .from('profiles')
        .update({
          ...profileData,
          updated_at: new Date().toISOString()
        })
        .eq('id', userId)

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
      const userId = await getCurrentUserId()

      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', userId)
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



// Gallery API
export const galleryAPI = {
  async getImages(): Promise<ApiResponse<GalleryImage[]>> {
    try {
      const { data, error } = await supabase
        .from('gallery_images')
        .select('*')
        .order('is_featured', { ascending: false })
        .order('sort_order', { ascending: true })
        .order('created_at', { ascending: false })

      if (error) throw error

      // Transform data to ensure proper URLs
      const transformedData = data?.map(image => ({
        ...image,
        // Use existing image_url if it's already a full URL, otherwise construct Supabase storage URL
        image_url: image.storage_path && !image.image_url?.startsWith('http')
          ? `https://krxsrstmcllvrbwlulmk.supabase.co/storage/v1/object/public/gallery-images/${image.storage_path}`
          : image.image_url,
        thumbnail_url: image.storage_path && !image.thumbnail_url?.startsWith('http')
          ? `https://krxsrstmcllvrbwlulmk.supabase.co/storage/v1/object/public/gallery-images/${image.storage_path}`
          : image.thumbnail_url
      })) || []

      return {
        success: true,
        data: transformedData
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
        .order('created_at', { ascending: false })
        .limit(6)

      if (error) throw error

      // Transform data to ensure proper URLs
      const transformedData = data?.map(image => ({
        ...image,
        image_url: image.storage_path && !image.image_url?.startsWith('http')
          ? `https://krxsrstmcllvrbwlulmk.supabase.co/storage/v1/object/public/gallery-images/${image.storage_path}`
          : image.image_url,
        thumbnail_url: image.storage_path && !image.thumbnail_url?.startsWith('http')
          ? `https://krxsrstmcllvrbwlulmk.supabase.co/storage/v1/object/public/gallery-images/${image.storage_path}`
          : image.thumbnail_url
      })) || []

      return {
        success: true,
        data: transformedData
      }
    } catch (error) {
      return {
        success: false,
        error: handleError(error)
      }
    }
  },

  async updateImage(
    imageId: string,
    updates: {
      title?: string
      description?: string
      category?: string
      is_featured?: boolean
      sort_order?: number
    }
  ): Promise<ApiResponse<null>> {
    try {
      const { error } = await supabase
        .from('gallery_images')
        .update({
          ...updates,
          updated_at: new Date().toISOString()
        })
        .eq('id', imageId)

      if (error) throw error

      return { success: true }
    } catch (error) {
      return {
        success: false,
        error: handleError(error)
      }
    }
  },

  async deleteImage(imageId: string): Promise<ApiResponse<null>> {
    try {
      // Get image data first to get storage path
      const { data: image, error: fetchError } = await supabase
        .from('gallery_images')
        .select('storage_path')
        .eq('id', imageId)
        .single()

      if (fetchError) throw fetchError

      // Delete from storage if storage_path exists
      if (image.storage_path) {
        const { error: storageError } = await supabase.storage
          .from('gallery-images')
          .remove([image.storage_path])

        if (storageError) {
          console.warn('Storage deletion failed:', storageError)
          // Continue with database deletion even if storage fails
        }
      }

      // Delete from database
      const { error: dbError } = await supabase
        .from('gallery_images')
        .delete()
        .eq('id', imageId)

      if (dbError) throw dbError

      return { success: true }
    } catch (error) {
      return {
        success: false,
        error: handleError(error)
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
