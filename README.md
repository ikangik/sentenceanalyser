
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Grammar Analysis Tool</title>
    <style>
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
        }

        .container {
            max-width: 1200px;
            margin: 0 auto;
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

        @keyframes spin {
            0% { transform: rotate(0deg); }
            100% { transform: rotate(360deg); }
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
                ></textarea>
                <div id="wordCount" class="word-count">0 / 60 words</div>
                <button id="analyzeBtn" class="analyze-btn">Analyze Text</button>
            </div>

            <div id="results" class="results-grid" style="display: none;"></div>
            <div id="loading" class="loading" style="display: none;">Analyzing your text...</div>
        </div>
    </div>

    <script>
        class GrammarAnalyzer {
            constructor() {
                // A simplified, static list of words for parts of speech.
                // This approach is limited and may not correctly classify all words in all contexts.
                // For a more robust solution, a proper natural language processing (NLP) library or API would be required.
                this.posPatterns = {
                    verb: /\b(is|am|are|was|were|be|being|been|have|has|had|do|does|did|will|would|could|should|might|may|can|must|shall|go|make|take|come|see|get|know|think|look|use|find|give|tell|work|call|try|ask|turn|move|live|believe|hold|bring|happen|write|provide|sit|stand|lose|pay|meet|include|continue|set|consider|appear|create|speak|read|allow|add|spend|grow|open|walk|win|offer|remember|love|stop|carry|talk|run|say|want|need|feel|show|put|begin|keep|let|help|start|turn|like|start|mean|play|write|run|move|live|believe|happen|meet)s?|ed|ing|en|t\b/gi,
                    noun: /\b(cat|dog|house|car|book|person|man|woman|child|tree|water|time|day|year|way|life|work|world|school|family|friend|home|place|thing|people|group|problem|fact|hand|eye|week|month|system|program|question|government|company|number|part|area|case|point|word|right|service|money|lot|business|state|job|name|information|story|student|night|study|game|music|country|side|food|head|mother|father|power|hour|room|community|research|door|health|heart|history|level|security|art|idea|war|type|kind|form|line|law|policy|development|light|city|action|interest|mind|decision|market|control|rate|technology|body|quality|education|society|media|officer|member|reason|space|nature|call|event|language|data|paper|economy|structure|environment|crime|energy|region|street|project|series|defense|relationship|force|opportunity|construction|message|culture|management|practice|pattern|animal|age|leader|performance|process|issue|building|material|trial|subject|color|knowledge|impact|activity|image|ground|application|position|attention|resource|organization|player|conference|plant|benefit|page|approach|loss|value|property|product|analysis|customer|employee|participant|response|purpose|basis|movement|discussion|concept|treatment|option|production|support|future|choice|challenge|population|term|detail|growth|industry|character|success|difference|century|price|training|rule|committee|hospital|report|content|visit|budget|commission|phase|transition|budget|conflict|requirement|outcome|standard|partnership|capacity|equipment|agreement|function|recognition|structure|task|tool|order|evidence|goal|measure|network|unit|appearance|crisis|strategy|asset|context|environment|aspect|tradition|direction)s?\b/gi,
                    adjective: /\b(good|great|new|first|last|long|small|large|big|little|high|low|old|young|early|late|important|public|bad|different|able|right|social|hard|local|far|difficult|available|likely|free|strong|sure|clear|white|black|red|blue|green|yellow|hot|cold|dark|light|happy|sad|angry|excited|tired|busy|quiet|loud|fast|slow|easy|ready|nice|fine|clean|dirty|full|empty|open|close|rich|poor|sick|healthy|safe|dangerous|serious|funny|pretty|ugly|smart|stupid|kind|mean|friendly|rude|careful|careless|patient|nervous|calm|worried|surprised|interested|boring|exciting|amazing|terrible|wonderful|beautiful|awful|perfect|real|true|false|possible|impossible|certain|special|normal|strange|familiar|foreign|popular|famous|common|rare|similar|different|equal|fair|unfair)er?|est?\b/gi,
                    adverb: /\b(very|really|quite|rather|pretty|so|too|enough|almost|nearly|just|only|even|still|yet|already|always|usually|often|sometimes|never|here|there|now|then|today|tomorrow|yesterday|up|down|in|out|on|off|over|under|through|across|along|around|before|after|during|while|since|until|again|also|however|therefore|thus|maybe|perhaps|probably|certainly|definitely|absolutely|completely|totally|entirely|partly|mostly|mainly|especially|particularly|generally|usually|actually|really|truly|clearly|obviously|apparently|possibly|likely|quickly|slowly|carefully|suddenly|immediately|soon|late|early|well|badly|hard|easily|simply|directly|exactly|perfectly|completely|fully|hardly|scarcely|barely|nearly|almost|quite|rather|pretty|very|extremely|incredibly|amazingly|surprisingly|unfortunately|luckily|hopefully|honestly|seriously|obviously|clearly|apparently)ly?\b/gi,
                    preposition: /\b(in|on|at|by|for|with|without|to|from|of|about|over|under|through|across|along|around|between|among|during|before|after|since|until|within|beyond|against|toward|towards|upon|beneath|above|below|inside|outside|beside|behind|ahead|throughout|despite|except|including|excluding|regarding|concerning|according)\b/gi,
                    conjunction: /\b(and|or|but|so|yet|for|nor|because|since|as|if|unless|although|though|while|when|where|whereas|however|therefore|thus|moreover|furthermore|nevertheless|nonetheless|meanwhile|consequently|accordingly|hence|likewise|otherwise|instead|rather|besides|additionally|similarly|conversely|specifically|particularly|especially|notably|indeed|certainly|obviously|clearly|unfortunately|fortunately|surprisingly|interestingly)\b/gi,
                    pronoun: /\b(I|me|my|mine|myself|you|your|yours|yourself|he|him|his|himself|she|her|hers|herself|it|its|itself|we|us|our|ours|ourselves|they|them|their|theirs|themselves|this|that|these|those|who|whom|whose|which|what|whoever|whomever|whatever|whichever|everyone|everybody|everything|someone|somebody|something|anyone|anybody|anything|no one|nobody|nothing|each|every|either|neither|both|all|some|any|many|much|few|little|several|one|two|three)\b/gi,
                    determiner: /\b(the|a|an|this|that|these|those|my|your|his|her|its|our|their|some|any|no|every|each|either|neither|much|many|few|little|several|all|both|half|double|such)\b/gi
                };

                this.commonMisspellings = {
                    'color': 'colour', 'honor': 'honour', 'favor': 'favour', 'labor': 'labour', 'neighbor': 'neighbour',
                    'center': 'centre', 'theater': 'theatre', 'liter': 'litre', 'meter': 'metre', 'fiber': 'fibre',
                    'organize': 'organise', 'realize': 'realise', 'recognize': 'recognise', 'analyze': 'analyse', 'paralyze': 'paralyse',
                    'defense': 'defence', 'offense': 'offence', 'license': 'licence', 'practice': 'practise', 'traveling': 'travelling',
                    'canceled': 'cancelled', 'modeling': 'modelling', 'leveling': 'levelling', 'councilor': 'councillor',
                    'counselor': 'counsellor', 'mold': 'mould', 'smolder': 'smoulder', 'gray': 'grey', 'pajamas': 'pyjamas',
                    'tire': 'tyre', 'curb': 'kerb', 'story': 'storey', 'check': 'cheque', 'recieve': 'receive',
                    'seperate': 'separate', 'definately': 'definitely', 'occured': 'occurred', 'necesary': 'necessary',
                    'accomodate': 'accommodate', 'tommorrow': 'tomorrow', 'begining': 'beginning', 'writting': 'writing',
                    'existance': 'existence', 'refering': 'referring', 'occurence': 'occurrence', 'independant': 'independent',
                    'goverment': 'government', 'enviroment': 'environment', 'beleive': 'believe', 'reccommend': 'recommend',
                    'embarass': 'embarrass', 'calender': 'calendar',
                };

                this.irregularPastParticiples = [
                    'done', 'given', 'read', 'taken', 'made', 'written', 'seen', 'found', 'met', 'bought', 'thought', 'spoken'
                ];
            }

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

            countWords(text) {
                return (text.match(/\b[\w']+\b/g) || []).length;
            }

            splitIntoSentences(text) {
                return text.match(/[^\.!?]+[\.!?]+/g) || [text];
            }

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

            checkGrammar(text) {
                const errors = [];
                
                if (text.includes('  ')) {
                    errors.push({
                        error: 'Multiple spaces found',
                        suggestion: 'Use single spaces between words',
                        type: 'spacing'
                    });
                }

                const sentences = this.splitIntoSentences(text);
                sentences.forEach((sentence, index) => {
                    const trimmed = sentence.trim();
                    if (trimmed.length > 0 && trimmed[0] !== trimmed[0].toUpperCase() && trimmed[0].match(/[a-z]/i)) {
                        errors.push({
                            error: `Sentence ${index + 1} should start with a capital letter`,
                            suggestion: `Capitalize the first letter: "${trimmed[0].toUpperCase()}${trimmed.slice(1)}"`,
                            type: 'capitalization'
                        });
                    }
                });

                return errors;
            }

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

                    if (word.match(/[\.!,;?]/)) {
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

            analyzeVoice(sentences) {
                return sentences.map((sentence) => {
                    const words = sentence.toLowerCase().match(/\b\w+\b/g) || [];
                    let isPassive = false;

                    // Simple check for passive voice: form of "to be" + past participle
                    for (let i = 0; i < words.length - 1; i++) {
                        const word = words[i];
                        const nextWord = words[i + 1];

                        if (
                            ['is', 'am', 'are', 'was', 'were', 'be', 'being', 'been'].includes(word) &&
                            (nextWord.endsWith('ed') || this.irregularPastParticiples.includes(nextWord))
                        ) {
                            isPassive = true;
                            break;
                        }
                    }

                    return {
                        sentence: sentence.trim(),
                        voice: isPassive ? 'passive' : 'active',
                        explanation: isPassive ?
                            'Contains an auxiliary verb + past participle pattern (e.g., "was read")' :
                            'Subject performs the action directly'
                    };
                });
            }

            createSentenceDiagrams(sentences) {
                // This is a highly simplified function and will not correctly diagram complex sentences.
                // It is a placeholder for a more advanced parsing library.
                return sentences.map((sentence) => {
                    const words = sentence.trim().match(/\b[\w']+\b/g) || [];
                    if (words.length === 0) return null;

                    let subject = words[0] || 'Subject';
                    let verb = '';
                    let object = '';

                    let verbIndex = -1;
                    for (let i = 0; i < words.length; i++) {
                        if (this.posPatterns.verb.test(words[i].toLowerCase())) {
                            verbIndex = i;
                            break;
                        }
                    }

                    if (verbIndex !== -1) {
                        verb = words[verbIndex];
                        if (verbIndex + 1 < words.length) {
                            object = words.slice(verbIndex + 1).join(' ');
                        }
                    }

                    if (verbIndex > 0) {
                        subject = words.slice(0, verbIndex).join(' ');
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

        class GrammarAnalyzerUI {
            constructor() {
                this.analyzer = new GrammarAnalyzer();
                this.initializeEventListeners();
                this.loadSampleText();
            }

            initializeEventListeners() {
                const analyzeBtn = document.getElementById('analyzeBtn');
                const textInput = document.getElementById('textInput');

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
            }

            loadSampleText() {
                const textInput = document.getElementById('textInput');
                textInput.value = "This is a sample sentence to test the grammar analyzer. there are some deliberate mistakes here. The book was read by the student yesterday. We organised the event at the centre.";
                this.updateWordCount();
            }

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

            async analyzeText() {
                const textInput = document.getElementById('textInput');
                const text = textInput.value.trim();
                
                if (!text) {
                    alert('Please enter some text to analyze.');
                    return;
                }

                const wordCount = this.analyzer.countWords(text);
                if (wordCount > 60) {
                    alert(`Text exceeds 60-word limit. Please reduce to 60 words or fewer. Current count: ${wordCount} words.`);
                    return;
                }

                this.showLoading(true);
                
                try {
                    await new Promise(resolve => setTimeout(resolve, 1000));
                    
                    const results = this.analyzer.analyze(text);
                    this.displayResults(results);
                } catch (error) {
                    alert(error.message);
                } finally {
                    this.showLoading(false);
                }
            }

            showLoading(show) {
                const loading = document.getElementById('loading');
                const results = document.getElementById('results');
                const analyzeBtn = document.getElementById('analyzeBtn');

                loading.style.display = show ? 'block' : 'none';
                results.style.display = show ? 'none' : 'grid';
                analyzeBtn.disabled = show;
            }

            displayResults(results) {
                const resultsContainer = document.getElementById('results');
                resultsContainer.innerHTML = '';

                resultsContainer.appendChild(this.createStatisticsCard(results.statistics));
                resultsContainer.appendChild(this.createSpellingCard(results.spelling));
                resultsContainer.appendChild(this.createGrammarCard(results.grammar));
                resultsContainer.appendChild(this.createPartsOfSpeechCard(results.partsOfSpeech));
                resultsContainer.appendChild(this.createVoiceAnalysisCard(results.voiceAnalysis));
                resultsContainer.appendChild(this.createSentenceDiagramsCard(results.sentenceDiagrams));
            }

            createStatisticsCard(stats) {
                const card = document.createElement('div');
                card.className = 'result-card';
                card.innerHTML = `
                    <h3 class="card-title"><span class="card-icon">📊</span> Statistics</h3>
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
                            <div class="stat-label">Words/Sentence</div>
                        </div>
                        <div class="stat-item">
                            <div class="stat-number">${stats.avgCharsPerWord}</div>
                            <div class="stat-label">Chars/Word</div>
                        </div>
                    </div>
                `;
                return card;
            }

            createSpellingCard(spellingErrors) {
                const card = document.createElement('div');
                card.className = 'result-card';
                let content = `
                    <h3 class="card-title"><span class="card-icon">📝</span> Spelling Suggestions</h3>
                `;
                if (spellingErrors.length > 0) {
                    content += '<ul>';
                    spellingErrors.forEach(err => {
                        content += `<li class="suggestion-item"><strong>${err.word}</strong> &rarr; ${err.suggestion}</li>`;
                    });
                    content += '</ul>';
                } else {
                    content += '<p>No spelling suggestions found.</p>';
                }
                card.innerHTML = content;
                return card;
            }

            createGrammarCard(grammarErrors) {
                const card = document.createElement('div');
                card.className = 'result-card';
                let content = `
                    <h3 class="card-title"><span class="card-icon">⚠️</span> Grammar Issues</h3>
                `;
                if (grammarErrors.length > 0) {
                    content += '<ul>';
                    grammarErrors.forEach(err => {
                        content += `<li class="error-item"><strong>${err.error}</strong> &rarr; ${err.suggestion}</li>`;
                    });
                    content += '</ul>';
                } else {
                    content += '<p>No grammar issues found.</p>';
                }
                card.innerHTML = content;
                return card;
            }

            createPartsOfSpeechCard(posResults) {
                const card = document.createElement('div');
                card.className = 'result-card';
                let content = `
                    <h3 class="card-title"><span class="card-icon">🏷️</span> Parts of Speech</h3>
                    <p>
                `;
                posResults.forEach(item => {
                    content += `<span class="pos-tag ${item.class}">${item.word} (${item.pos.charAt(0).toUpperCase()})</span>`;
                });
                content += '</p>';
                card.innerHTML = content;
                return card;
            }

            createVoiceAnalysisCard(voiceAnalysis) {
                const card = document.createElement('div');
                card.className = 'result-card';
                let content = `
                    <h3 class="card-title"><span class="card-icon">🔊</span> Voice Analysis</h3>
                `;
                voiceAnalysis.forEach(item => {
                    const voiceClass = item.voice === 'passive' ? 'voice-passive' : 'voice-active';
                    content += `
                        <div class="sentence-text">${item.sentence}</div>
                        <div class="voice-indicator ${voiceClass}">
                            Voice: ${item.voice.charAt(0).toUpperCase() + item.voice.slice(1)}
                        </div>
                        <small>${item.explanation}</small>
                    `;
                });
                card.innerHTML = content;
                return card;
            }

            createSentenceDiagramsCard(diagrams) {
                const card = document.createElement('div');
                card.className = 'result-card';
                let content = `
                    <h3 class="card-title"><span class="card-icon">🖼️</span> Simplified Sentence Diagram</h3>
                `;
                diagrams.forEach(item => {
                    if (item) {
                        content += `
                            <div class="sentence-text">${item.sentence}</div>
                            <pre class="diagram-container">${item.diagram}</pre>
                        `;
                    }
                });
                card.innerHTML = content;
                return card;
            }
        }

        document.addEventListener('DOMContentLoaded', () => {
            new GrammarAnalyzerUI();
        });
    </script>
</body>
</html>
