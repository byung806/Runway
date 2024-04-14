import type { StyleProp, TextStyle } from 'react-native';

import Colors from './Colors';

const styles: { [key: string]: object & StyleProp<TextStyle> } = {
    centeredContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    title: {
        fontSize: 40,
        fontWeight: 'bold',
        color: Colors.light.black,
    },
    subtitle: {
        fontSize: 20,
        fontWeight: 'bold',
        color: Colors.light.black,
    },
    btnLabel: {
        fontSize: 15,
        fontWeight: 'bold',
        color: Colors.light.black,
    }
};

export default styles;
