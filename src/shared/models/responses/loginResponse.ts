import { UserData } from "../entities/userData";

export interface LoginResponse {
    success: boolean,
    message: string,
    data: UserData
}