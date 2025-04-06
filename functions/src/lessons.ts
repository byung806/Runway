import { dateToString, stringToDate, getDbCollection } from "./utils";

/**
 * Copy the oldest lesson in the database to the current date if there's no lesson for today
 * & removes the oldest lesson in the database
 */
export async function copyOldestLessonIfNoLessonToday() {
    const lessonsRef = getDbCollection('content');

    // Check if today's date already exists in the database
    const todayDate = dateToString(new Date());
    const todayLessonDoc = await lessonsRef.doc(todayDate).get();
    if (todayLessonDoc.exists) {
        // If a lesson for today already exists, do nothing
        return;
    }

    const lessonsSnapshot = await lessonsRef.get();
    const lessons = lessonsSnapshot.docs
        // Convert each document to an object with id (date) and data
        .map(doc => ({ id: doc.id, ...doc.data() }))
        // Filter out lessons that are not in the format 'YYYY-MM-DD'
        .filter(lesson => /^\d{4}-\d{2}-\d{2}$/.test(lesson.id));

    // Sort lessons by date in ascending order
    lessons.sort((a, b) => {
        const dateA = stringToDate(a.id);
        const dateB = stringToDate(b.id);
        return dateA.getTime() - dateB.getTime();
    });
    const oldestLesson = lessons[0];

    // Copy the oldest lesson to today's date if it's not overriding an existing lesson (so new lessons can be added)
    await lessonsRef.doc(todayDate).set(oldestLesson);

    // Remove the oldest lesson from the database
    await lessonsRef.doc(oldestLesson.id).delete();
}