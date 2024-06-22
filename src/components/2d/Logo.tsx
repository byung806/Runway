import { FontAwesome as Icon } from '@expo/vector-icons';
import { useContext } from 'react';
import { ThemeContext } from './ThemeProvider';

export default function Logo({ size = 80 }: { size?: number }) {
    const theme = useContext(ThemeContext);

    return (
        <Icon name="paper-plane" size={size} color={theme.accent} />
    )
}