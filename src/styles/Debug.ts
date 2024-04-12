import type { StyleProp, TextStyle } from 'react-native';

import Colors from './Colors';

const border: { [key: string]: object & StyleProp<TextStyle> } = {
    border: {
        borderWidth: 1,
        borderColor: Colors.light.accent,
    },
    borderRed: {
        borderWidth: 1,
        borderColor: 'red',
    }
};

export default border;
