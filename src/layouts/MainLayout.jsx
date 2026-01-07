import { useEffect, useState } from 'react'
import { Outlet, useNavigate, useLocation } from 'react-router-dom'
import { Menu, X, MapPin, Users, User, LogOut, Sparkles } from 'lucide-react'
import { Button } from '../components/ui/Button'
import { getUser, signOut } from '../lib/auth'
import { useIdleLogout } from '/src/lib/useIdleLogout'

// User simulat (va fi înlocuit de Supabase)
// const user = { name: "Alexandru C.", email: "alex@partyhub.ro" };

export default function MainLayout() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const [user, setUser] = useState({ name: 'Loading...', email: '' }) // Initial state
  const navigate = useNavigate()
  const location = useLocation()

  useIdleLogout({
    idleMs: 10 * 60 * 1000, // 10 minutes
    onLogout: () => navigate('/login', { replace: true }),
  })

  useEffect(() => {
    async function fetchUser() {
      try {
        const authUser = await getUser()

        if (authUser) {
          setUser({
            name:
              authUser.user_metadata?.full_name ||
              authUser.user_metadata?.name ||
              authUser.email ||
              'Party User',
            email: authUser.email || '',
          })
        } else {
          // If no user, maybe redirect or show Guest
          setUser({ name: 'Guest', email: 'Please log in' })
        }
      } catch (error) {
        console.error('Error fetching user:', error)
      }
    }

    fetchUser()
  }, [])

  // --- Handle Sign Out ---
  const handleSignOut = async () => {
    await signOut()
    navigate('/login')
  }

  const handleNavClick = (path) => {
    navigate(path);
    setIsMobileMenuOpen(false);
  };

  const isActive = (path) => location.pathname === path

  return (
    <div className="min-h-screen bg-black text-gray-200 flex flex-col md:flex-row relative">
      
      {/* Mobile Header */}
      <div className="md:hidden flex items-center justify-between p-4 border-b border-gray-800 bg-gray-900 sticky top-0 z-50">
        <div className="flex items-center gap-2">
          <Sparkles className="text-purple-500 animate-pulse" size={18} />
          <h2 className="text-lg font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-purple-400 via-pink-500 to-purple-400 animate-gradient-flow select-none">
            Bucharest Party Hub
          </h2>
        </div>
        <button
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          className="text-gray-200"
        >
          {isMobileMenuOpen ? <X /> : <Menu />}
        </button>
      </div>

      {/* Sidebar */}
      <aside
        className={`
        fixed inset-0 z-40 bg-gray-900 border-r border-gray-800 transform transition-transform duration-300 ease-in-out md:translate-x-0 md:static md:w-64 flex flex-col
        ${isMobileMenuOpen ? 'translate-x-0 pt-20' : '-translate-x-full md:pt-0'}
      `}
      >
        <div className="hidden md:flex flex-col p-6 border-b border-gray-800 gap-2 cursor-default group">
          <div className="flex items-center gap-2">
            <div className="p-1.5 bg-purple-500/10 rounded-lg group-hover:bg-purple-500/20 transition-colors">
              <Sparkles
                className="text-purple-500 group-hover:scale-110 transition-transform duration-500"
                size={20}
              />
            </div>
            <span className="text-[10px] uppercase font-bold tracking-[0.2em] text-gray-500 group-hover:text-purple-400 transition-colors">
              Nightlife App
            </span>
          </div>
          <h2 className="text-2xl font-black leading-none tracking-tight">
            <span className="block text-transparent bg-clip-text bg-gradient-to-r from-white to-gray-400 group-hover:to-white transition-all duration-500">
              Bucharest
            </span>
            <span className="block text-transparent bg-clip-text bg-gradient-to-r from-purple-400 via-pink-500 to-purple-400 animate-gradient-flow bg-[length:200%_auto] group-hover:scale-[1.02] origin-left transition-transform duration-300">
              Party Hub
            </span>
          </h2>
        </div>

        <nav className="flex-1 p-4 space-y-2">
          <Button
            variant={isActive('/') ? 'primary' : 'ghost'}
            className="w-full justify-start"
            onClick={() => handleNavClick('/')}
          >
            <MapPin size={18} /> Main Hub
          </Button>

          <Button
            variant={isActive('/communities') ? 'primary' : 'ghost'}
            className="w-full justify-start"
            onClick={() => handleNavClick('/communities')}
          >
            <Users size={18} /> Communities
          </Button>

          <Button
            variant={isActive('/profile') ? 'primary' : 'ghost'}
            className="w-full justify-start"
            onClick={() => handleNavClick('/profile')}
          >
            <User size={18} /> Profile
          </Button>
        </nav>

        <div className="p-4 border-t border-gray-800">
          <div className="flex items-center gap-3 mb-4 px-2">
            <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-purple-500 to-blue-500 flex items-center justify-center font-bold text-white text-xs shadow-lg shadow-purple-500/20">
              {user.name ? user.name.charAt(0).toUpperCase() : '?'}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-white truncate">{user.name}</p>
              <p className="text-xs text-gray-500 truncate">{user.email}</p>
            </div>
          </div>
          <Button
            variant="ghost"
            className="w-full justify-start text-red-400 hover:bg-red-900/20 hover:text-red-300 transition-colors"
            onClick={handleSignOut}
          >
            <LogOut size={18} /> Sign Out
          </Button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 p-4 md:p-6 lg:p-8 overflow-y-auto h-[calc(100vh-60px)] md:h-screen">
        <Outlet />
      </main>
    </div>
  )
}
