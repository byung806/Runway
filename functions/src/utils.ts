import { getFirestore } from "firebase-admin/firestore";

export function getDbDoc(collection: string, uid: string) {
    const db = getFirestore();
    return db.collection(collection).doc(uid);
}

