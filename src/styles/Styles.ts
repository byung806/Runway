import type { StyleProp, TextStyle } from 'react-native';


const styles: { [key: string]: object & StyleProp<TextStyle> } = {
    centeringContainer: {
        justifyContent: 'center',
        alignItems: 'center',
    },
    subtitle: {
        fontSize: 20,
        textAlign: 'center',
    },
    veryLightShadow: {
        shadowOpacity: 0.1,
        shadowRadius: 5,
        shadowOffset: {
            height: 5,
            width: 0
        },
        elevation: 1,
    },
    lightShadow: {
        shadowOpacity: 0.2,
        shadowRadius: 5,
        shadowOffset: {
            height: 5,
            width: 0
        },
        elevation: 2,
    },
    shadow: {
        shadowOpacity: 0.5,
        shadowRadius: 10,
        shadowOffset: {
            height: 5,
            width: 0
        },
        elevation: 4,
    },
    debugBorder: {
        borderWidth: 1,
        borderColor: 'red',
    }
};

export default styles;
