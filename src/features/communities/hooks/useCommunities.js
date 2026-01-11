import { useEffect, useState } from 'react';
import { supabase } from '../../../lib/supabase';

export function useCommunities() {
  const [communities, setCommunities] = useState([]);
  const [loading, setLoading] = useState(true);

  // --- 1. FETCH ---
  const fetchCommunities = async (isBackground = false) => {
    try {
      if (!isBackground) setLoading(true);
      
      const { data: { user } } = await supabase.auth.getUser();

      // 1. Fetch Communities
      const { data: communitiesData, error } = await supabase
        .from('communities')
        .select(`*, community_members ( user_id, status )`)
        .order('id', { ascending: false });

      if (error) throw error;

      // 2. Collect Pending User IDs (Owner Only)
      let pendingUserIds = new Set();
      communitiesData.forEach(c => {
        if (c.created_by === user?.id) {
           (c.community_members || [])
            .filter(m => m.status === 'pending')
            .forEach(m => pendingUserIds.add(m.user_id));
        }
      });

      // 3. Fetch Names Only (No Email)
      let usersMap = {};
      if (pendingUserIds.size > 0) {
        const { data: usersData } = await supabase
          .from('users')
          .select('uid, display_name') // Only fetching name
          .in('uid', Array.from(pendingUserIds));
        
        if (usersData) {
            usersData.forEach(u => { usersMap[u.uid] = u; });
        }
      }

      // 4. Format Data
      const formattedData = communitiesData.map(c => {
        const members = c.community_members || [];
        const membership = members.find(m => m.user_id === user?.id);
        const validMembers = members.filter(m => m.status === 'approved');
        const isOwner = c.created_by === user?.id;

        const pendingRequests = isOwner 
          ? members
              .filter(m => m.status === 'pending')
              .map(m => {
                 const profile = usersMap[m.user_id];
                 return {
                    userId: m.user_id,
                    // Show Name or fallback
                    name: profile?.display_name || `User ${m.user_id.slice(0,5)}`
                 };
              })
          : [];

        return {
          ...c,
          members_count: validMembers.length,
          isJoined: membership?.status === 'approved',
          isPending: membership?.status === 'pending',
          isOwner, 
          pendingRequests
        };
      });

      setCommunities(formattedData);
    } catch (error) {
      console.error('Error fetching communities:', error);
    } finally {
      if (!isBackground) setLoading(false);
    }
  };

  // --- 2. MANAGE REQUESTS (Approve/Decline) ---
  const respondToRequest = async (communityId, userId, action) => {
    try {
      if (action === 'accept') {
        const { error } = await supabase
          .from('community_members')
          .update({ status: 'approved' })
          .eq('community_id', communityId)
          .eq('user_id', userId);
          
        if (error) throw error;
      } else {
        const { error } = await supabase
          .from('community_members')
          .delete()
          .eq('community_id', communityId)
          .eq('user_id', userId);
          
        if (error) throw error;
      }
      
      await fetchCommunities(true); 
    } catch (error) { 
      console.error('Error responding:', error);
      alert(`Action failed: ${error.message}`); 
    }
  };

  // --- 3. JOIN / LEAVE ---
  const joinCommunity = async (communityId, isPrivate) => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return alert("You must be logged in.");

      const existing = communities.find(c => c.id === communityId);
      
      if (existing.isJoined || existing.isPending) {
        await supabase.from('community_members').delete().eq('community_id', communityId).eq('user_id', user.id);
      } else {
        await supabase.from('community_members').insert({ 
            community_id: communityId, 
            user_id: user.id, 
            status: isPrivate ? 'pending' : 'approved' 
        });
      }
      await fetchCommunities(true); 
    } catch (error) { console.error(error); fetchCommunities(true); }
  };

  // --- 4. CREATE ---
  const createCommunity = async (name, description, isPrivate, imageFile) => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      let imageUrl = null;
      if (imageFile) {
        const filePath = `communities/${Date.now()}_${imageFile.name}`;
        await supabase.storage.from('images').upload(filePath, imageFile);
        const { data } = supabase.storage.from('images').getPublicUrl(filePath);
        imageUrl = data.publicUrl;
      }
      const { data, error } = await supabase
        .from('communities')
        .insert([{ 
          name, description, is_private: isPrivate, created_by: user.id, active: true, image: imageUrl 
        }])
        .select().single();
      
      if (error) throw error;
      await supabase.from('community_members').insert({ community_id: data.id, user_id: user.id, status: 'approved' });
      fetchCommunities(true);
      return data;
    } catch (error) { console.error(error); throw error; }
  };

  // --- 5. DELETE & UPDATE ---
  const deleteCommunity = async (communityId) => {
    if (!window.confirm("Are you sure?")) return;
    try {
      await supabase.from('communities').delete().eq('id', communityId);
      setCommunities(prev => prev.filter(c => c.id !== communityId));
    } catch (error) { alert("Delete failed."); }
  };

  const updateCommunity = async (communityId, updates, imageFile) => {
    try {
      let imageUrl = updates.image;
      if (imageFile) {
        const filePath = `communities/${Date.now()}_${imageFile.name}`;
        await supabase.storage.from('images').upload(filePath, imageFile);
        const { data } = supabase.storage.from('images').getPublicUrl(filePath);
        imageUrl = data.publicUrl;
      }
      const { error } = await supabase
        .from('communities')
        .update({ name: updates.name, description: updates.description, is_private: updates.isPrivate, image: imageUrl })
        .eq('id', communityId);

      if (error) throw error;
      await fetchCommunities(true);
    } catch (error) { alert("Update failed."); }
  };

  useEffect(() => { fetchCommunities(); }, []);

  return { 
    communities, loading, 
    createCommunity, joinCommunity, deleteCommunity, 
    respondToRequest, updateCommunity 
  };
}