import React, { useState } from 'react';
import { X, Upload, AlertCircle } from 'lucide-react';
import { read, utils } from 'xlsx';
import { Button } from '../ui/Button';
import { SearchableSelect } from '../ui/SearchableSelect';
import { Role } from '../../types/role';
import { userApi } from '../../services/userApi';

interface ExcelImportModalProps {
  isOpen: boolean;
  onClose: () => void;
  roles: Role[];
  onSuccess: () => void;
}

interface ExcelRow {
  'Firma Ünvanı': string;
  'Vergi No': string;
  'Şifre': string;
}

export function ExcelImportModal({
  isOpen,
  onClose,
  roles,
  onSuccess,
}: ExcelImportModalProps) {
  const [selectedRole, setSelectedRole] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [successCount, setSuccessCount] = useState(0);
  const [failCount, setFailCount] = useState(0);
  const [sameCount, setSameCount] = useState(0);

  if (!isOpen) return null;

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !selectedRole) return;

    setIsLoading(true);
    setError(null);
    setSuccessCount(0);
    setFailCount(0);
    setSameCount(0);

    try {
      // Read Excel file
      const data = await file.arrayBuffer();
      const workbook = read(data);
      const worksheet = workbook.Sheets[workbook.SheetNames[0]];
      const rows = utils.sheet_to_json<ExcelRow>(worksheet);

      // Process each row
      let successCount = 0;
      let failCount = 0;
      let sameCount = 0;

      for (const row of rows) {
        try {
          // Check if user exists
          const users = await userApi.getAll();
          const exists = users.some(
            (user) => user.name === row['Vergi No'].toString()
          );

          if (!exists) {
            // Create new user
            await userApi.create({
              name: row['Vergi No'].toString(),
              password: row['Şifre'].toString(),
              roleId: selectedRole,
              detail: row['Firma Ünvanı'].toString(),
            });
            successCount++;
          } else {
            sameCount++;
          }
        } catch (err) {
          alert(err);
          failCount++;
        }
      }

      setSuccessCount(successCount);
      setFailCount(failCount);
      setSameCount(sameCount);

      if (successCount > 0) {
        onSuccess();
      }

      // Reset file input
      e.target.value = '';
    } catch (err) {
      setError('Excel dosyası işlenirken hata oluştu');
    } finally {
      setIsLoading(false);
    }
  };

  const roleOptions = roles.map((role) => ({
    value: role.id!,
    label: role.name,
  }));

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50">
      <div className="bg-white rounded-xl p-6 w-full max-w-md">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-semibold text-gray-900">
            Excel ile Mükellef Ekle
          </h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-full transition-colors"
          >
            <X className="w-5 h-5 text-gray-500" />
          </button>
        </div>

        {error && (
          <div className="mb-6 p-3 bg-red-50 text-red-600 rounded-lg flex items-center gap-2">
            <AlertCircle className="w-5 h-5" />
            {error}
          </div>
        )}

        {(successCount > 0 || failCount > 0 || sameCount > 0) && (
          <div className="mb-6 p-3 bg-blue-50 text-blue-600 rounded-lg">
            <p>İşlem Sonucu:</p>
            <p>Başarılı: {successCount}</p>
            <p>Başarısız: {failCount}</p>
            <p>Daha Önceden Eklenmiş: {sameCount}</p>
          </div>
        )}

        <div className="space-y-6">
          <div className="space-y-1.5">
            <label className="block text-sm font-medium text-gray-700">
              Rol Seçin
            </label>
            <SearchableSelect
              options={roleOptions}
              value={selectedRole}
              onChange={setSelectedRole}
              placeholder="Rol seçin"
              required
            />
          </div>

          <div className="relative">
            <Button
              variant="secondary"
              className="w-full h-32 border-dashed"
              disabled={isLoading || !selectedRole}
            >
              <input
                type="file"
                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                onChange={handleFileUpload}
                accept=".xlsx,.xls"
                disabled={isLoading || !selectedRole}
              />
              <div className="text-center space-y-2">
                <Upload className="w-8 h-8 mx-auto text-gray-400" />
                <div className="text-gray-600">
                  {isLoading ? 'Yükleniyor...' : 'Excel dosyası seçin'}
                </div>
              </div>
            </Button>
          </div>

          <div className="text-sm text-gray-500">
            <p className="font-medium mb-2">Excel dosyası formatı:</p>
            <ul className="list-disc list-inside space-y-1">
              <li>Firma Ünvanı</li>
              <li>Vergi No</li>
              <li>Şifre</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
