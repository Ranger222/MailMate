# MailMate — AI-Controlled Email Client

An intelligent email application where an AI assistant controls the UI through natural language commands. Built with Next.js, Gmail API, and Mistral/Gemini LLM.

## Features

- **Gmail Integration** — Real email access via Google OAuth
- **AI Assistant** — Natural language email management powered by Mistral or Gemini
- **Gmail-like UI** — Clean, professional interface with hover effects
- **Real-time Sync** — Auto-refreshes inbox every 30 seconds
- **Smart Compose** — AI can draft emails based on your instructions

## Prerequisites

- Node.js 18+ 
- npm or yarn
- Google Cloud Console account (for Gmail API)
- Mistral API key or Gemini API key

## Installation

```bash
# Clone the repository
git clone https://github.com/Ranger222/MailMate.git
cd MailMate

# Install dependencies
npm install

# Create environment file
cp .env.example .env.local
# Edit .env.local with your credentials (see below)

# Start development server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

## Environment Variables

Create a `.env.local` file in the root directory:

```env
# LLM Provider (choose one: "mistral" or "gemini")
LLM_PROVIDER=mistral

# Mistral API Key (get from https://console.mistral.ai/)
MISTRAL_API_KEY=your_mistral_api_key_here

# Gemini API Key (get from https://aistudio.google.com/apikey)
GEMINI_API_KEY=your_gemini_api_key_here

# Google OAuth (get from Google Cloud Console)
GOOGLE_CLIENT_ID=your_google_client_id
GOOGLE_CLIENT_SECRET=your_google_client_secret

# NextAuth Configuration
AUTH_SECRET=generate_a_random_secret_here
AUTH_URL=http://localhost:3000
```

### Getting API Keys

1. **Mistral API Key**: Visit [console.mistral.ai](https://console.mistral.ai/), create an account, and generate an API key.

2. **Gemini API Key**: Visit [aistudio.google.com/apikey](https://aistudio.google.com/apikey) and create an API key.

3. **Google OAuth Credentials**:
   - Go to [Google Cloud Console](https://console.cloud.google.com/)
   - Create a new project or select existing
   - Enable Gmail API
   - Go to Credentials > Create Credentials > OAuth Client ID
   - Set Application Type to "Web application"
   - Add `http://localhost:3000` to Authorized JavaScript origins
   - Add `http://localhost:3000/api/auth/callback/google` to Authorized redirect URIs
   - Copy Client ID and Client Secret

4. **AUTH_SECRET**: Generate with `openssl rand -base64 32`

## Usage

### Sign In
Click "Sign in with Google" to connect your Gmail account.

### AI Commands
Use the AI Assistant panel (bottom-right) with commands like:

| Command | Action |
|---------|--------|
| "Show me unread emails" | Filters inbox to unread only |
| "Compose email to john@example.com about the meeting" | Opens compose with prefilled content |
| "Reply saying thanks for the update" | Creates reply to current email |
| "Find emails from last week" | Searches recent emails |
| "Go to sent" | Navigates to sent folder |

## Project Structure

```
/src
├── /app
│   ├── /api
│   │   ├── /ai/interpret     # LLM intent endpoint
│   │   ├── /auth             # NextAuth routes
│   │   └── /mail             # Gmail API endpoints
│   └── page.tsx
│
├── /components
│   ├── MailLayout.tsx        # Main layout
│   ├── InboxList.tsx         # Email list
│   ├── EmailDetail.tsx       # Email view
│   ├── ComposeModal.tsx      # Compose window
│   └── AssistantPanel.tsx    # AI chat
│
├── /lib
│   ├── auth.ts               # NextAuth config
│   ├── gmail-api.ts          # Gmail API wrapper
│   ├── mistral.ts            # Mistral LLM client
│   └── gemini.ts             # Gemini LLM client
│
├── /store
│   ├── uiStore.ts            # UI state
│   └── mailStore.ts          # Email data
│
└── /ai
    ├── prompt.ts             # System prompt
    ├── actions.ts            # Action definitions
    └── dispatcher.ts         # Action executor
```

## Tech Stack

- **Framework**: Next.js 16 with Turbopack
- **Auth**: NextAuth.js with Google OAuth
- **LLM**: Mistral AI or Google Gemini
- **Email**: Gmail API
- **State**: Zustand
- **Icons**: Lucide React
- **Styling**: Inline styles (Gmail-inspired)

## License

MIT
