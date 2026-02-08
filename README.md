# MailMate — AI-Controlled Email Client

An intelligent email application where an AI assistant controls the UI through natural language commands. Built with Next.js, Gmail API, and Mistral/Gemini LLM.

**[Live Demo](https://mailmate-8guh.onrender.com/)** | [Assessment Guide](./ASSESSMENT_GUIDE.md) | [GitHub](https://github.com/Ranger222/MailMate)

## Features

- **Gmail Integration** — Real email access via Google OAuth
- **AI Assistant** — Natural language email management powered by Mistral or Gemini
- **Email Threading** — View conversations with expand/collapse functionality
- **Gmail-like UI** — Clean, professional interface with hover effects
- **Real-time Sync** — Auto-refreshes inbox every 30 seconds
- **Smart Compose** — AI can draft emails based on your instructions
- **Search & Filter** — Find emails by sender, date, or unread status

## Quick Start

```bash
# Clone the repository
git clone https://github.com/Ranger222/MailMate.git
cd MailMate

# Install dependencies
npm install

# Set up environment variables (see below)
cp .env.example .env.local
# Edit .env.local with your API keys

# Run development server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) and sign in with Google.

## Prerequisites

- **Node.js 18+** and npm
- **Google Cloud Console account** (for Gmail API)
- **Mistral API key** OR **Gemini API key**

## Environment Setup

Create a `.env.local` file in the root directory:

```env
# LLM Provider (choose: "mistral" or "gemini")
LLM_PROVIDER=mistral

# Mistral API Key (https://console.mistral.ai/)
MISTRAL_API_KEY=your_mistral_api_key_here

# Gemini API Key (https://aistudio.google.com/apikey)
GEMINI_API_KEY=your_gemini_api_key_here

# Google OAuth Credentials
GOOGLE_CLIENT_ID=your_google_client_id
GOOGLE_CLIENT_SECRET=your_google_client_secret

# NextAuth Secret (generate with: openssl rand -base64 32)
AUTH_SECRET=your_random_secret_here
AUTH_URL=http://localhost:3000
```

### Getting API Keys

#### 1. Mistral or Gemini API Key

**Mistral (Recommended):**
1. Visit [console.mistral.ai](https://console.mistral.ai/)
2. Create account and generate API key
3. Add to `MISTRAL_API_KEY` in `.env.local`

**Gemini (Alternative):**
1. Visit [aistudio.google.com/apikey](https://aistudio.google.com/apikey)
2. Create API key
3. Add to `GEMINI_API_KEY` in `.env.local`

#### 2. Google OAuth Credentials

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project (or select existing)
3. **Enable Gmail API:**
   - Navigate to "APIs & Services" → "Library"
   - Search for "Gmail API" and click "Enable"
4. **Create OAuth Credentials:**
   - Go to "Credentials" → "Create Credentials" → "OAuth Client ID"
   - Choose "Web application"
   - **Authorized JavaScript origins:** `http://localhost:3000`
   - **Authorized redirect URIs:** `http://localhost:3000/api/auth/callback/google`
   - Click "Create"
5. Copy the **Client ID** and **Client Secret** to `.env.local`

#### 3. Generate AUTH_SECRET

Run in terminal:
```bash
openssl rand -base64 32
```
Copy the output to `AUTH_SECRET` in `.env.local`

## Running the Application

```bash
# Development mode
npm run dev

# Production build
npm run build
npm start

# Run tests
npm test

# Run tests with coverage
npm run test:coverage
```

## Using the AI Assistant

Click the AI Assistant button (bottom-right) and try these commands:

| Command | Action |
|---------|--------|
| `Show me unread emails` | Filters inbox to unread only |
| `Compose email to john@example.com about meeting` | Opens compose with prefilled fields |
| `Reply saying thanks for the update` | Creates reply to current email |
| `Find emails from last week` | Searches emails from past 7 days |
| `View conversation` | Shows email thread with all replies |
| `Go to sent` | Navigates to sent folder |
| `Clear filters` | Removes all active filters |

## Project Structure

```
/src
├── /app
│   ├── /api
│   │   ├── /ai/interpret     # LLM intent interpretation
│   │   ├── /auth             # NextAuth OAuth routes
│   │   └── /mail             # Gmail API endpoints (inbox, sent, search, thread)
│   ├── layout.tsx
│   └── page.tsx
│
├── /components
│   ├── MailLayout.tsx        # Main layout with sidebar
│   ├── InboxList.tsx         # Email list with filters
│   ├── EmailDetail.tsx       # Single email view
│   ├── ThreadView.tsx        # Conversation/thread view
│   ├── ComposeModal.tsx      # Email composition
│   ├── AssistantPanel.tsx    # AI chat interface
│   └── AuthButton.tsx        # Google sign-in
│
├── /lib
│   ├── auth.ts               # NextAuth configuration
│   ├── gmail-api.ts          # Gmail API wrapper
│   ├── mistral.ts            # Mistral LLM client
│   └── gemini.ts             # Gemini LLM client
│
├── /store
│   ├── uiStore.ts            # UI state (Zustand)
│   └── mailStore.ts          # Email data (Zustand)
│
├── /ai
│   ├── prompt.ts             # System prompt for LLM
│   ├── actions.ts            # AI action type definitions
│   └── dispatcher.ts         # Action executor
│
└── /types
    ├── mail.ts               # Email, Draft types
    └── actions.ts            # AIAction types
```

## Tech Stack

- **Framework:** Next.js 16 with Turbopack
- **Authentication:** NextAuth.js v5 with Google OAuth
- **LLM:** Mistral AI or Google Gemini
- **Email API:** Gmail API (googleapis)
- **State Management:** Zustand
- **UI Icons:** Lucide React
- **Styling:** Inline styles (Gmail-inspired)
- **Testing:** Jest + React Testing Library

## Testing

The project includes comprehensive unit tests:

```bash
# Run all tests
npm test

# Run with coverage
npm run test:coverage
```

**Test Coverage:**
- ✅ 12 tests for AI action validation
- ✅ 17 tests for UI store state management
- ✅ 11 tests for mail store operations
- **Total: 40 tests passing**

## Deployment

### Deploy to Render

1. Push code to GitHub
2. Create new Web Service on [Render](https://render.com)
3. Connect your GitHub repository
4. Configure:
   - **Build Command:** `npm install && npm run build`
   - **Start Command:** `npm start`
5. Add environment variables (same as `.env.local`)
6. Update Google OAuth redirect URIs with your Render URL

See [render_deployment_guide.md](./render_deployment_guide.md) for detailed instructions.

## Troubleshooting

**Blank screen after login:**
- Wait 2-3 seconds for session to initialize
- Refresh the page if emails don't appear

**AI not responding:**
- Check `MISTRAL_API_KEY` or `GEMINI_API_KEY` is correct
- Verify `LLM_PROVIDER` matches your chosen provider

**Gmail API errors:**
- Ensure Gmail API is enabled in Google Cloud Console
- Check OAuth redirect URIs match exactly
- Verify `GOOGLE_CLIENT_ID` and `GOOGLE_CLIENT_SECRET`

