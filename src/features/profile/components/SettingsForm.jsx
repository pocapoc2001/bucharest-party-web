import React from 'react';
import { Lock, LogOut, ChevronRight, ShieldAlert } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export default function SettingsForm({ onSignOut }) {
  const navigate = useNavigate();

  // Helper for Animated Rows
  const AnimatedRow = ({ icon: Icon, color, label, subLabel, onClick, isDanger = false, delay = 0 }) => (
    <button 
      onClick={onClick}
      style={{ animationDelay: `${delay}ms` }}
      className={`
        w-full flex items-center justify-between p-4 rounded-2xl border transition-all duration-300 group
        animate-in slide-in-from-bottom-4 fade-in fill-mode-backwards
        hover:scale-[1.02] hover:shadow-lg active:scale-95
        ${isDanger 
          ? 'bg-red-500/5 border-red-500/10 hover:bg-red-500/10 hover:border-red-500/30' 
          : 'bg-gray-800/40 border-gray-700/50 hover:bg-purple-500/10 hover:border-purple-500/30 hover:shadow-purple-500/10'
        }
      `}
    >
      <div className="flex items-center gap-4">
        <div className={`
          p-3 rounded-xl transition-all duration-300 shadow-inner
          ${isDanger 
            ? 'bg-red-500/10 text-red-400 group-hover:bg-red-500/20' 
            : `bg-gray-900 text-${color}-400 group-hover:bg-${color}-500/20 group-hover:text-${color}-300`
          }
        `}>
          <Icon size={20} />
        </div>
        <div className="text-left">
          <p className={`font-bold text-sm transition-colors ${isDanger ? 'text-red-200' : 'text-gray-200 group-hover:text-white'}`}>
            {label}
          </p>
          {subLabel && <p className="text-xs text-gray-500 group-hover:text-gray-400 transition-colors">{subLabel}</p>}
        </div>
      </div>
      
      <div className={`
        w-8 h-8 rounded-full flex items-center justify-center transition-all duration-300
        ${isDanger ? 'bg-red-500/10 text-red-400' : 'bg-gray-800 text-gray-500 group-hover:bg-purple-500 group-hover:text-white'}
      `}>
        <ChevronRight size={16} />
      </div>
    </button>
  );

  return (
    <div className="bg-gray-900/60 backdrop-blur-xl border border-gray-800 rounded-3xl p-6 shadow-2xl h-full flex flex-col relative overflow-hidden">
      
      {/* Decorative Gradient Blob */}
      <div className="absolute -top-24 -right-24 w-48 h-48 bg-purple-600/20 rounded-full blur-3xl pointer-events-none"></div>

      <h3 className="relative z-10 text-xl font-bold text-white mb-6 flex items-center gap-2">
        <span className="bg-clip-text text-transparent bg-gradient-to-r from-purple-400 to-pink-400 drop-shadow-sm">
          Account Settings
        </span>
      </h3>

      <div className="relative z-10 flex-1 space-y-3">
        {/* Change Password */}
        <AnimatedRow 
          icon={Lock} 
          color="blue" 
          label="Change Password" 
          subLabel="Update your security"
          onClick={() => navigate('/update-password')} 
          delay={100}
        />

        {/* Sign Out */}
        <AnimatedRow 
          icon={LogOut} 
          color="purple" 
          label="Sign Out" 
          subLabel="See you next time"
          onClick={onSignOut}
          delay={200}
        />
      </div>

      {/* Danger Zone */}
      <div className="relative z-10 mt-8 pt-6 border-t border-gray-800/50">
        <h4 className="text-[10px] font-bold text-gray-500 uppercase tracking-wider mb-3 ml-1">
          Danger Zone
        </h4>
        <AnimatedRow 
          icon={ShieldAlert} 
          color="red" 
          label="Delete Account" 
          subLabel="No going back"
          isDanger={true}
          onClick={() => alert("Please contact support to delete your account.")}
          delay={300}
        />
      </div>
    </div>
  );
}