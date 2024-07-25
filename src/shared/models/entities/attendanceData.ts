import { UserData } from './userData';

export interface AttendanceData {
  attendance_id: number;
  user: UserData;
  date: string;
  time: string;
  hours_amount: number;
}