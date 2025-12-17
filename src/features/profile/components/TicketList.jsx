import React from 'react';
import { Ticket, Calendar, MapPin, CheckCircle2, XCircle } from 'lucide-react';

export default function TicketList({ tickets }) {
  return (
    <div className="bg-gray-800/30 border border-gray-700 rounded-xl p-6 mb-6 shadow-md h-full">
      <h3 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
        <Ticket className="text-purple-400" /> My events list
      </h3>

      {(!tickets || tickets.length === 0) ? (
        <div className="flex flex-col items-center justify-center py-8 text-gray-500">
            <Ticket size={48} className="mb-2 opacity-20" />
            <p className="italic">You don't have any events yet.</p>
            <p className="text-xs mt-1">Go to Main Hub to join one!</p>
        </div>
      ) : (
        <div className="space-y-3">
          {tickets.map((ticket) => (
            <div 
              key={ticket.id} 
              className="flex items-center justify-between bg-gray-900/50 p-4 rounded-lg border border-gray-800 hover:border-purple-500/30 transition-all duration-200 group"
            >
              <div>
                <h4 className="font-bold text-gray-200 group-hover:text-purple-300 transition-colors">
                  {ticket.title}
                </h4>
                <div className="flex items-center gap-3 text-xs text-gray-500 mt-1">
                  <span className="flex items-center gap-1">
                    <MapPin size={12} className="text-gray-600" /> {ticket.venue}
                  </span>
                  <span className="flex items-center gap-1">
                    <Calendar size={12} className="text-gray-600" /> {ticket.date}
                  </span>
                </div>
              </div>
              
              <div className={`px-3 py-1 rounded-full text-[10px] uppercase tracking-wider font-bold flex items-center gap-1 shadow-sm ${
                ticket.status === 'Valid' 
                  ? 'bg-green-900/20 text-green-400 border border-green-500/20' 
                  : 'bg-gray-800 text-gray-400 border border-gray-700'
              }`}>
                {ticket.status === 'Valid' ? <CheckCircle2 size={12} /> : <XCircle size={12} />}
                {ticket.status}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}