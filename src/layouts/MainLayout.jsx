import { useEffect, useState } from 'react'
import { Outlet, useNavigate, useLocation } from 'react-router-dom'
import { Menu, X, MapPin, Users, User, LogOut, Sparkles, ChevronRight } from 'lucide-react'
import { getUser, signOut } from '../lib/auth'
import { useIdleLogout } from '/src/lib/useIdleLogout'

export default function MainLayout() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const [user, setUser] = useState({ name: 'Loading...', email: '' }) 
  const navigate = useNavigate()
  const location = useLocation()

  useIdleLogout({
    idleMs: 10 * 60 * 1000, 
    onLogout: () => navigate('/login', { replace: true }),
  })

  useEffect(() => {
    async function fetchUser() {
      try {
        const authUser = await getUser()
        if (authUser) {
          setUser({
            name: authUser.user_metadata?.full_name || authUser.email || 'Party User',
            email: authUser.email || '',
            avatar_url: authUser.user_metadata?.avatar_url
          })
        } else {
          setUser({ name: 'Guest', email: 'Please log in' })
        }
      } catch (error) {
        console.error('Error fetching user:', error)
      }
    }
    fetchUser()
  }, [])

  const handleSignOut = async () => {
    await signOut()
    navigate('/login')
  }

  const handleNavClick = (path) => {
    navigate(path);
    setIsMobileMenuOpen(false);
  };

  const isActive = (path) => location.pathname === path

  // --- Custom Animated Nav Item ---
  const NavItem = ({ icon: Icon, label, path }) => {
    const active = isActive(path);
    return (
      <button
        onClick={() => handleNavClick(path)}
        className={`
          group relative w-full flex items-center gap-3 px-4 py-3.5 rounded-xl transition-all duration-300 overflow-hidden
          ${active 
            ? 'bg-gradient-to-r from-purple-600/20 to-pink-600/10 border border-purple-500/30 text-white shadow-[0_0_20px_rgba(168,85,247,0.15)]' 
            : 'text-gray-400 hover:text-white hover:bg-white/5 border border-transparent'
          }
        `}
      >
        {/* Active Indicator Bar (Animated) */}
        <div className={`
          absolute left-0 top-1/2 -translate-y-1/2 w-1 h-8 rounded-r-full bg-purple-500 
          transition-all duration-300 ease-out shadow-[0_0_10px_#a855f7]
          ${active ? 'translate-x-0 opacity-100' : '-translate-x-full opacity-0'}
        `} />

        {/* Icon Container with Glow */}
        <div className={`
          relative z-10 p-2 rounded-lg transition-all duration-300
          ${active 
            ? 'bg-purple-500/20 text-purple-300 scale-110' 
            : 'bg-gray-800 text-gray-500 group-hover:text-purple-400 group-hover:bg-gray-800/80 group-hover:scale-110'
          }
        `}>
          <Icon size={20} className="transition-transform duration-300" />
        </div>

        {/* Label */}
        <span className="font-semibold tracking-wide text-sm relative z-10">
          {label}
        </span>

        {/* Hover Arrow */}
        <ChevronRight size={16} className={`
          ml-auto transition-all duration-300 relative z-10
          ${active 
            ? 'opacity-100 text-purple-500 translate-x-0' 
            : 'opacity-0 -translate-x-4 group-hover:opacity-50 group-hover:translate-x-0'
          }
        `} />
      </button>
    );
  };

  return (
    <div className="min-h-screen bg-black text-gray-200 flex flex-col md:flex-row relative overflow-hidden">
      
      {/* Background Ambience */}
      <div className="fixed top-0 left-0 w-full h-full bg-[radial-gradient(ellipse_at_top_left,_var(--tw-gradient-stops))] from-purple-900/10 via-black to-black pointer-events-none z-0" />

      {/* Mobile Header */}
      <div className="md:hidden flex items-center justify-between p-4 border-b border-gray-800 bg-gray-900/95 backdrop-blur-xl sticky top-0 z-50 relative">
        <div className="flex items-center gap-2">
          <Sparkles className="text-purple-500 animate-pulse" size={18} />
          <h2 className="text-lg font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-purple-400 via-pink-500 to-purple-400 animate-gradient-flow select-none">
            Bucharest Party Hub
          </h2>
        </div>
        <button
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          className="p-2 text-gray-400 hover:text-white transition-colors"
        >
          {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {/* SIDEBAR */}
      <aside
        className={`
          fixed inset-0 z-40 bg-black/95 backdrop-blur-xl md:bg-gray-900/40 md:backdrop-blur-none border-r border-gray-800/50 
          transform transition-transform duration-300 ease-in-out md:translate-x-0 md:static md:w-72 flex flex-col
          ${isMobileMenuOpen ? 'translate-x-0 pt-20' : '-translate-x-full md:pt-0'}
        `}
      >
        {/* 1. Logo Section */}
        <div className="hidden md:flex flex-col p-8 pb-6 cursor-default group select-none">
          <div className="flex items-center gap-2 mb-1">
            <div className="p-1.5 bg-gradient-to-br from-purple-600/20 to-pink-600/20 rounded-lg border border-purple-500/20 group-hover:border-purple-500/50 transition-colors duration-500">
              <Sparkles
                className="text-purple-500 group-hover:scale-110 group-hover:rotate-12 transition-transform duration-500"
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

        {/* 2. Navigation Links */}
        <nav className="flex-1 px-4 py-6 space-y-3">
          <NavItem icon={MapPin} label="Discover Events" path="/" />
          <NavItem icon={Users} label="Communities" path="/communities" />
          <NavItem icon={User} label="My Profile" path="/profile" />
        </nav>

        {/* 3. User Profile Card */}
        <div className="p-4">
          <div className="bg-gray-800/40 border border-gray-700/50 rounded-2xl p-4 backdrop-blur-md hover:border-purple-500/30 hover:bg-gray-800/60 transition-all duration-300 group">
            <div className="flex items-center gap-3 mb-3">
              {/* Avatar Ring */}
              <div className="relative">
                <div className="absolute -inset-0.5 bg-gradient-to-tr from-purple-500 to-pink-500 rounded-full opacity-60 blur-[3px] group-hover:opacity-100 transition-opacity duration-500"></div>
                <div className="relative w-10 h-10 rounded-full bg-gray-900 border border-gray-800 overflow-hidden flex items-center justify-center">
                   {user.avatar_url ? (
                      <img src={user.avatar_url} alt="User" className="w-full h-full object-cover" />
                   ) : (
                      <span className="text-xs font-bold text-white">{user.name?.charAt(0)}</span>
                   )}
                </div>
              </div>
              
              <div className="flex-1 min-w-0">
                <p className="text-sm font-bold text-white truncate group-hover:text-purple-300 transition-colors">
                  {user.name}
                </p>
                <p className="text-[10px] text-gray-500 truncate font-mono">
                  {user.email}
                </p>
              </div>
            </div>

            <button
              onClick={handleSignOut}
              className="w-full flex items-center justify-center gap-2 py-2 rounded-xl bg-white/5 hover:bg-red-500/10 hover:text-red-400 text-xs font-semibold text-gray-400 transition-all duration-200 border border-transparent hover:border-red-500/20"
            >
              <LogOut size={14} /> Sign Out
            </button>
          </div>
          
          <p className="text-[10px] text-center text-gray-700 mt-4 font-mono opacity-50 hover:opacity-100 transition-opacity">v1.0.2 • Bucharest</p>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 relative z-10 p-4 md:p-6 lg:p-8 overflow-y-auto h-[calc(100vh-60px)] md:h-screen scrollbar-thin scrollbar-thumb-gray-800 hover:scrollbar-thumb-gray-700">
        <Outlet />
      </main>
    </div>
  )
}