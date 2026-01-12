import React, { useRef } from 'react';
import { Mail, Camera, Sparkles, Loader2 } from 'lucide-react';

export default function UserBio({ user, onUploadAvatar, uploading }) {
  const fileInputRef = useRef(null);

  if (!user) return null;

  const getInitials = (name) => {
    return name
      ? name.split(' ').map((n) => n[0]).join('').toUpperCase().slice(0, 2)
      : 'U';
  };

  const handleImageClick = () => {
    fileInputRef.current.click();
  };

  const handleFileChange = (event) => {
    if (!event.target.files || event.target.files.length === 0) {
      return;
    }
    onUploadAvatar(event.target.files[0]);
  };

  return (
    <div className="relative overflow-hidden rounded-3xl bg-gray-900/80 border border-gray-800 shadow-2xl animate-in fade-in duration-700">
      
      {/* 1. Decorative Background Blurs */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-purple-600/20 rounded-full blur-[100px] -mr-20 -mt-20 pointer-events-none"></div>
      <div className="absolute bottom-0 left-0 w-64 h-64 bg-blue-600/10 rounded-full blur-[80px] -ml-10 -mb-10 pointer-events-none"></div>

      <div className="relative z-10 p-8 flex flex-col md:flex-row items-center gap-8">
        
        {/* 2. Avatar Section (Click to Upload) */}
        <div 
          className="relative group cursor-pointer" 
          onClick={handleImageClick}
          title="Change Profile Picture"
        >
          {/* Glowing Ring */}
          <div className="absolute -inset-1 bg-gradient-to-br from-purple-500 to-pink-500 rounded-full blur opacity-40 group-hover:opacity-75 transition duration-500"></div>
          
          <div className="relative w-32 h-32 rounded-full bg-gray-800 border-4 border-gray-900 flex items-center justify-center text-4xl font-bold text-white shadow-2xl overflow-hidden">
            {uploading ? (
               <div className="absolute inset-0 flex items-center justify-center bg-black/60 z-20 backdrop-blur-sm">
                  <Loader2 className="animate-spin text-purple-400" size={32} />
               </div>
            ) : null}
            
            {user.avatar_url ? (
              <img 
                src={user.avatar_url} 
                alt={user.name} 
                className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110" 
              />
            ) : (
              <span className="text-gray-400 group-hover:text-white transition-colors">
                {getInitials(user.name)}
              </span>
            )}
            
            {/* Camera Overlay on Hover */}
            <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center z-10">
              <Camera size={28} className="text-white drop-shadow-md transform scale-75 group-hover:scale-100 transition-transform duration-300" />
            </div>
          </div>
        </div>
        <input 
          type="file" 
          ref={fileInputRef} 
          onChange={handleFileChange} 
          accept="image/*" 
          className="hidden" 
        />

        {/* 3. User Info (Simplified) */}
        <div className="text-center md:text-left space-y-2">
          <h2 className="text-4xl font-black text-white tracking-tight flex items-center justify-center md:justify-start gap-3 drop-shadow-lg">
            {user.name || "Party Guest"}
            <Sparkles className="text-yellow-400 animate-pulse" size={24} />
          </h2>
          
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/5 border border-white/10 text-purple-200 text-sm backdrop-blur-md shadow-inner">
            <Mail size={14} /> 
            <span>{user.email}</span>
          </div>
        </div>

      </div>
    </div>
  );
}