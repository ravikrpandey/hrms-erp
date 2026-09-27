import { Injectable } from '@angular/core';

@Injectable({
    providedIn: 'root'
})
export class GlobalDateService {
    constructor() { }

    // Convert local date to UTC string
    toUTC(date: Date | null): string | null {
        if (!date) return null;
        return new Date(date.getTime() - (date.getTimezoneOffset() * 60000)).toISOString();
    }

    // Convert UTC string back to local date
    fromUTC(utcDate: string | null): Date | null {
        if (!utcDate) return null;
        return new Date(utcDate);
    }
}
