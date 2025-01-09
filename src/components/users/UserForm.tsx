import React from 'react';
import { Role } from '../../types/role';
import { User, CreateUser, UpdateUser } from '../../types/user';
import { Save, X, User as UserIcon, Shield, FileText } from 'lucide-react';
import { Button } from '../ui/Button';
import { Input } from '../ui/Input';
import { SearchableSelect } from '../ui/SearchableSelect';

interface UserFormProps {
  user?: User;
  roles: Role[];
  onSubmit: (user: CreateUser | UpdateUser) => Promise<void>;
  onCancel: () => void;
  isLoading?: boolean;
}

export function UserForm({
  user,
  roles,
  onSubmit,
  onCancel,
  isLoading,
}: UserFormProps) {
  const [formData, setFormData] = React.useState({
    name: user?.name || '',
    password: '',
    roleId: user?.roleId || '',
    detail: user?.detail || '',
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const userData = user
      ? {
          id: user.id,
          name: formData.name,
          roleId: formData.roleId,
          detail: formData.detail,
        }
      : formData;
    onSubmit(userData);
  };

  const roleOptions = roles.map((role) => ({
    value: role.id!,
    label: role.name,
  }));

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="grid gap-6">
        <div className="space-y-1.5">
          <label className="flex items-center gap-2 text-sm font-medium text-gray-700">
            <UserIcon className="w-4 h-4 text-gray-400" />
            Müşteri Adı
          </label>
          <Input
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            placeholder="Müşteri adını girin"
            required
          />
        </div>

        {!user && (
          <div className="space-y-1.5">
            <label className="flex items-center gap-2 text-sm font-medium text-gray-700">
              <Shield className="w-4 h-4 text-gray-400" />
              Şifre
            </label>
            <Input
              type="password"
              value={formData.password}
              onChange={(e) =>
                setFormData({ ...formData, password: e.target.value })
              }
              placeholder="Şifre girin"
              required={!user}
            />
          </div>
        )}

        <div className="space-y-1.5">
          <label className="flex items-center gap-2 text-sm font-medium text-gray-700">
            <Shield className="w-4 h-4 text-gray-400" />
            Rol
          </label>
          <SearchableSelect
            options={roleOptions}
            value={formData.roleId}
            onChange={(value) => setFormData({ ...formData, roleId: value })}
            placeholder="Rol seçin"
            required
          />
        </div>

        <div className="space-y-1.5">
          <label className="flex items-center gap-2 text-sm font-medium text-gray-700">
            <FileText className="w-4 h-4 text-gray-400" />
            Müşteri Adı
          </label>
          <textarea
            value={formData.detail}
            onChange={(e) =>
              setFormData({ ...formData, detail: e.target.value })
            }
            className="block w-full rounded-lg border border-gray-300 bg-white px-4 py-2.5 text-gray-900 placeholder:text-gray-500 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 transition duration-200"
            placeholder="Müşteri adını girin"
            rows={3}
          />
        </div>
      </div>

      <div className="flex justify-end gap-2">
        <Button type="button" variant="secondary" onClick={onCancel}>
          <X className="w-4 h-4" />
          İptal
        </Button>
        <Button
          type="submit"
          isLoading={isLoading}
          disabled={
            isLoading ||
            !formData.name ||
            (!user && !formData.password) ||
            !formData.roleId
          }
        >
          <Save className="w-4 h-4" />
          {user ? 'Güncelle' : 'Kaydet'}
        </Button>
      </div>
    </form>
  );
}
