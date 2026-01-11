import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { getUser } from '../lib/auth'
import LoginForm from '../features/auth/components/LoginForm.jsx'
import RegisterForm from '../features/auth/components/RegisterForm.jsx'

export default function LoginPage() {
  const [mode, setMode] = useState('login') // 'login' | 'register'
  const [loading, setLoading] = useState(true)
  const navigate = useNavigate()

  useEffect(() => {
    const checkUser = async () => {
      const user = await getUser()
      if (user) navigate('/', { replace: true })
      else setLoading(false)
    }
    checkUser()
  }, [navigate])

  if (loading) return null

  return (
    <div className="min-h-screen bg-black flex items-center justify-center p-4">
      <div className="bg-gray-900/80 backdrop-blur-xl border border-gray-800 p-8 rounded-2xl w-full max-w-md shadow-2xl">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-purple-400 to-pink-600 mb-2">
            Bucharest Party Hub
          </h1>
          <p className="text-gray-400">
            {mode === 'login' ? 'Log in to your account' : 'Create a new account'}
          </p>
        </div>

        {/* ✅ Fix A: key forces remount => clears form state/errors when switching */}
        {mode === 'login' ? (
          <LoginForm key="login" onSuccess={() => navigate('/')} />
        ) : (
          <RegisterForm key="register" onSuccess={() => navigate('/')} />
        )}

        {/* Switch mode */}
        <div className="mt-6 text-center">
          <p className="text-gray-500 text-sm">
            {mode === 'login'
              ? "Don't have an account?"
              : 'Already have an account?'}
            <button
              type="button"
              onClick={() => setMode(mode === 'login' ? 'register' : 'login')}
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