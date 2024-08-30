import { Expo, ExpoPushMessage, ExpoPushReceiptId, ExpoPushTicket } from 'expo-server-sdk';
import { FieldValue } from 'firebase-admin/firestore';
import { logger } from "firebase-functions";
import { generateNotificationContent } from './notifmessages';
import { dateToString, getDbCollection, getDbDoc } from "./utils";


let expo = new Expo();

export async function sendStreakNotificationDebug() {
    const user = await getDbDoc('debug', 'push').get();
    if (!user.exists) return;
    const username = user.get('username');
    const title = user.get('title');
    const body = user.get('body');

    logger.info("Sending streak notifications DEBUG to " + username);

    const today = dateToString(new Date());
    const contentDoc = await getDbDoc('content', today).get()
    if (!contentDoc.exists) return;
    const content = contentDoc.data();
    if (!content) return;

    const contentTitle = content.title;
    const contentCategory = content.category;

    const uidMapping: {
        uid: string,
        expoPushMessage: ExpoPushMessage,
    }[] = [];
    const pushMessages: ExpoPushMessage[] = [];

    const userDocs = await getDbCollection('users').where('expoPushToken', '!=', '').get();
    userDocs.forEach(async (userDoc) => {
        const userData = userDoc.data();

        if (userData.username !== username) return;

        // Check that this is a valid Expo push token
        if (!Expo.isExpoPushToken(userData.expoPushToken)) {
            await getDbDoc('users', userDoc.id).update({
                expoPushToken: FieldValue.delete()
            });
            return;
        }

        console.log(`Sending notification to ${userDoc.id} ${userData.username}`);

        const message = generateNotificationContent(contentTitle, contentCategory, userData);

        uidMapping.push({
            uid: userDoc.id,
            expoPushMessage: {
                to: userData.expoPushToken,
                sound: 'default',
                title: !title ? title : message.title,
                body: !body ? body : message.body
            }
        });
        pushMessages.push(uidMapping[uidMapping.length - 1].expoPushMessage);

        // https://medium.com/@adithyahnair123/duolingo-its-cheeky-notification-marketing-9589a162515d
    });

    // Send batches of notifications
    let chunks = expo.chunkPushNotifications(
        pushMessages
    );

    // Send chunks to Expo push notification service and get tickets
    let tickets: ExpoPushTicket[] = [];
    for (let chunk of chunks) {
        try {
            let ticketChunk = await expo.sendPushNotificationsAsync(chunk);
            tickets.push(...ticketChunk);
        } catch (error) {
            console.error(error);
        }
    }

    // Save ticket ids to database & handle push ticket errors
    for (let i = 0; i < tickets.length; i++) {
        const ticket = tickets[i];
        const uid = uidMapping[i].uid;
        if (ticket.status === 'ok') {
            // Save ticket id to db, where it can be used to check receipt status 30 min later
            await getDbDoc('users', uid).update({
                expoPushTicket: ticket.id
            });
        } else {
            // Handle push ticket error
            if (ticket.details && ticket.details.error) {
                if (ticket.details.error === 'DeviceNotRegistered') {
                    // Remove the user's expoPushToken from db
                    await getDbDoc('users', uid).update({
                        expoPushToken: FieldValue.delete(),
                        expoPushTicket: FieldValue.delete()   // just in case
                    });
                }
            }
        }
    }
}

/**
 * Send a notification to all users with a valid expoPushToken
 * Saves receipt ids to database for checking status later
 */
export async function sendStreakNotification() {
    logger.info("Sending streak notifications");

    const today = dateToString(new Date());
    const contentDoc = await getDbDoc('content', today).get()
    if (!contentDoc.exists) return;
    const content = contentDoc.data();
    if (!content) return;

    const contentTitle = content.title;
    const contentCategory = content.category;

    const uidMapping: {
        uid: string,
        expoPushMessage: ExpoPushMessage,
    }[] = [];
    const pushMessages: ExpoPushMessage[] = [];

    const userDocs = await getDbCollection('users').where('expoPushToken', '!=', '').get();
    userDocs.forEach(async (userDoc) => {
        const userData = userDoc.data();

        // Check that this is a valid Expo push token
        if (!Expo.isExpoPushToken(userData.expoPushToken)) {
            await getDbDoc('users', userDoc.id).update({
                expoPushToken: FieldValue.delete()
            });
            return;
        }

        console.log(`Sending notification to ${userDoc.id} ${userData.username}`);

        const message = generateNotificationContent(contentTitle, contentCategory, userData);

        uidMapping.push({
            uid: userDoc.id,
            expoPushMessage: {
                to: userData.expoPushToken,
                sound: 'default',
                ...message
            }
        });
        pushMessages.push(uidMapping[uidMapping.length - 1].expoPushMessage);

        // https://medium.com/@adithyahnair123/duolingo-its-cheeky-notification-marketing-9589a162515d
    });

    // Send batches of notifications
    let chunks = expo.chunkPushNotifications(
        pushMessages
    );

    // Send chunks to Expo push notification service and get tickets
    let tickets: ExpoPushTicket[] = [];
    for (let chunk of chunks) {
        try {
            let ticketChunk = await expo.sendPushNotificationsAsync(chunk);
            tickets.push(...ticketChunk);
        } catch (error) {
            console.error(error);
        }
    }

    // Save ticket ids to database & handle push ticket errors
    for (let i = 0; i < tickets.length; i++) {
        const ticket = tickets[i];
        const uid = uidMapping[i].uid;
        if (ticket.status === 'ok') {
            // Save ticket id to db, where it can be used to check receipt status 30 min later
            await getDbDoc('users', uid).update({
                expoPushTicket: ticket.id
            });
        } else {
            // Handle push ticket error
            if (ticket.details && ticket.details.error) {
                if (ticket.details.error === 'DeviceNotRegistered') {
                    // Remove the user's expoPushToken from db
                    await getDbDoc('users', uid).update({
                        expoPushToken: FieldValue.delete(),
                        expoPushTicket: FieldValue.delete()   // just in case
                    });
                }
            }
        }
    }
}

/**
 * Check the status of push notification receipts 30 minutes after sending them
 */
export async function handleNotificationReceipts() {
    logger.info("Checking notification receipts");

    // Get all user documents with a push ticket
    const userDocs = await getDbCollection('users').where('expoPushTicket', '!=', '').get();

    const receiptIdsToUids = new Map<ExpoPushReceiptId, string>();
    const receiptIds: ExpoPushReceiptId[] = [];

    // Get all receipt ids
    userDocs.forEach(async (userDoc) => {
        const user = userDoc.data();
        receiptIdsToUids.set(user.expoPushTicket, userDoc.id);
        receiptIds.push(user.expoPushTicket);
    });

    // Chunk receipt ids
    let receiptIdChunks = expo.chunkPushNotificationReceiptIds(receiptIds);

    for (let chunk of receiptIdChunks) {
        try {
            let idsToReceipts = await expo.getPushNotificationReceiptsAsync(chunk);

            // The receipts specify whether Apple or Google successfully received the
            // notification and information about an error, if one occurred.
            for (let receiptId in idsToReceipts) {
                const uid = receiptIdsToUids.get(receiptId);
                if (!uid) {
                    console.error(`No uid found for receipt id ${receiptId} (which is a problem!)`);
                    continue;
                }
                const receipt = idsToReceipts[receiptId];

                const status = receipt.status;
                if (status === 'ok') {
                    // The receipt is valid and the notification was received successfully
                    await getDbDoc('users', uid).update({
                        expoPushTicket: FieldValue.delete()
                    });
                    console.log(`${uid} successful`);
                } else if (status === 'error') {
                    console.error(`Error to ${uid}: ${receipt.message}`);
                    if (receipt.details && receipt.details.error) {
                        // The error codes are listed in the Expo documentation:
                        // https://docs.expo.io/push-notifications/sending-notifications/#individual-errors
                        // You must handle the errors appropriately.
                        if (receipt.details.error === 'DeviceNotRegistered') {
                            // Remove the user's expoPushToken & expoPushTicket
                            await getDbDoc('users', uid).update({
                                expoPushToken: FieldValue.delete(),
                                expoPushTicket: FieldValue.delete()
                            });
                        } else {
                            if (receipt.details.error === 'MessageTooBig') {
                                console.error(`Message too big https://docs.expo.dev/push-notifications/sending-notifications/#push-receipt-errors`);
                            } else if (receipt.details.error === 'MessageRateExceeded') {
                                // TOOD: exponential backoff
                                console.error(`Message rate exceeded https://docs.expo.dev/push-notifications/sending-notifications/#push-receipt-errors`);
                            } else if (receipt.details.error === 'InvalidCredentials') {
                                console.error(`Invalid credentials (app wide!) https://docs.expo.dev/push-notifications/sending-notifications/#push-receipt-errors`);
                            }

                            // Remove the user's expoPushTicket
                            await getDbDoc('users', uid).update({
                                expoPushTicket: FieldValue.delete()
                            });
                        }
                    }
                }
            }
        } catch (error) {
            console.error(error);
        }
    }
}
