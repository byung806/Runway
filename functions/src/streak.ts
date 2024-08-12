import { CallableRequest } from "firebase-functions/v2/https";
import { getDbDoc } from "./utils";
import { updateLeaderboard } from "./leaderboard";
import { pointsToAddForPastContent, pointsToAddForToday } from "./points";

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
function stringToDate(dateString: string): Date {
    return new Date(dateString + 'T00:00:00.000Z');
}

/**
 * Determines whether the streak can be incremented or should be resetted based on the current date and the last logged date
 */
function whatToDoWithStreak(currentDate: string, lastLoggedDate: string | null) {
    if (lastLoggedDate === null) {
        return {
            canIncrementStreak: true,
            shouldResetStreak: false
        };
    }
    const diff = Math.abs(stringToDate(currentDate).valueOf() - stringToDate(lastLoggedDate).valueOf());
    const diffDays = Math.ceil(diff / (1000 * 60 * 60 * 24));

    if (diffDays <= 0) {
        return {
            canIncrementStreak: false,
            shouldResetStreak: false
        };
    }
    if (diffDays === 1) {
        return {
            canIncrementStreak: true,
            shouldResetStreak: false
        };
    }
    return {
        canIncrementStreak: true,
        shouldResetStreak: true
    };
}

/**
 * internal function - not callable directly from the client
 * Ensures streak is reset if needed, and returns whether the streak can be incremented for today
 */
export const updateStreak = async (uid: string, userData: FirebaseFirestore.DocumentSnapshot<FirebaseFirestore.DocumentData, FirebaseFirestore.DocumentData>): Promise<{ canIncrementStreak: boolean, streakReset: boolean }> => {
    const pointDays = userData.get("point_days");
    let lastLoggedDate = null;
    if (pointDays.length !== 0) {
        lastLoggedDate = Object.keys(pointDays)
            .sort((a, b) => stringToDate(a).valueOf() - stringToDate(b).valueOf())
            .reverse()[0];
    }
    const today = dateToString(new Date());
    const { canIncrementStreak, shouldResetStreak } = whatToDoWithStreak(today, lastLoggedDate);
    if (shouldResetStreak) {
        await getDbDoc('users', uid).update({
            streak: 0,
        });
        return { canIncrementStreak, streakReset: true };
    }
    return { canIncrementStreak, streakReset: false };
}

/**
 * Attempts to update the streak and points when a user completes a challenge with a specific date
 * Called from the client as `requestCompleteDate`
 */
export const requestCompleteDate = async (request: CallableRequest): Promise<{ success: boolean }> => {
    if (!request.auth) return { success: false };

    const userData = await getDbDoc('users', request.auth.uid).get();
    if (!userData.exists) {
        return { success: false };
    }

    const today = dateToString(new Date());
    const requestedDate = request.data.date as string | undefined;
    let percentOfPoints = request.data.percent as number | undefined;
    if (!percentOfPoints) { percentOfPoints = 100; }
    if (percentOfPoints < 0 || percentOfPoints > 100) { return { success: false }; }

    if (!requestedDate || requestedDate === today) {
        // requesting for today, so streak should be considered in points calculation

        // verify streak is reset to 0 if needed
        const { canIncrementStreak, streakReset } = await updateStreak(request.auth.uid, userData);

        const streak = streakReset ? 0 : userData.get('streak');
        const pointsToAdd = Math.round(pointsToAddForToday(streak) * percentOfPoints / 100);

        // update streak and points
        if (canIncrementStreak) {
            const newStreak = streak + 1;
            const newPoints = userData.get("points") + pointsToAdd;
            await getDbDoc('users', request.auth.uid).update({
                streak: newStreak,
                points: newPoints,
                point_days: {
                    ...userData.get("point_days"),
                    [today]: pointsToAdd
                }
            });

            await updateLeaderboard(userData.get('username'), newPoints, newStreak);
        }
    } else {
        // completing a challenge from a previous day, so streak should not be considered in points calculation
        // verify date is valid
        const dateObject = stringToDate(request.data.date);
        if (dateObject.toString() === 'Invalid Date') {
            return { success: false };
        }
        const dateToAttemptAdd = dateToString(dateObject);

        const pointsToAdd = Math.round(pointsToAddForPastContent(dateToAttemptAdd) * percentOfPoints / 100);

        if (dateToAttemptAdd in userData.get('point_days')) {
            return { success: false };
        }

        const newPoints = userData.get("points") + pointsToAdd;
        await getDbDoc('users', request.auth.uid).update({
            points: userData.get("points") + pointsToAdd,
            point_days: {
                ...userData.get('point_days'),
                [dateToAttemptAdd]: pointsToAdd
            }
        });

        await updateLeaderboard(userData.get('username'), newPoints, userData.get('streak'));
    }

    return { success: true };
}
