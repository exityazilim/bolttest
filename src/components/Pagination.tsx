import React from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { SearchableSelect } from './ui/SearchableSelect';

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  pageSize?: number;
  onPageChange: (page: number) => void;
  onPageSizeChange?: (value: string) => void;
}

export function Pagination({ 
  currentPage, 
  totalPages, 
  pageSize,
  onPageChange,
  onPageSizeChange
}: PaginationProps) {
  const pageSizeOptions = [
    { value: '10', label: '10 Kayıt' },
    { value: '20', label: '20 Kayıt' },
    { value: '50', label: '50 Kayıt' },
    { value: '100', label: '100 Kayıt' },
    { value: '1000', label: '1000 Kayıt' },
  ];

  return (
    <div className="flex items-center justify-between">
      {pageSize !== undefined && onPageSizeChange && (
        <div className="w-32">
          <SearchableSelect
            options={pageSizeOptions}
            value={pageSize.toString()}
            onChange={onPageSizeChange}
            placeholder="Sayfa boyutu"
          />
        </div>
      )}

      <div className="flex items-center space-x-2">
        <button
          onClick={() => onPageChange(currentPage - 1)}
          disabled={currentPage === 0}
          className="p-2 rounded-lg hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <ChevronLeft className="w-5 h-5" />
        </button>
        
        <span className="text-sm text-gray-600">
          Sayfa {currentPage + 1} / {Math.max(totalPages, 1)}
        </span>
        
        <button
          onClick={() => onPageChange(currentPage + 1)}
          disabled={currentPage >= totalPages - 1}
          className="p-2 rounded-lg hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <ChevronRight className="w-5 h-5" />
        </button>
      </div>
    </div>
  );
}