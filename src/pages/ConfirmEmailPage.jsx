import { useEffect, useState } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import { Button } from '../components/ui/Button'
import { Input } from '../components/ui/Input'
import { supabase } from '../lib/supabase'

export default function ConfirmEmailPage() {
  const navigate = useNavigate()
  const location = useLocation()

  const emailFromState = location.state?.email || ''
  const [email, setEmail] = useState(emailFromState)
  const [code, setCode] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState(null)
  const [info, setInfo] = useState(null)

  useEffect(() => {
    // If user landed here directly without state, keep UI usable
    if (!emailFromState) setInfo('Enter your email and the confirmation code you received.')
  }, [emailFromState])

  const handleVerify = async (e) => {
    e.preventDefault()
    setError(null)
    setInfo(null)

    if (!email || !code) {
      setError('Please enter your email and confirmation code.')
      return
    }

    try {
      setIsSubmitting(true)

      // For email OTP verification: use type "email"
      const { error } = await supabase.auth.verifyOtp({
        email: email.trim().toLowerCase(),
        token: code.trim(),
        type: 'email',
      })

      if (error) {
        setError(error.message || 'Invalid code. Please try again.')
        return
      }

      // Verified → user can access app (session may now exist)
      navigate('/', { replace: true })
    } finally {
      setIsSubmitting(false)
    }
  }

  const resendCode = async () => {
    setError(null)
    setInfo(null)

    if (!email) {
      setError('Please enter your email first.')
      return
    }

    // Resend OTP for initial signup flow
    const { error } = await supabase.auth.resend({
      type: 'signup',
      email: email.trim().toLowerCase(),
    })

    if (error) setError(error.message)
    else setInfo('A new confirmation code has been sent to your email.')
  }

  return (
    <div className="min-h-screen bg-black flex items-center justify-center p-4">
      <div className="bg-gray-900/80 backdrop-blur-xl border border-gray-800 p-8 rounded-2xl w-full max-w-md shadow-2xl">
        <h2 className="text-2xl font-bold text-white mb-2">Confirm your email</h2>
        <p className="text-gray-400 mb-6">
          Enter the confirmation code we sent to your email.
        </p>

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

        <form className="space-y-4" onSubmit={handleVerify}>
          <Input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />

          <Input
            type="text"
            placeholder="Confirmation code (e.g. 123456)"
            value={code}
            onChange={(e) => setCode(e.target.value)}
          />

          <Button type="submit" className="w-full" disabled={isSubmitting}>
            {isSubmitting ? 'Verifying…' : 'Verify & Activate'}
          </Button>
        </form>

        <div className="mt-4">
          <Button type="button" variant="ghost" className="w-full" onClick={resendCode} disabled={isSubmitting}>
            Resend code
          </Button>
        </div>
      </div>
    </div>
  )
}