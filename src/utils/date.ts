export function getTodayDate(): string {
    const today = new Date();
    today.setUTCHours(0,0,0,0);
    return today.toISOString().split('T')[0];
}

export function getYesterdayDate(): string {
    const today = new Date();
    today.setUTCHours(0,0,0,0);
    today.setDate(today.getDate() - 1);
    return today.toISOString().split('T')[0];
}

export function dateToString(date: Date): string {
    return date.toISOString().split('T')[0];
}

export function stringToDate(dateString: string): Date {
    return new Date(dateString + 'T00:00:00.000Z');
}

export function sameDay(today: Date, date: Date): boolean {
    return (today.getDate() === date.getDate()
        && today.getMonth() === date.getMonth()
        && today.getFullYear() === date.getFullYear())
}

export const secondsUntilTomorrowUTC = () => {
    const now = new Date();

    const tomorrow = stringToDate(getTodayDate());
    tomorrow.setDate(tomorrow.getDate() + 1);

    return (tomorrow.getTime() - now.getTime()) / 1000;
}

export function dayIsYesterday(today: Date, date: Date): boolean {
    const yesterday = new Date(today);
    yesterday.setDate(today.getDate() - 1);
    return (yesterday.getDate() === date.getDate()
        && yesterday.getMonth() === date.getMonth()
        && yesterday.getFullYear() === date.getFullYear())
}