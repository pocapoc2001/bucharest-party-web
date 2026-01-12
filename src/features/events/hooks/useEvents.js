import { useState, useEffect } from 'react';
import { supabase } from '../../../lib/supabase';

export function useEvents() {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [session, setSession] = useState(null);

  // 1. Fetch Session & Events
  useEffect(() => {
    async function initData() {
      try {
        setLoading(true);
        
        // A. Get User Session
        const { data: { session: currentSession } } = await supabase.auth.getSession();
        setSession(currentSession);

        // B. Fetch All Events
        const { data: eventsData, error: eventsError } = await supabase
          .from('events')
          .select('*')
          .order('date', { ascending: true });

        if (eventsError) throw eventsError;

        // C. If Logged In, Fetch Participation
        let userParticipations = new Set();
        if (currentSession?.user) {
          const { data: participantsData } = await supabase
            .from('event_participants')
            .select('event_id')
            .eq('user_id', currentSession.user.id);
            
          if (participantsData) {
            participantsData.forEach(p => userParticipations.add(p.event_id));
          }
        }

        // D. Merge Data
        const formattedData = eventsData.map(event => ({
          ...event,
          id: event.uid || event.id, // Handle potential inconsistent ID naming
          time: event.start_time || event.time, 
          coords: typeof event.coords === 'string' ? JSON.parse(event.coords) : event.coords,
          // Set isJoined based on the participants table, NOT the event column
          isJoined: userParticipations.has(event.uid || event.id) 
        }));

        setEvents(formattedData);
      } catch (err) {
        console.error("Error initializing events:", err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }

    initData();
  }, []);

  // 2. Action: Join Event
  const joinEvent = async (eventId) => {
    if (!session) {
      alert("You must be logged in to join events!");
      return;
    }

    // Optimistic UI Update
    setEvents(prev => prev.map(e => {
      if (e.id === eventId) {
        return { ...e, isJoined: true, attendees: (e.attendees || 0) + 1 };
      }
      return e;
    }));

    try {
      // A. Add to participants table
      const { error: joinError } = await supabase
        .from('event_participants')
        .insert([{ user_id: session.user.id, event_id: eventId }]);

      if (joinError) throw joinError;

      // B. Increment count using RPC (Safe Database Function)
      // If you didn't create the function, use a simple update query here instead.
      await supabase.rpc('update_attendees', { event_row_id: eventId, increment_num: 1 });

    } catch (err) {
      console.error("Join failed:", err);
      // Revert UI on error
      setEvents(prev => prev.map(e => {
        if (e.id === eventId) {
          return { ...e, isJoined: false, attendees: (e.attendees || 1) - 1 };
        }
        return e;
      }));
      alert("Failed to join event. Please try again.");
    }
  };

  // 3. Action: Leave Event
  const leaveEvent = async (eventId) => {
    if (!session) return;

    // Optimistic UI Update
    setEvents(prev => prev.map(e => {
      if (e.id === eventId) {
        return { ...e, isJoined: false, attendees: Math.max(0, (e.attendees || 1) - 1) };
      }
      return e;
    }));

    try {
      // A. Remove from participants table
      const { error: leaveError } = await supabase
        .from('event_participants')
        .delete()
        .match({ user_id: session.user.id, event_id: eventId });

      if (leaveError) throw leaveError;

      // B. Decrement count
      await supabase.rpc('update_attendees', { event_row_id: eventId, increment_num: -1 });

    } catch (err) {
      console.error("Leave failed:", err);
      // Revert UI
      setEvents(prev => prev.map(e => {
        if (e.id === eventId) {
          return { ...e, isJoined: true, attendees: (e.attendees || 0) + 1 };
        }
        return e;
      }));
    }
  };

  return { events, loading, error, joinEvent, leaveEvent, user: session?.user };
}