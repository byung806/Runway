import { Styles } from "@/styles";
import * as Haptics from 'expo-haptics';
import { useContext, useRef } from "react";
import { Pressable, View } from "react-native";
import AnimatedIcon, { AnimatedIconRef } from "./AnimatedIcon";
import { SafeAreaView } from "react-native-safe-area-context";
import { ThemeContext } from "./ThemeProvider";

export default function TabBar({ state, descriptors, navigation }: { state: any, descriptors: any, navigation: any }) {
    const theme = useContext(ThemeContext);

    let padding = 10;

    return (
        <View style={{
            position: 'absolute',
            bottom: 0,
            width: '100%',
            backgroundColor: 'transparent',
            // height: 70,
            marginVertical: 10,
            ...Styles.centeringContainer,
        }}>
            <SafeAreaView edges={['bottom']}>
                <View style={{
                    flexDirection: 'row',
                    // backgroundColor: theme.accent + '33',
                    borderRadius: 24,
                    // height: 70,
                    padding: padding,
                    // elevation: 4,
                }}>
                    {state.routes.map((route: any, index: any) => {
                        const isFocused = state.index === index;
                        const iconRef = useRef<AnimatedIconRef>(null);

                        const onPress = () => {
                            Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);

                            iconRef.current?.onPressIn();

                            const event = navigation.emit({
                                type: 'tabPress',
                                target: route.key,
                            });

                            if (!isFocused && !event.defaultPrevented) {
                                navigation.navigate(route.name);
                            }
                        };

                        const onPressOut = () => {
                            iconRef.current?.onPressOut();
                        }

                        const onLongPress = () => {
                            navigation.emit({
                                type: 'tabLongPress',
                                target: route.key,
                            });
                        };

                        let spaceBetween = 30;
                        return (
                            <View style={{
                                ...Styles.centeringContainer,
                                marginLeft: index === 0 ? 0 : spaceBetween,
                            }} key={index}>
                                <Pressable
                                    onPress={onPress}
                                    onPressOut={onPressOut}
                                    onLongPress={onLongPress}
                                    style={{ alignItems: "center" }}
                                >
                                    <AnimatedIcon ref={iconRef} focused={isFocused} route={route} width={30} height={30} />
                                </Pressable>
                            </View>
                        );
                    })}
                </View>
            </SafeAreaView>
        </View>
    );
}