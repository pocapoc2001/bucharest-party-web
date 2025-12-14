import { useState, useEffect } from 'react';
// import { supabase } from '../../../lib/supabaseClient'; // Uncomment when Supabase is ready

export function useEvents() {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    async function fetchEvents() {
      try {
        setLoading(true);
        
        // --- REAL SUPABASE IMPLEMENTATION ---
        // const { data, error } = await supabase
        //   .from('events')
        //   .select('*')
        //   .order('date', { ascending: true });
        
        // if (error) throw error;
        // setEvents(data);

        // --- MOCK DATA (For development) ---
        const mockData = [
          {
            id: 1,
            title: "Berlin Vibes @ Control",
            venue: "Control Club",
            date: "2025-10-25",
            time: "23:00",
            image: "https://external-content.duckduckgo.com/iu/?u=https%3A%2F%2Fwww.whiteevents.ie%2Fwp-content%2Fuploads%2F2018%2F02%2FWhite-events-party-planner-designs.jpg&f=1&nofb=1&ipt=1e436e79ee98219c6fd30fe541f4d0ac34ed900dc9fb94511076864f273b4e02",
            category: "Techno",
            coords: [44.4361, 26.0986],
            attendees: 342
          },
          {
            id: 2,
            title: "Sunset & Cocktails",
            venue: "Linea / Closer to the Moon",
            date: "2025-10-26",
            time: "19:00",
            image: "https://external-content.duckduckgo.com/iu/?u=https%3A%2F%2Fmybartender.com%2Fwp-content%2Fuploads%2F2023%2F09%2FSunset-cocktails-720x405.jpg&f=1&nofb=1&ipt=f2cf4cbc1bfe8d0b29112cbdd1a4386daceef529b81a34159b7bf0bb5a76c4fc",
            category: "Rooftop",
            coords: [44.4335, 26.0965],
            attendees: 112
          },
          {
            id: 3,
            title: "Latino Fever",
            venue: "El Dictador",
            date: "2025-10-27",
            time: "22:00",
            image: "https://external-content.duckduckgo.com/iu/?u=https%3A%2F%2Fpalladium.pl%2Fwp-content%2Fuploads%2F2023%2F09%2Flatino-party-1730x1080.jpg&f=1&nofb=1&ipt=12641466cdf48cfce3310df4eb277c31ed401ce1c9b64a7454d10dabf527e8f5",
            category: "Latino",
            coords: [44.4350, 26.1010],
            attendees: 215
          }
        ];
        
        // Simulate network delay
        setTimeout(() => {
          setEvents(mockData);
          setLoading(false);
        }, 500);

      } catch (err) {
        setError(err.message);
        setLoading(false);
      }
    }

    fetchEvents();
  }, []);

  return { events, loading, error };
}