import { UserData } from "../entities/userData";

export interface UserListResponse {
    success: boolean,
    userList: UserData[]
}