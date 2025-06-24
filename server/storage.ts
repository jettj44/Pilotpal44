import { users, userProgress, type User, type InsertUser, type UserProgress, type InsertUserProgress } from "@shared/schema";

export interface IStorage {
  getUser(id: number): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  getUserProgress(userId: number): Promise<UserProgress | undefined>;
  updateUserProgress(userId: number, progress: Partial<InsertUserProgress>): Promise<UserProgress>;
}

export class MemStorage implements IStorage {
  private users: Map<number, User>;
  private userProgress: Map<number, UserProgress>;
  private currentUserId: number;
  private currentProgressId: number;

  constructor() {
    this.users = new Map();
    this.userProgress = new Map();
    this.currentUserId = 1;
    this.currentProgressId = 1;
  }

  async getUser(id: number): Promise<User | undefined> {
    return this.users.get(id);
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(
      (user) => user.username === username,
    );
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const id = this.currentUserId++;
    const user: User = { ...insertUser, id };
    this.users.set(id, user);
    return user;
  }

  async getUserProgress(userId: number): Promise<UserProgress | undefined> {
    return Array.from(this.userProgress.values()).find(
      (progress) => progress.userId === userId,
    );
  }

  async updateUserProgress(userId: number, progressData: Partial<InsertUserProgress>): Promise<UserProgress> {
    const existingProgress = await this.getUserProgress(userId);
    
    if (existingProgress) {
      const updatedProgress: UserProgress = {
        ...existingProgress,
        ...progressData,
      };
      this.userProgress.set(existingProgress.id, updatedProgress);
      return updatedProgress;
    } else {
      const id = this.currentProgressId++;
      const newProgress: UserProgress = {
        id,
        userId,
        completedLessons: [],
        lessonScores: {},
        ...progressData,
      };
      this.userProgress.set(id, newProgress);
      return newProgress;
    }
  }
}

export const storage = new MemStorage();
