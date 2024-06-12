import Text from '~/Text';
import { useTheme } from "@react-navigation/native";
import React from 'react';
import { Pressable, View } from 'react-native';
import { Styles } from '../../styles';


interface LeaderboardEntryProps {
    place: number;
    avatar: string;
    name: string;
    score: number;
    color?: any;
}

export default function LeaderboardEntry({ place, avatar, name, score, color }: LeaderboardEntryProps) {
    const { colors } = useTheme();

    function onPressIn() {
    }

    function onPressOut() {
    }

    return (
        <Pressable onPressIn={onPressIn} onPressOut={onPressOut}>
            <View style={{
                flexDirection: 'row',
                alignItems: 'center',
                padding: 10,
            }}>
                <View style={{ flex: 1, flexDirection: 'row' }}>
                    <Text style={{ color: colors.text, ...Styles.bodyText, ...Styles.heavy, marginLeft: 10, marginRight: 30 }}>{place}</Text>
                    {/* <Image source={{ uri }} style={{ width: 50, height: 50 }} /> */}
                    <Text style={{ color: colors.text, ...Styles.bodyText }}>{name}</Text>
                </View>
                <View style={{
                    margin: 5,
                    padding: 5,
                    borderRadius: 9999,
                    width: 80,
                    backgroundColor: colors.primary,
                    ...Styles.centeringContainer,
                }}>
                    <Text style={{
                        color: color ? color : colors.card,
                    }}>{score}</Text>
                </View>
            </View>
        </Pressable>
    );
}