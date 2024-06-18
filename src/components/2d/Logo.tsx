import { FontAwesome as Icon } from '@expo/vector-icons';
import { useTheme } from '@react-navigation/native';

export default function Logo({size=80}: {size?: number}) {
    const { colors } = useTheme();

    return (
        <Icon name="paper-plane" size={size} color={colors.primary} />
    )
}