import { createClient } from '@supabase/supabase-js';

// Înlocuiește string-urile de mai jos cu cele din proiectul lui Sebastian
const supabaseUrl = 'https://xffruzexdawupvqwewek.supabase.co'; 
const supabaseKey = 'sb_publishable_CEd81dGEI5F-0TdFb10j7A_3Ny2SGA-'; 

export const supabase = createClient(supabaseUrl, supabaseKey);