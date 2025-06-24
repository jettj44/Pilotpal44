# Aviation Learning Platform - replit.md

## Overview

This is a comprehensive aviation learning platform built for flight training education. The application provides an interactive learning experience with flashcards, quizzes, progress tracking, and an AI-powered assistant for aviation-related questions. The platform follows a modern full-stack architecture with a React frontend and Express.js backend.

## System Architecture

### Frontend Architecture
- **Framework**: React 18 with TypeScript
- **Build Tool**: Vite for fast development and optimized builds
- **Routing**: Wouter for lightweight client-side routing
- **State Management**: TanStack Query (React Query) for server state management
- **UI Components**: Shadcn/ui component library built on Radix UI primitives
- **Styling**: Tailwind CSS with custom aviation-themed color variables

### Backend Architecture
- **Runtime**: Node.js 20 with Express.js framework
- **Language**: TypeScript with ES modules
- **Development**: tsx for TypeScript execution in development
- **Build**: esbuild for production bundling

### Data Storage Solutions
- **Database**: PostgreSQL 16 with Drizzle ORM
- **Connection**: Neon Database serverless driver (@neondatabase/serverless)
- **Schema Management**: Drizzle Kit for migrations and schema management
- **Development Storage**: In-memory storage implementation for development/testing

### Database Schema
The application uses two main tables:
- **users**: Stores user authentication data (id, username, password)
- **user_progress**: Tracks learning progress (completed lessons, lesson scores as JSONB)

## Key Components

### Learning System
- **Lesson Structure**: Each lesson contains flashcards and a quiz
- **Flashcards**: Interactive Q&A cards with flip animation
- **Quizzes**: Multiple choice questions with explanations
- **Progress Tracking**: Completion status and scoring for each lesson

### AI Assistant
- **Integration**: OpenAI API for aviation-specific question answering
- **Interface**: Chat-like interface for student questions
- **Sample Questions**: Pre-loaded aviation topics for quick access

### User Interface
- **Responsive Design**: Mobile-first approach with adaptive sidebar
- **Navigation**: Section-based navigation (Home, Lessons, AI Assistant)
- **Progress Visualization**: Progress bars and completion indicators
- **Theming**: Aviation-inspired color scheme with light/dark mode support

## Data Flow

1. **User Authentication**: Currently simplified, stores users in database
2. **Lesson Access**: Static lesson data served from frontend with progress tracking
3. **Progress Updates**: Real-time progress synchronization with backend API
4. **AI Queries**: Direct integration with OpenAI API through backend proxy
5. **State Management**: React Query handles caching and synchronization

## External Dependencies

### Core Dependencies
- **@neondatabase/serverless**: Database connectivity
- **drizzle-orm & drizzle-kit**: ORM and schema management
- **@tanstack/react-query**: Server state management
- **openai**: AI assistant functionality
- **@radix-ui/***: UI component primitives
- **tailwindcss**: Utility-first CSS framework

### Development Dependencies
- **tsx**: TypeScript execution for development
- **esbuild**: Fast bundling for production
- **vite**: Frontend build tool and dev server

## Deployment Strategy

### Development Environment
- **Platform**: Replit with Node.js 20 runtime
- **Database**: PostgreSQL 16 module
- **Port Configuration**: Internal port 5000, external port 80
- **Hot Reload**: Vite HMR for frontend, tsx watch for backend

### Production Build
1. Frontend build using Vite (outputs to dist/public)
2. Backend bundling using esbuild (outputs to dist/index.js)
3. Static file serving from Express
4. Environment variable configuration for database and API keys

### Replit Configuration
- **Modules**: nodejs-20, web, postgresql-16
- **Run Command**: `npm run dev` for development
- **Build Command**: `npm run build` for production
- **Start Command**: `npm run start` for production server

## Changelog

```
Changelog:
- June 24, 2025. Initial setup with full PilotPal aviation learning platform
- June 24, 2025. Integrated OpenAI GPT-4o for AI assistant functionality
```

## User Preferences

```
Preferred communication style: Simple, everyday language.
```