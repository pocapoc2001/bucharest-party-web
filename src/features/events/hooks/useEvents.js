import { useState, useEffect } from 'react';
import { supabase } from '../../../lib/supabase';

export function useEvents() {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // 1. Fetch Events
  useEffect(() => {
    async function fetchEvents() {
      try {
        setLoading(true);
        const { data, error } = await supabase
          .from('events')
          .select('*')
          .order('date', { ascending: true });

        if (error) throw error;

        const formattedData = data.map(event => ({
          ...event,
          id: event.uid || event.id, 
          // Map DB 'start_time' back to 'time' for the UI if needed
          time: event.start_time || event.time, 
          coords: typeof event.coords === 'string' ? JSON.parse(event.coords) : event.coords
        }));

        setEvents(formattedData);
      } catch (err) {
        console.error("Error fetching events:", err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }

    fetchEvents();
  }, []);

  // 2. Toggle Join
  const toggleJoin = async (eventId) => {
    const eventIndex = events.findIndex(e => e.id === eventId);
    if (eventIndex === -1) return;

    const event = events[eventIndex];
    const newStatus = !event.isJoined;
    const newAttendees = newStatus 
      ? (event.attendees || 0) + 1 
      : Math.max(0, (event.attendees || 0) - 1);

    const updatedEvents = [...events];
    updatedEvents[eventIndex] = { ...event, isJoined: newStatus, attendees: newAttendees };
    setEvents(updatedEvents);

    try {
      const { error } = await supabase
        .from('events')
        .update({ isJoined: newStatus, attendees: newAttendees })
        .eq('uid', eventId);

      if (error) throw error;
    } catch (err) {
      console.error("Error updating join status:", err);
      setEvents(events);
      alert("Could not update status. Please check your connection.");
    }
  };

  // 3. Create Event (Fixed Column Mapping & Error Handling)
  const createEvent = async (newEventData) => {
    try {
      // FIX: Map 'time' to 'start_time' to match your DB Schema constraint
      const payload = {
        title: newEventData.title,
        venue: newEventData.venue,
        date: newEventData.date,
        start_time: newEventData.time, // <--- CHANGED THIS LINE
        category: newEventData.category,
        ageGroup: newEventData.ageGroup,
        image: newEventData.image,
        coords: newEventData.coords, 
        attendees: 0,
        isJoined: false
      };

      const { data, error } = await supabase
        .from('events')
        .insert([payload])
        .select();

      if (error) throw error;

      // Success! Update local state
      if (data && data.length > 0) {
        const createdEvent = {
          ...data[0],
          id: data[0].uid || data[0].id,
          time: data[0].start_time, // Map back for UI consistency
          coords: typeof data[0].coords === 'string' ? JSON.parse(data[0].coords) : data[0].coords
        };
        setEvents(prev => [createdEvent, ...prev]);
        return createdEvent; // Return the event so the page knows it succeeded
      }
      
    } catch (err) {
      console.error("Error creating event:", err);
      alert(`Failed to create event: ${err.message}`);
      return null; // Return null to indicate failure
    }
  };

  return { events, loading, error, toggleJoin, createEvent };
}