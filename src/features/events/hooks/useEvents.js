import { useState, useEffect } from 'react';
import { supabase } from '../../../lib/supabase';

export function useEvents() {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [session, setSession] = useState(null);

  // 1. Fetch Session & Events with Live Counts
  useEffect(() => {
    async function initData() {
      try {
        setLoading(true);
        
        // A. Get User Session
        const { data: { session: currentSession } } = await supabase.auth.getSession();
        setSession(currentSession);

        // B. Fetch Events + Dynamic Participant Count
        // We use 'event_participants(count)' to get the live number of people joined
        const { data: eventsData, error: eventsError } = await supabase
          .from('events')
          .select(`
            *,
            event_participants (count)
          `)
          .order('date', { ascending: true });

        if (eventsError) throw eventsError;

        // C. If Logged In, Fetch User's Specific Participations (to know "Is Joined")
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
        const formattedData = eventsData.map(event => {
          // Extract count from the nested object returned by Supabase
          // It usually looks like: event_participants: [{ count: 5 }]
          const liveCount = event.event_participants?.[0]?.count || 0;

          return {
            ...event,
            id: event.uid || event.id,
            time: event.start_time || event.time, 
            coords: typeof event.coords === 'string' ? JSON.parse(event.coords) : event.coords,
            
            // USE DYNAMIC COUNT (Ignore DB column)
            attendees: liveCount,
            
            // CHECK "IS JOINED"
            isJoined: userParticipations.has(event.uid || event.id) 
          };
        });

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

    // Optimistic UI Update (Update screen instantly)
    setEvents(prev => prev.map(e => {
      if (e.id === eventId) {
        return { ...e, isJoined: true, attendees: (e.attendees || 0) + 1 };
      }
      return e;
    }));

    try {
      // Insert into participants table
      const { error: joinError } = await supabase
        .from('event_participants')
        .insert([{ user_id: session.user.id, event_id: eventId }]);

      if (joinError) throw joinError;
      // No need to update 'events' table anymore!

    } catch (err) {
      console.error("Join failed:", err);
      // Revert UI on error
      setEvents(prev => prev.map(e => {
        if (e.id === eventId) {
          return { ...e, isJoined: false, attendees: Math.max(0, (e.attendees || 1) - 1) };
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
      // Remove from participants table
      const { error: leaveError } = await supabase
        .from('event_participants')
        .delete()
        .match({ user_id: session.user.id, event_id: eventId });

      if (leaveError) throw leaveError;

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

  // 4. NEW HELPER: Toggle Join
  const toggleJoin = (eventId) => {
    const event = events.find(e => e.id === eventId);
    if (!event) return; 

    if (event.isJoined) {
      leaveEvent(eventId);
    } else {
      joinEvent(eventId);
    }
  };

  // 5. Create Event
  const createEvent = async (newEventData) => {
    try {
      const { data: { session: currentSession } } = await supabase.auth.getSession();
      if (!currentSession) throw new Error("Must be logged in");

      const payload = {
        title: newEventData.title,
        venue: newEventData.venue,
        date: newEventData.date,
        start_time: newEventData.time,
        category: newEventData.category,
        ageGroup: newEventData.ageGroup,
        image: newEventData.image,
        coords: newEventData.coords, 
        attendees: 0 // Default for new event
      };

      const { data, error } = await supabase
        .from('events')
        .insert([payload])
        .select()
        .single();

      if (error) throw error;

      const createdEvent = {
        ...data,
        id: data.uid || data.id,
        time: data.start_time,
        coords: typeof data.coords === 'string' ? JSON.parse(data.coords) : data.coords,
        isJoined: false,
        attendees: 0
      };
      
      setEvents(prev => [createdEvent, ...prev]);
      return createdEvent;
      
    } catch (err) {
      console.error("Error creating event:", err);
      return null;
    }
  };

  return { events, loading, error, joinEvent, leaveEvent, toggleJoin, createEvent, user: session?.user };
}