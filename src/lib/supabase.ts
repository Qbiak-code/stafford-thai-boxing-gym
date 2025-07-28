import { createClient } from "@supabase/supabase-js"

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error("Missing Supabase environment variables")
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: true,
  },
})

// Types for your database tables
export type Database = {
  public: {
    Tables: {
      profiles: {
        Row: {
          id: string
          first_name: string | null
          last_name: string | null
          phone: string | null
          emergency_contact: string | null
          membership_type: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id: string
          first_name?: string | null
          last_name?: string | null
          phone?: string | null
          emergency_contact?: string | null
          membership_type?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          first_name?: string | null
          last_name?: string | null
          phone?: string | null
          emergency_contact?: string | null
          membership_type?: string | null
          updated_at?: string
        }
      }
      classes: {
        Row: {
          id: string
          name: string
          instructor: string | null
          day_of_week: number | null
          start_time: string
          end_time: string
          max_capacity: number | null
          description: string | null
          is_active: boolean | null
          created_at: string
        }
        Insert: {
          id?: string
          name: string
          instructor?: string | null
          day_of_week?: number | null
          start_time: string
          end_time: string
          max_capacity?: number | null
          description?: string | null
          is_active?: boolean | null
          created_at?: string
        }
        Update: {
          id?: string
          name?: string
          instructor?: string | null
          day_of_week?: number | null
          start_time?: string
          end_time?: string
          max_capacity?: number | null
          description?: string | null
          is_active?: boolean | null
        }
      }
    }
  }
}
