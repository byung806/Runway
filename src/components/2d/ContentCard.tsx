import React, { useContext, useState } from 'react';
import { View, ScrollView, Pressable, StyleSheet, TouchableOpacity, Button } from 'react-native';
import Text from './Text';

import { Styles } from '@/styles';
import firestore from '@react-native-firebase/firestore';
import { useDocumentDataOnce } from '@skillnation/react-native-firebase-hooks/firestore';

import Loading from './Loading';
import { ThemeContext } from './ThemeProvider';

export default function ContentCard({ date }: { date: string }) {
    const [currentQuestion, setCurrentQuestion] = useState(0);
    const [score, setScore] =useState(0);
    const [showScore, setShowScore] = useState(false);
    const theme = useContext(ThemeContext);

    const [snapshot, loading, error] = useDocumentDataOnce(
        firestore().collection('content').doc(date)
    );
    const [buttonColors, setButtonColors] = useState<string[]>([]);
    const todayQuestions = snapshot?.questions;
    //console.log(snapshot, loading, error);
    const delay = async (ms: any) => {
        return new Promise((resolve) => 
            setTimeout(resolve, ms));
    };

    const handleAnswer = async(selectedAnswer: boolean, index: number) => {
        const newButtonColors = [...buttonColors];
        if (selectedAnswer) {
            newButtonColors[index] = 'green';
            setScore((prevScore)=>prevScore+1);
        } else {
            newButtonColors[index] = 'red';
        }
        setButtonColors(newButtonColors);
        await delay(1000);
        const nextQuestion = currentQuestion + 1;
        newButtonColors[index]='white';
        setButtonColors(newButtonColors);
        if (nextQuestion < todayQuestions.length){
            setCurrentQuestion(nextQuestion);
        }else{
            setShowScore(true);
        }
    };

    const devReset=()=>{
        setCurrentQuestion(0);
        setShowScore(false);
    }

    if (loading) {
        return <Loading />;
    }
    if (error) {
        alert(error);
    }
    if (!snapshot) {
        return (
            <View style={{ ...Styles.flex, ...Styles.centeringContainer }}>
                <Text style={{ color: theme.text, ...Styles.subtitle }}>
                    No content for this day!
                </Text>
            </View>
        )
    }
    return (
        <View style={{...Styles.flex, ...Styles.centeringContainer}}>
            <ScrollView>
                <Text style = {{textAlign: 'center', fontSize: 20, color: colors.text}}>
                    {snapshot?.title}
                </Text>
                <Text style={{textAlign: 'center', paddingBottom: 30, paddingTop: 10, paddingLeft: 10, paddingRight: 10, fontSize: 12, color: colors.text}}>
                   {snapshot?.body}
                </Text>
                {showScore ? <View>
                    <Text>{score}</Text>
                </View> :
                <View><Text style={{fontSize:15,textAlign:'center',paddingBottom:15}}>Questions</Text>
                <Text style={{fontSize:12,textAlign:'center'}}>{todayQuestions[currentQuestion].question}</Text>
                {todayQuestions[currentQuestion].choices.map((c: any,index:number)=>{
                    return <TouchableOpacity onPress={()=>handleAnswer(c.correct,index)}style = {{backgroundColor: buttonColors[index] || 'transparent',borderColor:'black',borderWidth:2,marginTop:10,marginLeft:10,marginRight:10}}>
                        <Text style = {{fontSize:10,color:'black',padding:5}}>{c.choice}</Text>
                    </TouchableOpacity>
                },
                <TouchableOpacity onPress={()=>devReset()}>
                    <Text>RESET</Text>
                </TouchableOpacity>
                )}</View>
            }
                
                {/* <Text style={{color: colors.text, ...Styles.subtitle}}>
                   {snapshot?.category}
                </Text> */}
            </ScrollView>
        </View>
    )
}