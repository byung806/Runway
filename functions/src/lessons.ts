import { dateToString, stringToDate, getDbCollection } from "./utils";
// import { logger } from "firebase-functions";

/**
 * Copy the oldest lesson in the database to the current date if there's no lesson for today
 * & removes the oldest lesson in the database
 */
export async function copyOldestLessonIfNoLessonToday() {
    const contentRef = getDbCollection('content');

    // Check if today's date already exists in the database
    const dateToAdd = dateToString(new Date(Date.now() + 86400000));
    const dateToAddDoc = await contentRef.doc(dateToAdd).get();
    if (dateToAddDoc.exists) {
        // If a lesson for today already exists, do nothing
        // logger.info('date to add exists, aborting');
        return;
    }

    const contentSnapshot = await contentRef.get();
    const lessons = contentSnapshot.docs
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
    const { id, ...lessonData } = oldestLesson;
    await contentRef.doc(dateToAdd).set(lessonData);

    // Remove the oldest lesson from the database
    await contentRef.doc(oldestLesson.id).delete();
}