import React, { useState, useEffect } from 'react';
import { Page, pageApi } from '../services/pageApi';
import { Plus } from 'lucide-react';
import { Button } from '../components/ui/Button';
import { Card } from '../components/ui/Card';
import { PageForm } from '../components/pages/PageForm';
import { PageListItem } from '../components/pages/PageListItem';

export default function Pages() {
  const [pages, setPages] = useState<Page[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [editingPage, setEditingPage] = useState<Page | null>(null);
  const [isAdding, setIsAdding] = useState(false);

  const fetchPages = async () => {
    setIsLoading(true);
    try {
      const data = await pageApi.getAll();
      setPages(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Modüller yüklenirken hata oluştu');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchPages();
  }, []);

  const handleCreate = async (page: Omit<Page, 'id'>) => {
    try {
      await pageApi.create(page);
      setIsAdding(false);
      fetchPages();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Modül oluşturulurken hata oluştu');
    }
  };

  const handleUpdate = async (page: Omit<Page, 'id'>) => {
    if (!editingPage?.id) return;
    
    try {
      await pageApi.update({ ...page, id: editingPage.id });
      setEditingPage(null);
      fetchPages();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Modül güncellenirken hata oluştu');
    }
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm('Bu modülü silmek istediğinizden emin misiniz?')) return;
    
    try {
      await pageApi.delete(id);
      fetchPages();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Modül silinirken hata oluştu');
    }
  };

  if (isLoading && pages.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="max-w-4xl mx-auto px-4">
          <Card>
            <div className="p-8 text-center text-gray-500">Yükleniyor...</div>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4">
        <Card className="divide-y divide-gray-100">
          <div className="p-6">
            <div className="flex justify-between items-center">
              <h1 className="text-2xl font-semibold text-gray-900">Modüller</h1>
              {!isAdding && !editingPage && (
                <Button onClick={() => setIsAdding(true)}>
                  <Plus className="w-4 h-4" />
                  Yeni Modül
                </Button>
              )}
            </div>

            {error && (
              <div className="mt-4 p-4 bg-red-50 text-red-600 rounded-lg">
                {error}
              </div>
            )}
          </div>

          {(isAdding || editingPage) && (
            <div className="p-6">
              <PageForm
                page={editingPage || undefined}
                onSubmit={editingPage ? handleUpdate : handleCreate}
                onCancel={() => {
                  setIsAdding(false);
                  setEditingPage(null);
                }}
                isLoading={isLoading}
              />
            </div>
          )}

          <div className="divide-y divide-gray-100">
            {pages.map((page) => (
              <PageListItem
                key={page.id}
                page={page}
                onEdit={setEditingPage}
                onDelete={handleDelete}
              />
            ))}
            
            {pages.length === 0 && !isAdding && (
              <div className="p-8 text-center text-gray-500">
                Henüz modül bulunmuyor
              </div>
            )}
          </div>
        </Card>
      </div>
    </div>
  );
}