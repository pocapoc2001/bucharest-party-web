import React from 'react';
import { MapPin, Users, Calendar, Music } from 'lucide-react';

export default function EventCard({ event, onSelect }) {
  return (
    <div 
      onClick={() => onSelect(event)}
      className="bg-gray-800/50 border border-gray-700 hover:border-purple-500/50 rounded-xl p-4 cursor-pointer transition-all hover:bg-gray-800 group"
    >
      <div className="flex justify-between items-start mb-2">
        <span className="text-xs font-bold text-purple-400 bg-purple-400/10 px-2 py-1 rounded uppercase tracking-wider">
          {event.category}
        </span>
        <span className="text-gray-400 text-xs flex items-center gap-1">
          <Users size={12} /> {event.attendees}
        </span>
      </div>
      <h3 className="text-lg font-bold text-white group-hover:text-purple-300 transition-colors mb-1">
        {event.title}
      </h3>
      <p className="text-gray-400 text-sm flex items-center gap-1 mb-2">
        <MapPin size={14} /> {event.venue}
      </p>
      <div className="flex items-center gap-4 text-xs text-gray-500">
        <span className="flex items-center gap-1"><Calendar size={12}/> {event.date}</span>
        <span className="flex items-center gap-1"><Music size={12}/> {event.time}</span>
      </div>
    </div>
  );
}