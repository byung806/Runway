import { useFirebase, useRunwayTheme } from '@/providers';
import { Styles } from '@/styles';
import { BlurView } from '@react-native-community/blur';
import { useState } from 'react';
import { Alert, Linking, Modal, Pressable, View } from 'react-native';
import Button from './Button';

const CONTACT_US_EMAIL = 'https://runwaymobile.app/faq';
const PRIVACY_POLICY_URL = 'https://runwaymobile.app/privacy-policy';

export default function ProfileModal({ visible, setVisible }: { visible: boolean, setVisible: (visible: boolean) => void }) {
    const firebase = useFirebase();
    const theme = useRunwayTheme();

    const [deleteLoading, setDeleteLoading] = useState(false);

    async function contactUs() {
        await Linking.openURL(CONTACT_US_EMAIL);
    }

    async function privacyPolicy() {
        await Linking.openURL(PRIVACY_POLICY_URL);
    }

    async function logOut() {
        setVisible(false);
        await firebase.logOut();
    }

    async function deleteAccount() {
        Alert.alert(
            "Are you sure you want to delete your account?",
            "This action cannot be undone.",
            [
                {
                    text: "Cancel",
                    onPress: () => { },
                    style: "cancel"
                },
                {
                    text: "Delete Account",
                    onPress: async () => {
                        setDeleteLoading(true);
                        const { success } = await firebase.deleteAccount();
                        setDeleteLoading(false);
                        
                        await logOut();
                    },
                    style: "destructive"
                }
            ]
        )
    }

    return (
        <Modal visible={visible} transparent={true} animationType='slide' style={{
        }}>
            <Pressable style={{ flex: 1, justifyContent: 'flex-end' }} onPress={() => { setVisible(false); }}>
                <View
                    style={{
                        borderTopLeftRadius: 40,
                        borderTopRightRadius: 40,
                        // borderTopWidth: 6,
                        // borderLeftWidth: 6,
                        // borderRightWidth: 6,
                        // borderColor: theme.runwayBorderColor,
                        position: 'relative',
                        // backgroundColor: theme.runwayBackgroundColor,
                        justifyContent: 'space-between',
                        ...Styles.centeringContainer,
                    }}
                >
                    <BlurView
                        style={{
                            position: 'absolute',
                            width: '100%',
                            height: '100%',
                            borderTopLeftRadius: 40,
                            borderTopRightRadius: 40,
                        }}
                        blurType={theme.scheme === 'dark' ? "ultraThinMaterialDark" : "ultraThinMaterialLight"}
                        blurAmount={10}
                        // overlayColor="black"
                        reducedTransparencyFallbackColor="black"
                    />
                    <View style={{
                        width: '80%',
                        marginTop: 20,
                        marginBottom: 40,
                    }}>
                        <Button
                            title="Log Out"
                            onPress={logOut}
                            style={{ width: '100%', height: 50 }}
                        />
                        <Button
                            title="Delete Account"
                            onPress={deleteAccount}
                            showLoadingSpinner={deleteLoading}
                            backgroundColor={theme.questionIncorrectColor}
                            textColor={theme.white}
                            style={{ width: '100%', height: 50 }}
                        />
                        <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                            <Button
                                title="Privacy Policy"
                                onPress={privacyPolicy}
                                backgroundColor='transparent'
                                textColor={theme.gray}
                            />
                            <Button
                                title="Contact"
                                onPress={contactUs}
                                backgroundColor='transparent'
                                textColor={theme.gray}
                            />
                        </View>
                    </View>
                </View>
            </Pressable>
        </Modal>
    );
}