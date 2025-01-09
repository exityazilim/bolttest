import React, { useState, useEffect } from 'react';
import { Plus, Pencil, Trash2, Search, AlertCircle } from 'lucide-react';
import { Reservation } from '../types/reservation';
import { User } from '../types/user';
import { Product } from '../types/product';
import { reservationApi } from '../services/reservationApi';
import { userApi } from '../services/userApi';
import { productApi } from '../services/productApi';
import { Card } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { ReservationForm } from '../components/reservations/ReservationForm';
import { ConfirmDialog } from '../components/ui/ConfirmDialog';
import { SearchableSelect } from '../components/ui/SearchableSelect';
import { DateInput } from '../components/ui/DateInput';

export default function Reservations() {
  const [reservations, setReservations] = useState<Reservation[]>([]);
  const [users, setUsers] = useState<User[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [editingReservation, setEditingReservation] = useState<Reservation | null>(null);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [reservationToDelete, setReservationToDelete] = useState<Reservation | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  // Filter states
  const [selectedDate, setSelectedDate] = useState('');
  const [selectedUser, setSelectedUser] = useState('');
  const [selectedProduct, setSelectedProduct] = useState('');
  const [isFiltered, setIsFiltered] = useState(false);

  const fetchUsers = async () => {
    try {
      const usersData = await userApi.getAll();
      setUsers(usersData);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Kullanıcılar yüklenirken hata oluştu');
    }
  };

  const fetchProducts = async () => {
    try {
      const productsData = await productApi.getAll();
      setProducts(productsData);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Ürünler yüklenirken hata oluştu');
    }
  };

  useEffect(() => {
    fetchUsers();
    fetchProducts();
  }, []);

  const fetchReservations = async () => {
    setIsLoading(true);
    try {
      // Sadece seçili filtreler varsa API'ye gönder
      const filters: Record<string, string> = {};
      if (selectedDate) filters.date = selectedDate;
      if (selectedUser) filters.userId = selectedUser;
      if (selectedProduct) filters.productId = selectedProduct;

      const reservationsData = await reservationApi.getAll(
        Object.keys(filters).length > 0 ? filters : undefined
      );
      setReservations(reservationsData);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Rezervasyonlar yüklenirken hata oluştu');
    } finally {
      setIsLoading(false);
    }
  };

  const handleFilter = () => {
    if (!selectedDate && !selectedUser && !selectedProduct) {
      setError('Lütfen en az bir filtre seçin');
      return;
    }
    setError(null);
    setIsFiltered(true);
    fetchReservations();
  };

  const handleCreate = async (data: Omit<Reservation, 'id'>) => {
    try {
      await reservationApi.create(data);
      setIsFormOpen(false);
      if (isFiltered) {
        fetchReservations();
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Rezervasyon oluşturulurken hata oluştu');
    }
  };

  const handleUpdate = async (data: Omit<Reservation, 'id'>) => {
    if (!editingReservation?.id) return;

    try {
      await reservationApi.update({ ...data, id: editingReservation.id });
      setEditingReservation(null);
      setIsFormOpen(false);
      if (isFiltered) {
        fetchReservations();
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Rezervasyon güncellenirken hata oluştu');
    }
  };

  const handleDelete = async () => {
    if (!reservationToDelete) return;

    setIsDeleting(true);
    try {
      await reservationApi.delete(reservationToDelete.id!);
      setReservationToDelete(null);
      if (isFiltered) {
        fetchReservations();
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Rezervasyon silinirken hata oluştu');
    } finally {
      setIsDeleting(false);
    }
  };

  const getUserName = (userId: string) => {
    const user = users.find(u => u.id === userId);
    return user ? (user.detail ? `${user.detail}` : user.name) : 'Bilinmiyor';
  };

  const getProductName = (productId: string) => {
    const product = products.find(p => p.id === productId);
    return product ? product.name : 'Bilinmiyor';
  };

  const handleEdit = (reservation: Reservation) => {
    setEditingReservation(reservation);
    setIsFormOpen(true);
  };

  const handleCloseForm = () => {
    setEditingReservation(null);
    setIsFormOpen(false);
    if (isFiltered) {
      fetchReservations();
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-6xl mx-auto px-4">
        <Card className="divide-y divide-gray-100">
          <div className="p-6">
            <div className="flex justify-between items-center mb-6">
              <h1 className="text-2xl font-semibold text-gray-900">Rezervasyonlar</h1>
              <Button onClick={() => setIsFormOpen(true)}>
                <Plus className="w-4 h-4" />
                Yeni Rezervasyon
              </Button>
            </div>

            {/* Filters */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Tarih
                </label>
                <DateInput
                  value={selectedDate}
                  onChange={(e) => setSelectedDate(e.target.value)}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Müşteri
                </label>
                <SearchableSelect
                  options={users.map(user => ({
                    value: user.id,
                    label: user.detail ? `${user.detail}` : user.name,
                  }))}
                  value={selectedUser}
                  onChange={setSelectedUser}
                  placeholder="Müşteri seçin"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Ürün
                </label>
                <SearchableSelect
                  options={products.map(product => ({
                    value: product.id!,
                    label: product.name,
                  }))}
                  value={selectedProduct}
                  onChange={setSelectedProduct}
                  placeholder="Ürün seçin"
                />
              </div>
            </div>

            <Button onClick={handleFilter} className="w-full">
              <Search className="w-4 h-4" />
              Filtrele
            </Button>

            {error && (
              <div className="mt-4 p-4 bg-red-50 text-red-600 rounded-lg flex items-center gap-2">
                <AlertCircle className="w-5 h-5 flex-shrink-0" />
                {error}
              </div>
            )}
          </div>

          <div className="divide-y divide-gray-100">
            {isFiltered ? (
              isLoading ? (
                <div className="p-8 text-center text-gray-500">
                  Yükleniyor...
                </div>
              ) : (
                <>
                  {reservations.map((reservation) => (
                    <div key={reservation.id} className="p-4 hover:bg-gray-50">
                      <div className="flex justify-between items-start">
                        <div className="space-y-1">
                          <div className="flex items-center gap-2">
                            <span className="font-medium text-gray-900">
                              {getUserName(reservation.userId)}
                            </span>
                            <span className="text-gray-400">•</span>
                            <span className="text-gray-600">
                              {getProductName(reservation.productId)}
                            </span>
                          </div>
                          <div className="text-sm text-gray-500">
                            <span>
                              Rezervasyon Tarihi: {new Date(reservation.date).toLocaleDateString('tr-TR')}
                            </span>
                            <span className="mx-2">•</span>
                            <span>Miktar: {reservation.quantity}</span>
                          </div>
                        </div>
                        <div className="flex gap-2">
                          <Button
                            variant="ghost"
                            onClick={() => handleEdit(reservation)}
                            className="text-gray-600 hover:text-gray-900"
                          >
                            <Pencil className="w-4 h-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            onClick={() => setReservationToDelete(reservation)}
                            className="text-red-600 hover:text-red-900"
                          >
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </div>
                      </div>
                    </div>
                  ))}

                  {reservations.length === 0 && (
                    <div className="p-8 text-center text-gray-500">
                      Filtrelenen kriterlere uygun rezervasyon bulunamadı
                    </div>
                  )}
                </>
              )
            ) : (
              <div className="p-8 text-center text-gray-500">
                Rezervasyonları görüntülemek için filtreleme yapın
              </div>
            )}
          </div>
        </Card>
      </div>

      {/* Form Modal */}
      {isFormOpen && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50">
          <div className="bg-white rounded-xl p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <div className="mb-6">
              <h2 className="text-xl font-semibold text-gray-900">
                {editingReservation ? 'Rezervasyon Düzenle' : 'Yeni Rezervasyon'}
              </h2>
            </div>
            <ReservationForm
              reservation={editingReservation || undefined}
              users={users}
              products={products}
              onSubmit={editingReservation ? handleUpdate : handleCreate}
              onCancel={handleCloseForm}
              isLoading={isLoading}
              onEdit={handleEdit}
            />
          </div>
        </div>
      )}

      <ConfirmDialog
        isOpen={!!reservationToDelete}
        title="Rezervasyon Silme"
        message="Bu rezervasyonu silmek istediğinizden emin misiniz? Bu işlem geri alınamaz."
        confirmLabel="Sil"
        cancelLabel="İptal"
        onConfirm={handleDelete}
        onCancel={() => setReservationToDelete(null)}
        isLoading={isDeleting}
      />
    </div>
  );
}