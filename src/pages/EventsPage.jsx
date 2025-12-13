import React, { useState } from 'react';
import { X } from 'lucide-react';
import { Button } from '../components/ui/Button';
import EventCard from '../features/events/components/EventCard';
import InteractiveMap from '../features/events/components/InteractiveMap';

// --- DATE REALE DIN NOUL APP.JSX ---
const MOCK_EVENTS = [
  {
    id: 1,
    title: "Berlin Vibes @ Control",
    venue: "Control Club",
    address: "Strada Constantin Mille 4",
    date: "2025-10-25",
    time: "23:00",
    description: "The heart of Bucharest underground. Deep techno in the main room.",
    category: "Techno",
    coords: [44.4361, 26.0986], // Latitudine/Longitudine reale
    attendees: 342
  },
  {
    id: 2,
    title: "Sunset & Cocktails",
    venue: "Linea / Closer to the Moon",
    address: "Calea Victoriei 17",
    date: "2025-10-26",
    time: "19:00",
    description: "Rooftop sunset overlooking the Dâmbovița river and Parliament.",
    category: "Rooftop",
    coords: [44.4335, 26.0965],
    attendees: 112
  },
  {
    id: 3,
    title: "Nostalgia Retro Party",
    venue: "Expirat Halele Carol",
    address: "Strada Constantin Istrati 1",
    date: "2025-10-27",
    time: "22:00",
    description: "Dancing in a renovated industrial factory. 90s & 00s hits.",
    category: "Party",
    coords: [44.4182, 26.0962],
    attendees: 520
  },
  {
    id: 4,
    title: "Vinyl Sessions",
    venue: "Platforma Wolff",
    address: "Strada Constantin Istrati 1",
    date: "2025-10-28",
    time: "21:00",
    description: "High-fidelity sound system and minimal beats.",
    category: "Hip-Hop",
    coords: [44.4188, 26.0955],
    attendees: 85
  }
];

export default function EventsPage() {
  const [selectedEvent, setSelectedEvent] = useState(null);

  return (
    <div className="flex flex-col lg:flex-row gap-6 h-full lg:h-[calc(100vh-120px)]">
       {/* COLOANA 1: Lista de Evenimente */}
       <div className="w-full lg:w-1/3 space-y-4 overflow-y-auto pr-2 order-2 lg:order-1 h-full pb-20">
        <h3 className="text-xl font-bold mb-4 text-purple-400">Tonight in Bucharest</h3>
        {MOCK_EVENTS.map(event => (
          <EventCard key={event.id} event={event} onSelect={setSelectedEvent} />
        ))}
      </div>

       {/* COLOANA 2: Harta Interactivă */}
       <div className="w-full lg:w-2/3 h-[50vh] lg:h-full rounded-xl overflow-hidden shadow-2xl border border-gray-800 relative order-1 lg:order-2">
         {/* Pasăm selectedEvent și la hartă pentru animația de flyTo */}
         <InteractiveMap 
            events={MOCK_EVENTS} 
            selectedEvent={selectedEvent}
            onMarkerClick={setSelectedEvent} 
         />
         
         {/* Cardul Popup peste hartă (Overlay) */}
         {selectedEvent && (
           <div className="absolute bottom-4 left-4 right-4 md:left-auto md:right-4 md:w-80 bg-gray-900/95 backdrop-blur-md border border-gray-700 p-4 rounded-xl shadow-2xl animate-in slide-in-from-bottom-10 fade-in duration-300 z-[1000]">
             <div className="flex justify-between items-start">
               <div>
                 <h3 className="text-xl font-bold text-white">{selectedEvent.title}</h3>
                 <p className="text-purple-400 text-sm mb-2">{selectedEvent.venue}</p>
               </div>
               <button onClick={() => setSelectedEvent(null)} className="text-gray-500 hover:text-white"><X size={20} /></button>
             </div>
             <p className="text-gray-300 text-sm mb-4 line-clamp-2">{selectedEvent.description}</p>
             <div className="flex gap-2">
               <Button className="flex-1 text-sm py-2">Join List</Button>
             </div>
           </div>
         )}
      </div>
    </div>
  );
}