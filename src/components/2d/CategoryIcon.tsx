import React from 'react';
import { FontAwesome5 } from "@expo/vector-icons";


interface CategoryIconProps {
    category: string;
    size?: number;
    color?: string;
}

export default function CategoryIcon({ category, size=30, color='black' }: CategoryIconProps) {
    category = category.toLowerCase();

    if (category === 'random') {
        return (
            <FontAwesome5 name='dice-five' size={size} color={color} />
        )
    }
    if (category === 'biology') {
        return (
            <FontAwesome5 name='leaf' size={size} color={color} />
        )
    }
    if (category === 'chemistry') {
        return (
            <FontAwesome5 name='flask' size={size} color={color} />
        )
    }
    if (category === 'physics') {
        return (
            <FontAwesome5 name='atom' size={size} color={color} />
        )
    }
    if (category === 'astronomy') {
        return (
            <FontAwesome5 name='cloud-moon' size={size} color={color} />
        )
    }
    if (category === 'geology' || category === 'earth science') {
        return (
            <FontAwesome5 name='mountain' size={size} color={color} />
        )
    }
    return (
        <FontAwesome5 name='book' size={size} color={color} />
    );
}
