import { UserData } from './userData';

export interface Membership {
  membership_id: number;
  start_date: string;
  end_date: string;
  user: UserData;
}