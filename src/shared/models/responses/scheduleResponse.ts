import { Schedule } from "../entities/scheduleData";

export interface ScheduleResponse {
    success: boolean,
    message?: string,
    schedules: Schedule[]
}