import Constants from 'expo-constants'
import * as Device from 'expo-device'
import * as Notifications from 'expo-notifications'
import React, { createContext, ReactNode, useContext, useEffect, useRef, useState } from 'react'
import { Platform } from 'react-native'


Notifications.setNotificationHandler({
    handleNotification: async () => ({
        shouldShowAlert: true,
        shouldPlaySound: true,
        shouldSetBadge: false,
    }),
});

interface NotificationContextType {
    expoPushToken?: Notifications.ExpoPushToken;
    notification?: Notifications.Notification;

    requestPermissions: () => Promise<void>;
    // scheduleNotification: () => Promise<void>;
}

export function NotificationProvider({ children }: { children: ReactNode }) {
    const [hasPermission, setHasPermission] = useState<boolean | undefined>(undefined)  // TODO: implement

    const [expoPushToken, setExpoPushToken] = useState<Notifications.ExpoPushToken | undefined>()
    const [notification, setNotification] = useState<Notifications.Notification | undefined>()

    const notificationListener = useRef<Notifications.Subscription>()
    const responseListener = useRef<Notifications.Subscription>()

    async function requestPermissions() {
        if (Device.isDevice) {
            const { status: existingStatus } = await Notifications.getPermissionsAsync();
            let finalStatus = existingStatus;

            if (existingStatus !== 'granted') {
                const { status } = await Notifications.requestPermissionsAsync()
                finalStatus = status
            }

            if (finalStatus !== 'granted') {
                console.log('Required push notification permissions not granted')
            } else {
                getExpoPushTokenAsync().then(token => setExpoPushToken(token))
            }
        }
    }

    async function getExpoPushTokenAsync(): Promise<Notifications.ExpoPushToken | undefined> {
        if (Device.isDevice) {
            const { status } = await Notifications.getPermissionsAsync();
            if (status !== 'granted') {
                return
            }

            const token = await Notifications.getExpoPushTokenAsync({
                projectId: Constants.expoConfig?.extra?.eas?.projectId,
            });

            if (Platform.OS === 'android') {
                Notifications.setNotificationChannelAsync('default', {
                    name: 'default',
                    importance: Notifications.AndroidImportance.MAX,
                    vibrationPattern: [0, 250, 250, 250],
                    lightColor: '#FF231F7C',
                });
            }

            console.log('expoPushToken:', token.data)

            return token;
        } else {
            console.log("ERROR: Use a physical device for push notifications")
        }
    }

    // async function scheduleNotification() {
    //     await Notifications.scheduleNotificationAsync({
    //         content: {
    //             title: "You've got mail! 📬",
    //             body: 'Here is the notification body',
    //             data: { data: 'goes here' },
    //         },
    //         trigger: { seconds: 2 },
    //     });
    // }

    useEffect(() => {
        getExpoPushTokenAsync().then(token => setExpoPushToken(token))

        notificationListener.current = Notifications.addNotificationReceivedListener(notification => {
            setNotification(notification)
        })

        responseListener.current = Notifications.addNotificationResponseReceivedListener(response => {
            console.log(response)
        })

        return () => {
            Notifications.removeNotificationSubscription(notificationListener.current!)
            Notifications.removeNotificationSubscription(responseListener.current!)
        }
    }, []);

    return (
        <NotificationContext.Provider value={{
            expoPushToken,
            notification,
            requestPermissions,
            // scheduleNotification,
        }}>
            {children}
        </NotificationContext.Provider>
    )
}

export const NotificationContext = createContext<NotificationContextType | null>(null)

export const usePushNotifications = (): NotificationContextType => {
    const notifications = useContext(NotificationContext)
    if (!notifications) {
        throw new Error('usePushNotifications must be used within a NotificationProvider')
    }
    return notifications;
}
