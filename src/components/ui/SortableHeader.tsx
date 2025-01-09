import React from 'react';
import { ChevronUp, ChevronDown } from 'lucide-react';
import { SortDirection } from '../../types/sorting';

interface SortableHeaderProps {
  label: string;
  field: string;
  currentSort: {
    field: string;
    direction: SortDirection;
  };
  onSort: (field: string) => void;
}

export function SortableHeader({ label, field, currentSort, onSort }: SortableHeaderProps) {
  const isActive = currentSort.field === field;

  return (
    <th 
      className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase cursor-pointer hover:bg-gray-100"
      onClick={() => onSort(field)}
    >
      <div className="flex items-center gap-1">
        {label}
        <div className="flex flex-col">
          <ChevronUp 
            className={`w-3 h-3 ${isActive && currentSort.direction === 'asc' ? 'text-blue-600' : 'text-gray-400'}`} 
          />
          <ChevronDown 
            className={`w-3 h-3 -mt-1 ${isActive && currentSort.direction === 'desc' ? 'text-blue-600' : 'text-gray-400'}`}
          />
        </div>
      </div>
    </th>
  );
}