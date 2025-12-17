import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Type, AlignLeft, Users } from 'lucide-react';
import { Button } from '../components/ui/Button'; 
import { useCommunities } from '../features/communities/hooks/useCommunities';

export default function CreateCommunityPage() {
  const navigate = useNavigate();
  const { createCommunity } = useCommunities();
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  // STATE
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    category: 'General'
  });

  const handleSubmit = async (e) => {
    e.preventDefault(); 
    
    // VALIDATION: Only check for Name
    if (!formData.name) {
      alert("Please enter a community name!");
      return;
    }

    setIsSubmitting(true);
    
    try {
      // Sending empty string for image since we removed the field
      await createCommunity(formData.name, formData.description, "");
      navigate('/communities'); 
    } catch (error) {
      console.error("Creation Error:", error);
      alert("Something went wrong.");
    } finally {
      setIsSubmitting(false);
    }
  };

  // Standard styling for inputs
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
          
          <div className="space-y-4">
            <h3 className="text-purple-400 font-bold uppercase text-xs tracking-wider">Community Details</h3>
            
            {/* --- NAME INPUT (Mandatory) --- */}
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
            
            {/* --- DESCRIPTION INPUT (Optional) --- */}
            <div className="relative w-full">
              <div className="absolute left-3 top-3 text-gray-500">
                <AlignLeft size={20} />
              </div>
              <textarea 
                className={`${inputBaseStyles} min-h-[120px] resize-none`}
                placeholder="Description (Optional)"
                value={formData.description}
                onChange={(e) => setFormData({...formData, description: e.target.value})}
                // 'required' removed
              />
            </div>
          </div>

          {/* --- CATEGORY SELECT --- */}
          <div className="space-y-2">
             <label className="block text-gray-500 text-xs ml-1">Category</label>
             <div className="relative">
                <div className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500">
                  <Users size={20} />
                </div>
                <select 
                  className={`${inputBaseStyles} cursor-pointer appearance-none`}
                  value={formData.category}
                  onChange={(e) => setFormData({...formData, category: e.target.value})}
                >
                  <option>General</option>
                  <option>Students</option>
                  <option>Nightlife</option>
                  <option>Sports</option>
                  <option>Music</option>
                </select>
             </div>
          </div>

          <Button 
            onClick={handleSubmit}
            className={`w-full py-4 text-lg font-bold shadow-xl shadow-purple-900/20 mt-8 ${isSubmitting ? 'opacity-50 cursor-not-allowed' : ''}`}
            disabled={isSubmitting}
          >
            {isSubmitting ? 'Creating Community...' : 'Launch Community'}
          </Button>

        </form>
      </div>
    </div>
  );
}