import { ThemeContext, useFirebase } from '@/providers';
import { Styles } from '@/styles';
import useBounceAnimation from '@/utils/useBounceAnimation';
import { FontAwesome5 } from '@expo/vector-icons';
import { animated, config } from '@react-spring/native';
import * as Haptics from 'expo-haptics';
import { useContext } from 'react';
import { Pressable, View } from 'react-native';
import Text from './Text';


interface LeaderboardEntryProps {
    place: number;
    name: string;
    points: number;
    streak: number;
    color?: any;
}

const ReactSpringAnimatedView = animated(View);

export default function LeaderboardEntry({ place, name, points, streak }: LeaderboardEntryProps) {
    const theme = useContext(ThemeContext);
    const firebase = useFirebase();

    const { scale, onPressIn, onPressOut } = useBounceAnimation({
        scaleTo: 0.95,
        haptics: Haptics.ImpactFeedbackStyle.Light,
        config: config.gentle
    });

    // TODO: animate leaderboardentry

    function colorFromPlace(place: number): string {
        if (place == 1) {
            return "gold";
        } else if (place == 2) {
            return "silver";
        } else if (place == 3) {
            return "#CD7F32";
        }
        return theme.runwayTextColor;
    }

    return (
        <Pressable onPressIn={onPressIn} onPressOut={onPressOut}>
            <ReactSpringAnimatedView style={{
                position: 'relative',
                flexDirection: 'row',
                padding: 10,
                backgroundColor: firebase.userData?.username === name ? theme.leaderboardHighlightColor : 'transparent',
                borderColor: firebase.userData?.username === name ? theme.leaderboardHighlightColor : 'transparent',
                borderWidth: 2,
                borderRadius: 10,
                ...Styles.centeringContainer,
                transform: [{ scale: scale }]
            }}>
                <View style={{ flex: 1, flexDirection: 'row', justifyContent: 'space-between' }}>
                    <View style={{ alignItems: 'center', flexDirection: 'row', gap: 20 }}>
                        <Text style={{ color: theme.runwayTextColor, fontSize: 15 }}>{place}</Text>
                        <Text style={{ color: theme.runwayTextColor, fontSize: 20 }}>{name}</Text>
                        {streak > 0 &&
                            <View style={{ ...Styles.centeringContainer, flexDirection: 'row', gap: 4 }}>
                                <FontAwesome5 name='fire-alt' size={20} color={'#cc5500'} style={{ ...Styles.shadow }} />
                                {/* <Text style={{ color: '#cc5500', fontSize: 20, ...Styles.shadow }}>{streak}</Text> */}
                            </View>
                        }
                        {place === 1 &&
                            <View style={{ ...Styles.centeringContainer, flexDirection: 'row', gap: 4 }}>
                                <FontAwesome5 name='crown' size={20} color={'gold'} style={{ ...Styles.shadow }} />
                            </View>
                        }
                    </View>

                    <Text style={{
                        color: colorFromPlace(place),
                        fontSize: 20,
                    }}>{points}</Text>
                </View>
            </ReactSpringAnimatedView>
        </Pressable>
    );
}
