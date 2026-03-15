import React from "react";
import { useEffect, useState } from "react";

type Pair = {
  from: string;
  to: string;
};

export default function MatchDeFr() {
  const [pairs, setPairs] = useState<Pair[]>([]);
  const [originalPairs, setOriginalPairs] = useState<Pair[]>([]);
  const [deWords, setDeWords] = useState<string[]>([]);
  const [frWords, setFrWords] = useState<string[]>([]);
  const [selectedDe, setSelectedDe] = useState<string | null>(null);
  const [selectedFr, setSelectedFr] = useState<string | null>(null);
  const [matched, setMatched] = useState<string[]>([]);
  const [wrong, setWrong] = useState<string[]>([]);
  const [wrongPairs, setWrongPairs] = useState<Pair[]>([]);
  const [wrongCount, setWrongCount] = useState(0);
  const [loading, setLoading] = useState(true);


useEffect(() => {
  fetch("/api/match")
    .then((res) => res.json())
    .then((data: Pair[]) => {
      setPairs(data);
      setOriginalPairs(data);

      setDeWords(data.map((p) => p.from));
      setFrWords(data.map((p) => p.to).sort(() => 0.5 - Math.random()));

      setLoading(false);
    });
}, []);


  useEffect(() => {
    if (selectedDe && selectedFr) {
      const correct = pairs.find((p) => p.from === selectedDe);

      if (correct?.to === selectedFr) {
        setMatched((prev) => [...prev, selectedDe, selectedFr]);
        setTimeout(() => {
          setDeWords((prev) => prev.filter((w) => w !== selectedDe));
          setFrWords((prev) => prev.filter((w) => w !== selectedFr));
        }, 1000);
      } else {
        setWrong([selectedDe, selectedFr]);
        setWrongCount((prev) => prev + 1);

        if (correct) {
          setWrongPairs((prev) => {
            if (!prev.find((p) => p.from === correct.from)) {
              return [...prev, correct];
            }
            return prev;
          });
        }

        setTimeout(() => setWrong([]), 800);
      }

      setTimeout(() => {
        setSelectedDe(null);
        setSelectedFr(null);
      }, 200);
    }
  }, [selectedDe, selectedFr, pairs]);

  if (loading) return <div style={{ padding: 40 }}>Loading...</div>;

  const isCompleted = deWords.length === 0;

  const grade = wrongCount <= 2 ? "A" : wrongCount <= 5 ? "B" : "C";

  return (
    <div style={{ padding: "8px" }}>
      <h1>DE - FR Match</h1>
      <p>📌 Remaining: {deWords.length}</p>

      {isCompleted && (
        <div style={{ marginTop: "30px" }}>
          <h2 style={{ color: "green" }}>🎉 All matched!</h2>
          <p>❌ Wrong Attempts: {wrongCount}</p>
          <p>🏆 Grade: {grade}</p>

          <div
            style={{
              marginTop: "20px",
              padding: "20px",
              background: "#f8f8f8",
              borderRadius: "10px",
            }}
          >
            <h3>📚 Answer Pairs</h3>

            {originalPairs.map((pair, index) => (
              <div
                key={index}
                style={{
                  padding: "10px 0",
                  borderBottom: "1px solid #ddd",
                }}
              >
                <strong>{pair.from}</strong> — {pair.to}
              </div>
            ))}
          </div>

          <button
            onClick={() => window.location.reload()}
            style={{
              marginTop: "20px",
              padding: "8px 16px",
              cursor: "pointer",
            }}
          >
            🔄 Play Again
          </button>

          {wrongPairs.length > 0 && (
            <button
              onClick={() => {
                setPairs(wrongPairs);
                setDeWords(wrongPairs.map((p) => p.from));
                setFrWords(
                  wrongPairs.map((p) => p.to).sort(() => 0.5 - Math.random()),
                );
                setMatched([]);
                setWrong([]);
                setWrongCount(0);
                setWrongPairs([]);
              }}
              style={{
                marginLeft: "10px",
                marginTop: "20px",
                padding: "8px 16px",
                cursor: "pointer",
              }}
            >
              🔁 Retry Wrong Words
            </button>
          )}
        </div>
      )}

      {!isCompleted && (
        <div style={{ display: "flex", gap: "8px", marginTop: "30px" }}>
          {/* German */}
          <div style={{ flex: 1 }}>
            <h3>German</h3>
            {deWords.map((word) => (
              <div
                key={word}
                onClick={() => setSelectedDe(word)}
                style={{
                  padding: "8px",
                  margin: "4px 0",
                  cursor: "pointer",
                  borderRadius: "8px",
                  background: matched.includes(word)
                    ? "#b6f5c2"
                    : wrong.includes(word)
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

          {/* French */}
          <div style={{ flex: 1 }}>
            <h3>French</h3>
            {frWords.map((word) => (
              <div
                key={word}
                onClick={() => setSelectedFr(word)}
                style={{
                  padding: "8px",
                  margin: "4px 0",
                  cursor: "pointer",
                  borderRadius: "8px",
                  background:
                    matched.includes(word)
                      ? "#b6f5c2"
                      : wrong.includes(word)
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
        </div>
      )}

      {/* 번역 버튼 */}
      <div style={{ marginTop: "40px", textAlign: "center" }}>
        <button
          onClick={() => {
            const text = selectedDe || selectedFr;

            if (text) {
              window.open(
                `https://translate.google.com/?sl=auto&tl=ko&text=${encodeURIComponent(text)}&op=translate`,
                "_blank",
              );
            } else {
              alert("먼저 문장을 선택하세요.");
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
