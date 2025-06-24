import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import OpenAI from "openai";

const openai = new OpenAI({ 
  apiKey: process.env.OPENAI_API_KEY || process.env.OPENAI_API_KEY_ENV_VAR || "default_key"
});

export async function registerRoutes(app: Express): Promise<Server> {
  
  // Get user progress
  app.get("/api/progress/:userId", async (req, res) => {
    try {
      const userId = parseInt(req.params.userId);
      const progress = await storage.getUserProgress(userId);
      
      if (!progress) {
        // Return default progress
        return res.json({
          completedLessons: [],
          lessonScores: {}
        });
      }
      
      res.json(progress);
    } catch (error) {
      res.status(500).json({ message: "Failed to get user progress" });
    }
  });

  // Update user progress
  app.post("/api/progress/:userId", async (req, res) => {
    try {
      const userId = parseInt(req.params.userId);
      const { completedLessons, lessonScores } = req.body;
      
      const progress = await storage.updateUserProgress(userId, {
        completedLessons,
        lessonScores
      });
      
      res.json(progress);
    } catch (error) {
      res.status(500).json({ message: "Failed to update user progress" });
    }
  });

  // AI Assistant endpoint
  app.post("/api/ask-ai", async (req, res) => {
    try {
      const { question } = req.body;
      
      if (!question) {
        return res.status(400).json({ message: "Question is required" });
      }

      // the newest OpenAI model is "gpt-4o" which was released May 13, 2024. do not change this unless explicitly requested by the user
      const response = await openai.chat.completions.create({
        model: "gpt-4o",
        messages: [
          {
            role: "system",
            content: "You are a professional flight instructor and aviation expert. Provide clear, accurate, and helpful answers about aviation topics. Focus on practical knowledge for student pilots. Format your response with proper paragraphs and bullet points where appropriate."
          },
          {
            role: "user",
            content: question
          }
        ],
        max_tokens: 500
      });

      const answer = response.choices[0].message.content;
      res.json({ answer });
      
    } catch (error: any) {
      console.error('OpenAI API error:', error);
      res.status(500).json({ 
        message: "Failed to get AI response. Please check your API key and try again.",
        error: error.message 
      });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}
