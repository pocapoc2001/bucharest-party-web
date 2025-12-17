import { supabase } from './supabase'

export const signIn = (email, password) =>
  supabase.auth.signInWithPassword({ email, password })

export const signOut = () =>
  supabase.auth.signOut()

export const getUser = async () => {
  const { data } = await supabase.auth.getUser()
  return data.user
}
