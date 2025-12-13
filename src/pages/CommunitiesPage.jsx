import React from 'react';
import { Navigation, MessageSquare } from 'lucide-react';
import { Button } from '../components/ui/Button';

// Date Mock (vor fi înlocuite de Supabase de către Colegul 3)
const MOCK_COMMUNITIES = [
  { id: 1, name: "Bucharest Techno Heads", members: 1205, active: true },
  { id: 2, name: "Erasmus Students 2025", members: 850, active: true },
  { id: 3, name: "Salsa Lovers RO", members: 430, active: false },
];

export default function CommunitiesPage() {
  return (
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
  );
}