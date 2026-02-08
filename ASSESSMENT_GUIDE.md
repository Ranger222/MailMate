# MailMate Assessment Guide

**For Assessment Reviewers**

This guide will help you evaluate the MailMate AI-controlled email client application.

---

## Quick Start

You have **two ways** to test this application:

1. **Google Login** - Full features with real Gmail integration
2. **Mock Data Mode** - Demo without Google account required

---

## Option 1: Google Login (Recommended - Full Features)

### Important: "Unverified App" Warning

When you click "Sign in with Google," you will see a warning:

> **"Google hasn't verified this app"**

**This is expected and safe.** The app is unverified because:
- It's a development/assessment project
- Google verification requires a formal review process
- The app only requests read/send email permissions

### How to Proceed:

1. Click **"Continue with Google"** on the welcome screen
2. You'll see Google's warning screen
3. Click **"Advanced"** (bottom left)
4. Click **"Go to MailMate (unsafe)"**
5. Review the permissions and click **"Continue"**

### IMPORTANT: After Login

**Please wait 5-10 seconds after logging in for emails to load.**

The app needs to:
1. Initialize the session
2. Fetch your emails from Gmail API
3. Sync inbox and sent folders

You'll see a loading state, then emails will appear. If the screen stays blank:
- Wait a few more seconds
- Click "Refresh" button (top right)
- Or navigate to "Sent" and back to "Inbox"

### What You Can Test:

- View your real inbox and sent emails
- Send actual emails
- Use AI to manage emails with natural language
- Search and filter your emails
- View email threads/conversations
- Compose and reply to emails

---

## Option 2: Mock Data Mode (No Login Required)

If you prefer not to use your Google account, click **"Try with demo data"** on the welcome screen.

### What Works in Mock Mode:

- UI/UX and Gmail-like interface
- AI Assistant with real LLM (Mistral/Gemini)
- Email filtering and search
- Compose and draft emails (won't actually send)
- Thread/conversation view
- All UI interactions

### Limitations:

- Uses sample emails only
- Cannot send real emails
- Cannot access real Gmail data
- Mock data resets on page refresh

**Note:** The AI functionality is REAL even in mock mode - only the emails are mocked.

---

## Setup Instructions

### Prerequisites

- Node.js 18 or higher
- npm
- Mistral or Gemini API key

### Installation

```bash
# Clone repository
git clone https://github.com/Ranger222/MailMate.git
cd MailMate

# Install dependencies
npm install

# Copy environment template
cp .env.example .env.local
# Edit .env.local with your API keys (see below)

# Start development server
npm run dev
```

Open http://localhost:3000

### Environment Variables

Edit `.env.local`:

```env
# Required: LLM Provider (choose one)
LLM_PROVIDER=mistral

# Mistral API Key (https://console.mistral.ai/)
MISTRAL_API_KEY=your_mistral_key_here

# OR Gemini API Key (https://aistudio.google.com/apikey)
# LLM_PROVIDER=gemini
# GEMINI_API_KEY=your_gemini_key_here

# Optional: For Google Login
GOOGLE_CLIENT_ID=your_client_id
GOOGLE_CLIENT_SECRET=your_client_secret
AUTH_SECRET=your_random_secret
AUTH_URL=http://localhost:3000
```

**Getting API Keys:**
- **Mistral**: Visit https://console.mistral.ai/ (Free tier available)
- **Gemini**: Visit https://aistudio.google.com/apikey (Free tier available)

---

## Testing the AI Assistant

Click the **AI Assistant** button (blue icon, bottom-right) and try these commands:

| Command | Expected Result |
|---------|----------------|
| `Show me unread emails` | Filters inbox to unread only |
| `Compose email to test@example.com about meeting` | Opens compose with prefilled fields |
| `Find emails from last week` | Searches emails from past 7 days |
| `View conversation` | Shows email thread |
| `Reply saying thanks for the update` | Opens reply with prefilled message |
| `Go to sent` | Navigates to sent folder |
| `Clear filters` | Removes all active filters |

The AI will respond with natural language and execute the appropriate action.

---

## Features to Evaluate

### Core Features
- Gmail OAuth integration or Mock data mode
- AI-controlled UI via natural language
- Email list with Gmail-like interface
- Email detail view
- Compose and send emails
- Search functionality
- Filter by unread/sender/date

### Bonus Features
- Email threading/conversation view
- Unit tests (40 tests passing)
- Real-time sync (30-second polling)
- Professional UI design
- Mock data mode for easy testing

---

## Running Tests

```bash
# Run all tests
npm test

# Run with coverage
npm run test:coverage
```

**Expected Output:**
```
Test Suites: 3 passed, 3 total
Tests:       40 passed, 40 total
```

Tests cover:
- AI action types and validation (12 tests)
- UI store state management (17 tests)
- Mail store operations (11 tests)

---

## Architecture Overview

**AI-Controlled UI Pattern:**
```
User Input → LLM (Mistral/Gemini) → Structured Action → UI Update
```

The LLM never touches the UI directly. It outputs structured JSON actions that are executed by a deterministic dispatcher.

**Tech Stack:**
- Next.js 16 with App Router
- NextAuth.js for Google OAuth
- Gmail API for email operations
- Mistral AI or Google Gemini for LLM
- Zustand for state management
- Jest + React Testing Library for tests

---

## Troubleshooting

### "Blank screen after login"
**Solution:** Wait 5-10 seconds for emails to load. The app needs to:
1. Initialize the session
2. Fetch emails from Gmail API
3. Sync data

If still blank after 10 seconds:
- Click the refresh button (top right)
- Navigate to "Sent" and back to "Inbox"
- Check browser console for errors

### "AI not responding"
**Solution:**
- Verify `MISTRAL_API_KEY` or `GEMINI_API_KEY` is correct
- Check `LLM_PROVIDER` matches your chosen provider
- Ensure you have internet connection

### "Google OAuth error"
**Solution:**
- Make sure you clicked "Advanced" → "Go to MailMate (unsafe)"
- Verify `GOOGLE_CLIENT_ID` and `GOOGLE_CLIENT_SECRET` in `.env.local`
- Check that Gmail API is enabled in Google Cloud Console

### "Want to test without Google login"
**Solution:**
- Click "Try with demo data" on the welcome screen
- Or add `?mock=true` to the URL
- Or set `NEXT_PUBLIC_FORCE_MOCK_DATA=true` in `.env.local`

---

## Assessment Criteria

This project demonstrates:

### 1. Full-Stack Development
- Next.js App Router with server components
- API routes for backend logic
- Server-side authentication with NextAuth

### 2. AI Integration
- LLM prompt engineering for structured outputs
- Action-based UI control (not just chat)
- Context-aware AI assistant

### 3. External API Integration
- Gmail API with OAuth 2.0
- Real-time data synchronization
- Error handling and fallbacks

### 4. State Management
- Zustand stores for UI and data
- Optimistic updates
- Context awareness for AI

### 5. Testing
- Unit tests with Jest
- Integration tests
- 100% test pass rate (40/40 tests)

### 6. UI/UX Design
- Gmail-inspired professional interface
- Responsive design
- Clean, minimal aesthetics
- Hover effects and animations

---

## Important Notes

1. **Email Loading Time**: After Google login, please wait 5-10 seconds for emails to load from Gmail API.

2. **Mock Mode**: The "Try with demo data" option uses sample emails but REAL AI functionality.

3. **Unverified App Warning**: This is expected for development projects. The app is safe and only requests email permissions.

4. **API Keys Required**: You need either a Mistral or Gemini API key to test AI features.

5. **Tests**: Run `npm test` to verify all 40 tests pass.

---

## Contact & Resources

- **GitHub Repository**: https://github.com/Ranger222/MailMate
- **README**: Detailed setup and usage instructions
- **Code Comments**: Implementation details throughout codebase

**Thank you for reviewing MailMate!**
