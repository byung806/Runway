import React from 'react';
import { View } from 'react-native';

import { Styles } from '@/styles';
import { animated, useSpring } from '@react-spring/native';
import Logo from './Logo';

const AnimatedView = animated(View);

export default function Loading({ id = 0, size = 80 }: { id?: number, size?: number }) {
    const { rotate } = useSpring({
        from: { rotate: 0 },
        to: { rotate: 1 },
        loop: true,
        config: { duration: 3000 }
    })

    return (
        <View style={{...Styles.flex, ...Styles.centeringContainer}}>
            <AnimatedView
                style={{
                    transform: [{rotate: rotate.to([0, 1], ['0deg', '360deg'])}]
                }}
            >
                <Logo />
            </AnimatedView>
        </View>
    )
}