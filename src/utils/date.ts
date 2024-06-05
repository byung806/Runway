export function getTodayDate(): string {
    const today = new Date().toISOString();
    return today.split('T')[0];
}