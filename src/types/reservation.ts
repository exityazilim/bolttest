export interface Reservation {
  id?: string;
  date: string;
  userId: string;
  productId: string;
  quantity: number;
}

export interface CreateReservation extends Omit<Reservation, 'id'> {}
export interface UpdateReservation extends Reservation {}