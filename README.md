# Easy Charge Pro

A modern, AI-powered invoice management application that helps businesses create professional invoices quickly and efficiently. Generate invoices from natural language descriptions using advanced AI technology.

## Features

- **AI-Powered Invoice Generation** - Create invoices from simple text descriptions
- **Multiple Professional Templates** - Choose from modern, corporate, creative, and minimal designs
- **Client Management** - Organize and manage your client database
- **Multi-Currency Support** - Work with any currency worldwide
- **Advanced Calculations** - Automatic tax, discount, and total calculations
- **Responsive Design** - Works perfectly on desktop, tablet, and mobile
- **Secure Authentication** - Built-in user authentication and data protection
- **PDF Export** - Generate professional PDF invoices
- **International Support** - Multi-currency support

## Tech Stack

- **Frontend**: React 18 + TypeScript + Vite
- **UI Framework**: shadcn/ui + Tailwind CSS
- **Backend**: Supabase (PostgreSQL + Auth + Storage)
- **AI**: OpenAI GPT-4/3.5 Turbo
- **PDF Generation**: jsPDF + html2canvas
- **State Management**: React Context + Custom Hooks

##Quick Start

### Prerequisites

- **Node.js** (version 18 or higher)
- **npm** or **yarn** package manager
- **Supabase account** and project
- **OpenAI API key**

### Installation

1. **Clone the repository**:

```bash
git clone <repository-url>
cd simple invoicing
```

2. **Install dependencies**:

```bash
npm install
```

3. **Install additional packages**:

```bash
npm install openai
```

### Environment Configuration

1. **Create environment file**:

```bash
touch .env.local
```

2. **Add your configuration** to `.env.local`:

```env
# Supabase Configuration
VITE_SUPABASE_URL=your_supabase_project_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key

# OpenAI Configuration
VITE_OPENAI_API_KEY=your_openai_api_key_here
VITE_OPENAI_MODEL=gpt-4o-mini
```

### Getting API Keys

#### Supabase Setup

1. Visit [Supabase Dashboard](https://supabase.com/dashboard)
2. Create a new project or select existing one
3. Go to **Settings** → **API**
4. Copy the **Project URL** and **anon/public key**
5. Paste them in your `.env.local` file

#### OpenAI Setup

1. Visit [OpenAI Platform](https://platform.openai.com/)
2. Sign up or log in to your account
3. Navigate to **API Keys** section
4. Create a new API key
5. Copy the key and paste it in your `.env.local` file

> ⚠️ **Security Note**: This application uses OpenAI API directly in the browser, which exposes your API key to users. For production use, implement a backend proxy to keep your API key secure.

### AI Model Options

Choose from different OpenAI models based on your needs:

| Model                        | Cost (per 1K tokens)            | Best For                     | Capability               |
| ---------------------------- | ------------------------------- | ---------------------------- | ------------------------ |
| **gpt-4o-mini** ⭐ (default) | $0.00015 input / $0.0006 output | Cost-effective, high quality | Most recommended         |
| **gpt-3.5-turbo-1106**       | $0.001                          | Budget-friendly              | Good quality, lower cost |
| **gpt-3.5-turbo**            | $0.002                          | Standard use                 | Reliable performance     |
| **gpt-4o**                   | $0.005 input / $0.015 output    | Complex tasks                | Highest capability       |

## Running the Application

### Development Mode

```bash
npm run dev
```

Open your browser and navigate to `http://localhost:5173`

### Production Build

```bash
npm run build
```

### Preview Production Build

```bash
npm run preview
```

## Usage Guide

### Creating Your First Invoice

1. **Sign up** for a new account or sign in
2. **Set up your profile** with business information
3. **Add clients** to your client database
4. **Create an invoice** using one of these methods:
   - **AI Generation**: Describe your services in natural language
   - **Manual Entry**: Fill out the invoice form manually
5. **Choose a template** that matches your brand
6. **Preview and export** as PDF

### AI Invoice Generation Examples

Try these prompts to generate invoices:

- _"Create an invoice for web development services for TechStart Inc, 40 hours at $150/hour, due in 30 days, 10% tax"_
- _"Invoice for consulting services, 25 hours at $200/hour, 5% discount, BWP currency"_
- _"Monthly retainer for marketing services, $2500, recurring monthly"_

## Development

### Project Structure

```
src/
├── components/          # Reusable UI components
├── pages/              # Application pages
├── services/           # API services and business logic
├── controllers/        # Request controllers
├── hooks/              # Custom React hooks
├── types/              # TypeScript type definitions
├── utils/              # Utility functions
└── lib/                # External library configurations
```
