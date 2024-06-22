import { RunwayDarkTheme, RunwayLightTheme, Theme } from "@/styles";
import { StatusBar } from "expo-status-bar";
import { ReactNode, createContext, useEffect, useState } from "react";
import { useColorScheme } from "react-native";

export const ThemeContext = createContext<Theme>(RunwayLightTheme);

export function ThemeProvider({ children }: { children: ReactNode }) {
    const scheme = useColorScheme();
    const [theme, setTheme] = useState(scheme === 'dark' ? RunwayDarkTheme : RunwayLightTheme);

    // on theme change
    useEffect(() => {
        setTheme(scheme === 'dark' ? RunwayDarkTheme : RunwayLightTheme);
    }), [scheme];

    return (
        <ThemeContext.Provider value={theme}>
            <StatusBar style={scheme === 'dark' ? 'light' : 'dark'} />
            {children}
        </ThemeContext.Provider>
    );
}