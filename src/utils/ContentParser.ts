import { ContentChunkType } from "@/components/2d";
import { Content } from "@/providers";
import { split } from "sentence-splitter";


export default function parseContent(content: Content, totalPoints: number): ContentChunkType[] {
    const chunks: ContentChunkType[] = [];
    const body = content.body;

    const bodyParagraphChunks = body.split('\n');

    // Text
    let count = 0;
    bodyParagraphChunks.forEach((paragraph) => {
        count = 0;
        const sentences = split(paragraph);
        sentences.forEach((sentence) => {
            if (sentence.type === 'Sentence') {
                chunks.push({
                    type: 'textSpacer'
                });
                chunks.push({
                    type: 'text',
                    text: sentence.raw,
                    side: count % 2 === 0 ? 'left' : 'right'
                });
                count++;
            }
        });
        if (paragraph !== bodyParagraphChunks[bodyParagraphChunks.length - 1]) {
            chunks.push({
                type: 'paragraphSpacer'
            });
        }
    });


    chunks.push({
        type: 'divider'
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
            if (question !== questions[questions.length - 1]) {
                chunks.push({
                    type: 'questionSpacer'
                });
            }
        });
    }

    // console.log(JSON.stringify(chunks, undefined, 2));
    return chunks;
}