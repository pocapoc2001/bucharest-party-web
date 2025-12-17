import React, { useState } from 'react';
import { Send, ArrowLeft } from 'lucide-react'; // Added ArrowLeft
import { Button } from '../../../components/ui/Button'; // Fixed path
// Removed Input import as it wasn't being used in the standard HTML input below, 
// but if you want to use your custom Input, import it correctly:
// import { Input } from '../../../components/ui/Input';

export default function ChatView({ communityName, onClose }) {
  const [messages, setMessages] = useState([
    { id: 1, user: 'Bot', text: `Bine ai venit în ${communityName}!`, isMe: false }
  ]);
  const [input, setInput] = useState('');

  const send = (e) => {
    e.preventDefault();
    if (!input.trim()) return;
    setMessages([...messages, { id: Date.now(), user: 'Tu', text: input, isMe: true }]);
    setInput('');
  };

  return (
    <div className="h-full flex flex-col bg-gray-900 border border-gray-800 rounded-xl overflow-hidden">
      <div className="p-4 bg-gray-800 flex items-center gap-4 border-b border-gray-700">
        <button onClick={onClose} className="p-2 hover:bg-gray-700 rounded-full text-white">
          <ArrowLeft size={20} />
        </button>
        <h3 className="font-bold text-white">{communityName}</h3>
      </div>
      
      <div className="flex-1 p-4 overflow-y-auto space-y-4">
        {messages.map(m => (
          <div key={m.id} className={`flex ${m.isMe ? 'justify-end' : 'justify-start'}`}>
            <div className={`max-w-[70%] p-3 rounded-2xl ${m.isMe ? 'bg-purple-600 text-white' : 'bg-gray-800 text-gray-200'}`}>
              <p className="text-sm">{m.text}</p>
            </div>
          </div>
        ))}
      </div>

      <form onSubmit={send} className="p-4 bg-gray-800 flex gap-2">
        <input 
          className="flex-1 bg-gray-900 border border-gray-700 rounded-full px-4 text-white focus:outline-none focus:border-purple-500"
          value={input} 
          onChange={e => setInput(e.target.value)} 
          placeholder="Scrie un mesaj..."
        />
        <Button className="rounded-full w-10 h-10 p-0 flex items-center justify-center">
          <Send size={18} />
        </Button>
      </form>
    </div>
  );
}