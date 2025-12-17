import React from 'react';
import { MessageSquare, Users, Check, Plus } from 'lucide-react';
// Adjust this path if your Button component is in a different folder
import { Button } from '../../../components/ui/Button'; 

export default function CommunityCard({ comm, onJoin, onChat }) {
  return (
    <div className={`border rounded-xl p-6 transition-all group flex flex-col h-full ${
      comm.isJoined 
        ? 'bg-purple-900/10 border-purple-500/50' 
        : 'bg-gray-800/40 border-gray-700 hover:border-purple-500/50'
    }`}>
      {/* Header: Icon & Active Status */}
      <div className="flex justify-between items-start mb-4">
        <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-indigo-600 to-purple-700 flex items-center justify-center font-bold text-xl text-white shadow-lg">
          {comm.name.charAt(0).toUpperCase()}
        </div>
        {comm.active && (
          <span className="flex items-center gap-1 text-[10px] uppercase font-bold text-green-400 bg-green-400/10 px-2 py-1 rounded-full">
            <span className="w-1.5 h-1.5 rounded-full bg-green-400 animate-pulse"></span> Active
          </span>
        )}
      </div>

      {/* Content */}
      <div className="flex-1">
        <h3 className="font-bold text-lg text-white mb-1">{comm.name}</h3>
        <p className="text-gray-400 text-sm mb-4 line-clamp-2">
          {comm.description || "An awesome community for students."}
        </p>
      </div>
      
      {/* Footer: Stats & Actions */}
      <div className="flex items-center justify-between mt-4 pt-4 border-t border-gray-700/50">
        <span className="text-gray-500 text-xs flex items-center gap-1">
          <Users size={14} /> {comm.members_count || 1} Members
        </span>
        
        <div className="flex gap-2">
          {/* LOGIC: Show different buttons based on isJoined status */}
          
          {!comm.isJoined ? (
            // STATE 1: NOT JOINED -> Show "Join" Button
            <Button 
              variant="secondary" 
              className="text-xs py-1.5 h-8 hover:bg-purple-600 hover:text-white transition-colors" 
              onClick={(e) => { 
                e.stopPropagation(); 
                onJoin(); 
              }}
            >
              <Plus size={14} className="mr-1" /> Join
            </Button>
          ) : (
            // STATE 2: JOINED -> Show "Joined" (Click to Leave) AND "Chat"
            <>
              <Button 
                variant="outline" 
                className="text-xs py-1.5 h-8 border-green-500/50 text-green-400 hover:bg-red-500/10 hover:text-red-400 hover:border-red-500/50 transition-all group/btn" 
                onClick={(e) => { 
                  e.stopPropagation(); 
                  onJoin(); // Calls join again to toggle OFF (Leave)
                }}
              >
                {/* Trick: Show "Joined" normally, but "Leave" when hovering */}
                <span className="flex items-center group-hover/btn:hidden">
                  <Check size={14} className="mr-1" /> Joined
                </span>
                <span className="hidden group-hover/btn:flex items-center">
                   Leave
                </span>
              </Button>

              <Button 
                variant="primary" 
                className="px-3 h-8 text-xs flex items-center gap-2" 
                onClick={(e) => { 
                  e.stopPropagation(); 
                  onChat(); 
                }}
              >
                <MessageSquare size={14} /> Chat
              </Button>
            </>
          )}
        </div>
      </div>
    </div>
  );
}