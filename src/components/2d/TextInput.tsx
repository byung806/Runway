import { useContext } from 'react';
import { TextInput as TextInputNative } from 'react-native';
import { ThemeContext } from './ThemeProvider';
import { Styles } from '@/styles';

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
                ...props.style
            }}
            placeholderTextColor={theme.textPlaceholder}
        />
    );
}
