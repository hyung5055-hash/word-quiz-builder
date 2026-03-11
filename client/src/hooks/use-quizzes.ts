import { useQuery } from "@tanstack/react-query";

export type Question = {
  question: string;
  options: string[];
  answer: number;
};

export function useQuizzes() {
  return useQuery({
    queryKey: ["quizzes"],
    queryFn: async () => {
      const res = await fetch("/api/quizzes", {
        credentials: "include",
      });

      if (!res.ok) {
        throw new Error("Failed to fetch quizzes");
      }

      return res.json();
    },
  });
}

export function useQuiz(lang: string) {
  return useQuery<Question[]>({
    queryKey: ["quiz", lang],
    queryFn: async () => {
      const res = await fetch(`/api/quiz/${lang}`, {
        credentials: "include",
      });

      if (!res.ok) {
        throw new Error("Failed to fetch quiz");
      }

      return res.json();
    },
  });
}