import React from 'react';

// User Mock (va fi înlocuit de Supabase de către Colegul 4)
const user = { name: "Alexandru C.", email: "alex@partyhub.ro", id: "u-123" };

export default function ProfilePage() {
  return (
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
        
        <div className="text-center md:text-left">
          <h3 className="text-xl font-semibold mb-4 text-purple-400">My Upcoming Events</h3>
          <p className="text-gray-500 italic">No tickets purchased yet.</p>
        </div>
      </div>
    </div>
  );
}