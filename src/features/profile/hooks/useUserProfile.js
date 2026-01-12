import { useState, useEffect } from 'react';
import { supabase } from '../../../lib/supabase';

export function useUserProfile() {
  const [user, setUser] = useState(null);
  const [tickets, setTickets] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [uploading, setUploading] = useState(false);

  useEffect(() => {
    async function fetchData() {
      try {
        setIsLoading(true);
        const { data: { session } } = await supabase.auth.getSession();

        if (!session) {
            setIsLoading(false);
            return;
        }

        const userId = session.user.id;

        // 1. Fetch User Details
        let { data: userData, error: userError } = await supabase
          .from('users')
          .select('*')
          .eq('uid', userId)
          .single();

        if (!userData) {
          // Fallback if user record doesn't exist yet
          userData = {
            uid: userId,
            email: session.user.email,
            name: session.user.user_metadata?.full_name || 'Party User',
            avatar_url: null,
            bio: 'Ready to party.',
            settings: { notifications: true, locationServices: true, publicProfile: false }
          };
        }

        setUser(userData);

        // 2. Fetch Joined Events (Tickets) via the joining table
        // We use the foreign key relationship: event_participants -> events
        const { data: participations, error: eventsError } = await supabase
          .from('event_participants')
          .select(`
            joined_at,
            events ( * )
          `)
          .eq('user_id', userId)
          .order('joined_at', { ascending: false });

        if (eventsError) throw eventsError;

        // Format data for the UI
        const formattedTickets = participations.map(p => {
          const event = p.events;
          return {
            id: p.events.uid || p.events.id, // ID of the event
            title: event.title,
            venue: event.venue,
            date: event.date,
            time: event.start_time || event.time,
            image: event.image,
            status: new Date(event.date) < new Date() ? 'Past' : 'Upcoming'
          };
        });

        setTickets(formattedTickets);

      } catch (error) {
        console.error("Failed to fetch profile:", error);
      } finally {
        setIsLoading(false);
      }
    }

    fetchData();
  }, []);

  // 3. Update Settings
  const updateSettings = async (newSettings) => {
    // Optimistic Update
    const updatedSettings = { ...user.settings, ...newSettings };
    setUser(prev => ({ ...prev, settings: updatedSettings }));

    try {
      const { error } = await supabase
        .from('users')
        .update({ settings: updatedSettings })
        .eq('uid', user.uid);

      if (error) throw error;
    } catch (err) {
      console.error("Error updating settings:", err);
    }
  };

  // 4. Upload Profile Picture
  const uploadAvatar = async (file) => {
    try {
      setUploading(true);
      const fileExt = file.name.split('.').pop();
      const fileName = `${user.uid}-${Math.random()}.${fileExt}`;
      const filePath = `${fileName}`;

      // A. Upload to Supabase Storage
      const { error: uploadError } = await supabase.storage
        .from('avatars')
        .upload(filePath, file);

      if (uploadError) throw uploadError;

      // B. Get Public URL
      const { data: { publicUrl } } = supabase.storage
        .from('avatars')
        .getPublicUrl(filePath);

      // C. Update User Table
      const { error: dbError } = await supabase
        .from('users')
        .update({ avatar_url: publicUrl })
        .eq('uid', user.uid);

      if (dbError) throw dbError;

      // Update Local State
      setUser(prev => ({ ...prev, avatar_url: publicUrl }));

    } catch (error) {
      console.error('Error uploading avatar:', error);
      alert('Error uploading image!');
    } finally {
      setUploading(false);
    }
  };

  return { user, tickets, isLoading, uploading, updateSettings, uploadAvatar };
}