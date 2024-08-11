import { ThemeContext, useFirebase } from '@/providers';
import { Styles } from '@/styles';
import { useContext, useState } from 'react';
import { KeyboardAvoidingView, Modal, Platform, View } from 'react-native';
import Button, { CloseButton } from './Button';
import Text from './Text';
import TextInput from './TextInput';
import { SafeAreaView } from 'react-native-safe-area-context';

// TODO: MAKE BETTER
export default function AddFriendModal({ visible, setVisible }: { visible: boolean, setVisible: (visible: boolean) => void }) {
    const firebase = useFirebase();
    const theme = useContext(ThemeContext);

    const [username, setUsername] = useState('');
    const [addingFriend, setAddingFriend] = useState(false);
    const [message, setMessage] = useState('');

    async function addFriend() {
        setAddingFriend(true);
        const { success, errorMessage } = await firebase.addFriend(username);
        if (success) {
            setMessage('Friend added!');
        } else {
            setMessage(errorMessage);
        }
        setAddingFriend(false);
    }

    // TODO: convert this into Friends screen and add current friends list
    return (
        <Modal visible={visible} animationType='slide'>
            <SafeAreaView style={{
                position: 'absolute',
                top: 60,
                left: 20,
                justifyContent: 'space-between',
                zIndex: 1,
            }} edges={['top']}>
                <CloseButton color={theme.runwayTextColor} onPress={() => { setVisible(false) }} />
            </SafeAreaView>
            <KeyboardAvoidingView
                behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
                style={{
                    flex: 1,
                    gap: 10,
                    backgroundColor: theme.runwayBackgroundColor,
                    ...Styles.centeringContainer
                }}
            >
                <Text style={{ fontSize: 40, textAlign: 'center', marginBottom: 30, color: theme.white }}>Add Friend</Text>
                <TextInput value={username} placeholder="Enter username" onChangeText={setUsername} style={{ width: '80%', height: 50 }} />
                <Button title="Add" onPress={addFriend} style={{ width: '80%', height: 50 }} disabled={addingFriend} />
                {message ? <Text style={{ fontSize: 15, textAlign: 'center', marginVertical: 5 }}>{message}</Text> : null}
            </KeyboardAvoidingView>
        </Modal>
    );
}