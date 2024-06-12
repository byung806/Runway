import { TextInput as TextInputNative } from 'react-native';
import { useTheme } from "@react-navigation/native";
import { Colors } from '../../styles';

export const INPUT_HEIGHT = 45;

interface TextInputProps {
    placeholder: string;
    onChangeText: React.Dispatch<React.SetStateAction<string>>;
    password?: boolean;
}

export default function TextInput({ placeholder, onChangeText, password=false }: TextInputProps) {
    const { colors } = useTheme();

    return (
        <TextInputNative
            placeholder={placeholder}
            onChangeText={onChangeText}
            secureTextEntry={password}
            style={{
                height: INPUT_HEIGHT,
                borderRadius: 14,
                backgroundColor: colors.background,
                padding: 10,
                borderWidth: 2,
                borderColor: colors.border,
            }}
        />
    );
}
