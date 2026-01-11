import React from 'react';
import { X, Check, User } from 'lucide-react';

export default function RequestsModal({ community, onClose, onRespond }) {
  const requests = community.pendingRequests || [];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in">
      <div className="bg-gray-900 border border-gray-700 rounded-2xl w-full max-w-md p-6 relative shadow-2xl">
        <button onClick={onClose} className="absolute top-4 right-4 text-gray-500 hover:text-white">
          <X size={20} />
        </button>
        
        <h2 className="text-xl font-bold text-white mb-1">Join Requests</h2>
        <p className="text-gray-400 text-sm mb-6">Manage who can join {community.name}</p>

        {requests.length === 0 ? (
          <div className="text-center py-8 text-gray-500 bg-gray-800/50 rounded-xl">
            No pending requests.
          </div>
        ) : (
          <div className="space-y-3 max-h-[300px] overflow-y-auto pr-2">
            {requests.map((req) => (
              <div key={req.userId} className="flex items-center justify-between bg-gray-800 p-3 rounded-xl border border-gray-700">
                <div className="flex items-center gap-3 overflow-hidden">
                  <div className="w-10 h-10 rounded-full bg-gray-700 shrink-0 flex items-center justify-center">
                    <User size={20} className="text-gray-400" />
                  </div>
                  <div className="min-w-0">
                    {/* ONLY Name is shown here */}
                    <h4 className="font-bold text-white text-sm truncate">{req.name}</h4>
                  </div>
                </div>
                
                <div className="flex gap-2 shrink-0">
                  <button 
                    onClick={() => onRespond(community.id, req.userId, 'reject')}
                    className="p-2 rounded-lg bg-red-500/10 text-red-500 hover:bg-red-500/20 transition-colors"
                    title="Reject"
                  >
                    <X size={16} />
                  </button>
                  <button 
                    onClick={() => onRespond(community.id, req.userId, 'accept')}
                    className="p-2 rounded-lg bg-green-500/10 text-green-500 hover:bg-green-500/20 transition-colors"
                    title="Accept"
                  >
                    <Check size={16} />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}