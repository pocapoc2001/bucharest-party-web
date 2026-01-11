import { useEffect, useState } from 'react'
import { Users, MapPin, Lock, Mail, LockOpen } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import { Button } from '../components/ui/Button'
import { Input } from '../components/ui/Input'
import { supabase } from '../lib/supabase'

export default function UpdatePasswordPage() {
  const navigate = useNavigate()

  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState(null)
  const [info, setInfo] = useState(null)

  const [showPassword, setShowPassword] = useState(false)


  useEffect(() => {
    // Optional: you can check if there is a session here; if not, show a message.
    // But Supabase typically sets a temporary session after the recovery link.
  }, [])

  const handleUpdate = async (e) => {
    e.preventDefault()
    setError(null)
    setInfo(null)

    if (!password || password.length < 6) {
      setError('Password must be at least 6 characters.')
      return
    }
    if (password !== confirmPassword) {
      setError('Passwords do not match.')
      return
    }

    try {
      setIsSubmitting(true)

      const { error } = await supabase.auth.updateUser({ password })

      if (error) {
        setError(error.message)
        return
      }

      setInfo('Password updated successfully. Redirecting…')
      setTimeout(() => navigate('/login', { replace: true }), 800)
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="min-h-screen bg-black flex items-center justify-center p-4">
      <div className="bg-gray-900/80 backdrop-blur-xl border border-gray-800 p-8 rounded-2xl w-full max-w-md shadow-2xl">
        <h2 className="text-2xl font-bold text-white mb-2">Set a new password</h2>
        <p className="text-gray-400 mb-6">Choose a strong password you’ll remember.</p>

        {error && (
          <div className="mb-4 rounded-lg border border-red-800 bg-red-900/20 px-4 py-3 text-sm text-red-200">
            {error}
          </div>
        )}

        {info && (
          <div className="mb-4 rounded-lg border border-blue-800 bg-blue-900/20 px-4 py-3 text-sm text-blue-200">
            {info}
          </div>
        )}

        <form className="space-y-4" onSubmit={handleUpdate}>
        <div className="relative">
          <Input
            type={showPassword ? 'text' : 'password'}
            placeholder="New password"
            value={password}
            icon={Lock}
            onChange={(e) => setPassword(e.target.value)}
            autoComplete="new-password"
          />
            <button
            type="button"
            onClick={() => setShowPassword((s) => !s)}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-sm text-gray-400 hover:text-gray-200"
            >
            {showPassword ? 'Hide' : 'Show'}
            </button>
        </div>




          <Input
            type="password"
            placeholder="Confirm new password"
            value={confirmPassword}
            icon={Lock}
            onChange={(e) => setConfirmPassword(e.target.value)}
            autoComplete="new-password"
          />

          <Button type="submit" className="w-full" disabled={isSubmitting}>
            {isSubmitting ? 'Updating…' : 'Update password'}
          </Button>
        </form>
      </div>
    </div>
  )
}