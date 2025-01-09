import React, { useState, useEffect } from 'react';
import { Plus, Pencil, Trash2 } from 'lucide-react';
import { Product } from '../types/product';
import { productApi } from '../services/productApi';
import { Card } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { ProductForm } from '../components/products/ProductForm';
import { ConfirmDialog } from '../components/ui/ConfirmDialog';

export default function Products() {
  const [products, setProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [isAdding, setIsAdding] = useState(false);
  const [productToDelete, setProductToDelete] = useState<Product | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  const fetchProducts = async () => {
    setIsLoading(true);
    try {
      const data = await productApi.getAll();
      setProducts(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Ürünler yüklenirken hata oluştu');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  const handleCreate = async (productData: Omit<Product, 'id'>) => {
    try {
      await productApi.create(productData);
      setIsAdding(false);
      fetchProducts();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Ürün oluşturulurken hata oluştu');
    }
  };

  const handleUpdate = async (productData: Omit<Product, 'id'>) => {
    if (!editingProduct?.id) return;
    
    try {
      await productApi.update({ ...productData, id: editingProduct.id });
      setEditingProduct(null);
      fetchProducts();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Ürün güncellenirken hata oluştu');
    }
  };

  const handleDelete = async () => {
    if (!productToDelete) return;
    
    setIsDeleting(true);
    try {
      await productApi.deleteImage(productToDelete.imageUrl);
      await productApi.delete(productToDelete.id!);
      setProductToDelete(null);
      fetchProducts();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Ürün silinirken hata oluştu');
    } finally {
      setIsDeleting(false);
    }
  };

  if (isLoading && products.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="max-w-6xl mx-auto px-4">
          <Card>
            <div className="p-8 text-center text-gray-500">Yükleniyor...</div>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-6xl mx-auto px-4">
        <Card className="divide-y divide-gray-100">
          <div className="p-6">
            <div className="flex justify-between items-center">
              <h1 className="text-2xl font-semibold text-gray-900">Ürünler</h1>
              {!isAdding && !editingProduct && (
                <Button onClick={() => setIsAdding(true)}>
                  <Plus className="w-4 h-4" />
                  Yeni Ürün
                </Button>
              )}
            </div>

            {error && (
              <div className="mt-4 p-4 bg-red-50 text-red-600 rounded-lg">
                {error}
              </div>
            )}
          </div>

          {(isAdding || editingProduct) && (
            <div className="p-6">
              <ProductForm
                product={editingProduct || undefined}
                onSubmit={editingProduct ? handleUpdate : handleCreate}
                onCancel={() => {
                  setIsAdding(false);
                  setEditingProduct(null);
                }}
                isLoading={isLoading}
              />
            </div>
          )}

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 p-6">
            {products.map((product) => (
              <div key={product.id} className="border rounded-lg overflow-hidden bg-white">
                <img
                  src={product.imageUrl}
                  alt={product.name}
                  className="w-full h-48 object-cover"
                />
                <div className="p-4">
                  <div className="flex justify-between items-start">
                    <div>
                      <h3 className="text-lg font-medium text-gray-900">
                        {product.name}
                      </h3>
                      <p className="text-sm text-gray-500 mt-1">
                        Stok: {product.stock}
                      </p>
                      <div className="mt-2">
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                          product.isActive
                            ? 'bg-green-100 text-green-800'
                            : 'bg-red-100 text-red-800'
                        }`}>
                          {product.isActive ? 'Aktif' : 'Pasif'}
                        </span>
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <Button
                        variant="ghost"
                        onClick={() => setEditingProduct(product)}
                        className="text-gray-600 hover:text-gray-900"
                      >
                        <Pencil className="w-4 h-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        onClick={() => setProductToDelete(product)}
                        className="text-red-600 hover:text-red-900"
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            ))}

            {products.length === 0 && !isAdding && (
              <div className="col-span-full text-center py-8 text-gray-500">
                Henüz ürün bulunmuyor
              </div>
            )}
          </div>
        </Card>
      </div>

      <ConfirmDialog
        isOpen={!!productToDelete}
        title="Ürün Silme"
        message="Bu ürünü silmek istediğinizden emin misiniz? Bu işlem geri alınamaz."
        confirmLabel="Sil"
        cancelLabel="İptal"
        onConfirm={handleDelete}
        onCancel={() => setProductToDelete(null)}
        isLoading={isDeleting}
      />
    </div>
  );
}