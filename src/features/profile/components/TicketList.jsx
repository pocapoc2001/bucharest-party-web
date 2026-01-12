import React from 'react';
import { Ticket, Calendar, MapPin, Clock, ArrowRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export default function TicketList({ tickets }) {
  const navigate = useNavigate();

  // Empty State
  if (!tickets || tickets.length === 0) {
    return (
      <div className="bg-gray-900/60 backdrop-blur-xl border border-gray-800 rounded-3xl p-8 shadow-2xl h-full flex flex-col items-center justify-center text-center animate-in fade-in duration-700">
        <div className="w-20 h-20 bg-gray-800 rounded-full flex items-center justify-center mb-4 shadow-inner">
          <Ticket size={40} className="text-gray-600 opacity-50" />
        </div>
        <h3 className="text-xl font-bold text-white mb-2">No Parties Yet?</h3>
        <p className="text-gray-400 text-sm max-w-xs mx-auto mb-6">
          You haven't joined any events. Check out the main feed to find the best parties in Bucharest!
        </p>
        <button 
          onClick={() => navigate('/events')}
          className="px-6 py-2.5 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-500 hover:to-pink-500 text-white font-bold rounded-xl transition-all shadow-lg hover:shadow-purple-500/25 flex items-center gap-2"
        >
           Explore Events <ArrowRight size={18} />
        </button>
      </div>
    );
  }

  return (
    <div className="bg-gray-900/60 backdrop-blur-xl border border-gray-800 rounded-3xl p-6 shadow-2xl h-full flex flex-col relative overflow-hidden">
      
      {/* Header */}
      <h3 className="relative z-10 text-xl font-bold text-white mb-6 flex items-center gap-2">
        <span className="bg-clip-text text-transparent bg-gradient-to-r from-purple-400 to-pink-400 drop-shadow-sm">
          My Party List
        </span>
        <span className="bg-gray-800 text-gray-400 text-xs px-2 py-0.5 rounded-full border border-gray-700">
          {tickets.length}
        </span>
      </h3>

      {/* Scrollable List */}
      <div className="space-y-4 overflow-y-auto pr-2 custom-scrollbar flex-1 relative z-10">
        {tickets.map((ticket, index) => {
          const isPast = ticket.status === 'Past';

          return (
            <div 
              key={ticket.id} 
              style={{ animationDelay: `${index * 100}ms` }}
              className={`
                group relative flex gap-4 p-3 rounded-2xl border transition-all duration-300
                animate-in slide-in-from-bottom-4 fade-in fill-mode-backwards
                hover:scale-[1.01] hover:shadow-xl
                ${isPast 
                  ? 'bg-gray-900/40 border-gray-800 opacity-60 hover:opacity-100' 
                  : 'bg-gray-800/40 border-gray-700/50 hover:bg-gray-800/60 hover:border-purple-500/30'
                }
              `}
            >
              {/* Image Thumbnail */}
              <div className="w-20 h-20 rounded-xl overflow-hidden bg-gray-900 shrink-0 relative shadow-md group-hover:shadow-purple-500/20 transition-shadow">
                {ticket.image ? (
                  <img src={ticket.image} alt={ticket.title} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110" />
                ) : (
                  <div className="w-full h-full flex items-center justify-center bg-gray-800">
                    <Ticket size={24} className="text-gray-600" />
                  </div>
                )}
                
                {/* Status Badge */}
                <div className={`absolute bottom-0 left-0 right-0 text-[10px] font-bold text-center py-0.5 uppercase tracking-wider backdrop-blur-md
                  ${isPast ? 'bg-black/60 text-gray-400' : 'bg-green-500/80 text-white'}
                `}>
                  {ticket.status}
                </div>
              </div>

              {/* Content */}
              <div className="flex-1 min-w-0 flex flex-col justify-center">
                <h4 className={`text-lg font-bold truncate transition-colors ${isPast ? 'text-gray-400' : 'text-white group-hover:text-purple-300'}`}>
                  {ticket.title}
                </h4>

                <div className="flex flex-col gap-1.5 mt-2">
                  <div className="flex items-center gap-2 text-xs text-gray-400">
                    <Calendar size={12} className="text-purple-400" />
                    <span>{ticket.date}</span>
                    <span className="w-1 h-1 rounded-full bg-gray-600"></span>
                    <Clock size={12} className="text-blue-400" />
                    <span>{ticket.time}</span>
                  </div>
                  
                  <div className="flex items-center gap-2 text-xs text-gray-500 truncate">
                    <MapPin size={12} className="text-pink-400 shrink-0" />
                    <span className="truncate">{ticket.venue}</span>
                  </div>
                </div>
              </div>

              {/* Arrow Indicator (Desktop) */}
              <div className="hidden sm:flex items-center justify-center pr-2 opacity-0 group-hover:opacity-100 transition-opacity -translate-x-2 group-hover:translate-x-0 duration-300">
                 <ArrowRight className="text-purple-500" size={20} />
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}