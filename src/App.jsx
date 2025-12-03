import React, { useState, useEffect } from 'react';
import { 
  MapPin, 
  Calendar, 
  Users, 
  Search, 
  Menu, 
  X, 
  LogOut, 
  User, 
  Music, 
  MessageSquare,
  Navigation
} from 'lucide-react';

// --- Mock Data ---
const MOCK_EVENTS = [
  {
    id: 1,
    title: "Techno Bunker Night",
    venue: "Control Club",
    date: "2025-10-25",
    time: "23:00",
    description: "Deep techno vibes underground. Student discount available.",
    category: "Techno",
    coordinates: { top: '40%', left: '30%' },
    attendees: 142
  },
  {
    id: 2,
    title: "Latino Rooftop Party",
    venue: "Linea Closer to the Moon",
    date: "2025-10-26",
    time: "20:00",
    description: "Salsa, Bachata and cocktails with a view of Bucharest.",
    category: "Latino",
    coordinates: { top: '20%', left: '60%' },
    attendees: 85
  },
  {
    id: 3,
    title: "Student Reggaeton Bash",
    venue: "Silver Church",
    date: "2025-10-27",
    time: "22:00",
    description: "The biggest student party of the semester.",
    category: "Party",
    coordinates: { top: '70%', left: '45%' },
    attendees: 320
  }
];

const MOCK_COMMUNITIES = [
  { id: 1, name: "Bucharest Techno Heads", members: 1205, active: true },
  { id: 2, name: "Erasmus Students 2025", members: 850, active: true },
  { id: 3, name: "Salsa Lovers RO", members: 430, active: false },
];

// --- Components ---
const Button = ({ children, onClick, variant = 'primary', className = '' }) => {
  const baseStyle = "px-4 py-2 rounded-lg font-semibold transition-all duration-200 flex items-center justify-center gap-2";
  const variants = {
    primary: "bg-purple-600 hover:bg-purple-500 text-white shadow-lg shadow-purple-500/30",
    secondary: "bg-gray-800 hover:bg-gray-700 text-gray-200 border border-gray-700",
    outline: "border-2 border-purple-500 text-purple-400 hover:bg-purple-500/10",
    ghost: "text-gray-400 hover:text-white hover:bg-white/5"
  };

  return (
    <button onClick={onClick} className={`${baseStyle} ${variants[variant]} ${className}`}>
      {children}
    </button>
  );
};

const Input = ({ type, placeholder, icon: Icon }) => (
  <div className="relative w-full">
    {Icon && <Icon className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500 w-5 h-5" />}
    <input
      type={type}
      placeholder={placeholder}
      className={`w-full bg-gray-900/50 border border-gray-700 rounded-lg py-3 ${Icon ? 'pl-10' : 'pl-4'} pr-4 text-white focus:outline-none focus:border-purple-500 focus:ring-1 focus:ring-purple-500 transition-colors placeholder-gray-600`}
    />
  </div>
);

// --- Auth Screen ---
const AuthScreen = ({ onLogin }) => {
  const [isLogin, setIsLogin] = useState(true);

  return (
    <div className="min-h-screen bg-black flex items-center justify-center p-4 relative overflow-hidden">
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden z-0">
        <div className="absolute top-[-10%] left-[-10%] w-[500px] h-[500px] bg-purple-900/30 rounded-full blur-[100px]" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[500px] h-[500px] bg-blue-900/30 rounded-full blur-[100px]" />
      </div>

      <div className="bg-gray-900/80 backdrop-blur-xl border border-gray-800 p-8 rounded-2xl w-full max-w-md z-10 shadow-2xl relative">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-purple-400 to-pink-600 mb-2">
            Bucharest Party Hub
          </h1>
          <p className="text-gray-400">Discover the best nightlife near you.</p>
        </div>

        <form className="space-y-4" onSubmit={(e) => { e.preventDefault(); onLogin(); }}>
          {!isLogin && <Input type="text" placeholder="Full Name" icon={User} />}
          <Input type="email" placeholder="Email Address" icon={Users} />
          <Input type="password" placeholder="Password" icon={MapPin} />
          
          <Button className="w-full text-lg">
            {isLogin ? 'Log In' : 'Create Account'}
          </Button>
        </form>

        <div className="mt-6 text-center">
          <p className="text-gray-500 text-sm">
            {isLogin ? "Don't have an account?" : "Already have an account?"}
            <button 
              onClick={() => setIsLogin(!isLogin)}
              className="ml-2 text-purple-400 hover:text-purple-300 font-semibold"
            >
              {isLogin ? 'Sign Up' : 'Log In'}
            </button>
          </p>
        </div>
      </div>
    </div>
  );
};

// --- Main App Components ---
const EventCard = ({ event, onSelect }) => (
  <div 
    onClick={() => onSelect(event)}
    className="bg-gray-800/50 border border-gray-700 hover:border-purple-500/50 rounded-xl p-4 cursor-pointer transition-all hover:bg-gray-800 group"
  >
    <div className="flex justify-between items-start mb-2">
      <span className="text-xs font-bold text-purple-400 bg-purple-400/10 px-2 py-1 rounded uppercase tracking-wider">
        {event.category}
      </span>
      <span className="text-gray-400 text-xs flex items-center gap-1">
        <Users size={12} /> {event.attendees}
      </span>
    </div>
    <h3 className="text-lg font-bold text-white group-hover:text-purple-300 transition-colors mb-1">
      {event.title}
    </h3>
    <p className="text-gray-400 text-sm flex items-center gap-1 mb-2">
      <MapPin size={14} /> {event.venue}
    </p>
    <div className="flex items-center gap-4 text-xs text-gray-500">
      <span className="flex items-center gap-1"><Calendar size={12}/> {event.date}</span>
      <span className="flex items-center gap-1"><Music size={12}/> {event.time}</span>
    </div>
  </div>
);

const InteractiveMap = ({ events, onMarkerClick }) => (
  <div className="w-full h-full bg-gray-900 relative rounded-xl overflow-hidden border border-gray-800 group">
    <div className="absolute inset-0 opacity-20" style={{ 
      backgroundImage: 'radial-gradient(#4b5563 1px, transparent 1px)', 
      backgroundSize: '20px 20px' 
    }}></div>
    
    <div className="absolute top-4 left-4 bg-gray-900/90 p-2 rounded-lg border border-gray-700 text-xs text-gray-300">
      <p className="font-bold">Bucharest, RO</p>
      <p>Simulated Map View</p>
    </div>

    {events.map((event) => (
      <button
        key={event.id}
        onClick={() => onMarkerClick(event)}
        className="absolute transform -translate-x-1/2 -translate-y-1/2 hover:scale-110 transition-transform"
        style={{ top: event.coordinates.top, left: event.coordinates.left }}
      >
        <div className="relative">
          <div className="w-8 h-8 bg-purple-600 rounded-full flex items-center justify-center shadow-lg shadow-purple-500/50 z-10 relative">
            <Music size={14} className="text-white" />
          </div>
          <div className="absolute top-2 left-0 w-8 h-8 bg-purple-600 rounded-full animate-ping opacity-75"></div>
          <div className="absolute -bottom-8 left-1/2 -translate-x-1/2 bg-black/80 px-2 py-1 rounded text-[10px] whitespace-nowrap text-white z-20">
            {event.venue}
          </div>
        </div>
      </button>
    ))}
  </div>
);

const Dashboard = ({ user, onLogout }) => {
  const [activeTab, setActiveTab] = useState('hub'); 
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const handleNavClick = (tab) => {
    setActiveTab(tab);
    setIsMobileMenuOpen(false);
  };

  return (
    <div className="min-h-screen bg-black text-gray-200 flex flex-col md:flex-row relative">
      {/* Mobile Header */}
      <div className="md:hidden flex items-center justify-between p-4 border-b border-gray-800 bg-gray-900 sticky top-0 z-50">
        <h2 className="text-lg font-bold bg-clip-text text-transparent bg-gradient-to-r from-purple-400 to-pink-600">
          Party Hub
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
            Party Hub
          </h2>
        </div>
        
        <nav className="flex-1 p-4 space-y-2">
          <Button variant={activeTab === 'hub' ? 'primary' : 'ghost'} className="w-full justify-start" onClick={() => handleNavClick('hub')}>
            <MapPin size={18} /> Main Hub
          </Button>
          <Button variant={activeTab === 'communities' ? 'primary' : 'ghost'} className="w-full justify-start" onClick={() => handleNavClick('communities')}>
            <Users size={18} /> Communities
          </Button>
          <Button variant={activeTab === 'profile' ? 'primary' : 'ghost'} className="w-full justify-start" onClick={() => handleNavClick('profile')}>
            <User size={18} /> Profile
          </Button>
        </nav>

        <div className="p-4 border-t border-gray-800">
          <div className="flex items-center gap-3 mb-4 px-2">
            <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-purple-500 to-blue-500 flex items-center justify-center font-bold text-white text-xs">
              {user.name.charAt(0)}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-white truncate">{user.name}</p>
              <p className="text-xs text-gray-500 truncate">{user.email}</p>
            </div>
          </div>
          <Button variant="ghost" onClick={onLogout} className="w-full justify-start text-red-400 hover:bg-red-900/20 hover:text-red-300">
            <LogOut size={18} /> Sign Out
          </Button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 p-4 md:p-6 lg:p-8 overflow-y-auto h-[calc(100vh-60px)] md:h-screen">
        {activeTab === 'hub' && (
          <div className="flex flex-col lg:flex-row gap-6 h-auto lg:h-[calc(100vh-180px)]">
             <div className="w-full lg:w-2/3 h-64 md:h-96 lg:h-auto rounded-xl overflow-hidden shadow-2xl border border-gray-800 relative order-1 lg:order-2">
               <InteractiveMap events={MOCK_EVENTS} onMarkerClick={setSelectedEvent} />
               {selectedEvent && (
                 <div className="absolute bottom-4 left-4 right-4 bg-gray-900/95 backdrop-blur-md border border-gray-700 p-4 rounded-xl shadow-2xl animate-in slide-in-from-bottom-10 fade-in duration-300 z-30">
                   <div className="flex justify-between items-start">
                     <div>
                       <h3 className="text-xl font-bold text-white">{selectedEvent.title}</h3>
                       <p className="text-purple-400 text-sm mb-2">{selectedEvent.venue}</p>
                     </div>
                     <button onClick={() => setSelectedEvent(null)} className="text-gray-500 hover:text-white"><X size={20} /></button>
                   </div>
                   <p className="text-gray-300 text-sm mb-4">{selectedEvent.description}</p>
                   <div className="flex gap-2">
                     <Button className="flex-1 text-sm py-2">Join Event</Button>
                     <Button variant="outline" className="flex-1 text-sm py-2">Details</Button>
                   </div>
                 </div>
               )}
            </div>
            <div className="w-full lg:w-1/3 space-y-4 overflow-y-auto pr-2 order-2 lg:order-1">
              {MOCK_EVENTS.map(event => (
                <EventCard key={event.id} event={event} onSelect={setSelectedEvent} />
              ))}
            </div>
          </div>
        )}

        {activeTab === 'communities' && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <div className="border border-dashed border-gray-700 rounded-xl p-6 flex flex-col items-center justify-center text-center cursor-pointer hover:bg-gray-900/50 hover:border-purple-500 transition-colors">
              <div className="w-12 h-12 rounded-full bg-gray-800 flex items-center justify-center mb-3">
                <Navigation size={24} className="text-gray-400" />
              </div>
              <h3 className="font-bold text-white">Create Community</h3>
            </div>
            {MOCK_COMMUNITIES.map(comm => (
              <div key={comm.id} className="bg-gray-800/30 border border-gray-700 rounded-xl p-6 hover:border-gray-500 transition-colors">
                <div className="flex justify-between items-start mb-4">
                  <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center font-bold text-white">
                    {comm.name.charAt(0)}
                  </div>
                  {comm.active && <span className="w-2 h-2 rounded-full bg-green-500 shadow-[0_0_10px_rgba(34,197,94,0.5)]"></span>}
                </div>
                <h3 className="font-bold text-lg text-white mb-1">{comm.name}</h3>
                <p className="text-gray-500 text-sm mb-4">{comm.members} Members</p>
                <div className="flex gap-2">
                  <Button variant="secondary" className="w-full text-sm">View</Button>
                  <Button variant="ghost" className="px-2"><MessageSquare size={16} /></Button>
                </div>
              </div>
            ))}
          </div>
        )}

        {activeTab === 'profile' && (
          <div className="max-w-2xl mx-auto md:mx-0">
            <div className="bg-gray-800/30 border border-gray-700 rounded-xl p-6 md:p-8">
              <div className="flex flex-col md:flex-row items-center md:items-start gap-6 mb-8 text-center md:text-left">
                <div className="w-24 h-24 rounded-full bg-gradient-to-r from-purple-500 to-pink-500 flex items-center justify-center text-3xl font-bold text-white shadow-xl">
                  {user.name.charAt(0)}
                </div>
                <div>
                  <h2 className="text-2xl font-bold text-white">{user.name}</h2>
                  <p className="text-gray-400">{user.email}</p>
                </div>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
};

export default function App() {
  const [user, setUser] = useState(null);
  const handleLogin = () => {
    setUser({ name: "Alexandru C.", email: "alex@partyhub.ro", id: "u-123" });
  };
  const handleLogout = () => { setUser(null); };

  return (
    <div className="font-sans antialiased bg-black text-gray-100">
      {user ? <Dashboard user={user} onLogout={handleLogout} /> : <AuthScreen onLogin={handleLogin} />}
    </div>
  );
}