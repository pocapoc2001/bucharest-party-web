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

        // Format data for the UI
        const formattedData = data.map(event => ({
          ...event,
          // UI expects 'id', so we map your DB's 'uid' to 'id'
          id: event.uid || event.id, 
          // Handle coords whether they come as string or JSON array
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
        .eq('uid', eventId); // Changed 'id' to 'uid' to match your schema

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
        isJoined: false // Default state
      };

      const { data, error } = await supabase
        .from('events')
        .insert([payload])
        .select();

      if (error) throw error;

      // Add the new event to the local list immediately
      if (data && data.length > 0) {
        const createdEvent = data[0];
        
        // Format the new event to match UI structure
        const formattedEvent = {
          ...createdEvent,
          id: createdEvent.uid || createdEvent.id,
          coords: typeof createdEvent.coords === 'string' ? JSON.parse(createdEvent.coords) : createdEvent.coords
        };

        setEvents(prev => [formattedEvent, ...prev]);
        return formattedEvent;
      }
      
    } catch (err) {
      console.error("Error creating event:", err);
      alert("Failed to create event. See console for details.");
    }
  };

  return { events, loading, error, toggleJoin, createEvent };
}