import { useContext } from 'react';
import { TextInput as TextInputNative } from 'react-native';
import { ThemeContext } from './ThemeProvider';

export const INPUT_HEIGHT = 45;

interface TextInputProps {
    placeholder: string;
    onChangeText: React.Dispatch<React.SetStateAction<string>>;
    disabled?: boolean;
    password?: boolean;
    email?: boolean;
}

export default function TextInput({ placeholder, onChangeText, disabled = false, password = false, email = false, ...props }: TextInputProps & any) {
    const theme = useContext(ThemeContext);

    return (
        <TextInputNative
            placeholder={placeholder}
            editable={!disabled}
            selectTextOnFocus={!disabled}
            contextMenuHidden={disabled}
            onChangeText={onChangeText}
            // autoCapitalize='characters'
            inputMode={email ? 'email' : 'text'}
            keyboardType={"default"}
            secureTextEntry={password}
            style={{
                fontFamily: 'Inter_700Bold',
                height: INPUT_HEIGHT,
                borderRadius: 14,
                backgroundColor: theme.background,
                padding: 10,
                borderWidth: 2,
                color: theme.text,
                borderColor: theme.border,
                ...props.style
            }}
            placeholderTextColor={theme.textPlaceholder}
        />
    );
}
