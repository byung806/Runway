import type { StyleProp, TextStyle } from 'react-native';

import Colors from './Colors';

const fonts: { [key: string]: object & StyleProp<TextStyle> } = {
    title: {
        fontSize: 22,
        fontWeight: 'bold',
        color: Colors.light.black,
    },
    iconLabel: {
        fontSize: 16,
        fontWeight: 'bold',
        color: Colors.light.black,
    },
    activityLabel: {
        fontSize: 14,
        fontWeight: 'bold',
        color: Colors.light.black,
    },
    btnLabel: {
        fontSize: 15,
        fontWeight: 'bold',
        color: Colors.light.black,
    }
};

export default fonts;
