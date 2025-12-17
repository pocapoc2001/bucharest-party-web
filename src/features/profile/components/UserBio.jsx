import React from 'react';
import { User, Award, Mail, Star } from 'lucide-react';

export default function UserBio({ user }) {
  if (!user) return null;

  const getInitials = (name) => {
    return name
      ? name.split(' ').map((n) => n[0]).join('').toUpperCase().slice(0, 2)
      : 'U';
  };

  // Calcul procentaj XP pentru bara de progres (Level X -> Level X+1)
  // Presupunem 100 XP per nivel. (ex: 150 XP = Level 2, 50% progres)
  const xpProgress = (user.xp_points % 100); 

  return (
    <div className="bg-gray-800/50 border border-gray-700 rounded-xl p-6 mb-6 shadow-lg relative overflow-hidden">
      {/* Background decoration */}
      <div className="absolute top-0 right-0 -mt-4 -mr-4 w-24 h-24 bg-purple-500/10 rounded-full blur-2xl"></div>

      <div className="flex flex-col md:flex-row items-center md:items-start gap-6 text-center md:text-left relative z-10">
        
        {/* Avatar Section */}
        <div className="relative">
          <div className="w-24 h-24 rounded-full bg-gradient-to-br from-purple-600 to-blue-600 flex items-center justify-center text-3xl font-bold text-white shadow-xl ring-4 ring-gray-900/50 overflow-hidden">
            {user.avatarUrl ? (
              <img 
                src={user.avatarUrl} 
                alt={user.name} 
                className="w-full h-full object-cover" 
              />
            ) : (
              <span>{getInitials(user.name)}</span>
            )}
          </div>
          {/* Level Badge */}
          <div className="absolute -bottom-2 -right-2 bg-yellow-500 text-black text-xs font-bold px-2 py-1 rounded-full border-2 border-gray-900 flex items-center gap-1">
            <Star size={10} fill="black" /> Lvl {user.level || 1}
          </div>
        </div>

        {/* User Info Section */}
        <div className="flex-1 w-full md:w-auto">
          <div>
            <h2 className="text-3xl font-bold text-white tracking-tight">{user.name}</h2>
            <div className="flex items-center justify-center md:justify-start gap-2 text-gray-400 text-sm mt-1">
              <Mail size={14} />
              <span>{user.email}</span>
            </div>
          </div>
          
          {/* Badges / Gamification Tags */}
          <div className="flex flex-wrap gap-2 justify-center md:justify-start mt-3 mb-3">
            <span className="px-3 py-1 rounded-full bg-purple-500/10 text-purple-300 text-xs font-bold border border-purple-500/20 flex items-center gap-1">
              <User size={14} /> {user.faculty || "General User"}
            </span>
            <span className="px-3 py-1 rounded-full bg-blue-500/10 text-blue-300 text-xs font-bold border border-blue-500/20 flex items-center gap-1">
              <Award size={14} /> {user.xp_points} XP Total
            </span>
          </div>

          {/* XP Progress Bar */}
          <div className="w-full max-w-sm bg-gray-700 rounded-full h-2.5 dark:bg-gray-700 mt-2 mx-auto md:mx-0">
            <div 
              className="bg-gradient-to-r from-blue-500 to-purple-600 h-2.5 rounded-full transition-all duration-500" 
              style={{ width: `${xpProgress}%` }}
            ></div>
            <p className="text-[10px] text-gray-400 mt-1 text-right">{xpProgress}/100 XP to next level</p>
          </div>
          
          {/* Bio */}
          {user.bio && (
            <p className="text-gray-500 text-sm mt-4 italic border-l-2 border-gray-700 pl-3 text-left">
              "{user.bio}"
            </p>
          )}
        </div>
      </div>
    </div>
  );
}