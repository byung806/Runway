import { Pressable, View } from "react-native";
import AnimatedIcon from "./AnimatedIcon";
import { Styles } from "@/styles";
import Animated from "react-native-reanimated";
import { useContext } from "react";
import { ThemeContext } from "./ThemeProvider";

export default function TabBar({ state, descriptors, navigation }: { state: any, descriptors: any, navigation: any }) {
    const theme = useContext(ThemeContext);
    
    return (
        <View style={{
            position: 'absolute',
            bottom: 0,
            width: '100%',
            backgroundColor: 'transparent',
            height: 70,
            marginVertical: 10,
            ...Styles.centeringContainer,
        }}>
            <Animated.View style={{
                flexDirection: 'row',
                // backgroundColor: '#ffffff33',
                backgroundColor: theme.accent + '33',
                borderRadius: 30,
                height: 50,
                margin: 10,
                elevation: 4,
            }}>
                {state.routes.map((route: any, index: any) => {
                    const isFocused = state.index === index;

                    const onPress = () => {
                        const event = navigation.emit({
                            type: 'tabPress',
                            target: route.key,
                        });

                        if (!isFocused && !event.defaultPrevented) {
                            navigation.navigate(route.name);
                        }
                    };

                    const onLongPress = () => {
                        navigation.emit({
                            type: 'tabLongPress',
                            target: route.key,
                        });
                    };

                    return (
                        <View style={{
                            ...Styles.centeringContainer,
                            marginHorizontal: 20,
                        }} key={index}>
                            <Pressable
                                onPress={onPress}
                                onLongPress={onLongPress}
                                style={{ alignItems: "center" }}
                            >
                                <AnimatedIcon focused={isFocused} route={route} width={30} height={30} />
                            </Pressable>
                        </View>
                    );
                })}
            </Animated.View>
        </View>
    );
}