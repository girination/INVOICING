# Easy Charge Pro

A modern invoice management application built with React, TypeScript, and AI-powered invoice generation.

## What technologies are used for this project?

This project is built with:

- Vite
- TypeScript
- React
- shadcn-ui
- Tailwind CSS
- Supabase
- OpenAI API

## Getting Started

### Prerequisites

- Node.js (version 16 or higher)
- npm or yarn
- OpenAI API key

### Installation

1. Install dependencies:

```bash
npm install
```

3. Install the OpenAI package:

```bash
npm install openai
```

### Environment Setup

1. Create a `.env.local` file in the root directory:

```bash
touch .env.local
```

2. Add the following environment variables to `.env.local`:

```env
# OpenAI Configuration
VITE_OPENAI_API_KEY=your_openai_api_key_here
VITE_OPENAI_MODEL=gpt-4o-mini
```

3. Get your OpenAI API key:
   - Visit [OpenAI Platform](https://platform.openai.com/)
   - Sign up or log in to your account
   - Navigate to API Keys section
   - Create a new API key
   - Copy the key and paste it in your `.env.local` file

⚠️ **Security Warning**: This application uses the OpenAI API directly in the browser. This exposes your API key to users. For production use, consider implementing a backend proxy to keep your API key secure.

### Available OpenAI Models

The application supports different OpenAI models with varying costs and capabilities:

- **gpt-4o-mini** (default, recommended): Most cost-effective GPT-4 model (~$0.00015/1K tokens input, ~$0.0006/1K tokens output)
- **gpt-3.5-turbo-1106**: Latest 3.5 turbo, most cost-effective (~$0.001/1K tokens)
- **gpt-3.5-turbo**: Standard 3.5 turbo (~$0.002/1K tokens)
- **gpt-4o**: Most capable but expensive (~$0.005/1K tokens input, ~$0.015/1K tokens output)

### Running the Application

1. Start the development server:

```bash
npm run dev
```

2. Open your browser and navigate to `http://localhost:5173`

### Building for Production

```bash
npm run build
```

## Features

- AI-powered invoice generation from natural language descriptions
- Multiple invoice templates
- Client management
- PDF generation
- Modern, responsive UI
- Supabase integration for data persistence
