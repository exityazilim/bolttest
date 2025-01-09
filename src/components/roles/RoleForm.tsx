import React from 'react';
import { Role, PagePermission } from '../../types/role';
import { Page } from '../../services/pageApi';
import { Save, X, Shield, FileText } from 'lucide-react';
import { Button } from '../ui/Button';
import { Input } from '../ui/Input';
import { RolePermissions } from './RolePermissions';

interface RoleFormProps {
  role: Partial<Role>;
  pages: Page[];
  onSubmit: (role: Partial<Role>) => Promise<void>;
  onCancel?: () => void;
  isLoading?: boolean;
}

export function RoleForm({ role, pages, onSubmit, onCancel, isLoading }: RoleFormProps) {
  const [formData, setFormData] = React.useState<Partial<Role>>(role);

  React.useEffect(() => {
    if (!formData.pageList) {
      setFormData(prev => ({
        ...prev,
        pageList: pages.map(page => ({
          pageId: page.id!,
          pageName: page.name,
          me: false,
          view: false,
          update: false,
          insert: false,
          delete: false,
        })),
      }));
    }
  }, [pages]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
  };

  const handlePermissionChange = (pageId: string, field: keyof PagePermission) => {
    const pageList = formData.pageList?.map(permission =>
      permission.pageId === pageId
        ? { ...permission, [field]: !permission[field] }
        : permission
    ) || [];

    setFormData(prev => ({ ...prev, pageList }));
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-8">
      <div className="grid gap-6">
        <div className="space-y-1.5">
          <label className="flex items-center gap-2 text-sm font-medium text-gray-700">
            <Shield className="w-4 h-4 text-gray-400" />
            Rol Adı
          </label>
          <Input
            value={formData.name || ''}
            onChange={e => setFormData(prev => ({ ...prev, name: e.target.value }))}
            placeholder="Rol adını girin"
            required
          />
        </div>

        <div className="space-y-1.5">
          <label className="flex items-center gap-2 text-sm font-medium text-gray-700">
            <FileText className="w-4 h-4 text-gray-400" />
            Açıklama
          </label>
          <textarea
            value={formData.detail || ''}
            onChange={e => setFormData(prev => ({ ...prev, detail: e.target.value }))}
            className="block w-full rounded-lg border border-gray-300 bg-white px-4 py-2.5 text-gray-900 placeholder:text-gray-500 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 transition duration-200"
            placeholder="Rol hakkında açıklama girin"
            rows={3}
          />
        </div>
      </div>

      <div className="space-y-3">
        <h3 className="flex items-center gap-2 text-sm font-medium text-gray-700">
          <Shield className="w-4 h-4 text-gray-400" />
          Sayfa İzinleri
        </h3>
        
        {formData.pageList && (
          <RolePermissions
            permissions={formData.pageList}
            onPermissionChange={handlePermissionChange}
          />
        )}
      </div>

      <div className="flex justify-end gap-2">
        {onCancel && (
          <Button
            type="button"
            variant="secondary"
            onClick={onCancel}
          >
            <X className="w-4 h-4" />
            İptal
          </Button>
        )}
        <Button
          type="submit"
          isLoading={isLoading}
          disabled={isLoading || !formData.name}
        >
          <Save className="w-4 h-4" />
          {role.id ? 'Güncelle' : 'Kaydet'}
        </Button>
      </div>
    </form>
  );
}