import { useEffect, useState } from 'react'
import { User, Users, MapPin } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import { Button } from '../components/ui/Button'
import { Input } from '../components/ui/Input'
import { signIn, getUser } from '../lib/auth'
import { supabase } from '../lib/supabase'

export default function LoginPage() {
  const [mode, setMode] = useState('login') // 'login' | 'register'
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [fullName, setFullName] = useState('')
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  const navigate = useNavigate()

  // Redirect logged-in users away from /login
  useEffect(() => {
    const checkUser = async () => {
      const user = await getUser()
      if (user) {
        navigate('/', { replace: true })
      } else {
        setLoading(false)
      }
    }
    checkUser()
  }, [navigate])

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError(null)

    if (!email || !password) {
      setError('Please fill in all required fields.')
      return
    }

    // LOGIN
    if (mode === 'login') {
      const { error } = await signIn(email, password)
      if (error) {
        setError(error.message)
      } else {
        navigate('/')
      }
      return
    }

    // REGISTER
    const { error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          full_name: fullName,
        },
      },
    })

    if (error) {
      setError(error.message)
    } else {
      navigate('/')
    }
  }

  const signInWithGoogle = () => {
    supabase.auth.signInWithOAuth({ provider: 'google' })
  }

  const signInWithFacebook = () => {
    supabase.auth.signInWithOAuth({ provider: 'facebook' })
  }

  if (loading) return null

  return (
    <div className="min-h-screen bg-black flex items-center justify-center p-4">
      <div className="bg-gray-900/80 backdrop-blur-xl border border-gray-800 p-8 rounded-2xl w-full max-w-md shadow-2xl">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-purple-400 to-pink-600 mb-2">
            Bucharest Party Hub
          </h1>
          <p className="text-gray-400">
            {mode === 'login'
              ? 'Log in to your account'
              : 'Create a new account'}
          </p>
        </div>

        <form className="space-y-4" onSubmit={handleSubmit}>
          {mode === 'register' && (
            <Input
              type="text"
              placeholder="Full Name"
              icon={User}
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
            />
          )}

          <Input
            type="email"
            placeholder="Email Address"
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

          {error && (
            <p className="text-red-400 text-sm text-center">{error}</p>
          )}

          <Button type="submit" className="w-full text-lg">
            {mode === 'login' ? 'Log In' : 'Create Account'}
          </Button>
        </form>

        {/* OAuth */}
        <div className="mt-6 space-y-2">
          <Button variant="ghost" className="w-full" onClick={signInWithGoogle}>
            Continue with Google
          </Button>
          <Button
            variant="ghost"
            className="w-full"
            onClick={signInWithFacebook}
          >
            Continue with Facebook
          </Button>
        </div>

        {/* Switch mode */}
        <div className="mt-6 text-center">
          <p className="text-gray-500 text-sm">
            {mode === 'login'
              ? "Don't have an account?"
              : 'Already have an account?'}
            <button
              onClick={() =>
                setMode(mode === 'login' ? 'register' : 'login')
              }
              className="ml-2 text-purple-400 hover:text-purple-300 font-semibold"
            >
              {mode === 'login' ? 'Sign Up' : 'Log In'}
            </button>
          </p>
        </div>
      </div>
    </div>
  )
}
