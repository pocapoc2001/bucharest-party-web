import { useEffect, useState } from 'react'
import { Users, MapPin, Lock, Mail, LockOpen } from 'lucide-react'
import { Button } from '/src/components/ui/Button'
import { Input } from '/src/components/ui/Input'
import { signIn } from '/src/lib/auth'
import { supabase } from '/src/lib/supabase'
import { useNavigate } from 'react-router-dom'

export default function LoginForm({ onSuccess }) {
  const navigate = useNavigate()

  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState(null)

    // Clear error when user starts editing again
  useEffect(() => {
    if (error) setError(null)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [email, password])


  const handleSubmit = async (e) => {
    e.preventDefault()
    if (isSubmitting) return

    setError(null)

    if (!email || !password) {
      setError('Please enter your email and password.')
      return
    }

    try {
      setIsSubmitting(true)

      const { error } = await signIn(email, password)

      if (error) {
        // Friendly mapping for common errors
        const msg =
          error.message?.toLowerCase().includes('invalid login credentials')
            ? 'Invalid email or password.'
            : error.message?.toLowerCase().includes('email not confirmed')
              ? 'Please confirm your email address before logging in.'
              : error.message

        setError(msg || 'Login failed. Please try again.')
        return
      }

      onSuccess?.()
    } catch (err) {
      setError('Login failed. Please try again.')
    } finally {

    }
  }

  return (
    <>
      <form className="space-y-4" onSubmit={handleSubmit}>
        <Input
          type="email"
          placeholder="Email"
          icon={Users}
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />

        <Input
          type="password"
          placeholder="Password"
          icon={MapPin}
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />

        {error && <p className="text-red-400 text-sm">{error}</p>}

        <Button type="submit" className="w-full">
          Log In
        </Button>
      </form>

      <div className="mt-6 space-y-2">
        <Button variant="ghost" className="w-full" onClick={signInWithGoogle}>
          Continue with Google
        </Button>
        <Button variant="ghost" className="w-full" onClick={signInWithFacebook}>
          Continue with Facebook
        </Button>
      </div>
    </>
  )
}
