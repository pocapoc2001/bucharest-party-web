import React, { useState, useMemo } from 'react';
import { X } from 'lucide-react';
import { Button } from '../components/ui/Button';
import InteractiveMap from '../features/events/components/InteractiveMap';
import EventList from '../features/events/components/EventList';
import FilterBar from '../features/events/components/FilterBar';
import { useEvents } from '../features/events/hooks/useEvents';

export default function EventsPage() {
  const { events, loading, error } = useEvents();
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [filter, setFilter] = useState("All");

  // Logic to filter events based on the selected category
  const filteredEvents = useMemo(() => {
    if (filter === "All") return events;
    return events.filter(e => e.category === filter);
  }, [events, filter]);

  if (loading) return <div className="p-8 text-center text-gray-400">Loading party vibes...</div>;
  if (error) return <div className="p-8 text-center text-red-400">Error: {error}</div>;

  return (
    <div className="flex flex-col lg:flex-row gap-6 h-full lg:h-[calc(100vh-120px)]">
       {/* COLUMN 1: List and Filters */}
       <div className="w-full lg:w-1/3 flex flex-col order-2 lg:order-1 h-full">
         <div className="mb-2">
           <h1 className="text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-500 mb-4">
             Explore Events
           </h1>
           <FilterBar activeFilter={filter} onFilterChange={setFilter} />
         </div>
         
         <div className="flex-1 overflow-y-auto pr-2 scrollbar-thin scrollbar-thumb-gray-800">
            <EventList 
              events={filteredEvents} 
              onSelectEvent={setSelectedEvent} 
            />
         </div>
       </div>

       {/* COLUMN 2: Interactive Map */}
       <div className="w-full lg:w-2/3 h-[50vh] lg:h-full rounded-xl overflow-hidden shadow-2xl border border-gray-800 relative order-1 lg:order-2">
         <InteractiveMap 
            events={filteredEvents} 
            selectedEvent={selectedEvent}
            onMarkerClick={setSelectedEvent} 
         />
         
         {/* Map Overlay Popup */}
         {selectedEvent && (
           <div className="absolute bottom-4 left-4 right-4 md:left-auto md:right-4 md:w-80 bg-gray-900/95 backdrop-blur-md border border-gray-700 p-4 rounded-xl shadow-2xl animate-in slide-in-from-bottom-10 fade-in duration-300 z-[1000]">
             <div className="flex justify-between items-start mb-2">
               <div>
                 <h3 className="text-lg font-bold text-white">{selectedEvent.title}</h3>
                 <p className="text-purple-400 text-xs">{selectedEvent.venue}</p>
               </div>
               <button onClick={() => setSelectedEvent(null)} className="text-gray-500 hover:text-white">
                 <X size={18} />
               </button>
             </div>
             <div className="w-full h-32 rounded-lg overflow-hidden mb-3">
                <img src={selectedEvent.image} alt={selectedEvent.title} className="w-full h-full object-cover" />
             </div>
             <div className="flex gap-2">
               <Button className="flex-1 text-sm py-2">Join Event</Button>
             </div>
           </div>
         )}
      </div>
    </div>
  );
}