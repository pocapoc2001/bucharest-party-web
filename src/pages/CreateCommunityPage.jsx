import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Type, AlignLeft, Users, Lock, Globe, Image as ImageIcon, X } from 'lucide-react';
import { Button } from '../components/ui/Button'; 
import { useCommunities } from '../features/communities/hooks/useCommunities';

export default function CreateCommunityPage() {
  const navigate = useNavigate();
  const { createCommunity } = useCommunities();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [imageFile, setImageFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(null);
  
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    category: 'General',
    isPrivate: false 
  });

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImageFile(file);
      setPreviewUrl(URL.createObjectURL(file));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault(); 
    if (!formData.name) return alert("Please enter a community name!");

    setIsSubmitting(true);
    
    try {
      // Pass the imageFile to the hook
      await createCommunity(formData.name, formData.description, formData.isPrivate, imageFile);
      navigate('/communities'); 
    } catch (error) {
      console.error("Creation Error:", error);
      alert("Something went wrong.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const inputBaseStyles = "w-full bg-gray-900 border border-gray-700 rounded-lg py-3 pl-10 pr-4 text-white focus:border-purple-500 focus:outline-none focus:ring-1 focus:ring-purple-500 transition-colors placeholder-gray-600";

  return (
    <div className="min-h-screen bg-black text-white pb-20">
      <div className="sticky top-0 z-50 bg-gray-900/80 backdrop-blur-md border-b border-gray-800 p-4 flex items-center gap-4">
        <button type="button" onClick={() => navigate(-1)} className="text-gray-400 hover:text-white transition-colors">
          <ArrowLeft />
        </button>
        <h1 className="text-xl font-bold">Create New Community</h1>
      </div>

      <div className="max-w-2xl mx-auto p-6">
        <form onSubmit={handleSubmit} className="space-y-6">
          
          {/* --- IMAGE UPLOAD --- */}
          <div className="w-full">
             <label className="block text-purple-400 font-bold uppercase text-xs tracking-wider mb-2">Cover Image</label>
             
             {!previewUrl ? (
               <label className="flex flex-col items-center justify-center w-full h-40 border-2 border-dashed border-gray-700 rounded-xl cursor-pointer hover:bg-gray-800/50 hover:border-purple-500/50 transition-all">
                  <div className="flex flex-col items-center justify-center pt-5 pb-6">
                      <ImageIcon className="w-8 h-8 text-gray-400 mb-2" />
                      <p className="text-sm text-gray-500">Click to upload cover</p>
                  </div>
                  <input type="file" className="hidden" accept="image/*" onChange={handleImageChange} />
               </label>
             ) : (
               <div className="relative w-full h-40 rounded-xl overflow-hidden border border-purple-500/30 group">
                  <img src={previewUrl} alt="Preview" className="w-full h-full object-cover" />
                  <button 
                    type="button"
                    onClick={() => { setImageFile(null); setPreviewUrl(null); }}
                    className="absolute top-2 right-2 bg-black/60 p-1.5 rounded-full text-white opacity-0 group-hover:opacity-100 transition-opacity"
                  >
                    <X size={16} />
                  </button>
               </div>
             )}
          </div>

          {/* --- DETAILS --- */}
          <div className="space-y-4">
            <h3 className="text-purple-400 font-bold uppercase text-xs tracking-wider">Details</h3>
            
            <div className="relative w-full">
              <div className="absolute left-3 top-3 text-gray-500">
                <Type size={20} />
              </div>
              <input 
                type="text" 
                className={inputBaseStyles}
                placeholder="Community Name (Required)" 
                value={formData.name}
                onChange={(e) => setFormData({...formData, name: e.target.value})}
                required 
              />
            </div>
            
            <div className="relative w-full">
              <div className="absolute left-3 top-3 text-gray-500">
                <AlignLeft size={20} />
              </div>
              <textarea 
                className={`${inputBaseStyles} min-h-[120px] resize-none`}
                placeholder="Description (Optional)"
                value={formData.description}
                onChange={(e) => setFormData({...formData, description: e.target.value})}
              />
            </div>
          </div>

          {/* --- PRIVACY --- */}
          <div className="space-y-4">
            <h3 className="text-purple-400 font-bold uppercase text-xs tracking-wider">Privacy</h3>
            <div className="flex gap-4">
                <div onClick={() => setFormData({...formData, isPrivate: false})} className={`flex-1 border rounded-xl p-4 cursor-pointer transition-all ${!formData.isPrivate ? 'bg-purple-900/20 border-purple-500' : 'bg-gray-900 border-gray-700 opacity-50'}`}>
                    <div className="flex items-center gap-2 mb-2">
                        <Globe size={18} className={!formData.isPrivate ? "text-purple-400" : "text-gray-500"} />
                        <span className="font-bold text-sm">Public</span>
                    </div>
                </div>

                <div onClick={() => setFormData({...formData, isPrivate: true})} className={`flex-1 border rounded-xl p-4 cursor-pointer transition-all ${formData.isPrivate ? 'bg-purple-900/20 border-purple-500' : 'bg-gray-900 border-gray-700 opacity-50'}`}>
                    <div className="flex items-center gap-2 mb-2">
                        <Lock size={18} className={formData.isPrivate ? "text-purple-400" : "text-gray-500"} />
                        <span className="font-bold text-sm">Private</span>
                    </div>
                </div>
            </div>
          </div>

          <Button 
            onClick={handleSubmit}
            className={`w-full py-4 text-lg font-bold shadow-xl shadow-purple-900/20 mt-8 ${isSubmitting ? 'opacity-50 cursor-not-allowed' : ''}`}
            disabled={isSubmitting}
          >
            {isSubmitting ? 'Creating...' : 'Create Community'}
          </Button>

        </form>
      </div>
    </div>
  );
}