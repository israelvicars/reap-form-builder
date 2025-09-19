# Reap Multi-Form Builder

Build custom forms with AI assistance. Admin creates forms, users submit via public links.

## Quick Start

```bash
npm install
cp .env.example .env
# Add your OpenAI API key to .env
npx prisma db push
npm run dev
```

Login with `admin` / `password123`

## Features

- **Admin Authentication**: Simple login with hardcoded credentials
- **Form Builder**: Create forms with up to 2 sections and 3 fields per section
- **AI Integration**: Generate form suggestions using OpenAI
- **Public Forms**: Each form gets a unique public URL for submissions

## Tech Stack

- **Frontend**: Next.js 15 with App Router, TypeScript, Tailwind CSS 4
- **Backend**: Next.js Server Actions, Prisma ORM
- **Database**: SQLite with Prisma schema
- **AI**: OpenAI GPT-4o-mini with Zod schema validation
- **Validation**: Zod for API interfaces and type safety
