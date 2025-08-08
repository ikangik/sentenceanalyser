import React, { useState } from 'react';

const App = () => {
    const [sentence, setSentence] = useState('');
    const [analysis, setAnalysis] = useState(null);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState('');

    /**
     * Performs a built-in grammatical analysis of a sentence.
     * This function is designed to work offline.
     * @param {string} text The sentence to be analyzed.
     * @returns {object} The analysis results, including POS, grammar, and structure.
     */
    const analyzeSentence = (text) => {
        const words = text.trim().split(/\s+/).filter(word => word.length > 0);
        const sanitizedWords = words.map(word => word.toLowerCase().replace(/[.,!?;:"']/g, ''));

        // A simple POS tagging function based on common word patterns and lists
        const getPOS = (word, index) => {
            const lowerWord = sanitizedWords[index];
            const originalWord = words[index];

            // Common parts of speech
            const determiners = ['the', 'a', 'an', 'this', 'that', 'these', 'those', 'my', 'your', 'his', 'her', 'its', 'our', 'their'];
            const pronouns = ['i', 'you', 'he', 'she', 'it', 'we', 'they', 'me', 'him', 'her', 'us', 'them', 'myself', 'yourself', 'himself', 'herself', 'itself', 'ourselves', 'themselves'];
            const prepositions = ['in', 'on', 'at', 'by', 'for', 'with', 'about', 'to', 'from', 'of', 'over', 'under', 'through', 'during', 'before', 'after', 'above', 'below', 'between', 'among'];
            const conjunctions = ['and', 'but', 'or', 'nor', 'for', 'so', 'yet', 'because', 'although', 'while', 'since', 'if', 'unless', 'until'];
            const auxiliaries = ['am', 'is', 'are', 'was', 'were', 'have', 'has', 'had', 'having', 'will', 'would', 'shall', 'should', 'may', 'might', 'can', 'could', 'must', 'ought', 'do', 'does', 'did'];

            if (determiners.includes(lowerWord)) return 'Determiner';
            if (pronouns.includes(lowerWord)) return 'Pronoun';
            if (prepositions.includes(lowerWord)) return 'Preposition';
            if (conjunctions.includes(lowerWord)) return 'Conjunction';
            if (auxiliaries.includes(lowerWord)) return 'Auxiliary Verb';
            
            // Heuristic checks
            if (lowerWord.endsWith('ly')) return 'Adverb';
            if (lowerWord.endsWith('ing') || lowerWord.endsWith('ed')) return 'Verb';
            if (originalWord[0] === originalWord[0].toUpperCase() && index > 0) return 'Proper Noun';

            return 'Noun';
        };

        const posAnalysis = words.map((word, index) => ({
            word: word,
            pos: getPOS(word, index)
        }));

        const hasVerb = posAnalysis.some(item => ['Verb', 'Auxiliary Verb'].includes(item.pos));

        // Check for common grammatical issues
        const startsWithSubordinator = ['after', 'although', 'as', 'because', 'before', 'if', 'since', 'that', 'though', 'unless', 'until', 'when', 'where', 'while'].includes(sanitizedWords[0]);
        const startsWithParticiple = (sanitizedWords[0]?.endsWith('ing') || sanitizedWords[0]?.endsWith('ed')) && text.includes(',');
        
        // New logic to detect a dangling participle, a common fragment type.
        // Heuristic: starts with a participle, has a comma, and the next word is a pronoun
        // which often leads to a mismatched subject.
        const commaIndex = text.indexOf(',');
        const afterCommaWords = commaIndex !== -1 ? text.substring(commaIndex + 1).trim().split(/\s+/).filter(word => word.length > 0) : [];
        const isDanglingParticiple = startsWithParticiple && (['i', 'you', 'he', 'she', 'it', 'we', 'they'].includes(afterCommaWords[0]?.toLowerCase()));

        // The core logic update for isCompleteSentence
        const isCompleteSentence = hasVerb && text.trim().length > 0 && /[.!?]$/.test(text.trim()) && !startsWithSubordinator && !isDanglingParticiple;

        const hasPunctuationErrors = !(/[.!?]$/.test(text.trim())) && text.trim().length > 0;

        const voice = sanitizedWords.includes('by') && sanitizedWords.some(word => ['am', 'is', 'are', 'was', 'were', 'have', 'has', 'had'].includes(word)) ? 'Passive' : 'Active';

        let summary = "The sentence appears ";
        if (!isCompleteSentence) {
            summary += "to be incomplete or a fragment. ";
        } else {
            summary += "to be grammatically complete. ";
        }
        if (isDanglingParticiple) {
            summary += "A dangling participle was detected, making the sentence a fragment.";
        } else {
             summary += `It uses ${voice.toLowerCase()} voice.`;
             if (hasPunctuationErrors) {
                summary += " Consider adding proper punctuation.";
            }
        }
        
        // Detailed structural analysis to show the user the different parts
        const structuralAnalysis = [];
        
        if (startsWithParticiple) {
            const participialPhraseText = text.substring(0, commaIndex + 1);
            const independentClauseText = text.substring(commaIndex + 1);
            
            structuralAnalysis.push({
                type: "Participial Phrase",
                text: participialPhraseText.trim(),
                function: "A verb phrase acting as an adjective. It cannot stand alone as a sentence."
            });
            structuralAnalysis.push({
                type: "Independent Clause",
                text: independentClauseText.trim(),
                function: "The main clause of the sentence that can stand alone."
            });
        } else if (startsWithSubordinator) {
             const commaIndex = text.indexOf(',');
            if (commaIndex !== -1) {
                const dependentClauseText = text.substring(0, commaIndex + 1);
                const independentClauseText = text.substring(commaIndex + 1);
                structuralAnalysis.push({
                    type: "Dependent Clause",
                    text: dependentClauseText.trim(),
                    function: "Begins with a subordinating conjunction and cannot stand alone."
                });
                structuralAnalysis.push({
                    type: "Independent Clause",
                    text: independentClauseText.trim(),
                    function: "The main clause of the sentence."
                });
            } else {
                structuralAnalysis.push({
                    type: "Dependent Clause Fragment",
                    text: text.trim(),
                    function: "This clause begins with a subordinating conjunction and cannot stand alone."
                });
            }
        } else {
             // For simple sentences
             structuralAnalysis.push({
                type: "Independent Clause",
                text: text.trim(),
                function: "This is the main clause of the sentence that can stand alone."
            });
        }

        return {
            posAnalysis,
            grammarAnalysis: {
                voice,
                isCompleteSentence,
                hasPunctuationErrors,
                summary
            },
            structuralAnalysis
        };
    };

    const handleAnalyse = async () => {
        setIsLoading(true);
        setError('');
        setAnalysis(null);

        try {
            await new Promise(resolve => setTimeout(resolve, 1000));
            if (!sentence.trim()) {
                setError("Please enter a sentence to analyze.");
                return;
            }
            const result = analyzeSentence(sentence);
            setAnalysis(result);
        } catch (err) {
            console.error("Error analysing sentence:", err);
            setError(`Failed to analyse sentence: ${err.message}`);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-white text-gray-800 font-sans p-8 flex flex-col items-center">
            <div className="w-full max-w-2xl bg-gray-100 p-8 rounded-2xl shadow-xl space-y-6">
                <h1 className="text-4xl font-bold text-center text-teal-600">Sentence Analyser</h1>
                <p className="text-center text-gray-500">
                    Enter a sentence for analysis. Now works offline with built-in analysis!
                </p>
                <div className="flex flex-col space-y-4">
                    <input
                        type="text"
                        value={sentence}
                        onChange={(e) => setSentence(e.target.value)}
                        className="w-full p-4 text-lg rounded-xl border border-gray-300 bg-gray-200 text-gray-800 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-teal-600"
                        placeholder="Enter a sentence for analysis..."
                    />
                    <button
                        onClick={handleAnalyse}
                        disabled={isLoading || !sentence.trim()}
                        className="w-full p-4 text-lg font-bold rounded-xl shadow-md tartan-button"
                    >
                        {isLoading ? (
                            <div className="flex justify-center items-center">
                                <svg className="animate-spin h-5 w-5 text-white mr-3" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                </svg>
                                Analysing...
                            </div>
                        ) : 'Analyse Sentence'}
                    </button>
                </div>
                {error && (
                    <div className="p-4 bg-red-200 text-red-800 rounded-xl">
                        {error}
                    </div>
                )}
                {analysis && (
                    <div className="mt-8 space-y-8">
                        <div>
                            <h2 className="text-2xl font-bold text-teal-600 mb-4">Parts of Speech:</h2>
                            <div className="flex flex-wrap gap-4 justify-center">
                                {analysis.posAnalysis.map((item, index) => (
                                    <div key={index} className="flex flex-col items-center p-4 bg-gray-200 rounded-xl shadow-md min-w-[120px]">
                                        <span className="text-xl font-bold text-gray-800 mb-1">{item.word}</span>
                                        <span className="text-sm font-semibold text-gray-600">{item.pos}</span>
                                    </div>
                                ))}
                            </div>
                        </div>
                        <div>
                            <h2 className="text-2xl font-bold text-teal-600 mb-4">Grammatical Analysis:</h2>
                            <div className="bg-gray-200 p-6 rounded-xl space-y-4">
                                <div className="flex justify-between items-center text-lg">
                                    <span className="font-semibold">Voice:</span>
                                    <span className="text-gray-800">{analysis.grammarAnalysis.voice}</span>
                                </div>
                                <div className="flex justify-between items-center text-lg">
                                    <span className="font-semibold">Complete Sentence:</span>
                                    <span className={`font-bold ${analysis.grammarAnalysis.isCompleteSentence ? 'text-green-600' : 'text-red-600'}`}>
                                        {analysis.grammarAnalysis.isCompleteSentence ? 'Yes' : 'No'}
                                    </span>
                                </div>
                                <div className="flex justify-between items-center text-lg">
                                    <span className="font-semibold">Punctuation Errors:</span>
                                    <span className={`font-bold ${analysis.grammarAnalysis.hasPunctuationErrors ? 'text-red-600' : 'text-green-600'}`}>
                                        {analysis.grammarAnalysis.hasPunctuationErrors ? 'Yes' : 'No'}
                                    </span>
                                </div>
                                <div className="pt-4 border-t border-gray-300">
                                    <p className="font-semibold mb-2">Summary:</p>
                                    <p className="text-gray-700 text-md italic">{analysis.grammarAnalysis.summary}</p>
                                </div>
                            </div>
                        </div>
                        {analysis.structuralAnalysis && analysis.structuralAnalysis.length > 0 && (
                            <div>
                                <h2 className="text-2xl font-bold text-teal-600 mb-4">Structural Analysis:</h2>
                                <div className="bg-gray-200 p-6 rounded-xl space-y-4">
                                    {analysis.structuralAnalysis.map((structure, index) => (
                                        <div key={index} className="border-b border-gray-300 pb-4 last:border-b-0 last:pb-0">
                                            <p className="text-lg font-semibold text-gray-800 mb-1">{structure.type}: <span className="italic">{structure.text}</span></p>
                                            <p className="text-md text-gray-700">{structure.function}</p>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}
                    </div>
                )}
            </div>
        </div>
    );
};

export default App;
