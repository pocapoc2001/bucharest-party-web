import React from 'react';

export const Input = ({ type, placeholder, icon: Icon }) => (
  <div className="relative w-full">
    {Icon && <Icon className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500 w-5 h-5" />}
    <input
      type={type}
      placeholder={placeholder}
      className={`w-full bg-gray-900/50 border border-gray-700 rounded-lg py-3 ${Icon ? 'pl-10' : 'pl-4'} pr-4 text-white focus:outline-none focus:border-purple-500 focus:ring-1 focus:ring-purple-500 transition-colors placeholder-gray-600`}
    />
  </div>
);