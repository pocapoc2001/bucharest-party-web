import { useEffect, useMemo, useState } from 'react'
import { User, Users, Phone, Lock, Mail, MailCheck } from 'lucide-react'
import { Button } from '/src/components/ui/Button.jsx'
import { Input } from '/src/components/ui/Input.jsx'
import { supabase } from '/src/lib/supabase.js'
import { useNavigate } from 'react-router-dom'

const PHONE_PREFIXES = [
  { label: '+40 (RO)', value: '+40' },
  { label: '+373 (MD)', value: '+373' },
  { label: '+39 (IT)', value: '+39' },
  { label: '+33 (FR)', value: '+33' },
  { label: '+49 (DE)', value: '+49' },
  { label: '+44 (UK)', value: '+44' },
  { label: '+1 (US)', value: '+1' },
]

export default function RegisterForm({ onSuccess }) {
  const navigate = useNavigate()

  const [fullName, setFullName] = useState('')
  const [email, setEmail] = useState('')
  const [confirmEmail, setConfirmEmail] = useState('')

  const [phonePrefix, setPhonePrefix] = useState('+40')
  const [phoneNumber, setPhoneNumber] = useState('')

  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')

  const [showPassword, setShowPassword] = useState(false)

  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState(null)
  const [info, setInfo] = useState(null)

  // Clear messages when user edits
  useEffect(() => {
    if (error) setError(null)
    if (info) setInfo(null)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [fullName, email, confirmEmail, phonePrefix, phoneNumber, password, confirmPassword])

  const normalizedEmail = useMemo(() => email.trim().toLowerCase(), [email])
  const normalizedConfirmEmail = useMemo(
    () => confirmEmail.trim().toLowerCase(),
    [confirmEmail]
  )

  const validate = () => {
    if (!fullName.trim()) return 'Please enter your full name.'
    if (!email.trim()) return 'Please enter your email.'
    if (!confirmEmail.trim()) return 'Please confirm your email.'
    if (normalizedEmail !== normalizedConfirmEmail) return 'Email addresses do not match.'

    if (!phoneNumber.trim()) return 'Please enter your phone number.'
    const digits = phoneNumber.replace(/\D/g, '')
    if (digits.length < 6) return 'Please enter a valid phone number.'

    if (!password) return 'Please enter a password.'
    if (password.length < 6) return 'Password must be at least 6 characters.'
    if (!confirmPassword) return 'Please confirm your password.'
    if (password !== confirmPassword) return 'Passwords do not match.'

    return null
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (isSubmitting) return

    setError(null)
    setInfo(null)

    const validationError = validate()
    if (validationError) {
      setError(validationError)
      return
    }

    try {
      setIsSubmitting(true)

      const phone = `${phonePrefix}${phoneNumber.replace(/\s+/g, '')}`

      const { data, error } = await supabase.auth.signUp({
        email: normalizedEmail,
        password,
        options: {
          data: {
            full_name: fullName.trim(),
            phone_prefix: phonePrefix,
            phone_number: phoneNumber.trim(),
            phone,
          },
        },
      })

      // ✅ ALWAYS handle error immediately
      if (error) {
        const msg =
          error.message?.toLowerCase().includes('already registered')
            ? 'An account with this email already exists. Try logging in.'
            : error.message

        setError(msg || 'Sign up failed. Please try again.')
        return
      }

      // If email confirmations are enabled, session may be null until confirmed.
      const needsEmailConfirmation = !data?.session

      navigate('/confirm', { replace: true, state: { email: normalizedEmail } })
      return

      onSuccess?.()
    } catch (err) {
      console.error('Register error:', err)
      setError(err?.message || 'Sign up failed. Please try again.')
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <>
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

      <form className="space-y-4" onSubmit={handleSubmit}>
        <Input
          type="text"
          placeholder="Full name"
          icon={User}
          value={fullName}
          onChange={(e) => setFullName(e.target.value)}
          autoComplete="name"
        />

        <Input
          type="email"
          placeholder="Email"
          icon={Mail}
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          autoComplete="email"
        />

        <Input
          type="email"
          placeholder="Confirm email"
          icon={MailCheck}
          value={confirmEmail}
          onChange={(e) => setConfirmEmail(e.target.value)}
          autoComplete="email"
        />

        {/* Phone prefix + phone number */}
        <div className="flex gap-2">
          <select
            value={phonePrefix}
            onChange={(e) => setPhonePrefix(e.target.value)}
            className="w-32 bg-gray-800 border border-gray-700 rounded-lg text-gray-100 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-purple-500"
          >
            {PHONE_PREFIXES.map((p) => (
              <option key={p.value} value={p.value}>
                {p.label}
              </option>
            ))}
          </select>

          <div className="flex-1">
            <Input
              type="tel"
              placeholder="Phone number"
              icon={Phone}
              value={phoneNumber}
              onChange={(e) => setPhoneNumber(e.target.value)}
              autoComplete="tel"
            />
          </div>
        </div>

        {/* Password + show/hide */}
        <div className="relative">
          <Input
            type={showPassword ? 'text' : 'password'}
            placeholder="Password (min 6 characters)"
            icon={Lock}
            value={password}
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
          type={showPassword ? 'text' : 'password'}
          placeholder="Confirm password"
          icon={Lock}
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
          autoComplete="new-password"
        />

        <Button type="submit" className="w-full text-lg" disabled={isSubmitting}>
          {isSubmitting ? 'Creating account…' : 'Create Account'}
        </Button>
      </form>
    </>
  )
}