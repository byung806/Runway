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
    },
    subtitle: {
        fontSize: 20,
    },
    bodyText: {
        fontSize: 15,
    },
    heavy: {
        fontWeight: 900,
    },
    btnLabel: {
        fontSize: 15,
    },
    flex: {
        flex: 1
    }
};

export default styles;
