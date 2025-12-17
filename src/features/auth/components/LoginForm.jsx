import { useState } from 'react'
import { Button } from '../../components/ui/Button'
import { Input } from '../../components/ui/Input'
import { signIn } from '../../lib/auth'
import { signInWithGoogle, signInWithFacebook } from './oauth'
import { Users, MapPin } from 'lucide-react'

export default function LoginForm({ onSuccess }) {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState(null)

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError(null)

    const { error } = await signIn(email, password)
    if (error) {
      setError(error.message)
    } else {
      onSuccess()
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
