import { supabase } from '../../lib/supabase'

export const signInWithGoogle = () => {
  return supabase.auth.signInWithOAuth({
    provider: 'google',
  })
}

export const signInWithFacebook = () => {
  return supabase.auth.signInWithOAuth({
    provider: 'facebook',
  })
}
