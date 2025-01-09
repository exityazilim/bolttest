import React from 'react';
import { Page } from '../../services/pageApi';
import { Pencil, Trash2 } from 'lucide-react';
import { Button } from '../ui/Button';

interface PageListItemProps {
  page: Page;
  onEdit: (page: Page) => void;
  onDelete: (id: string) => void;
}

export function PageListItem({ page, onEdit, onDelete }: PageListItemProps) {
  return (
    <div className="flex justify-between items-start p-4 hover:bg-gray-50 rounded-lg transition-colors">
      <div>
        <h3 className="text-lg font-medium text-gray-900">{page.name}</h3>
        {page.detail && (
          <p className="mt-1 text-sm text-gray-600">{page.detail}</p>
        )}
        <div className="mt-1 flex items-center gap-2">
          <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
            page.isCache ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-700'
          }`}>
            {page.isCache ? 'Cache Aktif' : 'Cache Pasif'}
          </span>
        </div>
      </div>
      <div className="flex space-x-2">
        <Button
          variant="ghost"
          onClick={() => onEdit(page)}
          className="text-gray-600 hover:text-gray-900"
          title="Düzenle"
        >
          <Pencil className="w-4 h-4" />
        </Button>
        <Button
          variant="ghost"
          onClick={() => onDelete(page.id!)}
          className="text-red-600 hover:text-red-900"
          title="Sil"
        >
          <Trash2 className="w-4 h-4" />
        </Button>
      </div>
    </div>
  );
}