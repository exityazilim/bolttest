import React, { useState, useEffect } from 'react';
import { Reservation } from '../../types/reservation';
import { User } from '../../types/user';
import { Product } from '../../types/product';
import {
  Save,
  X,
  Calendar,
  User as UserIcon,
  Package,
  Hash,
  Pencil,
  Trash2,
} from 'lucide-react';
import { Button } from '../ui/Button';
import { DateInput } from '../ui/DateInput';
import { SearchableSelect } from '../ui/SearchableSelect';
import { Input } from '../ui/Input';
import { reservationApi } from '../../services/reservationApi';
import { ConfirmDialog } from '../ui/ConfirmDialog';

interface ReservationFormProps {
  reservation?: Reservation;
  users: User[];
  products: Product[];
  onSubmit: (data: Omit<Reservation, 'id'>) => Promise<void>;
  onCancel: () => void;
  isLoading?: boolean;
  onEdit?: (reservation: Reservation) => void;
}

export function ReservationForm({
  reservation,
  users,
  products,
  onSubmit,
  onCancel,
  isLoading,
  onEdit,
}: ReservationFormProps) {
  const [formData, setFormData] = React.useState({
    date: reservation?.date || new Date().toISOString().split('T')[0],
    userId: reservation?.userId || '',
    productId: reservation?.productId || '',
    quantity: reservation?.quantity?.toString() || '',
  });

  const [reservedStock, setReservedStock] = useState(0);
  const [dateReservations, setDateReservations] = useState<Reservation[]>([]);
  const [selectedProduct, setSelectedProduct] = useState<Product | undefined>();
  const [reservationToDelete, setReservationToDelete] = useState<Reservation | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  useEffect(() => {
    const fetchReservedStock = async () => {
      if (!formData.productId || !formData.date) return;

      try {
        const allReservations = await reservationApi.getAll({
          date: formData.date,
          productId: formData.productId
        });
        
        const filteredReservations = allReservations.filter(
          (r) => !reservation || r.id !== reservation.id
        );

        const totalReserved = filteredReservations.reduce(
          (sum, r) => sum + r.quantity,
          0
        );
        setReservedStock(totalReserved);
        setDateReservations(filteredReservations);
        setSelectedProduct(products.find((p) => p.id === formData.productId));
      } catch (error) {
        console.error('Error fetching reserved stock:', error);
      }
    };

    fetchReservedStock();
  }, [formData.productId, formData.date, reservation, products]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const quantity = parseInt(formData.quantity.toString()) || 0;
    if (quantity <= 0) return;
    
    await onSubmit({
      ...formData,
      quantity
    });
  };

  const handleQuantityChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.replace(/^0+/, '');
    setFormData(prev => ({
      ...prev,
      quantity: value
    }));
  };

  const getUserName = (userId: string) => {
    const user = users.find((u) => u.id === userId);
    return user ? (user.detail ? `${user.detail}` : user.name) : 'Bilinmiyor';
  };

  const handleEdit = (reservationToEdit: Reservation) => {
    if (onEdit) {
      setFormData({
        date: reservationToEdit.date,
        userId: reservationToEdit.userId,
        productId: reservationToEdit.productId,
        quantity: reservationToEdit.quantity.toString(),
      });
      onEdit(reservationToEdit);
    }
  };

  const handleDelete = async () => {
    if (!reservationToDelete) return;

    setIsDeleting(true);
    try {
      await reservationApi.delete(reservationToDelete.id!);
      const allReservations = await reservationApi.getAll();
      const filteredReservations = allReservations.filter(
        (r) =>
          r.productId === formData.productId &&
          r.date === formData.date &&
          (!reservation || r.id !== reservation.id)
      );
      setDateReservations(filteredReservations);
      setReservationToDelete(null);
    } catch (error) {
      console.error('Error deleting reservation:', error);
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-8">
      <div className="grid gap-8">
        <div className="space-y-2">
          <label className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-2">
            <Calendar className="w-5 h-5 text-gray-400" />
            Rezervasyon Tarihi
          </label>
          <DateInput
            value={formData.date}
            onChange={(e) => setFormData({ ...formData, date: e.target.value })}
            required
          />
        </div>

        <div className="space-y-2">
          <label className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-2">
            <UserIcon className="w-5 h-5 text-gray-400" />
            Müşteri
          </label>
          <SearchableSelect
            options={users.map((user) => ({
              value: user.id,
              label: user.detail ? `${user.detail}` : user.name,
            }))}
            value={formData.userId}
            onChange={(value) => setFormData({ ...formData, userId: value })}
            placeholder="Müşteri seçin"
            required
          />
        </div>

        <div className="space-y-2">
          <label className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-2">
            <Package className="w-5 h-5 text-gray-400" />
            Ürün
          </label>
          <SearchableSelect
            options={products
              .filter((product) => product.isActive)
              .map((product) => ({
                value: product.id!,
                label: product.name,
              }))}
            value={formData.productId}
            onChange={(value) => setFormData({ ...formData, productId: value })}
            placeholder="Ürün seçin"
            required
          />
        </div>

        <div className="space-y-2">
          <label className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-2">
            <Hash className="w-5 h-5 text-gray-400" />
            Rezerve Edilecek Stok
          </label>
          <Input
            type="number"
            value={formData.quantity}
            onChange={handleQuantityChange}
            min="1"
            max={selectedProduct ? selectedProduct.stock - reservedStock : 1}
            required
          />
          {selectedProduct && (
            <div className="space-y-4">
              <div className="flex gap-4 text-sm">
                <p className="text-gray-500">
                  Mevcut Stok: {selectedProduct.stock}
                </p>
                <p className="text-gray-500">Rezerve Edilen: {reservedStock}</p>
                <p className={`font-medium ${
                  selectedProduct.stock - reservedStock > 0
                    ? 'text-green-600'
                    : 'text-red-600'
                }`}>
                  Kalan Stok: {selectedProduct.stock - reservedStock}
                </p>
              </div>

              {dateReservations.length > 0 && (
                <div className="mt-4">
                  <h4 className="text-sm font-medium text-gray-700 mb-2">
                    Bu Tarihte Bu Ürüne Rezervasyon Yapan Müşteriler:
                  </h4>
                  <div className="space-y-2">
                    {dateReservations.map((res) => (
                      <div
                        key={res.id}
                        className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
                      >
                        <div>
                          <span className="font-medium">
                            {getUserName(res.userId)}
                          </span>
                          <span className="text-gray-500 ml-2">
                            ({res.quantity} adet)
                          </span>
                        </div>
                        <div className="flex gap-2">
                          <Button
                            type="button"
                            variant="ghost"
                            onClick={() => handleEdit(res)}
                            className="text-gray-600 hover:text-gray-900"
                          >
                            <Pencil className="w-4 h-4" />
                          </Button>
                          <Button
                            type="button"
                            variant="ghost"
                            onClick={() => setReservationToDelete(res)}
                            className="text-red-600 hover:text-red-900"
                          >
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}
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
            !formData.date ||
            !formData.userId ||
            !formData.productId ||
            !formData.quantity ||
            (selectedProduct &&
              parseInt(formData.quantity.toString()) > selectedProduct.stock - reservedStock)
          }
        >
          <Save className="w-4 h-4" />
          {reservation ? 'Güncelle' : 'Kaydet'}
        </Button>
      </div>

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
    </form>
  );
}