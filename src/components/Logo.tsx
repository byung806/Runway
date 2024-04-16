import { FontAwesome as Icon } from '@expo/vector-icons';
import { Colors } from "@/styles";

export default function Logo({size=144}: {size?: number}) {
    return (
        <Icon name="paper-plane" size={size} color={Colors.light.accent} />
    )
}