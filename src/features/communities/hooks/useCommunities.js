import { useEffect, useState } from 'react';
import { supabase } from '../../../lib/supabase';
import { getUser } from '../../../lib/auth';

export function useCommunities() {
  const [communities, setCommunities] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentUser, setCurrentUser] = useState(null);

  useEffect(() => {
    getUser().then(u => setCurrentUser(u));
  }, []);

  // --- 1. FETCH (Now checks 'status') ---
  const fetchCommunities = async () => {
    try {
      setLoading(true);
      const user = await getUser();

      // A. Get all communities
      const { data: allComm, error: commError } = await supabase
        .from('communities')
        .select('*')
        .order('id', { ascending: false });

      if (commError) throw commError;

      // B. Get MY memberships (Map ID -> Status)
      let myStatusMap = {};
      if (user) {
        const { data: members } = await supabase
          .from('community_members')
          .select('community_id, status')
          .eq('user_id', user.id);
        
        if (members) {
          members.forEach(m => {
            myStatusMap[m.community_id] = m.status; // 'approved' or 'pending'
          });
        }
      }

      // C. Merge data
      const dataWithStatus = allComm.map(c => ({
        ...c,
        // Status is: 'approved', 'pending', or null (not joined)
        membershipStatus: myStatusMap[c.id] || null 
      }));

      setCommunities(dataWithStatus);
    } catch (error) {
      console.error('Error loading communities:', error);
    } finally {
      setLoading(false);
    }
  };

  // --- 2. CREATE ---
  const createCommunity = async (name, description, category = 'General') => {
    try {
      if (!currentUser) return alert("You must be logged in!");

      const { data, error } = await supabase
        .from('communities')
        .insert([{ 
          name, 
          description, 
          category, 
          created_by: currentUser.id,
          members_count: 1, 
          active: true,
          is_private: false // Default to Public for now
        }])
        .select()
        .single();

      if (error) throw error;

      if (data) {
        await supabase.from('community_members').insert({
          community_id: data.id,
          user_id: currentUser.id,
          role: 'admin',
          status: 'approved' // Creator is always approved
        });
        fetchCommunities();
        return data;
      }
    } catch (error) {
      console.error('Error creating community:', error);
      throw error;
    }
  };

  // --- 3. JOIN (Handles Private Logic) ---
  const joinCommunity = async (communityId) => {
    if (!currentUser) return alert("Please log in.");

    const comm = communities.find(c => c.id === communityId);
    if (!comm) return;

    try {
      // IF JOINED (Approved or Pending) -> LEAVE (Cancel Request)
      if (comm.membershipStatus) {
        const { error } = await supabase
          .from('community_members')
          .delete()
          .eq('community_id', communityId)
          .eq('user_id', currentUser.id);

        if (error) throw error;
        
        // Only decrement count if they were fully approved
        if (comm.membershipStatus === 'approved') {
           await supabase.rpc('decrement_members', { row_id: communityId }); 
           // (Fallback manual update if RPC missing)
           await supabase.from('communities')
             .update({ members_count: Math.max(0, comm.members_count - 1) })
             .eq('id', communityId);
        }

      } else {
        // IF NOT JOINED -> JOIN (or REQUEST)
        const newStatus = comm.is_private ? 'pending' : 'approved';

        const { error } = await supabase
          .from('community_members')
          .insert({ 
            community_id: communityId, 
            user_id: currentUser.id,
            status: newStatus
          });

        if (error) throw error;

        // Only increment count if instant join
        if (newStatus === 'approved') {
           await supabase.from('communities')
             .update({ members_count: comm.members_count + 1 })
             .eq('id', communityId);
        }
      }

      fetchCommunities(); // Refresh UI

    } catch (error) {
      console.error("Join/Leave error:", error);
    }
  };

  useEffect(() => { fetchCommunities(); }, [currentUser]);

  return { communities, loading, createCommunity, joinCommunity, currentUser };
}