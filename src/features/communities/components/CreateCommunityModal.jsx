import React, { useState } from 'react';
import { X, Save, Loader2 } from 'lucide-react'; // Added Loader2
import { Button } from '../../../components/ui/Button'; 
import { Input } from '../../../components/ui/Input';   

export default function CreateCommunityModal({ onClose, onCreate }) {
  const [name, setName] = useState('');
  const [desc, setDesc] = useState('');
  const [isLoading, setIsLoading] = useState(false); // Added loading state

  const handleSubmit = async (e) => {
    // Prevent default form submission or button click bubbling
    if (e) e.preventDefault();
    
    if (!name) return;

    try {
      setIsLoading(true);
      // Wait for the creation to finish before closing
      await onCreate(name, desc); 
      onClose();
    } catch (error) {
      console.error("Failed to create:", error);
      // Optional: Add alert here if creation fails
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in">
      <div className="bg-gray-900 border border-gray-700 rounded-2xl w-full max-w-md p-6 shadow-2xl relative">
        <button onClick={onClose} className="absolute top-4 right-4 text-gray-500 hover:text-white">
          <X size={20} />
        </button>
        <h2 className="text-2xl font-bold text-white mb-4">Creează Grup Nou</h2>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="text-xs text-gray-500 uppercase ml-1">Nume Grup</label>
            <Input 
                type="text" 
                placeholder="ex: Party Animals" 
                value={name} 
                onChange={(e) => setName(e.target.value)} 
            />
          </div>
          <div>
            <label className="text-xs text-gray-500 uppercase ml-1">Descriere</label>
            <textarea 
              className="w-full bg-gray-900/50 border border-gray-700 rounded-lg p-3 text-white focus:border-purple-500 focus:outline-none"
              placeholder="Despre ce este grupul..."
              value={desc} 
              onChange={(e) => setDesc(e.target.value)}
            />
          </div>
          
          {/* FIX: Use loading state and disable button */}
          <Button 
            className={`w-full mt-4 ${isLoading ? 'opacity-50' : ''}`} 
            onClick={handleSubmit}
            disabled={isLoading}
          >
            {isLoading ? (
               <><Loader2 className="animate-spin mr-2" size={18} /> Se creează...</>
            ) : (
               <><Save size={18} /> Creează</>
            )}
          </Button>
        </form>
      </div>
    </div>
  );
}