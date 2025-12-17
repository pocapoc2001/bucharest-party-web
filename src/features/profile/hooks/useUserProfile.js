import { useState, useEffect } from 'react';

// --- MOCK DATA (Simulare) ---
const MOCK_USER_BASE = {
  id: 'u-123',
  name: 'Alexandru C.',
  email: 'alex@partyhub.ro',
  faculty: 'FILS (Foreign Languages)',
  avatarUrl: null,
  bio: 'Techno enthusiast and weekend warrior. Looking for the best rooftops.',
  // Level și XP vor fi calculate dinamic mai jos
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
  },
  {
    id: 't-3',
    eventId: 4,
    title: 'Retro Party',
    venue: 'Expirat',
    date: '2025-11-01',
    status: 'Valid'
  }
];

export function useUserProfile() {
  const [user, setUser] = useState(null);
  const [tickets, setTickets] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      try {
        await new Promise(resolve => setTimeout(resolve, 600)); // Simulare delay rețea
        
        // GAMIFICATION LOGIC: Calculăm XP și Level bazat pe bilete
        // 1 Bilet = 50 XP
        // Level up la fiecare 100 XP
        const totalXP = MOCK_TICKETS.length * 50;
        const currentLevel = Math.floor(totalXP / 100) + 1;

        const enhancedUser = {
            ...MOCK_USER_BASE,
            xp_points: totalXP,
            level: currentLevel
        };

        setUser(enhancedUser);
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
    setUser(prev => ({
      ...prev,
      settings: { ...prev.settings, ...newSettings }
    }));
    console.log("Settings updated (Mock):", newSettings);
  };

  return { user, tickets, isLoading, updateSettings };
}