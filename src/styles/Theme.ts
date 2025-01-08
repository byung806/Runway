export interface Theme {
    scheme: 'light' | 'dark';

    graphBackgroundColor: string;
    graphLinkColor: string;

    runwayTextColor: string;
    runwaySubTextColor: string;
    runwayBorderColor: string;
    runwayBackgroundColor: string;
    runwayButtonColor: string;
    runwayButtonTextColor: string;
    runwayTextInputBackgroundColor: string;
    runwayOuterBackgroundColor: string;

    questionCorrectColor: string;
    questionIncorrectColor: string;

    trophyYellow: string;
    streakColor: string;
    inactiveStreakColor: string;

    leaderboardHighlightColor: string;

    white: string;
    black: string;
    gray: string;
    textPlaceholder: string;
}

const CommonThemeColors = {
    questionCorrectColor: '#66bb5c',
    questionIncorrectColor: '#ff5343',

    trophyYellow: '#fcc201',
    streakColor: '#cc5500',

    white: '#ffffff',
    black: '#000000',
    gray: '#dddddd',
}

export const RunwayLightTheme: Theme = {
    scheme: 'light',

    graphBackgroundColor: '#fcfcfc',
    graphLinkColor: '#bbbbbb',
    
    runwayTextColor: '#3b0051',
    runwaySubTextColor: '#755486',
    runwayBorderColor: '#47005e',
    runwayBackgroundColor: '#f1e1f9',
    runwayButtonColor: '#653173',
    runwayButtonTextColor: '#fefefe',
    runwayTextInputBackgroundColor: '#fdfcfe',
    runwayOuterBackgroundColor: '#fcfcfc',

    leaderboardHighlightColor: '#d5c9de',

    inactiveStreakColor: '#3b0051',

    textPlaceholder: '#b4adb6',

    ...CommonThemeColors,
};

export const RunwayDarkTheme: Theme = {
    scheme: 'dark',

    graphBackgroundColor: '#010101',
    graphLinkColor: '#ffffff',

    // runwayTextColor: '#edbeff',
    // runwayBorderColor: '#844a97',
    // runwayBackgroundColor: '#2f1f35',
    // runwayButtonColor: '#653173',
    // runwayButtonTextColor: '#edbeff',
    // runwayOuterBackgroundColor: '#3c2b41',
    // runwaySplashScreenBackgroundColor: '#8b45a4',
    runwayTextColor: '#f3e2fc',
    runwaySubTextColor: '#9a68ab',
    runwayBorderColor: '#f7e6ff',
    runwayBackgroundColor: '#3b0051',
    runwayButtonColor: '#f2e1fb',
    runwayButtonTextColor: '#360549',
    runwayTextInputBackgroundColor: '#280236',
    runwayOuterBackgroundColor: '#3c2b41',

    leaderboardHighlightColor: '#442c4e',

    inactiveStreakColor: '#f2e1fb',

    textPlaceholder: '#49474b',

    ...CommonThemeColors,
};