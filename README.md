# StoryApp 🚀

AI-powered document generator with PDF processing, template generation, and collaborative editing.

## Features

- **PDF Text Extraction**: Server-side PDF processing using PyMuPDF
- **AI Template Generation**: OpenAI-powered presentation and content generation  
- **Real-time Collaboration**: Built for team workflows
- **Scalable Architecture**: Ready for deployment on Vercel

## Quick Start

```bash
npm install
npm run dev
```

This runs both the Vite frontend (port 5175) and Express API server (port 3001) concurrently.

## Tech Stack

- **Frontend**: React, Vite, Tailwind CSS
- **Backend**: Express.js, PyMuPDF via Python subprocess
- **Database**: Supabase
- **AI**: OpenAI GPT integration
- **Deployment Ready**: Vercel-compatible

## API Endpoints

- `GET /api/health` - Health check
- `POST /api/extract-pdf` - PDF text extraction

## Requirements

- Node.js 18+
- Python 3 with PyMuPDF (`pip install PyMuPDF`)

## Environment Setup

```bash
cp .env.example .env
# Fill in your credentials:
# VITE_SUPABASE_URL=your_supabase_project_url
# VITE_SUPABASE_ANON_KEY=your_supabase_anon_key  
# OPENAI_API_KEY=your_openai_api_key
```
