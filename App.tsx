import React, { useState, useCallback } from 'react';
import { CodeEditor } from './components/CodeEditor';
import { FeedbackDisplay } from './components/FeedbackDisplay';
import { reviewCode } from './services/geminiService';
import { PROGRAMMING_LANGUAGES } from './constants';
import { AppLogo } from './components/Icons';

const App: React.FC = () => {
    const [code, setCode] = useState<string>('');
    const [language, setLanguage] = useState<string>(PROGRAMMING_LANGUAGES[0]);
    const [review, setReview] = useState<string>('');
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [error, setError] = useState<string | null>(null);

    const handleReview = useCallback(async () => {
        if (!code.trim()) {
            setError("Please enter some code to review.");
            return;
        }
        setIsLoading(true);
        setError(null);
        setReview('');

        try {
            const feedback = await reviewCode(code, language);
            setReview(feedback);
        } catch (err) {
            const errorMessage = err instanceof Error ? err.message : 'An unknown error occurred.';
            setError(`Failed to get review: ${errorMessage}`);
        } finally {
            setIsLoading(false);
        }
    }, [code, language]);

    return (
        <div className="min-h-screen bg-gray-900 text-white flex flex-col p-4 sm:p-6 lg:p-8">
            <header className="flex items-center justify-between pb-4 border-b border-gray-700 mb-6">
                <div className="flex items-center gap-3">
                    <AppLogo className="w-8 h-8 text-blue-400"/>
                    <h1 className="text-2xl font-bold text-gray-100">Gemini Code Reviewer</h1>
                </div>
            </header>

            <main className="flex-grow grid grid-cols-1 md:grid-cols-2 gap-6 h-[calc(100vh-120px)]">
                <div className="flex flex-col gap-4">
                    <div className="flex-grow">
                       <CodeEditor 
                          code={code} 
                          setCode={setCode} 
                          language={language} 
                          setLanguage={setLanguage} 
                       />
                    </div>
                    <button
                        onClick={handleReview}
                        disabled={isLoading}
                        className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-blue-900/50 disabled:cursor-not-allowed text-white font-bold py-3 px-4 rounded-lg transition-colors duration-200 flex items-center justify-center"
                    >
                        {isLoading ? 'Reviewing...' : 'Review Code'}
                    </button>
                </div>
                
                <div className="h-full">
                    <FeedbackDisplay 
                        review={review} 
                        isLoading={isLoading} 
                        error={error} 
                    />
                </div>
            </main>
        </div>
    );
};

export default App;
