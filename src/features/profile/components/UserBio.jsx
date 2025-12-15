import React from 'react';
import { User, Award, Mail } from 'lucide-react';

export default function UserBio({ user }) {
  if (!user) return null;

  // Helper to get initials if no avatar exists
  const getInitials = (name) => {
    return name
      ? name.split(' ').map((n) => n[0]).join('').toUpperCase().slice(0, 2)
      : 'U';
  };

  return (
    <div className="bg-gray-800/50 border border-gray-700 rounded-xl p-6 mb-6 shadow-lg relative overflow-hidden">
      {/* Background decoration (optional) */}
      <div className="absolute top-0 right-0 -mt-4 -mr-4 w-24 h-24 bg-purple-500/10 rounded-full blur-2xl"></div>

      <div className="flex flex-col md:flex-row items-center md:items-start gap-6 text-center md:text-left relative z-10">
        
        {/* Avatar Section */}
        <div className="relative">
          <div className="w-24 h-24 rounded-full bg-gradient-to-br from-purple-600 to-blue-600 flex items-center justify-center text-3xl font-bold text-white shadow-xl ring-4 ring-gray-900/50">
            {user.avatarUrl ? (
              <img 
                src={user.avatarUrl} 
                alt={user.name} 
                className="w-full h-full rounded-full object-cover" 
              />
            ) : (
              <span>{getInitials(user.name)}</span>
            )}
          </div>
          {/* Online/Status Indicator */}
          <div className="absolute bottom-1 right-1 w-5 h-5 bg-green-500 border-4 border-gray-900 rounded-full"></div>
        </div>

        {/* User Info Section */}
        <div className="flex-1 space-y-2">
          <div>
            <h2 className="text-3xl font-bold text-white tracking-tight">{user.name}</h2>
            <div className="flex items-center justify-center md:justify-start gap-2 text-gray-400 text-sm mt-1">
              <Mail size={14} />
              <span>{user.email}</span>
            </div>
          </div>
          
          {/* Badges / Gamification */}
          <div className="flex flex-wrap gap-2 justify-center md:justify-start mt-3">
            {/* Faculty Badge */}
            <span className="px-3 py-1 rounded-full bg-purple-500/10 text-purple-300 text-xs font-bold border border-purple-500/20 flex items-center gap-1">
              <User size={14} /> {user.faculty || "General User"}
            </span>
            
            {/* Gamification Level Badge */}
            <span className="px-3 py-1 rounded-full bg-blue-500/10 text-blue-300 text-xs font-bold border border-blue-500/20 flex items-center gap-1">
              <Award size={14} /> Level {user.level || 1} Party Animal
            </span>
          </div>
          
          {/* Bio */}
          {user.bio && (
            <p className="text-gray-500 text-sm mt-3 italic border-l-2 border-gray-700 pl-3">
              "{user.bio}"
            </p>
          )}
        </div>
      </div>
    </div>
  );
}