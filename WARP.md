# WARP.md

This file provides guidance to WARP (warp.dev) when working with code in this repository.

## Common Development Commands

### Development Server
```bash
npm run dev
```
Starts the Next.js development server with Turbopack for faster builds. Server runs on http://localhost:3000.

### Build and Production
```bash
npm run build  # Production build
npm start      # Start production server
npm run lint   # Run ESLint
```

### Environment Setup
- Copy `.env.local` with required MongoDB URI and OAuth credentials
- MongoDB connection string required in `MONGO_URI`
- GitHub OAuth: `AUTH_GITHUB_ID`, `AUTH_GITHUB_SECRET`
- Google OAuth: `AUTH_GOOGLE_ID`, `AUTH_GOOGLE_SECRET`

## High-Level Architecture

DevFlow 2.0 is a Stack Overflow-like Q&A platform built with Next.js 15 using the App Router pattern.

### Core Architecture Layers

**Frontend Layer (`app/` directory):**
- `(root)/` - Main app routes (questions, profile, community, etc.)
- `(auth)/` - Authentication routes (sign-in, sign-up)
- `api/` - API routes for external integrations
- Uses Next.js App Router with route groups

**Business Logic (`lib/` directory):**
- `actions/` - Server actions for data mutations (question.action.ts, user.action.ts, etc.)
- `handlers/` - Error handling and response utilities
- `mongoose.ts` - MongoDB connection with caching
- `api.ts` - Internal API client for server-side calls

**Data Layer (`database/` directory):**
- Mongoose models: User, Question, Answer, Tag, Vote, Collection, etc.
- `index.ts` - Centralized model exports
- MongoDB with connection pooling

**Authentication:**
- NextAuth.js v5 with GitHub, Google, and Credentials providers
- Custom OAuth sign-in flow in `auth.ts`
- Session management with JWT tokens

### Key Patterns

1. **Server Actions**: Database operations use server actions in `lib/actions/` rather than API routes
2. **Centralized Models**: All Mongoose models exported from `database/index.ts`
3. **Action Response Pattern**: Consistent error handling via `lib/handlers/`
4. **MongoDB Caching**: Connection caching in `lib/mongoose.ts` for serverless optimization

### Component Structure
- `components/` - Reusable UI components with Radix UI primitives
- `constants/` - Application constants (routes, sidebar links, states)
- Tailwind CSS for styling with custom configuration

### Notable Technologies
- Next.js 15 with Turbopack
- MongoDB with Mongoose ODM  
- NextAuth.js v5 for authentication
- Radix UI for accessible components
- AI SDK for answer generation features
- MDX Editor for rich text editing