import { Styles } from '@/styles';
import useBounceAnimation from '@/utils/useBounceAnimation';
import { animated, config } from '@react-spring/native';
import { useContext } from 'react';
import { Pressable, View } from 'react-native';
import Text from './Text';
import { ThemeContext } from './ThemeProvider';

interface DateCardProps {
    backgroundColor: string;
    date: string;
}

const AnimatedView = animated(View);

export default function DateCard({ backgroundColor, date, ...props }: DateCardProps & any) {
    const theme = useContext(ThemeContext);

    const { scale, onPressIn, onPressOut } = useBounceAnimation({
        pressOut: async () => {
            // show this date's content
        },
        scaleTo: 0.95,
        config: config.gentle
    });

    return (
        <Pressable onPressIn={onPressIn} onPressOut={onPressOut}>
            <AnimatedView style={{
                flex: 1,
                borderRadius: 12,
                height: 50,
                // marginTop: 8,
                // marginHorizontal: 8,
                backgroundColor: backgroundColor,
                ...Styles.centeringContainer,
                transform: [{ scale: scale }]
            }}>
                <Text style={{
                    color: theme.textInverse,
                    fontSize: 32,
                }}>{date}</Text>
            </AnimatedView>
        </Pressable>
    );
}