import firestore from '@react-native-firebase/firestore';

export const emailEnding = '@example.com';

async function registerUser(username: string, email: string, password: string, uid: string) {
    firestore()
        .collection('users')
        .doc(username)
        .set({
            email: email,
            friends: [],
            password: password,
            point_days: {},
            points: 0,
            streak: 0,
            uid: uid
        })
        .then(() => {
            console.log('Registered user ' + username);
        })
        .catch(error => {
            alert(error)
            console.log(error);
        })
}

async function addFriend(username: string, friend: string) {
    firestore()
        .collection('users')
        .doc(username)
        .update({
            friends: firestore.FieldValue.arrayUnion(friend)
        })
        .then(() => {
            console.log('Added friend ' + friend + ' to ' + username);
        })
        .catch(error => {
            alert(error)
            console.log(error);
        })
}

async function addPoints(username: string, points: number) {
    const yesterday = new Date();
    yesterday.setDate(yesterday.getDate() - 1);
    const yesterdayDateString = yesterday.toDateString();

    const today = new Date().toDateString();

    firestore()
        .collection('users')
        .doc(username)
        .get()
        .then((doc) => {
            const pointDays = doc.data()?.point_days;
            var update;
            if (pointDays && pointDays[yesterdayDateString]) {
                update = {
                    streak: firestore.FieldValue.increment(1),
                    points: firestore.FieldValue.increment(points),
                    [`point_days.${today}`]: points
                }
            } else {
                update = {
                    streak: 1,
                    points: firestore.FieldValue.increment(points),
                    [`point_days.${today}`]: points
                }
            }
            firestore()
                .collection('users')
                .doc(username)
                .update(update)
                .then(() => {
                    console.log('Updated streak & added ' + points + 'points for ' + username);
                })
                .catch((error) => {
                    alert(error);
                    console.log(error);
                });
        })
        .catch((error) => {
            alert(error);
            console.log(error);
        });
}

async function getUserData(username: string) {
    firestore()
        .collection('users')
        .doc(username)
        .get()
        .then((doc) => {
            return doc.data();
        })
        .catch((error) => {
            alert(error);
            console.log(error);
        });
}

export { registerUser, addFriend, addPoints };
