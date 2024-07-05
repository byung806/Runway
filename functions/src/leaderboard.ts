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
        // TODO: decide whether or not to keep global logic in cloud function or just have client read from the leaderboard collection
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