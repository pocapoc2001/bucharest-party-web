import React, { useState, useEffect, useRef } from 'react';
import { Send, ArrowLeft, Calendar, X, MapPin, Clock, Users, Check } from 'lucide-react'; // Added icons
import { supabase } from '../../../lib/supabase';
import { Button } from '../../../components/ui/Button';
import { useEvents } from '../../events/hooks/useEvents'; 

export default function ChatView({ community, onClose }) {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [currentUserId, setCurrentUserId] = useState(null);
  
  // Controls for Modals
  const [showEventPicker, setShowEventPicker] = useState(false);
  const [viewEvent, setViewEvent] = useState(null); // STATE: Holds the event being viewed

  const messagesEndRef = useRef(null);
  const { events, toggleJoin } = useEvents(); // Get events and join logic

  // 1. Fetch User & Subscribe
  useEffect(() => {
    const getUser = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (user) setCurrentUserId(user.id);
    };
    getUser();

    const fetchMessages = async () => {
      const { data } = await supabase
        .from('messages')
        .select('*, events(*)') 
        .eq('community_id', community.id)
        .order('created_at', { ascending: true });
      
      if (data) setMessages(data);
    };

    fetchMessages();

    const channel = supabase
      .channel(`chat:${community.id}`)
      .on('postgres_changes', 
        { event: 'INSERT', schema: 'public', table: 'messages', filter: `community_id=eq.${community.id}` },
        (payload) => {
           fetchMessages(); 
        }
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
      created_at: new Date().toISOString() 
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

  // LOGIC: Open Event Details
  const handleOpenEvent = (sharedEventData) => {
    // 1. Try to find the event in our 'useEvents' list (to get live state/join function)
    const liveEvent = events.find(e => e.id === sharedEventData.uid || e.id === sharedEventData.id);
    
    // 2. If found, use live data. If not (maybe stale), use the data from the message.
    setViewEvent(liveEvent || sharedEventData);
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
      <div className="flex-1 p-4 overflow-y-auto space-y-4">
        {messages.length === 0 && (
            <div className="text-center text-gray-500 mt-10">Be the first to say hello!</div>
        )}
        
        {messages.map(m => {
          const isMe = m.user_id === currentUserId;
          return (
            <div key={m.id} className={`flex flex-col ${isMe ? 'items-end' : 'items-start'}`}>
              
              {/* Event Card Message */}
              {m.event_id && m.events ? (
                 <div className={`border p-3 rounded-xl mb-1 w-64 ${isMe ? 'bg-purple-900/40 border-purple-500/50' : 'bg-gray-800 border-gray-700'}`}>
                    <img src={m.events.image} className="w-full h-24 object-cover rounded-lg mb-2"/>
                    <h4 className="font-bold text-white text-sm">{m.events.title}</h4>
                    <p className="text-xs text-gray-400 mb-2">{m.events.date}</p>
                    
                    {/* VIEW EVENT BUTTON - NOW WIRED UP */}
                    <Button 
                        className="w-full h-8 text-xs mt-2"
                        onClick={() => handleOpenEvent(m.events)}
                    >
                        View Event
                    </Button>
                 </div>
              ) : (
                /* Text Message */
                <div className={`max-w-[75%] p-3 rounded-2xl ${isMe ? 'bg-purple-600 text-white rounded-br-none' : 'bg-gray-800 text-gray-200 rounded-bl-none'}`}>
                    <p className="text-sm">{m.content}</p>
                </div>
              )}
              
              <span className="text-[10px] text-gray-500 mt-1 px-1">
                {new Date(m.created_at).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
              </span>
            </div>
        )})}
        <div ref={messagesEndRef} />
      </div>

      {/* --- MODAL 1: EVENT PICKER (To Share) --- */}
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

      {/* --- MODAL 2: VIEW EVENT DETAILS (New!) --- */}
      {viewEvent && (
        <div className="absolute inset-0 z-20 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
            <div className="bg-gray-900 border border-gray-700 w-full max-w-sm rounded-2xl overflow-hidden shadow-2xl relative">
                {/* Close Button */}
                <button 
                    onClick={() => setViewEvent(null)}
                    className="absolute top-4 right-4 z-30 bg-black/50 p-2 rounded-full text-white hover:bg-black/80"
                >
                    <X size={20} />
                </button>

                {/* Event Image */}
                <div className="h-40 w-full relative">
                    <img src={viewEvent.image} className="w-full h-full object-cover" />
                    <div className="absolute bottom-0 inset-x-0 bg-gradient-to-t from-gray-900 to-transparent h-20" />
                </div>

                {/* Event Info */}
                <div className="p-6 pt-2">
                    <h2 className="text-xl font-bold text-white mb-2">{viewEvent.title}</h2>
                    
                    <div className="space-y-3 mb-6">
                        <div className="flex items-center gap-3 text-gray-300 text-sm">
                            <MapPin size={16} className="text-purple-500" />
                            {viewEvent.venue}
                        </div>
                        <div className="flex items-center gap-3 text-gray-300 text-sm">
                            <Calendar size={16} className="text-purple-500" />
                            {viewEvent.date}
                        </div>
                        <div className="flex items-center gap-3 text-gray-300 text-sm">
                            <Clock size={16} className="text-purple-500" />
                            {viewEvent.time || viewEvent.start_time}
                        </div>
                        <div className="flex items-center gap-3 text-gray-300 text-sm">
                            <Users size={16} className="text-purple-500" />
                            {viewEvent.attendees} Going
                        </div>
                    </div>

                    {/* Action Button */}
                    <Button 
                        className={`w-full py-3 font-bold flex items-center justify-center gap-2 ${viewEvent.isJoined ? 'bg-green-600 hover:bg-green-700' : ''}`}
                        onClick={() => {
                            toggleJoin(viewEvent.id);
                            // Close modal after join? Optional.
                            // setViewEvent(null); 
                        }}
                    >
                        {viewEvent.isJoined ? (
                            <><Check size={18} /> Going</>
                        ) : (
                            "Join Event"
                        )}
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