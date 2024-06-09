import type { StyleProp, TextStyle } from 'react-native';


const styles: { [key: string]: object & StyleProp<TextStyle> } = {
    centeringContainer: {
        justifyContent: 'center',
        alignItems: 'center',
    },
    titleBox: {
        padding: 10,
        borderRadius: 5,
    },
    title: {
        fontSize: 40,
        fontWeight: 'bold',
    },
    subtitle: {
        fontSize: 20,
        fontWeight: 'bold',
    },
    bodyText: {
        fontSize: 15,
    },
    heavy: {
        fontWeight: 900,
    },
    btnLabel: {
        fontSize: 15,
        fontWeight: 'bold',
    },
    flex: {
        flex: 1
    }
};

export default styles;
