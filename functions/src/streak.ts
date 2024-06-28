import { CallableRequest } from "firebase-functions/v2/https";
import { getDbDoc } from "./utils";

/**
 * Converts a Date object to a string in the format 'YYYY-MM-DD'
 * Used because dates are stored as 'YYYY-MM-DD' strings in Firestore
 */
function dateToString(date: Date): string {
    return date.toISOString().split('T')[0];
}

/**
 * Converts a string in the format 'YYYY-MM-DD' to a Date object
 */
function stringToDate(date: string): Date {
    return new Date(date + 'T00:00:00.000000');
}

/**
 * Determines whether to increment the streak or reset it based on the current date and the last logged date
 */
function whatToDoWithStreak(currentDate: string, lastLoggedDate: string) {
    if (!lastLoggedDate) {
        return {
            canIncrement: true,
            shouldReset: false
        };
    }
    const diff = Math.abs(stringToDate(currentDate).valueOf() - stringToDate(lastLoggedDate).valueOf());
    const diffDays = Math.ceil(diff / (1000 * 60 * 60 * 24));

    if (diffDays <= 0) {
        return {
            canIncrement: false,
            shouldReset: false
        };
    }
    if (diffDays === 1) {
        return {
            canIncrement: true,
            shouldReset: false
        };
    }
    return {
        canIncrement: false,
        shouldReset: true
    };
}

interface StreakPointsUpdate {
    streak: number, points: number
}

/**
 * On client request, updates the streak field in the user document (/users) based on the current date and the last logged date
 * Triggered when the user completes the day's challenge in the app
 * 
 * note: very similar to updateStreak function
 */
export const completeTodayFunction = async (request: CallableRequest): Promise<StreakPointsUpdate | undefined> => {
    console.log('from streak.ts:  completeTodayFunction')
    // TODO: update points field too (add points field in /content with points per day)
    // TODO: STREAK BONUS
    // TODO: streak doesn't update until user completes a challenge - this normally isn't a problem but the user skips a day and comes back the next, the streak from 2 days ago will show
    if (!request.auth) {
        return;
    }
    const uid = request.auth.uid;
    const userData = await getDbDoc('users', uid).get();

    // Get the point days data from the user document
    const pointDays = userData.get("point_days");
    const pointsToday = 500;

    const today = dateToString(new Date());
    const lastLoggedDate = Object.keys(pointDays)
        .sort((a, b) => stringToDate(a).valueOf() - stringToDate(b).valueOf())
        .reverse()[0];

    // Compare today's date with the last date in the streak
    // & determine what to do with the streak
    const { canIncrement, shouldReset } = whatToDoWithStreak(today, lastLoggedDate);

    const updatedPointDays = {
        ...pointDays,
        [today]: pointsToday
    };

    // update firestore with the new streak and points

    if (canIncrement) {
        const updatedStreak: number = userData.get("streak") + 1;
        const updatedPoints: number = userData.get("points") + pointsToday;
        await getDbDoc('users', uid).update({
            streak: updatedStreak,
            point_days: updatedPointDays,
            points: updatedPoints
        });
        return {
            streak: updatedStreak,
            points: updatedPoints
        };
    }

    if (shouldReset) {
        const updatedStreak: number = 1;
        const updatedPoints: number = userData.get("points") + pointsToday;
        await getDbDoc('users', uid).update({
            streak: updatedStreak,
            point_days: updatedPointDays,
            points: updatedPoints
        });
        return {
            streak: updatedStreak,
            points: updatedPoints
        };
    }

    // the streak has already been logged for today or point_days somehow contains future dates so no changes are made
    return {
        streak: userData.get("streak"),
        points: userData.get("points")
    }
}
