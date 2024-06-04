import type { StyleProp, TextStyle } from 'react-native';

import Colors from './Colors';


const styles: { [key: string]: object & StyleProp<TextStyle> } = {
    centeringContainer: {
        justifyContent: 'center',
        alignItems: 'center',
    },
    titleBox: {
        padding: 10,
        borderRadius: 5,
        elevation: 2,
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
    },
    flex: {
        flex: 1
    }
};

export default styles;
