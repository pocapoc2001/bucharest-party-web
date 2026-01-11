import React from 'react';
import { MessageSquare, Users, Check, Plus, Lock, Clock, Trash2, UserPlus, Pencil, Globe } from 'lucide-react'; // Added Globe
import { Button } from '../../../components/ui/Button'; 

export default function CommunityCard({ comm, onJoin, onChat, onDelete, onManage, onEdit }) {
  // 1. Use the 'active' column from the DB
  const isActive = comm.active === true; 

  return (
    <div className={`
      relative border rounded-xl overflow-hidden flex flex-col h-full transition-all group
      ${comm.isJoined 
        ? 'bg-purple-900/10 border-purple-500/50 shadow-[0_0_20px_rgba(168,85,247,0.15)]' 
        : 'bg-gray-800/40 border-gray-700 hover:border-purple-500/50 hover:bg-gray-800'}
    `}>
      
      {/* IMAGE AREA */}
      <div className="h-32 w-full relative bg-gray-900">
        {comm.image ? (
          <>
            <img src={comm.image} alt={comm.name} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"/>
            <div className="absolute inset-0 bg-gradient-to-t from-gray-900 via-transparent to-transparent" />
          </>
        ) : (
          <div className="w-full h-full bg-gradient-to-br from-gray-800 to-gray-900 flex items-center justify-center">
             <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-indigo-600 to-purple-700 flex items-center justify-center font-bold text-3xl text-white shadow-lg">
                {comm.name.charAt(0).toUpperCase()}
             </div>
          </div>
        )}

        {/* --- TOP RIGHT BADGES --- */}
        <div className="absolute top-3 right-3 flex flex-col gap-2 items-end">
            
            {/* 1. ACTIVE STATUS */}
            {isActive && (
                <div className="flex items-center gap-1.5 bg-black/60 backdrop-blur-md px-2.5 py-1 rounded-full border border-green-500/30 shadow-lg">
                    <span className="relative flex h-2 w-2">
                      <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                      <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500"></span>
                    </span>
                    <span className="text-[10px] font-bold text-white uppercase tracking-wider">Active</span>
                </div>
            )}
            
            {/* 2. PUBLIC / PRIVATE LABEL */}
            {comm.is_private ? (
                <div className="flex items-center gap-1 bg-black/60 backdrop-blur-md px-2 py-1 rounded-md border border-white/10 text-white">
                    <Lock size={10} />
                    <span className="text-[10px] font-bold uppercase">Private</span>
                </div>
            ) : (
                // NEW: Public Badge
                <div className="flex items-center gap-1 bg-purple-500/80 backdrop-blur-md px-2 py-1 rounded-md border border-purple-400/30 text-white">
                    <Globe size={10} />
                    <span className="text-[10px] font-bold uppercase">Public</span>
                </div>
            )}
        </div>

        {/* OWNER ACTIONS (Edit & Delete) */}
        {comm.isOwner && (
            <div className="absolute top-3 left-3 flex gap-2">
                <button 
                    onClick={(e) => { e.stopPropagation(); onDelete(comm.id); }}
                    className="bg-red-500/20 text-red-400 p-2 rounded-lg backdrop-blur-md hover:bg-red-500 hover:text-white transition-all"
                    title="Delete Community"
                >
                    <Trash2 size={16} />
                </button>

                <button 
                    onClick={(e) => { e.stopPropagation(); onEdit(comm); }}
                    className="bg-blue-500/20 text-blue-400 p-2 rounded-lg backdrop-blur-md hover:bg-blue-500 hover:text-white transition-all"
                    title="Edit Community"
                >
                    <Pencil size={16} />
                </button>
            </div>
        )}
      </div>

      {/* CONTENT AREA */}
      <div className="flex-1 p-5 pt-3 flex flex-col">
        <h3 className="font-bold text-xl text-white group-hover:text-purple-300 transition-colors leading-tight mb-2">
           {comm.name}
        </h3>

        <p className="text-gray-400 text-sm mb-4 line-clamp-2 flex-1">
          {comm.description || "Join this awesome community!"}
        </p>

        {/* Footer */}
        <div className="flex items-center justify-between pt-4 border-t border-gray-700/50 mt-auto">
          <div className="flex items-center gap-3 text-xs text-gray-500">
             <span className="flex items-center gap-1"><Users size={14} className="text-purple-400"/> {comm.members_count}</span>
          </div>

          <div className="flex gap-2">
             {/* Manage Requests */}
             {comm.isOwner && comm.pendingRequests?.length > 0 && (
                 <Button 
                    variant="outline" 
                    className="text-xs py-1.5 h-8 border-blue-500/50 text-blue-400 hover:bg-blue-500/10"
                    onClick={(e) => { e.stopPropagation(); onManage(comm); }}
                 >
                    <UserPlus size={14} className="mr-1" /> 
                    Requests ({comm.pendingRequests.length})
                 </Button>
             )}

             {/* Join/Leave Logic */}
             {comm.isPending ? (
                 <Button 
                    variant="outline" 
                    className="text-xs py-1.5 h-8 border-yellow-500/50 text-yellow-500 hover:bg-red-500/10 hover:text-red-400 hover:border-red-500/50 transition-all group/pending"
                    onClick={(e) => { e.stopPropagation(); onJoin(comm.id, comm.is_private); }} 
                 >
                    <span className="flex items-center group-hover/pending:hidden"><Clock size={14} className="mr-1" /> Pending</span>
                    <span className="hidden group-hover/pending:flex items-center">Cancel</span>
                 </Button>
             ) : !comm.isJoined ? (
                 <Button 
                   variant="secondary" 
                   className="text-xs py-1.5 h-8 hover:bg-purple-600 hover:text-white"
                   onClick={(e) => { e.stopPropagation(); onJoin(comm.id, comm.is_private); }}
                 >
                   <Plus size={14} className="mr-1" /> {comm.is_private ? 'Request' : 'Join'}
                 </Button>
             ) : (
                 <>
                   <Button 
                      variant="outline" 
                      className="text-xs py-1.5 h-8 border-green-500/50 text-green-400 hover:bg-red-500/10 hover:text-red-400 hover:border-red-500/50 transition-all group/btn" 
                      onClick={(e) => { e.stopPropagation(); onJoin(comm.id, comm.is_private); }}
                   >
                      <span className="flex items-center group-hover/btn:hidden"><Check size={14} className="mr-1" /> Joined</span>
                      <span className="hidden group-hover/btn:flex items-center">Leave</span>
                   </Button>

                   <Button 
                      variant="primary" 
                      className="px-3 h-8 text-xs flex items-center gap-2" 
                      onClick={(e) => { e.stopPropagation(); onChat(); }}
                   >
                      <MessageSquare size={14} /> Chat
                   </Button>
                 </>
             )}
          </div>
        </div>
      </div>
    </div>
  );
}