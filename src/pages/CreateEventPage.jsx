import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Calendar, Clock, MapPin, Image as ImageIcon, Type } from 'lucide-react';
import { Button } from '../components/ui/Button';
import { Input } from '../components/ui/Input';
import LocationPickerMap from '../features/events/components/LocationPickerMap';
import { useEvents } from '../features/events/hooks/useEvents';

export default function CreateEventPage() {
  const navigate = useNavigate();
  const { createEvent } = useEvents();
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const [formData, setFormData] = useState({
    title: '',
    venue: '',
    date: '',
    time: '',
    category: 'Techno',
    ageGroup: 'Student',
    image: '',
    description: '',
    coords: null
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.coords) {
      alert("Please select a location on the map!");
      return;
    }

    setIsSubmitting(true);
    
    // Simulate API Call
    await createEvent(formData);
    
    setIsSubmitting(false);
    navigate('/'); // Go back to dashboard
  };

  return (
    <div className="min-h-screen bg-black text-white pb-20">
      {/* Header */}
      <div className="sticky top-0 z-50 bg-gray-900/80 backdrop-blur-md border-b border-gray-800 p-4 flex items-center gap-4">
        <button onClick={() => navigate(-1)} className="text-gray-400 hover:text-white">
          <ArrowLeft />
        </button>
        <h1 className="text-xl font-bold">Create New Event</h1>
      </div>

      <div className="max-w-2xl mx-auto p-6">
        <form onSubmit={handleSubmit} className="space-y-6">
          
          {/* 1. Basic Info */}
          <div className="space-y-4">
            <h3 className="text-purple-400 font-bold uppercase text-xs tracking-wider">Event Details</h3>
            
            <Input 
              type="text" 
              placeholder="Event Title" 
              icon={Type}
              value={formData.title}
              onChange={(e) => setFormData({...formData, title: e.target.value})}
              required
            />
            
            <div className="flex gap-4">
              <Input 
                type="date" 
                icon={Calendar}
                className="w-full"
                value={formData.date}
                onChange={(e) => setFormData({...formData, date: e.target.value})}
                required
              />
              <Input 
                type="time" 
                icon={Clock}
                className="w-full"
                value={formData.time}
                onChange={(e) => setFormData({...formData, time: e.target.value})}
                required
              />
            </div>
            
            <Input 
              type="text" 
              placeholder="Venue Name (e.g. Control Club)" 
              icon={MapPin}
              value={formData.venue}
              onChange={(e) => setFormData({...formData, venue: e.target.value})}
              required
            />
          </div>

          {/* 2. Filters */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-gray-500 text-xs mb-2 ml-1">Category</label>
              <select 
                className="w-full bg-gray-900 border border-gray-700 rounded-lg p-3 text-white focus:border-purple-500 outline-none appearance-none"
                value={formData.category}
                onChange={(e) => setFormData({...formData, category: e.target.value})}
              >
                <option>Techno</option>
                <option>Party</option>
                <option>Rooftop</option>
                <option>Latino</option>
                <option>Hip-Hop</option>
              </select>
            </div>
            <div>
              <label className="block text-gray-500 text-xs mb-2 ml-1">Age Group</label>
              <select 
                className="w-full bg-gray-900 border border-gray-700 rounded-lg p-3 text-white focus:border-blue-500 outline-none appearance-none"
                value={formData.ageGroup}
                onChange={(e) => setFormData({...formData, ageGroup: e.target.value})}
              >
                <option>Student</option>
                <option>Young Adults</option>
                <option>Adults</option>
                <option>Old School</option>
              </select>
            </div>
          </div>

          {/* 3. Media */}
          <div className="space-y-4">
             <h3 className="text-purple-400 font-bold uppercase text-xs tracking-wider">Visuals</h3>
             <Input 
                type="url" 
                placeholder="Cover Image URL (https://...)" 
                icon={ImageIcon}
                value={formData.image}
                onChange={(e) => setFormData({...formData, image: e.target.value})}
                required
             />
          </div>

          {/* 4. Location Map */}
          <div className="space-y-2">
            <h3 className="text-purple-400 font-bold uppercase text-xs tracking-wider">Exact Location</h3>
            <p className="text-gray-500 text-xs mb-2">Click on the map to place the location pin.</p>
            <LocationPickerMap onLocationSelect={(coords) => setFormData({...formData, coords})} />
          </div>

          <Button 
            className={`w-full py-4 text-lg font-bold shadow-xl shadow-purple-900/20 ${isSubmitting ? 'opacity-50 cursor-not-allowed' : ''}`}
            disabled={isSubmitting}
          >
            {isSubmitting ? 'Publishing...' : 'Publish Event'}
          </Button>

        </form>
      </div>
    </div>
  );
}