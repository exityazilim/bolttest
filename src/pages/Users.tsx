import React, { useState, useEffect } from 'react';
import { User } from '../types/user';
import { Role } from '../types/role';
import { userApi } from '../services/userApi';
import { roleApi } from '../services/roleApi';
import { UserForm } from '../components/users/UserForm';
import { UserSearch } from '../components/users/UserSearch';
import { Pagination } from '../components/Pagination';
import {
  Plus,
  Pencil,
  Trash2,
  Lock,
  FileSpreadsheet,
  Download,
} from 'lucide-react';
import { isSuperAdmin } from '../utils/authUtils';
import { ChangeUserPasswordModal } from '../components/users/ChangeUserPasswordModal';
import { ExcelImportModal } from '../components/users/ExcelImportModal';
import { utils, writeFile } from 'xlsx';

export default function Users() {
  const [users, setUsers] = useState<User[]>([]);
  const [filteredUsers, setFilteredUsers] = useState<User[]>([]);
  const [roles, setRoles] = useState<Role[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [editingUser, setEditingUser] = useState<User | null>(null);
  const [isAdding, setIsAdding] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(0);
  const [pageSize, setPageSize] = useState(10);
  const [userToChangePassword, setUserToChangePassword] = useState<User | null>(
    null
  );
  const [isExcelModalOpen, setIsExcelModalOpen] = useState(false);

  const fetchData = async () => {
    setIsLoading(true);
    try {
      const [usersData, rolesData] = await Promise.all([
        userApi.getAll(),
        roleApi.getAll(),
      ]);
      setUsers(usersData);
      setFilteredUsers(usersData);
      setRoles(rolesData);
    } catch (err) {
      setError(
        err instanceof Error ? err.message : 'Veriler yüklenirken hata oluştu'
      );
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  useEffect(() => {
    const filtered = users.filter(
      (user) =>
        user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (user.detail &&
          user.detail.toLowerCase().includes(searchTerm.toLowerCase()))
    );
    setFilteredUsers(filtered);
    setCurrentPage(0);
  }, [searchTerm, users]);

  const handleCreate = async (userData: any) => {
    try {
      await userApi.create(userData);
      setIsAdding(false);
      fetchData();
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : 'Müşteri oluşturulurken hata oluştu'
      );
    }
  };

  const handleUpdate = async (userData: any) => {
    try {
      await userApi.update(userData);
      setEditingUser(null);
      fetchData();
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : 'Müşteri güncellenirken hata oluştu'
      );
    }
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm('Bu Müşteriyi silmek istediğinizden emin misiniz?'))
      return;

    try {
      await userApi.delete(id);
      fetchData();
    } catch (err) {
      setError(
        err instanceof Error ? err.message : 'Müşteri silinirken hata oluştu'
      );
    }
  };

  const handlePasswordChange = async (password: string) => {
    if (!userToChangePassword) return;

    try {
      await userApi.update({
        id: userToChangePassword.id,
        name: userToChangePassword.name,
        roleId: userToChangePassword.roleId,
        detail: userToChangePassword.detail,
        password,
      });
      setUserToChangePassword(null);
    } catch (err) {
      throw err;
    }
  };

  const handleExportExcel = () => {
    const worksheet = utils.json_to_sheet(
      users.map((user) => ({
        'Vergi No': user.name,
        'Firma Ünvanı': user.detail,
        Şifre: '******',
        Yetki: user.roleName,
      }))
    );

    const workbook = utils.book_new();
    utils.book_append_sheet(workbook, worksheet, 'Müşteriler');

    writeFile(workbook, 'müşteriler.xlsx');
  };

  const totalPages = Math.ceil(filteredUsers.length / pageSize);
  const paginatedUsers = filteredUsers.slice(
    currentPage * pageSize,
    (currentPage + 1) * pageSize
  );

  if (isLoading && users.length === 0) {
    return <div className="flex justify-center p-8">Yükleniyor...</div>;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-6xl mx-auto px-4 py-8">
        <div className="bg-white rounded-xl shadow-sm p-6 space-y-6">
          <div className="flex justify-between items-center">
            <h1 className="text-2xl font-semibold text-gray-900">Müşteriler</h1>
            {!isAdding && !editingUser && (
              <div className="flex gap-2">
                {
                  //<button
                  //  onClick={handleExportExcel}
                  //  className="flex items-center px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
                  //>
                  //  <Download className="w-4 h-4 mr-2" />
                  //  Excel İndir
                  //</button>
                  //<button
                  //  onClick={() => setIsExcelModalOpen(true)}
                  //  className="flex items-center px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
                  //>
                  //  <FileSpreadsheet className="w-4 h-4 mr-2" />
                  //  Excel ile Ekle
                  //</button>
                }
                <button
                  onClick={() => setIsAdding(true)}
                  className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                >
                  <Plus className="w-4 h-4 mr-2" />
                  Yeni Müşteri
                </button>
              </div>
            )}
          </div>

          {!isAdding && !editingUser && (
            <UserSearch
              searchTerm={searchTerm}
              pageSize={pageSize}
              onSearchChange={setSearchTerm}
              onPageSizeChange={(value) => {
                setPageSize(Number(value));
                setCurrentPage(0);
              }}
            />
          )}

          {error && (
            <div className="bg-red-50 text-red-600 p-3 rounded-lg">{error}</div>
          )}

          {(isAdding || editingUser) && (
            <div className="border rounded-lg p-4">
              <UserForm
                user={editingUser || undefined}
                roles={roles}
                onSubmit={editingUser ? handleUpdate : handleCreate}
                onCancel={() => {
                  setIsAdding(false);
                  setEditingUser(null);
                }}
                isLoading={isLoading}
              />
            </div>
          )}

          <div className="space-y-4">
            {paginatedUsers.map((user) => (
              <div key={user.id} className="border rounded-lg p-4">
                <div className="flex justify-between items-center">
                  <div>
                    <h3 className="text-lg font-medium text-gray-900">
                      {user.name}
                      {user.detail && (
                        <span className="text-gray-500 ml-2">
                          ({user.detail})
                        </span>
                      )}
                    </h3>
                    <p className="text-sm text-gray-500 mt-1">
                      Rol: {user.roleName}
                    </p>
                  </div>
                  <div className="flex space-x-2">
                    {isSuperAdmin() && (
                      <button
                        onClick={() => setUserToChangePassword(user)}
                        className="p-2 text-indigo-600 hover:bg-indigo-50 rounded-md"
                        title="Şifre Değiştir"
                      >
                        <Lock className="w-4 h-4" />
                      </button>
                    )}
                    <button
                      onClick={() => setEditingUser(user)}
                      className="p-2 text-gray-600 hover:bg-gray-100 rounded-md"
                      title="Düzenle"
                    >
                      <Pencil className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => handleDelete(user.id)}
                      className="p-2 text-red-600 hover:bg-red-50 rounded-md"
                      title="Sil"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            ))}

            {paginatedUsers.length === 0 && (
              <div className="text-center py-8 text-gray-500">
                {searchTerm
                  ? 'Aranan müşterilere ait sonuç bulunamadı'
                  : 'Henüz müşteri bulunmuyor'}
              </div>
            )}
          </div>

          {filteredUsers.length > 0 && (
            <div className="flex justify-center mt-6">
              <Pagination
                currentPage={currentPage}
                totalPages={totalPages}
                onPageChange={setCurrentPage}
              />
            </div>
          )}
        </div>
      </div>

      <ChangeUserPasswordModal
        isOpen={!!userToChangePassword}
        onClose={() => setUserToChangePassword(null)}
        onSubmit={handlePasswordChange}
        userName={userToChangePassword?.name || ''}
      />

      <ExcelImportModal
        isOpen={isExcelModalOpen}
        onClose={() => setIsExcelModalOpen(false)}
        roles={roles}
        onSuccess={fetchData}
      />
    </div>
  );
}
