import { ThemeContext } from '@/providers';
import { useContext } from 'react';
import { TextInput as TextInputNative } from 'react-native';

interface TextInputProps {
    placeholder: string;
    defaultValue?: string;
    onChangeText: React.Dispatch<React.SetStateAction<string>>;
    disabled?: boolean;
    password?: boolean;
    email?: boolean;
    style?: any;
}

export default function TextInput({ placeholder, defaultValue = '', onChangeText, disabled = false, password = false, email = false, style }: TextInputProps) {
    const theme = useContext(ThemeContext);

    return (
        <TextInputNative
            placeholder={placeholder}
            defaultValue={defaultValue}
            editable={!disabled}
            selectTextOnFocus={!disabled}
            contextMenuHidden={disabled}
            onChangeText={onChangeText}
            inputMode={email ? 'email' : 'text'}
            autoComplete={email ? 'email' : undefined}
            keyboardType={"default"}
            secureTextEntry={password}
            style={{
                fontFamily: 'Inter_700Bold',
                borderRadius: 14,
                alignSelf: 'center',
                // borderWidth: 6,
                textAlign: 'center',
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
