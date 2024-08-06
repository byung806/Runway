import { registerRootComponent } from 'expo';

import auth from '@react-native-firebase/auth';
import firestore from '@react-native-firebase/firestore';
import functions from '@react-native-firebase/functions';

import { FirebaseProvider, NotificationProvider, ThemeProvider } from '@/providers';
import Layout from './Layout';

const emulator = false;
if (emulator) {
    console.log('from index.tsx:  Using Firebase Emulator');
    auth().useEmulator('http://localhost:9099');
    functions().useEmulator('localhost', 5001);
    firestore().useEmulator('localhost', 8080);
}

export default function App() {
    return (
        <FirebaseProvider>
            <NotificationProvider>
                <ThemeProvider>
                    <Layout />
                </ThemeProvider>
            </NotificationProvider>
        </FirebaseProvider>
    );
}

registerRootComponent(App);
