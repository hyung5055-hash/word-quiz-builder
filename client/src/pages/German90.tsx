import React, { useEffect, useState } from "react";

type Pair = {
  id: string;
  from: string;
  to: string;
};

const STORAGE_KEY = "de90_progress";

export default function French90() {
  const [allWords, setAllWords] = useState<Pair[]>([]);
  const [pairs, setPairs] = useState<Pair[]>([]);

  const [leftWords, setLeftWords] = useState<string[]>([]);
  const [rightWords, setRightWords] = useState<string[]>([]);

  const [selectedLeft, setSelectedLeft] =
    useState<string | null>(null);

  const [selectedRight, setSelectedRight] =
    useState<string | null>(null);

  const [matched, setMatched] =
    useState<string[]>([]);

  const [wrong, setWrong] =
    useState<string[]>([]);

  const [loading, setLoading] =
    useState(true);

  const [progress, setProgress] =
    useState<Record<string, number>>({});

  const [usedWords, setUsedWords] =
    useState<string[]>([]);

  useEffect(() => {
    const saved =
      localStorage.getItem(STORAGE_KEY);

    if (saved) {
      setProgress(JSON.parse(saved));
    }
  }, []);

  useEffect(() => {
    fetch("/api/de90")
      .then((res) => res.json())
      .then((data) => {

        const converted: Pair[] =





          data.map((w: any) => ({
            id: w.word,
            from: w.word,
            to: w.meaning,
          }));

        setAllWords(converted);
      })
      .catch(console.error);

  }, []);

  const loadNextQuiz = () => {

    const available =
      allWords.filter(
        (w) =>
          (progress[w.id] || 0) < 3 &&
          !usedWords.includes(w.id)
      );

    if (available.length === 0) {
      return;
    }

    const selected =
      [...available]
        .sort(() => Math.random() - 0.5)
        .slice(0, 10);

    setPairs(selected);

    setLeftWords(
      selected.map((p) => p.from)
    );

    setRightWords(
      selected
        .map((p) => p.to)
        .sort(() => Math.random() - 0.5)
    );

    setUsedWords((prev) => [
      ...prev,
      ...selected.map((p) => p.id),
    ]);

    setMatched([]);
    setWrong([]);
  };

  useEffect(() => {

    if (
      allWords.length > 0 &&
      pairs.length === 0
    ) {
          




      
      loadNextQuiz();
      setLoading(false);
    }

  }, [allWords]);

  useEffect(() => {

    if (
      selectedLeft &&
      selectedRight
    ) {

      const correct =
        pairs.find(
          (p) =>
            p.from === selectedLeft
        );

      if (
        correct?.to === selectedRight
      ) {

        setMatched((prev) => [
          ...prev,
          selectedLeft,
          selectedRight,
        ]);

        setProgress((prev) => {

          const updated = {
            ...prev,
            [correct.id]:
              (prev[correct.id] || 0) + 1,
          };

          localStorage.setItem(
            STORAGE_KEY,
            JSON.stringify(updated)
          );

          return updated;
        });

        setTimeout(() => {

          setLeftWords((prev) =>
            prev.filter(
              (w) =>
                w !== selectedLeft
            )
          );

          setRightWords((prev) =>
            prev.filter(
              (w) =>
                w !== selectedRight
            )




          );

        }, 500);

      } else {

        setWrong([
          selectedLeft,
          selectedRight,
        ]);

        setTimeout(() => {
          setWrong([]);
        }, 700);
      }

      setTimeout(() => {

        setSelectedLeft(null);

        setSelectedRight(null);

      }, 200);
    }

  }, [
    selectedLeft,
    selectedRight,
    pairs,
  ]);

useEffect(() => {

  const available =
    allWords.filter(
      w =>
        (progress[w.id] || 0) < 3 &&
        !usedWords.includes(w.id)
    );

  if (
    !loading &&
    leftWords.length === 0 &&
    available.length > 0
  ) {

    setTimeout(() => {
      loadNextQuiz();
    }, 500);

  }

}, [leftWords]);

  
  if (loading) {
    return (
      <div
        style={{
          padding: 30,
        }}
      >
        Loading...
      </div>
    );
  }

  const graduated =
    Object.values(progress)
      .filter(
        (v) => v >= 3
      )
      .length;

  const completed =
    graduated >=
    allWords.length;


  return (
    <div style={{ padding: 12 }}>

      <h1>🇩🇪 German 90 Days</h1>
      <p>전체 : {allWords.length}</p>
      <p>졸업 : {graduated}</p>
      <p>남음 : {allWords.length - graduated}</p>

      <p>
        현재 문제 :
        {leftWords.length}
      </p>

      <button
        onClick={loadNextQuiz}
      >
        Next 10
      </button>

      <button
        onClick={() => {

          localStorage.removeItem(
            STORAGE_KEY
          );

          window.location.reload();

        }}
      >
        Reset Progress
      </button>

      {completed && (
        <h2>
          🎉 All Completed!
        </h2>
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
      <h3>German</h3>
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

<div
  style={{
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
  }}
>
  <span>{word}</span>

  <button
    onClick={(e) => {

      e.stopPropagation();

      const pair =
        pairs.find(
          p => p.from === word
        );

      if (!pair) return;

      setProgress((prev) => {

        const updated = {
          ...prev,
          [pair.id]: 3,
        };

        localStorage.setItem(
          STORAGE_KEY,
          JSON.stringify(updated)
        );

        return updated;
      });

      setLeftWords(prev =>
        prev.filter(
          w => w !== word
        )
      );

    }}
  >
    ✅
  </button>
</div>

     
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






        
