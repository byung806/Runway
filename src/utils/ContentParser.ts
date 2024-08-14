import { ContentChunkType } from "@/components/2d";
import { FirebaseContent } from "@/providers";
import { split } from "sentence-splitter";


export default function parseContent(content: FirebaseContent, totalPoints: number): ContentChunkType[] {
    if (content.chunks) {
        // New content format
        const chunks: ContentChunkType[] = [];

        const totalQuestions = content.chunks.filter((chunk) => chunk.type === 'question').length;
        console.log('Total questions:', totalQuestions);

        let count = 0;
        content.chunks.forEach((chunk) => {
            if (chunk.type === 'paragraph') {
                count = 0;
                const sentences = split(chunk.text);
                sentences.forEach((sentence) => {
                    if (sentence.type === 'Sentence') {
                        chunks.push({
                            type: 'text',
                            text: sentence.raw,
                            side: count % 2 === 0 ? 'left' : 'right'
                        });
                        count++;
                    }
                });
            } else if (chunk.type === 'image') {
                chunks.push({
                    type: 'image',
                    uri: chunk.uri
                });
            } else if (chunk.type === 'icon') {
                chunks.push({
                    type: 'icon',
                    icon: chunk.icon
                });
            } else if (chunk.type === 'question') {
                chunks.push({
                    type: 'question',
                    question: chunk.question,
                    choices: chunk.choices,
                    possiblePoints: totalPoints / totalQuestions
                });
            } else if (chunk.type === 'empty') {
                chunks.push({
                    type: 'empty',
                    fractionOfScreen: chunk.fractionOfScreen
                });
            }
        });

        return chunks;
    } else {
        // Old content format

        const chunks: ContentChunkType[] = [];
        const body = content.body ?? '';

        const bodyParagraphChunks = body.split('\n');

        // Text
        let count = 0;
        bodyParagraphChunks.forEach((paragraph) => {
            count = 0;
            const sentences = split(paragraph);
            sentences.forEach((sentence) => {
                if (sentence.type === 'Sentence') {
                    chunks.push({
                        type: 'text',
                        text: sentence.raw,
                        side: count % 2 === 0 ? 'left' : 'right'
                    });
                    count++;
                }
            });
        });

        chunks.push({
            type: 'empty',
            fractionOfScreen: 0.1
        });

        // Questions
        const questions = content.questions;
        if (questions) {
            const points = totalPoints / questions.length;
            questions.forEach((question) => {
                chunks.push({
                    type: 'question',
                    question: question.question,
                    choices: question.choices,
                    possiblePoints: points
                });
            });
        }

        // console.log(JSON.stringify(chunks, undefined, 2));
        return chunks;
    }
}