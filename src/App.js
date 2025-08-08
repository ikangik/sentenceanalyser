import React, { useState } from 'react';

const App = () => {
    const [sentence, setSentence] = useState('');
    const [analysis, setAnalysis] = useState(null);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState('');

    // Built-in analysis function (updated)
    const analyzeSentence = (text) => {
        const words = text.trim().split(/\s+/).filter(word => word.length > 0);

        // Simple POS tagging based on common patterns (improved)
        const getPOS = (word, index, words) => {
            const lowerWord = word.toLowerCase().replace(/[.,!?;:"']/g, '');

            // Determiners
            if (['the', 'a', 'an', 'this', 'that', 'these', 'those', 'my', 'your', 'his', 'her', 'its', 'our', 'their'].includes(lowerWord)) {
                return 'Determiner';
            }

            // Pronouns
            if (['i', 'you', 'he', 'she', 'it', 'we', 'they', 'me', 'him', 'her', 'us', 'them', 'myself', 'yourself', 'himself', 'herself', 'itself', 'ourselves', 'themselves'].includes(lowerWord)) {
                return 'Pronoun';
            }

            // Prepositions
            if (['in', 'on', 'at', 'by', 'for', 'with', 'about', 'to', 'from', 'of', 'over', 'under', 'through', 'during', 'before', 'after', 'above', 'below', 'between', 'among'].includes(lowerWord)) {
                return 'Preposition';
            }

            // Conjunctions
            if (['and', 'but', 'or', 'nor', 'for', 'so', 'yet', 'because', 'although', 'while', 'since', 'if', 'unless', 'until'].includes(lowerWord)) {
                return 'Conjunction';
            }

            // Common auxiliary verbs
            if (['am', 'is', 'are', 'was', 'were', 'have', 'has', 'had', 'having', 'will', 'would', 'shall', 'should', 'may', 'might', 'can', 'could', 'must', 'ought', 'do', 'does', 'did'].includes(lowerWord)) {
                return 'Auxiliary Verb';
            }

            // Exclamations
            if (['hello', 'hi', 'hey', 'wow', 'oh', 'ah', 'ouch', 'hurray', 'alas'].includes(lowerWord)) {
                return 'Exclamation';
            }

            // Adverbs (e.g., quickly, happily)
            if (lowerWord.endsWith('ly')) {
                return 'Adverb';
            }

            // Adjectives (e.g., beautiful, useless)
            if (lowerWord.endsWith('ful') || lowerWord.endsWith('less') || lowerWord.endsWith('ous') || lowerWord.endsWith('able') || lowerWord.endsWith('ible')) {
                return 'Adjective';
            }

            // Verbs (basic ending detection - order matters)
            if (lowerWord.endsWith('ing') || lowerWord.endsWith('ed')) {
                return 'Verb';
            }

            // Check if it's likely a proper noun (capitalized and not at sentence start)
            if (word[0] === word[0].toUpperCase() && index > 0) {
                return 'Proper Noun';
            }

            // Default to Noun
            return 'Noun';
        };

        // POS Analysis
        const posAnalysis = words.map((word, index) => ({
            word: word,
            pos: getPOS(word, index, words)
        }));

        // Grammar Analysis (updated for better accuracy)
        const hasAuxiliary = words.some(word =>
            ['am', 'is', 'are', 'was', 'were', 'have', 'has', 'had', 'will', 'would', 'shall', 'should'].includes(word.toLowerCase())
        );

        const hasBy = text.toLowerCase().includes(' by ');
        const voice = hasAuxiliary && hasBy ? 'Passive' : 'Active';

        const isCompleteSentence = text.trim().length > 0 &&
            /[.!?]$/.test(text.trim()) &&
            words.length >= 2;

        const hasPunctuationErrors = !(/[.!?]$/.test(text.trim())) && text.trim().length > 0;

        let summary = "The sentence appears ";
        if (!isCompleteSentence) {
            summary += "to be incomplete or a fragment. ";
        } else {
            summary += "to be grammatically complete. ";
        }
        summary += `It uses ${voice.toLowerCase()} voice.`;
        if (hasPunctuationErrors) {
