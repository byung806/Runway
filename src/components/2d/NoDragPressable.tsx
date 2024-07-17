import { useRef } from 'react';
import { Pressable as PressableNative, PressableProps } from 'react-native';

export default function NoDragPressable({ onPress, onPressIn, onPressOut, style, ...props }: PressableProps & any) {
    const _touchActivatePositionRef = useRef<{ pageX: any; pageY: any; } | null>(null);

    function _onPressIn(e: { nativeEvent: { pageX: any; pageY: any; }; }) {
        const { pageX, pageY } = e.nativeEvent;

        _touchActivatePositionRef.current = {
            pageX,
            pageY,
        };

        onPressIn?.(e);
    }

    function _onPress(e: { nativeEvent: { pageX: any; pageY: any; }; }) {
        const { pageX, pageY } = e.nativeEvent;

        const absX = Math.abs(_touchActivatePositionRef.current?.pageX - pageX);
        const absY = Math.abs(_touchActivatePositionRef.current?.pageY - pageY);

        const dragged = absX > 2 || absY > 2;
        if (!dragged) {
            onPress?.(e);
        }
    }

    return (
        <PressableNative onPressIn={_onPressIn} onPress={_onPress} onPressOut={onPressOut} style={style} {...props}>
            {props.children}
        </PressableNative>
    )
}