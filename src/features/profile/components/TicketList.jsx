import React from 'react';
import { Ticket, Calendar, MapPin, Clock } from 'lucide-react';

export default function TicketList({ tickets }) {
  return (
    <div className="bg-gray-800/30 border border-gray-700 rounded-xl p-6 shadow-md h-full">
      <h3 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
        <Ticket className="text-purple-400" /> My Events
      </h3>

      {(!tickets || tickets.length === 0) ? (
        <div className="flex flex-col items-center justify-center py-12 text-gray-500">
            <div className="bg-gray-800 p-4 rounded-full mb-3">
              <Ticket size={32} className="opacity-40" />
            </div>
            <p className="italic text-sm">You haven't joined any parties yet.</p>
        </div>
      ) : (
        <div className="space-y-3">
          {tickets.map((ticket) => (
            <div 
              key={ticket.id} 
              className="flex gap-4 bg-gray-900/50 p-3 rounded-lg border border-gray-800 hover:border-purple-500/30 transition-all duration-200"
            >
              {/* Event Image Thumbnail */}
              <div className="w-16 h-16 rounded-md overflow-hidden bg-gray-800 shrink-0">
                 {ticket.image && <img src={ticket.image} alt={ticket.title} className="w-full h-full object-cover" />}
              </div>

              <div className="flex-1 min-w-0">
                <div className="flex justify-between items-start">
                  <h4 className="font-bold text-gray-200 truncate pr-2">
                    {ticket.title}
                  </h4>
                  <span className={`text-[10px] px-2 py-0.5 rounded font-bold uppercase ${
                    ticket.status === 'Upcoming' ? 'bg-green-900 text-green-400' : 'bg-gray-700 text-gray-400'
                  }`}>
                    {ticket.status}
                  </span>
                </div>
                
                <div className="flex flex-col gap-1 mt-1 text-xs text-gray-400">
                   <div className="flex items-center gap-1">
                      <Calendar size={12} /> 
                      <span>{ticket.date}</span>
                      <span className="mx-1">•</span>
                      <Clock size={12} />
                      <span>{ticket.time}</span>
                   </div>
                   <div className="flex items-center gap-1 truncate">
                      <MapPin size={12} /> {ticket.venue}
                   </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}