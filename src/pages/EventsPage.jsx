import React, { useState, useMemo } from 'react';
import { X, CheckCircle2, Plus } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { Button } from '../components/ui/Button';
import InteractiveMap from '../features/events/components/InteractiveMap';
import EventList from '../features/events/components/EventList';
import FilterBar from '../features/events/components/FilterBar';
import { useEvents } from '../features/events/hooks/useEvents';

export default function EventsPage() {
  const navigate = useNavigate();
  const { events, loading, error, toggleJoin } = useEvents();
  const [selectedEvent, setSelectedEvent] = useState(null);
  
  // Filter States
  const [categoryFilter, setCategoryFilter] = useState("All");
  const [ageFilter, setAgeFilter] = useState("Any Age");

  // Advanced Filtering Logic
  const filteredEvents = useMemo(() => {
    return events.filter(event => {
      const matchCategory = categoryFilter === "All" || event.category === categoryFilter;
      const matchAge = ageFilter === "Any Age" || event.ageGroup === ageFilter;
      return matchCategory && matchAge;
    });
  }, [events, categoryFilter, ageFilter]);

  if (loading) return (
    <div className="flex flex-col items-center justify-center h-full gap-4">
      <div className="flex items-end gap-1 h-8">
        <span className="w-1.5 bg-purple-500 rounded-full animate-[music-wave_1s_ease-in-out_infinite] h-4"></span>
        <span className="w-1.5 bg-purple-500 rounded-full animate-[music-wave_1.2s_ease-in-out_infinite_0.1s] h-8"></span>
        <span className="w-1.5 bg-purple-500 rounded-full animate-[music-wave_0.8s_ease-in-out_infinite_0.2s] h-6"></span>
        <span className="w-1.5 bg-purple-500 rounded-full animate-[music-wave_1.1s_ease-in-out_infinite_0.3s] h-5"></span>
        <span className="w-1.5 bg-purple-500 rounded-full animate-[music-wave_0.9s_ease-in-out_infinite_0.4s] h-7"></span>
      </div>
      <p className="text-purple-400 text-sm font-medium animate-pulse">Loading nightlife data...</p>
    </div>
  );
  
  if (error) return <div className="text-red-500 p-8">Error loading events: {error}</div>;

  return (
    <div className="flex flex-col lg:flex-row gap-6 h-full lg:h-[calc(100vh-120px)] relative">
       {/* COLUMN 1: List and Filters */}
       <div className="w-full lg:w-1/3 flex flex-col order-2 lg:order-1 h-full">
         <div className="mb-2">
           <h1 className="text-2xl font-bold text-white mb-4">
             Discover Events
           </h1>
           
           {/* Enhanced Filter Bar */}
           <FilterBar 
             activeCategory={categoryFilter} 
             onCategoryChange={setCategoryFilter}
             activeAge={ageFilter}
             onAgeChange={setAgeFilter}
           />
         </div>
         
         <div className="flex-1 overflow-y-auto pr-2 scrollbar-thin scrollbar-thumb-gray-800 pb-20">
            <EventList 
              events={filteredEvents} 
              onSelectEvent={setSelectedEvent}
              onJoinEvent={toggleJoin} 
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
         
         {/* Enhanced Map Popup Overlay */}
         {selectedEvent && (
           <div className="absolute bottom-4 left-4 right-4 md:left-auto md:right-4 md:w-96 bg-gray-900/95 backdrop-blur-xl border border-gray-700 p-0 rounded-xl shadow-2xl animate-in slide-in-from-bottom-10 fade-in duration-300 z-[1000] overflow-hidden">
             
             {/* Popup Header Image */}
             <div className="h-24 w-full relative">
               <img src={selectedEvent.image} className="w-full h-full object-cover" alt={selectedEvent.title} />
               <button 
                 onClick={() => setSelectedEvent(null)} 
                 className="absolute top-2 right-2 bg-black/50 p-1 rounded-full text-white hover:bg-red-500 transition-colors"
               >
                 <X size={16} />
               </button>
               <div className="absolute bottom-2 left-2 flex gap-2">
                 <span className="text-[10px] bg-purple-600 text-white px-2 py-0.5 rounded font-bold uppercase">{selectedEvent.category}</span>
                 <span className="text-[10px] bg-blue-600 text-white px-2 py-0.5 rounded font-bold uppercase">{selectedEvent.ageGroup}</span>
               </div>
             </div>

             <div className="p-4">
               <h3 className="text-lg font-bold text-white mb-1">{selectedEvent.title}</h3>
               <p className="text-gray-400 text-sm mb-4">{selectedEvent.venue}</p>
               
               <div className="flex gap-2">
                 <Button 
                   className={`flex-1 py-2 text-sm ${selectedEvent.isJoined ? 'bg-green-600 hover:bg-green-700' : ''}`}
                   onClick={() => toggleJoin(selectedEvent.id)}
                 >
                   {selectedEvent.isJoined ? (
                     <span className="flex items-center gap-2"><CheckCircle2 size={16}/> I'm Going</span>
                   ) : (
                     "Join Party"
                   )}
                 </Button>
               </div>
             </div>
           </div>
         )}
      </div>

      {/* --- FLOATING ACTION BUTTON (Create Event) --- */}
      <button
        onClick={() => navigate('/create-event')}
        className="absolute bottom-6 right-6 md:bottom-8 md:right-8 w-14 h-14 bg-gradient-to-r from-purple-600 to-pink-600 rounded-full flex items-center justify-center text-white shadow-lg shadow-purple-500/40 hover:scale-110 transition-transform z-[500] group"
        title="Create New Event"
      >
        <Plus size={32} className="group-hover:rotate-90 transition-transform duration-300" />
      </button>

    </div>
  );
}