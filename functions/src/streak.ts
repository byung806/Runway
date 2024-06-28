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
 * Determines whether the streak can be incremented or should be resetted based on the current date and the last logged date
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

/**
 * Updates the streak
 * Resets the streak to 0 if the user misses a day
 * 
 * @param uid the user's uid
 * @param attemptIncrement whether to attempt to increment the streak
 */
export const updateStreak = async (uid: string, attemptIncrement: boolean): Promise<{ dataChanged: boolean }> => {
    // console.log('from streak.ts:  updateStreak:  attemptIncrement:', attemptIncrement)
    let dataChanged = false;

    const userData = await getDbDoc('users', uid).get();
    const pointDays = userData.get("point_days");

    const today = dateToString(new Date());
    const lastLoggedDate = Object.keys(pointDays)
        .sort((a, b) => stringToDate(a).valueOf() - stringToDate(b).valueOf())
        .reverse()[0];

    const { canIncrement, shouldReset } = whatToDoWithStreak(today, lastLoggedDate);

    if (shouldReset) {
        // console.log('from streak.ts:  updateStreak:  reset streak!!!')
        if (userData.get('streak') !== 0) {
            await getDbDoc('users', uid).update({
                streak: 0,
            });
            dataChanged = true;
        }
    }

    if (canIncrement && attemptIncrement) {
        // console.log('from streak.ts:  updateStreak:  incremented streak!!!!')
        // TODO: vary by streak and day
        const pointsToday = 500;

        const updatedPointDays = {
            ...pointDays,
            [today]: pointsToday
        };

        await getDbDoc('users', uid).update({
            streak: shouldReset ? 1 : userData.get("streak") + 1,
            points: userData.get("points") + pointsToday,
            point_days: updatedPointDays,
        });

        dataChanged = true;
    }

    // console.log('from streak.ts:  updateStreak:  dataChanged:', dataChanged)
    return { dataChanged };
}

/**
 * Attempts to increment the streak and update the points.
 * Fails if the specific user has already completed the day's challenge and it has been logged.
 * 
 * @param request the request object
 */
export const attemptIncrementStreak = async (request: CallableRequest): Promise<{ dataChanged: boolean }> => {
    if (!request.auth) return { dataChanged: false };
    // TODO: a little wasteful getting uid and then requesting user data again when it's here
    const { dataChanged } = await updateStreak(request.auth.uid, true);
    return { dataChanged };
}
