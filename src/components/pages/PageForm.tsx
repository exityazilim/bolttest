import React from 'react';
import { Page } from '../../services/pageApi';
import { Save, X, FileText, Info, Database } from 'lucide-react';
import { Button } from '../ui/Button';
import { Input } from '../ui/Input';

interface PageFormProps {
  page?: Page;
  onSubmit: (page: Omit<Page, 'id'>) => Promise<void>;
  onCancel: () => void;
  isLoading?: boolean;
}

export function PageForm({ page, onSubmit, onCancel, isLoading }: PageFormProps) {
  const [formData, setFormData] = React.useState({
    name: page?.name || '',
    detail: page?.detail || '',
    isCache: page?.isCache ?? false,
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="grid gap-6">
        <div className="space-y-1.5">
          <label className="flex items-center gap-2 text-sm font-medium text-gray-700">
            <FileText className="w-4 h-4 text-gray-400" />
            Modül Adı
          </label>
          <Input
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            placeholder="Sayfa adını girin"
            required
          />
        </div>

        <div className="space-y-1.5">
          <label className="flex items-center gap-2 text-sm font-medium text-gray-700">
            <Info className="w-4 h-4 text-gray-400" />
            Açıklama
          </label>
          <textarea
            value={formData.detail}
            onChange={(e) => setFormData({ ...formData, detail: e.target.value })}
            className="block w-full rounded-lg border border-gray-300 bg-white px-4 py-2.5 text-gray-900 placeholder:text-gray-500 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 transition duration-200"
            placeholder="Modül hakkında açıklama girin"
            rows={3}
          />
        </div>

        <div className="rounded-lg border border-gray-200 p-4 bg-gray-50">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-indigo-100 rounded-lg">
                <Database className="w-5 h-5 text-indigo-600" />
              </div>
              <div>
                <h3 className="text-sm font-medium text-gray-900">Cache Ayarı</h3>
                <p className="text-sm text-gray-500 mt-0.5">
                  Modül içeriğinin önbelleğe alınmasını sağlar
                </p>
              </div>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={formData.isCache}
                onChange={(e) => setFormData({ ...formData, isCache: e.target.checked })}
                className="sr-only peer"
              />
              <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-indigo-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-indigo-600"></div>
            </label>
          </div>
        </div>
      </div>

      <div className="flex justify-end gap-2">
        <Button
          type="button"
          variant="secondary"
          onClick={onCancel}
        >
          <X className="w-4 h-4" />
          İptal
        </Button>
        <Button
          type="submit"
          isLoading={isLoading}
          disabled={isLoading || !formData.name}
        >
          <Save className="w-4 h-4" />
          {page ? 'Güncelle' : 'Kaydet'}
        </Button>
      </div>
    </form>
  );
}