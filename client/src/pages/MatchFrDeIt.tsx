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
  const [correct, setCorrect] = useState<string[]>([]);
  const [wrongTriples, setWrongTriples] = useState<Triple[]>([]);
  const [wrongCount, setWrongCount] = useState(0);

  const [loading, setLoading] = useState(true);

  const [search, setSearch] = useState("");
  const [searchResults, setSearchResults] = useState<Triple[]>([]);

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

  const handleSearch = (value: string) => {
    setSearch(value);

    if (!value.trim()) {
      setSearchResults([]);
      return;
    }

    const keyword = value.toLowerCase().trim();

    const results = originalPairs.filter((p) =>
      p.fr.toLowerCase().includes(keyword) ||
      p.de.toLowerCase().includes(keyword) ||
      p.it.toLowerCase().includes(keyword)
    );

    setSearchResults(results);
  };

  useEffect(() => {
    if (selectedFr && selectedDe && selectedIt) {
      const correctPair = pairs.find((p) => p.fr === selectedFr);

      if (correctPair?.de === selectedDe && correctPair?.it === selectedIt) {
        setMatched((prev) => [...prev, selectedFr]);
        setCorrect([selectedFr, selectedDe, selectedIt]);

        setTimeout(() => {
          setFrWords((prev) => prev.filter((w) => w !== selectedFr));
          setDeWords((prev) => prev.filter((w) => w !== selectedDe));
          setItWords((prev) => prev.filter((w) => w !== selectedIt));
          setCorrect([]);
        }, 800);
      } else {
        setWrong([selectedFr, selectedDe, selectedIt]);
        setWrongCount((prev) => prev + 1);

        if (correctPair) {
          setWrongTriples((prev) => {
            if (!prev.find((p) => p.fr === correctPair.fr)) {
              return [...prev, correctPair];
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
    <div style={{ padding: "16px" }}>
      <h1>FR - DE - IT Match</h1>

      <div style={{ marginTop: "20px", marginBottom: "20px" }}>
        <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
          <span style={{ fontSize: "20px" }}>🔍</span>

          <input
            type="text"
            placeholder="Search word..."
            value={search}
            onChange={(e) => handleSearch(e.target.value)}
            style={{
              padding: "8px",
              width: "100%",
              maxWidth: "250px",
              borderRadius: "8px",
              border: "1px solid #ccc",
            }}
          />
        </div>

        {search.length > 0 && (
          <div
            style={{
              marginTop: "12px",
              background: "#fff",
              border: "1px solid #ddd",
              borderRadius: "8px",
              maxHeight: "220px",
              overflowY: "auto",
            }}
          >
            {searchResults.length > 0 ? (
              searchResults.map((item, index) => (
                <div
                  key={index}
                  style={{
                    padding: "10px",
                    borderBottom: "1px solid #eee",
                  }}
                >
                  {item.fr} — {item.de} — {item.it}
                </div>
              ))
            ) : (
              <div style={{ padding: "10px" }}>No result</div>
            )}
          </div>
        )}
      </div>

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
        <div style={{ display: "flex", gap: "12px", marginTop: "30px" }}>
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
                    correct.includes(word)
                      ? "#b8f5b8"
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
                  background:
                    correct.includes(word)
                      ? "#b8f5b8"
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

          <div style={{ flex: 1 }}>
            <h3>Italian</h3>
            {itWords.map((word) => (
              <div
                key={word}
                onClick={() => setSelectedIt(word)}
                style={{
                  padding: "8px",
                  margin: "4px 0",
                  cursor: "pointer",
                  borderRadius: "8px",
                  background:
                    correct.includes(word)
                      ? "#b8f5b8"
                      : wrong.includes(word)
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
