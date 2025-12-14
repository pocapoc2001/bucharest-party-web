import React from 'react';
import EventCard from './EventCard';

export default function EventList({ events, onSelectEvent }) {
  if (!events || events.length === 0) {
    return <div className="text-gray-500 text-center py-10">No events found in this category.</div>;
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-1 gap-4 pb-20">
      {events.map((event) => (
        <EventCard 
          key={event.id} 
          event={event} 
          onSelect={onSelectEvent} 
        />
      ))}
    </div>
  );
}