import { LAST_SEASON_RESET } from "./season";
import { stringToDate } from "./utils";

export const INITIAL_POINTS = 200;

const TODAY_BASE_POINTS = 300;
const STREAK_MULTIPLIER = 0.01;
const MAX_STREAK_MULTIPLIER = 1.3;

const PAST_CONTENT_POINTS = 200;

const LAST_SEASON_CONTENT_POINTS = 10;

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
    const dateObject = stringToDate(date);
    const lastSeasonDateObject = stringToDate(LAST_SEASON_RESET);

    if (dateObject >= lastSeasonDateObject) {
        return PAST_CONTENT_POINTS;
    } else {
        return LAST_SEASON_CONTENT_POINTS;
    }
}
