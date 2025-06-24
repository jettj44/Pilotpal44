import { pgTable, text, serial, integer, boolean, jsonb } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  username: text("username").notNull().unique(),
  password: text("password").notNull(),
});

export const userProgress = pgTable("user_progress", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").notNull(),
  completedLessons: text("completed_lessons").array(),
  lessonScores: jsonb("lesson_scores"),
});

export const insertUserSchema = createInsertSchema(users).pick({
  username: true,
  password: true,
});

export const insertUserProgressSchema = createInsertSchema(userProgress).omit({
  id: true,
});

export type InsertUser = z.infer<typeof insertUserSchema>;
export type User = typeof users.$inferSelect;
export type UserProgress = typeof userProgress.$inferSelect;
export type InsertUserProgress = z.infer<typeof insertUserProgressSchema>;

// Lesson data types
export interface Flashcard {
  q: string;
  a: string;
}

export interface QuizQuestion {
  question: string;
  options: string[];
  correct: number;
  explanation: string;
}

export interface Quiz {
  questions: QuizQuestion[];
}

export interface Lesson {
  title: string;
  subtitle: string;
  flashcards: Flashcard[];
  quiz: Quiz;
}

export interface LessonProgress {
  lessonId: string;
  completed: boolean;
  score: number;
  lastAccessed: Date;
}
