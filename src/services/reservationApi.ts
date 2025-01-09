import { ObjectApi } from './objectApi';
import { Reservation, CreateReservation, UpdateReservation } from '../types/reservation';

const api = new ObjectApi();
const TABLE_NAME = 'Reservations';

export const reservationApi = {
  getAll: async (filters?: {
    date?: string;
    userId?: string;
    productId?: string;
  }) => {
    const query: Record<string, any> = {};
    
    if (filters?.date) {
      query.date = filters.date;
    }
    if (filters?.userId) {
      query.userId = filters.userId;
    }
    if (filters?.productId) {
      query.productId = filters.productId;
    }

    const response = await api.getAll<Reservation>(TABLE_NAME, {
      query: Object.keys(query).length > 0 ? query : undefined,
      sort: { date: 1 }
    });
    return response.items;
  },

  getByDateRange: async (startDate: string, endDate: string) => {
    const response = await api.getAll<Reservation>(TABLE_NAME, {
      query: {
        date: {
          $gte: startDate,
          $lte: endDate
        }
      },
      sort: { date: 1 }
    });
    return response.items;
  },

  create: async (data: CreateReservation) => {
    return await api.create<CreateReservation>(TABLE_NAME, data);
  },

  update: async (data: UpdateReservation) => {
    await api.update<UpdateReservation>(TABLE_NAME, data.id!, data);
  },

  delete: async (id: string) => {
    await api.delete(TABLE_NAME, id);
  },
};