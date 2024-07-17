import { GymData } from "../entities/gymData";

export interface CreateGymResponse {
  success: boolean;
  message: string;
  gym_id: number;
}

export interface UpdateGymResponse {
  success: boolean;
  message: string;
}