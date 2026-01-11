import React, { useState, useEffect, useRef } from 'react';
import { Send, ArrowLeft, Loader2 } from 'lucide-react';
import { Button } from '../../../components/ui/Button';
import { supabase } from '../../../lib/supabase';

export default function ChatView({ communityId, communityName, currentUser, onClose }) {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(true);
  const messagesEndRef = useRef(null);

  // 1. SCROLL TO BOTTOM
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // 2. FETCH HISTORY & SUBSCRIBE
  useEffect(() => {
    // A. Fetch initial history
    const fetchMessages = async () => {
      const { data, error } = await supabase
        .from('messages')
        .select('*')
        .eq('community_id', communityId)
        .order('created_at', { ascending: true });

      if (!error) setMessages(data);
      setLoading(false);
    };

    fetchMessages();

    // B. Subscribe to NEW messages (Real-time)
    const channel = supabase
      .channel(`chat_room_${communityId}`)
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'messages',
          filter: `community_id=eq.${communityId}`,
        },
        (payload) => {
          // Add new message to state instantly
          setMessages((prev) => [...prev, payload.new]);
        }
      )
      .subscribe();

    // Cleanup when leaving the chat
    return () => {
      supabase.removeChannel(channel);
    };
  }, [communityId]);

  // 3. SEND MESSAGE
  const sendMessage = async (e) => {
    e.preventDefault();
    if (!input.trim() || !currentUser) return;

    const messageText = input.trim();
    setInput(''); // Clear input immediately for better UX

    const { error } = await supabase
      .from('messages')
      .insert({
        community_id: communityId,
        user_id: currentUser.id,
        content: messageText
      });

    if (error) {
      console.error("Error sending message:", error);
      alert("Failed to send message.");
    }
  };

  return (
    <div className="h-full flex flex-col bg-gray-900 border border-gray-800 rounded-xl overflow-hidden relative">
      
      {/* Header */}
      <div className="p-4 bg-gray-800 flex items-center gap-4 border-b border-gray-700 shadow-md z-10">
        <button onClick={onClose} className="p-2 hover:bg-gray-700 rounded-full text-white transition-colors">
          <ArrowLeft size={20} />
        </button>
        <div>
           <h3 className="font-bold text-white leading-tight">{communityName}</h3>
           <p className="text-[10px] text-green-400 font-bold uppercase tracking-wider flex items-center gap-1">
             <span className="w-1.5 h-1.5 bg-green-400 rounded-full animate-pulse"></span> Live Chat
           </p>
        </div>
      </div>
      
      {/* Messages Area */}
      <div className="flex-1 p-4 overflow-y-auto space-y-4 bg-black/50">
        {loading ? (
          <div className="flex justify-center mt-10">
            <Loader2 className="animate-spin text-purple-500" />
          </div>
        ) : messages.length === 0 ? (
          <div className="text-center text-gray-500 mt-10 text-sm">
            No messages yet. Be the first to say hi! 👋
          </div>
        ) : (
          messages.map((m) => {
            const isMe = m.user_id === currentUser?.id;
            return (
              <div key={m.id} className={`flex ${isMe ? 'justify-end' : 'justify-start'}`}>
                <div 
                  className={`max-w-[75%] px-4 py-2 rounded-2xl text-sm shadow-md break-words ${
                    isMe 
                      ? 'bg-gradient-to-br from-purple-600 to-indigo-600 text-white rounded-tr-none' 
                      : 'bg-gray-800 text-gray-200 border border-gray-700 rounded-tl-none'
                  }`}
                >
                  <p>{m.content}</p>
                  {/* Optional: Show Time */}
                  <p className={`text-[9px] mt-1 text-right opacity-50 ${isMe ? 'text-purple-200' : 'text-gray-500'}`}>
                    {new Date(m.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </p>
                </div>
              </div>
            );
          })
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Input Area */}
      <form onSubmit={sendMessage} className="p-3 bg-gray-800 border-t border-gray-700 flex gap-2">
        <input 
          className="flex-1 bg-gray-900 border border-gray-700 rounded-full px-4 text-white focus:outline-none focus:border-purple-500 focus:ring-1 focus:ring-purple-500 transition-all placeholder-gray-600"
          value={input} 
          onChange={e => setInput(e.target.value)} 
          placeholder={currentUser ? "Type a message..." : "Log in to chat"}
          disabled={!currentUser}
        />
        <Button 
          type="submit" 
          disabled={!input.trim() || !currentUser}
          className="rounded-full w-10 h-10 p-0 flex items-center justify-center bg-purple-600 hover:bg-purple-500 transition-transform active:scale-95"
        >
          <Send size={18} />
        </Button>
      </form>
    </div>
  );
}