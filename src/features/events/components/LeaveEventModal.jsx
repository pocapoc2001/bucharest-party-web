import React from 'react';
import { X, AlertTriangle } from 'lucide-react';
import { Button } from '../../../components/ui/Button';

export default function LeaveEventModal({ isOpen, onClose, onConfirm, eventTitle }) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[2000] flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-gray-900 border border-red-900/50 rounded-2xl w-full max-w-sm p-6 shadow-2xl relative animate-in zoom-in-95 duration-200">
        
        <button 
          onClick={onClose} 
          className="absolute top-4 right-4 text-gray-500 hover:text-white transition-colors"
        >
          <X size={20} />
        </button>

        <div className="flex flex-col items-center text-center">
          <div className="w-12 h-12 bg-red-500/10 rounded-full flex items-center justify-center mb-4">
            <AlertTriangle className="text-red-500" size={24} />
          </div>

          <h2 className="text-xl font-bold text-white mb-2">Leave Party?</h2>
          
          <p className="text-gray-400 text-sm mb-6">
            Are you sure you want to leave <span className="text-white font-medium">"{eventTitle}"</span>? 
            You will lose your spot on the guest list.
          </p>

          <div className="flex gap-3 w-full">
            <Button 
              variant="secondary" 
              className="flex-1 bg-gray-800 hover:bg-gray-700 text-white"
              onClick={onClose}
            >
              Cancel
            </Button>
            <Button 
              className="flex-1 bg-red-600 hover:bg-red-700 text-white border-none"
              onClick={onConfirm}
            >
              Leave Event
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}