<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Grammar Analysis Tool</title>
    <style>
        /* General styling for the whole page */
        * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
        }

        body {
            font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            min-height: 100vh;
            padding: 20px;
            display: flex;
            justify-content: center;
            align-items: flex-start;
        }

        .container {
            width: 100%;
            max-width: 1200px;
            background: rgba(255, 255, 255, 0.95);
            border-radius: 20px;
            backdrop-filter: blur(10px);
            box-shadow: 0 20px 40px rgba(0, 0, 0, 0.1);
            overflow: hidden;
        }

        .header {
            background: linear-gradient(135deg, #4f46e5, #7c3aed);
            color: white;
            text-align: center;
            padding: 30px 20px;
            position: relative;
            overflow: hidden;
        }

        .header::before {
            content: '';
            position: absolute;
            top: -50%;
            left: -50%;
            width: 200%;
            height: 200%;
            background: radial-gradient(circle, rgba(255,255,255,0.1) 0%, transparent 70%);
            animation: float 6s ease-in-out infinite;
        }

        @keyframes float {
            0%, 100% { transform: translate(-50%, -50%) rotate(0deg); }
            50% { transform: translate(-50%, -50%) rotate(180deg); }
        }

        .header h1 {
            font-size: 2.5rem;
            font-weight: 700;
            margin-bottom: 10px;
            position: relative;
            z-index: 1;
        }

        .header p {
            font-size: 1.1rem;
            opacity: 0.9;
            position: relative;
            z-index: 1;
        }

        .main-content {
            padding: 30px;
        }

        .input-section {
            margin-bottom: 30px;
        }

        .input-label {
            display: block;
            font-size: 1.1rem;
            font-weight: 600;
            color: #374151;
            margin-bottom: 10px;
        }

        .text-input {
            width: 100%;
            min-height: 150px;
            padding: 15px;
            border: 2px solid #e5e7eb;
            border-radius: 12px;
            font-size: 16px;
            font-family: inherit;
            resize: vertical;
            transition: all 0.3s ease;
            background: rgba(255, 255, 255, 0.8);
        }

        .text-input:focus {
            outline: none;
            border-color: #4f46e5;
            background: white;
            box-shadow: 0 0 0 3px rgba(79, 70, 229, 0.1);
        }

        .analyze-btn {
            background: linear-gradient(135deg, #10b981, #059669);
            color: white;
            border: none;
            padding: 15px 30px;
            font-size: 1.1rem;
            font-weight: 600;
            border-radius: 12px;
            cursor: pointer;
            transition: all 0.3s ease;
            display: block;
            margin: 20px auto 0;
            min-width: 200px;
        }

        .analyze-btn:hover {
            transform: translateY(-2px);
            box-shadow: 0 10px 25px rgba(16, 185, 129, 0.3);
        }

        .analyze-btn:disabled {
            opacity: 0.6;
            cursor: not-allowed;
            transform: none;
        }

        .results-grid {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(350px, 1fr));
            gap: 25px;
            margin-top: 30px;
        }

        .result-card {
            background: white;
            border-radius: 15px;
            padding: 25px;
            box-shadow: 0 8px 25px rgba(0, 0, 0, 0.1);
            border: 1px solid #f3f4f6;
            transition: all 0.3s ease;
        }

        .result-card:hover {
            transform: translateY(-5px);
            box-shadow: 0 15px 35px rgba(0, 0, 0, 0.15);
        }

        .card-title {
            font-size: 1.3rem;
            font-weight: 700;
            color: #1f2937;
            margin-bottom: 15px;
            display: flex;
            align-items: center;
            gap: 10px;
        }

        .card-icon {
            width: 24px;
            height: 24px;
            background: linear-gradient(135deg, #4f46e5, #7c3aed);
            border-radius: 50%;
            display: flex;
            align-items: center;
            justify-content: center;
            color: white;
            font-size: 12px;
            font-weight: bold;
        }
        
        .error-item, .suggestion-item {
            background: #fef2f2;
            border-left: 4px solid #ef4444;
            padding: 12px 15px;
            margin-bottom: 10px;
            border-radius: 8px;
        }

        .suggestion-item {
            background: #f0f9ff;
            border-left-color: #3b82f6;
        }

        .pos-tag {
            display: inline-block;
            padding: 4px 8px;
            margin: 2px;
            border-radius: 20px;
            font-size: 0.85rem;
            font-weight: 500;
        }

        .pos-noun { background: #dbeafe; color: #1e40af; }
        .pos-verb { background: #dcfce7; color: #166534; }
        .pos-adj { background: #fef3c7; color: #92400e; }
        .pos-adv { background: #f3e8ff; color: #7c2d12; }
        .pos-prep { background: #fce7f3; color: #be185d; }
        .pos-conj { background: #e0f2fe; color: #0c4a6e; }
        .pos-pron { background: #fff1f2; color: #be123c; }
        .pos-det { background: #f0fdf4; color: #15803d; }
        .pos-punct { background: #fafaf9; color: #57534e; }
        .pos-other { background: #f5f5f5; color: #6b7280; }

        .voice-indicator {
            padding: 8px 15px;
            border-radius: 25px;
            font-weight: 600;
            text-align: center;
            margin: 10px 0;
        }

        .voice-active {
            background: #d1fae5;
            color: #065f46;
        }

        .voice-passive {
            background: #fef3c7;
            color: #92400e;
        }

        .diagram-container {
            background: #f9fafb;
            border-radius: 10px;
            padding: 20px;
            margin: 15px 0;
            font-family: 'Courier New', monospace;
            font-size: 14px;
            overflow-x: auto;
            white-space: pre;
        }

        .sentence-text {
            background: #f3f4f6;
            padding: 15px;
            border-radius: 8px;
            margin-bottom: 15px;
            font-style: italic;
            border-left: 4px solid #6b7280;
        }

        .stats-grid {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(120px, 1fr));
            gap: 15px;
            margin: 15px 0;
        }

        .stat-item {
            text-align: center;
            padding: 15px;
            background: #f8fafc;
            border-radius: 10px;
            border: 1px solid #e2e8f0;
        }

        .stat-number {
            font-size: 2rem;
            font-weight: 700;
            color: #4f46e5;
        }

        .stat-label {
            font-size: 0.9rem;
            color: #6b7280;
            margin-top: 5px;
        }

        .loading {
            text-align: center;
            color: #6b7280;
            padding: 40px;
            font-size: 1.1rem;
        }

        .word-highlight {
            background: linear-gradient(120deg, #fbbf24 0%, #f59e0b 100%);
            padding: 2px 4px;
            border-radius: 4px;
            font-weight: 500;
        }

        .word-count {
            font-size: 0.9rem;
            color: #6b7280;
            text-align: right;
            margin-top: 8px;
            transition: color 0.3s ease;
        }

        .word-count.warning {
            color: #f59e0b;
            font-weight: 600;
        }

        .word-count.error {
            color: #dc2626;
            font-weight: 600;
        }

        @keyframes spin {
            0% { transform: rotate(0deg); }
            100% { transform: rotate(360deg); }
        }

        /* Modal for custom messages */
        .modal {
            position: fixed;
            z-index: 100;
            left: 0;
            top: 0;
            width: 100%;
            height: 100%;
            background-color: rgba(0, 0, 0, 0.4);
            display: flex;
            justify-content: center;
            align-items: center;
            visibility: hidden;
            opacity: 0;
            transition: visibility 0s, opacity 0.3s linear;
        }
        .modal.visible {
            visibility: visible;
            opacity: 1;
        }
        .modal-content {
            background-color: #fefefe;
            padding: 25px;
            border-radius: 15px;
            box-shadow: 0 5px 15px rgba(0,0,0,0.3);
            text-align: center;
            max-width: 400px;
            position: relative;
            animation: fadeIn 0.3s ease-out;
        }
        .modal-message {
            margin-bottom: 20px;
            font-size: 1.1rem;
            line-height: 1.5;
            color: #374151;
        }
        .modal-btn {
            background-color: #4f46e5;
            color: white;
            border: none;
            padding: 10px 20px;
            border-radius: 8px;
            cursor: pointer;
            transition: background-color 0.3s ease;
        }
        .modal-btn:hover {
            background-color: #6366f1;
        }
        @keyframes fadeIn {
            from { transform: scale(0.9); opacity: 0; }
            to { transform: scale(1); opacity: 1; }
        }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <h1>Grammar Analysis Tool</h1>
            <p>Comprehensive grammar, spelling, and sentence analysis</p>
        </div>

        <div class="main-content">
            <div class="input-section">
                <label for="textInput" class="input-label">Enter your text for analysis:</label>
                <textarea
                    id="textInput"
                    class="text-input"
                    placeholder="Type or paste your text here (maximum 60 words)..."
                    maxlength="500"
                ></textarea>
                <div id="wordCount" class="word-count">0 / 60 words</div>
                <button id="analyzeBtn" class="analyze-btn">Analyze Text</button>
            </div>

            <div id="results" class="results-grid" style="display: none;"></div>
            <div id="loading" class="loading" style="display: none;">
                Analyzing your text...
            </div>
        </div>
    </div>

    <!-- Custom Modal for Messages -->
    <div id="messageModal" class="modal">
        <div class="modal-content">
            <p id="modalMessage" class="modal-message"></p>
            <button id="modalCloseBtn" class="modal-btn">OK</button>
        </div>
    </div>

    <script>
        /**
         * The main logic for analyzing text, including spelling, grammar, and parts of speech.
         * Note: This is a simplified analysis for demonstration. A real tool would use
         * a more robust natural language processing (NLP) library.
         */
        class GrammarAnalyzer {
            constructor() {
                // A very basic set of regex patterns for parts of speech detection
                this.posPatterns = {
                    noun: /\b(cat|dog|house|car|book|person|man|woman|child|tree|water|time|day|year|way|life|work|world|school|family|friend|home|place|thing|people|group|problem|fact|hand|eye|week|month|system|program|question|government|company|number|part|area|case|point|word|right|service|money|lot|business|state|job|name|information|story|student|night|study|game|music|country|side|food|head|mother|father|power|hour|room|community|research|door|health|heart|history|level|security|art|idea|war|type|kind|form|line|law|policy|development|light|city|action|interest|mind|decision|market|control|rate|technology|body|quality|education|society|media|officer|member|reason|space|nature|call|event|language|data|paper|economy|structure|environment|crime|energy|region|street|project|series|defense|relationship|force|opportunity|construction|message|culture|management|practice|pattern|animal|age|leader|performance|process|issue|building|material|trial|subject|color|knowledge|impact|activity|image|ground|application|position|attention|resource|organization|player|conference|plant|benefit|page|approach|loss|value|property|product|analysis|customer|employee|participant|response|purpose|basis|movement|discussion|concept|treatment|option|production|support|future|choice|technology|challenge|population|term|detail|growth|industry|character|success|difference|century|price|training|rule|committee|hospital|report|content|visit|budget|commission|phase|transition|budget|conflict|requirement|outcome|standard|partnership|capacity|equipment|agreement|function|recognition|structure|task|tool|order|evidence|goal|measure|network|unit|appearance|crisis|strategy|asset|context|environment|aspect|tradition|direction)s?\b/gi,
                    verb: /\b(is|am|are|was|were|be|being|been|have|has|had|do|does|did|will|would|could|should|might|may|can|must|shall|go|goes|went|gone|going|make|makes|made|making|take|takes|took|taken|taking|come|comes|came|coming|see|sees|saw|seen|seeing|get|gets|got|gotten|getting|know|knows|knew|known|knowing|think|thinks|thought|thinking|look|looks|looked|looking|use|uses|used|using|find|finds|found|finding|give|gives|gave|given|giving|tell|tells|told|telling|work|works|worked|working|call|calls|called|calling|try|tries|tried|trying|ask|asks|asked|asking|turn|turns|turned|turning|move|moves|moved|moving|live|lives|lived|living|believe|believes|believed|believing|hold|holds|held|holding|bring|brings|brought|bringing|happen|happens|happened|happening|write|writes|wrote|written|writing|provide|provides|provided|providing|sit|sits|sat|sitting|stand|stands|stood|standing|lose|loses|lost|losing|pay|pays|paid|paying|meet|meets|met|meeting|include|includes|included|including|continue|continues|continued|continuing|set|sets|setting|consider|considers|considered|considering|appear|appears|appeared|appearing|create|creates|created|creating|speak|speaks|spoke|spoken|speaking|read|reads|reading|allow|allows|allowed|allowing|add|adds|added|adding|spend|spends|spent|spending|grow|grows|grew|grown|growing|open|opens|opened|opening|walk|walks|walked|walking|win|wins|won|winning|offer|offers|offered|offering|remember|remembers|remembered|remembering|love|loves|loved|loving|stop|stops|stopped|stopping|carry|carries|carried|carrying|talk|talks|talked|talking|appear|appears|appeared|appearing)\b/gi,
                    adjective: /\b(good|great|new|first|last|long|small|large|big|little|high|low|old|young|early|late|important|public|bad|different|able|right|social|hard|local|far|difficult|available|likely|free|strong|sure|clear|white|black|red|blue|green|yellow|hot|cold|dark|light|happy|sad|angry|excited|tired|busy|quiet|loud|fast|slow|easy|ready|nice|fine|clean|dirty|full|empty|open|close|rich|poor|sick|healthy|safe|dangerous|serious|funny|pretty|ugly|smart|stupid|kind|mean|friendly|rude|careful|careless|patient|nervous|calm|worried|surprised|interested|boring|exciting|amazing|terrible|wonderful|beautiful|awful|perfect|real|true|false|possible|impossible|certain|special|normal|strange|familiar|foreign|popular|famous|common|rare|similar|different|equal|fair|unfair)er?|est?\b/gi,
                    adverb: /\b(very|really|quite|rather|pretty|so|too|enough|almost|nearly|just|only|even|still|yet|already|always|usually|often|sometimes|never|here|there|now|then|today|tomorrow|yesterday|up|down|in|out|on|off|over|under|through|across|along|around|before|after|during|while|since|until|again|also|however|therefore|thus|maybe|perhaps|probably|certainly|definitely|absolutely|completely|totally|entirely|partly|mostly|mainly|especially|particularly|generally|usually|actually|really|truly|clearly|obviously|apparently|possibly|likely|quickly|slowly|carefully|suddenly|immediately|soon|late|early|well|badly|hard|easily|simply|directly|exactly|perfectly|completely|fully|hardly|scarcely|barely|nearly|almost|quite|rather|pretty|very|extremely|incredibly|amazingly|surprisingly|unfortunately|luckily|hopefully|honestly|seriously|obviously|clearly|apparently)ly?\b/gi,
                    preposition: /\b(in|on|at|by|for|with|without|to|from|of|about|over|under|through|across|along|around|between|among|during|before|after|since|until|within|beyond|against|toward|towards|upon|beneath|above|below|inside|outside|beside|behind|ahead|throughout|despite|except|including|excluding|regarding|concerning|according)\b/gi,
                    conjunction: /\b(and|or|but|so|yet|for|nor|because|since|as|if|unless|although|though|while|when|where|whereas|however|therefore|thus|moreover|furthermore|nevertheless|nonetheless|meanwhile|consequently|accordingly|hence|likewise|otherwise|instead|rather|besides|additionally|similarly|conversely|specifically|particularly|especially|notably|indeed|certainly|obviously|clearly|unfortunately|fortunately|surprisingly|interestingly)\b/gi,
                    pronoun: /\b(I|me|my|mine|myself|you|your|yours|yourself|he|him|his|himself|she|her|hers|herself|it|its|itself|we|us|our|ours|ourselves|they|them|their|theirs|themselves|this|that|these|those|who|whom|whose|which|what|whoever|whomever|whatever|whichever|everyone|everybody|everything|someone|somebody|something|anyone|anybody|anything|no one|nobody|nothing|each|every|either|neither|both|all|some|any|many|much|few|little|several|one|two|three)\b/gi,
                    determiner: /\b(the|a|an|this|that|these|those|my|your|his|her|its|our|their|some|any|no|every|each|either|neither|much|many|few|little|several|all|both|half|double|such)\b/gi
                };

                // Common misspellings and their corrections (with a focus on Australian English)
                this.commonMisspellings = {
                    'color': 'colour',
                    'honor': 'honour',
                    'favor': 'favour',
                    'labor': 'labour',
                    'neighbor': 'neighbour',
                    'center': 'centre',
                    'theater': 'theatre',
                    'liter': 'litre',
                    'meter': 'metre',
                    'fiber': 'fibre',
                    'organize': 'organise',
                    'realize': 'realise',
                    'recognize': 'recognise',
                    'analyze': 'analyse',
                    'paralyze': 'paralyse',
                    'defense': 'defence',
                    'offense': 'offence',
                    'license': 'licence', // when used as noun
                    'practice': 'practise', // when used as verb
                    'traveling': 'travelling',
                    'canceled': 'cancelled',
                    'modeling': 'modelling',
                    'leveling': 'levelling',
                    'councilor': 'councillor',
                    'counselor': 'counsellor',
                    'mold': 'mould',
                    'smolder': 'smoulder',
                    'gray': 'grey',
                    'pajamas': 'pyjamas',
                    'tire': 'tyre', // wheel
                    'curb': 'kerb', // street edge
                    'story': 'storey', // building level
                    'check': 'cheque', // bank payment
                    'recieve': 'receive',
                    'seperate': 'separate',
                    'definately': 'definitely',
                    'occured': 'occurred',
                    'necesary': 'necessary',
                    'accomodate': 'accommodate',
                    'tommorrow': 'tomorrow',
                    'begining': 'beginning',
                    'writting': 'writing',
                    'existance': 'existence',
                    'refering': 'referring',
                    'occurence': 'occurrence',
                    'independant': 'independent',
                    'goverment': 'government',
                    'enviroment': 'environment',
                    'beleive': 'believe',
                    'reccommend': 'recommend',
                    'embarass': 'embarrass',
                    'calender': 'calendar'
                };

                // Verbs that indicate a passive voice construction
                this.passiveIndicators = [
                    'was', 'were', 'is', 'are', 'been', 'being', 'be'
                ];
            }

            /**
             * Main function to analyze the provided text.
             * @param {string} text The text to be analyzed.
             * @returns {object} An object containing all analysis results.
             */
            analyze(text) {
                if (!text.trim()) return null;

                const wordCount = this.countWords(text);
                if (wordCount > 60) {
                    throw new Error(`Text exceeds 60-word limit. Current count: ${wordCount} words.`);
                }

                const sentences = this.splitIntoSentences(text);
                const results = {
                    originalText: text,
                    wordCount: wordCount,
                    sentences: sentences,
                    spelling: this.checkSpelling(text),
                    grammar: this.checkGrammar(text),
                    partsOfSpeech: this.identifyPartsOfSpeech(text),
                    voiceAnalysis: this.analyzeVoice(sentences),
                    sentenceDiagrams: this.createSentenceDiagrams(sentences),
                    statistics: this.generateStatistics(text, sentences)
                };

                return results;
            }

            /**
             * Counts the number of words in a given text.
             * @param {string} text The text to count words in.
             * @returns {number} The number of words.
             */
            countWords(text) {
                return (text.match(/\b[\w']+\b/g) || []).length;
            }

            /**
             * Splits text into individual sentences based on punctuation.
             * @param {string} text The text to split.
             * @returns {string[]} An array of sentences.
             */
            splitIntoSentences(text) {
                return text.match(/[^\.!?]+[\.!?]+/g) || [text];
            }

            /**
             * Checks the text for common misspellings defined in the dictionary.
             * @param {string} text The text to check.
             * @returns {object[]} An array of spelling errors found.
             */
            checkSpelling(text) {
                const errors = [];
                const words = text.toLowerCase().match(/\b[a-z]+\b/g) || [];
                
                words.forEach((word, index) => {
                    if (this.commonMisspellings[word]) {
                        errors.push({
                            word: word,
                            suggestion: this.commonMisspellings[word],
                            position: index,
                            type: 'spelling'
                        });
                    }
                });

                return errors;
            }

            /**
             * Performs a basic grammar check for issues like double spaces and capitalization.
             * @param {string} text The text to check.
             * @returns {object[]} An array of grammar errors found.
             */
            checkGrammar(text) {
                const errors = [];
                
                // Check for double spaces
                if (text.includes('  ')) {
                    errors.push({
                        error: 'Multiple spaces found',
                        suggestion: 'Use single spaces between words',
                        type: 'spacing'
                    });
                }

                // Check for missing capitalization at sentence start
                const sentences = this.splitIntoSentences(text);
                sentences.forEach((sentence, index) => {
                    const trimmed = sentence.trim();
                    if (trimmed.length > 0 && trimmed[0] !== trimmed[0].toUpperCase()) {
                        errors.push({
                            error: `Sentence ${index + 1} should start with a capital letter`,
                            suggestion: `Capitalize the first letter: "${trimmed[0].toUpperCase()}${trimmed.slice(1)}"`,
                            type: 'capitalization'
                        });
                    }
                });

                // Check for comma splices (basic check)
                text.split(/[.!?]/).forEach((sentence, index) => {
                    const commaCount = (sentence.match(/,/g) || []).length;
                    const conjunctions = (sentence.match(/\b(and|or|but|so)\b/g) || []).length;
                    if (commaCount > conjunctions + 1) {
                        errors.push({
                            error: `Possible comma splice in sentence ${index + 1}`,
                            suggestion: 'Consider using semicolons or splitting into separate sentences',
                            type: 'punctuation'
                        });
                    }
                });

                return errors;
            }

            /**
             * Identifies parts of speech for each word using a simple regex-based approach.
             * @param {string} text The text to analyze.
             * @returns {object[]} An array of objects with word and part of speech.
             */
            identifyPartsOfSpeech(text) {
                const words = text.match(/\b[\w']+\b/g) || [];
                const posResults = [];

                words.forEach(word => {
                    const lowerWord = word.toLowerCase();
                    let pos = 'other';
                    let posClass = 'pos-other';

                    for (const [partOfSpeech, pattern] of Object.entries(this.posPatterns)) {
                        if (pattern.test(lowerWord)) {
                            pos = partOfSpeech;
                            posClass = `pos-${partOfSpeech.substring(0, 4)}`;
                            break;
                        }
                    }

                    if (/^[^\w\s]+$/.test(word)) {
                        pos = 'punctuation';
                        posClass = 'pos-punct';
                    }

                    posResults.push({
                        word: word,
                        pos: pos,
                        class: posClass
                    });
                });

                return posResults;
            }

            /**
             * Analyzes each sentence to determine if it's in an active or passive voice.
             * This is a very simplified check.
             * @param {string[]} sentences An array of sentences.
             * @returns {object[]} An array of objects with sentence and voice type.
             */
            analyzeVoice(sentences) {
                return sentences.map((sentence, index) => {
                    const words = sentence.toLowerCase().match(/\b\w+\b/g) || [];
                    const hasPassiveIndicator = words.some(word =>
                        this.passiveIndicators.includes(word)
                    );
                    
                    const hasPastParticiple = words.some(word =>
                        word.endsWith('ed') || word.endsWith('en') || word.endsWith('n')
                    );

                    const isPassive = hasPassiveIndicator && hasPastParticiple;

                    return {
                        sentence: sentence.trim(),
                        voice: isPassive ? 'passive' : 'active',
                        confidence: isPassive ? 0.8 : 0.9,
                        explanation: isPassive ?
                            'Contains auxiliary verb + past participle pattern' :
                            'Subject performs the action directly'
                    };
                });
            }

            /**
             * Creates a very simple sentence diagram for each sentence.
             * @param {string[]} sentences An array of sentences.
             * @returns {object[]} An array of objects with the sentence and its diagram.
             */
            createSentenceDiagrams(sentences) {
                return sentences.map((sentence, index) => {
                    const words = sentence.trim().match(/\b[\w']+\b/g) || [];
                    if (words.length === 0) return null;

                    const subject = words[0] || 'Subject';
                    let verb = 'verb';
                    let object = '';

                    for (let i = 1; i < words.length; i++) {
                        if (this.posPatterns.verb.test(words[i].toLowerCase())) {
                            verb = words[i];
                            if (i + 1 < words.length) {
                                object = words.slice(i + 1).join(' ');
                            }
                            break;
                        }
                    }

                    const diagram = this.generateDiagramText(subject, verb, object);

                    return {
                        sentence: sentence.trim(),
                        diagram: diagram,
                        components: {
                            subject: subject,
                            verb: verb,
                            object: object || 'none'
                        }
                    };
                });
            }

            /**
             * Generates the ASCII art for a simple sentence diagram.
             * @param {string} subject The subject of the sentence.
             * @param {string} verb The verb of the sentence.
             * @param {string} object The object of the sentence.
             * @returns {string} The ASCII diagram.
             */
            generateDiagramText(subject, verb, object) {
                if (object) {
                    return `
    ${subject}
        |
    ___${verb}___
        |
    ${object}`;
                } else {
                    return `
    ${subject}
        |
    ${verb}`;
                }
            }

            /**
             * Generates various statistics about the text.
             * @param {string} text The full text.
             * @param {string[]} sentences An array of sentences.
             * @returns {object} An object containing all the statistics.
             */
            generateStatistics(text, sentences) {
                const words = text.match(/\b[\w']+\b/g) || [];
                const characters = text.length;
                const charactersNoSpaces = text.replace(/\s/g, '').length;
                const paragraphs = text.split(/\n\s*\n/).filter(p => p.trim()).length || 1;
                
                const avgWordsPerSentence = sentences.length > 0 ?
                    Math.round(words.length / sentences.length * 10) / 10 : 0;
                
                const avgCharsPerWord = words.length > 0 ?
                    Math.round(charactersNoSpaces / words.length * 10) / 10 : 0;

                return {
                    characters: characters,
                    charactersNoSpaces: charactersNoSpaces,
                    words: words.length,
                    sentences: sentences.length,
                    paragraphs: paragraphs,
                    avgWordsPerSentence: avgWordsPerSentence,
                    avgCharsPerWord: avgCharsPerWord
                };
            }
        }

        /**
         * Manages the user interface and interactions for the Grammar Analysis Tool.
         */
        class GrammarAnalyzerUI {
            constructor() {
                this.analyzer = new GrammarAnalyzer();
                this.initializeEventListeners();
            }

            initializeEventListeners() {
                const analyzeBtn = document.getElementById('analyzeBtn');
                const textInput = document.getElementById('textInput');
                const modalCloseBtn = document.getElementById('modalCloseBtn');

                // Real-time word counting
                textInput.addEventListener('input', () => {
                    this.updateWordCount();
                });

                analyzeBtn.addEventListener('click', () => {
                    this.analyzeText();
                });

                textInput.addEventListener('keypress', (e) => {
                    if (e.ctrlKey && e.key === 'Enter') {
                        this.analyzeText();
                    }
                });

                modalCloseBtn.addEventListener('click', () => {
                    this.hideModal();
                });

                // Add some sample text for demonstration
                textInput.value = "This is a sample sentence to test the grammar analyser. There are some deliberate mistakes here. The book was read by the student yesterday. We organised the event at the centre.";
                this.updateWordCount();
            }

            /**
             * Updates the word count display and applies styling based on the count.
             */
            updateWordCount() {
                const textInput = document.getElementById('textInput');
                const wordCountElement = document.getElementById('wordCount');
                const text = textInput.value.trim();
                const wordCount = this.analyzer.countWords(text);
                
                wordCountElement.textContent = `${wordCount} / 60 words`;
                
                wordCountElement.classList.remove('warning', 'error');
                if (wordCount > 60) {
                    wordCountElement.classList.add('error');
                } else if (wordCount > 50) {
                    wordCountElement.classList.add('warning');
                }
            }

            /**
             * Initiates the text analysis process.
             */
            async analyzeText() {
                const textInput = document.getElementById('textInput');
                const text = textInput.value.trim();
                
                if (!text) {
                    this.showMessage('Please enter some text to analyse.');
                    return;
                }

                const wordCount = this.analyzer.countWords(text);
                if (wordCount > 60) {
                    this.showMessage(`Text exceeds 60-word limit. Please reduce to 60 words or fewer. Current count: ${wordCount} words.`);
                    return;
                }

                this.showLoading(true);
                
                try {
                    // Simulate processing time for better UX
                    await new Promise(resolve => setTimeout(resolve, 1000));
                    
                    const results = this.analyzer.analyze(text);
                    this.displayResults(results);
                } catch (error) {
                    this.showMessage(error.message);
                } finally {
                    this.showLoading(false);
                }
            }

            /**
             * Shows or hides the loading indicator.
             * @param {boolean} show True to show, false to hide.
             */
            showLoading(show) {
                const loading = document.getElementById('loading');
                const results = document.getElementById('results');
                const analyzeBtn = document.getElementById('analyzeBtn');

                loading.style.display = show ? 'block' : 'none';
                results.style.display = show ? 'none' : 'grid';
                analyzeBtn.disabled = show;
            }

            /**
             * Displays a custom modal message.
             * @param {string} message The message to display.
             */
            showMessage(message) {
                const modal = document.getElementById('messageModal');
                const modalMessage = document.getElementById('modalMessage');
                modalMessage.textContent = message;
                modal.classList.add('visible');
            }

            /**
             * Hides the custom modal.
             */
            hideModal() {
                const modal = document.getElementById('messageModal');
                modal.classList.remove('visible');
            }

            /**
             * Clears the results and displays new ones in the grid.
             * @param {object} results The analysis results object.
             */
            displayResults(results) {
                const resultsContainer = document.getElementById('results');
                resultsContainer.innerHTML = '';

                if (!results) return;

                // Statistics Card
                resultsContainer.appendChild(this.createStatisticsCard(results.statistics));

                // Spelling Errors Card
                resultsContainer.appendChild(this.createSpellingCard(results.spelling));

                // Grammar Issues Card
                resultsContainer.appendChild(this.createGrammarCard(results.grammar));

                // Parts of Speech Card
                resultsContainer.appendChild(this.createPartsOfSpeechCard(results.partsOfSpeech));

                // Voice Analysis Card
                resultsContainer.appendChild(this.createVoiceAnalysisCard(results.voiceAnalysis));

                // Sentence Diagrams Card
                resultsContainer.appendChild(this.createSentenceDiagramsCard(results.sentenceDiagrams));
            }

            /**
             * Creates the HTML element for the statistics card.
             * @param {object} stats The statistics data.
             * @returns {HTMLElement} The statistics card element.
             */
            createStatisticsCard(stats) {
                const card = document.createElement('div');
                card.className = 'result-card';
                card.innerHTML = `
                    <h3 class="card-title"><div class="card-icon">#</div>Text Statistics</h3>
                    <div class="stats-grid">
                        <div class="stat-item">
                            <div class="stat-number">${stats.words}</div>
                            <div class="stat-label">Words</div>
                        </div>
                        <div class="stat-item">
                            <div class="stat-number">${stats.sentences}</div>
                            <div class="stat-label">Sentences</div>
                        </div>
                        <div class="stat-item">
                            <div class="stat-number">${stats.paragraphs}</div>
                            <div class="stat-label">Paragraphs</div>
                        </div>
                        <div class="stat-item">
                            <div class="stat-number">${stats.avgWordsPerSentence}</div>
                            <div class="stat-label">Avg. words/sentence</div>
                        </div>
                        <div class="stat-item">
                            <div class="stat-number">${stats.avgCharsPerWord}</div>
                            <div class="stat-label">Avg. chars/word</div>
                        </div>
                        <div class="stat-item">
                            <div class="stat-number">${stats.characters}</div>
                            <div class="stat-label">Characters</div>
                        </div>
                    </div>
                `;
                return card;
            }

            /**
             * Creates the HTML element for the spelling card.
             * @param {object[]} errors The spelling error data.
             * @returns {HTMLElement} The spelling card element.
             */
            createSpellingCard(errors) {
                const card = document.createElement('div');
                card.className = 'result-card';
                let content = `<h3 class="card-title"><div class="card-icon">!</div>Spelling Suggestions</h3>`;
                if (errors.length === 0) {
                    content += `<p>No common spelling issues found.</p>`;
                } else {
                    errors.forEach(error => {
                        content += `<div class="error-item">
                            <span>Found: <strong>${error.word}</strong></span>,
                            <span>Suggestion: <strong>${error.suggestion}</strong></span>
                        </div>`;
                    });
                }
                card.innerHTML = content;
                return card;
            }

            /**
             * Creates the HTML element for the grammar card.
             * @param {object[]} errors The grammar error data.
             * @returns {HTMLElement} The grammar card element.
             */
            createGrammarCard(errors) {
                const card = document.createElement('div');
                card.className = 'result-card';
                let content = `<h3 class="card-title"><div class="card-icon">G</div>Grammar & Punctuation</h3>`;
                if (errors.length === 0) {
                    content += `<p>No basic grammar issues found.</p>`;
                } else {
                    errors.forEach(error => {
                        content += `<div class="error-item">
                            <span>${error.error}</span>.
                            <span>Suggestion: <strong>${error.suggestion}</strong></span>
                        </div>`;
                    });
                }
                card.innerHTML = content;
                return card;
            }

            /**
             * Creates the HTML element for the parts of speech card.
             * @param {object[]} posData The parts of speech data.
             * @returns {HTMLElement} The parts of speech card element.
             */
            createPartsOfSpeechCard(posData) {
                const card = document.createElement('div');
                card.className = 'result-card';
                let content = `<h3 class="card-title"><div class="card-icon">P</div>Parts of Speech</h3><p>Click on a word to see its part of speech.</p>`;
                
                posData.forEach(item => {
                    content += `<span class="pos-tag ${item.class}">${item.word} (${item.pos.charAt(0).toUpperCase()})</span> `;
                });
                card.innerHTML = content;
                return card;
            }

            /**
             * Creates the HTML element for the voice analysis card.
             * @param {object[]} voiceData The voice analysis data.
             * @returns {HTMLElement} The voice analysis card element.
             */
            createVoiceAnalysisCard(voiceData) {
                const card = document.createElement('div');
                card.className = 'result-card';
                let content = `<h3 class="card-title"><div class="card-icon">V</div>Voice Analysis</h3>`;

                voiceData.forEach(item => {
                    const voiceClass = item.voice === 'active' ? 'voice-active' : 'voice-passive';
                    content += `<div class="voice-indicator ${voiceClass}">
                        ${item.sentence} - ${item.voice.charAt(0).toUpperCase() + item.voice.slice(1)} voice
                    </div>`;
                });
                card.innerHTML = content;
                return card;
            }

            /**
             * Creates the HTML element for the sentence diagrams card.
             * @param {object[]} diagrams The sentence diagram data.
             * @returns {HTMLElement} The sentence diagrams card element.
             */
            createSentenceDiagramsCard(diagrams) {
                const card = document.createElement('div');
                card.className = 'result-card';
                let content = `<h3 class="card-title"><div class="card-icon">S</div>Sentence Diagrams</h3>`;

                diagrams.forEach(item => {
                    if (item) {
                        content += `<div class="sentence-text">${item.sentence}</div>`;
                        content += `<div class="diagram-container">${item.diagram}</div>`;
                    }
                });
                card.innerHTML = content;
                return card;
            }
        }

        // Initialize the UI on window load
        window.onload = function() {
            new GrammarAnalyzerUI();
        };
    </script>
</body>
</html>
