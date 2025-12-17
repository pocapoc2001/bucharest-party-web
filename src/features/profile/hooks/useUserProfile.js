import { useState, useEffect } from 'react';
import { supabase } from '../../../lib/supabase';

export function useUserProfile() {
  const [user, setUser] = useState(null);
  const [tickets, setTickets] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function fetchData() {
      try {
        setIsLoading(true);

        // 1. Get Current Session (Logged in user)
        const { data: { session } } = await supabase.auth.getSession();

        let userProfile = null;
        let joinedEvents = [];

        if (session) {
          const userId = session.user.id;

          // 2. Fetch User Details from 'users' table
          const { data: userData, error: userError } = await supabase
            .from('users')
            .select('*')
            .eq('uid', userId)
            .single();

          if (userData) {
            userProfile = userData;
          } else {
            // Fallback: If user exists in Auth but not in 'users' table yet
            userProfile = {
              uid: userId,
              display_name: session.user.user_metadata?.full_name || 'Party User',
              email: session.user.email,
              faculty: 'Student', // Default
              bio: 'Ready to explore the nightlife.',
              settings: { notifications: true, locationServices: true, publicProfile: false }
            };
          }

          // 3. Fetch "Tickets" (Events the user has joined)
          // Note: In a complex app, this would be a separate 'bookings' table. 
          // For now, we query events where 'isJoined' is true.
          const { data: eventsData, error: eventsError } = await supabase
            .from('events')
            .select('*')
            .eq('isJoined', true) 
            .order('date', { ascending: true });

          if (eventsData) joinedEvents = eventsData;

        } else {
          // Guest / Not Logged In Fallback
          console.log("No active session found. Using guest defaults.");
          userProfile = {
            uid: 'guest',
            display_name: 'Guest User',
            email: 'guest@partyhub.ro',
            faculty: 'Guest',
            bio: 'Please log in to save your progress.',
            settings: {}
          };
        }

        // 4. GAMIFICATION LOGIC (Dynamic)
        // 1 Ticket = 50 XP. Level up every 100 XP.
        const totalXP = joinedEvents.length * 50;
        const currentLevel = Math.floor(totalXP / 100) + 1;

        // Merge DB data with calculated stats
        setUser({
          ...userProfile,
          // Map DB column names to what the UI expects (if they differ)
          name: userProfile.display_name || userProfile.name, 
          xp_points: totalXP,
          level: currentLevel,
          // Ensure settings object exists
          settings: userProfile.settings || { notifications: true, locationServices: true, publicProfile: false }
        });

        // Format events into "Tickets"
        const formattedTickets = joinedEvents.map(event => ({
          id: `ticket-${event.id}`,
          eventId: event.id,
          title: event.title,
          venue: event.venue,
          date: event.date,
          image: event.image,
          status: new Date(event.date) < new Date() ? 'Used' : 'Valid' // Auto-calculate status based on date
        }));

        setTickets(formattedTickets);

      } catch (error) {
        console.error("Failed to fetch profile:", error);
      } finally {
        setIsLoading(false);
      }
    }

    fetchData();
  }, []);

  // 5. Update Settings Function
  const updateSettings = async (newSettings) => {
    // Optimistic UI Update
    setUser(prev => ({
      ...prev,
      settings: { ...prev.settings, ...newSettings }
    }));

    // Database Update
    try {
      const { data: { session } } = await supabase.auth.getSession();
      if (session) {
        // Assuming your 'users' table has a 'settings' column of type JSONB
        const { error } = await supabase
          .from('users')
          .update({ settings: newSettings })
          .eq('uid', session.user.id);

        if (error) throw error;
      }
    } catch (err) {
      console.error("Error updating settings in DB:", err);
      // Optional: Revert UI state here if critical
    }
  };

  return { user, tickets, isLoading, updateSettings };
}