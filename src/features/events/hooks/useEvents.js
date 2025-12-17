import { useState, useEffect } from 'react';
import { supabase } from '../../../lib/supabase';

export function useEvents() {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // 1. Fetch Events from Database
  useEffect(() => {
    async function fetchEvents() {
      try {
        setLoading(true);
        
        const { data, error } = await supabase
          .from('events')
          .select('*')
          .order('date', { ascending: true });

        if (error) throw error;

        // Ensure coords are correctly formatted (handles both array and string cases)
        const formattedData = data.map(event => ({
          ...event,
          // If coords comes as a string "[44, 26]", parse it. If it's already an array, leave it.
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

  // 2. Toggle Join (Updates Database)
  const toggleJoin = async (eventId) => {
    // Find event locally first
    const eventIndex = events.findIndex(e => e.id === eventId);
    if (eventIndex === -1) return;

    const event = events[eventIndex];
    const newStatus = !event.isJoined;
    // Prevent negative attendees
    const newAttendees = newStatus 
      ? (event.attendees || 0) + 1 
      : Math.max(0, (event.attendees || 0) - 1);

    // Optimistic UI Update (Instant feedback)
    const updatedEvents = [...events];
    updatedEvents[eventIndex] = { 
      ...event, 
      isJoined: newStatus, 
      attendees: newAttendees 
    };
    setEvents(updatedEvents);

    try {
      // Send update to Supabase
      const { error } = await supabase
        .from('events')
        .update({ 
          isJoined: newStatus, 
          attendees: newAttendees 
        })
        .eq('id', eventId);

      if (error) throw error;

    } catch (err) {
      console.error("Error updating join status:", err);
      // Revert UI if it fails
      setEvents(events);
      alert("Could not update status. Please check your connection.");
    }
  };

  // 3. Create Event (Inserts into Database)
  const createEvent = async (newEventData) => {
    try {
      // Ensure coords is a standard array
      const payload = {
        title: newEventData.title,
        venue: newEventData.venue,
        date: newEventData.date,
        time: newEventData.time,
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

      // Add the new event to the local list immediately
      if (data && data.length > 0) {
        setEvents(prev => [data[0], ...prev]);
      }
      
    } catch (err) {
      console.error("Error creating event:", err);
      alert("Failed to create event. See console for details.");
    }
  };

  return { events, loading, error, toggleJoin, createEvent };
}