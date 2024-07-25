import { UserData } from "./userData";

export interface ReservationData {
  reservation_id: number;
  user: UserData; 
  date: string;
  time: string;
  hours_amount: number;
  end_time?: string;
}