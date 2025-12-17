import React from 'react';
import { Settings, Bell, Map, Globe, Lock } from 'lucide-react';

export default function SettingsForm({ settings, onUpdate }) {
  if (!settings) return null;

  const handleToggle = (key) => {
    // In a real app, this would call an API via the onUpdate prop
    onUpdate({ [key]: !settings[key] });
  };

  return (
    <div className="bg-gray-800/30 border border-gray-700 rounded-xl p-6 shadow-md">
      <h3 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
        <Settings className="text-purple-400" /> Account Settings
      </h3>

      <div className="space-y-4">
        {/* Toggle Item 1: Notifications */}
        <div className="flex justify-between items-center p-3 bg-gray-900/50 rounded-lg hover:bg-gray-900/80 transition-colors">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-purple-500/10 rounded-lg text-purple-400">
              <Bell size={20} />
            </div>
            <div>
              <p className="font-medium text-gray-200">Push Notifications</p>
              <p className="text-xs text-gray-500">Receive alerts about events near you</p>
            </div>
          </div>
          <button 
            onClick={() => handleToggle('notifications')}
            className={`w-12 h-6 rounded-full relative transition-colors duration-300 focus:outline-none focus:ring-2 focus:ring-purple-500/50 ${settings.notifications ? 'bg-purple-600' : 'bg-gray-600'}`}
          >
            <div className={`absolute top-1 w-4 h-4 bg-white rounded-full transition-all duration-300 shadow-sm ${settings.notifications ? 'right-1' : 'left-1'}`} />
          </button>
        </div>

        {/* Toggle Item 2: Location */}
        <div className="flex justify-between items-center p-3 bg-gray-900/50 rounded-lg hover:bg-gray-900/80 transition-colors">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-blue-500/10 rounded-lg text-blue-400">
              <Map size={20} />
            </div>
            <div>
              <p className="font-medium text-gray-200">Location Services</p>
              <p className="text-xs text-gray-500">Allow app to access your GPS for better recommendations</p>
            </div>
          </div>
          <button 
            onClick={() => handleToggle('locationServices')}
            className={`w-12 h-6 rounded-full relative transition-colors duration-300 focus:outline-none focus:ring-2 focus:ring-purple-500/50 ${settings.locationServices ? 'bg-purple-600' : 'bg-gray-600'}`}
          >
            <div className={`absolute top-1 w-4 h-4 bg-white rounded-full transition-all duration-300 shadow-sm ${settings.locationServices ? 'right-1' : 'left-1'}`} />
          </button>
        </div>

        {/* Toggle Item 3: Public Profile */}
        <div className="flex justify-between items-center p-3 bg-gray-900/50 rounded-lg hover:bg-gray-900/80 transition-colors">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-green-500/10 rounded-lg text-green-400">
              <Globe size={20} />
            </div>
            <div>
              <p className="font-medium text-gray-200">Public Profile</p>
              <p className="text-xs text-gray-500">Allow others to see your badges and attended events</p>
            </div>
          </div>
          <button 
            onClick={() => handleToggle('publicProfile')}
            className={`w-12 h-6 rounded-full relative transition-colors duration-300 focus:outline-none focus:ring-2 focus:ring-purple-500/50 ${settings.publicProfile ? 'bg-purple-600' : 'bg-gray-600'}`}
          >
            <div className={`absolute top-1 w-4 h-4 bg-white rounded-full transition-all duration-300 shadow-sm ${settings.publicProfile ? 'right-1' : 'left-1'}`} />
          </button>
        </div>

         {/* Button: Change Password (Mock) */}
         <button className="w-full mt-2 py-3 bg-gray-700 hover:bg-gray-600 text-gray-300 rounded-lg text-sm font-medium flex items-center justify-center gap-2 transition-colors">
            <Lock size={16} /> Change Password
         </button>

      </div>
    </div>
  );
}