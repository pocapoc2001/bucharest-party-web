import React, { useState, useEffect, useRef } from 'react';
import { Send, ArrowLeft, Calendar, X, MapPin, Clock, Users, Check, User } from 'lucide-react';
import { supabase } from '../../../lib/supabase';
import { Button } from '../../../components/ui/Button';
import { useEvents } from '../../events/hooks/useEvents'; 

export default function ChatView({ community, onClose }) {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [currentUserId, setCurrentUserId] = useState(null);
  
  // Controls for Modals
  const [showEventPicker, setShowEventPicker] = useState(false);
  const [viewEvent, setViewEvent] = useState(null); 

  const messagesEndRef = useRef(null);
  const { events, toggleJoin } = useEvents(); 

  // Helper to get the LIVE version of the viewed event (so we see live updates)
  const activeEvent = viewEvent 
    ? (events.find(e => e.id === viewEvent.id) || viewEvent) 
    : null;

  // 1. Fetch User & Subscribe
  useEffect(() => {
    const getUser = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (user) setCurrentUserId(user.id);
    };
    getUser();

    // UPDATED: Fetch Messages AND User Profiles
    const fetchMessages = async () => {
      // A. Get Messages
      const { data: msgsData } = await supabase
        .from('messages')
        .select('*, events(*)') 
        .eq('community_id', community.id)
        .order('created_at', { ascending: true });
      
      if (!msgsData) return;

      // B. Get User IDs from messages
      const userIds = [...new Set(msgsData.map(m => m.user_id))];
      
      // C. Fetch User Profiles
      const { data: usersData, error } = await supabase
        .from('users')
        .select('*') // Get everything to be safe
        .in('uid', userIds);

      if (error) console.error("Error fetching profiles:", error);

      // D. Create a lookup map
      const userMap = {};
      if (usersData) {
        usersData.forEach(u => {
           // Support both 'uid' and 'id' just in case
           const key = u.uid || u.id;
           userMap[key] = u; 
        });
      }

      // E. Attach user data to messages
      const combinedMessages = msgsData.map(msg => {
        const authorProfile = userMap[msg.user_id];
        
        // Try finding ANY name that exists (full_name priority)
        const actualName = authorProfile?.full_name || authorProfile?.display_name || authorProfile?.name || 'User';
        
        return {
          ...msg,
          authorName: actualName,
          authorAvatar: authorProfile?.avatar_url
        };
      });

      setMessages(combinedMessages);
    };

    fetchMessages();

    // Realtime Subscription
    const channel = supabase
      .channel(`chat:${community.id}`)
      .on('postgres_changes', 
        { event: 'INSERT', schema: 'public', table: 'messages', filter: `community_id=eq.${community.id}` },
        () => fetchMessages()
      )
      .subscribe();

    return () => supabase.removeChannel(channel);
  }, [community.id]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  // 2. Actions
  const sendMessage = async (e) => {
    e?.preventDefault();
    if (!input.trim()) return;

    const textToSend = input;
    setInput(''); 

    // Optimistic Update
    setMessages(prev => [...prev, { 
      id: Date.now(), 
      content: textToSend, 
      user_id: currentUserId, 
      created_at: new Date().toISOString(),
      authorName: 'Me', 
      authorAvatar: null
    }]);

    await supabase.from('messages').insert({
      community_id: community.id,
      user_id: currentUserId,
      content: textToSend
    });
  };

  const shareEvent = async (eventId) => {
    await supabase.from('messages').insert({
      community_id: community.id,
      user_id: currentUserId,
      content: 'Shared an event',
      event_id: eventId
    });
    setShowEventPicker(false);
  };

  return (
    <div className="h-full flex flex-col bg-gray-900 border border-gray-800 rounded-xl overflow-hidden relative">
      {/* Header */}
      <div className="p-4 bg-gray-800 flex items-center gap-4 border-b border-gray-700">
        <button onClick={onClose} className="p-2 hover:bg-gray-700 rounded-full text-white">
          <ArrowLeft size={20} />
        </button>
        <div>
           <h3 className="font-bold text-white">{community.name}</h3>
           <p className="text-xs text-gray-400">{community.members_count} members</p>
        </div>
      </div>
      
      {/* Messages List */}
      <div className="flex-1 p-4 overflow-y-auto space-y-6">
        {messages.length === 0 && (
            <div className="text-center text-gray-500 mt-10">Be the first to say hello!</div>
        )}
        
        {messages.map((m, index) => {
          const isMe = m.user_id === currentUserId;
          // Determine if we should show the name
          const showName = !isMe && (index === 0 || messages[index - 1].user_id !== m.user_id);

          return (
            <div key={m.id} className={`flex flex-col ${isMe ? 'items-end' : 'items-start'}`}>
              
              {/* User Name & Avatar (Only for others) */}
              {showName && (
                  <div className="flex items-center gap-2 mb-1 ml-1">
                      {m.authorAvatar ? (
                          <img src={m.authorAvatar} alt="avatar" className="w-6 h-6 rounded-full object-cover border border-gray-600" />
                      ) : (
                          <div className="w-6 h-6 rounded-full bg-gray-700 flex items-center justify-center border border-gray-600">
                              <User size={12} className="text-gray-400" />
                          </div>
                      )}
                      <span className="text-[10px] text-gray-400 font-medium">
                          {m.authorName}
                      </span>
                  </div>
              )}

              {/* Event Card Message */}
              {m.event_id && m.events ? (
                 <div className={`border p-3 rounded-xl mb-1 w-64 ${isMe ? 'bg-purple-900/40 border-purple-500/50' : 'bg-gray-800 border-gray-700'}`}>
                    <img src={m.events.image} className="w-full h-24 object-cover rounded-lg mb-2"/>
                    <h4 className="font-bold text-white text-sm">{m.events.title}</h4>
                    <p className="text-xs text-gray-400 mb-2">{m.events.date}</p>
                    <Button className="w-full h-8 text-xs mt-2" onClick={() => setViewEvent(m.events)}>
                        View Event
                    </Button>
                 </div>
              ) : (
                /* Text Message */
                <div className={`max-w-[75%] p-3 rounded-2xl ${isMe ? 'bg-purple-600 text-white rounded-br-none' : 'bg-gray-800 text-gray-200 rounded-bl-none'}`}>
                    <p className="text-sm">{m.content}</p>
                </div>
              )}
              
              {/* Time */}
              <span className="text-[9px] text-gray-600 mt-0.5 px-1">
                {new Date(m.created_at).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
              </span>
            </div>
        )})}
        <div ref={messagesEndRef} />
      </div>

      {/* --- MODAL 1: EVENT PICKER --- */}
      {showEventPicker && (
          <div className="absolute bottom-20 left-4 right-4 bg-gray-800 border border-gray-700 rounded-xl p-4 shadow-xl z-10 max-h-60 overflow-y-auto">
             <div className="flex justify-between items-center mb-2">
                <h4 className="text-white text-sm font-bold">Share Event</h4>
                <button onClick={() => setShowEventPicker(false)}><X size={16} className="text-gray-400"/></button>
             </div>
             <div className="space-y-2">
                {events.map(ev => (
                    <div key={ev.id} onClick={() => shareEvent(ev.id)} className="flex items-center gap-2 p-2 hover:bg-gray-700 rounded-lg cursor-pointer">
                        <img src={ev.image} className="w-8 h-8 rounded object-cover" />
                        <span className="text-xs text-white truncate">{ev.title}</span>
                    </div>
                ))}
             </div>
          </div>
      )}

      {/* --- MODAL 2: VIEW EVENT DETAILS (RESTORED!) --- */}
      {activeEvent && (
        <div className="absolute inset-0 z-20 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
            <div className="bg-gray-900 border border-gray-700 w-full max-w-sm rounded-2xl overflow-hidden shadow-2xl relative">
                <button 
                    onClick={() => setViewEvent(null)}
                    className="absolute top-4 right-4 z-30 bg-black/50 p-2 rounded-full text-white hover:bg-black/80"
                >
                    <X size={20} />
                </button>
                <div className="h-40 w-full relative">
                    <img src={activeEvent.image} className="w-full h-full object-cover" />
                    <div className="absolute bottom-0 inset-x-0 bg-gradient-to-t from-gray-900 to-transparent h-20" />
                </div>
                <div className="p-6 pt-2">
                    <h2 className="text-xl font-bold text-white mb-2">{activeEvent.title}</h2>
                    
                    {/* DETAILS RESTORED HERE */}
                    <div className="space-y-3 mb-6">
                        <div className="flex items-center gap-3 text-gray-300 text-sm">
                            <MapPin size={16} className="text-purple-500" /> {activeEvent.venue}
                        </div>
                        <div className="flex items-center gap-3 text-gray-300 text-sm">
                            <Calendar size={16} className="text-purple-500" /> {activeEvent.date}
                        </div>
                        <div className="flex items-center gap-3 text-gray-300 text-sm">
                            <Clock size={16} className="text-purple-500" /> {activeEvent.time || activeEvent.start_time}
                        </div>
                        <div className="flex items-center gap-3 text-gray-300 text-sm">
                            <Users size={16} className="text-purple-500" /> {activeEvent.attendees} Going
                        </div>
                    </div>

                    <Button 
                        className={`w-full py-3 font-bold flex items-center justify-center gap-2 ${activeEvent.isJoined ? 'bg-green-600 hover:bg-green-700' : ''}`}
                        onClick={() => toggleJoin(activeEvent.id)}
                    >
                        {activeEvent.isJoined ? <><Check size={18} /> Going</> : "Join Event"}
                    </Button>
                </div>
            </div>
        </div>
      )}

      {/* Input Area */}
      <form onSubmit={sendMessage} className="p-4 bg-gray-800 flex gap-2 items-center border-t border-gray-700">
        <button 
            type="button" 
            onClick={() => setShowEventPicker(!showEventPicker)}
            className="p-2 text-gray-400 hover:text-purple-400 transition-colors"
        >
            <Calendar size={20} />
        </button>
        <input 
          className="flex-1 bg-gray-900 border border-gray-700 rounded-full px-4 py-2 text-white focus:outline-none focus:border-purple-500"
          value={input} 
          onChange={e => setInput(e.target.value)} 
          placeholder="Type a message..."
        />
        <Button className="rounded-full w-10 h-10 p-0 flex items-center justify-center">
          <Send size={18} />
        </Button>
      </form>
    </div>
  );
}