import { useState, useEffect } from 'react';

// --- MOCK DATA (Simulating Database) ---
const MOCK_USER = {
  id: 'u-123',
  name: 'Alexandru C.',
  email: 'alex@partyhub.ro',
  faculty: 'FILS (Foreign Languages)',
  avatarUrl: null, // null means use initials
  bio: 'Techno enthusiast and weekend warrior. Always looking for the best rooftops in Bucharest.',
  level: 5,
  settings: {
    notifications: true,
    locationServices: true,
    publicProfile: false
  }
};

const MOCK_TICKETS = [
  {
    id: 't-1',
    eventId: 1,
    title: 'Techno Bunker Night',
    venue: 'Control Club',
    date: '2025-10-25',
    status: 'Valid'
  },
  {
    id: 't-2',
    eventId: 3,
    title: 'Student Reggaeton Bash',
    venue: 'Silver Church',
    date: '2025-10-27',
    status: 'Used'
  }
];

export function useUserProfile() {
  const [user, setUser] = useState(null);
  const [tickets, setTickets] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Simulate API fetch delay
    const fetchData = async () => {
      setIsLoading(true);
      try {
        // Here you would normally fetch from Supabase
        // const { data: userData } = await supabase.from('users').select('*').single();
        
        // Simulating network delay
        await new Promise(resolve => setTimeout(resolve, 800)); 
        
        setUser(MOCK_USER);
        setTickets(MOCK_TICKETS);
      } catch (error) {
        console.error("Failed to fetch profile:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, []);

  const updateSettings = (newSettings) => {
    // Optimistic UI update
    setUser(prev => ({
      ...prev,
      settings: { ...prev.settings, ...newSettings }
    }));
    
    // In a real app, you would send a PATCH request to Supabase here
    console.log("Settings updated in DB:", newSettings);
  };

  return { user, tickets, isLoading, updateSettings };
}