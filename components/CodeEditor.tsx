import React, { useState, useEffect, useRef } from 'react';
import { PROGRAMMING_LANGUAGES } from '../constants';

interface CodeEditorProps {
    code: string;
    setCode: (code: string) => void;
    language: string;
    setLanguage: (language: string) => void;
}

export const CodeEditor: React.FC<CodeEditorProps> = ({ code, setCode, language, setLanguage }) => {
    const [lineCount, setLineCount] = useState(1);
    const lineNumbersRef = useRef<HTMLTextAreaElement>(null);
    const codeTextAreaRef = useRef<HTMLTextAreaElement>(null);

    useEffect(() => {
        const lines = code.split('\n').length;
        setLineCount(lines > 0 ? lines : 1);
    }, [code]);

    const handleCodeChange = (event: React.ChangeEvent<HTMLTextAreaElement>) => {
        setCode(event.target.value);
    };

    const handleScroll = () => {
        if (lineNumbersRef.current && codeTextAreaRef.current) {
            lineNumbersRef.current.scrollTop = codeTextAreaRef.current.scrollTop;
        }
    };

    const lineNumbers = Array.from({ length: lineCount }, (_, i) => i + 1).join('\n');

    return (
        <div className="flex flex-col h-full bg-gray-800 rounded-lg overflow-hidden border border-gray-700">
            <div className="p-3 bg-gray-700/50 border-b border-gray-700">
                <select
                    value={language}
                    onChange={(e) => setLanguage(e.target.value)}
                    className="w-full bg-gray-800 border border-gray-600 text-white rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                    {PROGRAMMING_LANGUAGES.map((lang) => (
                        <option key={lang} value={lang}>
                            {lang}
                        </option>
                    ))}
                </select>
            </div>
            <div className="flex flex-grow font-mono text-sm">
                <textarea
                    ref={lineNumbersRef}
                    className="w-12 p-4 text-right text-gray-500 bg-gray-900/50 border-r border-gray-700 resize-none select-none focus:outline-none"
                    value={lineNumbers}
                    readOnly
                />
                <textarea
                    ref={codeTextAreaRef}
                    className="flex-grow p-4 bg-transparent text-gray-200 resize-none focus:outline-none leading-relaxed"
                    value={code}
                    onChange={handleCodeChange}
                    onScroll={handleScroll}
                    placeholder="Paste your code here..."
                    spellCheck="false"
                />
            </div>
        </div>
    );
};
