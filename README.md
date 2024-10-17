# Runway - Daily Learning
[<img src="https://github.com/user-attachments/assets/1e5accef-9986-4c04-8fc3-5f48ec83d857" width="20%">](https://apps.apple.com/app/runway-gamify-learning/id6639588047)
[<img src="https://github.com/user-attachments/assets/4864d6b6-c32e-45bd-9ec3-8a13815bbddd" width="20%">](https://play.google.com/store/apps/details?id=com.byung806.runway)

Runway has a unique approach of just one short lesson per day, to easily build learning habits. Each daily lesson is curated by our team of 20+ content creators and made with bright accessible colors and intuitive visuals.

## Features
- Daily bite-sized lessons that only take 2 minutes a day
- User accounts
- Progress tracking with points and learning streaks
- Add friends
- Global and friends leaderboard
- Daily reminder notification
- Simple and intuitive user interface

## Screenshots
<img src="https://github.com/user-attachments/assets/3ae0afd0-df43-4853-b6f1-2f5e460bcf49" alt="ss1" width="24%"/>
<img src="https://github.com/user-attachments/assets/de6cc8ab-7fec-48c0-8303-940cd599bd64" alt="ss1" width="24%"/>
<img src="https://github.com/user-attachments/assets/5303bfd2-e322-4e85-93a9-da3527095553" alt="ss1" width="24%"/>
<img src="https://github.com/user-attachments/assets/fab61699-4abb-42ae-ac41-3125a33472bd" alt="ss1" width="24%"/>

## How does it work?
### File Structure
App-layout-related code is written inside the `app` directory, and assets, components, and utilies are located inside the `src` directory. The `ios` and `android` directories handle specific native code for iOS and Android, respectively.

Server code is written inside the `functions` directory and deployed to Firebase when needed. This directory does not interact with the mobile app code.

### Client
Runway's mobile application uses React Native for compatibility with both iOS and Android while maintaining a single codebase.

The project uses Expo to simplify development and manage various native modules and Expo's Push Notification Service to handle notifications.

All builds are done locally with XCode or Android Studio.

### Server
Firebase Authentication is used for sign-up/sign-in and Firebase Firestore is used to store user progress and essential data. Cloud Functions are used to handle daily notification reminders, user streak updates, and leaderboard updates, as well as user-triggered actions like sign-up and content retrieval.

Firebase Firestore is a NoSQL database that stores and syncs data in real-time.

## Building it on your own
### Clone this repository
```sh
$ git clone https://github.com/ORG/PROJECT.git
$ cd PROJECT
```

### Install package.json dependencies

```sh
$ npm install
```

### Run the `ios` or `android` scripts in `package.json`.

## License

Runway is licensed under GPLv3. See the full license text in [`LICENSE`](LICENSE).
