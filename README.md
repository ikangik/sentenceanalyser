import React, { useState } from "react";
import nlp from "compromise";

function getPartsOfSpeech(tokens) {
  return tokens.map((t) => ({
    text: t.text,
    pos: t.tags[0] || "Unknown",
  }));
}

function diagramSentence(sentence) {
  // This is a very basic and naive tree: subject - verb - object
  // Real parsing is much more complex!
  const doc = nlp(sentence);
  const subjects = doc.subjects().out("array");
  const verbs = doc.verbs().out("array");
  const objects = doc.objects().out("array");

  return {
    subject: subjects[0] || "(none found)",
    verb: verbs[0] || "(none found)",
    object: objects[0] || "(none found)",
  };
}

function checkGrammar(sentence) {
  // compromise doesn't do grammar, so use a simple heuristic
  // In production, use a real grammar API like LanguageTool
  if (!sentence.endsWith(".")) {
    return "Sentence should end with a period.";
  }
  if (sentence.split(" ").length < 3) {
    return "Sentence may be too short.";
  }
  return "No major grammar issues detected (basic check).";
}

export default function SentenceAnalyser() {
  const [input, setInput] = useState("");
  const [result, setResult] = useState(null);

  const handleAnalyse = () => {
    const doc = nlp(input);
    const tokens = doc.terms().json()[0]?.terms || [];
    const pos = getPartsOfSpeech(tokens);
    const diagram = diagramSentence(input);
    const grammar = checkGrammar(input);

    setResult({ pos, diagram, grammar });
  };

  return (
    <div style={{ maxWidth: 600, margin: "2rem auto", fontFamily: "sans-serif" }}>
      <h2>Sentence Analyser</h2>
      <textarea
        rows={3}
        value={input}
        onChange={(e) => setInput(e.target.value)}
        style={{ width: "100%", fontSize: "1.1em" }}
        placeholder="Type a sentence..."
      />
      <button onClick={handleAnalyse} style={{ margin: "1em 0" }}>
        Analyse
      </button>
      {result && (
        <div>
          <h3>Grammar Check</h3>
          <p>{result.grammar}</p>
          <h3>Parts of Speech</h3>
          <ul>
            {result.pos.map((t, idx) => (
              <li key={idx}>
                <b>{t.text}</b>: {t.pos}
              </li>
            ))}
          </ul>
          <h3>Basic Sentence Diagram</h3>
          <pre>
{`Subject: ${result.diagram.subject}
Verb: ${result.diagram.verb}
Object: ${result.diagram.object}`}
          </pre>
        </div>
      )}
    </div>
  );
}
