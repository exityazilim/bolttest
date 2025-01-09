import React, { useState } from 'react';
import { Product } from '../../types/product';
import { Save, X, Package, Image as ImageIcon } from 'lucide-react';
import { Button } from '../ui/Button';
import { Input } from '../ui/Input';
import { productApi } from '../../services/productApi';

interface ProductFormProps {
  product?: Product;
  onSubmit: (product: Omit<Product, 'id'>) => Promise<void>;
  onCancel: () => void;
  isLoading?: boolean;
}

export function ProductForm({
  product,
  onSubmit,
  onCancel,
  isLoading,
}: ProductFormProps) {
  const [formData, setFormData] = useState({
    name: product?.name || '',
    imageUrl: product?.imageUrl || '',
    stock: product?.stock || 0,
    isActive: product?.isActive ?? true,
  });
  const [uploadLoading, setUploadLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploadLoading(true);
    setError(null);

    try {
      const imageUrl = await productApi.uploadImage(file);
      setFormData(prev => ({ ...prev, imageUrl }));
    } catch (err) {
      setError('Resim yüklenirken hata oluştu');
    } finally {
      setUploadLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.imageUrl) {
      setError('Lütfen bir ürün resmi yükleyin');
      return;
    }
    await onSubmit(formData);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {error && (
        <div className="p-3 bg-red-50 text-red-600 rounded-lg">
          {error}
        </div>
      )}

      <div className="grid gap-6">
        <div className="space-y-1.5">
          <label className="flex items-center gap-2 text-sm font-medium text-gray-700">
            <Package className="w-4 h-4 text-gray-400" />
            Ürün Adı
          </label>
          <Input
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            placeholder="Ürün adını girin"
            required
          />
        </div>

        <div className="space-y-1.5">
          <label className="flex items-center gap-2 text-sm font-medium text-gray-700">
            <ImageIcon className="w-4 h-4 text-gray-400" />
            Ürün Fotoğrafı
          </label>
          <div className="space-y-3">
            {formData.imageUrl && (
              <img
                src={formData.imageUrl}
                alt="Ürün"
                className="w-32 h-32 object-cover rounded-lg border"
              />
            )}
            <div className="relative">
              <Button
                type="button"
                variant="secondary"
                className="relative"
                disabled={uploadLoading}
              >
                <input
                  type="file"
                  className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                  onChange={handleImageUpload}
                  accept="image/*"
                  disabled={uploadLoading}
                />
                {uploadLoading ? 'Yükleniyor...' : 'Resim Seç'}
              </Button>
            </div>
          </div>
        </div>

        <div className="space-y-1.5">
          <label className="flex items-center gap-2 text-sm font-medium text-gray-700">
            <Package className="w-4 h-4 text-gray-400" />
            Stok Miktarı
          </label>
          <Input
            type="number"
            value={formData.stock}
            onChange={(e) => setFormData({ ...formData, stock: parseInt(e.target.value) || 0 })}
            placeholder="Stok miktarını girin"
            required
            min="0"
          />
        </div>

        <div>
          <label className="flex items-center gap-2 cursor-pointer group">
            <div className={`relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${formData.isActive ? 'bg-indigo-600' : 'bg-gray-200'}`}>
              <span
                className={`inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${formData.isActive ? 'translate-x-5' : 'translate-x-0'}`}
              />
              <input
                type="checkbox"
                className="sr-only"
                checked={formData.isActive}
                onChange={(e) => setFormData({ ...formData, isActive: e.target.checked })}
              />
            </div>
            <span className="text-sm font-medium text-gray-700 group-hover:text-gray-900">
              {formData.isActive ? 'Aktif' : 'Pasif'}
            </span>
          </label>
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
          disabled={isLoading || !formData.name || !formData.imageUrl}
        >
          <Save className="w-4 h-4" />
          {product ? 'Güncelle' : 'Kaydet'}
        </Button>
      </div>
    </form>
  );
}