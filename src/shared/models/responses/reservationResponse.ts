import { ReservationData } from '../entities/reservationData';

export interface ReservationResponse {
  success: boolean;
  message?: string;
  reservations: ReservationData[];
}
