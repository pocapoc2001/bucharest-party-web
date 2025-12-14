import React from 'react';
import { MapPin, Users, Calendar, Clock } from 'lucide-react';
import { Button } from '../../../components/ui/Button';

export default function EventCard({ event, onSelect }) {
  return (
    <div 
      className="bg-gray-800/50 border border-gray-700 rounded-xl overflow-hidden hover:border-purple-500/50 transition-all hover:bg-gray-800 group flex flex-col"
    >
      {/* Event Image */}
      <div className="h-32 w-full overflow-hidden relative">
        <img 
          src={event.image} 
          alt={event.title} 
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
        />
        <div className="absolute top-2 right-2 bg-black/60 backdrop-blur-sm px-2 py-1 rounded text-xs font-bold text-white flex items-center gap-1">
          <Users size={12} className="text-purple-400" /> {event.attendees}
        </div>
        <div className="absolute top-2 left-2 bg-purple-500 text-white text-[10px] font-bold px-2 py-0.5 rounded uppercase tracking-wider">
          {event.category}
        </div>
      </div>

      {/* Content */}
      <div className="p-4 flex-1 flex flex-col">
        <h3 className="text-lg font-bold text-white group-hover:text-purple-300 transition-colors mb-1 truncate">
          {event.title}
        </h3>
        
        <p className="text-gray-400 text-sm flex items-center gap-1 mb-3">
          <MapPin size={14} className="text-gray-500" /> {event.venue}
        </p>
        
        <div className="flex items-center gap-4 text-xs text-gray-500 mb-4">
          <span className="flex items-center gap-1"><Calendar size={12}/> {event.date}</span>
          <span className="flex items-center gap-1"><Clock size={12}/> {event.time}</span>
        </div>

        {/* Action Buttons */}
        <div className="mt-auto flex gap-2">
          <Button 
            variant="outline" 
            className="flex-1 text-xs py-2"
            onClick={(e) => { e.stopPropagation(); onSelect(event); }}
          >
            Details
          </Button>
          <Button 
            variant="primary" 
            className="flex-1 text-xs py-2"
            onClick={(e) => { e.stopPropagation(); alert(`Joined ${event.title}!`); }}
          >
            Join
          </Button>
        </div>
      </div>
    </div>
  );
}