export class DailySchedule {
    day: string;
    openTime: string | null;
    closeTime: string | null; 
    closed: boolean;

    constructor(day: string) {
        this.day = day;
        this.openTime = null;
        this.closeTime = null;
        this.closed = false;
    }
}

export class WeeklySchedule {
    schedules: DailySchedule[] = [];
}