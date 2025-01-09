import React from 'react';
import { PagePermission } from '../../types/role';
import { Eye, Edit, Plus, Trash2, User } from 'lucide-react';

interface RolePermissionsProps {
  permissions: PagePermission[];
  onPermissionChange: (pageId: string, field: keyof PagePermission) => void;
}

export function RolePermissions({ permissions, onPermissionChange }: RolePermissionsProps) {
  const permissionIcons = {
    view: Eye,
    me: User,
    update: Edit,
    insert: Plus,
    delete: Trash2,
  };

  return (
    <div className="border rounded-lg overflow-hidden">
      <table className="min-w-full divide-y divide-gray-200">
        <thead className="bg-gray-50">
          <tr>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Sayfa
            </th>
            {Object.entries(permissionIcons).map(([key, Icon]) => (
              <th
                key={key}
                className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider"
              >
                <div className="flex items-center justify-center gap-1.5">
                  <Icon className="w-4 h-4" />
                  {key === 'view' && 'Görüntüleme'}
                  {key === 'me' && 'Kendisi'}
                  {key === 'update' && 'Güncelleme'}
                  {key === 'insert' && 'Ekleme'}
                  {key === 'delete' && 'Silme'}
                </div>
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
          {permissions.map((permission) => (
            <tr key={permission.pageId} className="hover:bg-gray-50">
              <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                {permission.pageName}
              </td>
              {(['view', 'me', 'update', 'insert', 'delete'] as const).map(action => (
                <td key={action} className="px-6 py-4">
                  <div className="flex justify-center">
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input
                        type="checkbox"
                        checked={permission[action]}
                        onChange={() => onPermissionChange(permission.pageId, action)}
                        className="sr-only peer"
                      />
                      <div className="w-9 h-5 bg-gray-200 peer-focus:outline-none peer-focus:ring-2 peer-focus:ring-indigo-500/20 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-indigo-600"></div>
                    </label>
                  </div>
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}