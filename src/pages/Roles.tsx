import React, { useState, useEffect } from 'react';
import { Role } from '../types/role';
import { Page, pageApi } from '../services/pageApi';
import { roleApi } from '../services/roleApi';
import { RoleForm } from '../components/roles/RoleForm';
import { Plus, Pencil, Trash2 } from 'lucide-react';

export default function Roles() {
  const [roles, setRoles] = useState<Role[]>([]);
  const [pages, setPages] = useState<Page[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [editingRole, setEditingRole] = useState<Role | null>(null);
  const [isAdding, setIsAdding] = useState(false);

  const fetchData = async () => {
    setIsLoading(true);
    try {
      const [rolesData, pagesData] = await Promise.all([
        roleApi.getAll(),
        pageApi.getAll(),
      ]);
      setRoles(rolesData);
      setPages(pagesData);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Veriler yüklenirken hata oluştu');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleCreate = async (role: Partial<Role>) => {
    try {
      await roleApi.create(role as Omit<Role, 'id'>);
      setIsAdding(false);
      fetchData();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Rol oluşturulurken hata oluştu');
    }
  };

  const handleUpdate = async (role: Partial<Role>) => {
    try {
      await roleApi.update(role as Role);
      setEditingRole(null);
      fetchData();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Rol güncellenirken hata oluştu');
    }
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm('Bu rolü silmek istediğinizden emin misiniz?')) return;
    
    try {
      await roleApi.delete(id);
      fetchData();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Rol silinirken hata oluştu');
    }
  };

  if (isLoading && roles.length === 0) {
    return <div className="flex justify-center p-8">Yükleniyor...</div>;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-6xl mx-auto px-4 py-8">
        <div className="bg-white rounded-xl shadow-sm p-6 space-y-6">
          <div className="flex justify-between items-center">
            <h1 className="text-2xl font-semibold text-gray-900">Roller</h1>
            {!isAdding && !editingRole && (
              <button
                onClick={() => setIsAdding(true)}
                className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
              >
                <Plus className="w-4 h-4 mr-2" />
                Yeni Rol
              </button>
            )}
          </div>

          {error && (
            <div className="bg-red-50 text-red-600 p-3 rounded-lg">
              {error}
            </div>
          )}

          {isAdding && (
            <div className="border rounded-lg p-4">
              <RoleForm
                role={{}}
                pages={pages}
                onSubmit={handleCreate}
                onCancel={() => setIsAdding(false)}
                isLoading={isLoading}
              />
            </div>
          )}

          {!isAdding && (
            <div className="space-y-4">
              {roles.map((role) => (
                <div key={role.id} className="border rounded-lg p-4">
                  {editingRole?.id === role.id ? (
                    <RoleForm
                      role={editingRole}
                      pages={pages}
                      onSubmit={handleUpdate}
                      onCancel={() => setEditingRole(null)}
                      isLoading={isLoading}
                    />
                  ) : (
                    <div className="flex justify-between items-center">
                      <div>
                        <h3 className="text-lg font-medium text-gray-900">{role.name}</h3>
                        {role.detail && (
                          <p className="mt-1 text-sm text-gray-500">{role.detail}</p>
                        )}
                      </div>
                      <div className="flex space-x-2">
                        <button
                          onClick={() => setEditingRole(role)}
                          className="p-2 text-gray-600 hover:bg-gray-100 rounded-md"
                          title="Düzenle"
                        >
                          <Pencil className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleDelete(role.id!)}
                          className="p-2 text-red-600 hover:bg-red-50 rounded-md"
                          title="Sil"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}