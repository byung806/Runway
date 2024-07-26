export interface Theme {
    runwayTextColor: string;
    runwayBorderColor: string;
    runwayBackgroundColor: string;
    runwayButtonColor: string;
    runwayOuterBackgroundColor: string;

    white: string;
    black: string;
    accentLighter: string;
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
    runwayTextColor: '#edbeff',
    runwayBorderColor: '#844a97',
    runwayBackgroundColor: '#2f1f35',
    runwayButtonColor: '#653173',
    runwayOuterBackgroundColor: '#3c2b41',

    white: '#ffffff',
    black: '#000000',
    gray: '#dddddd',
    grayDark: '#b0b19d',
}

export const RunwayLightTheme = {
    accentLighter: '#a56cf2',  // runway light purple
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
    accentLighter: '#9A4FDB',
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