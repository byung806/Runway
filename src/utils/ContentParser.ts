import { ContentChunk } from "@/components/2d/ContentModal";
import { Content } from "./FirebaseProvider";
import { split } from "sentence-splitter";


export default function parseContent(content: Content, totalPoints: number): ContentChunk[] {
    const chunks: ContentChunk[] = [];
    const body = content.body;

    console.log('parsing content');

    // TODO: rn everything's in order but we might want to add a way to reorder the content

    const bodyParagraphChunks = body.split('\n');

    // Text
    let count = 0;
    bodyParagraphChunks.forEach((paragraph) => {
        count = 0;
        const sentences = split(paragraph);
        sentences.forEach((sentence) => {
            if (sentence.type === 'Sentence') {
                chunks.push({
                    focused: false,
                    type: 'textSpacer'
                });
                chunks.push({
                    focused: false,
                    type: 'text',
                    text: sentence.raw,
                    side: count % 2 === 0 ? 'left' : 'right'
                });
                count++;
            }
        });
        if (paragraph !== bodyParagraphChunks[bodyParagraphChunks.length - 1]) {
            chunks.push({
                focused: false,
                type: 'paragraphSpacer'
            });
        }
    });


    chunks.push({
        focused: false,
        type: 'divider'
    });


    // Questions
    const questions = content.questions;
    if (questions) {
        const points = totalPoints / questions.length;
        questions.forEach((question) => {
            chunks.push({
                focused: false,
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