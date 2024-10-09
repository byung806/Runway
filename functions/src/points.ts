import { LAST_SEASON_RESET } from "./season";
import { getDbDoc, stringToDate } from "./utils";

export const INITIAL_POINTS = 200;

const TODAY_BASE_POINTS = 300;
const PAST_CONTENT_POINTS = 200;

const LAST_SEASON_CONTENT_POINTS = 10;

export async function pointsToAddForDay(streak: number, date: string, percentOfPoints: number, isToday: boolean): Promise<number> {
    const dateObject = stringToDate(date);
    const lastSeasonDateObject = stringToDate(LAST_SEASON_RESET);

    const cardValue = (await getDbDoc('content', date).get()).get('possiblePoints');

    const possiblePoints = (
        cardValue ?? (isToday ? TODAY_BASE_POINTS : PAST_CONTENT_POINTS)
    ) * percentOfPoints / 100;

    if (isToday) {
        if (streak == 0) {
            return possiblePoints;
        }
        if (streak >= 1 && streak < 5) {
            return possiblePoints + 20;
        }
        if (streak >= 5 && streak < 10) {
            return possiblePoints + 30;
        }
        if (streak >= 10 && streak < 15) {
            return possiblePoints + 35;
        }
        if (streak >= 15 && streak < 20) {
            return possiblePoints + 40;
        }
        if (streak >= 20) {
            return possiblePoints + 40 + streak * 0.1;
        }
    }
    if (dateObject < lastSeasonDateObject) {
        return LAST_SEASON_CONTENT_POINTS;
    }
    else {
        return PAST_CONTENT_POINTS;
    }
}
