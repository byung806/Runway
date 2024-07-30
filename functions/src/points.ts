export const INITIAL_POINTS = 200;

const TODAY_BASE_POINTS = 500;
const STREAK_MULTIPLIER = 0.01;
const MAX_STREAK_MULTIPLIER = 1.3;

const PAST_CONTENT_POINTS = 200;

/**
 * Calculates the number of points to add for a card completed same day
 */
export function pointsToAddForToday(streak: number): number {
    return TODAY_BASE_POINTS * (Math.min(1 + streak * STREAK_MULTIPLIER, MAX_STREAK_MULTIPLIER));
}

/**
 * Calculates the number of points to add for a card "backfilled"
 */
export function pointsToAddForPastContent(date: string): number {
    // TODO: verify date exists in content
    return PAST_CONTENT_POINTS;
}
