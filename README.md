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

- **Frontend**: Next.js 15 with App Router, TypeScript, Tailwind CSS
- **Backend**: Next.js API routes, Prisma ORM
- **Database**: SQLite
- **AI**: OpenAI GPT-3.5-turbo with JSON mode

## Next Steps

- Form editing after creation
- Submission viewing interface
