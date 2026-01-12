import React, { useRef } from 'react';
import { Mail, Camera, Loader2 } from 'lucide-react';

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
    <div className="bg-gray-800/50 border border-gray-700 rounded-xl p-6 mb-6 shadow-lg flex flex-col md:flex-row items-center gap-6">
      
      {/* Avatar Section with Upload */}
      <div className="relative group cursor-pointer" onClick={handleImageClick}>
        <div className="w-24 h-24 rounded-full bg-gradient-to-br from-gray-700 to-gray-600 flex items-center justify-center text-3xl font-bold text-white shadow-xl ring-4 ring-gray-900/50 overflow-hidden relative">
          {uploading ? (
             <div className="absolute inset-0 flex items-center justify-center bg-black/50 z-20">
                <Loader2 className="animate-spin text-white" size={24} />
             </div>
          ) : null}
          
          {user.avatar_url ? (
            <img 
              src={user.avatar_url} 
              alt={user.name} 
              className="w-full h-full object-cover" 
            />
          ) : (
            <span>{getInitials(user.name)}</span>
          )}
          
          {/* Hover Overlay */}
          <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center z-10">
            <Camera size={24} className="text-white" />
          </div>
        </div>
        <input 
          type="file" 
          ref={fileInputRef} 
          onChange={handleFileChange} 
          accept="image/*" 
          className="hidden" 
        />
      </div>

      {/* User Info Section - Clean & Professional */}
      <div className="flex-1 text-center md:text-left">
        <h2 className="text-3xl font-bold text-white tracking-tight">{user.name || "Guest"}</h2>
        <div className="flex items-center justify-center md:justify-start gap-2 text-gray-400 text-sm mt-1">
          <Mail size={14} />
          <span>{user.email}</span>
        </div>

        {/* Bio */}
        {user.bio && (
          <p className="text-gray-400 text-sm mt-3 leading-relaxed max-w-lg">
            {user.bio}
          </p>
        )}
      </div>
    </div>
  );
}