import { useEffect, useState } from 'react';
import { supabase } from '../../../lib/supabase';

export function useCommunities() {
  const [communities, setCommunities] = useState([]);
  const [loading, setLoading] = useState(true);

  // --- 1. FETCH (Real) ---
  const fetchCommunities = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('communities')
        .select('*')
        .order('id', { ascending: false }); // Cele mai noi primele

      if (error) throw error;

      // Adăugăm flag-ul local 'isJoined' (implicit false pt toți, momentan)
      const dataWithStatus = data.map(c => ({ ...c, isJoined: false }));
      setCommunities(dataWithStatus);
    } catch (error) {
      console.error('Eroare la încărcare:', error);
    } finally {
      setLoading(false);
    }
  };

  // --- 2. CREATE (Real) ---
  const createCommunity = async (name, description) => {
    try {
      const { data, error } = await supabase
        .from('communities')
        .insert([{ 
          name, 
          description, 
          members_count: 1, 
          active: true 
        }])
        .select();

      if (error) throw error;

      // Reîmprospătăm lista după creare
      fetchCommunities();
      return data;
    } catch (error) {
      console.error('Eroare la creare:', error);
    }
  };

  // --- 3. JOIN (Real - Simplificat) ---
  const joinCommunity = async (id) => {
    // Găsim comunitatea curentă
    const comm = communities.find(c => c.id === id);
    if (!comm) return;

    // Calculăm noua valoare (toggle)
    const newCount = comm.isJoined ? comm.members_count - 1 : comm.members_count + 1;

    // Update Optimist (Vizual)
    setCommunities(prev => prev.map(c => 
      c.id === id ? { ...c, members_count: newCount, isJoined: !c.isJoined } : c
    ));

    // Update în Bază
    await supabase
      .from('communities')
      .update({ members_count: newCount })
      .eq('id', id);
  };

  useEffect(() => {
    fetchCommunities();
  }, []);

  return { communities, loading, createCommunity, joinCommunity };
}