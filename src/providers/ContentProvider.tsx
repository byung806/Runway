import { useNavigation } from "@react-navigation/native";
import { ReactNode, createContext, useContext, useEffect, useState } from "react";
import { Content, ContentColors, useFirebase } from "./FirebaseProvider";

export type ContentQuestionScores = {
    earned: number;
    possible: number;
}[];

// OUT - what the context will provide
interface ContentContextType {
    isOnboardingContent?: boolean;

    date: string;
    isToday: boolean;
    content: Content;
    colors: ContentColors;
    earnedPointsWithoutStreak: number;
    earnedStreakBonus: number;
    earnablePointsWithoutStreak: number;
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
    content: Content;
    colors: ContentColors;
    openContentModal: Function;
    closeContentModal: Function;

    children: ReactNode;
}

export const ContentContext = createContext<ContentContextType | null>(null);

export function ContentProvider(props: ContentProviderProps) {
    const { isOnboardingContent, date, content, colors, openContentModal, closeContentModal, children } = props;

    const firebase = useFirebase();
    const navigation = useNavigation<any>();

    const isToday = date === firebase.today;
    const [cardCompleted, setCardCompleted] = useState(getCardCompleted());

    useEffect(() => {
        setCardCompleted(getCardCompleted());
    }, [firebase.userData]);

    const [earnedPointsWithoutStreak, setEarnedPointsWithoutStreak] = useState(0);
    const [earnedStreakBonus, setEarnedStreakBonus] = useState(0);
    const earnablePointsWithoutStreak = isToday ? 300 : 200;

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
        setAllQuestionsCompleted(false);
        setQuestionScores([]);
        setEarnedPointsWithoutStreak(0);
        setEarnedStreakBonus(0);
    }

    /**
     * Complete a question and add the score to the list
     */
    function completeQuestion(earned: number, possible: number) {
        if (questionScores.length + 1 === content.questions.length) {
            setAllQuestionsCompleted(true);
        }
        setQuestionScores([...questionScores, {
            earned,
            possible
        }]);
        if (isToday) {
            setEarnedStreakBonus((earnedPointsWithoutStreak + earned) * (Math.min((firebase.userData?.streak?? 0) * 0.01, 1.3)));
        }
        setEarnedPointsWithoutStreak(earnedPointsWithoutStreak + earned);
    }

    /**
     * Finish the content and update the user's data
     */
    async function finish() {
        if (!cardCompleted && !isOnboardingContent) {  // don't need this since requestCompleteDate in AppScreen already checks if date is completed, but just in case
            const pointsEarned = questionScores.reduce((acc, curr) => acc + curr.earned, 0);
            const pointsPossible = questionScores.reduce((acc, curr) => acc + curr.possible, 0);

            console.log('pointsEarned', pointsEarned, pointsPossible);

            const { success } = await firebase.requestCompleteDate(date, pointsEarned / pointsPossible * 100);

            if (success) {
                if (isToday) {
                    navigation.navigate('streak', { initialStreak: firebase.userData?.streak ?? 0 });
                }
                await firebase.getUserData();
                await firebase.getLeaderboard('global');
                // TODO: update friends leaderboard too if rank is ever implemented
            }
        }
        closeContentModal();
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
            colors,
            earnedPointsWithoutStreak,
            earnedStreakBonus,
            earnablePointsWithoutStreak,
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