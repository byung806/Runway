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
        textAlign: 'center',
    },
    subtitle: {
        fontSize: 20,
        textAlign: 'center',
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
    },
    debugBorder: {
        borderWidth: 1,
        borderColor: 'red',
    }
};

export default styles;
