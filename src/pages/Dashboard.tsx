import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import {
  LayoutDashboard,
  X,
  ChevronLeft,
  ChevronRight,
  Calendar,
} from 'lucide-react';
import { QuickActions } from '../components/QuickActions';
import { useStats } from '../hooks/useStats';
import { reservationApi } from '../services/reservationApi';
import { userApi } from '../services/userApi';
import { productApi } from '../services/productApi';
import { Reservation } from '../types/reservation';
import { User } from '../types/user';
import { Product } from '../types/product';
import { cn } from '../utils/cn';
import { ReservationForm } from '../components/reservations/ReservationForm';
import {
  format,
  startOfMonth,
  endOfMonth,
  eachDayOfInterval,
  isSameMonth,
  isToday,
  addMonths,
  subMonths,
  startOfWeek,
  endOfWeek,
  addWeeks,
  subWeeks,
  addDays,
  subDays,
  isSameDay,
} from 'date-fns';
import { tr } from 'date-fns/locale';

type CalendarView = 'month' | 'week' | 'day';

export default function Dashboard() {
  const { user } = useAuth();
  const { stats, isLoading } = useStats();
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [view, setView] = useState<CalendarView>('month');
  const [reservations, setReservations] = useState<Reservation[]>([]);
  const [users, setUsers] = useState<User[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [selectedDayReservations, setSelectedDayReservations] = useState<Reservation[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isReservationFormOpen, setIsReservationFormOpen] = useState(false);
  const [selectedReservationDate, setSelectedReservationDate] = useState<Date | null>(null);

  const fetchData = async () => {
    try {
      const [usersData, productsData] = await Promise.all([
        userApi.getAll(),
        productApi.getAll(),
      ]);
      setUsers(usersData);
      setProducts(productsData);
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  };

  const fetchReservations = async () => {
    try {
      let startDate, endDate;

      switch (view) {
        case 'month': {
          startDate = startOfMonth(selectedDate);
          endDate = endOfMonth(selectedDate);
          break;
        }
        case 'week': {
          startDate = startOfWeek(selectedDate, { weekStartsOn: 1 });
          endDate = endOfWeek(selectedDate, { weekStartsOn: 1 });
          break;
        }
        case 'day': {
          startDate = selectedDate;
          endDate = selectedDate;
          break;
        }
      }

      // Format dates for API query
      const formattedStartDate = format(startDate, 'yyyy-MM-dd');
      const formattedEndDate = format(endDate, 'yyyy-MM-dd');

      const reservationsData = await reservationApi.getByDateRange(
        formattedStartDate,
        formattedEndDate
      );
      setReservations(reservationsData);
    } catch (error) {
      console.error('Error fetching reservations:', error);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  useEffect(() => {
    fetchReservations();
  }, [view, selectedDate]);

  const getDaysToShow = () => {
    switch (view) {
      case 'month': {
        const monthStart = startOfMonth(selectedDate);
        const monthEnd = endOfMonth(selectedDate);
        const firstWeekStart = startOfWeek(monthStart, { weekStartsOn: 1 });
        const lastWeekEnd = endOfWeek(monthEnd, { weekStartsOn: 1 });
        return eachDayOfInterval({ start: firstWeekStart, end: lastWeekEnd });
      }
      case 'week': {
        const weekStart = startOfWeek(selectedDate, { weekStartsOn: 1 });
        const weekEnd = endOfWeek(selectedDate, { weekStartsOn: 1 });
        return eachDayOfInterval({ start: weekStart, end: weekEnd });
      }
      case 'day':
        return [selectedDate];
    }
  };

  const getReservationsForDay = (date: Date) => {
    const dateString = format(date, 'yyyy-MM-dd');
    return reservations.filter((r) => r.date === dateString);
  };

  const handleDayClick = (date: Date) => {
    const dayReservations = getReservationsForDay(date);
    setSelectedDayReservations(dayReservations);
    setSelectedReservationDate(date);
    setIsReservationFormOpen(true);
  };

  const handleReservationSubmit = async (data: Omit<Reservation, 'id'>) => {
    try {
      await reservationApi.create(data);
      setIsReservationFormOpen(false);
      setSelectedReservationDate(null);
      fetchReservations();
    } catch (error) {
      console.error('Error creating reservation:', error);
    }
  };

  const handleCloseForm = () => {
    setIsReservationFormOpen(false);
    setSelectedReservationDate(null);
    fetchReservations();
  };

  const handlePrevious = () => {
    switch (view) {
      case 'month':
        setSelectedDate((prev) => subMonths(prev, 1));
        break;
      case 'week':
        setSelectedDate((prev) => subWeeks(prev, 1));
        break;
      case 'day':
        setSelectedDate((prev) => subDays(prev, 1));
        break;
    }
  };

  const handleNext = () => {
    switch (view) {
      case 'month':
        setSelectedDate((prev) => addMonths(prev, 1));
        break;
      case 'week':
        setSelectedDate((prev) => addWeeks(prev, 1));
        break;
      case 'day':
        setSelectedDate((prev) => addDays(prev, 1));
        break;
    }
  };

  const getHeaderText = () => {
    switch (view) {
      case 'month':
        return format(selectedDate, 'MMMM yyyy', { locale: tr });
      case 'week':
        const weekStart = startOfWeek(selectedDate, { weekStartsOn: 1 });
        const weekEnd = endOfWeek(selectedDate, { weekStartsOn: 1 });
        return `${format(weekStart, 'd', { locale: tr })} - ${format(
          weekEnd,
          'd MMMM yyyy',
          { locale: tr }
        )}`;
      case 'day':
        return format(selectedDate, 'd MMMM yyyy', { locale: tr });
    }
  };

  const getUserName = (userId: string) => {
    const user = users.find((u) => u.id === userId);
    return user ? (user.detail ? `${user.detail}` : user.name) : 'Bilinmiyor';
  };

  const getProductName = (productId: string) => {
    const product = products.find((p) => p.id === productId);
    return product ? product.name : 'Bilinmiyor';
  };

  const renderReservationDetails = (dayReservations: Reservation[]) => {
    return (
      <div className="mt-4 space-y-3">
        {dayReservations.map((reservation) => (
          <div key={reservation.id} className="p-3 bg-indigo-50 rounded-lg">
            <div className="flex justify-between items-start">
              <div>
                <p className="font-medium text-indigo-900">
                  {getUserName(reservation.userId)}
                </p>
                <p className="text-sm text-indigo-700 mt-1">
                  {getProductName(reservation.productId)} - {reservation.quantity} adet
                </p>
              </div>
            </div>
          </div>
        ))}
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="space-y-6">
          {/* Welcome Section */}
          <div className="card p-6 sm:p-8">
            <div className="flex items-center gap-4">
              <div className="p-3 rounded-full bg-indigo-100 text-indigo-600">
                <LayoutDashboard className="h-6 w-6" />
              </div>
              <div>
                <h1 className="text-2xl font-semibold text-gray-900">
                  Tekrar hoşgeldiniz, {user?.name}!
                </h1>
                <p className="text-gray-500 mt-1">
                  Supla Takibinizi buradan yönetebilirsiniz.
                </p>
              </div>
            </div>
          </div>

          {/* Calendar Section */}
          <div className="card p-6">
            <div className="flex flex-col sm:flex-row items-center justify-between gap-4 mb-8">
              <div className="flex items-center gap-2">
                <button
                  onClick={handlePrevious}
                  className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                >
                  <ChevronLeft className="w-5 h-5" />
                </button>
                <h2 className="text-lg font-semibold text-gray-900">
                  {getHeaderText()}
                </h2>
                <button
                  onClick={handleNext}
                  className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                >
                  <ChevronRight className="w-5 h-5" />
                </button>
              </div>

              <div className="flex rounded-lg border border-gray-200 p-1">
                <button
                  onClick={() => setView('month')}
                  className={cn(
                    'px-3 py-1.5 text-sm font-medium rounded-md transition-colors',
                    view === 'month'
                      ? 'bg-indigo-100 text-indigo-700'
                      : 'text-gray-600 hover:bg-gray-50'
                  )}
                >
                  Ay
                </button>
                <button
                  onClick={() => setView('week')}
                  className={cn(
                    'px-3 py-1.5 text-sm font-medium rounded-md transition-colors',
                    view === 'week'
                      ? 'bg-indigo-100 text-indigo-700'
                      : 'text-gray-600 hover:bg-gray-50'
                  )}
                >
                  Hafta
                </button>
                <button
                  onClick={() => setView('day')}
                  className={cn(
                    'px-3 py-1.5 text-sm font-medium rounded-md transition-colors',
                    view === 'day'
                      ? 'bg-indigo-100 text-indigo-700'
                      : 'text-gray-600 hover:bg-gray-50'
                  )}
                >
                  Gün
                </button>
              </div>
            </div>

            <div
              className={cn(
                'grid gap-px bg-gray-200 rounded-lg overflow-hidden',
                view === 'month' && 'grid-cols-7',
                view === 'week' && 'grid-cols-1',
                view === 'day' && 'grid-cols-1'
              )}
            >
              {/* Day headers - Only show for month view */}
              {view === 'month' &&
                [
                  'Pazartesi',
                  'Salı',
                  'Çarşamba',
                  'Perşembe',
                  'Cuma',
                  'Cumartesi',
                  'Pazar',
                ].map((day) => (
                  <div
                    key={day}
                    className="bg-gray-50 py-2 text-center text-sm font-medium text-gray-500"
                  >
                    {day}
                  </div>
                ))}

              {/* Calendar days */}
              {getDaysToShow().map((day, dayIdx) => {
                const dayReservations = getReservationsForDay(day);
                return (
                  <div
                    key={day.toString()}
                    className={cn(
                      'relative bg-white p-2',
                      view === 'month' && 'min-h-[80px] sm:min-h-[100px]',
                      view === 'week' && 'min-h-[120px]',
                      view === 'day' && 'min-h-[400px]',
                      view === 'month' &&
                        dayIdx === 0 &&
                        `col-start-${day.getDay() || 7}`,
                      view === 'day' ? '' : 'hover:bg-gray-50 cursor-pointer'
                    )}
                    onClick={() => view !== 'day' && handleDayClick(day)}
                  >
                    <div className="flex items-center gap-2">
                      <time
                        dateTime={format(day, 'yyyy-MM-dd')}
                        className={cn(
                          'flex h-6 w-6 items-center justify-center rounded-full text-sm',
                          isToday(day) &&
                            'bg-indigo-600 font-semibold text-white',
                          !isToday(day) &&
                            isSameMonth(day, selectedDate) &&
                            'text-gray-900',
                          !isToday(day) &&
                            !isSameMonth(day, selectedDate) &&
                            'text-gray-400'
                        )}
                      >
                        {format(day, 'd')}
                      </time>
                      <span className="text-sm text-gray-500">
                        {format(day, 'EEEE', { locale: tr })}
                      </span>
                    </div>
                    {view === 'day'
                      ? renderReservationDetails(dayReservations)
                      : dayReservations.length > 0 && (
                          <div className="mt-2">
                            <div className="space-y-1">
                              {dayReservations.map((reservation) => (
                                <div
                                  key={reservation.id}
                                  className="px-2 py-1 bg-indigo-50 rounded text-xs text-indigo-700"
                                >
                                  {getProductName(reservation.productId)} -{' '}
                                  {reservation.quantity} adet -{' '}
                                  {getUserName(reservation.userId)}
                                </div>
                              ))}
                            </div>
                          </div>
                        )}
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>

      {/* Reservations Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-xl max-w-2xl w-full max-h-[80vh] overflow-hidden">
            <div className="p-6 border-b border-gray-100 flex justify-between items-center">
              <h3 className="text-lg font-semibold text-gray-900">
                {format(selectedDayReservations[0]?.date, 'd MMMM yyyy', {
                  locale: tr,
                })}{' '}
                Rezervasyonları
              </h3>
              <button
                onClick={() => setIsModalOpen(false)}
                className="text-gray-400 hover:text-gray-500"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="p-6 overflow-y-auto max-h-[60vh]">
              <div className="space-y-4">
                {selectedDayReservations.map((reservation) => (
                  <div
                    key={reservation.id}
                    className="p-4 bg-gray-50 rounded-lg"
                  >
                    <div className="flex justify-between items-start">
                      <div>
                        <p className="font-medium text-gray-900">
                          {getUserName(reservation.userId)}
                        </p>
                        <p className="text-sm text-gray-500 mt-1">
                          {getProductName(reservation.productId)} -{' '}
                          {reservation.quantity} adet
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Reservation Form Modal */}
      {isReservationFormOpen && selectedReservationDate && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50">
          <div className="bg-white rounded-xl p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <div className="mb-6">
              <h2 className="text-xl font-semibold text-gray-900">
                Yeni Rezervasyon -{' '}
                {format(selectedReservationDate, 'd MMMM yyyy', { locale: tr })}
              </h2>
            </div>
            <ReservationForm
              users={users}
              products={products}
              onSubmit={handleReservationSubmit}
              onCancel={handleCloseForm}
              reservation={{
                date: format(selectedReservationDate, 'yyyy-MM-dd'),
                userId: '',
                productId: '',
                quantity: 1,
              }}
            />
          </div>
        </div>
      )}
    </div>
  );
}