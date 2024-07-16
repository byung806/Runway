export interface Theme {
    white: string;
    black: string;
    accent: string;
    accentDarker: string;
    border: string;
    gray: string;
    grayDark: string;
    background: string;
    backgroundSecondary: string;
    backgroundInverse: string;
    text: string;
    textPlaceholder: string;
    textInverse: string;
    subtext: string;
}

const CommonThemeColors = {
    white: '#ffffff',
    black: '#000000',
    gray: '#dddddd',
    grayDark: '#b0b19d',
}

export const RunwayLightTheme = {
    accent: '#74398a',  // runway purple
    accentDarker: '#532764',  // runway darker purple

    border: '#e5e5e5',

    background: '#f2f2f2',
    backgroundSecondary: '#e5e5e5',
    backgroundInverse: '#151515',
    text: '#1c1c1c',
    textPlaceholder: '#666666',
    textInverse: '#ffffff',

    subtext: '#3e3e3e',

    ...CommonThemeColors,
};

export const RunwayDarkTheme = {
    accent: '#6C22A6',
    accentDarker: '#301934',

    border: '#aaaaaa',

    background: '#151515',
    backgroundSecondary: '#222222',
    backgroundInverse: '#f2f2f2',
    text: '#ffffff',
    textPlaceholder: '#bbbbbb',
    textInverse: '#1c1c1c',

    subtext: '#dddddd',

    ...CommonThemeColors,
};