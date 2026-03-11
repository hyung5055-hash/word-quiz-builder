import React from "react";
import { useState } from "react";
import { useRoute } from "wouter";
import { Loader2 } from "lucide-react";
import { Navbar } from "@/components/layout/Navbar";
import { QuestionDisplay } from "@/components/quiz/QuestionDisplay";
import { QuizResults } from "@/components/quiz/QuizResults";
import { useQuiz } from "@/hooks/use-quizzes";

export default function QuizSession() {
  const [, params] = useRoute("/quiz/:lang");
  const lang = params?.lang ?? "";

  const { data: quiz, isLoading, error } = useQuiz(lang);

  const [currentIndex, setCurrentIndex] = useState(0);
  const [score, setScore] = useState(0);
  const [isFinished, setIsFinished] = useState(false);

  // 로딩 상태
  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="animate-spin" />
      </div>
    );
  }

  // 에러 or 데이터 없음
  if (error || !quiz || quiz.length === 0) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        Error loading quiz.
      </div>
    );
  }
  if (error || !quiz || quiz.length === 0) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        Error loading quiz.
      </div>
    );
  }

  const currentQuestion = quiz[currentIndex]!;

  const handleAnswer = (selectedOption: string, isCorrect: boolean) => {
    if (isCorrect) {
      setScore((prev) => prev + 1);
    }

    if (currentIndex < quiz.length - 1) {
      setCurrentIndex((prev) => prev + 1);
    } else {
      setIsFinished(true);
    }
  };

  const handleRetry = () => {
    setCurrentIndex(0);
    setScore(0);
    setIsFinished(false);
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />

      <main className="flex-grow container mx-auto px-4 py-12 flex items-center justify-center">
        {!isFinished ? (
          <QuestionDisplay
            question={currentQuestion}
            questionNumber={currentIndex + 1}
            totalQuestions={quiz.length}
            onAnswer={handleAnswer}
          />
        ) : (
          <QuizResults
            score={score}
            total={quiz.length}
            onRetry={handleRetry}
          />
        )}
      </main>
    </div>
  );
}
