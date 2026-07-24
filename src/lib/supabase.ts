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
        })
      })
    } as any)
