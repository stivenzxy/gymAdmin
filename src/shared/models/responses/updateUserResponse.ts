import { UserData } from "../entities/userData";

export interface UpdateUserResponse extends UserData {
    student_code_edited?: boolean;
    program_edited?: boolean;
    phone_edited?: boolean;
}