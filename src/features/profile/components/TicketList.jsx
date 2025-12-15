import React from 'react';
import { Ticket, Calendar, MapPin, CheckCircle2, XCircle } from 'lucide-react';

export default function TicketList({ tickets }) {
  return (
    <div className="bg-gray-800/30 border border-gray-700 rounded-xl p-6 mb-6 shadow-md">
      <h3 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
        <Ticket className="text-purple-400" /> My Tickets
      </h3>

      {tickets.length === 0 ? (
        <p className="text-gray-500 italic text-center py-4">No upcoming tickets found.</p>
      ) : (
        <div className="space-y-3">
          {tickets.map((ticket) => (
            <div 
              key={ticket.id} 
              className="flex items-center justify-between bg-gray-900/50 p-4 rounded-lg border border-gray-800 hover:border-purple-500/30 transition-all duration-200 group"
            >
              {/* Left Side: Event Info */}
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
              
              {/* Right Side: Status Badge */}
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