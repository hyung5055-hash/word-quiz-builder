import { db } from "./db";
import { quizzes, questions, type InsertQuiz, type InsertQuestion, type QuizWithQuestions, type Quiz, type Question } from "@shared/schema";
import { eq } from "drizzle-orm";

export interface IStorage {
  getQuizzes(): Promise<Quiz[]>;
  getQuizWithQuestions(id: number): Promise<QuizWithQuestions | undefined>;
  createQuiz(quiz: InsertQuiz): Promise<Quiz>;
  createQuestion(question: InsertQuestion): Promise<Question>;
}

export class DatabaseStorage implements IStorage {
  async getQuizzes(): Promise<Quiz[]> {
    return await db.select().from(quizzes);
  }

  async getQuizWithQuestions(id: number): Promise<QuizWithQuestions | undefined> {
    const quiz = await db.select().from(quizzes).where(eq(quizzes.id, id)).then(res => res[0]);
    if (!quiz) return undefined;

    const quizQuestions = await db.select().from(questions).where(eq(questions.quizId, id));
    return { ...quiz, questions: quizQuestions };
  }

  async createQuiz(quiz: InsertQuiz): Promise<Quiz> {
    const [newQuiz] = await db.insert(quizzes).values(quiz).returning();
    return newQuiz;
  }

  async createQuestion(question: InsertQuestion): Promise<Question> {
    const [newQuestion] = await db.insert(questions).values(question).returning();
    return newQuestion;
  }
}

export const storage = new DatabaseStorage();
