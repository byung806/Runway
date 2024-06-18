import { TextInput as TextInputNative } from 'react-native';

import { useTheme } from '@react-navigation/native';

export const INPUT_HEIGHT = 45;

interface TextInputProps {
    placeholder: string;
    onChangeText: React.Dispatch<React.SetStateAction<string>>;
    password?: boolean;
    email?: boolean;
}

export default function TextInput({ placeholder, onChangeText, password=false, email=false, ...props }: TextInputProps & any) {
    const { colors } = useTheme();

    return (
        <TextInputNative
            placeholder={placeholder}
            onChangeText={onChangeText}
            autoCapitalize='characters'
            inputMode={email ? 'email' : 'text'}
            autoCorrect={false}
            secureTextEntry={password}
            style={{
                fontFamily: 'Silkscreen_400Regular',
                height: INPUT_HEIGHT,
                borderRadius: 14,
                backgroundColor: colors.background,
                padding: 10,
                borderWidth: 2,
                borderColor: colors.border,
                ...props.style
            }}
        />
    );
}
