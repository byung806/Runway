import { RunwayDarkTheme, RunwayLightTheme, Theme } from "@/styles";
import { StatusBar } from "expo-status-bar";
import { ReactNode, createContext, useContext, useEffect, useState } from "react";
import { useColorScheme } from "react-native";


export function ThemeProvider({ children }: { children: ReactNode }) {
    const scheme = useColorScheme();
    const [theme, setTheme] = useState(scheme === 'dark' ? RunwayDarkTheme : RunwayLightTheme);

    // on theme change
    useEffect(() => {
        setTheme(scheme === 'dark' ? RunwayDarkTheme : RunwayLightTheme);
    }), [scheme];

    return (
        <ThemeContext.Provider value={theme}>
            <StatusBar style={scheme === 'light' ? 'dark' : 'light'} />
            {children}
        </ThemeContext.Provider>
    );
}

const ThemeContext = createContext<Theme>(RunwayLightTheme);

// hook to use Theme context
export const useRunwayTheme = (): Theme => {
    const theme = useContext(ThemeContext);
    if (!theme) {
        throw new Error('useRunwayTheme must be used within a ThemeProvider');
    }
    return theme;
};
