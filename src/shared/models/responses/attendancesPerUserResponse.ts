import { AttendanceData } from '../entities/attendanceData';
import { ReservationData } from '../entities/reservationData';

export interface AttendancesPerUserResponse {
  success: boolean;
  attendances: AttendanceData[];
  reservations: ReservationData[];
}