import React from 'react';
import EventCard from './EventCard';

export default function EventList({ events, onSelectEvent, onJoinEvent }) {
  if (!events || events.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center h-64 text-gray-500 border border-dashed border-gray-800 rounded-xl p-4">
        <p>No events found for this filter.</p>
        <p className="text-sm">Try changing the Age or Vibe settings.</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 gap-4 pb-20">
      {events.map((event) => (
        <EventCard 
          key={event.id} 
          event={event} 
          onSelect={onSelectEvent} 
          onJoin={onJoinEvent}
        />
      ))}
    </div>
  );
}