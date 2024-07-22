import { ThemeContext } from '@/providers';
import { useContext } from 'react';
import { TextInput as TextInputNative } from 'react-native';

interface TextInputProps {
    placeholder: string;
    defaultValue?: string;
    value: string;
    onChangeText: React.Dispatch<React.SetStateAction<string>>;
    disabled?: boolean;
    autoCorrect?: boolean;
    maxLength?: number;
    password?: boolean;
    email?: boolean;
    style?: any;
}

export default function TextInput({ placeholder, defaultValue = '', value, onChangeText, disabled = false, autoCorrect = false, maxLength, password = false, email = false, style }: TextInputProps) {
    const theme = useContext(ThemeContext);

    function validateValue(text: string) {
        if (email || password) {
            return text.trim();
        }
        text = text.trim().toLowerCase();

        return text.replace(/[^0-9a-z_]/g, '');
    }

    return (
        <TextInputNative
            placeholder={placeholder}
            defaultValue={defaultValue}
            autoCorrect={autoCorrect}
            editable={!disabled}
            selectTextOnFocus={!disabled}
            contextMenuHidden={disabled}
            onChangeText={onChangeText}
            inputMode={email ? 'email' : 'text'}
            keyboardType={"default"}
            value={validateValue(value)}
            maxLength={maxLength}
            secureTextEntry={password}
            style={{
                fontFamily: 'Inter_700Bold',
                borderRadius: 14,
                // borderWidth: 6,
                textAlign: 'center',
                alignSelf: 'center',
                // borderColor: theme.runwayBorderColor,
                backgroundColor: theme.runwayOuterBackgroundColor,
                padding: 10,
                fontSize: 20,
                color: theme.runwayTextColor,
                ...style,
            }}
            placeholderTextColor={theme.textPlaceholder}
        />
    );
}
