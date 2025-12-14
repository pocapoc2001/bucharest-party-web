import React from 'react';
import { Button } from '../../../components/ui/Button';

export default function FilterBar({ activeFilter, onFilterChange }) {
  const categories = ["All", "Techno", "Rooftop", "Latino", "Party"];

  return (
    <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide mb-4">
      {categories.map((cat) => (
        <Button 
          key={cat} 
          variant={activeFilter === cat ? 'primary' : 'secondary'}
          onClick={() => onFilterChange(cat)}
          className="whitespace-nowrap text-sm px-4 py-1"
        >
          {cat}
        </Button>
      ))}
    </div>
  );
}