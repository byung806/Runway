type NotificationMessage = {
    title: string | ((userData: FirebaseFirestore.DocumentData, contentTitle: string, contentCategory: string) => string);
    body?: string | ((userData: FirebaseFirestore.DocumentData, contentTitle: string, contentCategory: string) => string);
    requirements?: (userData: FirebaseFirestore.DocumentData) => boolean;
}

const defaultNotificationMessage: NotificationMessage = {
    title: 'Today\'s challenge is available!',
};

const notificationMessages: NotificationMessage[] = [
    {
        title: '⏰ Got 2 minutes?',
        body: 'A new challenge is waiting for you...',
    },
    {
        title: 'Got 2 mins?',
        body: (userData, title, category) => `Learn about ${title}!`,
    },
    {  // TODO: implement so this only sends at the end of the day
        title: 'Hey.',
        body: (userData, title, category) => `It would be a bummer to lose that ${userData.streak} day streak.`,
        requirements: (userData) => userData.streak > 3
    },
    {
        title: (userData, title, category) => `${title} now available`,
        body: 'You think yesterday\'s was fun? Wait until you see today\'s...',
    },
    {
        title: 'A new challenge is out!',
        body: 'It\'s probably too hard for most people...',
    },
    // {  // this is a little mean
    //     title: 'Top 10 users get an ice cream party!',
    //     body: 'Too bad you\'re not invited...',
    //     requirements: (userData) => userData.point_days.length > 10 && true   // TODO: implement this
    // },
    {
        title: 'A new challenge is out!',
        body: (userData, title, category) => `You're doing great, ${userData.username}!`,
    },
    {
        title: 'Ready for a break?',
        body: 'Your daily lessons won\'t do themselves 🤷',
    },
    {
        title: 'Hi there!',
        body: (userData, title, category) => `Make your screen time count. Take 2 minutes to learn about ${title}! 💜`,
    },
    {
        title: (userData, title, category) => `You're on a ${userData.streak}-day streak`,
        body: (userData, title, category) => `Get it to ${userData.streak + 1} with today's challenge!`,
    }
];

/**
 * Get the notification message for a specific user
 * Generates a random message from the list of notification messages (where requirements are met)
 */
export function generateNotificationContent(contentTitle: string, contentCategory: string, userData: FirebaseFirestore.DocumentData): { title: string, body?: string } {
    let message = defaultNotificationMessage;
    let messageMetRequirements = false;
    while (!messageMetRequirements) {
        message = notificationMessages[Math.floor(Math.random() * notificationMessages.length)];

        messageMetRequirements = !message.requirements || message.requirements(userData);
    }
    const title = typeof message.title === 'function' ? message.title(userData, contentTitle, contentCategory) : message.title;
    const body = typeof message.body === 'function' ? message.body(userData, contentTitle, contentCategory) : message.body;
    return { title, body };
}