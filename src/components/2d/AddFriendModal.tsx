import Text from './Text';
import { Modal, View } from 'react-native';
import TextInput from './TextInput';
import Button from './Button';
import { useContext, useState } from 'react';
import { useFirebase } from '@/utils/FirebaseProvider';
import { Styles } from '@/styles';
import { ThemeContext } from './ThemeProvider';

export default function AddFriendModal({ visible, setVisible }: { visible: boolean, setVisible: (visible: boolean) => void }) {
    const firebase = useFirebase();
    const theme = useContext(ThemeContext);

    const [username, setUsername] = useState('');
    const [addingFriend, setAddingFriend] = useState(false);
    const [message, setMessage] = useState('');

    async function addFriend() {
        setAddingFriend(true);
        const { success } = await firebase.addFriend(username);
        if (success) {
            setMessage('Friend added!');
        }
        else {
            setMessage('Failed to add friend!');
        }
        setAddingFriend(false);
    }

    // TODO: convert this into Friends screen and add current friends list
    return (
        <Modal visible={visible} animationType='slide'>
            <View style={{
                flex: 1,
                gap: 10,
                backgroundColor: theme.runwayBackgroundColor,
                ...Styles.centeringContainer
            }}>
                <Text style={{ fontSize: 40, textAlign: 'center', marginBottom: 30 }}>Add Friend</Text>
                <TextInput placeholder="Enter username" onChangeText={setUsername} style={{ width: '80%', height: 50 }} />
                <Button title="Add" onPress={addFriend} style={{ width: '80%', height: 50 }} disabled={addingFriend} />
                {message ? <Text style={{ fontSize: 15, textAlign: 'center', marginVertical: 5 }}>{message}</Text> : null}
                <Button title="Cancel" backgroundColor='transparent' onPress={() => { setVisible(false) }} />
            </View>
        </Modal>
    );
}