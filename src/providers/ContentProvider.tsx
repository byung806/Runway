import { useNavigation } from "@react-navigation/native";
import { ReactNode, createContext, useContext, useEffect, useState } from "react";
import { FirebaseContent, ContentColors, useFirebase } from "./FirebaseProvider";
import { usePushNotifications } from "./NotificationProvider";
import { Alert } from "react-native";

export type ContentQuestionScores = {
    earned: number;
    possible: number;
}[];

// OUT - what the context will provide
interface ContentContextType {
    isOnboardingContent?: boolean;

    date: string;
    isToday: boolean;
    content: FirebaseContent;
    numQuestions: number;
    colors: ContentColors;
    earnedPointsWithoutStreak: number;
    earnedStreakBonus: number;
    earnablePointsWithoutStreak: number;
    questionsStarted: boolean;
    allQuestionsCompleted: boolean;
    cardCompleted: boolean;

    back: () => void;
    completeQuestion: (earned: number, possible: number) => void;
    finish: () => Promise<void>;
    // requestCompleteDate: (date: string) => { success: boolean };
}

// IN - what the context takes in
interface ContentProviderProps {
    isOnboardingContent?: boolean;

    date?: string;
    possiblePoints?: number;
    content: FirebaseContent;
    colors: ContentColors;
    openContentModal: Function;
    closeContentModal: Function;

    children: ReactNode;
}

export const ContentContext = createContext<ContentContextType | null>(null);

export function ContentProvider(props: ContentProviderProps) {
    const { isOnboardingContent, date, possiblePoints, content, colors, openContentModal, closeContentModal, children } = props;

    const firebase = useFirebase();
    const notifications = usePushNotifications();
    const navigation = useNavigation<any>();

    const isToday = date === firebase.today;
    const [cardCompleted, setCardCompleted] = useState(getCardCompleted());

    useEffect(() => {
        setCardCompleted(getCardCompleted());
    }, [firebase.userData]);

    const [earnedPointsWithoutStreak, setEarnedPointsWithoutStreak] = useState(0);
    const [earnedStreakBonus, setEarnedStreakBonus] = useState(0);
    const earnablePointsWithoutStreak = possiblePoints ?? (isToday ? 500 : 200);
    // console.log('earnablePointsWithoutStreak', earnablePointsWithoutStreak, 'date', date);
    // const earnablePointsWithoutStreak = isToday ? 300 : 200;

    const numQuestions = content.chunks ? content.chunks.filter(chunk => chunk.type === 'question').length : content.questions?.length ?? 0;
    const [questionsStarted, setQuestionsStarted] = useState(false);
    const [allQuestionsCompleted, setAllQuestionsCompleted] = useState(false);
    const [questionScores, setQuestionScores] = useState<{
        earned: number;
        possible: number;
    }[]>([]);

    function getCardCompleted() {
        if (isOnboardingContent || !date) return false;
        return date in (firebase.userData?.point_days ?? {});
    }

    /**
     * Go back to the main app screen
     */
    function back() {
        closeContentModal();
        setQuestionsStarted(false);
        setAllQuestionsCompleted(false);
        setQuestionScores([]);
        setEarnedPointsWithoutStreak(0);
        setEarnedStreakBonus(0);
    }

    function calculateStreakBonus(streak: number) {
        if (streak >= 1 && streak < 5) {
            return 20;
        }
        if (streak >= 5 && streak < 10) {
            return 30;
        }
        if (streak >= 10 && streak < 15) {
            return 35;
        }
        if (streak >= 15 && streak < 20) {
            return 40;
        }
        if (streak >= 20) {
            return 40 + streak * 0.1;
        }
        return 0;
    }

    /**
     * Complete a question and add the score to the list
     */
    function completeQuestion(earned: number, possible: number) {
        setQuestionsStarted(true);
        
        if (questionScores.length + 1 === numQuestions) {
            setAllQuestionsCompleted(true);
        }
        setQuestionScores([...questionScores, {
            earned,
            possible
        }]);
        if (isToday) {
            // need this for float rounding errors
            setEarnedStreakBonus(Math.round(calculateStreakBonus(firebase.userData?.streak ?? 0)));
        }
        setEarnedPointsWithoutStreak(earnedPointsWithoutStreak + earned);
    }

    /**
     * Finish the content and update the user's data
     */
    async function finish() {
        if (!isOnboardingContent && notifications.permissionStatus === 'undetermined') {
            Alert.alert(
                'Stay in the loop!',
                'Get notified every day when new content is available!',
                [
                    { text: 'Maybe Later', style: 'cancel' },
                    { text: 'Sure!', style: 'default', isPreferred: true, onPress: async () => { await notifications.requestPermissions(); } }
                ],
                { cancelable: false }
            )
        }

        if (!cardCompleted && !isOnboardingContent) {  // don't need this since requestCompleteDate in AppScreen already checks if date is completed, but just in case
            const pointsEarned = questionScores.reduce((acc, curr) => acc + curr.earned, 0);
            const pointsPossible = questionScores.reduce((acc, curr) => acc + curr.possible, 0);

            // console.log('pointsEarned', pointsEarned, pointsPossible);

            if (isToday) {
                navigation.navigate('streak', {
                    initialStreak: firebase.userData?.streak ?? 0,
                    date: date,
                    pointsEarned: pointsEarned,
                    pointsPossible: pointsPossible,
                    earnedStreakBonus: earnedStreakBonus,
                });
            } else {
                await firebase.requestCompleteDate(date, pointsEarned / pointsPossible * 100);
            }
        }

        closeContentModal();
        setQuestionsStarted(false);
        setAllQuestionsCompleted(false);
        setQuestionScores([]);
        setEarnedPointsWithoutStreak(0);
        setEarnedStreakBonus(0);
    }

    return (
        <ContentContext.Provider value={{
            isOnboardingContent,
            date: date ?? '',
            isToday,
            content,
            numQuestions,
            colors,
            earnedPointsWithoutStreak,
            earnedStreakBonus,
            earnablePointsWithoutStreak,
            questionsStarted,
            allQuestionsCompleted,
            cardCompleted,
            back,
            completeQuestion,
            finish,
        }}>
            {children}
        </ContentContext.Provider>
    );
}

export function useContent() {
    const context = useContext(ContentContext);
    if (!context) {
        throw new Error('useContent must be used within a ContentProvider');
    }
    return context;
}