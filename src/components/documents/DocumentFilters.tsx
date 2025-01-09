import React, { useEffect } from 'react';
import { Search, X } from 'lucide-react';
import { SearchableSelect } from '../ui/SearchableSelect';
import { DateInput } from '../ui/DateInput';
import { Button } from '../ui/Button';
import { User } from '../../types/user';
import { DocumentType } from '../../types/documentType';

interface DocumentFiltersProps {
  users: User[];
  documentTypes: DocumentType[];
  selectedUser: string;
  selectedDocumentType: string;
  startDate: string;
  endDate: string;
  onUserChange: (value: string) => void;
  onDocumentTypeChange: (value: string) => void;
  onStartDateChange: (e: { target: { value: string } }) => void;
  onEndDateChange: (e: { target: { value: string } }) => void;
  onSearch: (e?: React.FormEvent) => void;
  onReset: () => void;
}

export function DocumentFilters({
  users,
  documentTypes,
  selectedUser,
  selectedDocumentType,
  startDate,
  endDate,
  onUserChange,
  onDocumentTypeChange,
  onStartDateChange,
  onEndDateChange,
  onSearch,
  onReset,
}: DocumentFiltersProps) {
  // Effect to trigger search when filters change
  useEffect(() => {
    onSearch();
  }, [selectedUser, selectedDocumentType, startDate, endDate]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSearch(e);
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="bg-white rounded-xl shadow-sm border border-gray-100"
    >
      <div className="p-4 border-b border-gray-100">
        <div className="flex items-center gap-2 text-gray-700">
          <Search className="w-5 h-5" />
          <h2 className="text-lg font-medium">Evrak Filtrele</h2>
        </div>
      </div>

      <div className="p-4 space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="space-y-1.5">
            <label className="block text-sm font-medium text-gray-700">
              Mükellef
            </label>
            <SearchableSelect
              options={users.map((user) => ({
                value: user.id,
                label: user.detail ? `${user.detail}` : user.name,
              }))}
              value={selectedUser}
              onChange={onUserChange}
              placeholder="Mükellef Seçin"
            />
          </div>

          <div className="space-y-1.5">
            <label className="block text-sm font-medium text-gray-700">
              Evrak Tipi
            </label>
            <SearchableSelect
              options={documentTypes.map((type) => ({
                value: type.id!,
                label: type.name,
              }))}
              value={selectedDocumentType}
              onChange={onDocumentTypeChange}
              placeholder="Evrak Tipi Seçin"
            />
          </div>

          <div className="space-y-1.5">
            <label className="block text-sm font-medium text-gray-700">
              Başlangıç Tarihi
            </label>
            <DateInput value={startDate} onChange={onStartDateChange} />
          </div>

          <div className="space-y-1.5">
            <label className="block text-sm font-medium text-gray-700">
              Bitiş Tarihi
            </label>
            <DateInput value={endDate} onChange={onEndDateChange} />
          </div>
        </div>
      </div>

      <div className="px-4 py-3 bg-gray-50 rounded-b-xl flex justify-end gap-2">
        <Button type="button" variant="secondary" onClick={onReset}>
          <X className="w-4 h-4" />
          Temizle
        </Button>
        <Button type="submit">
          <Search className="w-4 h-4" />
          Ara
        </Button>
      </div>
    </form>
  );
}
