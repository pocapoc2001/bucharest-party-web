import React, { useState } from 'react';
import { PlusCircle, Loader2 } from 'lucide-react'; 
import { useNavigate } from 'react-router-dom';

import { useCommunities } from '../features/communities/hooks/useCommunities';
import CommunityCard from '../features/communities/components/CommunityCard';
import ChatView from '../features/communities/components/ChatView';

export default function CommunitiesPage() {
  const navigate = useNavigate();
  // ✅ UPDATE: Get 'currentUser' from the hook
  const { communities, loading, joinCommunity, currentUser } = useCommunities();
  const [activeChat, setActiveChat] = useState(null);

  if (activeChat) {
    return (
      <div className="h-[calc(100vh-100px)] relative">
        {/* ✅ UPDATE: Pass communityId and currentUser */}
        <ChatView 
            communityId={activeChat.id}
            communityName={activeChat.name}
            currentUser={currentUser}
            onClose={() => setActiveChat(null)} 
        />
      </div>
    );
  }

  return (
    <div className="pb-20 relative min-h-screen"> 
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-white">Communities</h1>
        <p className="text-gray-400">Find your tribe.</p>
      </div>

      {loading ? (
        <div className="flex justify-center py-20 text-purple-500">
          <Loader2 className="animate-spin w-8 h-8" />
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          
          <button 
            onClick={() => navigate('/create-community')}
            className="border-2 border-dashed border-gray-700 rounded-xl p-6 flex flex-col items-center justify-center text-center cursor-pointer hover:bg-gray-800/30 hover:border-purple-500/50 transition-all group min-h-[200px]"
          >
            <div className="w-16 h-16 rounded-full bg-gray-800 flex items-center justify-center mb-4 group-hover:bg-purple-900/30">
              <PlusCircle size={32} className="text-gray-400 group-hover:text-purple-400" />
            </div>
            <h3 className="font-bold text-white">Create New Group</h3>
          </button>

          {communities.map((comm) => (
            <CommunityCard 
              key={comm.id} 
              comm={comm} 
              onJoin={() => joinCommunity(comm.id)}
              onChat={() => setActiveChat(comm)}
            />
          ))}
        </div>
      )}
    </div>
  );
}