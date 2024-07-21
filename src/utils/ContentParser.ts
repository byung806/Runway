import { ContentChunk } from "@/components/2d/ContentModal";
import { Content } from "./FirebaseProvider";
import { split } from "sentence-splitter";


export default function parseContent(content: Content): ContentChunk[] {
    const chunks: ContentChunk[] = [];
    const body = content.body;

    // TODO: rn everything's in order but we might want to add a way to reorder the content

    const bodyParagraphChunks = body.split('\n');

    // Text
    bodyParagraphChunks.forEach((paragraph) => {
        const sentences = split(paragraph);
        sentences.forEach((sentence) => {
            chunks.push({
                type: 'text',
                text: sentence.raw
            });
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
    questions.forEach((question) => {
        chunks.push({
            type: 'question',
            question: question.question,
            choices: question.choices
        });
    });

    return chunks;
}