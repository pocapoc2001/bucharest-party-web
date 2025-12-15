import { useState, useEffect } from 'react';

let MOCK_DATA_nv = [
  {
    id: 1,
    title: "Berlin Vibes @ Control",
    venue: "Control Club",
    date: "2025-10-25",
    time: "23:00",
    image: "https://images.unsplash.com/photo-1598387993441-a364f854c3e1?q=80&w=500&auto=format&fit=crop",
    category: "Techno",
    ageGroup: "Student", // New Field
    coords: [44.4361, 26.0986],
    attendees: 342,
    isJoined: false // New Field
  },
  {
    id: 2,
    title: "Sunset & Cocktails",
    venue: "Linea / Closer to the Moon",
    date: "2025-10-26",
    time: "19:00",
    image: "https://external-content.duckduckgo.com/iu/?u=https%3A%2F%2Fmybartender.com%2Fwp-content%2Fuploads%2F2023%2F09%2FSunset-cocktails-720x405.jpg&f=1&nofb=1&ipt=f2cf4cbc1bfe8d0b29112cbdd1a4386daceef529b81a34159b7bf0bb5a76c4fc",
    category: "Rooftop",
    ageGroup: "Adults",
    coords: [44.4335, 26.0965],
    attendees: 112,
    isJoined: false
  },
  {
    id: 3,
    title: "Latino Fever",
    venue: "El Dictador",
    date: "2025-10-27",
    time: "22:00",
    image: "https://external-content.duckduckgo.com/iu/?u=https%3A%2F%2Fpalladium.pl%2Fwp-content%2Fuploads%2F2023%2F09%2Flatino-party-1730x1080.jpg&f=1&nofb=1&ipt=12641466cdf48cfce3310df4eb277c31ed401ce1c9b64a7454d10dabf527e8f5",
    category: "Latino",
    ageGroup: "Young Adults",
    coords: [44.4350, 26.1010],
    attendees: 215,
    isJoined: false
  },
  {
    id: 4,
    title: "Retro Nostalgia",
    venue: "Expirat",
    date: "2025-10-28",
    time: "21:00",
    image: "https://external-content.duckduckgo.com/iu/?u=https%3A%2F%2Fimg.freepik.com%2Fpremium-photo%2Fvintage-nostalgia-retro-revival-34xjpg_835197-15114.jpg&f=1&nofb=1&ipt=8684a6122084d1badc3fb17a4f60e1a1fbc0a1418cbd450532c1f712beaa91d0",
    category: "Party",
    ageGroup: "Old School",
    coords: [44.4182, 26.0962],
    attendees: 520,
    isJoined: true // Simulating one already joined
  },
  {
    id: 5,
    title: "Underground Bass",
    venue: "Guesthouse",
    date: "2025-10-29",
    time: "23:59",
    image: "https://external-content.duckduckgo.com/iu/?u=https%3A%2F%2Fi.ytimg.com%2Fvi%2FuMfmxbvp0AU%2Fmaxresdefault.jpg&f=1&nofb=1&ipt=9576c281b9e840a9c7bc4096eba04e4a070c60302590165df88ca93a2a54b309",
    category: "Techno",
    ageGroup: "Student",
    coords: [44.4560, 26.1100],
    attendees: 88,
    isJoined: false
  }
];

export function useEvents() {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    // Simulate Fetch
    setTimeout(() => {
      setEvents(MOCK_DATA_nv);
      setLoading(false);
    }, 500);
  }, []);

  const toggleJoin = (eventId) => {
    setEvents(prev => {
      const updated = prev.map(e => e.id === eventId ? { ...e, isJoined: !e.isJoined } : e);
      MOCK_DATA_nv = updated; // Sync with memory
      return updated;
    });
  };

  // --- CREATE EVENT FUNCTION ---
  const createEvent = async (newEvent) => {
    return new Promise((resolve) => {
      setTimeout(() => {
        const eventWithId = { 
          ...newEvent, 
          id: Date.now(),
          attendees: 0,
          isJoined: true 
        };
        // Add new event to the beginning of the list
        MOCK_DATA_nv = [eventWithId, ...MOCK_DATA_nv]; 
        setEvents(MOCK_DATA_nv);
        resolve(eventWithId);
      }, 1000);
    });
  };

  return { events, loading, error, toggleJoin, createEvent };
}