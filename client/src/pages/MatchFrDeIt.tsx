import React from "react";
import { useEffect, useState } from "react";

type Triple = {
  fr: string;
  de: string;
  it: string;
};

export default function MatchFrDeIt() {
  const [pairs, setPairs] = useState<Triple[]>([]);
  const [originalPairs, setOriginalPairs] = useState<Triple[]>([]);

  const [frWords, setFrWords] = useState<string[]>([]);
  const [deWords, setDeWords] = useState<string[]>([]);
  const [itWords, setItWords] = useState<string[]>([]);

  const [selectedFr, setSelectedFr] = useState<string | null>(null);
  const [selectedDe, setSelectedDe] = useState<string | null>(null);
  const [selectedIt, setSelectedIt] = useState<string | null>(null);

  const [matched, setMatched] = useState<string[]>([]);
  const [wrong, setWrong] = useState<string[]>([]);
  const [wrongTriples, setWrongTriples] = useState<Triple[]>([]);
  const [wrongCount, setWrongCount] = useState(0);

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/matchfrdeit")
      .then((res) => res.json())
      .then((data: Triple[]) => {
        setPairs(data);
        setOriginalPairs(data);

        setFrWords(data.map((p) => p.fr));
        setDeWords(data.map((p) => p.de).sort(() => 0.5 - Math.random()));
        setItWords(data.map((p) => p.it).sort(() => 0.5 - Math.random()));

        setLoading(false);
      });
  }, []);

  useEffect(() => {
    if (selectedFr && selectedDe && selectedIt) {
      const correct = pairs.find((p) => p.fr === selectedFr);

      if (correct?.de === selectedDe && correct?.it === selectedIt) {
        setMatched((prev) => [...prev, selectedFr]);

        setTimeout(() => {
          setFrWords((prev) => prev.filter((w) => w !== selectedFr));
          setDeWords((prev) => prev.filter((w) => w !== selectedDe));
          setItWords((prev) => prev.filter((w) => w !== selectedIt));
        }, 800);
      } else {
        setWrong([selectedFr, selectedDe, selectedIt]);
        setWrongCount((prev) => prev + 1);

        if (correct) {
          setWrongTriples((prev) => {
            if (!prev.find((p) => p.fr === correct.fr)) {
              return [...prev, correct];
            }
            return prev;
          });
        }

        setTimeout(() => setWrong([]), 800);
      }

      setTimeout(() => {
        setSelectedFr(null);
        setSelectedDe(null);
        setSelectedIt(null);
      }, 200);
    }
  }, [selectedFr, selectedDe, selectedIt, pairs]);

  if (loading) return <div style={{ padding: 40 }}>Loading...</div>;

  const isCompleted = frWords.length === 0;
  const grade = wrongCount <= 2 ? "A" : wrongCount <= 5 ? "B" : "C";

  return (
    <div style={{ padding: "40px" }}>
      <h1>FR - DE - IT Match</h1>
      <p>📌 Remaining: {frWords.length}</p>

      {isCompleted && (
        <div style={{ marginTop: "30px" }}>
          <h2 style={{ color: "green" }}>🎉 All matched!</h2>
          <p>❌ Wrong Attempts: {wrongCount}</p>
          <p>🏆 Grade: {grade}</p>

          {originalPairs.map((pair, index) => (
            <div key={index}>
              {pair.fr} — {pair.de} — {pair.it}
            </div>
          ))}
        </div>
      )}

      {!isCompleted && (
        <div style={{ display: "flex", gap: "40px", marginTop: "30px" }}>
          <div style={{ flex: 1 }}>
            <h3>French</h3>
            {frWords.map((word) => (
              <div
                key={word}
                onClick={() => setSelectedFr(word)}
                style={{
                  padding: "10px",
                  margin: "8px 0",
                  cursor: "pointer",
                  borderRadius: "8px",
                  background:
                    wrong.includes(word)
                      ? "#ffb3b3"
                      : selectedFr === word
                      ? "#ddd"
                      : "#f5f5f5",
                }}
              >
                {word}
              </div>
            ))}
          </div>

          <div style={{ flex: 1 }}>
            <h3>German</h3>
            {deWords.map((word) => (
              <div
                key={word}
                onClick={() => setSelectedDe(word)}
                style={{
                  padding: "10px",
                  margin: "8px 0",
                  cursor: "pointer",
                  borderRadius: "8px",
                  background:
                    wrong.includes(word)
                      ? "#ffb3b3"
                      : selectedDe === word
                      ? "#ddd"
                      : "#f5f5f5",
                }}
              >
                {word}
              </div>
            ))}
          </div>

          <div style={{ flex: 1 }}>
            <h3>Italian</h3>
            {itWords.map((word) => (
              <div
                key={word}
                onClick={() => setSelectedIt(word)}
                style={{
                  padding: "10px",
                  margin: "8px 0",
                  cursor: "pointer",
                  borderRadius: "8px",
                  background:
                    wrong.includes(word)
                      ? "#ffb3b3"
                      : selectedIt === word
                      ? "#ddd"
                      : "#f5f5f5",
                }}
              >
                {word}
              </div>
            ))}
          </div>
        </div>
      )}

<div style={{ marginTop: "40px", textAlign: "center" }}>
  <button
    onClick={() => {
      const text = selectedFr || selectedDe || selectedIt;

      if (text) {
        window.open(
          `https://translate.google.com/?sl=auto&tl=ko&text=${encodeURIComponent(text)}&op=translate`,
          "_blank"
        );
      } else {
        alert("먼저 단어를 선택하세요.");
      }
    }}
    style={{
      padding: "10px 24px",
      cursor: "pointer",
      borderRadius: "8px",
      border: "none",
      background: "#4caf50",
      color: "white",
      fontSize: "16px",
    }}
  >
    🌍 Translate to Korean
  </button>
</div>
    </div>
  );
}
