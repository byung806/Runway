import { getFirestore } from "firebase-admin/firestore";

const db = getFirestore();
db.settings({ ignoreUndefinedProperties: true });


export function getDbDoc(collection: string, uid: string) {
    return db.collection(collection).doc(uid);
}

export function getDbCollection(collection: string) {
    return db.collection(collection);
}

/**
 * Converts a Date object to a string in the format 'YYYY-MM-DD'
 * Used because dates are stored as 'YYYY-MM-DD' strings in Firestore
 */
export function dateToString(date: Date): string {
    return date.toISOString().split('T')[0];
}

/**
 * Converts a string in the format 'YYYY-MM-DD' to a Date object
 */
export function stringToDate(dateString: string): Date {
    return new Date(dateString + 'T00:00:00.000Z');
}

/**
 * Wait for a specified number of milliseconds
 */
export function delay(ms: number) {
    return new Promise(resolve => setTimeout(resolve, ms));
}