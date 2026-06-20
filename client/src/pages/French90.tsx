import React, { useEffect, useState } from "react";

type Pair = {
  from: string;
  to: string;
};

export default function French90() {
  const [pairs, setPairs] = useState<Pair[]>([]);
  const [leftWords, setLeftWords] = useState<string[]>([]);
  const [rightWords, setRightWords] = useState<string[]>([]);
  const [selectedLeft, setSelectedLeft] = useState<string | null>(null);
  const [selectedRight, setSelectedRight] = useState<string | null>(null);
  const [matched, setMatched] = useState<string[]>([]);
  const [wrong, setWrong] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/fr90.json")
      .then((res) => res.json())
      .then((data) => {
        const converted: Pair[] = data.map((w: any) => ({
          from: w.word,
          to: w.meaning,
        }));

        setPairs(converted);

        setLeftWords(converted.map((p) => p.from));

        setRightWords(
          converted.map((p) => p.to).sort(() => 0.5 - Math.random())
        );

        setLoading(false);
      });
  }, []);

  useEffect(() => {
    if (selectedLeft && selectedRight) {
      const correct = pairs.find((p) => p.from === selectedLeft);

      if (correct?.to === selectedRight) {
        setMatched((prev) => [...prev, selectedLeft, selectedRight]);

        setTimeout(() => {
          setLeftWords((prev) =>
            prev.filter((w) => w !== selectedLeft)
          );

          setRightWords((prev) =>
            prev.filter((w) => w !== selectedRight)
          );
        }, 500);
      } else {
        setWrong([selectedLeft, selectedRight]);

        setTimeout(() => {
          setWrong([]);
        }, 700);
      }

      setTimeout(() => {
        setSelectedLeft(null);
        setSelectedRight(null);
      }, 200);
    }
  }, [selectedLeft, selectedRight, pairs]);

  if (loading) {
    return <div style={{ padding: 30 }}>Loading...</div>;
  }

  const completed = leftWords.length === 0;

  return (
    <div style={{ padding: "12px" }}>
      <h1>🇫🇷 French 90 Days</h1>

      <p>📌 Remaining: {leftWords.length}</p>

      {completed && (
        <div>
          <h2 style={{ color: "green" }}>
            🎉 Completed!
          </h2>

          <button
            onClick={() => window.location.reload()}
            style={{
              padding: "10px 20px",
              cursor: "pointer",
            }}
          >
            🔄 Play Again
          </button>
        </div>
      )}

      {!completed && (
        <div
          style={{
            display: "flex",
            gap: "10px",
            marginTop: "20px",
          }}
        >
          <div style={{ flex: 1 }}>
            <h3>French</h3>

            {leftWords.map((word) => (
              <div
                key={word}
                onClick={() => setSelectedLeft(word)}
                style={{
                  padding: "8px",
                  margin: "4px 0",
                  cursor: "pointer",
                  borderRadius: "8px",
                  background: matched.includes(word)
                    ? "#b6f5c2"
                    : wrong.includes(word)
                    ? "#ffb3b3"
                    : selectedLeft === word
                    ? "#ddd"
                    : "#f5f5f5",
                }}
              >
                {word}
              </div>
            ))}
          </div>

          <div style={{ flex: 1 }}>
            <h3>Korean</h3>

            {rightWords.map((word) => (
              <div
                key={word}
                onClick={() => setSelectedRight(word)}
                style={{
                  padding: "8px",
                  margin: "4px 0",
                  cursor: "pointer",
                  borderRadius: "8px",
                  background: matched.includes(word)
                    ? "#b6f5c2"
                    : wrong.includes(word)
                    ? "#ffb3b3"
                    : selectedRight === word
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
    </div>
  );
}
