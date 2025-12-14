import React from 'react';
import { Button } from '../../../components/ui/Button';

export default function FilterBar({ 
  activeCategory, 
  onCategoryChange, 
  activeAge, 
  onAgeChange 
}) {
  const categories = ["All", "Techno", "Rooftop", "Latino", "Party"];
  const ageGroups = ["Any Age", "Student", "Young Adults", "Adults", "Old School"];

  return (
    <div className="flex flex-col gap-3 mb-6 bg-gray-900/50 p-4 rounded-xl border border-gray-800">
      
      {/* Category Filter */}
      <div>
        <p className="text-xs text-gray-500 uppercase font-bold mb-2 tracking-wider">Vibe</p>
        <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-hide">
          {categories.map((cat) => (
            <Button 
              key={cat} 
              variant={activeCategory === cat ? 'primary' : 'secondary'}
              onClick={() => onCategoryChange(cat)}
              className={`whitespace-nowrap text-xs px-3 py-1 ${activeCategory === cat ? 'bg-purple-600' : 'bg-gray-800'}`}
            >
              {cat}
            </Button>
          ))}
        </div>
      </div>

      {/* Age Filter */}
      <div>
        <p className="text-xs text-gray-500 uppercase font-bold mb-2 tracking-wider">Crowd</p>
        <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-hide">
          {ageGroups.map((age) => (
            <Button 
              key={age} 
              variant={activeAge === age ? 'outline' : 'ghost'}
              onClick={() => onAgeChange(age)}
              className={`whitespace-nowrap text-xs px-3 py-1 border ${
                activeAge === age 
                  ? 'border-blue-500 text-blue-400 bg-blue-500/10' 
                  : 'border-gray-700 text-gray-400 hover:text-gray-200'
              }`}
            >
              {age}
            </Button>
          ))}
        </div>
      </div>

    </div>
  );
}