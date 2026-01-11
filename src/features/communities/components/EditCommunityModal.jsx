import React, { useState } from 'react';
import { X, Save, Image as ImageIcon, Lock, Globe, Loader2 } from 'lucide-react';
import { Button } from '../../../components/ui/Button';

export default function EditCommunityModal({ community, onClose, onUpdate }) {
  const [name, setName] = useState(community.name);
  const [desc, setDesc] = useState(community.description || '');
  const [isPrivate, setIsPrivate] = useState(community.is_private);
  const [preview, setPreview] = useState(community.image);
  const [imageFile, setImageFile] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImageFile(file);
      setPreview(URL.createObjectURL(file));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    // Call the hook function
    await onUpdate(community.id, { name, description: desc, isPrivate, image: community.image }, imageFile);
    setIsSubmitting(false);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in">
      <div className="bg-gray-900 border border-gray-700 rounded-2xl w-full max-w-md p-6 relative shadow-2xl">
        <button onClick={onClose} className="absolute top-4 right-4 text-gray-500 hover:text-white">
          <X size={20} />
        </button>
        <h2 className="text-xl font-bold text-white mb-6">Edit Community</h2>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          
          {/* Image Preview */}
          <div className="flex justify-center mb-4">
             <label className="relative w-full h-32 rounded-xl overflow-hidden border-2 border-dashed border-gray-700 cursor-pointer hover:border-purple-500 transition-colors group">
                {preview ? (
                    <img src={preview} className="w-full h-full object-cover opacity-70 group-hover:opacity-100 transition-opacity"/>
                ) : (
                    <div className="w-full h-full flex items-center justify-center text-gray-500">
                        <ImageIcon size={24} />
                    </div>
                )}
                <div className="absolute inset-0 flex items-center justify-center bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity font-bold text-white text-sm">
                    Change Cover
                </div>
                <input type="file" className="hidden" accept="image/*" onChange={handleImageChange} />
             </label>
          </div>

          <div>
            <label className="text-xs text-gray-500 uppercase ml-1">Name</label>
            <input 
                className="w-full bg-gray-800 border border-gray-700 rounded-lg p-3 text-white focus:border-purple-500 outline-none"
                value={name} 
                onChange={(e) => setName(e.target.value)} 
            />
          </div>

          <div>
            <label className="text-xs text-gray-500 uppercase ml-1">Description</label>
            <textarea 
              className="w-full bg-gray-800 border border-gray-700 rounded-lg p-3 text-white focus:border-purple-500 outline-none h-24 resize-none"
              value={desc} 
              onChange={(e) => setDesc(e.target.value)}
            />
          </div>

          <div className="flex gap-2">
             <div onClick={() => setIsPrivate(false)} className={`flex-1 p-3 rounded-lg border cursor-pointer text-center ${!isPrivate ? 'bg-purple-900/20 border-purple-500 text-purple-400' : 'bg-gray-800 border-gray-700 text-gray-400'}`}>
                <Globe size={16} className="mx-auto mb-1"/> Public
             </div>
             <div onClick={() => setIsPrivate(true)} className={`flex-1 p-3 rounded-lg border cursor-pointer text-center ${isPrivate ? 'bg-purple-900/20 border-purple-500 text-purple-400' : 'bg-gray-800 border-gray-700 text-gray-400'}`}>
                <Lock size={16} className="mx-auto mb-1"/> Private
             </div>
          </div>
          
          <Button className="w-full mt-2" disabled={isSubmitting}>
            {isSubmitting ? <Loader2 className="animate-spin" /> : <><Save size={18} className="mr-2"/> Save Changes</>}
          </Button>
        </form>
      </div>
    </div>
  );
}