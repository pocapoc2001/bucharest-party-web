import { createClient } from '@supabase/supabase-js'

const supabaseUrl = 'https://xffruzexdawupvqwewek.supabase.co'
const supabaseAnonKey = 'sb_publishable_CEd81dGEI5F-0TdFb10j7A_3Ny2SGA-'

export const supabase = createClient(
  supabaseUrl,
  supabaseAnonKey
)
