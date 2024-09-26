import { dateToString, getDbBatch, getDbCollection, getDbDoc } from "./utils";

export const LAST_SEASON_RESET = '2024-09-26';

/**
 * Resets the season
 * Finds the top 3 users and saves them in "1", "2", and "3" fields in "2024-09-15" document in "fame" collection
 * Resets all users' points, and stores the previous points in "fame" collection
 * Updates "leaderboard" collection
 */
export const resetSeason = async (): Promise<undefined> => {
    const usersRef = getDbCollection('users');
    const fameRef = getDbDoc('fame', dateToString(new Date()));
    const leaderboardRef = getDbCollection('leaderboard');

    // Get all users
    const usersSnapshot = await usersRef.get();
    const users = usersSnapshot.docs.map(doc => ({ uid: doc.get("uid"), username: doc.get('username'), points: doc.get('points'), streak: doc.get('streak'), rank: 0 }));

    // Sort users by points in descending order
    users.sort((a, b) => b.points - a.points);

    const fameDocument: {
        [key: string]: {
            points: number,
            streak: number,
            rank?: number,
            username?: string,
        }
    } = {};

    const usersBatch = getDbBatch();
    const leaderboardBatch = getDbBatch();
    users.forEach((user, index) => {
        user.rank = index + 1;
        fameDocument[user.username] = {
            points: user.points,
            streak: user.streak,
            rank: user.rank
        }
        usersBatch.update(usersRef.doc(user.uid), { points: 200 });
        leaderboardBatch.update(leaderboardRef.doc(user.username), { points: 200 });
    });

    // Sort users by points in descending order and get top 3
    const topUsers = users.slice(0, 3);

    fameDocument['1'] = {
        points: topUsers[0] ? topUsers[0].points : 0,
        streak: topUsers[0] ? topUsers[0].streak : 0,
        username: topUsers[0] ? topUsers[0].username : '',
    }
    fameDocument['2'] = {
        points: topUsers[1] ? topUsers[1].points : 0,
        streak: topUsers[1] ? topUsers[1].streak : 0,
        username: topUsers[1] ? topUsers[1].username : '',
    }
    fameDocument['3'] = {
        points: topUsers[2] ? topUsers[2].points : 0,
        streak: topUsers[2] ? topUsers[2].streak : 0,
        username: topUsers[2] ? topUsers[2].username : '',
    }

    await fameRef.set(fameDocument);
    await usersBatch.commit();
    await leaderboardBatch.commit();

    return;
}