import React from 'react';
import { MapPin, Users, Calendar, Clock, Check } from 'lucide-react';
import { Button } from '../../../components/ui/Button';

export default function EventCard({ event, onSelect, onJoin }) {
  const handleJoinClick = (e) => {
    e.stopPropagation(); // Prevents opening the details when clicking Join
    onJoin(event.id);
  };

  return (
    <div 
      onClick={() => onSelect(event)}
      className={`
        relative border rounded-xl overflow-hidden transition-all duration-300 group flex flex-col cursor-pointer
        ${event.isJoined ? 'border-green-500/50 bg-gray-900' : 'bg-gray-800/50 border-gray-700 hover:border-purple-500/50 hover:bg-gray-800'}
      `}
    >
      {/* Image Section */}
      <div className="h-32 w-full overflow-hidden relative">
        <img 
          src={event.image} 
          alt={event.title} 
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
        />
        {/* Category Tag */}
        <div className="absolute top-2 left-2 bg-black/60 backdrop-blur-md text-white text-[10px] font-bold px-2 py-0.5 rounded uppercase border border-white/10">
          {event.category}
        </div>
        {/* Age Tag */}
        <div className="absolute bottom-2 right-2 bg-blue-600/80 backdrop-blur-md text-white text-[10px] font-bold px-2 py-0.5 rounded shadow-sm">
          {event.ageGroup}
        </div>
      </div>

      {/* Content Section */}
      <div className="p-4 flex-1 flex flex-col">
        <div className="flex justify-between items-start mb-1">
          <h3 className="text-lg font-bold text-white group-hover:text-purple-300 transition-colors truncate w-full pr-2">
            {event.title}
          </h3>
          {event.isJoined && <Check size={16} className="text-green-500 shrink-0 mt-1" />}
        </div>
        
        <p className="text-gray-400 text-sm flex items-center gap-1 mb-3">
          <MapPin size={14} className="text-gray-500" /> {event.venue}
        </p>
        
        <div className="flex items-center justify-between text-xs text-gray-500 mb-4 bg-gray-900/50 p-2 rounded-lg">
          <span className="flex items-center gap-1"><Calendar size={12}/> {event.date}</span>
          <span className="flex items-center gap-1"><Clock size={12}/> {event.time}</span>
          <span className="flex items-center gap-1 text-purple-400 font-medium">
            <Users size={12} /> {event.attendees}
          </span>
        </div>

        {/* Buttons */}
        <div className="mt-auto flex gap-2">
          <Button 
            variant="secondary" 
            className="flex-1 text-xs py-2 h-8"
          >
            Details
          </Button>
          <Button 
            variant={event.isJoined ? "outline" : "primary"} 
            className={`flex-1 text-xs py-2 h-8 transition-all ${event.isJoined ? 'border-green-500 text-green-500 hover:bg-green-500/10' : ''}`}
            onClick={handleJoinClick}
          >
            {event.isJoined ? 'Joined' : 'Join List'}
          </Button>
        </div>
      </div>
    </div>
  );
}