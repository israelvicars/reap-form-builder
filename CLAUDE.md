# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

### Development
- `npm run dev` - Start development server with Turbopack
- `npm run build` - Build production version with Turbopack
- `npm run lint` - Run ESLint (enforces no-semicolon rule)

### Database
- `npx prisma db push` - Apply schema changes to SQLite database
- `npx prisma studio` - Open Prisma Studio for data inspection

## Architecture Overview

This is a **Next.js 15 form builder application** that allows admins to create forms (with optional AI assistance) and users to submit responses via public links.

### Core Structure

**App Router Layout:**
- `/app/actions/` - Server actions for all business logic (forms, auth, AI, submissions)
- `/app/admin/` - Protected admin routes (dashboard, create, edit, submissions view)
- `/app/form/[id]/` - Public form submission pages
- `/components/` - React components (FormEditor, FormRenderer, FormsTable, SubmissionsTable)
- `/types/form.ts` - Complete TypeScript definitions

**Data Model (Prisma/SQLite):**
```
Form → Section → Field
Form → Submission (JSON data storage)
```

### Key Architectural Patterns

**Server Actions Pattern:** All business logic uses Next.js server actions:
- `createForm()`, `updateForm()`, `getForm()`, `deleteForm()` in `/app/actions/forms.ts`
- `submitForm()`, `getFormSubmissions()` in `/app/actions/submissions.ts`
- `generateFormWithAI()` in `/app/actions/ai.ts`
- `checkAdmin()` in `/app/actions/auth.ts`

**Authentication:** Simple cookie-based admin auth (`isAdmin` cookie) with hardcoded credentials (admin/password123). Use `checkAdmin()` to protect routes.

**Business Rules:**
- Maximum 2 sections per form
- Maximum 3 fields per section
- Only 'text' and 'number' field types
- Validation enforced at UI and server levels

### AI Integration

Uses OpenAI GPT-4o-mini with structured JSON responses via Zod schemas for complete form generation. Set `OPENAI_API_KEY` in environment. The AI generates title, description, sections, and fields based on user prompts using the `FormGenerationSchema` validation.

### Component Architecture

**FormEditor.tsx** - Complex form builder with section/field management, AI generation, title/description editing, and support for both create and edit modes
**FormRenderer.tsx** - Public form display with submission handling
**FormsTable.tsx** - Admin dashboard table with form titles, edit/delete actions, and links to submissions

### Database Schema & Type System

All models use UUID primary keys. Forms have title/description, contain sections with fields, and submissions store JSON data. Use Prisma client via `/lib/prisma.ts`.

**Type Architecture:** Prisma schema types serve as the source of truth, extended by TypeScript interfaces in `/types/form.ts` and validated by Zod schemas in `/lib/schemas.ts` for external API interactions (especially AI generation). This layered approach ensures type safety from database to API boundaries.

### Environment Setup

Copy `.env.example` to `.env` and configure:
- `DATABASE_URL` for SQLite connection
- `OPENAI_API_KEY` for AI functionality

### Code Style

- TypeScript with strict mode
- Tailwind CSS 4 for styling
- ESLint enforces no-semicolon rule
- Server components by default, 'use client' when needed