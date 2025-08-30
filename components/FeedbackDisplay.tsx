import React from 'react';
import { LoadingSpinner, AppLogo } from './Icons';

interface FeedbackDisplayProps {
    review: string;
    isLoading: boolean;
    error: string | null;
}

const parseMarkdownToJSX = (markdown: string): React.ReactNode[] => {
    // Split by block-level elements: code blocks, lists, headings, or just double newlines for paragraphs.
    const blocks = markdown.split(/(\n\`\`\`|\n\n+|\n(?=\*|\-|\#))/);
    const elements: React.ReactNode[] = [];

    let buffer: string[] = [];

    const flushBuffer = (key: string) => {
        if (buffer.length > 0) {
            const content = buffer.join('\n');
            const lines = content.trim().split('\n');
            lines.forEach((line, lineIndex) => {
                const parts = line.split(/(\*\*.*?\*\*|\`.*?\`)/g).filter(part => part);
                 const styledLine = parts.map((part, i) => {
                    if (part.startsWith('**') && part.endsWith('**')) {
                        return <strong key={i} className="font-semibold text-white">{part.slice(2, -2)}</strong>;
                    }
                    if (part.startsWith('`') && part.endsWith('`')) {
                        return <code key={i} className="bg-gray-700 text-red-300 px-1.5 py-0.5 rounded-md font-mono text-sm">{part.slice(1, -1)}</code>;
                    }
                    return part;
                });
                elements.push(<p key={`${key}-${lineIndex}`} className="my-2 leading-relaxed">{styledLine}</p>);
            });
            buffer = [];
        }
    };

    blocks.forEach((block, index) => {
        if (!block.trim()) {
            flushBuffer(`p-${index}`);
            return;
        }

        const key = `block-${index}`;

        // Code blocks
        if (block.trim().startsWith('```')) {
            flushBuffer(`p-before-code-${index}`);
            const lang = block.substring(3, block.indexOf('\n')).trim();
            const code = block.substring(block.indexOf('\n') + 1, block.lastIndexOf('```') > 0 ? block.lastIndexOf('```') : block.length);
            elements.push(<pre key={key} className="bg-gray-900/70 p-4 rounded-lg overflow-x-auto font-mono text-sm my-4 text-green-300"><code className={`language-${lang}`}>{code.trim()}</code></pre>);
        } 
        // Headers
        else if (block.trim().startsWith('# ')) {
            flushBuffer(`p-before-h1-${index}`);
            elements.push(<h1 key={key} className="text-3xl font-bold mt-6 mb-3 pb-1 border-b border-gray-600 text-white">{block.trim().substring(2)}</h1>);
        } else if (block.trim().startsWith('## ')) {
            flushBuffer(`p-before-h2-${index}`);
            elements.push(<h2 key={key} className="text-2xl font-semibold mt-5 mb-2 text-gray-100">{block.trim().substring(3)}</h2>);
        } else if (block.trim().startsWith('### ')) {
            flushBuffer(`p-before-h3-${index}`);
            elements.push(<h3 key={key} className="text-xl font-medium mt-4 mb-1 text-gray-200">{block.trim().substring(4)}</h3>);
        } 
        // Lists
        else if (block.trim().startsWith('* ') || block.trim().startsWith('- ')) {
            flushBuffer(`p-before-list-${index}`);
            const listItems = block.trim().split('\n').map((item, i) => (
                <li key={i} className="mb-1">{item.trim().substring(2)}</li>
            ));
            elements.push(<ul key={key} className="list-disc pl-6 my-2 space-y-1">{listItems}</ul>);
        } 
        // Paragraphs
        else {
            buffer.push(block);
        }
    });

    flushBuffer('final-p');

    return elements;
};


export const FeedbackDisplay: React.FC<FeedbackDisplayProps> = ({ review, isLoading, error }) => {
    if (isLoading) {
        return (
            <div className="flex flex-col items-center justify-center h-full text-gray-400">
                <LoadingSpinner className="w-12 h-12 animate-spin text-blue-500" />
                <p className="mt-4 text-lg">Reviewing your code...</p>
                <p className="text-sm">This may take a moment.</p>
            </div>
        );
    }

    if (error) {
        return (
            <div className="flex items-center justify-center h-full">
                <div className="bg-red-900/50 border border-red-700 text-red-200 p-6 rounded-lg">
                    <h3 className="font-bold text-lg mb-2">An Error Occurred</h3>
                    <p>{error}</p>
                </div>
            </div>
        );
    }

    if (!review) {
        return (
            <div className="flex flex-col items-center justify-center h-full text-gray-500 text-center">
                <AppLogo className="w-24 h-24 mb-4" />
                <h2 className="text-2xl font-bold text-gray-300">Welcome to Gemini Code Reviewer</h2>
                <p className="mt-2 max-w-md">
                    Paste your code on the left, select the language, and click "Review Code" to get instant feedback powered by Gemini.
                </p>
            </div>
        );
    }

    return (
        <div className="h-full bg-gray-800 rounded-lg p-6 overflow-y-auto border border-gray-700 text-gray-300">
            {parseMarkdownToJSX(review)}
        </div>
    );
};
