import React, { useContext } from 'react';
import { Pressable, View } from 'react-native';
import Text from './Text';

import { Styles } from '@/styles';
import { ThemeContext } from './ThemeProvider';

interface LeaderboardEntryProps {
    place: number;
    avatar: string;
    name: string;
    points: number;
    streak: number;
    color?: any;
}

export default function LeaderboardEntry({ place, avatar, name, points, streak }: LeaderboardEntryProps) {
    const theme = useContext(ThemeContext);

    // TODO: animate leaderboardentry

    function onPressIn() {
    }

    function onPressOut() {
    }

    function colorFromPlace(place: number): string {
        if (place == 1) {
            return "gold";
        } else if (place == 2) {
            return "silver";
        } else if (place == 3) {
            return "#CD7F32";
        }
        return theme.text;
    }

    return (
        <Pressable onPressIn={onPressIn} onPressOut={onPressOut}>
            <View style={{
                flexDirection: 'row',
                alignItems: 'center',
                padding: 10,
                backgroundColor: theme.backgroundSecondary,
                borderRadius: 10,
            }}>
                <View style={{ flex: 1, flexDirection: 'row' }}>
                    <Text style={{ color: theme.text, ...Styles.bodyText, ...Styles.heavy, marginLeft: 10, marginRight: 30 }}>{place}</Text>
                    {/* <Image source={{ uri }} style={{ width: 50, height: 50 }} /> */}
                    <Text style={{ color: theme.text, ...Styles.bodyText }}>{name}</Text>
                </View>
                <View style={{
                    margin: 5,
                    paddingVertical: 5,
                    paddingHorizontal: 10,
                    borderRadius: 9999,
                    // width: 60,
                    backgroundColor: theme.accent,
                    ...Styles.centeringContainer,
                }}>
                    <Text style={{
                        color: colorFromPlace(place),
                    }}>{points}</Text>
                </View>
            </View>
        </Pressable>
    );
}