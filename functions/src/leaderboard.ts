import { CallableRequest } from "firebase-functions/v2/https";
import { getDbCollection, getDbDoc } from "./utils";

interface LeaderboardUser {
    username: string;
    points: number;
    streak: number;
}

/**
 * Gets the leaderboard data for the current user (can be global or friends)
 */
export const getLeaderboard = async (request: CallableRequest): Promise<{
    leaderboard: LeaderboardUser[];
    rank: number;
}> => {
    if (!request.auth) {
        return {
            leaderboard: [],
            rank: -1,
        };
    }
    const userData = await getDbDoc('users', request.auth.uid).get();
    if (!userData.exists) {
        return {
            leaderboard: [],
            rank: -1,
        }
    }

    if (request.data.type === 'global') {
        const leaderboard: LeaderboardUser[] = [];
        let rank = -1;
        const leaderboardDocs = await getDbCollection('leaderboard').orderBy('points', 'desc').get();
        leaderboardDocs.forEach((doc) => {
            leaderboard.push({
                username: doc.id,
                points: doc.data().points,
                streak: doc.data().streak,
            });
            if (doc.id === userData.get('username')) {
                rank = leaderboard.length;
            }
        });
        return { leaderboard, rank };
    }

    if (request.data.type === 'friends') {
        const friends = userData.get('friends');
        if (!friends) {
            return { leaderboard: [], rank: 1 };
        }

        const leaderboard: LeaderboardUser[] = [];
        for (const friend of friends) {
            const friendData = await getDbDoc('leaderboard', friend).get();
            if (friendData.exists) {
                leaderboard.push({
                    username: friend,
                    // should be guaranteed that .data() exists but ? added for typescript
                    points: friendData.data()?.points,
                    streak: friendData.data()?.streak,
                });
            }
        }
        leaderboard.push({
            username: userData.get('username'),
            points: userData.get('points'),
            streak: userData.get('streak'),
        });

        leaderboard.sort((a, b) => b.points - a.points);
        // find rank of current user among all their friends (current user's points is userData.get('points'))

        let rank = 1;
        for (const user of leaderboard) {
            if (user.points > userData.get('points')) {
                rank++;
            }
        }

        return { leaderboard, rank };
    }

    if (request.data.type === 'fame') {
        const leaderboard: LeaderboardUser[] = [];
        let rank = -1;

        // TODO: save date somewhere
        const docs = await getDbCollection('fame').get();
        const docNames = docs.docs.map(doc => doc.id);
        docNames.sort((a, b) => {
            const [dayA, monthA, yearA] = a.split('-').map(Number);
            const [dayB, monthB, yearB] = b.split('-').map(Number);
            const dateA = new Date(yearA, monthA - 1, dayA);
            const dateB = new Date(yearB, monthB - 1, dayB);
            return dateB.getTime() - dateA.getTime();
        });

        const mostRecentFame = docNames[0];

        // TODO: update date
        const fameUsers = await getDbDoc('fame', mostRecentFame).get();
        if (fameUsers.exists) {
            leaderboard.push({
                username: fameUsers.get('1').username,
                points: fameUsers.get('1').points,
                streak: fameUsers.get('1').streak,
            });
            leaderboard.push({
                username: fameUsers.get('2').username,
                points: fameUsers.get('2').points,
                streak: fameUsers.get('2').streak,
            });
            leaderboard.push({
                username: fameUsers.get('3').username,
                points: fameUsers.get('3').points,
                streak: fameUsers.get('3').streak,
            });
        }

        const userRank = await getDbDoc('fame', userData.get('username')).get();
        if (userRank.exists) {
            rank = userRank.get('rank');
        }

        return { leaderboard, rank };
    }

    // invalid leaderboard type
    return {
        leaderboard: [],
        rank: -1,
    }
}

/**
 * Updates the leaderboard with the new points and streak for the user
 */
export const updateLeaderboard = async (username: string, updatedPoints: number, updatedStreak: number): Promise<void> => {
    // one possible problem: the streak never updates if a user stops logging in, so the leaderboard will be inaccurate
    // possible fix: update the streak and points for all users every day??
    // possible fix: store the date last updated and ignore users who haven't logged in for a while
    await getDbDoc('leaderboard', username).set({
        points: updatedPoints,
        streak: updatedStreak,
    });
}