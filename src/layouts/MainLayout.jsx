import { useEffect, useState } from 'react'
import { Outlet, useNavigate, useLocation, Navigate } from 'react-router-dom'
import { Menu, X, MapPin, Users, User, LogOut } from 'lucide-react'
import { Button } from '../components/ui/Button'
import { getUser, signOut } from '../lib/auth'

// User simulat (va fi înlocuit de Supabase)
// const user = { name: "Alexandru C.", email: "alex@partyhub.ro" };

export default function MainLayout() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)

  const navigate = useNavigate()
  const location = useLocation()

  useEffect(() => {
    const fetchUser = async () => {
      const currentUser = await getUser()
      setUser(currentUser)
      setLoading(false)
    }

    fetchUser()
  }, [])

  useEffect(() => {
    console.log('AUTH USER:', user)
  }, [user])


  const handleNavClick = (path) => {
    navigate(path)
    setIsMobileMenuOpen(false)
  }

  const isActive = (path) => location.pathname.startsWith(path)

  const handleLogout = async () => {
    await signOut()
    setUser(null)
    // navigate('/login')
  }

  // Auth guard
  if (loading) return null

  if (!user) {
    return <Navigate to="/login" replace />
  }

  return (
    <div className="min-h-screen bg-black text-gray-200 flex flex-col md:flex-row relative">
      {/* Mobile Header */}
      <div className="md:hidden flex items-center justify-between p-4 border-b border-gray-800 bg-gray-900 sticky top-0 z-50">
        <h2 className="text-lg font-bold bg-clip-text text-transparent bg-gradient-to-r from-purple-400 to-pink-600">
          Bucharest Party Hub
        </h2>
        <button onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)} className="text-gray-200">
          {isMobileMenuOpen ? <X /> : <Menu />}
        </button>
      </div>

      {/* Sidebar */}
      <aside className={`
        fixed inset-0 z-40 bg-gray-900 border-r border-gray-800 transform transition-transform duration-300 ease-in-out md:translate-x-0 md:static md:w-64 flex flex-col
        ${isMobileMenuOpen ? 'translate-x-0 pt-20' : '-translate-x-full md:pt-0'}
      `}>
        <div className="hidden md:block p-6 border-b border-gray-800">
          <h2 className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-purple-400 to-pink-600">
            Bucharest Party Hub
          </h2>
        </div>
        
        <nav className="flex-1 p-4 space-y-2">
          <Button variant={isActive('/') ? 'primary' : 'ghost'} className="w-full justify-start" onClick={() => handleNavClick('/')}>
            <MapPin size={18} /> Main Hub
          </Button>
          <Button variant={isActive('/communities') ? 'primary' : 'ghost'} className="w-full justify-start" onClick={() => handleNavClick('/communities')}>
            <Users size={18} /> Communities
          </Button>
          <Button variant={isActive('/profile') ? 'primary' : 'ghost'} className="w-full justify-start" onClick={() => handleNavClick('/profile')}>
            <User size={18} /> Profile
          </Button>
        </nav>

        <div className="p-4 border-t border-gray-800">
          <div className="flex items-center gap-3 mb-4 px-2">
            <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-purple-500 to-blue-500 flex items-center justify-center font-bold text-white text-xs">
              {user.email?.charAt(0).toUpperCase()}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-white truncate">{user.name}</p>
              <p className="text-xs text-gray-500 truncate">{user.email}</p>
            </div>
          </div>
          <Button variant="ghost" className="w-full justify-start text-red-400 hover:bg-red-900/20 hover:text-red-300" onClick={handleLogout}>
            <LogOut size={18} /> Sign Out
          </Button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 p-4 md:p-6 lg:p-8 overflow-y-auto h-[calc(100vh-60px)] md:h-screen">
        <Outlet />
      </main>
    </div>
  );
}