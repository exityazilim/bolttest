import React from 'react';
import { Search } from 'lucide-react';
import { Input } from '../ui/Input';
import { SearchableSelect } from '../ui/SearchableSelect';

interface UserSearchProps {
  searchTerm: string;
  pageSize: number;
  onSearchChange: (value: string) => void;
  onPageSizeChange: (value: string) => void;
}

export function UserSearch({ 
  searchTerm, 
  pageSize, 
  onSearchChange, 
  onPageSizeChange 
}: UserSearchProps) {
  const pageSizeOptions = [
    { value: '10', label: '10 Kayıt' },
    { value: '20', label: '20 Kayıt' },
    { value: '50', label: '50 Kayıt' },
    { value: '100', label: '100 Kayıt' },
  ];

  return (
    <div className="flex gap-4">
      <div className="flex-1">
        <Input
          value={searchTerm}
          onChange={(e) => onSearchChange(e.target.value)}
          placeholder="Müşteri ara..."
          icon={<Search className="h-5 w-5" />}
        />
      </div>
      <div className="w-40">
        <SearchableSelect
          options={pageSizeOptions}
          value={pageSize.toString()}
          onChange={onPageSizeChange}
          placeholder="Sayfa boyutu"
        />
      </div>
    </div>
  );
}