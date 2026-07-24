import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || ''
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || ''

// Export a dummy client if URL is missing to prevent crashes during local development
export const supabase = supabaseUrl 
  ? createClient(supabaseUrl, supabaseKey) 
  : ({
      from: () => ({
        select: () => ({
          order: async () => ({ data: [], error: { message: "Supabase not configured locally" } })
        }),
        insert: async () => ({ data: null, error: { message: "Supabase not connected. This is just a preview!" } }),
        update: () => ({ eq: async () => ({ data: null, error: null }) }),
        delete: () => ({ eq: async () => ({ data: null, error: null }) })
      })
    } as any)
